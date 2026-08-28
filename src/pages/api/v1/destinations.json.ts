import type { APIRoute } from "astro";
import { DESTINATIONS } from "../../../lib/api/fixtures";
import { list } from "./_route";

// L'elenco intero, in ordine di classifica nazionale. I filtri di `?category=`
// e compagnia non si applicano qui: un file statico non li vede, e il client in
// modalità fixtures li applica in locale (`src/lib/api/query.ts`). Il backend
// vero li riceverà su questo stesso path.
export const GET: APIRoute = () =>
  list("destinations", [...DESTINATIONS].sort((a, b) => a.nationalRank - b.nationalRank));
