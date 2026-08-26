#!/usr/bin/env node
// Verificatore di domini.
//
// Un dominio entra nel dataset solo se soddisfa due condizioni, e le verifica
// entrambe questo script:
//   1. risponde a una richiesta HTTP reale;
//   2. la pagina dichiara chi la gestisce.
//
// La seconda è quella che conta. Un 200 dice che il dominio è vivo, non che
// sia il soggetto giusto: nella prima versione del foglio quattro domini erano
// stati presi per enti pubblici solo perché rispondevano, ed erano società
// private. Qui si cerca la prova nel testo della pagina.

import { readFile, writeFile } from "node:fs/promises";

const TIMEOUT = 12000;
const CONCURRENCY = 8;

// Marcatori di soggetto pubblico. La partita IVA da sola non basta: ce l'hanno
// anche le S.r.l. Serve la forma giuridica o il ruolo dichiarato.
const PUBLIC_MARKERS = [
  /comune di\s+[a-zàèéìòù]/i,
  /citt[àa] di\s+[a-zàèéìòù]/i,
  /provincia (?:autonoma )?di\s+[a-zàèéìòù]/i,
  /regione\s+(?:autonoma\s+)?[a-zàèéìòù]/i,
  /\bapt\b|azienda (?:di )?promozione turistica|azienda (?:autonoma )?di soggiorno/i,
  /consorzio (?:turistico|di promozione|operatori)/i,
  /ente (?:turismo|parco|regionale|nazionale)/i,
  /parco (?:nazionale|naturale|regionale)/i,
  /societ[àa] consortile/i,
  /\bdmo\b|destination management organization/i,
  /unione (?:dei )?comuni|comunit[àa] montana/i,
  /in ?house|societ[àa] in house/i,
  /tourism board|tourist board|visitor board/i,
];

const PRIVATE_MARKERS = [
  /\bs\.?r\.?l\.?\b/i,
  /\bs\.?p\.?a\.?\b/i,
  /\bs\.?a\.?s\.?\b/i,
  /\bs\.?n\.?c\.?\b/i,
  /\bditta individuale\b/i,
];

const VAT = /(?:p\.?\s?iva|partita iva|vat|c\.?f\.?)[^0-9]{0,12}([0-9]{11})/i;

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // Molti siti rifiutano richieste senza user agent. Ci si dichiara per
        // quello che si è: un controllo automatico, non un browser.
        "user-agent":
          "BussolaObservatoryCheck/1.0 (+https://www.rankhotel.ai/llms.txt; verifica dominio)",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "it,en;q=0.8",
      },
    });
    const body = response.ok ? await response.text() : "";
    return { status: response.status, url: response.url, body };
  } finally {
    clearTimeout(timer);
  }
}

