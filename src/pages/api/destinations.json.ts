import type { APIRoute } from "astro";
import { listDestinations } from "../../lib/observatory";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(listDestinations()), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
