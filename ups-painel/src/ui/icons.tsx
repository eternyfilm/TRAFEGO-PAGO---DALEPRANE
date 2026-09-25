// Ícones de linha simples para a navegação mobile. Herdam currentColor.

interface P {
  className?: string
}

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconeHome = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
)

export const IconeRoadmap = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 6h16M4 12h16M4 18h10" />
    <circle cx="19" cy="18" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)

export const IconeFunil = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z" />
  </svg>
)

export const IconeComercial = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="4" width="5" height="16" rx="1" />
    <rect x="10" y="4" width="5" height="11" rx="1" />
    <rect x="17" y="4" width="4" height="7" rx="1" />
  </svg>
)

export const IconeEstrategia = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <circle cx="12" cy="12" r="4" />
  </svg>
)
