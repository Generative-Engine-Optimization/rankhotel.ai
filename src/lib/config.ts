export const SITE_URL = "https://www.rankhotel.ai";
export const BRAND = "RankHotel.ai";
export const DEFAULT_LOCALE = "it";
export const LOCALES = ["it", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const OBSERVATORY_IS_DEMO = true;

export const LINKS = {
  bookCall: "https://cal.com/rankwit/rankhotel.ai",
  rankwit: "https://www.rankwit.ai/",
  email: "hello@rankhotel.ai",
} as const;

export function pathFor(locale: Locale, parts: string[] = []): string {
  const base = `/${locale}`;
  if (parts.length === 0) return base;
  return `${base}/${parts.join("/")}`;
}

export function observatoryPath(locale: Locale): string {
  return locale === "it" ? "/it/osservatorio" : "/en/observatory";
}

export function methodologyPath(locale: Locale): string {
  return locale === "it"
    ? "/it/osservatorio/metodologia"
    : "/en/observatory/methodology";
}

export function cityPath(locale: Locale, slug: string): string {
  return locale === "it"
    ? `/it/osservatorio/citta/${slug}`
    : `/en/observatory/cities/${slug}`;
}

export function absolute(path: string): string {
  return new URL(path, SITE_URL).toString();
}
