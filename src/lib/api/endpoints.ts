// =============================================================================
// REGISTRO DEGLI ENDPOINT
// =============================================================================
//
// L'elenco di tutto ciò che il backend deve esporre, in forma leggibile da un
// programma. Da qui derivano, senza riscritture a mano:
//
//   • `docs/api/openapi.yaml`   — `npm run api:spec`
//   • la lista di controllo     — `npm run api:check`
//   • le rotte fixture in `src/pages/api/v1/`
//
// Aggiungere un endpoint significa aggiungere una riga qui, non toccare tre
// file che poi divergono.
// =============================================================================

export const API_VERSION = "v1";

export type EndpointId =
  | "meta"
  | "national"
  | "categories"
  | "category"
  | "destinations"
  | "destination"
  | "hotels"
  | "queries"
  | "queriesByCategory"
  | "prompts"
  | "tags";

export type ParamSpec = {
  name: string;
  type: "string" | "number" | "boolean";
  /** Valori ammessi. Un valore fuori elenco è un 400, non un filtro vuoto. */
  values?: readonly string[];
  default?: string | number | boolean;
  description: string;
};

export type EndpointSpec = {
  id: EndpointId;
  /** Path canonico, relativo alla base. `{key}` è un parametro di percorso. */
  path: string;
  /** Nome del tipo in `types.ts`. È la forma di `data`. */
  returns: string;
  /** `true` se `data` è un array e `meta` porta la paginazione. */
  collection: boolean;
  summary: string;
  /** Perché esiste: quale pagina del sito smetterebbe di funzionare senza. */
  usedBy: string;
  params?: readonly ParamSpec[];
  /** Secondi di `Cache-Control: public, max-age=...`. */
  cache: number;
};

const PAGE_PARAMS = [
  { name: "page", type: "number", default: 1, description: "Pagina, 1-based." },
  {
    name: "pageSize",
    type: "number",
    default: 60,
    description: "Righe per pagina. Massimo 500.",
  },
] as const satisfies readonly ParamSpec[];

const DIR = {
  name: "dir",
  type: "string",
  values: ["asc", "desc"],
  default: "desc",
  description: "Verso dell'ordinamento.",
} as const satisfies ParamSpec;

// Un giorno: il dataset cambia una volta al mese, ma un giorno di cache lascia
// spazio a una ripubblicazione fuori calendario senza aspettare la scadenza.
const DAY = 86400;

