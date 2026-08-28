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
import { listCategories } from "../lib/observatory";
import { publicPath as apiUrl } from "../lib/api/endpoints";

const abs = (path: string) => `${SITE_URL}${path}`;

export function GET() {
  const faq = messages("en").landing.faq.items;

  const lines = [
    `# ${BRAND}`,
    "",
    "> A public observatory of which Italian destinations and hotels AI assistants actually recommend, from which sources, and who never gets named. Method declared, data open, no paywall.",
    "",
    `Published by ${BRAND}, a project of RankWit AI. Bilingual (Italian and English).`,
    "",
    // Nessuna quantità qui dentro: quante destinazioni, quanti hotel, quante
    // run e a che data sono valori del dataset, e il dataset passerà al
    // backend. Un file statico che li incorpora invecchia senza che nessuno se
    // ne accorga. Il metodo invece è una scelta di progetto: quello resta vero.
    "## What the observatory measures",
    "",
    "- Italian destinations, grouped into 5 comparison categories",
    "- Hotels, a fixed set per destination",
    "- 3 engines: ChatGPT, Gemini, Perplexity",
    "- Prompts per destination on two levels (comparative and internal), in Italian and English",
    "- Repeated runs per prompt, published as a mean with its spread",
    "- Score 0-100 from four weighted factors: comparative presence, internal depth, cited sources, technical accessibility to AI crawlers",
    "",
    "Current counts, scores and the date of the last run are published on the pages and in the JSON endpoints, not here.",
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
    // Il livello di dettaglio che questo file non ha: ogni pagina ne espone uno
    // suo, accanto a sé.
    "## Per-page context",
    "",
    "Every page on this site exposes its own llms.txt: append `/llms.txt` to any page URL.",
    "",
    `- ${abs(methodologyPath("en"))}/llms.txt`,
    `- ${abs(observatoryPath("en"))}/llms.txt`,
    "",
    "Those files carry no measured figures either: page identity, section, language pair, related pages and method links.",
    "",
    "## For automated systems",
    "",
    `- Full text (method, assumptions, glossary): ${SITE_URL}/llms-full.txt`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Robots: ${SITE_URL}/robots.txt`,
    OBSERVATORY_IS_DEMO
      ? "- API (static JSON): disabled for crawling while the dataset is simulated."
      : `- API (static JSON): ${["/destinations", "/categories", "/hotels", "/queries"].map((path) => SITE_URL + apiUrl(path)).join(", ")}`,
    `- Corrections, questions or opt-out: ${LINKS.email}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
