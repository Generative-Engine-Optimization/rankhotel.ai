# Contenuto dell'Italian AI Visibility Report

Sintesi del contenuto **curato a mano** che alimenta l'osservatorio: quali
destinazioni sono in classifica, quali hotel sono tracciati, quali siti
vengono auditati e quali prompt vengono posti ai modelli.

Questo file è generato da `tools/seed/`. Per cambiare le selezioni si
modificano i file seed e si rilancia `npm run data:generate`, non si edita
questo documento.

| | |
| :--- | ---: |
| Destinazioni in classifica | 100 |
| Categorie di confronto | 5 (20 territori ciascuna) |
| Hotel tracciati | 2000 (20 per destinazione) |
| di cui strutture reali | 40 |
| di cui generate | 1960 |
| Regioni coperte | 20 su 20 |
| Prompt per destinazione | 50 |
| Entità reali censite | 500 |

## Cosa va deciso da chi rivede questo documento

1. **Le 100 destinazioni**: sono selezionate per volume di visitatori e
   rilevanza territoriale. Vanno confermate, sostituite o riordinate.
2. **La categoria primaria** di ciascuna: una destinazione entra in
   classifica in una sola categoria, ma può portare quanti tag vuole.
3. **Le entità in `knownFor`**: sono ciò che un'AI dovrebbe saper citare
   quando le si chiede cosa vedere. Sbagliarle falsa il fattore
   "profondità interna".
4. **I 20 hotel per destinazione**: oggi 40 sono strutture reali, il resto
   sono nomi generati. Vanno sostituiti con selezioni vere.
5. **I domini dei siti**: quelli DMO ed editoriali sono generati dallo slug
   e non esistono. Servono i domini veri prima di poter misurare davvero.

## Come si legge la classifica

Due cose vanno capite prima di guardare i numeri, perché cambiano cosa
significa una posizione.

**Le fasce.** Fra la 38ª e la 41ª posizione non c'è differenza misurabile:
cinque run al mese non producono quella precisione. La fascia sì.

| Fascia | Nome | Score |
| :---: | :--- | ---: |
| A | Molto visibile | 68+ |
| B | Visibile | 61-68 |
| C | Presenza incerta | 54-61 |
| D | Poco visibile | 47-54 |
| E | Quasi assente | 0-47 |

**La scala della domanda.** Venti hotel su Roma e venti hotel su un borgo da
settecento ricerche al mese sono due pagine con lo stesso aspetto e due
significati diversi. Ogni destinazione dichiara quante ricerche mensili
muove sulle query monitorate.

| Livello | Ricerche/mese |
| :--- | ---: |
| Domanda alta | 40.000+ |
| Domanda media | 8000-40.000 |
| Domanda bassa | 1500-8000 |
| Domanda marginale | 0-1500 |

## Le 5 categorie

| Categoria | Slug IT | Slug EN | Soggetto della domanda comparativa |
| :--- | :--- | :--- | :--- |
| Turismo mare | `mare` | `sea` | «le zone di mare più belle in Italia» |
| Turismo montagna e parchi naturali | `montagna-parchi` | `mountains-parks` | «le zone turistiche montane più belle in Italia» |
| Turismo enogastronomico | `enogastronomia` | `food-and-wine` | «le migliori zone per il turismo enogastronomico in Italia» |
| Turismo patrimoni UNESCO | `unesco` | `unesco` | «i patrimoni UNESCO più belli da visitare in Italia» |
| Turismo borghi più belli d'Italia | `borghi` | `villages` | «i borghi più belli d'Italia da visitare» |

**Tag secondari disponibili:** `mare`, `montagna-parchi`, `enogastronomia`, `unesco`, `borghi`, `luxury`, `family`, `romantico`, `slow`, `outdoor`, `trekking`, `neve`, `spiagge`, `wellness`, `vino`, `archeologia`, `citta-arte`, `natura`, `panorami`, `isole`, `lago`, `molto-visitato`, `poco-affollato`

## Turismo mare

Coste, isole e riviere. È la parte più affollata del turismo italiano, e quella dove l'AI ha più nomi fra cui scegliere: entrarci è più difficile che altrove.

| # | Destinazione | EN | Regione | Visitatori/anno | Tag | Coordinate |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | **Costiera Amalfitana** | Amalfi Coast | Campania | 5.200.000 | unesco, borghi, luxury | 40.6333, 14.6027 |
| 2 | **Salento** | Salento | Puglia | 4.100.000 | borghi, family | 40.15, 18.1667 |
| 3 | **Cinque Terre** | Cinque Terre | Liguria | 3.800.000 | unesco, borghi, outdoor | 44.1268, 9.7095 |
| 4 | **Costa Smeralda** | Costa Smeralda | Sardegna | 1.900.000 | luxury | 41.13, 9.53 |
| 5 | **Isola d'Elba** | Elba Island | Toscana | 2.300.000 | family, outdoor | 42.77, 10.28 |
| 6 | **Gargano** | Gargano | Puglia | 2.600.000 | montagna-parchi, family | 41.8, 16 |
| 7 | **Riviera Romagnola** | Romagna Riviera | Emilia-Romagna | 8.200.000 | family | 44.06, 12.57 |
| 8 | **Taormina e Riviera dei Ciclopi** | Taormina and the Riviera dei Ciclopi | Sicilia | 2.400.000 | unesco, luxury | 37.8516, 15.2853 |
| 9 | **Golfo di Orosei** | Gulf of Orosei | Sardegna | 900.000 | outdoor | 40.25, 9.68 |
| 10 | **Riviera Ligure di Ponente** | Ligurian Riviera di Ponente | Liguria | 3.100.000 | family | 43.8167, 8.0333 |
| 11 | **Isola di Capri** | Capri | Campania | 2.700.000 | luxury | 40.5532, 14.2222 |
| 12 | **Isole Eolie** | Aeolian Islands | Sicilia | 1.100.000 | unesco, outdoor | 38.49, 14.94 |
| 13 | **Versilia** | Versilia | Toscana | 2.900.000 | family, luxury | 43.96, 10.21 |
| 14 | **Riviera del Conero** | Conero Riviera | Marche | 1.200.000 | montagna-parchi, outdoor | 43.55, 13.6 |
| 15 | **Costa Molisana** | Molise Coast | Molise | 700.000 | borghi, slow | 42, 14.995 |
| 16 | **Ischia e Procida** | Ischia and Procida | Campania | 2.200.000 | wellness, borghi | 40.73, 13.9 |
| 17 | **San Vito Lo Capo e Trapanese** | San Vito Lo Capo and the Trapani coast | Sicilia | 1.400.000 | borghi, enogastronomia | 38.174, 12.735 |
| 18 | **Isole Tremiti** | Tremiti Islands | Puglia | 300.000 | outdoor | 42.12, 15.5 |
| 19 | **Costa del Sud Sardegna** | Southern Sardinia coast | Sardegna | 1.700.000 | family, outdoor | 39.27, 9.57 |
| 20 | **Cilento** | Cilento | Campania | 2.000.000 | unesco, montagna-parchi, enogastronomia | 40.2, 15.15 |

<details><summary>Entità censite e forme grammaticali</summary>

