// =============================================================================
// SUITE DI CONFORMITÀ
// =============================================================================
//
// Dice se una risposta rispetta il contratto, e se non lo rispetta dice dove.
//
//   npm run api:check                              le fixture in dist/api/v1
//   npm run api:check -- --base https://api…/v1    un backend vero
//   npm run api:check -- --base … --verbose        tutti gli scostamenti
//
// Contro un backend vero controlla anche i comportamenti, non solo le forme:
// che la paginazione tagli davvero, che i filtri filtrino, che l'ordinamento
// ordini, che una chiave inesistente dia 404 con il corpo d'errore giusto.
// Sono le cose che una specifica scritta non riesce a imporre.
//
// Esce con codice 1 se qualcosa non torna: si può mettere in CI così com'è.
// =============================================================================

import { readFileSync } from "node:fs";
import { DEFS, PAYLOADS, ROUTES, ENGINES } from "./contract.mjs";
import { S, validate } from "./schema.mjs";

const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? null : (args[index + 1] ?? true);
};
const BASE = flag("--base");
const VERBOSE = args.includes("--verbose");
const DIST = flag("--dist") ?? "dist/api/v1";
const LIVE = Boolean(BASE);

const results = [];
let failures = 0;

const record = (name, errors, note = "") => {
  const ok = errors.length === 0;
  if (!ok) failures += 1;
  results.push({ name, ok, errors, note });
  const mark = ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
  console.log(`${mark} ${name}${note ? `  \x1b[2m${note}\x1b[0m` : ""}`);
  if (!ok) {
    for (const error of errors.slice(0, VERBOSE ? 100 : 5)) {
      console.log(`    \x1b[31m${error.path}\x1b[0m — ${error.message} (trovato: ${error.got})`);
    }
    if (!VERBOSE && errors.length > 5) {
      console.log(`    \x1b[2m… altri ${errors.length - 5}. Rilancia con --verbose.\x1b[0m`);
    }
  }
};

const problem = (message, got = "") => [{ path: "(risposta)", message, got: String(got) }];

// ------------------------------------------------------------------ lettura

async function load(path, query = "") {
  if (LIVE) {
    const url = `${String(BASE).replace(/\/+$/, "")}${path}${query}`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    return { status: response.status, body: await response.json().catch(() => null), url };
  }
  // Senza backend si leggono i file generati dalla build: stesse URL, stessa
  // forma. La query string non si applica — è il limite dichiarato del sito
  // statico, e infatti i controlli di comportamento girano solo con --base.
  const file = `${DIST}${path}.json`;
  try {
    return { status: 200, body: JSON.parse(readFileSync(file, "utf8")), url: file };
  } catch (error) {
    return { status: 0, body: null, url: file, error };
  }
}

const fill = (path, id) => path.replace(/\{\w+\}/, ROUTES[id].sample ?? "");

// -------------------------------------------------- 1. il registro è unico

function checkRegistryDrift() {
  const source = readFileSync("src/lib/api/endpoints.ts", "utf8");
  const declared = [...source.matchAll(/id:\s*"(\w+)",\s*\n\s*path:\s*"([^"]+)"/g)].map(
    ([, id, path]) => `${id} ${path}`,
  );
  const mirrored = Object.entries(ROUTES).map(([id, route]) => `${id} ${route.path}`);
  const missing = declared.filter((row) => !mirrored.includes(row));
  const extra = mirrored.filter((row) => !declared.includes(row));
  record(
    "registro allineato fra endpoints.ts e contract.mjs",
    [
      ...missing.map((row) => ({ path: row, message: "dichiarato in endpoints.ts, assente qui", got: "-" })),
      ...extra.map((row) => ({ path: row, message: "presente qui, assente in endpoints.ts", got: "-" })),
    ],
    `${declared.length} endpoint`,
  );
}

// --------------------------------------------------------- 2. le forme

async function checkShapes() {
  for (const [id, route] of Object.entries(ROUTES)) {
    const path = fill(route.path, id);
    const { status, body, url, error } = await load(path);

    if (error || status !== 200) {
      record(`GET ${path}`, problem(`atteso 200, ottenuto ${status || "irraggiungibile"}`, url));
      continue;
    }
    if (!body || typeof body !== "object" || !("data" in body) || !("meta" in body)) {
      record(`GET ${path}`, problem("manca l'envelope {data, meta}", Object.keys(body ?? {}).join(",")));
      continue;
    }

    const errors = [
      ...validate(body.meta, S.ref("ResponseMeta"), DEFS).map((e) => ({ ...e, path: `meta.${e.path}` })),
      ...validate(body.data, PAYLOADS[id], DEFS).map((e) => ({ ...e, path: `data.${e.path}` })),
    ];

    if (route.collection) {
      if (!Array.isArray(body.data)) {
        errors.push({ path: "data", message: "un elenco deve essere un array", got: typeof body.data });
      } else if (typeof body.meta.total !== "number") {
        errors.push({ path: "meta.total", message: "obbligatorio sugli elenchi", got: "assente" });
      }
    }

    const size = Array.isArray(body.data) ? `${body.data.length} righe` : "";
    record(`GET ${path}`, errors, size);
  }
}

// ------------------------------------- 3. la coerenza fra endpoint diversi

async function checkCoherence() {
  // `pageSize` alto di proposito: la coerenza si verifica sull'elenco intero.
  // Con il default (60 righe) mezza classifica risulterebbe "inesistente", che
  // è un difetto del controllo, non del backend.
  const [meta, national, categories, destinations, tags] = await Promise.all(
    [
      ["/meta", ""],
      ["/national", ""],
      ["/categories", ""],
      ["/destinations", "?pageSize=500"],
      ["/tags", ""],
    ].map(([path, query]) => load(path, query).then((r) => r.body?.data)),
  );
  if (!meta || !destinations) return record("coerenza", problem("dati non caricabili"));

  const errors = [];
  const keys = new Set(destinations.map((row) => row.key));
  const categoryKeys = new Set(categories?.map((row) => row.key) ?? []);
  const tagKeys = new Set(meta.tags.map((row) => row.key));

  // Un riferimento che non risolve è il difetto più costoso: la pagina esiste,
  // il link porta a un 404, e nessuno se ne accorge finché non ci clicca uno.
  for (const row of destinations) {
    if (!categoryKeys.has(row.category)) {
      errors.push({ path: `destinations[${row.key}].category`, message: "categoria inesistente", got: row.category });
    }
    for (const tag of row.tags) {
      if (!tagKeys.has(tag)) {
        errors.push({ path: `destinations[${row.key}].tags`, message: "tema non dichiarato in meta.tags", got: tag });
      }
    }
    for (const engine of ENGINES) {
      if (!row.byEngine?.[engine]) {
        errors.push({ path: `destinations[${row.key}].byEngine`, message: "engine mancante", got: engine });
      }
    }
  }

  for (const category of categories ?? []) {
    for (const key of category.ranking) {
      if (!keys.has(key)) {
        errors.push({ path: `categories[${category.key}].ranking`, message: "destinazione inesistente", got: key });
      }
    }
    if (category.ranking.length !== category.size) {
      errors.push({
        path: `categories[${category.key}].size`,
        message: `dichiara ${category.size} ma la classifica ne ha ${category.ranking.length}`,
        got: category.size,
      });
    }
  }

  for (const row of national?.leaderboard ?? []) {
    if (!keys.has(row.key)) {
      errors.push({ path: "national.leaderboard", message: "destinazione inesistente", got: row.key });
    }
  }

  if (national && national.destinations !== destinations.length) {
    errors.push({
      path: "national.destinations",
      message: `dichiara ${national.destinations}, /destinations ne restituisce ${destinations.length}`,
      got: national.destinations,
    });
  }

  for (const tag of tags ?? []) {
    const real = destinations.filter((row) => row.category === tag.key || row.tags.includes(tag.key)).length;
    if (real !== tag.count) {
      errors.push({ path: `tags[${tag.key}].count`, message: `dichiara ${tag.count}, contate ${real}`, got: tag.count });
    }
  }

  // Le frazioni che devono sommare a uno: un 85 al posto di 0.85 si vede qui.
  const mixSum = Object.values(national?.sourceMix ?? {}).reduce((a, b) => a + b, 0);
  if (national && Math.abs(mixSum - 1) > 0.02) {
    errors.push({ path: "national.sourceMix", message: "le frazioni devono sommare a 1", got: mixSum.toFixed(3) });
  }

  record("coerenza dei riferimenti fra endpoint", errors, `${destinations.length} destinazioni`);
}

// --------------------------------------- 4. il comportamento (solo --base)

async function checkBehaviour() {
  if (!LIVE) {
    console.log(
      "\n\x1b[2mParametri di query, 404 e paginazione: si verificano solo contro un backend\n" +
        "vero (--base). Le fixture sono file statici e la query string non la vedono.\x1b[0m",
    );
    return;
  }

  // Paginazione
  const first = await load("/queries", "?page=1&pageSize=5");
  const second = await load("/queries", "?page=2&pageSize=5");
  const pageErrors = [];
  if (first.body?.data?.length !== 5) {
    pageErrors.push({ path: "data", message: "pageSize=5 deve restituire 5 righe", got: first.body?.data?.length });
  }
  if (!(first.body?.meta?.total > 5)) {
    pageErrors.push({ path: "meta.total", message: "deve essere il totale prima della paginazione", got: first.body?.meta?.total });
  }
  if (first.body?.meta?.page !== 1 || second.body?.meta?.page !== 2) {
    pageErrors.push({ path: "meta.page", message: "deve riflettere la pagina richiesta", got: second.body?.meta?.page });
  }
  const firstKeys = new Set((first.body?.data ?? []).map((row) => row.key));
  if ((second.body?.data ?? []).some((row) => firstKeys.has(row.key))) {
    pageErrors.push({ path: "data", message: "pagina 2 ripete righe della pagina 1: ordinamento non stabile", got: "-" });
  }
  record("paginazione su /queries", pageErrors);

  // Filtri
  const filtered = await load("/queries", "?category=mare&lang=it&pageSize=50");
  const wrong = (filtered.body?.data ?? []).filter((row) => row.category !== "mare" || row.lang !== "it");
  record(
    "filtri su /queries (category + lang)",
    wrong.length
      ? problem(`${wrong.length} righe non rispettano i filtri`, wrong[0]?.key)
      : filtered.body?.data?.length
        ? []
        : problem("nessuna riga: i filtri hanno svuotato l'elenco"),
    `${filtered.body?.data?.length ?? 0} righe`,
  );

  // Ordinamento
  const sorted = await load("/queries", "?sort=volume&dir=asc&pageSize=20");
  const volumes = (sorted.body?.data ?? []).map((row) => row.volume);
  const ascending = volumes.every((value, i) => i === 0 || volumes[i - 1] <= value);
  record("ordinamento su /queries (sort=volume&dir=asc)", ascending ? [] : problem("non crescente", volumes.slice(0, 5).join(", ")));

  // Ordinamento per engine
  const byEngine = await load("/destinations", "?engine=perplexity&sort=score&dir=desc&pageSize=10");
  const scores = (byEngine.body?.data ?? []).map((row) => row.byEngine?.perplexity?.score);
  const descending = scores.every((value, i) => i === 0 || scores[i - 1] >= value);
  record(
    "ordinamento per engine su /destinations (engine=perplexity)",
    descending && scores.length ? [] : problem("non decrescente sul punteggio di quell'engine", scores.slice(0, 5).join(", ")),
  );

  // 404 con corpo d'errore
  const missing = await load("/destinations/non-esiste-davvero");
  const notFound = [];
  if (missing.status !== 404) {
    notFound.push({ path: "status", message: "una chiave inesistente deve dare 404", got: missing.status });
  }
  notFound.push(...validate(missing.body, S.ref("ApiError"), DEFS));
  record("404 su chiave inesistente", notFound);

  // Parametro fuori elenco
  const bad = await load("/queries", "?sort=coloreDelCielo");
  record(
    "400 su parametro fuori elenco",
    bad.status === 400 ? validate(bad.body, S.ref("ApiError"), DEFS) : problem("atteso 400", bad.status),
  );
}

// ------------------------------------------------------------------- avvio

console.log(
  LIVE
    ? `Verifica del backend: \x1b[1m${BASE}\x1b[0m\n`
    : `Verifica delle fixture: \x1b[1m${DIST}\x1b[0m  \x1b[2m(niente backend: usa --base <url> per verificarne uno)\x1b[0m\n`,
);

checkRegistryDrift();
await checkShapes();
await checkCoherence();
await checkBehaviour();

const passed = results.filter((row) => row.ok).length;
console.log(
  failures === 0
    ? `\n\x1b[32m${passed}/${results.length} controlli superati.\x1b[0m Il contratto è rispettato.`
    : `\n\x1b[31m${failures} controlli falliti\x1b[0m su ${results.length}.`,
);
process.exit(failures === 0 ? 0 : 1);
