import { request } from "./transport";
import type {
  CategorySummary,
  DestinationDetailDTO,
  DestinationSummary,
  HotelSummary,
  MetaDTO,
  NationalDTO,
  QueryFilters,
  QuerySummary,
} from "./types";

// L'unica superficie che pagine e componenti conoscono. Ogni funzione qui
// corrisponde a un endpoint che il backend dovrà esporre con la stessa forma.

export const api = {
  meta: () => request<MetaDTO>("/meta.json"),

  national: () => request<NationalDTO>("/national.json"),

  categories: () => request<CategorySummary[]>("/categories.json"),

  destinations: () => request<DestinationSummary[]>("/destinations.json"),

  destination: (key: string) =>
    request<DestinationDetailDTO>(`/destinations/${key}.json`),

  hotels: () => request<HotelSummary[]>("/hotels.json"),

  queries: (category?: string) =>
    category
      ? request<QuerySummary[]>(`/queries/${category}.json`)
      : request<QuerySummary[]>("/queries.json"),

  // Filtri e ordinamento girano sul client sull'indice già scaricato: è ciò
  // che farà il backend server-side, con la stessa firma.
  async searchQueries(filters: QueryFilters, signal?: AbortSignal): Promise<{
    rows: QuerySummary[];
    total: number;
  }> {
    const source = await api.queries(filters.category);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const term = (filters.q ?? "").trim().toLowerCase();
    let rows = source.filter((row) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.destination && row.destination !== filters.destination) return false;
      if (filters.lang && row.lang !== filters.lang) return false;
      if (filters.funnel && row.funnel !== filters.funnel) return false;
      if (filters.level && row.level !== filters.level) return false;
      if (filters.cluster && row.cluster !== filters.cluster) return false;
      if (term && !row.text.toLowerCase().includes(term)) return false;
      return true;
    });

    const sort = filters.sort ?? "volume";
    const dir = filters.dir === "asc" ? 1 : -1;
    rows = rows.sort((a, b) => {
      const va = a[sort as keyof QuerySummary];
      const vb = b[sort as keyof QuerySummary];
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });

    const total = rows.length;
    const limit = filters.limit ?? 60;
    return { rows: rows.slice(0, limit), total };
  },

  // Confronto fino a 4 destinazioni: il backend riceverà le stesse chiavi.
  async compare(keys: string[]): Promise<DestinationDetailDTO[]> {
    const picked = keys.filter(Boolean).slice(0, 4);
    return Promise.all(picked.map((key) => api.destination(key)));
  },

  // Riordino per engine, con posizione precedente per mostrare lo scarto.
  async rankBy(engine: string): Promise<DestinationSummary[]> {
    const rows = await api.destinations();
    if (engine === "all") {
      return [...rows].sort((a, b) => b.score.mean - a.score.mean);
    }
    return [...rows].sort(
      (a, b) => b.byEngine[engine].score - a.byEngine[engine].score,
    );
  },
};

export type { QueryFilters };
export { ApiError } from "./transport";
