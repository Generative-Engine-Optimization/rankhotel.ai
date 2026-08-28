# Istruzioni per gli agenti

Osservatorio della visibilità AI del turismo italiano. Astro statico, bilingue
IT/EN, nessun backend: tutti i dati sono JSON committati in `src/data/` e
generati da `tools/generate-observatory.mjs`. Il dataset è ancora **simulato**,
e `OBSERVATORY_IS_DEMO` in `src/lib/config.ts` è l'interruttore che tiene le
pagine con i numeri fuori dagli indici.

Comandi: `npm run dev` (porta 4321), `npm run build` (rigenera i dati e
compila). Il resto sta nel `README.md`.

## Regole di base

- **Le URL non si scrivono a mano.** Si usano i builder di `src/lib/config.ts`
  (`destinationPath`, `categoryPath`, `tagPath`, …). Gli slug localizzati stanno
  tutti in `SEGMENTS`, in quel solo file.
- **Le stringhe stanno nei file di messaggi**, mai nei template. Ogni chiave
  nuova va aggiunta in **entrambe** le lingue: `src/data/messages/*.it.json` e
  `*.en.json`.
- **I numeri misurati non si scrivono a mano.** Vengono dal dataset, e il
  dataset cambierà: dedurli da `src/lib/observatory.ts` o non pubblicarli.

## Regola llms.txt — da applicare a ogni modifica di contenuto

Il sito espone tre livelli di contesto per i sistemi automatici:

| File | Sorgente |
|---|---|
| `/llms.txt` | `src/pages/llms.txt.ts` — indice del sito |
| `/llms-full.txt` | `src/pages/llms-full.txt.ts` — metodo, assunzioni e glossario per esteso |
| `{url}/llms.txt` per **ogni** pagina | `src/lib/llms.ts` + `src/pages/[...page]/llms.txt.ts` |

I file per pagina sono generati da `listLlmsPages()`, che legge titolo,
descrizione e lead **dagli stessi messaggi i18n che usano i template**. Quindi:

> **Modificare la copy di una pagina aggiorna da sola il suo llms.txt.**
> Non va riscritto a mano, e non esiste una copia da tenere allineata.

Restano i casi in cui l'aggiornamento automatico non basta e va fatto un
intervento esplicito, nello stesso commit della modifica:

- **Aggiungi, rimuovi o rinomini una rotta** (nuovo file in `src/pages/`, nuovo
  segmento in `SEGMENTS`): aggiorna `listLlmsPages()` in `src/lib/llms.ts`, e
  insieme `src/pages/sitemap.xml.ts`, il conteggio `perLocale` in
  `src/templates/SitemapPage.astro`, la nav e il footer in
  `src/components/SiteShell.astro`.
- **Cambi la struttura di una pagina** (sezioni aggiunte o tolte, significato
  della pagina spostato): verifica che `lead`, `facts` e `related` di quella
  pagina in `src/lib/llms.ts` la descrivano ancora.
- **Cambi il titolo o la descrizione** di una pagina: nessun intervento, ma
  ricontrolla il file generato — la stessa stringa ora parla a due pubblici.
- **Aggiungi una stringa** nei file di messaggi: entrambe le lingue, sempre.

### Che cosa non entra mai in un file llms

Punteggi, posizioni in classifica, conteggi del dataset (quante destinazioni,
quanti hotel, quante run) e `updatedAt`. Quei valori arriveranno dal backend: un
file statico che li incorpora diventa falso il giorno in cui cambiano, e nessuno
se ne accorge. Nei file llms si scrivono **metodo, struttura del sito, identità
delle entità e link** — cioè le cose da cui la rotta è già generata.

Vale per tutti e tre i livelli, `/llms.txt` compreso: se serve un numero, il
posto è la pagina o l'endpoint JSON, non il .txt.

Unica eccezione, e per costruzione: le `description` delle pagine — quelle in
`meta` dentro i file di messaggi — sono copy scritta a mano e finiscono nel .txt
identiche a come stanno nel `<meta name="description">` della pagina. Se ne
contengono una quantità («cento destinazioni», «20 hotel»), quella quantità è
una scelta di progetto dichiarata in due posti, non un valore letto dal dataset.
Cambiarla si fa nei file di messaggi, dove cambia in entrambi.

### Verifica

```
npm run build
find dist -name llms.txt | wc -l   # 285: 284 pagine + la radice
```

Poi apri almeno una coppia IT/EN — per esempio
`dist/it/osservatorio/destinazioni/roma/llms.txt` e
`dist/en/observatory/destinations/rome/llms.txt` — e controlla che i link
alternate siano reciproci e che non sia comparso nessun numero misurato.
