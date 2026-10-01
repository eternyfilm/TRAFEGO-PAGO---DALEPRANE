import { useEffect, useRef, useState, type FormEvent } from 'react'
import { atalhos, baseDeRespostas, mensagensLead, nos, type Acao, type Opcao } from '../config/cadu'
import { marca, linkWhatsApp } from '../config/marca'
import { enviarLead } from '../lib/leads'
import { mascaraTelefone, telefoneValido } from '../lib/formatos'
import { evento } from '../lib/rastreio'
import { navegar } from '../lib/router'
import { Icone } from './Icones'

// Chat do Cadú: roteiro guiado (src/config/cadu.ts) + respostas por texto
// livre buscadas no FAQ. Quando a pessoa pede contato, coleta nome e celular
// e manda pelo mesmo caminho de lead do simulador.

interface Msg {
  id: number
  de: 'cadu' | 'voce'
  texto: string
}

type Coleta = null | { etapa: 'nome' | 'telefone'; produto: string; produtoNome: string; nome?: string }

const CHAVE = 'conquistare:chat-cadu'
export const EVENTO_ABRIR_CADU = 'cadu:abrir'

export function abrirCadu() {
  window.dispatchEvent(new Event(EVENTO_ABRIR_CADU))
}

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ')
}

const PARADAS = new Set('a o e de da do das dos que como para pra por com sem um uma no na nos nas em eu meu minha voce vcs se ou é e ao aos qual quais quanto tem ter sao ser isso esse essa'.split(' '))

function palavras(s: string) {
  return normalizar(s).split(/\s+/).filter((w) => w.length > 2 && !PARADAS.has(w))
}

// Acha a melhor resposta do FAQ por sobreposição de palavras.
function buscarResposta(pergunta: string): string | null {
  const q = new Set(palavras(pergunta))
  if (!q.size) return null
  let melhor: { r: string; nota: number } | null = null
  for (const item of baseDeRespostas) {
    const doc = palavras(item.p)
    const nota = doc.filter((w) => q.has(w)).length * 2 + palavras(item.r).filter((w) => q.has(w)).length * 0.3
    if (!melhor || nota > melhor.nota) melhor = { r: item.r, nota }
  }
  return melhor && melhor.nota >= 2 ? melhor.r : null
}

function noPorAtalho(texto: string): string | null {
  const t = normalizar(texto)
  return atalhos.find((a) => a.termos.some((termo) => t.includes(termo)))?.no ?? null
}

function carregar(): { msgs: Msg[]; opcoes: Opcao[] } | null {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE) || 'null')
  } catch {
    return null
  }
}

