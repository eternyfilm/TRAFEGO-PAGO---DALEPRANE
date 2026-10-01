import { Link } from '../lib/router'
import { marca } from '../config/marca'
import { categorias, porCategoria, type Categoria } from '../config/produtos'
import { Logo } from './Logo'
import { Icone, IconeInstagram, IconeWhatsApp } from './Icones'
import { linkWhatsApp } from '../config/marca'
import { porSlug } from '../config/produtos'
import { moeda, pct, taxaAnual } from '../lib/financas'

export function Footer() {
  const ref = porSlug('financiamento-imobiliario')
  const cats: Categoria[] = ['financiamentos', 'consorcios', 'emprestimos']
  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape-grade">
          <div className="rodape-marca">
            <Logo claro />
            <p>{marca.assinatura}</p>
            <div className="rodape-redes">
              <a href={marca.redes.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <IconeInstagram />
              </a>
              <a href={linkWhatsApp(`Olá, ${marca.nome}!`)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <IconeWhatsApp tamanho={20} />
              </a>
            </div>
          </div>
          {cats.map((c) => (
            <div key={c}>
              <h4>{categorias[c].nome}</h4>
              {porCategoria(c).map((p) => (
                <Link key={p.slug} para={p.rota}>{p.nomeCurto}</Link>
              ))}
            </div>
          ))}
          <div>
            <h4>Conquistare</h4>
            <Link para="/sobre">Quem somos</Link>
            <Link para="/parceiros">Para parceiros</Link>
            <Link para="/blog">Blog</Link>
            <Link para="/ajuda">Central de ajuda</Link>
            <Link para="/contato">Fale com a gente</Link>
            <Link para="/entrar">Área do cliente</Link>
          </div>
          <div className="rodape-contato">
            <h4>Atendimento</h4>
            <a href={linkWhatsApp(`Olá, ${marca.nome}!`)} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp tamanho={16} /> {marca.contato.telefoneExibicao}
            </a>
            <a href={`mailto:${marca.contato.email}`}>
              <Icone nome="email" tamanho={16} /> {marca.contato.email}
            </a>
            <span><Icone nome="relogio" tamanho={16} /> {marca.contato.horario}</span>
            <a href={`tel:+${marca.contato.telefone}`}><Icone nome="telefone" tamanho={16} /> {marca.contato.telefoneExibicao} (fixo)</a>
            <span><Icone nome="local" tamanho={16} /> {marca.contato.endereco}</span>
          </div>
        </div>

        <div className="rodape-alerta">
          <Icone nome="alerta" tamanho={18} />
          <p>
            <strong>Atenção a golpes:</strong> a {marca.nome} nunca pede depósito, PIX ou pagamento antecipado para liberar
            crédito. Na dúvida, fale com a gente pelos canais oficiais desta página.
          </p>
        </div>

        <div className="rodape-legal">
          <p>{marca.legal.aviso}</p>
          {ref?.taxaMensal && ref.valorPadrao && ref.prazoPadrao && (
            <p>
              Exemplo de simulação: {ref.nome.toLowerCase()} de {moeda(ref.valorPadrao, true)} em {ref.prazoPadrao} meses,
              taxa de {pct(ref.taxaMensal)} a.m. ({pct(taxaAnual(ref.taxaMensal))} a.a.). Valores ilustrativos. Taxa, CET e
              condições finais dependem da análise de crédito e são apresentados na proposta antes da contratação.
            </p>
          )}
          <div className="rodape-base">
            <span>© {new Date().getFullYear()} {marca.legal.razaoSocial} · CNPJ {marca.legal.cnpj}</span>
            <span>
              <Link para="/privacidade">Privacidade</Link> · <Link para="/termos">Termos de uso</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