| Destinazione | Entità in `knownFor` | Forma «in» | Forma con articolo |
| :--- | :--- | :--- | :--- |
| Costiera Amalfitana | Positano · Amalfi · Ravello · Villa Cimbrone · Sentiero degli Dei | in Costiera Amalfitana | la Costiera Amalfitana |
| Salento | Otranto · Gallipoli · Santa Maria di Leuca · Torre dell'Orso · Grotta della Poesia | nel Salento | il Salento |
| Cinque Terre | Vernazza · Manarola · Monterosso al Mare · Sentiero Azzurro · Riomaggiore | alle Cinque Terre | le Cinque Terre |
| Costa Smeralda | Porto Cervo · Spiaggia del Principe · Arcipelago della Maddalena · Baja Sardinia · Capriccioli | in Costa Smeralda | la Costa Smeralda |
| Isola d'Elba | Portoferraio · Villa dei Mulini · Monte Capanne · Spiaggia di Sansone · Capoliveri | all'Isola d'Elba | l'Isola d'Elba |
| Gargano | Vieste · Peschici · Foresta Umbra · Baia delle Zagare · Monte Sant'Angelo | sul Gargano | il Gargano |
| Riviera Romagnola | Rimini · Riccione · Cesenatico · Mirabilandia · Cattolica | in Riviera Romagnola | la Riviera Romagnola |
| Taormina e Riviera dei Ciclopi | Teatro Antico di Taormina · Isola Bella · Castelmola · Giardini Naxos · Aci Trezza | a Taormina e Riviera dei Ciclopi | Taormina e Riviera dei Ciclopi |
| Golfo di Orosei | Cala Goloritzè · Cala Luna · Cala Mariolu · Gola di Gorropu · Selvaggio Blu | nel Golfo di Orosei | il Golfo di Orosei |
| Riviera Ligure di Ponente | Sanremo · Alassio · Bordighera · Grotte di Toirano · Finale Ligure | in Riviera Ligure di Ponente | la Riviera Ligure di Ponente |
| Isola di Capri | Grotta Azzurra · Faraglioni · Villa Jovis · Monte Solaro · Anacapri | a Isola di Capri | Isola di Capri |
| Isole Eolie | Stromboli · Vulcano · Lipari · Panarea · Salina | alle Isole Eolie | le Isole Eolie |
| Versilia | Forte dei Marmi · Viareggio · Carnevale di Viareggio · Pietrasanta · Lago di Massaciuccoli | in Versilia | la Versilia |
| Riviera del Conero | Sirolo · Numana · Spiaggia delle Due Sorelle · Portonovo · Monte Conero | sulla Riviera del Conero | la Riviera del Conero |
| Costa Molisana | Termoli · Borgo Antico di Termoli · Trabucchi molisani · Petacciato · Campomarino | sulla Costa Molisana | la Costa Molisana |
| Ischia e Procida | Castello Aragonese · Giardini La Mortella · Marina Corricella · Terme di Poseidon · Sant'Angelo | a Ischia e Procida | Ischia e Procida |
| San Vito Lo Capo e Trapanese | Riserva dello Zingaro · Scopello · Saline di Trapani · Tonnara di Scopello · Segesta | a San Vito Lo Capo e Trapanese | San Vito Lo Capo e Trapanese |
| Isole Tremiti | San Domino · San Nicola · Cala delle Arene · Abbazia di Santa Maria a Mare · Grotta del Bue Marino | alle Isole Tremiti | le Isole Tremiti |
| Costa del Sud Sardegna | Costa Rei · Villasimius · Chia · Spiaggia di Tuerredda · Capo Carbonara | nella Costa del Sud Sardegna | la Costa del Sud Sardegna |
| Cilento | Paestum · Palinuro · Grotte di Castelcivita · Certosa di Padula · Monte Cervati | nel Cilento | il Cilento |

</details>

## Turismo montagna e parchi naturali

Alpi, Appennini e parchi nazionali. Due stagioni invece di una, e una gara dominata da pochi nomi molto forti che l'AI ripete sempre.

| # | Destinazione | EN | Regione | Visitatori/anno | Tag | Coordinate |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | **Dolomiti** | Dolomites | Trentino-Alto Adige | 4.600.000 | unesco, outdoor, luxury | 46.4102, 11.844 |
| 2 | **Cortina d'Ampezzo** | Cortina d'Ampezzo | Veneto | 1.300.000 | luxury, outdoor | 46.5405, 12.1357 |
| 3 | **Alta Badia** | Alta Badia | Trentino-Alto Adige | 1.100.000 | luxury, enogastronomia | 46.56, 11.89 |
| 4 | **Val Gardena** | Val Gardena | Trentino-Alto Adige | 1.400.000 | outdoor, family | 46.56, 11.67 |
| 5 | **Madonna di Campiglio** | Madonna di Campiglio | Trentino-Alto Adige | 900.000 | luxury, outdoor | 46.23, 10.83 |
| 6 | **Cervinia e Valtournenche** | Cervinia and Valtournenche | Valle d'Aosta | 700.000 | outdoor | 45.936, 7.63 |
| 7 | **Courmayeur e Monte Bianco** | Courmayeur and Mont Blanc | Valle d'Aosta | 800.000 | luxury, outdoor | 45.792, 6.969 |
| 8 | **Parco Nazionale del Gran Paradiso** | Gran Paradiso National Park | Valle d'Aosta | 600.000 | outdoor, slow | 45.52, 7.27 |
| 9 | **Parco Nazionale d'Abruzzo** | Abruzzo National Park | Abruzzo | 700.000 | borghi, outdoor | 41.8, 13.78 |
| 10 | **Gran Sasso e Campo Imperatore** | Gran Sasso and Campo Imperatore | Abruzzo | 800.000 | outdoor, borghi | 42.44, 13.56 |
| 11 | **Parco Nazionale dello Stelvio** | Stelvio National Park | Trentino-Alto Adige | 900.000 | outdoor | 46.53, 10.45 |
| 12 | **Val di Fassa** | Val di Fassa | Trentino-Alto Adige | 1.200.000 | family, outdoor | 46.43, 11.76 |
| 13 | **Sila** | Sila | Calabria | 400.000 | slow, enogastronomia | 39.25, 16.55 |
| 14 | **Parco Nazionale del Pollino** | Pollino National Park | Basilicata | 350.000 | outdoor, borghi | 39.9, 16.2 |
| 15 | **Monti Sibillini** | Sibillini Mountains | Marche | 500.000 | borghi, outdoor | 42.9, 13.25 |
| 16 | **Val Pusteria** | Val Pusteria | Trentino-Alto Adige | 1.500.000 | family, outdoor | 46.74, 12.1 |
| 17 | **Alpe di Siusi** | Alpe di Siusi | Trentino-Alto Adige | 1.000.000 | outdoor, wellness | 46.54, 11.63 |
| 18 | **Livigno e Alta Valtellina** | Livigno and Alta Valtellina | Lombardia | 1.100.000 | outdoor, family | 46.538, 10.135 |
| 19 | **Foreste Casentinesi** | Casentino Forests | Toscana | 300.000 | slow, borghi | 43.83, 11.8 |
| 20 | **Etna** | Mount Etna | Sicilia | 1.800.000 | unesco, enogastronomia, outdoor | 37.751, 14.9934 |

<details><summary>Entità censite e forme grammaticali</summary>

| Destinazione | Entità in `knownFor` | Forma «in» | Forma con articolo |
| :--- | :--- | :--- | :--- |
| Dolomiti | Tre Cime di Lavaredo · Lago di Braies · Sassolungo · Val di Funes · Passo Sella | sulle Dolomiti | le Dolomiti |
| Cortina d'Ampezzo | Tofane · Lago di Sorapis · Cinque Torri · Faloria · Corso Italia | a Cortina d'Ampezzo | Cortina d'Ampezzo |
| Alta Badia | Corvara · Sellaronda · Passo Gardena · Piz Boè · La Villa | in Alta Badia | l'Alta Badia |
| Val Gardena | Ortisei · Seceda · Selva di Val Gardena · Santa Cristina Valgardena · Rasciesa | in Val Gardena | la Val Gardena |
| Madonna di Campiglio | Dolomiti di Brenta · Lago di Tovel · Passo Groste · Val Rendena · Pinzolo | a Madonna di Campiglio | Madonna di Campiglio |
| Cervinia e Valtournenche | Cervino · Plateau Rosa · Lago Blu · Breuil-Cervinia · Ghiacciaio del Teodulo | a Cervinia e Valtournenche | Cervinia e Valtournenche |
| Courmayeur e Monte Bianco | Skyway Monte Bianco · Punta Helbronner · Val Ferret · Val Veny · Terme di Pré-Saint-Didier | a Courmayeur e Monte Bianco | Courmayeur e Monte Bianco |
| Parco Nazionale del Gran Paradiso | Valnontey · Cogne · Cascate di Lillaz · Rifugio Vittorio Emanuele II · Valsavarenche | nel Parco Nazionale del Gran Paradiso | il Parco Nazionale del Gran Paradiso |
| Parco Nazionale d'Abruzzo | Pescasseroli · Val Fondillo · Camosciara · Barrea · Lago di Barrea | nel Parco Nazionale d'Abruzzo | il Parco Nazionale d'Abruzzo |
| Gran Sasso e Campo Imperatore | Corno Grande · Campo Imperatore · Rocca Calascio · Santo Stefano di Sessanio · Castelli | sul Gran Sasso e Campo Imperatore | il Gran Sasso e Campo Imperatore |
| Parco Nazionale dello Stelvio | Passo dello Stelvio · Ortles · Val Martello · Solda · Gran Zebrù | nel Parco Nazionale dello Stelvio | il Parco Nazionale dello Stelvio |
| Val di Fassa | Marmolada · Catinaccio · Canazei · Passo Pordoi · Vigo di Fassa | in Val di Fassa | la Val di Fassa |
| Sila | Lago Arvo · Lago Ampollino · Giganti della Sila · Camigliatello Silano · Monte Botte Donato | in Sila | la Sila |
| Parco Nazionale del Pollino | Gole del Raganello · Pino Loricato · Civita · Serra Dolcedorme · Morano Calabro | nel Parco Nazionale del Pollino | il Parco Nazionale del Pollino |
| Monti Sibillini | Castelluccio di Norcia · Piano Grande · Lago di Fiastra · Monte Vettore · Gole dell'Infernaccio | sui Monti Sibillini | i Monti Sibillini |
| Val Pusteria | Plan de Corones · Brunico · Val di Landro · Dobbiaco · Lago di Dobbiaco | in Val Pusteria | la Val Pusteria |
| Alpe di Siusi | Sciliar · Compatsch · Castelrotto · Denti di Terrarossa · Malga Sanon | sull'Alpe di Siusi | l'Alpe di Siusi |
| Livigno e Alta Valtellina | Livigno · Bormio · Bagni Vecchi di Bormio · Passo del Foscagno · Valdidentro | a Livigno e Alta Valtellina | Livigno e Alta Valtellina |
| Foreste Casentinesi | Camaldoli · La Verna · Cascata dell'Acquacheta · Foresta della Lama · Poppi | nelle Foreste Casentinesi | le Foreste Casentinesi |
| Etna | Crateri Silvestri · Rifugio Sapienza · Valle del Bove · Grotta del Gelo · Ferrovia Circumetnea | sull'Etna | l'Etna |

