// I prompt dell'osservatorio, su tre assi incrociati:
//
//   livello  comparative → la destinazione compete con le altre della categoria
//            internal    → l'AI conosce davvero il territorio dall'interno?
//   funnel   dreaming | planning | booking   (experiencing e sharing fuori scope)
//   lingua   it → domanda interna    en → domanda internazionale
//
// Segnaposto: {subject} = soggetto comparativo della categoria,
//             {destination} = nome della destinazione nella lingua del prompt.

const c = (key, funnel, lang, template) => ({ key, level: "comparative", funnel, lang, template });
const i = (key, funnel, lang, template) => ({ key, level: "internal", funnel, lang, template });

export const PROMPTS = [
  // ============================================================ COMPARATIVE
  // ---- dreaming: il turista sa di venire in Italia, non sa ancora dove
  c("cmp-dream-best-it", "dreaming", "it", "quali sono {subject}?"),
  c("cmp-dream-first-it", "dreaming", "it", "è la prima volta che organizzo un viaggio del genere: dove mi consigli di andare tra {subject}?"),
  c("cmp-dream-under-it", "dreaming", "it", "quali sono le mete meno conosciute tra {subject}?"),
  c("cmp-dream-week-it", "dreaming", "it", "ho una settimana libera e vorrei staccare: dove andare tra {subject}?"),
  c("cmp-dream-best-en", "dreaming", "en", "what are {subject}?"),
  c("cmp-dream-first-en", "dreaming", "en", "first trip of this kind to Italy: where should I go among {subject}?"),
  c("cmp-dream-under-en", "dreaming", "en", "what are the most underrated options among {subject}?"),
  c("cmp-dream-week-en", "dreaming", "en", "I have one week in Italy and want to disconnect: where should I go among {subject}?"),

  // ---- planning: la meta si restringe, entrano vincoli reali
  c("cmp-plan-when-it", "planning", "it", "tra {subject}, dove conviene andare a settembre?"),
  c("cmp-plan-family-it", "planning", "it", "tra {subject}, quali sono le più adatte a una famiglia con bambini piccoli?"),
  c("cmp-plan-nocar-it", "planning", "it", "tra {subject}, dove si arriva bene senza auto?"),
  c("cmp-plan-budget-it", "planning", "it", "tra {subject}, quali sono le più abbordabili per una settimana in due?"),
  c("cmp-plan-crowd-it", "planning", "it", "tra {subject}, quali evitare in alta stagione perché troppo affollate?"),
  c("cmp-plan-when-en", "planning", "en", "among {subject}, where is best to go in September?"),
  c("cmp-plan-family-en", "planning", "en", "among {subject}, which are best for a family with young children?"),
  c("cmp-plan-nocar-en", "planning", "en", "among {subject}, which are easy to reach without a car?"),
  c("cmp-plan-budget-en", "planning", "en", "among {subject}, which are the most affordable for a week for two?"),
  c("cmp-plan-crowd-en", "planning", "en", "among {subject}, which should I avoid in high season because of crowds?"),

  // ---- booking: si sceglie dove dormire, la query ha valore commerciale
  c("cmp-book-where-it", "booking", "it", "tra {subject}, dove conviene dormire come base per girare la zona?"),
  c("cmp-book-value-it", "booking", "it", "tra {subject}, dove si trova il miglior rapporto qualità-prezzo per gli hotel?"),
  c("cmp-book-lux-it", "booking", "it", "tra {subject}, dove ci sono i migliori hotel di lusso?"),
  c("cmp-book-where-en", "booking", "en", "among {subject}, what's the best base to stay and explore the area?"),
  c("cmp-book-value-en", "booking", "en", "among {subject}, where do you find the best value hotels?"),
  c("cmp-book-lux-en", "booking", "en", "among {subject}, where are the best luxury hotels?"),

  // =============================================================== INTERNAL
  // ---- dreaming: l'AI sa raccontare il territorio?
  // I template usano {inDestination} ("sulle Dolomiti") e {theDestination}
  // ("le Dolomiti") invece del nome nudo: vedi tools/seed/grammar.mjs.
  i("int-dream-known-it", "dreaming", "it", "cosa rende speciale una vacanza {inDestination}?"),
  i("int-dream-worth-it", "dreaming", "it", "vale la pena visitare {theDestination}?"),
  i("int-dream-image-it", "dreaming", "it", "come te lo immagini un viaggio {inDestination}?"),
  i("int-dream-known-en", "dreaming", "en", "what makes a trip {inDestination} special?"),
  i("int-dream-worth-en", "dreaming", "en", "is it worth visiting {theDestination}?"),
  i("int-dream-image-en", "dreaming", "en", "what is a trip {inDestination} actually like?"),

  // ---- planning: l'AI conosce le entità concrete del territorio?
  i("int-plan-see-it", "planning", "it", "cosa vedere {inDestination}?"),
  i("int-plan-days-it", "planning", "it", "cosa vedere {inDestination} in 4 giorni?"),
  i("int-plan-eat-it", "planning", "it", "cosa si mangia {inDestination} e dove?"),
  i("int-plan-getthere-it", "planning", "it", "come arrivare e come muoversi {inDestination}?"),
  i("int-plan-season-it", "planning", "it", "qual è il periodo migliore per andare {inDestination}?"),
  i("int-plan-hidden-it", "planning", "it", "cosa vedere {inDestination} lontano dai circuiti turistici?"),
  i("int-plan-see-en", "planning", "en", "what to see {inDestination}?"),
  i("int-plan-days-en", "planning", "en", "4-day itinerary {inDestination}"),
  i("int-plan-eat-en", "planning", "en", "what and where to eat {inDestination}?"),
  i("int-plan-getthere-en", "planning", "en", "how to get around {inDestination}?"),
  i("int-plan-season-en", "planning", "en", "when is the best time to visit {theDestination}?"),
  i("int-plan-hidden-en", "planning", "en", "what to see {inDestination} away from the tourist trail?"),

  // ---- booking: la query che vale una prenotazione
  i("int-book-hotels-it", "booking", "it", "migliori hotel {inDestination}"),
  i("int-book-area-it", "booking", "it", "in quale zona conviene dormire {inDestination}?"),
  i("int-book-view-it", "booking", "it", "hotel con vista {inDestination}"),
  i("int-book-boutique-it", "booking", "it", "hotel piccoli e caratteristici {inDestination}"),
  i("int-book-hotels-en", "booking", "en", "best hotels {inDestination}"),
  i("int-book-area-en", "booking", "en", "best area to stay {inDestination}"),
  i("int-book-view-en", "booking", "en", "hotels with a view {inDestination}"),
  i("int-book-boutique-en", "booking", "en", "small boutique hotels {inDestination}"),
];

