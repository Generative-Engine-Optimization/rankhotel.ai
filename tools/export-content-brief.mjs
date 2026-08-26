#!/usr/bin/env node
// Esporta docs/contenuti-osservatorio.md: la sintesi del contenuto curato
// (destinazioni, hotel, siti, prompt) da passare a chi deve rivedere o
// sostituire le selezioni. Rigenerabile con `npm run data:brief`.

import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { CATEGORIES, TAGS } from "./seed/categories.mjs";
import { DESTINATIONS } from "./seed/destinations.mjs";
import { PROMPTS, FUNNEL_STAGES } from "./seed/prompts.mjs";
import { SITE_KINDS, OTA_SITES, CRAWLERS, AUDIT_CHECKS } from "./seed/sites.mjs";
import { VERIFIED_DMO, VERIFIED_EDITORIAL, REGIONAL_DMO, CHAIN_DOMAINS, DOMAIN_STATUS, VERIFIED_ON } from "./seed/verified-sites.mjs";
import { REAL_HOTELS, PREFIXES, QUALIFIERS, AREAS, STAR_MIX } from "./seed/hotels.mjs";
import { destinationForms } from "./seed/grammar.mjs";
import { renderPrompt } from "./lib/render-prompt.mjs";
import { HOTELS_PER_DESTINATION, TIERS, DEMAND_TIERS } from "./lib/model.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = [];
const w = (line = "") => out.push(line);

const byCategory = (key) => DESTINATIONS.filter((d) => d.category === key);
const realCount = Object.values(REAL_HOTELS).flat().length;

w("# Contenuto dell'Italian AI Visibility Report");
w();
w("Sintesi del contenuto **curato a mano** che alimenta l'osservatorio: quali");
w("destinazioni sono in classifica, quali hotel sono tracciati, quali siti");
w("vengono auditati e quali prompt vengono posti ai modelli.");
w();
w("Questo file è generato da `tools/seed/`. Per cambiare le selezioni si");
w("modificano i file seed e si rilancia `npm run data:generate`, non si edita");
w("questo documento.");
w();
w("| | |");
w("| :--- | ---: |");
w(`| Destinazioni in classifica | ${DESTINATIONS.length} |`);
w(`| Categorie di confronto | ${CATEGORIES.length} (${DESTINATIONS.length / CATEGORIES.length} territori ciascuna) |`);
w(`| Hotel tracciati | ${DESTINATIONS.length * HOTELS_PER_DESTINATION} (${HOTELS_PER_DESTINATION} per destinazione) |`);
w(`| di cui strutture reali | ${realCount} |`);
w(`| di cui generate | ${DESTINATIONS.length * HOTELS_PER_DESTINATION - realCount} |`);
w(`| Regioni coperte | ${new Set(DESTINATIONS.map((d) => d.region)).size} su 20 |`);
w(`| Prompt per destinazione | ${PROMPTS.length} |`);
w(`| Entità reali censite | ${DESTINATIONS.reduce((s, d) => s + d.knownFor.length, 0)} |`);
w();

w("## Cosa va deciso da chi rivede questo documento");
w();
w("1. **Le 100 destinazioni**: sono selezionate per volume di visitatori e");
w("   rilevanza territoriale. Vanno confermate, sostituite o riordinate.");
w("2. **La categoria primaria** di ciascuna: una destinazione entra in");
w("   classifica in una sola categoria, ma può portare quanti tag vuole.");
w("3. **Le entità in `knownFor`**: sono ciò che un'AI dovrebbe saper citare");
w("   quando le si chiede cosa vedere. Sbagliarle falsa il fattore");
w("   \"profondità interna\".");
w("4. **I 20 hotel per destinazione**: oggi 40 sono strutture reali, il resto");
w("   sono nomi generati. Vanno sostituiti con selezioni vere.");
w("5. **I domini dei siti**: quelli DMO ed editoriali sono generati dallo slug");
w("   e non esistono. Servono i domini veri prima di poter misurare davvero.");
w();

