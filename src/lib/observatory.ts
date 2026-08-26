import type { Locale } from "./config";
import categoriesJson from "../data/observatory/categories.json";
import destinationsJson from "../data/observatory/destinations.json";
import hotelsJson from "../data/observatory/hotels.json";
import metaJson from "../data/observatory/meta.json";
import nationalJson from "../data/observatory/national.json";
import promptsJson from "../data/observatory/prompts.json";

export type EngineKey = "chatgpt" | "gemini" | "perplexity";
export type FactorKey = "comparative" | "internal" | "sources" | "technical";

export type Stat = {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  runs: number;
  stability: "stable" | "moderate" | "volatile";
};

export type Category = (typeof categoriesJson)[number];
export type Destination = (typeof destinationsJson)[number];
export type NationalView = typeof nationalJson;
export type Meta = typeof metaJson;

export const META = metaJson as Meta;
export const NATIONAL = nationalJson as NationalView;
export const ENGINES = META.engines.map((e) => e.key) as EngineKey[];
export const SCORE_WEIGHTS = META.weights;
export const FACTOR_KEYS: FactorKey[] = [
  "comparative",
  "internal",
  "sources",
  "technical",
];

const categories = categoriesJson as Category[];
const destinations = destinationsJson as Destination[];

export function listCategories(): Category[] {
  return categories;
}

export function listDestinations(): Destination[] {
  return destinations;
}

export function listPrompts() {
  return promptsJson.templates;
}

export function funnelStages() {
  return promptsJson.funnel;
}

export function inScopeFunnel() {
  return promptsJson.funnel.filter((stage) => stage.inScope);
}

export function topHotels() {
  return hotelsJson;
}

export function engineMeta(key: string) {
  return META.engines.find((engine) => engine.key === key);
}

// I bot raggruppati per assistente, nell'ordine in cui stanno in meta.
// Otto nomi in fila non dicono che i primi tre sono lo stesso ChatGPT; quattro
// gruppi etichettati sì. CCBot resta da solo: Common Crawl non è un assistente.
export function crawlerGroups() {
  const groups: { engine: string | null; label: string; crawlers: typeof META.crawlers }[] = [];
  for (const crawler of META.crawlers) {
    const engine = crawler.engine ?? null;
    const last = groups[groups.length - 1];
    if (last && last.engine === engine) last.crawlers.push(crawler);
    else {
      groups.push({
        engine,
        label: engine ? (engineMeta(engine)?.label ?? engine) : "Common Crawl",
        crawlers: [crawler],
      });
    }
  }
  return groups;
}

export function findCategory(locale: Locale, slug: string): Category | undefined {
  return categories.find((category) => category.slug[locale] === slug);
}

export function findDestination(
  locale: Locale,
  slug: string,
): Destination | undefined {
  return destinations.find((destination) => destination.slug[locale] === slug);
}

export function destinationByKey(key: string): Destination | undefined {
  return destinations.find((destination) => destination.key === key);
}

export function categoryByKey(key: string): Category | undefined {
  return categories.find((category) => category.key === key);
}

export function destinationsOf(categoryKey: string): Destination[] {
  return categories
    .find((category) => category.key === categoryKey)!
    .ranking.map((key) => destinationByKey(key))
    .filter((d): d is Destination => Boolean(d));
}

// Una destinazione entra in classifica in una sola categoria, ma i tag la
// rendono raggiungibile da tutte quelle a cui appartiene davvero.
export function taggedWith(tag: string): Destination[] {
  return destinations.filter(
    (destination) => destination.category === tag || destination.tags.includes(tag),
  );
}

export function localizedPaths(locale: Locale, list: { slug: Record<string, string> }[]) {
  return list.map((item) => ({ params: { slug: item.slug[locale] } }));
}

// -------------------------------------------------------- dettaglio completo
// I file per destinazione pesano ~110 KB: si caricano uno alla volta, a build
// time, solo dalla pagina che li usa. Importarli tutti insieme metterebbe 11 MB
// dentro ogni bundle.
const detailFiles = import.meta.glob<{ default: DestinationDetail }>(
  "../data/observatory/destinations/*.json",
);

