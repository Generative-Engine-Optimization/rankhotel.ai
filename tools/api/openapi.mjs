// Genera `docs/api/openapi.yaml` dal contratto.
//
// Il file non si scrive a mano: è la stessa definizione che valida le risposte,
// tradotta. Così la specifica che si consegna e il controllo che si esegue non
// possono raccontare due storie diverse.
//
//   npm run api:spec

import { writeFileSync, mkdirSync } from "node:fs";
import { DEFS, PAYLOADS, ROUTES } from "./contract.mjs";
import { S, toJsonSchema } from "./schema.mjs";

const OUT = "docs/api/openapi.yaml";

// Le descrizioni degli endpoint vivono in src/lib/api/endpoints.ts; qui si
// rileggono da lì, così non esistono due testi da tenere allineati.
import { readFileSync } from "node:fs";
const source = readFileSync("src/lib/api/endpoints.ts", "utf8");

/** Estrae i parametri da un blocco di sorgente: oggetti letterali `{ name: ... }`. */
function parseParams(text) {
  return [...text.matchAll(/\{\s*name:\s*"(\w+)"([^}]*)\}/g)].map(([, name, tail]) => {
    const values = tail.match(/values:\s*\[([^\]]*)\]/);
    const type = tail.match(/type:\s*"(\w+)"/)?.[1] ?? "string";
    return {
      name,
      type,
      description: tail.match(/description:\s*"([^"]*)"/)?.[1] ?? "",
      values: values ? [...values[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : null,
      default: tail.match(/default:\s*("?[\w.]+"?)/)?.[1]?.replace(/"/g, "") ?? null,
    };
  });
}

// I parametri condivisi stanno in due costanti in cima al file e sono inseriti
// negli endpoint con `DIR` e `...PAGE_PARAMS`. Si leggono una volta.
const SHARED = {
  PAGE_PARAMS: parseParams(source.split("const PAGE_PARAMS = [")[1].split("] as const")[0]),
  DIR: parseParams(`{${source.split("const DIR = {")[1].split("} as const")[0]}}`),
};

/** La regione `params: [ ... ]` di un endpoint, con conteggio delle parentesi. */
function paramsRegion(block) {
  const start = block.indexOf("params: [");
  if (start === -1) return "";
  let depth = 0;
  for (let i = start + "params: ".length; i < block.length; i += 1) {
    if (block[i] === "[") depth += 1;
    else if (block[i] === "]") {
      depth -= 1;
      if (depth === 0) return block.slice(start, i + 1);
    }
  }
  return "";
}

function metaFor(id) {
  const block = source.split(`id: "${id}"`)[1]?.split("\n  {\n    id:")[0] ?? "";
  const pick = (field) => {
    const match = block.match(new RegExp(`${field}:\\s*((?:"[^"]*"(?:\\s*\\+\\s*)?)+)`));
    return match ? [...match[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]).join("") : "";
  };

  const region = paramsRegion(block);
  const params = parseParams(region);
  // `DIR` e `...PAGE_PARAMS` sono riferimenti, non letterali: si espandono qui
  // nell'ordine in cui compaiono nel registro.
  if (/\bDIR\b/.test(region)) params.push(...SHARED.DIR);
  if (/\.\.\.PAGE_PARAMS/.test(region)) params.push(...SHARED.PAGE_PARAMS);

  return { summary: pick("summary"), usedBy: pick("usedBy"), params };
}

const yaml = (value, indent = 0) => {
  const pad = "  ".repeat(indent);
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `\n${value.map((item) => `${pad}- ${yaml(item, indent + 1).trimStart()}`).join("\n")}`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    return `\n${entries
      .map(([key, item]) => {
        const rendered = yaml(item, indent + 1);
        const quoted = /^[A-Za-z_$][\w$-]*$/.test(key) ? key : JSON.stringify(key);
        return `${pad}${quoted}:${rendered.startsWith("\n") ? rendered : ` ${rendered}`}`;
      })
      .join("\n")}`;
  }
  if (typeof value === "string") {
    return value.includes("\n") || value.includes(": ") || value.includes("#")
      ? JSON.stringify(value)
      : /^[\w .,;:!?'()\/àèéìòù—–-]+$/u.test(value)
        ? JSON.stringify(value)
        : JSON.stringify(value);
  }
  return String(value);
};

