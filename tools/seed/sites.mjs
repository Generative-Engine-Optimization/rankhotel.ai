// Siti auditati per ogni destinazione, su quattro famiglie.
//
// NOTA DI INTEGRITÀ — I domini DMO ed editoriali sono GENERATI dallo slug della
// destinazione, non presi da siti reali. Il dataset di questa fase è simulato:
// pubblicare "il sito ufficiale X blocca GPTBot" quando il check non è stato
// davvero eseguito sarebbe un'affermazione falsa su un soggetto reale. I domini
// generati portano `synthetic: true` e la UI li marca come dimostrativi.
// Quando arriveranno i check reali, questa lista si sostituisce con i domini veri.

export const SITE_KINDS = [
  {
    key: "dmo",
    name: { it: "Sito ufficiale del territorio", en: "Official destination website" },
    short: { it: "DMO", en: "DMO" },
    note: {
      it: "L'ente che ha il mandato di promuovere la destinazione. È il soggetto che dovrebbe essere citato per primo, e spesso non lo è.",
      en: "The body mandated to promote the destination. It should be the first source cited, and often isn't.",
    },
  },
  {
    key: "editorial",
    name: { it: "Portale informativo indipendente", en: "Independent editorial portal" },
    short: { it: "Editoriale", en: "Editorial" },
    note: {
      it: "Guide e magazine tematici sul territorio. Nella maggior parte delle destinazioni battono il sito ufficiale nelle citazioni delle AI.",
      en: "Thematic guides and magazines. In most destinations they beat the official site in AI citations.",
    },
  },
  {
    key: "ota",
    name: { it: "Aggregatore e OTA", en: "Aggregator and OTA" },
    short: { it: "OTA", en: "OTA" },
    note: {
      it: "Booking, TripAdvisor e simili. Misurano quanta della visibilità del territorio sia in mano a terzi anziché al territorio stesso.",
      en: "Booking, TripAdvisor and the like. They measure how much of a destination's visibility is held by third parties rather than the destination itself.",
    },
  },
  {
    key: "hotel",
    name: { it: "Sito dell'hotel", en: "Hotel website" },
    short: { it: "Hotel", en: "Hotel" },
    note: {
      it: "I domini dei 20 hotel tracciati. È qui che l'accessibilità ai bot diventa una decisione commerciale del singolo albergatore.",
      en: "The domains of the 20 tracked hotels. This is where bot accessibility becomes an individual hotelier's commercial decision.",
    },
  },
];

// OTA reali: usati per la quota di citazioni, che è il dato interessante
// (quanta visibilità del territorio finisce a terzi). Il loro comportamento
// verso i bot è comunque marcato come simulato finché non è misurato.
export const OTA_SITES = [
  { domain: "booking.com", label: "Booking.com" },
  { domain: "tripadvisor.it", label: "Tripadvisor" },
  { domain: "airbnb.it", label: "Airbnb" },
  { domain: "getyourguide.it", label: "GetYourGuide" },
  { domain: "expedia.it", label: "Expedia" },
];

// I bot che contano, mappati sull'engine che alimentano.
export const CRAWLERS = [
  { key: "GPTBot", engine: "chatgpt", purpose: { it: "addestramento", en: "training" } },
  { key: "OAI-SearchBot", engine: "chatgpt", purpose: { it: "ricerca", en: "search" } },
  { key: "ChatGPT-User", engine: "chatgpt", purpose: { it: "lettura on-demand", en: "on-demand fetch" } },
  { key: "Google-Extended", engine: "gemini", purpose: { it: "addestramento", en: "training" } },
  { key: "Googlebot", engine: "gemini", purpose: { it: "indice", en: "index" } },
  { key: "PerplexityBot", engine: "perplexity", purpose: { it: "indice", en: "index" } },
  { key: "Perplexity-User", engine: "perplexity", purpose: { it: "lettura on-demand", en: "on-demand fetch" } },
  { key: "CCBot", engine: null, purpose: { it: "Common Crawl", en: "Common Crawl" } },
];

// Le voci dell'audit SEO tecnico. `weight` pesa dentro il punteggio audit 0-100.
export const AUDIT_CHECKS = [
  { key: "https", weight: 6, name: { it: "HTTPS e certificato valido", en: "HTTPS and valid certificate" } },
  { key: "title", weight: 8, name: { it: "Title unici e descrittivi", en: "Unique, descriptive titles" } },
  { key: "meta-description", weight: 6, name: { it: "Meta description presenti", en: "Meta descriptions present" } },
  { key: "headings", weight: 7, name: { it: "Gerarchia dei titoli corretta", en: "Correct heading hierarchy" } },
  { key: "structured-data", weight: 12, name: { it: "Dati strutturati schema.org", en: "schema.org structured data" } },
  { key: "sitemap", weight: 8, name: { it: "Sitemap XML raggiungibile", en: "Reachable XML sitemap" } },
  { key: "robots", weight: 8, name: { it: "robots.txt coerente", en: "Consistent robots.txt" } },
  { key: "canonical", weight: 6, name: { it: "Canonical corretti", en: "Correct canonicals" } },
  { key: "hreflang", weight: 9, name: { it: "hreflang per le lingue servite", en: "hreflang for served languages" } },
  { key: "core-web-vitals", weight: 10, name: { it: "Core Web Vitals nel verde", en: "Core Web Vitals in the green" } },
  { key: "mobile", weight: 7, name: { it: "Resa mobile", en: "Mobile rendering" } },
  { key: "render-blocking", weight: 6, name: { it: "Contenuto senza JavaScript", en: "Content without JavaScript" } },
  { key: "alt-text", weight: 4, name: { it: "Testi alternativi sulle immagini", en: "Image alt text" } },
  { key: "llms-txt", weight: 3, name: { it: "llms.txt pubblicato", en: "llms.txt published" } },
];
