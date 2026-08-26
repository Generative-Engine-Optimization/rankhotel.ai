// Sagoma dell'Italia, in coordinate geografiche.
//
// È volutamente grossolana: serve a far capire dove cade un territorio, non a
// misurare una costa. Tenerla in lat/lng invece che in coordinate di disegno
// permette di proiettare sagoma e pin con la stessa formula, che è l'unico modo
// per essere sicuri che il puntino finisca dove deve.

type Point = [number, number]; // [lon, lat]

const MAINLAND: Point[] = [
  [7.0, 45.9], [7.6, 45.95], [8.5, 46.2], [9.0, 46.5], [10.1, 46.6],
  [10.5, 46.9], [11.2, 47.0], [12.2, 46.9], [13.4, 46.6], [13.6, 46.0],
  [13.8, 45.7], [13.1, 45.6], [12.5, 45.5], [12.4, 45.0], [12.6, 44.4],
  [13.5, 43.6], [14.2, 42.4], [15.1, 41.95], [16.2, 41.9], [15.9, 41.4],
  [16.5, 41.2], [17.3, 40.9], [17.9, 40.7], [18.5, 40.1], [18.4, 39.8],
  [17.9, 40.35], [17.2, 40.5], [16.6, 40.1], [16.5, 39.6], [17.15, 39.0],
  [16.6, 38.5], [16.1, 37.95], [15.6, 38.0], [15.9, 38.5], [16.0, 38.9],
  [15.6, 39.4], [15.0, 40.0], [14.9, 40.4], [14.2, 40.6], [13.6, 41.2],
  [12.6, 41.5], [11.8, 42.4], [10.7, 42.9], [10.3, 43.8], [10.0, 44.0],
  [9.4, 44.3], [8.9, 44.4], [8.0, 44.1], [7.5, 43.8], [7.6, 44.1],
  [6.9, 44.4], [7.0, 45.0],
];

const SICILY: Point[] = [
  [12.4, 37.8], [13.4, 38.2], [14.5, 38.1], [15.2, 38.3], [15.3, 37.5],
  [15.1, 36.7], [14.5, 36.7], [13.6, 37.1], [12.6, 37.6],
];

const SARDINIA: Point[] = [
  [9.2, 41.3], [9.6, 41.1], [9.7, 40.5], [9.6, 39.9], [9.6, 39.1],
  [9.0, 39.0], [8.4, 39.2], [8.4, 40.0], [8.2, 40.7], [8.6, 41.1],
];

export const BOUNDS = { minLon: 6.5, maxLon: 18.8, minLat: 36.4, maxLat: 47.2 };

// Correzione della longitudine alla latitudine media: senza, l'Italia esce
// larga e schiacciata come su una carta di Mercatore ritagliata male.
const LON_SCALE = Math.cos(((BOUNDS.minLat + BOUNDS.maxLat) / 2) * (Math.PI / 180));

export const VIEW = {
  width: 100,
  get height() {
    const lonSpan = (BOUNDS.maxLon - BOUNDS.minLon) * LON_SCALE;
    const latSpan = BOUNDS.maxLat - BOUNDS.minLat;
    return Math.round((latSpan / lonSpan) * 100);
  },
};

export function project(lng: number, lat: number): [number, number] {
  const lonSpan = (BOUNDS.maxLon - BOUNDS.minLon) * LON_SCALE;
  const x = ((lng - BOUNDS.minLon) * LON_SCALE * VIEW.width) / lonSpan;
  const y =
    ((BOUNDS.maxLat - lat) * VIEW.height) / (BOUNDS.maxLat - BOUNDS.minLat);
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

const toPath = (points: Point[]) =>
  points
    .map(([lng, lat], index) => {
      const [x, y] = project(lng, lat);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ") + " Z";

export const ITALY_PATHS = [MAINLAND, SICILY, SARDINIA].map(toPath);
