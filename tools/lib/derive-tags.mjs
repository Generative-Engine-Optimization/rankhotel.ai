// I temi non si assegnano a mano su cento destinazioni: si derivano da prove
// che stanno già nel dato. Un tema attribuito per intuizione è un tema che
// nessuno può contestare, e un osservatorio non dovrebbe averne.
//
// Ogni regola dichiara su cosa si basa. Le entità sono la prova più forte,
// perché sono nomi di luoghi reali censiti a mano.

const MATCH = (entities, name, patterns) => {
  const haystack = [name, ...entities].join(" ").toLowerCase();
  return patterns.some((p) => haystack.includes(p));
};

export function deriveTags(dest) {
  const tags = new Set(dest.tags);
  const e = dest.knownFor;
  const n = dest.name.it;

  // --- prove testuali dalle entità censite
  if (MATCH(e, n, ["isola", "isole", "arcipelago", "capri", "eolie", "tremiti", "elba"]))
    tags.add("isole");
  const lakeHits = e.filter((x) => /lago|laghi/i.test(x)).length;
  if (/lago|laghi|como|garda|iseo|orta/i.test(n) || lakeHits >= 2) tags.add("lago");
  if (MATCH(e, n, ["scavi", "tempio", "templi", "foro romano", "villa romana", "necropoli", "mosaici", "anfiteatro", "grotta di tiberio", "ipogeo", "basilica di aquileia"]))
    tags.add("archeologia");
  if (MATCH(e, n, ["sentiero", "cammino", "gola", "gole", "cima", "monte ", "passo ", "via cava", "vie cave", "ferrata"]))
    tags.add("trekking");
  if (MATCH(e, n, ["passo ", "ghiacciaio", "piste", "funivia", "plan de corones", "sellaronda", "marmolada", "cervino", "monte bianco"]))
    tags.add("neve");
  if (MATCH(e, n, ["terme", "bagni ", "bagno vignoni", "saturnia", "poseidon"])) tags.add("wellness");
  if (MATCH(e, n, ["parco", "riserva", "foresta", "bosco", "oasi"])) tags.add("natura");
  if (MATCH(e, n, ["belvedere", "seceda", "vista", "scala dei turchi", "faraglioni", "rocche", "calanchi", "monte solaro"]))
    tags.add("panorami");
  if (MATCH(e, n, ["spiaggia", "cala ", "baia", "marina", "lungomare", "costa "])) tags.add("spiagge");
  if (MATCH(e, n, ["museo", "musei", "galleria", "pinacoteca", "duomo", "basilica", "cattedrale", "palazzo ducale", "certosa", "battistero", "teatro antico", "uffizi", "pantheon", "colosseo", "affreschi", "cappella"]))
    tags.add("citta-arte");

  // --- prove dalla categoria
  if (dest.category === "mare") {
    tags.add("spiagge");
    tags.add("mare");
  }
  if (dest.category === "montagna-parchi") {
    tags.add("outdoor");
    tags.add("natura");
    tags.add("montagna-parchi");
  }
  if (dest.category === "enogastronomia") {
    tags.add("vino");
    tags.add("enogastronomia");
  }
  if (dest.category === "unesco") tags.add("unesco");
  if (dest.category === "borghi") {
    tags.add("borghi");
    tags.add("slow");
  }

  // --- prove dalle coordinate: sopra il 45° parallelo e in categoria montagna
  //     la stagione della neve esiste davvero
  if (dest.lat > 45.4 && dest.category === "montagna-parchi") tags.add("neve");

  // --- prove dai visitatori stimati: quanto è affollato è un tema che il
  //     turismo italiano non dichiara mai, e che a chi sceglie interessa
  if (dest.visitors >= 5000) tags.add("molto-visitato");
  if (dest.visitors <= 500) tags.add("poco-affollato");

  // --- il lusso lo dichiara chi lo ha già in lista; il romantico si deduce da
  //     lusso + piccole dimensioni, che è il profilo che le AI propongono per due
  if (tags.has("luxury") && dest.visitors < 3000) tags.add("romantico");
  if (tags.has("borghi") && tags.has("lago")) tags.add("romantico");

  // Una destinazione senza temi secondari non esiste: se le regole non hanno
  // prodotto nulla oltre alla categoria, il dato è incompleto e va guardato.
  return [...tags].sort();
}
