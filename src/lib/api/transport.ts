// Trasporto verso l'API dell'osservatorio.
//
// Oggi gli endpoint sono file JSON generati da Astro a build time: la richiesta
// è una fetch vera verso una URL vera, con await, stato di caricamento ed
// errori reali. Il giorno in cui esiste il backend si cambia API_BASE e nulla
// altro — nessuna pagina, nessun componente sa da dove arrivino i dati.

export const API_BASE = "/api";

export type DebugMode = "slow" | "error" | "empty" | null;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function debugMode(): DebugMode {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("_debug");
  return value === "slow" || value === "error" || value === "empty" ? value : null;
}

// Latenza derivata dal path, non casuale: le demo devono essere riproducibili
// e la stessa schermata deve comportarsi allo stesso modo a ogni apertura.
function latencyFor(path: string): number {
  let h = 0;
  for (let i = 0; i < path.length; i += 1) h = (h * 31 + path.charCodeAt(i)) >>> 0;
  return 180 + (h % 420);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const cache = new Map<string, unknown>();

export async function request<T>(path: string, init?: { signal?: AbortSignal }): Promise<T> {
  const mode = debugMode();
  const url = `${API_BASE}${path}`;

  if (mode === "error") {
    await sleep(320);
    throw new ApiError(`Chiamata simulata fallita: ${path}`, 503);
  }

  const delay = mode === "slow" ? 2600 : latencyFor(path);

  if (cache.has(url)) {
    // Anche la risposta in cache passa da un tick: i componenti non devono mai
    // dipendere dal fatto che i dati arrivino sincroni.
    await sleep(mode === "slow" ? delay : 0);
    return cache.get(url) as T;
  }

  const [response] = await Promise.all([
    fetch(url, { signal: init?.signal }),
    sleep(delay),
  ]);

  if (!response.ok) {
    throw new ApiError(`${response.status} su ${path}`, response.status);
  }

  const data = (await response.json()) as T;
  cache.set(url, data);
  return mode === "empty" ? (emptyLike(data) as T) : data;
}

// Stato vuoto: serve a mostrare in demo che le schermate reggono anche quando
// il backend non ha ancora dati per quel territorio.
function emptyLike(data: unknown): unknown {
  if (Array.isArray(data)) return [];
  if (data && typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      out[key] = Array.isArray(value) ? [] : value;
    }
    return out;
  }
  return data;
}

export function isDebug(): DebugMode {
  return debugMode();
}
