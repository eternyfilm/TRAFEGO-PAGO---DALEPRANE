import { useMemo, useState, type ReactNode } from 'react'
import { porSlug, produtosAtivos, type CampoExtra, type Produto } from '../config/produtos'
import { marca } from '../config/marca'
import { Link, navegar, useBusca } from '../lib/router'
import { destaqueTaxa, moeda, paraNumero, prazoTexto, simular } from '../lib/financas'
import { UFS, cpfValido, emailValido, mascaraCPF, mascaraCEP, mascaraData, mascaraMoeda, mascaraTelefone, telefoneValido } from '../lib/formatos'
import { enviarLead, ultimoLead, whatsDoLead } from '../lib/leads'
import { Icone, IconeWhatsApp } from '../ui/Icones'

// ---------- campos ----------

function Campo({ rotulo, erro, ajuda, children }: { rotulo: string; erro?: string; ajuda?: string; children: ReactNode }) {
  return (
    <label className={`campo ${erro ? 'campo--erro' : ''}`}>
      <span className="campo-rotulo">{rotulo}</span>
      {children}
      {erro ? <span className="campo-erro">{erro}</span> : ajuda ? <span className="campo-ajuda">{ajuda}</span> : null}
    </label>
  )
}

function CampoDinamico({ c, valor, onChange, erro }: { c: CampoExtra; valor: string; onChange: (v: string) => void; erro?: string }) {
  if (c.tipo === 'select') {
    return (
      <Campo rotulo={c.rotulo} ajuda={c.ajuda} erro={erro}>
        <select value={valor} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selecione</option>
          {c.opcoes!.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Campo>
    )
  }
  const mascara =
    c.tipo === 'moeda' ? mascaraMoeda : c.id === 'cep' ? mascaraCEP : c.id === 'nascimento' ? mascaraData : c.tipo === 'ano' ? (s: string) => s.replace(/\D/g, '').slice(0, 4) : (s: string) => s
  return (
    <Campo rotulo={c.rotulo} ajuda={c.ajuda} erro={erro}>
      <input
        value={valor}
        inputMode={c.tipo === 'texto' && c.id !== 'cep' && c.id !== 'nascimento' ? 'text' : 'numeric'}
        placeholder={c.tipo === 'moeda' ? 'R$ 0' : c.tipo === 'ano' ? 'Ex.: 2019' : ''}
        onChange={(e) => onChange(mascara(e.target.value))}
      />
    </Campo>
  )
}

// ---------- dados pessoais (compartilhado) ----------

interface Dados {
  nome: string
  cpf: string
  telefone: string
  email: string
  cidade: string
  uf: string
  aceite: boolean
}
const dadosVazios: Dados = { nome: '', cpf: '', telefone: '', email: '', cidade: '', uf: 'DF', aceite: false }

function validarDados(d: Dados, pedirCpf: boolean) {
  const e: Partial<Record<keyof Dados, string>> = {}
  if (d.nome.trim().split(/\s+/).length < 2) e.nome = 'Digite nome e sobrenome'
  if (pedirCpf && !cpfValido(d.cpf)) e.cpf = 'CPF inválido'
  if (!telefoneValido(d.telefone)) e.telefone = 'Celular com DDD, ex.: (61) 99999-9999'
  if (!emailValido(d.email)) e.email = 'E-mail inválido'
  if (!d.cidade.trim()) e.cidade = 'Informe a cidade'
  if (!d.aceite) e.aceite = 'Precisamos do seu aceite pra entrar em contato'
  return e
}

function FormDados({ d, set, erros, pedirCpf }: { d: Dados; set: (d: Dados) => void; erros: Partial<Record<keyof Dados, string>>; pedirCpf: boolean }) {
  return (
    <div className="form-grade">
      <div className="span-2">
        <Campo rotulo="Nome completo" erro={erros.nome}>
          <input value={d.nome} autoComplete="name" onChange={(e) => set({ ...d, nome: e.target.value })} />
        </Campo>
      </div>
      {pedirCpf && (
        <Campo rotulo="CPF" erro={erros.cpf}>
          <input value={d.cpf} inputMode="numeric" placeholder="000.000.000-00" onChange={(e) => set({ ...d, cpf: mascaraCPF(e.target.value) })} />
        </Campo>
      )}
      <Campo rotulo="Celular (WhatsApp)" erro={erros.telefone}>
        <input value={d.telefone} inputMode="tel" autoComplete="tel" placeholder="(61) 99999-9999" onChange={(e) => set({ ...d, telefone: mascaraTelefone(e.target.value) })} />
      </Campo>
      <div className={pedirCpf ? 'span-2' : ''}>
        <Campo rotulo="E-mail" erro={erros.email}>
          <input value={d.email} type="email" autoComplete="email" onChange={(e) => set({ ...d, email: e.target.value })} />
        </Campo>
      </div>
      <Campo rotulo="Cidade" erro={erros.cidade}>
        <input value={d.cidade} autoComplete="address-level2" onChange={(e) => set({ ...d, cidade: e.target.value })} />
      </Campo>
      <Campo rotulo="Estado">
        <select value={d.uf} onChange={(e) => set({ ...d, uf: e.target.value })}>
          {UFS.map((u) => <option key={u}>{u}</option>)}
        </select>
      </Campo>
      <label className={`aceite span-2 ${erros.aceite ? 'campo--erro' : ''}`}>
        <input type="checkbox" checked={d.aceite} onChange={(e) => set({ ...d, aceite: e.target.checked })} />
        <span>
          Autorizo a {marca.nome} a entrar em contato por WhatsApp, telefone e e-mail sobre esta solicitação, e concordo com a{' '}
          <Link para="/privacidade" target="_blank">política de privacidade</Link>.
        </span>
      </label>
      {erros.aceite && <span className="campo-erro span-2">{erros.aceite}</span>}
    </div>
  )
}

// ---------- página de simulação ----------

export function Simular() {
  const q = useBusca()
  const inicial = porSlug(q.get('produto'))
  const [produto, setProduto] = useState<Produto | undefined>(inicial)
  const [passo, setPasso] = useState(inicial ? 1 : 0)

  const [valorTxt, setValorTxt] = useState(() => mascaraMoeda(q.get('valor') ?? String(inicial?.valorPadrao ?? '')))
  const [prazo, setPrazo] = useState(() => Number(q.get('prazo')) || inicial?.prazoPadrao || 0)
  const [extras, setExtras] = useState<Record<string, string>>({})
  const [dados, setDados] = useState<Dados>(dadosVazios)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)

  const valor = paraNumero(valorTxt)
  const r = useMemo(() => (produto && valor && prazo ? simular(produto, valor, prazo, extras) : null), [produto, valor, prazo, extras])

  function escolher(p: Produto) {
    setProduto(p)
    setValorTxt(p.valorPadrao ? mascaraMoeda(String(p.valorPadrao)) : '')
    setPrazo(p.prazoPadrao ?? 0)
    setExtras({})
    setErros({})
    setPasso(1)
    window.scrollTo({ top: 0 })
  }

  function validarPasso1() {
    if (!produto) return false
    const e: Record<string, string> = {}
    if (valor < produto.valorMin) e.valor = `Mínimo de ${moeda(produto.valorMin)}`
    if (valor > produto.valorMax) e.valor = `Máximo de ${moeda(produto.valorMax)}`
    produto.camposExtras?.forEach((c) => {
      if (!extras[c.id]?.trim()) e[c.id] = 'Campo obrigatório'
    })
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function enviar() {
    if (!produto) return
    const e = validarDados(dados, true)
    setErros(e as Record<string, string>)
    if (Object.keys(e).length) return
    setEnviando(true)
    await enviarLead({
      produto: produto.slug,
      produtoNome: produto.nome,
      nome: dados.nome.trim(),
      cpf: dados.cpf,
      telefone: dados.telefone,
      email: dados.email.trim(),
      cidade: dados.cidade.trim(),
      uf: dados.uf,
      valor,
      prazo,
      parcelaEstimada: r ? Math.round(r.parcela * 100) / 100 : undefined,
      extras,
      origem: '/simular',
    })
    navegar('/obrigado')
  }

  const etapas = ['Produto', 'Simulação', 'Seus dados']

  return (
    <section className="fluxo">
      <div className="container">
        <div className="fluxo-progresso" aria-label="Etapas">
          {etapas.map((e, i) => (
            <div key={e} className={`fluxo-etapa ${i < passo ? 'feita' : ''} ${i === passo ? 'atual' : ''}`}>
              <span>{i < passo ? <Icone nome="check" tamanho={14} /> : i + 1}</span>
              {e}
            </div>
          ))}
        </div>

        {passo === 0 && (
          <div className="fluxo-escolha">
            <h1>O que você quer conquistar?</h1>
            <p className="fluxo-sub">Escolha o tipo de crédito ou seguro pra começar.</p>
            <div className="escolha-grade">
              {produtosAtivos.map((p) => (
                <button key={p.slug} className="escolha" onClick={() => escolher(p)}>
                  <span className="card-produto-ic"><Icone nome={p.icone} tamanho={24} /></span>
                  <span>
                    <strong>{p.nome}</strong>
                    <small>{destaqueTaxa(p).rotulo.toLowerCase()} {destaqueTaxa(p).valor}</small>
                  </span>
                  <Icone nome="seta" tamanho={18} />
                </button>
              ))}
            </div>
          </div>
        )}

        {passo > 0 && produto && (
          <div className="fluxo-grade">
            <div className="fluxo-form">
              <button className="link-voltar" onClick={() => setPasso(passo - 1)}>
                <Icone nome="seta" tamanho={16} style={{ transform: 'rotate(180deg)' }} /> Voltar
              </button>

              {passo === 1 && (
                <>
                  <h1>Monte sua simulação</h1>
                  <p className="fluxo-sub">{produto.nome}</p>
                  <div className="form-grade">
                    <div className="span-2">
                      <Campo rotulo={produto.rotuloValor ?? 'Valor que você precisa'} erro={erros.valor} ajuda={`De ${moeda(produto.valorMin)} a ${moeda(produto.valorMax)}`}>
                        <input className="input-grande" value={valorTxt} inputMode="numeric" onChange={(e) => setValorTxt(mascaraMoeda(e.target.value))} />
                      </Campo>
                    </div>
                    <div className="span-2">
                      <span className="campo-rotulo">Prazo</span>
                      <div className="simulador-prazos">
                        {produto.prazos.map((m) => (
                          <button key={m} type="button" className={m === prazo ? 'ativo' : ''} onClick={() => setPrazo(m)}>{m}x</button>
                        ))}
                      </div>
                    </div>
                    {produto.camposExtras?.map((c) => (
                      <CampoDinamico key={c.id} c={c} valor={extras[c.id] ?? ''} erro={erros[c.id]} onChange={(v) => setExtras({ ...extras, [c.id]: v })} />
                    ))}
                  </div>
                  {r?.alerta && (
                    <div className="alerta">
                      <Icone nome="alerta" tamanho={18} />
                      <span>{r.alerta}</span>
                      {r.valorMaximo && r.valorMaximo >= produto.valorMin && (
                        <button type="button" onClick={() => setValorTxt(mascaraMoeda(String(r.valorMaximo)))}>Usar valor máximo</button>
                      )}
                    </div>
                  )}
                  <button className="btn btn--primario btn--lg btn--bloco" onClick={() => validarPasso1() && setPasso(2)}>
                    Continuar <Icone nome="seta" tamanho={20} />
                  </button>
                </>
              )}

              {passo === 2 && (
                <>
                  <h1>Pra quem enviamos a proposta?</h1>
                  <p className="fluxo-sub">Um especialista vai te chamar no WhatsApp com as opções dos bancos parceiros.</p>
                  <FormDados d={dados} set={setDados} erros={erros} pedirCpf />
                  <button className="btn btn--primario btn--lg btn--bloco" disabled={enviando} onClick={enviar}>
                    {enviando ? 'Enviando...' : 'Receber minha proposta'}
                  </button>
                  <p className="seguro"><Icone nome="cadeado" tamanho={16} /> Seus dados são protegidos e usados só pra esta solicitação.</p>
                </>
              )}
            </div>

            <aside className="resumo">
              <span className="resumo-produto"><Icone nome={produto.icone} tamanho={18} /> {produto.nomeCurto}</span>
              {r ? (
                <>
                  <small>Parcela estimada</small>
                  <strong className="resumo-parcela">{moeda(r.parcela, true)}</strong>
                  <dl>
                    <div><dt>Valor</dt><dd>{moeda(valor)}</dd></div>
                    <div><dt>Prazo</dt><dd>{prazoTexto(prazo)}</dd></div>
                    <div><dt>{destaqueTaxa(produto).rotulo}</dt><dd>{destaqueTaxa(produto).valor}{produto.modalidade === 'credito' ? ` (${destaqueTaxa(produto).detalhe})` : ''}</dd></div>
                    <div><dt>Total estimado</dt><dd>{moeda(r.total)}</dd></div>
                  </dl>
                  <p className="nota">
                    {produto.modalidade === 'consorcio'
                      ? 'Carta + taxa de administração divididas pelo prazo. Fundo de reserva e seguro variam por administradora.'
                      : 'Cálculo pela tabela Price, sem IOF e seguros. O CET real aparece na proposta.'}
                  </p>
                </>
              ) : (
                <p className="resumo-vazio">Preencha valor e prazo pra ver a parcela.</p>
              )}
              <ul className="resumo-provas">
                <li><Icone nome="check" tamanho={16} /> Sem taxa antecipada</li>
                <li><Icone nome="check" tamanho={16} /> Não afeta seu score</li>
                <li><Icone nome="check" tamanho={16} /> Especialista humano</li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

// ---------- obrigado ----------

export function Obrigado() {
  const l = ultimoLead()
  return (
    <section className="obrigado">
      <div className="container container--estreito">
        <span className="obrigado-ic"><Icone nome="check" tamanho={36} /></span>
        <h1>{l ? `Recebemos, ${l.nome.split(' ')[0]}!` : 'Recebemos sua solicitação!'}</h1>
        <p>
          Um especialista da {marca.nome} vai te chamar no WhatsApp em até 24h úteis. Se preferir adiantar, fale com a gente agora.
        </p>
        {l && (
          <a className="btn btn--whats btn--lg" href={whatsDoLead(l)} target="_blank" rel="noopener noreferrer">
            <IconeWhatsApp tamanho={22} /> Adiantar pelo WhatsApp
          </a>
        )}
        <div className="obrigado-proximos">
          <h2>Enquanto isso</h2>
          <ul className="lista">
            <li><span className="lista-ic"><Icone nome="documento" tamanho={16} /></span>Separe RG, CPF e comprovante de renda.</li>
            <li><span className="lista-ic"><Icone nome="alerta" tamanho={16} /></span>Nunca faça depósito antecipado para liberar crédito. A {marca.nome} não cobra nada antes.</li>
          </ul>
        </div>
        <Link para="/" className="link-seta">Voltar para o início <Icone nome="seta" tamanho={16} /></Link>
      </div>
    </section>
  )
}
