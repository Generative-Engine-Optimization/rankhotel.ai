# Interventi GEO/SEO — 26 agosto 2026

Seguito operativo di [`audit-geo-seo.md`](audit-geo-seo.md) (25 agosto). Quel
documento elencava i rilievi; questo elenca cosa è stato applicato, come è stato
verificato, e cosa resta — con il motivo per cui resta.

Verifica: build completa (`npm run build`, 285 pagine) e parsing dell'HTML
prodotto. I numeri qui sotto sono contati sul `dist/`, non stimati.

---

## Prima / dopo

| | prima | dopo |
| :--- | ---: | ---: |
| Pagine con `og:image` | 0 / 285 | 285 / 285 |
| Pagine con `twitter:title` e `twitter:description` | 0 / 285 | 285 / 285 |
| Pagine senza alcuno structured data | 25 | 0 |
| Pagine con `BreadcrumbList` | 0 | 280 |
| Riferimenti `@id` non risolvibili nella pagina | — | 0 |
| Pagine con `<h1>` mancante o duplicato | 1 | 0 |
| Salti di gerarchia nei titoli (h1→h3) | 4 | 0 |
| Meta description oltre 160 caratteri | 206 | 0 |
| Title oltre 60 caratteri | 14 | 6 |
| Title duplicati / description duplicate | 0 / 1 | 0 / 0 |
| Link interni rotti | 0 | 0 |
| Pagine indicizzabili | 3 | 11 |
| Font della prima schermata in preload | 0 | 2 |

I 6 title residui oltre i 60 caratteri sono destinazioni dal nome lungo
("Strada del Vino dell'Alto Adige"): accorciare oltre significherebbe togliere
il nome, che è la parte che serve. Il troncamento in SERP cade sulla coda
generica, non sul nome, perché il nome sta in testa.

---

## 1. Cosa è stato applicato

### 1.1 Grafo di entità unico per pagina

`src/lib/schema.ts` è stato riscritto attorno a `@id` stabili
(`/#organization`, `/#website`) e a un helper `graph()` che emette un solo
`<script type="application/ld+json">` con tutti i nodi dentro `@graph`.

`Organization` e `WebSite` sono ripetuti su **ogni** pagina, non solo in home.
Non è ridondanza: un motore generativo legge una pagina sola, e un
`publisher: {"@id": ...}` che punta a un nodo definito su un'altra URL è, per
chi legge quella pagina, un riferimento nel vuoto. Chiude il rilievo 3.4.

Nodi ora emessi:

| tipo | pagine |
| :--- | ---: |
| `Organization`, `WebSite` | 285 |
| `WebPage` / `CollectionPage` | 284 |
| `BreadcrumbList` | 280 |
| `Place` (+ `TouristAttraction`) | 200 |
| `ItemList` | 58 |
| `Dataset` | 16 |
| `FAQPage` | 4 |
| `DefinedTermSet` | 2 |

### 1.2 Le entità `knownFor` sono entrate nello structured data

Rilievo 3.2. I luoghi per cui un territorio è conosciuto stavano solo nel testo.
Ora ogni `Place` dichiara `containsPlace` con le `TouristAttraction` del
territorio e il rimando inverso `containedInPlace`. È ciò che permette di legare
"Sassi di Matera" a "Matera" senza doverlo dedurre dal testo intorno.

`destinationSchema()` riceve ora `DestinationDetail` e non il riepilogo:
`knownFor` vive solo sul dettaglio.

### 1.3 FAQ vere, in pagina e nei dati

Otto domande e risposte nuove per lingua (`landing.*.json` → `faq`), rese
visibili in home in una sezione `#faq` e dichiarate come `FAQPage`. Lo schema
FAQ senza contenuto visibile corrispondente è una violazione: qui il contenuto
c'è, ed è contenuto che mancava.

L'ultima domanda dice esplicitamente che i numeri attuali non sono misurazioni.

La pagina metodologia dichiara `FAQPage` sui blocchi che erano **già** scritti
come domanda e risposta ("Perché cinque rilevazioni al mese", i quattro
fattori): nessun contenuto inventato, solo dichiarato.

Il glossario dichiara `DefinedTermSet` con le 15 voci: ogni definizione diventa
citabile da sola.

### 1.4 og:image, e il resto dell'head

Rilievo 1.3. Due card 1200×630 generate e messe in `public/assets/`
(`og-default.jpg` per l'italiano, `og-default-en.jpg` per l'inglese — la card è
scritta, e una card italiana su una pagina inglese si nota), più
`apple-touch-icon.png` 180×180.

