import type { APIRoute } from "astro";
import { META } from "../../lib/observatory";

// Gli endpoint sotto /api emettono file JSON reali dentro dist/api a build
// time. Il client fa una fetch vera verso una URL vera: quando arriverà il
// backend, cambia solo API_BASE in src/lib/api/transport.ts.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(META), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
