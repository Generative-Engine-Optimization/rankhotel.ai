import { makeRandom, clamp, round } from "./prng.mjs";
import {
  ENGINES,
  ENGINE_META,
  SCORE_WEIGHTS,
  HOTELS_PER_DESTINATION,
  HISTORY_MONTHS,
  statFrom,
  weightedScore,
  monthsBack,
} from "./model.mjs";
import { OTA_SITES, CRAWLERS, AUDIT_CHECKS } from "../seed/sites.mjs";
import {
  VERIFIED_DMO,
  VERIFIED_EDITORIAL,
  REGIONAL_DMO,
  CHAIN_DOMAINS,
  DOMAIN_STATUS,
  VERIFIED_ON,
} from "../seed/verified-sites.mjs";
import { REAL_HOTELS, PREFIXES, QUALIFIERS, AREAS, STAR_MIX } from "../seed/hotels.mjs";
import { VERIFIED_HOTELS } from "../seed/verified-hotels.mjs";

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// --------------------------------------------------------------------- SITI

// Quanto è probabile che una famiglia di siti chiuda la porta a un bot AI.
// I portali editoriali e le OTA hanno un interesse economico a farlo; gli enti
// territoriali quasi mai lo decidono consapevolmente.
const BLOCK_PROBABILITY = {
  dmo: { training: 0.14, search: 0.06, index: 0.03 },
  editorial: { training: 0.46, search: 0.22, index: 0.09 },
  ota: { training: 0.78, search: 0.55, index: 0.12 },
  hotel: { training: 0.19, search: 0.1, index: 0.05 },
};

function crawlerBucket(crawler) {
  const p = crawler.purpose.en;
  if (p === "training" || p === "Common Crawl") return "training";
  if (p === "search" || p === "on-demand fetch") return "search";
  return "index";
}

// Alcuni territori hanno una postura sistematicamente più chiusa di altri:
// una singola decisione dell'ente o dell'agenzia web si propaga a tutti i loro
// siti. Senza questo, la media dei molti siti appiattirebbe tutte le
// destinazioni sullo stesso punteggio tecnico.
export function crawlPosture(random) {
  return random.float(0.35, 1.95);
}

function buildCrawlPolicy(random, kind, posture = 1) {
  const policy = {};
  for (const crawler of CRAWLERS) {
    const bucket = crawlerBucket(crawler);
    const p = clamp(BLOCK_PROBABILITY[kind][bucket] * posture, 0, 0.94);
    // Googlebot su un sito che vive di traffico organico non viene mai bloccato.
    if (crawler.key === "Googlebot" && kind !== "dmo") {
      policy[crawler.key] = "allow";
      continue;
    }
    const r = random.next();
    policy[crawler.key] = r < p ? "block" : r < p + 0.07 ? "partial" : "allow";
  }
  return policy;
}

function buildAudit(random, kind) {
  // Le OTA sono tecnicamente impeccabili, i borghi molto meno.
  const base = { dmo: 0.62, editorial: 0.68, ota: 0.88, hotel: 0.58 }[kind];
  const checks = {};
  let score = 0;
  for (const check of AUDIT_CHECKS) {
    // llms.txt è ancora rarissimo ovunque: non va premiato come se fosse comune.
    const p = check.key === "llms-txt" ? base * 0.18 : clamp(random.normal(base, 0.22), 0.02, 0.99);
    const status = p > 0.66 ? "pass" : p > 0.38 ? "warn" : "fail";
    checks[check.key] = status;
    score += check.weight * (status === "pass" ? 1 : status === "warn" ? 0.5 : 0);
  }
  return { score: round(score, 0), checks };
}

