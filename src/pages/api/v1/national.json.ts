import type { APIRoute } from "astro";
import { NATIONAL } from "../../../lib/api/fixtures";
import { json } from "./_route";

export const GET: APIRoute = () => json("national", NATIONAL);
