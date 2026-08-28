import {
  BRAND,
  LINKS,
  LOCALES,
  OBSERVATORY_IS_DEMO,
  SITE_URL,
  absolute,
  assumptionsPath,
  categoryPath,
  comparePath,
  destinationPath,
  enginePath,
  glossaryPath,
  hotelsIndexPath,
  mapPath,
  methodologyPath,
  observatoryPath,
  otherLocale,
  pathFor,
  queriesPath,
  sitemapPath,
  tagPath,
  tagsPath,
  type Locale,
} from "./config";
import { interpolate, messages } from "./i18n";
import {
  ENGINES,
  categoryByKey,
  engineMeta,
  listCategories,
  listDestinations,
  listTags,
  taggedWith,
} from "./observatory";

// Un llms.txt per pagina, oltre a quello generale. Chi atterra su una scheda
// non ha modo di sapere che cosa sta leggendo: il file accanto glielo dice —
// che pagina è, in che ramo sta, in che lingua, che cosa vale e che cosa no.
//
// Regola di contenuto, non negoziabile: qui dentro non entra nessun valore
// misurato. Niente punteggi, niente posizioni, niente conteggi del dataset,
// niente data di aggiornamento. Quei numeri arriveranno dal backend, e un file
// statico che li incorpora diventa falso il giorno in cui cambiano. Restano
// metodo, struttura del sito e identità delle entità: le stesse cose da cui la
// rotta è già generata.

export type LlmsLink = { label: string; href: string };

export type LlmsPage = {
  path: string;
  altPath: string;
  locale: Locale;
  title: string;
  description: string;
  lead?: string;
  breadcrumb: string[];
  facts: { label: string; value: string }[];
  related: LlmsLink[];
};

// `/it/osservatorio/mappa` → `/it/osservatorio/mappa/llms.txt`. La radice è
// l'unica eccezione: il suo file è quello generale.
export function pageLlmsPath(path: string): string {
  const clean = path.replace(/\/$/, "");
  return clean ? `${clean}/llms.txt` : "/llms.txt";
}

function byName(locale: Locale) {
  return (a: { name: Record<string, string> }, b: { name: Record<string, string> }) =>
    a.name[locale].localeCompare(b.name[locale], locale);
}

