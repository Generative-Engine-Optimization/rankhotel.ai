# Italian AI Visibility Report

Osservatorio pubblico della visibilità AI del turismo italiano: 100 destinazioni
in 5 categorie di confronto, 20 hotel tracciati per ciascuna, misurati su
ChatGPT, Gemini e Perplexity. Sito statico Astro, bilingue IT/EN.

## Che cosa è, e che cosa non è

È un osservatorio: pubblica misure e dichiara come le ottiene. Non vende
niente, non ha una pagina prezzi e non chiede di prenotare una call. Il solo
contatto è quello per le correzioni, perché su cento territori qualcuno che li
conosce meglio di noi c'è di sicuro.

Il nome sta in `BRAND` dentro [src/lib/config.ts](src/lib/config.ts) insieme al
marchio: cambiarlo lì lo cambia in tutte e 259 le pagine.

## Stato dei dati

**Il dataset attuale è simulato.** Score, citazioni, comportamento dei crawler,
volumi e CPC sono generati da `tools/generate-observatory.mjs` per costruire e
dimostrare lo strumento: non sono misurazioni. Finché `OBSERVATORY_IS_DEMO` in
[`src/lib/config.ts`](src/lib/config.ts) è `true`, le pagine dell'osservatorio
sono `noindex`, fuori dalla sitemap e coperte da un banner esplicito.

I domini dei siti ufficiali ed editoriali sono generati dal nome della
destinazione, non presi da siti reali: pubblicare che un ente esistente blocca
un crawler senza averlo verificato sarebbe falso.

## Comandi

| Comando | Cosa fa |
| :--- | :--- |
| `npm install` | Installa le dipendenze |
| `npm run dev` | Server di sviluppo su `localhost:4321` |
| `npm run data:generate` | Rigenera il dataset in `src/data/observatory/` |
| `npm run data:brief` | Rigenera `docs/contenuti-osservatorio.md` |
| `npm run build` | Genera i dati e compila il sito in `./dist/` |
| `npm run preview` | Anteprima della build |

Il generatore è deterministico (PRNG seminato per chiave): a parità di seed
produce byte identici, così un diff nei JSON significa "ho cambiato il modello",
non "ho rilanciato lo script". La data di riferimento si passa come argomento:
`node tools/generate-observatory.mjs 2026-09-01`.

Il generatore verifica due identità prima di scrivere, e fallisce se saltano:

1. lo score di un engine è pari ai suoi quattro fattori pesati;
2. lo score generale è la media dei tre score per engine.

Sono le stesse due affermazioni che la pagina metodologia fa ai lettori.

## Come si legge la classifica

Due concetti reggono l'onestà del ranking, ed entrambi nascono dal fatto che
cinque run al mese hanno una dispersione.

**Fasce.** Fra la 38ª e la 41ª posizione non c'è differenza misurabile. Le
fasce (A-E, per soglia di score) sì. La posizione secca compare sempre
accompagnata dall'intervallo in cui la destinazione può davvero trovarsi,
calcolato sull'errore standard combinato delle run.

**Scala della domanda.** Ogni destinazione dichiara quante ricerche mensili
muove sulle query monitorate. Venti hotel su Roma e venti hotel su un borgo da
settecento ricerche al mese sono due pagine con lo stesso aspetto e due
significati diversi: dove la domanda è marginale, la scheda lo dice in cima.

## Verifica dei domini e delle strutture

`tools/verify/` contiene la catena che stabilisce che cosa esiste davvero.
Non è un file di dati curato a mano: è uno script che fa richieste HTTP e
legge le pagine.

| Comando | Cosa fa |
| :--- | :--- |
| `npm run verify:sites` | Verifica i candidati DMO ed editoriali, sceglie, scrive `tools/seed/verified-domains.mjs` |
| `npm run verify:hotels` | Verifica gli hotel candidati, scrive `tools/seed/verified-hotels.mjs` |
| `npm run data:report` | Scrive `docs/verifica-domini-e-hotel.md` |

