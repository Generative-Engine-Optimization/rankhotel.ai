import {
  LOCALES,
  OBSERVATORY_IS_DEMO,
  SITE_URL,
  assumptionsPath,
  glossaryPath,
  methodologyPath,
  sitemapPath,
} from "../lib/config";

// I crawler dei motori generativi sono la metà del pubblico di questo sito, e
// non leggono tutti la stessa sintassi. Nominarli uno per uno costa dieci righe
// e toglie ogni ambiguità: "Allow: /" generico viene spesso letto male dai
// controlli automatici degli editori, e quello che non è esplicito viene
// trattato come dubbio.
const AI_AGENTS = [
  "GPTBot", // ChatGPT — indicizzazione
  "OAI-SearchBot", // ChatGPT — ricerca
  "ChatGPT-User", // ChatGPT — recupero su richiesta dell'utente
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "cohere-ai",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
];

export function GET() {
  const lines: string[] = [];

  const block = (agents: string[], rules: string[]) => {
    agents.forEach((agent) => lines.push(`User-agent: ${agent}`));
    rules.forEach((rule) => lines.push(rule));
    lines.push("");
  };

  // Finché i numeri sono generati, le pagine che li pubblicano restano fuori
  // dagli indici. Il noindex nelle pagine è la regola che conta; questo è il
  // rinforzo. Gli Allow espliciti vengono prima: nella specifica vince la
  // regola più specifica, e senza di loro il Disallow di sezione si porterebbe
  // via anche le quattro pagine di metodo, che numeri non ne pubblicano.
  const methodAllows = LOCALES.flatMap((locale) =>
    [methodologyPath, assumptionsPath, glossaryPath, sitemapPath].map(
      (build) => `Allow: ${build(locale)}`,
    ),
  );

  const demoRules = OBSERVATORY_IS_DEMO
    ? [
        ...methodAllows,
        "Disallow: /it/osservatorio/",
        "Disallow: /en/observatory/",
        "Disallow: /api/",
      ]
    : [];

  block(["*"], ["Allow: /", ...demoRules]);

  lines.push("# Assistenti conversazionali: benvenuti, alle stesse condizioni.");
  lines.push("# Il metodo e i limiti dei dati stanno in /llms.txt: leggeteli prima di citare.");
  block(AI_AGENTS, ["Allow: /", ...demoRules]);

  lines.push(
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    `# Contesto per sistemi automatici: ${SITE_URL}/llms.txt`,
    `# Metodo, assunzioni e glossario per esteso: ${SITE_URL}/llms-full.txt`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