`BaseLayout.astro` emette ora anche: `twitter:title`, `twitter:description`,
`twitter:image` e i rispettivi `alt`, `og:locale` + `og:locale:alternate`,
`favicon.svg`, `apple-touch-icon`, `theme-color`,
`initial-scale=1` nel viewport, e — sulle pagine indicizzabili —
`robots: index,follow,max-image-preview:large,max-snippet:-1`.

### 1.5 hreflang: il cluster ora è reciproco

Rilievo 1.2. `/` è una pagina di scelta lingua: è quello il caso d'uso per cui
`x-default` esiste. Ora il cluster è `{it: /it, en: /en, x-default: /}` e `/` si
auto-referenzia, invece di restare fuori dal proprio cluster. `x-default` è un
parametro di `BaseLayout` con fallback alla lingua di default, così le pagine
profonde — che una splash page non ce l'hanno — puntano alla versione italiana.

Sitemap e `<head>` dicono ora la stessa cosa: `x-default` è dichiarato in
entrambi. Un cluster incoerente fra i due è un rilievo di Search Console.

### 1.6 Sitemap

Aggiunte: la radice `/` (mancava, ed è la URL più linkata del dominio),
`<lastmod>` da `NATIONAL.updatedAt` (l'unica data onesta che il sito può
dichiarare: le pagine sono generate da quei dati), e `x-default` per ogni
cluster.

### 1.7 robots.txt

Rilievo 3.7. I 17 crawler dei motori generativi sono ora nominati uno per uno
invece di ricadere sotto `User-agent: *` — GPTBot, OAI-SearchBot, ChatGPT-User,
ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User,
Google-Extended, Applebot-Extended, meta-externalagent, Bytespider, cohere-ai,
Amazonbot, DuckAssistBot, MistralAI-User, YouBot.

Costa dieci righe e toglie ogni ambiguità: `Allow: /` generico viene spesso
letto male dai controlli automatici, e ciò che non è esplicito viene trattato
come dubbio.

### 1.8 llms.txt

Rilievo 3.6. Aggiunti: editore e data dell'ultimo aggiornamento, le otto
domande con le risposte per esteso (un sistema che legge solo quel file deve
poter rispondere senza aprire una pagina), una sezione **Citation** con come va
attribuito un dato, e il rimando a `robots.txt`.

Risolta anche la contraddizione del rilievo 2.1: finché `OBSERVATORY_IS_DEMO` è
attivo, `llms.txt` non pubblicizza più le API che `robots.txt` vieta — lo dice,
invece.

### 1.9 Gerarchia dei titoli e accessibilità

- `Panel` accetta `headingLevel`: i due pannelli che erano il primo blocco dopo
  l'`<h1>` (confronto vuoto, assunzioni) non saltano più da h1 a h3.
- La radice aveva il nome del brand in uno `<span>`: ora è un `<h1>` vero, in un
  `<div>` (uno `<span>` non può contenere un heading).
- Skip link "Vai al contenuto" in `SiteShell` — la stringa `common.skip` era nei
  messaggi da sempre e non veniva usata da nessuno — con `<main id="contenuto">`
  come bersaglio.
- L'`<h3>` dentro `<summary>` delle FAQ è l'unico elemento heading del summary,
  come vuole il content model.

---

### 1.10 Le quattro pagine di metodo sono uscite dal `noindex`

`OBSERVATORY_IS_DEMO` era un interruttore unico: o tutto indicizzabile, o niente.
Ora sono due condizioni distinte — `isNoindex(path)` in `src/lib/config.ts` —
perché "il dataset è simulato" e "questa pagina pubblica numeri simulati" non
sono la stessa affermazione.

Restano fuori dagli indici le 274 pagine che pubblicano punteggi. Sono
indicizzabili metodologia, assunzioni, glossario e mappa del sito: gli unici
numeri che contengono sono la formula, i pesi e le soglie delle fasce, cioè le
scelte di progetto lette dal codice che le applica — non risultati.

L'unico punteggio che compariva su quelle pagine era l'esempio nella metodologia
(91 · 65 · 52 · 52), che non era dichiarato come esempio. **Adesso lo è**, in
entrambe le lingue: era il caso in cui un lettore poteva prendere un numero
inventato per il voto di un territorio.

Effetto pratico: la metodologia porta con sé un `FAQPage` di 8 risposte che ora
può davvero comparire nei risultati, e il banner sui dati simulati resta in
fondo a ogni pagina.

Da fare a mano quando l'interruttore si spegne: niente. `robots.txt` costruisce
gli `Allow` espliciti dalle stesse funzioni di percorso, e la sitemap le include
già.

### 1.11 Autore dichiarato

