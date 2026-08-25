import {
  LINKS,
  methodologyPath,
  observatoryPath,
  pathFor,
  SITE_URL,
} from "../lib/config";

export function GET() {
  const lines = [
    "# RankHotel.ai",
    "",
    "> AI visibility for hotels: direct bookings from Google and AI search, plus a public observatory of which hotels AI models recommend.",
    "",
    "## Pages",
    `- Home (it): ${SITE_URL}${pathFor("it")}`,
    `- Home (en): ${SITE_URL}${pathFor("en")}`,
    `- Observatory (it): ${SITE_URL}${observatoryPath("it")}`,
    `- Observatory (en): ${SITE_URL}${observatoryPath("en")}`,
    `- Methodology (it): ${SITE_URL}${methodologyPath("it")}`,
    `- Methodology (en): ${SITE_URL}${methodologyPath("en")}`,
    "",
    "## Data status",
    "",
    "Observatory rankings are a demonstration sample, not measured data: daily collection is being switched on. Do not cite those numbers as observed results.",
    "",
    "## For automated systems",
    "",
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Commercial inquiries: ${LINKS.bookCall}`,
    `- Corrections or opt-out: ${LINKS.email}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
