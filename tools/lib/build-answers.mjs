import { ENGINES } from "./model.mjs";
import { destinationForms } from "../seed/grammar.mjs";
import { clamp } from "./prng.mjs";

// Le risposte vere e proprie.
//
// Tutto il resto dell'osservatorio MISURA le risposte — quante volte compare
// un nome, in che posizione, quali domini vengono citati — ma non ne mostra
// mai una. Senza questo strato il lettore deve fidarsi dei numeri sulla
// parola, e su un sito che esiste per dire "verificate, non fidatevi" è la
// contraddizione più grossa possibile.
//
// ATTENZIONE: questi testi sono RICOSTRUZIONI, non catture reali. Sono
// costruiti dagli stessi numeri che il resto del dataset pubblica (chi viene
// citato, in che ordine, con quali fonti), quindi non contraddicono nulla, ma
// non sono parole realmente uscite da un modello. Il componente che li
// mostra deve dirlo in modo molto più visibile di quanto si faccia altrove:
// un numero inventato passa, un paragrafo di ChatGPT inventato spacciato per
// vero distrugge la credibilità dell'intero osservatorio in dieci secondi.

const P = (text) => ({ kind: "p", text });
const LIST = (items, ordered = false) => ({ kind: "list", ordered, items });

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// Le note si pescano senza rimessa. Con `pick` puro capitava che due voci di
// fila dello stesso elenco portassero la stessa frase, e in una risposta che
// deve sembrare scritta da un modello due righe identiche si notano subito.
const dealer = (random, items) => {
  const deck = random.shuffle(items);
  let cursor = 0;
  return () => deck[cursor++ % deck.length];
};

// Prompt su cui si mostra la risposta. Tre soli, scelti perché coprono le tre
// domande diverse che questo osservatorio si fa: l'AI il posto lo conosce?
// lo mette in elenco quando si gareggia? e quando si prenota, chi nomina?
export const ANSWER_PROMPTS = [
  { subject: "destination", key: "int-plan-see", level: "internal" },
  { subject: "destination", key: "cmp-dream-best", level: "comparative" },
  { subject: "hotels", key: "int-book-hotels", level: "internal" },
];

// --------------------------------------------------------------- FRAMMENTI

// Righe di commento alle singole tappe. Servono a far sembrare un elenco una
// risposta e non una tabella; variano con il seed per non ripetersi identiche
// su cento destinazioni.
const ENTITY_NOTES = {
  it: [
    "la tappa che quasi nessuno salta.",
    "meglio la prima mattina, prima che arrivino i gruppi.",
    "vale la sosta anche solo per il panorama.",
    "una delle tappe meno affollate, e si sente.",
    "da mettere in conto se resti più di una giornata.",
    "biglietto online consigliato: la fila all'ingresso è lunga quasi tutto l'anno.",
    "un'ora basta, ma è la tappa che resta in mente.",
  ],
  en: [
    "the one stop almost nobody skips.",
    "go first thing in the morning, before the tour groups.",
    "worth the detour for the view alone.",
    "less crowded than the rest, and better for it.",
    "worth planning in if you stay more than a day.",
    "book online: the queue is long for most of the year.",
    "an hour is enough, but it's the part people remember.",
  ],
};

const PEER_NOTES = {
  it: [
    "il motivo per cui ci si va è {what}.",
    "vale il viaggio soprattutto per {what}.",
    "qui il richiamo principale è {what}.",
    "da vedere per {what}.",
  ],
  en: [
    "people go for {what}.",
    "worth the trip mostly for {what}.",
    "the main draw here is {what}.",
    "go for {what}.",
  ],
};

const HOTEL_NOTES = {
  it: [
    "{stars} stelle, zona {area}.",
    "{stars} stelle in zona {area}, comoda per muoversi a piedi.",
    "{stars} stelle, {area}: struttura piccola, si riempie presto.",
  ],
  en: [
    "{stars}-star, {area} area.",
    "{stars}-star in {area}, easy to get around on foot.",
    "{stars}-star, {area}: small property, books up early.",
  ],
};

