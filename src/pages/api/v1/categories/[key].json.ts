import type { APIRoute } from "astro";
import { CATEGORIES, category } from "../../../../lib/api/fixtures";
import { json } from "../_route";

export function getStaticPaths() {
  return CATEGORIES.map((row) => ({ params: { key: row.key } }));
}

export const GET: APIRoute = ({ params }) => json("category", category(params.key as string));
