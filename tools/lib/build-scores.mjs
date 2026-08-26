import { clamp, round } from "./prng.mjs";
import {
  ENGINES,
  ENGINE_META,
  SCORE_WEIGHTS,
  HISTORY_MONTHS,
  sampleRuns,
  statFrom,
  statOf,
  weightedScore,
  monthsBack,
} from "./model.mjs";
import { PROMPTS } from "../seed/prompts.mjs";
import { renderPrompt } from "./render-prompt.mjs";

// Ogni engine legge lo stesso territorio con occhi diversi. Il "profilo" qui
// sotto è ciò che fa divergere le classifiche fra ChatGPT, Gemini e Perplexity:
// senza divergenza, la vista per engine non avrebbe ragione di esistere.
function engineAffinity(engine, ctx) {
  const meta = ENGINE_META[engine];
  const { popularity, sourceMix } = ctx;
  // Le quote di fonte vivono in intervalli stretti (l'editoriale non supera
  // mai ~0.55, l'ufficiale ~0.42): vanno riportate a 0..1 sul loro intervallo
  // reale, altrimenti l'affinità resta schiacciata a metà scala per tutti.
  const editorial = clamp(sourceMix.byKind.editorial / 0.55, 0, 1);
  const official = clamp(sourceMix.byKind.dmo / 0.42, 0, 1);
  const w = meta.popularityBias + meta.editorialBias + meta.officialBias;
  const raw =
    meta.popularityBias * popularity +
    meta.editorialBias * editorial +
    meta.officialBias * official;
  return clamp(raw / w, 0, 1);
}

// Un engine non può citare ciò che non riesce a leggere: l'accessibilità
// tecnica non è un fattore a sé, è anche un moltiplicatore sugli altri.
function accessMultiplier(technical) {
  return 0.72 + 0.28 * (technical / 100);
}

export function buildFactors(dest, random, ctx) {
  const byEngine = {};

  for (const engine of ENGINES) {
    const affinity = engineAffinity(engine, ctx);
    const access = accessMultiplier(ctx.technical[engine]);

    // Presenza comparativa: la destinazione entra nell'elenco quando si chiede
    // "le migliori X in Italia"? La notorietà pesa moltissimo qui, e il divario
    // fra una meta da venti milioni di visitatori e un borgo da cinquecento
    // abitanti deve vedersi: se i due finiscono a quattro punti di distanza,
    // la scala non sta misurando, sta arrotondando.
    const comparative = clamp(
      random.normal((6 + affinity * 52 + ctx.popularity * 40) * access, 5),
      3,
      99,
    );

    // Profondità interna: quante delle entità reali del territorio sa citare.
    // Cala meno della presenza sulle destinazioni piccole: un'AI può non
    // suggerire Apricale e comunque sapere cos'è il Castello della Lucertola.
    const internal = clamp(
      random.normal((22 + affinity * 34 + ctx.popularity * 42) * (0.85 + 0.15 * access), 5.5),
      5,
      99,
    );

    // Qualità delle fonti, riletta con la preferenza dell'engine.
    const meta = ENGINE_META[engine];
    const sourceTilt =
      ctx.sourceMix.byKind.dmo * meta.officialBias +
      ctx.sourceMix.byKind.editorial * meta.editorialBias +
      ctx.sourceMix.byKind.ota * 0.22;
    // Le fonti di qualità premiano chi ha un ecosistema editoriale attorno,
    // che è correlato alla notorietà ma non coincide: ci sono territori piccoli
    // molto raccontati e territori grandi raccontati solo dalle OTA.
    const sources = clamp(
      random.normal(
        ctx.sourceMix.quality * (0.7 + sourceTilt * 0.5) + ctx.popularity * 16,
        5,
      ),
      4,
      99,
    );

    const technical = ctx.technical[engine];

    const factors = {
      comparative: round(comparative, 1),
      internal: round(internal, 1),
      sources: round(sources, 1),
      technical: round(technical, 1),
    };
    byEngine[engine] = { factors, score: round(weightedScore(factors), 1) };
  }

  // Il generale è la media dei tre engine: dichiarato così in metodologia,
  // nessuna ponderazione nascosta fra vendor.
  const avg = (pick) =>
    round(ENGINES.reduce((s, e) => s + pick(byEngine[e]), 0) / ENGINES.length, 1);

  const overallFactors = {
    comparative: avg((e) => e.factors.comparative),
    internal: avg((e) => e.factors.internal),
    sources: avg((e) => e.factors.sources),
    technical: avg((e) => e.factors.technical),
  };

  return {
    overall: { factors: overallFactors, score: round(weightedScore(overallFactors), 1) },
    byEngine,
  };
}

