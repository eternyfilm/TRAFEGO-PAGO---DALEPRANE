import { useMemo, useState } from 'react'
import { marca, linkWhatsApp } from '../config/marca'
import { faqGeral, numeros } from '../config/conteudo'
import { produtosAtivos } from '../config/produtos'
import { Link, navegar } from '../lib/router'
import { emailValido, mascaraCPF, mascaraTelefone, telefoneValido, cpfValido } from '../lib/formatos'
import { enviarLead } from '../lib/leads'
import { Acordeao, Cabecalho, Lista, Secao } from '../ui/Comuns'
import { Icone, IconeInstagram, IconeWhatsApp } from '../ui/Icones'

function TopoPagina({ sobre, titulo, texto }: { sobre: string; titulo: string; texto?: string }) {
  return (
    <section className="topo-pagina">
      <div className="container">
        <span className="sobretitulo">{sobre}</span>
        <h1>{titulo}</h1>
        {texto && <p>{texto}</p>}
      </div>
    </section>
  )
}

// ---------- Sobre ----------

export function Sobre() {
  return (
    <>
      <TopoPagina
        sobre="Quem somos"
        titulo="A gente existe pra que crédito seja ferramenta, não armadilha."
        texto={`A ${marca.nome} nasceu pra aproximar as pessoas do crédito certo: com taxa justa, informação clara e alguém de verdade do lado.`}
      />
      <Secao>
        <div className="duas-colunas">
          <div>
            <Cabecalho sobre="Nossa história" titulo="Conquistar é verbo de quem constrói." />
            <p className="texto-longo">
              [Espaço para a história da Conquistare: quando e por que nasceu, quem são os fundadores e qual foi o momento que motivou a
              empresa. Uma história real e específica aqui vale mais que qualquer frase de missão.]
            </p>
            <p className="texto-longo">
              Hoje conectamos pessoas e empresas aos bancos parceiros, comparamos propostas e acompanhamos cada contrato até o fim. Nosso
              trabalho só termina quando a parcela cabe no mês e o cliente entende exatamente o que assinou.
            </p>
          </div>
          <div className="grade-numeros-card">
            {numeros.map((n) => (
              <div key={n.rotulo} className="numero-card">
                <strong>{n.valor}</strong>
                <span>{n.rotulo}</span>
              </div>
            ))}
          </div>
        </div>
      </Secao>
      <Secao tom="creme">
        <Cabecalho sobre="No que acreditamos" titulo="Nossos compromissos" centro />
        <div className="grade-beneficios">
          {[
            ['Transparência total', 'CET, parcela e total a pagar mostrados antes de qualquer assinatura.'],
            ['Nada antecipado', 'Nunca cobramos para liberar crédito. Nunca.'],
            ['Crédito responsável', 'Se a parcela não cabe, a gente fala. Mesmo que isso signifique não fechar.'],
            ['Gente atendendo gente', 'Especialista com nome, que acompanha você do início ao fim.'],
          ].map(([t, x]) => (
            <div key={t} className="beneficio">
              <span className="beneficio-ic"><Icone nome="check" /></span>
              <h3>{t}</h3>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </Secao>
      <Secao>
        <Cabecalho sobre="Parceiros" titulo="Instituições com quem trabalhamos" centro />
        <div className="parceiros">
          {marca.legal.parceiros.map((p) => <span key={p}>{p}</span>)}
        </div>
      </Secao>
    </>
  )
}

// ---------- Empresas ----------

export function Empresas() {
  const [f, setF] = useState({ empresa: '', nome: '', cargo: '', telefone: '', email: '', funcionarios: '' })
  const [erros, setErros] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    const e: Record<string, string> = {}
    if (!f.empresa.trim()) e.empresa = 'Informe a empresa'
    if (!f.nome.trim()) e.nome = 'Informe seu nome'
    if (!telefoneValido(f.telefone)) e.telefone = 'Celular com DDD'
    if (!emailValido(f.email)) e.email = 'E-mail inválido'
    if (!f.funcionarios) e.funcionarios = 'Selecione'
    setErros(e)
    if (Object.keys(e).length) return
    setEnviando(true)
    await enviarLead({
      produto: 'empresas',
      produtoNome: 'Consignado para empresas',
      nome: f.nome,
      telefone: f.telefone,
      email: f.email,
      extras: { empresa: f.empresa, cargo: f.cargo, funcionarios: f.funcionarios },
      origem: '/empresas',
    })
    navegar('/obrigado')
  }

  const campo = (k: keyof typeof f, rotulo: string, extra: Record<string, string> = {}) => (
    <label className={`campo ${erros[k] ? 'campo--erro' : ''}`}>
      <span className="campo-rotulo">{rotulo}</span>
      <input
        value={f[k]}
        {...extra}
        onChange={(e) => setF({ ...f, [k]: k === 'telefone' ? mascaraTelefone(e.target.value) : e.target.value })}
      />
      {erros[k] && <span className="campo-erro">{erros[k]}</span>}
    </label>
  )

  return (
    <>
      <section className="hero hero--produto">
        <div className="container hero-grade">
          <div className="hero-texto">
            <span className="selo"><Icone nome="empresa" tamanho={16} /> Para empresas</span>
            <h1>Colaborador sem dívida cara trabalha melhor.</h1>
            <p className="hero-sub">
              Ofereça consignado com taxa reduzida como benefício. Implantação sem custo, sem mudar sua folha e com suporte dedicado ao RH.
            </p>
            <Lista itens={['Custo zero para a empresa', 'Integração simples com a folha', 'Educação financeira para o time', 'Atendimento direto aos colaboradores']} />
          </div>
          <div className="hero-sim">
            <div className="simulador">
              <div className="simulador-corpo">
                <h3 className="cotacao-titulo">Fale com nosso time corporativo</h3>
                <div className="form-grade">
                  <div className="span-2">{campo('empresa', 'Empresa')}</div>
                  {campo('nome', 'Seu nome', { autoComplete: 'name' })}
                  {campo('cargo', 'Cargo')}
                  {campo('telefone', 'Celular', { inputMode: 'tel', placeholder: '(61) 99999-9999' })}
                  {campo('email', 'E-mail corporativo', { type: 'email' })}
                  <label className={`campo span-2 ${erros.funcionarios ? 'campo--erro' : ''}`}>
                    <span className="campo-rotulo">Número de colaboradores</span>
                    <select value={f.funcionarios} onChange={(e) => setF({ ...f, funcionarios: e.target.value })}>
                      <option value="">Selecione</option>
                      {['Até 50', '51 a 200', '201 a 1.000', 'Mais de 1.000'].map((o) => <option key={o}>{o}</option>)}
                    </select>
                    {erros.funcionarios && <span className="campo-erro">{erros.funcionarios}</span>}
                  </label>
                </div>
                <button className="btn btn--primario btn--bloco btn--lg" disabled={enviando} onClick={enviar}>
                  {enviando ? 'Enviando...' : 'Quero oferecer o benefício'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Secao tom="creme">
        <Cabecalho sobre="Como funciona" titulo="Implantação em 3 passos" centro />
        <ol className="passos passos--3">
          {[
            ['Convênio', 'Formalizamos a parceria sem custo e sem alterar seus processos.'],
            ['Divulgação', 'Entregamos materiais prontos pro time conhecer o benefício.'],
            ['Atendimento', 'Nós atendemos cada colaborador. O RH só confirma a margem.'],
          ].map(([t, x], i) => (
            <li key={t} className="passo">
              <span className="passo-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{x}</p>
            </li>
          ))}
        </ol>
      </Secao>
    </>
  )
}

// ---------- Ajuda ----------

export function Ajuda() {
  const [busca, setBusca] = useState('')
  const grupos = useMemo(() => {
    const todos = [{ titulo: 'Geral', itens: faqGeral }, ...produtosAtivos.map((p) => ({ titulo: p.nome, itens: p.faq }))]
    const t = busca.trim().toLowerCase()
    if (!t) return todos
    return todos
      .map((g) => ({ ...g, itens: g.itens.filter((i) => (i.p + ' ' + i.r).toLowerCase().includes(t)) }))
      .filter((g) => g.itens.length)
  }, [busca])

  return (
    <>
      <section className="topo-pagina">
        <div className="container">
          <span className="sobretitulo">Central de ajuda</span>
          <h1>Como podemos ajudar?</h1>
          <div className="busca">
            <Icone nome="busca" />
            <input placeholder="Busque por CET, portabilidade, documentos..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>
      </section>
      <Secao>
        <div className="container--estreito ajuda">
          {grupos.length === 0 && <p className="resumo-vazio">Nada encontrado pra "{busca}". Fale com a gente pelo WhatsApp.</p>}
          {grupos.map((g) => (
            <div key={g.titulo} className="ajuda-grupo">
              <h2>{g.titulo}</h2>
              <Acordeao key={busca + g.titulo} itens={g.itens} />
            </div>
          ))}
        </div>
      </Secao>
      <Canais />
    </>
  )
}

function Canais() {
  return (
    <Secao tom="creme">
      <Cabecalho titulo="Ainda com dúvida? Fale com uma pessoa." centro />
      <div className="canais">
        <a className="canal" href={linkWhatsApp(`Olá, ${marca.nome}! Preciso de ajuda.`)} target="_blank" rel="noopener noreferrer">
          <IconeWhatsApp tamanho={28} />
          <strong>WhatsApp</strong>
          <span>{marca.contato.telefoneExibicao}</span>
        </a>
        <a className="canal" href={`mailto:${marca.contato.email}`}>
          <Icone nome="email" tamanho={28} />
          <strong>E-mail</strong>
          <span>{marca.contato.email}</span>
        </a>
        <a className="canal" href={marca.redes.instagram} target="_blank" rel="noopener noreferrer">
          <IconeInstagram tamanho={28} />
          <strong>Instagram</strong>
          <span>@conquistarecred</span>
        </a>
      </div>
      <p className="nota centro">{marca.contato.horario}</p>
    </Secao>
  )
}

// ---------- Contato ----------

export function Contato() {
  const [f, setF] = useState({ nome: '', telefone: '', email: '', mensagem: '' })
  const [erros, setErros] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    const e: Record<string, string> = {}
    if (!f.nome.trim()) e.nome = 'Informe seu nome'
    if (!telefoneValido(f.telefone)) e.telefone = 'Celular com DDD'
    if (f.email && !emailValido(f.email)) e.email = 'E-mail inválido'
    if (f.mensagem.trim().length < 5) e.mensagem = 'Conte um pouco mais'
    setErros(e)
    if (Object.keys(e).length) return
    setEnviando(true)
    await enviarLead({ produto: 'contato', produtoNome: 'Contato', nome: f.nome, telefone: f.telefone, email: f.email, mensagem: f.mensagem, extras: {}, origem: '/contato' })
    navegar('/obrigado')
  }

  return (
    <>
      <TopoPagina sobre="Contato" titulo="Fale com a gente" texto="Resposta em até 24h úteis. Pelo WhatsApp costuma ser bem mais rápido." />
      <Secao>
        <div className="container--estreito">
          <div className="form-grade">
            <label className={`campo ${erros.nome ? 'campo--erro' : ''}`}>
              <span className="campo-rotulo">Nome</span>
              <input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
              {erros.nome && <span className="campo-erro">{erros.nome}</span>}
            </label>
            <label className={`campo ${erros.telefone ? 'campo--erro' : ''}`}>
              <span className="campo-rotulo">Celular</span>
              <input value={f.telefone} inputMode="tel" onChange={(e) => setF({ ...f, telefone: mascaraTelefone(e.target.value) })} />
              {erros.telefone && <span className="campo-erro">{erros.telefone}</span>}
            </label>
            <label className={`campo span-2 ${erros.email ? 'campo--erro' : ''}`}>
              <span className="campo-rotulo">E-mail (opcional)</span>
              <input value={f.email} type="email" onChange={(e) => setF({ ...f, email: e.target.value })} />
              {erros.email && <span className="campo-erro">{erros.email}</span>}
            </label>
            <label className={`campo span-2 ${erros.mensagem ? 'campo--erro' : ''}`}>
              <span className="campo-rotulo">Mensagem</span>
              <textarea rows={5} value={f.mensagem} onChange={(e) => setF({ ...f, mensagem: e.target.value })} />
              {erros.mensagem && <span className="campo-erro">{erros.mensagem}</span>}
            </label>
          </div>
          <button className="btn btn--primario btn--lg" disabled={enviando} onClick={enviar}>{enviando ? 'Enviando...' : 'Enviar mensagem'}</button>
        </div>
      </Secao>
      <Canais />
    </>
  )
}

// ---------- Área do cliente ----------

// Sem backend de propostas ainda: a "área do cliente" identifica a pessoa e
// leva pro WhatsApp com o CPF, onde o especialista informa o status.
// Quando houver sistema de propostas, é aqui que entra o login de verdade.
export function Entrar() {
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')
  function continuar() {
    if (!cpfValido(cpf)) return setErro('CPF inválido')
    window.open(linkWhatsApp(`Olá, ${marca.nome}! Quero acompanhar minha proposta. CPF: ${cpf}`), '_blank', 'noopener')
  }
  return (
    <section className="entrar">
      <div className="entrar-card">
        <span className="obrigado-ic"><Icone nome="pessoa" tamanho={28} /></span>
        <h1>Área do cliente</h1>
        <p>Acompanhe sua proposta com o seu especialista.</p>
        <label className={`campo ${erro ? 'campo--erro' : ''}`}>
          <span className="campo-rotulo">CPF</span>
          <input value={cpf} inputMode="numeric" placeholder="000.000.000-00" onChange={(e) => { setCpf(mascaraCPF(e.target.value)); setErro('') }} />
          {erro && <span className="campo-erro">{erro}</span>}
        </label>
        <button className="btn btn--primario btn--bloco btn--lg" onClick={continuar}>Acompanhar proposta</button>
        <p className="nota">Ainda não é cliente? <Link para="/simular">Faça uma simulação</Link>.</p>
      </div>
    </section>
  )
}

// ---------- Legal ----------

export function Privacidade() {
  return (
    <article className="artigo container container--estreito legal">
      <h1>Política de privacidade</h1>
      <p className="artigo-lead">Como a {marca.nome} coleta, usa e protege seus dados, de acordo com a LGPD (Lei nº 13.709/2018).</p>
      <div className="artigo-corpo">
        <p><em>Modelo inicial. Revisar com o jurídico da {marca.nome} antes de publicar.</em></p>
        <h2>Dados que coletamos</h2>
        <p>Nome, CPF, telefone, e-mail, cidade, informações financeiras informadas na simulação (renda, valor do bem, valor desejado) e dados de navegação (cookies), quando autorizados.</p>
        <h2>Para que usamos</h2>
        <ul>
          <li>Entrar em contato sobre a sua solicitação</li>
          <li>Encaminhar seu perfil às instituições financeiras parceiras para análise de crédito, com sua autorização</li>
          <li>Medir e melhorar nossos anúncios e o site (cookies de terceiros, só com consentimento)</li>
          <li>Cumprir obrigações legais e regulatórias</li>
        </ul>
        <h2>Compartilhamento</h2>
        <p>Seus dados podem ser compartilhados com instituições financeiras e seguradoras parceiras exclusivamente para a análise e contratação solicitada. Não vendemos dados pessoais.</p>
        <h2>Seus direitos</h2>
        <p>Você pode pedir acesso, correção, portabilidade ou exclusão dos seus dados e revogar consentimentos a qualquer momento pelo e-mail {marca.contato.email}.</p>
        <h2>Contato do encarregado (DPO)</h2>
        <p>{marca.contato.email}</p>
      </div>
    </article>
  )
}

export function Termos() {
  return (
    <article className="artigo container container--estreito legal">
      <h1>Termos de uso</h1>
      <div className="artigo-corpo">
        <p><em>Modelo inicial. Revisar com o jurídico da {marca.nome} antes de publicar.</em></p>
        <h2>Sobre o serviço</h2>
        <p>{marca.legal.aviso}</p>
        <h2>Simulações</h2>
        <p>Os valores exibidos nas simulações são estimativas calculadas a partir de taxas de referência e não constituem oferta ou proposta de crédito. Taxas, CET, prazos e valores finais dependem de análise da instituição financeira.</p>
        <h2>Cobranças</h2>
        <p>A {marca.nome} não cobra nenhum valor antecipado para intermediar ou liberar crédito.</p>
        <h2>Responsabilidades do usuário</h2>
        <p>O usuário se compromete a fornecer informações verdadeiras e atualizadas.</p>
      </div>
    </article>
  )
}

export function NaoEncontrada() {
  return (
    <section className="obrigado">
      <div className="container container--estreito">
        <h1>Página não encontrada</h1>
        <p>O endereço pode ter mudado. Que tal começar por uma simulação?</p>
        <div className="cta-final-botoes">
          <Link para="/" className="btn btn--fantasma btn--lg">Início</Link>
          <Link para="/simular" className="btn btn--primario btn--lg">Simular</Link>
        </div>
      </div>
    </section>
  )
}