// I cinque momenti del viaggio.
//
// `icon` sta qui e non nei template: prima ogni pagina che mostrava gli stadi
// sceglieva le icone per posizione (`["cloud", "route", "key"][index]`), e
// bastava riordinare l'elenco perché il "Booking" si prendesse la nuvola. Il
// colore che li accompagna è in `global.css`, mappato sulla stessa chiave.
export const FUNNEL_STAGES = [
  {
    key: "dreaming",
    icon: "cloud",
    inScope: true,
    name: { it: "Dreaming", en: "Dreaming" },
    lead: {
      it: "Il turista sa di venire in Italia, non sa ancora dove. La destinazione o entra nell'elenco, o non esiste.",
      en: "The traveller knows they're coming to Italy but not where. A destination either makes the list or doesn't exist.",
    },
  },
  {
    key: "planning",
    icon: "route",
    inScope: true,
    name: { it: "Planning", en: "Planning" },
    lead: {
      it: "Date, vincoli, itinerari. Qui l'AI deve conoscere il territorio nel dettaglio, e si vede subito quando non lo conosce.",
      en: "Dates, constraints, itineraries. Here the AI needs real detail, and it shows immediately when it has none.",
    },
  },
  {
    key: "booking",
    icon: "key",
    inScope: true,
    name: { it: "Booking", en: "Booking" },
    lead: {
      it: "Dove dormire. È lo stadio dove una citazione vale una prenotazione, e dove gli hotel entrano in gioco singolarmente.",
      en: "Where to stay. The stage where one mention is worth one booking, and where individual hotels enter the picture.",
    },
  },
  {
    key: "experiencing",
    icon: "suitcase",
    inScope: false,
    name: { it: "Experiencing", en: "Experiencing" },
    lead: {
      it: "Fuori scope: il turista è già arrivato e la decisione di prenotazione è presa.",
      en: "Out of scope: the traveller has arrived and the booking decision is already made.",
    },
  },
  {
    key: "sharing",
    icon: "megaphone",
    inScope: false,
    name: { it: "Sharing", en: "Sharing" },
    lead: {
      it: "Fuori scope: racconto post-viaggio, misurabile sui social più che sugli assistenti AI.",
      en: "Out of scope: post-trip storytelling, better measured on social platforms than on AI assistants.",
    },
  },
];
