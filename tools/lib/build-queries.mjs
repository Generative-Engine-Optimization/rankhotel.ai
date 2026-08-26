import { clamp, round, hashSeed } from "./prng.mjs";
import { ENGINES, SEASONALITY, QUERY_HISTORY_MONTHS, monthsBack } from "./model.mjs";
import { PROMPTS } from "../seed/prompts.mjs";
import { renderPrompt } from "./render-prompt.mjs";
import { destinationForms } from "../seed/grammar.mjs";

// Cluster semantico: raggruppa le query per intento reale, non per parola.
const CLUSTER_BY_PREFIX = {
  "int-dream": "identita-destinazione",
  "int-plan-see": "cosa-vedere",
  "int-plan-days": "itinerari",
  "int-plan-eat": "enogastronomia",
  "int-plan-getthere": "come-arrivare",
  "int-plan-season": "quando-andare",
  "int-plan-hidden": "fuori-dai-circuiti",
  "int-book": "dove-dormire",
  "cmp-dream": "scelta-della-meta",
  "cmp-plan": "vincoli-di-viaggio",
  "cmp-book": "base-del-viaggio",
};

function clusterOf(key) {
  const match = Object.keys(CLUSTER_BY_PREFIX)
    .filter((prefix) => key.startsWith(prefix))
    .sort((a, b) => b.length - a.length)[0];
  return match ? CLUSTER_BY_PREFIX[match] : "altro";
}

// Peso di domanda per template: "cosa vedere a X" vale ordini di grandezza più
// di "vale la pena visitare X". Deterministico, non casuale.
const TEMPLATE_WEIGHT = {
  "int-plan-see": 1,
  "int-book-hotels": 0.85,
  "int-plan-days": 0.42,
  "int-dream-known": 0.3,
  "int-plan-eat": 0.28,
  "int-book-area": 0.26,
  "int-plan-season": 0.24,
  "int-plan-getthere": 0.22,
  "int-dream-worth": 0.18,
  "int-book-view": 0.12,
  "int-book-boutique": 0.09,
  "int-plan-hidden": 0.08,
  "int-dream-image": 0.05,
};

function templateWeight(key) {
  const base = Object.entries(TEMPLATE_WEIGHT).find(([prefix]) => key.startsWith(prefix));
  return base ? base[1] : 0.14;
}

const CPC_BY_FUNNEL = { dreaming: [0.18, 0.55], planning: [0.45, 1.35], booking: [1.3, 4.6] };

// Espansioni: le sotto-domande che un engine genera davvero prima di
// rispondere. Sono la parte "fan-out" del nome.
const FANOUT = {
  // Segnaposto: {in} = "sulle Dolomiti", {the} = "le Dolomiti", {d} = "Dolomiti".
  // Le espansioni in stile keyword usano il toponimo nudo — che è come le
  // persone scrivono davvero — quelle in forma di frase usano la preposizione.
  dreaming: {
    it: ["perché andare {in}", "quando andare {in}", "{d} recensioni", "{d} quanto costa", "{d} periodo migliore"],
    en: ["why visit {the}", "best time to visit {the}", "{d} reviews", "how expensive is {d}", "is {d} touristy"],
  },
  planning: {
    it: ["cosa vedere {in} in un giorno", "{d} con bambini", "come muoversi {in}", "{d} cosa evitare", "itinerario a piedi {in}"],
    en: ["{d} in one day", "{d} with kids", "getting around {the}", "what to avoid in {d}", "{d} walking itinerary"],
  },
  booking: {
    it: ["dove dormire {in}", "{d} hotel economici", "{d} hotel con piscina", "{d} b&b consigliati", "hotel con cancellazione gratuita {in}"],
    en: ["where to stay {in}", "{d} cheap hotels", "{d} hotels with pool", "best b&b in {d}", "{d} free cancellation hotels"],
  },
};

