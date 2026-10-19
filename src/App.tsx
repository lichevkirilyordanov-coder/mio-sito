import { useEffect, useState, type CSSProperties } from 'react'
import { sito, novita, versioneAttuale, haLink, type Piattaforma } from './contenuti'
import { Aiuto, type SchedaAiuto } from './components/Aiuto'
import { IconaChiudi, IconaLente, IconaMela, IconaScarica, IconaSpunta, IconaWindows, LogoKannella } from './components/Icone'

// colori dei fumetti (gli stessi dei personaggi nel gioco)
const COLORI: Record<string, string> = {
  giallo: '#ffe66d', rosa: '#ff8fc8', azzurro: '#7ee7ff', viola: '#b39cff', arancio: '#ffb347',
}

const PIATTAFORME: Piattaforma[] = ['windows', 'mac']

function sistemaDelVisitatore(): Piattaforma {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('windows') ? 'windows' : 'mac'
}

export default function App() {
  const [scelta, setScelta] = useState<Piattaforma>(sistemaDelVisitatore)
  const [partito, setPartito] = useState(false)
  const [aiuto, setAiuto] = useState<SchedaAiuto | null>(null)
  const [schedaAiuto, setSchedaAiuto] = useState<SchedaAiuto>('mac')

  const d = sito.download
  const corrente = d[scelta]
  const pronto = haLink(corrente.link)

  function apriAiuto(s: SchedaAiuto) {
    setSchedaAiuto(s)
    setAiuto(s)
  }

  function scarica() {
    if (!pronto) return
    window.location.href = corrente.link.trim()
    setPartito(true)
  }

  // ← → cambiano versione, Invio scarica (come i tasti del gioco)
  useEffect(() => {
    function tasto(e: KeyboardEvent) {
      if (aiuto) return
      const fuoco = document.activeElement
      if (fuoco && fuoco !== document.body) return
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        setScelta((p) => (p === 'mac' ? 'windows' : 'mac'))
        setPartito(false)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        scarica()
      }
    }
    window.addEventListener('keydown', tasto)
    return () => window.removeEventListener('keydown', tasto)
  })

  // la notifica sparisce da sola
  useEffect(() => {
    if (!partito) return
    const t = setTimeout(() => setPartito(false), 9000)
    return () => clearTimeout(t)
  }, [partito])

  const [ultima, ...vecchie] = novita

  return (
    <>
      <div className="scena" aria-hidden="true">
        <div className="scena-sfondo" />
        <div className="scena-pioggia" />
        <div className="scena-lampo" />
        <div className="scena-retino" />
      </div>

      <header className="barra">
        <a className="marchio" href="#" aria-label="I Casi del Garage">
          <span className="marchio-etichetta">{sito.titolo.etichetta}</span>
          <span className="marchio-nome">{sito.titolo.nome}</span>
        </a>
        <nav className="barra-destra">
          {versioneAttuale && (
            <a className="pillola" href="#novita">
              <i className="lucina" aria-hidden="true" /> Versione {versioneAttuale}
            </a>
          )}
          <button className="pillola chiara" type="button" onClick={() => apriAiuto(scelta)}>
            <IconaLente /> Aiuto
          </button>
        </nav>
      </header>

      <main>
        {/* ---------- In alto: titolo + scarica ---------- */}
        <section className="apertura">
          <div className="titolo">
            <span className="titolo-etichetta">{sito.titolo.etichetta}</span>
            <h1 className="titolo-nome" aria-label={sito.titolo.nome}>
              {/* parola per parola (vanno a capo intere), lettera per lettera (si accendono a scatti) */}
              {sito.titolo.nome.split(' ').map((parola, p, parole) => {
                const prima = parole.slice(0, p).join(' ').length + (p ? 1 : 0)
                return (
                  <span key={p} className="parola">
                    {parola.split('').map((c, j) => {
                      const i = prima + j
                      return <i key={j} style={{ '--d': `${(0.15 + i * 0.06 + (i % 3) * 0.05).toFixed(2)}s` } as CSSProperties}>{c}</i>
                    })}
                  </span>
                )
              })}
            </h1>
            {sito.titolo.sottotitolo && <p className="titolo-sotto">{sito.titolo.sottotitolo}</p>}

            {sito.battute.length > 0 && (
              <ul className="battute">
                {sito.battute.map((b, i) => (
                  <li key={i} style={{ '--c': COLORI[b.colore ?? ''] ?? b.colore ?? COLORI.giallo, '--i': i } as CSSProperties}>
                    <span className="boom">{b.scritta}</span>
                    <b>{b.testo}</b>
                  </li>
                ))}
              </ul>
            )}

            {sito.titolo.frase && <blockquote className="frase">“{sito.titolo.frase}”</blockquote>}
          </div>

          <aside className="fascicolo" aria-labelledby="scarica-titolo">
            <span className="nastro" aria-hidden="true" />
            <span className="timbro" aria-hidden="true">Gratis</span>
            {d.sopra_titolo && <p className="occhiello">{d.sopra_titolo}</p>}
            <h2 id="scarica-titolo">{d.titolo}</h2>

            <div className="versioni" role="radiogroup" aria-label="Sistema operativo">
              {PIATTAFORME.map((p) => {
                const info = d[p]
                const attiva = scelta === p
                return (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={attiva}
                    className={`versione ${attiva ? 'attiva' : ''}`}
                    onClick={() => { setScelta(p); setPartito(false) }}
                  >
                    <span className="versione-icona">{p === 'mac' ? <IconaMela /> : <IconaWindows />}</span>
                    <span className="versione-testo">
                      <strong>{info.nome}</strong>
                      <small>{info.dettagli}</small>
                    </span>
                    <span className="versione-spunta">{attiva && <IconaSpunta />}</span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className={`pulsante-giallo grande ${pronto ? '' : 'in-arrivo'}`}
              onClick={scarica}
              disabled={!pronto}
            >
              <span className="pulsante-icona"><IconaScarica /></span>
              <span className="pulsante-testo">
                <strong>{pronto ? `${d.pulsante} ${corrente.nome}` : `${corrente.nome}: in arrivo`}</strong>
                <small>
                  {pronto
                    ? [d.nota_pulsante, corrente.peso].filter(Boolean).join(' · ')
                    : 'Il fascicolo è ancora sotto sigillo'}
                </small>
              </span>
            </button>

            <p className="fascicolo-nota">
              Prima volta? Leggi{' '}
              <button type="button" className="link" onClick={() => apriAiuto(scelta)}>
                come aprire il gioco su {corrente.nome}
              </button>
              .
            </p>
          </aside>
        </section>

        {/* ---------- Novità (da contenuti/NOVITA.md) ---------- */}
        {ultima && (
          <section className="sezione" id="novita" aria-labelledby="novita-titolo">
            <h2 className="sezione-titolo" id="novita-titolo"><span>Novità</span></h2>

            <article className="vignetta novita-ultima">
              <span className="boom-nuovo" aria-hidden="true">NUOVO!</span>
              <header className="novita-testa">
                <strong>Versione {ultima.numero}</strong>
                {ultima.data && <time>{ultima.data}</time>}
              </header>
              <Pezzi pezzi={ultima.pezzi} />
            </article>

            {vecchie.length > 0 && (
              <details className="archivio">
                <summary>Versioni precedenti ({vecchie.length})</summary>
                {vecchie.map((v) => (
                  <article className="vignetta novita-vecchia" key={v.numero + v.data}>
                    <header className="novita-testa">
                      <strong>Versione {v.numero}</strong>
                      {v.data && <time>{v.data}</time>}
                    </header>
                    <Pezzi pezzi={v.pezzi} />
                  </article>
                ))}
              </details>
            )}
          </section>
        )}

        {/* ---------- Galleria ---------- */}
        {sito.galleria.immagini.length > 0 && (
          <section className="sezione" aria-labelledby="galleria-titolo">
            <h2 className="sezione-titolo" id="galleria-titolo"><span>{sito.galleria.titolo}</span></h2>
            <ul className="galleria">
              {sito.galleria.immagini.map((im, i) => (
                <li key={im.file} style={{ '--i': i } as CSSProperties}>
                  <figure className="polaroid">
                    <img src={`./immagini/${im.file}`} alt={im.didascalia} loading="lazy" />
                    <figcaption>{im.didascalia}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="piede">
        <div className="piede-studio">
          <LogoKannella />
          <div>
            <strong>{sito.piede.studio}</strong>
            {sito.piede.frase && <span>{sito.piede.frase}</span>}
          </div>
        </div>
        <div className="piede-tasti" aria-hidden="true">
          <kbd>←</kbd><kbd>→</kbd> scegli <span className="punto">·</span> <kbd>Invio</kbd> scarica
        </div>
        <span className="piede-copy">© {new Date().getFullYear()} {sito.piede.studio}</span>
      </footer>

      <Aiuto
        aperto={aiuto !== null}
        scheda={schedaAiuto}
        onScheda={setSchedaAiuto}
        onChiudi={() => setAiuto(null)}
      />

      {partito && (
        <aside className="notifica" role="status">
          <span className="boom-mini" aria-hidden="true">ZIP!</span>
          <p>{d.dopo_il_clic}</p>
          <div className="notifica-azioni">
            <button type="button" className="link" onClick={() => { setPartito(false); apriAiuto(scelta) }}>
              Apri la guida
            </button>
            <button type="button" className="tasto-tondo piccolo" onClick={() => setPartito(false)} aria-label="Chiudi">
              <IconaChiudi />
            </button>
          </div>
        </aside>
      )}
    </>
  )
}

function Pezzi({ pezzi }: { pezzi: (typeof novita)[number]['pezzi'] }) {
  return (
    <div className="novita-corpo">
      {pezzi.map((p, i) =>
        p.tipo === 'frase' ? <p key={i} dangerouslySetInnerHTML={{ __html: p.html }} />
        : p.tipo === 'titoletto' ? <h3 key={i} dangerouslySetInnerHTML={{ __html: p.html }} />
        : <ul key={i}>{p.voci.map((v, j) => <li key={j} dangerouslySetInnerHTML={{ __html: v }} />)}</ul>,
      )}
    </div>
  )
}
