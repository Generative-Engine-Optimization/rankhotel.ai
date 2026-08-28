// =============================================================================
// CONTRATTO API — Italian AI Visibility Report
// =============================================================================
//
// Questo file è la specifica che il backend deve rispettare. È autosufficiente:
// non importa nulla dal resto del sito, e chi scrive le API non ha bisogno di
// leggere altro codice per sapere che forma devono avere le risposte.
//
// Regole valide per tutti gli endpoint:
//
//   1. Ogni risposta 2xx è un ENVELOPE `{ data, meta }` (vedi `Envelope`).
//   2. Ogni risposta di errore è `{ error: { status, code, message } }`.
//   3. I campi `Record<string, ...>` indicizzati per engine contengono SEMPRE
//      tutte e tre le chiavi engine: nessun engine può mancare.
//   4. I testi rivolti all'utente sono `LocalizedText` — mai stringhe nude.
//   5. Le percentuali sono frazioni 0–1. I punteggi sono 0–100 con un decimale.
//   6. Le chiavi (`key`, `slug`) sono stabili nel tempo: sono URL pubbliche.
//
// La verifica automatica di tutto questo sta in `tools/api/check.mjs`
// (`npm run api:check`), che valida sia le fixture sia un backend vero.
// =============================================================================

// ------------------------------------------------------------------ primitivi

export type Locale = "it" | "en";

/** Testo tradotto. Entrambe le lingue sono obbligatorie. */
export type LocalizedText = { it: string; en: string };

export type EngineKey = "chatgpt" | "gemini" | "perplexity";

/** I quattro fattori che compongono il punteggio. I pesi stanno in `MetaDTO.weights`. */
export type FactorKey = "comparative" | "internal" | "sources" | "technical";

/** Quanto il punteggio oscilla fra le run del mese. Soglia in `MetaDTO.volatileThreshold`. */
export type Stability = "stable" | "moderate" | "volatile";

export type FunnelKey = "dreaming" | "planning" | "booking" | (string & {});

export type PromptLevel = "comparative" | "internal";

export type SiteKind = "dmo" | "editorial" | "ota" | "hotel";

/** Come un sito tratta un bot, letto da robots.txt. */
export type CrawlerState = "allow" | "block" | "partial";

/** Esito di un singolo controllo tecnico. */
export type CheckState = "pass" | "warn" | "fail";

/**
 * Una misura ripetuta. Mai un numero nudo: il sito mostra sempre media e
 * dispersione, perché cinque run al mese non producono un valore esatto.
 */
export type Stat = {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  /** Quante run hanno prodotto questa misura. */
  runs: number;
  stability: Stability;
};

/** Stato dei bot su un dominio, chiave = nome del crawler (`MetaDTO.crawlers[].key`). */
export type CrawlerMap = Record<string, CrawlerState>;

/** Audit tecnico di un dominio. `checks` è indicizzato su `MetaDTO.auditChecks[].key`. */
export type Audit = { score: number; checks: Record<string, CheckState> };

// ------------------------------------------------------------------- envelope

/**
 * Metadati di risposta. `generatedFor` e `version` sono obbligatori ovunque:
 * servono al frontend per dire in pagina a quale mese si riferiscono i numeri.
 * I campi di paginazione compaiono solo sugli endpoint di elenco.
 */
export type ResponseMeta = {
  /** Mese di riferimento del dato, `YYYY-MM-DD`. */
  generatedFor: string;
  /** Versione del contratto servita. Oggi `"v1"`. */
  version: string;
  /** Righe totali che soddisfano i filtri, prima della paginazione. */
  total?: number;
  page?: number;
  pageSize?: number;
  /** `true` se i dati sono generati e non misurati. Il sito lo dichiara in pagina. */
  simulated?: boolean;
};

export type Envelope<T> = { data: T; meta: ResponseMeta };

export type ApiErrorBody = {
  error: {
    status: number;
    /** Codice stabile, non tradotto: il frontend ci fa `switch`. */
    code:
      | "not_found"
      | "bad_request"
      | "unauthorized"
      | "rate_limited"
      | "server_error";
    message: string;
  };
};