function buildSites(dest, random, posture = 1) {
  const slug = dest.slug.it;
  const sites = [];

  const push = (domain, kind, label, extra = {}) =>
    sites.push({
      domain,
      kind,
      label,
      synthetic: extra.verified !== true,
      verified: extra.verified === true,
      holder: extra.holder ?? null,
      scope: extra.scope ?? "destination",
      source: extra.source ?? null,
      note: extra.note ?? null,
      verifiedOn: extra.verified === true ? VERIFIED_ON : null,
      crawlers: buildCrawlPolicy(random, kind, posture),
      audit: buildAudit(random, kind),
    });

  // --- Un solo sito ufficiale per destinazione.
  //
  // Prima ne uscivano due su 43 destinazioni su 100, entrambe varianti dello
  // stesso slug. Il fattore "chi ne parla" misura la quota di citazioni che va
  // al sito ufficiale: con due denominatori diversi la classifica su quel
  // fattore non era leggibile.
  const own = VERIFIED_DMO[dest.key];
  if (own) {
    push(own.domain, "dmo", own.holder, {
      verified: true,
      holder: own.holder,
      note: own.note,
    });
  } else {
    // Senza ente proprio, il soggetto che promuove davvero il territorio è la
    // regione. Un dominio inventato al suo posto renderebbe inservibile
    // proprio la misura per cui esiste questa famiglia di siti.
    const regional = REGIONAL_DMO[dest.region];
    if (regional) {
      push(regional, "dmo", `Turismo ${dest.region}`, {
        verified: true,
        holder: `DMO regionale ${dest.region}`,
        scope: "regional",
      });
    } else {
      push(`visit-${slug}.it`, "dmo", `Visit ${dest.name.it}`);
    }
  }

  // --- Editoriali: uno verificato dove esiste, il resto ancora generato.
  const editorials = VERIFIED_EDITORIAL[dest.key] ?? [];
  for (const row of editorials.slice(0, 2)) {
    push(row.domain, "editorial", row.holder ?? row.domain, {
      verified: true,
      holder: row.holder,
      source: row.source,
    });
  }
  // Solo se i verificati non bastano si ricorre a un dominio generato, e resta
  // marcato come tale invece di far numero fingendo di esistere.
  if (editorials.length === 0) {
    push(`guida-${slug}.it`, "editorial", `Guida ${dest.name.it}`);
  }

  for (const ota of random.shuffle(OTA_SITES).slice(0, 4)) {
    push(ota.domain, "ota", ota.label, { verified: true, scope: "national" });
  }

  return sites.map((site) => ({ ...site, ...(DOMAIN_STATUS[site.domain] ?? {}) }));
}

// ------------------------------------------------------------------- HOTEL

function generateHotelName(dest, random, index) {
  const prefix = random.pick(PREFIXES[dest.category]);
  // Metà dei nomi usa un toponimo reale della destinazione, metà un qualificatore
  // generico: è il mix che si trova davvero nelle liste alberghiere italiane.
  const useToponym = random.bool(0.4) && dest.knownFor.length > 0;
  let tail;
  if (useToponym) {
    // Dal nome dell'entità si tiene la coda significativa, scartando le
    // preposizioni: "Val di Funes" -> "Funes", non "di Funes".
    const STOP = ["di", "del", "della", "dei", "degli", "delle", "da", "a", "e", "il", "la", "lo", "al", "alla"];
    const words = random.pick(dest.knownFor).split(" ");
    // Si scorre dalla coda cercando l'ultima parola piena: "Sentiero degli Dei"
    // deve dare "Sentiero", non "degli".
    tail = "";
    for (let k = words.length - 1; k >= 0; k -= 1) {
      if (!STOP.includes(words[k].toLowerCase()) && words[k].length > 2) {
        tail = words[k];
        break;
      }
    }
    if (!tail) tail = random.pick(QUALIFIERS[dest.category]);
  } else {
    tail = random.pick(QUALIFIERS[dest.category]);
  }
  return `${prefix} ${tail}`.replace(/\s+/g, " ").trim();
}

function buildHotels(dest, random, posture = 1) {
  // Prima le strutture verificate: esistono, e il sito lo può dire.
  // Ordine di preferenza: prima quelle su cui sappiamo di più. Un registro
  // pubblico prova che la struttura esiste; un dominio che risponde col suo
  // nome prova anche che è raggiungibile, e per un osservatorio sulla
  // visibilità la seconda cosa conta quanto la prima.
  const rank = { verified: 0, "registry-web": 1, chain: 2, guarded: 3, registry: 4, listed: 5 };
  const verified = [...(VERIFIED_HOTELS[dest.key] ?? [])]
    .sort((a, b) => (rank[a.confidence] ?? 9) - (rank[b.confidence] ?? 9))
    .map((hotel) => ({
    name: hotel.name,
    area: hotel.area,
    stars: hotel.stars,
    domain: hotel.domain,
    synthetic: false,
    confidence: hotel.confidence,
  }));

  // Poi quelle rimaste dal vecchio elenco, se non già coperte.
  const legacy = (REAL_HOTELS[dest.key] ?? [])
    .map(([name, area, stars, domain]) => ({
      name,
      area,
      stars,
      domain,
      synthetic: false,
      confidence: "listed",
    }))
    .filter((h) => !verified.some((v) => v.name === h.name));

  const real = [...verified, ...legacy];
  const used = new Set(real.map((h) => h.name));
  const generated = [];
  let guard = 0;
  while (real.length + generated.length < HOTELS_PER_DESTINATION && guard < 400) {
    guard += 1;
    const name = generateHotelName(dest, random, generated.length);
    if (used.has(name)) continue;
    used.add(name);
    generated.push({
      name,
      area: random.pick(AREAS[dest.category]),
      stars: STAR_MIX[(real.length + generated.length) % STAR_MIX.length],
      domain: `${slugify(name)}.it`,
      synthetic: true,
      confidence: "generated",
    });
  }

  return [...real, ...generated].slice(0, HOTELS_PER_DESTINATION).map((hotel) => ({
    ...hotel,
    key: `${dest.key}--${slugify(hotel.name)}`,
    destination: dest.key,
    // Su un dominio di catena la decisione su chi può leggere il sito la
    // prende il gruppo, non l'albergatore. Dichiararlo cambia come si legge
    // il dato tecnico di quella riga.
    chainDomain: CHAIN_DOMAINS.includes(hotel.domain),
    ...(DOMAIN_STATUS[hotel.domain] ?? {}),
    crawlers: buildCrawlPolicy(random, "hotel", posture),
    audit: buildAudit(random, "hotel"),
  }));
}

