import { useState, type ReactNode } from 'react'
import { marca, linkWhatsApp } from '../config/marca'
import { consentimento, definirConsentimento } from '../lib/rastreio'
import { Link } from '../lib/router'
import { Icone, IconeWhatsApp } from './Icones'
import type { Produto } from '../config/produtos'
import { pct } from '../lib/financas'

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
        {p.taxaMensal ? (
          <span className="card-produto-taxa">
            <small>a partir de</small>
            <strong>{pct(p.taxaMensal)} a.m.</strong>
          </span>
        ) : (
          <span className="card-produto-taxa"><strong>{p.taxaRotulo}</strong></span>
        )}
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
      Versão de rascunho: taxas, números e depoimentos são ilustrativos e serão substituídos pelos dados reais.
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
