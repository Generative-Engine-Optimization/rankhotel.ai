#!/usr/bin/env node
// Verifica gli hotel candidati.
//
// Un dominio che risponde non prova che l'hotel esista: prova che qualcuno ha
// registrato quel dominio. La prova che serve è un'altra: che la pagina parli
// di quell'hotel. Per questo qui si confronta il nome con il contenuto.
//
// Sui domini di catena (marriott.com, belmond.com) il confronto non può
// riuscire, perché la home del gruppo non nomina la singola struttura: quei
// casi si marcano come "catena" e restano dichiarati come tali nel sito.

import { readFile, writeFile } from "node:fs/promises";
import { checkDomain } from "./check-domains.mjs";
import { HOTEL_CANDIDATES } from "./candidates-hotels.mjs";
import { CHAIN_DOMAINS } from "../seed/verified-sites.mjs";

const normalise = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Parole troppo comuni per costituire una prova: se l'unica corrispondenza è
// "hotel", non abbiamo verificato niente.
const STOP = new Set([
  "hotel", "grand", "the", "di", "de", "del", "della", "resort", "spa", "relais",
  "palace", "villa", "casa", "albergo", "boutique", "luxury", "collection", "a",
]);

function nameMatches(name, haystack) {
  const words = normalise(name).split(" ").filter((w) => w.length > 3 && !STOP.has(w));
  if (!words.length) return { ok: false, matched: [] };
  const text = normalise(haystack);
  const matched = words.filter((w) => text.includes(w));
  // Basta una parola distintiva: "Sirenuse", "Quisisana", "Pizzomunno" non
  // compaiono per caso su una pagina che non sia la loro.
  return { ok: matched.length > 0, matched };
}

const rows = [];
for (const [destination, hotels] of Object.entries(HOTEL_CANDIDATES)) {
  for (const [name, domain, stars, area] of hotels) {
    rows.push({ destination, name, domain, stars, area });
  }
}

// Prima si verificano i domini unici, in parallelo: 181 domini in sequenza a
// dodici secondi di timeout ciascuno non finiscono in un tempo utile.
const domains = [...new Set(rows.map((r) => r.domain))];
const cache = new Map();
let done = 0;

await Promise.all(
  Array.from({ length: 10 }, async () => {
    while (domains.length) {
      const domain = domains.pop();
      cache.set(domain, await checkDomain(domain));
      done += 1;
      if (done % 25 === 0) console.log(`  ${done} domini verificati`);
    }
  }),
);

const results = [];
for (const row of rows) {
  const chain = CHAIN_DOMAINS.includes(row.domain);
  const check = cache.get(row.domain);

  if (check.status !== "ok") {
    results.push({ ...row, verdict: "scartato", why: check.note ?? check.status, chain });
    continue;
  }
  if (chain) {
    // Non si può verificare il singolo hotel sul dominio del gruppo, e fingere
    // di averlo fatto sarebbe peggio che dichiararlo.
    results.push({
      ...row,
      verdict: "catena",
      why: "dominio di gruppo: la struttura non è verificabile qui",
      chain,
      title: check.title,
    });
    continue;
  }
  const match = nameMatches(row.name, `${check.title ?? ""} ${row.domain}`);
  results.push({
    ...row,
    verdict: match.ok ? "verificato" : "da-rivedere",
    why: match.ok
      ? `il sito nomina ${match.matched.join(", ")}`
      : `il sito risponde ma non nomina l'hotel (${check.title ?? "senza titolo"})`,
    chain,
    title: check.title,
  });
}

const counts = {};
for (const r of results) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
console.log("\n  " + Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join("  ·  "));
await writeFile(process.argv[2], JSON.stringify(results, null, 1));
console.log(`\n  scritto ${process.argv[2]}`);
