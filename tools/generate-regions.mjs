// Sagome delle venti regioni italiane, da confini ufficiali.
//
// Fonte: openpolis/geojson-italy, che ridistribuisce i limiti amministrativi
// ISTAT. Non disegniamo niente a mano: la sagoma di una regione è un fatto
// geografico, e un fatto si prende dove è pubblicato.
//
// L'output è un modulo TypeScript con un path SVG per regione, normalizzato
// nella sua scatola. Compaiono a 16-18px accanto al nome del territorio:
// oltre le poche decine di punti nessuno vede la differenza, e ogni punto in
// più è peso che l'utente scarica per niente.
//
//   node tools/generate-regions.mjs

import { writeFileSync } from "node:fs";

const SOURCE =
  "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson";

// Le due regioni bilingui arrivano col nome doppio: nei nostri dati stanno
// con quello italiano, e le chiavi devono combaciare.
const RENAME = {
  "Trentino-Alto Adige/Südtirol": "Trentino-Alto Adige",
  "Valle d'Aosta/Vallée d'Aoste": "Valle d'Aosta",
};

// Un anello sotto questa quota dell'anello maggiore, a 16px, è meno di un
// pixel: non aggiunge informazione, aggiunge byte.
const MIN_RING_SHARE = 0.01;

// Quanti punti bastano per riconoscere una sagoma a questa dimensione.
const TARGET_POINTS = 46;

const key = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ringArea = (ring) => {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(sum / 2);
};

// Douglas-Peucker: tiene i punti che cambiano davvero la forma.
function simplify(points, tolerance) {
  if (points.length < 3) return points;

  const distance = (p, a, b) => {
    const [px, py] = p;
    let [x, y] = a;
    let dx = b[0] - x;
    let dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) [x, y] = b;
      else if (t > 0) [x, y] = [x + dx * t, y + dy * t];
    }
    dx = px - x;
    dy = py - y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];

  while (stack.length) {
    const [first, last] = stack.pop();
    let index = -1;
    let max = tolerance;
    for (let i = first + 1; i < last; i += 1) {
      const d = distance(points[i], points[first], points[last]);
      if (d > max) {
        max = d;
        index = i;
      }
    }
    if (index !== -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, i) => keep[i]);
}

// Cerca la tolleranza che porta l'anello vicino al numero di punti voluto,
// invece di fissarne una che va bene per la Sardegna e distrugge il Molise.
function simplifyToBudget(ring, budget) {
  let best = simplify(ring, 0);
  if (best.length <= budget) return best;

  // Le coordinate stanno su una scatola di lato 100: la tolleranza utile può
  // arrivare a qualche unità. Prima si cerca un limite alto che basti, poi lo
  // si stringe: partire da un intervallo fisso lasciava la Calabria a 40 punti
  // e la Lombardia a cinquemila.
  let high = 0.05;
  while (simplify(ring, high).length > budget && high < 50) high *= 2;

  let low = 0;
  for (let i = 0; i < 30; i += 1) {
    const mid = (low + high) / 2;
    const candidate = simplify(ring, mid);
    if (candidate.length > budget) low = mid;
    else {
      best = candidate;
      high = mid;
    }
  }
  return best;
}

const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`Sorgente non raggiungibile: ${response.status}`);
const geo = await response.json();

const regions = geo.features
  .map((feature) => {
    const raw = feature.properties.reg_name;
    const name = RENAME[raw] ?? raw;

    // Polygon e MultiPolygon: teniamo solo gli anelli esterni. I buchi (enclavi
    // come San Marino) a questa dimensione non si vedono.
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;
    const rings = polygons.map((polygon) => polygon[0]);

    const areas = rings.map(ringArea);
    const largest = Math.max(...areas);
    const kept = rings
      .map((ring, i) => ({ ring, area: areas[i] }))
      .filter((entry) => entry.area >= largest * MIN_RING_SHARE)
      .sort((a, b) => b.area - a.area);

    // Proiezione equirettangolare con la longitudine corretta sul coseno della
    // latitudine media: senza, le regioni del nord escono schiacciate.
    const all = kept.flatMap((entry) => entry.ring);
    const lats = all.map((p) => p[1]);
    const cos = Math.cos((((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI) / 180);
    const projected = kept.map((entry) => entry.ring.map(([lon, lat]) => [lon * cos, -lat]));

    const flat = projected.flat();
    const minX = Math.min(...flat.map((p) => p[0]));
    const maxX = Math.max(...flat.map((p) => p[0]));
    const minY = Math.min(...flat.map((p) => p[1]));
    const maxY = Math.max(...flat.map((p) => p[1]));
    const span = Math.max(maxX - minX, maxY - minY);
    const scale = 100 / span;

    const width = Number(((maxX - minX) * scale).toFixed(2));
    const height = Number(((maxY - minY) * scale).toFixed(2));

    // Il budget di punti va all'anello maggiore; le isole ne ricevono meno,
    // in proporzione a quanto pesano.
    const total = kept.reduce((sum, entry) => sum + entry.area, 0);

    const path = kept
      .map((entry, index) => {
        const share = entry.area / total;
        const budget = Math.max(8, Math.round(TARGET_POINTS * Math.sqrt(share)));
        const scaled = projected[index].map(([x, y]) => [
          (x - minX) * scale,
          (y - minY) * scale,
        ]);
        const points = simplifyToBudget(scaled, budget);
        return (
          points
            .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
            .join("") + "Z"
        );
      })
      .join("");

    return { key: key(name), name, width, height, path };
  })
  .sort((a, b) => a.key.localeCompare(b.key));

const body = regions
  .map(
    (region) =>
      `  "${region.key}": { name: ${JSON.stringify(region.name)}, width: ${region.width}, height: ${region.height}, path: "${region.path}" },`,
  )
  .join("\n");

const out = `// GENERATO DA tools/generate-regions.mjs — non modificare a mano.
//
// Sagome delle venti regioni italiane da confini amministrativi ISTAT
// (via openpolis/geojson-italy). Ogni sagoma è normalizzata nella sua scatola:
// il lato lungo vale 100, l'altro sta in proporzione.

export type RegionShape = {
  name: string;
  width: number;
  height: number;
  path: string;
};

export const REGION_SHAPES: Record<string, RegionShape> = {
${body}
};

// I nomi arrivano dai dati delle destinazioni, non da questo file: la chiave
// va ricavata allo stesso modo per entrambi.
export function regionKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function regionShape(name: string): RegionShape | undefined {
  return REGION_SHAPES[regionKey(name)];
}
`;

writeFileSync("src/lib/regions.ts", out);

const bytes = regions.reduce((sum, r) => sum + r.path.length, 0);
console.log(`${regions.length} regioni · ${(bytes / 1024).toFixed(1)} KB di path`);
for (const region of regions) {
  console.log(`  ${region.key.padEnd(22)} ${String(region.path.length).padStart(5)} char`);
}
