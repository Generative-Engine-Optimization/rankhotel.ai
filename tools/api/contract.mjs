// =============================================================================
// IL CONTRATTO, IN FORMA ESEGUIBILE
// =============================================================================
//
// La stessa cosa che dice `src/lib/api/types.ts`, scritta in modo che un
// programma possa controllarla. Da qui nascono l'OpenAPI e la suite di
// conformità: se il backend passa `npm run api:check`, il sito ci si compila
// sopra senza sorprese.
//
// Se un tipo cambia in `types.ts`, cambia anche qui. `npm run api:check`
// valida le fixture contro questo file, quindi una divergenza si vede subito.
// =============================================================================

import { S, optional } from "./schema.mjs";

export const ENGINES = ["chatgpt", "gemini", "perplexity"];
export const FACTORS = ["comparative", "internal", "sources", "technical"];
export const LOCALES = ["it", "en"];
export const SOURCE_KINDS = ["dmo", "editorial", "ota", "other"];
export const STABILITY = ["stable", "moderate", "volatile"];
export const CRAWLER_STATES = ["allow", "block", "partial"];
export const CHECK_STATES = ["pass", "warn", "fail"];
export const LEVELS = ["comparative", "internal"];

const engineMap = (value) => S.record(value, { keys: ENGINES });
const factorMap = (value) => S.record(value, { keys: FACTORS });

// ------------------------------------------------------------- definizioni

