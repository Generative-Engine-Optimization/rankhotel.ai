# Audit GEO/SEO — RankHotel.ai

Audit eseguito il 25 agosto 2026 sul branch `report-travel` (build in `dist/`,
231 pagine) e sulla produzione live `www.rankhotel.ai` (ancora il sito
pre-Astro). Ogni rilievo qui sotto è verificato: non ci sono stime.

Riferimento metodologico: checklist SEO+GEO unificata (crawlability, structured
data, estraibilità del contenuto, performance, architettura, internazionale).

---

## 0. Il quadro in una riga

Il progetto ha l'asset GEO più forte che si possa avere in questo mercato — 100
territori × 50 domande reali × 2 lingue, con una metodologia dichiarata — e in
questo momento ne rende indicizzabili **3 pagine su 231**.

| | |
| :--- | ---: |
| Pagine HTML costruite | 231 |
| Pagine in `noindex` | 228 |
| Pagine indicizzabili | 3 |
| Pagine in sitemap | 3 (le altre escluse via `OBSERVATORY_IS_DEMO`) |
| Domande già scritte e non usate come contenuto | 5.000 |

---

## 1. Bloccanti (P0 — da sistemare prima di tutto)

### 1.1 L'apex `rankhotel.ai` non esiste in HTTPS, ma è il canonical della produzione

Verificato:

```
dig +short rankhotel.ai        → 213.186.33.5      (parcheggio OVH)
dig +short www.rankhotel.ai    → 185.199.108-111.153 (GitHub Pages)
curl https://rankhotel.ai/     → connection refused, porta 443 chiusa
curl http://rankhotel.ai/      → 301 → https://www.rankhotel.ai/  (solo HTTP)
```

Il sito live dichiara nel `<head>`:

```html
<link rel="canonical" href="https://rankhotel.ai/" />
<link rel="alternate" hreflang="en" href="https://rankhotel.ai/" />
<link rel="sitemap" href="https://rankhotel.ai/sitemap.xml" />
```

e in `robots.txt`: `Sitemap: https://rankhotel.ai/sitemap.xml`.

**Meccanismo del danno.** Googlebot segue il redirect HTTP e sopravvive. I bot
di retrieval AI (OAI-SearchBot, PerplexityBot, ChatGPT-User) partono in HTTPS
sul canonical dichiarato e prendono un connection reset: nessun retry, nessuna
citazione. Per un sito che vende visibilità AI, il canonical punta a un host
irraggiungibile proprio dai bot AI.

**Fix.** Puntare l'apex ai quattro A record di GitHub Pages (`185.199.108.153`,
`.109.153`, `.110.153`, `.111.153`) così che GitHub emetta il 301 apex→www in
HTTPS con certificato valido. Poi allineare tutto su `https://www.rankhotel.ai`
— il nuovo `src/lib/config.ts` lo fa già, il deploy no.

### 1.2 `/` è una splash page indicizzabile con hreflang non valido

`dist/index.html` (1.546 byte) è un selettore di lingua: logo, una frase, due
bottoni. È indicizzabile, ha `canonical` autoreferenziale su `/`, e dichiara:

```html
<html lang="it">                                  <!-- contenuto in inglese -->
<link rel="alternate" hreflang="it" href="…/it">
<link rel="alternate" hreflang="en" href="…/en">
<link rel="alternate" hreflang="x-default" href="…/it">
```

Tre problemi in quattro righe:

1. **Cluster hreflang non valido**: una pagina che dichiara hreflang deve
   includere se stessa. `/` non lo fa. Google scarta cluster non reciproci.
2. **`lang="it"` su contenuto inglese**: segnale di lingua sbagliato sulla URL
   che riceverà tutti i link esterni e tutte le brand search.
3. **Doorway**: `/` è la URL più linkata del dominio e contiene 15 parole. Il
   risultato brand su Google sarà questa, non `/it`.

**Fix.** Rendere `/` un redirect 301 (o `<meta http-equiv="refresh">` +
`noindex` se GitHub Pages non consente il 301) verso `/it`, e togliere `/`
dalla sitemap. In alternativa: servire su `/` il contenuto italiano completo e
far diventare `/it` il canonical duplicato. La prima è più pulita.

### 1.3 Nessuna `og:image` sulle pagine indicizzabili

