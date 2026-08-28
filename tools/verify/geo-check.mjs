// Il controllo che mancava: la struttura sta in Italia, ed è dove diciamo noi?
//
// La sonda costruisce i domini dai toponimi della destinazione — per Roma,
// "Colosseo" più il suffisso "hotel" dà colosseohotel.com. Se quel dominio
// risponde con un titolo che contiene la parola "hotel", finora bastava: la
// struttura entrava nel dataset come hotel di Roma. Ma colosseohotel.com è
// l'Hotel Colosseo & Spa di Shkodër, in Albania.
//
// Il punto è che l'ipotesi e la prova coincidevano. Costruire il dominio dal
// nome del luogo e poi accettarlo perché il nome del luogo è nel dominio non
// verifica niente: conferma solo di aver saputo indovinare una stringa.
//
// Qui si chiedono due prove separate, che vengono dalla pagina e non da noi:
//
//   1. È in Italia?   Partita IVA, prefisso +39, o un indirizzo dichiarato in
//                     Italia nei dati strutturati. La partita IVA in
//                     particolare è obbligatoria sui siti delle imprese
//                     italiane: è il segno più difficile da avere per sbaglio.
//
//   2. È lì?          La pagina nomina la destinazione, la sua regione, uno
//                     dei suoi luoghi noti, oppure un comune della zona.
//
// Senza la prima non entra. Senza la seconda entra solo se la prima è forte,
// perché ci sono hotel italiani veri il cui sito non nomina mai il territorio
// come lo chiamiamo noi.

const normalise = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Paesi e città estere che compaiono nei titoli delle strutture pescate per
// sbaglio.
//
// Si confrontano PAROLE INTERE, non sottostringhe. Con il confronto a
// sottostringa questo elenco cancellava mezza Italia: "usa" dentro Ragusa e
// Chiusaforte, "france" dentro Francesco e Francesca, "francia" dentro
// Franciacorta, "tirol" dentro Südtirol.
//
// E anche a parole intere restano fuori i toponimi che in Italia esistono:
// Rodi (Garganico, in Puglia), Naxos (Giardini Naxos, in Sicilia), Spagna
// (Piazza di Spagna, a Roma). Per quelli non serve un elenco: un albergo greco
// non ha una partita IVA italiana, e la prova dell'Italia li separa da sola.
const FOREIGN = [
  "albania", "shkoder", "shkodra", "tirana", "kroatien", "croazia", "croatia",
  "hrvatska", "greece", "grecia", "griechenland", "rhodes", "kiotari",
  "santorini", "corfu", "cyprus", "cipro", "slovenija", "ljubljana",
  "osterreich", "schweiz", "switzerland", "svizzera", "paris", "espana",
  "spain", "mallorca", "ibiza", "portugal", "portogallo", "deutschland",
  "germany", "germania", "berlin", "munchen", "wien", "budapest", "hungary",
  "ungheria", "praha", "prague", "polska", "poland", "turkiye", "turkey",
  "turchia", "istanbul", "antalya", "konyaalti", "egypt", "egitto", "morocco",
  "marocco", "tunisia", "dubai", "thailand", "vietnam", "heraklion",
  "united", "states", "tacoma", "california", "florida", "texas", "catskills",
  "catskill", "new york", "laguna beach", "canada", "mexico", "messico",
  "brasil", "argentina", "paphos", "sozopol",
].map(normalise);

// Cirillico, greco, thai, cinese, arabo, ebraico: un sito di una struttura
// italiana può essere tradotto, ma il titolo della home in questi alfabeti
// dice che l'originale non è italiano.
const NON_LATIN = /[Ѐ-ӿͰ-Ͽ฀-๿一-鿿؀-ۿ֐-׿]/;

