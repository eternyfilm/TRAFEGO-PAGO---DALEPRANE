import { useEffect, useState } from 'react'
import { Link, useRota } from '../lib/router'
import { categorias, porCategoria, type Categoria } from '../config/produtos'
import { Logo } from './Logo'
import { Icone } from './Icones'

const ordem: Categoria[] = ['financiamentos', 'consorcios', 'emprestimos']

export function Header() {
  const { path } = useRota()
  const [aberto, setAberto] = useState(false)
  const [menu, setMenu] = useState<Categoria | null>(null)
  const [rolou, setRolou] = useState(false)

  useEffect(() => {
    setAberto(false)
    setMenu(null)
  }, [path])

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
  }, [aberto])

  return (
    <header className={`topo ${rolou ? 'topo--rolou' : ''}`}>
      <div className="topo-in">
        <Link para="/" className="topo-logo">
          <Logo />
        </Link>

        <nav className="nav" aria-label="Principal">
          {ordem.map((c) => (
            <div key={c} className="nav-item" onMouseEnter={() => setMenu(c)} onMouseLeave={() => setMenu(null)}>
              <Link para={categorias[c].rota} className={`nav-link ${path.startsWith(categorias[c].rota) ? 'ativo' : ''}`}>
                {categorias[c].nome} <Icone nome="chevron" tamanho={16} />
              </Link>
              {menu === c && (
                <div className="mega">
                  {porCategoria(c).map((p) => (
                    <Link key={p.slug} para={p.rota} className="mega-item">
                      <span className="mega-ic">
                        <Icone nome={p.icone} />
                      </span>
                      <span>
                        <strong>{p.nomeCurto}</strong>
                        <small>{p.chamada}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link para="/parceiros" className="nav-link">Para parceiros</Link>
          <Link para="/ajuda" className="nav-link">Ajuda</Link>
        </nav>

        <div className="topo-acoes">
          <Link para="/entrar" className="btn btn--fantasma btn--sm esconde-mobile">Entrar</Link>
          <Link para="/simular" className="btn btn--primario btn--sm">Simular</Link>
          <button className="topo-menu" aria-label={aberto ? 'Fechar menu' : 'Abrir menu'} onClick={() => setAberto(!aberto)}>
            <Icone nome={aberto ? 'x' : 'menu'} />
          </button>
        </div>
      </div>

      {aberto && (
        <div className="gaveta">
          {ordem.map((c) => (
            <div key={c} className="gaveta-grupo">
              <Link para={categorias[c].rota} className="gaveta-titulo">{categorias[c].nome}</Link>
              {porCategoria(c).map((p) => (
                <Link key={p.slug} para={p.rota} className="gaveta-link">
                  <Icone nome={p.icone} tamanho={18} /> {p.nomeCurto}
                </Link>
              ))}
            </div>
          ))}
          <div className="gaveta-grupo">
            <Link para="/parceiros" className="gaveta-link">Para imobiliárias e corretores</Link>
            <Link para="/sobre" className="gaveta-link">Sobre a Conquistare</Link>
            <Link para="/blog" className="gaveta-link">Blog</Link>
            <Link para="/ajuda" className="gaveta-link">Central de ajuda</Link>
            <Link para="/entrar" className="gaveta-link">Área do cliente</Link>
          </div>
        </div>
      )}
    </header>
  )
}
