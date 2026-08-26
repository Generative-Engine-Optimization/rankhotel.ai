#!/usr/bin/env node
// Generatore del dataset dell'osservatorio.
//
// Tutto ciò che il sito mostra nasce da qui. Il PRNG è seminato per chiave, per
// cui l'output è identico a ogni esecuzione: i JSON stanno in git e un diff
// deve significare "ho cambiato il modello", non "ho rilanciato lo script".
//
// Questo file è anche la specifica eseguibile dello schema: quando arriverà il
// backend reale dovrà produrre esattamente questa forma.

import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { makeRandom, clamp, round } from "./lib/prng.mjs";
import {
  TIERS,
  DEMAND_TIERS,
  ENGINES,
  ENGINE_META,
  SCORE_WEIGHTS,
  RUNS_PER_MONTH,
  HISTORY_MONTHS,
  HOTELS_PER_DESTINATION,
  VOLATILE_THRESHOLD,
  statFrom,
  popularityOf,
  tierOf,
  indistinguishable,
  demandTierOf,
} from "./lib/model.mjs";
import {
  buildSites,
  buildHotels,
  buildSourceMix,
  technicalByEngine,
  crawlPosture,
} from "./lib/build-destination.mjs";
import {
  buildFactors,
  withRuns,
  buildHistory,
  buildPromptResults,
  buildEntityCoverage,
  summarise,
} from "./lib/build-scores.mjs";
import { buildQueries, compactQuery } from "./lib/build-queries.mjs";
import { buildAnswers } from "./lib/build-answers.mjs";

import { CATEGORIES, TAGS } from "./seed/categories.mjs";
import { deriveTags } from "./lib/derive-tags.mjs";
import { DESTINATIONS } from "./seed/destinations.mjs";
import { PROMPTS, FUNNEL_STAGES } from "./seed/prompts.mjs";
import { SITE_KINDS, CRAWLERS, AUDIT_CHECKS } from "./seed/sites.mjs";
import { grammarFor } from "./seed/grammar.mjs";
import { VERIFIED_ON, REGIONAL_DMO, NATIONAL_DMO } from "./seed/verified-sites.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/data/observatory");

// Data di riferimento fissa: passarla come argomento (o lasciare il default)
// tiene il dataset riproducibile. Date.now() renderebbe il diff instabile.
const TODAY = process.argv[2] ?? "2026-10-01";
const SEED_VERSION = "v1";

const write = async (path, data) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data)}\n`);
  return JSON.stringify(data).length;
};

// --------------------------------------------------------------------- HOTEL

function scoreHotels(dest, random, hotels, destFactors, popularity) {
  const scored = hotels.map((hotel, index) => {
    // Le stelle contano, ma non decidono: un 4 stelle con un sito in ordine
    // può battere un 5 stelle chiuso ai bot. È il messaggio commerciale.
    const starLift = (hotel.stars - 3) * 7;
    const chainLift = hotel.domain.match(/marriott|hilton|accor|hyatt|ihg|belmond|aman|fourseasons/) ? 6 : 0;

    const byEngine = {};
    for (const engine of ENGINES) {
      const bots = ENGINE_META[engine].crawlers;
      const openness =
        bots.reduce(
          (s, b) => s + (hotel.crawlers[b] === "allow" ? 1 : hotel.crawlers[b] === "partial" ? 0.5 : 0),
          0,
        ) / bots.length;
      const base =
        destFactors.byEngine[engine].factors.comparative * 0.45 +
        starLift +
        chainLift +
        hotel.audit.score * 0.18 +
        openness * 22 +
        random.normal(0, 7);
      const score = clamp(base, 2, 99);
      byEngine[engine] = {
        score: round(score, 1),
        presence: round(clamp(score / 100 + random.normal(0, 0.06), 0, 1), 3),
        position: round(clamp(1 + (1 - score / 100) * 12 + random.normal(0, 1), 1, 15), 1),
      };
    }

    const overall = round(
      ENGINES.reduce((s, e) => s + byEngine[e].score, 0) / ENGINES.length,
      1,
    );
    const volatility = 2.6 + (1 - popularity) * 4;

    return {
      ...hotel,
      score: statFrom(random, overall, volatility),
      byEngine,
      presence: round(
        ENGINES.reduce((s, e) => s + byEngine[e].presence, 0) / ENGINES.length,
        3,
      ),
      avgPosition: round(
        ENGINES.reduce((s, e) => s + byEngine[e].position, 0) / ENGINES.length,
        1,
      ),
      trend: Math.round(random.normal(0, 3)),
      auditScore: hotel.audit.score,
    };
  });

  scored.sort((a, b) => b.score.mean - a.score.mean);
  return scored.map((hotel, index) => ({ ...hotel, rank: index + 1 }));
}

// ---------------------------------------------------------------- COSTRUZIONE

const visitorsList = DESTINATIONS.map((d) => d.visitors);
const MIN_V = Math.min(...visitorsList);
const MAX_V = Math.max(...visitorsList);

const categoryByKey = new Map(CATEGORIES.map((c) => [c.key, c]));

console.log(`Genero l'osservatorio — riferimento ${TODAY}, seed ${SEED_VERSION}`);

