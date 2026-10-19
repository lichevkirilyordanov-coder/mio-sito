import { useEffect, useRef, useState } from 'react'
import { sito } from '../contenuti'
import { IconaChiudi, IconaCopia, IconaSpunta } from './Icone'

export type SchedaAiuto = 'mac' | 'windows' | 'comandi' | 'note'

const SCHEDE: { id: SchedaAiuto; nome: string }[] = [
  { id: 'mac', nome: 'Mac' },
  { id: 'windows', nome: 'Windows' },
  { id: 'comandi', nome: 'Comandi' },
  { id: 'note', nome: 'Note' },
]

interface Props {
  aperto: boolean
  scheda: SchedaAiuto
  onScheda: (s: SchedaAiuto) => void
  onChiudi: () => void
}

// Finestra "Aiuto" a fumetto: come aprire il gioco, i comandi e le note.
export function Aiuto({ aperto, scheda, onScheda, onChiudi }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [copiato, setCopiato] = useState(false)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (aperto && !d.open) d.showModal()
    if (!aperto && d.open) d.close()
  }, [aperto])

  function copia() {
    navigator.clipboard?.writeText(sito.guida_mac.comando).then(() => {
      setCopiato(true)
      setTimeout(() => setCopiato(false), 2000)
    })
  }

  const { guida_mac: mac, guida_windows: win } = sito

  return (
    <dialog
      ref={ref}
      className="aiuto"
      aria-labelledby="aiuto-titolo"
      onClose={onChiudi}
      // clic sullo sfondo scuro = chiudi
      onClick={(e) => { if (e.target === e.currentTarget) onChiudi() }}
    >
      <div className="aiuto-foglio">
        <header className="aiuto-testa">
          <h2 id="aiuto-titolo">Aiuto</h2>
          <button className="tasto-tondo" type="button" onClick={onChiudi} aria-label="Chiudi">
            <IconaChiudi />
          </button>
        </header>

        <div className="aiuto-schede" role="tablist">
          {SCHEDE.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={scheda === t.id}
              className={scheda === t.id ? 'attiva' : ''}
              onClick={() => onScheda(t.id)}
            >
              {t.nome}
            </button>
          ))}
        </div>

        <div className="aiuto-corpo" role="tabpanel">
          {scheda === 'mac' && (
            <>
              {mac.avviso && <p className="avviso">{mac.avviso}</p>}
              <ol className="passi">{mac.passi.map((p, i) => <li key={i}>{p}</li>)}</ol>
              {mac.comando && (
                <div className="riquadro-comando">
                  <p>{mac.se_danneggiata}:</p>
                  <div className="comando">
                    <code>{mac.comando}</code>
                    <button type="button" onClick={copia}>
                      {copiato ? <IconaSpunta /> : <IconaCopia />}
                      {copiato ? 'Copiato' : 'Copia'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {scheda === 'windows' && (
            <>
              {win.avviso && <p className="avviso azzurro">{win.avviso}</p>}
              <ol className="passi">{win.passi.map((p, i) => <li key={i}>{p}</li>)}</ol>
            </>
          )}

          {scheda === 'comandi' && (
            <ul className="comandi">
              {sito.comandi.map((c, i) => (
                <li key={i}>
                  <span className="tasti">
                    {String(c.tasto).split(/\s*\/\s*/).map((k) => <kbd key={k}>{k}</kbd>)}
                  </span>
                  <span>{c.azione}</span>
                </li>
              ))}
            </ul>
          )}

          {scheda === 'note' && (
            <div className="note">{sito.note.map((n, i) => <p key={i}>{n}</p>)}</div>
          )}
        </div>

        <footer className="aiuto-piede">
          <button className="pulsante-giallo piccolo" type="button" onClick={onChiudi}>Ho capito</button>
        </footer>
      </div>
    </dialog>
  )
}
