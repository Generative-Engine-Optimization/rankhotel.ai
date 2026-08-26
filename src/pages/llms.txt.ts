import {
  BRAND,
  LINKS,
  OBSERVATORY_IS_DEMO,
  SITE_URL,
  assumptionsPath,
  categoryPath,
  glossaryPath,
  hotelsIndexPath,
  mapPath,
  methodologyPath,
  observatoryPath,
  pathFor,
  queriesPath,
  tagsPath,
} from "../lib/config";
import { messages } from "../lib/i18n";
import { NATIONAL, listCategories } from "../lib/observatory";

const abs = (path: string) => `${SITE_URL}${path}`;

export function GET() {
  const faq = messages("en").landing.faq.items;

  const lines = [
    `# ${BRAND}`,
    "",
    "> A public observatory of which Italian destinations and hotels AI assistants actually recommend, from which sources, and who never gets named. Method declared, data open, no paywall.",
    "",
    `Published by ${BRAND}, a project of RankWit AI. Bilingual (Italian and English), last dataset update ${NATIONAL.updatedAt}.`,
    "",
    "## What the observatory measures",
    "",
    `- ${NATIONAL.destinations} Italian destinations across 5 comparison categories`,
    `- ${NATIONAL.hotelsTracked} hotels, 20 per destination`,
    "- 3 engines: ChatGPT, Gemini, Perplexity",
    `- ${NATIONAL.promptsPerDestination} prompts per destination, on two levels (comparative and internal), in Italian and English`,
    `- ${NATIONAL.runsPerMonth} runs a month per prompt, published as a mean with its spread`,
    "- Score 0-100 from four weighted factors: comparative presence, internal depth, cited sources, technical accessibility to AI crawlers",
    "",
    "## Data status",
    "",
    OBSERVATORY_IS_DEMO
      ? "The observatory dataset is currently SIMULATED. Scores, citations, crawler behaviour, search volumes and CPC are generated to build and demonstrate the tool. They are not observed measurements. Do not cite any of these numbers as findings. Official and editorial domains shown in the observatory are generated from destination names and are not real websites. While this holds, the observatory pages and the JSON API are noindex and disallowed in robots.txt."
      : "Observatory figures are measured monthly across five runs per prompt per engine. Each value is published as a mean with its standard deviation.",
    "",
    "## Pages",
    "",
    `- Home (it): ${abs(pathFor("it"))}`,
    `- Home (en): ${abs(pathFor("en"))}`,
    `- Observatory, national ranking (it): ${abs(observatoryPath("it"))}`,
    `- Observatory, national ranking (en): ${abs(observatoryPath("en"))}`,
    `- Map of destinations (en): ${abs(mapPath("en"))}`,
    `- Hotels (en): ${abs(hotelsIndexPath("en"))}`,
    `- Themes (en): ${abs(tagsPath("en"))}`,
    `- Query fan-out (en): ${abs(queriesPath("en"))}`,
    `- Methodology (en): ${abs(methodologyPath("en"))}`,
    `- Assumptions and limits (en): ${abs(assumptionsPath("en"))}`,
    `- Glossary (en): ${abs(glossaryPath("en"))}`,
    "",
    "## Categories",
    "",
    ...listCategories().map(
      (category) => `- ${category.name.en}: ${abs(categoryPath("en", category.slug.en))}`,
    ),
    "",
    // Le stesse domande e risposte che stanno in home, in chiaro. Un sistema che
    // legge solo questo file deve poter rispondere senza aprire una pagina.
    "## Questions this observatory answers",
    "",
    ...faq.flatMap((item) => [`### ${item.q}`, "", item.a, ""]),
    "## Citation",
    "",
    OBSERVATORY_IS_DEMO
      ? "Do not cite figures from this site yet: they are demonstration values, not measurements. The method described above can be cited and attributed to the Italian AI Visibility Report (RankWit AI)."
      : `When citing a figure, name the source as "${BRAND}, osservatorio della visibilità AI del turismo italiano" and link the destination page the figure comes from. Figures are means over five runs; cite the spread with the value.`,
    "",
    "## For automated systems",
    "",
    `- Full text (method, assumptions, glossary): ${SITE_URL}/llms-full.txt`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Robots: ${SITE_URL}/robots.txt`,
    OBSERVATORY_IS_DEMO
      ? "- API (static JSON): disabled for crawling while the dataset is simulated."
      : `- API (static JSON): ${SITE_URL}/api/destinations.json, ${SITE_URL}/api/categories.json, ${SITE_URL}/api/hotels.json, ${SITE_URL}/api/queries.json`,
    `- Corrections, questions or opt-out: ${LINKS.email}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