</details>

## Turismo enogastronomico

Territori del vino e della tavola. Poche persone li cercano, ma chi lo fa ha quasi già deciso di partire: qui una citazione vale più che altrove.

| # | Destinazione | EN | Regione | Visitatori/anno | Tag | Coordinate |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | **Langhe** | Langhe | Piemonte | 1.200.000 | unesco, slow, luxury | 44.63, 8.03 |
| 2 | **Chianti Classico** | Chianti Classico | Toscana | 1.600.000 | slow, luxury, borghi | 43.47, 11.3 |
| 3 | **Franciacorta** | Franciacorta | Lombardia | 700.000 | lago, wellness | 45.61, 10.03 |
| 4 | **Valpolicella** | Valpolicella | Veneto | 800.000 | slow | 45.53, 10.92 |
| 5 | **Montalcino** | Montalcino | Toscana | 600.000 | borghi, unesco | 43.057, 11.489 |
| 6 | **Montepulciano** | Montepulciano | Toscana | 700.000 | borghi, slow | 43.099, 11.781 |
| 7 | **Modena e Terre di Motori** | Modena and Motor Valley | Emilia-Romagna | 1.100.000 | unesco | 44.6471, 10.9252 |
| 8 | **Parma e Food Valley** | Parma and the Food Valley | Emilia-Romagna | 1.000.000 | unesco, slow | 44.8015, 10.3279 |
| 9 | **Conegliano Valdobbiadene** | Conegliano Valdobbiadene | Veneto | 900.000 | unesco, slow | 45.89, 12 |
| 10 | **Bolgheri** | Bolgheri | Toscana | 400.000 | luxury, mare | 43.23, 10.6 |
| 11 | **Strada del Vino dell'Alto Adige** | South Tyrol Wine Road | Trentino-Alto Adige | 800.000 | montagna-parchi, slow | 46.4, 11.25 |
| 12 | **Collio Goriziano** | Collio | Friuli-Venezia Giulia | 300.000 | slow | 45.95, 13.53 |
| 13 | **Etna del Vino** | Etna Wine Country | Sicilia | 500.000 | montagna-parchi, unesco | 37.85, 15.15 |
| 14 | **Vulture e Aglianico** | Vulture and Aglianico | Basilicata | 200.000 | slow, borghi | 40.92, 15.7 |
| 15 | **Monferrato** | Monferrato | Piemonte | 600.000 | unesco, slow | 44.9, 8.3 |
| 16 | **Roero** | Roero | Piemonte | 300.000 | unesco, outdoor | 44.75, 7.95 |
| 17 | **Maremma Toscana** | Tuscan Maremma | Toscana | 1.300.000 | mare, slow, outdoor | 42.77, 11.11 |
| 18 | **Terre del Primitivo** | Primitivo Wine Country | Puglia | 400.000 | mare, slow | 40.4, 17.63 |
| 19 | **Irpinia** | Irpinia | Campania | 250.000 | borghi, slow | 40.93, 14.95 |
| 20 | **Montefalco e Sagrantino** | Montefalco and Sagrantino | Umbria | 300.000 | borghi, slow | 42.89, 12.65 |

<details><summary>Entità censite e forme grammaticali</summary>

| Destinazione | Entità in `knownFor` | Forma «in» | Forma con articolo |
| :--- | :--- | :--- | :--- |
| Langhe | Barolo · Barbaresco · Alba · Castello di Grinzane Cavour · Tartufo Bianco d'Alba | nelle Langhe | le Langhe |
| Chianti Classico | Greve in Chianti · Castellina in Chianti · Radda in Chianti · Badia a Passignano · Gallo Nero | nel Chianti Classico | il Chianti Classico |
| Franciacorta | Lago d'Iseo · Monte Isola · Abbazia di San Nicola · Torbiere del Sebino · Erbusco | in Franciacorta | la Franciacorta |
| Valpolicella | Amarone · San Giorgio di Valpolicella · Villa della Torre · Fumane · Negrar | in Valpolicella | la Valpolicella |
| Montalcino | Brunello di Montalcino · Abbazia di Sant'Antimo · Fortezza di Montalcino · Poggio Antico · Castelnuovo dell'Abate | a Montalcino | Montalcino |
| Montepulciano | Vino Nobile di Montepulciano · Piazza Grande · Tempio di San Biagio · Palazzo Comunale di Montepulciano · Fortezza di Montepulciano | a Montepulciano | Montepulciano |
| Modena e Terre di Motori | Duomo di Modena · Aceto Balsamico Tradizionale · Museo Ferrari · Torre Ghirlandina · Mercato Albinelli | a Modena e Terre di Motori | Modena e Terre di Motori |
| Parma e Food Valley | Parmigiano Reggiano · Prosciutto di Parma · Teatro Farnese · Labirinto della Masone · Castello di Torrechiara | a Parma e Food Valley | Parma e Food Valley |
| Conegliano Valdobbiadene | Prosecco Superiore · Cartizze · Rive di Valdobbiadene · Molinetto della Croda · Follina | a Conegliano Valdobbiadene | Conegliano Valdobbiadene |
| Bolgheri | Viale dei Cipressi · Sassicaia · Castagneto Carducci · Oratorio di San Guido · Rifugio Faunistico | a Bolgheri | Bolgheri |
| Strada del Vino dell'Alto Adige | Caldaro · Termeno · Lago di Caldaro · Appiano · Gewürztraminer | sulla Strada del Vino dell'Alto Adige | la Strada del Vino dell'Alto Adige |
| Collio Goriziano | Cormons · Oslavia · Ribolla Gialla · San Floriano del Collio · Castello di Spessa | nel Collio Goriziano | il Collio Goriziano |
| Etna del Vino | Nerello Mascalese · Randazzo · Linguaglossa · Contrada Rampante · Castiglione di Sicilia | sull'Etna del Vino | l'Etna del Vino |
| Vulture e Aglianico | Aglianico del Vulture · Laghi di Monticchio · Melfi · Venosa · Rionero in Vulture | nel Vulture e Aglianico | il Vulture e Aglianico |
| Monferrato | Infernot · Casale Monferrato · Nizza Monferrato · Barbera d'Asti · Sacro Monte di Crea | nel Monferrato | il Monferrato |
| Roero | Rocche del Roero · Arneis · Bra · Guarene · Canale | nel Roero | il Roero |
| Maremma Toscana | Parco della Maremma · Saturnia · Massa Marittima · Morellino di Scansano · Talamone | in Maremma Toscana | la Maremma Toscana |
| Terre del Primitivo | Manduria · Primitivo di Manduria · Riserva Naturale Torre Colimena · Avetrana · Sava | nelle Terre del Primitivo | le Terre del Primitivo |
| Irpinia | Taurasi · Greco di Tufo · Fiano di Avellino · Montella · Grotte di Pertosa | in Irpinia | l'Irpinia |
| Montefalco e Sagrantino | Sagrantino · Chiesa di San Francesco · Bevagna · Trevi · Fonti del Clitunno | a Montefalco e Sagrantino | Montefalco e Sagrantino |

</details>

## Turismo patrimoni UNESCO

I sessanta siti italiani nella lista del patrimonio mondiale. È la categoria dove l'AI è più sicura di sé, e anche quella dove sbaglia di meno.

