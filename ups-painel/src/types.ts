// Tipos centrais do Painel de Execução da Nova UPS.

export type Dono = 'Kalleby' | 'Caio' | 'Ambos'

export type StatusTarefa = 'a-fazer' | 'fazendo' | 'travado' | 'feito'

export interface Tarefa {
  id: string
  titulo: string
  descricao: string
  dono: Dono
  faseId: string
  prazo: string | null // ISO date (yyyy-mm-dd), no fuso America/Sao_Paulo
  status: StatusTarefa
  notas: string
  criadaManualmente?: boolean
}

export interface Fase {
  id: string
  nome: string
  periodoLabel: string // ex: "25/09 a 27/09"
  inicio: string | null // ISO date
  fim: string | null // ISO date
  ordem: number
}

// Laboratório Daleprane, registros do funil.
export type GrupoFunil = 'linha-de-base' | 'teste' | 'controle'

export interface RegistroFunil {
  id: string
  grupo: GrupoFunil
  periodoLabel: string // ex: "28/09 a 04/10"
  leads: number
  atendidos5min: number
  qualificados: number
  visitas: number
  propostas: number
  vendas: number
  tempoMedioRespostaMin: number // minutos
  criadoEm: string // ISO datetime
}

// Comercial, pipeline do Diagnóstico.
export type EtapaProspect =
  | 'mapeado'
  | 'contatado'
  | 'reuniao'
  | 'proposta'
  | 'pago'
  | 'perdido'

export interface Prospect {
  id: string
  nome: string
  contato: string
  etapa: EtapaProspect
  valor: number // R$ (receita quando pago)
  notas: string
  criadoEm: string
}

// Estratégia.
export type StatusRisco = 'aberto' | 'tratado'

export interface Risco {
  id: string
  titulo: string
  descricao: string
  status: StatusRisco
}

export interface Decisao {
  id: string
  data: string // ISO date
  decisao: string
  motivo: string
  quem: string
}

export interface DegrauOferta {
  id: string
  numero: number
  titulo: string
  quando: string
  descricao: string
}

// Estado completo persistido.
export interface AppState {
  versao: number
  fases: Fase[]
  tarefas: Tarefa[]
  funil: RegistroFunil[]
  prospects: Prospect[]
  riscos: Risco[]
  decisoes: Decisao[]
  escada: DegrauOferta[]
}
