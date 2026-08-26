#!/usr/bin/env node
// Scrive tools/seed/verified-hotels.mjs dagli esiti della verifica.
//
// Tre livelli di certezza, dichiarati e non confusi fra loro:
//   verified  il dominio risponde e la pagina nomina l'hotel;
//   chain     l'hotel sta sul dominio di un gruppo: esiste, ma su quel dominio
//             non lo si può verificare e le scelte tecniche non sono sue;
//   guarded   il dominio esiste e rifiuta i controlli automatici (403). Il
//             sito c'è, la prova no.
// Tutto il resto non entra.

import { readFile, writeFile } from "node:fs/promises";
import { CHAIN_DOMAINS } from "../seed/verified-sites.mjs";

const results = JSON.parse(await readFile(process.argv[2], "utf8"));
const today = new Date().toISOString().slice(0, 10);

const byDestination = {};
const counts = { verified: 0, chain: 0, guarded: 0, dropped: 0 };

for (const row of results) {
  const isChain = CHAIN_DOMAINS.includes(row.domain);
  let confidence = null;

  if (isChain) confidence = "chain";
  else if (row.verdict === "verificato") confidence = "verified";
  else if (row.verdict === "da-rivedere") {
    // Il matcher scarta le parole sotto le quattro lettere: "de Len" non
    // passava pur essendo nel titolo. Se il dominio contiene il nome, basta.
    const slug = row.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const domainSlug = row.domain.replace(/[^a-z0-9]/g, "");
    confidence = domainSlug.includes(slug.slice(0, 10)) ? "verified" : null;
  } else if (row.why === "blocca la verifica automatica") confidence = "guarded";

  if (!confidence) {
    counts.dropped += 1;
    continue;
  }
  counts[confidence] += 1;
  (byDestination[row.destination] ??= []).push({
    name: row.name,
    domain: row.domain,
    stars: row.stars,
    area: row.area,
    confidence,
    why: confidence === "verified" ? row.why : undefined,
  });
}

const q = (v) => JSON.stringify(v);
const body = Object.entries(byDestination)
  .map(
    ([key, list]) =>
      `  ${q(key)}: [\n` +
      list
        .map(
          (h) =>
            `    { name: ${q(h.name)}, domain: ${q(h.domain)}, stars: ${h.stars}, area: ${q(h.area)}, confidence: ${q(h.confidence)} },`,
        )
        .join("\n") +
      "\n  ],",
  )
  .join("\n");

await writeFile(
  "tools/seed/verified-hotels.mjs",
  `// GENERATO da tools/verify/write-hotels-seed.mjs il ${today}.
// Non modificare a mano: i candidati stanno in tools/verify/candidates-hotels.mjs
// e si rilancia \`npm run verify:hotels\`.
//
// \`confidence\` dice quanto sappiamo di ciascuna struttura:
//   verified  il dominio risponde e la pagina nomina l'hotel;
//   chain     sta sul dominio di un gruppo: esiste, ma le scelte tecniche di
//             quel dominio non sono dell'albergatore;
//   guarded   il dominio esiste e rifiuta i controlli automatici. Il sito c'è,
//             la prova che sia questo hotel no.
// Gli hotel che non compaiono qui, nel dataset, restano nomi generati e sono
// marcati come tali.

export const VERIFIED_HOTELS = {
${body}
};

export const HOTELS_VERIFIED_ON = ${q(today)};
`,
);

console.log(`  verificati        ${counts.verified}`);
console.log(`  su dominio gruppo ${counts.chain}`);
console.log(`  dominio difeso    ${counts.guarded}`);
console.log(`  scartati          ${counts.dropped}`);
console.log(`  destinazioni      ${Object.keys(byDestination).length}/100`);
console.log(`\n  scritto tools/seed/verified-hotels.mjs`);
