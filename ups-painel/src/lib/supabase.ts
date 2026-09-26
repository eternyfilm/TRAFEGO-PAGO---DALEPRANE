import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Config via variáveis de ambiente do Vite. Sem elas, o painel roda 100% local
// (localStorage) e nada quebra. Com elas, liga o modo sincronizado.
const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const temSupabase = Boolean(URL && ANON)

// Uma única linha guarda o estado inteiro do painel (modelo blob), igual ao
// localStorage. Simples, last-write-wins, suficiente para dois fundadores.
export const TABELA = 'painel_estado'
export const LINHA_ID = 'singleton'

let cliente: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!temSupabase) return null
  if (!cliente) cliente = createClient(URL!, ANON!)
  return cliente
}
