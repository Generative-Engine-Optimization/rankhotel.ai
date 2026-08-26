// Decisioni prese a mano, con il motivo.
//
// L'automatismo sa leggere una pagina, non sa che cosa sia una società in
// house. Un consorzio di operatori turistici e una S.r.l. hanno la stessa forma
// nel footer e ruoli opposti nel territorio: qui la differenza la fa una
// persona, e la dichiara.
//
// Ogni riga vale più dell'esito automatico. Ogni riga deve avere un perché.

export const DMO_OVERRIDES = {
  venezia: {
    domain: "veneziaunica.it",
    holder: "Vela S.p.A., società in house del Comune di Venezia",
    why: "in house comunale: forma privata, mandato pubblico",
    note: "portale servizi e biglietteria più che promozione",
  },
  livigno: {
    domain: "livigno.eu",
    holder: "APT Livigno",
    why: "azienda di promozione turistica del comune",
  },
  "alta-badia": {
    domain: "altabadia.org",
    holder: "Consorzio Turistico Alta Badia",
    why: "consorzio degli operatori con mandato di promozione",
  },
  courmayeur: {
    domain: "courmayeurmontblanc.it",
    holder: "Courmayeur Mont Blanc Funivie / consorzio operatori",
    why: "consorzio locale: la forma societaria non ne cambia il ruolo",
  },
  matera: {
    domain: "materawelcome.it",
    holder: "Comune di Matera",
    why: "portale turistico comunale",
  },
  roma: {
    domain: "turismoroma.it",
    holder: "Roma Capitale",
    why: "sito turistico ufficiale del comune",
  },
  firenze: { domain: "feelflorence.it", holder: "Comune di Firenze", why: "portale ufficiale comunale" },
  langhe: {
    domain: "visitlmr.it",
    holder: "Ente Turismo Langhe Monferrato Roero",
    why: "ente turistico d'ambito",
  },
  "val-gardena": { domain: "valgardena.it", holder: "Val Gardena Marketing", why: "società di destinazione dei tre comuni" },
  "cinque-terre": {
    domain: "parconazionale5terre.it",
    holder: "Parco Nazionale delle Cinque Terre",
    why: "ente parco",
    note: "sito istituzionale più che promozionale",
  },
  "madonna-campiglio": {
    domain: "campigliodolomiti.it",
    holder: "Azienda per il Turismo Campiglio Dolomiti S.p.A.",
    why: "azienda per il turismo d'ambito, partecipata pubblica",
  },
  "riviera-romagnola": {
    domain: "visitrimini.com",
    holder: "Visit Rimini, società di destinazione",
    why: "portale ufficiale di destinazione: più rappresentativo del solo comune di Riccione",
  },
};

// Domini che l'automatismo tiene ma che a guardarli non sono quello che
// sembrano. Meglio nessun sito che il sito sbagliato.
export const REJECT = {
  "costiera-amalfitana": ["costieraamalfitana.it"], // è un agriturismo, non un portale
  capri: ["cittadicapri.it"], // pagina vuota
  salento: ["salentoturismo.it"], // dominio parcheggiato presso un hosting
  versilia: ["versilia.it"], // società di forniture industriali, omonimia
};

// Editoriali verificati che vale la pena tenere in evidenza, dal foglio.
export const EDITORIAL_OVERRIDES = {
  dolomiti: { domain: "dolomiti.it", holder: "DESTINATION S.r.l." },
  "costiera-amalfitana": { domain: "amalficoast.com", holder: "Locali d'Autore S.r.l." },
  langhe: { domain: "langhe.net", holder: "LoveLanghe S.R.L." },
  "cinque-terre": { domain: "cinqueterre.eu.com", holder: "nessuna ragione sociale dichiarata" },
};
