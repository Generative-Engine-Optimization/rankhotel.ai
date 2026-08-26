import type { APIRoute } from "astro";
import { NATIONAL } from "../../lib/observatory";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(NATIONAL), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
