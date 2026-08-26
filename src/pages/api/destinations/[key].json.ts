import type { APIRoute } from "astro";
import { listDestinations, loadDestination } from "../../../lib/observatory";

export function getStaticPaths() {
  return listDestinations().map((destination) => ({
    params: { key: destination.key },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const detail = await loadDestination(params.key as string);
  return new Response(JSON.stringify(detail), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
