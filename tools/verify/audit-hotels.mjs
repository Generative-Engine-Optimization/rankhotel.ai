#!/usr/bin/env node
// Rilegge le strutture già nel seed e le passa al controllo geografico.
//
// Il seed è stato costruito quando la verifica non chiedeva dove fosse la
// struttura, e ci sono finiti alberghi in Albania, in Croazia, in Kazakhstan e
// a Tacoma (Washington) come strutture di Roma, della Sardegna e della
// Costiera. Rilanciare l'intera pipeline non basterebbe: le sonde ripescano
// gli stessi domini. Serve rivalutare quello che c'è, con la prova che prima
// non veniva chiesta.
//
// I registri pubblici regionali non passano di qui: sull'esistenza e sul luogo
// di una struttura sono la fonte, non l'indiziato.
//
//   node tools/verify/audit-hotels.mjs tools/verify/hotels-audit.json

import { writeFile } from "node:fs/promises";
import { VERIFIED_HOTELS } from "../seed/verified-hotels.mjs";
import { DESTINATIONS } from "../seed/destinations.mjs";
import { CHAIN_DOMAINS } from "../seed/verified-sites.mjs";
import { verdictFor } from "./geo-check.mjs";

const TIMEOUT = 9000;
const CONCURRENCY = 24;
const UA = "BussolaObservatoryCheck/1.0 (+https://www.rankhotel.ai/llms.txt; riverifica geografica)";

const DEST = Object.fromEntries(DESTINATIONS.map((d) => [d.key, d]));

async function read(domain) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(`https://${domain}`, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html", "accept-language": "it,en;q=0.8" },
    });
    if (!response.ok) return { error: `http-${response.status}` };
    if (!(response.headers.get("content-type") ?? "").includes("html")) {
      return { error: "non-html" };
    }
    const html = (await response.text()).slice(0, 160000);
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
      .replace(/&amp;/g, "&")
      .replace(/&[a-z]+;|&#\d+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Script e stile fuori: dentro ci sono domini, chiavi e parole di terze
    // parti che il controllo leggerebbe come prove del posto sbagliato.
    // I dati strutturati invece servono, e vanno tenuti.
    const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
      .map((m) => m[1])
      .join(" ");
    const body =
      html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ") + " " + ld;
    const landed = new URL(response.url).hostname.replace(/^www\./, "");
    return { title, body, landed };
  } catch (error) {
    return { error: error?.name === "AbortError" ? "timeout" : "irraggiungibile" };
  } finally {
    clearTimeout(timer);
  }
}

const rows = [];
for (const [destination, list] of Object.entries(VERIFIED_HOTELS)) {
  for (const hotel of list) {
    if (hotel.source === "registry") continue;
    rows.push({ destination, ...hotel });
  }
}

console.log(`Riverifico ${rows.length} strutture non provenienti dai registri...`);

const results = [];
const queue = [...rows];
let done = 0;

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const row = queue.pop();
      const destination = DEST[row.destination];
      let outcome;

      if (CHAIN_DOMAINS.includes(row.domain)) {
        // Sul dominio del gruppo la singola struttura non è verificabile, e
        // non lo era nemmeno prima: resta dichiarata come tale.
        outcome = { verdict: "catena", why: "dominio di gruppo" };
      } else if (!destination) {
        outcome = { verdict: "scartato", why: "destinazione sconosciuta" };
      } else {
        const page = await read(row.domain);
        outcome = page.error
          ? { verdict: "irraggiungibile", why: page.error }
          : { ...verdictFor({ ...page, destination, candidate: row }), title: page.title };
      }

      results.push({ ...row, ...outcome });
      done += 1;
      if (done % 100 === 0) console.log(`  ${done}/${rows.length}`);
    }
  }),
);

const counts = {};
for (const r of results) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
console.log(
  "\n  " +
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}`)
      .join("  ·  "),
);

await writeFile(process.argv[2], JSON.stringify(results, null, 1));
console.log(`\n  scritto ${process.argv[2]}`);
