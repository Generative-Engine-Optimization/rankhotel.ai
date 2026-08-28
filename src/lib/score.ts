// La codifica visiva del punteggio: fascia, colore, classe della barra.
//
// Sta in un modulo a sé, senza nessun import, per due ragioni. La prima è che
// la scala di colore era scritta tre volte — in ScoreDial, nella tabella delle
// destinazioni e nel confronto — e tre copie della stessa formula significano
// che prima o poi due restano indietro senza che nessuno se ne accorga.
//
// La seconda è che gli script di pagina hanno bisogno delle stesse funzioni:
// prenderle da observatory.ts trascinerebbe nel bundle del browser tutti i JSON
// del dataset, che quel modulo importa a livello di file.

export type ScoreBand = "high" | "mid" | "low";

export function scoreBand(value: number): ScoreBand {
  if (value >= 65) return "high";
  if (value >= 52) return "mid";
  return "low";
}

// La classe della barra segue la fascia: le tinte stanno nel foglio di stile,
// non in un attributo style scritto a mano dentro un componente.
export function barClass(value: number): `bar-${ScoreBand}` {
  return `bar-${scoreBand(value)}`;
}

// Dal rosso al verde passando per l'oro, in oklch: la scala è percettivamente
// uniforme, quindi due punti di differenza si vedono uguali in tutto l'arco.
// La chroma cala agli estremi bassi, perché un rosso acceso su un borgo che non
// ha colpa di essere piccolo sarebbe un giudizio, non una misura.
export function scoreColor(value: number): string {
  const v = clamp(value);
  return `oklch(0.5 ${chroma(v).toFixed(3)} ${hue(v).toFixed(0)})`;
}

// La stessa tinta in versione chiara: sull'anello dello ScoreDial disegna la
// banda di oscillazione, cioè dove il punteggio poteva finire.
export function scoreColorSoft(value: number): string {
  const v = clamp(value);
  return `oklch(0.86 ${(chroma(v) * 0.55).toFixed(3)} ${hue(v).toFixed(0)})`;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function hue(v: number): number {
  return 18 + (v / 100) * 128;
}

function chroma(v: number): number {
  return 0.09 + (Math.abs(v - 50) / 50) * 0.05;
}
