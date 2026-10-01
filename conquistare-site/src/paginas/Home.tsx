import { categorias, porCategoria, porSlug, type Categoria } from '../config/produtos'
import { artigos, beneficios, depoimentos, faqGeral, numeros } from '../config/conteudo'
import { marca, linkWhatsApp } from '../config/marca'
import { Link } from '../lib/router'
import { moeda, parcelaConsorcio, parcelaPrice } from '../lib/financas'
import { Simulador } from '../ui/Simulador'
import { Acordeao, Bancos, Cabecalho, CardProduto, Cifrao, Secao } from '../ui/Comuns'
import { Icone, IconeWhatsApp } from '../ui/Icones'
import { CardArtigo } from './Blog'

export function Home() {
  const cats: Categoria[] = ['financiamentos', 'consorcios', 'emprestimos']
  const fin = porSlug('financiamento-imobiliario')
  const cons = porSlug('consorcio-imovel')

  // Comparativo ilustrativo com o mesmo valor de bem nos dois caminhos.
  const valorExemplo = 300_000
  const parcelaFin = fin ? parcelaPrice(valorExemplo, fin.taxaMensal ?? 0, 360) : 0
  const parcelaCons = cons ? parcelaConsorcio(valorExemplo, cons.taxaAdm ?? 0, 200) : 0

  return (
    <>
      {/* HERO */}
      <section className="hero hero--marca">
        <Cifrao className="hero-cifrao" />
        <div className="container hero-grade">
          <div className="hero-texto">
            <span className="selo selo--escuro"><span className="selo-ponto" /> Correspondente multibancos · Brasília/DF</span>
            <h1>
              Chegou a hora de <em>conquistar</em>!
            </h1>
            <p className="hero-sub">
              Financiamento imobiliário, consórcio e empréstimo com 7 bancos comparados pro seu perfil e aprovação do
              financiamento em até 1 hora.
            </p>
            <ul className="hero-provas">
              <li><Icone nome="relogio" tamanho={18} /> Aprovação do financiamento em até 1 hora</li>
              <li><Icone nome="balanca" tamanho={18} /> Caixa, BRB, Santander, Itaú, Bradesco, Poupex e Inter</li>
              <li><Icone nome="check" tamanho={18} /> Acompanhamento da simulação ao registro</li>
            </ul>
          </div>
          <div className="hero-sim">
            <Simulador />
          </div>
        </div>
      </section>

      {/* BANCOS */}
      <div className="faixa-bancos">
        <div className="container">
          <span>Trabalhamos com</span>
          <Bancos />
        </div>
      </div>

      {/* PRODUTOS */}
      <Secao id="produtos">
        <Cabecalho sobre="Nossas soluções" titulo="Sua solução financeira completa" texto="Do financiamento da casa própria ao consórcio do carro novo, com orientação especializada em cada etapa." />
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

      {/* APROVAÇÃO EM 1 HORA */}
      <Secao tom="escuro" className="secao--cifrao">
        <Cifrao className="secao-cifrao" />
        <div className="duas-colunas">
          <div>
            <Cabecalho
              sobre="Financiamento imobiliário"
              titulo={<>Aprovação em até <span className="destaque-verde">1 hora</span>. Acompanhamento até o fim.</>}
              texto="A gente não some depois da aprovação. Acompanhamos cada etapa até o recurso chegar no vendedor, com tranquilidade pra você e pros parceiros."
            />
            <Link para="/financiamento/imobiliario" className="btn btn--verde btn--lg">Simular financiamento</Link>
          </div>
          <ol className="linha-tempo">
            {(fin?.passos ?? []).map((s, i) => (
              <li key={s.titulo}>
                <span className="linha-tempo-n">{i + 1}</span>
                <div>
                  <strong>{s.titulo}</strong>
                  <p>{s.texto}</p>
                </div>
              </li>
            ))}
          </ol>
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

      {/* CONSÓRCIO x FINANCIAMENTO */}
      {fin && cons && (
        <Secao tom="creme">
          <Cabecalho
            sobre="Faça a conta"
            titulo="Financiar agora ou planejar sem juros?"
            texto={`O mesmo imóvel de ${moeda(valorExemplo)}, pelos dois caminhos. A gente simula os dois pra você decidir com números.`}
            centro
          />
          <div className="versus">
            <div className="versus-card">
              <span className="versus-tag">Financiamento</span>
              <h3>O imóvel agora</h3>
              <strong className="versus-valor">{moeda(parcelaFin)}<small>/mês</small></strong>
              <span className="versus-nota">em 360 meses, com juros a partir de {fin.taxaMensal?.toLocaleString('pt-BR')}% a.m.</span>
              <ul className="lista">
                <li><span className="lista-ic"><Icone nome="check" tamanho={16} /></span>Mora ou usa o imóvel logo após o registro</li>
                <li><span className="lista-ic"><Icone nome="check" tamanho={16} /></span>Aprovação em até 1 hora</li>
                <li><span className="lista-ic"><Icone nome="check" tamanho={16} /></span>Pode usar FGTS na entrada</li>
              </ul>
              <Link para="/simular?produto=financiamento-imobiliario" className="btn btn--primario btn--bloco">Simular financiamento</Link>
            </div>
            <div className="versus-card versus-card--verde">
              <span className="versus-tag">Consórcio</span>
              <h3>Sem juros, com planejamento</h3>
              <strong className="versus-valor">{moeda(parcelaCons)}<small>/mês</small></strong>
              <span className="versus-nota">em 200 meses, taxa de administração de {cons.taxaAdm}% no total</span>
              <ul className="lista">
                <li><span className="lista-ic"><Icone nome="check" tamanho={16} /></span>Zero juros</li>
                <li><span className="lista-ic"><Icone nome="check" tamanho={16} /></span>Contemplação por sorteio ou lance</li>
                <li><span className="lista-ic"><Icone nome="check" tamanho={16} /></span>Compra como pagador à vista</li>
              </ul>
              <Link para="/simular?produto=consorcio-imovel" className="btn btn--verde btn--bloco">Simular consórcio</Link>
            </div>
          </div>
          <p className="nota centro">Valores ilustrativos. Condições finais dependem de análise e da administradora ou banco.</p>
        </Secao>
      )}

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

      {/* DEPOIMENTOS */}
      <Secao>
        <Cabecalho sobre="Quem já conquistou" titulo="O que dizem os clientes" />
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
                  <small>{d.origem} · {d.produto}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Secao>

      {/* PARCEIROS */}
      <Secao>
        <div className="faixa-empresas">
          <Cifrao className="faixa-cifrao" />
          <div>
            <span className="sobretitulo">Imobiliárias e corretores</span>
            <h2>Seu cliente aprovado em até 1 hora. Você fecha mais negócios.</h2>
            <p>A gente cuida do crédito do seu cliente do início ao registro, e você foca em vender.</p>
          </div>
          <Link para="/parceiros" className="btn btn--claro btn--lg">Quero ser parceiro</Link>
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
        <Cifrao className="cta-cifrao" />
        <div className="container cta-final-in">
          <h2>Vamos conquistar o seu sonho?</h2>
          <div className="cta-final-botoes">
            <Link para="/simular" className="btn btn--verde btn--lg">Simular agora</Link>
            <a className="btn btn--claro-contorno btn--lg" href={linkWhatsApp(`Olá, ${marca.nome}! Quero falar com um consultor.`)} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp tamanho={20} /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
