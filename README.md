# RankHotel.AI

Sito statico di marketing per RankHotel.AI: visibilità AI, AEO e SEO per hotel di lusso.

## Struttura del progetto

| File / cartella | Descrizione |
|-----------------|-------------|
| `index.html` | Pagina principale, meta SEO/OG, JSON-LD |
| `style.css` | Token CSS (`:root`), componenti e menu mobile |
| `script.js` | Configurazione tema Tailwind CDN + navigazione touch |
| `assets/images/logo/` | Logo e varianti (path relativi da `index.html`) |

Tutti i riferimenti usano path relativi (`./style.css`, `./assets/...`) per funzionare anche sotto un sottopath GitHub Pages (`https://<utente>.github.io/<repository>/`).

## GitHub Pages

1. Repository su GitHub: **Settings → Pages**.
2. **Source**: branch `main` (o `master`) e cartella **`/ (root)`** se `index.html` è nella radice del repo.
3. Dopo il deploy, l’URL sarà tipicamente `https://<USERNAME>.github.io/<REPO>/`.

### URL assoluti da aggiornare dopo il primo deploy

In `index.html` sono impostati (come dominio di riferimento) **`https://rankhotel.ai/`** per:

- `<link rel="canonical">`
- `og:url`, `og:image` (e immagine Twitter)
- JSON-LD (`Organization`, `WebSite`, `WebPage`, `FAQPage`)

Se pubblichi solo su GitHub Pages senza dominio custom, sostituisci con la tua URL pubblica, ad esempio:

- `https://<USERNAME>.github.io/<REPO>/` per `canonical` e `og:url`
- `https://<USERNAME>.github.io/<REPO>/assets/images/logo/rankhotel-dark-white.jpg` per `og:image` (e campo `logo` in Organization), oppure carica un’immagine dedicata 1200×630 e punta a quella.

### Dominio personalizzato (opzionale)

1. Nel repo, aggiungi un file **`CNAME`** nella radice con una sola riga: il tuo hostname (es. `www.tuodominio.it`).
2. Configura i DNS come da [documentazione GitHub Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. Aggiorna `canonical`, `og:url` e `og:image` in modo che usino il dominio finale.

## Form audit e webhook Make.com

L’URL del webhook è sull’elemento `<form id="audit-form">` come attributo **`data-webhook`**. In alternativa puoi impostare `window.RANKHOTEL_MAKE_WEBHOOK` prima di caricare `script.js`.

### Errore HTTP 410 (Gone) o 404

Make considera **non validi** i webhook se lo scenario è spento, è stato eliminato o il webhook non è collegato da tempo (in alcuni casi viene disattivato automaticamente). **Non è un bug del sito**: devi in Make.com aprire (o ricreare) lo scenario, aggiungere il modulo **Webhook personalizzato**, generare un **nuovo URL** e incollarlo in `data-webhook` in `index.html`.

Assicurati che lo scenario sia **ON** (scheduling attivo) quando testi l’invio.

## Sviluppo locale

Apri `index.html` dal filesystem o servi la cartella con un server statico qualsiasi. Non è richiesto un build step: Tailwind è caricato da CDN.
