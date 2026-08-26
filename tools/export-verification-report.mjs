#!/usr/bin/env node
// Scrive docs/verifica-domini-e-hotel.md: che cosa è stato controllato, come,
// e che cosa resta da fare. Rigenerabile con `npm run data:report`.

import { readFile, writeFile } from "node:fs/promises";
import { DESTINATIONS } from "./seed/destinations.mjs";
import { VERIFIED_DMO, VERIFIED_EDITORIAL, VERIFIED_ON } from "./seed/verified-domains.mjs";
import { VERIFIED_HOTELS, HOTELS_VERIFIED_ON } from "./seed/verified-hotels.mjs";
import { REGIONAL_DMO, CHAIN_DOMAINS } from "./seed/verified-sites.mjs";

const out = [];
const w = (line = "") => out.push(line);
const name = (key) => DESTINATIONS.find((d) => d.key === key)?.name.it ?? key;

const dmoCount = Object.keys(VERIFIED_DMO).length;
const edCount = Object.values(VERIFIED_EDITORIAL).flat().length;
const hotels = Object.values(VERIFIED_HOTELS).flat();
const byConfidence = (c) => hotels.filter((h) => h.confidence === c);

w("# Verifica di domini e strutture");
w();
w(`Ultima verifica: **${VERIFIED_ON}**. Rigenerabile con \`npm run data:report\`.`);
w();
w("Questo documento dice che cosa nel dataset esiste davvero, che cosa è");
w("dichiarato come dimostrativo, e su quali prove.");
w();
w("## La regola");
w();
w("Un dominio entra nel dataset solo se soddisfa due condizioni:");
w();
w("1. **risponde** a una richiesta HTTP reale;");
w("2. **si identifica**, cioè la pagina dice chi la gestisce.");
w();
w("La seconda è quella che conta. Un codice 200 dice che il dominio è vivo, non");
w("che sia il soggetto giusto. Per gli hotel la seconda condizione diventa: la");
w("pagina nomina quell'hotel. Un dominio che risponde prova che qualcuno lo ha");
w("registrato, non che la struttura esista.");
w();

w("## Il quadro");
w();
w("| | Prima | Ora |");
w("| :--- | ---: | ---: |");
w(`| Siti ufficiali di destinazione verificati | 8 | ${dmoCount} |`);
w(`| Portali editoriali verificati | 4 | ${edCount} |`);
w(`| DMO regionali (soggetto di riserva) | 20 | ${Object.keys(REGIONAL_DMO).length} |`);
w(`| Strutture reali nel dataset | 40 | ${hotels.length} |`);
w(`| di cui verificate col nome sulla pagina | 0 | ${byConfidence("verified").length} |`);
w();

w("## Siti ufficiali");
w();
w(`${dmoCount} destinazioni su 100 hanno un soggetto proprio verificato. Le altre`);
w("usano la DMO regionale, che è chi quel territorio lo promuove davvero: un");
w("dominio inventato al suo posto renderebbe inservibile la misura sulle fonti");
w("ufficiali, che è la ragione per cui questa famiglia di siti esiste.");
w();
w("`fonte` distingue le due strade: **automatica** quando le regole in");
w("`tools/verify/select-sites.mjs` hanno deciso da sole, **manuale** quando ha");
w("deciso una persona. Le due cose non si confondono, perché una persona");
w("sbaglia in modo diverso da uno script.");
w();
w("| Destinazione | Dominio | Soggetto | Fonte |");
w("| :--- | :--- | :--- | :--- |");
for (const [key, row] of Object.entries(VERIFIED_DMO)) {
  const src = row.source === "verifica manuale" ? "manuale" : "automatica";
  w(`| ${name(key)} | \`${row.domain}\` | ${row.holder ?? ""} | ${src} |`);
}
w();

w("### Perché alcuni sono stati decisi a mano");
w();
w("Lo script sa leggere una pagina, non sa che cosa sia una società in house.");
w("Un consorzio di operatori e una S.r.l. qualsiasi hanno la stessa forma nel");
w("footer e ruoli opposti nel territorio. Nei casi sotto la differenza l'ha");
w("fatta una persona, e il motivo è scritto in `tools/verify/overrides.mjs`.");
w();
w("| Destinazione | Dominio | Perché |");
w("| :--- | :--- | :--- |");
for (const [key, row] of Object.entries(VERIFIED_DMO)) {
  if (row.source !== "verifica manuale") continue;
  w(`| ${name(key)} | \`${row.domain}\` | ${row.why} |`);
}
w();

w("## Portali editoriali");
w();
w("Società private che raccontano il territorio. Sono spesso più citate dalle AI");
w("del sito ufficiale, ed è uno dei risultati che l'osservatorio esiste per");
w("misurare.");
w();
w("| Destinazione | Dominio | Soggetto |");
w("| :--- | :--- | :--- |");
for (const [key, list] of Object.entries(VERIFIED_EDITORIAL)) {
  for (const row of list) w(`| ${name(key)} | \`${row.domain}\` | ${row.holder ?? ""} |`);
}
w();

