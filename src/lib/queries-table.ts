import type { Locale } from "./config";

// Le righe della tabella query venivano scritte due volte: una in Astro, a
// build time, e una in una template string dentro lo script di pagina. Le due
// versioni erano diverse — bandiera contro sigla, "1,29 €" contro "€1.29",
// sparkline contro ultimo valore — così al primo filtro la tabella cambiava
// aspetto sotto gli occhi. Qui la riga è scritta una volta sola e la usano
// tutte e due.

export type QueryRow = {
  key: string;
  destination: string;
  category: string;
  scope: string;
  funnel: string;
  lang: string;
  level: string;
  cluster: string;
  text: string;
  volume: number;
  cpc: number;
  yoy: number;
  difficulty: number;
  spark: number[];
};

export type RowLabels = {
  destinations: Record<string, string>;
  hrefs: Record<string, string>;
  clusters: Record<string, string>;
  langs: Record<string, string>;
  funnels: Record<string, string>;
  detail: string;
  detailOf: string;
  difficulty: string;
  // Sotto i 768px la tabella diventa una pila di schede e l'intestazione
  // sparisce: ogni cella deve allora portarsi dietro il nome della colonna.
  columns: {
    destination: string;
    volume: string;
    cpc: string;
    yoy: string;
    difficulty: string;
    history: string;
  };
};

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return String(value).replace(/[&<>"']/g, (char) => ENTITIES[char]);
}

// Stessa matematica del componente Sparkline: la linea nella tabella e quella
// nelle schede devono avere la stessa forma per gli stessi numeri.
export function sparkPoints(values: number[], width: number, height: number): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - 2 - ((value - min) / span) * (height - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function sparkSvg(values: number[]): string {
  const width = 72;
  const height = 24;
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none" aria-hidden="true" class="overflow-visible"><polyline points="${sparkPoints(values, width, height)}" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

// Le bandiere sono nello sprite in fondo alla pagina: sessanta righe non
// devono portarsi dietro sessanta copie della Union Jack.
function flag(lang: string, label: string): string {
  const height = lang === "it" ? 10 : 8;
  return `<span class="inline-flex items-center gap-1.5 align-middle" title="${escapeHtml(label)}"><svg width="15" height="${height}" viewBox="0 0 60 ${lang === "it" ? 40 : 30}" class="shrink-0 rounded-[2px]" aria-hidden="true"><use href="#flag-${lang}"/></svg><span class="num text-[0.78rem]">${lang.toUpperCase()}</span></span>`;
}

// Il momento del viaggio, con lo stesso pallino colorato che il resto del sito
// usa per gli stadi. Nella tabella non c'è spazio per l'icona intera, ma il
// colore da solo non basta mai: accanto resta il nome dello stadio.
function funnelTag(stage: string, label: string): string {
  return `<span class="inline-flex items-center gap-1.5 align-middle funnel-ink font-bold" data-funnel="${escapeHtml(stage)}"><span class="funnel-dot"></span>${escapeHtml(label)}</span>`;
}

export function queryRowHtml(row: QueryRow, locale: Locale, labels: RowLabels): string {
  const num = (value: number) => new Intl.NumberFormat(locale).format(value);
  const euro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(row.cpc);

  const tone =
    row.yoy > 0 ? "text-success-ink" : row.yoy < 0 ? "text-danger-ink" : "text-faint";
  // Il segno non è solo colore: chi non distingue verde e rosso legge comunque
  // il triangolo e il segno davanti al numero.
  const arrow = row.yoy > 0 ? "▲" : row.yoy < 0 ? "▼" : "·";
  const yoy = `${row.yoy > 0 ? "+" : ""}${row.yoy.toFixed(1)}%`;

  const destination = labels.destinations[row.destination] ?? row.destination;
  const href = labels.hrefs[row.destination];
  const cluster = labels.clusters[row.cluster] ?? row.cluster.replace(/-/g, " ");
  const width = Math.max(4, Math.min(100, row.difficulty));
  const col = labels.columns;

  return `<tr>
  <td data-cell="head">
    <span class="font-mono text-[0.88rem]">${escapeHtml(row.text)}</span>
    <span class="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.78rem] text-faint">${flag(row.lang, labels.langs[row.lang] ?? row.lang)}<span>·</span>${funnelTag(row.funnel, labels.funnels[row.funnel] ?? row.funnel)}<span>· ${escapeHtml(cluster)}</span></span>
  </td>
  <td class="text-[0.86rem]" data-label="${escapeHtml(col.destination)}">${href ? `<a class="text-muted" href="${href}">${escapeHtml(destination)}</a>` : `<span class="text-muted">${escapeHtml(destination)}</span>`}</td>
  <td class="num text-right font-bold" data-label="${escapeHtml(col.volume)}">${num(row.volume)}</td>
  <td class="num text-right text-muted" data-label="${escapeHtml(col.cpc)}">${euro}</td>
  <td class="num text-right ${tone}" data-label="${escapeHtml(col.yoy)}"><span class="whitespace-nowrap"><span aria-hidden="true">${arrow}</span> ${yoy}</span></td>
  <td class="text-right" data-label="${escapeHtml(col.difficulty)}">
    <span class="flex items-center justify-end gap-2" title="${escapeHtml(labels.difficulty)}: ${row.difficulty}/100">
      <span class="bar" style="width:52px"><span style="width:${width}%"></span></span>
      <span class="num text-[0.82rem] text-muted">${row.difficulty}</span>
    </span>
  </td>
  <td class="text-right" data-label="${escapeHtml(col.history)}">${sparkSvg(row.spark)}</td>
  <td class="text-right" data-cell="action">
    <button class="chip" type="button" data-query-open="${escapeHtml(row.key)}" data-destination="${escapeHtml(row.destination)}" aria-label="${escapeHtml(labels.detailOf.replace("{q}", row.text))}">${escapeHtml(labels.detail)}</button>
  </td>
</tr>`;
}
