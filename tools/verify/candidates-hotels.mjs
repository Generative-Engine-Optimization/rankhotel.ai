// Candidati di hotel reali per destinazione.
//
// Nessuno di questi entra nel dataset per il fatto di essere scritto qui:
// entra se il dominio risponde e se la pagina parla di quell'hotel. La verifica
// sta in tools/verify/check-hotels.mjs.
//
// Formato: [nome, dominio, stelle, zona]

export const HOTEL_CANDIDATES = {
  // ------------------------------------------------------------------ UNESCO
  roma: [
    ["Hotel de Russie", "roccofortehotels.com", 5, "Piazza del Popolo"],
    ["Hotel Hassler Roma", "hotelhasslerroma.com", 5, "Trinità dei Monti"],
    ["Hotel Eden", "dorchestercollection.com", 5, "Via Veneto"],
    ["The St. Regis Rome", "marriott.com", 5, "Repubblica"],
    ["Palazzo Manfredi", "palazzomanfredi.it", 5, "Colosseo"],
    ["Hotel Artemide", "hotelartemide.it", 4, "Via Nazionale"],
    ["Singer Palace Hotel", "singerpalacehotel.com", 5, "Via del Corso"],
    ["Hotel Locarno", "hotellocarno.com", 4, "Flaminio"],
    ["Hotel Quirinale", "hotelquirinale.it", 4, "Via Nazionale"],
    ["Hotel Nazionale", "hotelnazionale.it", 4, "Montecitorio"],
    ["Bettoja Hotel Mediterraneo", "bettojahotels.it", 4, "Termini"],
    ["Hotel Campo de' Fiori", "hotelcampodefiori.com", 4, "Campo de' Fiori"],
  ],
  firenze: [
    ["Four Seasons Hotel Firenze", "fourseasons.com", 5, "Sant'Ambrogio"],
    ["Portrait Firenze", "lungarnocollection.com", 5, "Ponte Vecchio"],
    ["Hotel Savoy", "roccofortehotels.com", 5, "Piazza della Repubblica"],
    ["The St. Regis Florence", "marriott.com", 5, "Lungarno"],
    ["Hotel Davanzati", "hoteldavanzati.it", 3, "Centro storico"],
    ["Hotel Lungarno", "lungarnocollection.com", 5, "Lungarno"],
    ["Palazzo Vecchietti", "palazzovecchietti.com", 5, "Centro storico"],
    ["Hotel Calimala", "hotelcalimala.com", 4, "Mercato Nuovo"],
    ["Grand Hotel Cavour", "hotelcavour.com", 4, "Duomo"],
    ["Hotel Brunelleschi", "hotelbrunelleschi.it", 4, "Duomo"],
    ["Villa Cora", "villacora.it", 5, "Oltrarno"],
    ["Hotel Orto de' Medici", "ortodeimedici.it", 4, "San Marco"],
  ],
  venezia: [
    ["The Gritti Palace", "marriott.com", 5, "San Marco"],
    ["Aman Venice", "aman.com", 5, "Canal Grande"],
    ["Hotel Danieli", "marriott.com", 5, "Riva degli Schiavoni"],
    ["Ca' Sagredo Hotel", "casagredohotel.com", 5, "Cannaregio"],
    ["Hotel Ai Reali", "hotelaireali.com", 4, "Castello"],
    ["Belmond Hotel Cipriani", "belmond.com", 5, "Giudecca"],
    ["Ca' di Dio", "vretreats.com", 5, "Castello"],
    ["Hotel Antiche Figure", "hotelantichefigure.it", 3, "Santa Croce"],
    ["Hotel Metropole Venezia", "hotelmetropole.com", 5, "Riva degli Schiavoni"],
    ["Bauer Palazzo", "bauervenezia.com", 5, "San Marco"],
    ["Hotel Londra Palace", "londrapalace.com", 5, "Riva degli Schiavoni"],
    ["NH Collection Venezia Palazzo Barocci", "nh-hotels.it", 4, "San Marco"],
  ],
  napoli: [
    ["Grand Hotel Vesuvio", "vesuvio.it", 5, "Lungomare"],
    ["Romeo Hotel", "romeohotel.it", 5, "Porto"],
    ["Grand Hotel Parker's", "grandhotelparkers.it", 5, "Corso Vittorio Emanuele"],
    ["Eurostars Hotel Excelsior", "eurostarshotels.com", 5, "Lungomare"],
    ["Renaissance Naples Hotel Mediterraneo", "marriott.com", 4, "Porto"],
    ["Palazzo Caracciolo Napoli", "accor.com", 4, "Centro storico"],
    ["Hotel Piazza Bellini", "hotelpiazzabellini.com", 4, "Centro storico"],
    ["Grand Hotel Santa Lucia", "santalucia.it", 4, "Santa Lucia"],
    ["Hotel Palazzo Alabardieri", "palazzoalabardieri.it", 4, "Chiaia"],
    ["Costantinopoli 104", "costantinopoli104.it", 4, "Centro storico"],
  ],
  verona: [
    ["Due Torri Hotel", "duetorrihotels.com", 5, "Centro storico"],
    ["Palazzo Victoria", "palazzovictoria.com", 5, "Corso Porta Borsari"],
    ["Hotel Gabbia d'Oro", "hotelgabbiadoro.it", 4, "Centro storico"],
    ["Hotel Accademia", "hotelaccademiaverona.it", 4, "Via Scala"],
    ["Byblos Art Hotel Villa Amistà", "byblosarthotel.com", 5, "Corrubbio"],
    ["Hotel Indigo Verona", "ihg.com", 4, "Centro storico"],
    ["Escalus Luxury Suites", "escalusverona.com", 4, "Centro storico"],
    ["Hotel Colomba d'Oro", "colombahotel.com", 4, "Arena"],
  ],
  siena: [
    ["Grand Hotel Continental Siena", "grandhotelcontinentalsiena.com", 5, "Banchi di Sopra"],
    ["Hotel Athena", "hotelathena.com", 4, "Centro storico"],
    ["Palazzo Ravizza", "palazzoravizza.it", 4, "Pian dei Mantellini"],
    ["Hotel Certosa di Maggiano", "certosadimaggiano.com", 5, "Fuori le mura"],
    ["Borgo Scopeto Relais", "borgoscopeto.it", 4, "Castelnuovo Berardenga"],
  ],
  matera: [
    ["Sextantio Le Grotte della Civita", "sextantio.it", 4, "Sassi"],
    ["Palazzo Gattini Luxury Hotel", "palazzogattini.it", 5, "Piazza Duomo"],
    ["Sant'Angelo Luxury Resort", "santangeloresort.it", 4, "Sasso Caveoso"],
    ["Aquatio Cave Luxury Hotel", "aquatiohotel.com", 5, "Sassi"],
    ["Locanda di San Martino", "locandadisanmartino.it", 4, "Sassi"],
  ],
  ravenna: [
    ["Palazzo Bezzi Hotel", "palazzobezzi.it", 4, "Centro storico"],
    ["NH Ravenna", "nh-hotels.it", 4, "Centro"],
    ["Hotel Bisanzio", "bisanziohotel.com", 4, "Centro storico"],
  ],
  assisi: [
    ["Nun Assisi Relais", "nunassisi.com", 5, "Centro storico"],
    ["Hotel Subasio", "hotelsubasio.com", 4, "Basilica"],
    ["Hotel Giotto Assisi", "hotelgiottoassisi.it", 4, "Porta San Pietro"],
  ],
  alberobello: [
    ["Trulli Holiday Albergo Diffuso", "trulliholiday.com", 3, "Rione Monti"],
    ["Grand Hotel La Chiusa di Chietri", "lachiusadichietri.it", 4, "Contrada Chietri"],
    ["Tipico Resort", "tiporesort.it", 4, "Centro"],
  ],
  urbino: [
    ["Hotel Bonconte", "viphotels.it", 4, "Mura"],
    ["Albergo San Domenico", "viphotels.it", 4, "Piazza Rinascimento"],
  ],
  "mantova-sabbioneta": [
    ["Casa Poli Hotel", "hotelcasapoli.it", 4, "Centro"],
    ["Palazzo Castiglioni", "palazzocastiglioni.it", 4, "Piazza Sordello"],
  ],
  "val-di-noto": [
    ["Seven Rooms Villadorata", "7roomsvilladorata.it", 5, "Noto"],
    ["Country House Villadorata", "countryhousevilladorata.it", 4, "Noto"],
    ["Eremo della Giubiliana", "eremodellagiubiliana.it", 5, "Ragusa"],
  ],
  "pompei-ercolano": [
    ["Habita79 Pompeii", "habita79.it", 4, "Pompei"],
    ["Hotel Forum Pompei", "hotelforum.it", 4, "Scavi"],
  ],
  agrigento: [
    ["Villa Athena Resort", "hotelvillaathena.it", 5, "Valle dei Templi"],
    ["Doric Boutique Hotel", "doricboutiquehotel.it", 4, "Valle dei Templi"],
  ],
  tivoli: [
    ["Hotel Torre Sant'Angelo", "hoteltorresantangelo.it", 4, "Villa Gregoriana"],
  ],
  "ferrara-delta-po": [
    ["Hotel Annunziata", "annunziata.it", 4, "Castello Estense"],
    ["Hotel Duchessa Isabella", "duchessaisabella.it", 4, "Centro storico"],
  ],
  "val-orcia": [
    ["Rosewood Castiglion del Bosco", "rosewoodhotels.com", 5, "Montalcino"],
    ["Adler Spa Resort Thermae", "adler-resorts.com", 5, "Bagno Vignoni"],
    ["Hotel Posta Marcucci", "hotelpostamarcucci.it", 4, "Bagno Vignoni"],
    ["La Bandita Townhouse", "la-bandita.com", 4, "Pienza"],
  ],

  // -------------------------------------------------------- MONTAGNA E PARCHI
  dolomiti: [
    ["Rosa Alpina Hotel & Spa", "rosalpina.it", 5, "San Cassiano"],
    ["Hotel Ciasa Salares", "ciasasalares.it", 4, "Armentarola"],
    ["Adler Lodge Alpe", "adler-resorts.com", 5, "Alpe di Siusi"],
    ["Forestis Dolomites", "forestis.it", 5, "Plose"],
    ["Hotel Lagorai", "hotellagorai.it", 4, "Cavalese"],
    ["Excelsior Dolomites Life Resort", "myexcelsior.com", 5, "San Vigilio"],
  ],
  cortina: [
    ["Cristallo, a Luxury Collection Resort", "marriott.com", 5, "Cortina"],
    ["Grand Hotel Savoia Cortina", "grandhotelsavoiacortina.it", 5, "Centro"],
    ["Hotel de Len", "hoteldelen.it", 4, "Centro"],
    ["Rosapetra Spa Resort", "rosapetracortina.it", 5, "Zuel"],
    ["Faloria Mountain Spa Resort", "faloriasparesort.com", 5, "Zuel"],
  ],
  "alta-badia": [
    ["Hotel La Perla", "hotel-laperla.it", 5, "Corvara"],
    ["Rosa Alpina", "rosalpina.it", 5, "San Cassiano"],
    ["Sporthotel Panorama", "sporthotel-panorama.com", 4, "Corvara"],
    ["Hotel Gran Ander", "granander.it", 3, "Badia"],
  ],
  "val-gardena": [
    ["Alpenroyal Grand Hotel", "alpenroyal.com", 5, "Selva"],
    ["Hotel Gardena Grödnerhof", "gardena.it", 5, "Ortisei"],
    ["Adler Spa Resort Dolomiti", "adler-resorts.com", 5, "Ortisei"],
    ["Cendevaves Mountain Hotel", "cendevaves.com", 4, "Selva"],
  ],
  "madonna-campiglio": [
    ["DV Chalet Boutique Hotel", "dvchalet.it", 5, "Campiglio"],
    ["Hotel Lorenzetti", "hotellorenzetti.com", 4, "Campiglio"],
    ["Chalet del Sogno", "hotelchaletdelsogno.com", 5, "Campiglio"],
  ],
  courmayeur: [
    ["Grand Hotel Royal e Golf", "hotelroyalegolf.com", 5, "Centro"],
    ["Le Massif Courmayeur", "lemassifcourmayeur.com", 5, "Centro"],
    ["Auberge de La Maison", "aubergemaison.it", 4, "Entrèves"],
  ],
  cervinia: [
    ["Hotel Hermitage", "hotelhermitage.com", 5, "Breuil-Cervinia"],
    ["Saint Hubertus Resort", "sainthubertusresort.com", 4, "Breuil-Cervinia"],
  ],
  livigno: [
    ["Lac Salin Spa & Mountain Resort", "lungolivigno.com", 4, "Livigno"],
    ["Hotel Concordia", "lungolivigno.com", 4, "Livigno"],
    ["Grand Hotel Bagni Nuovi", "bagnidibormio.it", 5, "Bormio"],
  ],
  "val-pusteria": [
    ["Hotel Rosa Alpina", "rosalpina.it", 5, "San Cassiano"],
    ["Alpen Tesitin Panorama Wellness Resort", "alpentesitin.it", 5, "Val Casies"],
    ["Hotel Post Alpina", "hotelpost-alpina.it", 4, "Sesto"],
  ],
  "alpe-siusi": [
    ["Adler Lodge Alpe", "adler-resorts.com", 5, "Alpe di Siusi"],
    ["Alpina Dolomites Lodge", "alpinadolomites.it", 5, "Compatsch"],
    ["Hotel Steger Dellai", "stegerdellai.com", 4, "Compatsch"],
  ],
  "val-di-fassa": [
    ["Hotel Gran Mugon", "granmugon.it", 4, "Vigo di Fassa"],
    ["Dolomiti Wellness Hotel Fanes", "hotelfanes.it", 4, "Moena"],
  ],
  "gran-paradiso": [
    ["Hotel Bellevue Cogne", "hotelbellevue.it", 5, "Cogne"],
    ["Hotel Miramonti Cogne", "miramonticogne.com", 4, "Cogne"],
  ],
  etna: [
    ["Monaci delle Terre Nere", "monacidelleterrenere.it", 5, "Zafferana Etnea"],
    ["Shalai Resort", "shalai.it", 4, "Linguaglossa"],
  ],

  // ------------------------------------------------------------------- MARE
  "costiera-amalfitana": [
    ["Le Sirenuse", "sirenuse.it", 5, "Positano"],
    ["Il San Pietro di Positano", "ilsanpietro.it", 5, "Positano"],
    ["Hotel Santa Caterina", "hotelsantacaterina.it", 5, "Amalfi"],
    ["Belmond Hotel Caruso", "belmond.com", 5, "Ravello"],
    ["Palazzo Avino", "palazzoavino.com", 5, "Ravello"],
    ["Hotel Marina Riviera", "marinariviera.it", 4, "Amalfi"],
    ["Villa Franca Positano", "villafrancahotel.it", 5, "Positano"],
    ["Casa Angelina", "casangelina.com", 5, "Praiano"],
  ],
  capri: [
    ["Capri Palace Jumeirah", "jumeirah.com", 5, "Anacapri"],
    ["Hotel Punta Tragara", "hoteltragara.com", 5, "Capri"],
    ["JK Place Capri", "jkcapri.com", 5, "Marina Grande"],
    ["Grand Hotel Quisisana", "quisisana.com", 5, "Capri"],
    ["Villa Marina Capri", "villamarinacapri.com", 5, "Capri"],
  ],
  "cinque-terre": [
    ["Hotel Porto Roca", "portoroca.it", 4, "Monterosso"],
    ["La Torretta Lodge", "torrettas.com", 4, "Manarola"],
    ["Hotel Pasquale", "hotelpasquale.it", 3, "Monterosso"],
  ],
  "costa-smeralda": [
    ["Hotel Cala di Volpe", "marriott.com", 5, "Porto Cervo"],
    ["Hotel Romazzino", "marriott.com", 5, "Porto Cervo"],
    ["Hotel Pitrizza", "marriott.com", 5, "Liscia di Vacca"],
    ["Cervo Hotel", "marriott.com", 5, "Porto Cervo"],
  ],
  taormina: [
    ["Grand Hotel Timeo", "belmond.com", 5, "Teatro Antico"],
    ["Belmond Villa Sant'Andrea", "belmond.com", 5, "Mazzarò"],
    ["San Domenico Palace", "marriott.com", 5, "Centro"],
    ["Hotel Villa Carlotta", "hotelvillacarlottataormina.com", 4, "Centro"],
  ],
  "ischia-procida": [
    ["Mezzatorre Hotel & Thermal Spa", "mezzatorre.it", 5, "Forio"],
    ["Botania Relais & Spa", "botaniarelais.com", 5, "Forio"],
    ["Regina Isabella", "reginaisabella.com", 5, "Lacco Ameno"],
  ],
  versilia: [
    ["Grand Hotel Principe di Piemonte", "principedipiemonte.com", 5, "Viareggio"],
    ["Augustus Hotel & Resort", "augustus-hotel.it", 5, "Forte dei Marmi"],
    ["Hotel Byron", "hotelbyron.net", 5, "Forte dei Marmi"],
  ],
  "isola-elba": [
    ["Hotel Hermitage Elba", "hotelhermitage.it", 5, "Biodola"],
    ["Baia Bianca Suites", "baiabianca.it", 4, "Procchio"],
  ],
  salento: [
    ["Vinilia Wine Resort", "viniliaresort.com", 5, "Manduria"],
    ["Masseria Le Mandorle", "masserialemandorle.it", 4, "Otranto"],
  ],
  gargano: [
    ["Pizzomunno Vieste Palace Hotel", "pizzomunno.it", 5, "Vieste"],
  ],

  // --------------------------------------------------------- ENOGASTRONOMIA
  langhe: [
    ["Relais San Maurizio", "relaissanmaurizio.it", 5, "Santo Stefano Belbo"],
    ["Casa di Langa", "casadilanga.com", 5, "Cerretto Langhe"],
    ["Hotel Barolo", "hotelbarolo.it", 3, "Barolo"],
    ["Villa Beccaris", "villabeccaris.it", 4, "Monforte d'Alba"],
    ["Palás Cerequio", "palascerequio.com", 5, "La Morra"],
  ],
  chianti: [
    ["Castello di Ama", "castellodiama.com", 5, "Gaiole in Chianti"],
    ["Castello del Nero", "comohotels.com", 5, "Tavarnelle"],
    ["Villa Le Barone", "villalebarone.com", 4, "Panzano"],
    ["Borgo San Felice", "borgosanfelice.it", 5, "Castelnuovo Berardenga"],
  ],
  montalcino: [
    ["Castello Banfi Il Borgo", "castellobanfiilborgo.com", 5, "Montalcino"],
    ["Hotel Vecchia Oliviera", "vecchiaoliviera.com", 4, "Montalcino"],
  ],
  montepulciano: [
    ["Hotel Il Marzocco", "albergoilmarzocco.it", 3, "Centro"],
    ["Villa Cicolina", "villacicolina.it", 4, "Montepulciano"],
  ],
  modena: [
    ["Casa Maria Luigia", "casamarialuigia.com", 5, "Modena"],
    ["Best Western Premier Milano Palace", "milanopalacehotel.it", 4, "Centro"],
  ],
  "parma-food-valley": [
    ["Palazzo Dalla Rosa Prati", "palazzodallarosaprati.it", 4, "Piazza Duomo"],
    ["Grand Hotel de la Ville", "grandhoteldelaville.it", 4, "Fiere"],
  ],
  franciacorta: [
    ["L'Albereta Relais & Châteaux", "albereta.it", 5, "Erbusco"],
  ],
  valdobbiadene: [
    ["Hotel Villa Abbazia", "hotelabbazia.it", 4, "Follina"],
  ],
  maremma: [
    ["Terme di Saturnia Natural Destination", "termedisaturnia.it", 5, "Saturnia"],
    ["Andana Resort", "andana.it", 5, "Castiglione della Pescaia"],
  ],
  bolgheri: [
    ["Relais Sant'Elena", "relaissantelena.it", 4, "Bibbona"],
  ],

  // ----------------------------------------------------------------- BORGHI
  "san-gimignano": [
    ["Hotel Relais Santa Chiara", "rsc.it", 4, "Fuori le mura"],
    ["Hotel L'Antico Pozzo", "anticopozzo.com", 3, "Centro storico"],
  ],
  orvieto: [
    ["Hotel La Badia di Orvieto", "labadiahotel.it", 4, "La Badia"],
    ["Hotel Duomo Orvieto", "orvietohotelduomo.com", 3, "Duomo"],
  ],
  portovenere: [
    ["Grand Hotel Portovenere", "grandhotelportovenere.it", 4, "Porto"],
  ],
  ostuni: [
    ["Masseria Torre Coccaro", "masseriatorrecoccaro.com", 5, "Savelletri"],
    ["Borgo Egnazia", "borgoegnazia.com", 5, "Savelletri"],
    ["Paragon 700 Boutique Hotel", "paragon700.com", 5, "Centro storico"],
  ],
  tropea: [
    ["Villa Paola", "villapaolatropea.com", 4, "Tropea"],
  ],
  varenna: [
    ["Hotel Royal Victoria", "royalvictoria.com", 4, "Varenna"],
    ["Grand Hotel Villa Serbelloni", "villaserbelloni.com", 5, "Bellagio"],
    ["Villa d'Este", "villadeste.com", 5, "Cernobbio"],
  ],
  erice: [
    ["Hotel Elimo", "hotelelimo.it", 3, "Centro storico"],
  ],
  vipiteno: [
    ["Romantik Hotel Stafler", "stafler.com", 4, "Campo di Trens"],
  ],
};