// Non tutte le strutture verificate hanno una zona: sui territori diffusi
// (una valle, una costa) il campo resta vuoto. Senza questa variante uscirebbe
// "zona null" dentro una risposta che dovrebbe sembrare scritta da un modello.
const HOTEL_NOTES_NO_AREA = {
  it: ["{stars} stelle.", "{stars} stelle, struttura piccola: si riempie presto."],
  en: ["{stars}-star.", "{stars}-star, small property: books up early."],
};

// "a, b e c" invece di "a, b, c": è la differenza fra una risposta e un dump.
const enumerate = (names, lang) => {
  if (names.length <= 1) return names.join("");
  const last = names[names.length - 1];
  return `${names.slice(0, -1).join(", ")} ${lang === "it" ? "e" : "and"} ${last}`;
};

// --------------------------------------------------------------- CITAZIONI

// I domini che l'engine mette in fondo alla risposta. Non sono inventati qui:
// sono gli stessi che la sezione "chi racconta questo territorio" pubblica
// come fonti più citate, ordinati per quota. Se le due liste divergessero, il
// lettore se ne accorgerebbe scorrendo di due sezioni.
function pickCitations(row, engine, { prefer, count }) {
  const pool = row.sourceMix.top ?? [];
  const first = pool.filter((s) => prefer.includes(s.kind));
  const rest = pool.filter((s) => !prefer.includes(s.kind));
  return [...first, ...rest].slice(0, count).map((site, index) => ({
    index: index + 1,
    domain: site.domain,
    kind: site.kind,
    label: site.label,
    synthetic: site.synthetic === true,
  }));
}

// Quante fonti mostra ciascun engine, e se le marca dentro al testo.
// Perplexity cita molto e in linea, ChatGPT quasi mai: è la differenza che
// rende diverse le pagine /engine, e va vista anche qui.
const CITE_STYLE = {
  chatgpt: { count: 2, inline: false },
  gemini: { count: 3, inline: "light" },
  perplexity: { count: 4, inline: "heavy" },
};

const marks = (indexes) =>
  indexes
    .filter((n) => typeof n === "number")
    .map((n) => `[${n}]`)
    .join("");

// ------------------------------------------------------- RISPOSTA INTERNA

function internalAnswer({ row, engine, lang, random, citations }) {
  const forms = destinationForms(row.dest)[lang];
  const entities = row.dest.knownFor;
  const note = dealer(random, ENTITY_NOTES[lang]);
  const days = random.int(2, 3);
  const cited = citations.map((c) => c.index);

  if (engine === "chatgpt") {
    return lang === "it"
      ? [
          P(
            `${cap(forms.in)} servono almeno ${days} giorni per non correre: il centro si gira a piedi, il resto chiede qualche spostamento.`,
          ),
          LIST(
            entities.slice(0, 4).map((name) => ({ label: name, text: note() })),
            true,
          ),
          P(
            `Se hai una giornata sola, tieni ${entities[0]} e ${entities[1]}: il resto richiede tempo e finiresti per vederlo di corsa.`,
          ),
        ]
      : [
          P(
            `Give yourself ${days} days ${forms.in} if you can: the centre works on foot, everything else needs some travel.`,
          ),
          LIST(
            entities.slice(0, 4).map((name) => ({ label: name, text: note() })),
            true,
          ),
          P(
            `With a single day, stick to ${entities[0]} and ${entities[1]} — the rest deserves more time than you'd have.`,
          ),
        ];
  }

  if (engine === "gemini") {
    return lang === "it"
      ? [
          P(`Ecco le principali cose da vedere ${forms.in}. ${marks([cited[0]])}`),
          LIST(entities.slice(0, 5).map((name) => ({ label: name, text: note() }))),
          P(
            `Il periodo migliore per andare ${forms.in} va da aprile a giugno e da settembre a ottobre, quando il clima è mite e l'affluenza più bassa. ${marks(cited.slice(1, 3))}`,
          ),
        ]
      : [
          P(`Here are the main things to see ${forms.in}. ${marks([cited[0]])}`),
          LIST(entities.slice(0, 5).map((name) => ({ label: name, text: note() }))),
          P(
            `The best time to visit is April to June and September to October, when the weather is mild and the crowds thinner. ${marks(cited.slice(1, 3))}`,
          ),
        ];
  }

  return lang === "it"
    ? [
        P(
          `${cap(forms.in)} le tappe principali sono ${entities[0]}, ${entities[1]} e ${entities[2]}.${marks(cited.slice(0, 2))}`,
        ),
        P(
          `${entities[3]} e ${entities[4]} ricevono meno visitatori, ma si raggiungono dal centro senza auto.${marks(cited.slice(2, 3))}`,
        ),
        P(
          `Per una prima visita ${forms.in} bastano ${days} giorni pieni; con uno in più si aggiunge una gita nei dintorni.${marks(cited.slice(3, 4))}`,
        ),
      ]
    : [
        P(
          `The main sights ${forms.in} are ${entities[0]}, ${entities[1]} and ${entities[2]}.${marks(cited.slice(0, 2))}`,
        ),
        P(
          `${entities[3]} and ${entities[4]} see fewer visitors and are reachable from the centre without a car.${marks(cited.slice(2, 3))}`,
        ),
        P(
          `${days} full days are enough for a first visit; one more allows a day trip nearby.${marks(cited.slice(3, 4))}`,
        ),
      ];
}