/** Elenco paginato, come lo restituisce il client dopo aver aperto l'envelope. */
export type Page<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
};

// ----------------------------------------------------------------- GET /meta

export type EngineMeta = {
  key: EngineKey;
  label: string;
  vendor: string;
  /** Quanto l'engine segue la popolarità della destinazione. 0–1. */
  popularityBias: number;
  editorialBias: number;
  officialBias: number;
  /** I bot di questo engine, chiavi di `MetaDTO.crawlers`. */
  crawlers: string[];
};

export type CrawlerMeta = {
  key: string;
  /** `null` per i bot che non appartengono a un assistente (CCBot). */
  engine: EngineKey | null;
  purpose: LocalizedText;
};

export type TierMeta = {
  key: string;
  /** Punteggio minimo per rientrare nella fascia. Le fasce sono ordinate dall'alto. */
  min: number;
  name: LocalizedText;
};

export type SiteKindMeta = {
  key: SiteKind;
  name: LocalizedText;
  short: LocalizedText;
  note: LocalizedText;
};

export type AuditCheckMeta = {
  key: string;
  /** Peso del controllo dentro `Audit.score`. La somma dei pesi fa 100. */
  weight: number;
  name: LocalizedText;
};

export type TagMeta = {
  key: string;
  slug: LocalizedText;
  icon: string;
  name: LocalizedText;
  lead: LocalizedText;
};

/**
 * Le costanti del dataset: engine, pesi, fasce, bot, controlli, temi.
 * È l'endpoint che il frontend carica per primo e da cui dipende tutto il resto.
 */
export type MetaDTO = {
  /** Mese di riferimento, `YYYY-MM-DD`. */
  generatedFor: string;
  seedVersion: string;
  /** `true` finché i numeri sono generati. Il sito mette le pagine in noindex. */
  simulated: boolean;
  engines: EngineMeta[];
  /** Pesi dei fattori, in punti percentuali. La somma fa 100. */
  weights: Record<FactorKey, number>;
  runsPerMonth: number;
  /** Quanti mesi di storico sono disponibili. */
  historyMonths: number;
  /** Primo mese misurato, `YYYY-MM`. */
  firstMeasurement: string;
  /** Data dell'ultima verifica dei domini, `YYYY-MM-DD`. */
  sitesVerifiedOn: string;
  nationalDmo: { domain: string; holder: string };
  /** Sito ufficiale per regione. Chiave = nome della regione come in `Destination.region`. */
  regionalDmo: Record<string, string>;
  hotelsPerDestination: number;
  /** Sopra questo scarto tipo una misura è dichiarata volatile. */
  volatileThreshold: number;
  tiers: TierMeta[];
  demandTiers: TierMeta[];
  siteKinds: SiteKindMeta[];
  crawlers: CrawlerMeta[];
  auditChecks: AuditCheckMeta[];
  tags: TagMeta[];
};

// ------------------------------------------------------------- GET /national

export type CrawlerStats = {
  engine: EngineKey | null;
  purpose: LocalizedText;
  /** Frazioni 0–1. Le tre sommano a 1. */
  allow: number;
  partial: number;
  block: number;
};

export type MoverRow = {
  key: string;
  name: LocalizedText;
  /** Variazione di punteggio sul mese precedente. */
  trend: number;
  score: number;
};

export type LeaderboardRow = {
  key: string;
  name: LocalizedText;
  slug: LocalizedText;
  score: number;
  category: string;
};

/** La vista nazionale: una riga di numeri per l'intero paese. */
export type NationalDTO = {
  /** `YYYY-MM-DD`. */
  updatedAt: string;
  destinations: number;
  hotelsTracked: number;
  sitesAudited: number;
  hotelsReal: number;
  hotelsVerified: number;
  sitesVerified: number;
  sitesGenerated: number;
  promptsPerDestination: number;
  runsPerMonth: number;
  responsesAnalyzed: number;
  score: number;
  byEngine: Record<EngineKey, number>;
  factors: Record<FactorKey, number>;
  /** Da dove vengono le citazioni. Frazioni 0–1, sommano a 1. */
  sourceMix: Record<"dmo" | "editorial" | "ota" | "other", number>;
  /** Punteggio medio delle risposte in italiano e in inglese. */
  langGap: Record<Locale, number>;
  /** Punteggio medio per stadio del funnel. */
  funnel: Record<string, number>;
  /** Diffusione di ogni bot sui domini auditati. Chiave = `CrawlerMeta.key`. */
  crawlers: Record<string, CrawlerStats>;
  topRising: MoverRow[];
  topFalling: MoverRow[];
  leaderboard: LeaderboardRow[];
};

