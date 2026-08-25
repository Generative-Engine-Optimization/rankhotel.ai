import type { Locale } from "./config";
import commonEn from "../data/messages/common.en.json";
import commonIt from "../data/messages/common.it.json";
import landingEn from "../data/messages/landing.en.json";
import landingIt from "../data/messages/landing.it.json";
import observatoryEn from "../data/messages/observatory.en.json";
import observatoryIt from "../data/messages/observatory.it.json";

const STRINGS = {
  it: { common: commonIt, landing: landingIt, observatory: observatoryIt },
  en: { common: commonEn, landing: landingEn, observatory: observatoryEn },
} as const;

export function messages(locale: Locale) {
  return STRINGS[locale];
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    values[key] === undefined ? `{${key}}` : String(values[key]),
  );
}
