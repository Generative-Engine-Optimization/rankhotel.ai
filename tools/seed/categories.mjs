// Le 5 categorie di confronto dell'osservatorio.
// L'ordine qui è l'ordine in cui compaiono ovunque nella UI.
export const CATEGORIES = [
  {
    key: "mare",
    slug: { it: "mare", en: "sea" },
    name: { it: "Turismo mare", en: "Seaside tourism" },
    short: { it: "Mare", en: "Sea" },
    icon: "wave",
    lead: {
      it: "Coste, isole e riviere. È la parte più affollata del turismo italiano, e quella dove l'AI ha più nomi fra cui scegliere: entrarci è più difficile che altrove.",
      en: "Coasts, islands and rivieras. The most crowded part of Italian tourism, and the one where AI has the most names to choose from: getting in is harder here than anywhere else.",
    },
    comparativeSubject: {
      it: "le zone di mare più belle in Italia",
      en: "the best seaside areas in Italy",
    },
  },
  {
    key: "montagna-parchi",
    slug: { it: "montagna-parchi", en: "mountains-parks" },
    name: { it: "Turismo montagna e parchi naturali", en: "Mountains and natural parks" },
    short: { it: "Montagna e parchi", en: "Mountains & parks" },
    icon: "peak",
    lead: {
      it: "Alpi, Appennini e parchi nazionali. Due stagioni invece di una, e una gara dominata da pochi nomi molto forti che l'AI ripete sempre.",
      en: "Alps, Apennines and national parks. Two seasons instead of one, and a race dominated by a handful of very strong names the AI keeps repeating.",
    },
    comparativeSubject: {
      it: "le zone turistiche montane più belle in Italia",
      en: "the most beautiful mountain destinations in Italy",
    },
  },
  {
    key: "enogastronomia",
    slug: { it: "enogastronomia", en: "food-and-wine" },
    name: { it: "Turismo enogastronomico", en: "Food and wine tourism" },
    short: { it: "Enogastronomia", en: "Food & wine" },
    icon: "glass",
    lead: {
      it: "Territori del vino e della tavola. Poche persone li cercano, ma chi lo fa ha quasi già deciso di partire: qui una citazione vale più che altrove.",
      en: "Wine and food territories. Few people search for them, but those who do have all but decided to go: a mention is worth more here than elsewhere.",
    },
    comparativeSubject: {
      it: "le migliori zone per il turismo enogastronomico in Italia",
      en: "the best food and wine regions in Italy",
    },
  },
  {
    key: "unesco",
    slug: { it: "unesco", en: "unesco" },
    name: { it: "Turismo patrimoni UNESCO", en: "UNESCO heritage tourism" },
    short: { it: "UNESCO", en: "UNESCO" },
    icon: "column",
    lead: {
      it: "I sessanta siti italiani nella lista del patrimonio mondiale. È la categoria dove l'AI è più sicura di sé, e anche quella dove sbaglia di meno.",
      en: "Italy's sixty World Heritage sites. The category where AI is most confident, and also the one where it gets things wrong least often.",
    },
    comparativeSubject: {
      it: "i patrimoni UNESCO più belli da visitare in Italia",
      en: "the best UNESCO World Heritage sites to visit in Italy",
    },
  },
  {
    key: "borghi",
    slug: { it: "borghi", en: "villages" },
    name: { it: "Turismo borghi più belli d'Italia", en: "Italy's most beautiful villages" },
    short: { it: "Borghi", en: "Villages" },
    icon: "house",
    lead: {
      it: "Piccoli centri con pochi posti letto. È qui che essere nominati da un'AI sposta davvero il conto di fine mese: bastano poche persone in più.",
      en: "Small towns with few beds. This is where being named by an AI genuinely changes the month's takings: a few more people is all it takes.",
    },
    comparativeSubject: {
      it: "i borghi più belli d'Italia da visitare",
      en: "the most beautiful villages in Italy to visit",
    },
  },
];

