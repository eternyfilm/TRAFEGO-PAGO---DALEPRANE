import { categorias, porCategoria, type Categoria as TCat } from '../config/produtos'
import { CardProduto, Secao } from '../ui/Comuns'
import { Link } from '../lib/router'

export function Categoria({ c }: { c: TCat }) {
  const info = categorias[c]
  return (
    <>
      <section className="topo-pagina">
        <div className="container">
          <span className="sobretitulo">{info.nome}</span>
          <h1>{info.titulo}</h1>
          <p>{info.texto}</p>
          <Link para="/simular" className="btn btn--primario btn--lg">Simular agora</Link>
        </div>
      </section>
      <Secao>
        <div className="grade-produtos">
          {porCategoria(c).map((p) => <CardProduto key={p.slug} p={p} />)}
        </div>
      </Secao>
    </>
  )
}
