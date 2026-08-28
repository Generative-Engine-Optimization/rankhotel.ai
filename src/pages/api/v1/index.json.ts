import type { APIRoute } from "astro";
import { API_VERSION, ENDPOINTS } from "../../../lib/api/endpoints";
import { META } from "../../../lib/api/fixtures";

// Endpoint di scoperta: chi apre /api/v1/index.json vede cosa esiste, con che
// parametri e a cosa serve. È la prima cosa che guarda chi deve implementare il
// backend, e resta vera perché è generata dal registro degli endpoint.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        version: API_VERSION,
        generatedFor: META.generatedFor,
        simulated: META.simulated,
        contract: "https://www.rankhotel.ai/api/openapi.yaml",
        note:
          "Risposte servite come file statici generati a build time. " +
          "I parametri di query sono dichiarati ma non applicati: " +
          "in questa modalità li applica il client. Il backend deve applicarli.",
        endpoints: ENDPOINTS.map((endpoint) => ({
          id: endpoint.id,
          path: `/api/${API_VERSION}${endpoint.path}`,
          returns: endpoint.returns,
          collection: endpoint.collection,
          summary: endpoint.summary,
          usedBy: endpoint.usedBy,
          params: endpoint.params ?? [],
        })),
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
