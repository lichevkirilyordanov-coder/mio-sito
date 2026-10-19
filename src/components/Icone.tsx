// Icone disegnate a mano, con il tratto spesso del gioco.

// Marchio di Kannella Studio: due stecche di cannella incrociate e una stellina
// (lo stesso della sigla del gioco, js/tf-splash.js).
export function LogoKannella({ className = '' }: { className?: string }) {
  const stecca = (angolo: number) => (
    <g className="k-stick" transform={`rotate(${angolo} 60 60)`}>
      <rect x="22" y="50" width="76" height="20" rx="10" />
      <path d="M32 54 L32 66 M46 54 L46 66 M60 54 L60 66 M74 54 L74 66 M88 54 L88 66" />
      <circle className="k-end" cx="98" cy="60" r="10" />
      <path className="k-swirl" d="M98 60 m-5 0 a5 5 0 1 1 5 5 a2.5 2.5 0 1 1 -2.5 -2.5" />
    </g>
  )
  return (
    <span className={`logo-kannella ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120">
        {stecca(-35)}
        {stecca(35)}
        <path className="k-star" d="M60 12 L64 24 L76 26 L66 33 L69 45 L60 38 L51 45 L54 33 L44 26 L56 24 Z" />
      </svg>
    </span>
  )
}

const tratto = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const IconaScarica = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...tratto}><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 20h16" /></svg>
)
export const IconaSpunta = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...tratto} strokeWidth={3}><path d="m5 12 4 4L19 6" /></svg>
)
export const IconaChiudi = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...tratto} strokeWidth={3}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const IconaLente = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...tratto}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
)
export const IconaMela = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.4-4zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z" />
  </svg>
)
export const IconaWindows = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M3 5.5 10.5 4.5v7H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.3z" />
  </svg>
)
export const IconaCopia = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...tratto}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
)
