export const SITE_URL = "https://www.rankhotel.ai";

// Il nome dell'osservatorio. Sta in una costante perché è la cosa più probabile
// che qualcuno voglia cambiare, e cambiarla qui la cambia in 259 pagine.
export const BRAND = "Italian AI Visibility Report";
export const BRAND_MARK = "/assets/ago-mark.svg";

// Anteprima social e — sempre più spesso — miniatura nelle risposte generative.
// Assente, le condivisioni escono con un rettangolo vuoto. Una per lingua:
// la card è scritta, e una card in italiano su una pagina inglese si nota.
export const OG_IMAGE = {
  it: "/assets/og-default.jpg",
  en: "/assets/og-default-en.jpg",
} as const;
export const DEFAULT_LOCALE = "it";
export const LOCALES = ["it", "en"] as const;

export type Locale = (typeof LOCALES)[number];

// Il dataset è ancora simulato, e questo interruttore è quello che tiene fuori
// dagli indici le pagine che pubblicano numeri: noindex, Disallow in
// robots.txt, sitemap senza osservatorio, nota nei file per le AI. Si spegne
// quando arrivano le run reali.
export const OBSERVATORY_IS_DEMO = true;

// Quanto di tutto ciò si vede a schermo, che è una decisione separata.
// A `false` l'interfaccia non dichiara più che i numeri sono generati: niente
// banner, niente marchio «demo» sui domini, niente tag «Nome generato», niente
// note sotto le tabelle. Serve a mostrare il prodotto come sarà.
//
// Restano accesi i due che contano davvero: le pagine sono comunque `noindex` e
// robots.txt le tiene comunque fuori, perché qui dentro si nominano enti veri
// (ENIT, italia.it, i domini regionali) e si dice quali bot bloccano. Con
// numeri generati quelle sono affermazioni false su terzi identificabili: la
// finzione può restare dentro casa, non finire in un indice.
export const DEMO_DISCLOSURE = false;


// Un osservatorio non vende: il contatto serve a chi vuole correggere un dato
// o chiedere conto di un numero, non a chi vuole comprare qualcosa.
export const LINKS = {
  rankwit: "https://www.rankwit.ai/",
  email: "info@rankwit.ai",
} as const;

// Un solo posto in cui vivono gli slug localizzati. Le pagine non compongono
// mai una URL a mano: se un segmento cambia, cambia qui e basta.
const SEGMENTS = {
  observatory: { it: "osservatorio", en: "observatory" },
  destinations: { it: "destinazioni", en: "destinations" },
  categories: { it: "categorie", en: "categories" },
  engines: { it: "engine", en: "engines" },
  map: { it: "mappa", en: "map" },
  queries: { it: "query", en: "queries" },
  compare: { it: "confronto", en: "compare" },
  methodology: { it: "metodologia", en: "methodology" },
  assumptions: { it: "assunzioni", en: "assumptions" },
  hotels: { it: "hotel", en: "hotels" },
  tags: { it: "temi", en: "themes" },
  glossary: { it: "glossario", en: "glossary" },
  sitemap: { it: "mappa-del-sito", en: "site-map" },
} as const;

export type Segment = keyof typeof SEGMENTS;

export function segment(locale: Locale, key: Segment): string {
  return SEGMENTS[key][locale];
}

// L'eccezione, e il motivo per cui esiste. Quattro pagine dell'osservatorio non
// pubblicano nessuna misurazione: raccontano come si misura (metodologia), cosa
// si dà per scontato (assunzioni), cosa vogliono dire le parole (glossario) e
// come è fatto il sito (mappa del sito). I numeri che contengono sono la
// formula, i pesi e le soglie — cioè le scelte di progetto, non i risultati —
// e l'unico punteggio in pagina è dichiarato come esempio illustrativo.
//
// Tenerle fuori dagli indici non protegge nessuno: nasconde il metodo e lascia
// indicizzato solo il claim. È il contrario di quello che serve a un
// osservatorio che chiede di essere giudicato sul metodo.
const METHOD_SEGMENTS: Segment[] = ["methodology", "assumptions", "glossary", "sitemap"];

export function isMethodPath(path: string): boolean {
  const last = path.split("/").filter(Boolean).pop();
  if (!last) return false;
  return METHOD_SEGMENTS.some((key) =>
    LOCALES.some((locale) => SEGMENTS[key][locale] === last),
  );
}

// Una pagina va in noindex solo se il dataset è simulato E la pagina pubblica
// numeri simulati. Le due condizioni non sono la stessa cosa.
export function isNoindex(path: string): boolean {
  return OBSERVATORY_IS_DEMO && !isMethodPath(path);
}

export function pathFor(locale: Locale, parts: string[] = []): string {
  const base = `/${locale}`;
  if (parts.length === 0) return base;
  return `${base}/${parts.join("/")}`;
}

const obs = (locale: Locale, parts: string[] = []) =>
  pathFor(locale, [segment(locale, "observatory"), ...parts]);

export function observatoryPath(locale: Locale): string {
  return obs(locale);
}

export function destinationPath(locale: Locale, slug: string): string {
  return obs(locale, [segment(locale, "destinations"), slug]);
}

export function categoryPath(locale: Locale, slug: string): string {
  return obs(locale, [segment(locale, "categories"), slug]);
}

export function enginePath(locale: Locale, engine: string): string {
  return obs(locale, [segment(locale, "engines"), engine]);
}

export function mapPath(locale: Locale): string {
  return obs(locale, [segment(locale, "map")]);
}

export function queriesPath(locale: Locale): string {
  return obs(locale, [segment(locale, "queries")]);
}

export function comparePath(locale: Locale): string {
  return obs(locale, [segment(locale, "compare")]);
}

export function hotelsPath(locale: Locale): string {
  return obs(locale, [segment(locale, "hotels")]);
}

export function tagPath(locale: Locale, tag: string): string {
  return obs(locale, [segment(locale, "tags"), tag]);
}

export function tagsPath(locale: Locale): string {
  return obs(locale, [segment(locale, "tags")]);
}

export function glossaryPath(locale: Locale): string {
  return obs(locale, [segment(locale, "glossary")]);
}

export function sitemapPath(locale: Locale): string {
  return obs(locale, [segment(locale, "sitemap")]);
}

export function hotelsIndexPath(locale: Locale): string {
  return obs(locale, [segment(locale, "hotels")]);
}

export function methodologyPath(locale: Locale): string {
  return obs(locale, [segment(locale, "methodology")]);
}

export function assumptionsPath(locale: Locale): string {
  return obs(locale, [segment(locale, "assumptions")]);
}

export function absolute(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function otherLocale(locale: Locale): Locale {
  return locale === "it" ? "en" : "it";
}
