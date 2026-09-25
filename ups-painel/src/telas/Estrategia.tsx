import { useState } from 'react'
import { useStore } from '../state/store'
import { novoId } from '../lib/id'
import { hojeISO, formatarBR } from '../lib/dates'
import type { Decisao, Risco } from '../types'

export function Estrategia() {
  const { state, dispatch } = useStore()

  return (
    <div>
      <div className="tela-head">
        <div className="olho">A tese em movimento</div>
        <h1>Estratégia</h1>
        <p>
          Marketing → Aquisição → Comercial → Processos → Dados. IA é a tecnologia por trás,
          nunca o produto.
        </p>
      </div>

      {/* Escada de oferta */}
      <div className="rotulo mb">Escada de oferta</div>
      <div className="grid tres mb">
        {state.escada.map((d) => (
          <div key={d.id} className={`card ${d.numero === 1 ? 'destaque' : ''}`}>
            <div className="numerao" style={{ fontSize: 54 }}>
              {d.numero}
            </div>
            <h2 style={{ fontSize: 23, marginTop: 4 }}>{d.titulo}</h2>
            <div className="pill" style={{ marginTop: 10 }}>
              {d.quando}
            </div>
            <p className="texto-2" style={{ fontSize: 13.5, marginTop: 12, marginBottom: 0 }}>
              {d.descricao}
            </p>
          </div>
        ))}
      </div>

      {/* Riscos */}
      <div className="rotulo mb" style={{ marginTop: 30 }}>
        Riscos conhecidos
      </div>
      <div className="grid tres mb">
        {state.riscos.map((r) => (
          <RiscoCard
            key={r.id}
            risco={r}
            aoAlternar={() =>
              dispatch({
                tipo: 'risco/atualizar',
                risco: { ...r, status: r.status === 'aberto' ? 'tratado' : 'aberto' },
              })
            }
          />
        ))}
      </div>

      {/* Log de decisões */}
      <LogDecisoes />
    </div>
  )
}

function RiscoCard({ risco, aoAlternar }: { risco: Risco; aoAlternar: () => void }) {
  const tratado = risco.status === 'tratado'
  return (
    <div className="card" style={tratado ? { opacity: 0.72 } : undefined}>
      <div className="entre mb">
        <h3 style={{ fontFamily: 'var(--sans)', fontSize: 16 }}>{risco.titulo}</h3>
        <span className={`pill ${tratado ? 'feito' : 'travado'}`}>
          <span className="dot" />
          {tratado ? 'Tratado' : 'Aberto'}
        </span>
      </div>
      <p className="texto-2" style={{ fontSize: 13.5, marginTop: 0 }}>
        {risco.descricao}
      </p>
      <button className="btn ghost pequeno" style={{ marginTop: 6 }} onClick={aoAlternar}>
        {tratado ? 'Reabrir' : 'Marcar como tratado'}
      </button>
    </div>
  )
}

function LogDecisoes() {
  const { state, dispatch } = useStore()
  const [form, setForm] = useState<Omit<Decisao, 'id'>>({
    data: hojeISO(),
    decisao: '',
    motivo: '',
    quem: 'Ambos',
  })

  function adicionar() {
    if (!form.decisao.trim()) {
      alert('Descreva a decisão.')
      return
    }
    dispatch({ tipo: 'decisao/adicionar', decisao: { ...form, id: novoId('decisao') } })
    setForm({ data: hojeISO(), decisao: '', motivo: '', quem: 'Ambos' })
  }

  return (
    <div className="card" style={{ marginTop: 30 }}>
      <div className="rotulo mb">Log de decisões</div>

      <div className="grid form-decisao" style={{ gridTemplateColumns: '130px 1fr 160px', gap: 12, marginBottom: 12 }}>
        <div>
          <label className="campo">Data</label>
          <input
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </div>
        <div>
          <label className="campo">Decisão</label>
          <input
            value={form.decisao}
            onChange={(e) => setForm({ ...form, decisao: e.target.value })}
            placeholder="O que foi decidido"
          />
        </div>
        <div>
          <label className="campo">Quem decidiu</label>
          <select value={form.quem} onChange={(e) => setForm({ ...form, quem: e.target.value })}>
            <option>Ambos</option>
            <option>Kalleby</option>
            <option>Caio</option>
          </select>
        </div>
      </div>
      <div className="linha-form">
        <label className="campo">Motivo</label>
        <input
          value={form.motivo}
          onChange={(e) => setForm({ ...form, motivo: e.target.value })}
          placeholder="Por que essa decisão"
        />
      </div>
      <div className="entre">
        <span className="texto-3" style={{ fontSize: 12.5 }}>
          Registro histórico das viradas de rota.
        </span>
        <button className="btn ouro" onClick={adicionar}>
          Registrar decisão
        </button>
      </div>

      <div style={{ marginTop: 22 }}>
        {state.decisoes.length === 0 ? (
          <p className="vazio">Nenhuma decisão registrada ainda.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {state.decisoes.map((d) => (
              <div
                key={d.id}
                className="linha-decisao"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr auto',
                  gap: 14,
                  padding: '14px 0',
                  borderTop: '1px solid var(--linha-suave)',
                  alignItems: 'start',
                }}
              >
                <span className="texto-3" style={{ fontSize: 13 }}>
                  {formatarBR(d.data)}
                </span>
                <div>
                  <div style={{ marginBottom: 3 }}>{d.decisao}</div>
                  {d.motivo && (
                    <div className="texto-3" style={{ fontSize: 13 }}>
                      {d.motivo}
                    </div>
                  )}
                  <div className="texto-3" style={{ fontSize: 12, marginTop: 4 }}>
                    por {d.quem}
                  </div>
                </div>
                <button
                  className="btn ghost pequeno perigo"
                  onClick={() => dispatch({ tipo: 'decisao/remover', id: d.id })}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