| # | Destinazione | EN | Regione | Visitatori/anno | Tag | Coordinate |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | **Roma** | Rome | Lazio | 22.000.000 | luxury, family | 41.9028, 12.4964 |
| 2 | **Firenze** | Florence | Toscana | 11.000.000 | luxury, enogastronomia | 43.7696, 11.2558 |
| 3 | **Venezia e Laguna** | Venice and its Lagoon | Veneto | 13.000.000 | luxury | 45.4408, 12.3155 |
| 4 | **Napoli** | Naples | Campania | 6.800.000 | enogastronomia, family | 40.8518, 14.2681 |
| 5 | **Matera** | Matera | Basilicata | 900.000 | borghi, slow | 40.6664, 16.6043 |
| 6 | **Val d'Orcia** | Val d'Orcia | Toscana | 1.400.000 | enogastronomia, slow | 43.03, 11.61 |
| 7 | **Pompei ed Ercolano** | Pompeii and Herculaneum | Campania | 4.200.000 | family | 40.7497, 14.4869 |
| 8 | **Val di Noto** | Val di Noto | Sicilia | 1.500.000 | borghi, enogastronomia | 36.89, 14.9 |
| 9 | **Ferrara e Delta del Po** | Ferrara and the Po Delta | Emilia-Romagna | 800.000 | montagna-parchi, slow | 44.8378, 11.6197 |
| 10 | **Aquileia** | Aquileia | Friuli-Venezia Giulia | 300.000 | slow | 45.77, 13.36 |
| 11 | **Urbino** | Urbino | Marche | 400.000 | borghi, slow | 43.7262, 12.6365 |
| 12 | **Siena** | Siena | Toscana | 2.100.000 | enogastronomia, borghi | 43.3188, 11.3308 |
| 13 | **Assisi** | Assisi | Umbria | 1.200.000 | borghi, slow | 43.0707, 12.6196 |
| 14 | **Ravenna** | Ravenna | Emilia-Romagna | 1.100.000 | slow | 44.4184, 12.2035 |
| 15 | **Alberobello e Valle d'Itria** | Alberobello and Valle d'Itria | Puglia | 1.300.000 | borghi, enogastronomia | 40.7852, 17.2372 |
| 16 | **Valle dei Templi** | Valley of the Temples | Sicilia | 1.000.000 | mare | 37.29, 13.59 |
| 17 | **Verona** | Verona | Veneto | 3.200.000 | enogastronomia, lago | 45.4384, 10.9916 |
| 18 | **Sacri Monti** | Sacred Mountains | Piemonte | 350.000 | slow, montagna-parchi | 45.81, 8.41 |
| 19 | **Mantova e Sabbioneta** | Mantua and Sabbioneta | Lombardia | 700.000 | enogastronomia, slow | 45.1564, 10.7914 |
| 20 | **Tivoli** | Tivoli | Lazio | 900.000 | slow | 41.963, 12.796 |

<details><summary>Entità censite e forme grammaticali</summary>

| Destinazione | Entità in `knownFor` | Forma «in» | Forma con articolo |
| :--- | :--- | :--- | :--- |
| Roma | Colosseo · Musei Vaticani · Fontana di Trevi · Pantheon · Foro Romano | a Roma | Roma |
| Firenze | Galleria degli Uffizi · Duomo di Firenze · Ponte Vecchio · Galleria dell'Accademia · Palazzo Pitti | a Firenze | Firenze |
| Venezia e Laguna | Piazza San Marco · Palazzo Ducale di Venezia · Ponte di Rialto · Murano · Burano | a Venezia e Laguna | Venezia e Laguna |
| Napoli | Napoli Sotterranea · Cappella Sansevero · Museo Archeologico Nazionale di Napoli · Spaccanapoli · Certosa di San Martino | a Napoli | Napoli |
| Matera | Sassi di Matera · Cripta del Peccato Originale · Casa Grotta · Murgia Materana · Cattedrale di Matera | a Matera | Matera |
| Val d'Orcia | Pienza · Bagno Vignoni · Cappella della Madonna di Vitaleta · San Quirico d'Orcia · Monte Amiata | in Val d'Orcia | la Val d'Orcia |
| Pompei ed Ercolano | Scavi di Pompei · Villa dei Misteri · Ercolano · Vesuvio · Villa Oplontis | a Pompei ed Ercolano | Pompei ed Ercolano |
| Val di Noto | Noto · Ragusa Ibla · Modica · Scicli · Cioccolato di Modica | nel Val di Noto | il Val di Noto |
| Ferrara e Delta del Po | Castello Estense · Palazzo dei Diamanti · Comacchio · Abbazia di Pomposa · Valli di Comacchio | a Ferrara e Delta del Po | Ferrara e Delta del Po |
| Aquileia | Basilica di Aquileia · Mosaici paleocristiani di Aquileia · Museo Archeologico Nazionale di Aquileia · Foro Romano di Aquileia · Grado | ad Aquileia | Aquileia |
| Urbino | Palazzo Ducale di Urbino · Galleria Nazionale delle Marche · Casa di Raffaello · Fortezza Albornoz · Studiolo di Federico | a Urbino | Urbino |
| Siena | Piazza del Campo · Palio di Siena · Duomo di Siena · Torre del Mangia · Santa Maria della Scala | a Siena | Siena |
| Assisi | Basilica di San Francesco · Eremo delle Carceri · Rocca Maggiore · Basilica di Santa Chiara · Porziuncola | ad Assisi | Assisi |
| Ravenna | Basilica di San Vitale · Mausoleo di Galla Placidia · Basilica di Sant'Apollinare in Classe · Battistero Neoniano · Tomba di Dante | a Ravenna | Ravenna |
| Alberobello e Valle d'Itria | Trulli di Alberobello · Rione Monti · Locorotondo · Martina Franca · Cisternino | ad Alberobello e Valle d'Itria | Alberobello e Valle d'Itria |
| Valle dei Templi | Tempio della Concordia · Tempio di Giunone · Scala dei Turchi · Giardino della Kolymbethra · Museo Archeologico Pietro Griffo | nella Valle dei Templi | la Valle dei Templi |
| Verona | Arena di Verona · Casa di Giulietta · Piazza delle Erbe · Castelvecchio · Basilica di San Zeno | a Verona | Verona |
| Sacri Monti | Sacro Monte di Varallo · Sacro Monte di Orta · Sacro Monte di Varese · Lago d'Orta · Isola San Giulio | sui Sacri Monti | i Sacri Monti |
| Mantova e Sabbioneta | Palazzo Ducale di Mantova · Camera degli Sposi · Palazzo Te · Teatro all'Antica · Laghi di Mantova | a Mantova e Sabbioneta | Mantova e Sabbioneta |
| Tivoli | Villa d'Este · Villa Adriana · Villa Gregoriana · Tempio di Vesta · Cascate dell'Aniene | a Tivoli | Tivoli |

</details>

## Turismo borghi più belli d'Italia

Piccoli centri con pochi posti letto. È qui che essere nominati da un'AI sposta davvero il conto di fine mese: bastano poche persone in più.

| # | Destinazione | EN | Regione | Visitatori/anno | Tag | Coordinate |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | **Civita di Bagnoregio** | Civita di Bagnoregio | Lazio | 900.000 | slow | 42.628, 12.114 |
| 2 | **San Gimignano** | San Gimignano | Toscana | 1.500.000 | unesco, enogastronomia | 43.4677, 11.043 |
| 3 | **Castelmezzano e Dolomiti Lucane** | Castelmezzano and the Lucanian Dolomites | Basilicata | 250.000 | montagna-parchi, outdoor | 40.53, 16.05 |
| 4 | **Ostuni** | Ostuni | Puglia | 1.100.000 | mare, enogastronomia | 40.73, 17.58 |
| 5 | **Bosa** | Bosa | Sardegna | 200.000 | mare, slow | 40.297, 8.499 |
| 6 | **Spello** | Spello | Umbria | 300.000 | slow, enogastronomia | 42.991, 12.671 |
| 7 | **Tropea** | Tropea | Calabria | 800.000 | mare, family | 38.677, 15.898 |
| 8 | **Vipiteno** | Sterzing | Trentino-Alto Adige | 400.000 | montagna-parchi, family | 46.897, 11.43 |
| 9 | **Orvieto** | Orvieto | Umbria | 900.000 | enogastronomia, slow | 42.717, 12.111 |
| 10 | **Portovenere** | Portovenere | Liguria | 700.000 | unesco, mare | 44.049, 9.837 |
| 11 | **Scanno** | Scanno | Abruzzo | 200.000 | montagna-parchi, slow | 41.904, 13.879 |
| 12 | **Pitigliano** | Pitigliano | Toscana | 300.000 | enogastronomia, slow | 42.635, 11.669 |
| 13 | **Gradara** | Gradara | Marche | 300.000 | family, mare | 43.941, 12.771 |
| 14 | **Castelsardo** | Castelsardo | Sardegna | 350.000 | mare, slow | 40.915, 8.71 |
| 15 | **Erice** | Erice | Sicilia | 600.000 | mare, enogastronomia | 38.037, 12.586 |
| 16 | **Dozza** | Dozza | Emilia-Romagna | 150.000 | enogastronomia, slow | 44.36, 11.63 |
| 17 | **Varenna e Lago di Como** | Varenna and Lake Como | Lombardia | 1.200.000 | lago, luxury | 46.01, 9.285 |
| 18 | **Apricale** | Apricale | Liguria | 120.000 | slow, enogastronomia | 43.877, 7.664 |
| 19 | **Cividale del Friuli** | Cividale del Friuli | Friuli-Venezia Giulia | 300.000 | unesco, enogastronomia | 46.094, 13.433 |
| 20 | **Sperlonga** | Sperlonga | Lazio | 500.000 | mare, family | 41.26, 13.43 |

