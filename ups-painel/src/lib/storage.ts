import type { AppState } from '../types'
import { seedState } from '../data/seed'
import { getSupabase, temSupabase, TABELA, LINHA_ID } from './supabase'

// Camada de dados isolada. As telas nunca falam direto com localStorage nem com
// nenhum backend. Elas só conhecem esta interface. Trocar local por Supabase é
// escolher outro adapter no fim do arquivo, sem tocar em nenhuma tela.

export interface StorageAdapter {
  carregar(): Promise<AppState>
  salvar(state: AppState): Promise<void>
  // Opcional: notifica quando o estado muda em outro dispositivo (realtime).
  // Retorna uma função pra cancelar a assinatura. Adapters sem sync não
  // implementam.
  assinar?(aoMudar: (state: AppState) => void): () => void
  // Modo do adapter, pra interface avisar se está sincronizado ou local.
  readonly sincronizado: boolean
}

const CHAVE = 'ups-painel:estado:v1'

// Faz merge do seed com o estado salvo, para que dados pré-carregados
// (fases, escada, riscos) apareçam mesmo em bases antigas, sem apagar o que o
// usuário já editou.
export function normalizar(salvo: Partial<AppState> | null): AppState {
  if (!salvo) return structuredClone(seedState)
  return {
    versao: salvo.versao ?? seedState.versao,
    fases: salvo.fases?.length ? salvo.fases : structuredClone(seedState.fases),
    tarefas: salvo.tarefas ?? structuredClone(seedState.tarefas),
    funil: salvo.funil ?? [],
    prospects: salvo.prospects ?? [],
    riscos: salvo.riscos?.length ? salvo.riscos : structuredClone(seedState.riscos),
    decisoes: salvo.decisoes ?? [],
    escada: salvo.escada?.length ? salvo.escada : structuredClone(seedState.escada),
  }
}

export class LocalStorageAdapter implements StorageAdapter {
  readonly sincronizado = false

  async carregar(): Promise<AppState> {
    try {
      const bruto = localStorage.getItem(CHAVE)
      if (!bruto) return structuredClone(seedState)
      return normalizar(JSON.parse(bruto))
    } catch {
      return structuredClone(seedState)
    }
  }

  async salvar(state: AppState): Promise<void> {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(state))
    } catch {
      // Cota estourada ou storage bloqueado (aba anônima). O painel segue
      // funcionando em memória; só não persiste.
    }
  }
}

// Sincroniza o estado inteiro numa única linha (modelo blob, last-write-wins).
// Realtime via canal do Postgres: quando o Kalleby marca algo, chega aqui.
export class SupabaseAdapter implements StorageAdapter {
  readonly sincronizado = true

  async carregar(): Promise<AppState> {
    const sb = getSupabase()
    if (!sb) return structuredClone(seedState)
    const { data, error } = await sb
      .from(TABELA)
      .select('data')
      .eq('id', LINHA_ID)
      .maybeSingle()
    if (error) {
      console.warn('Supabase carregar falhou, usando local/seed:', error.message)
      return new LocalStorageAdapter().carregar()
    }
    if (!data) {
      // Primeira vez: semeia a linha com o estado inicial.
      const inicial = structuredClone(seedState)
      await this.salvar(inicial)
      return inicial
    }
    return normalizar(data.data as Partial<AppState>)
  }

  async salvar(state: AppState): Promise<void> {
    const sb = getSupabase()
    if (!sb) return
    const { error } = await sb
      .from(TABELA)
      .upsert({ id: LINHA_ID, data: state, atualizado_em: new Date().toISOString() })
    if (error) console.warn('Supabase salvar falhou:', error.message)
    // Guarda uma cópia local como cache/offline de leitura.
    try {
      localStorage.setItem(CHAVE, JSON.stringify(state))
    } catch {
      /* ignora */
    }
  }

  assinar(aoMudar: (state: AppState) => void): () => void {
    const sb = getSupabase()
    if (!sb) return () => {}
    const canal = sb
      .channel('painel-estado')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABELA, filter: `id=eq.${LINHA_ID}` },
        (payload) => {
          const nova = (payload.new as { data?: Partial<AppState> } | null)?.data
          if (nova) aoMudar(normalizar(nova))
        },
      )
      .subscribe()
    return () => {
      sb.removeChannel(canal)
    }
  }
}

// Ponto único de troca: Supabase quando há env configurado, senão local.
export const storage: StorageAdapter = temSupabase
  ? new SupabaseAdapter()
  : new LocalStorageAdapter()

// Utilidades de export/import JSON usadas na Home.
export function exportarJSON(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importarJSON(texto: string): AppState {
  const parsed = JSON.parse(texto)
  return normalizar(parsed)
}
