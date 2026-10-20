/* ==========================================================================
   sito.js — il "motore" del sito di I Casi del Garage.
   Legge i testi da contenuti/testi.js e le novità da contenuti/novita.js
   e costruisce la pagina. Funziona anche aprendo index.html con un doppio
   clic, senza server e senza installare niente.
   Qui non ci sono testi da cambiare.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (sel, dove) => (dove || document).querySelector(sel);
  const esc = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // colori dei fumetti (gli stessi dei personaggi nel gioco)
  const COLORI = { giallo: '#ffe66d', rosa: '#ff8fc8', azzurro: '#7ee7ff', viola: '#b39cff', arancio: '#ffb347' };

  // ------------------------------------------------------------------------
  // contenuti/testi.js → oggetto
  // Formato "chiave: valore" con rientri (come YAML, ma più indulgente:
  // i due punti dentro una frase vanno bene anche senza virgolette).
  // ------------------------------------------------------------------------
  function ErroreTesti(riga, perche) {
    this.riga = riga;
    this.perche = perche;
  }

  function leggiTesti(testo) {
    const righe = [];
    testo.replace(/\r/g, '').split('\n').forEach((r) => {
      if (/^\s*#/.test(r) || !r.trim()) return;
      if (/\t/.test(r.match(/^\s*/)[0])) throw new ErroreTesti(r, 'Usa gli spazi per rientrare, non il tasto Tab.');
      righe.push({ rientro: r.search(/\S/), testo: r.trim() });
    });

    // "testo"  /  'testo'  /  testo   # nota
    function valore(s) {
      s = s.trim();
      const q = s[0];
      if ((q === '"' || q === "'") && s.lastIndexOf(q) > 0) return s.slice(1, s.lastIndexOf(q));
      return s.replace(/\s+#\s.*$/, '').trim();
    }
    const CHIAVE = /^([A-Za-z0-9_]+):(?:\s+(.*))?$/;

    let i = 0;
    function figlio(rientro) {
      const r = righe[i];
      if (r && (r.rientro > rientro || (r.rientro === rientro && r.testo.startsWith('-')))) return blocco(r.rientro);
      return '';
    }
    function blocco(rientro) {
      if (righe[i].testo.startsWith('-')) {
        const lista = [];
        while (i < righe.length && righe[i].rientro === rientro && righe[i].testo.startsWith('-')) {
          const r = righe[i++];
          const resto = r.testo.slice(1).trim();
          const m = resto.match(CHIAVE);
          if (!m) { lista.push(valore(resto)); continue; }
          const voce = {};
          voce[m[1]] = m[2] ? valore(m[2]) : figlio(r.rientro + 2);
          if (i < righe.length && righe[i].rientro > r.rientro && !righe[i].testo.startsWith('-')) {
            Object.assign(voce, blocco(righe[i].rientro));
          }
          lista.push(voce);
        }
        return lista;
      }
      const ogg = {};
      while (i < righe.length && righe[i].rientro === rientro) {
        const r = righe[i];
        const m = r.testo.match(CHIAVE);
        if (!m) throw new ErroreTesti(r.testo, 'Manca "nome:" all\'inizio, oppure gli spazi all\'inizio della riga non tornano.');
        i++;
        ogg[m[1]] = m[2] ? valore(m[2]) : figlio(rientro);
      }
      return ogg;
    }

    if (!righe.length) return {};
    const tutto = blocco(righe[0].rientro);
    if (i < righe.length) throw new ErroreTesti(righe[i].testo, 'Gli spazi all\'inizio di questa riga non tornano con quelle sopra.');
    return tutto;
  }

  // ------------------------------------------------------------------------
  // contenuti/novita.js (Markdown) → elenco di versioni
  // ------------------------------------------------------------------------
  function inline(t) {
    return esc(t)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function leggiNovita(md) {
    const versioni = [];
    let cur = null;
    md.replace(/\r/g, '').replace(/<!--[\s\S]*?-->/g, '').split('\n').forEach((riga) => {
      const r = riga.trim();
      const h2 = r.match(/^##\s+(.+)$/);
      if (h2 && !r.startsWith('###')) {
        // "0.0.2 · 25 ottobre 2026 · Aggiornamento grafico"  (vanno bene anche "—", "-" o "|";
        // data e titolo si possono scambiare o lasciar fuori: la data è il pezzo con un numero)
        const pezzi = h2[1].split(/\s+[·—|-]\s+/).map((p) => p.trim());
        const sembraData = (p) => /\d/.test(p) && (/gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic/i.test(p) || /^\d{1,4}[\/.\-]\d/.test(p));
        // "· importante" (o "· aggiornamento importante") mette l'etichetta gialla
        const segnoImportante = (p) => /^(aggiornamento\s+)?importante!?$/i.test(p);
        const resto = pezzi.slice(1).filter((p) => !segnoImportante(p));
        const data = resto.find(sembraData) || '';
        cur = {
          numero: pezzi[0].replace(/^v(ersione)?\s*/i, '').trim(),
          importante: pezzi.slice(1).some(segnoImportante),
          data,
          titolo: resto.filter((p) => p !== data).join(' · '),
          pezzi: [],
        };
        versioni.push(cur);
        return;
      }
      if (!cur || !r || /^#\s/.test(r)) return;
      const h3 = r.match(/^###\s+(.+)$/);
      const voce = r.match(/^[-*+]\s+(.+)$/);
      const ultimo = cur.pezzi[cur.pezzi.length - 1];
      if (h3) cur.pezzi.push({ tipo: 'titoletto', html: inline(h3[1]) });
      else if (voce) {
        if (ultimo && ultimo.tipo === 'elenco') ultimo.voci.push(inline(voce[1]));
        else cur.pezzi.push({ tipo: 'elenco', voci: [inline(voce[1])] });
      } else if (ultimo && ultimo.tipo === 'frase') ultimo.html += ' ' + inline(r);
      else cur.pezzi.push({ tipo: 'frase', html: inline(r) });
    });
    // dalla più nuova alla più vecchia, anche se nel file sono in un altro ordine:
    // per data se ce l'hanno tutte ("22 maggio 2026", "agosto 2026", "22/05/2026"), altrimenti per numero
    const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    const quando = (t) => {
      let m = t.match(/(\d{1,2})\s+([a-zà]+)\s+(\d{4})/i);
      if (m && MESI.indexOf(m[2].slice(0, 3).toLowerCase()) >= 0) return new Date(+m[3], MESI.indexOf(m[2].slice(0, 3).toLowerCase()), +m[1]).getTime();
      // solo mese e anno ("agosto 2026"): conta come il primo del mese
      m = t.match(/([a-zà]+)\s+(\d{4})/i);
      if (m && MESI.indexOf(m[1].slice(0, 3).toLowerCase()) >= 0) return new Date(+m[2], MESI.indexOf(m[1].slice(0, 3).toLowerCase()), 1).getTime();
      m = t.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/);
      return m ? new Date(+m[3], +m[2] - 1, +m[1]).getTime() : NaN;
    };
    const perData = versioni.length > 1 && versioni.every((v) => !isNaN(quando(v.data)));
    const cifre = (v) => (v.numero.match(/\d+/g) || []).map(Number);
    return versioni
      .map((v, i) => ({ v, i }))
      .sort((a, b) => {
        if (perData && quando(a.v.data) !== quando(b.v.data)) return quando(b.v.data) - quando(a.v.data);
        const x = cifre(a.v), y = cifre(b.v);
        for (let k = 0; k < Math.max(x.length, y.length); k++) {
          if ((y[k] || 0) !== (x[k] || 0)) return (y[k] || 0) - (x[k] || 0);
        }
        return a.i - b.i;
      })
      .map((o) => o.v);
  }

  // ------------------------------------------------------------------------
  // Se un file dei contenuti è scritto male: fumetto con la spiegazione
  // ------------------------------------------------------------------------
  function mostraErrore(file, perche, riga) {
    $('#sito').innerHTML = `
      <div class="errore-contenuti vignetta">
        <span class="boom-nuovo" aria-hidden="true">OPS!</span>
        <h1>C'è un errore in <code>${esc(file)}</code></h1>
        <p>${esc(perche)}</p>
        ${riga ? `<p>Controlla questa riga:</p><pre>${esc(riga)}</pre>` : ''}
        <p class="piccolo">Correggi il file e ricarica la pagina.</p>
      </div>`;
  }

  if (typeof window.TESTI !== 'string') {
    mostraErrore('contenuti/testi.js', 'Il file non si legge: forse è stato cancellato il carattere ` all\'inizio (dopo window.TESTI =) o alla fine (prima di ;), oppure c\'è un ` dentro un testo.');
    return;
  }
  if (typeof window.NOVITA !== 'string') {
    mostraErrore('contenuti/novita.js', 'Il file non si legge: forse è stato cancellato il carattere ` all\'inizio (dopo window.NOVITA =) o alla fine (prima di ;), oppure c\'è un ` dentro un testo.');
    return;
  }

  let s;
  try {
    s = leggiTesti(window.TESTI);
  } catch (e) {
    if (e instanceof ErroreTesti) { mostraErrore('contenuti/testi.js', e.perche, e.riga); return; }
    throw e;
  }

  // se una parte manca il sito non si rompe: resta vuota
  const ogg = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  const lista = (x) => (Array.isArray(x) ? x : []);
  const titolo = Object.assign({ etichetta: 'I CASI', nome: 'DEL GARAGE' }, ogg(s.titolo));
  const d = Object.assign({ pulsante: 'Scarica per' }, ogg(s.download));
  const versioneDi = (x) => Object.assign({ nome: '', dettagli: '', peso: '', link: '#' }, ogg(x));
  d.mac = versioneDi(d.mac);
  d.windows = versioneDi(d.windows);
  const galleria = Object.assign({ titolo: '' }, ogg(s.galleria));
  const guidaMac = ogg(s.guida_mac);
  const guidaWin = ogg(s.guida_windows);
  const piede = Object.assign({ studio: 'Kannella Studio' }, ogg(s.piede));
  const novita = leggiNovita(window.NOVITA);
  const versioneAttuale = novita[0] ? novita[0].numero : '';
  const haLink = (l) => !!l && String(l).trim() !== '' && String(l).trim() !== '#';

  if (s.titolo_pagina) document.title = s.titolo_pagina;
  if (s.descrizione) $('meta[name="description"]').setAttribute('content', s.descrizione);

  // ------------------------------------------------------------------------
  // Icone
  // ------------------------------------------------------------------------
  const T = 'fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';
  const ICONA = {
    scarica: `<svg viewBox="0 0 24 24" ${T}><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 20h16"/></svg>`,
    spunta: `<svg viewBox="0 0 24 24" ${T} stroke-width="3"><path d="m5 12 4 4L19 6"/></svg>`,
    chiudi: `<svg viewBox="0 0 24 24" ${T} stroke-width="3"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
    lente: `<svg viewBox="0 0 24 24" ${T}><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>`,
    copia: `<svg viewBox="0 0 24 24" ${T}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>`,
    mac: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.4-4zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>',
    windows: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.5 10.5 4.5v7H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.3z"/></svg>',
  };
  // marchio di Kannella Studio: due stecche di cannella incrociate e una stellina (come nella sigla)
  const stecca = (a) => `<g class="k-stick" transform="rotate(${a} 60 60)"><rect x="22" y="50" width="76" height="20" rx="10"/><path d="M32 54 L32 66 M46 54 L46 66 M60 54 L60 66 M74 54 L74 66 M88 54 L88 66"/><circle class="k-end" cx="98" cy="60" r="10"/><path class="k-swirl" d="M98 60 m-5 0 a5 5 0 1 1 5 5 a2.5 2.5 0 1 1 -2.5 -2.5"/></g>`;
  const LOGO = `<span class="logo-kannella" aria-hidden="true"><svg viewBox="0 0 120 120">${stecca(-35)}${stecca(35)}<path class="k-star" d="M60 12 L64 24 L76 26 L66 33 L69 45 L60 38 L51 45 L54 33 L44 26 L56 24 Z"/></svg></span>`;

  // ------------------------------------------------------------------------
  // La pagina
  // ------------------------------------------------------------------------
  // parola per parola (vanno a capo intere), lettera per lettera (l'insegna si accende a scatti)
  let n = 0;
  const neon = String(titolo.nome).split(' ').map((parola) => {
    const lettere = parola.split('').map((c) => {
      const i = n++;
      return `<i style="--d:${(0.15 + i * 0.06 + (i % 3) * 0.05).toFixed(2)}s">${esc(c)}</i>`;
    }).join('');
    n++;
    return `<span class="parola">${lettere}</span>`;
  }).join('');

  const battute = lista(s.battute).map((b, i) => `
    <li style="--c:${esc(COLORI[b.colore] || b.colore || COLORI.giallo)};--i:${i}">
      <span class="boom">${esc(b.scritta)}</span><b>${esc(b.testo)}</b>
    </li>`).join('');

  // gruppi delle novità (### Titoletto): il colore dell'etichetta dipende dalla parola
  const tipoGruppo = (t) =>
    /corre|bug|risol|sistem|fix/i.test(t) ? 'rosso'
      : /grafic|interfacc|\bui\b|aspetto|stile/i.test(t) ? 'azzurro'
        : /suon|music|audio/i.test(t) ? 'rosa'
          : 'giallo';
  const pezzi = (v) => `<div class="novita-corpo">${v.pezzi.map((p) =>
    p.tipo === 'frase' ? `<p>${p.html}</p>`
      : p.tipo === 'titoletto' ? `<h3 class="gruppo ${tipoGruppo(p.html)}">${p.html}</h3>`
        : `<ul>${p.voci.map((x) => `<li>${x}</li>`).join('')}</ul>`).join('')}</div>`;
  const quanti = (v) => v.pezzi.reduce((n, p) => n + (p.tipo === 'elenco' ? p.voci.length : 0), 0);

  // registro delle versioni: una riga per versione, dalla più nuova alla prima
  const registro = Object.assign({ titolo: 'Registro delle versioni', intro: '' }, ogg(s.registro));
  const vocsRegistro = novita.map((v, i) => {
    const n = quanti(v);
    return `
      <li class="registro-voce${i === 0 ? ' ultima' : ''}${v.importante ? ' importante' : ''}">
        <details${i === 0 ? ' open' : ''}>
          <summary>
            <span class="registro-numero">v${esc(v.numero)}</span>
            <span class="registro-testa">
              ${v.importante ? '<span class="registro-importante">★ Aggiornamento importante</span>' : ''}
              <strong>${esc(v.titolo || (i === novita.length - 1 ? 'Prima uscita' : 'Aggiornamento'))}</strong>
              <small>${[v.data ? esc(v.data) : '', n ? `${n} ${n === 1 ? 'cambiamento' : 'cambiamenti'}` : ''].filter(Boolean).join(' · ')}</small>
            </span>
            ${i === 0 ? '<span class="registro-nuovo">Ultima</span>' : ''}
            <span class="registro-freccia" aria-hidden="true"></span>
          </summary>
          ${v.pezzi.length ? pezzi(v) : '<div class="novita-corpo"><p>Nessun dettaglio.</p></div>'}
        </details>
      </li>`;
  }).join('');

  const immagini = lista(galleria.immagini);

  $('#sito').innerHTML = `
    <header class="barra">
      <a class="marchio" href="#" aria-label="I Casi del Garage">
        <span class="marchio-etichetta">${esc(titolo.etichetta)}</span>
        <span class="marchio-nome">${esc(titolo.nome)}</span>
      </a>
      <nav class="barra-destra">
        ${versioneAttuale ? `<a class="pillola" href="#novita"><i class="lucina" aria-hidden="true"></i> Versione ${esc(versioneAttuale)}</a>` : ''}
        <button class="pillola chiara" type="button" data-aiuto>${ICONA.lente} Aiuto</button>
      </nav>
    </header>

    <main>
      <section class="apertura">
        <div class="titolo">
          <span class="titolo-etichetta">${esc(titolo.etichetta)}</span>
          <h1 class="titolo-nome" aria-label="${esc(titolo.nome)}">${neon}</h1>
          ${titolo.sottotitolo ? `<p class="titolo-sotto">${esc(titolo.sottotitolo)}</p>` : ''}
          ${battute ? `<ul class="battute">${battute}</ul>` : ''}
          ${titolo.frase ? `<blockquote class="frase">“${esc(titolo.frase)}”</blockquote>` : ''}
        </div>

        <aside class="fascicolo" aria-labelledby="scarica-titolo">
          <span class="nastro" aria-hidden="true"></span>
          <span class="timbro" aria-hidden="true">Gratis</span>
          ${d.sopra_titolo ? `<p class="occhiello">${esc(d.sopra_titolo)}</p>` : ''}
          <h2 id="scarica-titolo">${esc(d.titolo)}</h2>
          <div class="versioni" role="radiogroup" aria-label="Sistema operativo">
            ${['windows', 'mac'].map((p) => `
              <button type="button" role="radio" class="versione" data-versione="${p}">
                <span class="versione-icona">${ICONA[p]}</span>
                <span class="versione-testo"><strong>${esc(d[p].nome)}</strong><small>${esc(d[p].dettagli)}</small></span>
                <span class="versione-spunta"></span>
              </button>`).join('')}
          </div>
          <button type="button" class="pulsante-giallo grande" data-scarica>
            <span class="pulsante-icona">${ICONA.scarica}</span>
            <span class="pulsante-testo"><strong></strong><small></small></span>
          </button>
          <p class="fascicolo-nota">Prima volta? Leggi <button type="button" class="link" data-aiuto>come aprire il gioco su <span data-nome></span></button>.</p>
        </aside>
      </section>

      ${novita.length ? `
      <section class="sezione" id="novita" aria-labelledby="novita-titolo">
        <div class="registro-intesta">
          <h2 class="sezione-titolo" id="novita-titolo"><span>${esc(registro.titolo)}</span></h2>
          ${novita.length > 1 ? '<button type="button" class="pillola" data-registro-tutte>Apri tutte</button>' : ''}
        </div>
        ${registro.intro ? `<p class="registro-intro">${esc(registro.intro)}</p>` : ''}
        <ol class="registro">${vocsRegistro}</ol>
      </section>` : ''}

      ${immagini.length ? `
      <section class="sezione" aria-labelledby="galleria-titolo">
        <h2 class="sezione-titolo" id="galleria-titolo"><span>${esc(galleria.titolo)}</span></h2>
        <ul class="galleria">
          ${immagini.map((im, i) => `
            <li style="--i:${i}"><figure class="polaroid">
              <img src="immagini/${esc(im.file)}" alt="${esc(im.didascalia)}" loading="lazy" />
              <figcaption>${esc(im.didascalia)}</figcaption>
            </figure></li>`).join('')}
        </ul>
      </section>` : ''}
    </main>

    <footer class="piede">
      <div class="piede-studio">${LOGO}<div><strong>${esc(piede.studio)}</strong>${piede.frase ? `<span>${esc(piede.frase)}</span>` : ''}</div></div>
      <div class="piede-tasti" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> scegli <span class="punto">·</span> <kbd>Invio</kbd> scarica</div>
      <span class="piede-copy">© ${new Date().getFullYear()} ${esc(piede.studio)}</span>
    </footer>

    <dialog class="aiuto" aria-labelledby="aiuto-titolo">
      <div class="aiuto-foglio">
        <header class="aiuto-testa">
          <h2 id="aiuto-titolo">Aiuto</h2>
          <button class="tasto-tondo" type="button" data-chiudi aria-label="Chiudi">${ICONA.chiudi}</button>
        </header>
        <div class="aiuto-schede" role="tablist">
          ${[['mac', 'Mac'], ['windows', 'Windows'], ['comandi', 'Comandi'], ['note', 'Note']].map(([id, nome]) =>
            `<button type="button" role="tab" data-scheda="${id}">${nome}</button>`).join('')}
        </div>
        <div class="aiuto-corpo" role="tabpanel">
          <div data-pannello="mac">
            ${guidaMac.avviso ? `<p class="avviso">${esc(guidaMac.avviso)}</p>` : ''}
            <ol class="passi">${lista(guidaMac.passi).map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
            ${guidaMac.comando ? `
            <div class="riquadro-comando">
              <p>${esc(guidaMac.se_danneggiata)}:</p>
              <div class="comando"><code>${esc(guidaMac.comando)}</code><button type="button" data-copia>${ICONA.copia} Copia</button></div>
            </div>` : ''}
          </div>
          <div data-pannello="windows">
            ${guidaWin.avviso ? `<p class="avviso azzurro">${esc(guidaWin.avviso)}</p>` : ''}
            <ol class="passi">${lista(guidaWin.passi).map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
          </div>
          <div data-pannello="comandi">
            <ul class="comandi">${lista(s.comandi).map((c) => `
              <li><span class="tasti">${String(c.tasto).split(/\s*\/\s*/).map((k) => `<kbd>${esc(k)}</kbd>`).join('')}</span><span>${esc(c.azione)}</span></li>`).join('')}
            </ul>
          </div>
          <div data-pannello="note" class="note">${lista(s.note).map((x) => `<p>${esc(x)}</p>`).join('')}</div>
        </div>
        <footer class="aiuto-piede"><button class="pulsante-giallo piccolo" type="button" data-chiudi>Ho capito</button></footer>
      </div>
    </dialog>`;

  // ------------------------------------------------------------------------
  // Comportamento
  // ------------------------------------------------------------------------
  let scelta = /windows/i.test(navigator.userAgent) ? 'windows' : 'mac';
  const dialogo = $('.aiuto');
  const pulsante = $('[data-scarica]');

  function aggiorna() {
    const v = d[scelta];
    const pronto = haLink(v.link);
    document.querySelectorAll('.versione').forEach((b) => {
      const attiva = b.dataset.versione === scelta;
      b.classList.toggle('attiva', attiva);
      b.setAttribute('aria-checked', attiva);
      $('.versione-spunta', b).innerHTML = attiva ? ICONA.spunta : '';
    });
    pulsante.disabled = !pronto;
    pulsante.classList.toggle('in-arrivo', !pronto);
    $('strong', pulsante).textContent = pronto ? `${d.pulsante} ${v.nome}` : `${v.nome}: in arrivo`;
    $('small', pulsante).textContent = pronto
      ? [d.nota_pulsante, v.peso].filter(Boolean).join(' · ')
      : 'Il fascicolo è ancora sotto sigillo';
    $('[data-nome]').textContent = v.nome;
  }

  function scegli(p) {
    scelta = p;
    chiudiNotifica();
    aggiorna();
  }

  function scarica() {
    const v = d[scelta];
    if (!haLink(v.link)) return;
    window.location.href = String(v.link).trim();
    mostraNotifica();
  }

  let timerNotifica = 0;
  function mostraNotifica() {
    chiudiNotifica();
    const box = document.createElement('aside');
    box.className = 'notifica';
    box.setAttribute('role', 'status');
    box.innerHTML = `
      <span class="boom-mini" aria-hidden="true">ZIP!</span>
      <p>${esc(d.dopo_il_clic)}</p>
      <div class="notifica-azioni">
        <button type="button" class="link" data-aiuto>Apri la guida</button>
        <button type="button" class="tasto-tondo piccolo" data-chiudi-notifica aria-label="Chiudi">${ICONA.chiudi}</button>
      </div>`;
    document.body.appendChild(box);
    timerNotifica = setTimeout(chiudiNotifica, 9000);
  }
  function chiudiNotifica() {
    clearTimeout(timerNotifica);
    const box = $('.notifica');
    if (box) box.remove();
  }

  function scheda(id) {
    dialogo.querySelectorAll('[data-scheda]').forEach((b) => {
      const attiva = b.dataset.scheda === id;
      b.classList.toggle('attiva', attiva);
      b.setAttribute('aria-selected', attiva);
    });
    dialogo.querySelectorAll('[data-pannello]').forEach((p) => { p.hidden = p.dataset.pannello !== id; });
  }
  function apriAiuto() {
    chiudiNotifica();
    scheda(scelta);
    if (!dialogo.open) dialogo.showModal();
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (e.target === dialogo) { dialogo.close(); return; } // clic sullo sfondo scuro
    if (!t) return;
    if (t.matches('[data-versione]')) scegli(t.dataset.versione);
    else if (t.matches('[data-scarica]')) scarica();
    else if (t.matches('[data-aiuto]')) apriAiuto();
    else if (t.matches('[data-chiudi]')) dialogo.close();
    else if (t.matches('[data-scheda]')) scheda(t.dataset.scheda);
    else if (t.matches('[data-chiudi-notifica]')) chiudiNotifica();
    else if (t.matches('[data-registro-tutte]')) {
      const voci = document.querySelectorAll('.registro details');
      const apri = [...voci].some((x) => !x.open);
      voci.forEach((x) => { x.open = apri; });
      aggiornaTutte();
    }
    else if (t.matches('[data-copia]')) {
      navigator.clipboard && navigator.clipboard.writeText(guidaMac.comando).then(() => {
        t.innerHTML = `${ICONA.spunta} Copiato`;
        setTimeout(() => { t.innerHTML = `${ICONA.copia} Copia`; }, 2000);
      });
    }
  });

  // ← → cambiano versione, Invio scarica (come i tasti del gioco)
  document.addEventListener('keydown', (e) => {
    if (dialogo.open) return;
    const fuoco = document.activeElement;
    if (fuoco && fuoco !== document.body) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      scegli(scelta === 'mac' ? 'windows' : 'mac');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      scarica();
    }
  });

  // il pulsante dice "Apri tutte" o "Chiudi tutte" secondo come sono le versioni
  function aggiornaTutte() {
    const b = $('[data-registro-tutte]');
    if (!b) return;
    const tutteAperte = [...document.querySelectorAll('.registro details')].every((x) => x.open);
    b.textContent = tutteAperte ? 'Chiudi tutte' : 'Apri tutte';
  }
  document.querySelectorAll('.registro details').forEach((x) => x.addEventListener('toggle', aggiornaTutte));

  aggiorna();
  aggiornaTutte();
})();
