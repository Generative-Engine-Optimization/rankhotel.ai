#!/usr/bin/env node
// Legge i registri regionali e assegna ogni struttura a una destinazione.
//
// Ogni regione usa colonne e separatori suoi: il parser li riconosce invece di
// pretendere un formato. L'assegnazione al territorio si fa per coordinate
// quando ci sono (è l'unico modo corretto), per nome del comune quando il
// comune coincide con un'entità già censita nella destinazione.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { DESTINATIONS } from "../seed/destinations.mjs";

const DIR = process.argv[2];
const OUT = process.argv[3];

// L'assegnazione per sola vicinanza non funziona.
//
// Con un raggio largo metà delle strutture finiva nel territorio sbagliato:
// alberghi di Bressanone sotto Val Gardena, che è un'altra valle, e perfino
// alberghi di Zermatt sotto Cervinia, che è un altro Stato. La distanza dice
// dove sta una struttura, non a quale territorio appartiene.
//
// Quindi due condizioni alternative, entrambe strette:
//   1. il comune è uno dei toponimi che la destinazione dichiara: allora
//      appartiene, anche se il centroide è lontano;
//   2. oppure sta molto vicino al centroide, entro i dieci chilometri.
// Chi non soddisfa né l'una né l'altra resta fuori.
const RADIUS_NEAR_KM = 10;
const RADIUS_NAMED_KM = 30;

function splitCsv(line, delimiter) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else quoted = !quoted;
    } else if (c === delimiter && !quoted) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((v) => v.trim().replace(/^"|"$/g, ""));
}

const pick = (headers, patterns) =>
  headers.findIndex((h) => patterns.some((p) => p.test(h)));

const NAME = [/^denominazione$/i, /^nome$/i, /^ragione.?sociale$/i, /^insegna$/i, /denominazione/i, /^struttura$/i];
const COMUNE = [/^comune$/i, /comune/i, /^citta$/i, /localita/i];
const LAT = [/^latitudine$/i, /^lat$/i, /latitud/i, /^y$/i];
const LNG = [/^longitudine$/i, /^lon$/i, /^lng$/i, /longitud/i, /^x$/i];
const WEB = [/^www$/i, /^web$/i, /^sito$/i, /sito.?web/i, /^url$/i, /internet/i];
const STARS = [/^stelle$/i, /^classifica$/i, /categoria/i, /^livello$/i];

const num = (v) => {
  if (!v) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

function starsFrom(value) {
  if (!value) return null;
  const m = String(value).match(/([1-5])\s*stell|([1-5])\s*star|^\s*([1-5])\s*$/i);
  if (m) return Number(m[1] ?? m[2] ?? m[3]);
  if (/cinque/i.test(value)) return 5;
  if (/quattro/i.test(value)) return 4;
  if (/\btre\b/i.test(value)) return 3;
  return null;
}

// Distanza in km fra due coordinate. La formula esatta non serve: a queste
// distanze l'approssimazione piana con correzione della latitudine basta.
const distance = (aLat, aLng, bLat, bLng) => {
  const dLat = (aLat - bLat) * 111;
  const dLng = (aLng - bLng) * 111 * Math.cos((aLat * Math.PI) / 180);
  return Math.hypot(dLat, dLng);
};

// Per l'assegnazione per nome: i comuni che compaiono fra le entità o nel nome
// di una destinazione sono un'ancora affidabile.
const normalise = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();

const byKey = new Map(DESTINATIONS.map((d) => [d.key, d]));
const nameIndex = new Map();
for (const dest of DESTINATIONS) {
  for (const label of [dest.name.it, ...dest.knownFor]) {
    const key = normalise(label);
    if (key.length >= 5 && !nameIndex.has(key)) nameIndex.set(key, dest.key);
  }
}

const files = (await readdir(DIR)).filter((f) => f.endsWith(".csv"));
const rows = [];
const seen = new Set();

for (const file of files) {
  const text = await readFile(`${DIR}/${file}`, "utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 3) continue;
  const delimiter = (lines[0].match(/;/g)?.length ?? 0) > (lines[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const headers = splitCsv(lines[0], delimiter);

  const iName = pick(headers, NAME);
  if (iName === -1) continue;
  const iComune = pick(headers, COMUNE);
  const iLat = pick(headers, LAT);
  const iLng = pick(headers, LNG);
  const iWeb = pick(headers, WEB);
  const iStars = pick(headers, STARS);

  for (const line of lines.slice(1)) {
    const cells = splitCsv(line, delimiter);
    const name = cells[iName];
    if (!name || name.length < 4 || name.length > 60) continue;

    const lat = iLat > -1 ? num(cells[iLat]) : null;
    const lng = iLng > -1 ? num(cells[iLng]) : null;
    const comune = iComune > -1 ? cells[iComune] : null;

    let dest = null;
    let how = null;
    const comuneKey = comune ? normalise(comune) : null;
    const named = comuneKey ? nameIndex.get(comuneKey) : null;

    const hasCoords = lat && lng && lat > 35 && lat < 48 && lng > 6 && lng < 19;
    let nearest = null;
    if (hasCoords) {
      for (const d of DESTINATIONS) {
        const km = distance(lat, lng, d.lat, d.lng);
        if (!nearest || km < nearest.km) nearest = { key: d.key, km };
      }
    }

    if (named) {
      // Il comune è dichiarato dalla destinazione. Si accetta, ma non a
      // qualunque distanza: un'omonimia lontana sarebbe comunque un errore.
      const km = hasCoords ? distance(lat, lng, byKey.get(named).lat, byKey.get(named).lng) : 0;
      if (km <= RADIUS_NAMED_KM) {
        dest = named;
        how = `comune ${comune}${hasCoords ? `, ${km.toFixed(0)} km` : ""}`;
      }
    }
    if (!dest && nearest && nearest.km <= RADIUS_NEAR_KM) {
      dest = nearest.key;
      how = `coordinate, ${nearest.km.toFixed(0)} km`;
    }
    if (!dest) continue;

    const key = `${dest}|${normalise(name)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const web = iWeb > -1 ? (cells[iWeb] ?? "").trim() : "";
    const domain = web
      ? web.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split(/[/?#]/)[0].toLowerCase()
      : null;

    rows.push({
      dest,
      name: name.replace(/\s+/g, " ").trim(),
      comune,
      domain: domain && domain.includes(".") ? domain : null,
      stars: iStars > -1 ? starsFrom(cells[iStars]) : null,
      how,
      registry: file.replace(/\.csv$/, ""),
    });
  }
}

const byDest = {};
for (const row of rows) (byDest[row.dest] ??= []).push(row);

console.log(`  registri letti      ${files.length}`);
console.log(`  strutture assegnate ${rows.length}`);
console.log(`  con sito web        ${rows.filter((r) => r.domain).length}`);
console.log(`  destinazioni        ${Object.keys(byDest).length}/100`);
await writeFile(OUT, JSON.stringify(rows, null, 1));
console.log(`\n  scritto ${OUT}`);
