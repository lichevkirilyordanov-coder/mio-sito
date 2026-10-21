/* =====================================================================
   NOVITÀ DEL GIOCO — si scrivono qui, in Markdown
   ---------------------------------------------------------------------
   • Scrivi solo tra la riga  window.NOVITA = `  e la riga  `;  in fondo.
   • Ogni versione inizia con una riga così:
       ## 0.0.2 · 25 ottobre 2026 · Aggiornamento grafico
     (numero della versione · data · titolo breve; il titolo si può omettere;
      la data può essere anche solo mese e anno, es. "agosto 2026")
   • Sul sito diventano il "Registro delle versioni": una riga per versione,
     dalla più nuova alla prima, che si apre con un clic. L'ordine lo mette
     il sito in base alla data (se una versione non ce l'ha, in base al
     numero), ma è comodo scrivere la nuova IN CIMA. La più recente è
     quella attuale e compare nella barra in alto.
   • Per le versioni con tante novità aggiungi "· importante" alla fine:
       ## 0.0.2 · 25 ottobre 2026 · Bacheca nuova · importante
     sul sito compare l'etichetta "★ Aggiornamento importante" e una stella.
   • Sotto puoi scrivere una frase normale e poi le novità con il trattino:
       - Nuova scena: il parcheggio
       - Corretto un errore nel Taccuino
   • Puoi dividere in gruppi con un titoletto, che diventa un'etichetta colorata:
       ### Novità        (gialla)
       ### Grafica       (azzurra: anche "Interfaccia", "UI")
       ### Correzioni    (rossa: anche "Bug", "Risolto")
       ### Audio         (rosa: anche "Musica", "Suoni")
   • Grassetto: **parola**   ·   corsivo: *parola*   ·   link: [testo](https://...)
   • Non usare il carattere  `  (accento grave).
   • Niente spoiler: il sito lo leggono anche gli amici che non hanno giocato!
   ===================================================================== */

