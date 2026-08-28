// =============================================================================
// SEMANTICA DEI FILTRI — implementazione di riferimento
// =============================================================================
//
// Il backend deve restituire gli stessi risultati di queste funzioni a parità
// di parametri. Sono qui, e non sparse nelle pagine, perché sono un pezzo di
// contratto: se il backend ordina i pari merito in un altro modo, la tabella
// cambia sotto gli occhi al primo filtro.
//
// Finché i dati sono fixture statiche, sono anche l'implementazione vera: il
// client scarica la collezione e applica questi filtri in locale. Il giorno in
// cui i filtri girano sul backend, questo file resta come specifica.
// =============================================================================

import type {
  DestinationDTO,
  DestinationFilters,
  HotelFilters,
  HotelSummaryDTO,
  Page,
  QueryFilters,
  QuerySummaryDTO,
  SortDir,
} from "./types";

export const DEFAULT_PAGE_SIZE = 60;
export const MAX_PAGE_SIZE = 500;

/**
 * Normalizzazione per la ricerca libera: senza accenti, senza maiuscole.
 * Chi scrive "val d'orcia" deve trovare "Val d'Òrcia", e "campania" deve
 * bastare per arrivare alla Costiera Amalfitana.
 */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matches(haystack: string, term: string): boolean {
  return normalize(haystack).includes(normalize(term));
}

/**
 * Ordinamento stabile. I numeri per valore, le stringhe con `localeCompare`.
 * A parità di valore vince la chiave: due caricamenti della stessa pagina
 * devono dare la stessa riga in testa.
 */
function sortRows<T extends { key: string }>(
  rows: T[],
  value: (row: T) => number | string,
  dir: SortDir,
): T[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    const delta =
      typeof va === "number" && typeof vb === "number"
        ? va - vb
        : String(va).localeCompare(String(vb));
    return delta !== 0 ? delta * sign : a.key.localeCompare(b.key);
  });
}

/** Taglia la pagina e riporta il totale prima del taglio. */
export function paginate<T>(rows: T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Page<T> {
  const size = Math.min(Math.max(1, Math.trunc(pageSize)), MAX_PAGE_SIZE);
  const current = Math.max(1, Math.trunc(page));
  const start = (current - 1) * size;
  return {
    rows: rows.slice(start, start + size),
    total: rows.length,
    page: current,
    pageSize: size,
  };
}

// ------------------------------------------------------------- destinazioni

export function filterDestinations(
  rows: DestinationDTO[],
  filters: DestinationFilters = {},
): Page<DestinationDTO> {
  const { q, category, tag, region, tier, engine, sort = "score", dir } = filters;

  const filtered = rows.filter((row) => {
    if (category && row.category !== category) return false;
    // Il tema include la categoria primaria: una destinazione "mare" deve
    // uscire anche cercando il tema "mare", non solo i tag secondari.
    if (tag && row.category !== tag && !row.tags.includes(tag)) return false;
    if (region && row.region !== region) return false;
    if (tier && row.tier !== tier) return false;
    if (q && !matches(`${row.name.it} ${row.name.en} ${row.region}`, q)) return false;
    return true;
  });

  // `engine` cambia il significato di `sort=score`: non più la media dei tre
  // engine ma il punteggio di quello scelto. È il gesto della pagina engine.
  const value = (row: DestinationDTO): number | string => {
    switch (sort) {
      case "visitors":
        return row.visitors;
      case "demand":
        return row.demand;
      case "trend":
        return row.trend;
      case "name":
        return row.name.it;
      case "nationalRank":
        return row.nationalRank;
      default:
        return engine ? row.byEngine[engine].score : row.score.mean;
    }
  };

  // Nome e posizione crescono, il resto decresce: nessuno vuole la classifica
  // dal centesimo, e nessuno vuole i nomi dalla Z.
  const fallbackDir: SortDir = sort === "name" || sort === "nationalRank" ? "asc" : "desc";
  return paginate(sortRows(filtered, value, dir ?? fallbackDir), filters.page, filters.pageSize);
}

// -------------------------------------------------------------------- hotel

export function filterHotels(
  rows: HotelSummaryDTO[],
  filters: HotelFilters = {},
): Page<HotelSummaryDTO> {
  const { q, destination, category, realOnly, sort = "score", dir } = filters;

  const filtered = rows.filter((row) => {
    if (destination && row.destination !== destination) return false;
    if (category && row.category !== category) return false;
    if (realOnly && row.synthetic) return false;
    if (q && !matches(`${row.name} ${row.domain} ${row.area}`, q)) return false;
    return true;
  });

  const value = (row: HotelSummaryDTO): number | string => {
    switch (sort) {
      case "presence":
        return row.presence;
      case "avgPosition":
        return row.avgPosition;
      case "auditScore":
        return row.auditScore;
      case "trend":
        return row.trend;
      case "stars":
        return row.stars;
      case "name":
        return row.name;
      default:
        return row.score.mean;
    }
  };

  // Sulla posizione media il primo è il più basso: essere citati per terzi è
  // peggio che essere citati per primi.
  const fallbackDir: SortDir = sort === "name" || sort === "avgPosition" ? "asc" : "desc";
  return paginate(sortRows(filtered, value, dir ?? fallbackDir), filters.page, filters.pageSize);
}

// -------------------------------------------------------------------- query

export function filterQueries(
  rows: QuerySummaryDTO[],
  filters: QueryFilters = {},
): Page<QuerySummaryDTO> {
  const { q, category, destination, lang, funnel, level, cluster, sort = "volume", dir } = filters;

  const filtered = rows.filter((row) => {
    if (category && row.category !== category) return false;
    if (destination && row.destination !== destination) return false;
    if (lang && row.lang !== lang) return false;
    if (funnel && row.funnel !== funnel) return false;
    if (level && row.level !== level) return false;
    if (cluster && row.cluster !== cluster) return false;
    if (q && !matches(row.text, q)) return false;
    return true;
  });

  const value = (row: QuerySummaryDTO): number | string => {
    switch (sort) {
      case "cpc":
        return row.cpc;
      case "yoy":
        return row.yoy;
      case "difficulty":
        return row.difficulty;
      case "text":
        return row.text;
      default:
        return row.volume;
    }
  };

  const fallbackDir: SortDir = sort === "text" ? "asc" : "desc";
  return paginate(sortRows(filtered, value, dir ?? fallbackDir), filters.page, filters.pageSize);
}