// Le N run del mese.
//
// Due identità devono valere ESATTAMENTE, non per approssimazione, perché il
// sito le dichiara in metodologia e chiunque può rifare il conto sulla pagina:
//
//   1. score di un engine = i suoi quattro fattori pesati
//   2. score generale     = media dei tre score per engine
//
// Per questo ogni run misura i fattori e ne DERIVA lo score, invece di
// campionare i due separatamente: nella realtà è quello che succede.
export function withRuns(random, factors, popularity) {
  const volatility = 2.2 + (1 - popularity) * 4.6;
  const factorKeys = Object.keys(factors.overall.factors);

  const perEngine = {};
  for (const engine of ENGINES) {
    const block = factors.byEngine[engine];
    const factorRuns = Object.fromEntries(
      factorKeys.map((key) => [
        key,
        // L'accessibilità tecnica è misurata sui siti, non interrogata ai
        // modelli: fra una run e l'altra non cambia.
        key === "technical"
          ? sampleRuns(random, block.factors[key], 0.15)
          : sampleRuns(random, block.factors[key], volatility * 1.15),
      ]),
    );
    const scoreRuns = factorRuns[factorKeys[0]].map((_, index) =>
      weightedScore(
        Object.fromEntries(factorKeys.map((key) => [key, factorRuns[key][index]])),
      ),
    );
    perEngine[engine] = { score: scoreRuns, factors: factorRuns };
  }

  const acrossEngines = (pick) =>
    pick(perEngine[ENGINES[0]]).map(
      (_, index) =>
        ENGINES.reduce((sum, engine) => sum + pick(perEngine[engine])[index], 0) /
        ENGINES.length,
    );

  return {
    overall: {
      score: statOf(acrossEngines((runs) => runs.score)),
      factors: Object.fromEntries(
        factorKeys.map((key) => [key, statOf(acrossEngines((runs) => runs.factors[key]))]),
      ),
    },
    byEngine: Object.fromEntries(
      ENGINES.map((engine) => [
        engine,
        {
          score: statOf(perEngine[engine].score),
          factors: Object.fromEntries(
            factorKeys.map((key) => [key, statOf(perEngine[engine].factors[key])]),
          ),
        },
      ]),
    ),
  };
}

export function buildHistory(dest, random, runs, popularity, today) {
  const months = monthsBack(today, HISTORY_MONTHS);
  const currentScore = runs.overall.score.mean;
  const drift = random.float(-4.5, 5.5); // scostamento fra la prima e l'ultima rilevazione
  const volatility = 2.2 + (1 - popularity) * 4.6;

  return months.map((m, index) => {
    const isLast = index === months.length - 1;

    // L'ultima rilevazione È il punteggio corrente, non una sua ricostruzione.
    // Un grafico che finisce su un numero diverso da quello scritto in cima
    // alla pagina costringe il lettore a scegliere a quale dei due credere.
    if (isLast) {
      return {
        month: m.key,
        score: runs.overall.score,
        byEngine: Object.fromEntries(
          ENGINES.map((engine) => [engine, runs.byEngine[engine].score]),
        ),
      };
    }

    const progress = index / (months.length - 1);
    const eased = progress * progress * (3 - 2 * progress);
    const base = clamp(currentScore - drift * (1 - eased) + random.normal(0, 1.4), 3, 99);
    return {
      month: m.key,
      score: statFrom(random, base, volatility),
      byEngine: Object.fromEntries(
        ENGINES.map((engine) => [
          engine,
          statFrom(
            random,
            clamp(base + (runs.byEngine[engine].score.mean - currentScore) + random.normal(0, 2.4), 3, 99),
            volatility,
          ),
        ]),
      ),
    };
  });
}

