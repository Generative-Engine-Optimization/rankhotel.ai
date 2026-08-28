// =============================================================================
// CLIENT DI BUILD
// =============================================================================
//
// Quello che usano le pagine Astro. Gira in Node, a build time, e legge dalla
// sorgente attiva: le fixture su disco, oppure un backend vero se
// `PUBLIC_API_SOURCE=http`.
//
// Nessuna pagina importa più un JSON. Il giorno in cui il backend esiste, il
// sito si compila contro di lui senza che una riga di template cambi — e se
// una risposta non rispetta il contratto, la build si ferma qui invece di
// pubblicare una pagina con un buco.
// =============================================================================

import * as fixtures from "./fixtures";
import { buildPath, buildQuery } from "./endpoints";
import { filterDestinations, filterHotels, filterQueries } from "./query";
import { API_SOURCE, isFixtures, request, requestEnvelope } from "./transport";
import type {
  CategoryDTO,
  Dataset,
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

const opts = { side: "server" } as const;

// In http le collezioni arrivano dal backend; in fixtures sono già in memoria.
// `get` tiene la differenza in una riga sola invece che in dodici.
const get = async <T>(local: () => T, path: string): Promise<T> =>
  isFixtures() ? local() : await request<T>(path, opts);

export const server = {
  source: API_SOURCE,

  meta: (): Promise<MetaDTO> => get(() => fixtures.META, "/meta"),

  national: (): Promise<NationalDTO> => get(() => fixtures.NATIONAL, "/national"),

  categories: (): Promise<CategoryDTO[]> => get(() => fixtures.CATEGORIES, "/categories"),

  category: (key: string): Promise<CategoryDTO> =>
    get(() => fixtures.category(key), buildPath("/categories/{key}", { key })),

  prompts: (): Promise<PromptsDTO> => get(() => fixtures.PROMPTS, "/prompts"),

  tags: (): Promise<TagDTO[]> => get(() => fixtures.tags(), "/tags"),

  async destinations(filters: DestinationFilters = {}): Promise<Page<DestinationDTO>> {
    if (!isFixtures()) return page<DestinationDTO>("/destinations", filters);
    return filterDestinations(fixtures.DESTINATIONS, filters);
  },

  destination: (key: string): Promise<DestinationDetailDTO> =>
    isFixtures()
      ? fixtures.destination(key)
      : request<DestinationDetailDTO>(buildPath("/destinations/{key}", { key }), opts),

  async hotels(filters: HotelFilters = {}): Promise<Page<HotelSummaryDTO>> {
    if (!isFixtures()) return page<HotelSummaryDTO>("/hotels", filters);
    return filterHotels(fixtures.HOTELS, filters);
  },

  async queries(filters: QueryFilters = {}): Promise<Page<QuerySummaryDTO>> {
    if (!isFixtures()) return page<QuerySummaryDTO>("/queries", filters);
    return filterQueries(fixtures.QUERIES, filters);
  },

  /**
   * Lo snapshot che serve a compilare il sito: sei chiamate, una volta sola per
   * build. Tutte le pagine leggono da qui.
   *
   * `pageSize` è alzato di proposito: a build time servono tutte le righe, non
   * la prima pagina. È l'unico posto in cui il sito chiede una collezione
   * intera, ed è giusto che si veda.
   */
  async dataset(): Promise<Dataset> {
    const [meta, national, categories, destinations, hotels, prompts] = await Promise.all([
      server.meta(),
      server.national(),
      server.categories(),
      server.destinations({ pageSize: 500, sort: "nationalRank", dir: "asc" }),
      server.hotels({ pageSize: 500 }),
      server.prompts(),
    ]);
    return {
      meta,
      national,
      categories,
      destinations: destinations.rows,
      hotels: hotels.rows,
      prompts,
    };
  },

  /** Tutte le query monitorate. Serve alla pagina query, che le impagina da sé. */
  async allQueries(): Promise<QuerySummaryDTO[]> {
    if (isFixtures()) return fixtures.QUERIES;
    // 3200 righe: si prendono in pagine da 500 finché il totale è coperto.
    const rows: QuerySummaryDTO[] = [];
    let current = 1;
    for (;;) {
      const chunk = await server.queries({ page: current, pageSize: 500 });
      rows.push(...chunk.rows);
      if (rows.length >= chunk.total || chunk.rows.length === 0) break;
      current += 1;
    }
    return rows;
  },
};

/**
 * Elenco paginato dal backend. `meta.total` è la verità sul totale: senza,
 * la pagina crederebbe che le righe ricevute siano tutte quelle esistenti.
 */
async function page<T>(path: string, filters: Record<string, unknown>): Promise<Page<T>> {
  const envelope = await requestEnvelope<T[]>(`${path}${buildQuery(filters)}`, opts);
  const rows = envelope.data;
  return {
    rows,
    total: envelope.meta.total ?? rows.length,
    page: envelope.meta.page ?? 1,
    pageSize: envelope.meta.pageSize ?? rows.length,
  };
}

export default server;
