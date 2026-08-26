# Verifica di domini e strutture

Ultima verifica: **2026-08-25**. Rigenerabile con `npm run data:report`.

Questo documento dice che cosa nel dataset esiste davvero, che cosa è
dichiarato come dimostrativo, e su quali prove.

## La regola

Un dominio entra nel dataset solo se soddisfa due condizioni:

1. **risponde** a una richiesta HTTP reale;
2. **si identifica**, cioè la pagina dice chi la gestisce.

La seconda è quella che conta. Un codice 200 dice che il dominio è vivo, non
che sia il soggetto giusto. Per gli hotel la seconda condizione diventa: la
pagina nomina quell'hotel. Un dominio che risponde prova che qualcuno lo ha
registrato, non che la struttura esista.

## Il quadro

| | Prima | Ora |
| :--- | ---: | ---: |
| Siti ufficiali di destinazione verificati | 8 | 81 |
| Portali editoriali verificati | 4 | 76 |
| DMO regionali (soggetto di riserva) | 20 | 20 |
| Strutture reali nel dataset | 40 | 4322 |
| di cui verificate col nome sulla pagina | 0 | 1016 |

## Siti ufficiali

81 destinazioni su 100 hanno un soggetto proprio verificato. Le altre
usano la DMO regionale, che è chi quel territorio lo promuove davvero: un
dominio inventato al suo posto renderebbe inservibile la misura sulle fonti
ufficiali, che è la ragione per cui questa famiglia di siti esiste.

`fonte` distingue le due strade: **automatica** quando le regole in
`tools/verify/select-sites.mjs` hanno deciso da sole, **manuale** quando ha
deciso una persona. Le due cose non si confondono, perché una persona
sbaglia in modo diverso da uno script.

