#!/usr/bin/env node
// Sceglie, fra i domini che hanno risposto, quale entra come sito ufficiale e
// quale come portale editoriale.
//
// Le regole sono scritte qui e non applicate a mano su duecento righe, così
// chiunque può contestarle guardando il codice invece che fidandosi.

import { readFile, writeFile } from "node:fs/promises";

// Un dominio parcheggiato risponde 200 e non è un sito: va tolto prima di
// qualunque altra valutazione, altrimenti inquina tutto quello che segue.
const PARKED = [
  /domain default page/i,
  /domaindirect/i,
  /dominio registrato/i,
  /domain (?:for sale|parking)/i,
  /this domain (?:is|may be) for sale/i,
  /^\s*$/,
];

// Il dominio di un comune, di un ente parco o di un consorzio turistico è per
// definizione il soggetto con mandato: non serve altra prova.
const STRUCTURAL_PUBLIC = [
  /^comune\./i,
  /^turismo\.comune\./i,
  /\.gov\.it$/i,
  /^parco/i,
  /parconazionale\d?/i,
  /^consorzio/i,
  /\.beniculturali\.it$/i,
  /^pngp\.it$/i,
  /^fondazione/i,
  /^sacrimonti\./i,
  /\.bz\.it$/i,
  /^pompeiisites\.org$/i,
];

// "Ufficiale" nel titolo, in tutte le forme in cui i siti turistici italiani lo
// scrivono davvero: portale ufficiale, sito turistico ufficiale, official
// tourism site. La prima versione cercava solo "sito ufficiale" e faceva
// cadere Roma, Venezia, Livigno e Pompei, cioè proprio i casi noti.
const OFFICIAL_CLAIM =
  /(?:sito|portale|guida|website|site|portal)[^.|]{0,24}ufficial|ufficial[ei][^.|]{0,20}(?:sito|portale|turismo)|official[^.|]{0,20}(?:site|portal|website|tourism)|tourist board|azienda di soggiorno/i;

const isParked = (row) => PARKED.some((re) => re.test(row.title ?? ""));
const isStructuralPublic = (row) => STRUCTURAL_PUBLIC.some((re) => re.test(row.domain));

function classify(row) {
  if (row.status !== "ok") return { verdict: "scartato", why: row.note ?? row.status };
  if (isParked(row)) return { verdict: "scartato", why: "dominio parcheggiato" };
  if (!row.title) return { verdict: "scartato", why: "nessun contenuto leggibile" };

  // Un redirect verso un altro dominio significa che il soggetto ha traslocato:
  // il dominio in lista non è più il suo, e va ricontrollato a mano.
  if (row.landed && !row.landed.endsWith(row.domain) && !row.domain.endsWith(row.landed)) {
    return { verdict: "scartato", why: `redirige su ${row.landed}` };
  }

  if (isStructuralPublic(row)) {
    return { verdict: "dmo", why: "dominio istituzionale" };
  }

  // Il titolo dichiara di essere il sito ufficiale del posto. Da solo non
  // basterebbe, ma su un dominio che risponde e ha contenuto è la prova che i
  // siti turistici pubblici usano davvero.
  const declaresOfficial = OFFICIAL_CLAIM.test(row.title ?? "") || row.claimsOfficial;
  // Pubblico dichiarato senza forma societaria privata: è un ente.
  if (row.kind === "public") {
    return { verdict: "dmo", why: `dichiara "${row.publicEvidence}"` };
  }
  // Pubblico e privato insieme: succede alle società in house. Vale come
  // ufficiale solo se il sito si dichiara tale, altrimenti è un portale che
  // ha un indirizzo in un comune, che non è la stessa cosa.
  if (row.kind === "mixed") {
    return declaresOfficial
      ? { verdict: "dmo", why: `si dichiara ufficiale, ${row.publicEvidence}` }
      : { verdict: "editoriale", why: `forma privata (${row.privateEvidence})` };
  }
  if (row.kind === "private") {
    // Una società privata che si dichiara portale ufficiale del territorio è
    // quasi sempre una in house o una concessionaria: resta un caso da guardare
    // a mano, e lo si segnala invece di deciderlo qui.
    return declaresOfficial
      ? { verdict: "da-rivedere", why: `privata ma si dichiara ufficiale (${row.privateEvidence})` }
      : { verdict: "editoriale", why: `società privata (${row.privateEvidence})` };
  }
  return declaresOfficial
    ? { verdict: "dmo", why: "si dichiara sito ufficiale del territorio" }
    : { verdict: "editoriale", why: "soggetto non dichiarato" };
}

const [, , inputPath, outputPath] = process.argv;
const rows = JSON.parse(await readFile(inputPath, "utf8"));
const judged = rows.map((row) => ({ ...row, ...classify(row) }));

const byDest = new Map();
for (const row of judged) {
  if (!byDest.has(row.destination)) byDest.set(row.destination, []);
  byDest.get(row.destination).push(row);
}

// Per ogni destinazione: un solo sito ufficiale, fino a due editoriali.
const selection = {};
for (const [destination, list] of byDest) {
  const dmo = list.filter((r) => r.verdict === "dmo");
  const editorial = list.filter((r) => r.verdict === "editoriale");
  selection[destination] = {
    dmo: dmo[0] ?? null,
    editorial: editorial.slice(0, 2),
    review: list.filter((r) => r.verdict === "da-rivedere"),
    discarded: list.filter((r) => r.verdict === "scartato").length,
  };
}

const withDmo = Object.values(selection).filter((s) => s.dmo).length;
const withEditorial = Object.values(selection).filter((s) => s.editorial.length).length;
console.log(`  destinazioni con sito ufficiale verificato   ${withDmo}/100`);
console.log(`  destinazioni con almeno un editoriale        ${withEditorial}/100`);
console.log(`  domini scartati                              ${judged.filter((r) => r.verdict === "scartato").length}`);
await writeFile(outputPath, JSON.stringify(selection, null, 1));
console.log(`\n  scritto ${outputPath}`);