**La regola**: un dominio entra se risponde a una richiesta reale **e** se si
identifica. La seconda condizione è quella che conta: un 200 dice che il
dominio è vivo, non che sia il soggetto giusto. Per gli hotel diventa: la
pagina nomina quell'hotel. Un dominio che risponde prova che qualcuno lo ha
registrato, non che la struttura esista.

Lo script sa leggere una pagina, non sa che cosa sia una società in house. Un
consorzio di operatori e una S.r.l. qualsiasi hanno la stessa forma nel footer
e ruoli opposti nel territorio: quei casi li decide una persona in
`tools/verify/overrides.mjs`, e ogni riga porta il suo perché. Nel dataset il
campo `source` dice quale delle due strade ha deciso.

Gli hotel portano un campo `confidence` con tre livelli distinti: `verified`
(il sito lo nomina), `chain` (sta su un dominio di gruppo, esiste ma le scelte
tecniche non sono sue), `guarded` (il dominio esiste e rifiuta i controlli
automatici). Tutto il resto resta un nome generato, marcato come tale in ogni
pagina in cui compare.

## Domini verificati

`tools/seed/verified-sites.mjs` è la traduzione in codice di
[docs/rankhotel-destinazioni-e-siti.xlsx](docs/rankhotel-destinazioni-e-siti.xlsx),
verificato il 25/08/2026. Contiene 8 enti di destinazione, 4 portali editoriali
e 20 DMO regionali, ciascuno con il soggetto che lo gestisce.

Il criterio non è "il dominio risponde 200": è che il footer dichiari un
soggetto con mandato pubblico di promozione. Nella prima versione del foglio
quattro domini erano stati presi per DMO solo perché rispondevano, e a
verificare ragione sociale e partita IVA sono risultati società private. Sono
stati spostati nella famiglia editoriale, dove sono corretti.

Dove non esiste un ente con mandato sul singolo territorio, il sito ufficiale è
quello della **DMO regionale**, che è il soggetto che quel territorio lo
promuove davvero. Un dominio inventato al suo posto renderebbe inservibile la
misura per cui quella famiglia di siti esiste.

Il foglio conteneva otto rilievi di due diligence. Applicati: DMO unica per
destinazione (erano due su 43 territori), domini di catena segnalati, entità
disambiguate e deduplicate, Molise in copertura, visitatori e domanda
etichettati come stima e simulazione. Resta aperto il rilievo sui **confini
territoriali**: 42 coppie di destinazioni distano meno di 30 km, e quando i
2000 hotel saranno reali le stesse strutture cadranno in più destinazioni. Va
risolto assegnando ogni comune a una destinazione sola, prima di estrarre gli
hotel.

## Il punteggio in pagina

`ScoreDial` disegna il valore con un colore continuo in oklch invece di tre
fasce secche: un 64 e un 66 non devono cambiare colore di colpo perché cade una
soglia arbitraria. L'anello dice quanto manca a cento senza aggiungere parole, e
la sua parte chiara è la banda di oscillazione disegnata sull'anello stesso.

Le cifre sono a larghezza fissa (`tabular-nums`): senza, in una colonna di
punteggi il "1" fa ballare l'incolonnamento. La stessa scala di colore vale
nelle tabelle, così una classifica si legge per gradiente prima ancora che per
cifra.

## Mappe

Due mappe diverse per due lavori diversi.

`MapIsland` è Leaflet con i tile OSM: serve dove si esplora, cioè sulla pagina
mappa, sulle categorie e sui temi.

`MiniMap` è una sagoma d'Italia disegnata inline con un punto: serve sulla
scheda di una destinazione, dove la domanda è "dov'è" e basta. Nessun tile,
nessun JavaScript, nessuna richiesta. Sagoma e punto usano la stessa proiezione
definita in [src/lib/italy.ts](src/lib/italy.ts), che è l'unico modo per essere
sicuri che il puntino cada dove deve.

## Temi

I temi non si assegnano a mano su cento destinazioni: si derivano da prove che
stanno già nel dato, con le regole in
[tools/lib/derive-tags.mjs](tools/lib/derive-tags.mjs). Un tema attribuito per
intuizione è un tema che nessuno può contestare, e un osservatorio non dovrebbe
averne.

