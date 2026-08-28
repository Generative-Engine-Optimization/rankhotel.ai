// =============================================================================
// UN VALIDATORE MINIMO
// =============================================================================
//
// Serve a due cose che devono restare d'accordo fra loro: validare le risposte
// (`check.mjs`) e generare l'OpenAPI (`openapi.mjs`). Scritte separate,
// divergono entro un mese.
//
// Niente dipendenze: il progetto ne ha cinque, e un validatore di 200 righe non
// vale la sesta.
// =============================================================================

export const S = {
  string: (opts = {}) => ({ t: "string", ...opts }),
  number: (opts = {}) => ({ t: "number", ...opts }),
  integer: (opts = {}) => ({ t: "number", integer: true, ...opts }),
  boolean: (opts = {}) => ({ t: "boolean", ...opts }),
  /** Percentuale come frazione. Un 85 al posto di 0.85 è l'errore più probabile. */
  fraction: (opts = {}) => ({ t: "number", min: 0, max: 1, ...opts }),
  /** Punteggio 0–100. */
  score: (opts = {}) => ({ t: "number", min: 0, max: 100, ...opts }),
  enum: (values, opts = {}) => ({ t: "enum", values, ...opts }),
  const: (value) => ({ t: "enum", values: [value] }),
  array: (item, opts = {}) => ({ t: "array", item, ...opts }),
  tuple: (items, opts = {}) => ({ t: "tuple", items, ...opts }),
  object: (fields, opts = {}) => ({ t: "object", fields, ...opts }),
  /** Dizionario a chiavi libere, o vincolate a un elenco con `keys`. */
  record: (value, opts = {}) => ({ t: "record", value, ...opts }),
  union: (options, opts = {}) => ({ t: "union", options, ...opts }),
  nullable: (schema) => ({ ...schema, nullable: true }),
  ref: (name, opts = {}) => ({ t: "ref", name, ...opts }),
  /** `YYYY-MM-DD`. */
  date: (opts = {}) => ({ t: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", ...opts }),
  /** `YYYY-MM`. */
  month: (opts = {}) => ({ t: "string", pattern: "^\\d{4}-\\d{2}$", ...opts }),
  /** Chiave stabile: minuscole, cifre e trattini. Finisce nelle URL. */
  key: (opts = {}) => ({ t: "string", pattern: "^[a-z0-9][a-z0-9-]*$", ...opts }),
};

/** Campo facoltativo: assente e `null` sono entrambi accettati. */
export const optional = (schema) => ({ ...schema, optional: true });

// -------------------------------------------------------------- validazione

class Ctx {
  constructor(defs) {
    this.defs = defs;
    this.errors = [];
  }
  fail(path, message, got) {
    this.errors.push({ path: path || "(radice)", message, got: preview(got) });
  }
}

function preview(value) {
  if (value === undefined) return "assente";
  if (value === null) return "null";
  if (Array.isArray(value)) return `array(${value.length})`;
  if (typeof value === "object") return `object{${Object.keys(value).slice(0, 4).join(",")}}`;
  const text = String(value);
  return text.length > 40 ? `${text.slice(0, 40)}…` : text;
}

function walk(value, schema, path, ctx) {
  if (schema.t === "ref") {
    const target = ctx.defs[schema.name];
    if (!target) return ctx.fail(path, `definizione mancante: ${schema.name}`, value);
    return walk(value, target, path, ctx);
  }

  if (value === null || value === undefined) {
    if (schema.nullable || schema.optional) return;
    return ctx.fail(path, `manca (atteso ${describe(schema)})`, value);
  }

  switch (schema.t) {
    case "string": {
      if (typeof value !== "string") return ctx.fail(path, "atteso string", value);
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
        ctx.fail(path, `non rispetta ${schema.pattern}`, value);
      }
      if (schema.minLength && value.length < schema.minLength) {
        ctx.fail(path, `più corto di ${schema.minLength}`, value);
      }
      return;
    }
    case "number": {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return ctx.fail(path, "atteso number finito", value);
      }
      if (schema.integer && !Number.isInteger(value)) ctx.fail(path, "atteso intero", value);
      if (schema.min !== undefined && value < schema.min) {
        ctx.fail(path, `sotto il minimo ${schema.min}`, value);
      }
      if (schema.max !== undefined && value > schema.max) {
        ctx.fail(path, `sopra il massimo ${schema.max}`, value);
      }
      return;
    }
    case "boolean":
      if (typeof value !== "boolean") ctx.fail(path, "atteso boolean", value);
      return;
    case "enum":
      if (!schema.values.includes(value)) {
        ctx.fail(path, `atteso uno di [${schema.values.join(", ")}]`, value);
      }
      return;
    case "array": {
      if (!Array.isArray(value)) return ctx.fail(path, "atteso array", value);
      if (schema.minItems && value.length < schema.minItems) {
        ctx.fail(path, `almeno ${schema.minItems} elementi`, value);
      }
      // Su collezioni grandi si campiona: validare 3200 righe a ogni giro
      // costa e non trova niente che le prime cento non abbiano già trovato.
      const limit = schema.sample ?? value.length;
      const step = Math.max(1, Math.ceil(value.length / limit));
      for (let i = 0; i < value.length; i += step) {
        walk(value[i], schema.item, `${path}[${i}]`, ctx);
      }
      return;
    }
    case "tuple": {
      if (!Array.isArray(value)) return ctx.fail(path, "atteso array", value);
      if (value.length !== schema.items.length) {
        ctx.fail(path, `attesi ${schema.items.length} elementi`, value);
      }
      schema.items.forEach((item, i) => walk(value[i], item, `${path}[${i}]`, ctx));
      return;
    }
    case "object": {
      if (typeof value !== "object" || Array.isArray(value)) {
        return ctx.fail(path, "atteso object", value);
      }
      for (const [name, field] of Object.entries(schema.fields)) {
        const child = path ? `${path}.${name}` : name;
        if (!(name in value) && !field.optional) {
          ctx.fail(child, `campo obbligatorio mancante (${describe(field)})`, undefined);
          continue;
        }
        if (name in value) walk(value[name], field, child, ctx);
      }
      // Un campo in più non è un errore: il backend può aggiungere, non togliere.
      return;
    }
    case "record": {
      if (typeof value !== "object" || Array.isArray(value)) {
        return ctx.fail(path, "atteso object", value);
      }
      if (schema.keys) {
        for (const key of schema.keys) {
          if (!(key in value)) ctx.fail(`${path}.${key}`, "chiave obbligatoria mancante", undefined);
        }
      }
      for (const [key, item] of Object.entries(value)) {
        if (schema.keys && !schema.keys.includes(key)) {
          ctx.fail(`${path}.${key}`, `chiave non prevista (ammesse: ${schema.keys.join(", ")})`, key);
          continue;
        }
        walk(item, schema.value, `${path}.${key}`, ctx);
      }
      return;
    }
    case "union": {
      const attempts = schema.options.map((option) => {
        const probe = new Ctx(ctx.defs);
        walk(value, option, path, probe);
        return probe.errors;
      });
      if (attempts.every((errors) => errors.length > 0)) {
        ctx.fail(path, `non corrisponde a nessuna delle ${schema.options.length} varianti`, value);
      }
      return;
    }
    default:
      ctx.fail(path, `schema sconosciuto: ${schema.t}`, value);
  }
}

