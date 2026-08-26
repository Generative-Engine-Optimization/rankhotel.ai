import {
  BRAND,
  LINKS,
  OBSERVATORY_IS_DEMO,
  OG_IMAGE,
  SITE_URL,
  absolute,
  type Locale,
} from "./config";
import { META, NATIONAL, type DestinationDetail } from "./observatory";

// Gli @id sono il punto di tutta questa pagina: un motore generativo che legge
// tre pagine diverse deve capire che l'editore è sempre la stessa entità, non
// tre organizzazioni omonime. Senza @id stabili ogni pagina è un'isola.
export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

const publisher = { "@id": ORG_ID };

// Nota: finché il dataset è simulato lo dichiariamo dentro la description del
// Dataset stesso. Un crawler che legge solo lo structured data deve saperlo.
const demoNote = {
  it: " ATTENZIONE: in questa fase i valori sono generati a scopo dimostrativo e non sono misurazioni.",
  en: " NOTE: at this stage the values are generated for demonstration and are not measurements.",
};

function noted(locale: Locale, description: string): string {
  return OBSERVATORY_IS_DEMO ? description + demoNote[locale] : description;
}

const ORG_DESCRIPTION = {
  it: "Osservatorio pubblico della visibilità AI del turismo italiano: quali destinazioni e quali hotel gli assistenti conversazionali consigliano davvero, da quali fonti, e chi non viene mai nominato.",
  en: "Public observatory of AI visibility in Italian tourism: which destinations and hotels conversational assistants actually recommend, from which sources, and who never gets named.",
};

// L'entità editrice. Va emessa una volta sola per pagina e riferita per @id da
// tutto il resto: è il nodo a cui un motore aggancia "chi lo dice".
export function organizationSchema(locale: Locale) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND,
    alternateName: "RankHotel.ai",
    url: SITE_URL,
    description: ORG_DESCRIPTION[locale],
    logo: {
      "@type": "ImageObject",
      url: absolute("/assets/logo.svg"),
      caption: BRAND,
    },
    email: LINKS.email,
    image: absolute(OG_IMAGE[locale]),
    parentOrganization: {
      "@type": "Organization",
      name: "RankWit AI",
      url: LINKS.rankwit,
    },
    knowsLanguage: ["it", "en"],
    areaServed: { "@type": "Country", name: "Italia", alternateName: "Italy" },
  };
}

export function webSiteSchema(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: BRAND,
    url: SITE_URL,
    description: ORG_DESCRIPTION[locale],
    inLanguage: ["it", "en"],
    publisher,
    isAccessibleForFree: true,
  };
}

// Il nodo di pagina: lega titolo, lingua, editore e briciole di pane. È quello
// che permette a un motore di citare "questa pagina" invece che "questo sito".
export function webPageSchema(
  locale: Locale,
  { title, description, path, type = "WebPage", breadcrumb = true }:
    { title: string; description: string; path: string; type?: string; breadcrumb?: boolean },
) {
  const url = absolute(path);
  // Il rimando alle briciole di pane va messo solo dove esistono: un @id che
  // non risolve è un nodo rotto nel grafo, non un campo vuoto.
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description: noted(locale, description),
    inLanguage: locale,
    isPartOf: { "@id": SITE_ID },
    publisher,
    // Firma l'osservatorio, non una persona: è un lavoro collettivo e
    // dichiararlo tale è più onesto che inventare un autore. Ma un autore ci
    // deve essere: una pagina senza firma non ha nessuno a cui dare credito né
    // a cui chiedere conto.
    author: publisher,
    dateModified: NATIONAL.updatedAt,
    ...(breadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

export function breadcrumbSchema(
  path: string,
  items: { label: string; href?: string }[],
) {
  const url = absolute(path);
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absolute(item.href) : url,
    })),
  };
}

// Il formato che i motori generativi estraggono meglio: domanda esplicita,
// risposta autoconclusiva. Le spiegazioni dell'osservatorio erano già scritte
// così, mancava solo dichiararlo.
export function faqSchema(
  path: string,
  items: { question: string; answer: string }[],
) {
  const url = absolute(path);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// Un glossario è un insieme di termini definiti, non una pagina di testo: se lo
// si dichiara, ogni voce diventa citabile da sola.
export function definedTermSetSchema(
  locale: Locale,
  name: string,
  path: string,
  terms: { term: string; body: string }[],
) {
  const url = absolute(path);
  return {
    "@type": "DefinedTermSet",
    "@id": `${url}#glossary`,
    name,
    url,
    inLanguage: locale,
    publisher,
    hasDefinedTerm: terms.map((entry) => ({
      "@type": "DefinedTerm",
      name: entry.term,
      description: entry.body,
      inDefinedTermSet: { "@id": `${url}#glossary` },
    })),
  };
}

export function datasetSchema(locale: Locale, name: string, description: string, path: string) {
  return {
    "@type": "Dataset",
    "@id": `${absolute(path)}#dataset`,
    name,
    description: noted(locale, description),
    url: absolute(path),
    inLanguage: locale,
    creator: publisher,
    author: publisher,
    publisher,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: NATIONAL.updatedAt,
    temporalCoverage: `${NATIONAL.updatedAt}/..`,
    spatialCoverage: { "@type": "Country", name: "Italia" },
    measurementTechnique: META.engines.map((engine) => engine.label).join(", "),
    variableMeasured: Object.keys(META.weights),
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: absolute("/api/destinations.json"),
    },
  };
}

export function destinationSchema(
  locale: Locale,
  destination: DestinationDetail,
  path: string,
  description: string,
) {
  const url = absolute(path);
  return {
    "@type": "Place",
    "@id": `${url}#place`,
    name: destination.name[locale],
    description: noted(locale, description),
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.lat,
      longitude: destination.lng,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: destination.region,
      addressCountry: "IT",
    },
    // I luoghi per cui il territorio è conosciuto stavano solo nel testo della
    // pagina. Dichiararli come entità collegate è ciò che permette a un motore
    // di legare "Sassi di Matera" a "Matera" senza doverlo dedurre.
    containsPlace: destination.knownFor.map((name) => ({
      "@type": "TouristAttraction",
      name,
      containedInPlace: { "@id": `${url}#place` },
    })),
  };
}

export function itemListSchema(
  locale: Locale,
  name: string,
  items: { name: string; url: string }[],
  path?: string,
) {
  return {
    "@type": "ItemList",
    ...(path ? { "@id": `${absolute(path)}#list` } : {}),
    name,
    inLanguage: locale,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absolute(item.url),
    })),
  };
}

// Un solo <script> per pagina, con tutti i nodi dentro @graph. Emetterne sei
// separati funziona lo stesso, ma impedisce ai nodi di riferirsi fra loro.
export function graph(nodes: (Record<string, unknown> | null | undefined)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