w("## Come si legge la classifica");
w();
w("Due cose vanno capite prima di guardare i numeri, perché cambiano cosa");
w("significa una posizione.");
w();
w("**Le fasce.** Fra la 38ª e la 41ª posizione non c'è differenza misurabile:");
w("cinque run al mese non producono quella precisione. La fascia sì.");
w();
w("| Fascia | Nome | Score |");
w("| :---: | :--- | ---: |");
TIERS.forEach((tier, index) => {
  const next = TIERS[index - 1];
  w(`| ${tier.key.toUpperCase()} | ${tier.name.it} | ${next ? `${tier.min}-${next.min}` : `${tier.min}+`} |`);
});
w();
w("**La scala della domanda.** Venti hotel su Roma e venti hotel su un borgo da");
w("settecento ricerche al mese sono due pagine con lo stesso aspetto e due");
w("significati diversi. Ogni destinazione dichiara quante ricerche mensili");
w("muove sulle query monitorate.");
w();
w("| Livello | Ricerche/mese |");
w("| :--- | ---: |");
DEMAND_TIERS.forEach((tier, index) => {
  const next = DEMAND_TIERS[index - 1];
  w(`| ${tier.name.it} | ${next ? `${tier.min.toLocaleString("it-IT")}-${next.min.toLocaleString("it-IT")}` : `${tier.min.toLocaleString("it-IT")}+`} |`);
});
w();

w("## Le 5 categorie");
w();
w("| Categoria | Slug IT | Slug EN | Soggetto della domanda comparativa |");
w("| :--- | :--- | :--- | :--- |");
for (const category of CATEGORIES) {
  w(`| ${category.name.it} | \`${category.slug.it}\` | \`${category.slug.en}\` | «${category.comparativeSubject.it}» |`);
}
w();
w("**Tag secondari disponibili:** " + TAGS.map((tag) => `\`${tag.key}\``).join(", "));
w();

for (const category of CATEGORIES) {
  const list = byCategory(category.key);
  w(`## ${category.name.it}`);
  w();
  w(`${category.lead.it}`);
  w();
  w("| # | Destinazione | EN | Regione | Visitatori/anno | Tag | Coordinate |");
  w("| ---: | :--- | :--- | :--- | ---: | :--- | :--- |");
  list.forEach((d, index) => {
    const tags = d.tags.length ? d.tags.join(", ") : "nessuno";
    w(
      `| ${index + 1} | **${d.name.it}** | ${d.name.en} | ${d.region} | ` +
        `${(d.visitors * 1000).toLocaleString("it-IT")} | ${tags} | ${d.lat}, ${d.lng} |`,
    );
  });
  w();
  w("<details><summary>Entità censite e forme grammaticali</summary>");
  w();
  w("| Destinazione | Entità in `knownFor` | Forma «in» | Forma con articolo |");
  w("| :--- | :--- | :--- | :--- |");
  for (const d of list) {
    const forms = destinationForms(d);
    w(`| ${d.name.it} | ${d.knownFor.join(" · ")} | ${forms.it.in} | ${forms.it.the} |`);
  }
  w();
  w("</details>");
  w();
}

w("## Hotel");
w();
w(`Ogni destinazione traccia **${HOTELS_PER_DESTINATION} strutture**.`);
w();
w("### Strutture reali già presenti");
w();
w("Provengono dall'osservatorio a città che ha preceduto questo modello.");
w("Sono gli unici hotel del dataset che esistono davvero.");
w();
w("| Destinazione | Hotel | Zona | Stelle | Dominio |");
w("| :--- | :--- | :--- | ---: | :--- |");
for (const [key, list] of Object.entries(REAL_HOTELS)) {
  const dest = DESTINATIONS.find((d) => d.key === key);
  for (const [name, area, stars, domain] of list) {
    w(`| ${dest?.name.it ?? key} | ${name} | ${area} | ${stars} | \`${domain}\` |`);
  }
}
w();
w("### Come sono generate le altre");
w();
w("Prefisso scelto in base alla categoria della destinazione, più un toponimo");
w("reale della zona o un qualificatore coerente. Sono nomi **verosimili ma");
w("inventati**: non corrispondono ad alberghi esistenti e nella UI portano il");
w("marcatore `demo`.");
w();
w("| Categoria | Prefissi | Qualificatori | Zone |");
w("| :--- | :--- | :--- | :--- |");
for (const category of CATEGORIES) {
  w(
    `| ${category.short.it} | ${PREFIXES[category.key].join(", ")} | ` +
      `${QUALIFIERS[category.key].slice(0, 6).join(", ")}… | ${AREAS[category.key].join(", ")} |`,
  );
}
w();
w(`**Distribuzione delle stelle** (ciclica sulle 20 posizioni): ${STAR_MIX.join(", ")}`);
w();