<details><summary>Entità censite e forme grammaticali</summary>

| Destinazione | Entità in `knownFor` | Forma «in» | Forma con articolo |
| :--- | :--- | :--- | :--- |
| Civita di Bagnoregio | Ponte pedonale di Civita · Porta Santa Maria · Valle dei Calanchi · Chiesa di San Donato · Grotta di San Bonaventura | a Civita di Bagnoregio | Civita di Bagnoregio |
| San Gimignano | Torri di San Gimignano · Piazza della Cisterna · Collegiata · Vernaccia di San Gimignano · Torre Grossa | a San Gimignano | San Gimignano |
| Castelmezzano e Dolomiti Lucane | Volo dell'Angelo · Pietrapertosa · Gradinata Normanna · Percorso delle Sette Pietre · Monte Impiso | a Castelmezzano e Dolomiti Lucane | Castelmezzano e Dolomiti Lucane |
| Ostuni | Città Bianca di Ostuni · Cattedrale di Ostuni · Costa Merlata · Torre Pozzelle · Parco Dune Costiere | ad Ostuni | Ostuni |
| Bosa | Castello Malaspina · Case colorate sul Temo · Bosa Marina · Chiesa di San Pietro Extramuros · Malvasia di Bosa | a Bosa | Bosa |
| Spello | Infiorate di Spello · Cappella Baglioni · Porta Venere · Villa dei Mosaici · Monte Subasio | a Spello | Spello |
| Tropea | Santa Maria dell'Isola · Spiaggia della Rotonda · Cipolla Rossa di Tropea · Capo Vaticano · Pizzo Calabro | a Tropea | Tropea |
| Vipiteno | Torre delle Dodici · Via Città Nuova · Monte Cavallo · Castel Tasso · Mercatino di Natale | a Vipiteno | Vipiteno |
| Orvieto | Duomo di Orvieto · Pozzo di San Patrizio · Orvieto Underground · Torre del Moro · Orvieto Classico | ad Orvieto | Orvieto |
| Portovenere | Chiesa di San Pietro · Grotta Byron · Castello Doria · Isola Palmaria · Via Capellini | a Portovenere | Portovenere |
| Scanno | Lago di Scanno · Cuore di Scanno · Costume scannese · Gole del Sagittario · Chiesa di Santa Maria della Valle | a Scanno | Scanno |
| Pitigliano | Vie Cave · Piccola Gerusalemme · Acquedotto Mediceo · Sovana · Sorano | a Pitigliano | Pitigliano |
| Gradara | Rocca di Gradara · Camminamenti di ronda · Paolo e Francesca · Bosco di Paolo e Francesca · Mura medievali | a Gradara | Gradara |
| Castelsardo | Castello dei Doria · Roccia dell'Elefante · Cattedrale di Sant'Antonio Abate · Cestini in intreccio · Lu Bagnu | a Castelsardo | Castelsardo |
| Erice | Castello di Venere · Chiesa Madre · Funivia di Erice · Dolci di Maria Grammatico · Torretta Pepoli | ad Erice | Erice |
| Dozza | Muro Dipinto · Rocca Sforzesca · Enoteca Regionale dell'Emilia-Romagna · Biennale del Muro Dipinto · Toscanella | a Dozza | Dozza |
| Varenna e Lago di Como | Villa Monastero · Passeggiata degli Innamorati · Castello di Vezio · Bellagio · Villa Cipressi | a Varenna e Lago di Como | Varenna e Lago di Como |
| Apricale | Castello della Lucertola · Piazza Vittorio Emanuele · Olio taggiasco · Pigna · Dolceacqua | ad Apricale | Apricale |
| Cividale del Friuli | Tempietto Longobardo · Ponte del Diavolo · Ipogeo Celtico · Monastero di Santa Maria in Valle · Colli Orientali del Friuli | a Cividale del Friuli | Cividale del Friuli |
| Sperlonga | Grotta di Tiberio · Museo Archeologico di Sperlonga · Spiaggia dell'Angolo · Torre Truglia · Villa di Tiberio | a Sperlonga | Sperlonga |

</details>

## Hotel

Ogni destinazione traccia **20 strutture**.

### Strutture reali già presenti

Provengono dall'osservatorio a città che ha preceduto questo modello.
Sono gli unici hotel del dataset che esistono davvero.

| Destinazione | Hotel | Zona | Stelle | Dominio |
| :--- | :--- | :--- | ---: | :--- |
| Roma | Hotel de Russie | Piazza del Popolo | 5 | `roccofortehotels.com` |
| Roma | Hotel Hassler Roma | Trinità dei Monti | 5 | `hotelhasslerroma.com` |
| Roma | Hotel Eden | Via Veneto | 5 | `dorchestercollection.com` |
| Roma | The St. Regis Rome | Repubblica | 5 | `marriott.com` |
| Roma | Palazzo Manfredi | Colosseo | 5 | `palazzomanfredi.com` |
| Roma | Hotel Artemide | Via Nazionale | 4 | `hotelartemide.it` |
| Roma | Singer Palace Hotel | Via del Corso | 5 | `singerpalacehotel.com` |
| Roma | Hotel Locarno | Flaminio | 4 | `hotellocarno.com` |
| Firenze | Four Seasons Hotel Firenze | Sant'Ambrogio | 5 | `fourseasons.com` |
| Firenze | Portrait Firenze | Ponte Vecchio | 5 | `lungarnocollection.com` |
| Firenze | Hotel Savoy | Piazza della Repubblica | 5 | `roccofortehotels.com` |
| Firenze | The St. Regis Florence | Lungarno | 5 | `marriott.com` |
| Firenze | Hotel Davanzati | Centro storico | 3 | `hoteldavanzati.it` |
| Firenze | Hotel Lungarno | Lungarno | 5 | `lungarnocollection.com` |
| Firenze | Palazzo Vecchietti | Centro storico | 5 | `palazzovecchietti.com` |
| Firenze | Hotel Calimala | Mercato Nuovo | 4 | `hotelcalimala.com` |
| Venezia e Laguna | The Gritti Palace | San Marco | 5 | `marriott.com` |
| Venezia e Laguna | Aman Venice | Canal Grande | 5 | `aman.com` |
| Venezia e Laguna | Hotel Danieli | Riva degli Schiavoni | 5 | `marriott.com` |
| Venezia e Laguna | Ca' Sagredo Hotel | Cannaregio | 5 | `casagredohotel.com` |
| Venezia e Laguna | Hotel Ai Reali | Castello | 4 | `hotelaireali.com` |
| Venezia e Laguna | Belmond Hotel Cipriani | Giudecca | 5 | `belmond.com` |
| Venezia e Laguna | Ca' di Dio | Castello | 5 | `vretreats.com` |
| Venezia e Laguna | Hotel Antiche Figure | Santa Croce | 3 | `antichefigure.it` |
| Napoli | Grand Hotel Vesuvio | Lungomare | 5 | `vesuvio.it` |
| Napoli | Romeo Hotel | Porto | 5 | `romeohotel.it` |
| Napoli | Grand Hotel Parker's | Corso Vittorio Emanuele | 5 | `grandhotelparkers.it` |
| Napoli | Eurostars Hotel Excelsior | Lungomare | 5 | `eurostarshotels.com` |
| Napoli | Renaissance Naples Hotel Mediterraneo | Porto | 4 | `marriott.com` |
| Napoli | Britannique Napoli | Corso Vittorio Emanuele | 4 | `hotelbritannique.it` |
| Napoli | Palazzo Caracciolo Napoli | Centro storico | 4 | `accor.com` |
| Napoli | Hotel Piazza Bellini | Centro storico | 4 | `hotelpiazzabellini.com` |
| Verona | Due Torri Hotel | Centro storico | 5 | `duetorrihotels.com` |
| Verona | Palazzo Victoria | Corso Porta Borsari | 5 | `palazzovictoria.com` |
| Verona | Hotel Gabbia d'Oro | Centro storico | 4 | `hotelgabbiadoro.it` |
| Verona | Hotel Accademia | Via Scala | 4 | `hotelaccademiaverona.it` |
| Verona | Byblos Art Hotel Villa Amistà | Corrubbio | 5 | `byblosarthotel.com` |
| Verona | Hotel Milano & SPA | Arena | 4 | `hotelmilano-vr.it` |
| Verona | Hotel Indigo Verona Grand Hotel Arti | Centro storico | 4 | `ihg.com` |
| Verona | Escalus Luxury Suites | Centro storico | 4 | `escalusverona.it` |