const built = DESTINATIONS.map((seedDest) => {
  // I temi si derivano prima di ogni altra cosa: tutto il resto li vede già.
  const dest = { ...seedDest, tags: deriveTags(seedDest) };
  const random = makeRandom(`${dest.key}|${SEED_VERSION}`);
  const category = categoryByKey.get(dest.category);
  const popularity = popularityOf(dest.visitors, MIN_V, MAX_V);

  const posture = crawlPosture(random);
  const sites = buildSites(dest, random, posture);
  const hotels = buildHotels(dest, random, posture);
  const technical = technicalByEngine(sites, hotels);
  const sourceMix = buildSourceMix(dest, random, sites);

  const factors = buildFactors(dest, random, { popularity, sourceMix, technical });
  const runs = withRuns(random, factors, popularity);
  const history = buildHistory(dest, random, runs, popularity, TODAY);
  const promptResults = buildPromptResults(dest, random, factors, category);
  const entities = buildEntityCoverage(dest, random, factors);
  const summary = summarise(promptResults);
  const scoredHotels = scoreHotels(dest, random, hotels, factors, popularity);
  const queries = buildQueries(dest, category, random, popularity, TODAY);
  const demand = queries.reduce((sum, query) => sum + query.volume, 0);

  // Il delta rispetto alla prima rilevazione. Con tre mesi di storico non si
  // può parlare di andamento annuale, e fingere di poterlo fare sarebbe il
  // primo numero inventato di un osservatorio che non ne vuole inventare.
  const first = history[0];
  const trend = round(runs.overall.score.mean - first.score.mean, 1);

  return {
    dest,
    category,
    popularity,
    posture,
    sites,
    technical,
    sourceMix,
    factors,
    runs,
    history,
    promptResults,
    entities,
    summary,
    hotels: scoredHotels,
    queries,
    demand,
    demandTier: demandTierOf(demand),
    trend,
  };
});

// ------------------------------------------------------------------ CONTROLLI
// Le due identità dichiarate in metodologia. Se saltano, il dataset è
// incoerente con ciò che il sito racconta e non deve nemmeno essere scritto.
for (const row of built) {
  const weighted = (f) =>
    Object.entries(SCORE_WEIGHTS).reduce((sum, [key, w]) => sum + f[key] * w, 0) / 100;

  for (const engine of ENGINES) {
    const block = row.runs.byEngine[engine];
    const expected = weighted(
      Object.fromEntries(Object.entries(block.factors).map(([k, v]) => [k, v.mean])),
    );
    if (Math.abs(expected - block.score.mean) > 0.15) {
      throw new Error(
        `${row.dest.key}/${engine}: i fattori pesati danno ${expected.toFixed(2)} ma lo score è ${block.score.mean}`,
      );
    }
  }

  const engineMean =
    ENGINES.reduce((sum, e) => sum + row.runs.byEngine[e].score.mean, 0) / ENGINES.length;
  if (Math.abs(engineMean - row.runs.overall.score.mean) > 0.15) {
    throw new Error(
      `${row.dest.key}: la media degli engine è ${engineMean.toFixed(2)} ma il generale è ${row.runs.overall.score.mean}`,
    );
  }
}
for (const row of built) {
  const last = row.history[row.history.length - 1];
  if (Math.abs(last.score.mean - row.runs.overall.score.mean) > 0.001) {
    throw new Error(
      `${row.dest.key}: lo storico finisce su ${last.score.mean} ma lo score pubblicato è ${row.runs.overall.score.mean}`,
    );
  }
}
console.log("  identità dello score verificate su tutte le destinazioni");

