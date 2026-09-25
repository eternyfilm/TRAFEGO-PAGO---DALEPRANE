import type { AppState } from '../types'
import { seedState } from '../data/seed'

// Camada de dados isolada. As telas nunca falam direto com localStorage nem com
// nenhum backend. Elas só conhecem esta interface. Trocar local por Supabase
// depois é escrever outro adapter e trocar `storage` no fim do arquivo, sem
// tocar em nenhuma tela.

export interface StorageAdapter {
  carregar(): Promise<AppState>
  salvar(state: AppState): Promise<void>
}

const CHAVE = 'ups-painel:estado:v1'

// Faz merge do seed com o estado salvo, para que dados pré-carregados
// (fases, escada, riscos) apareçam mesmo em bases antigas, sem apagar o que o
// usuário já editou.
function normalizar(salvo: Partial<AppState> | null): AppState {
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

// Ponto único de troca. Para migrar pro Supabase, implemente
// SupabaseAdapter e troque a linha abaixo.
export const storage: StorageAdapter = new LocalStorageAdapter()

// Utilidades de export/import JSON usadas na Home.
export function exportarJSON(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importarJSON(texto: string): AppState {
  const parsed = JSON.parse(texto)
  return normalizar(parsed)
}