export const DEFS = {
  LocalizedText: S.object({ it: S.string({ minLength: 1 }), en: S.string({ minLength: 1 }) }),

  Stat: S.object({
    mean: S.number(),
    stdDev: S.number({ min: 0 }),
    min: S.number(),
    max: S.number(),
    runs: S.integer({ min: 1 }),
    stability: S.enum(STABILITY),
  }),

  CrawlerMap: S.record(S.enum(CRAWLER_STATES)),

  Audit: S.object({
    score: S.score(),
    checks: S.record(S.enum(CHECK_STATES)),
  }),

  SourceMix: S.record(S.fraction(), { keys: SOURCE_KINDS }),

  Grammar: S.object({ article: S.string(), prep: S.string(), articleEn: S.string() }),

  Destination: S.object({
    key: S.key(),
    name: S.ref("LocalizedText"),
    slug: S.ref("LocalizedText"),
    region: S.string({ minLength: 1 }),
    lat: S.number({ min: 35, max: 48 }),
    lng: S.number({ min: 6, max: 19 }),
    category: S.key(),
    tags: S.array(S.key()),
    visitors: S.number({ min: 0 }),
    demand: S.number({ min: 0 }),
    demandTier: S.key(),
    grammar: S.ref("Grammar"),
    score: S.ref("Stat"),
    factors: factorMap(S.score()),
    byEngine: engineMap(S.object({ score: S.score(), rank: S.integer({ min: 1 }) })),
    categoryRank: S.integer({ min: 1 }),
    categoryRankRange: S.tuple([S.integer({ min: 1 }), S.integer({ min: 1 })]),
    categorySize: S.integer({ min: 1 }),
    nationalRank: S.integer({ min: 1 }),
    rankRange: S.tuple([S.integer({ min: 1 }), S.integer({ min: 1 })]),
    tier: S.key(),
    trend: S.number(),
    hotelsTracked: S.integer({ min: 0 }),
    topHotel: S.object({ key: S.string(), name: S.string() }),
    sourceMix: S.ref("SourceMix"),
    spark: S.array(S.number(), { minItems: 1 }),
  }),

  Category: S.object({
    key: S.key(),
    slug: S.ref("LocalizedText"),
    name: S.ref("LocalizedText"),
    short: S.ref("LocalizedText"),
    icon: S.string(),
    lead: S.ref("LocalizedText"),
    comparativeSubject: S.ref("LocalizedText"),
    size: S.integer({ min: 1 }),
    score: S.score(),
    byEngine: engineMap(S.score()),
    factors: factorMap(S.score()),
    visitors: S.number({ min: 0 }),
    hotelsTracked: S.integer({ min: 0 }),
    ranking: S.array(S.key(), { minItems: 1 }),
  }),

  HotelSummary: S.object({
    key: S.string({ minLength: 1 }),
    name: S.string({ minLength: 1 }),
    destination: S.key(),
    destinationName: S.ref("LocalizedText"),
    category: S.key(),
    // Zona della struttura. `null` dove la fonte non la dichiara: 85 hotel su
    // 300, e sono i casi in cui il sito mostra la sola destinazione.
    area: S.nullable(S.string()),
    stars: S.integer({ min: 1, max: 5 }),
    domain: S.string({ minLength: 1 }),
    synthetic: S.boolean(),
    confidence: S.enum([
      "verified",
      "registry-web",
      "registry",
      "chain",
      "guarded",
      "listed",
      "generated",
    ]),
    score: S.ref("Stat"),
    byEngine: engineMap(S.score()),
    presence: S.fraction(),
    avgPosition: S.number({ min: 0 }),
    auditScore: S.score(),
    trend: S.number(),
    destinationRank: S.integer({ min: 1 }),
  }),

  QuerySummary: S.object({
    key: S.string({ minLength: 1 }),
    destination: S.key(),
    category: S.key(),
    scope: S.enum(["destination", "category"]),
    funnel: S.key(),
    lang: S.enum(LOCALES),
    level: S.enum(LEVELS),
    cluster: S.key(),
    text: S.string({ minLength: 1 }),
    volume: S.number({ min: 0 }),
    cpc: S.number({ min: 0 }),
    yoy: S.number(),
    difficulty: S.score(),
    spark: S.array(S.number({ min: 0 }), { minItems: 1 }),
  }),

  Site: S.object({
    domain: S.string({ minLength: 1 }),
    kind: S.enum(["dmo", "editorial", "ota", "hotel"]),
    label: S.string(),
    synthetic: S.boolean(),
    verified: S.boolean(),
    holder: S.nullable(S.string()),
    scope: S.nullable(S.string()),
    source: S.nullable(S.string()),
    note: S.nullable(S.string()),
    verifiedOn: S.nullable(S.date()),
    crawlers: S.ref("CrawlerMap"),
    audit: S.ref("Audit"),
  }),

  Hotel: S.object({
    key: S.string({ minLength: 1 }),
    name: S.string({ minLength: 1 }),
    destination: S.key(),
    confidence: S.string(),
    area: S.nullable(S.string()),
    stars: S.integer({ min: 1, max: 5 }),
    domain: S.string(),
    synthetic: S.boolean(),
    chainDomain: S.boolean(),
    // Presenti solo quando la verifica automatica del dominio ha incontrato un
    // ostacolo (WAF, timeout). Assenti = verifica riuscita.
    status: optional(S.nullable(S.string())),
    note: optional(S.nullable(S.string())),
    rank: S.integer({ min: 1 }),
    score: S.ref("Stat"),
    byEngine: engineMap(
      S.object({ score: S.score(), presence: S.fraction(), position: S.number({ min: 0 }) }),
    ),
    presence: S.fraction(),
    avgPosition: S.number({ min: 0 }),
    auditScore: S.score(),
    trend: S.number(),
    crawlers: S.ref("CrawlerMap"),
    audit: S.ref("Audit"),
  }),

  Prompt: S.object({
    key: S.string({ minLength: 1 }),
    lang: S.enum(LOCALES),
    funnel: S.key(),
    level: S.enum(LEVELS),
    text: S.string({ minLength: 1 }),
    byEngine: engineMap(
      S.object({
        mentionRate: S.fraction(),
        position: S.number({ min: 0 }),
        runs: S.integer({ min: 0 }),
      }),
    ),
  }),

  AnswerBlock: S.union([
    S.object({ kind: S.const("p"), text: S.string() }),
    S.object({
      kind: S.const("list"),
      ordered: S.boolean(),
      items: S.array(S.object({ label: S.string(), text: S.string() })),
    }),
  ]),

  Answer: S.object({
    promptKey: S.string(),
    promptText: S.string(),
    subject: S.enum(["destination", "hotels"]),
    level: S.enum(LEVELS),
    funnel: S.key(),
    lang: S.enum(LOCALES),
    engine: S.enum(ENGINES),
    capturedAt: S.date(),
    run: S.integer({ min: 1 }),
    mentioned: S.boolean(),
    position: S.nullable(S.number({ min: 0 })),
    mentionRate: S.fraction(),
    hotelKeys: S.array(S.string()),
    highlights: S.array(S.string()),
    citations: S.array(
      S.object({
        index: S.nullable(S.integer()),
        domain: S.string(),
        kind: S.string(),
        label: S.string(),
        synthetic: S.boolean(),
      }),
    ),
    blocks: S.array(S.ref("AnswerBlock")),
  }),

  QueryDetail: S.object({
    key: S.string(),
    destination: S.key(),
    category: S.key(),
    scope: S.enum(["destination", "category"]),
    promptKey: S.string(),
    level: S.enum(LEVELS),
    funnel: S.key(),
    lang: S.enum(LOCALES),
    text: S.string(),
    cluster: S.key(),
    volume: S.number({ min: 0 }),
    cpc: S.number({ min: 0 }),
    yoy: S.number(),
    difficulty: S.score(),
    fanout: S.array(S.object({ text: S.string(), share: S.fraction() })),
    history: S.array(
      S.object({ month: S.month(), volume: S.number({ min: 0 }), cpc: S.number({ min: 0 }) }),
    ),
  }),

  SummaryCell: S.object({
    byEngine: engineMap(S.object({ mentionRate: S.fraction(), position: S.number({ min: 0 }) })),
    mentionRate: S.fraction(),
    prompts: S.integer({ min: 0 }),
  }),

  Tag: S.object({
    key: S.key(),
    slug: S.ref("LocalizedText"),
    icon: S.string(),
    name: S.ref("LocalizedText"),
    lead: S.ref("LocalizedText"),
    count: S.integer({ min: 1 }),
  }),

  ResponseMeta: S.object({
    generatedFor: S.date(),
    version: S.string({ minLength: 1 }),
    total: optional(S.integer({ min: 0 })),
    page: optional(S.integer({ min: 1 })),
    pageSize: optional(S.integer({ min: 1 })),
    simulated: optional(S.boolean()),
  }),

  ApiError: S.object({
    error: S.object({
      status: S.integer({ min: 400, max: 599 }),
      code: S.enum(["not_found", "bad_request", "unauthorized", "rate_limited", "server_error"]),
      message: S.string({ minLength: 1 }),
    }),
  }),
};

