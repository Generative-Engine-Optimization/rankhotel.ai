import type { APIRoute } from "astro";
import queries from "../../../data/observatory/queries.json";
import { listCategories } from "../../../lib/observatory";

// Indice per categoria: la pagina fan-out carica solo il segmento che serve
// invece dell'intero indice nazionale.
export function getStaticPaths() {
  return listCategories().map((category) => ({ params: { category: category.key } }));
}

export const GET: APIRoute = ({ params }) => {
  const rows = queries.filter((row) => row.category === params.category);
  return new Response(JSON.stringify(rows), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
