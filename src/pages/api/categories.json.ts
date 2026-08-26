import type { APIRoute } from "astro";
import { listCategories } from "../../lib/observatory";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(listCategories()), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
