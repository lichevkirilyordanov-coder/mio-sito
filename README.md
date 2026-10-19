# I Casi del Garage — Sito per scaricare il gioco

Il sito ufficiale di **I Casi del Garage**, il videogioco noir comico di **Kannella Studio**.
Ha lo stesso stile del gioco: fumetto con l'inchiostro nero, giallo `#ffe66d`, blu notte
`#1a1a2e`, carattere Outfit, il vicolo sotto la pioggia e l'insegna al neon della sigla.

---

## ✏️ Cambiare i testi (anche dal sito di GitHub)

Tutto quello che si legge sul sito sta in **due file**, nella cartella [`contenuti/`](./contenuti):

| File | Cosa c'è dentro |
|---|---|
| [`contenuti/NOVITA.md`](./contenuti/NOVITA.md) | **Le novità di ogni versione.** La versione più in alto è quella attuale: il suo numero compare da solo nella barra in alto e nel riquadro "Novità". |
| [`contenuti/sito.yml`](./contenuti/sito.yml) | Tutti gli altri testi: titolo, battute a fumetto, **link di download** e peso degli zip, galleria, guide per Mac e Windows, comandi del gioco, note, piè di pagina. |

**Dal sito di GitHub:**
1. Apri il file (es. `contenuti/NOVITA.md`) e premi la **matita ✏️** in alto a destra.
2. Scrivi le modifiche (in cima a ogni file c'è un promemoria con le regole).
3. Premi **Commit changes…** e poi di nuovo **Commit changes**.
4. Dopo un paio di minuti il sito è aggiornato da solo.
   Lo vedi nella scheda **Actions**: pallino verde ✅ = pubblicato.

### Nuova versione del gioco: cosa fare
1. In `contenuti/NOVITA.md` aggiungi **in cima** (sotto il promemoria):
   ```md
   ## 0.0.2 · 25 ottobre 2026

   Una frase per raccontare l'aggiornamento.

   - Prima novità
   - Seconda novità
   ```
   Le versioni vecchie restano sotto, in "Versioni precedenti".
2. Se cambia il peso degli zip, aggiornalo in `contenuti/sito.yml` (`peso:`).

### Se qualcosa va storto
Se in `sito.yml` manca uno spazio o ci sono i due punti `:` in una frase senza virgolette,
il sito **non si rompe**: resta quello di prima. Nella scheda **Actions** compare una ❌ e,
aprendola, un messaggio in italiano dice **in che riga** è l'errore.

---

## 📦 Link di download

1. Su GitHub, nella colonna di destra: **Releases** → **Draft a new release**.
2. Scrivi la versione (es. `v0.0.2`) e trascina i due zip, **sempre con lo stesso nome**, ad esempio
   `I-Casi-del-Garage-Mac.zip` e `I-Casi-del-Garage-Windows.zip` (meglio senza spazi:
   GitHub li cambierebbe in puntini).
3. **Publish release**.
4. In `contenuti/sito.yml` metti come `link:` un indirizzo così:
   ```
   https://github.com/TUO-NOME/TUO-REPO/releases/latest/download/I-Casi-del-Garage-Mac.zip
   ```
   Con `latest` il link porta sempre all'ultima release: **lo scrivi una volta sola**.

Finché un link è `"#"` il pulsante resta grigio e dice "in arrivo".

---

## 🖼 Galleria

Le immagini stanno in [`public/immagini/`](./public/immagini) (oggi sono gli sfondi del gioco).
Per aggiungerne una: su GitHub apri la cartella → **Add file → Upload files**, poi in
`contenuti/sito.yml`, sotto `galleria:`, aggiungi due righe come le altre (`file:` e `didascalia:`).
L'immagine del vicolo (`vicolo.webp`) è anche lo sfondo di tutta la pagina.

---

## 💻 Provarlo sul computer

Sul computer questa cartella ("File per GitHub") contiene **solo** i file del sito che vanno su GitHub.
I pacchetti per farlo girare (`node_modules`) stanno nella cartella sopra, così qui non c'è niente in più.

```bash
npm run dev
```

Se i pacchetti mancano, `npm install` qui dentro li rimette (git li ignora, non finiscono su GitHub).

Poi apri l'indirizzo che compare (di solito `http://localhost:5173`).

## 🌐 Pubblicazione su GitHub Pages

C'è già `.github/workflows/deploy.yml`: a ogni modifica sul ramo `main` (anche fatta dal sito di GitHub)
il sito viene ricostruito e pubblicato. La prima volta: **Settings → Pages → Source: GitHub Actions**.

## Come è fatto (per chi programma)

React + Vite + TypeScript, CSS normale in `src/index.css` (niente Tailwind).
`vite.config.ts` trasforma `contenuti/sito.yml` in dati (con l'errore in italiano) e mette
titolo e descrizione della pagina in `index.html`; `src/contenuti.ts` legge `NOVITA.md`
(titoli `##` = versioni, `###` = gruppi, `-` = punti, **grassetto**, *corsivo*, [link](https://…)).
Tasti: ← → scelgono la versione, Invio scarica.
