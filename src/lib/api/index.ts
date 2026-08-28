// Punto d'ingresso del livello dati.
//
//   server.ts   pagine Astro, build time  → fixture su disco o backend
//   client.ts   script di pagina, browser → fetch vere
//   types.ts    il contratto: è il file da dare a chi scrive le API
//   query.ts    semantica di filtri, ordinamento e paginazione
//   endpoints.ts elenco degli endpoint, da cui nasce l'OpenAPI
export { api } from "./client";
export { server } from "./server";
export { ENDPOINTS, ENDPOINT_BY_ID, API_VERSION, buildPath, buildQuery } from "./endpoints";
export { ApiError, API_SOURCE, isFixtures, baseUrl } from "./transport";
export * from "./types";
