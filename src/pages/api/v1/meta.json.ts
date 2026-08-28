import type { APIRoute } from "astro";
import { META } from "../../../lib/api/fixtures";
import { json } from "./_route";

export const GET: APIRoute = () => json("meta", META);
