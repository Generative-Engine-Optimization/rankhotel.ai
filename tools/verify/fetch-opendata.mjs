#!/usr/bin/env node
// Scarica i registri regionali delle strutture ricettive.
//
// Sono anagrafiche ufficiali di attività autorizzate: la fonte più autorevole
// possibile per sapere quali strutture esistono davvero in un territorio.
// Meglio di qualunque tentativo di indovinare un dominio.

import { readFile, writeFile, mkdir } from "node:fs/promises";

const DIR = process.argv[2];
await mkdir(DIR, { recursive: true });

const picks = JSON.parse(await readFile("/tmp/opendata-pick.json", "utf8"));

// Aggiunte a mano: registri che il catalogo nazionale non indicizza bene ma
// che sono i più grandi, e vale la pena avere.
const EXTRA = [
  { org: "Regione Piemonte", title: "Alberghi", url: "https://api.smartdatanet.it/api/Albergo_3764/download/3764/all" },
  { org: "Regione Piemonte", title: "Alberghi e RTA", url: "https://api.smartdatanet.it/api/AlberghiRtaO_1665/download/1665/all" },
  { org: "Regione Piemonte", title: "Extralberghiero", url: "https://api.smartdatanet.it/api/Extralberghiero_3765/download/3765/all" },
  { org: "Regione Piemonte", title: "Agriturismi", url: "https://api.smartdatanet.it/api/Agriturismo_3766/download/3766/all" },
  { org: "Regione FVG", title: "Strutture alberghiere", url: "https://www.dati.friuliveneziagiulia.it/api/views/fiiw-i5su/rows.csv?accessType=DOWNLOAD" },
  { org: "Regione FVG", title: "Alberghi diffusi", url: "https://www.dati.friuliveneziagiulia.it/api/views/69j3-9hcp/rows.csv?accessType=DOWNLOAD" },
];

const all = [...EXTRA, ...picks].slice(0, 60);
let ok = 0;
let skipped = 0;

await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (all.length) {
      const row = all.pop();
      const name = `${row.org}-${row.title}`.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 60);
      try {
        const response = await fetch(row.url, {
          signal: AbortSignal.timeout(60000),
          redirect: "follow",
          headers: { "user-agent": "BussolaObservatoryCheck/1.0" },
        });
        if (!response.ok) {
          skipped += 1;
          continue;
        }
        const text = await response.text();
        // Un file di poche righe non è un'anagrafica: è un errore o un residuo.
        if (text.length < 400 || text.split("\n").length < 6) {
          skipped += 1;
          continue;
        }
        await writeFile(`${DIR}/${name}.csv`, text);
        ok += 1;
      } catch {
        skipped += 1;
      }
    }
  }),
);

console.log(`  scaricati ${ok} · saltati ${skipped}`);
