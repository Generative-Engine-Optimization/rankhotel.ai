import type { Locale } from "./config";

export function percent(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}

export function number(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function decimal(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value);
}

export function signed(value: number): string {
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : String(value);
}
