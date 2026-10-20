# I Casi del Garage — Sito per scaricare il gioco

Il sito ufficiale di **I Casi del Garage**, il videogioco noir comico di **Kannella Studio**.
Ha lo stesso stile del gioco: fumetto con l'inchiostro nero, giallo, blu notte, carattere Outfit,
il vicolo sotto la pioggia e l'insegna al neon della sigla.

**Non serve installare niente:** sul computer basta un doppio clic su `index.html`.

---

## 📁 Cosa c'è

| File | A cosa serve |
|---|---|
| `contenuti/testi.js` | ✏️ **Tutti i testi**: titolo, battute a fumetto, **link di download** e peso degli zip, galleria, guide per Mac e Windows, comandi, note, piè di pagina. |
| `contenuti/novita.js` | ✏️ **Le novità di ogni versione** (in Markdown). Sul sito diventano il **Registro delle versioni**: una riga per versione, dalla più nuova alla prima, che si apre con un clic. La più recente è l'attuale e compare nella barra in alto. |
| `immagini/` | Le foto della galleria (e `vicolo.webp`, che è anche lo sfondo della pagina). |
| `index.html`, `stile.css`, `sito.js`, `favicon.svg` | La pagina, il suo aspetto e il "motore". Di solito non si toccano. |

---

## ✏️ Cambiare i testi dal sito di GitHub

1. Apri il file (es. `contenuti/novita.js`) e premi la **matita ✏️** in alto a destra.
2. Scrivi le modifiche: in cima a ogni file c'è un promemoria con le regole.
   Scrivi solo tra la riga ``window.TESTI = ` `` (o ``window.NOVITA = ` ``) e la riga `` `; `` in fondo.
3. Premi **Commit changes…** e poi di nuovo **Commit changes**.
4. Dopo circa un minuto il sito è aggiornato.

### Nuova versione del gioco
In `contenuti/novita.js` aggiungi **in cima** (subito sotto ``window.NOVITA = ` ``):

```md
## 0.0.2 · 25 ottobre 2026 · Aggiornamento grafico

Una frase per raccontare l'aggiornamento (facoltativa).

### Grafica
- Menù nuovo

### Correzioni
- Corretto un errore nel Taccuino
```

La riga con `##` è numero · data · titolo breve. I titoletti `###` diventano etichette colorate
(Novità gialla, Grafica/UI azzurra, Correzioni/Bug rossa, Audio rosa). Se una versione ha tante novità, aggiungi
`· importante` alla fine della riga `##`: compare l'etichetta **★ Aggiornamento importante** e una stella. Le versioni vecchie restano
sotto, chiuse: il sito le mette in ordine da solo in base alla data (o al numero, se una data manca). Se cambia il peso degli zip,
aggiornalo in `contenuti/testi.js` (`peso:`).

### Se qualcosa va storto
Se un testo è scritto male (per esempio mancano degli spazi all'inizio di una riga), il sito
non si rompe in silenzio: mostra un fumetto **"OPS!"** che dice in quale file è l'errore e quale
riga controllare. Prima di caricare, puoi sempre provare con un doppio clic su `index.html`.

---

## 📦 Link di download

1. Su GitHub, nella colonna di destra: **Releases** → **Draft a new release**.
2. Scrivi la versione (es. `v0.0.2`) e trascina i due zip, **sempre con lo stesso nome**, ad esempio
   `I-Casi-del-Garage-Mac.zip` e `I-Casi-del-Garage-Windows.zip` (meglio senza spazi).
3. **Publish release**.
4. In `contenuti/testi.js` metti come `link:` un indirizzo così:
   ```
   https://github.com/lichevkirilyordanov-coder/mio-sito/releases/latest/download/I-Casi-del-Garage-Mac.zip
   ```
   Con `latest` il link porta sempre all'ultima release: **lo scrivi una volta sola**.

Finché un link è `#` il pulsante resta grigio e dice "in arrivo".

---

## 🌐 Pubblicazione (GitHub Pages)

**Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, ramo `main`, cartella `/ (root)`.
Così ogni modifica (fatta dall'editor di GitHub o caricando i file) va online da sola.

Per caricare i file a mano: **Add file → Upload files** e trascina il **contenuto** della cartella
(`index.html`, `stile.css`, `sito.js`, `favicon.svg` e le cartelle `contenuti` e `immagini`).