export function buildQueries(dest, category, random, popularity, today) {
  const months = monthsBack(today, QUERY_HISTORY_MONTHS);
  const season = SEASONALITY[dest.category];
  const seasonNorm = season.reduce((s, v) => s + v, 0) / 12; // rende confrontabili le categorie

  const internal = PROMPTS.filter((p) => p.level === "internal");
  const comparative = PROMPTS.filter((p) => p.level === "comparative").slice(0, 6);

  const rows = [];

  const add = (prompt, text, scope) => {
    const weight = templateWeight(prompt.key);
    // La domanda in inglese esiste solo se la destinazione è nota fuori confine.
    const langMult = prompt.lang === "en" ? 0.22 + popularity * 0.72 : 1;
    const scopeMult = scope === "category" ? 0.55 : 1;
    const base =
      (45 + Math.pow(popularity, 2.1) * 26000) * weight * langMult * scopeMult;

    const volumeBase = Math.max(20, base * random.float(0.78, 1.26));
    const [cpcMin, cpcMax] = CPC_BY_FUNNEL[prompt.funnel];
    const cpcBase = random.float(cpcMin, cpcMax) * (0.75 + popularity * 0.6);

    // Storico: stagionalità + crescita strutturale delle ricerche assistite
    // + rumore. Il CPC segue il volume ma con più inerzia.
    const growth = random.float(-0.06, 0.34);
    const history = months.map((m, index) => {
      const progress = index / (months.length - 1);
      const s = season[m.month] / seasonNorm;
      const vol = volumeBase * s * (1 + growth * progress) * (1 + random.normal(0, 0.07));
      const cpc = cpcBase * (0.86 + 0.28 * s) * (1 + growth * 0.6 * progress) * (1 + random.normal(0, 0.05));
      return {
        month: m.key,
        volume: Math.max(10, Math.round(vol / 10) * 10),
        cpc: round(Math.max(0.05, cpc), 2),
      };
    });

    const last12 = history.slice(-12);
    const prev12 = history.slice(-24, -12);
    const sum = (rowsIn) => rowsIn.reduce((s, r) => s + r.volume, 0);
    const yoy = prev12.length ? round((sum(last12) / Math.max(1, sum(prev12)) - 1) * 100, 1) : 0;

    const forms = destinationForms(dest)[prompt.lang];
    const children = (FANOUT[prompt.funnel][prompt.lang] ?? []).map((tpl) =>
      tpl
        .replace(/\{in\}/g, forms.in)
        .replace(/\{the\}/g, forms.the)
        .replace(/\{d\}/g, forms.bare),
    );

    rows.push({
      key: `${dest.key}--${prompt.key}`,
      destination: dest.key,
      category: dest.category,
      scope,
      promptKey: prompt.key,
      level: prompt.level,
      funnel: prompt.funnel,
      lang: prompt.lang,
      text,
      cluster: clusterOf(prompt.key),
      volume: Math.round(sum(last12) / 12 / 10) * 10,
      cpc: round(history.slice(-1)[0].cpc, 2),
      yoy,
      difficulty: Math.round(clamp(random.normal(28 + popularity * 52, 12), 4, 98)),
      // Quante volte, sulle run del mese, l'engine ha davvero espanso la query.
      fanout: children
        .map((child, index) => ({
          text: child,
          share: round(clamp(random.normal(0.72 - index * 0.11, 0.09), 0.05, 0.98), 2),
        }))
        .sort((a, b) => b.share - a.share),
      history,
    });
  };

  for (const prompt of internal) {
    add(prompt, renderPrompt(prompt, { destination: dest }), "destination");
  }
  for (const prompt of comparative) {
    add(prompt, renderPrompt(prompt, { category }), "category");
  }

  rows.sort((a, b) => b.volume - a.volume);
  return rows;
}

// Vista compatta per l'indice globale: lo storico completo resta nel file
// della destinazione, qui basta la sparkline a 12 mesi.
export function compactQuery(row) {
  return {
    key: row.key,
    destination: row.destination,
    category: row.category,
    scope: row.scope,
    funnel: row.funnel,
    lang: row.lang,
    level: row.level,
    cluster: row.cluster,
    text: row.text,
    volume: row.volume,
    cpc: row.cpc,
    yoy: row.yoy,
    difficulty: row.difficulty,
    spark: row.history.slice(-12).map((h) => h.volume),
  };
}
