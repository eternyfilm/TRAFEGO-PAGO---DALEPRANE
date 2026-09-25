import { useRota, irPara, type Rota } from './state/router'
import { useStore } from './state/store'
import { Home } from './telas/Home'
import { Roadmap } from './telas/Roadmap'
import { Funil } from './telas/Funil'
import { Comercial } from './telas/Comercial'
import { Estrategia } from './telas/Estrategia'
import {
  IconeHome,
  IconeRoadmap,
  IconeFunil,
  IconeComercial,
  IconeEstrategia,
} from './ui/icons'

const NAV: { rota: Rota; label: string; Icone: (p: { className?: string }) => JSX.Element }[] = [
  { rota: 'home', label: 'Visão geral', Icone: IconeHome },
  { rota: 'roadmap', label: 'Roadmap', Icone: IconeRoadmap },
  { rota: 'funil', label: 'Funil', Icone: IconeFunil },
  { rota: 'comercial', label: 'Comercial', Icone: IconeComercial },
  { rota: 'estrategia', label: 'Estratégia', Icone: IconeEstrategia },
]

export function App() {
  const rota = useRota()
  const { pronto } = useStore()

  return (
    <div className="app">
      <header className="topo">
        <div className="topo-inner">
          <a
            className="marca"
            href="#/home"
            onClick={(e) => {
              e.preventDefault()
              irPara('home')
            }}
          >
            UPS<b>·</b>DIGITAL <small>Painel de Execução</small>
          </a>
          <nav className="nav">
            {NAV.map((n) => (
              <a
                key={n.rota}
                href={`#/${n.rota}`}
                className={rota === n.rota ? 'ativo' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  irPara(n.rota)
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="conteudo">{pronto ? <Tela rota={rota} /> : <Carregando />}</main>

      <nav className="nav-mobile">
        {NAV.map((n) => (
          <a
            key={n.rota}
            href={`#/${n.rota}`}
            className={rota === n.rota ? 'ativo' : ''}
            onClick={(e) => {
              e.preventDefault()
              irPara(n.rota)
            }}
          >
            <n.Icone />
            {n.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

function Tela({ rota }: { rota: Rota }) {
  switch (rota) {
    case 'roadmap':
      return <Roadmap />
    case 'funil':
      return <Funil />
    case 'comercial':
      return <Comercial />
    case 'estrategia':
      return <Estrategia />
    default:
      return <Home />
  }
}

function Carregando() {
  return <p className="texto-3">Carregando painel...</p>
}