`BaseLayout.astro` dichiara `twitter:card = summary_large_image` ma non emette
né `og:image` né `twitter:image`. Verificato in `dist/it/index.html`.

Card grande senza immagine = card vuota su LinkedIn, WhatsApp, Slack, X. Su
GEO conta indirettamente: le OG tag sono uno dei pochi segnali che i sistemi AI
usano per costruire l'anteprima di una fonte citata.

**Fix.** Aggiungere `og:image` (1200×630), `og:image:alt`, `twitter:image` e
`og:locale` / `og:locale:alternate` a `BaseLayout.astro`. Il vecchio sito
aveva già l'immagine: è una regressione, non una mancanza.

---

## 2. Il nodo strategico: `OBSERVATORY_IS_DEMO` è un interruttore unico

La scelta di non pubblicare numeri generati come se fossero misurati è
corretta e va difesa. Ma oggi è implementata come flag binario: `true` spegne
in blocco `noindex`, sitemap e `robots.txt` su **tutto** l'osservatorio.

Il risultato è che vengono nascoste anche le pagine che **non contengono un
solo numero simulato**:

| Pagina | Contiene numeri simulati? | Oggi |
| :--- | :---: | :--- |
| `/osservatorio/metodologia` | no — pesi, formula, engine, numero di run | `noindex` |
| `/osservatorio/assunzioni` | no — è la dichiarazione di cosa è simulato | `noindex` |
| `/osservatorio/query` | no — sono i 50 prompt, testo reale | `noindex` |
| `/osservatorio/destinazioni/*` | sì — score, citazioni, crawler | `noindex` ✅ giusto |
| `/osservatorio/categorie/*` | sì | `noindex` ✅ giusto |

Le tre pagine in alto sono esattamente il tipo di contenuto che i sistemi AI
citano: metodologia esplicita, pesi dichiarati, limiti ammessi. Sono anche
l'unica prova pubblica che il progetto sa di cosa parla.

**Fix.** Spezzare il flag in due:

```ts
// src/lib/config.ts
export const OBSERVATORY_DATA_IS_DEMO = true;   // nasconde le pagine con numeri
export const OBSERVATORY_DOCS_ARE_PUBLIC = true; // metodologia, assunzioni, query
```

e far dipendere `noindex` / sitemap / `robots.txt` dal flag giusto per pagina.
Costo: mezza giornata. Effetto: da 3 a 9 pagine indicizzabili, e sono le 6
migliori che il sito abbia.

### 2.1 `Disallow: /api/` blocca l'artefatto più citabile

In modalità demo il `robots.txt` blocca `/api/`. Ma `llms.txt` continua a
dichiarare `API (static JSON): …/api/destinations.json` come risorsa per
sistemi automatici. È una contraddizione che un crawler legge come incoerenza.

**Fix.** O si toglie la riga da `llms.txt` finché il dataset è demo, o si
lascia `/api/` accessibile con il campo `"demo": true` dentro il JSON (che è
la soluzione onesta e più utile: un dataset JSON aperto e dichiarato come
dimostrativo è comunque un asset di link building tecnico).

---

## 3. GEO — cosa manca (in ordine di impatto)

### 3.1 5.000 domande scritte, zero risposte pubblicate

Questo è il punto più importante del documento.

Il seed `tools/seed/prompts.mjs` contiene 50 prompt per destinazione. Non sono
keyword: sono **domande in linguaggio naturale già formulate come le fa un
viaggiatore**, in italiano e inglese, divise per stadio di funnel.

```
"cosa vedere sulle Dolomiti in 4 giorni?"
"in quale zona conviene dormire sulle Dolomiti?"
"migliori hotel sulle Dolomiti"
"among the most beautiful mountain destinations in Italy, which are easy to reach without a car?"
```

Oggi queste domande compaiono nel sito solo come **elenco di prompt in una
tabella**, cioè come oggetto di studio. Non esiste una sola pagina che le usi
come **H2 con sotto una risposta**.

È il ribaltamento che vale più di tutto il resto messo insieme: il pattern che
i sistemi generativi estraggono è esattamente `H2 in forma di domanda` +
`risposta autoconclusiva di 40-60 parole` + `dato specifico`.

**Fix.** Su ogni pagina destinazione, una sezione «Domande frequenti su
{destinazione}» con 8-10 dei 50 prompt come H2/`<summary>`, ognuno con una
risposta breve e fattuale costruita dalle entità in `knownFor`, dalla regione,
dalla stagionalità e dai tag. Marcata `FAQPage`.

