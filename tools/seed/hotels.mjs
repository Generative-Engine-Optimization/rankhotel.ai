// Hotel tracciati: 20 per destinazione.
//
// REAL_HOTELS conserva gli hotel reali già presenti nell'osservatorio a città
// (Roma, Firenze, Venezia, Napoli, Verona). Per tutte le altre destinazioni i
// nomi sono generati da pattern italiani verosimili con toponimi reali della
// zona: sono strutture dimostrative, non alberghi esistenti, e portano
// `synthetic: true`.

export const REAL_HOTELS = {
  roma: [
    ["Hotel de Russie", "Piazza del Popolo", 5, "roccofortehotels.com"],
    ["Hotel Hassler Roma", "Trinità dei Monti", 5, "hotelhasslerroma.com"],
    ["Hotel Eden", "Via Veneto", 5, "dorchestercollection.com"],
    ["The St. Regis Rome", "Repubblica", 5, "marriott.com"],
    ["Palazzo Manfredi", "Colosseo", 5, "palazzomanfredi.com"],
    ["Hotel Artemide", "Via Nazionale", 4, "hotelartemide.it"],
    ["Singer Palace Hotel", "Via del Corso", 5, "singerpalacehotel.com"],
    ["Hotel Locarno", "Flaminio", 4, "hotellocarno.com"],
  ],
  firenze: [
    ["Four Seasons Hotel Firenze", "Sant'Ambrogio", 5, "fourseasons.com"],
    ["Portrait Firenze", "Ponte Vecchio", 5, "lungarnocollection.com"],
    ["Hotel Savoy", "Piazza della Repubblica", 5, "roccofortehotels.com"],
    ["The St. Regis Florence", "Lungarno", 5, "marriott.com"],
    ["Hotel Davanzati", "Centro storico", 3, "hoteldavanzati.it"],
    ["Hotel Lungarno", "Lungarno", 5, "lungarnocollection.com"],
    ["Palazzo Vecchietti", "Centro storico", 5, "palazzovecchietti.com"],
    ["Hotel Calimala", "Mercato Nuovo", 4, "hotelcalimala.com"],
  ],
  venezia: [
    ["The Gritti Palace", "San Marco", 5, "marriott.com"],
    ["Aman Venice", "Canal Grande", 5, "aman.com"],
    ["Hotel Danieli", "Riva degli Schiavoni", 5, "marriott.com"],
    ["Ca' Sagredo Hotel", "Cannaregio", 5, "casagredohotel.com"],
    ["Hotel Ai Reali", "Castello", 4, "hotelaireali.com"],
    ["Belmond Hotel Cipriani", "Giudecca", 5, "belmond.com"],
    ["Ca' di Dio", "Castello", 5, "vretreats.com"],
    ["Hotel Antiche Figure", "Santa Croce", 3, "antichefigure.it"],
  ],
  napoli: [
    ["Grand Hotel Vesuvio", "Lungomare", 5, "vesuvio.it"],
    ["Romeo Hotel", "Porto", 5, "romeohotel.it"],
    ["Grand Hotel Parker's", "Corso Vittorio Emanuele", 5, "grandhotelparkers.it"],
    ["Eurostars Hotel Excelsior", "Lungomare", 5, "eurostarshotels.com"],
    ["Renaissance Naples Hotel Mediterraneo", "Porto", 4, "marriott.com"],
    ["Britannique Napoli", "Corso Vittorio Emanuele", 4, "hotelbritannique.it"],
    ["Palazzo Caracciolo Napoli", "Centro storico", 4, "accor.com"],
    ["Hotel Piazza Bellini", "Centro storico", 4, "hotelpiazzabellini.com"],
  ],
  verona: [
    ["Due Torri Hotel", "Centro storico", 5, "duetorrihotels.com"],
    ["Palazzo Victoria", "Corso Porta Borsari", 5, "palazzovictoria.com"],
    ["Hotel Gabbia d'Oro", "Centro storico", 4, "hotelgabbiadoro.it"],
    ["Hotel Accademia", "Via Scala", 4, "hotelaccademiaverona.it"],
    ["Byblos Art Hotel Villa Amistà", "Corrubbio", 5, "byblosarthotel.com"],
    ["Hotel Milano & SPA", "Arena", 4, "hotelmilano-vr.it"],
    ["Hotel Indigo Verona Grand Hotel Arti", "Centro storico", 4, "ihg.com"],
    ["Escalus Luxury Suites", "Centro storico", 4, "escalusverona.it"],
  ],
};

