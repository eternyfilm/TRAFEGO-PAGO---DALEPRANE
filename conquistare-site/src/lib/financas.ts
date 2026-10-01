import type { Produto } from '../config/produtos'

// Parcela pela tabela Price. taxa em % ao mês.
export function parcelaPrice(valor: number, taxaMensalPct: number, meses: number): number {
  const i = taxaMensalPct / 100
  if (i === 0) return valor / meses
  return (valor * i) / (1 - Math.pow(1 + i, -meses))
}

export function taxaAnual(taxaMensalPct: number): number {
  return (Math.pow(1 + taxaMensalPct / 100, 12) - 1) * 100
}

export interface ResultadoSimulacao {
  parcela: number
  total: number
  juros: number
  taxaAnual: number
  valorMaximo?: number // limite pela garantia ou margem, quando dá pra calcular
  alerta?: string
}

// Arredonda pra baixo num passo "redondo", pra sugerir valores que cabem de fato.
function arredondaBaixo(v: number) {
  const passo = v < 20_000 ? 100 : 1_000
  return Math.floor(v / passo) * passo
}

// Consórcio: carta + taxa de administração, divididas pelo prazo, sem juros.
// (Fundo de reserva e seguro variam por administradora e ficam de fora.)
export function parcelaConsorcio(carta: number, taxaAdmPct: number, meses: number): number {
  return (carta * (1 + taxaAdmPct / 100)) / meses
}

// Texto curto de "preço" de cada produto, usado em cards, simulador e ficha.
export function destaqueTaxa(p: Produto): { rotulo: string; valor: string; detalhe: string } {
  if (p.modalidade === 'consorcio') {
    return { rotulo: 'Sem juros', valor: `taxa adm. ${pct(p.taxaAdm ?? 0, 0)}`, detalhe: 'total no prazo' }
  }
  const t = p.taxaMensal ?? 0
  return { rotulo: 'Taxa a partir de', valor: `${pct(t)} a.m.`, detalhe: `${pct(taxaAnual(t))} a.a.` }
}

export function simular(p: Produto, valor: number, prazo: number, extras: Record<string, string>): ResultadoSimulacao {
  const taxa = p.modalidade === 'consorcio' ? 0 : p.taxaMensal ?? 0
  const parcela = p.modalidade === 'consorcio' ? parcelaConsorcio(valor, p.taxaAdm ?? 0, prazo) : parcelaPrice(valor, taxa, prazo)
  const total = parcela * prazo
  const r: ResultadoSimulacao = { parcela, total, juros: total - valor, taxaAnual: taxaAnual(taxa) }

  if (p.limite) {
    const base = paraNumero(extras[p.limite.campo] ?? '')
    if (base > 0) {
      if (p.limite.tipo === 'percentualDoBem') {
        r.valorMaximo = arredondaBaixo(base * p.limite.percentual)
        if (valor > r.valorMaximo) {
          r.alerta = `Com esse bem, o crédito vai até ${moeda(r.valorMaximo)} (${Math.round(p.limite.percentual * 100)}% do valor).`
        }
      } else {
        const parcelaMax = base * p.limite.percentual
        // valor máximo cuja parcela cabe na margem
        const i = taxa / 100
        r.valorMaximo = arredondaBaixo(i === 0 ? parcelaMax * prazo : (parcelaMax * (1 - Math.pow(1 + i, -prazo))) / i)
        if (parcela > parcelaMax) {
          r.alerta = `A parcela passa de ${Math.round(p.limite.percentual * 100)}% da renda. Com esse prazo, o valor vai até ${moeda(r.valorMaximo)}.`
        }
      }
    }
  }
  return r
}

const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const fmtMoedaCent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function moeda(v: number, centavos = false): string {
  return (centavos ? fmtMoedaCent : fmtMoeda).format(v)
}

export function pct(v: number, casas = 2): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }) + '%'
}

export function paraNumero(s: string): number {
  const d = s.replace(/\D/g, '')
  return d ? Number(d) : 0
}

export function prazoTexto(meses: number): string {
  if (meses % 12 === 0 && meses >= 24) return `${meses} meses (${meses / 12} anos)`
  return `${meses} meses`
}