// -------------------------------------------------- payload degli endpoint

export const PAYLOADS = {
  meta: S.object({
    generatedFor: S.date(),
    seedVersion: S.string(),
    simulated: S.boolean(),
    engines: S.array(
      S.object({
        key: S.enum(ENGINES),
        label: S.string(),
        vendor: S.string(),
        popularityBias: S.fraction(),
        editorialBias: S.fraction(),
        officialBias: S.fraction(),
        crawlers: S.array(S.string(), { minItems: 1 }),
      }),
      { minItems: 1 },
    ),
    weights: factorMap(S.number({ min: 0, max: 100 })),
    runsPerMonth: S.integer({ min: 1 }),
    historyMonths: S.integer({ min: 1 }),
    firstMeasurement: S.month(),
    sitesVerifiedOn: S.date(),
    nationalDmo: S.object({ domain: S.string(), holder: S.string() }),
    regionalDmo: S.record(S.string()),
    hotelsPerDestination: S.integer({ min: 1 }),
    volatileThreshold: S.number({ min: 0 }),
    tiers: S.array(S.object({ key: S.key(), min: S.number(), name: S.ref("LocalizedText") }), {
      minItems: 1,
    }),
    demandTiers: S.array(
      S.object({ key: S.key(), min: S.number(), name: S.ref("LocalizedText") }),
      { minItems: 1 },
    ),
    siteKinds: S.array(
      S.object({
        key: S.key(),
        name: S.ref("LocalizedText"),
        short: S.ref("LocalizedText"),
        note: S.ref("LocalizedText"),
      }),
    ),
    crawlers: S.array(
      S.object({
        key: S.string(),
        engine: S.nullable(S.enum(ENGINES)),
        purpose: S.ref("LocalizedText"),
      }),
      { minItems: 1 },
    ),
    auditChecks: S.array(
      S.object({ key: S.key(), weight: S.number({ min: 0 }), name: S.ref("LocalizedText") }),
      { minItems: 1 },
    ),
    tags: S.array(
      S.object({
        key: S.key(),
        slug: S.ref("LocalizedText"),
        icon: S.string(),
        name: S.ref("LocalizedText"),
        lead: S.ref("LocalizedText"),
      }),
      { minItems: 1 },
    ),
  }),

  national: S.object({
    updatedAt: S.date(),
    destinations: S.integer({ min: 1 }),
    hotelsTracked: S.integer({ min: 0 }),
    sitesAudited: S.integer({ min: 0 }),
    hotelsReal: S.integer({ min: 0 }),
    hotelsVerified: S.integer({ min: 0 }),
    sitesVerified: S.integer({ min: 0 }),
    sitesGenerated: S.integer({ min: 0 }),
    promptsPerDestination: S.integer({ min: 1 }),
    runsPerMonth: S.integer({ min: 1 }),
    responsesAnalyzed: S.integer({ min: 0 }),
    score: S.score(),
    byEngine: engineMap(S.score()),
    factors: factorMap(S.score()),
    sourceMix: S.ref("SourceMix"),
    langGap: S.record(S.score(), { keys: LOCALES }),
    funnel: S.record(S.score()),
    crawlers: S.record(
      S.object({
        engine: S.nullable(S.enum(ENGINES)),
        purpose: S.ref("LocalizedText"),
        allow: S.fraction(),
        partial: S.fraction(),
        block: S.fraction(),
      }),
    ),
    topRising: S.array(
      S.object({ key: S.key(), name: S.ref("LocalizedText"), trend: S.number(), score: S.score() }),
    ),
    topFalling: S.array(
      S.object({ key: S.key(), name: S.ref("LocalizedText"), trend: S.number(), score: S.score() }),
    ),
    leaderboard: S.array(
      S.object({
        key: S.key(),
        name: S.ref("LocalizedText"),
        slug: S.ref("LocalizedText"),
        score: S.score(),
        category: S.key(),
      }),
    ),
  }),

  categories: S.array(S.ref("Category"), { minItems: 1 }),
  category: S.ref("Category"),
  destinations: S.array(S.ref("Destination"), { minItems: 1, sample: 100 }),
  hotels: S.array(S.ref("HotelSummary"), { sample: 100 }),
  queries: S.array(S.ref("QuerySummary"), { sample: 100 }),
  queriesByCategory: S.array(S.ref("QuerySummary"), { sample: 50 }),
  tags: S.array(S.ref("Tag"), { minItems: 1 }),

  prompts: S.object({
    templates: S.array(
      S.object({
        key: S.string(),
        level: S.enum(LEVELS),
        funnel: S.key(),
        lang: S.enum(LOCALES),
        template: S.string({ minLength: 1 }),
      }),
      { minItems: 1 },
    ),
    funnel: S.array(
      S.object({
        key: S.key(),
        icon: S.string(),
        inScope: S.boolean(),
        name: S.ref("LocalizedText"),
        lead: S.ref("LocalizedText"),
      }),
      { minItems: 1 },
    ),
  }),

  destination: S.object({
    // Tutti i campi dell'elenco, più il dettaglio.
    ...DEFS.Destination.fields,
    knownFor: S.array(S.string(), { minItems: 1 }),
    updatedAt: S.date(),
    runsPerMonth: S.integer({ min: 1 }),
    scoreDetail: S.object({
      overall: S.object({ score: S.ref("Stat"), factors: factorMap(S.ref("Stat")) }),
      byEngine: engineMap(
        S.object({ score: S.ref("Stat"), factors: factorMap(S.ref("Stat")) }),
      ),
    }),
    history: S.array(
      S.object({ month: S.month(), score: S.ref("Stat"), byEngine: engineMap(S.ref("Stat")) }),
      { minItems: 1 },
    ),
    entities: S.array(S.object({ name: S.string(), byEngine: engineMap(S.number({ min: 0, max: 1 })) })),
    prompts: S.object({
      comparative: S.array(S.ref("Prompt")),
      internal: S.array(S.ref("Prompt")),
    }),
    summary: S.record(S.record(S.ref("SummaryCell")), {
      keys: ["byFunnel", "byLang", "byLevel", "byFunnelLang"],
    }),
    sites: S.array(S.ref("Site"), { sample: 30 }),
    sources: S.object({
      byKind: S.ref("SourceMix"),
      top: S.array(
        S.object({
          domain: S.string(),
          kind: S.string(),
          label: S.string(),
          synthetic: S.boolean(),
          verified: S.boolean(),
          holder: S.nullable(S.string()),
          scope: S.nullable(S.string()),
          share: S.fraction(),
          occurrences: S.integer({ min: 0 }),
        }),
      ),
      quality: S.score(),
    }),
    hotels: S.array(S.ref("Hotel"), { sample: 30 }),
    queries: S.array(S.ref("QueryDetail"), { sample: 30 }),
    answers: S.object({
      destination: S.array(S.ref("Answer"), { sample: 20 }),
      hotels: S.array(S.ref("Answer"), { sample: 20 }),
    }),
    technical: engineMap(S.score()),
  }),
};

/** L'envelope completo di un endpoint: `{data, meta}`. */
export function envelopeOf(id) {
  return S.object({ data: PAYLOADS[id], meta: S.ref("ResponseMeta") });
}

// ------------------------------------------------------------------- rotte
//
// Il path di ogni endpoint, così com'è dichiarato in `src/lib/api/endpoints.ts`.
// È ripetuto qui perché questi script girano in Node e non leggono TypeScript;
// `check.mjs` confronta le due liste e fallisce se divergono.

export const ROUTES = {
  meta: { path: "/meta", collection: false },
  national: { path: "/national", collection: false },
  categories: { path: "/categories", collection: true },
  category: { path: "/categories/{key}", collection: false, sample: "mare" },
  destinations: { path: "/destinations", collection: true },
  destination: { path: "/destinations/{key}", collection: false, sample: "roma" },
  hotels: { path: "/hotels", collection: true },
  queries: { path: "/queries", collection: true },
  queriesByCategory: { path: "/queries/{category}", collection: true, sample: "mare" },
  prompts: { path: "/prompts", collection: false },
  tags: { path: "/tags", collection: true },
};