| Destinazione | Dominio | Soggetto | Fonte |
| :--- | :--- | :--- | :--- |
| Cinque Terre | `parconazionale5terre.it` | Parco Nazionale delle Cinque Terre | manuale |
| Costa Smeralda | `consorziocostasmeralda.com` | Main Home - Consorzio Costa Smeralda | automatica |
| Isola d'Elba | `visitelba.info` | Home - Visit Elba | automatica |
| Gargano | `parcogargano.it` | Ente parco nazionale del Gargano | automatica |
| Riviera Romagnola | `visitrimini.com` | Visit Rimini, società di destinazione | manuale |
| Taormina e Riviera dei Ciclopi | `comune.taormina.me.it` | Comune di Taormina | automatica |
| Riviera del Conero | `rivieradelconero.info` | Riviera del Conero nelle Marche | automatica |
| Costa Molisana | `comune.termoli.cb.it` | Comune di Termoli | automatica |
| San Vito Lo Capo e Trapanese | `riservazingaro.it` | HOME - Riserva Naturale Orientata Zingaro | automatica |
| Cilento | `cilentoediano.it` | Home - Parco Nazionale del Cilento, Vallo di Diano e Alburni | automatica |
| Dolomiti | `dolomitiunesco.info` | Dolomiti Patrimonio Mondiale UNESCO &#8211; Sito ufficiale delle | automatica |
| Cortina d'Ampezzo | `comune.cortinadampezzo.bl.it` | Comune di Cortina d'Ampezzo | automatica |
| Alta Badia | `altabadia.org` | Consorzio Turistico Alta Badia | manuale |
| Val Gardena | `valgardena.it` | Val Gardena Marketing | manuale |
| Madonna di Campiglio | `campigliodolomiti.it` | Azienda per il Turismo Campiglio Dolomiti S.p.A. | manuale |
| Courmayeur e Monte Bianco | `courmayeurmontblanc.it` | Courmayeur Mont Blanc Funivie / consorzio operatori | manuale |
| Parco Nazionale del Gran Paradiso | `pngp.it` | Parco Nazionale Gran Paradiso | automatica |
| Parco Nazionale d'Abruzzo | `parcoabruzzo.it` | Parco Nazionale d'Abruzzo, Lazio e Molise | automatica |
| Gran Sasso e Campo Imperatore | `gransassolagapark.it` | Parco Nazionale del Gran Sasso e Monti della Laga | automatica |
| Val di Fassa | `fassa.com` | Val di Fassa | automatica |
| Sila | `parcosila.it` | Parco Nazionale della Sila &#8211; Sito Ufficiale | automatica |
| Parco Nazionale del Pollino | `parcopollino.it` | Home - Parco Nazionale del Pollino | automatica |
| Monti Sibillini | `sibillini.net` | Parco Nazionale dei Monti Sibillini | automatica |
| Val Pusteria | `kronplatz.com` | Esperienze di prima classe ☀️ La Regione Dolomitica Plan de Coro | automatica |
| Alpe di Siusi | `seiseralm.it` | Alpe di Siusi | automatica |
| Livigno e Alta Valtellina | `livigno.eu` | APT Livigno | manuale |
| Foreste Casentinesi | `parcoforestecasentinesi.it` | Parco Nazionale Foreste Casentinesi | automatica |
| Etna | `parcoetna.it` | Parco dell'Etna - Parco dell'Etna | automatica |
| Langhe | `visitlmr.it` | Ente Turismo Langhe Monferrato Roero | manuale |
| Chianti Classico | `chianticlassico.com` | Chianti Classico - Il primo territorio di vino | automatica |
| Franciacorta | `visitlakeiseo.info` | Visit Lake Iseo | automatica |
| Valpolicella | `consorziovalpolicella.it` | Consorzio della Valpolicella - Landing | automatica |
| Montalcino | `consorziobrunellodimontalcino.it` | Consorzio del vino Brunello di Montalcino Montalcino | automatica |
| Montepulciano | `prolocomontepulciano.it` | Proloco Montepulciano - Proloco Montepulciano | automatica |
| Modena e Terre di Motori | `visitmodena.it` | Italiano - VisitModena | automatica |
| Conegliano Valdobbiadene | `visitconegliano.it` | Home - Visit Conegliano | automatica |
| Strada del Vino dell'Alto Adige | `suedtirol.info` | Alto Adige/Südtirol | automatica |
| Collio Goriziano | `collio.it` | Consorzio Collio | automatica |
| Monferrato | `monferrato.org` | Il Monferrato turismo e accoglienza | automatica |
| Roero | `visitlmr.it` | Ente Turismo Langhe Monferrato Roero | automatica |
| Maremma Toscana | `parco-maremma.it` | Home - Parco Maremma | automatica |
| Terre del Primitivo | `consorziotutelaprimitivo.com` | Consorzio di Tutela del Primitivo di Manduria DOC e DOCG | automatica |
| Irpinia | `irpinia.info` | www.irpinia.info: pagina d'ingresso del sito dedicato all'Irpini | automatica |
| Montefalco e Sagrantino | `stradadelsagrantino.it` | La Strada del Sagrantino | automatica |
| Roma | `turismoroma.it` | Roma Capitale | manuale |
| Firenze | `feelflorence.it` | Comune di Firenze | manuale |
| Venezia e Laguna | `veneziaunica.it` | Vela S.p.A., società in house del Comune di Venezia | manuale |
| Napoli | `comune.napoli.it` | Comune di Napoli | automatica |
| Matera | `materawelcome.it` | Comune di Matera | manuale |
| Val d'Orcia | `parcodellavaldorcia.com` | Val d'Orcia Patrimonio Mondiale | automatica |
| Pompei ed Ercolano | `pompeiisites.org` | Homepage - Pompeii Sites Portale Ufficiale Parco Archeologico di | automatica |
| Val di Noto | `comune.noto.sr.it` | Città di Noto | automatica |
| Ferrara e Delta del Po | `parcodeltapo.it` | Parco del Delta del Po - Regione Emilia - Romagna | automatica |
| Aquileia | `fondazioneaquileia.it` | Fondazione Aquileia | automatica |
| Siena | `terredisiena.it` | Visita le Terre di Siena: itinerari, borghi, terme e natura | automatica |
| Assisi | `visit-assisi.it` | Sito ufficiale di informazione turistica di Assisi - Visit Assis | automatica |
| Ravenna | `turismo.ra.it` | Ravenna Turismo | automatica |
| Alberobello e Valle d'Itria | `comune.alberobello.ba.it` | Comune di Alberobello | automatica |
| Valle dei Templi | `parcovalledeitempli.it` | Parco Valle dei Templi Agrigento | automatica |
| Verona | `visitverona.it` | VisitVerona.it | automatica |
| Sacri Monti | `sacrimonti.org` | Sacri Monti del Piemonte e della Lombardia | automatica |
| Mantova e Sabbioneta | `turismo.mantova.it` | Mantova | automatica |
| Tivoli | `visittivoli.it` | Visit Tivoli - Un viaggio unico tra storia, arte e natura! | automatica |
| Civita di Bagnoregio | `civitadibagnoregio.cloud` | Civita di Bagnoregio - "La città che Muore" | automatica |
| San Gimignano | `sangimignano.com` | Visitare San Gimignano | automatica |
| Castelmezzano e Dolomiti Lucane | `comune.castelmezzano.pz.it` | Sito istituzionale del Comune di Castelmezzano - Avvisi, Notizie | automatica |
| Ostuni | `comune.ostuni.br.it` | Comune di Ostuni &#8211; Sito istituzionale del Comune | automatica |
| Bosa | `comune.bosa.or.it` | Comune di Bosa | automatica |
| Spello | `comune.spello.pg.it` | Comune di Spello | automatica |
| Tropea | `comune.tropea.vv.it` | Comune di Tropea - Tropea | automatica |
| Vipiteno | `vipiteno.com` | Vacanza a Vipiteno in Alto Adige - Borghi più belli d`Italia | automatica |
| Orvieto | `comune.orvieto.tr.it` | Comune di Orvieto | automatica |
| Portovenere | `comune.portovenere.sp.it` | Comune di Porto Venere | automatica |
| Pitigliano | `comune.pitigliano.gr.it` | Comune di Pitigliano | automatica |
| Gradara | `gradara.org` | Sito ufficiale turismo, eventi e visite guidate al Castello di G | automatica |
| Castelsardo | `comune.castelsardo.ss.it` | Home page | automatica |
| Erice | `comune.erice.tp.it` | Città di Erice | automatica |
| Dozza | `comune.dozza.bo.it` | Dozza - Comune di Dozza | automatica |
| Varenna e Lago di Como | `comune.varenna.lc.it` | Comune di Varenna | automatica |
| Apricale | `comune.apricale.im.it` | Comune di Apricale | automatica |
| Sperlonga | `comune.sperlonga.lt.it` | Comune di Sperlonga | automatica |

### Perché alcuni sono stati decisi a mano

Lo script sa leggere una pagina, non sa che cosa sia una società in house.
Un consorzio di operatori e una S.r.l. qualsiasi hanno la stessa forma nel
footer e ruoli opposti nel territorio. Nei casi sotto la differenza l'ha
fatta una persona, e il motivo è scritto in `tools/verify/overrides.mjs`.

| Destinazione | Dominio | Perché |
| :--- | :--- | :--- |
| Cinque Terre | `parconazionale5terre.it` | ente parco |
| Riviera Romagnola | `visitrimini.com` | portale ufficiale di destinazione: più rappresentativo del solo comune di Riccione |
| Alta Badia | `altabadia.org` | consorzio degli operatori con mandato di promozione |
| Val Gardena | `valgardena.it` | società di destinazione dei tre comuni |
| Madonna di Campiglio | `campigliodolomiti.it` | azienda per il turismo d'ambito, partecipata pubblica |
| Courmayeur e Monte Bianco | `courmayeurmontblanc.it` | consorzio locale: la forma societaria non ne cambia il ruolo |
| Livigno e Alta Valtellina | `livigno.eu` | azienda di promozione turistica del comune |
| Langhe | `visitlmr.it` | ente turistico d'ambito |
| Roma | `turismoroma.it` | sito turistico ufficiale del comune |
| Firenze | `feelflorence.it` | portale ufficiale comunale |
| Venezia e Laguna | `veneziaunica.it` | in house comunale: forma privata, mandato pubblico |
| Matera | `materawelcome.it` | portale turistico comunale |

## Portali editoriali

Società private che raccontano il territorio. Sono spesso più citate dalle AI
del sito ufficiale, ed è uno dei risultati che l'osservatorio esiste per
misurare.

| Destinazione | Dominio | Soggetto |
| :--- | :--- | :--- |
| Costiera Amalfitana | `amalficoast.com` | Locali d'Autore S.r.l. |
| Salento | `salento.it` | Salento, offerte vacanze sul mare. Cosa visitare e vedere in Pug |
| Salento | `vivisalento.it` | VIVI SALENTO &#8211; DANIELA LOPEZ Y ROYO EVENTI E SEVIZI TURIST |
| Cinque Terre | `cinqueterre.eu.com` | nessuna ragione sociale dichiarata |
| Costa Smeralda | `costasmeralda.it` | Costa Smeralda: consigli, esperienze ed eventi (4) |
| Isola d'Elba | `infoelba.it` | Isola d'Elba: guida informazioni vacanze e turismo |
| Riviera Romagnola | `rivieraromagnola.it` | Riviera Romagnola: esperienze e itinerari di viaggio in Romagna |
| Taormina e Riviera dei Ciclopi | `taormina.it` | Taormina - Travel and Holidays - the Curiosities of Taormina |
| Taormina e Riviera dei Ciclopi | `visittaormina.it` | visittaormina.it |
| Golfo di Orosei | `dorgali.it` | Dorgali |
| Riviera Ligure di Ponente | `sanremo.it` | Sanremo enjoy Riviera & Côte d’Azur - luxury & lifestyle |
| Isola di Capri | `capritourism.com` | The Essential Guide for Exploring the Island of Capri |
| Isole Eolie | `isoleeolie.it` | ..: Isole Eolie - Le ISOLE EOLIE |
| Versilia | `visitviareggio.it` | visitviareggio.it |
| Ischia e Procida | `infoischiaprocida.it` | Traghetti Ischia: Prenotazione Biglietti Aliscafi da Napoli a Is |
| Ischia e Procida | `procida.info` | procida.info network |
| San Vito Lo Capo e Trapanese | `sanvitolocapo.info` | San Vito Lo Capo |
| San Vito Lo Capo e Trapanese | `trapanese.it` | trapanese.it |
| Dolomiti | `dolomiti.it` | DESTINATION S.r.l. |
| Cortina d'Ampezzo | `dolomiti.org` | Estate a Cortina d'Ampezzo |
| Cortina d'Ampezzo | `cortina.it` | Cortina d'Ampezzo |
| Alta Badia | `visitaltabadia.it` | Visit Alta Badia |
| Val Gardena | `visitvalgardena.it` | Visit Val Gardena |
| Cervinia e Valtournenche | `cervinia.it` | Cervino Ski Paradise |
| Parco Nazionale d'Abruzzo | `visitparcoabruzzo.it` | Accesso Portale - Visit Parco Abruzzo |
| Gran Sasso e Campo Imperatore | `visitgransasso.it` | visit gran sasso |
| Parco Nazionale dello Stelvio | `bormio.eu` | Bormio: terme, sci, Stelvio e vacanze in Alta Valtellina |
| Sila | `visitsila.it` | Home - visitsila |
| Sila | `silaturismo.it` | SwiteFrontendNg |
| Val Pusteria | `visitvalpusteria.it` | WordPress &#8211; WordPress Description |
| Livigno e Alta Valtellina | `bormio.eu` | Bormio: terme, sci, Stelvio e vacanze in Alta Valtellina |
| Etna | `etna.it` | Coming Soon |
| Langhe | `langhe.net` | LoveLanghe S.R.L. |
| Chianti Classico | `chianti.it` | Visita il Chianti in Toscana: borghi, itinerari, terme, natura e |
| Valpolicella | `valpolicella.it` | Home - Tavole della Valpolicella |
| Montalcino | `prolocomontalcino.com` | prolocomontalcino.com |
| Montalcino | `visitmontalcino.it` | visitmontalcino.it |
| Parma e Food Valley | `parmawelcome.it` | homepage - Informazioni turistiche su Parma e provincia |
| Parma e Food Valley | `parmafoodvalley.it` | parmafoodvalley.it |
| Conegliano Valdobbiadene | `prosecco.it` | Home - Prosecco.it — Conegliano Valdobbiadene DOCG |
| Conegliano Valdobbiadene | `coneglianovaldobbiadene.it` | Strada del Prosecco e Vini dei Colli Conegliano Valdobbiadene &# |
| Bolgheri | `bolgheridoc.com` | Consorzio per la Tutela dei Vini DOC Bolgheri e DOC Bolgheri Sas |
| Strada del Vino dell'Alto Adige | `suedtiroler-weinstrasse.it` | Südtiroler Weinstraße |
| Etna del Vino | `stradadelvinodelletna.it` | Strada Del Vino Dell'Etna |
| Vulture e Aglianico | `vulture.it` | Il portale turistico del Melfese |
| Monferrato | `monferrato.it` | Il Monferrato > Prima pagina |
| Roero | `roeroturismo.it` | Roero TURISMO |
| Maremma Toscana | `lamaremma.info` | lamaremma.info - Questo sito web è in vendita! - lamaremma Risor |
| Montefalco e Sagrantino | `visitmontefalco.it` | visitmontefalco |
| Roma | `visitroma.it` | Dominio in vendita |
| Firenze | `visitfirenze.it` | Dominio in vendita |
| Venezia e Laguna | `visitvenezia.it` | Dominio in vendita |
| Napoli | `visitnaples.eu` | Visit Naples Official - La guida della città di Napoli |
| Napoli | `visitnapoli.it` | Dominio in vendita |
| Matera | `materaturismo.it` | Visitare Matera: un viaggio emozionante nella storia dell’uomo |
| Val di Noto | `distrettoturisticosudest.it` | Distrettoturisticosudest.it - La Sicilia per il turista |
| Val di Noto | `visitvaldinoto.it` | Visit Val di Noto |
| Aquileia | `visitaquileia.it` | visitaquileia |
| Aquileia | `aquileia.it` | La Citt� di Aquileia |
| Urbino | `urbinoculturaturismo.it` | Urbino Sehenswürdigkeiten & Unterkünfte |
| Assisi | `assisi.it` | Assisi Store - Distributore materiale elettrico e per l'illumina |
| Ravenna | `ravennamosaici.it` | Ravenna Mosaici &#8211; Opera di Religione della Diocesi di Rave |
| San Gimignano | `sangimignano.it` | San Gimignano: trova hotel in base alle tue esigenze |
| Castelmezzano e Dolomiti Lucane | `volodellangelo.com` | Il Volo dell'Angelo |
| Bosa | `bosa.it` | Hosted By One.com |
| Bosa | `bosaturismo.it` | Info, spiagge, eventi Bosa e Bosa Marina (Costa Centro-Ovest Sar |
| Spello | `prospello.it` | Proloco Spello |
| Spello | `spello.it` | spello.it |
| Orvieto | `visitorvieto.it` | visitorvieto.it |
| Orvieto | `orvietoturismo.it` | Orvieto Turismo |
| Portovenere | `visitportovenere.it` | visitportovenere.it |
| Portovenere | `portovenereturismo.it` | Home |
| Castelsardo | `visitcastelsardo.it` | Coming soon... |
| Varenna e Lago di Como | `lakecomo.is` | Lago di Como |
| Sperlonga | `sperlonga.it` | Sperlonga e il suo mare: info utili su hotel, alberghi, campeggi |
| Sperlonga | `sperlongaturismo.it` | Sperlonga Turismo &#8211; Sperlonga Turismo |

## Strutture

Verificate il 2026-08-26. Tre livelli di certezza, dichiarati e
non confusi fra loro.

| Livello | Cosa significa | Quante |
| :--- | :--- | ---: |
| `verified` | Il dominio risponde e la pagina nomina la struttura | 1016 |
| `registry-web` | Iscritta a un registro pubblico regionale, con sito dichiarato | 3283 |
| `registry` | Iscritta a un registro pubblico regionale, senza sito | 1 |
| `chain` | Sta sul dominio di un gruppo: esiste, ma le scelte tecniche di quel dominio non sono dell'albergatore | 19 |
| `guarded` | Il dominio esiste e rifiuta i controlli automatici. Il sito c'è, la prova che sia questa struttura no | 3 |

### Le quattro strade

| Come sono state trovate | Quante |
| :--- | ---: |
| Registri pubblici regionali | 3284 |
| Domini plausibili provati, nome letto dal titolo | 339 |
| Scritte a mano e verificate | 697 |
| Link dai siti dei territori | 2 |

I **registri pubblici regionali** sono la fonte migliore: anagrafiche di
attività autorizzate, quindi provano l'esistenza senza bisogno di altro. Ne
esistono però solo per alcune regioni, ed è questo a determinare quali
territori risultano coperti e quali no. Non è una scelta editoriale, è
quello che le regioni pubblicano.

Nel dataset entrano al massimo venti strutture per destinazione, scelte
preferendo quelle su cui sappiamo di più. Le posizioni che restano scoperte
portano nomi generati, marcati come dimostrativi in ogni pagina.

### Per destinazione

Venti è il numero che entra nel dataset. La colonna "disponibili" dice
quante ne abbiamo trovate in tutto: dove supera venti, avanzano.

| Destinazione | Nel dataset | Disponibili |
| :--- | ---: | ---: |
| Val Gardena | 20 | 801 |
| Strada del Vino dell'Alto Adige | 20 | 596 |
| Alta Badia | 20 | 492 |
| Val Pusteria | 20 | 458 |
| Alpe di Siusi | 20 | 420 |
| Vipiteno | 20 | 196 |
| Parco Nazionale dello Stelvio | 20 | 76 |
| Assisi | 20 | 74 |
| Aquileia | 20 | 69 |
| Alberobello e Valle d'Itria | 20 | 53 |
| Ostuni | 20 | 52 |
| Langhe | 20 | 42 |
| Salento | 20 | 40 |
| Sacri Monti | 20 | 34 |
| Venezia e Laguna | 20 | 32 |
| Dolomiti | 20 | 28 |
| Ischia e Procida | 20 | 28 |
| Costa Smeralda | 20 | 27 |
| Verona | 20 | 27 |
| Parco Nazionale del Gran Paradiso | 20 | 25 |
| Roma | 20 | 25 |
| Monferrato | 20 | 23 |
| Roero | 20 | 23 |
| Costiera Amalfitana | 20 | 22 |
| Riviera Romagnola | 20 | 21 |
| Cortina d'Ampezzo | 19 | 19 |
| Isole Tremiti | 19 | 19 |
| Firenze | 18 | 18 |
| Gargano | 17 | 17 |
| Isola d'Elba | 17 | 17 |
| Napoli | 16 | 16 |
| Montepulciano | 15 | 15 |
| Terre del Primitivo | 15 | 15 |
| Cinque Terre | 14 | 14 |
| Isole Eolie | 14 | 14 |
| Modena e Terre di Motori | 14 | 14 |
| Taormina e Riviera dei Ciclopi | 14 | 14 |
| Isola di Capri | 13 | 13 |
| Ferrara e Delta del Po | 13 | 13 |
| Gran Sasso e Campo Imperatore | 13 | 13 |
| Tivoli | 13 | 13 |
| Castelsardo | 12 | 12 |
| Montalcino | 12 | 12 |
| Urbino | 12 | 12 |
| Chianti Classico | 11 | 11 |
| Cilento | 11 | 11 |
| Courmayeur e Monte Bianco | 11 | 11 |
| Etna | 11 | 11 |
| Livigno e Alta Valtellina | 11 | 11 |
| Matera | 11 | 11 |
| Varenna e Lago di Como | 11 | 11 |
| Valle dei Templi | 10 | 10 |
| Madonna di Campiglio | 10 | 10 |
| Franciacorta | 9 | 9 |
| Maremma Toscana | 9 | 9 |
| Ravenna | 9 | 9 |
| Riviera del Conero | 9 | 9 |
| Siena | 9 | 9 |
| Bolgheri | 8 | 8 |
| Montefalco e Sagrantino | 8 | 8 |
| Parma e Food Valley | 8 | 8 |
| Riviera Ligure di Ponente | 8 | 8 |
| Monti Sibillini | 8 | 8 |
| San Vito Lo Capo e Trapanese | 8 | 8 |
| Versilia | 8 | 8 |
| Foreste Casentinesi | 7 | 7 |
| Erice | 7 | 7 |
| Orvieto | 7 | 7 |
| Val di Fassa | 7 | 7 |
| Val di Noto | 7 | 7 |
| Castelmezzano e Dolomiti Lucane | 6 | 6 |
| Gradara | 6 | 6 |
| Pompei ed Ercolano | 6 | 6 |
| Tropea | 6 | 6 |
| Val d'Orcia | 6 | 6 |
| Conegliano Valdobbiadene | 6 | 6 |
| Bosa | 5 | 5 |
| Cervinia e Valtournenche | 5 | 5 |
| Golfo di Orosei | 5 | 5 |
| Portovenere | 5 | 5 |
| San Gimignano | 5 | 5 |
| Spello | 5 | 5 |
| Costa del Sud Sardegna | 5 | 5 |
| Valpolicella | 5 | 5 |
| Cividale del Friuli | 4 | 4 |
| Collio Goriziano | 4 | 4 |
| Costa Molisana | 4 | 4 |
| Etna del Vino | 4 | 4 |
| Irpinia | 4 | 4 |
| Pitigliano | 4 | 4 |
| Parco Nazionale del Pollino | 4 | 4 |
| Scanno | 4 | 4 |
| Parco Nazionale d'Abruzzo | 3 | 3 |
| Sila | 3 | 3 |
| Civita di Bagnoregio | 2 | 2 |
| Dozza | 2 | 2 |
| Mantova e Sabbioneta | 2 | 2 |
| Sperlonga | 2 | 2 |
| Vulture e Aglianico | 2 | 2 |
| Apricale | 1 | 1 |

### Le prime venti per destinazione

Sono quelle che entrano nel dataset. L'elenco completo delle 8.000 trovate
sta in `tools/seed/verified-hotels.mjs`.

| Destinazione | Struttura | Dominio | Certezza |
| :--- | :--- | :--- | :--- |
| Valle dei Templi | Villa Athena Resort | `hotelvillaathena.it` | verified |
| Valle dei Templi | Pietro Boutique Hotel | `pietrohotel.com` | verified |
| Valle dei Templi | Hotel Giardino | `giardinohotel.com` | verified |
| Valle dei Templi | Hotel Ristorante Giardino | `hotelgiardino.it` | verified |
| Valle dei Templi | Giardino hotel | `giardinohotel.it` | verified |
| Valle dei Templi | Albergo Giardino Desio Milano | `albergogiardino.com` | verified |
| Valle dei Templi | Hotel Concordia Venice | `hotelconcordia.com` | verified |
| Valle dei Templi | Hotel Concordia | `concordiahotel.it` | verified |
| Valle dei Templi | Agriturismo Corte Giardino | `cortegiardino.it` | verified |
| Valle dei Templi | Residence Giardino Montecreto | `residencegiardino.it` | verified |
| Alberobello e Valle d'Itria | Trulli Holiday Albergo Diffuso | `trulliholiday.com` | verified |
| Alberobello e Valle d'Itria | Grand Hotel La Chiusa di Chietri | `lachiusadichietri.it` | verified |
| Alberobello e Valle d'Itria | Hotel con Piscina a Igea Marina | `hotelfranca.com` | verified |
| Alberobello e Valle d'Itria | Hotel Martina established in 1866 | `albergomartina.com` | verified |
| Alberobello e Valle d'Itria | Albergo Martina, a Chiusaforte dal 1866 | `albergomartina.it` | verified |
| Alberobello e Valle d'Itria | Residence Martina Il posto migliore per | `residencemartina.it` | verified |
| Alberobello e Valle d'Itria | Trulli Resort Trulli Alberobello | `trulliresort.com` | verified |
| Alberobello e Valle d'Itria | Garni Hotel 3 stelle sup. Franca a Selva di | `garnifranca.com` | verified |
| Alberobello e Valle d'Itria | Cascina Martina | `cascinamartina.it` | verified |
| Alberobello e Valle d'Itria | Rifugio Martina | `rifugiomartina.com` | verified |
| Alberobello e Valle d'Itria | B&B Franca Napoli | `bbfranca.it` | verified |
| Alberobello e Valle d'Itria | Chalet Martina | `chaletmartina.it` | verified |
| Alberobello e Valle d'Itria | trulli alberobello, trulli con piscina | `bbalberobello.com` | verified |
| Alberobello e Valle d'Itria | Agriturismo Alberobello | `agriturismoalberobello.com` | verified |
| Alberobello e Valle d'Itria | B&B Antico Rione - Caltanissetta | `anticorione.it` | verified |
| Alberobello e Valle d'Itria | Agriturismo Paretano | `agriturismoparetano.it` | registry-web |
| Alberobello e Valle d'Itria | B. & B. "lo Smeraldo | `beblomeraldo.it` | registry-web |
| Alberobello e Valle d'Itria | Casa Albergo Sant'Antonio | `albergosantantonio.it` | registry-web |
| Alberobello e Valle d'Itria | Casa del Carbonaio | `miceleholidayhouses.it` | registry-web |
| Alberobello e Valle d'Itria | Casa Silvana | `casasilvanavacanze.it` | registry-web |
| Alpe di Siusi | Alpina Dolomites Lodge | `alpinadolomites.it` | verified |
| Alpe di Siusi | Tenuta Terra Rossa - B&B e ristorante a | `tenutaterrarossa.it` | verified |
| Alpe di Siusi | ABINEA Dolomiti Romantic SPA Hotel | `abinea.com` | registry-web |
| Alpe di Siusi | Activehotel Diana | `hotel-diana.it` | registry-web |
| Alpe di Siusi | ADLER Alpe | `adler-alpe.com` | registry-web |
| Alpe di Siusi | Maso Aichbühler | `aichbuehlerhof.com` | registry-web |
| Alpe di Siusi | Almhotel Zallinger | `zallinger.com` | registry-web |
| Alpe di Siusi | Alpe di Susi- App. Daniel | `alpedisusi.it` | registry-web |
| Alpe di Siusi | Alpenblick | `haus-alpenblick.net` | registry-web |
| Alpe di Siusi | Alpenhotel Panorama | `alpenhotelpanorama.it` | registry-web |
| Alpe di Siusi | Alphotel Panorama | `alphotel-panorama.com` | registry-web |
| Alpe di Siusi | Alpin Boutique Villa Gabriela | `villagabriela.com` | registry-web |
| Alpe di Siusi | Alpin-Residence Amadeus | `residenceamadeus.com` | registry-web |
| Alpe di Siusi | Am Platzl Living | `muse.holiday` | registry-web |
| Alpe di Siusi | Anger Living | `anger-living.com` | registry-web |
| Alpe di Siusi | Ansitz Zehentner | `zehentner.it` | registry-web |
| Alpe di Siusi | Apartamento Fill Paul | `fillpaul.com` | registry-web |
| Alpe di Siusi | Aparthotel Viktoria | `hotel-viktoria.it` | registry-web |
| Alpe di Siusi | Apartment Avea | `avea.bz` | registry-web |
| Alpe di Siusi | Apartment Bergweg | `bergweg.it` | registry-web |
| Alta Badia | Hotel La Perla | `hotel-laperla.it` | verified |
| Alta Badia | Hotel Gran Ander | `granander.it` | verified |
| Alta Badia | Hotel Garni Gardena *** a S. Cristina - Val | `hotelgardena.com` | verified |
| Alta Badia | Hotel Pizboe | `hotelpizboe.it` | verified |
| Alta Badia | Locanda Badia Casa Vacanza Castellabate | `locandabadia.it` | verified |
| Alta Badia | Apparthotel Sellaronda | `residencesellaronda.com` | verified |
| Alta Badia | Hotel Sella Ronda | `hotelsellaronda.it` | verified |
| Alta Badia | Zeppelin Hotel Tech: siti web, online | `zeppelinhotel.tech` | verified |
| Alta Badia | Hotel Antica Badia | `anticabadia.it` | verified |
| Alta Badia | Borgo Badia: Agriturismo casale con piscina | `borgobadia.it` | verified |
| Alta Badia | Chalet Corvara | `chaletcorvara.com` | verified |
| Alta Badia | Alpin Apartments Colfosco | `alpin-apartments.it` | registry-web |
| Alta Badia | Alpin b&b Villa Melisse | `villamelisse.it` | registry-web |
| Alta Badia | Alpine Hotel Ciasa Lara | `ciasalara.it` | registry-web |
| Alta Badia | Apartments Ciasa Elke | `elke.it` | registry-web |
| Alta Badia | Apartments Ciasa Linda | `ciasalinda.it` | registry-web |
| Alta Badia | Apartments Ciasa Medalghes - Agriturismo | `ciasa-medalghes.it` | registry-web |
| Alta Badia | Apartments Clivus | `clivus.t` | registry-web |
| Alta Badia | Apartments dalaNat | `dalanat.it` | registry-web |
| Alta Badia | Apartments Feur - Agriturismo | `feurhof.com` | registry-web |
| Apricale | Agriturismo Dolceacqua | `agriturismodolceacqua.it` | verified |
| Aquileia | Hotel Grado | `hotelgrado.it` | verified |
| Aquileia | Hotel Metropole | `gradohotel.com` | verified |
| Aquileia | Basilica Holiday Resort in Paphos Cyprus | `basilicaresort.com` | verified |
| Aquileia | Basilica Hotel | `basilicahotel.it` | verified |
| Aquileia | Hotel Basilica - Boutique & Design Hotel in | `hotelbasilica.com` | verified |
| Aquileia | Rifugio Aquileia | `rifugioaquileia.it` | verified |
| Aquileia | Bellavista | `emmeti.it` | registry-web |
| Aquileia | Villa Venezia | `hotelvillavenezia.it` | registry-web |
| Aquileia | Eliani Meuble' | `hoteleliani-grado.com` | registry-web |
| Aquileia | Hannover | `hotelhannover.com` | registry-web |
| Aquileia | Euro Meuble' | `euromeuble.it` | registry-web |
| Aquileia | Grand Hotel Astoria | `hotelastoria.it` | registry-web |
| Aquileia | Sirenetta | `hotelsirenetta.net` | registry-web |
| Aquileia | Ville Bianchi Stella Maris | `villebianchi.it` | registry-web |
| Aquileia | Villa Rosa | `hotelvillarosa-grado.it` | registry-web |
| Aquileia | Villa Reale | `hotelvillareale.com` | registry-web |
| Aquileia | Villa Mirella | `villamirellagrado.it` | registry-web |
| Aquileia | Villa Patrizia Meuble' | `hotelvillapatrizia.com` | registry-web |
| Aquileia | Villa Erica | `hotelvillaerica.com` | registry-web |
| Aquileia | Villa Marin | `villamarin.it` | registry-web |
| Assisi | Nun Assisi Relais | `nunassisi.com` | verified |
| Assisi | Hotel Subasio | `hotelsubasio.com` | verified |
| Assisi | Hotel Giotto Assisi | `hotelgiottoassisi.it` | verified |
| Assisi | Hotel Porziuncola | `hotelporziuncola.it` | verified |
| Assisi | Ristorante Hotel Maggiore | `albergomaggiore.it` | verified |
| Assisi | Residence Maggiore | `residencemaggiore.it` | verified |
| Assisi | Albergo Assisi | `albergoassisi.it` | verified |
| Assisi | Assisi Resort armonia e bellezza | `assisiresort.it` | verified |
| Assisi | Villa Barbarossa | `villabarbarossa.it` | verified |
| Assisi | Villa Luce Assisi Rooms & Suites | `villaluceassisi.it` | verified |
| Assisi | Resort con piscina ad Assisi | `villamena.info` | verified |
| Assisi | Villa Raffaello Park Hotel Eleganza e comodità | `villaraffaelloassisi.it` | verified |
| Assisi | Locanda Giustini Assisi | `locandagiustini.com` | verified |
| Assisi | Ostello Della Pace, Assisi | `ostelloassisi.com` | verified |
| Assisi | Agriturismo | `ilcasaledellaquercia.it` | verified |
| Assisi | Hotel Roma Assisi | `assisihotelroma.com` | verified |
| Assisi | Agriturismo Villa Gabbiano ad Assisi | `villagabbiano.it` | verified |
| Assisi | Hotel Sole | `assisihotelsole.com` | verified |
| Assisi | Hotel San Rufino Assisi | `hotelsanrufino.it` | verified |
| Assisi | Hotel Properzio | `hotelproperzioassisi.it` | verified |
| Bolgheri | Relais Sant'Elena | `relaissantelena.it` | verified |
| Bolgheri | Villa Carducci | `villacarducci.it` | verified |
| Bolgheri | Hotel Carducci - Hotel sul mare per vacanze a | `hotelcarducci.it` | verified |
| Bolgheri | Viale Boutique Hotel Villány | `hotelviale.com` | verified |
| Bolgheri | Dimora storica Lecce: Palazzo Guido | `palazzoguido.com` | verified |
| Bolgheri | Agriturismo Carducci Monte San Martino | `agriturismocarducci.it` | verified |
| Bolgheri | Agriturismo Il Castagneto | `agriturismocastagneto.it` | verified |
| Bolgheri | Residence Carducci | `residencecarducci.it` | verified |
| Bosa | Hotel Malaspina | `hotelmalaspina.it` | verified |
| Bosa | Club Malaspina Hotel & Resort Hotel Bosa | `hotelmalaspina.com` | verified |
| Bosa | Residence a Bosa | `residencebosa.it` | verified |
| Bosa | Malvasia Suites | `malvasiasuites.it` | verified |
| Bosa | Frontpage | `cortemalaspina.it` | verified |
| Isola di Capri | Capri Palace Jumeirah | `jumeirah.com` | chain |
| Isola di Capri | Hotel Punta Tragara | `hoteltragara.com` | guarded |
| Isola di Capri | JK Place Capri | `jkcapri.com` | verified |
| Isola di Capri | Grand Hotel Quisisana | `quisisana.com` | verified |
| Isola di Capri | Villa Marina Capri | `villamarinacapri.com` | verified |
| Isola di Capri | Residence Capri | `residencecapri.com` | verified |
| Isola di Capri | Hotel Anacapri | `hotelanacapri.com` | verified |
| Isola di Capri | Solaro Hotel & Spa | `solarohotel.com` | verified |
| Isola di Capri | RESIDENCE AZZURRA - Affitto, acquisto e | `residenceazzurra.com` | verified |
| Isola di Capri | Hotel Capri Sorrento | `albergocapri.it` | verified |
| Isola di Capri | Hotel Azzurra | `azzurrahotel.it` | verified |
| Isola di Capri | Capri B&B - Experience your unforgettable | `capribb.com` | verified |
| Isola di Capri | Dimora Azzurra | `dimoraazzurra.it` | verified |
| Foreste Casentinesi | Forestè Resort | `foresteresort.com` | verified |
| Foreste Casentinesi | Hotel Ristorante Poppi | `hotelpoppi.com` | verified |
| Foreste Casentinesi | Hotel Cascata Via Aspettiamo | `hotelcascata.it` | verified |
| Foreste Casentinesi | Hotel Verna | `hotelverna.it` | verified |
| Foreste Casentinesi | Poppi Suites - Suite di Lusso nel Cuore di | `poppisuites.it` | verified |
| Foreste Casentinesi | Casa rural boutique en Murcia | `casaverna.com` | verified |
| Foreste Casentinesi | Residence Corte Camaldoli sul Lago di Garda | `cortecamaldoli.it` | verified |
| Castelmezzano e Dolomiti Lucane | Locanda dell&#x27;Angelo Paracucchi | `locandadellangelo.com` | verified |
| Castelmezzano e Dolomiti Lucane | Residence Ospedaletti Liguria appartamenti | `residencedellangelo.it` | verified |
| Castelmezzano e Dolomiti Lucane | Family Hotel a Rimini a 100 metri dal mare | `hoteldellangelo.it` | verified |
| Castelmezzano e Dolomiti Lucane | Hotel dellAngelo | `hoteldellangelo.com` | verified |
| Castelmezzano e Dolomiti Lucane | B&B Dimora Normanna San Vito dei Normanni | `dimoranormanna.it` | verified |
| Castelmezzano e Dolomiti Lucane | Borgo dellAngelo B&B Boutique Apartments | `borgodellangelo.it` | verified |
| Castelsardo | Locanda SantAntonio - Bed and Breakfast | `locandasantantonio.com` | verified |
| Castelsardo | Villa SantAntonio | `villasantantonio.com` | verified |
| Castelsardo | Santantonio Resort | `santantonioresort.it` | verified |
| Castelsardo | SantAntonio Hotel | `santantoniohotel.it` | verified |
| Castelsardo | Residence SantAntonio a Gramignazzo di Sissa | `residencesantantonio.it` | verified |
| Castelsardo | Hotel SantAntonio | `hotelsantantonio.it` | verified |
| Castelsardo | Locanda dellElefante | `locandadellelefante.com` | verified |
| Castelsardo | Relais SantAntonio Charme, confort e natura | `relaissantantonio.it` | verified |
| Castelsardo | Hotel Villaggio S.Antonio | `santantoniohotel.com` | verified |
| Castelsardo | Castelsardo Resort Castelsardo Resort | `castelsardoresort.it` | verified |
| Castelsardo | Agriturismo Volterra, Podere SantAntonio | `agriturismosantantonio.com` | verified |
| Castelsardo | B&B The Sisters - Castelsardo | `bbcastelsardo.com` | verified |
| Cervinia e Valtournenche | Hotel Hermitage | `hotelhermitage.com` | verified |
| Cervinia e Valtournenche | hotelcervinia.it - Questo sito web è in | `hotelcervinia.it` | verified |
| Cervinia e Valtournenche | Residence Cervino - Appartamenti Cervino | `residencecervino.it` | verified |
| Cervinia e Valtournenche | Plateau Suites Montreal | `plateausuites.com` | verified |
| Cervinia e Valtournenche | Hotel Plateau | `hotelplateau.com` | verified |
| Chianti Classico | Castello di Ama | `castellodiama.com` | verified |
| Chianti Classico | Castello del Nero | `comohotels.com` | chain |
| Chianti Classico | Villa Le Barone | `villalebarone.com` | verified |
| Chianti Classico | Borgo San Felice | `borgosanfelice.it` | verified |
| Chianti Classico | Hotel Gallo & La Dolce Vita Relais | `hotelgallo.com` | verified |
| Chianti Classico | Relais il Gallo | `relaisgallo.it` | verified |
| Chianti Classico | Hotel Gallo Nero, SantAndrea, Isola dElba | `hotelgallonero.it` | verified |
| Chianti Classico | Agriturismo Gallo | `agriturismogallo.com` | verified |
| Chianti Classico | Agriturismo Gallo Nero L AGRITURISMO GALLO | `agriturismogallonero.it` | verified |
| Chianti Classico | Hotel nel Chianti | `parkhotelchianti.it` | verified |
| Chianti Classico | B&B Casa Certosa | `bbchianti.com` | verified |
| Cilento | Hotel La Certosa – Hotel tre stelle sul mare | `hotelcertosa.com` | verified |
| Cilento | hotelpalinuro.com - Questo sito web è in | `hotelpalinuro.com` | verified |
| Cilento | Residence Paestum, appartamenti nel Cilento | `residencepaestum.it` | verified |
| Cilento | Cilento Resort Velia | `cilentoresort.com` | verified |
| Cilento | Hotel e alberghi per vacanze nel Cilento | `cilentohotel.it` | verified |
| Cilento | Residence a Marina di Camerota vicino al Mare | `residencecilento.it` | verified |
| Cilento | Palinuro Hotel | `palinurohotel.it` | verified |
| Cilento | B&B a Paestum sul mare - Villa Paestum | `villapaestum.it` | verified |
| Cilento | Hotel Cilento - Portale del turismo e vacanze | `hotelcilento.it` | verified |
| Cilento | Rifugio Cervati 1597 m Piaggine | `rifugiocervati.it` | verified |
| Cilento | Hotel 3 Stelle per Vacanze a Marina di | `parkhotelcilento.it` | verified |
| Cinque Terre | Hotel Porto Roca | `portoroca.it` | verified |
| Cinque Terre | La Torretta Lodge | `torrettas.com` | verified |
| Cinque Terre | Hotel Pasquale | `hotelpasquale.it` | verified |
| Cinque Terre | Residence Azzurro | `residenceazzurro.com` | verified |
| Cinque Terre | Hotel Azzurro | `azzurrohotel.it` | verified |
| Cinque Terre | Hotel Margherita - Monterosso al Mare | `hotelmonterosso.it` | verified |
| Cinque Terre | Resort Cinque Terre e Charter Nautico nel | `resortcinqueterre.it` | verified |
| Cinque Terre | Suite B&B di design a Ortigia, Siracusa | `cinquesuites.com` | verified |
| Cinque Terre | Chalet Azzurro | `chaletazzurro.it` | verified |
| Cinque Terre | lAgriturismo | `agriturismoazzurro.it` | verified |
| Cinque Terre | Bio Agriturismo Monterosso | `agriturismomonterosso.com` | verified |
| Cinque Terre | Agriturismo Monterosso a Rossiglione | `agriturismomonterosso.it` | verified |
| Cinque Terre | cinqueterrecamere.com - Vernazza | `cinqueterrecamere.com` | verified |
| Cinque Terre | B&B Cinqueterre tra il Filo di Arianna | `bbcinqueterre.it` | verified |
| Cividale del Friuli | Hotel Friuli - Hotel Garden | `hotelfriuli.it` | verified |
| Cividale del Friuli | Hotel Colli | `hotelcolli.com` | verified |
| Cividale del Friuli | LOCANDA AL CASTELLO di BALLOCH ALBINO & C. S.A.S. | `alcastello.net` | registry-web |
| Cividale del Friuli | Locanda al Pomo D'Oro | `alpomodoro.com` | registry-web |
| Civita di Bagnoregio | Agriturismo Bonaventura | `agriturismobonaventura.it` | verified |
| Civita di Bagnoregio | Rifugio Porta | `rifugioporta.com` | verified |
| Collio Goriziano | Felcaro (dipendenza "c") | `hotelfelcaro.it` | registry-web |
| Collio Goriziano | Da Gon | `hoteldagon.it` | registry-web |
| Collio Goriziano | Alla Pergola | `albergoristoranteallapergola.it` | registry-web |
| Collio Goriziano | La Subida | `lasubida.it` | registry-web |
| Cortina d'Ampezzo | Grand Hotel Savoia Cortina | `grandhotelsavoiacortina.it` | verified |
| Cortina d'Ampezzo | Hotel de Len | `hoteldelen.it` | verified |
| Cortina d'Ampezzo | Rosapetra Spa Resort | `rosapetracortina.it` | verified |
| Cortina d'Ampezzo | Faloria Mountain Spa Resort | `faloriasparesort.com` | verified |
| Cortina d'Ampezzo | residenceitalia.it - Questo sito web è in | `residenceitalia.it` | verified |
| Cortina d'Ampezzo | Albergo Italia | `albergoitalia.it` | verified |
| Cortina d'Ampezzo | Hotel Cortina d’Ampezzo | `hotelcortina.com` | verified |
| Cortina d'Ampezzo | Appartamenti casevacanze, Residence Italia di | `residenceitalia.com` | verified |
| Cortina d'Ampezzo | Boutique Hotel Corso | `corsohotel.com` | verified |
| Cortina d'Ampezzo | Hotel Corso Alassio Albergo vicino al Mare | `hotelcorso.it` | verified |
| Cortina d'Ampezzo | Hotel Ristorante Italia | `hotelristoranteitalia.com` | verified |
| Cortina d'Ampezzo | Hotel di lusso sul Lago Maggiore a Cannero | `parkhotelitalia.com` | verified |
| Cortina d'Ampezzo | Masseria Italia | `masseriaitalia.com` | verified |
| Cortina d'Ampezzo | Holiday Rentals in Italy | `dimoraitalia.com` | verified |
| Cortina d'Ampezzo | B&B Italia - BB Roma Bed & Breakfast a | `bbitalia.it` | verified |
| Cortina d'Ampezzo | Chalet Corso a San Vigilio | `chaletcorso.com` | verified |
| Cortina d'Ampezzo | Visita il | `corsoitaliasuites.com` | verified |
| Cortina d'Ampezzo | Faloria Hotel, Apartments & Bistrò a Moena | `hotelfaloria.it` | verified |
| Cortina d'Ampezzo | Park Hotel Italia | `parkhotelitalia.it` | verified |
| Costa Molisana | Boutique Hotel Borgo | `hotelborgo.com` | verified |
| Costa Molisana | La Locanda del Borgo, Locanda Rotecastello | `locandaborgo.com` | verified |
| Costa Molisana | Relais del Borgo | `relaisborgo.it` | verified |
| Costa Molisana | Hotel Termoli | `hoteltermoli.com` | verified |
| Costa Smeralda | Hotel Costa Bergamo | `hotelcosta.com` | verified |
| Costa Smeralda | SardiniaHotel.it | `sardiniahotel.it` | verified |
| Costa Smeralda | Albergo Smeralda | `albergosmeralda.it` | verified |
| Costa Smeralda | Relais Maddalena | `relaismaddalena.com` | verified |
| Costa Smeralda | RESIDENCE I CORMORANI BIS | `residencesardinia.it` | verified |
| Costa Smeralda | Hotel Excelsior Maddalena | `maddalenahotel.com` | verified |
| Costa Smeralda | Hotel Maddalena Riccione 3 stelle Superior | `hotelmaddalena.com` | verified |
| Costa Smeralda | Hotel Capriccioli | `hotelcapriccioli.it` | verified |
| Costa Smeralda | Hotel Maddalena 2 Stelle Marina di Ravenna | `albergomaddalena.it` | verified |
| Costa Smeralda | Residence sul Mare Alba Adriatica Abruzzo | `residencecosta.it` | verified |
| Costa Smeralda | Hotel Principe Albergo a Pietra Ligure | `albergoprincipe.it` | verified |
| Costa Smeralda | Hotel Principe Firenze | `hotelprincipe.com` | verified |
| Costa Smeralda | Grand Hotel Spiaggia Alassio | `spiaggiahotel.it` | verified |
| Costa Smeralda | Residence Baja Sardinia | `residencebajasardinia.it` | verified |
| Costa Smeralda | Hotel Bibione fronte mare con Piscina | `principehotel.it` | verified |
| Costa Smeralda | HOTEL PORTO GANDIA | `hotelporto.com` | verified |
| Costa Smeralda | Pesaro Hotel con Piscina 3 Stelle sul Mare | `hotelspiaggia.com` | verified |
| Costa Smeralda | Hotel 3 stelle Cortina d’Ampezzo | `hotelprincipe.it` | verified |
| Costa Smeralda | Hotel Cervo Malpensa | `hotelcervo.it` | verified |
| Costa Smeralda | B&B COSTA | `bbcosta.com` | verified |
| Costiera Amalfitana | Le Sirenuse | `sirenuse.it` | guarded |
| Costiera Amalfitana | Il San Pietro di Positano | `ilsanpietro.it` | verified |
| Costiera Amalfitana | Hotel Santa Caterina | `hotelsantacaterina.it` | verified |
| Costiera Amalfitana | Palazzo Avino | `palazzoavino.com` | verified |
| Costiera Amalfitana | Hotel Marina Riviera | `marinariviera.it` | verified |
| Costiera Amalfitana | Villa Franca Positano | `villafrancahotel.it` | verified |
| Costiera Amalfitana | Casa Angelina | `casangelina.com` | verified |
| Costiera Amalfitana | villahotel.com - Questo sito web è in | `villahotel.com` | verified |
| Costiera Amalfitana | Hotel Villa ****S Il tuo hotel a Bisceglie | `hotelvilla.it` | verified |
| Costiera Amalfitana | Villa Fiorentino Positano | `positanoresort.com` | verified |
| Costiera Amalfitana | Locanda Positano | `locandapositano.com` | verified |
| Costiera Amalfitana | Hotel Villa Cimbrone - Ravello - Amalfi Coast | `hotelvillacimbrone.com` | verified |
| Costiera Amalfitana | Amalfi Resort Rooms and suites with swimming | `amalfiresort.it` | verified |
| Costiera Amalfitana | Residence Amalfi Lido di Savio Appartamenti | `residenceamalfi.it` | verified |
| Costiera Amalfitana | Hotel a Desio | `hotelamalfi.it` | verified |
| Costiera Amalfitana | Hotel Luna Convento | `lunahotel.it` | verified |
| Costiera Amalfitana | Casa Costiera | `casacostiera.com` | verified |
| Costiera Amalfitana | Bed & Breakfast in Tacoma, WA ❘ The Villa Bed | `villabb.com` | verified |
| Costiera Amalfitana | Bed & Breakfast - Guest House Cuneo | `anticavilla.it` | verified |
| Costiera Amalfitana | Anticavilla | `anticavilla.com` | verified |
| Courmayeur e Monte Bianco | Grand Hotel Royal e Golf | `hotelroyalegolf.com` | verified |
| Courmayeur e Monte Bianco | Le Massif Courmayeur | `lemassifcourmayeur.com` | verified |
| Courmayeur e Monte Bianco | Auberge de La Maison | `aubergemaison.it` | verified |
| Courmayeur e Monte Bianco | Residence Emile Rey | `residencecourmayeur.com` | verified |
| Courmayeur e Monte Bianco | Hotel Courmayeur - Hotel in Valle dAosta | `hotelcourmayeur.it` | verified |
| Courmayeur e Monte Bianco | Locanda | `locandapunta.com` | verified |
| Courmayeur e Monte Bianco | hotel bianco, hotel montagna vicino Milano | `biancohotel.it` | verified |
| Courmayeur e Monte Bianco | Albergo Val Veny | `albergovalveny.it` | verified |
| Courmayeur e Monte Bianco | Hotel Aigle Courmayeur Mont Blanc Sito web | `hotelaigle.it` | verified |
| Courmayeur e Monte Bianco | Chalet Ferret | `chaletferret.com` | verified |
| Courmayeur e Monte Bianco | Borgobianco Resort & SPA | `borgobianco.it` | verified |
| Dolomiti | Rosa Alpina Hotel & Spa | `rosalpina.it` | verified |
| Dolomiti | Hotel Ciasa Salares | `ciasasalares.it` | verified |
| Dolomiti | Forestis Dolomites | `forestis.it` | verified |
| Dolomiti | Excelsior Dolomites Life Resort | `myexcelsior.com` | verified |
| Dolomiti | Albergo Sella | `albergosella.it` | verified |
| Dolomiti | Residence Sassolungo | `residencesassolungo.it` | verified |
| Dolomiti | Hotel Dolomiti | `hoteldolomiti.it` | verified |
| Dolomiti | Relais Dolomiti nel cuore del Trentino | `relaisdolomiti.it` | verified |
| Dolomiti | Hotel Misurina | `lavaredohotel.it` | verified |
| Dolomiti | Dimora Sella | `dimorasella.com` | verified |
| Dolomiti | Rifugio Vittorio Sella al Lauson | `rifugiosella.com` | verified |
| Dolomiti | rifugiosella.it Rifugio Sella al Lago Grande | `rifugiosella.it` | verified |
| Dolomiti | Rifugio Lavaredo Tre Cime di Lavaredo | `rifugiolavaredo.com` | verified |
| Dolomiti | Chalet Sole delle Dolomiti - Exclusive | `chaletdolomiti.com` | verified |
| Dolomiti | Chalet Dolomiti Chalet & Spa Privata | `chaletdolomiti.it` | verified |
| Dolomiti | Agriturismo Cascina Dolomiti | `cascinadolomiti.it` | verified |
| Dolomiti | Agriturismo Dolomiti di Gioia e Luigi | `agriturismodolomiti.com` | verified |
| Dolomiti | Hotel Juventus | `dolomitihotel.it` | verified |
| Dolomiti | Alpenchalet Dolomiten | `airbnb.de` | registry-web |
| Dolomiti | Apartment Mittermanting | `apartment-mittermanting.com` | registry-web |
| Dozza | Dozza Hotel | `dozzahotel.it` | verified |
| Dozza | Design Hotel a Lucca | `palazzodipinto.com` | verified |
| Erice | Hotel Elimo | `hotelelimo.it` | verified |
| Erice | Hotel 4 stelle Montecatini Terme | `hoteltorretta.it` | verified |
| Erice | Grand Hotel Villa Torretta | `villatorretta.it` | verified |
| Erice | Hotel 4 Stelle a Bormio per Vacanze Attive | `hotelfunivia.it` | verified |
| Erice | Hotel Funivia Courmayeur | `hotelfunivia.com` | verified |
| Erice | Hotel Erice *** Agordo | `hotelerice.it` | verified |
| Erice | Masseria Madre | `masseriamadre.com` | verified |
| Etna | Monaci delle Terre Nere | `monacidelleterrenere.it` | verified |
| Etna | Shalai Resort | `shalai.it` | verified |
| Etna | Hotel Ferrovia a Calalzo di Cadore | `hotelferrovia.it` | verified |
| Etna | Hotel al Colosseo | `hotelvalle.it` | verified |
| Etna | Fam. Silvestri Livigno | `hotelsilvestri.it` | verified |
| Etna | Hotel Riccione Riviera Adriatica | `hoteletna.com` | verified |
| Etna | Hotel Etna, Giarre | `etnahotel.it` | verified |
| Etna | Hotel Etna Hotel 3 stelle a Caorle | `hoteletna.it` | verified |
| Etna | Hotel Etna Hotel Lignano Sabbiadoro Albergo 3 | `albergoetna.it` | verified |
| Etna | Valle B&B Larte di accogliere | `vallebb.com` | verified |
| Etna | Hotel, Ristorante, Bar e Pizzeria sullEtna | `rifugiosapienza.com` | verified |
| Etna del Vino | Hotel Castiglione Lignano hotel a Lignano | `castiglionehotel.it` | verified |
| Etna del Vino | HotelRistoranteSicilia | `hotelristorantesicilia.it` | verified |
| Etna del Vino | Palazzo Castiglione Art & Relais Amalfi Coast | `palazzocastiglione.com` | verified |
| Etna del Vino | Agriturismo Castiglione della Pescaia vacanze | `agriturismocastiglione.com` | verified |
| Ferrara e Delta del Po | Hotel Annunziata | `annunziata.it` | verified |
| Ferrara e Delta del Po | Hotel Duchessa Isabella | `duchessaisabella.it` | verified |
| Ferrara e Delta del Po | Delta Hotel | `deltahotel.com` | verified |
| Ferrara e Delta del Po | Locanda Ferrara | `locandaferrara.com` | verified |
| Ferrara e Delta del Po | Bed Breakfast & Home Restaurant Relais | `relaisdelta.it` | verified |
| Ferrara e Delta del Po | Hotel Delta Montevarchi vicino Arezzo Firenze | `hoteldelta.it` | verified |
| Ferrara e Delta del Po | Hotel Diamanti | `hoteldiamanti.com` | verified |
| Ferrara e Delta del Po | Hotel Comacchio - Codigoro - Ferrara | `hotelcomacchio.it` | verified |
| Ferrara e Delta del Po | Hotel Estense Rimini Hotel Estense Rimini | `estensehotel.it` | verified |
| Ferrara e Delta del Po | Chalet Delta | `chaletdelta.com` | verified |
| Ferrara e Delta del Po | Agriturismo Ferrara B&B | `agriturismoferrara.it` | verified |
| Ferrara e Delta del Po | Ferrara Rooms | `ferrararooms.it` | verified |
| Ferrara e Delta del Po | Agriturismo Comacchio: il b&b a Comacchio in | `agriturismocomacchio.com` | verified |
| Firenze | Four Seasons Hotel Firenze | `fourseasons.com` | chain |
| Firenze | Portrait Firenze | `lungarnocollection.com` | chain |
| Firenze | Hotel Davanzati | `hoteldavanzati.it` | verified |
| Firenze | Palazzo Vecchietti | `palazzovecchietti.com` | verified |
| Firenze | Hotel Calimala | `hotelcalimala.com` | verified |
| Firenze | Grand Hotel Cavour | `hotelcavour.com` | verified |
| Firenze | Hotel Brunelleschi | `hotelbrunelleschi.it` | verified |
| Firenze | Villa Cora | `villacora.it` | verified |
| Firenze | Hotel Orto de' Medici | `ortodeimedici.it` | verified |
| Firenze | Albergo Pontevecchio | `albergopontevecchio.com` | verified |
| Firenze | Hotel Ponte a Vieste il tuo hotel sul Gargano | `pontehotel.it` | verified |
| Firenze | Scopri Hotel Relais Uffizi | `relaisuffizi.it` | verified |
| Firenze | Hotel Duomo Firenze | `hotelduomofirenze.it` | verified |
| Firenze | Experience Luxury at Galleria Hotel | `galleriahotel.com` | verified |
| Firenze | Hotel in Venice on the Grand Canal Hotel | `hotelgalleria.it` | verified |
| Firenze | Hotel a Brenzone sul Lago di Garda | `hotelfirenze.com` | verified |
| Firenze | Benvenuto | `rifugiofirenze.com` | verified |
| Firenze | Ponte Vecchio Suites & SPA | `pontevecchiosuites.com` | verified |
| Franciacorta | L'Albereta Relais & Châteaux | `albereta.it` | verified |
| Franciacorta | Hotel Sebino a Sarnico | `hotelsebino.com` | verified |
| Franciacorta | Accoglienza autentica nel cuore della | `hotelfranciacorta.it` | verified |
| Franciacorta | Relais Franciacorta Hotel e Ristorante in | `relaisfranciacorta.it` | verified |
| Franciacorta | Suite Hotel Lake & More | `lakeandmorehotel.it` | verified |
| Franciacorta | Iseo Lago Hotel - Stacca la spina e riaccendi | `iseolagohotel.it` | verified |
| Franciacorta | Appartamenti sul Lago dIseo | `familybikeresidence.it` | verified |
| Franciacorta | Rifugio Iseo | `rifugioiseo.it` | verified |
| Franciacorta | B&B nel cuore di Franciacorta | `franciacortarooms.it` | verified |
| Gargano | Monte Sant’Angelo — Guida indipendente al | `santangelohotel.it` | verified |
| Gargano | Santangelo Resort & Spa Penisola Sorrentina | `resortsantangelo.it` | verified |
| Gargano | Hotel Sant Angelo, Roma | `hotelsantangelo.it` | verified |
| Gargano | Santangelo Hotel Ristorante Pizzeria Monte | `hotelsantangelo.com` | verified |
| Gargano | Hotel Umbra Assisi | `hotelumbra.it` | verified |
| Gargano | Hotel Peschici 3 Stelle per Soggiorni in | `hotelpeschici.it` | verified |
| Gargano | GarganoResort.it – dominio premium per resort | `garganoresort.it` | verified |
| Gargano | Villa vacanze nel Gargano appartamenti bed & | `villagargano.com` | verified |
| Gargano | Hotel Gargano | `hotelgargano.it` | verified |
| Gargano | Isole Tremiti HOTEL LA VELA albergo con | `hotel-lavela.it` | verified |
| Gargano | Isole Tremiti Albergo Rossana Isola di San | `isoletremitialbergorossana.it` | verified |
| Gargano | L’Hotel Gabbiano: la terrazza delle Tremiti | `hotel-gabbiano.com` | verified |
| Gargano | Hotel Isole Tremiti | `albergolapineta.info` | verified |
| Gargano | Agriturismo Sant’Angelo Acquapendente | `agriturismosantangelo.it` | verified |
| Gargano | Masseria SantAngelo - Masseria con Ristorante | `masseriasantangelo.it` | verified |
| Gargano | B&B Vieste Centro | `viesterooms.it` | verified |
| Gargano | Palazzo Gargano | `palazzogargano.it` | verified |
| Golfo di Orosei | Hotel Orosei | `hotelorosei.it` | verified |
| Golfo di Orosei | Rifugio del Golfo - Directory dei migliori | `albergogolfo.it` | verified |
| Golfo di Orosei | Hotel Cala Gonone | `calalunahotel.com` | verified |
| Golfo di Orosei | Rifugio Gorropu Turismo Rurale, Escursioni | `rifugiogorropu.it` | verified |
| Golfo di Orosei | Calaluna Rooms Affittacamere Porto Cesareo | `bbcalaluna.it` | verified |
| Gradara | Hotel 3 stelle a Igea Marina | `hotelfrancesca.it` | verified |
| Gradara | Hotel Bellaria 3 stelle direttamente sul mare | `hotelgradara.com` | verified |
| Gradara | Podere Bosco: Agriturismo in Chiusdino with | `poderebosco.com` | verified |
| Gradara | B&B Francesca | `bbfrancesca.it` | verified |
| Gradara | Dimora Francesca Conversano | `dimorafrancesca.it` | verified |
| Gradara | Bed & Breakfast Casa Paolo - Pernottamento a | `casapaolo.it` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Bellevue Cogne | `hotelbellevue.it` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Miramonti Cogne | `miramonticogne.com` | verified |
| Parco Nazionale del Gran Paradiso | ::PARADISO HOTEL Y SPA | `paradisohotel.com` | verified |
| Parco Nazionale del Gran Paradiso | Locanda Paradiso | `locandaparadiso.com` | verified |
| Parco Nazionale del Gran Paradiso | Paradiso Relais | `relaisparadiso.it` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Nazionale | `nazionalehotel.it` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Parco Milano Marittima | `hotelparco.com` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Paradiso Sanremo | `paradisohotel.it` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Vittorio | `hotelvittorio.it` | verified |
| Parco Nazionale del Gran Paradiso | Villa Rifugio | `villarifugio.it` | verified |
| Parco Nazionale del Gran Paradiso | Residence Parco Sirmione Appartamenti | `residenceparco.it` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Cogne - Residence Cogne - Hotel La Barme | `hotelcogne.com` | verified |
| Parco Nazionale del Gran Paradiso | Albergo Cascate | `albergocascate.it` | verified |
| Parco Nazionale del Gran Paradiso | Nazionale Camere | `nazionalecamere.it` | verified |
| Parco Nazionale del Gran Paradiso | Masseria Paradiso | `masseriaparadiso.it` | verified |
| Parco Nazionale del Gran Paradiso | B&B Nazionale Piazza Nazionale a Napoli | `bbnazionale.it` | verified |
| Parco Nazionale del Gran Paradiso | Borgo Paradiso | `borgoparadiso.it` | verified |
| Parco Nazionale del Gran Paradiso | B&B Paradiso | `bbparadiso.com` | verified |
| Parco Nazionale del Gran Paradiso | Relais Corte Paradiso - Peschiera del | `corteparadiso.it` | verified |
| Parco Nazionale del Gran Paradiso | Hotel Ristorante Parco | `hotelristoranteparco.it` | verified |
| Gran Sasso e Campo Imperatore | Residence Castelli Cervinia - Residence | `residencecastelli.com` | verified |
| Gran Sasso e Campo Imperatore | Adults Only Boutique Hotel in Zakynthos | `castellihotel.com` | verified |
| Gran Sasso e Campo Imperatore | .: Albergo Stefano | `albergostefano.com` | verified |
| Gran Sasso e Campo Imperatore | Hotel 4 stelle Castelli a Montecchio Maggiore | `hotelcastelli.it` | verified |
| Gran Sasso e Campo Imperatore | Hotel Sasso Hotel Ristorante | `hotelsasso.com` | verified |
| Gran Sasso e Campo Imperatore | Hotel La Rocca | `roccahotel.it` | verified |
| Gran Sasso e Campo Imperatore | Rocca Resort | `roccaresort.com` | verified |
| Gran Sasso e Campo Imperatore | Best Western Hotel Rocca | `hotelrocca.it` | verified |
| Gran Sasso e Campo Imperatore | Dimora Sessanio B & B Dimora Sessanio, un | `dimorasessanio.it` | verified |
| Gran Sasso e Campo Imperatore | Dimora Castelli | `dimoracastelli.it` | verified |
| Gran Sasso e Campo Imperatore | Cascina Rocca - Agriturismo con piscina a La | `cascinarocca.com` | verified |
| Gran Sasso e Campo Imperatore | RIFUGIO CAMPO | `rifugiocampo.com` | verified |
| Gran Sasso e Campo Imperatore | Agriturismo Rocca, Castellina in Chianti Siena | `agriturismorocca.it` | verified |
| Irpinia | Villa Avellino Hotel Pozzuoli | `villaavellino.it` | verified |
| Irpinia | Residence Greco & Linda | `residencegreco.it` | verified |
| Irpinia | Palazzo Greco Hotel | `palazzogreco.com` | verified |
| Irpinia | B&B Porto Cesareo - Palazzo Greco B&B e Casa | `palazzogreco.it` | verified |
| Ischia e Procida | Botania Relais & Spa | `botaniarelais.com` | verified |
| Ischia e Procida | Regina Isabella | `reginaisabella.com` | verified |
| Ischia e Procida | Hotel Poseidon | `poseidonhotel.it` | verified |
| Ischia e Procida | POSEIDON RESORT | `poseidonresort.it` | verified |
| Ischia e Procida | Poseidon Hotel Marmaris Resmi Web Sitesi | `poseidonhotel.com` | verified |
| Ischia e Procida | Residence Poseidon | `residenceposeidon.com` | verified |
| Ischia e Procida | Hotel Marina, Sestri Levante, Genova, Liguria | `marinahotel.it` | verified |
| Ischia e Procida | Hotel La Corricella | `hotelcorricella.it` | verified |
| Ischia e Procida | Residence Villa Marina Apartments | `villamarina.it` | verified |
| Ischia e Procida | Residence Appartamenti per Famiglie e Bambini | `residencemarina.com` | verified |
| Ischia e Procida | Hotel Castello Montjovet - Albergo Ristorante | `castellohotel.it` | verified |
| Ischia e Procida | Albergo Ristorante Terme - Acquasanta | `albergoterme.it` | verified |
| Ischia e Procida | Hotel 3 stelle sulla spiaggia | `hotelposeidon.it` | verified |
| Ischia e Procida | Albergo Castello Tignale lago di Garda | `albergocastello.it` | verified |
| Ischia e Procida | Hotel Castello e CENTRO CONGRESSI | `hotelcastello.com` | verified |
| Ischia e Procida | Bed and Breakfast Ischia | `bbischia.it` | verified |
| Ischia e Procida | HOTEL GARNI ISCHIA MALCESINE LAGO DI GARDA | `garniischia.com` | verified |
| Ischia e Procida | Grand Terme Hotel Kırşehir | `grandterme.com` | verified |
| Ischia e Procida | Hotel termale ad Abano Terme con spa, piscine | `parkhotelterme.it` | verified |
| Ischia e Procida | Hotel Antica Marina | `anticamarina.com` | verified |
| Isola d'Elba | Hotel Hermitage Elba | `hotelhermitage.it` | verified |
| Isola d'Elba | Baia Bianca Suites | `baiabianca.it` | verified |
| Isola d'Elba | Residence Elite - Isola dElba - Marina di | `elbahotel.it` | verified |
| Isola d'Elba | Hotel résidence en bord de mer à Bastia | `isolahotel.com` | verified |
| Isola d'Elba | Hotel Isola | `hotelisola.it` | verified |
| Isola d'Elba | Hotel Elba e Residence dei Fiori | `hotelelba.it` | verified |
| Isola d'Elba | Hotel a Patresi, Hotel Isola dElba: Hotel | `hotelbelmare.it` | verified |
| Isola d'Elba | Camping Isola dElba Scaglieri Village | `campingscaglieri.it` | verified |
| Isola d'Elba | Appartamenti direttamente sul mare allisola | `residencecapobianco.it` | verified |
| Isola d'Elba | Agriturismo Due Palme | `agriturismoelba.it` | verified |
| Isola d'Elba | chaletisola Beautiful ski chalet in the | `chaletisola.com` | verified |
| Isola d'Elba | Masseria Sansone | `masseriasansone.it` | verified |
| Isola d'Elba | Podere Capanne Agriturismo Etico | `poderecapanne.it` | verified |
| Isola d'Elba | Masseria Monte | `masseriamonte.com` | verified |
| Isola d'Elba | Bed & Breakfast Mont� - B&B Montesilvano | `bbmonte.it` | verified |
| Isola d'Elba | Masseria i Mulini | `masseriamulini.it` | verified |
| Isola d'Elba | Una vacanza in agriturismo allisola dElba a | `agriturismoisolaelba.it` | verified |
| Isole Eolie | Residence Eolie - Lipari | `residenceeolie.it` | verified |
| Isole Eolie | Eolie Resort Case Vacanze | `eolieresort.it` | verified |
| Isole Eolie | Residence Salina - La tua vacanza alle Eolie | `residencesalina.com` | verified |
| Isole Eolie | Salina Hotel | `salinahotel.it` | verified |
| Isole Eolie | Official Website - Hotel Stromboli | `hotelstromboli.com` | verified |
| Isole Eolie | Al Togo Hotel Fitness & Relax - Isola di | `vulcanohotel.it` | verified |
| Isole Eolie | Hotel 4 Stelle a Ricadi sulla Costa degli Dei | `hotelstromboli.it` | verified |
| Isole Eolie | SALINA - B&B Sabina - B&B Salina - Bed and | `bbsalina.com` | verified |
| Isole Eolie | Borgo Eolie Hotel Lipari | `borgoeolie.it` | verified |
| Isole Eolie | Casa Lipari | `casalipari.com` | verified |
| Isole Eolie | Papiro Case Vacanze in zona Canneto a Lipari | `bblipari.it` | verified |
| Isole Eolie | Villa Pittorino: B&b e Case Vacanze nelle | `salinabb.it` | verified |
| Isole Eolie | Agriturismo Stromboli | `agriturismostromboli.it` | verified |
| Isole Eolie | Agriturismo a Mirto Crosia Cosenza, Calabria | `agriturismovulcano.com` | verified |
| Isole Tremiti | BENVENUTO | `residencemarino.it` | verified |
| Isole Tremiti | Residence Appartamenti Casa Vacanze Abbazia | `residenceabbazia.com` | verified |
| Isole Tremiti | Venice Hotel Abbazia Venice | `abbaziahotel.com` | verified |
| Isole Tremiti | Hotel Villa Abbazia | `hotelabbazia.com` | verified |
| Isole Tremiti | Residence | `residencemarino.com` | verified |
| Isole Tremiti | San Nicola Hotel | `sannicolahotel.com` | verified |
| Isole Tremiti | Hotel 4 Stelle ad Altamura | `hotelsannicola.com` | verified |
| Isole Tremiti | lHotel San Domino, Isole Tremiti | `hotelsandomino.com` | verified |
| Isole Tremiti | Hotel Borgo Marino Plemmirio | `borgomarino.it` | verified |
| Isole Tremiti | Agriturismo Marino | `agriturismomarino.it` | verified |
| Isole Tremiti | Masseria San Nicola | `masseriasannicola.com` | verified |
| Isole Tremiti | B&B Tenuta San Nicola - Via Sant’Antonio | `tenutasannicola.com` | verified |
| Isole Tremiti | Chalet Domino | `chaletdomino.com` | verified |
| Isole Tremiti | Dimora San Nicola Charming Suites a Conversano | `dimorasannicola.com` | verified |
| Isole Tremiti | Agriturismo San Nicola | `agriturismosannicola.com` | verified |
| Isole Tremiti | Hotel Kyrie | `hotelkyrietremiti.it` | registry-web |
| Isole Tremiti | Hotel La Meridiana | `lameridianatremiti.it` | registry-web |
| Isole Tremiti | Junior | `juniortremiti.it` | registry-web |
| Isole Tremiti | La Tramontana | `tramontanatremiti.com` | registry-web |
| Langhe | Relais San Maurizio | `relaissanmaurizio.it` | verified |
| Langhe | Casa di Langa | `casadilanga.com` | verified |
| Langhe | Hotel Barolo | `hotelbarolo.it` | verified |
| Langhe | Palás Cerequio | `palascerequio.com` | verified |
| Langhe | Hotel Il Tartufo Collianello | `tartufohotel.it` | verified |
| Langhe | Albergo Alba | `albergoalba.it` | verified |
| Langhe | Barolo Hotel | `barolohotel.com` | verified |
| Langhe | Residence Alba Vieste: La Perla del Gargano | `residencealba.it` | verified |
| Langhe | Hotel Langhe - Un hotel caldo e | `hotellanghe.it` | verified |
| Langhe | Resort | `casatartufo.it` | verified |
| Langhe | CAVOUR ROOMS *** Comode Camere nel Cuore di | `cavourrooms.com` | verified |
| Langhe | Dimora Cavour | `dimoracavour.com` | verified |
| Langhe | Suite hotel in pieno centro ad Ancona | `cavoursuites.it` | verified |
| Langhe | Park Hotel Castello | `parkhotelcastello.it` | verified |
| Langhe | B&B Cascina Barolo — bed and breakfast in una | `cascinabarolo.com` | verified |
| Langhe | * Agriturismo Alba * official | `agriturismoalba.it` | verified |
| Langhe | Corte Gondina | `cortegondina.it` | registry-web |
| Langhe | Casa Pavesi | `hotelcasapavesi.it` | registry-web |
| Langhe | Casa Barbabuc | `casabarbabuc.com` | registry-web |
| Langhe | Ca' del Lupo | `cadellupo.it` | registry-web |
| Livigno e Alta Valtellina | Lac Salin Spa & Mountain Resort | `lungolivigno.com` | chain |
| Livigno e Alta Valtellina | Grand Hotel Bagni Nuovi | `bagnidibormio.it` | guarded |
| Livigno e Alta Valtellina | Alloggi per studenti Pavia | `residencevaltellina.it` | verified |
| Livigno e Alta Valtellina | Albergo 3 Stelle con Centro Benessere a | `livignohotel.com` | verified |
| Livigno e Alta Valtellina | Bed & Breakfast Valtellina | `bbvaltellina.it` | verified |
| Livigno e Alta Valtellina | B&B Corte Vecchi Rooms & Events | `cortevecchi.it` | verified |
| Livigno e Alta Valtellina | Dimora Bagni | `dimorabagni.com` | verified |
| Livigno e Alta Valtellina | Agriturismo Rini Bormio | `agriturismobormio.it` | verified |
| Livigno e Alta Valtellina | Chalet Mottolino e Chalet Snowflake | `chaletlivigno.it` | verified |
| Livigno e Alta Valtellina | Appartamenti a Bormio | `chaletbormio.it` | verified |
| Livigno e Alta Valtellina | La Tresenda Mountain Farm | `agriturismolivigno.com` | verified |
| Madonna di Campiglio | DV Chalet Boutique Hotel | `dvchalet.it` | verified |
| Madonna di Campiglio | Hotel Lorenzetti | `hotellorenzetti.com` | verified |
| Madonna di Campiglio | Chalet del Sogno | `hotelchaletdelsogno.com` | verified |
| Madonna di Campiglio | Hotel Madonna SPA, г. Каскелен | `madonnahotel.com` | verified |
| Madonna di Campiglio | Hotel a Madonna di Campiglio | `hotelcampiglio.it` | verified |
| Madonna di Campiglio | Hotel Pinzolo Dolomiti | `hotelpinzolo.it` | verified |
| Madonna di Campiglio | Ihr Hotel in Kastelruth | `hotelmadonna.com` | verified |
| Madonna di Campiglio | Albergo Brenta | `albergobrenta.it` | verified |
| Madonna di Campiglio | Hotel Brenta | `hotelbrenta.it` | verified |
| Madonna di Campiglio | Agriturismo a Pinzolo, vicino a Madonna di | `agriturismopinzolo.it` | verified |
| Mantova e Sabbioneta | Casa Poli Hotel | `hotelcasapoli.it` | verified |
| Mantova e Sabbioneta | Rifugio città di Mantova - Il Rifugio Città | `rifugiomantova.it` | verified |
| Maremma Toscana | Terme di Saturnia Natural Destination | `termedisaturnia.it` | verified |
| Maremma Toscana | Andana Resort | `andana.it` | verified |
| Maremma Toscana | Toscana Village Resort | `toscanaresort.com` | verified |
| Maremma Toscana | Hotel e alloggi a Toscana, Italia ≡ Solo | `toscanahotel.com` | verified |
| Maremma Toscana | Tuscany Luxury Hotels | `relaistoscana.com` | verified |
| Maremma Toscana | Residence a Talamone | `residencetalamone.it` | verified |
| Maremma Toscana | Hotel Saturnia & International, 4 | `hotelsaturnia.it` | verified |
| Maremma Toscana | Residence Saturnia Residence Riccione | `residencesaturnia.com` | verified |
| Maremma Toscana | Agriturismo in Maremma | `poderemaremma.it` | verified |
| Matera | Sextantio Le Grotte della Civita | `sextantio.it` | verified |
| Matera | Palazzo Gattini Luxury Hotel | `palazzogattini.it` | verified |
| Matera | Sant'Angelo Luxury Resort | `santangeloresort.it` | verified |
| Matera | Aquatio Cave Luxury Hotel | `aquatiohotel.com` | verified |
| Matera | Locanda di San Martino | `locandadisanmartino.it` | verified |
| Matera | Hotel Originale 3 Stelle Rimini | `hoteloriginale.com` | verified |
| Matera | HOTEL MURGIA | `hotelmurgia.com` | verified |
| Matera | Benvenuto allHotel Sassi a Matera | `hotelsassi.it` | verified |
| Matera | Hotel a Matera con vista Sassi di Matera | `hotelbelvedere.matera.it` | verified |
| Matera | B&B Barletta, Bed&breakfast Barletta La | `bbcattedrale.it` | verified |
| Matera | B&B Matera: super comfort nei Sassi e dintorni | `bbmatera.it` | verified |
| Modena e Terre di Motori | Casa Maria Luigia | `casamarialuigia.com` | verified |
| Modena e Terre di Motori | Best Western Premier Milano Palace | `milanopalacehotel.it` | verified |
| Modena e Terre di Motori | Residence Ferrari | `residenceferrari.it` | verified |
| Modena e Terre di Motori | Hotel Ferrari | `hotelferrari.it` | verified |
| Modena e Terre di Motori | Chiavari Genova Hotel Ferrari Santa | `albergoferrari.com` | verified |
| Modena e Terre di Motori | Best Western Plus Hotel Modena Resort: il tuo | `modenaresort.it` | verified |
| Modena e Terre di Motori | Hotel Duomo | `hotelduomo.it` | verified |
| Modena e Terre di Motori | Residence a Modena, Antico Borgo e Villa | `residencemodena.com` | verified |
| Modena e Terre di Motori | Casa Ferrari B&B | `casaferrari.com` | verified |
| Modena e Terre di Motori | Ferrari Rooms & Apartments | `ferrarirooms.it` | verified |
| Modena e Terre di Motori | Masseria Ferrari - Trulli e vacanze in Valle | `masseriaferrari.com` | verified |
| Modena e Terre di Motori | Agriturismo Ferrari, Oltrepò Pavese | `agriturismoferrari.it` | verified |
| Modena e Terre di Motori | B&B Reggio Calabria vicino Museo Rooms centro | `museorooms.it` | verified |
| Modena e Terre di Motori | Duomo City Center Suites | `duomosuites.com` | verified |
| Monferrato | Barbera Hotel | `barberahotel.com` | verified |
| Monferrato | Hotel Nizza - Accoglienza Fiorentina nel | `hotelnizza.com` | verified |
| Monferrato | Centro congressi Marche Hotel Casale | `hotelcasale.it` | verified |
| Monferrato | Monferrato Resort | `monferratoresort.it` | verified |
| Monferrato | Masseria Barbera | `masseriabarbera.it` | verified |
| Monferrato | Bed and breakfast a Torino | `casanizza.it` | verified |
| Monferrato | ::: B&B Casale | `bbcasale.com` | verified |
| Monferrato | Principe | `hotelprincipe.eu` | registry-web |
| Monferrato | Candiani | `hotelcandiani.com` | registry-web |
| Monferrato | Genova | `hotelgenova.at.it` | registry-web |
| Monferrato | Borgovecchio | `albergoilborgovecchio.it` | registry-web |
| Monferrato | Relais Rocca Civalieri | `hotelroccacivalieri.it` | registry-web |
| Monferrato | Mini Hotel | `minihotel.asti.it` | registry-web |
| Monferrato | Villa Pattono | `villapattono.com` | registry-web |
| Monferrato | Leon D'Oro | `hotelleondorocasalemonferrato.com` | registry-web |
| Monferrato | Phi Hotel Palio | `phihotelpalio.com` | registry-web |
| Monferrato | Rainero | `hotelrainero.com` | registry-web |
| Monferrato | Cavour | `hotelcavour-asti.com` | registry-web |
| Monferrato | Business | `business-hotel.it` | registry-web |
| Monferrato | Villa Conte Riccardi | `hotelvillacontericcardi.it` | registry-web |
| Montalcino | Castello Banfi Il Borgo | `castellobanfiilborgo.com` | verified |
| Montalcino | Hotel Vecchia Oliviera | `vecchiaoliviera.com` | verified |
| Montalcino | Poggio Hotel Arenzano, Genova, Business e | `poggiohotel.it` | verified |
| Montalcino | Fortezza Beach Resort | `fortezzahotel.com` | verified |
| Montalcino | Locanda santAntimo | `locandasantantimo.it` | verified |
| Montalcino | Hotel Ristorante Fortezza | `hotelfortezza.it` | verified |
| Montalcino | Residence Brunello in St. Ulrich in Gröden | `residencebrunello.com` | verified |
| Montalcino | B&B Villa Fortezza - Bed and breakfast ad | `villafortezza.it` | verified |
| Montalcino | Hotel 3 stelle Firenze vicino al centro | `hotelfortezza.com` | verified |
| Montalcino | Appartamenti in Liguria | `castelnuovosuites.com` | verified |
| Montalcino | Bed & Breakfast a Castelnuovo Magra | `bbcastelnuovo.com` | verified |
| Montalcino | Agriturismo Brunello Il Palazzone Accoglienza | `agriturismobrunello.com` | verified |
| Montefalco e Sagrantino | Ristorante Locanda del Teatro Montefalco | `locandamontefalco.it` | verified |
| Montefalco e Sagrantino | Hotel Misano Adriatico | `hotelclitunno.it` | verified |
| Montefalco e Sagrantino | Hotel Clitunno Spoleto™ | `hotelclitunno.com` | verified |
| Montefalco e Sagrantino | Country House Le Marche | `villafonti.com` | verified |
| Montefalco e Sagrantino | Hotel Francesco Hotel sul mare a Pescoluse | `hotelfrancesco.it` | verified |
| Montefalco e Sagrantino | Hotel con cucina a Riccione sul mare con | `trevihotel.it` | verified |
| Montefalco e Sagrantino | Hotel degli Affreschi Camere e appartamenti a | `hoteldegliaffreschi.it` | verified |
| Montefalco e Sagrantino | Hotel Garn Francesco | `garnifrancesco.com` | verified |
| Montepulciano | Hotel Il Marzocco | `albergoilmarzocco.it` | verified |
| Montepulciano | Villa Cicolina | `villacicolina.it` | verified |
| Montepulciano | Albergo Palazzo | `albergopalazzo.it` | verified |
| Montepulciano | Hotel Tempio Hotel a Napoli | `hoteltempio.it` | verified |
| Montepulciano | Piazza Hotel - Villa Carlos Paz y Punilla | `piazzahotel.com` | verified |
| Montepulciano | Albergo Ristorante Nobile Bobbio | `albergonobile.it` | verified |
| Montepulciano | Nobile Boutique Hotel Nobile Smart Boutique | `nobilehotel.com` | verified |
| Montepulciano | Agriturismo Il Palazzo | `agriturismopalazzo.it` | verified |
| Montepulciano | Dimora Palazzo | `dimorapalazzo.com` | verified |
| Montepulciano | B&B San Severo | `biagiobb.it` | verified |
| Montepulciano | Farmhouse and B&B BORGO PIAZZA CATANZARO LIDO | `borgopiazza.com` | verified |
| Montepulciano | Montepulciano agriturismo Nobile agriturismo | `agriturismonobile.it` | verified |
| Montepulciano | AGRITURISMO e B&B BORGO PIAZZA CATANZARO LIDO | `borgopiazza.it` | verified |
| Montepulciano | Dimora Nobile | `dimoranobile.it` | verified |
| Montepulciano | Masseria | `masserianobile.com` | verified |
| Napoli | Grand Hotel Vesuvio | `vesuvio.it` | verified |
| Napoli | Romeo Hotel | `romeohotel.it` | verified |
| Napoli | Grand Hotel Parker's | `grandhotelparkers.it` | verified |
| Napoli | Eurostars Hotel Excelsior | `eurostarshotels.com` | chain |
| Napoli | Palazzo Caracciolo Napoli | `accor.com` | chain |
| Napoli | Hotel Piazza Bellini | `hotelpiazzabellini.com` | verified |
| Napoli | Grand Hotel Santa Lucia | `santalucia.it` | verified |
| Napoli | Hotel Palazzo Alabardieri | `palazzoalabardieri.it` | verified |
| Napoli | Costantinopoli 104 | `costantinopoli104.it` | verified |
| Napoli | Hotel Martino - Hotel sul mare tra Sperlonga | `hotelmartino.it` | verified |
| Napoli | Hotel Martino Resort & Spa en Alajuela. Web | `hotelmartino.com` | verified |
| Napoli | Residence Spaccanapoli | `residencespaccanapoli.it` | verified |
| Napoli | Hotel 5 stelle Alta Badia | `hotelcappella.com` | verified |
| Napoli | BB Napoli | `bbspaccanapoli.com` | verified |
| Napoli | Agriturismo in Umbria San Severo | `agriturismosansevero.it` | verified |
| Napoli | Masseria Cappella Una Masseria in Puglia, nel | `masseriacappella.com` | verified |
| Orvieto | Hotel La Badia di Orvieto | `labadiahotel.it` | verified |
| Orvieto | Hotel Duomo Orvieto | `orvietohotelduomo.com` | verified |
| Orvieto | Ristoranti a Orvieto • Locanda Orvieto | `locandaorvieto.it` | verified |
| Orvieto | Orvieto Resort Orvieto Luxury Resort | `orvietoresort.com` | verified |
| Orvieto | Hotel Orvieto *** - Hotel a Orvieto | `hotelorvieto.it` | verified |
| Orvieto | B&B Underground | `bbunderground.com` | verified |
| Orvieto | Bed & Breakfast - SantAngelo 42 | `bborvieto.com` | verified |
| Ostuni | Masseria Torre Coccaro | `masseriatorrecoccaro.com` | verified |
| Ostuni | Borgo Egnazia | `borgoegnazia.com` | verified |
| Ostuni | Paragon 700 Boutique Hotel | `paragon700.com` | verified |
| Ostuni | Bianca Resort & Spa Kolašin | `biancaresort.com` | verified |
| Ostuni | Hotel a Livorno - Hotel Città vicino al | `hotelcitta.it` | verified |
| Ostuni | b&b Catania Bianca - bed & breakfast catania | `biancabb.com` | verified |
| Ostuni | Masseria Bianca - masseria del Quattrocento | `masseriabianca.com` | verified |
| Ostuni | DIMORA BIANCA | `dimorabianca.it` | verified |
| Ostuni | B&B ad Ostuni in Puglia | `bbostuni.it` | verified |
| Ostuni | Botanico Villa & Suites | `villabotanico.com` | registry-web |
| Ostuni | Casa Baldassarre | `casabaldassarre.it` | registry-web |
| Ostuni | Casa TEA | `tripostuni.com` | registry-web |
| Ostuni | Casa Vacanze La Quercia | `querciacasavacanze.it` | registry-web |
| Ostuni | Dama Bianca Via Ardigo' 21 | `damabianca.net` | registry-web |
| Ostuni | Dimora dell'Osanna | `dimoradellosanna.it` | registry-web |
| Ostuni | Hasamami Eco Trullo | `hasamami.it` | registry-web |
| Ostuni | Il Grifone | `casadelgrifone.it` | registry-web |
| Ostuni | Il Rifugio Dello Scoglio | `ilrifugiodelloscoglio.it` | registry-web |
| Ostuni | La Bella Ostuni suites - Via Bovio 42 | `labellaostuni.it` | registry-web |
| Ostuni | La Fogliarella | `trullitaly.it` | registry-web |
| Parco Nazionale d'Abruzzo | Residence in Abruzzo per vacanze al Mare | `residenceabruzzo.it` | verified |
| Parco Nazionale d'Abruzzo | Hotel Abruzzo Ambasciatori | `hotelabruzzo.com` | verified |
| Parco Nazionale d'Abruzzo | abruzzo Bed & Breakfast Sulmona B&B Abruzzo | `abruzzobb.it` | verified |
| Parma e Food Valley | Palazzo Dalla Rosa Prati | `palazzodallarosaprati.it` | verified |
| Parma e Food Valley | Grand Hotel de la Ville | `grandhoteldelaville.it` | verified |
| Parma e Food Valley | Best Western Plus Hotel Farnese 4 stelle a | `farnesehotel.it` | verified |
| Parma e Food Valley | Hotel Parma - Hotel en el centro de San | `hotelparma.com` | verified |
| Parma e Food Valley | Residence Parma: soluzioni per tutte le | `residenceparma.it` | verified |
| Parma e Food Valley | Hotel Ai Tigli – Ospitalità e Relax a | `hotelaitigli.it` | verified |
| Parma e Food Valley | B&B Torrechiara Langhirano | `bbtorrechiara.it` | verified |
| Parma e Food Valley | Masseria Torrechiara | `masseriatorrechiara.it` | verified |
| Pitigliano | 【公式】SORANO HOTEL | `soranohotel.com` | verified |
| Pitigliano | Sovana Hotel & Resort | `sovanahotel.it` | verified |
| Pitigliano | Masseria Bed and breakfast Ostuni, Masseria | `masseriapiccola.it` | verified |
| Pitigliano | Dimorà Bed & Breakfast a Pitigliano: dormire | `dimorapitigliano.it` | verified |
| Parco Nazionale del Pollino | Hotel Albergo Atripalda : Hotel Civita | `hotelcivita.com` | verified |
| Parco Nazionale del Pollino | Bio B&B - La scoperta del Pollino | `bbpollino.com` | verified |
| Parco Nazionale del Pollino | B&B Serra | `bbserra.it` | verified |
| Parco Nazionale del Pollino | Rifugio Pino Loricato | `rifugiopinoloricato.it` | verified |
| Pompei ed Ercolano | Habita79 Pompeii | `habita79.it` | verified |
| Pompei ed Ercolano | Hotel Forum Pompei | `hotelforum.it` | verified |
| Pompei ed Ercolano | Resort Vesuvio resort | `resortvesuvio.it` | verified |
| Pompei ed Ercolano | Hotel Vesuvio : guide voyage Naples, Vésuve | `hotelvesuvio.com` | verified |
| Pompei ed Ercolano | Hotel Vesuvio Rapallo | `hotelvesuvio.it` | verified |
| Pompei ed Ercolano | Rooms Rent Vesuvio Bed & Breakfast vicino | `bbvesuvio.it` | verified |
| Portovenere | Grand Hotel Portovenere | `grandhotelportovenere.it` | verified |
| Portovenere | Palmaria Hotel | `palmariahotel.com` | verified |
| Portovenere | Hotel San Benedetto del Tronto | `hoteldoria.it` | verified |
| Portovenere | Hotel tre stelle superior | `hotelbyron.it` | verified |
| Portovenere | Residence Doria | `residencedoria.com` | verified |
| Terre del Primitivo | SAVA HOTEL Butiqe Hotel İn Konyaaltı Antalya | `savahotel.com` | verified |
| Terre del Primitivo | HOTEL PRIMITIVO | `hotelprimitivo.com` | verified |
| Terre del Primitivo | A Casa di Nonna Giovanna | `acasadinonnagiovanna.it` | registry-web |
| Terre del Primitivo | Agora'Suites & Apartaments | `agorasuites.it` | registry-web |
| Terre del Primitivo | Aurora | `hotelvillaggioaurora.it` | registry-web |
| Terre del Primitivo | Boomerang Village | `boomerangsalento.it` | registry-web |
| Terre del Primitivo | Borgo Luna | `borgoluna.com` | registry-web |
| Terre del Primitivo | Casa Magade' | `casamagade.it` | registry-web |
| Terre del Primitivo | Corte Borromeo | `corteborromeohotel.it` | registry-web |
| Terre del Primitivo | D.f. Bed & Breakfast | `dfbedandbreakfast.com` | registry-web |
| Terre del Primitivo | LUNE SARACENE country house | `lunesaracene.it` | registry-web |
| Terre del Primitivo | Masseria Specula | `masseriaspecula.com` | registry-web |
| Terre del Primitivo | Palazzo Mancini | `palazzomancini.it` | registry-web |
| Terre del Primitivo | Sottacastieddu | `sottacastieddu.it` | registry-web |
| Terre del Primitivo | Villa Alessia- La conchiglia | `dimorasovranamatera.com` | registry-web |
| Ravenna | Palazzo Bezzi Hotel | `palazzobezzi.it` | verified |
| Ravenna | Hotel Bisanzio | `bisanziohotel.com` | verified |
| Ravenna | Resort Ravenna | `resortravenna.com` | verified |
| Ravenna | Dante Suites Boutique Rooms | `dantesuites.com` | verified |
| Ravenna | Hotel Ristorante Dante - Torgiano - Perugia | `hotelristorantedante.it` | verified |
| Ravenna | agriturismosantapollinare.it | `agriturismosantapollinare.it` | verified |
| Ravenna | Resort a Perugia | `borgosantapollinare.it` | verified |
| Ravenna | Galla Suites | `gallasuites.com` | verified |
| Ravenna | Ravenna Suites | `ravennasuites.it` | verified |
| Riviera del Conero | Le Relais du Lierre - Hotel a Portonovo | `portonovohotel.com` | verified |
| Riviera del Conero | Hotel 4 Stelle Riviera del Conero a Sirolo | `hotelmonteconero.it` | verified |
| Riviera del Conero | Appartamenti per vacanze nella Riviera del | `residencenumana.com` | verified |
| Riviera del Conero | Resort a Numana per le vacanze in b&b nella | `conerosuites.it` | verified |
| Riviera del Conero | Portonovo Suites | `portonovosuites.it` | verified |
| Riviera del Conero | Hotel Conero Camere | `conerocamere.com` | verified |
| Riviera del Conero | Agriturismo Conero | `agriturismoconero.it` | verified |
| Riviera del Conero | Affittacamere Marcelli di Numana - La | `numanacamere.com` | verified |
| Riviera del Conero | Affittacamere Numana | `numanacamere.it` | verified |
| Riviera Ligure di Ponente | Hotel Ligure a Cuneo centro | `ligurehotel.com` | verified |
| Riviera Ligure di Ponente | Hotel Alassio Hotel 3 stelle a Montecatini | `hotelalassio.it` | verified |
| Riviera Ligure di Ponente | Hotel San Remo - Hotel All Inclusive a | `hotelsanremo.it` | verified |
| Riviera Ligure di Ponente | Hotel Sanremo | `albergosanremo.com` | verified |
| Riviera Ligure di Ponente | Residence Sanremo | `residencesanremo.com` | verified |
| Riviera Ligure di Ponente | Albergo San Remo | `albergosanremo.it` | verified |
| Riviera Ligure di Ponente | Dimora Store | `dimorasanremo.it` | verified |
| Riviera Ligure di Ponente | Agriturismo La Cà dellAlpe | `agriturismofinaleligure.it` | verified |
| Riviera Romagnola | Residence Riviera a Palinuro, nel Cilento | `residenceriviera.com` | verified |
| Riviera Romagnola | Albergo Ristorante Riviera | `albergoriviera.com` | verified |
| Riviera Romagnola | Residence Montecarlo Cattolica | `residencecattolica.com` | verified |
| Riviera Romagnola | Spotorno Hotel Riviera 3* Spotorno Hotel | `rivierahotel.it` | verified |
| Riviera Romagnola | Visita il | `hotelriviera.com` | verified |
| Riviera Romagnola | Residence Meeting Cattolica - Apparatamenti | `residencecattolica.it` | verified |
| Riviera Romagnola | Hotel La Plage Cattolica | `hotelcattolica.it` | verified |
| Riviera Romagnola | Residence in centro a Cesenatico e vicino al | `residencecesenatico.com` | verified |
| Riviera Romagnola | Albergo Rimini | `albergorimini.it` | verified |
| Riviera Romagnola | Cesenatico Hotel: hotel, B&B, campeggi | `cesenaticohotel.com` | verified |
| Riviera Romagnola | ≋ HOTEL RICCIONE • I migliori hotel ai PREZZI | `hotelriccione.com` | verified |
| Riviera Romagnola | Hotel a Rimini di fronte al mare per famiglie | `riminiresort.it` | verified |
| Riviera Romagnola | UNALTRA ESTATE MERAVIGLIOSA | `hotelriccione.it` | verified |
| Riviera Romagnola | Hotel Rimini Rome near Termini Station | `hotelrimini.com` | verified |
| Riviera Romagnola | Casa Riviera | `casariviera.com` | verified |
| Riviera Romagnola | Hotel Garni Riviera a Gargnano sul Lago di | `garniriviera.it` | verified |
| Riviera Romagnola | B&B Napoli Chiaia | `rivierasuites.it` | verified |
| Riviera Romagnola | Riccione Suites | `riccionesuites.com` | verified |
| Riviera Romagnola | Dimora Riviera | `dimorariviera.com` | verified |
| Riviera Romagnola | B&B a Rimini | `bbrimini.com` | verified |
| Roero | Adults Only Luxury Hotel & Suites in | `canalehotel.com` | verified |
| Roero | Casa Canale | `casacanale.it` | verified |
| Roero | Agriturismo Alberese | `agriturismocanale.com` | verified |
| Roero | ANTICO CANALE | `anticocanale.com` | verified |
| Roero | Agriturismo Canale: appartamenti con giardino | `agriturismocanale.it` | verified |
| Roero | Roero Park Hotel | `roeroparkhotel.it` | registry-web |
| Roero | Foresteria Conti Roero | `contiroero.eu` | registry-web |
| Roero | Nuovo Hotel Giardini | `nuovohotelgiardini.it` | registry-web |
| Roero | Castello di Santa Vittoria | `hotelsantavittoria.com` | registry-web |
| Roero | I Castelli | `hotel-icastelli.com` | registry-web |
| Roero | Medea | `hotelmedea.com` | registry-web |
| Roero | Garibaldi | `albergoristorantegaribaldi.it` | registry-web |
| Roero | Dell' Agenzia | `albergoagenzia.it` | registry-web |
| Roero | Casa Americani | `casaamericani.it` | registry-web |
| Roero | Castello di Guarene | `castellodiguarene.com` | registry-web |
| Roero | La Corte Albertina | `albergocortealbertina.it` | registry-web |
| Roero | Badellino | `hotelbadellino.it` | registry-web |
| Roero | Belvedere | `albergobelvedere.com` | registry-web |
| Roero | Spa Roero Relax Resort | `sparoerorelaxresort.com` | registry-web |
| Roero | Borgo San Martino | `sanmartino-hotel.it` | registry-web |
| Roma | Hotel de Russie | `roccofortehotels.com` | chain |
| Roma | Hotel Hassler Roma | `hotelhasslerroma.com` | verified |
| Roma | Hotel Eden | `dorchestercollection.com` | chain |
| Roma | The St. Regis Rome | `marriott.com` | chain |
| Roma | Hotel Artemide | `hotelartemide.it` | verified |
| Roma | Singer Palace Hotel | `singerpalacehotel.com` | verified |
| Roma | Hotel Locarno | `hotellocarno.com` | verified |
| Roma | Hotel Quirinale | `hotelquirinale.it` | verified |
| Roma | Hotel Nazionale | `hotelnazionale.it` | verified |
| Roma | Bettoja Hotel Mediterraneo | `bettojahotels.it` | chain |
| Roma | Hotel Campo de' Fiori | `hotelcampodefiori.com` | verified |
| Roma | Hotel vicino San Zaccaria Venezia | `hotelfontana.it` | verified |
| Roma | Hotel da Romano San Foca | `romanohotel.com` | verified |
| Roma | Hotel Romano | `hotelromano.it` | verified |
| Roma | All-Inclusive Resort in New York | `villaroma.com` | verified |
| Roma | Albergo Fontana | `albergofontana.com` | verified |
| Roma | Hotel Colosseo & Spa Shkoder, Albania | `colosseohotel.com` | verified |
| Roma | Villa Fontana | `villafontana.it` | verified |
| Roma | Hotel 4 stelle Riccione sul mare in centro | `hotelroma.it` | verified |
| Roma | Rifugio Romano | `rifugioromano.com` | verified |
| Sacri Monti | Locanda di Orta ristorante Orta San Giulio | `locandaorta.com` | verified |
| Sacri Monti | Agriturismo Tarquinia Virtual Tour Podere | `poderegiulio.com` | verified |
| Sacri Monti | Masseria Giulio | `masseriagiulio.com` | verified |
| Sacri Monti | Varese B&b | `varesebb.com` | verified |
| Sacri Monti | Associazione dei migliori B&B, case vacanza | `bbvarese.it` | verified |
| Sacri Monti | La Contrada dei Monti | `lacontradadeimonti.it` | registry-web |
| Sacri Monti | Lo Scoiattolo | `hotelloscoiattolo.com` | registry-web |
| Sacri Monti | Fontaine Bleue | `hotelfontainebleue.it` | registry-web |
| Sacri Monti | Panoramico | `hotelpanoramico.it` | registry-web |
| Sacri Monti | Leon D'Oro | `albergoleondoro.it` | registry-web |
| Sacri Monti | Pomodoro | `pomodororistorante.it` | registry-web |
| Sacri Monti | Piccolo Hotel Olina | `ortainfo.com` | registry-web |
| Sacri Monti | Croce Bianca | `albergocrocebianca.com` | registry-web |
| Sacri Monti | Colli Fioriti | `hotelcollifioriti.it` | registry-web |
| Sacri Monti | Hotel Cortese | `cortesehotel.it` | registry-web |
| Sacri Monti | Villa Crespi | `villacrespi.it` | registry-web |
| Sacri Monti | La Sibilla Cusiana | `lasibillacusiana.com` | registry-web |
| Sacri Monti | La Bussola | `hotelbussolaorta.it` | registry-web |
| Sacri Monti | Tenuta Montezeglio | `tenutamontezeglio.it` | registry-web |
| Sacri Monti | Valsesiana | `albergovalsesiana.it` | registry-web |
| Salento | Vinilia Wine Resort | `viniliaresort.com` | verified |
| Salento | Masseria Le Mandorle | `masserialemandorle.it` | verified |
| Salento | Poesia Hotel | `poesiahotel.com` | verified |
| Salento | Hotel Naxos Grotta, Naxos Greece Hotels, in | `hotelgrotta.com` | verified |
| Salento | Locanda dellOrso | `locandadellorso.com` | verified |
| Salento | Hotel Maria | `hotelmaria.it` | verified |
| Salento | La Locanda dellOrso | `locandadellorso.it` | verified |
| Salento | Albergo Ristorante della Torre | `albergotorre.it` | verified |
| Salento | Benvenuto | `mariahotel.it` | verified |
| Salento | Hotel Villa Maria | `villamaria.it` | verified |
| Salento | la Locanda Maria | `locandamaria.it` | verified |
| Salento | Gh Gallipoli Resort | `gallipoliresort.it` | verified |
| Salento | Residence Costa dOtranto | `residenceotranto.it` | verified |
| Salento | Residence IONIAN | `residencegallipoli.it` | verified |
| Salento | Albergo Torre - Hotel a due passi dal mare e | `albergotorre.com` | verified |
| Salento | Masseria Poesia | `masseriapoesia.it` | verified |
| Salento | B&B Cascina DellOrso | `cascinadellorso.com` | verified |
| Salento | Soggiorno Antica Torre | `anticatorre.com` | verified |
| Salento | Agriturismo Antica Torre, Salsomaggiore | `anticatorre.it` | verified |
| Salento | Agriturismo Torre | `agriturismotorre.it` | verified |
| San Gimignano | Hotel Relais Santa Chiara | `rsc.it` | verified |
| San Gimignano | Hotel L'Antico Pozzo | `anticopozzo.com` | verified |
| San Gimignano | Hotel la Cisterna a San Gimignano | `hotelcisterna.it` | verified |
| San Gimignano | Hotel San Gimignano | `hotelsangimignano.it` | verified |
| San Gimignano | ......::Lantica cisterna - turismo rurale | `anticacisterna.com` | verified |
| Scanno | Hotel Sagittario | `hotelsagittario.com` | verified |
| Scanno | Relais Scanno | `relaisscanno.it` | verified |
| Scanno | Park Hotel Lago di Scanno | `parkhotelscanno.it` | verified |
| Scanno | Albergo Ristorante Sagittario | `albergosagittario.it` | verified |
| Monti Sibillini | LOCANDA MONTI - BED AND BREAKFAST | `locandamonti.com` | verified |
| Monti Sibillini | Book from the site of Relais Monti in Romes | `relaismonti.com` | verified |
| Monti Sibillini | Hotel Monti vicino al mare nel Centro di | `hotelmonti.it` | verified |
| Monti Sibillini | Monti Hotel | `montihotel.com` | verified |
| Monti Sibillini | Podere Monti | `poderemonti.it` | verified |
| Monti Sibillini | PIANO ROOMS Bed & Breakfast Vietri sul Mare | `pianorooms.it` | verified |
| Monti Sibillini | Agriturismo Piano Grande - Avigliano | `agriturismopianogrande.com` | verified |
| Monti Sibillini | Agriturismo Norcia Casale Sienti n puo | `agriturismonorcia.it` | verified |
| Siena | Hotel Athena | `hotelathena.com` | verified |
| Siena | Palazzo Ravizza | `palazzoravizza.it` | verified |
| Siena | Hotel Certosa di Maggiano | `certosadimaggiano.com` | verified |
| Siena | Borgo Scopeto Relais | `borgoscopeto.it` | verified |
| Siena | The Siena Hotel | `sienahotel.com` | verified |
| Siena | Residence Siena - Appartamenti a Siena | `hotelsiena.it` | verified |
| Siena | Albergo Siena | `albergosiena.com` | verified |
| Siena | Albergo Siena Caorle | `albergosiena.it` | verified |
| Siena | Agriturismo Scala | `agriturismoscala.com` | verified |
| Sila | Hotel Camigliatello | `hotelcamigliatello.com` | verified |
| Sila | Hotel in Sila di Calabria | `hotelsila.com` | verified |
| Sila | Hotel Sila | `hotelsila.it` | verified |
| Spello | Hotel Venere | `hotelvenere.com` | verified |
| Spello | Residence Venere | `residencevenere.it` | verified |
| Spello | Grand Hotel Baglioni | `hotelbaglioni.it` | verified |
| Spello | Hotel Venere Cesenatico | `hotelvenere.it` | verified |
| Spello | Dimora Venere | `dimoravenere.it` | verified |
| Sperlonga | B&B Sperlonga | `bbsperlonga.com` | verified |
| Sperlonga | Sperlonga Resort | `sperlongaresort.com` | verified |
| Parco Nazionale dello Stelvio | Hotel Zebrù S. Antonio in Valfurva - Albergo | `hotelzebru.com` | verified |
| Parco Nazionale dello Stelvio | Hotel Ortles | `hotelortles.it` | verified |
| Parco Nazionale dello Stelvio | Hotel Martello Lampedusa La tua Stanza a | `hotelmartello.it` | verified |
| Parco Nazionale dello Stelvio | Hotel Stelvio - Albergo Stelvio Varese Italia | `hotelstelvio.com` | verified |
| Parco Nazionale dello Stelvio | Ristorante Hotel Stelvio | `stelviohotel.com` | verified |
| Parco Nazionale dello Stelvio | Residence Ortles a Santa Caterina Valfurva | `residenceortles.it` | verified |
| Parco Nazionale dello Stelvio | Alpina Mountain Caravan Park | `alpina-mountain-resort.it` | registry-web |
| Parco Nazionale dello Stelvio | Alpina Residence der Schöpf Rita | `alpina-residence.com` | registry-web |
| Parco Nazionale dello Stelvio | Alpin Spa Hotel die Post | `hotelpost.it` | registry-web |
| Parco Nazionale dello Stelvio | App. Laura | `sulden-ski.com` | registry-web |
| Parco Nazionale dello Stelvio | Hotel Sottostelvio | `franzenshoehe.com` | registry-web |
| Parco Nazionale dello Stelvio | Camping Trafoi | `camping-trafoi.com` | registry-web |
| Parco Nazionale dello Stelvio | Chalet Emma | `chalet-emma.com` | registry-web |
| Parco Nazionale dello Stelvio | Chalet Ourtls Pärg | `ourtl.it` | registry-web |
| Parco Nazionale dello Stelvio | Dependance Residence Piccolo Hotel | `hotelalpina.it` | registry-web |
| Parco Nazionale dello Stelvio | Dipendace Piccolo Livrio | `livrio.com` | registry-web |
| Parco Nazionale dello Stelvio | Rifugio Serristori | `duesseldorferhuette.com` | registry-web |
| Parco Nazionale dello Stelvio | Appartamenti Haus Angelus | `haus-angelus.com` | registry-web |
| Parco Nazionale dello Stelvio | Fragges | `fragges.it` | registry-web |
| Parco Nazionale dello Stelvio | Garni Arnika | `garni-arnika.com` | registry-web |
| Strada del Vino dell'Alto Adige | Residence all&#x27;Adige Verona | `residenceadige.it` | verified |
| Strada del Vino dell'Alto Adige | Albergo Adige | `albergoadige.com` | verified |
| Strada del Vino dell'Alto Adige | 5 Apartments |  | registry |
| Strada del Vino dell'Alto Adige | Adolfer Höfl | `adolfer-hoefl.it` | registry-web |
| Strada del Vino dell'Alto Adige | Aichnerhof - Valorz-Vieider Maria | `aichnerhof.it` | registry-web |
| Strada del Vino dell'Alto Adige | Am Hexenbichl | `hexenbichl.com` | registry-web |
| Strada del Vino dell'Alto Adige | Amplatz 1523 - B&B and Suites | `amplatz1523.com` | registry-web |
| Strada del Vino dell'Alto Adige | Helmut Andergassen | `andergassen-kaltern.it` | registry-web |
| Strada del Vino dell'Alto Adige | Anderlan Hubert | `hausanderlan.com` | registry-web |
| Strada del Vino dell'Alto Adige | Angelika Raffeiner | `pfeiferhof.bz` | registry-web |
| Strada del Vino dell'Alto Adige | Sparer Stefan | `angerblick.it` | registry-web |
| Strada del Vino dell'Alto Adige | Hotel Angerburg | `hotel-angerburg.com` | registry-web |
| Strada del Vino dell'Alto Adige | Angerheim | `angerheim.it` | registry-web |
| Strada del Vino dell'Alto Adige | Angerhof al lago di Caldaro | `angerhofamkalterersee.it` | registry-web |
| Strada del Vino dell'Alto Adige | Ansitz Aehrental | `schlosshotel.it` | registry-web |
| Strada del Vino dell'Alto Adige | Ansitz am Eck | `ansitz-am-eck.com` | registry-web |
| Strada del Vino dell'Alto Adige | Ansitz Bernard | `bernard-kaltern.com` | registry-web |
| Strada del Vino dell'Alto Adige | Ansitz Eggenheim | `eggenheim.com` | registry-web |
| Strada del Vino dell'Alto Adige | Ansitz Grustdorf | `ansitz-grustdorf.it` | registry-web |
| Strada del Vino dell'Alto Adige | Ansitz Jenner | `ansitz-jenner.com` | registry-web |
| Costa del Sud Sardegna | Residence Chia | `residencechia.it` | verified |
| Costa del Sud Sardegna | CHIA Resort — Kroatien, sat i rytme for jer. | `chiaresort.com` | verified |
| Costa del Sud Sardegna | B&B Casa Carbonara Cividale del Friuli | `casacarbonara.com` | verified |
| Costa del Sud Sardegna | Tenuta Carbonara | `tenutacarbonara.com` | verified |
| Costa del Sud Sardegna | COSTA REI SUITES Seaside Living | `costareisuites.com` | verified |
| Taormina e Riviera dei Ciclopi | Hotel Villa Carlotta | `hotelvillacarlottataormina.com` | verified |
| Taormina e Riviera dei Ciclopi | Hotel Naxos Authentic Island Stays | `hotelnaxos.com` | verified |
| Taormina e Riviera dei Ciclopi | Appartamenti Residence Giardini Riccione | `residencegiardini.it` | verified |
| Taormina e Riviera dei Ciclopi | Hotel Bella & Leisure, Lago di Garda | `bellahotel.com` | verified |
| Taormina e Riviera dei Ciclopi | Hotel Riccione 3 Stelle vacanze Economiche | `hoteltaormina.com` | verified |
| Taormina e Riviera dei Ciclopi | Taormina Resort | `taorminaresort.it` | verified |
| Taormina e Riviera dei Ciclopi | Residence San Benedetto del Tronto | `residencetaormina.it` | verified |
| Taormina e Riviera dei Ciclopi | Albergo 3 Stelle nelle Dolomiti | `albergoantico.com` | verified |
| Taormina e Riviera dei Ciclopi | Hotel San Benedetto del Tronto con piscina e | `hoteltaormina.it` | verified |
| Taormina e Riviera dei Ciclopi | Downtown Denver Hotels | `hotelteatro.com` | verified |
| Taormina e Riviera dei Ciclopi | Isolabella, Hotel a Fiera di Primiero 4 | `hotelisolabella.it` | verified |
| Taormina e Riviera dei Ciclopi | Albergo Teatro La Spezia | `albergoteatro.it` | verified |
| Taormina e Riviera dei Ciclopi | Hippocampus B&B | `bbgiardininaxos.com` | verified |
| Taormina e Riviera dei Ciclopi | Chalet Bella | `chaletbella.com` | verified |
| Tivoli | B&B Villa Vesta Bed and Breakfast a Vieste | `villavesta.com` | verified |
| Tivoli | Hotel Adriana | `hoteladriana.com` | verified |
| Tivoli | Naxos Hotel Villa Adriana | `adrianahotel.com` | verified |
| Tivoli | Hotel Villa Adriana Tivoli | `villaadrianahotel.it` | verified |
| Tivoli | Tivoli Hotel | `tivolihotel.com` | verified |
| Tivoli | Hotel a Roma Piazza di Spagna | `hotelgregoriana.it` | verified |
| Tivoli | Hotel Tivoli Venice | `hoteltivoli.it` | verified |
| Tivoli | Dimora Vesta Comunità alloggio per la terza | `dimoravesta.it` | verified |
| Tivoli | Villa Adriana Bed Breakfast Ragusa | `villaadrianabb.it` | verified |
| Tivoli | Albergo Casa Este, Hotel a Brenzone sul lago | `casaeste.it` | verified |
| Tivoli | ESTE ELEGANT SUITES & VILLAS Kiotari, Rhodes | `estesuites.com` | verified |
| Tivoli | B&B LA GIADA TIVOLI RM Il B&B che ti accoglie | `bbtivoli.com` | verified |
| Tivoli | Agriturismo Tivoli La Meridiana, Bed and | `agriturismotivoli.it` | verified |
| San Vito Lo Capo e Trapanese | Hotel Saline Palinuro | `hotelsaline.com` | verified |
| San Vito Lo Capo e Trapanese | Residence Garibaldi Trapani | `residencetrapani.it` | verified |
| San Vito Lo Capo e Trapanese | Zingaro Hotel & Ristorante San Vito Lo Capo | `zingarohotel.com` | verified |
| San Vito Lo Capo e Trapanese | Zingaro Resort Sea View Village & Spa | `zingaroresort.com` | verified |
| San Vito Lo Capo e Trapanese | Hotel Tonnara di Trabia | `hoteltonnara.it` | verified |
| San Vito Lo Capo e Trapanese | CasaTrapani B&B / Affittacamere ed | `casatrapani.it` | verified |
| San Vito Lo Capo e Trapanese | Baglio Donna Santa | `agriturismotrapani.it` | verified |
| San Vito Lo Capo e Trapanese | Passepartout | `albergopassepartout.it` | registry-web |
| Tropea | Locanda Rossa | `locandarossa.com` | verified |
| Tropea | Capovaticano Resort Costa degli Dei in | `capovaticanoresort.it` | verified |
| Tropea | Masseria Pizzo | `masseriapizzo.it` | verified |
| Tropea | Capo Vaticano Suites - Hotel sulla spiaggia | `capovaticanosuites.it` | verified |
| Tropea | Chalet Rossa | `chaletrossa.com` | verified |
| Tropea | Agriturismo Tropea | `agriturismotropea.it` | verified |
| Urbino | Hotel Bonconte | `viphotels.it` | chain |
| Urbino | Hotel Federico II Built with SitePad | `hotelfederico.it` | verified |
| Urbino | Hotel Raffaello Firenze | `raffaellohotel.it` | verified |
| Urbino | Hotel Raffaello Urbino | `albergoraffaello.com` | verified |
| Urbino | Residence Albornoz Appartamenti Lago di | `residencealbornoz.com` | verified |
| Urbino | Hotel nel centro di Roma vicino al Colosseo | `hotelraffaello.it` | verified |
| Urbino | Residence Marche Appartamenti e bungalow per | `residencemarche.com` | verified |
| Urbino | Rifugio Federico in Val Dosdè | `rifugiofederico.it` | verified |
| Urbino | Casa Federico B&B | `casafederico.it` | verified |
| Urbino | B&B Raffaello - Il Bed & Breakfast a Terzigno | `bbraffaello.it` | verified |
| Urbino | Associazione B&B Marche | `bbmarche.it` | verified |
| Urbino | Chalet Marche | `chaletmarche.it` | verified |
| Val di Fassa | Dolomiti Wellness Hotel Fanes | `hotelfanes.it` | verified |
| Val di Fassa | Tutti gli hotel della Val di Fassa e | `fassahotel.com` | verified |
| Val di Fassa | Canazei tutti gli hotel | `hotelcanazei.it` | verified |
| Val di Fassa | Hotel & Dependance Pordoi | `hotelpordoi.it` | verified |
| Val di Fassa | Hotel Catinaccio | `hotelcatinaccio.com` | verified |
| Val di Fassa | Rifugio Castiglioni Marmolada | `rifugiomarmolada.it` | verified |
| Val di Fassa | Rifugio Salei | `rifugiosalei.it` | registry-web |
| Val di Noto | Seven Rooms Villadorata | `7roomsvilladorata.it` | verified |
| Val di Noto | Country House Villadorata | `countryhousevilladorata.it` | verified |
| Val di Noto | Eremo della Giubiliana | `eremodellagiubiliana.it` | verified |
| Val di Noto | NOTO Hotel | `notohotel.com` | verified |
| Val di Noto | Scicli Suites Vacanze a Scicli | `sciclisuites.it` | verified |
| Val di Noto | Palazzo Modica Noto | `casamodica.com` | verified |
| Val di Noto | Casa vacanze b&b San Giovanni | `ragusabb.com` | verified |
| Val Gardena | Alpenroyal Grand Hotel | `alpenroyal.com` | verified |
| Val Gardena | Hotel Gardena Grödnerhof | `gardena.it` | verified |
| Val Gardena | Hotel Cristina - Albergo a San Rocco di | `cristinahotel.it` | verified |
| Val Gardena | Hotel e a Diamante | `cristinahotel.com` | verified |
| Val Gardena | Selva Resort | `selvaresort.it` | verified |
| Val Gardena | Hotel Cristina Suites | `cristinasuites.com` | verified |
| Val Gardena | Rifugio Cristina | `rifugiocristina.com` | verified |
| Val Gardena | Agriturismo Cristina | `agriturismocristina.com` | verified |
| Val Gardena | Residence a Corvara | `chaletcristina.it` | verified |
| Val Gardena | Cascina Selva Agriturismo e Azienda | `cascinaselva.it` | verified |
| Val Gardena | ADLER Dolomiti | `adler-dolomiti.com` | registry-web |
| Val Gardena | Almhotel Col Raiser | `colraiser.com` | registry-web |
| Val Gardena | Alpenheim Charming & Spa Hotel | `alpenheim.it` | registry-web |
| Val Gardena | Alpenhotel Piz Seteur | `pizseteur.it` | registry-web |
| Val Gardena | Alpenhotel Plaza | `alpenhotelplaza.com` | registry-web |
| Val Gardena | Alpin Garden Luxury Maison & SPA | `alpingarden.com` | registry-web |
| Val Gardena | Alpin Sport Apartments | `alpin-sport.com` | registry-web |
| Val Gardena | Alpin & Vital Hotel La Perla | `laperlahotel.info` | registry-web |
| Val Gardena | Alpstay Chalet Hotel Hartmann – Adults Only | `alpstay.eu` | registry-web |
| Val Gardena | Alpurio | `alpurio.com` | registry-web |
| Val d'Orcia | Rosewood Castiglion del Bosco | `rosewoodhotels.com` | chain |
| Val d'Orcia | Adler Spa Resort Thermae | `adler-resorts.com` | chain |
| Val d'Orcia | Hotel Posta Marcucci | `hotelpostamarcucci.it` | verified |
| Val d'Orcia | La Bandita Townhouse | `la-bandita.com` | verified |
| Val d'Orcia | Hotel Piccolo Mondo A due passi dalla Val | `hotelamiata.it` | verified |
| Val d'Orcia | Bagno B&B | `bagnobb.com` | verified |
| Val Pusteria | Alpen Tesitin Panorama Wellness Resort | `alpentesitin.it` | verified |
| Val Pusteria | Val Pusteria | `hotelvalpusteria.com` | verified |
| Val Pusteria | ≣ HOTEL DOBBIACO • Tariffe e Disponibilità | `hoteldobbiaco.com` | verified |
| Val Pusteria | Corones Suites in Olang | `coronessuites.com` | verified |
| Val Pusteria | Aberle Hof | `aberlehof.com` | registry-web |
| Val Pusteria | Adler Suite & Stube | `hoteladler.com` | registry-web |
| Val Pusteria | Agalma | `agalmabrunico.com` | registry-web |
| Val Pusteria | Alma Mountain Residence | `almamountain.com` | registry-web |
| Val Pusteria | Almchalet Schafhütte | `tharerwirt.com` | registry-web |
| Val Pusteria | Almhotel Lenz | `almhotel-lenz.com` | registry-web |
| Val Pusteria | Almresidence Unterrain zum Hartl | `almresidenz-unterrain.com` | registry-web |
| Val Pusteria | Alpenhof Dolomit Family | `hotelalpenhof.it` | registry-web |
| Val Pusteria | Hotel Alpino Monte Rota Snc | `alpenhotel-ratsberg.com` | registry-web |
| Val Pusteria | Alpen Natur Camping | `alpen-natur-camping.com` | registry-web |
| Val Pusteria | Alpine Chalets App. Pichlerhof | `pichlerhof.info` | registry-web |
| Val Pusteria | Alpine Luxury Penthouse | `luxurypenthouse.it` | registry-web |
| Val Pusteria | Alpine Nature Hotel Stoll | `hotelstoll.com` | registry-web |
| Val Pusteria | Alping Apartments 2° | `app-alping.it` | registry-web |
| Val Pusteria | Alpinhotel Keil | `alpinhotel.it` | registry-web |
| Val Pusteria | Alpin Natur Hotel Brückele | `hotel-brueckele.it` | registry-web |
| Conegliano Valdobbiadene | Agriturismo Le Spezie Conegliano | `agriturismolespezie.it` | verified |
| Conegliano Valdobbiadene | Agriturismo Casa del Massaro | `agriturismocasadelmassaro.it` | verified |
| Conegliano Valdobbiadene | Hotel Canon DOro a Conegliano | `hotelcanondoro.it` | verified |
| Conegliano Valdobbiadene | Hotel Conegliano | `hotelcristalloconegliano.it` | verified |
| Conegliano Valdobbiadene | Hotel Cont | `hotelconta.it` | verified |
| Conegliano Valdobbiadene | B&B Molinetto | `bbmolinetto.it` | verified |
| Valpolicella | Hotel Giorgio | `hotelgiorgio.com` | verified |
| Valpolicella | Relais Valpolicella | `relaisvalpolicella.it` | verified |
| Valpolicella | B&B Campagnon Valpolicella | `bbvalpolicella.com` | verified |
| Valpolicella | Dimora Valpolicella - Affittacamere | `dimoravalpolicella.it` | verified |
| Valpolicella | Agriturismo Giorgio | `agriturismogiorgio.it` | verified |
| Varenna e Lago di Como | Hotel Royal Victoria | `royalvictoria.com` | verified |
| Varenna e Lago di Como | Grand Hotel Villa Serbelloni | `villaserbelloni.com` | verified |
| Varenna e Lago di Como | Villa d'Este | `villadeste.com` | verified |
| Varenna e Lago di Como | Hotel Bellagio | `hotelbellagio.it` | verified |
| Varenna e Lago di Como | Hotel Villa Cipressi | `hotelvillacipressi.it` | verified |
| Varenna e Lago di Como | Il Monastero Hotel | `monasterohotel.it` | verified |
| Varenna e Lago di Como | Monastero Resort & Spa, Soiano sul lago di | `monasteroresort.com` | verified |
| Varenna e Lago di Como | Relais Monastero a Verano di Podenzano | `relaismonastero.it` | verified |
| Varenna e Lago di Como | Bellagio Luxury Suites Apartments | `bellagiosuites.it` | verified |
| Varenna e Lago di Como | Monastero Suites Circo Massimo | `monasterosuites.it` | verified |
| Varenna e Lago di Como | B&B Monastero | `bbmonastero.it` | verified |
| Venezia e Laguna | Aman Venice | `aman.com` | chain |
| Venezia e Laguna | Ca' Sagredo Hotel | `casagredohotel.com` | verified |
| Venezia e Laguna | Hotel Ai Reali | `hotelaireali.com` | verified |
| Venezia e Laguna | Belmond Hotel Cipriani | `belmond.com` | chain |
| Venezia e Laguna | Ca' di Dio | `vretreats.com` | chain |
| Venezia e Laguna | Hotel Antiche Figure | `hotelantichefigure.it` | verified |
| Venezia e Laguna | Hotel Metropole Venezia | `hotelmetropole.com` | verified |
| Venezia e Laguna | Bauer Palazzo | `bauervenezia.com` | verified |
| Venezia e Laguna | Hotel Londra Palace | `londrapalace.com` | verified |
| Venezia e Laguna | NH Collection Venezia Palazzo Barocci | `nh-hotels.it` | chain |
| Venezia e Laguna | Hotel Laguna Matrimonio sul Lago di Garda | `lagunahotel.it` | verified |
| Venezia e Laguna | Il nuovo Residence Burano a Jesolo Lido | `residenceburano.it` | verified |
| Venezia e Laguna | Rialto Hotel & Cà Rialto House | `rialtohotel.com` | verified |
| Venezia e Laguna | Hotel Rialto Grado | `hotelrialto.it` | verified |
| Venezia e Laguna | Hotel Murano | `hotelmurano.it` | verified |
| Venezia e Laguna | Hotel Venezia Marina di Pietrasanta SITO | `albergovenezia.com` | verified |
| Venezia e Laguna | Villa Ducale | `villaducale.com` | verified |
| Venezia e Laguna | Relais Ducale Hotel Spa & Pool | `relaisducale.it` | verified |
| Venezia e Laguna | Hotel Ducale | `ducalehotel.it` | verified |
| Venezia e Laguna | Residence Ducale Appartamenti a Rodi Garganico | `residenceducale.it` | verified |
| Verona | Due Torri Hotel | `duetorrihotels.com` | verified |
| Verona | Palazzo Victoria | `palazzovictoria.com` | verified |
| Verona | Hotel Gabbia d'Oro | `hotelgabbiadoro.it` | verified |
| Verona | Hotel Accademia | `hotelaccademiaverona.it` | verified |
| Verona | Byblos Art Hotel Villa Amistà | `byblosarthotel.com` | verified |
| Verona | Hotel Indigo Verona | `ihg.com` | chain |
| Verona | Escalus Luxury Suites | `escalusverona.com` | verified |
| Verona | Hotel Colomba d'Oro | `colombahotel.com` | verified |
| Verona | Gruppo Hotel Castel Vecchio Castel Gandolfo | `hotelcastelvecchio.com` | verified |
| Verona | Hotel a Riccione con piscina e vicino al mare | `hotelgiulietta.com` | verified |
| Verona | Arena Hotel | `arenahotel.com` | verified |
| Verona | Hotel Giulietta, hotel tre stelle a Senigallia | `hotelgiulietta.it` | verified |
| Verona | residence verona - Soave - Vicenza - Beb | `residenceverona.com` | verified |
| Verona | Residence Verona - Affitto turistico | `residenceverona.it` | verified |
| Verona | Hotel Arena Sirmione | `hotelarena.it` | verified |
| Verona | Relais Verona | `relaisverona.com` | verified |
| Verona | B&B Agrigento | `villaarena.it` | verified |
| Verona | Albergo Arena Verona | `albergoarena.it` | verified |
| Verona | Hotel All inclusive Marebello Rimini 3 | `hotelarena.com` | verified |
| Verona | Hotel Verona | `hotelverona.it` | verified |
| Versilia | Grand Hotel Principe di Piemonte | `principedipiemonte.com` | verified |
| Versilia | Augustus Hotel & Resort | `augustus-hotel.it` | verified |
| Versilia | Hotel Byron | `hotelbyron.net` | verified |
| Versilia | Albergo Pietrasanta | `albergopietrasanta.com` | verified |
| Versilia | Hotel Versilia 2 stelle a Lido di Camaiore | `hotelversilia.com` | verified |
| Versilia | Hotel Forte | `hotelforte.com` | verified |
| Versilia | La Casa nei Pini | `bbviareggio.it` | verified |
| Versilia | Masseria Carnevale | `masseriacarnevale.com` | verified |
| Vipiteno | Romantik Hotel Stafler | `stafler.com` | verified |
| Vipiteno | Hotel with Spa in Cortina dAmpezzo | `hotelnatale.it` | verified |
| Vipiteno | Hotel Tasso | `hoteltasso.it` | verified |
| Vipiteno | Albergo, Ristorante & Pizzeria | `villanuova.it` | verified |
| Vipiteno | di Tasso Suites a Sorrento | `tassosuites.it` | verified |
| Vipiteno | Azienda Agricola e Agriturismo Cascina Nuova | `cascinanuova.com` | verified |
| Vipiteno | Masseria Nuova | `masserianuova.it` | verified |
| Vipiteno | Hotel B&B Cesenatico Porto Canale | `casadodici.com` | verified |
| Vipiteno | 164 apt. | `164apt.com` | registry-web |
| Vipiteno | Almarett | `almarett.it` | registry-web |
| Vipiteno | Alpin Apartments Heidenberger | `appartments-heidenberger.com` | registry-web |
| Vipiteno | Alpin Hotel Gudrun | `hotel-gudrun.com` | registry-web |
| Vipiteno | Alpura - Rooted in nature. Created for families. | `alpura-retreat.com` | registry-web |
| Vipiteno | Anett Hotel | `anett-hotel.com` | registry-web |
| Vipiteno | Apartements Margit | `app-margit.com` | registry-web |
| Vipiteno | Aparthotel Pichler | `aparthotel-pichler.com` | registry-web |
| Vipiteno | Apartment 19 | `apartment19.info` | registry-web |
| Vipiteno | Apartment Bergzeit | `rassek.vacation-bookings.com` | registry-web |
| Vipiteno | Apartmenthouse Stern | `apartment.stern.one` | registry-web |
| Vipiteno | Apartment Memory | `apartment-memory.com` | registry-web |
| Vulture e Aglianico | Apart Hotel Comiso | `palazzomelfi.com` | verified |
| Vulture e Aglianico | Scopri il Fascino del Monticchio Resort! Il | `masseriamonticchio.it` | verified |

## Domini di gruppo

Su questi la decisione su chi può leggere il sito la prende la catena, non
l'albergatore. Il dataset lo dichiara invece di far sembrare che sia una
scelta della singola struttura.

`marriott.com` · `accor.com` · `ihg.com` · `hyatt.com` · `hilton.com` · `fourseasons.com` · `dorchestercollection.com` · `roccofortehotels.com` · `belmond.com` · `aman.com` · `lungarnocollection.com` · `eurostarshotels.com` · `vretreats.com` · `melia.com` · `nh-hotels.it` · `lungolivigno.com` · `viphotels.it` · `comohotels.com` · `jumeirah.com` · `rosewoodhotels.com` · `adler-resorts.com` · `bettojahotels.it` · `lakecomo.is`

## Come una struttura viene assegnata a un territorio

È il passaggio in cui è più facile sbagliare, ed è quello che ho sbagliato
alla prima passata. Assegnando semplicemente al territorio più vicino entro
25 km, metà delle strutture finiva nel posto sbagliato: alberghi di
Bressanone sotto Val Gardena, che è un'altra valle, e alberghi di Zermatt
sotto Cervinia, che è un altro Stato.

La distanza dice dove sta una struttura, non a quale territorio appartiene.
La regola ora è doppia, e basta soddisfarne una:

1. **il comune è un toponimo che la destinazione dichiara** (il suo nome o
   una delle sue entità censite), entro 30 km dal centroide;
2. **oppure la struttura sta entro 10 km dal centroide.**

Chi non soddisfa nessuna delle due resta fuori. Il costo è stato circa
seimila assegnazioni scartate; il guadagno è che quelle rimaste stanno dove
dicono di stare. Le assegnazioni oltre i 12 km sono passate dal 50% al 2%.

Resta un limite noto: 42 coppie di destinazioni distano meno di 30 km, e per
quelle la regola dei 10 km può ancora attribuire la stessa struttura a più
territori. Si chiude solo assegnando ogni comune a una destinazione sola.

## Che cosa resta da fare

1. **I confini territoriali.** 42 coppie di destinazioni distano meno di 30 km.
   Quando le strutture saranno tutte reali, le stesse cadranno in più
   destinazioni. Va risolto assegnando ogni comune a una destinazione sola,
   prima di estrarre gli hotel.
2. **Le regioni senza registro pubblico.** Toscana, Campania, Sicilia,
   Veneto, Sardegna, Lazio e Marche non pubblicano un'anagrafica delle
   strutture in formato leggibile: sono loro a determinare quali territori
   restano scoperti. Le strade possibili: chiedere il dato alle DMO
   regionali, oppure comprarlo.
3. **Il campione è sbilanciato sul lusso.** Le strutture che si trovano più
   facilmente sono quelle che l'AI conosce già, e misurarle sovrastima la
   visibilità media.
4. **I 23 domini che rifiutano i controlli automatici.** Vanno verificati a
   mano: il 403 dice che c'è un firewall, non che il sito sia sbagliato.

