import { useState } from 'react'
import { useStore } from '../state/store'
import {
  conversoes,
  consolidarGrupo,
  maiorVazamento,
  type EtapaId,
} from '../state/selectors'
import { novoId } from '../lib/id'
import type { GrupoFunil, RegistroFunil } from '../types'

const GRUPOS: { id: GrupoFunil; nome: string; cor: string }[] = [
  { id: 'linha-de-base', nome: 'Linha de base', cor: '#8a8f98' },
  { id: 'teste', nome: 'Teste', cor: 'var(--st-feito)' },
  { id: 'controle', nome: 'Controle', cor: '#7aa8e0' },
]

const ETAPAS: { id: keyof RegistroFunil; label: string }[] = [
  { id: 'leads', label: 'Leads' },
  { id: 'atendidos5min', label: 'Atendidos em 5 min' },
  { id: 'qualificados', label: 'Qualificados' },
  { id: 'visitas', label: 'Visitas' },
  { id: 'propostas', label: 'Propostas' },
  { id: 'vendas', label: 'Vendas' },
]

const pct = (n: number) => `${Math.round(n * 100)}%`

export function Funil() {
  const { state, dispatch } = useStore()

  const teste = consolidarGrupo(state.funil.filter((r) => r.grupo === 'teste'))
  const controle = consolidarGrupo(state.funil.filter((r) => r.grupo === 'controle'))
  const base = consolidarGrupo(state.funil.filter((r) => r.grupo === 'linha-de-base'))

  return (
    <div>
      <div className="tela-head">
        <div className="olho">Laboratório Daleprane</div>
        <h1>Funil</h1>
        <p>
          O problema é Lead → Visita. Registre cada período por grupo e compare teste contra
          controle. A etapa de maior queda é o vazamento.
        </p>
      </div>

      {/* Métrica principal em destaque */}
      <div className="grid tres mb">
        <CardMetricaPrincipal titulo="Linha de base" reg={base} cor="#8a8f98" />
        <CardMetricaPrincipal titulo="Teste" reg={teste} cor="var(--st-feito)" destaque />
        <CardMetricaPrincipal titulo="Controle" reg={controle} cor="#7aa8e0" />
      </div>

      {/* Funil lado a lado */}
      <div className="card mb">
        <div className="rotulo mb">Funil por grupo (consolidado)</div>
        <div className="grid tres">
          {[base, teste, controle].map((reg, i) => (
            <FunilColuna key={GRUPOS[i].id} nome={GRUPOS[i].nome} cor={GRUPOS[i].cor} reg={reg} />
          ))}
        </div>
        <p className="texto-3" style={{ fontSize: 12.5, marginTop: 16, marginBottom: 0 }}>
          A faixa em vermelho marca a etapa com maior queda de conversão, onde o funil mais
          perde lead.
        </p>
      </div>

      {/* Formulário de registro */}
      <FormularioRegistro
        aoSalvar={(r) => dispatch({ tipo: 'funil/adicionar', registro: r })}
      />

      {/* Histórico */}
      <div className="card mt">
        <div className="rotulo mb">Registros lançados</div>
        {state.funil.length === 0 ? (
          <p className="vazio">Nenhum registro ainda. Lance o primeiro período acima.</p>
        ) : (
          <div className="grid" style={{ gap: 8 }}>
            {[...state.funil]
              .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
              .map((r) => {
                const c = conversoes(r)
                const g = GRUPOS.find((x) => x.id === r.grupo)!
                return (
                  <div
                    key={r.id}
                    className="entre"
                    style={{
                      background: 'var(--bg-elev-2)',
                      border: '1px solid var(--linha-suave)',
                      borderRadius: 'var(--raio-sm)',
                      padding: '11px 13px',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div className="flex" style={{ gap: 10 }}>
                      <span className="pill" style={{ color: g.cor, borderColor: g.cor }}>
                        {g.nome}
                      </span>
                      <span className="texto-2">{r.periodoLabel}</span>
                    </div>
                    <div className="flex texto-3" style={{ fontSize: 12.5, gap: 14 }}>
                      <span>{r.leads} leads</span>
                      <span>{r.visitas} visitas</span>
                      <span style={{ color: 'var(--ouro)' }}>
                        Lead→Visita {pct(c.leadVisita)}
                      </span>
                      <span>{r.tempoMedioRespostaMin} min resposta</span>
                      <button
                        className="btn ghost pequeno perigo"
                        onClick={() => dispatch({ tipo: 'funil/remover', id: r.id })}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}

function CardMetricaPrincipal({
  titulo,
  reg,
  cor,
  destaque,
}: {
  titulo: string
  reg: RegistroFunil | null
  cor: string
  destaque?: boolean
}) {
  const c = reg ? conversoes(reg) : null
  return (
    <div className={`card ${destaque ? 'destaque' : ''}`}>
      <div className="entre">
        <div className="rotulo">{titulo}</div>
        <span style={{ width: 9, height: 9, borderRadius: 9, background: cor }} />
      </div>
      <div className="rotulo" style={{ marginTop: 10, fontSize: 10.5 }}>
        Lead → Visita
      </div>
      <div className="numerao" style={{ marginTop: 2 }}>
        {c ? Math.round(c.leadVisita * 100) : '·'}
        <span className="un">%</span>
      </div>
      <p className="texto-3" style={{ fontSize: 12.5, margin: '6px 0 0' }}>
        {reg ? `${reg.visitas} visitas de ${reg.leads} leads` : 'sem dados'}
        {reg ? ` · resposta ${reg.tempoMedioRespostaMin} min` : ''}
      </p>
    </div>
  )
}

function FunilColuna({
  nome,
  cor,
  reg,
}: {
  nome: string
  cor: string
  reg: RegistroFunil | null
}) {
  if (!reg || reg.leads === 0) {
    return (
      <div>
        <div className="entre mb">
          <strong>{nome}</strong>
        </div>
        <p className="vazio" style={{ padding: '10px 0' }}>
          sem dados
        </p>
      </div>
    )
  }

  const c = conversoes(reg)
  const vaza = maiorVazamento(c)
  const maxLeads = reg.leads
  const etapaConv: Record<string, number | null> = {
    leads: null,
    atendidos5min: c.atendimento,
    qualificados: c.qualificacao,
    visitas: c.visita,
    propostas: c.proposta,
    vendas: c.venda,
  }
  const etapaVaza: Record<string, EtapaId> = {
    atendidos5min: 'atendimento',
    qualificados: 'qualificacao',
    visitas: 'visita',
    propostas: 'proposta',
    vendas: 'venda',
  }

  return (
    <div>
      <div className="entre mb">
        <strong style={{ color: cor }}>{nome}</strong>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ETAPAS.map((et) => {
          const valor = reg[et.id] as number
          const largura = maxLeads > 0 ? Math.max(6, (valor / maxLeads) * 100) : 0
          const conv = etapaConv[et.id as string]
          const ehVazamento = etapaVaza[et.id as string] === vaza
          const ehVisita = et.id === 'visitas'
          return (
            <div key={et.id as string}>
              <div className="entre" style={{ fontSize: 12, marginBottom: 3 }}>
                <span className={ehVisita ? '' : 'texto-2'} style={ehVisita ? { color: 'var(--ouro)' } : undefined}>
                  {et.label}
                </span>
                <span className="texto-3">
                  {valor}
                  {conv != null && ` · ${pct(conv)}`}
                </span>
              </div>
              <div
                style={{
                  height: 22,
                  borderRadius: 6,
                  background: 'var(--linha)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${largura}%`,
                    background: ehVazamento
                      ? 'var(--st-travado)'
                      : ehVisita
                        ? 'var(--ouro)'
                        : cor,
                    opacity: ehVazamento ? 0.85 : 0.55,
                    transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const VAZIO: Omit<RegistroFunil, 'id' | 'criadoEm'> = {
  grupo: 'linha-de-base',
  periodoLabel: '',
  leads: 0,
  atendidos5min: 0,
  qualificados: 0,
  visitas: 0,
  propostas: 0,
  vendas: 0,
  tempoMedioRespostaMin: 0,
}

function FormularioRegistro({ aoSalvar }: { aoSalvar: (r: RegistroFunil) => void }) {
  const [form, setForm] = useState({ ...VAZIO })
  const num = (v: string) => Math.max(0, Math.round(Number(v) || 0))

  function salvar() {
    if (!form.periodoLabel.trim()) {
      alert('Informe o período (ex: 28/09 a 04/10).')
      return
    }
    if (form.leads <= 0) {
      alert('Um registro precisa de pelo menos 1 lead.')
      return
    }
    aoSalvar({ ...form, id: novoId('funil'), criadoEm: new Date().toISOString() })
    setForm({ ...VAZIO })
  }

  return (
    <div className="card">
      <div className="rotulo mb">Registrar período</div>
      <div className="grid dois" style={{ gap: 14, marginBottom: 14 }}>
        <div>
          <label className="campo">Grupo</label>
          <select
            value={form.grupo}
            onChange={(e) => setForm({ ...form, grupo: e.target.value as GrupoFunil })}
          >
            {GRUPOS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="campo">Período</label>
          <input
            value={form.periodoLabel}
            onChange={(e) => setForm({ ...form, periodoLabel: e.target.value })}
            placeholder="28/09 a 04/10"
          />
        </div>
      </div>

      <div className="grid tres" style={{ gap: 14, marginBottom: 14 }}>
        {ETAPAS.map((et) => (
          <div key={et.id as string}>
            <label className="campo">{et.label}</label>
            <input
              type="number"
              min={0}
              value={String(form[et.id as keyof typeof form] ?? 0)}
              onChange={(e) => setForm({ ...form, [et.id]: num(e.target.value) })}
            />
          </div>
        ))}
        <div>
          <label className="campo">Tempo médio 1ª resposta (min)</label>
          <input
            type="number"
            min={0}
            value={String(form.tempoMedioRespostaMin)}
            onChange={(e) => setForm({ ...form, tempoMedioRespostaMin: num(e.target.value) })}
          />
        </div>
      </div>

      <div className="entre">
        <span className="texto-3" style={{ fontSize: 12.5 }}>
          As conversões entre etapas são calculadas automaticamente.
        </span>
        <button className="btn ouro" onClick={salvar}>
          Lançar registro
        </button>
      </div>
    </div>
  )
}
