#!/usr/bin/env node
// Verifica i domini raccolti dai siti dei territori: rispondono? e il titolo
// dice che sono una struttura ricettiva? Stesso filtro delle sonde, così i due
// canali producono dati confrontabili invece di due qualità diverse.

import { readFile, writeFile } from "node:fs/promises";

const TIMEOUT = 8000;
const UA = "BussolaObservatoryCheck/1.0 (+https://www.rankhotel.ai/llms.txt)";
const LODGING_TITLE =
  /\b(hotel|albergo|relais|resort|agriturismo|masseria|locanda|dimora|residence|b&b|bed\s*&?\s*breakfast|camere|suites?|chalet|rifugio|baita|ostello|guest\s*house|country\s*house|boutique|apartments?|appartamenti)\b/i;
const JUNK =
  /(dominio|domain).{0,20}(vendita|sale|parcheggi|parking|default)|buy this domain|in costruzione|under construction|coming soon/i;

async function probe(domain) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(`https://${domain}`, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html", "accept-language": "it,en;q=0.8" },
    });
    if (!response.ok) return null;
    if (!(response.headers.get("content-type") ?? "").includes("html")) return null;
    const body = (await response.text()).slice(0, 40000);
    const title = (body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
      .replace(/&#0?39;|&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&[a-z]+;|&#\d+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!title || title.length < 6) return null;
    if (JUNK.test(title)) return null;
    if (!LODGING_TITLE.test(title)) return null;
    return { domain, title };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const raw = JSON.parse(await readFile(process.argv[2], "utf8"));
const jobs = Object.entries(raw).flatMap(([dest, domains]) =>
  domains.map((domain) => ({ dest, domain })),
);
console.log(`Verifico ${jobs.length} domini raccolti...`);

const found = [];
let done = 0;
const queue = [...jobs];
await Promise.all(
  Array.from({ length: 20 }, async () => {
    while (queue.length) {
      const job = queue.pop();
      const hit = await probe(job.domain);
      done += 1;
      if (hit) found.push({ ...job, ...hit });
    }
  }),
);
console.log(`  confermate ${found.length}/${jobs.length}`);
await writeFile(process.argv[3], JSON.stringify(found, null, 1));
console.log(`  scritto ${process.argv[3]}`);
