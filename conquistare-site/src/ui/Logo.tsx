import { marca } from '../config/marca'

// Marca provisória: um cume (conquista) dentro de um selo. Substituída
// automaticamente pelo arquivo oficial quando marca.logoUrl for preenchido.
export function Logo({ claro = false }: { claro?: boolean }) {
  if (marca.logoUrl) return <img src={marca.logoUrl} alt={marca.nomeCompleto} className="logo-img" />
  return (
    <span className={`logo ${claro ? 'logo--claro' : ''}`} aria-label={marca.nomeCompleto}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" className="logo-selo" />
        <path d="M6 23 13.5 11l4 6 2.5-3.5L26 23z" className="logo-cume" />
        <circle cx="22.5" cy="9" r="2.2" className="logo-sol" />
      </svg>
      <span className="logo-nome">
        conquistare<span className="logo-cred">cred</span>
      </span>
    </span>
  )
}
