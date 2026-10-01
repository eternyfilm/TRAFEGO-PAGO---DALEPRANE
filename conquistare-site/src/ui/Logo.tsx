import { marca } from '../config/marca'

// Logo empilhado oficial ("con / quis$ / tare"). `claro` usa a versão branca,
// pra fundos roxos (rodapé, faixas escuras).
export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <img
      src={claro ? marca.logos.branco : marca.logos.roxo}
      alt={`${marca.nomeCompleto}, ${marca.descritor}`}
      className={`logo-img ${claro ? 'logo-img--claro' : ''}`}
    />
  )
}
