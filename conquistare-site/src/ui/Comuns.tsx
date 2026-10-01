import { useState, type ReactNode } from 'react'
import { marca, linkWhatsApp } from '../config/marca'
import { consentimento, definirConsentimento } from '../lib/rastreio'
import { Link } from '../lib/router'
import { Icone, IconeWhatsApp } from './Icones'
import type { Produto } from '../config/produtos'
import { destaqueTaxa } from '../lib/financas'

export function Acordeao({ itens }: { itens: { p: string; r: string }[] }) {
  const [aberto, setAberto] = useState<number | null>(0)
  return (
    <div className="acordeao">
      {itens.map((it, i) => (
        <div key={it.p} className={`acordeao-item ${aberto === i ? 'aberto' : ''}`}>
          <button onClick={() => setAberto(aberto === i ? null : i)} aria-expanded={aberto === i}>
            <span>{it.p}</span>
            <Icone nome="mais" tamanho={20} />
          </button>
          <div className="acordeao-corpo">
            <p>{it.r}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CardProduto({ p }: { p: Produto }) {
  return (
    <Link para={p.rota} className="card-produto">
      <span className="card-produto-ic">
        <Icone nome={p.icone} tamanho={26} />
      </span>
      <h3>{p.nome}</h3>
      <p>{p.chamada}</p>
      <div className="card-produto-pe">
        <span className="card-produto-taxa">
          <small>{destaqueTaxa(p).rotulo}</small>
          <strong>{destaqueTaxa(p).valor}</strong>
        </span>
        <span className="card-produto-seta"><Icone nome="seta" /></span>
      </div>
    </Link>
  )
}

export function Secao({ id, tom, children, className = '' }: { id?: string; tom?: 'claro' | 'escuro' | 'creme'; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`secao ${tom ? `secao--${tom}` : ''} ${className}`}>
      <div className="container">{children}</div>
    </section>
  )
}

export function Cabecalho({ sobre, titulo, texto, centro = false }: { sobre?: string; titulo: ReactNode; texto?: ReactNode; centro?: boolean }) {
  return (
    <div className={`cabecalho ${centro ? 'cabecalho--centro' : ''}`}>
      {sobre && <span className="sobretitulo">{sobre}</span>}
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
    </div>
  )
}

export function WhatsFlutuante() {
  return (
    <a
      className="whats-flutuante"
      href={linkWhatsApp(`Olá, ${marca.nome}! Quero falar com um especialista.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <IconeWhatsApp tamanho={28} />
    </a>
  )
}

export function FaixaRascunho() {
  if (!marca.rascunho) return null
  return (
    <div className="faixa-rascunho">
      Versão de rascunho: taxas e valores de simulação são ilustrativos e serão substituídos pelos dados dos bancos parceiros.
    </div>
  )
}

export function AvisoCookies() {
  const [visivel, setVisivel] = useState(() => consentimento() === null)
  if (!visivel) return null
  const decidir = (v: 'aceito' | 'recusado') => {
    definirConsentimento(v)
    setVisivel(false)
  }
  return (
    <div className="cookies" role="dialog" aria-label="Aviso de cookies">
      <p>
        Usamos cookies pra melhorar sua experiência e medir nossos anúncios. Veja a{' '}
        <Link para="/privacidade">política de privacidade</Link>.
      </p>
      <div>
        <button className="btn btn--fantasma btn--sm" onClick={() => decidir('recusado')}>Recusar</button>
        <button className="btn btn--primario btn--sm" onClick={() => decidir('aceito')}>Aceitar</button>
      </div>
    </div>
  )
}

// "Prazer, eu sou o Cadú": o mascote apresenta a Conquistare e puxa pro
// WhatsApp. Se a imagem ainda não estiver em public/marca, a seção segue só
// com o texto.
export function Cadu() {
  const [temImagem, setTemImagem] = useState(true)
  const { nome, imagem } = marca.mascote
  return (
    <div className={`cadu ${temImagem ? '' : 'cadu--sem-imagem'}`}>
      {temImagem && (
        <div className="cadu-figura">
          <img src={imagem} alt={`${nome}, mascote da ${marca.nome}`} onError={() => setTemImagem(false)} loading="lazy" />
        </div>
      )}
      <div className="cadu-fala">
        <span className="sobretitulo">Prazer!</span>
        <h2>Eu sou o {nome}.</h2>
        <div className="cadu-balao">
          <p>
            Me conta o que você quer conquistar: a casa própria, o carro novo ou aquele projeto parado. Eu comparo os 7 bancos
            parceiros e te mostro o caminho mais leve, seja financiamento, consórcio ou empréstimo.
          </p>
        </div>
        <div className="cadu-botoes">
          <a className="btn btn--whats btn--lg" href={linkWhatsApp(`Oi, ${nome}! Quero ajuda pra conquistar meu sonho.`)} target="_blank" rel="noopener noreferrer">
            <IconeWhatsApp tamanho={20} /> Falar com o {nome}
          </a>
          <Link para="/simular" className="btn btn--fantasma btn--lg">Simular sozinho</Link>
        </div>
      </div>
    </div>
  )
}

// O "$" vazado que a Conquistare usa como grafismo nas peças.
export function Cifrao({ className = '' }: { className?: string }) {
  return (
    <svg className={`cifrao ${className}`} viewBox="0 0 200 320" aria-hidden="true">
      <text x="100" y="262" textAnchor="middle">$</text>
    </svg>
  )
}

export function Bancos({ claro = false }: { claro?: boolean }) {
  return (
    <ul className={`bancos ${claro ? 'bancos--claro' : ''}`}>
      {marca.legal.parceiros.map((b) => <li key={b}>{b}</li>)}
    </ul>
  )
}

export function Lista({ itens, icone = 'check' }: { itens: readonly string[]; icone?: string }) {
  return (
    <ul className="lista">
      {itens.map((i) => (
        <li key={i}>
          <span className="lista-ic"><Icone nome={icone} tamanho={16} /></span>
          {i}
        </li>
      ))}
    </ul>
  )
}
