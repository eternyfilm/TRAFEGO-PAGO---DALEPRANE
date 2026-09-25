import { useState } from 'react'
import { useStore } from '../state/store'
import { Modal } from '../ui/Modal'
import { novoId } from '../lib/id'
import { hojeISO } from '../lib/dates'
import type { EtapaProspect, Prospect } from '../types'

const COLUNAS: { id: EtapaProspect; nome: string }[] = [
  { id: 'mapeado', nome: 'Mapeado' },
  { id: 'contatado', nome: 'Contatado' },
  { id: 'reuniao', nome: 'Reunião' },
  { id: 'proposta', nome: 'Proposta' },
  { id: 'pago', nome: 'Pago' },
  { id: 'perdido', nome: 'Perdido' },
]

const ORDEM_AVANCO: EtapaProspect[] = [
  'mapeado',
  'contatado',
  'reuniao',
  'proposta',
  'pago',
]

const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export function Comercial() {
  const { state, dispatch } = useStore()
  const [criando, setCriando] = useState(false)
  const [editando, setEditando] = useState<Prospect | null>(null)

  const ativos = state.prospects.filter(
    (p) => p.etapa !== 'pago' && p.etapa !== 'perdido',
  ).length
  const reunioes = state.prospects.filter((p) =>
    ['reuniao', 'proposta', 'pago'].includes(p.etapa),
  ).length
  const pagos = state.prospects.filter((p) => p.etapa === 'pago')
  const mesAtual = hojeISO().slice(0, 7)
  const receitaMes = pagos
    .filter((p) => p.criadoEm.slice(0, 7) === mesAtual)
    .reduce((s, p) => s + p.valor, 0)

  function avancar(p: Prospect) {
    const i = ORDEM_AVANCO.indexOf(p.etapa)
    if (i >= 0 && i < ORDEM_AVANCO.length - 1) {
      dispatch({ tipo: 'prospect/atualizar', prospect: { ...p, etapa: ORDEM_AVANCO[i + 1] } })
    }
  }

  return (
    <div>
      <div className="tela-head">
        <div className="olho">Pipeline do Diagnóstico</div>
        <h1>Comercial</h1>
        <p>Escada de oferta, degrau 1. Do prospect mapeado ao diagnóstico pago.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <Contador rotulo="Prospects ativos" valor={String(ativos)} />
        <Contador rotulo="Reuniões" valor={String(reunioes)} />
        <Contador rotulo="Diagnósticos pagos" valor={String(pagos.length)} />
        <Contador rotulo="Receita do mês" valor={brl(receitaMes)} destaque />
      </div>

      <div className="entre mb">
        <span className="texto-3" style={{ fontSize: 12.5 }}>
          Toque no card para editar. A seta avança de etapa.
        </span>
        <button className="btn ouro pequeno" onClick={() => setCriando(true)}>
          + Prospect
        </button>
      </div>

      <div className="kanban">
        {COLUNAS.map((col) => {
          const cards = state.prospects.filter((p) => p.etapa === col.id)
          return (
            <div key={col.id} className="kanban-col">
              <div className="entre" style={{ marginBottom: 10 }}>
                <strong style={{ fontSize: 13.5 }}>{col.nome}</strong>
                <span className="texto-3" style={{ fontSize: 12 }}>
                  {cards.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cards.map((p) => (
                  <article
                    key={p.id}
                    className="card"
                    style={{ padding: 13, cursor: 'pointer' }}
                    onClick={() => setEditando(p)}
                  >
                    <div style={{ fontSize: 14, marginBottom: 4 }}>{p.nome}</div>
                    {p.contato && (
                      <div className="texto-3" style={{ fontSize: 12 }}>
                        {p.contato}
                      </div>
                    )}
                    {p.valor > 0 && (
                      <div
                        style={{ fontSize: 13, color: 'var(--ouro)', marginTop: 6 }}
                      >
                        {brl(p.valor)}
                      </div>
                    )}
                    {p.etapa !== 'pago' && p.etapa !== 'perdido' && (
                      <button
                        className="btn ghost pequeno"
                        style={{ marginTop: 10, width: '100%' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          avancar(p)
                        }}
                      >
                        avançar →
                      </button>
                    )}
                  </article>
                ))}
                {cards.length === 0 && (
                  <p className="texto-3" style={{ fontSize: 12, fontStyle: 'italic' }}>
                    vazio
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {(criando || editando) && (
        <ProspectModal
          prospect={
            editando ?? {
              id: novoId('prospect'),
              nome: '',
              contato: '',
              etapa: 'mapeado',
              valor: 0,
              notas: '',
              criadoEm: new Date().toISOString(),
            }
          }
          novo={!editando}
          aoFechar={() => {
            setCriando(false)
            setEditando(null)
          }}
          aoSalvar={(p) => {
            if (!p.nome.trim()) {
              alert('Dá um nome pro prospect.')
              return
            }
            if (editando) dispatch({ tipo: 'prospect/atualizar', prospect: p })
            else dispatch({ tipo: 'prospect/adicionar', prospect: p })
            setCriando(false)
            setEditando(null)
          }}
          aoExcluir={
            editando
              ? (id) => {
                  if (confirm('Excluir prospect?')) {
                    dispatch({ tipo: 'prospect/remover', id })
                    setEditando(null)
                  }
                }
              : undefined
          }
        />
      )}
    </div>
  )
}

function Contador({
  rotulo,
  valor,
  destaque,
}: {
  rotulo: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div className={`card ${destaque ? 'destaque' : ''}`}>
      <div className="rotulo">{rotulo}</div>
      <div
        className="numerao"
        style={{ marginTop: 6, fontSize: destaque ? 'clamp(30px,5vw,50px)' : undefined }}
      >
        {valor}
      </div>
    </div>
  )
}

interface PMProps {
  prospect: Prospect
  novo?: boolean
  aoFechar: () => void
  aoSalvar: (p: Prospect) => void
  aoExcluir?: (id: string) => void
}

function ProspectModal({ prospect, novo, aoFechar, aoSalvar, aoExcluir }: PMProps) {
  const [r, setR] = useState<Prospect>(prospect)
  const set = (patch: Partial<Prospect>) => setR((p) => ({ ...p, ...patch }))

  return (
    <Modal titulo={novo ? 'Novo prospect' : 'Editar prospect'} aberto aoFechar={aoFechar}>
      <div className="linha-form">
        <label className="campo">Imobiliária / nome</label>
        <input value={r.nome} onChange={(e) => set({ nome: e.target.value })} autoFocus />
      </div>
      <div className="linha-form">
        <label className="campo">Contato</label>
        <input
          value={r.contato}
          onChange={(e) => set({ contato: e.target.value })}
          placeholder="Nome, telefone ou @"
        />
      </div>
      <div className="grid dois" style={{ gap: 14, marginBottom: 14 }}>
        <div>
          <label className="campo">Etapa</label>
          <select
            value={r.etapa}
            onChange={(e) => set({ etapa: e.target.value as EtapaProspect })}
          >
            {COLUNAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="campo">Valor (R$)</label>
          <input
            type="number"
            min={0}
            value={String(r.valor)}
            onChange={(e) => set({ valor: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
      </div>
      <div className="linha-form">
        <label className="campo">Notas</label>
        <textarea value={r.notas} onChange={(e) => set({ notas: e.target.value })} rows={3} />
      </div>
      <div className="modal-acoes">
        {aoExcluir ? (
          <button className="btn ghost perigo pequeno" onClick={() => aoExcluir(r.id)}>
            Excluir
          </button>
        ) : (
          <span />
        )}
        <div className="flex">
          <button className="btn ghost" onClick={aoFechar}>
            Cancelar
          </button>
          <button className="btn ouro" onClick={() => aoSalvar(r)}>
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  )
}
