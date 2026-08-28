#!/usr/bin/env node
// Scopre strutture ricettive provando domini plausibili.
//
// Il punto non è indovinare il nome dell'hotel: è indovinare il dominio e poi
// LEGGERE il nome dal titolo della pagina. Se `hotelcortina.it` risponde e il
// titolo dice "Hotel Cortina", abbiamo scoperto una struttura reale senza
// averla mai saputa prima. Se non risponde, non è costato niente.
//
// I toponimi non sono inventati: sono i nomi delle destinazioni e le entità
// reali già censite a mano nel seed.
//
// ATTENZIONE al punto debole di questo metodo, che per un po' è stato un bug
// vero: il dominio lo costruiamo NOI dal nome del luogo, quindi ritrovarci il
// nome del luogo non prova niente. `colosseohotel.com` risponde, il titolo
// dice "hotel", e per un anno è stato un albergo di Roma: è l'Hotel Colosseo
// di Shkodër, in Albania. Per questo ogni risposta passa da geo-check, che
// chiede alla pagina due prove che non abbiamo messo noi — che sia in Italia
// e che sia in questo territorio.

import { writeFile } from "node:fs/promises";
import { DESTINATIONS } from "../seed/destinations.mjs";
import { verdictFor } from "./geo-check.mjs";

const TIMEOUT = 6500;
const CONCURRENCY = 24;
const UA = "BussolaObservatoryCheck/1.0 (+https://www.rankhotel.ai/llms.txt)";

// Due giri con forme diverse, per non riprovare gli stessi domini. Le forme
// del secondo giro sono quelle della ricettività extralberghiera, che in Italia
// è la maggioranza delle strutture e che il primo giro non toccava.
const ROUNDS = {
  1: {
    prefixes: ["hotel", "albergo", "relais", "villa", "residence", "locanda", "resort"],
    suffixes: ["hotel", "resort"],
    tlds: [".it", ".com"],
  },
  3: {
    // Terzo giro, solo sulle destinazioni magre: forme meno frequenti e due
    // domini di primo livello in più. La resa per tentativo cala, ma su un
    // territorio con due strutture trovate ogni aggiunta pesa.
    prefixes: [
      "soggiorno", "ostello", "sporthotel", "hotelvilla", "residenza", "poggio",
      "torre", "mulino", "convento", "abbazia", "fattoria", "vecchio", "vecchia",
      "belvedere", "panorama", "terrazza", "giardino", "oasi", "nido", "rifugio",
    ],
    suffixes: ["alloggi", "ospitalita", "dimora", "relais", "residence"],
    tlds: [".it", ".com", ".eu", ".net"],
  },
  2: {
    prefixes: [
      "agriturismo", "masseria", "borgo", "tenuta", "casa", "dimora", "palazzo",
      "chalet", "rifugio", "garni", "park", "grand", "antica", "antico",
      "cascina", "podere", "corte", "bb", "hotelristorante", "parkhotel",
    ],
    suffixes: ["suites", "rooms", "bb", "camere"],
    tlds: [".it", ".com"],
  },
};

const round = Number(process.env.PROBE_ROUND ?? 1);
const { prefixes: PREFIXES, suffixes: SUFFIXES, tlds: TLDS } = ROUNDS[round];

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(di|del|della|dei|delle|da|il|la|lo|le|e|d)\b/g, " ")
    .replace(/[^a-z0-9]/g, "");

// Un titolo di struttura ricettiva si riconosce: nomina il tipo di struttura,
// oppure parla di camere, prenotazioni, soggiorni.
const LODGING_TITLE =
  /\b(hotel|albergo|relais|resort|agriturismo|masseria|locanda|dimora|residence|b&b|bed\s*&?\s*breakfast|camere|suites?|chalet|rifugio|baita|ostello|guest\s*house|country\s*house|boutique)\b/i;

// Parcheggi, rivendite, pagine vuote: rispondono 200 e non sono niente.
const JUNK =
  /(dominio|domain).{0,20}(vendita|sale|parcheggi|parking|default)|acquista questo dominio|buy this domain|sedo\.com|godaddy|register\.it|aruba\.it|in costruzione|under construction|coming soon|hostinger|namecheap/i;

async function probe(domain, destination) {
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

    // Un redirect verso un altro dominio significa che questo non è il sito
    // della struttura: è un dominio parcheggiato che rimanda altrove.
    const landed = new URL(response.url).hostname.replace(/^www\./, "");
    if (landed !== domain) return null;

    const body = (await response.text()).slice(0, 160000);
    const title = (body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
      .replace(/&#0?39;|&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&[a-z]+;|&#\d+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!title || title.length < 6) return null;
    if (JUNK.test(title) || JUNK.test(body.slice(0, 4000))) return null;
    if (!LODGING_TITLE.test(title)) return null;

    // Il controllo che mancava. Senza, qui entrava qualunque struttura del
    // mondo il cui dominio somigliasse a un toponimo italiano.
    const clean = body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ");
    const geo = verdictFor({ title, body: clean, destination, candidate: { domain } });
    if (geo.verdict !== "verificato") return null;

    return { domain, title, why: geo.why };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function candidatesFor(dest) {
  // I toponimi: il nome della destinazione, le sue entità reali, e le parole
  // che le compongono. Sono nomi di luogo veri, non stringhe casuali.
  const words = new Set();
  const add = (value) => {
    const s = slug(value);
    if (s.length >= 4 && s.length <= 22) words.add(s);
  };
  add(dest.name.it);
  for (const entity of dest.knownFor) {
    add(entity);
    for (const part of entity.split(/\s+/)) if (part.length > 4) add(part);
  }
  for (const part of dest.name.it.split(/\s+/)) if (part.length > 4) add(part);

  const out = new Set();
  for (const word of words) {
    for (const tld of TLDS) {
      for (const prefix of PREFIXES) out.add(`${prefix}${word}${tld}`);
      for (const suffix of SUFFIXES) out.add(`${word}${suffix}${tld}`);
    }
  }
  return [...out];
}

const [, , outputPath, fromArg, toArg] = process.argv;
// Con PROBE_KEYS si punta a destinazioni precise invece che a un intervallo:
// serve al terzo giro, che lavora solo su quelle poco coperte.
const only = process.env.PROBE_KEYS?.split(",").filter(Boolean);
const slice = only
  ? DESTINATIONS.filter((d) => only.includes(d.key))
  : DESTINATIONS.slice(Number(fromArg ?? 0), Number(toArg ?? DESTINATIONS.length));
const from = 0;
const to = slice.length;

const jobs = [];
const seen = new Set();
for (const dest of slice) {
  for (const domain of candidatesFor(dest)) {
    if (seen.has(domain)) continue;
    seen.add(domain);
    jobs.push({ dest: dest.key, destination: dest, domain });
  }
}

console.log(`Provo ${jobs.length} domini su ${slice.length} destinazioni (${from}-${to})...`);
const found = [];
let done = 0;
const queue = [...jobs];

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const job = queue.pop();
      const hit = await probe(job.domain, job.destination);
      done += 1;
      // `job.destination` è l'oggetto intero: serve al controllo, non al file.
      if (hit) found.push({ dest: job.dest, ...hit });
      if (done % 500 === 0) {
        console.log(`  ${done}/${jobs.length} · trovate ${found.length}`);
      }
    }
  }),
);

console.log(`\n  provati  ${jobs.length}`);
console.log(`  trovate  ${found.length}`);
console.log(`  destinazioni coperte  ${new Set(found.map((f) => f.dest)).size}`);
await writeFile(outputPath, JSON.stringify(found, null, 1));
console.log(`\n  scritto ${outputPath}`);
