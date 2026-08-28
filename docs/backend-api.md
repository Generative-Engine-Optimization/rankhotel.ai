# Il backend dell'osservatorio — cosa serve, e come verificarlo

Questo documento è per chi deve scrivere le API. Dice esattamente cosa il sito
chiede, come lo chiede, e come si controlla di averlo fatto giusto senza dover
aprire il frontend.

Non serve leggere il codice del sito. Servono tre file:

| file | cos'è |
| :--- | :--- |
| [`src/lib/api/types.ts`](../src/lib/api/types.ts) | il contratto: la forma esatta di ogni risposta, commentata campo per campo |
| [`src/lib/api/query.ts`](../src/lib/api/query.ts) | la semantica di filtri, ordinamento e paginazione |
| [`docs/api/openapi.yaml`](api/openapi.yaml) | la stessa cosa in OpenAPI 3.1, per generare client e stub |

---

## 0. In una riga

Undici endpoint di sola lettura che restituiscono JSON. Nessuna scrittura,
nessuna sessione, nessun utente. I dati cambiano una volta al mese.

---

## 1. Lo stato attuale, e cosa cambia

Oggi il sito gira su **fixture**: i JSON generati da `npm run data:generate`,
pubblicati come file statici sotto `/api/v1/`. Non sono un mock appeso da una
parte — sono le stesse URL, la stessa forma e gli stessi header che dovrà
servire il backend. Il sito fa fetch vere verso di loro.

Quando il backend esiste, il passaggio è **una variabile d'ambiente**:

```bash
PUBLIC_API_SOURCE=http
PUBLIC_API_BASE_URL=https://api.rankhotel.ai/v1
```

Nessun file di codice cambia: né le pagine, né i componenti, né i template.
Tutto ciò che sa da dove arrivano i dati sta in `src/lib/api/`, e sono cinque
file. Questo è già verificato — vedi §7.

Le fixture in `src/pages/api/v1/` si cancellano il giorno del passaggio.

---

## 2. Le regole valide su ogni endpoint

**1. Ogni risposta 2xx è un envelope.**

```json
{
  "data": { },
  "meta": { "generatedFor": "2026-10-01", "version": "v1", "simulated": true }
}
```

`generatedFor` è il mese a cui si riferiscono i numeri: il sito lo scrive in
pagina. `simulated` dice se i dati sono generati o misurati — finché è `true`
il sito tiene le pagine fuori dagli indici.

**2. Ogni errore ha lo stesso corpo.**

```json
{ "error": { "status": 404, "code": "not_found", "message": "Destinazione inesistente: xyz" } }
```

`code` è uno di `not_found`, `bad_request`, `unauthorized`, `rate_limited`,
`server_error`. Non è tradotto: il frontend ci fa `switch`. `message` è per chi
legge i log, non per l'utente.

**3. Gli elenchi dichiarano il totale.**

`meta.total` è il numero di righe che soddisfano i filtri **prima** della
paginazione, insieme a `meta.page` e `meta.pageSize`. Senza, la pagina crede
che le righe ricevute siano tutte quelle esistenti e scrive un conteggio falso.

**4. Le mappe per engine sono complete.**

Ogni `byEngine` contiene sempre `chatgpt`, `gemini` e `perplexity`. Un engine
mancante non è "nessun dato": è una colonna vuota in una tabella comparativa,
che è peggio di un numero sbagliato perché non si nota.

**5. Le frazioni sono 0–1, i punteggi 0–100.**

`presence: 0.85`, non `85`. `score: 60.4`, non `0.604`. È l'errore più
frequente e la suite di verifica lo intercetta.

**6. Le chiavi sono stabili.**

`key` e `slug` finiscono nelle URL pubbliche (`/it/osservatorio/destinazioni/roma`).
Cambiarle rompe link esterni e citazioni già raccolte dai motori generativi.

**7. Cache.**

`Cache-Control: public, max-age=86400`. Il dataset cambia una volta al mese.

---

## 3. Gli endpoint

Dimensioni misurate sul dataset attuale (100 destinazioni, 2000 hotel).

| endpoint | restituisce | peso | usato da |
| :--- | :--- | ---: | :--- |
| `GET /meta` | `MetaDTO` | 12 KB | tutte le pagine; è il primo che il sito chiama |
| `GET /national` | `NationalDTO` | 8 KB | home, indice osservatorio, pagine engine |
| `GET /categories` | `CategoryDTO[]` (5) | 8 KB | indice, pagine categoria, filtri |
| `GET /categories/{key}` | `CategoryDTO` | 2 KB | pagina categoria |
| `GET /destinations` | `DestinationDTO[]` (100) | 96 KB | classifica, mappa, temi, confronto |
| `GET /destinations/{key}` | `DestinationDetailDTO` | 124 KB | scheda destinazione (200 pagine) |
| `GET /hotels` | `HotelSummaryDTO[]` (300) | 152 KB | pagina hotel |
| `GET /queries` | `QuerySummaryDTO[]` (3200) | 1,1 MB | pagina query |
| `GET /queries/{category}` | `QuerySummaryDTO[]` | 228 KB | pagina query, filtro per categoria |
| `GET /prompts` | `PromptsDTO` | 12 KB | metodologia, assunzioni, schede |
| `GET /tags` | `TagDTO[]` (23) | 8 KB | indice temi, pagine tema |