Con 100 destinazioni × 2 lingue × 8 domande sono 1.600 blocchi Q&A. Vanno
scritti a partire da dati veri (entità, geografia, stagioni) — non dai numeri
simulati — quindi si possono pubblicare **anche mentre il dataset è demo**.

### 3.2 Le entità `knownFor` non stanno nello structured data

`src/lib/schema.ts` → `destinationSchema()` emette `Place` con `name`,
`description`, `geo`, `address`. Si ferma lì.

Ma il dataset ha, per ogni destinazione, cinque entità reali e verificabili:

```
Dolomiti → Tre Cime di Lavaredo · Lago di Braies · Alpe di Siusi · Val di Funes · Passo Sella
```

Sono il ponte fra la destinazione e il knowledge graph. Vanno nello schema:

```jsonc
{
  "@type": "TouristDestination",         // più preciso di Place per questo caso
  "name": "Dolomiti",
  "touristType": ["outdoor", "luxury"],  // dai tag già presenti
  "includesAttraction": [                // le entità knownFor
    { "@type": "TouristAttraction", "name": "Tre Cime di Lavaredo",
      "sameAs": "https://www.wikidata.org/wiki/Q504016" }
  ],
  "containedInPlace": { "@type": "AdministrativeArea", "name": "Trentino-Alto Adige" },
  "sameAs": "https://www.wikidata.org/wiki/Q123028"   // la destinazione stessa
}
```

I `sameAs` verso Wikidata sono la parte che conta: è così che un modello
risolve «Dolomiti» come entità e non come stringa. Le 500 entità del dataset
sono quasi tutte già su Wikidata — la mappatura si fa una volta, in batch, via
SPARQL (vedi §6.3).

### 3.3 2.000 hotel tracciati, zero pagine hotel

`src/lib/config.ts` definisce `hotelsPath()` e il segmento `hotels`/`hotel`.
Nessuna pagina lo usa: `grep -rn "hotelsPath" src/` restituisce solo la
definizione.

I prompt di stadio **booking** — `int-book-hotels-*`, `int-book-area-*`,
`int-book-view-*`, `int-book-boutique-*`, `cmp-book-lux-*` — sono quelli in cui
una citazione vale una prenotazione. Sono anche gli unici che il sito misura e
non presidia con una pagina.

**Fix.** `/{locale}/osservatorio/hotel/{slug-destinazione}` con i 20 hotel,
schema `ItemList` di `Hotel`/`LodgingBusiness`, e — appena i dati sono reali —
`starRating`, `address`, `url`. Da tenere `noindex` finché gli hotel generati
non sono sostituiti da strutture vere (§5), ma da costruire ora.

### 3.4 Entità `Organization` senza ancoraggio

Lo schema della landing:

```json
{ "@type": "Organization", "name": "RankHotel.ai", "url": "…",
  "parentOrganization": { "@type": "Organization", "name": "RankWit AI" } }
```

Mancano `logo`, `sameAs` (LinkedIn, X, Crunchbase, GitHub), `contactPoint`,
`address`, `foundingDate`. `sameAs` è il meccanismo con cui un modello capisce
che «RankHotel», «RankHotel.ai» e «RankHotel by RankWit» sono lo stesso
soggetto. Senza, il brand resta una stringa ambigua.