export type SiteRow = {
  domain: string;
  kind: "dmo" | "editorial" | "ota" | "hotel";
  label: string;
  synthetic: boolean;
  crawlers: Record<string, "allow" | "block" | "partial">;
  audit: { score: number; checks: Record<string, "pass" | "warn" | "fail"> };
};

export type HotelRow = {
  key: string;
  name: string;
  confidence:
    | "verified"
    | "registry-web"
    | "registry"
    | "chain"
    | "guarded"
    | "listed"
    | "generated";
  area: string;
  stars: number;
  domain: string;
  synthetic: boolean;
  rank: number;
  score: Stat;
  byEngine: Record<EngineKey, { score: number; presence: number; position: number }>;
  presence: number;
  avgPosition: number;
  auditScore: number;
  trend: number;
  crawlers: Record<string, "allow" | "block" | "partial">;
};

export type PromptRow = {
  key: string;
  lang: Locale;
  funnel: string;
  level: "comparative" | "internal";
  text: string;
  byEngine: Record<EngineKey, { mentionRate: number; position: number; runs: number }>;
};

export type AnswerCitation = {
  index: number | null;
  domain: string;
  kind: string;
  label: string;
  synthetic: boolean;
};

export type AnswerBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered: boolean; items: { label: string; text: string }[] };

// Una risposta ricostruita: il testo che un engine restituirebbe su un prompt,
// montato sui numeri che il resto del dataset pubblica. Non è una cattura
// reale, e il componente che la mostra è tenuto a dirlo.
export type AnswerRow = {
  promptKey: string;
  promptText: string;
  subject: "destination" | "hotels";
  level: "comparative" | "internal";
  funnel: string;
  lang: Locale;
  engine: EngineKey;
  capturedAt: string;
  run: number;
  mentioned: boolean;
  position: number | null;
  mentionRate: number;
  hotelKeys: string[];
  highlights: string[];
  citations: AnswerCitation[];
  blocks: AnswerBlock[];
};

export type QueryRow = {
  key: string;
  destination: string;
  scope: "destination" | "category";
  funnel: string;
  lang: Locale;
  level: string;
  cluster: string;
  text: string;
  volume: number;
  cpc: number;
  yoy: number;
  difficulty: number;
  fanout: { text: string; share: number }[];
  history: { month: string; volume: number; cpc: number }[];
};

export type DestinationDetail = Destination & {
  knownFor: string[];
  updatedAt: string;
  runsPerMonth: number;
  scoreDetail: {
    overall: { score: Stat; factors: Record<FactorKey, Stat> };
    byEngine: Record<EngineKey, { score: Stat; factors: Record<FactorKey, Stat> }>;
  };
  history: { month: string; score: Stat; byEngine: Record<EngineKey, Stat> }[];
  entities: { name: string; byEngine: Record<EngineKey, number> }[];
  prompts: { comparative: PromptRow[]; internal: PromptRow[] };
  summary: Record<string, Record<string, { byEngine: Record<EngineKey, { mentionRate: number; position: number }>; mentionRate: number; prompts: number }>>;
  sites: SiteRow[];
  sources: {
    byKind: Record<"dmo" | "editorial" | "ota" | "other", number>;
    top: { domain: string; kind: string; label: string; synthetic: boolean; share: number; occurrences: number }[];
    quality: number;
  };
  hotels: HotelRow[];
  queries: QueryRow[];
  answers: { destination: AnswerRow[]; hotels: AnswerRow[] };
  technical: Record<EngineKey, number>;
};

export async function loadDestination(key: string): Promise<DestinationDetail> {
  const path = `../data/observatory/destinations/${key}.json`;
  const loader = detailFiles[path];
  if (!loader) throw new Error(`Destinazione senza dataset: ${key}`);
  const mod = await loader();
  return mod.default;
}

// ------------------------------------------------------------------ utility

export function stability(stat: Stat): "stable" | "moderate" | "volatile" {
  return stat.stability;
}

export function scoreBand(value: number): "high" | "mid" | "low" {
  if (value >= 65) return "high";
  if (value >= 52) return "mid";
  return "low";
}

