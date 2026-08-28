import { barClass, scoreColor } from "./score";

// La tabella del confronto. Stava dentro CompareBoard.astro, che con markup e
// script era arrivato a novecentosessantacinque righe: quattro volte il secondo
// componente più grande del sito. Dentro c'erano due cose indipendenti — il
// selettore con i quattro posti, e il motore che costruisce la tabella — e solo
// la seconda è lunga.
//
// Il precedente è queries-table.ts, che fa lo stesso per la pagina delle query.

export type Labels = Record<string, any>;
export type Row = any;

type Ctx = { isBest: boolean; delta: string };

// Il segno del valore migliore. Sta accanto al colore, mai da solo: chi non
// distingue la velatura d'accento vede comunque la spunta, e uno screen reader
// legge l'sr-only che la accompagna.
const ICON_BEST =
  '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.5 9.5 17.5 19.5 6.5"/></svg>';

type Spec = {
  group?: string;
  label?: string;
  labelHtml?: string;
  dir?: 1 | -1 | 0;
  value?: (row: Row) => number;
  // Il confronto avviene sui valori come li si legge, non su quelli interni:
  // due 29% non devono produrre un vincitore per sette decimi.
  round?: (value: number) => number;
  digits?: number;
  cell: (row: Row, ctx: Ctx) => string;
};

export type CompareResult = { table: string; verdict: string };

export type CompareOptions = {
  /** La sagoma della regione viene ripescata dalla lista di scelta già in
      pagina, invece di rispedire al browser i path delle venti regioni. È una
      lettura del DOM, quindi la fornisce chi chiama: qui dentro non si tocca
      il documento. */
  regionMark?: (key: string) => string;
};

