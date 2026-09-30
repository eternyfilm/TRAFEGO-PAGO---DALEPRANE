import { artigos, type Artigo as TArtigo } from '../config/conteudo'
import { Link } from '../lib/router'
import { Secao } from '../ui/Comuns'
import { Icone } from '../ui/Icones'
import { NaoEncontrada } from './Institucional'

function dataBR(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function CardArtigo({ a }: { a: TArtigo }) {
  return (
    <Link para={`/blog/${a.slug}`} className="card-artigo">
      <div className="card-artigo-capa" aria-hidden="true">
        <span>{a.categoria}</span>
      </div>
      <div className="card-artigo-corpo">
        <small>{a.categoria} · {a.leitura} de leitura</small>
        <h3>{a.titulo}</h3>
        <p>{a.resumo}</p>
      </div>
    </Link>
  )
}

export function Blog() {
  return (
    <>
      <section className="topo-pagina">
        <div className="container">
          <span className="sobretitulo">Blog Conquistare</span>
          <h1>Dinheiro sem mistério</h1>
          <p>Guias diretos sobre crédito, dívidas e planejamento, sem economês.</p>
        </div>
      </section>
      <Secao>
        <div className="grade-artigos">
          {artigos.map((a) => <CardArtigo key={a.slug} a={a} />)}
        </div>
      </Secao>
    </>
  )
}

export function Artigo({ slug }: { slug: string }) {
  const a = artigos.find((x) => x.slug === slug)
  if (!a) return <NaoEncontrada />
  const outros = artigos.filter((x) => x.slug !== slug).slice(0, 3)
  return (
    <>
      <article className="artigo container container--estreito">
        <Link para="/blog" className="link-voltar"><Icone nome="seta" tamanho={16} style={{ transform: 'rotate(180deg)' }} /> Blog</Link>
        <small className="artigo-meta">{a.categoria} · {dataBR(a.data)} · {a.leitura} de leitura</small>
        <h1>{a.titulo}</h1>
        <p className="artigo-lead">{a.resumo}</p>
        <div className="artigo-corpo">
          {agrupar(a.corpo).map((b, i) =>
            Array.isArray(b) ? (
              <ul key={i}>{b.map((li) => <li key={li}>{li}</li>)}</ul>
            ) : b.tipo === 'h2' ? (
              <h2 key={i}>{b.texto}</h2>
            ) : (
              <p key={i}>{b.texto}</p>
            ),
          )}
        </div>
        <div className="artigo-cta">
          <strong>Quer ver quanto você economizaria?</strong>
          <Link para="/simular" className="btn btn--primario">Simular agora</Link>
        </div>
      </article>
      <Secao tom="creme">
        <h2 className="titulo-sec">Continue lendo</h2>
        <div className="grade-artigos">{outros.map((o) => <CardArtigo key={o.slug} a={o} />)}</div>
      </Secao>
    </>
  )
}

// Junta itens de lista consecutivos num único <ul>.
function agrupar(corpo: TArtigo['corpo']) {
  const out: (TArtigo['corpo'][number] | string[])[] = []
  corpo.forEach((b) => {
    const ultimo = out[out.length - 1]
    if (b.tipo === 'li') {
      if (Array.isArray(ultimo)) ultimo.push(b.texto)
      else out.push([b.texto])
    } else out.push(b)
  })
  return out
}