**`/destinations/{key}` è l'endpoint che costa.** 124 KB per destinazione,
chiamato 100 volte a ogni build. Contiene punteggi dettagliati, dodici mesi di
storico, cinquanta prompt con esito per engine, le risposte ricostruite, i siti
auditati con lo stato di otto bot, venti hotel e cinquanta query. È il solo
endpoint che vale la pena ottimizzare, ed è anche il solo che il sito carica
una destinazione alla volta.

**`/queries` è l'endpoint che va paginato davvero.** 3200 righe oggi; con più
destinazioni cresce in proporzione. Il sito ne mostra 60 per volta e a build
time le scorre in pagine da 500.

**`/tags` è un aggregato, non una tabella.** È `META.tags` con il conteggio di
quante destinazioni portano ogni tema — dove il tema conta sia come categoria
primaria sia come tag secondario. I temi a zero non si servono.

---

## 4. Filtri, ordinamento, paginazione

L'implementazione di riferimento è
[`src/lib/api/query.ts`](../src/lib/api/query.ts): a parità di parametri il
backend deve restituire lo stesso risultato.

### Parametri comuni

| parametro | default | note |
| :--- | :--- | :--- |
| `page` | 1 | 1-based |
| `pageSize` | 60 | massimo 500; oltre, si tronca a 500 |
| `dir` | dipende dal campo | `asc` \| `desc` |
| `q` | — | ricerca libera |

### `q` — la ricerca

Sottostringa, **senza accenti e senza maiuscole**: `normalize()` fa NFD, toglie
i segni diacritici e abbassa. Chi scrive `val d'orcia` deve trovare
`Val d'Òrcia`, e `campania` deve bastare per arrivare alla Costiera Amalfitana.

Su cosa cerca, per endpoint:

- `/destinations` → nome (it + en) e regione
- `/hotels` → nome struttura, dominio, zona
- `/queries` → testo della query

### Ordinamento

| endpoint | `sort` ammessi | default | verso di default |
| :--- | :--- | :--- | :--- |
| `/destinations` | `score`, `visitors`, `demand`, `trend`, `name`, `nationalRank` | `score` | `desc`, ma `name` e `nationalRank` crescono |
| `/hotels` | `score`, `presence`, `avgPosition`, `auditScore`, `trend`, `name`, `stars` | `score` | `desc`, ma `name` e `avgPosition` crescono |
| `/queries` | `volume`, `cpc`, `yoy`, `difficulty`, `text` | `volume` | `desc`, ma `text` cresce |

Un `sort` fuori elenco è un **400**, non un ordinamento ignorato in silenzio.

**A parità di valore, ordina per `key`.** Non è un dettaglio estetico: senza un
criterio di spareggio deterministico, la pagina 2 ripete righe della pagina 1 e
l'elenco perde e duplica dati sotto gli occhi di chi scorre.

**`/destinations?engine=…` cambia il significato di `sort=score`**: non più la
media dei tre engine ma il punteggio di quello scelto. È il gesto della pagina
engine — "chi vede il mondo diversamente da ChatGPT".

### Filtri per endpoint

| endpoint | filtri |
| :--- | :--- |
| `/destinations` | `category`, `tag`, `region`, `tier`, `engine` |
| `/hotels` | `destination`, `category`, `realOnly` |
| `/queries` | `category`, `destination`, `lang`, `funnel`, `level`, `cluster` |

`tag` include la categoria primaria: una destinazione di categoria `mare` esce
anche cercando il tema `mare`, non solo dai tag secondari. Tutti gli altri sono
uguaglianze esatte.

---

## 5. Cosa il backend **non** deve fare

Chiarirlo evita di implementare cose che nessuno userà.

- **I testi dell'interfaccia.** Etichette, titoli, note metodologiche stanno in
  `src/data/messages/*.json` e viaggiano col frontend. Dal backend arrivano
  solo i testi che sono dato: nomi di destinazione, testi dei prompt, note sui
  domini. Sono `LocalizedText`, mai stringhe nude.
- **Le derivazioni di presentazione.** Fascia di colore del punteggio, icona del
  territorio, destinazioni simili, coppie di confronto già pronte, scostamenti
  di un engine dal consenso degli altri: le calcola il sito da ciò che riceve.
  Sono scelte editoriali, non misure.
