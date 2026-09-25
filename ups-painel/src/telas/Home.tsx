import { useRef } from 'react'
import { useStore } from '../state/store'
import { irPara } from '../state/router'
import {
  progressoGeral,
  progressoDaFase,
  faseAtual,
  proximasDoDono,
  travadas,
  nomeFase,
} from '../state/selectors'
import { contagemRegressiva, formatarBR } from '../lib/dates'
import { DATA_ALVO, FRASE_GUIA } from '../data/seed'
import { exportarJSON, importarJSON } from '../lib/storage'
import { Aperture } from '../ui/Aperture'
import { StatusPill, DonoPill } from '../ui/Pills'
import type { Dono, Tarefa } from '../types'

export function Home() {
  const { state, dispatch } = useStore()
  const inputArquivo = useRef<HTMLInputElement>(null)

  const reg = contagemRegressiva(DATA_ALVO)
  const geral = progressoGeral(state.tarefas)
  const fase = faseAtual(state.fases)
  const bloqueadas = travadas(state.tarefas)

  function baixar() {
    const blob = new Blob([exportarJSON(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ups-painel-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function aoImportar(e: React.ChangeEvent<HTMLInputElement>) {
    const arq = e.target.files?.[0]
    if (!arq) return
    const leitor = new FileReader()
    leitor.onload = () => {
      try {
        const novo = importarJSON(String(leitor.result))
        if (confirm('Importar vai substituir os dados atuais do painel. Continuar?')) {
          dispatch({ tipo: 'substituir', state: novo })
        }
      } catch {
        alert('Arquivo inválido. Esperado um JSON exportado por este painel.')
      }
      if (inputArquivo.current) inputArquivo.current.value = ''
    }
    leitor.readAsText(arq)
  }

  return (
    <div>
      <div className="tela-head entre wrap">
        <div>
          <div className="olho">Rumo ao case, 31/01/2027</div>
          <h1>Sistemas de crescimento para o mercado imobiliário</h1>
        </div>
        <div className="flex">
          <button className="btn ghost pequeno" onClick={baixar}>
            Exportar JSON
          </button>
          <button
            className="btn ghost pequeno"
            onClick={() => inputArquivo.current?.click()}
          >
            Importar JSON
          </button>
          <input
            ref={inputArquivo}
            type="file"
            accept="application/json"
            onChange={aoImportar}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Frase-guia em destaque tipográfico */}
      <div className="card destaque" style={{ marginBottom: 16 }}>
        <div className="olho">A tese, em uma frase</div>
        <p
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(26px, 4.6vw, 40px)',
            lineHeight: 1.12,
            margin: 0,
            maxWidth: '20ch',
          }}
        >
          {FRASE_GUIA}
        </p>
      </div>

      <div className="grid tres" style={{ marginBottom: 16 }}>
        {/* Contagem regressiva */}
        <div className="card">
          <div className="rotulo">Contagem regressiva</div>
          <div className="numerao" style={{ marginTop: 8 }}>
            {reg.vencido ? '+' : ''}
            {reg.dias}
            <span className="un">{reg.vencido ? 'dias além' : 'dias'}</span>
          </div>
          <p className="texto-3" style={{ marginTop: 6, marginBottom: 0 }}>
            {reg.semanas} semanas até 31/01/2027
          </p>
        </div>

        {/* Progresso geral */}
        <div className="card">
          <div className="rotulo">Progresso geral</div>
          <div className="numerao" style={{ marginTop: 8 }}>
            {Math.round(geral * 100)}
            <span className="un">%</span>
          </div>
          <div className="barra" style={{ marginTop: 14 }}>
            <span style={{ width: `${geral * 100}%` }} />
          </div>
          <p className="texto-3" style={{ marginTop: 8, marginBottom: 0 }}>
            {state.tarefas.filter((t) => t.status === 'feito').length} de{' '}
            {state.tarefas.length} tarefas feitas
          </p>
        </div>

        {/* Fase atual com aperture */}
        <div className="card">
          <div className="entre">
            <div className="rotulo">Fase atual</div>
            <div className="aperture-wrap">
              <Aperture size={38} progresso={progressoDaFase(state.tarefas, fase.id)} />
            </div>
          </div>
          <h2 style={{ fontSize: 26, marginTop: 10, lineHeight: 1.05 }}>{fase.nome}</h2>
          <p className="texto-3" style={{ marginTop: 4, marginBottom: 0 }}>
            {fase.periodoLabel} ·{' '}
            {Math.round(progressoDaFase(state.tarefas, fase.id) * 100)}% concluída
          </p>
        </div>
      </div>

      {/* Progresso por fase */}
      <div className="card mb">
        <div className="rotulo" style={{ marginBottom: 16 }}>
          Progresso por fase
        </div>
        <div className="grid" style={{ gap: 12 }}>
          {[...state.fases]
            .sort((a, b) => a.ordem - b.ordem)
            .map((f) => {
              const p = progressoDaFase(state.tarefas, f.id)
              const atual = f.id === fase.id
              return (
                <div key={f.id} className="entre" style={{ gap: 16 }}>
                  <div style={{ minWidth: 0, flex: '0 0 40%' }}>
                    <span style={{ color: atual ? 'var(--ouro)' : 'var(--texto)' }}>
                      {f.nome}
                    </span>
                  </div>
                  <div className="barra" style={{ flex: 1 }}>
                    <span style={{ width: `${p * 100}%` }} />
                  </div>
                  <span className="texto-3" style={{ width: 42, textAlign: 'right' }}>
                    {Math.round(p * 100)}%
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Próximas 3 de cada fundador */}
      <div className="grid dois mb">
        <ColunaProximas dono="Kalleby" />
        <ColunaProximas dono="Caio" />
      </div>

      {/* Bloco travado */}
      <div className={`card ${bloqueadas.length ? '' : ''}`}>
        <div className="entre mb">
          <h2 style={{ fontSize: 24 }}>Travado</h2>
          <span className="pill travado">
            <span className="dot" />
            {bloqueadas.length}
          </span>
        </div>
        {bloqueadas.length === 0 ? (
          <p className="vazio">Nada travado. Bom sinal.</p>
        ) : (
          <div className="grid" style={{ gap: 10 }}>
            {bloqueadas.map((t) => (
              <TarefaLinha key={t.id} tarefa={t} fase={nomeFase(state.fases, t.faseId)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ColunaProximas({ dono }: { dono: Dono }) {
  const { state } = useStore()
  const proximas = proximasDoDono(state, dono, 3)
  return (
    <div className="card">
      <div className="entre mb">
        <h2 style={{ fontSize: 24 }}>Próximas de {dono}</h2>
        <DonoPill dono={dono} />
      </div>
      {proximas.length === 0 ? (
        <p className="vazio">Sem tarefas pendentes.</p>
      ) : (
        <div className="grid" style={{ gap: 10 }}>
          {proximas.map((t) => (
            <TarefaLinha key={t.id} tarefa={t} fase={nomeFase(state.fases, t.faseId)} />
          ))}
        </div>
      )}
    </div>
  )
}

function TarefaLinha({ tarefa, fase }: { tarefa: Tarefa; fase: string }) {
  return (
    <button
      className="entre"
      onClick={() => irPara('roadmap')}
      style={{
        textAlign: 'left',
        background: 'var(--bg-elev-2)',
        border: '1px solid var(--linha-suave)',
        borderRadius: 'var(--raio-sm)',
        padding: '11px 13px',
        cursor: 'pointer',
        gap: 12,
        width: '100%',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ marginBottom: 4 }}>{tarefa.titulo}</div>
        <div className="texto-3" style={{ fontSize: 12 }}>
          {fase} · {formatarBR(tarefa.prazo)}
        </div>
      </div>
      <StatusPill status={tarefa.status} />
    </button>
  )
}
