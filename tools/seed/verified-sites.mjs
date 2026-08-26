// Domini verificati, da docs/rankhotel-destinazioni-e-siti.xlsx (25/08/2026).
//
// Il criterio non è "il dominio risponde 200". È: il footer dichiara un
// soggetto con mandato pubblico di promozione (ente, azienda in-house,
// consorzio, ente parco). Nella prima versione del foglio quattro domini erano
// stati classificati come DMO solo perché rispondevano: verificando ragione
// sociale e partita IVA sono risultati società private, e sono stati spostati
// nella famiglia editoriale, dove sono ottimi candidati.

// I domini verificati per destinazione vivono in verified-domains.mjs, che è
// generato da tools/verify/. Qui restano solo le liste curate a mano.
export { VERIFIED_DMO, VERIFIED_EDITORIAL, VERIFIED_ON } from "./verified-domains.mjs";

// DMO regionali verificati. Dove una destinazione non ha un ente proprio, il
// soggetto che la promuove davvero è la regione: usare un dominio inventato al
// suo posto rende la misura sulle fonti ufficiali inservibile.
export const REGIONAL_DMO = {
  Abruzzo: "abruzzoturismo.it",
  Basilicata: "basilicataturistica.it",
  Calabria: "calabriastraordinaria.it",
  Campania: "visitcampania.it",
  "Emilia-Romagna": "emiliaromagnaturismo.it",
  "Friuli-Venezia Giulia": "turismofvg.it",
  Lazio: "visitlazio.com",
  Liguria: "lamialiguria.it",
  Lombardia: "in-lombardia.it",
  Marche: "letsmarche.it",
  Molise: "visitmolise.eu",
  Piemonte: "visitpiemonte.com",
  Puglia: "viaggiareinpuglia.it",
  Sardegna: "sardegnaturismo.it",
  Sicilia: "visitsicily.info",
  Toscana: "visittuscany.com",
  "Trentino-Alto Adige": "visittrentino.info",
  Umbria: "umbriatourism.it",
  "Valle d'Aosta": "lovevda.it",
  Veneto: "veneto.eu",
};

export const NATIONAL_DMO = { domain: "italia.it", holder: "ENIT" };

// Domini di catena: la decisione su chi può leggere il sito la prende il
// gruppo, non l'albergatore. Il dataset lo dichiara invece di far sembrare
// che sia una scelta della singola struttura.
export const CHAIN_DOMAINS = [
  "marriott.com",
  "accor.com",
  "ihg.com",
  "hyatt.com",
  "hilton.com",
  "fourseasons.com",
  "dorchestercollection.com",
  "roccofortehotels.com",
  "belmond.com",
  "aman.com",
  "lungarnocollection.com",
  "eurostarshotels.com",
  "vretreats.com",
  "melia.com",
  "nh-hotels.it",
  // emersi dalla verifica del 25/08: gruppi che ospitano più strutture del
  // dataset sullo stesso dominio
  "lungolivigno.com",
  "viphotels.it",
  "comohotels.com",
  "jumeirah.com",
  "rosewoodhotels.com",
  "adler-resorts.com",
  "bettojahotels.it",
  "lakecomo.is",
];

// Esito dell'ultima verifica di raggiungibilità (25/08/2026). Un 403 è un WAF
// che blocca il controllo automatico, non un sito rotto: sono cose diverse e
// vanno dette diversamente.
export const DOMAIN_STATUS = {
  "palazzomanfredi.com": { status: "unreachable", note: "non raggiungibile né su apex né su www" },
  "hotelbritannique.it": { status: "unreachable", note: "non raggiungibile né su apex né su www" },
  "hotelmilano-vr.it": { status: "unreachable", note: "non raggiungibile né su apex né su www" },
  "palazzovictoria.com": { status: "redirect", note: "redirige su cojam.io, non è il sito dell'hotel" },
  "antichefigure.it": { status: "redirect", note: "redirige su hotelantichefigure.it" },
  "escalusverona.it": { status: "redirect", note: "redirige su escalusverona.com" },
  "dorchestercollection.com": { status: "waf", note: "blocca la verifica automatica" },
  "marriott.com": { status: "waf", note: "blocca la verifica automatica" },
  "singerpalacehotel.com": { status: "waf", note: "blocca la verifica automatica" },
  "fourseasons.com": { status: "waf", note: "blocca la verifica automatica" },
  "lungarnocollection.com": { status: "waf", note: "blocca la verifica automatica" },
  "romeohotel.it": { status: "waf", note: "blocca la verifica automatica" },
  "ihg.com": { status: "waf", note: "blocca la verifica automatica" },
};

