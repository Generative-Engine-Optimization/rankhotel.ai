import type { Locale } from "./config";
import { server } from "./api/server";
import type {
  CategoryDTO,
  DestinationDTO,
  DestinationDetailDTO,
  EngineKey,
  FactorKey,
  MetaDTO,
  NationalDTO,
  Stat,
  TagDTO,
} from "./api/types";

// Il modello di dominio del sito.
//
// Da qui in giù non si sa più da dove arrivino i dati: li chiede a
// `./api/server`, che legge dalle fixture o da un backend vero a seconda di
// `PUBLIC_API_SOURCE`. Prima questo file importava sei JSON, e cambiare
// sorgente avrebbe voluto dire riscrivere le cinquanta pagine che lo usano.
//
// Il caricamento è un `await` di modulo: succede una volta per build, prima che
// qualunque pagina venga renderizzata, e tiene sincrone le funzioni qui sotto —
// che è la ragione per cui nessun template ha dovuto cambiare.
const [dataset, tagList] = await Promise.all([server.dataset(), server.tags()]);

// I tipi del dominio sono quelli del contratto API: un solo posto in cui è
// scritto che forma ha una destinazione, ed è il file che si dà a chi scrive
// il backend.
export type { EngineKey, FactorKey, Stat };
export type Category = CategoryDTO;
export type Destination = DestinationDTO;
export type NationalView = NationalDTO;
export type Meta = MetaDTO;
export type Tag = TagDTO;

export const META = dataset.meta;
export const NATIONAL = dataset.national;
export const ENGINES = META.engines.map((engine) => engine.key);
export const SCORE_WEIGHTS = META.weights;
export const FACTOR_KEYS: FactorKey[] = [
  "comparative",
  "internal",
  "sources",
  "technical",
];

const categories = dataset.categories;
const destinations = dataset.destinations;

export function listCategories(): Category[] {
  return categories;
}

export function listDestinations(): Destination[] {
  return destinations;
}

export function listPrompts() {
  return dataset.prompts.templates;
}

export function funnelStages() {
  return dataset.prompts.funnel;
}

export function inScopeFunnel() {
  return dataset.prompts.funnel.filter((stage) => stage.inScope);
}

export function topHotels() {
  return dataset.hotels;
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
// Le schede pesano ~110 KB l'una: si caricano una alla volta, solo dalla pagina
// che le usa. In modalità fixtures è una lettura da disco, con il backend è
// `GET /destinations/{key}`. La pagina non vede la differenza.
export type {
  AnswerBlock,
  AnswerCitation,
  AnswerRow,
  HotelRow,
  PromptRow,
  SiteRow,
} from "./api/types";
export type { QueryDetailRow as QueryRow } from "./api/types";
export type DestinationDetail = DestinationDetailDTO;

export function loadDestination(key: string): Promise<DestinationDetail> {
  return server.destination(key);
}

// ------------------------------------------------------------------ utility

export function stability(stat: Stat): "stable" | "moderate" | "volatile" {
  return stat.stability;
}

// La fascia e le tinte del punteggio vivono in ./score, che non importa dati e
// quindi è raggiungibile anche dagli script che girano nel browser. Qui resta
// il ri-export, così i venti punti che già la importano da observatory non
// devono cambiare riga.
export { barClass, scoreBand, scoreColor, scoreColorSoft } from "./score";
export type { ScoreBand } from "./score";

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

// I temi in uso, con quante destinazioni li portano. Il conteggio è un
// aggregato: lo fa la sorgente (`GET /tags`), non il sito.
export function listTags(): Tag[] {
  return tagList;
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
