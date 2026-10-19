import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { parse, YAMLParseError } from 'yaml'

const SITO = new URL('./contenuti/sito.yml', import.meta.url)

// Legge contenuti/sito.yml. Se c'è un errore di scrittura lo spiega in italiano,
// con il numero di riga: su GitHub compare nel controllo "Deploy su GitHub Pages".
function leggiSito(testo: string) {
  try {
    return parse(testo)
  } catch (err) {
    if (err instanceof YAMLParseError) {
      const riga = err.linePos?.[0]?.line
      throw new Error(
        `\n\n✋ C'è un errore in contenuti/sito.yml${riga ? ` alla riga ${riga}` : ''}.\n` +
          `   Controlla gli spazi all'inizio della riga e, se il testo contiene ":" o "#",\n` +
          `   mettilo tra virgolette "…".\n   Dettaglio: ${err.message}\n`,
      )
    }
    throw err
  }
}

function contenuti(): Plugin {
  return {
    name: 'contenuti-del-sito',
    // import sito from '../contenuti/sito.yml'  →  oggetto già pronto
    transform(code, id) {
      if (!id.endsWith('.yml')) return null
      return { code: `export default ${JSON.stringify(leggiSito(code))}`, map: null }
    },
    // titolo e descrizione della pagina presi da sito.yml
    transformIndexHtml(html) {
      const sito = leggiSito(readFileSync(SITO, 'utf8')) ?? {}
      const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
      return html
        .replace('%TITOLO%', esc(sito.titolo_pagina || 'I Casi del Garage'))
        .replace(/%DESCRIZIONE%/g, esc(sito.descrizione))
    },
  }
}

export default defineConfig({
  plugins: [react(), contenuti()],
  base: './', // percorsi relativi: funziona su GitHub Pages anche in una sottocartella
  // Sul computer i pacchetti stanno nella cartella sopra ("Sito per Download Gioco Garage/node_modules"):
  // anche la cache di Vite va lì, così in "File per GitHub" restano solo i file del sito.
  cacheDir: existsSync(new URL('../node_modules', import.meta.url)) ? '../node_modules/.vite' : undefined,
})