// Vocabolario per la generazione. Il prefisso è scelto in base alla categoria
// della destinazione: un "Rifugio" in Costiera Amalfitana stonerebbe.
export const PREFIXES = {
  mare: ["Hotel", "Grand Hotel", "Resort", "Hotel Villa", "Residenza", "Albergo", "Park Hotel", "Hotel Marina"],
  "montagna-parchi": ["Hotel", "Alpine Hotel", "Chalet", "Baita", "Rifugio", "Berghotel", "Hotel Garni", "Residence"],
  enogastronomia: ["Relais", "Tenuta", "Agriturismo", "Locanda", "Villa", "Cascina", "Borgo", "Hotel"],
  unesco: ["Hotel", "Palazzo", "Grand Hotel", "Residenza", "Antica Dimora", "Hotel Villa", "Boutique Hotel", "Albergo"],
  borghi: ["Locanda", "Albergo Diffuso", "Antica Locanda", "Residenza", "Casa", "Dimora", "Hotel", "Corte"],
};

// Qualificatori per categoria: "degli Ulivi" in Val Pusteria o "delle Piste"
// in Costiera Amalfitana suonerebbero falsi, e il dataset perderebbe credibilità.
export const QUALIFIERS = {
  mare: ["Belvedere", "sul Mare", "delle Sirene", "del Golfo", "Le Terrazze", "La Conchiglia", "Marina Grande", "degli Ulivi", "Riva Azzurra", "Punta Chiara", "Le Palme", "Baia Serena"],
  "montagna-parchi": ["Alpenrose", "dei Larici", "Stella Alpina", "Panorama", "Edelweiss", "del Passo", "Dolomia", "Cima Bianca", "dei Camosci", "Sonnenhof", "Val Serena", "Ai Pini"],
  enogastronomia: ["dei Filari", "del Vignaiolo", "Cascina Rossa", "delle Botti", "Corte del Vino", "Colle Alto", "dei Tigli", "Antica Vigna", "La Meridiana", "del Nebbiolo", "Poggio Chiaro", "Le Querce"],
  unesco: ["Antica Dimora", "dei Mercanti", "Il Chiostro", "San Martino", "Palazzo Antico", "delle Logge", "Al Duomo", "Santa Chiara", "dei Musei", "Porta Nuova", "La Meridiana", "del Campanile"],
  borghi: ["La Rocca", "del Borgo", "Antico Forno", "La Torre", "Al Convento", "Piazza Vecchia", "delle Mura", "Il Melograno", "Casa Vecchia", "Sant'Anna", "Corte Antica", "Le Ginestre"],
};

// Suffissi di posizionamento, usati per dare varietà alle aree.
export const AREAS = {
  mare: ["Lungomare", "Centro", "Porto", "Prima linea", "Collina", "Baia", "Marina"],
  "montagna-parchi": ["Centro", "Piste", "Fondovalle", "Altopiano", "Passo", "Frazione alta", "Bosco"],
  enogastronomia: ["Colline", "Centro storico", "Campagna", "Crinale", "Fondovalle", "Vigneti"],
  unesco: ["Centro storico", "Area monumentale", "Lungofiume", "Stazione", "Mura", "Periferia storica"],
  borghi: ["Centro storico", "Mura", "Porta principale", "Fuori le mura", "Contrada", "Piazza"],
};

export const STAR_MIX = [5, 5, 4, 4, 4, 4, 3, 3, 3, 4, 5, 4, 3, 4, 3, 4, 5, 3, 4, 3];
