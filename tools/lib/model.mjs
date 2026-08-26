import { clamp, round } from "./prng.mjs";

export const ENGINES = ["chatgpt", "gemini", "perplexity"];

export const ENGINE_META = {
  chatgpt: {
    label: "ChatGPT",
    vendor: "OpenAI",
    // Personalità del modello, usata per far divergere le classifiche.
    // Non è un capriccio: è il motivo per cui esiste una vista per engine.
    popularityBias: 0.85, // premia le destinazioni molto note
    editorialBias: 0.25,
    officialBias: 0.35,
    crawlers: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
  },
  gemini: {
    label: "Gemini",
    vendor: "Google",
    popularityBias: 0.55,
    editorialBias: 0.35,
    officialBias: 0.7, // premia i siti tecnicamente in ordine e i canali ufficiali
    crawlers: ["Google-Extended", "Googlebot"],
  },
  perplexity: {
    label: "Perplexity",
    vendor: "Perplexity",
    popularityBias: 0.35,
    editorialBias: 0.85, // vive di fonti editoriali fresche
    officialBias: 0.4,
    crawlers: ["PerplexityBot", "Perplexity-User"],
  },
};

// I pesi dei 4 fattori. Sono la formula pubblicata sulla pagina metodologia:
// il sito la legge da qui, così il testo non può divergere dal calcolo.
export const SCORE_WEIGHTS = {
  comparative: 35,
  internal: 25,
  sources: 20,
  technical: 20,
};

export const RUNS_PER_MONTH = 5;
// L'osservatorio ha cominciato a misurare ad agosto 2026. Tre rilevazioni
// mensili sono quelle che esistono davvero, e mostrarne ventiquattro
// significherebbe inventare un passato che non abbiamo.
export const HISTORY_MONTHS = 3;

// I volumi e i CPC delle query sono dato di ricerca di terze parti: quelli
// una storia lunga ce l'hanno, ed è corretto mostrarla.
export const QUERY_HISTORY_MONTHS = 24;
export const HOTELS_PER_DESTINATION = 20;
export const VOLATILE_THRESHOLD = 4.5; // deviazione standard oltre cui è "volatile"

export function weightedScore(factors) {
  const total =
    factors.comparative * SCORE_WEIGHTS.comparative +
    factors.internal * SCORE_WEIGHTS.internal +
    factors.sources * SCORE_WEIGHTS.sources +
    factors.technical * SCORE_WEIGHTS.technical;
  return total / 100;
}

// Le N run del mese attorno a un valore atteso.
export function sampleRuns(random, mean, volatility, runs = RUNS_PER_MONTH) {
  const values = [];
  for (let i = 0; i < runs; i += 1) {
    values.push(clamp(random.normal(mean, volatility), 0, 100));
  }
  return values;
}

// La statistica di un insieme di run: è la banda di confidenza mostrata ovunque.
export function statOf(values) {
  const m = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - m) ** 2, 0) / Math.max(1, values.length - 1);
  const sd = Math.sqrt(variance);
  return {
    mean: round(m, 1),
    stdDev: round(sd, 1),
    min: round(Math.min(...values), 1),
    max: round(Math.max(...values), 1),
    runs: values.length,
    stability: sd > VOLATILE_THRESHOLD ? "volatile" : sd > VOLATILE_THRESHOLD / 2 ? "moderate" : "stable",
  };
}

export function statFrom(random, mean, volatility, runs = RUNS_PER_MONTH) {
  return statOf(sampleRuns(random, mean, volatility, runs));
}

// Stagionalità per categoria: moltiplicatore mensile sui volumi di ricerca.
// Gennaio = indice 0. Il turismo italiano è tutt'altro che piatto e i grafici
// del fan-out devono mostrarlo.
export const SEASONALITY = {
  mare: [0.35, 0.38, 0.5, 0.75, 1.1, 1.6, 1.95, 1.7, 0.95, 0.55, 0.35, 0.42],
  "montagna-parchi": [1.5, 1.45, 1.15, 0.8, 0.7, 1.0, 1.35, 1.4, 0.85, 0.7, 0.75, 1.35],
  enogastronomia: [0.7, 0.7, 0.85, 1.05, 1.15, 1.05, 0.95, 0.95, 1.45, 1.5, 0.95, 0.7],
  unesco: [0.7, 0.8, 1.05, 1.35, 1.3, 1.1, 1.0, 1.05, 1.25, 1.1, 0.75, 0.65],
  borghi: [0.6, 0.65, 0.9, 1.35, 1.3, 1.1, 1.0, 1.15, 1.15, 1.05, 0.8, 0.55],
};

// Popolarità normalizzata 0..1 su scala logaritmica: fra Roma (22M) e Apricale
// (120k) ci sono due ordini di grandezza, una scala lineare schiaccerebbe tutto.
export function popularityOf(visitors, minV, maxV) {
  const l = Math.log(visitors);
  return clamp((l - Math.log(minV)) / (Math.log(maxV) - Math.log(minV)), 0, 1);
}

export function monthsBack(fromDate, count) {
  const out = [];
  const d = new Date(fromDate);
  for (let i = count - 1; i >= 0; i -= 1) {
    const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1));
    out.push({
      key: `${m.getUTCFullYear()}-${String(m.getUTCMonth() + 1).padStart(2, "0")}`,
      year: m.getUTCFullYear(),
      month: m.getUTCMonth(), // 0-11
    });
  }
  return out;
}

// Fasce di punteggio. Sono la lettura onesta della classifica: fra la 38ª e la
// 41ª posizione non c'è differenza misurabile, fra la fascia B e la D sì.
export const TIERS = [
  { key: "a", min: 68, name: { it: "Molto visibile", en: "Highly visible" } },
  { key: "b", min: 61, name: { it: "Visibile", en: "Visible" } },
  { key: "c", min: 54, name: { it: "Presenza incerta", en: "Uneven presence" } },
  { key: "d", min: 47, name: { it: "Poco visibile", en: "Barely visible" } },
  { key: "e", min: 0, name: { it: "Quasi assente", en: "Nearly absent" } },
];

export function tierOf(score) {
  return TIERS.find((tier) => score >= tier.min).key;
}

// Due punteggi sono distinguibili solo se la loro differenza supera l'errore
// standard combinato delle run. Con cinque run e una dispersione di tre punti,
// due destinazioni a un punto di distanza sono la stessa destinazione.
export function indistinguishable(a, b) {
  const seA = a.stdDev / Math.sqrt(a.runs);
  const seB = b.stdDev / Math.sqrt(b.runs);
  return Math.abs(a.mean - b.mean) < 1.96 * Math.sqrt(seA * seA + seB * seB);
}

// Scala della domanda: quante ricerche al mese muove davvero un territorio,
// sommando le query monitorate. Serve a dire al lettore su cosa sta guardando
// una classifica: venti hotel su un borgo da settecento ricerche al mese e
// venti hotel su Roma sono due pagine con lo stesso aspetto e due significati
// diversi, e tacerlo lascia il lavoro al lettore.
export const DEMAND_TIERS = [
  { key: "high", min: 40000, name: { it: "Domanda alta", en: "High demand" } },
  { key: "mid", min: 8000, name: { it: "Domanda media", en: "Medium demand" } },
  { key: "low", min: 1500, name: { it: "Domanda bassa", en: "Low demand" } },
  { key: "marginal", min: 0, name: { it: "Domanda marginale", en: "Marginal demand" } },
];

export function demandTierOf(volume) {
  return DEMAND_TIERS.find((tier) => volume >= tier.min).key;
}
