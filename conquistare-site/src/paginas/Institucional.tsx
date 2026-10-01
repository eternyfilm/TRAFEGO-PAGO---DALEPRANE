import { useMemo, useState } from 'react'
import { marca, linkWhatsApp } from '../config/marca'
import { faqGeral, missao, numeros, valores, visao } from '../config/conteudo'
import { produtosAtivos } from '../config/produtos'
import { Link, navegar } from '../lib/router'
import { emailValido, mascaraCPF, mascaraTelefone, telefoneValido, cpfValido } from '../lib/formatos'
import { enviarLead } from '../lib/leads'
import { Acordeao, Bancos, Cabecalho, Cifrao, Secao } from '../ui/Comuns'
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
        titulo="Sua solução financeira completa"
        texto="Na Conquistare, acreditamos que o sucesso financeiro está ao alcance de todos. Nossos serviços são pensados pra você tomar decisões sólidas e conquistar seus objetivos de vida."
      />
      <Secao>
        <div className="duas-colunas">
          <div>
            <Cabecalho sobre="Bem-vindo à Conquistare Cred" titulo="Conquistar é verbo de quem planeja." />
            <p className="texto-longo">
              Oferecemos uma ampla gama de produtos e serviços financeiros, projetados pra atender às diferentes necessidades dos nossos
              clientes: financiamento imobiliário, empréstimo consignado, consórcio e correspondência bancária.
            </p>
            <p className="texto-longo">
              Como correspondente multibancos, trabalhamos com Caixa, BRB, Santander, Itaú, Bradesco, Poupex e Inter. Nossa consultoria é
              direcionada pro perfil de cada cliente, e acompanhamos tudo desde a aprovação até o recurso chegar no vendedor.
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
      <Secao tom="escuro" className="secao--cifrao">
        <Cifrao className="secao-cifrao" />
        <div className="duas-colunas">
          <div className="mv">
            <span className="sobretitulo">Missão</span>
            <p>{missao}</p>
          </div>
          <div className="mv">
            <span className="sobretitulo">Visão</span>
            <p>{visao}</p>
          </div>
        </div>
      </Secao>
      <Secao tom="creme">
        <Cabecalho sobre="Valores" titulo="No que a gente acredita" centro />
        <div className="grade-valores">
          {valores.map((v) => (
            <div key={v.titulo} className="beneficio">
              <span className="beneficio-ic"><Icone nome="check" /></span>
              <h3>{v.titulo}</h3>
              <p>{v.texto}</p>
            </div>
          ))}
        </div>
      </Secao>
      <Secao>
        <Cabecalho sobre="Bancos parceiros" titulo="Com quem trabalhamos" centro />
        <Bancos />
      </Secao>
    </>
  )
}

// ---------- Parceiros (imobiliárias e corretores) ----------

export function Parceiros() {
  const [f, setF] = useState({ empresa: '', nome: '', perfil: '', telefone: '', email: '', volume: '' })
  const [erros, setErros] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    const e: Record<string, string> = {}
    if (!f.nome.trim()) e.nome = 'Informe seu nome'
    if (!f.perfil) e.perfil = 'Selecione'
    if (!telefoneValido(f.telefone)) e.telefone = 'Celular com DDD'
    if (!emailValido(f.email)) e.email = 'E-mail inválido'
    setErros(e)
    if (Object.keys(e).length) return
    setEnviando(true)
    await enviarLead({
      produto: 'parceiros',
      produtoNome: 'Parceria (imobiliária/corretor)',
      nome: f.nome,
      telefone: f.telefone,
      email: f.email,
      extras: { empresa: f.empresa, perfil: f.perfil, volume: f.volume },
      origem: '/parceiros',
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

  const select = (k: keyof typeof f, rotulo: string, opcoes: string[]) => (
    <label className={`campo ${erros[k] ? 'campo--erro' : ''}`}>
      <span className="campo-rotulo">{rotulo}</span>
      <select value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>
        <option value="">Selecione</option>
        {opcoes.map((o) => <option key={o}>{o}</option>)}
      </select>
      {erros[k] && <span className="campo-erro">{erros[k]}</span>}
    </label>
  )

  return (
    <>
      <section className="hero hero--marca hero--produto">
        <Cifrao className="hero-cifrao" />
        <div className="container hero-grade">
          <div className="hero-texto">
            <span className="selo selo--escuro"><Icone nome="empresa" tamanho={16} /> Imobiliárias, corretores e construtoras</span>
            <h1>Seu cliente aprovado em até <em>1 hora</em>. Você fecha mais.</h1>
            <p className="hero-sub">
              A Conquistare cuida do crédito do seu cliente do começo ao fim: aprovação, avaliação, jurídico, assinatura e registro, até o
              recurso cair na conta do vendedor.
            </p>
            <ul className="hero-provas">
              <li><Icone nome="relogio" tamanho={18} /> Aprovação de crédito em até 1 hora</li>
              <li><Icone nome="balanca" tamanho={18} /> 7 bancos pra encaixar cada perfil</li>
              <li><Icone nome="check" tamanho={18} /> Status do processo sempre atualizado pra você</li>
            </ul>
          </div>
          <div className="hero-sim">
            <div className="simulador">
              <div className="simulador-corpo">
                <h3 className="cotacao-titulo">Quero ser parceiro</h3>
                <div className="form-grade">
                  {campo('nome', 'Seu nome', { autoComplete: 'name' })}
                  {select('perfil', 'Você é', ['Corretor autônomo', 'Imobiliária', 'Construtora / incorporadora', 'Outro'])}
                  <div className="span-2">{campo('empresa', 'Imobiliária ou empresa (opcional)')}</div>
                  {campo('telefone', 'Celular', { inputMode: 'tel', placeholder: '(61) 99999-9999' })}
                  {campo('email', 'E-mail', { type: 'email' })}
                  <div className="span-2">{select('volume', 'Vendas financiadas por mês', ['1 a 2', '3 a 5', '6 a 10', 'Mais de 10'])}</div>
                </div>
                <button className="btn btn--primario btn--bloco btn--lg" disabled={enviando} onClick={enviar}>
                  {enviando ? 'Enviando...' : 'Quero ser parceiro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Secao tom="creme">
        <Cabecalho sobre="Como funciona" titulo="Você indica, a gente cuida do crédito" centro />
        <ol className="passos passos--3">
          {[
            ['Indique o cliente', 'Mande os dados pelo WhatsApp ou formulário. A gente faz a simulação na hora.'],
            ['Aprovação rápida', 'Crédito analisado em até 1 hora no banco que melhor encaixa o perfil.'],
            ['Até o registro', 'Acompanhamos avaliação, jurídico, assinatura e registro. Você recebe cada atualização.'],
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