// ------------------------------------------------------ ACCESSIBILITÀ TECNICA

// Quota di bot di un engine ammessi, pesata per importanza della famiglia di siti.
const KIND_WEIGHT = { dmo: 0.4, editorial: 0.25, hotel: 0.25, ota: 0.1 };

export function technicalByEngine(sites, hotels) {
  const groups = { dmo: [], editorial: [], ota: [], hotel: [] };
  for (const site of sites) groups[site.kind].push(site);
  for (const hotel of hotels) groups.hotel.push(hotel);

  const out = {};
  for (const engine of ENGINES) {
    const bots = ENGINE_META[engine].crawlers;
    let acc = 0;
    let weightUsed = 0;
    for (const [kind, weight] of Object.entries(KIND_WEIGHT)) {
      const list = groups[kind];
      if (!list.length) continue;
      let open = 0;
      let auditSum = 0;
      for (const site of list) {
        const states = bots.map((b) => site.crawlers[b]);
        const score =
          states.reduce((s, st) => s + (st === "allow" ? 1 : st === "partial" ? 0.5 : 0), 0) /
          states.length;
        open += score;
        auditSum += site.audit.score;
      }
      const openness = open / list.length;
      const audit = auditSum / list.length / 100;
      // 60% accesso dei bot, 40% qualità tecnica: un sito perfettamente
      // ottimizzato ma chiuso ai bot non serve a niente, e viceversa.
      acc += weight * (openness * 0.6 + audit * 0.4) * 100;
      weightUsed += weight;
    }
    out[engine] = round(acc / weightUsed, 1);
  }
  return out;
}

// -------------------------------------------------------- FONTI CITATE (mix)

export function buildSourceMix(dest, random, sites) {
  // Dove la DMO è debole, le OTA occupano lo spazio: la correlazione è il
  // messaggio centrale dell'osservatorio, non un dettaglio.
  const dmoStrength = clamp(
    random.normal(
      sites.filter((s) => s.kind === "dmo").reduce((sum, s) => sum + s.audit.score, 0) /
        Math.max(1, sites.filter((s) => s.kind === "dmo").length) /
        100,
      0.12,
    ),
    0.1,
    0.95,
  );
  const otaPull = dest.tags.includes("family") || dest.category === "mare" ? 0.12 : 0;

  let dmo = clamp(random.normal(0.1 + dmoStrength * 0.22, 0.04), 0.02, 0.42);
  let ota = clamp(random.normal(0.46 - dmoStrength * 0.2 + otaPull, 0.07), 0.12, 0.72);
  let editorial = clamp(random.normal(0.3, 0.07), 0.08, 0.55);
  let other = Math.max(0.03, 1 - dmo - ota - editorial);

  const total = dmo + ota + editorial + other;
  dmo /= total;
  ota /= total;
  editorial /= total;
  other /= total;

  const top = [];
  for (const site of sites) {
    const share =
      site.kind === "ota"
        ? ota / sites.filter((s) => s.kind === "ota").length
        : site.kind === "dmo"
          ? dmo / sites.filter((s) => s.kind === "dmo").length
          : editorial / sites.filter((s) => s.kind === "editorial").length;
    top.push({
      domain: site.domain,
      kind: site.kind,
      label: site.label,
      synthetic: site.synthetic,
      verified: site.verified,
      holder: site.holder,
      scope: site.scope,
      share: round(share * random.float(0.82, 1.18), 3),
      occurrences: Math.round(share * random.float(600, 2400)),
    });
  }
  top.sort((a, b) => b.share - a.share);

  return {
    byKind: {
      dmo: round(dmo, 3),
      editorial: round(editorial, 3),
      ota: round(ota, 3),
      other: round(other, 3),
    },
    top,
    // Il fattore "qualità delle fonti" 0-100: una citazione al sito ufficiale
    // vale piena, una editoriale tre quarti, una OTA un quarto.
    quality: round(
      clamp((dmo * 1 + editorial * 0.72 + ota * 0.22 + other * 0.12) * 108, 0, 100),
      1,
    ),
  };
}

export { buildSites, buildHotels, slugify };