// --------------------------------------------------- RISPOSTA COMPARATIVA

// L'elenco che l'engine restituisce quando si gareggia. La destinazione entra
// alla posizione che il dataset pubblica, oppure non entra affatto: il caso in
// cui manca è il più utile della pagina, ed è il motivo per cui questa sezione
// non poteva essere un riquadro decorativo.
function comparativeList({ row, peers, engine, lang, mentioned, position }) {
  const others = peers
    .filter((p) => p.dest.key !== row.dest.key)
    .sort((a, b) => b.runs.byEngine[engine].score.mean - a.runs.byEngine[engine].score.mean)
    .slice(0, 6);

  if (!mentioned) return others.slice(0, 5);

  const slot = clamp(Math.round(position) - 1, 0, 4);
  const list = others.slice(0, 4);
  list.splice(slot, 0, row);
  return list.slice(0, 5);
}

function comparativeAnswer({ row, peers, engine, lang, random, citations, mentioned, position }) {
  const subject = row.category.comparativeSubject[lang];
  const list = comparativeList({ row, peers, engine, lang, mentioned, position });
  const cited = citations.map((c) => c.index);
  const noteTemplate = dealer(random, PEER_NOTES[lang]);

  const items = list.map((entry) => ({
    label: entry.dest.name[lang],
    text: noteTemplate().replace("{what}", entry.dest.knownFor[0]),
  }));

  const missing =
    lang === "it"
      ? `Sono le cinque che ricorrono più spesso; l'elenco completo è molto più lungo.`
      : `These are the five that come up most often; the full list is far longer.`;

  if (engine === "chatgpt") {
    return lang === "it"
      ? [
          P(`Difficile ridurre l'Italia a una classifica, ma se dovessi indicare cinque tra ${subject}:`),
          LIST(items, true),
          P(missing),
        ]
      : [
          P(`Hard to reduce Italy to a ranking, but if I had to name five of ${subject}:`),
          LIST(items, true),
          P(missing),
        ];
  }

  if (engine === "gemini") {
    return lang === "it"
      ? [
          P(`Ecco cinque tra ${subject}, in ordine di notorietà. ${marks([cited[0]])}`),
          LIST(items, true),
          P(
            `La scelta dipende molto dal periodo: in alta stagione le prime della lista sono anche le più affollate. ${marks(cited.slice(1, 3))}`,
          ),
        ]
      : [
          P(`Here are five of ${subject}, in order of how widely they're recommended. ${marks([cited[0]])}`),
          LIST(items, true),
          P(
            `Timing matters: in high season the first entries are also the most crowded. ${marks(cited.slice(1, 3))}`,
          ),
        ];
  }

  return lang === "it"
    ? [
        P(`Tra ${subject} vengono citate più spesso:${marks(cited.slice(0, 2))}`),
        LIST(items, true),
        P(
          `Le fonti concordano sulle prime due; sulle altre le classifiche divergono parecchio.${marks(cited.slice(2, 4))}`,
        ),
      ]
    : [
        P(`Among ${subject}, the ones cited most often are:${marks(cited.slice(0, 2))}`),
        LIST(items, true),
        P(
          `Sources agree on the top two; beyond that the rankings diverge considerably.${marks(cited.slice(2, 4))}`,
        ),
      ];
}

