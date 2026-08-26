import {
  BRAND,
  LINKS,
  OBSERVATORY_IS_DEMO,
  SITE_URL,
  assumptionsPath,
  glossaryPath,
  methodologyPath,
} from "../lib/config";
import { messages } from "../lib/i18n";
import {
  ENGINES,
  FACTOR_KEYS,
  META,
  NATIONAL,
  SCORE_WEIGHTS,
  engineMeta,
  listCategories,
} from "../lib/observatory";

// llms.txt è l'indice; questo è il testo. Contiene per intero le tre pagine che
// non pubblicano misurazioni — metodo, assunzioni, glossario — perché sono
// quelle su cui l'osservatorio chiede di essere giudicato, e un sistema che ne
// legge una sola riga deve poterle leggere tutte senza aprire il sito.
//
// Non contiene punteggi: quelli stanno dietro al Disallow finché sono generati.
export function GET() {
  const t = messages("en").observatory;
  const faq = messages("en").landing.faq.items;

  const rule = (title: string, body: string) => [`### ${title}`, "", body, ""];

  const lines = [
    `# ${BRAND} — full text`,
    "",
    "> Public observatory of AI visibility in Italian tourism. This file carries the",
    "> method, the stated assumptions and the glossary in full. Index and links:",
    `> ${SITE_URL}/llms.txt`,
    "",
    `Publisher: ${BRAND}, a project of RankWit AI. Languages: Italian and English.`,
    `Dataset last updated: ${NATIONAL.updatedAt}. Contact: ${LINKS.email}.`,
    "",
    OBSERVATORY_IS_DEMO
      ? "DATA STATUS: the observatory dataset is currently SIMULATED. Every score, citation, crawler result, search volume and CPC on the site is generated to build and demonstrate the tool. None of them are measurements, and none should be cited as findings. What follows — the method, the weights, the thresholds, the assumptions — is final and does describe how the observatory works."
      : "DATA STATUS: figures are measured monthly, five runs per prompt per engine, and published as a mean with its standard deviation.",
    "",
    "---",
    "",
    `## Method (${SITE_URL}${methodologyPath("en")})`,
    "",
    t.methodology.lead,
    "",
    "### The formula",
    "",
    `Score = ${FACTOR_KEYS.map((key) => `${SCORE_WEIGHTS[key]}% ${t.factors[key].name}`).join(" + ")}`,
    "",
    "Each factor, and what it answers:",
    "",
    ...FACTOR_KEYS.map(
      (key) => `- **${t.factors[key].name}** (${SCORE_WEIGHTS[key]}%): ${t.explain[key]}`,
    ),
    "",
    "### Scale of the measurement",
    "",
    `- ${NATIONAL.destinations} destinations, across ${listCategories().length} comparison categories`,
    `- ${NATIONAL.hotelsTracked} hotels, ${META.hotelsPerDestination} per destination`,
    `- ${NATIONAL.promptsPerDestination} prompts per destination, in Italian and English`,
    `- ${NATIONAL.runsPerMonth} runs per prompt per engine per month`,
    `- ${NATIONAL.responsesAnalyzed} responses analysed`,
    `- First measurement: ${META.firstMeasurement}`,
    "",
    "### Engines",
    "",
    ...ENGINES.map((engine) => {
      const meta = engineMeta(engine);
      return `- **${meta.label}** (${meta.vendor}) — crawlers: ${meta.crawlers.join(", ")}`;
    }),
    "",
    t.methodology["engines-body"],
    "",
    ...rule(t.methodology["runs-title"], t.methodology["runs-body"]),
    ...rule(t.methodology["technical-title"], t.methodology["technical-body"]),
    ...rule(t.methodology["levels-title"], t.methodology["levels-body"]),
    "### Visibility bands",
    "",
    "A score is published with a band, because between adjacent positions there is no measurable difference.",
    "",
    ...META.tiers.map((tier) => `- **${tier.name.en}**: ${tier.min} and above`),
    "",
    "---",
    "",
    `## Assumptions and limits (${SITE_URL}${assumptionsPath("en")})`,
    "",
    t.assumptions.lead,
    "",
    ...t.assumptions.items.flatMap((item: { title: string; body: string }, index: number) => [
      `${index + 1}. **${item.title}** — ${item.body}`,
    ]),
    "",
    "---",
    "",
    `## Glossary (${SITE_URL}${glossaryPath("en")})`,
    "",
    ...[
      { term: t.score.label, body: t.explain.score },
      { term: t.rank.tier, body: t.explain.tier },
      { term: t.demand.title, body: t.explain.demand },
      ...FACTOR_KEYS.map((key) => ({ term: t.factors[key].name, body: t.explain[key] })),
      { term: t.entities.entity, body: t.explain.entities },
      { term: t.funnel.title, body: t.explain.funnel },
      { term: t.lang.title, body: t.explain.lang },
      { term: t.sites.title, body: t.explain.sites },
      { term: t.table.query, body: t.explain.queries },
      { term: t.ui["runs-title"], body: t.explain.runs },
    ].flatMap((entry) => [`**${entry.term}** — ${entry.body}`, ""]),
    "---",
    "",
    "## Questions this observatory answers",
    "",
    ...faq.flatMap((item) => [`### ${item.q}`, "", item.a, ""]),
    "---",
    "",
    "## Citation",
    "",
    OBSERVATORY_IS_DEMO
      ? `Do not cite any figure from this site yet: the values are generated for demonstration. The method above may be cited and attributed to ${BRAND} (RankWit AI), ${SITE_URL}.`
      : `Attribute figures to "${BRAND}, osservatorio della visibilità AI del turismo italiano" and link the page the figure comes from. Every figure is a mean over ${NATIONAL.runsPerMonth} runs: cite the spread alongside the value.`,
    "",
    `Corrections, questions or opt-out: ${LINKS.email}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
