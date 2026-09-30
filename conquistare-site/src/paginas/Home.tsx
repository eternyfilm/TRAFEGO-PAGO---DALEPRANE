import { categorias, porCategoria, type Categoria } from '../config/produtos'
import { artigos, beneficios, comparativoTaxas, depoimentos, faqGeral, numeros } from '../config/conteudo'
import { marca, linkWhatsApp } from '../config/marca'
import { Link } from '../lib/router'
import { pct } from '../lib/financas'
import { Simulador } from '../ui/Simulador'
import { Acordeao, Cabecalho, CardProduto, Secao } from '../ui/Comuns'
import { Icone, IconeWhatsApp } from '../ui/Icones'
import { CardArtigo } from './Blog'

export function Home() {
  const cats: Categoria[] = ['emprestimos', 'financiamentos', 'seguros']
  const maiorTaxa = Math.max(...comparativoTaxas.map((c) => c.taxa))

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grade">
          <div className="hero-texto">
            <span className="selo"><span className="selo-ponto" /> Crédito com garantia e consignado</span>
            <h1>
              Crédito pra <em>conquistar</em> o que importa.
            </h1>
            <p className="hero-sub">
              A menor taxa que der pro seu perfil, comparada entre vários bancos. Cada número explicado antes de você
              assinar, e zero taxa antecipada.
            </p>
            <ul className="hero-provas">
              <li><Icone nome="check" tamanho={18} /> Simulação grátis, sem afetar o score</li>
              <li><Icone nome="check" tamanho={18} /> Especialista humano do começo ao fim</li>
              <li><Icone nome="check" tamanho={18} /> Resposta em até 24h úteis</li>
            </ul>
          </div>
          <div className="hero-sim">
            <div className="hero-flutua hero-flutua--a" aria-hidden="true">
              <span className="hero-flutua-ic"><Icone nome="check" tamanho={16} /></span>
              <span><small>Proposta aprovada</small><strong>R$ 180.000</strong></span>
            </div>
            <Simulador />
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <div className="numeros">
        <div className="container numeros-grade">
          {numeros.map((n) => (
            <div key={n.rotulo}>
              <strong>{n.valor}</strong>
              <span>{n.rotulo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUTOS */}
      <Secao id="produtos">
        <Cabecalho sobre="Soluções" titulo="Uma solução pra cada conquista" texto="Do crédito que organiza as contas ao financiamento da casa própria." />
        {cats.map((c) => (
          <div key={c} className="bloco-cat">
            <div className="bloco-cat-topo">
              <h3>{categorias[c].nome}</h3>
              <Link para={categorias[c].rota} className="link-seta">Ver todos <Icone nome="seta" tamanho={16} /></Link>
            </div>
            <div className="grade-produtos">
              {porCategoria(c).map((p) => <CardProduto key={p.slug} p={p} />)}
            </div>
          </div>
        ))}
      </Secao>

      {/* COMPARATIVO */}
      <Secao tom="escuro">
        <div className="duas-colunas">
          <Cabecalho
            sobre="Faça a conta"
            titulo="O mesmo dinheiro pode custar 10 vezes menos"
            texto="Quem paga cartão e cheque especial está financiando o banco. Com garantia ou consignado, a taxa despenca e a parcela volta a caber na vida."
          />
          <div className="comparativo">
            {comparativoTaxas.map((c) => (
              <div key={c.rotulo} className={`comparativo-linha ${c.destaque ? 'destaque' : ''}`}>
                <div className="comparativo-rotulo">
                  <span>{c.rotulo}</span>
                  <strong>{pct(c.taxa, c.taxa < 2 ? 2 : 1)} a.m.</strong>
                </div>
                <div className="comparativo-trilho">
                  <div className="comparativo-barra" style={{ width: `${Math.max(4, (c.taxa / maiorTaxa) * 100)}%` }} />
                </div>
              </div>
            ))}
            <p className="nota">Taxas médias aproximadas de mercado (referência: Banco Central). A taxa Conquistare é "a partir de" e depende de análise.</p>
          </div>
        </div>
      </Secao>

      {/* BENEFÍCIOS */}
      <Secao>
        <Cabecalho sobre="Por que a Conquistare" titulo="Crédito é decisão séria. A gente trata assim." centro />
        <div className="grade-beneficios">
          {beneficios.map((b) => (
            <div key={b.titulo} className="beneficio">
              <span className="beneficio-ic"><Icone nome={b.icone} tamanho={24} /></span>
              <h3>{b.titulo}</h3>
              <p>{b.texto}</p>
            </div>
          ))}
        </div>
      </Secao>

      {/* COMO FUNCIONA */}
      <Secao tom="creme" id="como-funciona">
        <Cabecalho sobre="Como funciona" titulo="Do primeiro clique ao dinheiro na conta" centro />
        <ol className="passos">
          {[
            ['Simule', 'Escolha o tipo de crédito, o valor e o prazo. Leva menos de 2 minutos.'],
            ['Converse com um especialista', 'Ele entende seu momento e leva seu perfil aos bancos parceiros.'],
            ['Compare e decida', 'Você recebe taxa, CET e parcela final. Sem pressão.'],
            ['Receba', 'Contrato assinado, dinheiro direto na sua conta.'],
          ].map(([t, x], i) => (
            <li key={t} className="passo">
              <span className="passo-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{x}</p>
            </li>
          ))}
        </ol>
        <div className="centro">
          <Link para="/simular" className="btn btn--primario btn--lg">Começar minha simulação</Link>
        </div>
      </Secao>

      {/* DEPOIMENTOS */}
      <Secao>
        <Cabecalho sobre="Quem já conquistou" titulo="Histórias de quem saiu do aperto" />
        <div className="depoimentos">
          {depoimentos.map((d) => (
            <figure key={d.nome} className="depoimento">
              <div className="estrelas" aria-label="5 estrelas">
                {Array.from({ length: 5 }).map((_, i) => <Icone key={i} nome="estrela" tamanho={16} />)}
              </div>
              <blockquote>"{d.texto}"</blockquote>
              <figcaption>
                <span className="avatar">{d.nome.charAt(0)}</span>
                <span>
                  <strong>{d.nome}</strong>
                  <small>{d.produto} · {d.cidade}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Secao>

      {/* EMPRESAS */}
      <Secao>
        <div className="faixa-empresas">
          <div>
            <span className="sobretitulo">Para empresas</span>
            <h2>Ofereça crédito consignado como benefício aos seus colaboradores</h2>
            <p>Custo zero pra empresa, taxa menor pro time e menos gente endividada perdendo o foco no trabalho.</p>
          </div>
          <Link para="/empresas" className="btn btn--claro btn--lg">Conhecer o programa</Link>
        </div>
      </Secao>

      {/* BLOG */}
      <Secao tom="creme">
        <div className="bloco-cat-topo">
          <Cabecalho sobre="Blog" titulo="Dinheiro sem mistério" />
          <Link para="/blog" className="link-seta">Ver todos os artigos <Icone nome="seta" tamanho={16} /></Link>
        </div>
        <div className="grade-artigos">
          {artigos.slice(0, 3).map((a) => <CardArtigo key={a.slug} a={a} />)}
        </div>
      </Secao>

      {/* FAQ */}
      <Secao>
        <div className="duas-colunas duas-colunas--faq">
          <Cabecalho
            sobre="Dúvidas"
            titulo="Perguntas frequentes"
            texto={<>Não achou o que procurava? <Link para="/ajuda">Visite a central de ajuda</Link> ou fale com a gente.</>}
          />
          <Acordeao itens={faqGeral} />
        </div>
      </Secao>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="container cta-final-in">
          <h2>Sua próxima conquista começa com uma simulação.</h2>
          <div className="cta-final-botoes">
            <Link para="/simular" className="btn btn--dourado btn--lg">Simular agora</Link>
            <a className="btn btn--claro-contorno btn--lg" href={linkWhatsApp(`Olá, ${marca.nome}! Quero falar com um especialista.`)} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp tamanho={20} /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
