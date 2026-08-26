// Articoli e preposizioni per ogni destinazione.
//
// Senza questa tabella i prompt generati suonerebbero "cosa vedere a Dolomiti"
// invece di "cosa vedere sulle Dolomiti": su un sito che pubblica i prompt
// letteralmente, la grammatica sbagliata distrugge la credibilità del dato.
//
// Formato: key -> [articolo IT, preposizione IT, articolo EN]
// Default per chi non compare qui: ["", "a", ""].

const G = {
  // ------ mare
  "costiera-amalfitana": ["la", "in", "the"],
  salento: ["il", "nel", ""],
  "cinque-terre": ["le", "alle", "the"],
  "costa-smeralda": ["la", "in", "the"],
  "isola-elba": ["l'", "all'", ""],
  gargano: ["il", "sul", "the"],
  "riviera-romagnola": ["la", "in", "the"],
  "golfo-orosei": ["il", "nel", "the"],
  "riviera-ponente": ["la", "in", "the"],
  "isole-eolie": ["le", "alle", "the"],
  versilia: ["la", "in", "the"],
  "riviera-conero": ["la", "sulla", "the"],
  "costa-molisana": ["la", "sulla", "the"],
  "isole-tremiti": ["le", "alle", "the"],
  "sud-sardegna": ["la", "nella", "the"],
  cilento: ["il", "nel", "the"],
  trapanese: ["", "a", "the"],
  // ------ montagna e parchi
  dolomiti: ["le", "sulle", "the"],
  "alta-badia": ["l'", "in", ""],
  "val-gardena": ["la", "in", ""],
  "gran-paradiso": ["il", "nel", "the"],
  "parco-abruzzo": ["il", "nel", "the"],
  "gran-sasso": ["il", "sul", "the"],
  stelvio: ["il", "nel", "the"],
  "val-di-fassa": ["la", "in", ""],
  sila: ["la", "in", "the"],
  pollino: ["il", "nel", "the"],
  sibillini: ["i", "sui", "the"],
  "val-pusteria": ["la", "in", ""],
  "alpe-siusi": ["l'", "sull'", "the"],
  casentino: ["le", "nelle", "the"],
  etna: ["l'", "sull'", ""],
  cervinia: ["", "a", ""],
  courmayeur: ["", "a", ""],
  // ------ enogastronomia
  langhe: ["le", "nelle", "the"],
  chianti: ["il", "nel", ""],
  franciacorta: ["la", "in", ""],
  valpolicella: ["la", "in", "the"],
  "strada-vino-alto-adige": ["la", "sulla", "the"],
  collio: ["il", "nel", "the"],
  "etna-doc": ["l'", "sull'", "the"],
  vulture: ["il", "nel", "the"],
  monferrato: ["il", "nel", "the"],
  roero: ["il", "nel", "the"],
  maremma: ["la", "in", "the"],
  "primitivo-manduria": ["le", "nelle", "the"],
  irpinia: ["l'", "in", ""],
  // ------ unesco
  "val-orcia": ["la", "in", "the"],
  "val-di-noto": ["il", "nel", "the"],
  agrigento: ["la", "nella", "the"],
  "sacri-monti": ["i", "sui", "the"],
  aquileia: ["", "ad", ""],
  assisi: ["", "ad", ""],
  alberobello: ["", "ad", ""],
  "ferrara-delta-po": ["", "a", "the"],
  "pompei-ercolano": ["", "a", ""],
  // ------ borghi
  orvieto: ["", "ad", ""],
  erice: ["", "ad", ""],
  apricale: ["", "ad", ""],
  ostuni: ["", "ad", ""],
  varenna: ["", "a", ""],
};

export function grammarFor(key) {
  const [article, prep, articleEn] = G[key] ?? ["", "a", ""];
  return { article, prep, articleEn };
}

// Le tre forme usate nei template dei prompt.
export function destinationForms(dest) {
  const g = grammarFor(dest.key);
  const it = dest.name.it;
  const en = dest.name.en;
  const join = (art, name) => (art.endsWith("'") ? `${art}${name}` : art ? `${art} ${name}` : name);
  return {
    it: {
      bare: it,
      the: join(g.article, it),
      in: g.prep.endsWith("'") ? `${g.prep}${it}` : `${g.prep} ${it}`,
    },
    en: {
      bare: en,
      the: join(g.articleEn, en),
      in: g.articleEn ? `in ${g.articleEn} ${en}` : `in ${en}`,
    },
  };
}