w("## Siti auditati");
w();
w("Quattro famiglie per destinazione, più i domini dei 20 hotel.");
w();
w(`Fonte della verifica: \`docs/rankhotel-destinazioni-e-siti.xlsx\`, ${VERIFIED_ON}.`);
w("Un dominio entra come sito ufficiale solo se il footer dichiara un soggetto");
w("con mandato pubblico di promozione. La prova è la ragione sociale, non il");
w("nome del dominio: nella prima versione del foglio quattro domini erano stati");
w("presi per DMO solo perché rispondevano, ed erano società private.");
w();
w("| Famiglia | Cosa comprende | Stato dei domini |");
w("| :--- | :--- | :--- |");
for (const kind of SITE_KINDS) {
  const state =
    kind.key === "ota"
      ? "reali e verificati: " + OTA_SITES.map((s) => s.domain).join(", ")
      : kind.key === "dmo"
        ? `${Object.keys(VERIFIED_DMO).length} enti di destinazione verificati, ${Object.keys(REGIONAL_DMO).length} DMO regionali come soggetto per le altre`
        : kind.key === "editorial"
          ? `${Object.keys(VERIFIED_EDITORIAL).length} verificati, il resto ancora generato`
          : "domini reali per i 40 hotel esistenti, generati per gli altri";
  w(`| ${kind.name.it} | ${kind.note.it} | ${state} |`);
}
w();
w("### Enti di destinazione verificati");
w();
w("| Destinazione | Dominio | Soggetto | Nota |");
w("| :--- | :--- | :--- | :--- |");
for (const [key, row] of Object.entries(VERIFIED_DMO)) {
  const dest = DESTINATIONS.find((d) => d.key === key);
  w(`| ${dest?.name.it ?? key} | \`${row.domain}\` | ${row.holder} | ${row.note ?? ""} |`);
}
w();
w("### Portali editoriali verificati");
w();
w("| Destinazione | Dominio | Soggetto |");
w("| :--- | :--- | :--- |");
for (const [key, row] of Object.entries(VERIFIED_EDITORIAL)) {
  const dest = DESTINATIONS.find((d) => d.key === key);
  w(`| ${dest?.name.it ?? key} | \`${row.domain}\` | ${row.holder} |`);
}
w();
w("### DMO regionali usate come soggetto");
w();
w("| Regione | Dominio |");
w("| :--- | :--- |");
for (const [region, domain] of Object.entries(REGIONAL_DMO).sort()) {
  w(`| ${region} | \`${domain}\` |`);
}
w();
w("### Domini con anomalia all'ultima verifica");
w();
w("| Dominio | Stato | Nota |");
w("| :--- | :--- | :--- |");
for (const [domain, row] of Object.entries(DOMAIN_STATUS)) {
  w(`| \`${domain}\` | ${row.status} | ${row.note} |`);
}
w();
w(`**Domini di catena** (${CHAIN_DOMAINS.length}): su questi la decisione sull'accesso dei bot`);
w("la prende il gruppo, non il singolo albergo. Sono marcati nel dataset e in pagina.");
w();
w("### Crawler verificati");
w();
w("| Bot | Engine | Scopo |");
w("| :--- | :--- | :--- |");
for (const crawler of CRAWLERS) {
  w(`| \`${crawler.key}\` | ${crawler.engine ?? "tutti"} | ${crawler.purpose.it} |`);
}
w();
w("### Voci dell'audit SEO");
w();
w("| Voce | Peso |");
w("| :--- | ---: |");
for (const check of AUDIT_CHECKS) {
  w(`| ${check.name.it} | ${check.weight} |`);
}
w();

w("## Prompt");
w();
w("Tre assi incrociati: livello, stadio di funnel, lingua.");
w();
w("| Stadio | In analisi | Perché |");
w("| :--- | :---: | :--- |");
for (const stage of FUNNEL_STAGES) {
  w(`| ${stage.name.it} | ${stage.inScope ? "sì" : "no"} | ${stage.lead.it} |`);
}
w();

const sample = DESTINATIONS.find((d) => d.key === "dolomiti");
const sampleCategory = CATEGORIES.find((c) => c.key === sample.category);
for (const level of ["comparative", "internal"]) {
  w(`### Livello ${level === "comparative" ? "comparativo" : "interno"}`);
  w();
  w(
    level === "comparative"
      ? "La destinazione compete con le altre della sua categoria. Esempi resi con la categoria «montagna e parchi»."
      : "Verifica se il modello conosce il territorio. Esempi resi sulle Dolomiti.",
  );
  w();
  w("| Chiave | Funnel | Lingua | Testo |");
  w("| :--- | :--- | :---: | :--- |");
  for (const prompt of PROMPTS.filter((p) => p.level === level)) {
    const text = renderPrompt(prompt, {
      destination: level === "internal" ? sample : undefined,
      category: level === "comparative" ? sampleCategory : undefined,
    });
    w(`| \`${prompt.key}\` | ${prompt.funnel} | ${prompt.lang.toUpperCase()} | ${text} |`);
  }
  w();
}

await writeFile(join(ROOT, "docs/contenuti-osservatorio.md"), out.join("\n") + "\n");
console.log(`docs/contenuti-osservatorio.md — ${out.length} righe`);
