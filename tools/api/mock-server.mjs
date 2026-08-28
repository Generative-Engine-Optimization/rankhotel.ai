// =============================================================================
// IMPLEMENTAZIONE DI RIFERIMENTO
// =============================================================================
//
//   npm run api:mock            → http://localhost:8787/v1
//   npm run api:check -- --base http://localhost:8787/v1
//
// Un backend vero in miniatura: legge i JSON generati e li serve con i filtri,
// l'ordinamento, la paginazione, gli envelope, i 404 e i 400 che il contratto
// richiede. Passa la suite di conformità al completo, compresi i controlli di
// comportamento che le fixture statiche non possono superare.
//
// A cosa serve, in ordine di utilità:
//
//   1. Chi scrive il backend ha un bersaglio eseguibile, non solo una spec:
//      può confrontare le proprie risposte con queste, campo per campo.
//   2. Il frontend si può già compilare in modalità `http` contro qualcosa —
//      `PUBLIC_API_SOURCE=http PUBLIC_API_BASE_URL=http://localhost:8787/v1
//      npm run build` — e dimostrare che il passaggio funziona prima che il
//      backend esista.
//   3. Le regole di filtro sono qui in trenta righe leggibili: è più veloce
//      leggerle che dedurle dalla specifica.
//
// Non è codice di produzione: niente cache, niente concorrenza, niente
// database. È il comportamento, scritto nel modo più corto possibile.
// =============================================================================

import { createServer } from "node:http";
import { readFileSync, readdirSync } from "node:fs";

const PORT = Number(process.env.PORT ?? 8787);
const PREFIX = "/v1";
const DIR = "src/data/observatory";

const read = (file) => JSON.parse(readFileSync(`${DIR}/${file}`, "utf8"));

const META = read("meta.json");
const NATIONAL = read("national.json");
const CATEGORIES = read("categories.json");
const DESTINATIONS = read("destinations.json");
const HOTELS = read("hotels.json");
const QUERIES = read("queries.json");
const PROMPTS = read("prompts.json");
const DETAIL_KEYS = new Set(
  readdirSync(`${DIR}/destinations`).map((file) => file.replace(/\.json$/, "")),
);

const TAGS = (() => {
  const counts = new Map();
  for (const row of DESTINATIONS) {
    for (const tag of new Set([row.category, ...row.tags])) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return META.tags
    .map((tag) => ({ ...tag, count: counts.get(tag.key) ?? 0 }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
})();

// ------------------------------------------------------------------- filtri
// La stessa semantica di `src/lib/api/query.ts`, che è la specifica.

const normalize = (value) =>
  String(value).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const has = (haystack, term) => normalize(haystack).includes(normalize(term));

function sortRows(rows, value, dir) {
  const sign = dir === "asc" ? 1 : -1;
  // A parità di valore vince la chiave: senza questo, pagina 2 ripete righe
  // della pagina 1 e la tabella perde e duplica dati sotto gli occhi.
  return [...rows].sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    const delta = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
    return delta !== 0 ? delta * sign : a.key.localeCompare(b.key);
  });
}

function paginate(rows, query) {
  const pageSize = Math.min(Math.max(1, Number(query.pageSize) || 60), 500);
  const page = Math.max(1, Number(query.page) || 1);
  const start = (page - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), total: rows.length, page, pageSize };
}

/** Un `sort` fuori elenco è un 400, non un ordinamento silenziosamente ignorato. */
function pickSort(query, allowed, fallback) {
  const value = query.sort ?? fallback;
  if (!allowed.includes(value)) {
    throw new HttpError(400, "bad_request", `sort non ammesso: ${value}. Ammessi: ${allowed.join(", ")}.`);
  }
  if (query.dir && query.dir !== "asc" && query.dir !== "desc") {
    throw new HttpError(400, "bad_request", `dir non ammesso: ${query.dir}. Ammessi: asc, desc.`);
  }
  return value;
}

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---------------------------------------------------------------- endpoint