// Quanti bot di un engine sono ammessi su un sito: è il ponte fra il dato
// tecnico e il punteggio per engine.
export function opennessFor(
  crawlers: Record<string, string>,
  engine: EngineKey,
): number {
  const bots = engineMeta(engine)?.crawlers ?? [];
  if (!bots.length) return 1;
  const total = bots.reduce(
    (sum, bot) =>
      sum + (crawlers[bot] === "allow" ? 1 : crawlers[bot] === "partial" ? 0.5 : 0),
    0,
  );
  return total / bots.length;
}

export function rankDestinationsBy(engine: EngineKey | "all"): Destination[] {
  if (engine === "all") {
    return [...destinations].sort((a, b) => b.score.mean - a.score.mean);
  }
  return [...destinations].sort(
    (a, b) => b.byEngine[engine].score - a.byEngine[engine].score,
  );
}

// Dove un engine si discosta di più dal consenso degli altri: sono le sorprese
// che rendono leggibile la vista per singolo engine.
export function engineOutliers(engine: EngineKey, limit = 6) {
  return [...destinations]
    .map((destination) => {
      const others = ENGINES.filter((e) => e !== engine);
      const consensus =
        others.reduce((sum, e) => sum + destination.byEngine[e].score, 0) /
        others.length;
      return {
        destination,
        delta: Math.round((destination.byEngine[engine].score - consensus) * 10) / 10,
      };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, limit);
}

// Rende un template di prompt sulla destinazione. La tabella di articoli e
// preposizioni viaggia nel dataset (campo `grammar`): il sito non la ricalcola,
// così il testo mostrato in pagina è identico a quello posto ai modelli.
export function renderPromptText(
  prompt: { template: string; lang: string },
  destination: Destination,
): string {
  const lang = prompt.lang as Locale;
  const g = destination.grammar;
  const name = destination.name[lang];
  const article = lang === "it" ? g.article : g.articleEn;
  const join = (art: string) =>
    art.endsWith("'") ? `${art}${name}` : art ? `${art} ${name}` : name;
  const inForm =
    lang === "it"
      ? g.prep.endsWith("'")
        ? `${g.prep}${name}`
        : `${g.prep} ${name}`
      : g.articleEn
        ? `in ${g.articleEn} ${name}`
        : `in ${name}`;

  return prompt.template
    .replace(/\{inDestination\}/g, inForm)
    .replace(/\{theDestination\}/g, join(article))
    .replace(/\{destination\}/g, name);
}

// Precedente e successiva nella classifica di categoria: chi guarda una scheda
// quasi sempre vuole vedere chi ha davanti e chi ha dietro.
export function neighbours(destination: Destination) {
  const list = destinationsOf(destination.category);
  const index = list.findIndex((row) => row.key === destination.key);
  return {
    prev: index > 0 ? list[index - 1] : undefined,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
  };
}

// Territori simili: prima quelli che condividono più temi, a parità di temi
// quelli con punteggio più vicino. Serve a rispondere a "e chi altro?".
export function relatedDestinations(destination: Destination, limit = 4): Destination[] {
  const themes = new Set([destination.category, ...destination.tags]);
  return destinations
    .filter((row) => row.key !== destination.key)
    .map((row) => {
      const shared = [row.category, ...row.tags].filter((tag) => themes.has(tag)).length;
      return { row, shared, gap: Math.abs(row.score.mean - destination.score.mean) };
    })
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.gap - b.gap)
    .slice(0, limit)
    .map((entry) => entry.row);
}