Manca anche `WebSite` con `inLanguage` e `publisher`, e `BreadcrumbList` su
tutte le pagine annidate (l'osservatorio è profondo 4 livelli).

### 3.5 Nessun autore, da nessuna parte

Zero `Person`, zero byline, zero pagina «chi siamo». Su un sito che pubblica
una metodologia di misurazione, l'assenza di un autore identificabile è il
buco E-E-A-T più grande. Le pagine con `Article` + `author` linkato a una
`Person` sono nettamente più citate.

**Fix.** Una pagina autore reale, `Person` con `sameAs` LinkedIn, e
`author`/`reviewedBy` su metodologia e assunzioni.

### 3.6 `llms.txt` è buono, e si può chiudere il cerchio

`src/pages/llms.txt.ts` è sopra la media: descrive cosa misura l'osservatorio,
elenca le pagine, dichiara esplicitamente che i dati sono simulati e dà un
contatto per correzioni. È esattamente lo spirito giusto.

Tre aggiunte:

- `<link rel="llms" href="/llms.txt">` nel `<head>` — oggi il file esiste ma
  nessuna pagina lo linka, si trova solo per convenzione sull'URL.
- `/llms-full.txt` con metodologia e assunzioni in testo esteso: è il file che
  un modello ingerisce quando vuole capire *come* si misura, non solo *cosa*.
- La sezione «Data status» dovrebbe elencare quali pagine sono reali e quali
  demo, non solo dire che il dataset è simulato.

### 3.7 `robots.txt` non distingue bot di training da bot di ricerca

Oggi: `User-agent: *` / `Allow: /`. Funziona, ma un sito che vende GEO deve
mostrare la distinzione che il 90% dei clienti sbaglia — bloccare `GPTBot`
(training) **non** toglie da ChatGPT Search, che usa `OAI-SearchBot`.

Il seed `tools/seed/sites.mjs` la modella già correttamente. Vale la pena
rendere il `robots.txt` del sito un esempio esplicito e commentato, e usarlo
come contenuto (una pagina «come si scrive un robots.txt per l'AI» è un magnete
di citazioni in questo settore).

### 3.8 La mappa è invisibile ai crawler AI

`MapIsland.astro` monta Leaflet lato client. Googlebot renderizza JS, i bot di
retrieval AI in generale no. La pagina `/mappa` è, per loro, vuota.

**Fix.** Rendere lato server la lista testuale delle 100 destinazioni sotto la
mappa (con link), e usare la mappa come arricchimento progressivo. Costo
basso, e risolve anche l'accessibilità.

---

## 4. SEO tecnico — rilievi minori ma reali

| # | Rilievo | Dove | Gravità |
| :--- | :--- | :--- | :--- |
| 4.1 | Sitemap senza `lastmod`. `changefreq` è ignorato da Google da anni; `lastmod` no. `NATIONAL.updatedAt` è già disponibile. | `src/pages/sitemap.xml.ts` | Media |
| 4.2 | `x-default` punta a `/it` mentre il mercato hotel internazionale è EN. Corretto se il target primario è l'albergatore italiano — da confermare, non è un errore. | `BaseLayout.astro` | Da decidere |
| 4.3 | Nessun `og:locale` / `og:locale:alternate`. Il vecchio sito li aveva. | `BaseLayout.astro` | Bassa |
| 4.4 | `dateModified` presente solo nello schema `Dataset`, mai visibile in pagina. La freschezza percepita conta: metà del contenuto citato dall'AI ha meno di 13 settimane. | template osservatorio | Media |
| 4.5 | Nessun `BreadcrumbList` su gerarchia a 4 livelli. | tutti i template osservatorio | Media |
| 4.6 | Font `@fontsource` self-hosted — corretto, nessun rilievo. Il vecchio sito caricava Google Fonts render-blocking: è un miglioramento. | — | ✅ |
| 4.7 | Sito statico su GitHub Pages, CSS unico, zero JS tranne la mappa. Base tecnica ottima per GEO. | — | ✅ |

---

## 5. Il problema di integrità che blocca tutto il resto

Il documento `docs/contenuti-osservatorio.md` è onesto su questo, e va detto
chiaramente: **finché i domini DMO ed editoriali sono generati dallo slug e
1.960 hotel su 2.000 sono inventati, l'osservatorio non può uscire da
`noindex`.**

Non è un problema SEO, è un problema di sostanza. E ha una conseguenza pratica
precisa: ogni ora spesa su schema, FAQ e internal linking rende zero finché il
dataset non è reale. Per questo la ricerca qui sotto viene prima.

---

## 6. Ricerca — identificazione DMO

### 6.1 Livello regionale: 20 domini verificati

Verificati uno per uno con richiesta HTTPS il 25/08/2026 (codice di risposta e
URL finale dopo redirect):

| Regione | Dominio ufficiale | Esito |
| :--- | :--- | :--- |
| Valle d'Aosta | `lovevda.it` | 200 |
| Piemonte | `visitpiemonte.com` | 200 |
| Liguria | `lamialiguria.it` | 200 |
| Lombardia | `in-lombardia.it` | 200 |
| Trentino | `visittrentino.info` | 200 |
| Alto Adige | `suedtirol.info` | 200 |
| Veneto | `veneto.eu` | 200 |
| Friuli-Venezia Giulia | `turismofvg.it` | 200 |
| Emilia-Romagna | `emiliaromagnaturismo.it` | 200 |
| Toscana | `visittuscany.com` | 200 |
| Umbria | `umbriatourism.it` | 200 |
| Marche | `letsmarche.it` | 200 — `turismo.marche.it` redirige qui |
| Lazio | `visitlazio.com` | 200 |
| Abruzzo | `abruzzoturismo.it` | 200 |
| Molise | `visitmolise.eu` | 200 |
| Campania | `visitcampania.it` | 200 — **non** `incampania.com`, che non risolve |
| Puglia | `viaggiareinpuglia.it` | 200 |
| Basilicata | `basilicataturistica.it` | 200 |
| Calabria | `calabriastraordinaria.it` | 200 — solo senza `www`; con `www` restituisce 404 |
| Sicilia | `visitsicily.info` | 200 |
| Sardegna | `sardegnaturismo.it` | 200 |
| Nazionale | `italia.it` (ENIT) | 200 |

Due trappole già emerse su 22 domini, ed è il motivo per cui la lista va
verificata a macchina e non copiata da un articolo: `www.calabriastraordinaria.it`
dà 404 mentre l'apex funziona, e `incampania.com` — il nome che circola ovunque
come portale campano — non risolve più.

### 6.2 Livello destinazione: campione verificato

I 100 territori del dataset non coincidono con le regioni: molti hanno un
consorzio o un'azienda di promozione propria, che è il soggetto giusto da
auditare. Campione verificato:

| Destinazione | DMO / consorzio | Esito |
| :--- | :--- | :--- |
| Dolomiti | `dolomiti.it` | 200 |
| Val Gardena | `valgardena.it` | 200 |
| Alta Badia | `altabadia.org` | 200 |
| Livigno e Alta Valtellina | `livigno.eu` | 200 |
| Cinque Terre | `cinqueterre.eu.com` · `parconazionale5terre.it` | 200 · 200 |
| Costiera Amalfitana | `amalficoast.com` | 200 |
| Langhe | `langhe.net` · `visitlmr.it` (Langhe Monferrato Roero) | 200 · 200 |
| Roma | `turismoroma.it` | 200 |
| Firenze | `feelflorence.it` | 200 |
| Venezia | `veneziaunica.it` | 200 |

Non hanno risposto (da non usare senza ricontrollo): `visitdolomiti.info`,
`cortinadolomiti.eu`, `visitsalento.it`, `visitmatera.it`, `altopusteria.info`,
`visitvaldifassa.it`, `costieramalfitana.it`, `turiscalabria.it`.

### 6.3 Come chiudere le 100 destinazioni senza farlo a mano

Sequenza in tre passaggi, dal più affidabile al meno:

1. **Wikidata via SPARQL.** Ogni destinazione italiana rilevante ha un item con
   `P856` (sito ufficiale). Una query recupera in un colpo solo item, sito
   ufficiale, coordinate e appartenenza amministrativa per tutte e 100 — e in
   più restituisce il QID, che serve per i `sameAs` di §3.2. È lo stesso
   passaggio che risolve due problemi diversi.
2. **Ministero del Turismo → assessorati regionali.** La pagina istituzionale
   `ministeroturismo.gov.it/regioni-assessorati-turismo/` è la fonte di
   autorità per il livello regionale, utile come fallback quando una
   destinazione non ha DMO propria.
3. **Verifica automatica.** Ogni dominio candidato passa da un controllo HTTPS
   con user-agent browser, seguendo i redirect e registrando l'URL finale. È
   il passaggio che ha già intercettato i due casi di §6.1, e va rifatto a ogni
   run: i domini DMO cambiano spesso (rebranding regionali, deleghe scadute).

Regola operativa da tenere: **un dominio entra nel dataset solo se ha risposto
200 nell'ultima verifica**, e il dataset registra la data della verifica. Ogni
altra scelta riporta il progetto al problema che sta cercando di evitare.

---

## 7. Ricerca — identificazione hotel

### 7.1 La fonte autoritativa oggi esiste: BDSR / CIN

Dal 2024 il Ministero del Turismo gestisce la **Banca Dati Strutture Ricettive
(BDSR)**, che assegna a ogni struttura ricettiva italiana un **Codice
Identificativo Nazionale (CIN)** obbligatorio per legge. Al 14 gennaio 2026
risultano **694.287 strutture registrate** e **621.262 CIN rilasciati**.

Perché è rilevante qui: è l'unico identificatore nazionale univoco per
struttura. Se il dataset dell'osservatorio adotta il CIN come chiave primaria
degli hotel, il progetto ottiene qualcosa che nessun concorrente ha —
tracciabilità verificabile struttura per struttura, invece di nomi.

Il portale pubblico consente la ricerca di un CIN esistente. L'accesso massivo
è riservato a PA, Regioni e Comuni: per un uso commerciale serve capire quale
canale è percorribile (richiesta di accesso, convenzione, o partenza dagli
open data regionali del punto successivo).

### 7.2 Open data regionali: la strada praticabile subito

Diverse regioni pubblicano l'elenco completo delle strutture ricettive come
open data scaricabile. Qualità e campi variano, ma i migliori coprono già
quasi tutto quello che serve:

| Fonte | Cosa contiene |
| :--- | :--- |
| Ministero del Turismo — open data | strutture ricettive e professioni turistiche |
| Regione Puglia | codice identificativo, denominazione, tipologia, categoria, camere, bagni, posti letto, indirizzo completo, **coordinate**, telefono, email, periodi di apertura, servizi, prezzi |
| Regione Toscana | denominazione, indirizzo, tipologia, **contatti web** |
| Regione Umbria | anagrafica alberghiere, extra-alberghiere, agriturismi, dimore storiche |
| Regione Marche | strutture alberghiere in JSON e CSV |
| Emilia-Romagna | strutture alberghiere ed extra-alberghiere con contatti diretti |
| Sardegna — Osservatorio turismo | open data regionali |
| `dati.gov.it` | catalogo federato, ~795 dataset con tag `strutture-ricettive` |

**Il campo che manca quasi ovunque è il dominio del sito.** Ed è proprio il
campo su cui si regge l'audit crawler del progetto: senza dominio non si può
misurare se `GPTBot` è bloccato.

### 7.3 Come ricavare i domini

Tre fonti, in ordine di resa:

1. **Google Places API** (`places.googleapis.com`) — campo `websiteUri`, più
   `rating`, `userRatingCount`, `priceLevel`. È la copertura migliore sui
   domini e l'unica che dà anche il segnale di reputazione. A pagamento, con
   vincoli di licenza sulla ridistribuzione dei dati: da leggere prima di
   pubblicare qualsiasi campo derivato.
2. **OpenStreetMap / Overpass** — `tourism=hotel` con tag `website`,
   `stars`, `addr:*`, `contact:*`. Gratuito, licenza ODbL (attribuzione
   obbligatoria), copertura buona nei centri storici e scarsa nelle aree
   rurali — cioè debole proprio sui borghi, che è il segmento in cui il
   progetto dice di voler contare di più.
3. **Wikidata** — copre bene solo gli hotel storici o notevoli. Utile per i
   40 hotel reali già in `REAL_HOTELS` (dà i `sameAs`), inutile sul resto.

### 7.4 Sequenza consigliata per la sostituzione dei 1.960 hotel generati

1. Per ciascuna delle 100 destinazioni, definire il **raggio geografico**
   partendo dalle coordinate già nel seed (variabile: 5 km su un borgo, 40 km
   sulle Dolomiti). Questa è la decisione umana che nessuna fonte può prendere.
2. Estrarre le strutture nel raggio dall'open data regionale della regione
   corrispondente.
3. Arricchire con Places API per `websiteUri`, rating e numero di recensioni.
4. Ordinare per un criterio dichiarato — la proposta: numero di recensioni ×
   rating, che approssima la notorietà, cioè la probabilità che un modello
   conosca la struttura. **Il criterio va scritto nella metodologia**, perché
   determina chi entra nei 20 e chi no.
5. Prendere i primi 20, scartando quelli senza dominio proprio (un hotel che
   vende solo su Booking non è auditabile su crawler: va segnalato come caso a
   sé, ed è di per sé un dato interessante da pubblicare).
6. Se disponibile, agganciare il CIN come chiave.
7. Rimuovere il flag `synthetic` solo sulle righe effettivamente sostituite.

Da preservare: il marcatore `demo` nella UI deve restare finché *anche una
sola* struttura della destinazione è generata. Un misto silenzioso di reale e
inventato sarebbe peggio del dataset dichiaratamente finto di oggi.

---

## 8. Piano, in ordine di ritorno

**Settimana 1 — sbloccare**
1. DNS apex → GitHub Pages, canonical su `www` ovunque (§1.1)
2. `/` → 301 su `/it`, fuori dalla sitemap (§1.2)
3. `og:image` + `og:locale` in `BaseLayout` (§1.3)
4. `lastmod` in sitemap (§4.1)

**Settimana 2 — pubblicare quello che è già vero**
5. Sdoppiare `OBSERVATORY_IS_DEMO` e mettere online metodologia, assunzioni,
   query (§2)
6. `Organization` con `sameAs` e `logo`, `WebSite`, `BreadcrumbList` (§3.4)
7. Pagina autore + `Person` su metodologia (§3.5)
8. `<link rel="llms">` e `/llms-full.txt` (§3.6)

**Settimane 3-6 — costruire l'asset GEO**
9. Estrazione Wikidata: QID + `P856` per 100 destinazioni e 500 entità (§6.3)
10. `TouristDestination` con `includesAttraction` e `sameAs` (§3.2)
11. Blocchi FAQ dai prompt sulle pagine destinazione (§3.1) — è la voce con il
    ritorno più alto dell'intero elenco
12. Pagine hotel per destinazione, in `noindex` finché i dati sono demo (§3.3)
13. Lista testuale server-side sotto la mappa (§3.8)

**In parallelo, e prerequisito per togliere `noindex`**
14. Domini DMO reali per le 100 destinazioni (§6)
15. Sostituzione dei 1.960 hotel generati (§7)

---

## 9. Fonti

**DMO e portali turistici**
- [Ministero del Turismo — Regioni e assessorati al turismo](https://www.ministeroturismo.gov.it/regioni-assessorati-turismo/)
- [Italia.it — portale nazionale del turismo (ENIT)](https://www.italia.it/it)
- [Regione Marche — Analisi DMO sui siti ufficiali del turismo delle regioni italiane (PDF)](https://bandi.regione.marche.it/Allegati/7552/DMO%20e%20Blog_DDS_355_TURI_18_10_2023.pdf)
- [Regione Puglia — Linee guida per il riconoscimento delle DMO](https://www.regione.puglia.it/en/web/turismo/-/approvate-le-linee-guida-per-il-riconoscimento-delle-d.m.o.-destination-management-organization)
- [Visit Lazio — DMO Destination Management Organization](https://www.visitlazio.com/dmo-destination-management-organization/)
- [Drintle — portali turistici regionali italiani](https://drintle.com/italia-online/)
- I 32 domini delle tabelle §6.1 e §6.2 sono stati verificati direttamente via HTTPS il 25/08/2026, non presi da queste fonti.

**Strutture ricettive**
- [Ministero del Turismo — Banca Dati Strutture Ricettive (BDSR)](https://www.ministeroturismo.gov.it/banca-dati-strutture-ricettive-bdsr/)
- [Portale CIN — BDSR](https://bdsr.ministeroturismo.gov.it/)
- [Ministero del Turismo — FAQ BDSR](https://www.ministeroturismo.gov.it/faq-banca-dati-strutture-ricettive-bdsr/)
- [Ministero del Turismo — Open data](https://www.ministeroturismo.gov.it/open-data/)
- [dati.gov.it — dataset con tag «strutture ricettive»](https://www.dati.gov.it/view-dataset?tags=strutture-ricettive)
- [Regione Puglia — Elenco strutture ricettive](https://dati.puglia.it/ckan/dataset/elenco-strutture-ricettive)
- [Regione Toscana — Strutture ricettive](https://dati.toscana.it/dataset/strutture-ricettive)
- [Regione Umbria — Elenco strutture ricettive](https://dati.regione.umbria.it/dataset/strutture-ricettive)
- [Osservatorio Sardegna Turismo — Open data](https://osservatorio.sardegnaturismo.it/it/open-data)
- [Confcommercio — scheda BDSR](https://www.confcommercio.it/-/banca-dati-strutture-ricettive)
- [Fabio Disconzi — panoramica open data strutture ricettive regione per regione](https://www.fabiodisconzi.com/webzine/opendata/27/opendata-turismo-strutture-ricettive/index.html)

**Entità e geodati**
- [Wikidata](https://www.wikidata.org/)
- [Overpass Turbo — query OpenStreetMap](https://overpass-turbo.eu/)
