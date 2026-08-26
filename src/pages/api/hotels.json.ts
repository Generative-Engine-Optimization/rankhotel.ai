import type { APIRoute } from "astro";
import { topHotels } from "../../lib/observatory";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(topHotels()), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