export async function checkDomain(domain) {
  const attempts = [`https://${domain}`, `https://www.${domain}`];
  let last = null;

  for (const url of attempts) {
    try {
      const result = await fetchWithTimeout(url);
      last = result;
      if (result.status >= 200 && result.status < 400) break;
      if (result.status === 403) break; // WAF: il sito c'è, il controllo no
    } catch (error) {
      last = { status: 0, error: String(error.name ?? error) };
    }
  }

  if (!last || last.status === 0) {
    return { domain, status: "unreachable", note: "nessuna risposta" };
  }
  if (last.status === 403) {
    return { domain, status: "waf", http: 403, note: "blocca la verifica automatica" };
  }
  if (last.status >= 400) {
    return { domain, status: "error", http: last.status, note: `risposta ${last.status}` };
  }

  const text = strip(last.body).slice(0, 60000);
  const title = (last.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  const publicHit = PUBLIC_MARKERS.map((re) => text.match(re)?.[0]).find(Boolean);
  const privateHit = PRIVATE_MARKERS.map((re) => text.match(re)?.[0]).find(Boolean);
  const vat = text.match(VAT)?.[1] ?? null;

  // Il redirect verso un altro dominio è un fatto rilevante: il dominio che
  // avevamo in lista potrebbe non essere più quello del soggetto.
  const landed = new URL(last.url).hostname.replace(/^www\./, "");
  const redirected = landed !== domain.replace(/^www\./, "");

  // Le due prove non si escludono: una società in house di un comune è
  // pubblica nel mandato e S.r.l. nella forma. Registrarne una sola e buttare
  // l'altra è il modo per classificare male proprio i casi che contano.
  let pub = publicHit ?? null;
  let priv = privateHit ?? null;
  let vatFound = vat;

  // Molti siti tengono la ragione sociale solo nelle pagine legali, non in
  // home. Se la home non dichiara nulla si va a cercare dove si dichiara
  // sempre: senza questo passaggio metà dei siti pubblici risulterebbe
  // "non identificato", che è un falso negativo, non un dato.
  if (!pub || !priv) {
    const legal = ["/note-legali", "/privacy", "/privacy-policy", "/credits", "/chi-siamo", "/note-legali/", "/legal"];
    for (const path of legal) {
      try {
        const page = await fetchWithTimeout(new URL(path, last.url).toString());
        if (page.status < 200 || page.status >= 400) continue;
        const legalText = strip(page.body).slice(0, 40000);
        pub = pub ?? PUBLIC_MARKERS.map((re) => legalText.match(re)?.[0]).find(Boolean) ?? null;
        priv = priv ?? PRIVATE_MARKERS.map((re) => legalText.match(re)?.[0]).find(Boolean) ?? null;
        vatFound = vatFound ?? legalText.match(VAT)?.[1] ?? null;
        if (pub && priv) break;
      } catch {
        // una pagina legale che non risponde non è un esito: si prova la prossima
      }
    }
  }

  // "Sito ufficiale" nel titolo non prova niente da solo, ma insieme a un
  // marcatore pubblico fa la differenza fra un ente e chi si spaccia per tale.
  const claimsOfficial = /sito ufficiale|official (?:site|website|tourism)/i.test(
    `${title} ${text.slice(0, 3000)}`,
  );

  const kind =
    pub && priv ? "mixed" : pub ? "public" : priv ? "private" : "unknown";

  return {
    domain,
    status: "ok",
    http: last.status,
    landed: redirected ? landed : null,
    title,
    kind,
    publicEvidence: pub,
    privateEvidence: priv,
    claimsOfficial,
    vat: vatFound,
  };
}

async function pool(items, worker) {
  const results = [];
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (index < items.length) {
        const i = index++;
        results[i] = await worker(items[i], i);
      }
    }),
  );
  return results;
}

// --- esecuzione da riga di comando: legge un JSON di candidati e scrive l'esito
// Il controllo su import.meta.url evita che questo blocco parta anche quando il
// modulo viene importato da un altro script, che leggerebbe il suo argv.
const invokedDirectly = process.argv[1]?.endsWith("check-domains.mjs");
const [, , inputPath, outputPath] = process.argv;
if (invokedDirectly && inputPath) {
  const candidates = JSON.parse(await readFile(inputPath, "utf8"));
  console.log(`Verifico ${candidates.length} domini...`);
  let done = 0;
  const results = await pool(candidates, async (row) => {
    const check = await checkDomain(row.domain);
    done += 1;
    if (done % 20 === 0) console.log(`  ${done}/${candidates.length}`);
    return { ...row, ...check };
  });
  const ok = results.filter((r) => r.status === "ok");
  console.log(`\n  raggiungibili   ${ok.length}/${results.length}`);
  console.log(`  soggetto pubblico  ${ok.filter((r) => r.kind === "public").length}`);
  console.log(`  soggetto privato   ${ok.filter((r) => r.kind === "private").length}`);
  console.log(`  non identificato   ${ok.filter((r) => r.kind === "unknown").length}`);
  await writeFile(outputPath, JSON.stringify(results, null, 1));
  console.log(`\n  scritto ${outputPath}`);
}