// Un titolo di struttura ricettiva nomina il tipo di struttura. Se non lo fa,
// quel dominio non è un albergo, qualunque cosa risponda: `palazzovictoria.com`
// è una televisione vietnamita di calcio, `bauervenezia.com` un indirizzo IP
// nudo. Nel dataset stavano come strutture di Verona e di Venezia.
/**
 * Titoli che non appartengono a nessuna struttura: un indirizzo IP nudo, un
 * titolo vuoto, un altro alfabeto, o testo a brandelli.
 *
 * NON basta che manchi la parola "hotel": "Borgoscopeto", "La Bandita
 * Townhouse" ed "Eremo della Giubiliana" sono alberghi veri con un nome
 * proprio per titolo, e pretendere la parola-tipo li cancellava. Si scarta
 * solo ciò che è positivamente spazzatura.
 */
export function junkTitle(title) {
  const clean = (title ?? "").trim();
  if (clean.length < 4) return "titolo assente";
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(clean)) return "il titolo è un indirizzo IP";
  if (NON_LATIN.test(clean)) return "il titolo non è in alfabeto latino";
  // Testo sminuzzato: è la firma di una lingua a diacritici a cui la pulizia
  // delle entità HTML ha tolto gli accenti, e non è italiano.
  const shreds = clean.split(/\s+/).filter((w) => w.length <= 2).length;
  if (shreds >= 5) return "il titolo non è testo leggibile";
  return null;
}

export const LODGING_TITLE =
  /\b(hotel|albergo|relais|resort|agriturismo|masseria|locanda|dimora|residence|b&b|bed\s*&?\s*breakfast|camere|suites?|chalet|rifugio|baita|ostello|garni|guest\s*house|country\s*house|boutique|affittacamere|casa|villa|borgo|tenuta|podere|cascina|maso|apartments?|appartament)\b/i;

// Non sono strutture ricettive: agenzie web, domini in vendita, guide di
// viaggio, portali. Rispondono e nominano "hotel", ma non lo sono.
const NOT_A_PROPERTY =
  /\b(dominio premium|premium domain|dominio in vendita|siti web|web agency|realizzazione siti|guide? (?:de )?voyage|guida indipendente|portale turistico|agenzia (?:immobiliare|viaggi)|comparatore|confronta (?:hotel|prezzi))\b/i;

// --- prova 1: è in Italia -----------------------------------------------

