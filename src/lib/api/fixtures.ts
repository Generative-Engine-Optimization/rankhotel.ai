// =============================================================================
// SORGENTE «FIXTURES» — solo lato build
// =============================================================================
//
// La simulazione del backend. Legge i JSON generati da `npm run data:generate`
// direttamente dal disco: a build time non esiste nessun server da interrogare,
// e 285 pagine che fanno fetch verso sé stesse non si compilerebbero.
//
// ATTENZIONE: questo file non deve mai finire in un bundle del browser — si
// porterebbe dietro 12 MB di schede destinazione. Lo importa solo `server.ts`,
// che gira in Node. Il browser passa da `client.ts`, che fa fetch vere.
//
// Ogni funzione qui dentro ha la stessa firma dell'endpoint corrispondente:
// è la riga di riferimento per chi scriverà l'implementazione vera.
// =============================================================================

import categoriesJson from "../../data/observatory/categories.json";
import destinationsJson from "../../data/observatory/destinations.json";
import hotelsJson from "../../data/observatory/hotels.json";
import metaJson from "../../data/observatory/meta.json";
import nationalJson from "../../data/observatory/national.json";
import promptsJson from "../../data/observatory/prompts.json";
import queriesJson from "../../data/observatory/queries.json";
import { API_VERSION } from "./endpoints";
import { ApiError } from "./transport";
import type {
  CategoryDTO,
  DestinationDTO,
  DestinationDetailDTO,
  Envelope,
  HotelSummaryDTO,
  MetaDTO,
  NationalDTO,
  PromptsDTO,
  QuerySummaryDTO,
  ResponseMeta,
  TagDTO,
} from "./types";

export const META = metaJson as unknown as MetaDTO;
export const NATIONAL = nationalJson as unknown as NationalDTO;
export const CATEGORIES = categoriesJson as unknown as CategoryDTO[];
export const DESTINATIONS = destinationsJson as unknown as DestinationDTO[];
export const HOTELS = hotelsJson as unknown as HotelSummaryDTO[];
export const PROMPTS = promptsJson as unknown as PromptsDTO;
export const QUERIES = queriesJson as unknown as QuerySummaryDTO[];

/**
 * I temi in uso con il loro conteggio. Non c'è un file: è un aggregato che il
 * backend calcolerà con una GROUP BY. Qui lo si calcola una volta sola.
 */
export function tags(): TagDTO[] {
  const counts = new Map<string, number>();
  for (const destination of DESTINATIONS) {
    for (const tag of new Set([destination.category, ...destination.tags])) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return META.tags
    .map((tag) => ({ ...tag, count: counts.get(tag.key) ?? 0 }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

export function category(key: string): CategoryDTO {
  const found = CATEGORIES.find((row) => row.key === key);
  if (!found) throw new ApiError(`Categoria inesistente: ${key}`, 404, "not_found", "/categories");
  return found;
}

// Le 100 schede pesano ~110 KB l'una: si caricano una alla volta, solo dalla
// pagina che le usa. Importarle tutte insieme metterebbe 12 MB in ogni bundle.
const detailFiles = import.meta.glob<{ default: DestinationDetailDTO }>(
  "../../data/observatory/destinations/*.json",
);

export async function destination(key: string): Promise<DestinationDetailDTO> {
  const loader = detailFiles[`../../data/observatory/destinations/${key}.json`];
  if (!loader) {
    throw new ApiError(`Destinazione inesistente: ${key}`, 404, "not_found", "/destinations");
  }
  return (await loader()).default;
}

/** L'envelope che le rotte fixture emettono, identico a quello del backend. */
export function envelope<T>(data: T, extra: Partial<ResponseMeta> = {}): Envelope<T> {
  return {
    data,
    meta: {
      generatedFor: META.generatedFor,
      version: API_VERSION,
      simulated: META.simulated,
      ...extra,
    },
  };
}
