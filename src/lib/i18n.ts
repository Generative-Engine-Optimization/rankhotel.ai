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
  values: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    values[key] === undefined ? `{${key}}` : String(values[key]),
  );
}

// I plurali ICU nei JSON non venivano interpretati: la vecchia sostituzione
// letterale mangiava il sostantivo ("superato X di 1" invece di "di una
// posizione"). Con il volume di stringhe di questo osservatorio serviva un
// helper vero.
//
// Formato supportato: "{n, plural, one {una posizione} other {# posizioni}}"
const PLURAL_RE = /\{(\w+),\s*plural,\s*(.+?)\}\s*(?=$|[^}])/;

function parseBranches(body: string): Record<string, string> {
  const branches: Record<string, string> = {};
  const re = /(=\d+|zero|one|two|few|many|other)\s*\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    branches[match[1]] = match[2];
  }
  return branches;
}

export function plural(
  locale: Locale,
  template: string,
  values: Record<string, string | number> = {},
): string {
  let out = template;
  let guard = 0;
  while (guard < 10) {
    guard += 1;
    // Si isola il blocco plurale contando le graffe: una regex sola non regge
    // le parentesi annidate dei rami.
    const start = out.search(/\{\w+,\s*plural,/);
    if (start === -1) break;
    let depth = 0;
    let end = start;
    for (let i = start; i < out.length; i += 1) {
      if (out[i] === "{") depth += 1;
      if (out[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    const block = out.slice(start, end + 1);
    const nameMatch = block.match(/\{(\w+),\s*plural,/);
    const name = nameMatch ? nameMatch[1] : "";
    const count = Number(values[name] ?? 0);
    const branches = parseBranches(block.slice(block.indexOf(",", block.indexOf(",") + 1) + 1));
    const category = new Intl.PluralRules(locale).select(count);
    const chosen =
      branches[`=${count}`] ?? branches[category] ?? branches.other ?? "";
    out = out.slice(0, start) + chosen.replace(/#/g, String(count)) + out.slice(end + 1);
  }
  return interpolate(out, values);
}

// Scorciatoia: interpola i segnaposto semplici e risolve i plurali in un colpo.
export function t(
  locale: Locale,
  template: string,
  values: Record<string, string | number> = {},
): string {
  return plural(locale, template, values);
}
