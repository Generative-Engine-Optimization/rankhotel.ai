// GENERATO da tools/verify/write-sites-seed.mjs il 2026-08-25.
// Non modificare a mano: le decisioni si prendono in tools/verify/overrides.mjs
// e si rilancia `npm run verify:sites`.
//
// Un dominio è qui solo se ha risposto a una richiesta HTTP reale e se il
// soggetto che lo gestisce è stato identificato. `source` dice se la
// classificazione l'ha fatta lo script o una persona: le due cose non si
// confondono, perché una persona può sbagliare in modo diverso da uno script.

export const VERIFIED_ON = "2026-08-25";

// Sito ufficiale del territorio: un ente, un consorzio, un parco, o una società
// in house con mandato pubblico di promozione.
export const VERIFIED_DMO = {
  "cinque-terre": { domain: "parconazionale5terre.it", holder: "Parco Nazionale delle Cinque Terre", why: "ente parco", source: "verifica manuale", note: "sito istituzionale più che promozionale" },
  "costa-smeralda": { domain: "consorziocostasmeralda.com", holder: "Main Home - Consorzio Costa Smeralda", why: "dominio istituzionale", source: "verifica automatica" },
  "isola-elba": { domain: "visitelba.info", holder: "Home - Visit Elba", why: "dichiara \"Comune di C\"", source: "verifica automatica" },
  "gargano": { domain: "parcogargano.it", holder: "Ente parco nazionale del Gargano", why: "dominio istituzionale", source: "verifica automatica" },
  "riviera-romagnola": { domain: "visitrimini.com", holder: "Visit Rimini, società di destinazione", why: "portale ufficiale di destinazione: più rappresentativo del solo comune di Riccione", source: "verifica manuale" },
  "taormina": { domain: "comune.taormina.me.it", holder: "Comune di Taormina", why: "dominio istituzionale", source: "verifica automatica" },
  "riviera-conero": { domain: "rivieradelconero.info", holder: "Riviera del Conero nelle Marche", why: "dichiara \"città di m\"", source: "verifica automatica" },
  "costa-molisana": { domain: "comune.termoli.cb.it", holder: "Comune di Termoli", why: "dominio istituzionale", source: "verifica automatica" },
  "trapanese": { domain: "riservazingaro.it", holder: "HOME - Riserva Naturale Orientata Zingaro", why: "dichiara \"Comune di S\"", source: "verifica automatica" },
  "cilento": { domain: "cilentoediano.it", holder: "Home - Parco Nazionale del Cilento, Vallo di Diano e Alburni", why: "dichiara \"Ente Parco\"", source: "verifica automatica" },
  "dolomiti": { domain: "dolomitiunesco.info", holder: "Dolomiti Patrimonio Mondiale UNESCO &#8211; Sito ufficiale delle", why: "dichiara \"regione a\"", source: "verifica automatica" },
  "cortina": { domain: "comune.cortinadampezzo.bl.it", holder: "Comune di Cortina d'Ampezzo", why: "dominio istituzionale", source: "verifica automatica" },
  "alta-badia": { domain: "altabadia.org", holder: "Consorzio Turistico Alta Badia", why: "consorzio degli operatori con mandato di promozione", source: "verifica manuale" },
  "val-gardena": { domain: "valgardena.it", holder: "Val Gardena Marketing", why: "società di destinazione dei tre comuni", source: "verifica manuale" },
  "madonna-campiglio": { domain: "campigliodolomiti.it", holder: "Azienda per il Turismo Campiglio Dolomiti S.p.A.", why: "azienda per il turismo d'ambito, partecipata pubblica", source: "verifica manuale" },
  "courmayeur": { domain: "courmayeurmontblanc.it", holder: "Courmayeur Mont Blanc Funivie / consorzio operatori", why: "consorzio locale: la forma societaria non ne cambia il ruolo", source: "verifica manuale" },
  "gran-paradiso": { domain: "pngp.it", holder: "Parco Nazionale Gran Paradiso", why: "dominio istituzionale", source: "verifica automatica" },
  "parco-abruzzo": { domain: "parcoabruzzo.it", holder: "Parco Nazionale d'Abruzzo, Lazio e Molise", why: "dominio istituzionale", source: "verifica automatica" },
  "gran-sasso": { domain: "gransassolagapark.it", holder: "Parco Nazionale del Gran Sasso e Monti della Laga", why: "dichiara \"Regione M\"", source: "verifica automatica" },
  "val-di-fassa": { domain: "fassa.com", holder: "Val di Fassa", why: "si dichiara ufficiale, APT", source: "verifica automatica" },
  "sila": { domain: "parcosila.it", holder: "Parco Nazionale della Sila &#8211; Sito Ufficiale", why: "dominio istituzionale", source: "verifica automatica" },
  "pollino": { domain: "parcopollino.it", holder: "Home - Parco Nazionale del Pollino", why: "dominio istituzionale", source: "verifica automatica" },
  "sibillini": { domain: "sibillini.net", holder: "Parco Nazionale dei Monti Sibillini", why: "dichiara \"ENTE PARCO\"", source: "verifica automatica" },
  "val-pusteria": { domain: "kronplatz.com", holder: "Esperienze di prima classe ☀️ La Regione Dolomitica Plan de Coro", why: "dichiara \"Regione D\"", source: "verifica automatica" },
  "alpe-siusi": { domain: "seiseralm.it", holder: "Alpe di Siusi", why: "dichiara \"regione s\"", source: "verifica automatica" },
  "livigno": { domain: "livigno.eu", holder: "APT Livigno", why: "azienda di promozione turistica del comune", source: "verifica manuale" },
  "casentino": { domain: "parcoforestecasentinesi.it", holder: "Parco Nazionale Foreste Casentinesi", why: "dominio istituzionale", source: "verifica automatica" },
  "etna": { domain: "parcoetna.it", holder: "Parco dell'Etna - Parco dell'Etna", why: "dominio istituzionale", source: "verifica automatica" },
  "langhe": { domain: "visitlmr.it", holder: "Ente Turismo Langhe Monferrato Roero", why: "ente turistico d'ambito", source: "verifica manuale" },
  "chianti": { domain: "chianticlassico.com", holder: "Chianti Classico - Il primo territorio di vino", why: "dichiara \"città di F\"", source: "verifica automatica" },
  "franciacorta": { domain: "visitlakeiseo.info", holder: "Visit Lake Iseo", why: "si dichiara ufficiale, Regione L", source: "verifica automatica" },
  "valpolicella": { domain: "consorziovalpolicella.it", holder: "Consorzio della Valpolicella - Landing", why: "dominio istituzionale", source: "verifica automatica" },
  "montalcino": { domain: "consorziobrunellodimontalcino.it", holder: "Consorzio del vino Brunello di Montalcino Montalcino", why: "dominio istituzionale", source: "verifica automatica" },
  "montepulciano": { domain: "prolocomontepulciano.it", holder: "Proloco Montepulciano - Proloco Montepulciano", why: "dichiara \"Comune di M\"", source: "verifica automatica" },
  "modena": { domain: "visitmodena.it", holder: "Italiano - VisitModena", why: "si dichiara sito ufficiale del territorio", source: "verifica automatica" },
  "valdobbiadene": { domain: "visitconegliano.it", holder: "Home - Visit Conegliano", why: "dichiara \"Comune di C\"", source: "verifica automatica" },
  "strada-vino-alto-adige": { domain: "suedtirol.info", holder: "Alto Adige/Südtirol", why: "dichiara \"Regione d\"", source: "verifica automatica" },
  "collio": { domain: "collio.it", holder: "Consorzio Collio", why: "dichiara \"Regione F\"", source: "verifica automatica" },
  "monferrato": { domain: "monferrato.org", holder: "Il Monferrato turismo e accoglienza", why: "dichiara \"città di C\"", source: "verifica automatica" },
  "roero": { domain: "visitlmr.it", holder: "Ente Turismo Langhe Monferrato Roero", why: "dichiara \"Ente Turismo\"", source: "verifica automatica" },
  "maremma": { domain: "parco-maremma.it", holder: "Home - Parco Maremma", why: "dominio istituzionale", source: "verifica automatica" },
  "primitivo-manduria": { domain: "consorziotutelaprimitivo.com", holder: "Consorzio di Tutela del Primitivo di Manduria DOC e DOCG", why: "dominio istituzionale", source: "verifica automatica" },
  "irpinia": { domain: "irpinia.info", holder: "www.irpinia.info: pagina d'ingresso del sito dedicato all'Irpini", why: "dichiara \"Provincia di A\"", source: "verifica automatica" },
  "montefalco": { domain: "stradadelsagrantino.it", holder: "La Strada del Sagrantino", why: "dichiara \"Regione U\"", source: "verifica automatica" },
  "roma": { domain: "turismoroma.it", holder: "Roma Capitale", why: "sito turistico ufficiale del comune", source: "verifica manuale" },
  "firenze": { domain: "feelflorence.it", holder: "Comune di Firenze", why: "portale ufficiale comunale", source: "verifica manuale" },
  "venezia": { domain: "veneziaunica.it", holder: "Vela S.p.A., società in house del Comune di Venezia", why: "in house comunale: forma privata, mandato pubblico", source: "verifica manuale", note: "portale servizi e biglietteria più che promozione" },
  "napoli": { domain: "comune.napoli.it", holder: "Comune di Napoli", why: "dominio istituzionale", source: "verifica automatica" },
  "matera": { domain: "materawelcome.it", holder: "Comune di Matera", why: "portale turistico comunale", source: "verifica manuale" },
  "val-orcia": { domain: "parcodellavaldorcia.com", holder: "Val d'Orcia Patrimonio Mondiale", why: "dominio istituzionale", source: "verifica automatica" },
  "pompei-ercolano": { domain: "pompeiisites.org", holder: "Homepage - Pompeii Sites Portale Ufficiale Parco Archeologico di", why: "dominio istituzionale", source: "verifica automatica" },
  "val-di-noto": { domain: "comune.noto.sr.it", holder: "Città di Noto", why: "dominio istituzionale", source: "verifica automatica" },
  "ferrara-delta-po": { domain: "parcodeltapo.it", holder: "Parco del Delta del Po - Regione Emilia - Romagna", why: "dominio istituzionale", source: "verifica automatica" },
  "aquileia": { domain: "fondazioneaquileia.it", holder: "Fondazione Aquileia", why: "dominio istituzionale", source: "verifica automatica" },
  "siena": { domain: "terredisiena.it", holder: "Visita le Terre di Siena: itinerari, borghi, terme e natura", why: "si dichiara ufficiale, Regione T", source: "verifica automatica" },
  "assisi": { domain: "visit-assisi.it", holder: "Sito ufficiale di informazione turistica di Assisi - Visit Assis", why: "dichiara \"Comune di A\"", source: "verifica automatica" },
  "ravenna": { domain: "turismo.ra.it", holder: "Ravenna Turismo", why: "dichiara \"COMUNE DI R\"", source: "verifica automatica" },
  "alberobello": { domain: "comune.alberobello.ba.it", holder: "Comune di Alberobello", why: "dominio istituzionale", source: "verifica automatica" },
  "agrigento": { domain: "parcovalledeitempli.it", holder: "Parco Valle dei Templi Agrigento", why: "dominio istituzionale", source: "verifica automatica" },
  "verona": { domain: "visitverona.it", holder: "VisitVerona.it", why: "dichiara \"DMO\"", source: "verifica automatica" },
  "sacri-monti": { domain: "sacrimonti.org", holder: "Sacri Monti del Piemonte e della Lombardia", why: "dominio istituzionale", source: "verifica automatica" },
  "mantova-sabbioneta": { domain: "turismo.mantova.it", holder: "Mantova", why: "dichiara \"Provincia di M\"", source: "verifica automatica" },
  "tivoli": { domain: "visittivoli.it", holder: "Visit Tivoli - Un viaggio unico tra storia, arte e natura!", why: "dichiara \"Comune di T\"", source: "verifica automatica" },
  "civita-bagnoregio": { domain: "civitadibagnoregio.cloud", holder: "Civita di Bagnoregio - \"La città che Muore\"", why: "dichiara \"Comune Di B\"", source: "verifica automatica" },
  "san-gimignano": { domain: "sangimignano.com", holder: "Visitare San Gimignano", why: "si dichiara sito ufficiale del territorio", source: "verifica automatica" },
  "castelmezzano": { domain: "comune.castelmezzano.pz.it", holder: "Sito istituzionale del Comune di Castelmezzano - Avvisi, Notizie", why: "dominio istituzionale", source: "verifica automatica" },
  "ostuni": { domain: "comune.ostuni.br.it", holder: "Comune di Ostuni &#8211; Sito istituzionale del Comune", why: "dominio istituzionale", source: "verifica automatica" },
  "bosa": { domain: "comune.bosa.or.it", holder: "Comune di Bosa", why: "dominio istituzionale", source: "verifica automatica" },
  "spello": { domain: "comune.spello.pg.it", holder: "Comune di Spello", why: "dominio istituzionale", source: "verifica automatica" },
  "tropea": { domain: "comune.tropea.vv.it", holder: "Comune di Tropea - Tropea", why: "dominio istituzionale", source: "verifica automatica" },
  "vipiteno": { domain: "vipiteno.com", holder: "Vacanza a Vipiteno in Alto Adige - Borghi più belli d`Italia", why: "dichiara \"Provincia Autonoma di B\"", source: "verifica automatica" },
  "orvieto": { domain: "comune.orvieto.tr.it", holder: "Comune di Orvieto", why: "dominio istituzionale", source: "verifica automatica" },
  "portovenere": { domain: "comune.portovenere.sp.it", holder: "Comune di Porto Venere", why: "dominio istituzionale", source: "verifica automatica" },
  "pitigliano": { domain: "comune.pitigliano.gr.it", holder: "Comune di Pitigliano", why: "dominio istituzionale", source: "verifica automatica" },
  "gradara": { domain: "gradara.org", holder: "Sito ufficiale turismo, eventi e visite guidate al Castello di G", why: "dichiara \"Comune di G\"", source: "verifica automatica" },
  "castelsardo": { domain: "comune.castelsardo.ss.it", holder: "Home page", why: "dominio istituzionale", source: "verifica automatica" },
  "erice": { domain: "comune.erice.tp.it", holder: "Città di Erice", why: "dominio istituzionale", source: "verifica automatica" },
  "dozza": { domain: "comune.dozza.bo.it", holder: "Dozza - Comune di Dozza", why: "dominio istituzionale", source: "verifica automatica" },
  "varenna": { domain: "comune.varenna.lc.it", holder: "Comune di Varenna", why: "dominio istituzionale", source: "verifica automatica" },
  "apricale": { domain: "comune.apricale.im.it", holder: "Comune di Apricale", why: "dominio istituzionale", source: "verifica automatica" },
  "sperlonga": { domain: "comune.sperlonga.lt.it", holder: "Comune di Sperlonga", why: "dominio istituzionale", source: "verifica automatica" },
};