// --------------------------------------------------------- ESITI DEI PROMPT

export function buildPromptResults(dest, random, factors, category) {
  const comparative = [];
  const internal = [];

  for (const prompt of PROMPTS) {
    const isComparative = prompt.level === "comparative";
    const target = isComparative ? comparative : internal;

    // Il divario IT/EN è un risultato, non un dettaglio: le AI raccontano
    // l'Italia in modo diverso a chi è dentro e a chi è fuori.
    const langTilt = prompt.lang === "en" ? random.normal(-4.5, 4) : random.normal(2.5, 4);
    const funnelTilt =
      prompt.funnel === "booking" ? -6 : prompt.funnel === "planning" ? 1.5 : 4;

    const byEngine = {};
    for (const engine of ENGINES) {
      const base = isComparative
        ? factors.byEngine[engine].factors.comparative
        : factors.byEngine[engine].factors.internal;
      const value = clamp(base + langTilt + funnelTilt + random.normal(0, 6), 0, 100);
      const mentionRate = round(value / 100, 3);
      byEngine[engine] = {
        mentionRate,
        // Posizione media nell'elenco: alta presenza = posizione migliore.
        position: round(clamp(1 + (1 - mentionRate) * 11 + random.normal(0, 1.1), 1, 14), 1),
        runs: 5,
      };
    }

    const text = renderPrompt(prompt, { destination: dest, category });

    target.push({
      key: prompt.key,
      lang: prompt.lang,
      funnel: prompt.funnel,
      level: prompt.level,
      text,
      byEngine,
    });
  }

  return { comparative, internal };
}

// Copertura delle entità reali del territorio: il dato più concreto
// dell'osservatorio, perché è verificabile a occhio da chi il posto lo conosce.
export function buildEntityCoverage(dest, random, factors) {
  return dest.knownFor.map((entity, index) => {
    const prominence = 1 - index / (dest.knownFor.length + 1); // le prime sono le più note
    const byEngine = {};
    for (const engine of ENGINES) {
      const base = factors.byEngine[engine].factors.internal / 100;
      byEngine[engine] = round(
        clamp(base * (0.55 + prominence * 0.75) + random.normal(0, 0.1), 0, 1),
        3,
      );
    }
    return { name: entity, byEngine };
  });
}

// Aggregazione per stadio di funnel e per lingua, calcolata dagli esiti dei
// prompt: nessun numero inventato una seconda volta.
export function summarise(results) {
  const group = (rows, keyFn) => {
    const map = new Map();
    for (const row of rows) {
      const k = keyFn(row);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(row);
    }
    const out = {};
    for (const [k, list] of map) {
      const byEngine = {};
      for (const engine of ENGINES) {
        const rates = list.map((r) => r.byEngine[engine].mentionRate);
        const positions = list.map((r) => r.byEngine[engine].position);
        byEngine[engine] = {
          mentionRate: round(rates.reduce((s, v) => s + v, 0) / rates.length, 3),
          position: round(positions.reduce((s, v) => s + v, 0) / positions.length, 1),
        };
      }
      const all = ENGINES.map((e) => byEngine[e].mentionRate);
      out[k] = {
        byEngine,
        mentionRate: round(all.reduce((s, v) => s + v, 0) / all.length, 3),
        prompts: list.length,
      };
    }
    return out;
  };

  const all = [...results.comparative, ...results.internal];
  return {
    byFunnel: group(all, (r) => r.funnel),
    byLang: group(all, (r) => r.lang),
    byLevel: group(all, (r) => r.level),
    byFunnelLang: group(all, (r) => `${r.funnel}:${r.lang}`),
  };
}
