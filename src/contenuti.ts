// Tutti i testi del sito arrivano da due file nella cartella contenuti/:
//   • sito.yml   → testi, link di download, guide, comandi, galleria
//   • NOVITA.md  → le novità di ogni versione (la prima in cima è quella attuale)
// Qui non c'è nessun testo da cambiare.
import sitoGrezzo from '../contenuti/sito.yml'
import novitaGrezze from '../contenuti/NOVITA.md?raw'

export type Piattaforma = 'mac' | 'windows'

interface Versione { nome: string; dettagli: string; peso: string; link: string }

export interface Sito {
  titolo: { etichetta: string; nome: string; sottotitolo: string; frase: string }
  battute: { scritta: string; testo: string; colore?: string }[]
  download: {
    titolo: string; sopra_titolo: string; pulsante: string; nota_pulsante: string
    mac: Versione; windows: Versione; dopo_il_clic: string
  }
  galleria: { titolo: string; immagini: { file: string; didascalia: string }[] }
  guida_mac: { avviso: string; passi: string[]; se_danneggiata: string; comando: string }
  guida_windows: { avviso: string; passi: string[] }
  comandi: { tasto: string | number; azione: string }[]
  note: string[]
  piede: { studio: string; frase: string }
}

// Se una parte manca in sito.yml il sito non si rompe: resta vuota.
const s = (sitoGrezzo ?? {}) as Partial<Sito>
const v = (x?: Partial<Versione>): Versione => ({ nome: '', dettagli: '', peso: '', link: '#', ...x })
export const sito: Sito = {
  titolo: { etichetta: 'I CASI', nome: 'DEL GARAGE', sottotitolo: '', frase: '', ...s.titolo },
  battute: s.battute ?? [],
  download: {
    titolo: '', sopra_titolo: '', pulsante: 'Scarica per', nota_pulsante: '', dopo_il_clic: '',
    ...s.download,
    mac: v(s.download?.mac), windows: v(s.download?.windows),
  },
  galleria: { titolo: '', immagini: [], ...s.galleria },
  guida_mac: { avviso: '', passi: [], se_danneggiata: '', comando: '', ...s.guida_mac },
  guida_windows: { avviso: '', passi: [], ...s.guida_windows },
  comandi: s.comandi ?? [],
  note: s.note ?? [],
  piede: { studio: 'Kannella Studio', frase: '', ...s.piede },
}

export const haLink = (link?: string) => !!link && link.trim() !== '' && link.trim() !== '#'

// ---------------------------------------------------------------------------
// NOVITA.md → elenco di versioni
// ---------------------------------------------------------------------------
export type Pezzo =
  | { tipo: 'frase'; html: string }
  | { tipo: 'titoletto'; html: string }
  | { tipo: 'elenco'; voci: string[] }

export interface VersioneNovita { numero: string; data: string; pezzi: Pezzo[] }

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// **grassetto**, *corsivo*, `codice`, [testo](link)
function inline(t: string) {
  return esc(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}

function leggiNovita(md: string): VersioneNovita[] {
  const testo = md.replace(/\r/g, '').replace(/<!--[\s\S]*?-->/g, '')
  const versioni: VersioneNovita[] = []
  let cur: VersioneNovita | null = null
  for (const riga of testo.split('\n')) {
    const r = riga.trim()
    const h2 = r.match(/^##\s+(.+)$/)
    if (h2 && !r.startsWith('###')) {
      // "0.0.2 · 25 ottobre 2026"  (vanno bene anche "—", "-" o "|" come separatore)
      const [numero, ...resto] = h2[1].split(/\s+[·—|-]\s+/)
      cur = { numero: numero.replace(/^v(ersione)?\s*/i, '').trim(), data: resto.join(' · ').trim(), pezzi: [] }
      versioni.push(cur)
      continue
    }
    if (!cur || !r || /^#\s/.test(r)) continue
    const h3 = r.match(/^###\s+(.+)$/)
    const voce = r.match(/^[-*+]\s+(.+)$/)
    const ultimo = cur.pezzi[cur.pezzi.length - 1]
    if (h3) cur.pezzi.push({ tipo: 'titoletto', html: inline(h3[1]) })
    else if (voce) {
      if (ultimo?.tipo === 'elenco') ultimo.voci.push(inline(voce[1]))
      else cur.pezzi.push({ tipo: 'elenco', voci: [inline(voce[1])] })
    } else if (ultimo?.tipo === 'frase') ultimo.html += ' ' + inline(r)
    else cur.pezzi.push({ tipo: 'frase', html: inline(r) })
  }
  return versioni
}

export const novita = leggiNovita(novitaGrezze)
export const versioneAttuale = novita[0]?.numero || ''