Le prove sono, in ordine di forza: le entità censite a mano (un territorio con
"Scavi di Pompei" fra le entità è archeologia), la categoria, le coordinate
(sopra il 45° parallelo in montagna la stagione della neve esiste davvero) e i
visitatori stimati. Ventitré temi, in media 5,1 per destinazione, nessuna
destinazione senza temi secondari.

## Bandiere

`Flag` disegna il tricolore e la Union Jack inline, come i marchi degli
assistenti: nessuna richiesta di rete e nessuna emoji, che su Windows si vede a
metà. Il clip della Union Jack riceve un id progressivo per istanza, così una
pagina con sessantacinque bandiere non produce id duplicati.

Compaiono nel cambio lingua, nel confronto italiano/inglese, sui prompt, nelle
tabelle delle domande, nella mappa del sito e nel glossario.

Una bandiera nazionale per una lingua è una convenzione imprecisa: l'inglese
non è solo britannico. È però quella che si legge al volo, ed è il motivo per
cui è lì. L'etichetta testuale resta sempre accanto o come testo accessibile,
mai sostituita dall'immagine.

## Favicon e link esterni

`SiteLink` mostra ogni dominio con la sua favicon, chi lo gestisce, se è
verificato e quando. I domini reali si aprono in una scheda nuova con
`rel="noopener noreferrer external"`; quelli generati non sono link, perché non
portano da nessuna parte.

Le favicon dei domini reali arrivano dal servizio di DuckDuckGo con referrer
disattivato: è la seconda e ultima richiesta esterna del sito dopo i tile della
mappa. I domini generati non ne fanno nessuna e mostrano un monogramma disegnato
in locale, colorato in modo stabile per dominio. Se la favicon non arriva, il
posto prende lo stesso monogramma invece di restare vuoto.

## Storico

L'osservatorio ha cominciato a misurare ad **agosto 2026**. Lo storico dei
punteggi è quindi di **tre rilevazioni mensili** (agosto, settembre, ottobre
2026), non di ventiquattro mesi: mostrare un passato che non abbiamo sarebbe il
primo numero inventato di un progetto che non ne vuole inventare.

Fa eccezione lo storico di volumi e CPC delle domande, che resta a 24 mesi
perché è dato di ricerca di terze parti, non una nostra misurazione.

Il generatore verifica anche che l'ultima rilevazione coincida esattamente con
il punteggio pubblicato: un grafico che finisce su un numero diverso da quello
scritto in cima alla pagina costringe il lettore a scegliere a quale credere.

## Componenti

I template compongono, non ripetono. I mattoni riusabili stanno in
`src/components/`:

| Componente | Cosa risolve |
| :--- | :--- |
| `PageHero` | intestazione di pagina con briciole di pane, occhiello, titolo e slot |
| `Section` | blocco con titolo, spiegazione, ancora e pulsante di condivisione |
| `Panel` | card con icona, titolo e spiegazione contestuale |
| `StatGrid` | griglia di numeri con etichetta e info |
| `InfoTip` | spiegazione in lingua piana, nel DOM anche a pannello chiuso |
| `ShareButton` | copia il link alla sezione, con condivisione nativa su mobile |
| `Icon` | 30 icone inline in `currentColor`, nessuna libreria |
| `Cover` | copertina generata dalla chiave della destinazione |
| `TagList` | temi navigabili |
| `Toc` | indice di pagina con evidenziazione della sezione in vista |
| `PageNav` | precedente e successiva in classifica |
| `Runs` | le tre rilevazioni, con la dispersione di ciascuna |
| `AnswerBoard` | la risposta per intero, con menzioni evidenziate e fonti citate |
| `FunnelTag` | il momento del viaggio, con la sua icona e il suo colore |