export const ENDPOINTS: readonly EndpointSpec[] = [
  {
    id: "meta",
    path: "/meta",
    returns: "MetaDTO",
    collection: false,
    cache: DAY,
    summary: "Costanti del dataset: engine, pesi, fasce, bot, controlli, temi.",
    usedBy: "Tutte le pagine. È il primo endpoint chiamato da ogni build.",
  },
  {
    id: "national",
    path: "/national",
    returns: "NationalDTO",
    collection: false,
    cache: DAY,
    summary: "La vista nazionale aggregata, con classifica e movimenti del mese.",
    usedBy: "Home, indice osservatorio, pagine engine.",
  },
  {
    id: "categories",
    path: "/categories",
    returns: "CategoryDTO[]",
    collection: true,
    cache: DAY,
    summary: "Le cinque categorie di confronto, con la loro classifica interna.",
    usedBy: "Indice osservatorio, pagine categoria, filtri delle query.",
  },
  {
    id: "category",
    path: "/categories/{key}",
    returns: "CategoryDTO",
    collection: false,
    cache: DAY,
    summary: "Una singola categoria. 404 se la chiave non esiste.",
    usedBy: "Pagina categoria, quando serve senza scaricare l'elenco intero.",
  },
  {
    id: "destinations",
    path: "/destinations",
    returns: "DestinationDTO[]",
    collection: true,
    cache: DAY,
    summary: "Le 100 destinazioni in classifica, filtrabili e ordinabili.",
    usedBy: "Classifica nazionale, pagine categoria e tema, mappa, confronto.",
    params: [
      { name: "q", type: "string", description: "Ricerca su nome e regione, senza accenti." },
      { name: "category", type: "string", description: "Chiave categoria primaria." },
      { name: "tag", type: "string", description: "Tema: include anche la categoria primaria." },
      { name: "region", type: "string", description: "Nome regione, esatto." },
      { name: "tier", type: "string", description: "Chiave fascia (a…e)." },
      {
        name: "engine",
        type: "string",
        values: ["chatgpt", "gemini", "perplexity"],
        description: "Ordina per il punteggio di questo engine invece che per la media.",
      },
      {
        name: "sort",
        type: "string",
        values: ["score", "visitors", "demand", "trend", "name", "nationalRank"],
        default: "score",
        description: "Campo di ordinamento.",
      },
      DIR,
      ...PAGE_PARAMS,
    ],
  },
  {
    id: "destination",
    path: "/destinations/{key}",
    returns: "DestinationDetailDTO",
    collection: false,
    cache: DAY,
    summary:
      "Il dettaglio completo di una destinazione: punteggi, storico, prompt, " +
      "risposte, siti, hotel, query. ~110 KB. 404 se la chiave non esiste.",
    usedBy: "Scheda destinazione (200 pagine) e pagina di confronto.",
  },
  {
    id: "hotels",
    path: "/hotels",
    returns: "HotelSummaryDTO[]",
    collection: true,
    cache: DAY,
    summary: "Le strutture in classifica nazionale, filtrabili per destinazione.",
    usedBy: "Pagina hotel.",
    params: [
      { name: "q", type: "string", description: "Ricerca su nome struttura e dominio." },
      { name: "destination", type: "string", description: "Chiave destinazione." },
      { name: "category", type: "string", description: "Chiave categoria." },
      {
        name: "realOnly",
        type: "boolean",
        default: false,
        description: "Solo strutture reali: esclude `synthetic: true`.",
      },
      {
        name: "sort",
        type: "string",
        values: ["score", "presence", "avgPosition", "auditScore", "trend", "name", "stars"],
        default: "score",
        description: "Campo di ordinamento.",
      },
      DIR,
      ...PAGE_PARAMS,
    ],
  },
  {
    id: "queries",
    path: "/queries",
    returns: "QuerySummaryDTO[]",
    collection: true,
    cache: DAY,
    summary:
      "L'indice della domanda: una riga per prompt monitorato, con volume, " +
      "CPC, variazione annua e dodici mesi di storico.",
    usedBy: "Pagina query, con filtri che girano davvero sull'endpoint.",
    params: [
      { name: "q", type: "string", description: "Ricerca sul testo della query." },
      { name: "category", type: "string", description: "Chiave categoria." },
      { name: "destination", type: "string", description: "Chiave destinazione." },
      { name: "lang", type: "string", values: ["it", "en"], description: "Lingua della domanda." },
      { name: "funnel", type: "string", description: "Stadio del funnel." },
      {
        name: "level",
        type: "string",
        values: ["comparative", "internal"],
        description: "Prompt comparativo o di approfondimento.",
      },
      { name: "cluster", type: "string", description: "Cluster tematico." },
      {
        name: "sort",
        type: "string",
        values: ["volume", "cpc", "yoy", "difficulty", "text"],
        default: "volume",
        description: "Campo di ordinamento.",
      },
      DIR,
      ...PAGE_PARAMS,
    ],
  },
  {
    id: "queriesByCategory",
    path: "/queries/{category}",
    returns: "QuerySummaryDTO[]",
    collection: true,
    cache: DAY,
    summary:
      "Il segmento di indice di una categoria. Esiste per non far scaricare " +
      "1,1 MB a chi guarda una categoria sola.",
    usedBy: "Pagina query, al primo filtro per categoria.",
  },
  {
    id: "prompts",
    path: "/prompts",
    returns: "PromptsDTO",
    collection: false,
    cache: DAY,
    summary: "I 50 template di prompt e i cinque stadi del funnel.",
    usedBy: "Metodologia, assunzioni, scheda destinazione.",
  },
  {
    id: "tags",
    path: "/tags",
    returns: "TagDTO[]",
    collection: true,
    cache: DAY,
    summary:
      "I temi in uso, con quante destinazioni li portano. Ordinati per " +
      "conteggio decrescente; i temi a zero non sono serviti.",
    usedBy: "Indice temi, pagine tema, navigazione laterale.",
  },
];

export const ENDPOINT_BY_ID = Object.fromEntries(
  ENDPOINTS.map((endpoint) => [endpoint.id, endpoint]),
) as Record<EndpointId, EndpointSpec>;

/** Sostituisce i `{segmenti}` con i valori, codificandoli. */
export function buildPath(path: string, params: Record<string, string> = {}): string {
  return path.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`Parametro di percorso mancante: ${name}`);
    return encodeURIComponent(value);
  });
}

/**
 * La URL pubblica di un endpoint, così com'è servita oggi.
 *
 * Le pagine che elencano i dati aperti (mappa del sito, home, llms.txt, lo
 * schema `Dataset`) devono linkare qualcosa che esiste davvero. Finché la
 * sorgente è statica quel qualcosa è un file con estensione; passata a un
 * backend è lo stesso path senza. Un posto solo in cui è scritto, invece di
 * otto elenchi da aggiornare a mano.
 *
 * A differenza di `buildPath`, un `{segmento}` senza valore resta com'è invece
 * di sollevare: queste liste mostrano anche la forma di un endpoint per chiave
 * (`/destinations/{key}.json`) accanto a un esempio raggiungibile.
 */
export function publicPath(path: string, params: Record<string, string> = {}): string {
  const resolved = path.replace(/\{(\w+)\}/g, (whole, name: string) =>
    params[name] === undefined ? whole : encodeURIComponent(params[name]),
  );
  return `/api/${API_VERSION}${resolved}.json`;
}

/** Query string dai soli parametri valorizzati, in ordine stabile. */
export function buildQuery(params: Record<string, unknown> = {}): string {
  const search = new URLSearchParams();
  for (const key of Object.keys(params).sort()) {
    const value = params[key];
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const out = search.toString();
  return out ? `?${out}` : "";
}