### Come sono generate le altre

Prefisso scelto in base alla categoria della destinazione, più un toponimo
reale della zona o un qualificatore coerente. Sono nomi **verosimili ma
inventati**: non corrispondono ad alberghi esistenti e nella UI portano il
marcatore `demo`.

| Categoria | Prefissi | Qualificatori | Zone |
| :--- | :--- | :--- | :--- |
| Mare | Hotel, Grand Hotel, Resort, Hotel Villa, Residenza, Albergo, Park Hotel, Hotel Marina | Belvedere, sul Mare, delle Sirene, del Golfo, Le Terrazze, La Conchiglia… | Lungomare, Centro, Porto, Prima linea, Collina, Baia, Marina |
| Montagna e parchi | Hotel, Alpine Hotel, Chalet, Baita, Rifugio, Berghotel, Hotel Garni, Residence | Alpenrose, dei Larici, Stella Alpina, Panorama, Edelweiss, del Passo… | Centro, Piste, Fondovalle, Altopiano, Passo, Frazione alta, Bosco |
| Enogastronomia | Relais, Tenuta, Agriturismo, Locanda, Villa, Cascina, Borgo, Hotel | dei Filari, del Vignaiolo, Cascina Rossa, delle Botti, Corte del Vino, Colle Alto… | Colline, Centro storico, Campagna, Crinale, Fondovalle, Vigneti |
| UNESCO | Hotel, Palazzo, Grand Hotel, Residenza, Antica Dimora, Hotel Villa, Boutique Hotel, Albergo | Antica Dimora, dei Mercanti, Il Chiostro, San Martino, Palazzo Antico, delle Logge… | Centro storico, Area monumentale, Lungofiume, Stazione, Mura, Periferia storica |
| Borghi | Locanda, Albergo Diffuso, Antica Locanda, Residenza, Casa, Dimora, Hotel, Corte | La Rocca, del Borgo, Antico Forno, La Torre, Al Convento, Piazza Vecchia… | Centro storico, Mura, Porta principale, Fuori le mura, Contrada, Piazza |

**Distribuzione delle stelle** (ciclica sulle 20 posizioni): 5, 5, 4, 4, 4, 4, 3, 3, 3, 4, 5, 4, 3, 4, 3, 4, 5, 3, 4, 3

## Siti auditati

Quattro famiglie per destinazione, più i domini dei 20 hotel.

Fonte della verifica: `docs/rankhotel-destinazioni-e-siti.xlsx`, 2026-08-25.
Un dominio entra come sito ufficiale solo se il footer dichiara un soggetto
con mandato pubblico di promozione. La prova è la ragione sociale, non il
nome del dominio: nella prima versione del foglio quattro domini erano stati
presi per DMO solo perché rispondevano, ed erano società private.

| Famiglia | Cosa comprende | Stato dei domini |
| :--- | :--- | :--- |
| Sito ufficiale del territorio | L'ente che ha il mandato di promuovere la destinazione. È il soggetto che dovrebbe essere citato per primo, e spesso non lo è. | 81 enti di destinazione verificati, 20 DMO regionali come soggetto per le altre |
| Portale informativo indipendente | Guide e magazine tematici sul territorio. Nella maggior parte delle destinazioni battono il sito ufficiale nelle citazioni delle AI. | 59 verificati, il resto ancora generato |
| Aggregatore e OTA | Booking, TripAdvisor e simili. Misurano quanta della visibilità del territorio sia in mano a terzi anziché al territorio stesso. | reali e verificati: booking.com, tripadvisor.it, airbnb.it, getyourguide.it, expedia.it |
| Sito dell'hotel | I domini dei 20 hotel tracciati. È qui che l'accessibilità ai bot diventa una decisione commerciale del singolo albergatore. | domini reali per i 40 hotel esistenti, generati per gli altri |

### Enti di destinazione verificati

