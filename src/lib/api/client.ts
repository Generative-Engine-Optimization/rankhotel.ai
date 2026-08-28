// =============================================================================
// CLIENT DEL BROWSER
// =============================================================================
//
// Quello che usano gli script di pagina: cambio engine nella classifica,
// filtri della pagina query, confronto fra territori. Fa fetch vere verso URL
// vere, con latenza, stati di caricamento ed errori reali.
//
// Differenza con `server.ts`: qui non si importa nessun JSON. Il browser
// scarica quello che gli serve e nient'altro — le fixture pesano 13 MB e non
// devono mai entrare in un bundle.
//
// Con `PUBLIC_API_SOURCE=fixtures` i filtri girano in locale sulla collezione
// scaricata, perché un file statico non sa rispondere a `?sort=`. Con `http`
// gli stessi filtri diventano parametri di query e a rispondere è il backend:
// la firma delle funzioni non cambia, e nemmeno il codice che le chiama.
// =============================================================================

import { buildPath, buildQuery } from "./endpoints";
import { filterDestinations, filterHotels, filterQueries } from "./query";
import { isFixtures, request, requestEnvelope } from "./transport";
import type {
  CategoryDTO,
  DestinationDTO,
  DestinationDetailDTO,
  DestinationFilters,
  HotelFilters,
  HotelSummaryDTO,
  MetaDTO,
  NationalDTO,
  Page,
  PromptsDTO,
  QueryFilters,
  QuerySummaryDTO,
  TagDTO,
} from "./types";

type Options = { signal?: AbortSignal };

/**
 * Un elenco. In fixtures scarica la collezione (una volta: poi è in cache) e
 * applica i filtri in locale; in http li passa al backend.
 *
 * `local` è la stessa funzione che il backend deve replicare — è in
 * `query.ts`, ed è documentata lì.
 */
async function collection<T, F extends Record<string, unknown>>(
  path: string,
  filters: F,
  local: (rows: T[], filters: F) => Page<T>,
  options: Options,
): Promise<Page<T>> {
  if (isFixtures()) {
    const rows = await request<T[]>(path, options);
    if (options.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return local(rows, filters);
  }
  const envelope = await requestEnvelope<T[]>(`${path}${buildQuery(filters)}`, options);
  return {
    rows: envelope.data,
    total: envelope.meta.total ?? envelope.data.length,
    page: envelope.meta.page ?? 1,
    pageSize: envelope.meta.pageSize ?? envelope.data.length,
  };
}

export const api = {
  meta: (options: Options = {}) => request<MetaDTO>("/meta", options),

  national: (options: Options = {}) => request<NationalDTO>("/national", options),

  categories: (options: Options = {}) => request<CategoryDTO[]>("/categories", options),

  category: (key: string, options: Options = {}) =>
    request<CategoryDTO>(buildPath("/categories/{key}", { key }), options),

  prompts: (options: Options = {}) => request<PromptsDTO>("/prompts", options),

  tags: (options: Options = {}) => request<TagDTO[]>("/tags", options),

  destinations: (filters: DestinationFilters = {}, options: Options = {}) =>
    collection<DestinationDTO, DestinationFilters>(
      "/destinations",
      filters,
      filterDestinations,
      options,
    ),

  destination: (key: string, options: Options = {}) =>
    request<DestinationDetailDTO>(buildPath("/destinations/{key}", { key }), options),

  hotels: (filters: HotelFilters = {}, options: Options = {}) =>
    collection<HotelSummaryDTO, HotelFilters>("/hotels", filters, filterHotels, options),

  /**
   * Le query monitorate.
   *
   * In fixtures, filtrare per categoria scarica il segmento della categoria
   * (`/queries/{category}`) invece dell'indice intero: 1,1 MB contro ~220 KB.
   * Il backend non ha questo problema e riceve tutto su `/queries`.
   */
  queries(filters: QueryFilters = {}, options: Options = {}): Promise<Page<QuerySummaryDTO>> {
    const path =
      isFixtures() && filters.category
        ? buildPath("/queries/{category}", { category: filters.category })
        : "/queries";
    return collection<QuerySummaryDTO, QueryFilters>(path, filters, filterQueries, options);
  },

  /** La classifica riordinata per engine. `"all"` è la media dei tre. */
  async rankBy(engine: string, options: Options = {}): Promise<DestinationDTO[]> {
    const { rows } = await api.destinations(
      {
        engine: engine === "all" ? undefined : (engine as DestinationFilters["engine"]),
        sort: "score",
        dir: "desc",
        pageSize: 500,
      },
      options,
    );
    return rows;
  },

  /** Confronto fino a quattro destinazioni: quattro chiamate in parallelo. */
  compare(keys: string[], options: Options = {}): Promise<DestinationDetailDTO[]> {
    return Promise.all(
      keys.filter(Boolean).slice(0, 4).map((key) => api.destination(key, options)),
    );
  },
};

export { ApiError, API_SOURCE, isFixtures } from "./transport";
export type { QueryFilters, DestinationFilters, HotelFilters, Page };
export default api;
