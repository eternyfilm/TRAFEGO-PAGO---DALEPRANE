import { useMemo, useState } from 'react'
import { useStore } from '../state/store'
import { StatusPill, DonoPill, LABEL_STATUS } from '../ui/Pills'
import { Modal } from '../ui/Modal'
import { formatarBR } from '../lib/dates'
import { progressoDaFase } from '../state/selectors'
import { novoId } from '../lib/id'
import type { Dono, StatusTarefa, Tarefa } from '../types'

const DONOS: Dono[] = ['Kalleby', 'Caio', 'Ambos']
const STATUSES: StatusTarefa[] = ['a-fazer', 'fazendo', 'travado', 'feito']

type Filtro = Dono | 'Todos'

export function Roadmap() {
  const { state, dispatch } = useStore()
  const [filtro, setFiltro] = useState<Filtro>('Todos')
  const [editando, setEditando] = useState<Tarefa | null>(null)
  const [criando, setCriando] = useState(false)

  const fasesOrdenadas = useMemo(
    () => [...state.fases].sort((a, b) => a.ordem - b.ordem),
    [state.fases],
  )

  const tarefasVisiveis = (faseId: string) =>
    state.tarefas.filter(
      (t) => t.faseId === faseId && (filtro === 'Todos' || t.dono === filtro),
    )

  function marcarFeito(t: Tarefa, e: React.MouseEvent) {
    e.stopPropagation()
    const novo: StatusTarefa = t.status === 'feito' ? 'a-fazer' : 'feito'
    dispatch({ tipo: 'tarefa/atualizar', tarefa: { ...t, status: novo } })
  }

  return (
    <div>
      <div className="tela-head">
        <div className="olho">Plano de execução</div>
        <h1>Roadmap</h1>
        <p>
          Linha do tempo da Fase 0 até janeiro. Clique numa tarefa para editar status, dono,
          prazo e notas.
        </p>
      </div>

      <div className="entre wrap mb" style={{ gap: 12 }}>
        <div className="flex wrap" style={{ gap: 6 }}>
          {(['Todos', ...DONOS] as Filtro[]).map((f) => (
            <button
              key={f}
              className={`btn pequeno ${filtro === f ? 'ouro' : 'ghost'}`}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="btn ouro pequeno" onClick={() => setCriando(true)}>
          + Nova tarefa
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {fasesOrdenadas.map((fase) => {
          const tarefas = tarefasVisiveis(fase.id)
          const p = progressoDaFase(state.tarefas, fase.id)
          return (
            <section key={fase.id}>
              <div
                className="entre"
                style={{
                  borderLeft: '2px solid var(--ouro)',
                  paddingLeft: 14,
                  marginBottom: 14,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 26 }}>{fase.nome}</h2>
                  <span className="texto-3" style={{ fontSize: 13 }}>
                    {fase.periodoLabel}
                  </span>
                </div>
                <span className="texto-3">{Math.round(p * 100)}%</span>
              </div>

              {tarefas.length === 0 ? (
                <p className="vazio" style={{ paddingLeft: 16 }}>
                  Nenhuma tarefa {filtro !== 'Todos' ? `de ${filtro} ` : ''}nesta fase.
                </p>
              ) : (
                <div className="grid tres">
                  {tarefas.map((t) => (
                    <article
                      key={t.id}
                      className="card"
                      onClick={() => setEditando(t)}
                      style={{ cursor: 'pointer', padding: 18 }}
                    >
                      <div className="entre mb" style={{ gap: 8 }}>
                        <DonoPill dono={t.dono} />
                        <button
                          className="btn ghost pequeno"
                          onClick={(e) => marcarFeito(t, e)}
                          title={t.status === 'feito' ? 'Reabrir' : 'Marcar como feito'}
                          style={
                            t.status === 'feito'
                              ? { color: 'var(--st-feito)', borderColor: 'var(--st-feito)' }
                              : undefined
                          }
                        >
                          {t.status === 'feito' ? '✓ feito' : 'marcar feito'}
                        </button>
                      </div>
                      <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15.5, lineHeight: 1.3 }}>
                        {t.titulo}
                      </h3>
                      <p className="texto-3" style={{ fontSize: 13, margin: '8px 0 14px' }}>
                        {t.descricao}
                      </p>
                      <div className="entre">
                        <StatusPill status={t.status} />
                        <span className="texto-3" style={{ fontSize: 12.5 }}>
                          {formatarBR(t.prazo)}
                        </span>
                      </div>
                      {t.notas && (
                        <p
                          className="texto-3"
                          style={{
                            fontSize: 12.5,
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: '1px solid var(--linha-suave)',
                            fontStyle: 'italic',
                          }}
                        >
                          {t.notas}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {editando && (
        <TarefaModal
          tarefa={editando}
          aoFechar={() => setEditando(null)}
          aoSalvar={(t) => {
            dispatch({ tipo: 'tarefa/atualizar', tarefa: t })
            setEditando(null)
          }}
          aoExcluir={(id) => {
            if (confirm('Excluir esta tarefa?')) {
              dispatch({ tipo: 'tarefa/remover', id })
              setEditando(null)
            }
          }}
        />
      )}

      {criando && (
        <TarefaModal
          tarefa={{
            id: novoId('tarefa'),
            titulo: '',
            descricao: '',
            dono: 'Ambos',
            faseId: fasesOrdenadas[0].id,
            prazo: fasesOrdenadas[0].fim,
            status: 'a-fazer',
            notas: '',
            criadaManualmente: true,
          }}
          novo
          aoFechar={() => setCriando(false)}
          aoSalvar={(t) => {
            if (!t.titulo.trim()) {
              alert('Dá um título pra tarefa.')
              return
            }
            dispatch({ tipo: 'tarefa/adicionar', tarefa: t })
            setCriando(false)
          }}
        />
      )}
    </div>
  )
}

interface ModalProps {
  tarefa: Tarefa
  novo?: boolean
  aoFechar: () => void
  aoSalvar: (t: Tarefa) => void
  aoExcluir?: (id: string) => void
}

function TarefaModal({ tarefa, novo, aoFechar, aoSalvar, aoExcluir }: ModalProps) {
  const { state } = useStore()
  const [rascunho, setRascunho] = useState<Tarefa>(tarefa)
  const set = (patch: Partial<Tarefa>) => setRascunho((r) => ({ ...r, ...patch }))

  return (
    <Modal titulo={novo ? 'Nova tarefa' : 'Editar tarefa'} aberto aoFechar={aoFechar}>
      <div className="linha-form">
        <label className="campo">Título</label>
        <input
          value={rascunho.titulo}
          onChange={(e) => set({ titulo: e.target.value })}
          placeholder="O que precisa ser feito"
          autoFocus
        />
      </div>

      <div className="linha-form">
        <label className="campo">Descrição</label>
        <textarea
          value={rascunho.descricao}
          onChange={(e) => set({ descricao: e.target.value })}
          rows={2}
        />
      </div>

      <div className="grid dois" style={{ gap: 14, marginBottom: 14 }}>
        <div>
          <label className="campo">Dono</label>
          <select value={rascunho.dono} onChange={(e) => set({ dono: e.target.value as Dono })}>
            {DONOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="campo">Status</label>
          <select
            value={rascunho.status}
            onChange={(e) => set({ status: e.target.value as StatusTarefa })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {LABEL_STATUS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid dois" style={{ gap: 14, marginBottom: 14 }}>
        <div>
          <label className="campo">Fase</label>
          <select
            value={rascunho.faseId}
            onChange={(e) => set({ faseId: e.target.value })}
          >
            {[...state.fases]
              .sort((a, b) => a.ordem - b.ordem)
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="campo">Prazo</label>
          <input
            type="date"
            value={rascunho.prazo ?? ''}
            onChange={(e) => set({ prazo: e.target.value || null })}
          />
        </div>
      </div>

      <div className="linha-form">
        <label className="campo">Notas</label>
        <textarea
          value={rascunho.notas}
          onChange={(e) => set({ notas: e.target.value })}
          placeholder="Contexto, links, decisões"
          rows={3}
        />
      </div>

      <div className="modal-acoes">
        {aoExcluir ? (
          <button className="btn ghost perigo pequeno" onClick={() => aoExcluir(rascunho.id)}>
            Excluir
          </button>
        ) : (
          <span />
        )}
        <div className="flex">
          <button className="btn ghost" onClick={aoFechar}>
            Cancelar
          </button>
          <button className="btn ouro" onClick={() => aoSalvar(rascunho)}>
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  )
}
