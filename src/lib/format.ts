import type { Locale } from "./config";

export function percent(locale: Locale, value: number, digits = 0): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: digits,
  }).format(value);
}

export function number(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function decimal(locale: Locale, value: number, digits = 1): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
  }).format(value);
}

export function compact(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function euro(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function signed(value: number, digits = 0): string {
  if (Math.abs(value) < 10 ** -digits / 2) return "0";
  const formatted = digits > 0 ? value.toFixed(digits) : String(Math.round(value));
  return value > 0 ? `+${formatted}` : formatted;
}

// "68 ±4": la forma in cui lo score compare ovunque nel sito. Il ± non è un
// vezzo, è ciò che distingue una media di 5 run da uno screenshot di ChatGPT.
export function band(locale: Locale, mean: number, stdDev: number): string {
  return `${decimal(locale, mean, 0)} ±${decimal(locale, stdDev, 0)}`;
}

// Mese "2026-08" -> "ago 2026" / "Aug 2026"
export function monthLabel(locale: Locale, key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function dateLabel(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00Z`));
}