Rilievo 3.5. `WebPage` e `Dataset` dichiarano ora `author`, riferito
all'`Organization`. Firma l'osservatorio, non una persona: è un lavoro
collettivo, e dichiararlo tale è più onesto che inventare una firma. Ma un
autore ci deve essere — una pagina senza firma non ha nessuno a cui dare credito
né a cui chiedere conto.

### 1.12 La home nelle briciole di pane

La gerarchia partiva dall'osservatorio, come se il sito cominciasse lì. Ora il
primo livello è la home, in pagina e nello schema insieme: briciole visibili e
briciole dichiarate che dicono cose diverse sono un rilievo, non un dettaglio.

### 1.13 `llms-full.txt`

`llms.txt` è l'indice; il nuovo `/llms-full.txt` è il testo. Contiene per intero
metodo, formula, pesi, soglie, le sette assunzioni, il glossario completo e le
otto domande — 11 KB, le stesse tre pagine che sono appena diventate
indicizzabili. Non contiene punteggi: quelli stanno dietro al `Disallow` finché
sono generati.

È linkato da `llms.txt` e da `robots.txt`.

### 1.14 Preload dei due font della prima schermata

Unbounded 700 (il titolo) e Plus Jakarta Sans 400 (il corpo) arrivavano via
`@import` dentro il CSS: il browser li scopriva solo dopo aver scaricato e
analizzato 64 KB di foglio di stile, e fino a quel momento il titolo restava in
fallback. Ora sono in `<link rel="preload">`, con l'URL preso dall'import
dell'asset — l'unico modo di avere l'hash della build senza scriverlo a mano e
vederlo scadere al build dopo.

`font-display: swap` c'era già su tutti e otto i tagli.

### 1.15 Ricaduta del cambio di nome

Il brand è passato da "Bussola" a "Italian AI Visibility Report" mentre questo
lavoro era in corso. Conseguenze sistemate:

- **Le due card OG sono state rigenerate**: dicevano ancora "Bussola". Il nuovo
  nome è lungo 28 caratteri, quindi il disegno ora misura il testo e adatta il
  corpo (62px invece di 78px, con a capo automatico se un domani non bastasse).
- **I title della home erano arrivati a 76 caratteri** con il nome in testa. Il
  nome del brand è già descrittivo — ripeterlo davanti alla proposta la spingeva
  fuori dal troncamento. Ora nel title c'è la proposta ("Quali destinazioni
  italiane consiglia l'AI", 42 caratteri), e il brand sta dove serve:
  `og:site_name`, logo, `<h1>` della radice.
- **`alternateName` nello schema** era diventato "Italian AI Visibility Report —
  Osservatorio RankHotel", cioè il vecchio nome con il nuovo incollato davanti
  da un search-and-replace. Ora è `RankHotel.ai`: un nome alternativo vero.

---

## 2. Cosa resta, e perché

### 2.1 Le 274 pagine con i numeri — decisione editoriale, non tecnica

Restano `noindex` e fuori dalla sitemap tutte le pagine che pubblicano
punteggi: classifica, destinazioni, categorie, temi, engine, hotel, mappa,
query, confronto. **Non le ho toccate.** È l'unica cosa che tiene onesto il
sito finché i numeri sono generati, e riaprirle dipende da quando partono le
rilevazioni vere, non da un audit.

La **mappa** merita una nota: descrive un metodo quanto le altre quattro, ma
mostra i punteggi su ogni pin. Per questo è rimasta chiusa. Se un giorno servisse
aperta prima delle run vere, la strada è una variante senza punteggi, non
un'eccezione in più nella lista.

Tutto il resto è già scritto perché quel giorno `OBSERVATORY_IS_DEMO = false` sia
l'unica riga da toccare: schema, hreflang, sitemap, `og:image`, FAQ e gli `Allow`
di `robots.txt` si riallineano da soli.

### 2.2 Fuori dalla portata del codice

- **Apex `rankhotel.ai` senza HTTPS** (rilievo 1.1) — è DNS/hosting, non repo.
  È l'unico rilievo P0 del vecchio audit ancora aperto.
- **5.000 domande senza risposte pubblicate** (rilievo 3.1) e **2.000 hotel senza
  pagina** (rilievo 3.3) — sono lavoro di contenuto e di dati, non di markup.
  Restano il maggiore asset GEO inutilizzato del progetto.
- **Firma personale** — l'autore dichiarato è ora l'organizzazione (§1.11). Se un
  giorno servisse una persona che firma il metodo, quella è una scelta vostra.

### 2.3 Peso delle pagine

`/{it,en}/osservatorio/hotel` pesa ~680 KB di HTML con 543 link in pagina.
Funziona, ma è il candidato naturale a una paginazione o a un filtro server-side
quando il dataset diventerà reale.