// Tutti i temi in uso, con quante destinazioni li portano.
export function listTags() {
  const counts = new Map<string, number>();
  for (const destination of destinations) {
    for (const tag of new Set([destination.category, ...destination.tags])) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return META.tags
    .map((tag) => ({ ...tag, count: counts.get(tag.key) ?? 0 }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function findTag(key: string) {
  return listTags().find((tag) => tag.key === key);
}

export function findTagBySlug(locale: Locale, slug: string) {
  return listTags().find((tag) => tag.slug[locale] === slug);
}

// Icona rappresentativa del territorio.
//
// Dove il posto ha un tratto riconoscibile lo si dice con quello: l'Etna è un
// vulcano prima che una montagna, Varenna è un lago prima che un borgo. Dove
// non c'è un tratto netto resta l'icona della categoria, che è sempre corretta
// anche se meno espressiva. Forzare un'icona su ogni destinazione produrrebbe
// abbinamenti sbagliati, che è peggio di un'icona generica.
const TERRITORY_ICONS: Record<string, string> = {
  etna: "volcano",
  "etna-doc": "volcano",
  "isole-eolie": "volcano",
  "isola-elba": "island",
  "isole-tremiti": "island",
  capri: "island",
  "ischia-procida": "spa",
  varenna: "lake",
  franciacorta: "lake",
  "sacri-monti": "church",
  assisi: "church",
  "cinque-terre": "cliff",
  portovenere: "cliff",
  "costiera-amalfitana": "cliff",
  "riviera-conero": "cliff",
  scanno: "lake",
  "pompei-ercolano": "ruins",
  agrigento: "ruins",
  aquileia: "ruins",
  tivoli: "ruins",
  gradara: "castle",
  castelsardo: "castle",
  "civita-bagnoregio": "castle",
  erice: "castle",
  casentino: "forest",
  sila: "forest",
  pollino: "forest",
  "parco-abruzzo": "forest",
  cortina: "ski",
  "madonna-campiglio": "ski",
  livigno: "ski",
  cervinia: "ski",
  "val-di-fassa": "ski",
  langhe: "vine",
  chianti: "vine",
  valpolicella: "vine",
  bolgheri: "vine",
  montalcino: "vine",
  valdobbiadene: "vine",
  monferrato: "vine",
  roero: "vine",
  collio: "vine",
  vulture: "vine",
  montefalco: "vine",
  "primitivo-manduria": "vine",
  "strada-vino-alto-adige": "vine",
  irpinia: "vine",
};

export function destinationIcon(destination: Destination): string {
  const own = TERRITORY_ICONS[destination.key];
  if (own) return own;
  if (destination.tags.includes("wellness")) return "spa";
  if (destination.tags.includes("lago")) return "lake";
  return categoryByKey(destination.category)?.icon ?? "pin";
}

export function territoryIconCount(): number {
  return Object.keys(TERRITORY_ICONS).length;
}

// ---------------------------------------------------- confronti già pronti
// Chi arriva sulla pagina di confronto senza due nomi in testa resta fermo
// davanti a un campo vuoto. Queste coppie escono dai dati, non da una scelta
// editoriale, e servono sia alla pagina di confronto sia ai richiami che ci
// portano da altre parti del sito.
export type ComparePair = {
  kind: "top" | "rivals" | "contrast";
  pair: [Destination, Destination];
};

export function comparePairs(): ComparePair[] {
  const byRank = [...destinations].sort((a, b) => a.nationalRank - b.nationalRank);

  // Due rivali veri: i primi due di una categoria diversa da quella che occupa
  // già la testa della classifica nazionale, altrimenti si ripete la prima.
  const taken = new Set([byRank[0].category, byRank[1].category]);
  const rivalCategory = byRank.find((row) => !taken.has(row.category)) ?? byRank[0];
  const rivals = destinationsOf(rivalCategory.category).slice(0, 2);

  // Il contrasto che questo osservatorio esiste per mostrare: dentro una stessa
  // categoria, il territorio che la gente cerca di più non è quello che l'AI
  // nomina di più. Si prende la categoria in cui lo scarto è più largo.
  const contrast = categories
    .map((category) => {
      const rows = destinationsOf(category.key);
      const visible = rows[0];
      const searched = [...rows].sort((a, b) => b.demand - a.demand)[0];
      return { visible, searched, gap: (visible?.score.mean ?? 0) - (searched?.score.mean ?? 0) };
    })
    .filter((row) => row.visible && row.searched && row.visible.key !== row.searched.key)
    .sort((a, b) => b.gap - a.gap)[0];

  const candidates: ComparePair[] = [
    { kind: "top", pair: [byRank[0], byRank[1]] },
    ...(rivals.length === 2 ? [{ kind: "rivals" as const, pair: rivals as [Destination, Destination] }] : []),
    ...(contrast
      ? [{ kind: "contrast" as const, pair: [contrast.searched, contrast.visible] as [Destination, Destination] }]
      : []),
  ];

  const seen = new Set<string>();
  return candidates.filter(({ pair }) => {
    if (!pair[0] || !pair[1] || pair[0].key === pair[1].key) return false;
    // Due scorciatoie identiche sono una scorciatoia sprecata.
    const signature = [pair[0].key, pair[1].key].sort().join("|");
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}