function describe(schema) {
  if (schema.t === "enum") return `enum[${schema.values.join("|")}]`;
  if (schema.t === "ref") return schema.name;
  if (schema.t === "array") return `${describe(schema.item)}[]`;
  return schema.t;
}

/** Restituisce l'elenco degli scostamenti. Vuoto = conforme. */
export function validate(value, schema, defs = {}) {
  const ctx = new Ctx(defs);
  walk(value, schema, "", ctx);
  return ctx.errors;
}

// ------------------------------------------------------------ verso OpenAPI

/** Converte lo schema in JSON Schema, come lo vuole OpenAPI 3.1. */
export function toJsonSchema(schema, defs) {
  const out = jsonSchema(schema, defs);
  if (schema.nullable && out.type) out.type = [out.type, "null"];
  if (schema.description) out.description = schema.description;
  return out;
}

function jsonSchema(schema, defs) {
  switch (schema.t) {
    case "ref":
      return { $ref: `#/components/schemas/${schema.name}` };
    case "string": {
      const out = { type: "string" };
      if (schema.pattern) out.pattern = schema.pattern;
      return out;
    }
    case "number": {
      const out = { type: schema.integer ? "integer" : "number" };
      if (schema.min !== undefined) out.minimum = schema.min;
      if (schema.max !== undefined) out.maximum = schema.max;
      return out;
    }
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return { type: typeof schema.values[0] === "number" ? "number" : "string", enum: schema.values };
    case "array":
      return { type: "array", items: toJsonSchema(schema.item, defs) };
    case "tuple":
      return {
        type: "array",
        prefixItems: schema.items.map((item) => toJsonSchema(item, defs)),
        minItems: schema.items.length,
        maxItems: schema.items.length,
      };
    case "object":
      return {
        type: "object",
        required: Object.entries(schema.fields)
          .filter(([, field]) => !field.optional)
          .map(([name]) => name),
        properties: Object.fromEntries(
          Object.entries(schema.fields).map(([name, field]) => [name, toJsonSchema(field, defs)]),
        ),
      };
    case "record":
      return {
        type: "object",
        ...(schema.keys ? { required: [...schema.keys] } : {}),
        additionalProperties: toJsonSchema(schema.value, defs),
      };
    case "union":
      return { oneOf: schema.options.map((option) => toJsonSchema(option, defs)) };
    default:
      return {};
  }
}
