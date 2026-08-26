#!/usr/bin/env node
// Scrive tools/seed/verified-sites.mjs unendo tre sorgenti, in ordine di
// autorevolezza crescente: l'esito automatico, le decisioni prese a mano, i
// rifiuti espliciti. Il file prodotto dichiara per ogni dominio da dove viene.

import { readFile, writeFile } from "node:fs/promises";
import { DMO_OVERRIDES, EDITORIAL_OVERRIDES, REJECT } from "./overrides.mjs";
import { DESTINATIONS } from "../seed/destinations.mjs";

const [, , selectionPath] = process.argv;
const selection = JSON.parse(await readFile(selectionPath, "utf8"));
const today = new Date().toISOString().slice(0, 10);

// Il marcatore trovato dalla regex è un frammento ("Comune di C") e come
// etichetta non serve a nessuno. Il titolo della pagina, ripulito dalla coda
// promozionale, dice molto meglio chi è il soggetto.
const cleanTitle = (title) =>
  (title ?? "")
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&raquo;|&laquo;|&nbsp;/g, " ")
    .split(/\s*[|·»–]\s*/)[0]
    .replace(/\s*[-–]\s*(?:sito|portale|home|homepage).*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64) || null;

const dmo = {};
const editorial = {};

for (const dest of DESTINATIONS) {
  const found = selection[dest.key] ?? {};
  const rejected = new Set(REJECT[dest.key] ?? []);

  const manual = DMO_OVERRIDES[dest.key];
  if (manual) {
    dmo[dest.key] = { ...manual, source: "verifica manuale" };
  } else if (found.dmo && !rejected.has(found.dmo.domain)) {
    dmo[dest.key] = {
      domain: found.dmo.domain,
      holder: cleanTitle(found.dmo.title),
      why: found.dmo.why,
      source: "verifica automatica",
    };
  }

  const editorials = [];
  const manualEditorial = EDITORIAL_OVERRIDES[dest.key];
  if (manualEditorial) editorials.push({ ...manualEditorial, source: "verifica manuale" });
  for (const row of found.editorial ?? []) {
    if (rejected.has(row.domain)) continue;
    if (row.domain === dmo[dest.key]?.domain) continue;
    if (editorials.some((e) => e.domain === row.domain)) continue;
    editorials.push({
      domain: row.domain,
      holder: cleanTitle(row.title),
      why: row.why,
      source: "verifica automatica",
    });
    if (editorials.length >= 2) break;
  }
  if (editorials.length) editorial[dest.key] = editorials;
}

const q = (v) => (v == null ? "null" : JSON.stringify(v));
const block = (obj, mapper) =>
  Object.entries(obj)
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${mapper(value)},`)
    .join("\n");

const out = `// GENERATO da tools/verify/write-sites-seed.mjs il ${today}.
// Non modificare a mano: le decisioni si prendono in tools/verify/overrides.mjs
// e si rilancia \`npm run verify:sites\`.
//
// Un dominio è qui solo se ha risposto a una richiesta HTTP reale e se il
// soggetto che lo gestisce è stato identificato. \`source\` dice se la
// classificazione l'ha fatta lo script o una persona: le due cose non si
// confondono, perché una persona può sbagliare in modo diverso da uno script.

export const VERIFIED_ON = ${q(today)};

// Sito ufficiale del territorio: un ente, un consorzio, un parco, o una società
// in house con mandato pubblico di promozione.
export const VERIFIED_DMO = {
${block(dmo, (v) => `{ domain: ${q(v.domain)}, holder: ${q(v.holder)}, why: ${q(v.why)}, source: ${q(v.source)}${v.note ? `, note: ${q(v.note)}` : ""} }`)}
};

// Portali indipendenti: società private che raccontano il territorio. Sono
// spesso più citati dalle AI del sito ufficiale, ed è il dato interessante.
export const VERIFIED_EDITORIAL = {
${block(editorial, (v) => `[\n${v.map((e) => `    { domain: ${q(e.domain)}, holder: ${q(e.holder)}, source: ${q(e.source)} },`).join("\n")}\n  ]`)}
};
`;

await writeFile("tools/seed/verified-domains.mjs", out);
console.log(`  siti ufficiali verificati   ${Object.keys(dmo).length}/100`);
console.log(`  destinazioni con editoriali ${Object.keys(editorial).length}/100`);
console.log(`  domini editoriali totali    ${Object.values(editorial).flat().length}`);
console.log(`\n  scritto tools/seed/verified-domains.mjs`);
