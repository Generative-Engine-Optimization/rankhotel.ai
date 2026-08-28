#!/usr/bin/env node
// Unisce le tre sorgenti di strutture in un solo seed.
//
//   curated   scritte a mano e verificate col nome sulla pagina
//   probe     scoperte provando domini plausibili: il nome viene dal titolo
//   harvest   raccolte dai link dei siti dei territori, poi verificate
//
// Il nome non lo decidiamo noi: lo legge la pagina. È l'unica cosa che rende
// questi dati diversi da nomi inventati bene.
//
// E il luogo nemmeno: lo prova la pagina, tramite geo-check. Una riga che
// arriva senza quella prova entra come `listed`, non come `verified` — sono
// due affermazioni diverse e il sito le mostra diverse.

import { readFile, writeFile } from "node:fs/promises";
import { VERIFIED_HOTELS } from "../seed/verified-hotels.mjs";

const read = async (path) => {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return [];
  }
};

// Dal titolo al nome: si taglia alla prima separazione, si tolgono le code
// promozionali e la località ripetuta. "Hotel Cortina | Hotel 4 stelle a
// Cortina d'Ampezzo" deve dare "Hotel Cortina".
const TAIL =
  /\s*[-–—|·:,]\s*(sito ufficiale|official|home\s*page|homepage|benvenuti|welcome|hotel \d|\d\s*stelle|\d\s*star|prenota|booking|offerte|vacanze|camere|dal \d{4}).*$/i;

// I registri pubblici scrivono le denominazioni in maiuscolo. Va rimesso in
// forma leggibile senza rovinare le preposizioni e gli apostrofi.
const SMALL = new Set(["di","del","della","dei","delle","da","e","il","la","lo","le","al","alla","in","a","d"]);
function titleCase(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && SMALL.has(word)) return word;
      return word.replace(/^(\p{L})/u, (c) => c.toUpperCase()).replace(/'(\p{L})/u, (m, c) => "'" + c.toUpperCase());
    })
    .join(" ");
}

// Prefissi che i siti mettono davanti al nome: vanno via, altrimenti nel
// dataset finiscono voci come "Home - Hotel Antica Badia".
const LEAD =
  /^\s*(home\s*page|home|benvenuti(?: al| alla| a)?|welcome(?: to)?|sito ufficiale|official site|hotel ufficiale|il sito di)\s*[-–—:|]?\s*/i;

