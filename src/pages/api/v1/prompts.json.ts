import type { APIRoute } from "astro";
import { PROMPTS } from "../../../lib/api/fixtures";
import { json } from "./_route";

export const GET: APIRoute = () => json("prompts", PROMPTS);