const VAT = /\b(?:p(?:artita)?\.?\s*iva|vat(?:\s*(?:no|number|id))?\.?|c\.?f\.?)\s*[:.]?\s*(?:it)?\s*\d{11}\b/i;
const PHONE_IT = /(?:\+|00)\s?39[\s.\-/]?\d[\d\s.\-/]{6,}/;
const SCHEMA_IT = /"addresscountry"\s*:\s*(?:"(?:it|ita|italy|italia)"|\{[^}]*"name"\s*:\s*"(?:it|italy|italia)")/i;
const ADDRESS_IT =
  /\b(?:via|viale|piazza|piazzale|corso|contrada|localit[àa]|strada|vicolo|largo|frazione)\s+[a-zàèéìòù'’.\- ]{3,40},?\s*\d{1,4}[a-z]?\b/i;
const CAP = /\b\d{5}\b\s*[-–,]?\s*[a-zàèéìòù'’\- ]{3,30}\s*\(\s*[a-z]{2}\s*\)/i;

// La lingua della pagina.
//
// Serve perché nessun elenco di paesi esteri sarà mai completo: "Catskills" al
// plurale c'era, "Catskill" al singolare no, e un resort dello stato di New
// York è rimasto fra gli hotel di Roma. Invece di rincorrere il mondo parola
// per parola si guarda dall'altra parte — un albergo italiano il suo sito lo
// scrive in italiano.
//
// Parole di servizio, non nomi: "hotel" e "spa" sono uguali in mezza Europa,
// "prenota" e "colazione" no.
const ITALIAN_WORDS = [
  "della", "degli", "nostro", "nostra", "camere", "prenota", "soggiorno",
  "colazione", "ristorante", "dove siamo", "contatti", "servizi", "ospiti",
  "disponibilit", "offerte", "struttura", "cucina", "piscina", "vacanza",
  "cookie", "informativa", "privacy e", "scopri", "tariffe", "notte",
];

function italianLanguage(text) {
  const lower = text.toLowerCase();
  return ITALIAN_WORDS.filter((w) => lower.includes(w)).length;
}

/**
 * Quanto la pagina prova di stare in Italia.
 * La partita IVA vale doppio: è un obbligo di legge per le imprese italiane e
 * non capita per caso sul sito di un albergo albanese.
 */
export function italyEvidence(text) {
  const found = [];
  if (VAT.test(text)) found.push("partita-iva");
  if (SCHEMA_IT.test(text)) found.push("schema-it");
  if (PHONE_IT.test(text)) found.push("telefono-+39");
  if (CAP.test(text)) found.push("cap-provincia");
  if (ADDRESS_IT.test(text)) found.push("indirizzo");
  // Sei parole di servizio italiane su un sito non capitano per caso. Da sola
  // la lingua non prova il luogo, e infatti resta un indizio debole: dice che
  // il sito è italiano, non che l'albergo sia in questo territorio.
  const italianWords = italianLanguage(text);
  if (italianWords >= 6) found.push(`in italiano (${italianWords})`);
  const strong = found.includes("partita-iva") || found.includes("schema-it");
  return { found, italianWords, score: (strong ? 2 : 0) + found.length, strong };
}

// Parole che compaiono nel nome di mezza ricettività italiana. Trovarle su una
// pagina non dice dove sta la struttura, dice che è una struttura.
const GENERIC = new Set([
  "hotel", "albergo", "resort", "villa", "casa", "borgo", "palazzo", "corte",
  "torre", "castello", "marina", "porto", "monte", "valle", "lago", "isola",
  "parco", "bella", "belle", "santa", "santo", "sant", "nuova", "nuovo",
  "antica", "antico", "grand", "grande", "città", "citta", "riviera", "costa",
  "terme", "spa", "suites", "rooms", "camere", "dimora", "relais", "centro",
  "nazionale", "italia", "italy", "vino", "strada",
]);

/**
 * Parole di luogo con cui una pagina può dichiarare di stare in questo
 * territorio: il nome della destinazione, la regione, i suoi luoghi noti.
 */
export function placeWords(destination) {
  const words = new Set();
  const add = (value) => {
    for (const part of normalise(value ?? "").split(" ")) {
      if (part.length >= 4 && !GENERIC.has(part)) words.add(part);
    }
  };
  add(destination.name?.it);
  add(destination.name?.en);
  add(destination.region);
  for (const entity of destination.knownFor ?? []) add(entity);
  return [...words];
}

/**
 * La prova che la struttura stia in questo territorio non può venire dal suo
 * stesso nome.
 *
 * È l'errore che ha fatto entrare l'Hotel Marina di Sestri Levante fra gli
 * hotel di Ischia: "marina" è nel nome dell'albergo, quindi la pagina lo dice
 * per forza, e il controllo si compiaceva di ritrovarcelo. Le parole già
 * contenute nel nome o nel dominio del candidato vanno sottratte prima di
 * cercarle: quello che resta è l'unica prova che vale.
 */
export function placeEvidence(text, destination, candidate = {}) {
  const own = normalise(`${candidate.name ?? ""} ${candidate.domain ?? ""}`);
  const haystack = normalise(text);
  const usable = placeWords(destination).filter((w) => !own.includes(w));
  const matched = usable.filter((w) => haystack.includes(w));
  return { matched, usable, ok: matched.length > 0 };
}

export function foreignEvidence(title) {
  // A parole intere. Il titolo si spezza e si confronta token per token: è la
  // differenza fra riconoscere la Francia e cancellare Francesco.
  const tokens = new Set(normalise(title).split(" "));
  const hits = FOREIGN.filter((f) => f.split(" ").every((part) => tokens.has(part)));
  return { hits, nonLatin: NON_LATIN.test(title), ok: hits.length === 0 && !NON_LATIN.test(title) };
}

/**
 * Il verdetto su una struttura candidata.
 *
 *   fuori-italia    la pagina dichiara un altro paese
 *   non-struttura   risponde ma non è un'attività ricettiva
 *   non-provata     non dichiara niente: né il paese né il luogo
 *   fuori-zona      è in Italia, ma niente la lega a questa destinazione
 *   verificato      è in Italia ed è qui
 */
export function verdictFor({ title = "", body = "", destination, candidate = {} }) {
  const text = `${title} ${body}`;

  if (NOT_A_PROPERTY.test(title)) {
    return { verdict: "non-struttura", why: "non è una struttura ricettiva" };
  }

  const junk = junkTitle(title);
  if (junk) return { verdict: "non-struttura", why: junk };

  const foreign = foreignEvidence(title);
  if (foreign.nonLatin) {
    return {
      verdict: "fuori-italia",
      why: "il titolo non è in alfabeto latino: il sito non è italiano",
    };
  }

  // La prova positiva viene prima dell'elenco dei paesi: è più affidabile.
  // Una struttura italiana lo dimostra da sé — partita IVA, +39, un CAP con la
  // sigla della provincia — e non ha bisogno che indoviniamo cosa non è.
  const italy = italyEvidence(text);

  if (foreign.hits.length && !italy.strong) {
    return { verdict: "fuori-italia", why: `il titolo dichiara ${foreign.hits.join(", ")}` };
  }

  if (!italy.found.length) {
    // Non è la stessa cosa di "dichiara un altro paese": qui la pagina non
    // dice niente. Su una struttura scoperta indovinando il dominio è motivo
    // di scarto; su una che viene da un registro pubblico no, e chi chiama
    // decide in base alla provenienza.
    return { verdict: "non-provata", why: "la pagina non prova né il paese né il luogo" };
  }

  const place = placeEvidence(text, destination, { name: candidate.name ?? title, domain: candidate.domain });
  if (!place.ok) {
    return {
      verdict: "fuori-zona",
      why: `in Italia (${italy.found.join(", ")}) ma la pagina non nomina ${destination.name?.it ?? destination.key}`,
    };
  }

  return {
    verdict: "verificato",
    why: `in Italia (${italy.found.join(", ")}), nomina ${place.matched.slice(0, 3).join(", ")}`,
  };
}

// --- prova 3: la pagina nomina un ALTRO territorio ------------------------
//
// "Fuori zona" da solo non basta per cancellare una riga: un albergo vero può
// semplicemente non chiamare il proprio territorio come lo chiamiamo noi, e
// buttarlo sarebbe sostituire un errore con un altro. Ma se il titolo nomina
// un territorio diverso — "Villa Ducale, Taormina" archiviata sotto Venezia —
// l'assegnazione è sbagliata e si può dire con certezza.
//
// Si confrontano solo i nomi dei territori e delle regioni, non i luoghi noti:
// fra i luoghi noti ci sono "Viale dei Cipressi" e "Sentiero degli Dei", e
// "viale" archiviato come toponimo esclusivo di Bolgheri cancellava Riccione.
const AMBIGUOUS = new Set([
  "riviera", "costa", "valle", "isola", "monte", "parco", "lago", "terre",
  "porto", "citta", "nazionale", "alto", "adige", "strada", "vino", "delta",
  "golfo", "alta", "delle", "della", "santa", "santo", "grande", "piccolo",
]);

export function buildGazetteer(destinations) {
  const owners = {};
  for (const destination of destinations) {
    const words = new Set();
    for (const source of [destination.name?.it, destination.name?.en, destination.region]) {
      for (const word of normalise(source ?? "").split(" ")) {
        if (word.length >= 5 && !AMBIGUOUS.has(word)) words.add(word);
      }
    }
    for (const word of words) (owners[word] ??= new Set()).add(destination.key);
  }
  // Solo le parole che appartengono a un territorio solo: "sardegna" la
  // rivendicano in quattro, e non prova niente.
  return Object.fromEntries(
    Object.entries(owners)
      .filter(([, keys]) => keys.size === 1)
      .map(([word, keys]) => [word, [...keys][0]]),
  );
}

export function namesAnotherPlace(row, gazetteer) {
  const own = normalise(`${row.name ?? ""} ${row.domain ?? ""}`);
  const tokens = new Set(normalise(row.title ?? "").split(" "));
  const hits = [...tokens].filter(
    (t) => gazetteer[t] && gazetteer[t] !== row.destination && !own.includes(t),
  );
  return hits.length ? { ok: true, elsewhere: gazetteer[hits[0]], words: hits } : { ok: false };
}