export function ChatCadu() {
  const salvo = carregar()
  const [aberto, setAberto] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>(salvo?.msgs ?? [])
  const [opcoes, setOpcoes] = useState<Opcao[]>(salvo?.opcoes ?? [])
  const [digitando, setDigitando] = useState(false)
  const [texto, setTexto] = useState('')
  const [coleta, setColeta] = useState<Coleta>(null)
  const [convite, setConvite] = useState(false)
  const [avatarOk, setAvatarOk] = useState(true)
  const idRef = useRef(salvo?.msgs.length ?? 0)
  const fimRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fila = useRef<Promise<void>>(Promise.resolve())

  // abrir por outros botões do site
  useEffect(() => {
    const abrir = () => setAberto(true)
    window.addEventListener(EVENTO_ABRIR_CADU, abrir)
    return () => window.removeEventListener(EVENTO_ABRIR_CADU, abrir)
  }, [])

  // convite discreto na primeira visita
  useEffect(() => {
    if (salvo) return
    const t = setTimeout(() => setConvite(true), 7000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify({ msgs, opcoes }))
    } catch {
      /* ok */
    }
  }, [msgs, opcoes])

  useEffect(() => {
    if (!aberto) return
    setConvite(false)
    if (msgs.length === 0) irPara('inicio')
    setTimeout(() => inputRef.current?.focus(), 150)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs, digitando, opcoes])

  function adicionar(de: Msg['de'], t: string) {
    setMsgs((m) => [...m, { id: ++idRef.current, de, texto: t }])
  }

  // O Cadú "digita" cada mensagem com uma pausa curta, em fila.
  function caduFala(mensagens: string[], depois: Opcao[] = []) {
    setOpcoes([])
    fila.current = fila.current.then(async () => {
      for (const m of mensagens) {
        setDigitando(true)
        await new Promise((r) => setTimeout(r, Math.min(1200, 380 + m.length * 9)))
        setDigitando(false)
        adicionar('cadu', m)
      }
      setOpcoes(depois)
    })
  }

  function irPara(id: string) {
    const no = nos[id] ?? nos['nao-entendi']
    caduFala(no.mensagens, no.opcoes)
  }

  function executar(acao: Acao) {
    switch (acao.tipo) {
      case 'ir':
        return irPara(acao.no)
      case 'pagina':
        caduFala(['Te levo lá! 🚀'])
        setTimeout(() => {
          if (acao.para.startsWith('/#')) {
            navegar('/')
            setTimeout(() => document.getElementById(acao.para.slice(2))?.scrollIntoView({ behavior: 'smooth' }), 200)
          } else navegar(acao.para)
          if (window.innerWidth < 640) setAberto(false)
        }, 700)
        return
      case 'whatsapp': {
        evento('Contact', { origem: 'chat-cadu' })
        const ultimas = msgs.filter((m) => m.de === 'voce').slice(-3).map((m) => m.texto)
        const msg = acao.mensagem ?? `Olá, ${marca.nome}! Vim pelo chat do Cadú no site.${ultimas.length ? `\n${ultimas.join('\n')}` : ''}`
        window.open(linkWhatsApp(msg), '_blank', 'noopener')
        return
      }
      case 'lead':
        setColeta({ etapa: 'nome', produto: acao.produto, produtoNome: acao.produtoNome })
        caduFala([mensagensLead.nome])
        setTimeout(() => inputRef.current?.focus(), 600)
        return
    }
  }

  function clicar(o: Opcao) {
    adicionar('voce', o.rotulo)
    executar(o.acao)
  }

  async function enviarTexto(e: FormEvent) {
    e.preventDefault()
    const t = texto.trim()
    if (!t) return
    setTexto('')
    adicionar('voce', t)

    if (coleta?.etapa === 'nome') {
      const nome = t.split(/\s+/)[0]
      setColeta({ ...coleta, etapa: 'telefone', nome: t })
      caduFala([mensagensLead.telefone(nome)])
      return
    }
    if (coleta?.etapa === 'telefone') {
      if (!telefoneValido(t)) {
        caduFala([mensagensLead.telefoneInvalido])
        return
      }
      const c = coleta
      setColeta(null)
      await enviarLead({
        produto: c.produto,
        produtoNome: c.produtoNome,
        nome: c.nome ?? '',
        telefone: mascaraTelefone(t),
        extras: { conversa: msgs.filter((m) => m.de === 'voce').map((m) => m.texto).join(' | ') },
        origem: 'chat-cadu',
      })
      irPara('lead-ok')
      return
    }

    const atalho = noPorAtalho(t)
    const resposta = buscarResposta(t)
    if (resposta) {
      caduFala([resposta], [
        { rotulo: 'Outra dúvida', acao: { tipo: 'ir', no: 'duvidas' } },
        { rotulo: 'Falar com uma pessoa', acao: { tipo: 'ir', no: 'pessoa' } },
        { rotulo: 'Voltar ao início', acao: { tipo: 'ir', no: 'inicio' } },
      ])
    } else if (atalho) {
      irPara(atalho)
    } else {
      irPara('nao-entendi')
    }
  }

  function recomecar() {
    setMsgs([])
    setOpcoes([])
    setColeta(null)
    idRef.current = 0
    irPara('inicio')
  }

  const avatar = avatarOk ? (
    <img src={marca.mascote.imagem} alt="" onError={() => setAvatarOk(false)} />
  ) : (
    <img src={marca.logos.simbolo} alt="" />
  )

  return (
    <>
      {!aberto && (
        <div className="cadu-lancador">
          {convite && (
            <button className="cadu-convite" onClick={() => setAberto(true)}>
              Oi! Eu sou o {marca.mascote.nome}. Posso te ajudar? 💜
              <span
                className="cadu-convite-x"
                role="button"
                aria-label="Fechar convite"
                onClick={(e) => {
                  e.stopPropagation()
                  setConvite(false)
                }}
              >
                <Icone nome="x" tamanho={14} />
              </span>
            </button>
          )}
          <button className="cadu-botao" onClick={() => setAberto(true)} aria-label={`Conversar com o ${marca.mascote.nome}`}>
            <span className={`cadu-avatar ${avatarOk ? 'cadu-avatar--foto' : ''}`}>{avatar}</span>
            <span className="cadu-online" />
          </button>
        </div>
      )}

      {aberto && (
        <div className="cadu-chat" role="dialog" aria-label={`Chat com o ${marca.mascote.nome}`}>
          <header className="cadu-chat-topo">
            <span className={`cadu-avatar cadu-avatar--sm ${avatarOk ? 'cadu-avatar--foto' : ''}`}>{avatar}</span>
            <div>
              <strong>{marca.mascote.nome}</strong>
              <small><span className="cadu-online cadu-online--inline" /> Assistente virtual da Conquistare</small>
            </div>
            <button onClick={recomecar} aria-label="Recomeçar conversa" title="Recomeçar">
              <Icone nome="recomecar" tamanho={18} />
            </button>
            <button onClick={() => setAberto(false)} aria-label="Fechar chat">
              <Icone nome="x" tamanho={20} />
            </button>
          </header>

          <div className="cadu-chat-corpo" aria-live="polite">
            {msgs.map((m) => (
              <div key={m.id} className={`cadu-msg cadu-msg--${m.de}`}>
                {m.texto}
              </div>
            ))}
            {digitando && (
              <div className="cadu-msg cadu-msg--cadu cadu-digitando" aria-label="Cadú está digitando">
                <span /><span /><span />
              </div>
            )}
            {!digitando && opcoes.length > 0 && (
              <div className="cadu-opcoes">
                {opcoes.map((o) => (
                  <button key={o.rotulo} onClick={() => clicar(o)}>{o.rotulo}</button>
                ))}
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <form className="cadu-chat-entrada" onSubmit={enviarTexto}>
            <input
              ref={inputRef}
              value={texto}
              onChange={(e) => setTexto(coleta?.etapa === 'telefone' ? mascaraTelefone(e.target.value) : e.target.value)}
              placeholder={coleta?.etapa === 'nome' ? 'Seu nome' : coleta?.etapa === 'telefone' ? '(61) 99999-9999' : 'Digite sua dúvida...'}
              inputMode={coleta?.etapa === 'telefone' ? 'tel' : 'text'}
              aria-label="Mensagem"
            />
            <button type="submit" aria-label="Enviar" disabled={!texto.trim()}>
              <Icone nome="seta" tamanho={20} />
            </button>
          </form>
          {coleta && <p className="cadu-chat-aviso">{mensagensLead.consentimento}</p>}
        </div>
      )}
    </>
  )
}