// Classifiche: per categoria e nazionale.
const byCategory = new Map(CATEGORIES.map((c) => [c.key, []]));
for (const row of built) byCategory.get(row.dest.category).push(row);
for (const list of byCategory.values()) {
  // Ordinare su un numero e mostrarne un altro è il modo più veloce per
  // perdere la fiducia di chi legge la tabella.
  list.sort((a, b) => b.runs.overall.score.mean - a.runs.overall.score.mean);
  list.forEach((row, index) => {
    row.categoryRank = index + 1;
    row.categorySize = list.length;
  });
  for (const row of list) {
    let from = row.categoryRank;
    let to = row.categoryRank;
    for (const other of list) {
      if (other === row) continue;
      if (indistinguishable(row.runs.overall.score, other.runs.overall.score)) {
        from = Math.min(from, other.categoryRank);
        to = Math.max(to, other.categoryRank);
      }
    }
    row.categoryRankRange = [from, to];
  }
}

const national = [...built].sort(
  (a, b) => b.runs.overall.score.mean - a.runs.overall.score.mean,
);
national.forEach((row, index) => {
  row.nationalRank = index + 1;
  row.tier = tierOf(row.runs.overall.score.mean);
});

// L'intervallo di posizioni in cui la destinazione può davvero trovarsi.
// Pubblicare "38ª" e basta, accanto a una banda di ±3, è la contraddizione
// che questo osservatorio esiste per non commettere: la posizione secca
// suggerisce una precisione che cinque run al mese non producono.
for (const row of national) {
  let from = row.nationalRank;
  let to = row.nationalRank;
  for (const other of national) {
    if (other === row) continue;
    if (indistinguishable(row.runs.overall.score, other.runs.overall.score)) {
      from = Math.min(from, other.nationalRank);
      to = Math.max(to, other.nationalRank);
    }
  }
  row.rankRange = [from, to];
}

// Classifica nazionale anche per singolo engine: è la ragione d'essere delle
// pagine /engine/{nome}, dove le posizioni cambiano davvero.
const rankByEngine = {};
for (const engine of ENGINES) {
  const sorted = [...built].sort(
    (a, b) => b.runs.byEngine[engine].score.mean - a.runs.byEngine[engine].score.mean,
  );
  rankByEngine[engine] = new Map(sorted.map((row, index) => [row.dest.key, index + 1]));
}

// ------------------------------------------------------------------- RISPOSTE
// Si costruiscono per ultime, dopo le classifiche: l'elenco che un engine
// restituisce su una domanda comparativa deve essere ordinato come la
// classifica pubblicata, altrimenti la risposta contraddice la tabella che
// sta due sezioni più sopra.
for (const row of built) {
  const peers = byCategory.get(row.dest.category);
  row.answers = buildAnswers(row, {
    peers,
    random: makeRandom(`${row.dest.key}|answers|${SEED_VERSION}`),
    today: TODAY,
  });
}
console.log(
  `  ${built.reduce((s, r) => s + r.answers.destination.length + r.answers.hotels.length, 0)} risposte ricostruite`,
);

// ------------------------------------------------------------------ SCRITTURA

await rm(join(OUT), { recursive: true, force: true });
await mkdir(join(OUT, "destinations"), { recursive: true });

let bytes = 0;

const summaryFor = (row) => ({
  key: row.dest.key,
  name: row.dest.name,
  slug: row.dest.slug,
  region: row.dest.region,
  lat: row.dest.lat,
  lng: row.dest.lng,
  category: row.dest.category,
  tags: row.dest.tags,
  visitors: row.dest.visitors,
  demand: row.demand,
  demandTier: row.demandTier,
  grammar: grammarFor(row.dest.key),
  score: row.runs.overall.score,
  // Ovunque nel sito compare la media delle run, mai la stima puntuale: due
  // numeri per la stessa grandezza sono un numero sbagliato.
  factors: Object.fromEntries(
    Object.entries(row.runs.overall.factors).map(([key, stat]) => [key, stat.mean]),
  ),
  byEngine: Object.fromEntries(
    ENGINES.map((e) => [
      e,
      {
        score: row.runs.byEngine[e].score.mean,
        rank: rankByEngine[e].get(row.dest.key),
      },
    ]),
  ),
  categoryRank: row.categoryRank,
  categoryRankRange: row.categoryRankRange,
  categorySize: row.categorySize,
  nationalRank: row.nationalRank,
  rankRange: row.rankRange,
  tier: row.tier,
  trend: row.trend,
  hotelsTracked: row.hotels.length,
  topHotel: { key: row.hotels[0].key, name: row.hotels[0].name },
  sourceMix: row.sourceMix.byKind,
  spark: row.history.map((h) => h.score.mean),
});

