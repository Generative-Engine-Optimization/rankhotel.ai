import type { APIRoute } from "astro";
import { DESTINATIONS, destination } from "../../../../lib/api/fixtures";
import { json } from "../_route";

export function getStaticPaths() {
  return DESTINATIONS.map((row) => ({ params: { key: row.key } }));
}

export const GET: APIRoute = async ({ params }) =>
  json("destination", await destination(params.key as string));
