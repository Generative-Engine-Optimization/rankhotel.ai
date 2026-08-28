import type { Locale } from "./config";

// I numeri dell'intestazione salgono da zero. Il valore finale però resta
// scritto nell'HTML — chi non esegue JavaScript, e chi legge la pagina per
// estrarne i dati, trova il numero già formattato — quindi non c'è un valore
// grezzo da passare allo script: c'è una stringa già composta da `Intl`.
//
// Questa funzione la smonta una volta sola, in fase di build, e appende al
// nodo quello che serve per ricomporla a ogni fotogramma: il valore, quante
// cifre decimali mostrava, e l'eventuale simbolo o unità che gli stava
// attorno. Lo script in pagina non deve più capire in che lingua è scritto
// «1.234,5».
export type CountUpAttrs = {
  "data-countup": string;
  "data-countup-decimals": string;
  "data-countup-prefix": string;
  "data-countup-suffix": string;
};

const cache = new Map<Locale, { group: string; decimal: string }>();

// I separatori non si scrivono a mano: in italiano il punto raggruppa e la
// virgola separa i decimali, in inglese è l'opposto, e chiederlo a `Intl` è
// l'unico modo di non sbagliarlo per la prossima lingua che si aggiunge.
function separators(locale: Locale) {
  const known = cache.get(locale);
  if (known) return known;
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const found = {
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
  };
  cache.set(locale, found);
  return found;
}

const quote = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Davanti al numero può esserci solo un segno o una valuta: «Hotel 4 Stagioni»
// è il nome di un albergo, non un valore da far correre.
const PREFIX = /^[+\-−±$€£]?$/;
// Dietro, solo un simbolo o un'unità corta: «%», «€», «Mln», «mila».
const SUFFIX = /^(?:[%‰$€£]|\p{L}{1,4})?$/u;

/**
 * Attributi per il conta-su, oppure `null` se la stringa non è un numero solo:
 * un nome proprio, una sigla, o una frase con due cifre dentro («3ª di 25»)
 * resta ferma com'è.
 */
export function countUpAttrs(locale: Locale, formatted: string): CountUpAttrs | null {
  const { group, decimal } = separators(locale);
  const pattern = new RegExp(
    `[+\\-−]?\\d+(?:${quote(group)}\\d{3})*(?:${quote(decimal)}\\d+)?`,
    "g",
  );
  const tokens = formatted.match(pattern);
  if (!tokens || tokens.length !== 1) return null;

  const token = tokens[0];
  const at = formatted.indexOf(token);
  const sign = /^[+\-−]/.exec(token)?.[0] ?? "";
  const digits = token.slice(sign.length);
  const prefix = formatted.slice(0, at) + (sign === "+" ? "+" : "");
  const suffix = formatted.slice(at + token.length);
  if (!PREFIX.test(prefix.trim()) || !SUFFIX.test(suffix.trim())) return null;

  const plain = Number(digits.split(group).join("").replace(decimal, "."));
  if (!Number.isFinite(plain)) return null;

  const decimals = digits.split(decimal)[1]?.length ?? 0;
  return {
    "data-countup": String(sign === "-" || sign === "−" ? -plain : plain),
    "data-countup-decimals": String(decimals),
    "data-countup-prefix": prefix,
    "data-countup-suffix": suffix,
  };
}
