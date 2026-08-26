#!/usr/bin/env node
// Raccoglie strutture ricettive dai siti dei territori.
//
// Scrivere a mano duemila nomi di hotel è impossibile e sarebbe comunque
// inventare. La fonte giusta ce l'abbiamo già: i siti ufficiali ed editoriali
// verificati nel passaggio precedente hanno tutti una sezione "dove dormire",
// e i link che escono da quelle pagine puntano alle strutture vere.
//
// Il percorso è: pagina di elenco → link in uscita → dominio che sembra
// un'attività ricettiva → verifica → titolo della pagina come nome.
// Ogni passaggio scarta, e quello che resta è verificato due volte: viene da
// una fonte del territorio e risponde con il proprio nome.

import { writeFile, readFile } from "node:fs/promises";
import { VERIFIED_DMO, VERIFIED_EDITORIAL } from "../seed/verified-domains.mjs";
import { REGIONAL_DMO } from "../seed/verified-sites.mjs";
import { DESTINATIONS } from "../seed/destinations.mjs";

const TIMEOUT = 11000;
const UA =
  "BussolaObservatoryCheck/1.0 (+https://www.rankhotel.ai/llms.txt; raccolta strutture)";

// I percorsi con cui i siti turistici italiani chiamano la pagina degli
// alloggi. Si tentano tutti: costa poco e la resa cambia molto.
const LIST_PATHS = [
  "", "/dormire", "/dove-dormire", "/hotel", "/alberghi", "/strutture",
  "/ospitalita", "/soggiorno", "/accommodation", "/hotels", "/where-to-stay",
  "/dove-alloggiare", "/strutture-ricettive", "/ricettivita", "/stay",
];

// Un dominio è di un'attività ricettiva se lo dice il nome. Non è infallibile,
// ma il passaggio successivo verifica comunque, quindi qui conviene essere
// larghi e lasciare che sia la verifica a stringere.
const LODGING_WORDS = [
  "hotel", "albergo", "relais", "villa", "resort", "masseria", "agriturismo",
  "borgo", "locanda", "dimora", "palazzo", "tenuta", "residence", "casa",
  "chalet", "baita", "rifugio", "castello", "corte", "cascina", "podere",
  "sporthotel", "garni", "pension", "suites", "camping", "ostello", "bnb",
  "affittacamere", "antica", "antico", "grand",
];

// Domini che compaiono ovunque e non sono strutture: portali, social, servizi.
const NOISE = [
  "booking.com", "tripadvisor", "airbnb", "expedia", "google", "facebook",
  "instagram", "youtube", "twitter", "x.com", "linkedin", "whatsapp",
  "getyourguide", "trivago", "hotels.com", "agoda", "wordpress", "wixsite",
  "cookiebot", "iubenda", "gov.it", "istat", "regione", "comune.", "parco",
  "wikipedia", "maps.", "apple.com", "microsoft", "adobe", "jquery",
  "cloudflare", "gstatic", "googleapis", "font", "cdn", "trenitalia",
  "italotreno", "aeroporto", "meteo", "paypal", "visa", "mastercard",
  "tiktok", "pinterest", "telegram", "spotify", "amazon", "ebay",
];

async function get(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html", "accept-language": "it,en;q=0.8" },
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("html")) return null;
    return { body: await response.text(), url: response.url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const hostOf = (href, base) => {
  try {
    return new URL(href, base).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
};

function looksLikeLodging(host) {
  if (!host || host.split(".").length > 4) return false;
  if (NOISE.some((n) => host.includes(n))) return false;
  const name = host.split(".")[0];
  if (name.length < 5) return false;
  return LODGING_WORDS.some((w) => host.includes(w));
}

export async function harvestFrom(domains, base) {
  const found = new Set();
  for (const domain of domains) {
    for (const path of LIST_PATHS) {
      const page = await get(`https://${domain}${path}`);
      if (!page) continue;
      for (const match of page.body.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
        const host = hostOf(match[1], page.url);
        if (!host || host === domain) continue;
        if (looksLikeLodging(host)) found.add(host);
      }
      // Trovata una pagina di elenco che rende, non serve provare tutte le altre.
      if (found.size >= 40) break;
    }
    if (found.size >= 60) break;
  }
  return [...found];
}

// --- esecuzione
const invokedDirectly = process.argv[1]?.endsWith("harvest-hotels.mjs");
if (invokedDirectly) {
  const outputPath = process.argv[2];
  const regional = new Set(Object.values(REGIONAL_DMO));
  const jobs = DESTINATIONS.map((dest) => {
    const dmo = VERIFIED_DMO[dest.key]?.domain;
    const editorial = (VERIFIED_EDITORIAL[dest.key] ?? []).map((e) => e.domain);
    // La DMO regionale copre venti territori: raccogliere da lì darebbe le
    // stesse strutture a destinazioni diverse, che è peggio di non averle.
    const sources = [dmo, ...editorial].filter((d) => d && !regional.has(d));
    return { dest, sources };
  }).filter((job) => job.sources.length);

  console.log(`Raccolgo da ${jobs.length} destinazioni con fonti proprie...`);
  const results = {};
  let done = 0;

  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const job = queue.pop();
        const hosts = await harvestFrom(job.sources, job.dest);
        if (hosts.length) results[job.dest.key] = hosts;
        done += 1;
        if (done % 10 === 0) console.log(`  ${done}/${jobs.length}`);
      }
    }),
  );

  const total = Object.values(results).flat().length;
  console.log(`\n  destinazioni con candidati  ${Object.keys(results).length}`);
  console.log(`  domini raccolti             ${total}`);
  console.log(`  domini unici                ${new Set(Object.values(results).flat()).size}`);
  await writeFile(outputPath, JSON.stringify(results, null, 1));
  console.log(`\n  scritto ${outputPath}`);
}