function pagesFor(locale: Locale): LlmsPage[] {
  const other = otherLocale(locale);
  const m = messages(locale);
  const t = m.observatory;
  const landing = m.landing;
  const l = m.common.llms;

  const link = (label: string, href: string): LlmsLink => ({ label, href });
  const obsLink = link(t.nav.observatory, observatoryPath(locale));
  const methodLinks = [
    link(t.methodology.title, methodologyPath(locale)),
    link(t.assumptions.title, assumptionsPath(locale)),
    link(t.ui.glossary, glossaryPath(locale)),
  ];

  const root = [t.nav.observatory];

  const pages: LlmsPage[] = [
    {
      path: pathFor(locale),
      altPath: pathFor(other),
      locale,
      title: landing.meta.title,
      description: landing.meta.description,
      lead: landing.hero.lead,
      breadcrumb: [BRAND],
      facts: [],
      related: [
        obsLink,
        link(t.map.title, mapPath(locale)),
        link(t.hotelsPage.title, hotelsIndexPath(locale)),
        ...methodLinks,
      ],
    },
    {
      path: observatoryPath(locale),
      altPath: observatoryPath(other),
      locale,
      title: t.meta.title,
      description: t.meta.description,
      lead: t.hero.lead,
      breadcrumb: root,
      facts: [],
      related: [
        link(t.map.title, mapPath(locale)),
        link(t.hotelsPage.title, hotelsIndexPath(locale)),
        link(t.queries.title, queriesPath(locale)),
        link(t.compare.title, comparePath(locale)),
        link(t.tags.title, tagsPath(locale)),
        ...listCategories().map((category) =>
          link(category.name[locale], categoryPath(locale, category.slug[locale])),
        ),
      ],
    },
    {
      path: mapPath(locale),
      altPath: mapPath(other),
      locale,
      title: t.meta["map-title"],
      description: t.meta["map-description"],
      lead: t.map.lead,
      breadcrumb: [...root, t.nav.map],
      facts: [],
      related: [
        obsLink,
        link(t.compare.title, comparePath(locale)),
        ...listCategories().map((category) =>
          link(category.name[locale], categoryPath(locale, category.slug[locale])),
        ),
      ],
    },
    {
      path: hotelsIndexPath(locale),
      altPath: hotelsIndexPath(other),
      locale,
      title: t.hotelsPage["meta-title"],
      description: t.hotelsPage["meta-description"],
      lead: t.hotelsPage.lead,
      breadcrumb: [...root, t.hotelsPage.title],
      facts: [],
      related: [obsLink, link(t.map.title, mapPath(locale)), ...methodLinks],
    },
    {
      path: queriesPath(locale),
      altPath: queriesPath(other),
      locale,
      title: t.meta["queries-title"],
      description: t.meta["queries-description"],
      lead: t.queries.lead,
      breadcrumb: [...root, t.nav.queries],
      facts: [],
      related: [obsLink, link(t.compare.title, comparePath(locale)), ...methodLinks],
    },
    {
      path: comparePath(locale),
      altPath: comparePath(other),
      locale,
      title: t.meta["compare-title"],
      description: t.meta["compare-description"],
      lead: t.compare.lead,
      breadcrumb: [...root, t.nav.compare],
      facts: [],
      related: [obsLink, link(t.map.title, mapPath(locale)), ...methodLinks],
    },
    {
      path: tagsPath(locale),
      altPath: tagsPath(other),
      locale,
      title: t.tags["index-title"],
      description: t.tags["index-description"],
      lead: t.tags.lead,
      breadcrumb: [...root, t.tags.title],
      facts: [],
      related: [
        obsLink,
        ...listTags()
          .slice()
          .sort(byName(locale))
          .map((tag) => link(tag.name[locale], tagPath(locale, tag.slug[locale]))),
      ],
    },
    {
      path: methodologyPath(locale),
      altPath: methodologyPath(other),
      locale,
      title: t.meta["methodology-title"],
      description: t.meta["methodology-description"],
      lead: t.methodology.lead,
      breadcrumb: [...root, t.nav.methodology],
      facts: [],
      related: [
        link(t.assumptions.title, assumptionsPath(locale)),
        link(t.ui.glossary, glossaryPath(locale)),
        obsLink,
      ],
    },
    {
      path: assumptionsPath(locale),
      altPath: assumptionsPath(other),
      locale,
      title: t.meta["assumptions-title"],
      description: t.meta["assumptions-description"],
      lead: t.assumptions.lead,
      breadcrumb: [...root, t.nav.assumptions],
      facts: [],
      related: [
        link(t.methodology.title, methodologyPath(locale)),
        link(t.ui.glossary, glossaryPath(locale)),
        obsLink,
      ],
    },
    {
      path: glossaryPath(locale),
      altPath: glossaryPath(other),
      locale,
      title: t.meta["glossary-title"],
      description: t.meta["glossary-description"],
      lead: t.ui["glossary-lead"],
      breadcrumb: [...root, t.ui.glossary],
      facts: [],
      related: [
        link(t.methodology.title, methodologyPath(locale)),
        link(t.assumptions.title, assumptionsPath(locale)),
        obsLink,
      ],
    },
    {
      path: sitemapPath(locale),
      altPath: sitemapPath(other),
      locale,
      title: t.sitemap["meta-title"],
      description: t.sitemap["meta-description"],
      lead: t.sitemap.lead,
      breadcrumb: [...root, t.sitemap.title],
      facts: [],
      related: [obsLink, link(BRAND, pathFor(locale))],
    },
  ];

  // Categorie: l'elenco delle destinazioni che contengono sta in ordine
  // alfabetico, non di classifica. L'ordine di `ranking` è un risultato di
  // misura, e i risultati di misura qui dentro non entrano.
  for (const category of listCategories()) {
    const members = listDestinations()
      .filter((destination) => destination.category === category.key)
      .sort(byName(locale));
    pages.push({
      path: categoryPath(locale, category.slug[locale]),
      altPath: categoryPath(other, category.slug[other]),
      locale,
      title: interpolate(t.meta["category-title"], { category: category.name[locale] }),
      description: interpolate(t.meta["category-description"], {
        category: category.name[locale],
      }),
      lead: category.lead[locale],
      breadcrumb: [...root, t.nav.categories, category.short[locale]],
      facts: [],
      related: [
        obsLink,
        link(t.map.title, mapPath(locale)),
        ...members.map((destination) =>
          link(destination.name[locale], destinationPath(locale, destination.slug[locale])),
        ),
      ],
    });
  }

  for (const tag of listTags()) {
    const category = categoryByKey(tag.key);
    const members = taggedWith(tag.key).slice().sort(byName(locale));
    pages.push({
      path: tagPath(locale, tag.slug[locale]),
      altPath: tagPath(other, tag.slug[other]),
      locale,
      title: interpolate(t.tags["meta-title"], { tag: tag.name[locale] }),
      description: interpolate(t.tags["meta-description"], { tag: tag.name[locale] }),
      lead: tag.lead?.[locale] ?? category?.lead[locale] ?? t.tags.lead,
      breadcrumb: [...root, t.tags.title, tag.name[locale]],
      facts: category
        ? [{ label: l.category, value: category.name[locale] }]
        : [],
      related: [
        link(t.tags.title, tagsPath(locale)),
        obsLink,
        ...members.map((destination) =>
          link(destination.name[locale], destinationPath(locale, destination.slug[locale])),
        ),
      ],
    });
  }

  for (const engine of ENGINES) {
    const meta = engineMeta(engine)!;
    pages.push({
      path: enginePath(locale, engine),
      altPath: enginePath(other, engine),
      locale,
      title: interpolate(t.meta["engine-title"], { engine: meta.label }),
      description: interpolate(t.meta["engine-description"], { engine: meta.label }),
      lead: t.explain.engines,
      breadcrumb: [...root, t.nav.engines, meta.label],
      facts: [],
      related: [
        obsLink,
        ...ENGINES.filter((key) => key !== engine).map((key) =>
          link(engineMeta(key)!.label, enginePath(locale, key)),
        ),
        ...methodLinks,
      ],
    });
  }

  for (const destination of listDestinations()) {
    const category = categoryByKey(destination.category)!;
    const themes = listTags().filter(
      (tag) => tag.key === destination.category || destination.tags.includes(tag.key),
    );
    pages.push({
      path: destinationPath(locale, destination.slug[locale]),
      altPath: destinationPath(other, destination.slug[other]),
      locale,
      title: interpolate(t.meta["destination-title"], {
        destination: destination.name[locale],
      }),
      description: interpolate(t.meta["destination-description"], {
        destination: destination.name[locale],
      }),
      breadcrumb: [...root, category.short[locale], destination.name[locale]],
      facts: [
        { label: l.region, value: destination.region },
        { label: l.category, value: category.name[locale] },
        {
          label: l.themes,
          value: themes.map((tag) => tag.name[locale]).join(", "),
        },
      ],
      related: [
        link(category.name[locale], categoryPath(locale, category.slug[locale])),
        ...themes.map((tag) => link(tag.name[locale], tagPath(locale, tag.slug[locale]))),
        link(t.compare.title, comparePath(locale)),
        link(t.map.title, mapPath(locale)),
        obsLink,
      ],
    });
  }

  return pages;
}

