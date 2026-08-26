import {
  absolute,
  assumptionsPath,
  categoryPath,
  comparePath,
  destinationPath,
  glossaryPath,
  hotelsIndexPath,
  enginePath,
  LOCALES,
  mapPath,
  methodologyPath,
  OBSERVATORY_IS_DEMO,
  observatoryPath,
  pathFor,
  queriesPath,
  sitemapPath,
  type Locale,
} from "../lib/config";
import { ENGINES, NATIONAL, listCategories, listDestinations } from "../lib/observatory";

type Entry = {
  loc: string;
  alternates: string[];
  changefreq: "weekly" | "daily" | "monthly";
  xDefault?: string;
};

// La data dell'ultimo aggiornamento del dataset è l'unica <lastmod> onesta che
// questo sito può dichiarare: le pagine sono generate da quei dati.
const LASTMOD = NATIONAL.updatedAt;

function url(entry: Entry): string {
  const alternates = entry.alternates
    .map(
      (href) =>
        `    <xhtml:link rel="alternate" hreflang="${href.startsWith("/it") ? "it" : "en"}" href="${absolute(href)}"/>`,
    )
    .join("\n");
  // x-default nella sitemap quanto nell'head: i due devono dire la stessa cosa,
  // altrimenti Search Console segnala il cluster come incoerente.
  const fallback = entry.xDefault ?? entry.alternates.find((href) => href.startsWith("/it"));
  return [
    "  <url>",
    `    <loc>${absolute(entry.loc)}</loc>`,
    alternates,
    fallback
      ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(fallback)}"/>`
      : "",
    `    <lastmod>${LASTMOD}</lastmod>`,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

// Una coppia IT/EN per ogni pagina: due entry, stessi alternates. Scriverle a
// mano per ~230 pagine sarebbe l'unico modo di sbagliarle.
function pair(
  build: (locale: Locale) => string,
  changefreq: Entry["changefreq"],
  xDefault?: string,
): Entry[] {
  const alternates = LOCALES.map((locale) => build(locale));
  return LOCALES.map((locale) => ({ loc: build(locale), alternates, changefreq, xDefault }));
}

export function GET() {
  // La radice mancava: è la URL più linkata del dominio e la pagina di scelta
  // lingua, cioè l'x-default dichiarato dalle due home.
  const homeAlternates = LOCALES.map((locale) => pathFor(locale));
  const entries: Entry[] = [
    { loc: "/", alternates: homeAlternates, changefreq: "weekly", xDefault: "/" },
    ...pair((locale) => pathFor(locale), "weekly", "/"),
  ];

  // Le pagine di metodo non pubblicano misurazioni: stanno in sitemap sempre.
  entries.push(
    ...pair(methodologyPath, "monthly"),
    ...pair(assumptionsPath, "monthly"),
    ...pair(glossaryPath, "monthly"),
    ...pair(sitemapPath, "monthly"),
  );

  // Finché il dataset è simulato le pagine che pubblicano numeri restano fuori
  // dalla sitemap e in noindex: darli per misurati non si fa.
  if (!OBSERVATORY_IS_DEMO) {
    entries.push(
      ...pair(observatoryPath, "daily"),
      ...pair(mapPath, "weekly"),
      ...pair(queriesPath, "weekly"),
      ...pair(hotelsIndexPath, "daily"),
      ...pair(comparePath, "monthly"),
      ...ENGINES.flatMap((engine) =>
        pair((locale) => enginePath(locale, engine), "weekly"),
      ),
      ...listCategories().flatMap((category) =>
        pair((locale) => categoryPath(locale, category.slug[locale]), "daily"),
      ),
      ...listDestinations().flatMap((destination) =>
        pair((locale) => destinationPath(locale, destination.slug[locale]), "daily"),
      ),
    );
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries.map(url).join("\n"),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}