// -------------------------------------------------------- RISPOSTA HOTEL

// Quali strutture seguite entrano davvero nella risposta di questo engine.
// Sotto una certa presenza non compaiono: la risposta resta, ma nomina solo
// aggregatori — che è esattamente il problema che l'osservatorio racconta.
function hotelsIn(row, engine) {
  return row.hotels
    .filter((hotel) => hotel.byEngine[engine].presence >= 0.35)
    .sort((a, b) => b.byEngine[engine].score - a.byEngine[engine].score)
    .slice(0, 4);
}

function hotelsAnswer({ row, engine, lang, random, citations, hotels }) {
  const forms = destinationForms(row.dest)[lang];
  const cited = citations.map((c) => c.index);
  const withArea = dealer(random, HOTEL_NOTES[lang]);
  const withoutArea = dealer(random, HOTEL_NOTES_NO_AREA[lang]);
  const note = (hotel) =>
    (hotel.area ? withArea() : withoutArea())
      .replace("{stars}", String(hotel.stars))
      .replace("{area}", hotel.area ?? "");

  // Nessuna struttura seguita entra nella risposta: l'engine se la cava con
  // le pagine di categoria degli aggregatori.
  if (hotels.length === 0) {
    return lang === "it"
      ? [
          P(
            `${cap(forms.in)} l'offerta è ampia e cambia molto per zona e periodo. Per confrontare disponibilità e prezzi aggiornati conviene partire dalle piattaforme di prenotazione.${marks(cited.slice(0, 3))}`,
          ),
          P(
            `Se mi indichi budget, date e zona preferita posso restringere il campo a qualche struttura specifica.`,
          ),
        ]
      : [
          P(
            `There's a wide range ${forms.in}, and it varies a lot by area and season. For up-to-date availability and prices, the booking platforms are the place to start.${marks(cited.slice(0, 3))}`,
          ),
          P(`Tell me your budget, dates and preferred area and I can narrow it down.`),
        ];
  }

  const items = hotels.map((hotel) => ({ label: hotel.name, text: note(hotel) }));

  if (engine === "chatgpt") {
    return lang === "it"
      ? [
          P(
            `${cap(forms.in)} la scelta dipende molto dalla zona in cui vuoi stare. Alcuni indirizzi che ricorrono spesso:`,
          ),
          LIST(items, true),
          P(
            `Nei mesi di punta conviene prenotare con largo anticipo: le strutture piccole si esauriscono per prime.`,
          ),
        ]
      : [
          P(`A lot depends on which area you want to be in ${forms.in}. Names that come up often:`),
          LIST(items, true),
          P(`In peak months book well ahead — the smaller properties go first.`),
        ];
  }

  if (engine === "gemini") {
    return lang === "it"
      ? [
          P(`Ecco alcune strutture ben recensite ${forms.in}. ${marks([cited[0]])}`),
          LIST(items),
          P(
            `Prezzi e disponibilità variano molto con la stagione: conviene verificarli sui canali ufficiali delle strutture. ${marks(cited.slice(1, 3))}`,
          ),
        ]
      : [
          P(`Here are some well-reviewed properties ${forms.in}. ${marks([cited[0]])}`),
          LIST(items),
          P(
            `Rates and availability swing with the season — worth checking the properties' own channels. ${marks(cited.slice(1, 3))}`,
          ),
        ];
  }

  return lang === "it"
    ? [
        P(
          `Le strutture più citate ${forms.in} sono ${enumerate(hotels.map((h) => h.name), "it")}.${marks(cited.slice(0, 3))}`,
        ),
        P(
          `Le valutazioni provengono in larga parte dalle piattaforme di prenotazione, che aggregano recensioni verificate.${marks(cited.slice(3, 4))}`,
        ),
      ]
    : [
        P(
          `The most frequently cited properties ${forms.in} are ${enumerate(hotels.map((h) => h.name), "en")}.${marks(cited.slice(0, 3))}`,
        ),
        P(
          `Ratings come largely from the booking platforms, which aggregate verified reviews.${marks(cited.slice(3, 4))}`,
        ),
      ];
}