| Destinazione | Dominio | Soggetto | Nota |
| :--- | :--- | :--- | :--- |
| Cinque Terre | `parconazionale5terre.it` | Parco Nazionale delle Cinque Terre | sito istituzionale più che promozionale |
| Costa Smeralda | `consorziocostasmeralda.com` | Main Home - Consorzio Costa Smeralda |  |
| Isola d'Elba | `visitelba.info` | Home - Visit Elba |  |
| Gargano | `parcogargano.it` | Ente parco nazionale del Gargano |  |
| Riviera Romagnola | `visitrimini.com` | Visit Rimini, società di destinazione |  |
| Taormina e Riviera dei Ciclopi | `comune.taormina.me.it` | Comune di Taormina |  |
| Riviera del Conero | `rivieradelconero.info` | Riviera del Conero nelle Marche |  |
| Costa Molisana | `comune.termoli.cb.it` | Comune di Termoli |  |
| San Vito Lo Capo e Trapanese | `riservazingaro.it` | HOME - Riserva Naturale Orientata Zingaro |  |
| Cilento | `cilentoediano.it` | Home - Parco Nazionale del Cilento, Vallo di Diano e Alburni |  |
| Dolomiti | `dolomitiunesco.info` | Dolomiti Patrimonio Mondiale UNESCO &#8211; Sito ufficiale delle |  |
| Cortina d'Ampezzo | `comune.cortinadampezzo.bl.it` | Comune di Cortina d'Ampezzo |  |
| Alta Badia | `altabadia.org` | Consorzio Turistico Alta Badia |  |
| Val Gardena | `valgardena.it` | Val Gardena Marketing |  |
| Madonna di Campiglio | `campigliodolomiti.it` | Azienda per il Turismo Campiglio Dolomiti S.p.A. |  |
| Courmayeur e Monte Bianco | `courmayeurmontblanc.it` | Courmayeur Mont Blanc Funivie / consorzio operatori |  |
| Parco Nazionale del Gran Paradiso | `pngp.it` | Parco Nazionale Gran Paradiso |  |
| Parco Nazionale d'Abruzzo | `parcoabruzzo.it` | Parco Nazionale d'Abruzzo, Lazio e Molise |  |
| Gran Sasso e Campo Imperatore | `gransassolagapark.it` | Parco Nazionale del Gran Sasso e Monti della Laga |  |
| Val di Fassa | `fassa.com` | Val di Fassa |  |
| Sila | `parcosila.it` | Parco Nazionale della Sila &#8211; Sito Ufficiale |  |
| Parco Nazionale del Pollino | `parcopollino.it` | Home - Parco Nazionale del Pollino |  |
| Monti Sibillini | `sibillini.net` | Parco Nazionale dei Monti Sibillini |  |
| Val Pusteria | `kronplatz.com` | Esperienze di prima classe ☀️ La Regione Dolomitica Plan de Coro |  |
| Alpe di Siusi | `seiseralm.it` | Alpe di Siusi |  |
| Livigno e Alta Valtellina | `livigno.eu` | APT Livigno |  |
| Foreste Casentinesi | `parcoforestecasentinesi.it` | Parco Nazionale Foreste Casentinesi |  |
| Etna | `parcoetna.it` | Parco dell'Etna - Parco dell'Etna |  |
| Langhe | `visitlmr.it` | Ente Turismo Langhe Monferrato Roero |  |
| Chianti Classico | `chianticlassico.com` | Chianti Classico - Il primo territorio di vino |  |
| Franciacorta | `visitlakeiseo.info` | Visit Lake Iseo |  |
| Valpolicella | `consorziovalpolicella.it` | Consorzio della Valpolicella - Landing |  |
| Montalcino | `consorziobrunellodimontalcino.it` | Consorzio del vino Brunello di Montalcino Montalcino |  |
| Montepulciano | `prolocomontepulciano.it` | Proloco Montepulciano - Proloco Montepulciano |  |
| Modena e Terre di Motori | `visitmodena.it` | Italiano - VisitModena |  |
| Conegliano Valdobbiadene | `visitconegliano.it` | Home - Visit Conegliano |  |
| Strada del Vino dell'Alto Adige | `suedtirol.info` | Alto Adige/Südtirol |  |
| Collio Goriziano | `collio.it` | Consorzio Collio |  |
| Monferrato | `monferrato.org` | Il Monferrato turismo e accoglienza |  |
| Roero | `visitlmr.it` | Ente Turismo Langhe Monferrato Roero |  |
| Maremma Toscana | `parco-maremma.it` | Home - Parco Maremma |  |
| Terre del Primitivo | `consorziotutelaprimitivo.com` | Consorzio di Tutela del Primitivo di Manduria DOC e DOCG |  |
| Irpinia | `irpinia.info` | www.irpinia.info: pagina d'ingresso del sito dedicato all'Irpini |  |
| Montefalco e Sagrantino | `stradadelsagrantino.it` | La Strada del Sagrantino |  |
| Roma | `turismoroma.it` | Roma Capitale |  |
| Firenze | `feelflorence.it` | Comune di Firenze |  |
| Venezia e Laguna | `veneziaunica.it` | Vela S.p.A., società in house del Comune di Venezia | portale servizi e biglietteria più che promozione |
| Napoli | `comune.napoli.it` | Comune di Napoli |  |
| Matera | `materawelcome.it` | Comune di Matera |  |
| Val d'Orcia | `parcodellavaldorcia.com` | Val d'Orcia Patrimonio Mondiale |  |
| Pompei ed Ercolano | `pompeiisites.org` | Homepage - Pompeii Sites Portale Ufficiale Parco Archeologico di |  |
| Val di Noto | `comune.noto.sr.it` | Città di Noto |  |
| Ferrara e Delta del Po | `parcodeltapo.it` | Parco del Delta del Po - Regione Emilia - Romagna |  |
| Aquileia | `fondazioneaquileia.it` | Fondazione Aquileia |  |
| Siena | `terredisiena.it` | Visita le Terre di Siena: itinerari, borghi, terme e natura |  |
| Assisi | `visit-assisi.it` | Sito ufficiale di informazione turistica di Assisi - Visit Assis |  |
| Ravenna | `turismo.ra.it` | Ravenna Turismo |  |
| Alberobello e Valle d'Itria | `comune.alberobello.ba.it` | Comune di Alberobello |  |
| Valle dei Templi | `parcovalledeitempli.it` | Parco Valle dei Templi Agrigento |  |
| Verona | `visitverona.it` | VisitVerona.it |  |
| Sacri Monti | `sacrimonti.org` | Sacri Monti del Piemonte e della Lombardia |  |
| Mantova e Sabbioneta | `turismo.mantova.it` | Mantova |  |
| Tivoli | `visittivoli.it` | Visit Tivoli - Un viaggio unico tra storia, arte e natura! |  |
| Civita di Bagnoregio | `civitadibagnoregio.cloud` | Civita di Bagnoregio - "La città che Muore" |  |
| San Gimignano | `sangimignano.com` | Visitare San Gimignano |  |
| Castelmezzano e Dolomiti Lucane | `comune.castelmezzano.pz.it` | Sito istituzionale del Comune di Castelmezzano - Avvisi, Notizie |  |
| Ostuni | `comune.ostuni.br.it` | Comune di Ostuni &#8211; Sito istituzionale del Comune |  |
| Bosa | `comune.bosa.or.it` | Comune di Bosa |  |
| Spello | `comune.spello.pg.it` | Comune di Spello |  |
| Tropea | `comune.tropea.vv.it` | Comune di Tropea - Tropea |  |
| Vipiteno | `vipiteno.com` | Vacanza a Vipiteno in Alto Adige - Borghi più belli d`Italia |  |
| Orvieto | `comune.orvieto.tr.it` | Comune di Orvieto |  |
| Portovenere | `comune.portovenere.sp.it` | Comune di Porto Venere |  |
| Pitigliano | `comune.pitigliano.gr.it` | Comune di Pitigliano |  |
| Gradara | `gradara.org` | Sito ufficiale turismo, eventi e visite guidate al Castello di G |  |
| Castelsardo | `comune.castelsardo.ss.it` | Home page |  |
| Erice | `comune.erice.tp.it` | Città di Erice |  |
| Dozza | `comune.dozza.bo.it` | Dozza - Comune di Dozza |  |
| Varenna e Lago di Como | `comune.varenna.lc.it` | Comune di Varenna |  |
| Apricale | `comune.apricale.im.it` | Comune di Apricale |  |
| Sperlonga | `comune.sperlonga.lt.it` | Comune di Sperlonga |  |

### Portali editoriali verificati

| Destinazione | Dominio | Soggetto |
| :--- | :--- | :--- |
| Costiera Amalfitana | `undefined` | undefined |
| Salento | `undefined` | undefined |
| Cinque Terre | `undefined` | undefined |
| Costa Smeralda | `undefined` | undefined |
| Isola d'Elba | `undefined` | undefined |
| Riviera Romagnola | `undefined` | undefined |
| Taormina e Riviera dei Ciclopi | `undefined` | undefined |
| Golfo di Orosei | `undefined` | undefined |
| Riviera Ligure di Ponente | `undefined` | undefined |
| Isola di Capri | `undefined` | undefined |
| Isole Eolie | `undefined` | undefined |
| Versilia | `undefined` | undefined |
| Ischia e Procida | `undefined` | undefined |
| San Vito Lo Capo e Trapanese | `undefined` | undefined |
| Dolomiti | `undefined` | undefined |
| Cortina d'Ampezzo | `undefined` | undefined |
| Alta Badia | `undefined` | undefined |
| Val Gardena | `undefined` | undefined |
| Cervinia e Valtournenche | `undefined` | undefined |
| Parco Nazionale d'Abruzzo | `undefined` | undefined |
| Gran Sasso e Campo Imperatore | `undefined` | undefined |
| Parco Nazionale dello Stelvio | `undefined` | undefined |
| Sila | `undefined` | undefined |
| Val Pusteria | `undefined` | undefined |
| Livigno e Alta Valtellina | `undefined` | undefined |
| Etna | `undefined` | undefined |
| Langhe | `undefined` | undefined |
| Chianti Classico | `undefined` | undefined |
| Valpolicella | `undefined` | undefined |
| Montalcino | `undefined` | undefined |
| Parma e Food Valley | `undefined` | undefined |
| Conegliano Valdobbiadene | `undefined` | undefined |
| Bolgheri | `undefined` | undefined |
| Strada del Vino dell'Alto Adige | `undefined` | undefined |
| Etna del Vino | `undefined` | undefined |
| Vulture e Aglianico | `undefined` | undefined |
| Monferrato | `undefined` | undefined |
| Roero | `undefined` | undefined |
| Maremma Toscana | `undefined` | undefined |
| Montefalco e Sagrantino | `undefined` | undefined |
| Roma | `undefined` | undefined |
| Firenze | `undefined` | undefined |
| Venezia e Laguna | `undefined` | undefined |
| Napoli | `undefined` | undefined |
| Matera | `undefined` | undefined |
| Val di Noto | `undefined` | undefined |
| Aquileia | `undefined` | undefined |
| Urbino | `undefined` | undefined |
| Assisi | `undefined` | undefined |
| Ravenna | `undefined` | undefined |
| San Gimignano | `undefined` | undefined |
| Castelmezzano e Dolomiti Lucane | `undefined` | undefined |
| Bosa | `undefined` | undefined |
| Spello | `undefined` | undefined |
| Orvieto | `undefined` | undefined |
| Portovenere | `undefined` | undefined |
| Castelsardo | `undefined` | undefined |
| Varenna e Lago di Como | `undefined` | undefined |
| Sperlonga | `undefined` | undefined |

### DMO regionali usate come soggetto

| Regione | Dominio |
| :--- | :--- |
| Abruzzo | `abruzzoturismo.it` |
| Basilicata | `basilicataturistica.it` |
| Calabria | `calabriastraordinaria.it` |
| Campania | `visitcampania.it` |
| Emilia-Romagna | `emiliaromagnaturismo.it` |
| Friuli-Venezia Giulia | `turismofvg.it` |
| Lazio | `visitlazio.com` |
| Liguria | `lamialiguria.it` |
| Lombardia | `in-lombardia.it` |
| Marche | `letsmarche.it` |
| Molise | `visitmolise.eu` |
| Piemonte | `visitpiemonte.com` |
| Puglia | `viaggiareinpuglia.it` |
| Sardegna | `sardegnaturismo.it` |
| Sicilia | `visitsicily.info` |
| Toscana | `visittuscany.com` |
| Trentino-Alto Adige | `visittrentino.info` |
| Umbria | `umbriatourism.it` |
| Valle d'Aosta | `lovevda.it` |
| Veneto | `veneto.eu` |

### Domini con anomalia all'ultima verifica

| Dominio | Stato | Nota |
| :--- | :--- | :--- |
| `palazzomanfredi.com` | unreachable | non raggiungibile né su apex né su www |
| `hotelbritannique.it` | unreachable | non raggiungibile né su apex né su www |
| `hotelmilano-vr.it` | unreachable | non raggiungibile né su apex né su www |
| `palazzovictoria.com` | redirect | redirige su cojam.io, non è il sito dell'hotel |
| `antichefigure.it` | redirect | redirige su hotelantichefigure.it |
| `escalusverona.it` | redirect | redirige su escalusverona.com |
| `dorchestercollection.com` | waf | blocca la verifica automatica |
| `marriott.com` | waf | blocca la verifica automatica |
| `singerpalacehotel.com` | waf | blocca la verifica automatica |
| `fourseasons.com` | waf | blocca la verifica automatica |
| `lungarnocollection.com` | waf | blocca la verifica automatica |
| `romeohotel.it` | waf | blocca la verifica automatica |
| `ihg.com` | waf | blocca la verifica automatica |

**Domini di catena** (23): su questi la decisione sull'accesso dei bot
la prende il gruppo, non il singolo albergo. Sono marcati nel dataset e in pagina.

### Crawler verificati

| Bot | Engine | Scopo |
| :--- | :--- | :--- |
| `GPTBot` | chatgpt | addestramento |
| `OAI-SearchBot` | chatgpt | ricerca |
| `ChatGPT-User` | chatgpt | lettura on-demand |
| `Google-Extended` | gemini | addestramento |
| `Googlebot` | gemini | indice |
| `PerplexityBot` | perplexity | indice |
| `Perplexity-User` | perplexity | lettura on-demand |
| `CCBot` | tutti | Common Crawl |

### Voci dell'audit SEO

| Voce | Peso |
| :--- | ---: |
| HTTPS e certificato valido | 6 |
| Title unici e descrittivi | 8 |
| Meta description presenti | 6 |
| Gerarchia dei titoli corretta | 7 |
| Dati strutturati schema.org | 12 |
| Sitemap XML raggiungibile | 8 |
| robots.txt coerente | 8 |
| Canonical corretti | 6 |
| hreflang per le lingue servite | 9 |
| Core Web Vitals nel verde | 10 |
| Resa mobile | 7 |
| Contenuto senza JavaScript | 6 |
| Testi alternativi sulle immagini | 4 |
| llms.txt pubblicato | 3 |

## Prompt

Tre assi incrociati: livello, stadio di funnel, lingua.

| Stadio | In analisi | Perché |
| :--- | :---: | :--- |
| Dreaming | sì | Il turista sa di venire in Italia, non sa ancora dove. La destinazione o entra nell'elenco, o non esiste. |
| Planning | sì | Date, vincoli, itinerari. Qui l'AI deve conoscere il territorio nel dettaglio, e si vede subito quando non lo conosce. |
| Booking | sì | Dove dormire. È lo stadio dove una citazione vale una prenotazione, e dove gli hotel entrano in gioco singolarmente. |
| Experiencing | no | Fuori scope: il turista è già arrivato e la decisione di prenotazione è presa. |
| Sharing | no | Fuori scope: racconto post-viaggio, misurabile sui social più che sugli assistenti AI. |

### Livello comparativo

La destinazione compete con le altre della sua categoria. Esempi resi con la categoria «montagna e parchi».

| Chiave | Funnel | Lingua | Testo |
| :--- | :--- | :---: | :--- |
| `cmp-dream-best-it` | dreaming | IT | quali sono le zone turistiche montane più belle in Italia? |
| `cmp-dream-first-it` | dreaming | IT | è la prima volta che organizzo un viaggio del genere: dove mi consigli di andare tra le zone turistiche montane più belle in Italia? |
| `cmp-dream-under-it` | dreaming | IT | quali sono le mete meno conosciute tra le zone turistiche montane più belle in Italia? |
| `cmp-dream-week-it` | dreaming | IT | ho una settimana libera e vorrei staccare: dove andare tra le zone turistiche montane più belle in Italia? |
| `cmp-dream-best-en` | dreaming | EN | what are the most beautiful mountain destinations in Italy? |
| `cmp-dream-first-en` | dreaming | EN | first trip of this kind to Italy: where should I go among the most beautiful mountain destinations in Italy? |
| `cmp-dream-under-en` | dreaming | EN | what are the most underrated options among the most beautiful mountain destinations in Italy? |
| `cmp-dream-week-en` | dreaming | EN | I have one week in Italy and want to disconnect: where should I go among the most beautiful mountain destinations in Italy? |
| `cmp-plan-when-it` | planning | IT | tra le zone turistiche montane più belle in Italia, dove conviene andare a settembre? |
| `cmp-plan-family-it` | planning | IT | tra le zone turistiche montane più belle in Italia, quali sono le più adatte a una famiglia con bambini piccoli? |
| `cmp-plan-nocar-it` | planning | IT | tra le zone turistiche montane più belle in Italia, dove si arriva bene senza auto? |
| `cmp-plan-budget-it` | planning | IT | tra le zone turistiche montane più belle in Italia, quali sono le più abbordabili per una settimana in due? |
| `cmp-plan-crowd-it` | planning | IT | tra le zone turistiche montane più belle in Italia, quali evitare in alta stagione perché troppo affollate? |
| `cmp-plan-when-en` | planning | EN | among the most beautiful mountain destinations in Italy, where is best to go in September? |
| `cmp-plan-family-en` | planning | EN | among the most beautiful mountain destinations in Italy, which are best for a family with young children? |
| `cmp-plan-nocar-en` | planning | EN | among the most beautiful mountain destinations in Italy, which are easy to reach without a car? |
| `cmp-plan-budget-en` | planning | EN | among the most beautiful mountain destinations in Italy, which are the most affordable for a week for two? |
| `cmp-plan-crowd-en` | planning | EN | among the most beautiful mountain destinations in Italy, which should I avoid in high season because of crowds? |
| `cmp-book-where-it` | booking | IT | tra le zone turistiche montane più belle in Italia, dove conviene dormire come base per girare la zona? |
| `cmp-book-value-it` | booking | IT | tra le zone turistiche montane più belle in Italia, dove si trova il miglior rapporto qualità-prezzo per gli hotel? |
| `cmp-book-lux-it` | booking | IT | tra le zone turistiche montane più belle in Italia, dove ci sono i migliori hotel di lusso? |
| `cmp-book-where-en` | booking | EN | among the most beautiful mountain destinations in Italy, what's the best base to stay and explore the area? |
| `cmp-book-value-en` | booking | EN | among the most beautiful mountain destinations in Italy, where do you find the best value hotels? |
| `cmp-book-lux-en` | booking | EN | among the most beautiful mountain destinations in Italy, where are the best luxury hotels? |

### Livello interno

Verifica se il modello conosce il territorio. Esempi resi sulle Dolomiti.

| Chiave | Funnel | Lingua | Testo |
| :--- | :--- | :---: | :--- |
| `int-dream-known-it` | dreaming | IT | cosa rende speciale una vacanza sulle Dolomiti? |
| `int-dream-worth-it` | dreaming | IT | vale la pena visitare le Dolomiti? |
| `int-dream-image-it` | dreaming | IT | come te lo immagini un viaggio sulle Dolomiti? |
| `int-dream-known-en` | dreaming | EN | what makes a trip in the Dolomites special? |
| `int-dream-worth-en` | dreaming | EN | is it worth visiting the Dolomites? |
| `int-dream-image-en` | dreaming | EN | what is a trip in the Dolomites actually like? |
| `int-plan-see-it` | planning | IT | cosa vedere sulle Dolomiti? |
| `int-plan-days-it` | planning | IT | cosa vedere sulle Dolomiti in 4 giorni? |
| `int-plan-eat-it` | planning | IT | cosa si mangia sulle Dolomiti e dove? |
| `int-plan-getthere-it` | planning | IT | come arrivare e come muoversi sulle Dolomiti? |
| `int-plan-season-it` | planning | IT | qual è il periodo migliore per andare sulle Dolomiti? |
| `int-plan-hidden-it` | planning | IT | cosa vedere sulle Dolomiti lontano dai circuiti turistici? |
| `int-plan-see-en` | planning | EN | what to see in the Dolomites? |
| `int-plan-days-en` | planning | EN | 4-day itinerary in the Dolomites |
| `int-plan-eat-en` | planning | EN | what and where to eat in the Dolomites? |
| `int-plan-getthere-en` | planning | EN | how to get around in the Dolomites? |
| `int-plan-season-en` | planning | EN | when is the best time to visit the Dolomites? |
| `int-plan-hidden-en` | planning | EN | what to see in the Dolomites away from the tourist trail? |
| `int-book-hotels-it` | booking | IT | migliori hotel sulle Dolomiti |
| `int-book-area-it` | booking | IT | in quale zona conviene dormire sulle Dolomiti? |
| `int-book-view-it` | booking | IT | hotel con vista sulle Dolomiti |
| `int-book-boutique-it` | booking | IT | hotel piccoli e caratteristici sulle Dolomiti |
| `int-book-hotels-en` | booking | EN | best hotels in the Dolomites |
| `int-book-area-en` | booking | EN | best area to stay in the Dolomites |
| `int-book-view-en` | booking | EN | hotels with a view in the Dolomites |
| `int-book-boutique-en` | booking | EN | small boutique hotels in the Dolomites |