// Portali indipendenti: società private che raccontano il territorio. Sono
// spesso più citati dalle AI del sito ufficiale, ed è il dato interessante.
export const VERIFIED_EDITORIAL = {
  "costiera-amalfitana": [
    { domain: "amalficoast.com", holder: "Locali d'Autore S.r.l.", source: "verifica manuale" },
  ],
  "salento": [
    { domain: "salento.it", holder: "Salento, offerte vacanze sul mare. Cosa visitare e vedere in Pug", source: "verifica automatica" },
    { domain: "vivisalento.it", holder: "VIVI SALENTO &#8211; DANIELA LOPEZ Y ROYO EVENTI E SEVIZI TURIST", source: "verifica automatica" },
  ],
  "cinque-terre": [
    { domain: "cinqueterre.eu.com", holder: "nessuna ragione sociale dichiarata", source: "verifica manuale" },
  ],
  "costa-smeralda": [
    { domain: "costasmeralda.it", holder: "Costa Smeralda: consigli, esperienze ed eventi (4)", source: "verifica automatica" },
  ],
  "isola-elba": [
    { domain: "infoelba.it", holder: "Isola d'Elba: guida informazioni vacanze e turismo", source: "verifica automatica" },
  ],
  "riviera-romagnola": [
    { domain: "rivieraromagnola.it", holder: "Riviera Romagnola: esperienze e itinerari di viaggio in Romagna", source: "verifica automatica" },
  ],
  "taormina": [
    { domain: "taormina.it", holder: "Taormina - Travel and Holidays - the Curiosities of Taormina", source: "verifica automatica" },
    { domain: "visittaormina.it", holder: "visittaormina.it", source: "verifica automatica" },
  ],
  "golfo-orosei": [
    { domain: "dorgali.it", holder: "Dorgali", source: "verifica automatica" },
  ],
  "riviera-ponente": [
    { domain: "sanremo.it", holder: "Sanremo enjoy Riviera & Côte d’Azur - luxury & lifestyle", source: "verifica automatica" },
  ],
  "capri": [
    { domain: "capritourism.com", holder: "The Essential Guide for Exploring the Island of Capri", source: "verifica automatica" },
  ],
  "isole-eolie": [
    { domain: "isoleeolie.it", holder: "..: Isole Eolie - Le ISOLE EOLIE", source: "verifica automatica" },
  ],
  "versilia": [
    { domain: "visitviareggio.it", holder: "visitviareggio.it", source: "verifica automatica" },
  ],
  "ischia-procida": [
    { domain: "infoischiaprocida.it", holder: "Traghetti Ischia: Prenotazione Biglietti Aliscafi da Napoli a Is", source: "verifica automatica" },
    { domain: "procida.info", holder: "procida.info network", source: "verifica automatica" },
  ],
  "trapanese": [
    { domain: "sanvitolocapo.info", holder: "San Vito Lo Capo", source: "verifica automatica" },
    { domain: "trapanese.it", holder: "trapanese.it", source: "verifica automatica" },
  ],
  "dolomiti": [
    { domain: "dolomiti.it", holder: "DESTINATION S.r.l.", source: "verifica manuale" },
  ],
  "cortina": [
    { domain: "dolomiti.org", holder: "Estate a Cortina d'Ampezzo", source: "verifica automatica" },
    { domain: "cortina.it", holder: "Cortina d'Ampezzo", source: "verifica automatica" },
  ],
  "alta-badia": [
    { domain: "visitaltabadia.it", holder: "Visit Alta Badia", source: "verifica automatica" },
  ],
  "val-gardena": [
    { domain: "visitvalgardena.it", holder: "Visit Val Gardena", source: "verifica automatica" },
  ],
  "cervinia": [
    { domain: "cervinia.it", holder: "Cervino Ski Paradise", source: "verifica automatica" },
  ],
  "parco-abruzzo": [
    { domain: "visitparcoabruzzo.it", holder: "Accesso Portale - Visit Parco Abruzzo", source: "verifica automatica" },
  ],
  "gran-sasso": [
    { domain: "visitgransasso.it", holder: "visit gran sasso", source: "verifica automatica" },
  ],
  "stelvio": [
    { domain: "bormio.eu", holder: "Bormio: terme, sci, Stelvio e vacanze in Alta Valtellina", source: "verifica automatica" },
  ],
  "sila": [
    { domain: "visitsila.it", holder: "Home - visitsila", source: "verifica automatica" },
    { domain: "silaturismo.it", holder: "SwiteFrontendNg", source: "verifica automatica" },
  ],
  "val-pusteria": [
    { domain: "visitvalpusteria.it", holder: "WordPress &#8211; WordPress Description", source: "verifica automatica" },
  ],
  "livigno": [
    { domain: "bormio.eu", holder: "Bormio: terme, sci, Stelvio e vacanze in Alta Valtellina", source: "verifica automatica" },
  ],
  "etna": [
    { domain: "etna.it", holder: "Coming Soon", source: "verifica automatica" },
  ],
  "langhe": [
    { domain: "langhe.net", holder: "LoveLanghe S.R.L.", source: "verifica manuale" },
  ],
  "chianti": [
    { domain: "chianti.it", holder: "Visita il Chianti in Toscana: borghi, itinerari, terme, natura e", source: "verifica automatica" },
  ],
  "valpolicella": [
    { domain: "valpolicella.it", holder: "Home - Tavole della Valpolicella", source: "verifica automatica" },
  ],
  "montalcino": [
    { domain: "prolocomontalcino.com", holder: "prolocomontalcino.com", source: "verifica automatica" },
    { domain: "visitmontalcino.it", holder: "visitmontalcino.it", source: "verifica automatica" },
  ],
  "parma-food-valley": [
    { domain: "parmawelcome.it", holder: "homepage - Informazioni turistiche su Parma e provincia", source: "verifica automatica" },
    { domain: "parmafoodvalley.it", holder: "parmafoodvalley.it", source: "verifica automatica" },
  ],
  "valdobbiadene": [
    { domain: "prosecco.it", holder: "Home - Prosecco.it — Conegliano Valdobbiadene DOCG", source: "verifica automatica" },
    { domain: "coneglianovaldobbiadene.it", holder: "Strada del Prosecco e Vini dei Colli Conegliano Valdobbiadene &#", source: "verifica automatica" },
  ],
  "bolgheri": [
    { domain: "bolgheridoc.com", holder: "Consorzio per la Tutela dei Vini DOC Bolgheri e DOC Bolgheri Sas", source: "verifica automatica" },
  ],
  "strada-vino-alto-adige": [
    { domain: "suedtiroler-weinstrasse.it", holder: "Südtiroler Weinstraße", source: "verifica automatica" },
  ],
  "etna-doc": [
    { domain: "stradadelvinodelletna.it", holder: "Strada Del Vino Dell'Etna", source: "verifica automatica" },
  ],
  "vulture": [
    { domain: "vulture.it", holder: "Il portale turistico del Melfese", source: "verifica automatica" },
  ],
  "monferrato": [
    { domain: "monferrato.it", holder: "Il Monferrato > Prima pagina", source: "verifica automatica" },
  ],
  "roero": [
    { domain: "roeroturismo.it", holder: "Roero TURISMO", source: "verifica automatica" },
  ],
  "maremma": [
    { domain: "lamaremma.info", holder: "lamaremma.info - Questo sito web è in vendita! - lamaremma Risor", source: "verifica automatica" },
  ],
  "montefalco": [
    { domain: "visitmontefalco.it", holder: "visitmontefalco", source: "verifica automatica" },
  ],
  "roma": [
    { domain: "visitroma.it", holder: "Dominio in vendita", source: "verifica automatica" },
  ],
  "firenze": [
    { domain: "visitfirenze.it", holder: "Dominio in vendita", source: "verifica automatica" },
  ],
  "venezia": [
    { domain: "visitvenezia.it", holder: "Dominio in vendita", source: "verifica automatica" },
  ],
  "napoli": [
    { domain: "visitnaples.eu", holder: "Visit Naples Official - La guida della città di Napoli", source: "verifica automatica" },
    { domain: "visitnapoli.it", holder: "Dominio in vendita", source: "verifica automatica" },
  ],
  "matera": [
    { domain: "materaturismo.it", holder: "Visitare Matera: un viaggio emozionante nella storia dell’uomo", source: "verifica automatica" },
  ],
  "val-di-noto": [
    { domain: "distrettoturisticosudest.it", holder: "Distrettoturisticosudest.it - La Sicilia per il turista", source: "verifica automatica" },
    { domain: "visitvaldinoto.it", holder: "Visit Val di Noto", source: "verifica automatica" },
  ],
  "aquileia": [
    { domain: "visitaquileia.it", holder: "visitaquileia", source: "verifica automatica" },
    { domain: "aquileia.it", holder: "La Citt� di Aquileia", source: "verifica automatica" },
  ],
  "urbino": [
    { domain: "urbinoculturaturismo.it", holder: "Urbino Sehenswürdigkeiten & Unterkünfte", source: "verifica automatica" },
  ],
  "assisi": [
    { domain: "assisi.it", holder: "Assisi Store - Distributore materiale elettrico e per l'illumina", source: "verifica automatica" },
  ],
  "ravenna": [
    { domain: "ravennamosaici.it", holder: "Ravenna Mosaici &#8211; Opera di Religione della Diocesi di Rave", source: "verifica automatica" },
  ],
  "san-gimignano": [
    { domain: "sangimignano.it", holder: "San Gimignano: trova hotel in base alle tue esigenze", source: "verifica automatica" },
  ],
  "castelmezzano": [
    { domain: "volodellangelo.com", holder: "Il Volo dell'Angelo", source: "verifica automatica" },
  ],
  "bosa": [
    { domain: "bosa.it", holder: "Hosted By One.com", source: "verifica automatica" },
    { domain: "bosaturismo.it", holder: "Info, spiagge, eventi Bosa e Bosa Marina (Costa Centro-Ovest Sar", source: "verifica automatica" },
  ],
  "spello": [
    { domain: "prospello.it", holder: "Proloco Spello", source: "verifica automatica" },
    { domain: "spello.it", holder: "spello.it", source: "verifica automatica" },
  ],
  "orvieto": [
    { domain: "visitorvieto.it", holder: "visitorvieto.it", source: "verifica automatica" },
    { domain: "orvietoturismo.it", holder: "Orvieto Turismo", source: "verifica automatica" },
  ],
  "portovenere": [
    { domain: "visitportovenere.it", holder: "visitportovenere.it", source: "verifica automatica" },
    { domain: "portovenereturismo.it", holder: "Home", source: "verifica automatica" },
  ],
  "castelsardo": [
    { domain: "visitcastelsardo.it", holder: "Coming soon...", source: "verifica automatica" },
  ],
  "varenna": [
    { domain: "lakecomo.is", holder: "Lago di Como", source: "verifica automatica" },
  ],
  "sperlonga": [
    { domain: "sperlonga.it", holder: "Sperlonga e il suo mare: info utili su hotel, alberghi, campeggi", source: "verifica automatica" },
    { domain: "sperlongaturismo.it", holder: "Sperlonga Turismo &#8211; Sperlonga Turismo", source: "verifica automatica" },
  ],
};