`AnswerBoard` è l'unico blocco che mostra il testo invece di misurarlo: le
altre sezioni contano le citazioni, questa fa vedere la risposta in cui
finiscono. I testi sono **ricostruzioni** montate sui numeri già pubblicati —
chi viene citato, in che ordine, con quali fonti — e il riquadro in cima alla
sezione lo dichiara. È l'unico contenuto del sito che non può essere sintetico
e restare credibile senza dirlo: un punteggio inventato passa, un paragrafo di
ChatGPT inventato e spacciato per vero no.

`FunnelTag` tiene insieme Dreaming, Planning e Booking ovunque compaiano —
pannelli, filtri, tabelle, intestazione di una risposta. L'icona sta nel
dataset (`funnel[].icon`), il colore nei token `--color-funnel-*`, e la pagina
non sceglie né l'una né l'altro: prima le icone venivano prese per posizione
(`["cloud", "route", "key"][index]`) e bastava riordinare gli stadi perché il
Booking si prendesse la nuvola. I due stadi fuori scope restano grigi, ed è
parte di quello che la pagina dice di loro.

`Cover` disegna il paesaggio dal motivo della categoria e da un seme ricavato
dalla chiave: stessa destinazione, stesso disegno per sempre. Nessuna foto,
quindi nessuna licenza, nessuna richiesta di rete e nessun rischio di mettere
l'immagine sbagliata su un territorio.

## Marchi degli engine

`public/assets/engines/` contiene rese monocromatiche in `currentColor` di
ChatGPT, Gemini e Perplexity, disegnate per questo progetto. **Per un uso
pubblico vanno sostituite con gli asset ufficiali dei rispettivi brand kit**:
il componente [`EngineLogo.astro`](src/components/EngineLogo.astro) non cambia,
basta rimpiazzare i tre file.

Il nome dell'engine resta sempre nell'HTML, come testo visibile o come
`sr-only`: su un sito che misura cosa i crawler riescono a leggere, sostituire
"ChatGPT" con una sola immagine sarebbe un autogol.

## Struttura

```
tools/seed/          dati curati a mano: destinazioni, categorie, prompt, grammatica
tools/lib/           modello dello score, PRNG, costruttori del dataset
tools/generate-*     assembla e scrive src/data/observatory/
src/lib/observatory  modello di dominio: legge dal livello API, non da file
src/lib/api/         il livello dati: contratto, trasporto, client di build e di browser
src/pages/api/v1/    fixture statiche: emettono JSON reali in dist/api/v1 a build time
tools/api/           contratto eseguibile, OpenAPI, suite di conformità, mock server
src/templates/       una pagina per tipo, condivisa fra IT ed EN
src/data/messages/   tutte le stringhe, IT ed EN in parità di chiavi
```

### Il livello dati

Tutti i contenuti dinamici passano da `src/lib/api/`. Nessuna pagina, nessun
componente e nessun template importa più un file di dati: chiedono a
[`server.ts`](src/lib/api/server.ts) (a build time) o a
[`client.ts`](src/lib/api/client.ts) (nel browser), e non sanno da dove arrivi
la risposta.

Oggi arriva dalle fixture generate da `npm run data:generate`, servite come file
statici sotto `/api/v1/`. Sono le stesse URL, la stessa forma e gli stessi
header che dovrà servire il backend, e il sito ci fa fetch vere sopra — con
latenza, abort ed errori.

Il passaggio al backend vero è una variabile d'ambiente, non una modifica al
codice (vedi [`.env.example`](.env.example)):

```bash
PUBLIC_API_SOURCE=http
PUBLIC_API_BASE_URL=https://api.rankhotel.ai/v1
```

È già verificato: con `npm run api:mock` avviato, le 285 pagine si compilano
interamente da chiamate HTTP.

| comando | cosa fa |
| :--- | :--- |
| `npm run api:check` | verifica il contratto sulle fixture, o su un backend con `-- --base <url>` |
| `npm run api:mock` | implementazione di riferimento su `localhost:8787/v1` |
| `npm run api:spec` | rigenera `docs/api/openapi.yaml` |

Per chi deve scrivere le API: [`docs/backend-api.md`](docs/backend-api.md).

In demo si possono forzare gli stati con la querystring:
`?_debug=slow`, `?_debug=error`, `?_debug=empty`.