function nameFromTitle(title) {
  let name = title.replace(LEAD, "")
    .split(/\s*[|·»]\s*/)[0]
    .replace(TAIL, "")
    .replace(/\s*[-–—]\s*[^-–—]{0,40}$/, (m) =>
      // Si toglie la coda solo se il titolo resta abbastanza lungo da essere
      // un nome: "Hotel Eden - Roma" diventa "Hotel Eden", ma "Le Sirenuse"
      // non deve diventare "Le".
      title.split(/\s*[-–—]\s*/)[0].length >= 8 ? "" : m,
    )
    .replace(/\s*\(.*?\)\s*$/, "")
    .replace(/[«»"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
  name = name.replace(LEAD, "").replace(/\s*[-–—:|]\s*$/, "").trim();
  if (name.length > 46) name = name.slice(0, 46).replace(/\s+\S*$/, "");
  return name;
}

const STAR_HINT = [
  [/\b5\s*stelle|\bcinque stelle|\b5[-\s]?star|luxury/i, 5],
  [/\b4\s*stelle|\bquattro stelle|\b4[-\s]?star/i, 4],
  [/\b3\s*stelle|\btre stelle|\b3[-\s]?star/i, 3],
];
const TYPE_HINT = [
  [/rifugio|ostello|baita|camping/i, 2],
  [/relais|resort|masseria|castello|palazzo|villa|boutique/i, 4],
  [/agriturismo|locanda|b&b|bed\s*&?\s*breakfast|affittacamere|residence|apartments?/i, 3],
];

function starsFrom(title) {
  for (const [re, n] of STAR_HINT) if (re.test(title)) return n;
  for (const [re, n] of TYPE_HINT) if (re.test(title)) return n;
  return 3;
}

// Tutti i file di sonda, di entrambi i giri.
const probeFiles = [
  "probe-00", "probe-20", "probe-45", "probe-70",
  "probe2-00", "probe2-25", "probe2-50", "probe2-75",
];
const probes = (
  await Promise.all(probeFiles.map((f) => read(`tools/verify/${f}.json`)))
).flat();
const harvest = await read("tools/verify/harvest-verified.json");
const registry = await read("tools/verify/opendata-hotels.json");

const byDestination = {};
const seenDomain = new Set();
const seenName = new Set();
const counts = { curated: 0, probe: 0, harvest: 0, duplicates: 0, unusable: 0 };

const push = (dest, row) => {
  const nameKey = `${dest}|${row.name.toLowerCase()}`;
  if (seenDomain.has(row.domain) || seenName.has(nameKey)) {
    counts.duplicates += 1;
    return;
  }
  seenDomain.add(row.domain);
  seenName.add(nameKey);
  (byDestination[dest] ??= []).push(row);
};

// Quello che c'è già entra per primo, conservando la sorgente con cui era
// stato registrato. Rietichettarlo tutto come "curato" perché si trova nel
// file curato cancellerebbe proprio l'informazione che serve.
for (const [dest, list] of Object.entries(VERIFIED_HOTELS)) {
  for (const hotel of list) {
    const source = hotel.source ?? "curated";
    push(dest, { ...hotel, source });
    counts[source] = (counts[source] ?? 0) + 1;
  }
}

// I registri regionali per ultimi: sono la fonte più autorevole sull'esistenza
// ma la meno ricca sul resto, quindi riempiono i posti che restano invece di
// scalzare le strutture su cui sappiamo di più.
for (const row of registry) {
  const name = row.name.replace(/\s+/g, " ").trim();
  if (name.length < 4) {
    counts.unusable += 1;
    continue;
  }
  push(row.dest, {
    // I registri scrivono tutto maiuscolo: si rimette in forma leggibile.
    name: /[a-z]/.test(name) ? name : titleCase(name),
    domain: row.domain,
    stars: row.stars ?? 3,
    area: row.comune ?? null,
    confidence: row.domain ? "registry-web" : "registry",
    source: "registry",
  });
  counts.registry = (counts.registry ?? 0) + 1;
}

for (const [rows, source] of [
  [probes, "probe"],
  [harvest, "harvest"],
]) {
  for (const row of rows) {
    const name = nameFromTitle(row.title);
    // Un nome che non nomina il tipo di struttura né supera le sei lettere non
    // è un nome: è quello che restava dopo aver tagliato il titolo.
    if (name.length < 6) {
      counts.unusable += 1;
      continue;
    }
    push(row.dest, {
      name,
      domain: row.domain,
      stars: starsFrom(row.title),
      area: null,
      // "verified" non si assegna per decreto: la sonda lo scrive solo quando
      // geo-check ha trovato la prova che la struttura è in Italia e in questo
      // territorio. Prima qui c'era la costante "verified", ed è il motivo per
      // cui un albergo albanese risultava una struttura romana verificata.
      confidence: row.why ? "verified" : "listed",
      source,
    });
    counts[source] += 1;
  }
}

// Ultima passata su tutto: i nomi arrivati dalle esecuzioni precedenti
// portano ancora i prefissi dei titoli, e vanno ripuliti anche loro.
const USELESS = /^(benvenuti|welcome|home|homepage|sito ufficiale|official site|index|untitled)$/i;
// Code descrittive: tutto ciò che segue una virgola o che ripete "sito
// ufficiale" è la frase del titolo, non il nome dell'albergo.
const TRAILING = /\s*[,–—]\s*(un[ao']?|il|la|lo|l')\s.*$|\s+sito\s+ufficiale.*$|\s*[-–—]\s*(hotel|albergo)\s+\d.*$/i;
for (const [dest, list] of Object.entries(byDestination)) {
  byDestination[dest] = list
    .map((h) => ({
      ...h,
      name: h.name
        .replace(LEAD, "")
        .replace(TRAILING, "")
        .replace(/\s*[-–—:|,]\s*$/, "")
        .replace(/\s+/g, " ")
        .trim(),
    }))
    .filter((h) => {
      const ok = h.name.length >= 5 && !USELESS.test(h.name);
      if (!ok) counts.unusable += 1;
      return ok;
    });
  if (!byDestination[dest].length) delete byDestination[dest];
}

const total = Object.values(byDestination).flat().length;
const q = (v) => JSON.stringify(v);
const body = Object.entries(byDestination)
  .sort()
  .map(
    ([key, list]) =>
      `  ${q(key)}: [\n` +
      list
        .map(
          (h) =>
            `    { name: ${q(h.name)}, domain: ${q(h.domain)}, stars: ${h.stars}, area: ${q(h.area)}, confidence: ${q(h.confidence)}, source: ${q(h.source)} },`,
        )
        .join("\n") +
      "\n  ],",
  )
  .join("\n");

await writeFile(
  "tools/seed/verified-hotels.mjs",
  `// GENERATO da tools/verify/merge-hotels.mjs il ${new Date().toISOString().slice(0, 10)}.
// Non modificare a mano: si rilancia \`npm run verify:hotels\`.
//
// Tre sorgenti, tutte verificate con una richiesta HTTP reale:
//   curated   scritte a mano, il sito le nomina
//   probe     scoperte provando domini plausibili; il nome viene letto dal
//             titolo della pagina, non deciso da noi
//   harvest   raccolte dai link dei siti dei territori, poi verificate
//
// \`confidence\`: verified (il sito la nomina), chain (dominio di gruppo:
// esiste ma le scelte tecniche non sono sue), guarded (dominio difeso, il
// sito c'è ma la prova no). Chi non è qui, nel dataset resta nome generato.

export const VERIFIED_HOTELS = {
${body}
};

export const HOTELS_VERIFIED_ON = ${q(new Date().toISOString().slice(0, 10))};
`,
);

console.log(`  curate      ${counts.curated}`);
console.log(`  da sonda    ${counts.probe}`);
console.log(`  da raccolta ${counts.harvest}`);
console.log(`  duplicate   ${counts.duplicates}`);
console.log(`  inutilizzabili ${counts.unusable}`);
console.log(`\n  TOTALE      ${total} strutture su ${Object.keys(byDestination).length} destinazioni`);