const ROUTES = [
  ["/meta", () => META],
  ["/national", () => NATIONAL],
  ["/prompts", () => PROMPTS],
  ["/categories", () => list(CATEGORIES)],
  ["/tags", () => list(TAGS)],

  [
    "/destinations",
    (query) => {
      const sort = pickSort(query, ["score", "visitors", "demand", "trend", "name", "nationalRank"], "score");
      const rows = DESTINATIONS.filter(
        (row) =>
          (!query.category || row.category === query.category) &&
          (!query.tag || row.category === query.tag || row.tags.includes(query.tag)) &&
          (!query.region || row.region === query.region) &&
          (!query.tier || row.tier === query.tier) &&
          (!query.q || has(`${row.name.it} ${row.name.en} ${row.region}`, query.q)),
      );
      const value = (row) =>
        sort === "score"
          ? query.engine
            ? row.byEngine[query.engine].score
            : row.score.mean
          : sort === "name"
            ? row.name.it
            : row[sort];
      const dir = query.dir ?? (sort === "name" || sort === "nationalRank" ? "asc" : "desc");
      return paginate(sortRows(rows, value, dir), query);
    },
  ],

  [
    "/hotels",
    (query) => {
      const sort = pickSort(query, ["score", "presence", "avgPosition", "auditScore", "trend", "name", "stars"], "score");
      const rows = HOTELS.filter(
        (row) =>
          (!query.destination || row.destination === query.destination) &&
          (!query.category || row.category === query.category) &&
          (query.realOnly !== "true" || !row.synthetic) &&
          (!query.q || has(`${row.name} ${row.domain} ${row.area ?? ""}`, query.q)),
      );
      const value = (row) => (sort === "score" ? row.score.mean : row[sort]);
      const dir = query.dir ?? (sort === "name" || sort === "avgPosition" ? "asc" : "desc");
      return paginate(sortRows(rows, value, dir), query);
    },
  ],

  [
    "/queries",
    (query) => {
      const sort = pickSort(query, ["volume", "cpc", "yoy", "difficulty", "text"], "volume");
      const rows = QUERIES.filter((row) =>
        ["category", "destination", "lang", "funnel", "level", "cluster"].every(
          (field) => !query[field] || row[field] === query[field],
        ) && (!query.q || has(row.text, query.q)),
      );
      const dir = query.dir ?? (sort === "text" ? "asc" : "desc");
      return paginate(sortRows(rows, (row) => row[sort], dir), query);
    },
  ],
];

const PARAMS = [
  ["/categories/", (key) => CATEGORIES.find((row) => row.key === key), "Categoria"],
  [
    "/destinations/",
    (key) => (DETAIL_KEYS.has(key) ? read(`destinations/${key}.json`) : undefined),
    "Destinazione",
  ],
  [
    "/queries/",
    (key) =>
      CATEGORIES.some((row) => row.key === key)
        ? list(QUERIES.filter((row) => row.category === key))
        : undefined,
    "Categoria",
  ],
];

const list = (rows) => ({ rows, total: rows.length, page: 1, pageSize: rows.length });

// ------------------------------------------------------------------ server

function envelope(payload) {
  const base = { generatedFor: META.generatedFor, version: "v1", simulated: META.simulated };
  // Un risultato paginato porta con sé il totale prima del taglio: senza,
  // il frontend crede che le righe ricevute siano tutte quelle esistenti.
  return payload && typeof payload === "object" && Array.isArray(payload.rows)
    ? { data: payload.rows, meta: { ...base, total: payload.total, page: payload.page, pageSize: payload.pageSize } }
    : { data: payload, meta: base };
}

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const query = Object.fromEntries(url.searchParams);

  const send = (status, body, cache = false) => {
    const text = JSON.stringify(body, null, 2);
    response.writeHead(status, {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      ...(cache ? { "cache-control": "public, max-age=86400" } : {}),
    });
    response.end(text);
    const mark = status < 400 ? "\x1b[32m" : "\x1b[31m";
    console.log(`${mark}${status}\x1b[0m ${request.method} ${request.url}`);
  };

  if (!path.startsWith(PREFIX)) {
    return send(404, {
      error: { status: 404, code: "not_found", message: `Le rotte stanno sotto ${PREFIX}.` },
    });
  }
  const route = path.slice(PREFIX.length) || "/";

  try {
    const exact = ROUTES.find(([pattern]) => pattern === route);
    if (exact) return send(200, envelope(exact[1](query)), true);

    for (const [prefix, resolve, label] of PARAMS) {
      if (!route.startsWith(prefix)) continue;
      const key = decodeURIComponent(route.slice(prefix.length));
      const found = resolve(key);
      if (found === undefined) {
        throw new HttpError(404, "not_found", `${label} inesistente: ${key}`);
      }
      return send(200, envelope(found), true);
    }

    throw new HttpError(404, "not_found", `Endpoint inesistente: ${route}`);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const code = error instanceof HttpError ? error.code : "server_error";
    return send(status, { error: { status, code, message: error.message } });
  }
});

server.listen(PORT, () => {
  console.log(`\nImplementazione di riferimento su \x1b[1mhttp://localhost:${PORT}${PREFIX}\x1b[0m`);
  console.log("\nVerifica:      npm run api:check -- --base http://localhost:" + PORT + PREFIX);
  console.log(
    "Sito su di me: PUBLIC_API_SOURCE=http PUBLIC_API_BASE_URL=http://localhost:" +
      PORT +
      PREFIX +
      " npm run build\n",
  );
});
