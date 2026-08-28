// Le rotte sotto /api/v1 emettono file JSON veri dentro dist/api/v1 a build
// time. Non sono un mock: sono la stessa URL, la stessa forma e gli stessi
// header che dovrà servire il backend. Il client fa una fetch vera, e il
// giorno del passaggio cambia una variabile d'ambiente, non del codice.
//
// Quando il backend esisterà, questa cartella si cancella: il contratto che
// implementa è `src/lib/api/types.ts`, non questi file.
import { ENDPOINT_BY_ID, type EndpointId } from "../../../lib/api/endpoints";
import { envelope } from "../../../lib/api/fixtures";
import type { ResponseMeta } from "../../../lib/api/types";

export function json<T>(id: EndpointId, data: T, extra: Partial<ResponseMeta> = {}): Response {
  const { cache } = ENDPOINT_BY_ID[id];
  return new Response(JSON.stringify(envelope(data, extra)), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${cache}`,
    },
  });
}

/** Elenco: `meta.total` è il totale prima di qualsiasi filtro. */
export function list<T>(id: EndpointId, rows: T[]): Response {
  return json(id, rows, { total: rows.length, page: 1, pageSize: rows.length });
}
