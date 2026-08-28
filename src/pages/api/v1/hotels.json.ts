import type { APIRoute } from "astro";
import { HOTELS } from "../../../lib/api/fixtures";
import { list } from "./_route";

export const GET: APIRoute = () => list("hotels", HOTELS);