// ----------------------------------------------------------- GET /categories

export type CategoryDTO = {
  key: string;
  slug: LocalizedText;
  name: LocalizedText;
  short: LocalizedText;
  icon: string;
  lead: LocalizedText;
  /** Il soggetto usato nei prompt comparativi ("le zone di mare più belle in Italia"). */
  comparativeSubject: LocalizedText;
  /** Quante destinazioni contiene la classifica. */
  size: number;
  score: number;
  byEngine: Record<EngineKey, number>;
  factors: Record<FactorKey, number>;
  /** Visitatori annui in migliaia, somma della categoria. */
  visitors: number;
  hotelsTracked: number;
  /** Chiavi destinazione in ordine di punteggio decrescente. */
  ranking: string[];
};

// --------------------------------------------------------- GET /destinations

/** Articoli e preposizioni per comporre i prompt. Il sito non li ricalcola. */
export type Grammar = { article: string; prep: string; articleEn: string };

/** Una destinazione in elenco. Il dettaglio completo sta su `/destinations/{key}`. */
export type DestinationDTO = {
  key: string;
  name: LocalizedText;
  slug: LocalizedText;
  /** Nome regione, come chiave di `MetaDTO.regionalDmo`. */
  region: string;
  lat: number;
  lng: number;
  /** Categoria primaria: una sola, ed è quella in cui entra in classifica. */
  category: string;
  /** Temi secondari, chiavi di `MetaDTO.tags`. */
  tags: string[];
  /** Visitatori annui in migliaia. */
  visitors: number;
  /** Ricerche mensili sulle query monitorate. */
  demand: number;
  /** Chiave di `MetaDTO.demandTiers`. */
  demandTier: string;
  grammar: Grammar;
  score: Stat;
  factors: Record<FactorKey, number>;
  byEngine: Record<EngineKey, { score: number; rank: number }>;
  categoryRank: number;
  /** Intervallo di posizione compatibile con la dispersione: `[min, max]`. */
  categoryRankRange: [number, number];
  categorySize: number;
  nationalRank: number;
  rankRange: [number, number];
  /** Chiave di `MetaDTO.tiers`. */
  tier: string;
  trend: number;
  hotelsTracked: number;
  topHotel: { key: string; name: string };
  sourceMix: Record<"dmo" | "editorial" | "ota" | "other", number>;
  /** Punteggio degli ultimi `MetaDTO.historyMonths` mesi. */
  spark: number[];
};

// ---------------------------------------------------- GET /destinations/{key}

export type SiteRow = {
  domain: string;
  kind: SiteKind;
  label: string;
  /** `true` se il dominio è generato e non esiste davvero. */
  synthetic: boolean;
  verified: boolean;
  holder: string | null;
  scope: string | null;
  source: string | null;
  note: string | null;
  /** `YYYY-MM-DD`, o `null` se mai verificato. */
  verifiedOn: string | null;
  crawlers: CrawlerMap;
  audit: Audit;
};

export type HotelRow = {
  key: string;
  name: string;
  destination: string;
  /** Quanto è affidabile l'identità della struttura. */
  confidence:
    | "verified"
    | "registry-web"
    | "registry"
    | "chain"
    | "guarded"
    | "listed"
    | "generated";
  area: string | null;
  stars: number;
  domain: string;
  synthetic: boolean;
  chainDomain: boolean;
  /** Presenti solo se la verifica del dominio ha incontrato un ostacolo (WAF, timeout). */
  status?: string | null;
  note?: string | null;
  /** Posizione dentro la destinazione. */
  rank: number;
  score: Stat;
  byEngine: Record<EngineKey, { score: number; presence: number; position: number }>;
  /** Frazione di run in cui l'hotel compare. 0–1. */
  presence: number;
  avgPosition: number;
  auditScore: number;
  trend: number;
  crawlers: CrawlerMap;
  audit: Audit;
};