- **Autenticazione utente.** Non c'è login. Se serve proteggere l'API, un
  bearer token statico basta (`API_TOKEN`).
- **Scritture.** Nessun `POST`, nessun `PUT`.

---

## 6. Ordine di implementazione consigliato

Ogni passo lascia il sito compilabile.

1. **`/meta`, `/national`, `/categories`, `/prompts`, `/tags`** — cinque
   endpoint piccoli e senza parametri. Con questi la build arriva a metà.
2. **`/destinations` e `/destinations/{key}`** — la parte grossa. Il sito è già
   navigabile.
3. **`/hotels` e `/queries` senza parametri** — pagine complete, filtri lenti
   perché applicati dal client.
4. **Filtri, ordinamento e paginazione** su `/queries`, `/hotels`,
   `/destinations`. Da qui i filtri girano dove devono.
5. **`/categories/{key}` e `/queries/{category}`** — ottimizzazioni: servono a
   non far scaricare tutto a chi guarda una fetta.

---

## 7. Come si verifica

### Il controllo automatico

```bash
npm run api:check -- --base https://api.rankhotel.ai/v1
```

Controlla, endpoint per endpoint:

- che la risposta sia un envelope `{data, meta}` con `meta` valido;
- che ogni campo esista e abbia il tipo giusto — comprese le frazioni fuori
  scala, gli engine mancanti nelle mappe, le date mal formate;
- che i riferimenti incrociati risolvano: le categorie citate dalle
  destinazioni, le destinazioni citate dalle classifiche, i conteggi dei temi;
- che la paginazione tagli davvero e che `meta.total` sia il totale;
- che i filtri filtrino e l'ordinamento ordini;
- che la pagina 2 non ripeta righe della pagina 1;
- che una chiave inesistente dia **404** col corpo d'errore giusto;
- che un `sort` fuori elenco dia **400**.

Esce con codice 1 se qualcosa non torna: si mette in CI così com'è. Con
`--verbose` elenca tutti gli scostamenti invece dei primi cinque.

Senza `--base` verifica le fixture in `dist/api/v1` — utile per accorgersi che
un cambio al generatore ha rotto il contratto.

### L'implementazione di riferimento

```bash
npm run api:mock          # http://localhost:8787/v1
```

Un backend vero in miniatura, in un file solo
([`tools/api/mock-server.mjs`](../tools/api/mock-server.mjs)): legge i JSON
generati e li serve con filtri, ordinamento, paginazione, envelope, 404 e 400.
Passa la suite di conformità al completo, **19 controlli su 19**.

Serve a due cose: avere un bersaglio eseguibile da confrontare campo per campo
con la propria implementazione, e leggere le regole di filtro in trenta righe
invece di dedurle dalla specifica.

### La prova che il passaggio funziona

Il sito si compila già contro un backend HTTP. Con il mock avviato:

```bash
PUBLIC_API_SOURCE=http PUBLIC_API_BASE_URL=http://localhost:8787/v1 npm run build
```

285 pagine costruite interamente da chiamate HTTP: 100 richieste a
`/destinations/{key}`, sette pagine da 500 su `/queries`, una a testa per le
collezioni. Nessuna lettura di JSON dal disco. È il modo per verificare la
propria implementazione end-to-end prima di puntarci la produzione.

---

## 8. Dove stanno le cose

```
src/lib/api/
  types.ts        il contratto. È il file da leggere per primo
  query.ts        semantica di filtri, ordinamento, paginazione
  endpoints.ts    registro degli endpoint: da qui nasce l'OpenAPI
  transport.ts    fetch, envelope, errori, ritentativi, timeout, token
  fixtures.ts     sorgente locale, solo a build time
  server.ts       quello che usano le pagine Astro
  client.ts       quello che usano gli script nel browser

src/pages/api/v1/ le fixture statiche. Si cancellano quando c'è il backend
tools/api/        contratto eseguibile, OpenAPI, verifica, mock server
docs/api/         openapi.yaml e schemas.json, generati
.env.example      tutte le variabili, commentate
```

I comandi:

```bash
npm run api:spec     # rigenera docs/api/openapi.yaml dal contratto
npm run api:check    # verifica le fixture (o un backend con --base)
npm run api:mock     # avvia l'implementazione di riferimento
```

---

## 9. Una nota sul dataset attuale

I numeri di oggi sono **generati**, non misurati: `meta.simulated` è `true` e il
sito lo dichiara. Il backend vero li sostituirà con le run reali, ma la forma
non cambia — è per questo che il contratto si può scrivere adesso.

Restano da decidere, e non sono decisioni tecniche: le 100 destinazioni in
classifica, i 20 hotel per destinazione (oggi 40 su 2000 sono strutture reali) e
i domini dei siti DMO, oggi generati dallo slug. Vedi
[`contenuti-osservatorio.md`](contenuti-osservatorio.md).