// ------------------------------------------------------------ COSTRUZIONE

const dayBefore = (today, days) => {
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
};

export function buildAnswers(row, { peers, random, today }) {
  const out = { destination: [], hotels: [] };
  const promptByKey = new Map(
    [...row.promptResults.comparative, ...row.promptResults.internal].map((p) => [p.key, p]),
  );

  for (const spec of ANSWER_PROMPTS) {
    for (const lang of ["it", "en"]) {
      const prompt = promptByKey.get(`${spec.key}-${lang}`);
      if (!prompt) continue;

      for (const engine of ENGINES) {
        const stat = prompt.byEngine[engine];
        const style = CITE_STYLE[engine];
        const citations = pickCitations(row, engine, {
          // Sugli hotel le fonti sono le OTA, e non per caso: è metà del
          // messaggio commerciale del sito.
          prefer: spec.subject === "hotels" ? ["ota", "editorial"] : ["dmo", "editorial"],
          count: style.count,
        });

        const hotels = spec.subject === "hotels" ? hotelsIn(row, engine) : [];
        // Sul comparativo la soglia è la presenza dichiarata dal dataset: se
        // l'engine cita il posto in meno di una run su due, l'elenco che
        // mostriamo è uno di quelli in cui non c'è.
        const mentioned = spec.subject === "hotels" ? hotels.length > 0 : stat.mentionRate >= 0.5;

        const blocks =
          spec.subject === "hotels"
            ? hotelsAnswer({ row, engine, lang, random, citations, hotels })
            : spec.level === "internal"
              ? internalAnswer({ row, engine, lang, random, citations })
              : comparativeAnswer({
                  row,
                  peers,
                  engine,
                  lang,
                  random,
                  citations,
                  mentioned,
                  position: stat.position,
                });

        // Cosa va evidenziato nel testo: il nome del territorio (o quello
        // delle strutture seguite). È l'unica cosa che il lettore cerca
        // davvero quando apre una risposta.
        const highlights =
          spec.subject === "hotels"
            ? hotels.map((hotel) => hotel.name)
            : [row.dest.name[lang], ...(lang === "it" ? [row.dest.name.en] : [row.dest.name.it])];

        out[spec.subject].push({
          promptKey: prompt.key,
          promptText: prompt.text,
          subject: spec.subject,
          level: spec.level,
          funnel: prompt.funnel,
          lang,
          engine,
          capturedAt: dayBefore(today, random.int(3, 26)),
          run: random.int(1, stat.runs),
          mentioned,
          position: mentioned && spec.subject !== "hotels" ? stat.position : null,
          mentionRate: stat.mentionRate,
          hotelKeys: hotels.map((hotel) => hotel.key),
          highlights: [...new Set(highlights.filter(Boolean))],
          citations: style.inline ? citations : citations.map((c) => ({ ...c, index: null })),
          blocks,
        });
      }
    }
  }

  return out;
}
