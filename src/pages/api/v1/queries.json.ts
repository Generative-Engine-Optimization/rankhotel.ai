import type { APIRoute } from "astro";
import { QUERIES } from "../../../lib/api/fixtures";
import { list } from "./_route";

// 3200 righe, 1,1 MB. Chi guarda una categoria sola passa dal segmento
// `/queries/{category}` e ne scarica un quinto.
export const GET: APIRoute = () => list("queries", QUERIES);
