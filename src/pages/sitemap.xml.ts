import {
  absolute,
  cityPath,
  LOCALES,
  methodologyPath,
  observatoryPath,
  pathFor,
  SITE_URL,
} from "../lib/config";
import { OBSERVATORY_IS_DEMO } from "../lib/config";
import { listCities } from "../lib/observatory";

type Entry = {
  loc: string;
  alternates?: string[];
  changefreq: "weekly" | "daily";
};

function url(entry: Entry): string {
  const alternates = (entry.alternates ?? [])
    .map(
      (href) =>
        `    <xhtml:link rel="alternate" hreflang="${href.startsWith("/it") ? "it" : "en"}" href="${absolute(href)}"/>`,
    )
    .join("\n");
  return [
    "  <url>",
    `    <loc>${absolute(entry.loc)}</loc>`,
    alternates,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export function GET() {
  const entries: Entry[] = [
    {
      loc: pathFor("it"),
      alternates: LOCALES.map((locale) => pathFor(locale)),
      changefreq: "weekly",
    },
    {
      loc: pathFor("en"),
      alternates: LOCALES.map((locale) => pathFor(locale)),
      changefreq: "weekly",
    },
  ];

  if (!OBSERVATORY_IS_DEMO) {
    entries.push(
      {
        loc: observatoryPath("it"),
        alternates: [observatoryPath("it"), observatoryPath("en")],
        changefreq: "daily",
      },
      {
        loc: observatoryPath("en"),
        alternates: [observatoryPath("it"), observatoryPath("en")],
        changefreq: "daily",
      },
      {
        loc: methodologyPath("it"),
        alternates: [methodologyPath("it"), methodologyPath("en")],
        changefreq: "weekly",
      },
      {
        loc: methodologyPath("en"),
        alternates: [methodologyPath("it"), methodologyPath("en")],
        changefreq: "weekly",
      },
      ...listCities().flatMap((city) => [
        {
          loc: cityPath("it", city.slug.it),
          alternates: [cityPath("it", city.slug.it), cityPath("en", city.slug.en)],
          changefreq: "daily" as const,
        },
        {
          loc: cityPath("en", city.slug.en),
          alternates: [cityPath("it", city.slug.it), cityPath("en", city.slug.en)],
          changefreq: "daily" as const,
        },
      ]),
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
