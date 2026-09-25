import type { AppState, Fase, Tarefa, Dono, RegistroFunil } from '../types'
import { hojeISO, dentroDoIntervalo } from '../lib/dates'

export function progressoGeral(tarefas: Tarefa[]): number {
  if (!tarefas.length) return 0
  const feitas = tarefas.filter((t) => t.status === 'feito').length
  return feitas / tarefas.length
}

export function progressoDaFase(tarefas: Tarefa[], faseId: string): number {
  const daFase = tarefas.filter((t) => t.faseId === faseId)
  if (!daFase.length) return 0
  return daFase.filter((t) => t.status === 'feito').length / daFase.length
}

export function tarefasDaFase(tarefas: Tarefa[], faseId: string): Tarefa[] {
  return tarefas.filter((t) => t.faseId === faseId)
}

// Fase cujo intervalo contém hoje. Se nenhuma contiver (entre fases ou fora do
// calendário), pega a próxima que ainda não terminou; senão a última.
export function faseAtual(fases: Fase[]): Fase {
  const hoje = hojeISO()
  const ordenadas = [...fases].sort((a, b) => a.ordem - b.ordem)
  const dentro = ordenadas.find((f) => dentroDoIntervalo(hoje, f.inicio, f.fim))
  if (dentro) return dentro
  const futura = ordenadas.find((f) => (f.fim ?? '') >= hoje)
  return futura ?? ordenadas[ordenadas.length - 1]
}

// Próximas N tarefas de um dono: não feitas, ordenadas por ordem de fase e prazo.
export function proximasDoDono(
  state: AppState,
  dono: Dono,
  n: number,
): Tarefa[] {
  const ordemFase = new Map(state.fases.map((f) => [f.id, f.ordem]))
  return state.tarefas
    .filter((t) => t.status !== 'feito')
    .filter((t) => t.dono === dono || t.dono === 'Ambos')
    .sort((a, b) => {
      const fa = ordemFase.get(a.faseId) ?? 99
      const fb = ordemFase.get(b.faseId) ?? 99
      if (fa !== fb) return fa - fb
      return (a.prazo ?? '9999').localeCompare(b.prazo ?? '9999')
    })
    .slice(0, n)
}

export function travadas(tarefas: Tarefa[]): Tarefa[] {
  return tarefas.filter((t) => t.status === 'travado')
}

export function nomeFase(fases: Fase[], faseId: string): string {
  return fases.find((f) => f.id === faseId)?.nome ?? faseId
}

// ---------- Funil ----------
export interface ConversoesFunil {
  atendimento: number // atendidos / leads
  qualificacao: number // qualificados / atendidos
  visita: number // visitas / qualificados
  proposta: number // propostas / visitas
  venda: number // vendas / propostas
  leadVisita: number // visitas / leads (métrica principal)
}

export function conversoes(r: RegistroFunil): ConversoesFunil {
  const div = (a: number, b: number) => (b > 0 ? a / b : 0)
  return {
    atendimento: div(r.atendidos5min, r.leads),
    qualificacao: div(r.qualificados, r.atendidos5min),
    visita: div(r.visitas, r.qualificados),
    proposta: div(r.propostas, r.visitas),
    venda: div(r.vendas, r.propostas),
    leadVisita: div(r.visitas, r.leads),
  }
}

// Consolida vários registros de um mesmo grupo em um só (soma as contagens,
// média ponderada do tempo de resposta pelo nº de leads).
export function consolidarGrupo(registros: RegistroFunil[]): RegistroFunil | null {
  if (!registros.length) return null
  const base: RegistroFunil = {
    id: `consolidado-${registros[0].grupo}`,
    grupo: registros[0].grupo,
    periodoLabel: 'consolidado',
    leads: 0,
    atendidos5min: 0,
    qualificados: 0,
    visitas: 0,
    propostas: 0,
    vendas: 0,
    tempoMedioRespostaMin: 0,
    criadoEm: registros[0].criadoEm,
  }
  let somaTempoPonderada = 0
  for (const r of registros) {
    base.leads += r.leads
    base.atendidos5min += r.atendidos5min
    base.qualificados += r.qualificados
    base.visitas += r.visitas
    base.propostas += r.propostas
    base.vendas += r.vendas
    somaTempoPonderada += r.tempoMedioRespostaMin * r.leads
  }
  base.tempoMedioRespostaMin = base.leads > 0 ? somaTempoPonderada / base.leads : 0
  return base
}

// Identifica a etapa de maior queda percentual (o vazamento).
export type EtapaId = 'atendimento' | 'qualificacao' | 'visita' | 'proposta' | 'venda'

export function maiorVazamento(c: ConversoesFunil): EtapaId {
  const etapas: [EtapaId, number][] = [
    ['atendimento', c.atendimento],
    ['qualificacao', c.qualificacao],
    ['visita', c.visita],
    ['proposta', c.proposta],
    ['venda', c.venda],
  ]
  // A etapa com menor taxa de conversão é onde mais se perde.
  return etapas.reduce((pior, atual) => (atual[1] < pior[1] ? atual : pior))[0]
}