bytes += await write(join(OUT, "destinations.json"), built.map(summaryFor));

for (const row of built) {
  bytes += await write(join(OUT, "destinations", `${row.dest.key}.json`), {
    ...summaryFor(row),
    knownFor: row.dest.knownFor,
    updatedAt: TODAY,
    runsPerMonth: RUNS_PER_MONTH,
    scoreDetail: row.runs,
    history: row.history,
    entities: row.entities,
    prompts: row.promptResults,
    summary: row.summary,
    sites: row.sites,
    sources: row.sourceMix,
    hotels: row.hotels,
    queries: row.queries,
    answers: row.answers,
    technical: row.technical,
  });
}

bytes += await write(
  join(OUT, "categories.json"),
  CATEGORIES.map((category) => {
    const list = byCategory.get(category.key);
    const avg = (pick) => round(list.reduce((s, r) => s + pick(r), 0) / list.length, 1);
    return {
      ...category,
      size: list.length,
      score: avg((r) => r.runs.overall.score.mean),
      byEngine: Object.fromEntries(
        ENGINES.map((e) => [e, avg((r) => r.runs.byEngine[e].score.mean)]),
      ),
      factors: {
        comparative: avg((r) => r.runs.overall.factors.comparative.mean),
        internal: avg((r) => r.runs.overall.factors.internal.mean),
        sources: avg((r) => r.runs.overall.factors.sources.mean),
        technical: avg((r) => r.runs.overall.factors.technical.mean),
      },
      visitors: list.reduce((s, r) => s + r.dest.visitors, 0),
      hotelsTracked: list.reduce((s, r) => s + r.hotels.length, 0),
      ranking: list.map((r) => r.dest.key),
    };
  }),
);

// Classifica nazionale hotel: i migliori 120, con la destinazione a cui
// appartengono. Lo storico completo resta nel file della destinazione.
const allHotels = built.flatMap((row) =>
  row.hotels.map((hotel) => ({
    key: hotel.key,
    name: hotel.name,
    destination: row.dest.key,
    destinationName: row.dest.name,
    category: row.dest.category,
    area: hotel.area,
    stars: hotel.stars,
    domain: hotel.domain,
    synthetic: hotel.synthetic,
    confidence: hotel.confidence,
    score: hotel.score,
    byEngine: Object.fromEntries(ENGINES.map((e) => [e, hotel.byEngine[e].score])),
    presence: hotel.presence,
    avgPosition: hotel.avgPosition,
    auditScore: hotel.auditScore,
    trend: hotel.trend,
    destinationRank: hotel.rank,
  })),
);
allHotels.sort((a, b) => b.score.mean - a.score.mean);
// La pagina hotel filtra su tutto l'insieme: 300 righe bastano a coprire ogni
// territorio con le sue migliori, senza spedire duemila record a chi apre.
bytes += await write(join(OUT, "hotels.json"), allHotels.slice(0, 300));

// Indice globale delle query per la pagina fan-out.
const allQueries = built.flatMap((row) => row.queries.map(compactQuery));
allQueries.sort((a, b) => b.volume - a.volume);
bytes += await write(join(OUT, "queries.json"), allQueries);

bytes += await write(join(OUT, "prompts.json"), {
  templates: PROMPTS,
  funnel: FUNNEL_STAGES,
});

// ---- aggregati nazionali
const avgAll = (pick) => round(built.reduce((s, r) => s + pick(r), 0) / built.length, 1);
const crawlerStats = {};
for (const crawler of CRAWLERS) {
  let allow = 0;
  let block = 0;
  let partial = 0;
  for (const row of built) {
    for (const site of [...row.sites, ...row.hotels]) {
      const state = site.crawlers[crawler.key];
      if (state === "allow") allow += 1;
      else if (state === "block") block += 1;
      else partial += 1;
    }
  }
  const total = allow + block + partial;
  crawlerStats[crawler.key] = {
    engine: crawler.engine,
    purpose: crawler.purpose,
    allow: round(allow / total, 3),
    partial: round(partial / total, 3),
    block: round(block / total, 3),
  };
}

const movers = [...built].sort((a, b) => b.trend - a.trend);

