import type { APIRoute } from "astro";
import { CATEGORIES } from "../../../lib/api/fixtures";
import { list } from "./_route";

export const GET: APIRoute = () => list("categories", CATEGORIES);