export function renderCompare(
  rows: Row[],
  labels: Labels,
  locale: string,
  options: CompareOptions = {},
): CompareResult {
  const regionMark = options.regionMark ?? (() => "");
  const nf = (digits = 0) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: digits });
  const num = (value: number, digits = 0) => nf(digits).format(value);
  const compactNum = (value: number) =>
    new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
      value,
    );
  const pct = (value: number) =>
    new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(value);
  const signedNum = (value: number, digits = 0) => {
    // Si arrotonda prima di decidere il segno: uno scarto che a video vale
    // zero non deve comparire come "−0".
    const factor = 10 ** digits;
    const rounded = Math.round(value * factor) / factor;
    if (rounded === 0) return "0";
    return `${rounded > 0 ? "+" : "−"}${num(Math.abs(rounded), digits)}`;
  };
  const fill = (template: string, values: Record<string, string | number>) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) =>
      values[key] === undefined ? `{${key}}` : String(values[key]),
    );
  const esc = (value: string) =>
    value.replace(/[&<>"']/g, (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
    );



  const sparkline = (values: number[]) => {
    if (!values?.length) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const step = values.length > 1 ? 56 / (values.length - 1) : 56;
    const points = values
      .map((value, index) => `${(index * step).toFixed(1)},${(18 - ((value - min) / span) * 14).toFixed(1)}`)
      .join(" ");
    return `<svg viewBox="0 0 56 20" width="56" height="20" fill="none" aria-hidden="true"><polyline points="${points}" stroke="var(--color-faint)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  };

  const bar = (ratio: number, tone: string) =>
    `<span class="bar ${tone}"><span style="width:${Math.max(2, Math.min(100, ratio * 100)).toFixed(1)}%"></span></span>`;

  // Ogni riga dichiara da sé dove sta il "meglio": su questo osservatorio la
  // quota OTA alta non è un merito, e una posizione bassa in classifica sì.
  type Ctx = { isBest: boolean; delta: string };

  type Spec = {
    group?: string;
    label?: string;
    labelHtml?: string;
    dir?: 1 | -1 | 0;
    value?: (row: Row) => number;
    // Il confronto avviene sui valori come li si legge, non su quelli
    // interni: due 29% non devono produrre un vincitore per sette decimi.
    round?: (value: number) => number;
    digits?: number;
    cell: (row: Row, ctx: Ctx) => string;
  };

  const mark = (isBest: boolean) =>
    isBest ? `<span class="text-accent-ink">${ICON_BEST}</span>` : "";
  const note = (text: string) => (text ? `<span class="compare-note">${text}</span>` : "");

  const scoreCell = (row: Row, ctx: Ctx) => {
    const value = row.score.mean;
    return `<span class="compare-cell">
      <span class="compare-value" style="color:${scoreColor(value)};font-size:1.28rem;font-weight:700">
        ${mark(ctx.isBest)}${num(value)}
        <span class="compare-note">±${num(row.score.stdDev)}</span>
      </span>
      ${bar(value / 100, barClass(value))}
      ${note(ctx.delta)}
    </span>`;
  };

  const gauge =
    (read: (row: Row) => number, hint?: (row: Row) => string) =>
    (row: Row, ctx: Ctx) => {
      const value = read(row);
      return `<span class="compare-cell">
        <span class="compare-value">${mark(ctx.isBest)}${num(value)}</span>
        ${bar(value / 100, barClass(value))}
        ${note(hint ? hint(row) : ctx.delta)}
      </span>`;
    };

  const shareCell = (key: string) => (row: Row, ctx: Ctx) => {
    const value = row.sourceMix[key];
    const tone = key === "dmo" ? "bar-high" : key === "ota" ? "bar-low" : "";
    return `<span class="compare-cell">
      <span class="compare-value">${mark(ctx.isBest)}${pct(value)}</span>
      ${bar(value, tone)}
      ${note(ctx.delta)}
    </span>`;
  };

  // Il confronto deve arrotondare esattamente come arrotonda la cella, o
  // due 29% finiscono per avere un vincitore: 0,285 × 100 in virgola mobile
  // fa 28,4999… mentre Intl lo scrive 29%. Quindi si quantizza con Intl.
  const quantize = (digits: number) => {
    const format = new Intl.NumberFormat("en", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
      useGrouping: false,
    });
    return (value: number) => Number(format.format(value));
  };
  const whole = quantize(0);
  const oneDecimal = quantize(1);
  const percentFormat = new Intl.NumberFormat("en", {
    style: "percent",
    maximumFractionDigits: 0,
    useGrouping: false,
  });
  const points = (value: number) =>
    Number(percentFormat.format(value).replace(/[^\d.-]/g, ""));

  const specs: Spec[] = [
    { group: labels.groups.summary },
    {
      label: labels.score,
      dir: 1,
      value: (row) => row.score.mean,
      round: whole,
      cell: scoreCell,
    },
    {
      label: labels.rows.tier,
      dir: 0,
      cell: (row) =>
        `<span class="pill whitespace-nowrap"><span class="num font-bold">${esc(row.tier.toUpperCase())}</span> · ${esc(labels.tiers[row.tier] ?? "")}</span>`,
    },
    {
      label: labels.rows.rank,
      dir: -1,
      value: (row) => row.nationalRank,
      cell: (row, ctx) => {
        const exact = row.rankRange[0] === row.rankRange[1];
        return `<span class="compare-cell">
          <span class="compare-value">${mark(ctx.isBest)}${esc(
            fill(labels.rankPosition, { n: row.nationalRank, total: 100 }),
          )}</span>
          <span class="compare-note">${esc(
            exact
              ? labels.rankExact
              : fill(labels.rankRange, { from: row.rankRange[0], to: row.rankRange[1] }),
          )}</span>
        </span>`;
      },
    },
    {
      label: labels.rows.stability,
      dir: 0,
      cell: (row) => {
        const tone = {
          stable: "text-success-ink",
          moderate: "text-gold-ink",
          volatile: "text-danger-ink",
        }[row.score.stability as string];
        return `<span class="pill whitespace-nowrap ${tone}">${esc(labels.stability[row.score.stability])}</span>`;
      },
    },
    {
      label: labels.rows.trend,
      dir: 1,
      value: (row) => row.trend,
      round: oneDecimal,
      digits: 1,
      cell: (row, ctx) => {
        const tone =
          row.trend > 0 ? "text-success-ink" : row.trend < 0 ? "text-danger-ink" : "text-faint";
        return `<span class="compare-cell">
          <span class="compare-value ${tone}">${mark(ctx.isBest)}${signedNum(row.trend, 1)}</span>
          ${sparkline(row.spark)}
        </span>`;
      },
    },
    { group: labels.groups.engines },
    ...Object.entries(labels.engines).map(([key, meta]: [string, any]) => ({
      labelHtml: `<span class="inline-flex items-center gap-2"><img src="${meta.logo}" width="16" height="16" alt="" loading="lazy" decoding="async" style="width:16px;height:16px"><span>${esc(meta.label)}</span></span>`,
      dir: 1 as const,
      value: (row: Row) => row.byEngine[key].score,
      round: whole,
      cell: gauge(
        (row: Row) => row.byEngine[key].score,
        (row: Row) => fill(meta.rank, { n: row.byEngine[key].rank }),
      ),
    })),
    { group: labels.groups.factors },
    ...Object.entries(labels.factors).map(([key, meta]: [string, any]) => ({
      labelHtml: `<span class="grid gap-0.5"><span>${esc(meta.name)}</span><span class="text-[0.76rem] text-faint">${esc(meta.weight)}</span></span>`,
      dir: 1 as const,
      value: (row: Row) => row.factors[key],
      round: whole,
      cell: gauge((row: Row) => row.factors[key]),
    })),
    { group: labels.groups.sources },
    {
      label: labels.sources.dmo,
      dir: 1,
      value: (row) => row.sourceMix.dmo,
      round: points,
      cell: shareCell("dmo"),
    },
    { label: labels.sources.editorial, dir: 0, cell: shareCell("editorial") },
    // Sulla quota degli aggregatori il valore migliore è il più basso: è la
    // tesi dell'osservatorio, non un dettaglio di formattazione.
    {
      label: labels.sources.ota,
      dir: -1,
      value: (row) => row.sourceMix.ota,
      round: points,
      cell: shareCell("ota"),
    },
    {
      label: labels.rows.quality,
      dir: 1,
      value: (row) => row.sources.quality,
      round: whole,
      cell: gauge((row: Row) => row.sources.quality),
    },
    { group: labels.groups.territory },
    {
      label: labels.rows.visitors,
      dir: 0,
      cell: (row) => `<span class="compare-value">${compactNum(row.visitors * 1000)}</span>`,
    },
    {
      label: labels.rows.demand,
      dir: 0,
      cell: (row) => `<span class="compare-value">${compactNum(row.demand)}</span>`,
    },
    {
      label: labels.rows["top-hotel"],
      dir: 0,
      cell: (row) => {
        const hotel = row.hotels?.[0];
        if (!hotel) return '<span class="text-faint">—</span>';
        return `<span class="compare-cell">
          <span>${esc(hotel.name)}</span>
          <span class="compare-note">${num(hotel.score.mean)}</span>
        </span>`;
      },
    },
    {
      label: labels.rows.open,
      dir: 0,
      cell: (row) =>
        `<a class="btn btn-secondary btn-sm whitespace-nowrap" href="${esc(labels.paths[row.key] ?? "#")}">${esc(row.name)} <span aria-hidden="true">→</span></a>`,
    },
  ];

  function measure(rows: Row[], spec: Spec) {
    if (!spec.dir || !spec.value) return { values: [], best: undefined, winner: -1 };
    const round = spec.round ?? ((value: number) => value);
    const values = rows.map((row) => round(spec.value!(row)));
    const best = spec.dir === 1 ? Math.max(...values) : Math.min(...values);
    const holders = values.filter((value) => value === best).length;
    return { values, best, winner: holders === 1 ? values.indexOf(best) : -1 };
  }

  function build(rows: Row[]): CompareResult {
    const head = rows
      .map(
        (row) => `<th scope="col">
          <span class="compare-head">
            <a class="font-bold hover:text-accent-ink" href="${esc(labels.paths[row.key] ?? "#")}">${esc(row.name)}</a>
            <span class="inline-flex items-center gap-1.5 text-[0.8rem] font-normal text-muted">${regionMark(
              row.key,
            )}${esc(row.region)}</span>
          </span>
        </th>`,
      )
      .join("");

    const wins = rows.map(() => 0);
    let scored = 0;
    const body: string[] = [];

    for (const spec of specs) {
      if (spec.group) {
        body.push(
          `<tr data-group><th colspan="${rows.length + 1}"><span class="compare-group-label">${esc(spec.group)}</span></th></tr>`,
        );
        continue;
      }
      const { values, best, winner } = measure(rows, spec);
      if (spec.dir && spec.value) scored += 1;
      if (winner >= 0) wins[winner] += 1;
      const cells = rows
        .map((row, index) => {
          const isBest = index === winner;
          const delta =
            best === undefined || values[index] === best
              ? ""
              : signedNum(values[index] - best, spec.digits ?? 0);
          return `<td${isBest ? ' data-best="true"' : ""}>${
            isBest ? `<span class="sr-only">${esc(labels.best)}. </span>` : ""
          }${spec.cell(row, { isBest, delta })}</td>`;
        })
        .join("");
      body.push(
        `<tr><th scope="row">${spec.labelHtml ?? esc(spec.label ?? "")}</th>${cells}</tr>`,
      );
    }

    const table = `<thead><tr><th scope="col"><span class="sr-only">${esc(labels.rows.metric)}</span></th>${head}</tr></thead><tbody>${body.join("")}</tbody>`;

    // La lettura in una riga. Se lo scarto sta dentro le bande, lo diciamo:
    // è il punto su cui questo osservatorio non vuole barare.
    const ranked = rows
      .map((row, index) => ({ row, index, wins: wins[index] }))
      .sort((a, b) => b.row.score.mean - a.row.score.mean);
    const first = ranked[0];
    const second = ranked[1];
    const tie = second && Math.round(first.row.score.mean) === Math.round(second.row.score.mean);
    const close =
      second &&
      !tie &&
      first.row.score.mean - second.row.score.mean <=
        first.row.score.stdDev + second.row.score.stdDev;

    const lead = tie
      ? fill(labels.verdictTie, {
          a: first.row.name,
          b: second.row.name,
          score: num(first.row.score.mean),
        })
      : fill(labels.verdict, {
          name: first.row.name,
          score: num(first.row.score.mean),
          won: first.wins,
          total: scored,
        });

    const verdict = `<span>${esc(lead)}</span>${
      close
        ? `<span class="text-[0.88rem] text-muted">${esc(
            fill(labels.verdictClose, {
              name: second.row.name,
              score: `${num(second.row.score.mean)} ±${num(second.row.score.stdDev)}`,
            }),
          )}</span>`
        : ""
    }`;

    return { table, verdict };
  }

  return build(rows);
}