// Tag secondari: una destinazione ha una categoria primaria (dove entra in
// classifica) e quanti tag vuole (categorie secondarie + tematici).
// I temi sono l'unico modo per attraversare le categorie: una destinazione
// entra in classifica in una categoria sola, ma somiglia ad altre per ragioni
// che la categoria non cattura. Ogni tema ha un'icona e una spiegazione, così
// la pagina del tema dice perché quei territori stanno insieme.
export const TAGS = [
  // --- le cinque categorie valgono anche come tema
  { key: "mare", slug: { it: "mare", en: "sea" }, icon: "wave", name: { it: "Mare", en: "Sea" },
    lead: { it: "Coste, isole e riviere.", en: "Coasts, islands and rivieras." } },
  { key: "montagna-parchi", slug: { it: "montagna-parchi", en: "mountains-parks" }, icon: "peak", name: { it: "Montagna e parchi", en: "Mountains & parks" },
    lead: { it: "Alpi, Appennini e aree protette.", en: "Alps, Apennines and protected areas." } },
  { key: "enogastronomia", slug: { it: "enogastronomia", en: "food-and-wine" }, icon: "glass", name: { it: "Enogastronomia", en: "Food & wine" },
    lead: { it: "Territori del vino e della tavola.", en: "Wine and food territories." } },
  { key: "unesco", slug: { it: "unesco", en: "unesco" }, icon: "column", name: { it: "UNESCO", en: "UNESCO" },
    lead: { it: "Nella lista del patrimonio mondiale.", en: "On the World Heritage list." } },
  { key: "borghi", slug: { it: "borghi", en: "villages" }, icon: "house", name: { it: "Borghi", en: "Villages" },
    lead: { it: "Piccoli centri con pochi posti letto.", en: "Small towns with few beds." } },

  // --- come ci si va e con chi
  { key: "luxury", slug: { it: "lusso", en: "luxury" }, icon: "key", name: { it: "Lusso", en: "Luxury" },
    lead: { it: "Dove l'offerta alberghiera è di fascia alta.", en: "Where the hotel offer sits at the top end." } },
  { key: "family", slug: { it: "famiglie", en: "family" }, icon: "house", name: { it: "Famiglie", en: "Family" },
    lead: { it: "Adatti a chi viaggia con bambini.", en: "Suited to travelling with children." } },
  { key: "romantico", slug: { it: "coppia", en: "couples" }, icon: "spa", name: { it: "In coppia", en: "For couples" },
    lead: { it: "Le mete che l'AI propone per due.", en: "The places AI suggests for two." } },
  { key: "slow", slug: { it: "slow-travel", en: "slow-travel" }, icon: "route", name: { it: "Slow travel", en: "Slow travel" },
    lead: { it: "Da attraversare senza fretta.", en: "To cross without hurrying." } },

  // --- che cosa ci si fa
  { key: "outdoor", slug: { it: "outdoor", en: "outdoor" }, icon: "peak", name: { it: "Outdoor", en: "Outdoor" },
    lead: { it: "Si sta fuori più che dentro.", en: "More time outside than in." } },
  { key: "trekking", slug: { it: "cammini", en: "hiking" }, icon: "route", name: { it: "Cammini e sentieri", en: "Trails and hikes" },
    lead: { it: "Territori che si girano a piedi.", en: "Territories you cross on foot." } },
  { key: "neve", slug: { it: "neve", en: "snow" }, icon: "ski", name: { it: "Neve", en: "Snow" },
    lead: { it: "Stagione invernale e impianti.", en: "Winter season and lifts." } },
  { key: "spiagge", slug: { it: "spiagge", en: "beaches" }, icon: "wave", name: { it: "Spiagge", en: "Beaches" },
    lead: { it: "Si va soprattutto per il mare.", en: "You go mainly for the sea." } },
  { key: "wellness", slug: { it: "benessere", en: "wellness" }, icon: "spa", name: { it: "Benessere", en: "Wellness" },
    lead: { it: "Terme e acque che curano.", en: "Thermal springs and healing waters." } },
  { key: "vino", slug: { it: "vino", en: "wine" }, icon: "vine", name: { it: "Vino", en: "Wine" },
    lead: { it: "Denominazioni e cantine da visitare.", en: "Appellations and cellars to visit." } },

  // --- che cosa si vede
  { key: "archeologia", slug: { it: "archeologia", en: "archaeology" }, icon: "ruins", name: { it: "Archeologia", en: "Archaeology" },
    lead: { it: "Scavi, templi, città antiche.", en: "Excavations, temples, ancient cities." } },
  { key: "citta-arte", slug: { it: "citta-d-arte", en: "art-cities" }, icon: "column", name: { it: "Città d'arte", en: "Art cities" },
    lead: { it: "Musei, chiese, centri storici monumentali.", en: "Museums, churches, monumental centres." } },
  { key: "natura", slug: { it: "natura", en: "nature" }, icon: "forest", name: { it: "Natura", en: "Nature" },
    lead: { it: "Parchi, riserve, foreste.", en: "Parks, reserves, forests." } },
  { key: "panorami", slug: { it: "panorami", en: "views" }, icon: "cliff", name: { it: "Panorami", en: "Views" },
    lead: { it: "Territori che si guardano dall'alto.", en: "Territories you look at from above." } },
  { key: "isole", slug: { it: "isole", en: "islands" }, icon: "island", name: { it: "Isole", en: "Islands" },
    lead: { it: "Ci si arriva via mare.", en: "You get there by sea." } },
  { key: "lago", slug: { it: "laghi", en: "lakes" }, icon: "lake", name: { it: "Laghi", en: "Lakes" },
    lead: { it: "Acqua dolce, non salata.", en: "Fresh water, not salt." } },

  // --- quanto sono affollati: il tema che il turismo italiano non dichiara mai
  { key: "molto-visitato", slug: { it: "molto-visitati", en: "busiest" }, icon: "chart", name: { it: "Molto visitati", en: "Busiest" },
    lead: { it: "Sopra i cinque milioni di visitatori stimati l'anno.", en: "Above five million estimated visitors a year." } },
  { key: "poco-affollato", slug: { it: "poco-affollati", en: "quietest" }, icon: "compass", name: { it: "Poco affollati", en: "Quietest" },
    lead: { it: "Sotto il mezzo milione di visitatori stimati l'anno.", en: "Below half a million estimated visitors a year." } },
];
