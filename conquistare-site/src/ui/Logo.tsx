import { marca } from '../config/marca'

// Enquanto o arquivo oficial do logo não chega, mostra o nome no peso e nas
// cores da marca, sem inventar símbolo. Com marca.logoUrl preenchido, usa o
// arquivo oficial (public/).
export function Logo({ claro = false }: { claro?: boolean }) {
  if (marca.logoUrl) return <img src={marca.logoUrl} alt={marca.nomeCompleto} className="logo-img" />
  return (
    <span className={`logo ${claro ? 'logo--claro' : ''}`} aria-label={marca.nomeCompleto}>
      <span className="logo-nome">conquistare</span>
      <span className="logo-desc">{marca.descritor}</span>
    </span>
  )
}
