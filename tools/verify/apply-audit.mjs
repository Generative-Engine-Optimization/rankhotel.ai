#!/usr/bin/env node
// Riscrive il seed applicando gli esiti della riverifica geografica.
//
// La regola è la stessa che vale per tutto il resto dell'osservatorio: si
// cancella solo ciò che si può dimostrare sbagliato, e su tutto il resto si
// abbassa la pretesa invece di alzarla.
//
//   fuori-italia    via. Un albergo in Albania non è una struttura italiana,
//                   e nessuna etichetta lo rende tale.
//   non-struttura   via. Un dominio in vendita o un'agenzia web non è un hotel.
//   altrove         via. Il titolo nomina un territorio diverso da quello a cui
//                   la riga è assegnata: l'assegnazione è provabilmente errata.
//   fuori-zona      resta, ma declassata. È in Italia; che sia in questo
//   non-provata     territorio non lo sappiamo, e "verificata" voleva dire
//   irraggiungibile un'altra cosa. Restano con `listed`.
//
// I registri regionali non sono stati riverificati e restano come sono: sono
// la fonte pubblica sull'esistenza e sul comune di una struttura.
//
//   node tools/verify/apply-audit.mjs tools/verify/hotels-audit.json

import { readFile, writeFile } from "node:fs/promises";
import { VERIFIED_HOTELS } from "../seed/verified-hotels.mjs";
import { DESTINATIONS } from "../seed/destinations.mjs";
import { buildGazetteer, namesAnotherPlace } from "./geo-check.mjs";

const audit = JSON.parse(await readFile(process.argv[2], "utf8"));
const gazetteer = buildGazetteer(DESTINATIONS);

const DROP = new Set(["fuori-italia", "non-struttura"]);
const DOWNGRADE = new Set(["fuori-zona", "non-provata", "irraggiungibile"]);

const decisions = new Map();
const counts = { tenute: 0, declassate: 0, "via-estero": 0, "via-non-struttura": 0, "via-altrove": 0 };
const removed = [];

for (const row of audit) {
  const key = `${row.destination}|${row.domain}`;

  if (DROP.has(row.verdict)) {
    counts[row.verdict === "fuori-italia" ? "via-estero" : "via-non-struttura"] += 1;
    removed.push({ ...row, azione: row.verdict });
    decisions.set(key, null);
    continue;
  }

  if (DOWNGRADE.has(row.verdict)) {
    const elsewhere = namesAnotherPlace(row, gazetteer);
    if (elsewhere.ok) {
      counts["via-altrove"] += 1;
      removed.push({ ...row, azione: "altrove", elsewhere: elsewhere.elsewhere });
      decisions.set(key, null);
      continue;
    }
    counts.declassate += 1;
    decisions.set(key, { confidence: "listed", why: row.why });
    continue;
  }

  counts.tenute += 1;
  decisions.set(key, {
    confidence: row.verdict === "catena" ? "chain" : "verified",
    why: row.why,
  });
}

const byDestination = {};
let registry = 0;

for (const [destination, list] of Object.entries(VERIFIED_HOTELS)) {
  for (const hotel of list) {
    if (hotel.source === "registry") {
      registry += 1;
      (byDestination[destination] ??= []).push(hotel);
      continue;
    }
    const decision = decisions.get(`${destination}|${hotel.domain}`);
    if (decision === null) continue;
    (byDestination[destination] ??= []).push(
      decision ? { ...hotel, confidence: decision.confidence } : hotel,
    );
  }
  if (!byDestination[destination]?.length) delete byDestination[destination];
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

const today = new Date().toISOString().slice(0, 10);

await writeFile(
  "tools/seed/verified-hotels.mjs",
  `// GENERATO da tools/verify/apply-audit.mjs il ${today}.
// Non modificare a mano: si rilancia \`npm run verify:hotels\`.
//
// Quattro sorgenti, tutte verificate con una richiesta HTTP reale:
//   curated   scritte a mano, il sito le nomina
//   probe     scoperte provando domini plausibili; il nome viene letto dal
//             titolo della pagina, non deciso da noi
//   harvest   raccolte dai link dei siti dei territori, poi verificate
//   registry  denominazioni dai registri pubblici regionali
//
// Le righe non provenienti dai registri sono passate al controllo geografico
// di tools/verify/geo-check.mjs: la pagina deve provare di stare in Italia
// (partita IVA, +39, CAP con provincia, indirizzo dichiarato) e di stare in
// questo territorio. Prima non lo chiedeva nessuno, e il dataset conteneva
// alberghi in Albania, in Croazia e in Kazakhstan come strutture italiane.
//
// \`confidence\`: verified (in Italia e in questo territorio), chain (dominio di
// gruppo: esiste ma le scelte tecniche non sono sue), guarded (dominio difeso),
// listed (esiste, ma che sia in questo territorio non è provato), registry-web
// e registry (dai registri pubblici). Chi non è qui, nel dataset resta nome
// generato.

export const VERIFIED_HOTELS = {
${body}
};

export const HOTELS_VERIFIED_ON = ${q(today)};
`,
);

await writeFile("tools/verify/hotels-removed.json", JSON.stringify(removed, null, 1));

console.log(`  tenute          ${counts.tenute}`);
console.log(`  declassate      ${counts.declassate}  (verified → listed)`);
console.log(`  via: estero     ${counts["via-estero"]}`);
console.log(`  via: non hotel  ${counts["via-non-struttura"]}`);
console.log(`  via: altrove    ${counts["via-altrove"]}`);
console.log(`  dai registri    ${registry}  (non riverificate)`);
console.log(`\n  TOTALE ${total} strutture su ${Object.keys(byDestination).length} destinazioni`);
console.log(`  rimosse elencate in tools/verify/hotels-removed.json`);
