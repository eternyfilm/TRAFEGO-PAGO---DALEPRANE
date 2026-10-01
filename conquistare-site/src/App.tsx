import { useEffect, type ReactNode } from 'react'
import { useRota } from './lib/router'
import { iniciarRastreio, paginaVista } from './lib/rastreio'
import { marca } from './config/marca'
import { categorias, porRota, type Categoria as TCat } from './config/produtos'
import { artigos } from './config/conteudo'
import { Header } from './ui/Header'
import { Footer } from './ui/Footer'
import { AvisoCookies, FaixaRascunho, WhatsFlutuante } from './ui/Comuns'
import { Home } from './paginas/Home'
import { Categoria } from './paginas/Categoria'
import { Produto } from './paginas/Produto'
import { Obrigado, Simular } from './paginas/Simular'
import { Artigo, Blog } from './paginas/Blog'
import { Ajuda, Contato, Entrar, NaoEncontrada, Parceiros, Privacidade, Sobre, Termos } from './paginas/Institucional'

function resolver(path: string): { titulo: string; el: ReactNode } {
  const limpo = path.replace(/\/+$/, '') || '/'
  if (limpo === '/') return { titulo: `${marca.nomeCompleto} | ${marca.descritor}`, el: <Home /> }

  const cat = (Object.keys(categorias) as TCat[]).find((c) => categorias[c].rota === limpo)
  if (cat) return { titulo: `${categorias[cat].nome} | ${marca.nome}`, el: <Categoria c={cat} /> }

  const p = porRota(limpo)
  if (p) return { titulo: `${p.nome} | ${marca.nome}`, el: <Produto key={p.slug} p={p} /> }

  if (limpo.startsWith('/blog/')) {
    const slug = limpo.slice(6)
    const a = artigos.find((x) => x.slug === slug)
    return { titulo: `${a?.titulo ?? 'Blog'} | ${marca.nome}`, el: <Artigo slug={slug} /> }
  }

  const fixas: Record<string, [string, ReactNode]> = {
    '/simular': ['Simule seu crédito', <Simular />],
    '/obrigado': ['Recebemos sua solicitação', <Obrigado />],
    '/parceiros': ['Para imobiliárias e corretores', <Parceiros />],
    '/empresas': ['Para imobiliárias e corretores', <Parceiros />],
    '/sobre': ['Quem somos', <Sobre />],
    '/ajuda': ['Central de ajuda', <Ajuda />],
    '/contato': ['Fale com a gente', <Contato />],
    '/entrar': ['Área do cliente', <Entrar />],
    '/blog': ['Blog', <Blog />],
    '/privacidade': ['Política de privacidade', <Privacidade />],
    '/termos': ['Termos de uso', <Termos />],
  }
  const f = fixas[limpo]
  if (f) return { titulo: `${f[0]} | ${marca.nome}`, el: f[1] }
  return { titulo: `Página não encontrada | ${marca.nome}`, el: <NaoEncontrada /> }
}

export function App() {
  const { path, busca } = useRota()
  const { titulo, el } = resolver(path)

  useEffect(() => {
    iniciarRastreio()
  }, [])

  useEffect(() => {
    document.title = titulo
    paginaVista()
  }, [path, busca, titulo])

  return (
    <>
      <FaixaRascunho />
      <Header />
      <main key={path}>{el}</main>
      <Footer />
      <WhatsFlutuante />
      <AvisoCookies />
    </>
  )
}