window.NOVITA = `

## 0.0.2 · 21 ottobre 2026 · Musica, menù e impostazioni · importante

### Grafica
- Nuova grafica dalla Home alla bacheca dei casi: ogni caso è una cartellina appesa al sughero
- Si passa da un caso all'altro con un movimento morbido
- Rivisto completamente il sistema dei dialoghi, con nuove aggiunte grafiche, piccole animazioni e nuova visualizzazione dei ritratti dei personaggi e dei fumetti.
- In prova: Nuova UI dei fascicoli (schermata salvataggi)

### Novità
- Impostazioni nuove
- Menù di pausa aggiornato
- Nuovo sistema di salvataggio: puoi salvare in qualsiasi scena, anche più volte, e caricare da qualsiasi punto del gioco
- Riscritto completamente il motore audioe riviste le relative opzioni
- Riviste tutte le musiche e gli effetti sonori, con nuove tracce e nuovi suoni

### Correzioni
- Risolto un bug che faceva sparire la lente da detective in alcune scene
- Risolto un bug che faceva sparire il tasto "Fiuto" in alcune scene
- Risolto un bug che faceva sparire il tasto "Indietro" in alcune scene
- Risolto un bug che non rindirizzava l'utente alla schermata iniziale dal menù di pausa
- Risolto un bug che non permetteva di salvare il gioco in alcune scene
- Risolto un bug che sovvraponeva la musica di sottofondo in alcune scene
- Risolto bug che non permetteva l'utilizzo di molte voci relative al menù impostazioni
- Tutti i flussi audio ora funzionano correttamente

## 0.0.1 beta · 19 ottobre 2026 · Prima uscita

La prima indagine è aperta: Federico Masia è stato trovato nel vicolo dietro il Bar Garage e Davide ha bisogno di te.

### Cosa trovi
- **Il Caso Masia**, il primo caso de I Casi del Garage, giocabile dall'inizio alla fine
- Ufficio da esplorare in due inquadrature: la scrivania e la stanza
- La lente da detective per Ispezionare le scene, con il Fiuto (tasto F)
- Indizi che finiscono nel Taccuino, con la bacheca per collegare le prove
- Mappa dei luoghi e qualche segreto da scoprire tornando sui tuoi passi
- Accusa finale con il giornale del giorno dopo

### Per giocare meglio
- Schermo intero (Ctrl+Cmd+F sul Mac, F11 su Windows)
- I salvataggi restano anche quando aggiorni il gioco

### Correzioni
- Un clic durante la sigla non fa più ripartire la vecchia musica d'apertura
- La mappa ora ricorda anche il vicolo tra i luoghi visitati
- Pulizia generale: tolte molte parti vecchie che non servivano più

## 0.0.1 alpha 9 · 10 ottobre 2026 · Ufficio, bagno e mappa

### Novità
- Una scena tutta nuova, il bagno del Bar Garage, con un personaggio da scoprire
- L'ufficio ha una seconda inquadratura: la stanza vista dalla porta, con tanti oggetti da guardare
- Un ombrello giallo nel portaombrelli (e Davide nota se l'hai preso)
- Mappa dei luoghi (tasto M) e segreti da scoprire tornando sui tuoi passi
- Oggetti da guardare in ogni scena, con i commenti di Davide
- Accusa finale con il giornale del giorno dopo

### Grafica
- Sigla d'apertura nuova firmata Kannella Studio
- Indizio trovato: una scheda a fumetto accanto all'oggetto, invece di un riquadro a tutto schermo
- Menù di pausa nuovo: dice dove sei e qual è il prossimo passo

### Gioco
- Punti da ispezionare rivisti: ogni indizio sta su qualcosa che si vede nella scena

## 0.0.1 alpha 8 · 4 ottobre 2026 · Il profilo dell'agente

### Novità
- Sistemate tutte le impostazioni del profilo
- Profilo in tre passi: nome, volto e carattere dell'agente

## 0.0.1 alpha 6 · 15 settembre 2026 · Il grande restyling a fumetto · importante

### Grafica
- Nuovo stile a fumetto in tutto il gioco: inchiostro nero, colori pieni, angoli arrotondati
- Nuova schermata iniziale con il logo del gioco e le opzioni per iniziare, continuare o uscire
- Nuova interfaccia per i dialoghi e le scelte di risposta, con i tasti numerici e le frecce per navigare tra le opzioni
- Il gioco riempie tutta la finestra, prima veniva ridotto a un riquadro
- Dialoghi su un palco: il personaggio grande, il fumetto e le risposte numerate (tasti 1–9)
- Ispeziona diventa una lente da detective, con i luccichii e il nuovo tasto "Fiuto"
- Uscite con i cartelli e una vignetta che accompagna il passaggio da un luogo all'altro
- Pioggia, luci e nebbia nelle scene ridisegnate per un effetto più immersivo
- La telefonata di Davide acquisisce un nuovo look! Adesso potrai immedesimarti meglio nel personaggio e nelle sue scelte
- Alcuni luoghi sono stati ridisegnati e ripensati

### Novità
- Dialoghi riscritti da capo, con riferimenti al gruppo Garage e un tono noir comico
- Al Bar Garage Martina e Marco compaiono come fumetti da cliccare e non più come scelte di dialogo che interrompono la scena
- Il Taccuino ha una grafica completamente rinnovata: si apre da destra e ha la bacheca dell'indagine, con il filo rosso tra le prove
- Introdotta una guida passo passo per la prima partita, con la spiegazione dei comandi e delle meccaniche di gioco
- Il gioco diventa un'app vera per Mac e Windows

### Gioco
- Alcune meccaniche riviste per rendere il gioco più piacevole
- Finestre e avvisi (pop-up) rifatti, più chiari e meno invadenti

## 0.0.1 alpha 5 · agosto 2026 · Caccia ai bug

### Correzioni
- Sistemati molti bug trovati giocando

## 0.0.1 alpha 4 · luglio 2026 · L'intro e i dialoghi nuovi

### Novità
- L'intro del gioco
- Dialoghi riscritti per adattarsi alla storia
- Nuova schermata iniziale con la scrivania dell'agente
- Nuova schermata di caricamento con il logo del gioco
- Nuova schermata creazione del profilo dell'agente, con il nome e il volto
- Nuova schermata delle impostazioni, con le opzioni per la musica, gli effetti sonori e il volume
- Nuova schermata di pausa, con le opzioni per continuare, salvare, caricare e uscire
- Nuove descrizioni per gli oggetti da ispezionare e per i personaggi

### Grafica
- Animazioni più fluide
- Nuovi sfondi per l'ufficio dell'agente e il Bar Garage
- Nuovi ritratti dei personaggi
- Inseriti placeholder per gli indizi scovati lungo il gioco, che compariranno nel Taccuino (verranno rivisitati)

### Correzioni
- Il tasto Indietro ora funziona

## 0.0.1 alpha 3 · 16 giugno 2026 · Telefonata e Taccuino

### Novità
- La telefonata di Davide sul telefono, con le scelte di risposta
- Taccuino con indizi, sospettati, deduzioni, decisioni e traguardi
- Scelte e interrogatori nel Bar Garage

### Correzioni
- Prime prove automatiche del gioco, per scovare gli errori prima di giocare

## 0.0.1 alpha 2 · 8 giugno 2026 · Arriva Martina

### Novità
- Martina entra nel cast, con il suo ritratto
- Il Bar Garage ha uno sfondo nuovo
- Manuale dell'agente e impostazioni

### Grafica
- Nuovi sfondi per il vicolo e l'auto sospetta
- Nuovo ritratto di Davide

## 0.0.1 alpha 1 · 29 maggio 2026 · Prime ambientazioni e dialoghi

### Novità
- L'ufficio dell'agente, con i primi oggetti da ispezionare
- Kiril si unisce ai personaggi
- Prime scene e dialoghi, con le scelte di risposta
- Ambientazioni rivisitte

### Grafica
- Ritratti dei personaggi scontornati
- La scrivania della schermata iniziale
- Nuove ambientazioni: vicolo, auto sospetta e Bar Garage

## 0.0.1 alpha 0 · 20 maggio 2026 · Si apre il caso

La primissima versione del gioco.
Con la prima scena, il primo dialogo e i primi indizi da raccogliere.

### Novità
- Il vicolo, l'auto sospetta e il Bar Garage
- Davide e Marco, i primi personaggi
- I primi indizi della scena del crimine
- Musica ed effetti sonori riempitivi

`;