export type PromptRow = {
  key: string;
  lang: Locale;
  funnel: FunnelKey;
  level: PromptLevel;
  /** Il prompt già composto sulla destinazione. */
  text: string;
  byEngine: Record<EngineKey, { mentionRate: number; position: number; runs: number }>;
};

export type AnswerCitation = {
  /** Numero della nota nella risposta, `null` se citata senza indice. */
  index: number | null;
  domain: string;
  kind: string;
  label: string;
  synthetic: boolean;
};

export type AnswerBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered: boolean; items: { label: string; text: string }[] };

/** Una risposta catturata da un engine su un prompt. */
export type AnswerRow = {
  promptKey: string;
  promptText: string;
  subject: "destination" | "hotels";
  level: PromptLevel;
  funnel: FunnelKey;
  lang: Locale;
  engine: EngineKey;
  /** `YYYY-MM-DD`. */
  capturedAt: string;
  /** Numero della run nel mese, 1..`runsPerMonth`. */
  run: number;
  mentioned: boolean;
  /** Posizione nella risposta, `null` se non menzionata. */
  position: number | null;
  mentionRate: number;
  hotelKeys: string[];
  /** Le stringhe da evidenziare nel testo. */
  highlights: string[];
  citations: AnswerCitation[];
  blocks: AnswerBlock[];
};

export type QueryDetailRow = {
  key: string;
  destination: string;
  category: string;
  scope: "destination" | "category";
  promptKey: string;
  level: PromptLevel;
  funnel: FunnelKey;
  lang: Locale;
  text: string;
  cluster: string;
  /** Ricerche mensili. */
  volume: number;
  cpc: number;
  /** Variazione annua in punti percentuali. */
  yoy: number;
  /** 0–100. */
  difficulty: number;
  /** Le riformulazioni che l'engine espande a partire dalla query. */
  fanout: { text: string; share: number }[];
  history: { month: string; volume: number; cpc: number }[];
};

export type SummaryCell = {
  byEngine: Record<EngineKey, { mentionRate: number; position: number }>;
  mentionRate: number;
  /** Su quanti prompt è calcolata la cella. */
  prompts: number;
};

/**
 * Il dettaglio completo di una destinazione: ~110 KB. È l'endpoint più pesante
 * e il solo che il frontend carica una destinazione alla volta.
 */
export type DestinationDetailDTO = DestinationDTO & {
  /** Le entità che un'AI dovrebbe saper citare sul territorio. */
  knownFor: string[];
  /** `YYYY-MM-DD`. */
  updatedAt: string;
  runsPerMonth: number;
  scoreDetail: {
    overall: { score: Stat; factors: Record<FactorKey, Stat> };
    byEngine: Record<EngineKey, { score: Stat; factors: Record<FactorKey, Stat> }>;
  };
  /** Uno per mese, dal più vecchio. `month` è `YYYY-MM`. */
  history: { month: string; score: Stat; byEngine: Record<EngineKey, Stat> }[];
  /** Copertura delle entità di `knownFor`: 1 = citata, 0 = mai. */
  entities: { name: string; byEngine: Record<EngineKey, number> }[];
  prompts: { comparative: PromptRow[]; internal: PromptRow[] };
  /**
   * Aggregati già pronti. Chiavi di primo livello: `byFunnel`, `byLang`,
   * `byLevel`, `byFunnelLang` (quest'ultima con chiavi `funnel:lang`).
   */
  summary: Record<string, Record<string, SummaryCell>>;
  sites: SiteRow[];
  sources: {
    byKind: Record<"dmo" | "editorial" | "ota" | "other", number>;
    top: {
      domain: string;
      kind: string;
      label: string;
      synthetic: boolean;
      verified: boolean;
      holder: string | null;
      scope: string | null;
      share: number;
      occurrences: number;
    }[];
    quality: number;
  };
  hotels: HotelRow[];
  queries: QueryDetailRow[];
  answers: { destination: AnswerRow[]; hotels: AnswerRow[] };
  /** Punteggio tecnico per engine, pesato sui bot che quell'engine usa. */
  technical: Record<EngineKey, number>;
};

