import type { Produto as TProduto } from '../config/produtos'
import { categorias, porCategoria } from '../config/produtos'
import { faqGeral } from '../config/conteudo'
import { marca, linkWhatsApp } from '../config/marca'
import { Link } from '../lib/router'
import { moeda, pct } from '../lib/financas'
import { Simulador } from '../ui/Simulador'
import { Acordeao, Cabecalho, CardProduto, Lista, Secao } from '../ui/Comuns'
import { Icone, IconeWhatsApp } from '../ui/Icones'
import { FormCotacao } from './Simular'

export function Produto({ p }: { p: TProduto }) {
  const relacionados = porCategoria(p.categoria).filter((x) => x.slug !== p.slug).slice(0, 3)
  return (
    <>
      <section className="hero hero--produto">
        <div className="container hero-grade">
          <div className="hero-texto">
            <nav className="migalha" aria-label="Caminho">
              <Link para="/">Início</Link> / <Link para={categorias[p.categoria].rota}>{categorias[p.categoria].nome}</Link> / <span>{p.nomeCurto}</span>
            </nav>
            <span className="selo"><Icone nome={p.icone} tamanho={16} /> {p.nome}</span>
            <h1>{p.titulo}</h1>
            <p className="hero-sub">{p.subtitulo}</p>
            {p.simulavel && (
              <div className="ficha">
                <div><small>Taxa a partir de</small><strong>{pct(p.taxaMensal!)} a.m.</strong></div>
                <div><small>Valor</small><strong>{moeda(p.valorMin!)} a {moeda(p.valorMax!)}</strong></div>
                <div><small>Prazo</small><strong>até {Math.max(...p.prazos!)} meses</strong></div>
              </div>
            )}
          </div>
          <div className="hero-sim">
            {p.simulavel ? <Simulador fixo={p} /> : <FormCotacao p={p} />}
          </div>
        </div>
      </section>

      <Secao>
        <Cabecalho sobre="Vantagens" titulo={`Por que escolher ${p.nomeCurto.toLowerCase()}`} />
        <div className="grade-beneficios">
          {p.destaques.map((d, i) => (
            <div key={d.titulo} className="beneficio">
              <span className="beneficio-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </div>
          ))}
        </div>
      </Secao>

      <Secao tom="creme">
        <div className="duas-colunas">
          <div>
            <Cabecalho sobre="Pra quem é" titulo="Faz sentido pra você se..." />
            <Lista itens={p.paraQuem} />
          </div>
          <div className="caixa">
            <h3><Icone nome="documento" /> Documentos que você vai precisar</h3>
            <Lista itens={p.documentos} icone="documento" />
            <p className="nota">A lista final pode variar conforme o banco parceiro e o seu perfil.</p>
          </div>
        </div>
      </Secao>

      <Secao>
        <Cabecalho sobre="Passo a passo" titulo="Como funciona" centro />
        <ol className="passos">
          {p.passos.map((s, i) => (
            <li key={s.titulo} className="passo">
              <span className="passo-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao tom="creme">
        <div className="duas-colunas duas-colunas--faq">
          <Cabecalho sobre="Dúvidas" titulo={`Perguntas sobre ${p.nomeCurto.toLowerCase()}`} />
          <Acordeao itens={[...p.faq, ...faqGeral.slice(0, 2)]} />
        </div>
      </Secao>

      {relacionados.length > 0 && (
        <Secao>
          <h2 className="titulo-sec">Veja também</h2>
          <div className="grade-produtos">{relacionados.map((r) => <CardProduto key={r.slug} p={r} />)}</div>
        </Secao>
      )}

      <section className="cta-final">
        <div className="container cta-final-in">
          <h2>{p.simulavel ? 'Veja sua parcela em menos de 2 minutos.' : 'Receba sua cotação sem compromisso.'}</h2>
          <div className="cta-final-botoes">
            <Link para={`/simular?produto=${p.slug}`} className="btn btn--dourado btn--lg">{p.simulavel ? 'Simular agora' : 'Pedir cotação'}</Link>
            <a className="btn btn--claro-contorno btn--lg" href={linkWhatsApp(`Olá, ${marca.nome}! Quero saber mais sobre ${p.nome}.`)} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp tamanho={20} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
