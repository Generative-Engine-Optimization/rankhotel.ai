import type { APIRoute } from "astro";
import queries from "../../data/observatory/queries.json";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(queries), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