bytes += await write(join(OUT, "national.json"), {
  updatedAt: TODAY,
  destinations: built.length,
  hotelsTracked: built.reduce((s, r) => s + r.hotels.length, 0),
  sitesAudited: built.reduce((s, r) => s + r.sites.length + r.hotels.length, 0),
  hotelsReal: built.reduce(
    (s, r) => s + r.hotels.filter((h) => !h.synthetic).length,
    0,
  ),
  hotelsVerified: built.reduce(
    (s, r) => s + r.hotels.filter((h) => h.confidence === "verified").length,
    0,
  ),
  sitesVerified: built.reduce(
    (s, r) => s + r.sites.filter((site) => site.verified).length,
    0,
  ),
  sitesGenerated: built.reduce(
    (s, r) => s + r.sites.filter((site) => !site.verified).length,
    0,
  ),
  promptsPerDestination: PROMPTS.length,
  runsPerMonth: RUNS_PER_MONTH,
  responsesAnalyzed:
    built.length * PROMPTS.length * RUNS_PER_MONTH * ENGINES.length,
  score: avgAll((r) => r.runs.overall.score.mean),
  byEngine: Object.fromEntries(
    ENGINES.map((e) => [e, avgAll((r) => r.runs.byEngine[e].score.mean)]),
  ),
  factors: {
    comparative: avgAll((r) => r.runs.overall.factors.comparative.mean),
    internal: avgAll((r) => r.runs.overall.factors.internal.mean),
    sources: avgAll((r) => r.runs.overall.factors.sources.mean),
    technical: avgAll((r) => r.runs.overall.factors.technical.mean),
  },
  sourceMix: {
    dmo: avgAll((r) => r.sourceMix.byKind.dmo * 100) / 100,
    editorial: avgAll((r) => r.sourceMix.byKind.editorial * 100) / 100,
    ota: avgAll((r) => r.sourceMix.byKind.ota * 100) / 100,
    other: avgAll((r) => r.sourceMix.byKind.other * 100) / 100,
  },
  langGap: {
    it: avgAll((r) => r.summary.byLang.it.mentionRate * 100),
    en: avgAll((r) => r.summary.byLang.en.mentionRate * 100),
  },
  funnel: Object.fromEntries(
    ["dreaming", "planning", "booking"].map((stage) => [
      stage,
      avgAll((r) => r.summary.byFunnel[stage].mentionRate * 100),
    ]),
  ),
  crawlers: crawlerStats,
  topRising: movers.slice(0, 8).map((r) => ({ key: r.dest.key, name: r.dest.name, trend: r.trend, score: r.runs.overall.score.mean })),
  topFalling: movers.slice(-8).reverse().map((r) => ({ key: r.dest.key, name: r.dest.name, trend: r.trend, score: r.runs.overall.score.mean })),
  leaderboard: national.slice(0, 10).map((r) => ({ key: r.dest.key, name: r.dest.name, slug: r.dest.slug, score: r.runs.overall.score.mean, category: r.dest.category })),
});

bytes += await write(join(OUT, "meta.json"), {
  generatedFor: TODAY,
  seedVersion: SEED_VERSION,
  simulated: true,
  engines: ENGINES.map((key) => ({ key, ...ENGINE_META[key], crawlers: ENGINE_META[key].crawlers })),
  weights: SCORE_WEIGHTS,
  runsPerMonth: RUNS_PER_MONTH,
  historyMonths: HISTORY_MONTHS,
  firstMeasurement: "2026-08",
  sitesVerifiedOn: VERIFIED_ON,
  nationalDmo: NATIONAL_DMO,
  regionalDmo: REGIONAL_DMO,
  hotelsPerDestination: HOTELS_PER_DESTINATION,
  volatileThreshold: VOLATILE_THRESHOLD,
  tiers: TIERS,
  demandTiers: DEMAND_TIERS,
  siteKinds: SITE_KINDS,
  crawlers: CRAWLERS,
  auditChecks: AUDIT_CHECKS,
  tags: TAGS,
});

console.log(`  destinazioni  ${built.length}`);
console.log(`  hotel         ${built.reduce((s, r) => s + r.hotels.length, 0)}`);
console.log(`  siti auditati ${built.reduce((s, r) => s + r.sites.length + r.hotels.length, 0)}`);
console.log(`  query         ${allQueries.length}`);
console.log(`  peso totale   ${(bytes / 1024 / 1024).toFixed(2)} MB`);
