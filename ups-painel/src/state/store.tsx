import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type {
  AppState,
  Tarefa,
  RegistroFunil,
  Prospect,
  Risco,
  Decisao,
} from '../types'
import { storage } from '../lib/storage'
import { seedState } from '../data/seed'

type Acao =
  | { tipo: 'hidratar'; state: AppState }
  | { tipo: 'substituir'; state: AppState }
  | { tipo: 'tarefa/adicionar'; tarefa: Tarefa }
  | { tipo: 'tarefa/atualizar'; tarefa: Tarefa }
  | { tipo: 'tarefa/remover'; id: string }
  | { tipo: 'funil/adicionar'; registro: RegistroFunil }
  | { tipo: 'funil/remover'; id: string }
  | { tipo: 'prospect/adicionar'; prospect: Prospect }
  | { tipo: 'prospect/atualizar'; prospect: Prospect }
  | { tipo: 'prospect/remover'; id: string }
  | { tipo: 'risco/atualizar'; risco: Risco }
  | { tipo: 'decisao/adicionar'; decisao: Decisao }
  | { tipo: 'decisao/remover'; id: string }

function reducer(state: AppState, acao: Acao): AppState {
  switch (acao.tipo) {
    case 'hidratar':
    case 'substituir':
      return acao.state
    case 'tarefa/adicionar':
      return { ...state, tarefas: [...state.tarefas, acao.tarefa] }
    case 'tarefa/atualizar':
      return {
        ...state,
        tarefas: state.tarefas.map((t) => (t.id === acao.tarefa.id ? acao.tarefa : t)),
      }
    case 'tarefa/remover':
      return { ...state, tarefas: state.tarefas.filter((t) => t.id !== acao.id) }
    case 'funil/adicionar':
      return { ...state, funil: [...state.funil, acao.registro] }
    case 'funil/remover':
      return { ...state, funil: state.funil.filter((r) => r.id !== acao.id) }
    case 'prospect/adicionar':
      return { ...state, prospects: [...state.prospects, acao.prospect] }
    case 'prospect/atualizar':
      return {
        ...state,
        prospects: state.prospects.map((p) =>
          p.id === acao.prospect.id ? acao.prospect : p,
        ),
      }
    case 'prospect/remover':
      return { ...state, prospects: state.prospects.filter((p) => p.id !== acao.id) }
    case 'risco/atualizar':
      return {
        ...state,
        riscos: state.riscos.map((r) => (r.id === acao.risco.id ? acao.risco : r)),
      }
    case 'decisao/adicionar':
      return { ...state, decisoes: [acao.decisao, ...state.decisoes] }
    case 'decisao/remover':
      return { ...state, decisoes: state.decisoes.filter((d) => d.id !== acao.id) }
    default:
      return state
  }
}

interface Ctx {
  state: AppState
  pronto: boolean
  sincronizado: boolean
  dispatch: React.Dispatch<Acao>
}

const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, seedState)
  const prontoRef = useRef(false)
  const [pronto, setPronto] = useReducerBool()
  // Última versão serializada que já está sincronizada (salva por nós ou
  // recebida do realtime). Serve de guarda contra loop: não re-salvamos o que
  // acabou de chegar, nem re-aplicamos o que acabou de sair.
  const ultimoRef = useRef<string>('')

  // Hidrata do storage uma vez e, se o adapter suportar, assina o realtime.
  useEffect(() => {
    let vivo = true
    storage.carregar().then((s) => {
      if (!vivo) return
      ultimoRef.current = JSON.stringify(s)
      dispatch({ tipo: 'hidratar', state: s })
      prontoRef.current = true
      setPronto(true)
    })

    let cancelar: (() => void) | undefined
    if (storage.assinar) {
      cancelar = storage.assinar((remoto) => {
        const s = JSON.stringify(remoto)
        // Ignora eco da nossa própria escrita.
        if (s === ultimoRef.current) return
        ultimoRef.current = s
        dispatch({ tipo: 'substituir', state: remoto })
      })
    }

    return () => {
      vivo = false
      cancelar?.()
    }
  }, [setPronto])

  // Persiste a cada mudança, só depois de hidratar (evita sobrescrever com seed).
  // Debounce curto pra agrupar rajadas (ex: digitar em nota) numa escrita só.
  useEffect(() => {
    if (!prontoRef.current) return
    const s = JSON.stringify(state)
    // Nada mudou de fato (ex: estado veio do realtime): não re-salva.
    if (s === ultimoRef.current) return
    const t = setTimeout(() => {
      ultimoRef.current = s
      storage.salvar(state)
    }, 500)
    return () => clearTimeout(t)
  }, [state])

  return (
    <StoreContext.Provider value={{ state, pronto, sincronizado: storage.sincronizado, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

// Pequeno hook de boolean para não trazer useState junto do useReducer.
function useReducerBool(): [boolean, (v: boolean) => void] {
  const [v, d] = useReducer((_: boolean, n: boolean) => n, false)
  return [v, d]
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore fora do StoreProvider')
  return ctx
}
