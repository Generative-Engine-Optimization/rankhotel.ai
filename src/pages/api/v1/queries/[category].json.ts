import type { APIRoute } from "astro";
import { CATEGORIES, QUERIES } from "../../../../lib/api/fixtures";
import { list } from "../_route";

// Il segmento di indice di una categoria: la pagina query carica solo quello
// che le serve invece dell'intero indice nazionale.
export function getStaticPaths() {
  return CATEGORIES.map((row) => ({ params: { category: row.key } }));
}

export const GET: APIRoute = ({ params }) =>
  list(
    "queriesByCategory",
    QUERIES.filter((row) => row.category === params.category),
  );