w("## Strutture");
w();
w(`Verificate il ${HOTELS_VERIFIED_ON}. Tre livelli di certezza, dichiarati e`);
w("non confusi fra loro.");
w();
w("| Livello | Cosa significa | Quante |");
w("| :--- | :--- | ---: |");
w(`| \`verified\` | Il dominio risponde e la pagina nomina la struttura | ${byConfidence("verified").length} |`);
w(`| \`registry-web\` | Iscritta a un registro pubblico regionale, con sito dichiarato | ${byConfidence("registry-web").length} |`);
w(`| \`registry\` | Iscritta a un registro pubblico regionale, senza sito | ${byConfidence("registry").length} |`);
w(`| \`chain\` | Sta sul dominio di un gruppo: esiste, ma le scelte tecniche di quel dominio non sono dell'albergatore | ${byConfidence("chain").length} |`);
w(`| \`guarded\` | Il dominio esiste e rifiuta i controlli automatici. Il sito c'è, la prova che sia questa struttura no | ${byConfidence("guarded").length} |`);
w();
w("### Le quattro strade");
w();
w("| Come sono state trovate | Quante |");
w("| :--- | ---: |");
for (const [source, label] of [["registry", "Registri pubblici regionali"], ["probe", "Domini plausibili provati, nome letto dal titolo"], ["curated", "Scritte a mano e verificate"], ["harvest", "Link dai siti dei territori"]]) {
  w(`| ${label} | ${hotels.filter((x) => x.source === source).length} |`);
}
w();
w("I **registri pubblici regionali** sono la fonte migliore: anagrafiche di");
w("attività autorizzate, quindi provano l'esistenza senza bisogno di altro. Ne");
w("esistono però solo per alcune regioni, ed è questo a determinare quali");
w("territori risultano coperti e quali no. Non è una scelta editoriale, è");
w("quello che le regioni pubblicano.");
w();
w("Nel dataset entrano al massimo venti strutture per destinazione, scelte");
w("preferendo quelle su cui sappiamo di più. Le posizioni che restano scoperte");
w("portano nomi generati, marcati come dimostrativi in ogni pagina.");
w();
w("### Per destinazione");
w();
w("Venti è il numero che entra nel dataset. La colonna \"disponibili\" dice");
w("quante ne abbiamo trovate in tutto: dove supera venti, avanzano.");
w();
w("| Destinazione | Nel dataset | Disponibili |");
w("| :--- | ---: | ---: |");
for (const [key, list] of Object.entries(VERIFIED_HOTELS).sort((a, b) => b[1].length - a[1].length)) {
  w(`| ${name(key)} | ${Math.min(20, list.length)} | ${list.length} |`);
}
w();
w("### Le prime venti per destinazione");
w();
w("Sono quelle che entrano nel dataset. L'elenco completo delle 8.000 trovate");
w("sta in `tools/seed/verified-hotels.mjs`.");
w();
w("| Destinazione | Struttura | Dominio | Certezza |");
w("| :--- | :--- | :--- | :--- |");
for (const [key, list] of Object.entries(VERIFIED_HOTELS)) {
  for (const h of list.slice(0, 20)) {
    w(`| ${name(key)} | ${h.name} | ${h.domain ? "`" + h.domain + "`" : ""} | ${h.confidence} |`);
  }
}
w();

w("## Domini di gruppo");
w();
w("Su questi la decisione su chi può leggere il sito la prende la catena, non");
w("l'albergatore. Il dataset lo dichiara invece di far sembrare che sia una");
w("scelta della singola struttura.");
w();
w(CHAIN_DOMAINS.map((d) => `\`${d}\``).join(" · "));
w();

w("## Come una struttura viene assegnata a un territorio");
w();
w("È il passaggio in cui è più facile sbagliare, ed è quello che ho sbagliato");
w("alla prima passata. Assegnando semplicemente al territorio più vicino entro");
w("25 km, metà delle strutture finiva nel posto sbagliato: alberghi di");
w("Bressanone sotto Val Gardena, che è un'altra valle, e alberghi di Zermatt");
w("sotto Cervinia, che è un altro Stato.");
w();
w("La distanza dice dove sta una struttura, non a quale territorio appartiene.");
w("La regola ora è doppia, e basta soddisfarne una:");
w();
w("1. **il comune è un toponimo che la destinazione dichiara** (il suo nome o");
w("   una delle sue entità censite), entro 30 km dal centroide;");
w("2. **oppure la struttura sta entro 10 km dal centroide.**");
w();
w("Chi non soddisfa nessuna delle due resta fuori. Il costo è stato circa");
w("seimila assegnazioni scartate; il guadagno è che quelle rimaste stanno dove");
w("dicono di stare. Le assegnazioni oltre i 12 km sono passate dal 50% al 2%.");
w();
w("Resta un limite noto: 42 coppie di destinazioni distano meno di 30 km, e per");
w("quelle la regola dei 10 km può ancora attribuire la stessa struttura a più");
w("territori. Si chiude solo assegnando ogni comune a una destinazione sola.");
w();
w("## Che cosa resta da fare");
w();
w("1. **I confini territoriali.** 42 coppie di destinazioni distano meno di 30 km.");
w("   Quando le strutture saranno tutte reali, le stesse cadranno in più");
w("   destinazioni. Va risolto assegnando ogni comune a una destinazione sola,");
w("   prima di estrarre gli hotel.");
w("2. **Le regioni senza registro pubblico.** Toscana, Campania, Sicilia,");
w("   Veneto, Sardegna, Lazio e Marche non pubblicano un'anagrafica delle");
w("   strutture in formato leggibile: sono loro a determinare quali territori");
w("   restano scoperti. Le strade possibili: chiedere il dato alle DMO");
w("   regionali, oppure comprarlo.");
w("3. **Il campione è sbilanciato sul lusso.** Le strutture che si trovano più");
w("   facilmente sono quelle che l'AI conosce già, e misurarle sovrastima la");
w("   visibilità media.");
w("4. **I 23 domini che rifiutano i controlli automatici.** Vanno verificati a");
w("   mano: il 403 dice che c'è un firewall, non che il sito sia sbagliato.");
w();

await writeFile("docs/verifica-domini-e-hotel.md", out.join("\n") + "\n");
console.log(`docs/verifica-domini-e-hotel.md — ${out.length} righe`);
