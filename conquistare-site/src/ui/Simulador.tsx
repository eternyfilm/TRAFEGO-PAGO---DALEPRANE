import { useMemo, useState } from 'react'
import { produtosSimulaveis, type Produto } from '../config/produtos'
import { destaqueTaxa, moeda, prazoTexto, simular } from '../lib/financas'
import { navegar } from '../lib/router'
import { evento } from '../lib/rastreio'
import { Icone } from './Icones'

// Escala logarítmica no slider: valores baixos e altos ficam igualmente
// fáceis de escolher mesmo com faixa de R$ 50 mil a R$ 3 milhões.
function paraSlider(v: number, min: number, max: number) {
  return (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min))
}
function doSlider(t: number, min: number, max: number) {
  const bruto = Math.exp(Math.log(min) + t * (Math.log(max) - Math.log(min)))
  const passo = bruto < 10_000 ? 500 : bruto < 100_000 ? 1_000 : bruto < 1_000_000 ? 5_000 : 25_000
  return Math.min(max, Math.max(min, Math.round(bruto / passo) * passo))
}

export function Simulador({ fixo, compacto = false }: { fixo?: Produto; compacto?: boolean }) {
  const ordem = ['financiamentos', 'consorcios', 'emprestimos']
  const lista = fixo ? [fixo] : [...produtosSimulaveis].sort((a, b) => ordem.indexOf(a.categoria) - ordem.indexOf(b.categoria))
  const [slug, setSlug] = useState(lista[0].slug)
  const p = lista.find((x) => x.slug === slug) ?? lista[0]
  const [valores, setValores] = useState<Record<string, number>>({})
  const [prazos, setPrazos] = useState<Record<string, number>>({})
  const valor = valores[p.slug] ?? p.valorPadrao
  const prazo = prazos[p.slug] ?? p.prazoPadrao
  const r = useMemo(() => simular(p, valor, prazo, {}), [p, valor, prazo])
  const taxa = destaqueTaxa(p)

  function continuar() {
    evento('SimulacaoIniciada', { produto: p.slug, valor, prazo })
    navegar(`/simular?produto=${p.slug}&valor=${valor}&prazo=${prazo}`)
  }

  return (
    <div className={`simulador ${compacto ? 'simulador--compacto' : ''}`}>
      {!fixo && (
        <div className="simulador-abas" role="tablist">
          {lista.map((x) => (
            <button key={x.slug} role="tab" aria-selected={x.slug === p.slug} className={x.slug === p.slug ? 'ativa' : ''} onClick={() => setSlug(x.slug)}>
              <Icone nome={x.icone} tamanho={18} />
              {x.nomeCurto}
            </button>
          ))}
        </div>
      )}

      <div className="simulador-corpo">
        <label className="simulador-rotulo" htmlFor={`valor-${p.slug}`}>{p.rotuloValor ?? 'De quanto você precisa?'}</label>
        <div className="simulador-valor">{moeda(valor)}</div>
        <input
          id={`valor-${p.slug}`}
          type="range"
          min={0}
          max={1000}
          value={Math.round(paraSlider(valor, p.valorMin, p.valorMax) * 1000)}
          onChange={(e) => setValores({ ...valores, [p.slug]: doSlider(Number(e.target.value) / 1000, p.valorMin, p.valorMax) })}
          style={{ ['--pos' as string]: `${paraSlider(valor, p.valorMin, p.valorMax) * 100}%` }}
        />
        <div className="simulador-limites">
          <span>{moeda(p.valorMin)}</span>
          <span>{moeda(p.valorMax)}</span>
        </div>

        <span className="simulador-rotulo">Em quantas parcelas?</span>
        <div className="simulador-prazos">
          {p.prazos.map((m) => (
            <button key={m} className={m === prazo ? 'ativo' : ''} onClick={() => setPrazos({ ...prazos, [p.slug]: m })}>
              {m}x
            </button>
          ))}
        </div>

        <div className="simulador-resultado">
          <div>
            <small>Parcela estimada</small>
            <strong>{moeda(r.parcela, true)}</strong>
            <span>{prazoTexto(prazo)}</span>
          </div>
          <div className="simulador-taxa">
            <small>{taxa.rotulo}</small>
            <strong>{taxa.valor}</strong>
            <span>{taxa.detalhe}</span>
          </div>
        </div>

        <button className="btn btn--primario btn--bloco btn--lg" onClick={continuar}>
          Continuar simulação <Icone nome="seta" tamanho={20} />
        </button>
        <p className="simulador-nota">Simular não afeta seu score. Valores ilustrativos, sujeitos a análise.</p>
      </div>
    </div>
  )
}