// --------------------------------------------------------------- GET /hotels

export type HotelSummaryDTO = {
  key: string;
  name: string;
  destination: string;
  destinationName: LocalizedText;
  /** Categoria della destinazione. */
  category: string;
  /** Zona della struttura. `null` dove la fonte non la dichiara. */
  area: string | null;
  stars: number;
  domain: string;
  synthetic: boolean;
  confidence: HotelRow["confidence"];
  score: Stat;
  byEngine: Record<EngineKey, number>;
  presence: number;
  avgPosition: number;
  auditScore: number;
  trend: number;
  destinationRank: number;
};

// -------------------------------------------------------------- GET /queries

export type QuerySummaryDTO = {
  key: string;
  destination: string;
  category: string;
  scope: "destination" | "category";
  funnel: FunnelKey;
  lang: Locale;
  level: PromptLevel;
  cluster: string;
  text: string;
  volume: number;
  cpc: number;
  yoy: number;
  difficulty: number;
  /** Volume degli ultimi 12 mesi. */
  spark: number[];
};

// -------------------------------------------------------------- GET /prompts

export type PromptTemplate = {
  key: string;
  level: PromptLevel;
  funnel: FunnelKey;
  lang: Locale;
  /**
   * Template con segnaposto: `{destination}`, `{theDestination}`,
   * `{inDestination}`, `{subject}`. Li risolve il frontend con `Grammar`.
   */
  template: string;
};

export type FunnelStage = {
  key: FunnelKey;
  icon: string;
  /** `false` per gli stadi dichiarati ma non ancora misurati. */
  inScope: boolean;
  name: LocalizedText;
  lead: LocalizedText;
};

export type PromptsDTO = { templates: PromptTemplate[]; funnel: FunnelStage[] };

// ----------------------------------------------------------------- GET /tags

export type TagDTO = TagMeta & {
  /** Quante destinazioni portano il tema. Solo i temi con `count > 0` sono serviti. */
  count: number;
};

// ------------------------------------------------------------------- filtri
//
// I parametri di query di tutti gli endpoint di elenco. `src/lib/api/query.ts`
// è l'implementazione di riferimento: il backend deve produrre gli stessi
// risultati a parità di parametri.

export type SortDir = "asc" | "desc";

export type PageParams = {
  /** 1-based. Default 1. */
  page?: number;
  /** Default 60. Massimo consentito 500. */
  pageSize?: number;
};

export type DestinationFilters = PageParams & {
  /** Ricerca libera su nome e regione, senza accenti e senza maiuscole. */
  q?: string;
  category?: string;
  tag?: string;
  region?: string;
  tier?: string;
  /** Ordina per il punteggio di questo engine invece che per la media. */
  engine?: EngineKey;
  sort?: "score" | "visitors" | "demand" | "trend" | "name" | "nationalRank";
  dir?: SortDir;
};

export type HotelFilters = PageParams & {
  q?: string;
  destination?: string;
  category?: string;
  /** Solo le strutture reali (`synthetic: false`). */
  realOnly?: boolean;
  sort?: "score" | "presence" | "avgPosition" | "auditScore" | "trend" | "name" | "stars";
  dir?: SortDir;
};

export type QueryFilters = PageParams & {
  q?: string;
  category?: string;
  destination?: string;
  lang?: Locale;
  funnel?: FunnelKey;
  level?: PromptLevel;
  cluster?: string;
  sort?: "volume" | "cpc" | "yoy" | "difficulty" | "text";
  dir?: SortDir;
};

// --------------------------------------------------------- snapshot di build
//
// Le sei collezioni che il sito carica una volta sola a build time per
// generare tutte le pagine. Corrispondono ad altrettanti endpoint.

export type Dataset = {
  meta: MetaDTO;
  national: NationalDTO;
  categories: CategoryDTO[];
  destinations: DestinationDTO[];
  hotels: HotelSummaryDTO[];
  prompts: PromptsDTO;
};
