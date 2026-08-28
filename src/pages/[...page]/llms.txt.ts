import { listLlmsPages, renderPageLlms } from "../../lib/llms";

// Una rotta sola per tutti i file per pagina. Il segmento rest sta in mezzo al
// percorso e non in fondo: Astro lo consente finché è un segmento a sé — il
// divieto in `validateSegment` riguarda i rest mescolati ad altro testo dentro
// lo stesso segmento. Il risultato è `/it/osservatorio/mappa/llms.txt` accanto
// alla pagina che descrive, senza duecentottantaquattro file shim.
const pages = new Map(listLlmsPages().map((page) => [page.path, page]));

export function getStaticPaths() {
  return [...pages.keys()].map((path) => ({ params: { page: path.slice(1) } }));
}

export function GET({ params }: { params: { page?: string } }) {
  const page = pages.get(`/${params.page ?? ""}`);
  if (!page) return new Response("Not found", { status: 404 });

  return new Response(renderPageLlms(page), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
