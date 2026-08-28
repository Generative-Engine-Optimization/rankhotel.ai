// =============================================================================
// TRASPORTO
// =============================================================================
//
// L'unico punto del sito che sa da dove arrivano i dati. Tutto il resto —
// pagine, componenti, script di pagina — chiama `server.ts` o `client.ts` e non
// ha idea se dietro ci sia un file statico o un'API vera.
//
// Due sorgenti, stessa firma:
//
//   fixtures  Le fixture generate da `npm run data:generate`, servite come file
//             statici sotto `/api/v1/*.json`. È il default: il sito si compila
//             e gira senza che nessun backend esista.
//   http      Un backend vero. Si accende con una variabile d'ambiente, non
//             con una modifica al codice.
//
// Il passaggio dall'una all'altro è questo, e non altro:
//
//   PUBLIC_API_SOURCE=http
//   PUBLIC_API_BASE_URL=https://api.rankhotel.ai/v1
//
// Vedi `.env.example`.
// =============================================================================

import { API_VERSION } from "./endpoints";
import type { ApiErrorBody, Envelope, ResponseMeta } from "./types";

export type ApiSource = "fixtures" | "http";

// `import.meta.env` è tipizzato da Astro solo per le PUBLIC_*; le altre passano
// da qui, con i default espliciti in un posto solo.
const env = import.meta.env as Record<string, string | undefined>;

const bool = (value: string | undefined, fallback: boolean) =>
  value === undefined ? fallback : value === "true" || value === "1";

const int = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** Sorgente attiva. In fixtures i filtri girano in locale, in http sul backend. */
export const API_SOURCE: ApiSource = env.PUBLIC_API_SOURCE === "http" ? "http" : "fixtures";

export const isFixtures = () => API_SOURCE === "fixtures";

/**
 * La base delle URL.
 *
 * In fixtures è un path relativo servito dal sito stesso. In http è la base del
 * backend: `API_BASE_URL` ha la precedenza a build time (può essere un
 * indirizzo interno, più veloce e non esposto), `PUBLIC_API_BASE_URL` è quella
 * che finisce nel bundle del browser.
 */
export function baseUrl(side: "server" | "browser" = "browser"): string {
  if (API_SOURCE === "fixtures") return `/api/${API_VERSION}`;
  const configured =
    side === "server"
      ? (env.API_BASE_URL ?? env.PUBLIC_API_BASE_URL)
      : env.PUBLIC_API_BASE_URL;
  if (!configured) {
    throw new Error(
      "PUBLIC_API_SOURCE=http richiede PUBLIC_API_BASE_URL (o API_BASE_URL a build time). Vedi .env.example.",
    );
  }
  return configured.replace(/\/+$/, "");
}

/** Il token non viaggia mai nel bundle del browser se sta in `API_TOKEN`. */
function authHeader(side: "server" | "browser"): Record<string, string> {
  const token = side === "server" ? (env.API_TOKEN ?? env.PUBLIC_API_TOKEN) : env.PUBLIC_API_TOKEN;
  return token ? { authorization: `Bearer ${token}` } : {};
}

export const TIMEOUT_MS = int(env.API_TIMEOUT_MS, 15000);
export const RETRIES = int(env.API_RETRIES, 2);

// ------------------------------------------------------------------- errori

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorBody["error"]["code"];
  readonly path: string;

  constructor(
    message: string,
    status: number,
    code: ApiErrorBody["error"]["code"] = "server_error",
    path = "",
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.path = path;
  }

  /** Vale la pena riprovare: rete, timeout, 5xx, 429. Un 404 no. */
  get retryable(): boolean {
    return this.status === 0 || this.status === 429 || this.status >= 500;
  }
}

function codeFor(status: number): ApiErrorBody["error"]["code"] {
  if (status === 404) return "not_found";
  if (status === 400) return "bad_request";
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 429) return "rate_limited";
  return "server_error";
}

// --------------------------------------------------------------- modi demo
//
// `?_debug=slow|error|empty` sulla URL della pagina. Servono a mostrare in
// demo che le schermate reggono la latenza, l'errore e il territorio senza
// dati — tre stati che con le fixture non si vedrebbero mai. Valgono solo in
// fixtures e solo nel browser: contro un backend vero non intercettano nulla.

export type DebugMode = "slow" | "error" | "empty" | null;

export function debugMode(): DebugMode {
  if (typeof window === "undefined" || API_SOURCE !== "fixtures") return null;
  const value = new URLSearchParams(window.location.search).get("_debug");
  return value === "slow" || value === "error" || value === "empty" ? value : null;
}

// Latenza derivata dal path, non casuale: la stessa schermata deve comportarsi
// allo stesso modo a ogni apertura, altrimenti una demo non è ripetibile.
function fakeLatency(path: string): number {
  let hash = 0;
  for (let i = 0; i < path.length; i += 1) hash = (hash * 31 + path.charCodeAt(i)) >>> 0;
  return 180 + (hash % 420);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Svuota gli array di una risposta lasciandone la forma. */
function emptyLike(data: unknown): unknown {
  if (Array.isArray(data)) return [];
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? [] : value]),
    );
  }
  return data;
}