const paths = {};
for (const [id, route] of Object.entries(ROUTES)) {
  const info = metaFor(id);
  const pathParams = [...route.path.matchAll(/\{(\w+)\}/g)].map(([, name]) => ({
    name,
    in: "path",
    required: true,
    description: `Chiave stabile. Esempio: \`${route.sample}\`.`,
    schema: { type: "string" },
  }));
  const queryParams = info.params.map((param) => ({
    name: param.name,
    in: "query",
    required: false,
    description: param.description,
    schema: {
      type: param.type === "number" ? "integer" : param.type,
      ...(param.values ? { enum: param.values } : {}),
      ...(param.default !== null && param.default !== undefined
        ? { default: param.type === "number" ? Number(param.default) : param.default }
        : {}),
    },
  }));

  const responses = {
    200: {
      description: "Risposta conforme al contratto.",
      headers: {
        "Cache-Control": {
          description: "Il dataset cambia una volta al mese.",
          schema: { type: "string", example: "public, max-age=86400" },
        },
      },
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["data", "meta"],
            properties: {
              data: toJsonSchema(PAYLOADS[id], DEFS),
              meta: { $ref: "#/components/schemas/ResponseMeta" },
            },
          },
        },
      },
    },
    400: { $ref: "#/components/responses/Error" },
    404: { $ref: "#/components/responses/Error" },
  };

  paths[route.path] = {
    get: {
      operationId: id,
      summary: info.summary,
      description: `${info.summary}\n\nUsato da: ${info.usedBy}`,
      parameters: [...pathParams, ...queryParams],
      responses,
    },
  };
}

const document = {
  openapi: "3.1.0",
  info: {
    title: "Italian AI Visibility Report — API dell'osservatorio",
    version: "1.0.0",
    description: [
      "Il contratto fra il sito e il backend.",
      "",
      "Generato da `tools/api/openapi.mjs` a partire da `tools/api/contract.mjs`:",
      "non modificare a mano, si riscrive a ogni `npm run api:spec`.",
      "",
      "Regole valide per tutti gli endpoint:",
      "- ogni 2xx è un envelope `{data, meta}`;",
      "- ogni errore è `{error: {status, code, message}}`;",
      "- le mappe per engine contengono sempre chatgpt, gemini e perplexity;",
      "- le percentuali sono frazioni 0-1, i punteggi sono 0-100;",
      "- le chiavi sono stabili nel tempo: finiscono nelle URL pubbliche.",
      "",
      "La conformità si verifica con `npm run api:check -- --base <url>`.",
    ].join("\n"),
  },
  servers: [
    { url: "https://api.rankhotel.ai/v1", description: "Backend (da realizzare)" },
    { url: "https://www.rankhotel.ai/api/v1", description: "Fixture statiche generate dal sito" },
  ],
  paths,
  components: {
    securitySchemes: {
      bearer: { type: "http", scheme: "bearer", description: "Opzionale. Vedi `API_TOKEN`." },
    },
    responses: {
      Error: {
        description: "Errore.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ApiError" } },
        },
      },
    },
    schemas: Object.fromEntries(
      Object.entries(DEFS).map(([name, schema]) => [name, toJsonSchema(schema, DEFS)]),
    ),
  },
};

mkdirSync("docs/api", { recursive: true });
writeFileSync(OUT, `${yaml(document).trimStart()}\n`);
writeFileSync(
  "docs/api/schemas.json",
  `${JSON.stringify(
    { $schema: "https://json-schema.org/draft/2020-12/schema", $defs: document.components.schemas },
    null,
    2,
  )}\n`,
);
console.log(`OpenAPI 3.1 → ${OUT} (${Object.keys(paths).length} endpoint)`);
console.log("Schemi JSON  → docs/api/schemas.json");