let cache: LlmsPage[] | null = null;

export function listLlmsPages(): LlmsPage[] {
  cache ??= LOCALES.flatMap((locale) => pagesFor(locale));
  return cache;
}

export function renderPageLlms(page: LlmsPage): string {
  const m = messages(page.locale);
  const t = m.observatory;
  const l = m.common.llms;

  // Il blocco metodo c'è su ogni pagina, comprese le tre pagine di metodo:
  // lì diventerebbe un elenco che rimanda a se stesso. Si tolgono la pagina
  // corrente e i doppioni fra i due elenchi, così ogni URL compare una volta.
  const method = [
    { label: t.methodology.title, href: methodologyPath(page.locale) },
    { label: t.assumptions.title, href: assumptionsPath(page.locale) },
    { label: t.ui.glossary, href: glossaryPath(page.locale) },
  ].filter((item) => item.href !== page.path);
  const methodHrefs = new Set(method.map((item) => item.href));
  const related = page.related.filter(
    (item) => item.href !== page.path && !methodHrefs.has(item.href),
  );

  const lines: string[] = [
    `# ${page.title}`,
    "",
    `> ${page.description}`,
    "",
    `## ${l.identity}`,
    "",
    `- URL: ${absolute(page.path)}`,
    `- ${l.language}: ${page.locale}`,
    `- ${l.alternate}: ${absolute(page.altPath)}`,
    // La home sta alla radice del sito: dire in che sezione si trova
    // ripeterebbe la riga successiva.
    ...(page.breadcrumb.length > 1 ? [`- ${l.section}: ${page.breadcrumb.join(" > ")}`] : []),
    ...page.facts.filter((fact) => fact.value).map((fact) => `- ${fact.label}: ${fact.value}`),
    `- ${l["part-of"]}: ${BRAND} — ${SITE_URL}/llms.txt`,
    "",
  ];

  if (page.lead) {
    lines.push(`## ${l.about}`, "", page.lead, "");
  }

  lines.push(
    `## ${l["data-status"]}`,
    "",
    OBSERVATORY_IS_DEMO ? l.demo : l.live,
    "",
    `## ${l.related}`,
    "",
    ...related.map((item) => `- ${item.label}: ${absolute(item.href)}`),
    "",
    `## ${l.method}`,
    "",
    ...method.map((item) => `- ${item.label}: ${absolute(item.href)}`),
    `- ${l.full}: ${SITE_URL}/llms-full.txt`,
    "",
    `## ${l.automated}`,
    "",
    `- ${l.index}: ${SITE_URL}/llms.txt`,
    `- ${l["sitemap-xml"]}: ${SITE_URL}/sitemap.xml`,
    `- ${l.contact}: ${LINKS.email}`,
    "",
    l.note,
    "",
  );

  return lines.join("\n");
}