// ------------------------------------------------------------------ fetch

export type FetchOptions = {
  signal?: AbortSignal;
  side?: "server" | "browser";
  /** Salta la cache di processo. Serve solo agli script di verifica. */
  fresh?: boolean;
};

/** Cache di processo: a build time evita 285 riletture della stessa collezione. */
const cache = new Map<string, Envelope<unknown>>();

export function clearCache(): void {
  cache.clear();
}

/**
 * Una richiesta all'API. Restituisce l'envelope intero: `data` e `meta`
 * servono entrambi, perché `meta` porta il mese di riferimento e il totale.
 */
export async function requestEnvelope<T>(
  path: string,
  options: FetchOptions = {},
): Promise<Envelope<T>> {
  const side = options.side ?? (typeof window === "undefined" ? "server" : "browser");
  const mode = debugMode();

  if (mode === "error") {
    await sleep(320);
    throw new ApiError(`Errore simulato su ${path}`, 503, "server_error", path);
  }

  // In fixtures il path canonico `/queries` diventa il file `/queries.json`:
  // un sito statico non ha rotte, ha file. Il resto del codice non lo sa.
  const url = `${baseUrl(side)}${isFixtures() ? toFixturePath(path) : path}`;

  const cached = !options.fresh && cache.get(url);
  if (cached) {
    // Anche la risposta in cache passa da un tick: nessun componente deve
    // dipendere dal fatto che i dati arrivino sincroni.
    await sleep(mode === "slow" ? 2600 : 0);
    return withDebug(cached, mode) as Envelope<T>;
  }

  const delay = mode === "slow" ? 2600 : mode ? fakeLatency(path) : 0;
  const [envelope] = await Promise.all([
    fetchWithRetry<T>(url, path, side, options.signal),
    delay ? sleep(delay) : Promise.resolve(),
  ]);

  if (!options.fresh) cache.set(url, envelope);
  return withDebug(envelope, mode) as Envelope<T>;
}

function withDebug<T>(envelope: Envelope<T>, mode: DebugMode): Envelope<T> {
  return mode === "empty" ? { ...envelope, data: emptyLike(envelope.data) as T } : envelope;
}

async function fetchWithRetry<T>(
  url: string,
  path: string,
  side: "server" | "browser",
  signal?: AbortSignal,
): Promise<Envelope<T>> {
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    try {
      return await fetchOnce<T>(url, path, side, signal);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(`Rete non raggiungibile su ${path}`, 0, "server_error", path);
      if (!apiError.retryable || attempt === RETRIES) throw apiError;
      lastError = apiError;
      // Attesa crescente: 300 ms, 900 ms. Un backend che riparte non gradisce
      // trecento build che ribattono nello stesso istante.
      await sleep(300 * 3 ** attempt);
    }
  }

  throw lastError ?? new ApiError(`Fallita ${path}`, 0, "server_error", path);
}

async function fetchOnce<T>(
  url: string,
  path: string,
  side: "server" | "browser",
  signal?: AbortSignal,
): Promise<Envelope<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json", ...authHeader(side) },
    });

    if (!response.ok) {
      throw new ApiError(
        await errorMessage(response, path),
        response.status,
        codeFor(response.status),
        path,
      );
    }

    return unwrap<T>(await response.json(), path);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (controller.signal.aborted) {
      throw new ApiError(`Timeout dopo ${TIMEOUT_MS} ms su ${path}`, 0, "server_error", path);
    }
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

async function errorMessage(response: Response, path: string): Promise<string> {
  try {
    const body = (await response.json()) as Partial<ApiErrorBody>;
    if (body?.error?.message) return body.error.message;
  } catch {
    // Un errore senza corpo JSON è normale davanti a un proxy.
  }
  return `${response.status} ${response.statusText || "errore"} su ${path}`;
}

/**
 * Accetta l'envelope `{data, meta}` e, per tolleranza, anche una risposta nuda.
 * Un backend che dimentica l'envelope non deve far cadere il sito, ma
 * `npm run api:check` lo segnala come violazione del contratto.
 */
function unwrap<T>(body: unknown, path: string): Envelope<T> {
  if (body && typeof body === "object" && "data" in body) {
    const envelope = body as Envelope<T>;
    return { data: envelope.data, meta: normalizeMeta(envelope.meta) };
  }
  return { data: body as T, meta: normalizeMeta(undefined) };
}

function normalizeMeta(meta: ResponseMeta | undefined): ResponseMeta {
  return { generatedFor: "", version: API_VERSION, ...(meta ?? {}) };
}

/** `/destinations/roma` → `/destinations/roma.json`, lasciando stare la query string. */
export function toFixturePath(path: string): string {
  const [route, query] = path.split("?");
  return `${route.endsWith(".json") ? route : `${route}.json`}${query ? `?${query}` : ""}`;
}

/** Scorciatoia per chi vuole solo il corpo. */
export async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  return (await requestEnvelope<T>(path, options)).data;
}
