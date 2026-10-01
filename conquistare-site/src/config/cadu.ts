// Roteiro do Cadú, assistente virtual da Conquistare.
//
// CONTEÚDO PROVISÓRIO: as falas e os caminhos abaixo são um ponto de partida.
// Revisar com a Aline e a Zizi (o que ele resolve sozinho, quando passa pra
// uma pessoa, tom de voz). Mexer aqui não exige mexer no componente do chat.
//
// Como funciona:
// - Cada "nó" é um momento da conversa: o que o Cadú fala + os botões.
// - Cada botão tem uma ação: ir pra outro nó, abrir uma página do site,
//   abrir o WhatsApp ou pedir nome e celular (vira lead, igual ao simulador).
// - Se a pessoa digitar em vez de clicar, o Cadú procura a resposta nas
//   perguntas frequentes (FAQ geral + FAQ dos produtos) e nos atalhos abaixo.

import { faqGeral } from './conteudo'
import { produtosAtivos } from './produtos'

export type Acao =
  | { tipo: 'ir'; no: string }
  | { tipo: 'pagina'; para: string }
  | { tipo: 'whatsapp'; mensagem?: string }
  | { tipo: 'lead'; produto: string; produtoNome: string }

export interface Opcao {
  rotulo: string
  acao: Acao
}

export interface No {
  mensagens: string[]
  opcoes: Opcao[]
}

const voltar: Opcao = { rotulo: 'Voltar ao início', acao: { tipo: 'ir', no: 'inicio' } }
const pessoa: Opcao = { rotulo: 'Falar com uma pessoa', acao: { tipo: 'ir', no: 'pessoa' } }

export const nos: Record<string, No> = {
  inicio: {
    mensagens: ['Oi! Eu sou o Cadú, assistente virtual da Conquistare. 👋', 'O que você quer conquistar hoje?'],
    opcoes: [
      { rotulo: 'Financiar um imóvel', acao: { tipo: 'ir', no: 'financiamento' } },
      { rotulo: 'Fazer um consórcio', acao: { tipo: 'ir', no: 'consorcio' } },
      { rotulo: 'Empréstimo consignado', acao: { tipo: 'ir', no: 'consignado' } },
      { rotulo: 'Tirar uma dúvida', acao: { tipo: 'ir', no: 'duvidas' } },
      pessoa,
    ],
  },

  financiamento: {
    mensagens: [
      'Boa escolha! Aqui o financiamento tem aprovação de crédito em até 1 hora. ⚡',
      'A gente compara Caixa, BRB, Santander, Itaú, Bradesco, Poupex e Inter pro seu perfil e acompanha tudo até o registro.',
      'Você já escolheu o imóvel?',
    ],
    opcoes: [
      { rotulo: 'Já escolhi', acao: { tipo: 'ir', no: 'financiamento-escolhido' } },
      { rotulo: 'Ainda estou procurando', acao: { tipo: 'ir', no: 'financiamento-procurando' } },
      { rotulo: 'É um lote/terreno', acao: { tipo: 'pagina', para: '/financiamento/lote' } },
      voltar,
    ],
  },
  'financiamento-escolhido': {
    mensagens: ['Então vamos agilizar! Dá pra simular a parcela agora ou eu peço pra um consultor te chamar.'],
    opcoes: [
      { rotulo: 'Simular a parcela', acao: { tipo: 'pagina', para: '/simular?produto=financiamento-imobiliario' } },
      { rotulo: 'Quero que me chamem', acao: { tipo: 'lead', produto: 'financiamento-imobiliario', produtoNome: 'Financiamento imobiliário' } },
      voltar,
    ],
  },
  'financiamento-procurando': {
    mensagens: [
      'Dica de quem entende: aprovar o crédito antes de fechar o imóvel te dá poder de negociação. 😉',
      'Você sabe exatamente quanto pode financiar e negocia com mais segurança.',
    ],
    opcoes: [
      { rotulo: 'Quero saber quanto posso financiar', acao: { tipo: 'lead', produto: 'financiamento-imobiliario', produtoNome: 'Financiamento imobiliário (pré-aprovação)' } },
      { rotulo: 'Simular sozinho', acao: { tipo: 'pagina', para: '/simular?produto=financiamento-imobiliario' } },
      voltar,
    ],
  },

  consorcio: {
    mensagens: [
      'Consórcio é pra quem quer conquistar sem pagar juros. 💜',
      'Você paga só a taxa de administração e pode ser contemplado por sorteio ou lance. É pra imóvel ou veículo?',
    ],
    opcoes: [
      { rotulo: 'Imóvel', acao: { tipo: 'ir', no: 'consorcio-imovel' } },
      { rotulo: 'Veículo', acao: { tipo: 'ir', no: 'consorcio-veiculo' } },
      { rotulo: 'Consórcio ou financiamento?', acao: { tipo: 'ir', no: 'consorcio-x-financiamento' } },
      voltar,
    ],
  },
  'consorcio-imovel': {
    mensagens: ['Show! Quer ver quanto fica a parcela da carta de crédito?'],
    opcoes: [
      { rotulo: 'Simular consórcio de imóvel', acao: { tipo: 'pagina', para: '/simular?produto=consorcio-imovel' } },
      { rotulo: 'Quero que me chamem', acao: { tipo: 'lead', produto: 'consorcio-imovel', produtoNome: 'Consórcio de imóvel' } },
      voltar,
    ],
  },
  'consorcio-veiculo': {
    mensagens: ['Carro, moto ou caminhão, a carta serve pra todos. Bora simular?'],
    opcoes: [
      { rotulo: 'Simular consórcio de veículo', acao: { tipo: 'pagina', para: '/simular?produto=consorcio-veiculo' } },
      { rotulo: 'Quero que me chamem', acao: { tipo: 'lead', produto: 'consorcio-veiculo', produtoNome: 'Consórcio de veículo' } },
      voltar,
    ],
  },
  'consorcio-x-financiamento': {
    mensagens: [
      'Resumindo bem: financiamento te dá o bem agora, com juros. Consórcio não tem juros, mas pede planejamento.',
      'Tem pressa? Financiamento. Pode esperar e quer pagar menos no total? Consórcio. Eu posso pedir pra um consultor simular os dois pra você.',
    ],
    opcoes: [
      { rotulo: 'Quero comparar os dois', acao: { tipo: 'lead', produto: 'comparativo', produtoNome: 'Comparar consórcio x financiamento' } },
      { rotulo: 'Ver o comparativo no site', acao: { tipo: 'pagina', para: '/#produtos' } },
      voltar,
    ],
  },

  consignado: {
    mensagens: ['O consignado tem parcela descontada direto da folha ou do benefício, por isso a taxa é menor. Qual é o seu caso?'],
    opcoes: [
      { rotulo: 'Aposentado ou pensionista INSS', acao: { tipo: 'pagina', para: '/simular?produto=consignado-inss' } },
      { rotulo: 'Servidor público', acao: { tipo: 'pagina', para: '/simular?produto=consignado-inss' } },
      { rotulo: 'Carteira assinada (CLT)', acao: { tipo: 'pagina', para: '/simular?produto=consignado-clt' } },
      { rotulo: 'Quero que me chamem', acao: { tipo: 'lead', produto: 'consignado', produtoNome: 'Empréstimo consignado' } },
      voltar,
    ],
  },

  duvidas: {
    mensagens: ['Pode digitar sua pergunta aqui embaixo, ou escolher uma das mais comuns:'],
    opcoes: [
      ...faqGeral.slice(0, 4).map((f, i) => ({ rotulo: f.p, acao: { tipo: 'ir', no: `faq-${i}` } as Acao })),
      pessoa,
    ],
  },

  pessoa: {
    mensagens: ['Claro! O time da Conquistare atende pelo WhatsApp em horário comercial. Posso te mandar pra lá agora ou pedir pra te chamarem.'],
    opcoes: [
      { rotulo: 'Abrir o WhatsApp', acao: { tipo: 'whatsapp' } },
      { rotulo: 'Quero que me chamem', acao: { tipo: 'lead', produto: 'atendimento', produtoNome: 'Atendimento pelo chat' } },
      voltar,
    ],
  },

  'nao-entendi': {
    mensagens: ['Hmm, essa eu ainda não sei responder. 😅 Mas o time da Conquistare sabe! Quer falar com uma pessoa?'],
    opcoes: [{ rotulo: 'Abrir o WhatsApp', acao: { tipo: 'whatsapp' } }, { rotulo: 'Ver outras dúvidas', acao: { tipo: 'ir', no: 'duvidas' } }, voltar],
  },

  'lead-ok': {
    mensagens: ['Prontinho! ✅ Um consultor da Conquistare vai te chamar no WhatsApp. Se quiser adiantar, é só tocar aqui embaixo.'],
    opcoes: [{ rotulo: 'Adiantar pelo WhatsApp', acao: { tipo: 'whatsapp' } }, voltar],
  },
}

// Nós gerados a partir do FAQ geral (respostas clicáveis em "Tirar uma dúvida").
faqGeral.forEach((f, i) => {
  nos[`faq-${i}`] = {
    mensagens: [f.r],
    opcoes: [{ rotulo: 'Outra dúvida', acao: { tipo: 'ir', no: 'duvidas' } }, pessoa, voltar],
  }
})

// Base pra quando a pessoa digita: FAQ geral + FAQ de cada produto.
export const baseDeRespostas = [...faqGeral, ...produtosAtivos.flatMap((p) => p.faq)]

// Atalhos por palavra-chave (sem acento, minúsculo). Checados antes do FAQ.
export const atalhos: { termos: string[]; no: string }[] = [
  { termos: ['atendente', 'humano', 'pessoa', 'zizi', 'whatsapp', 'ligar', 'telefone'], no: 'pessoa' },
  { termos: ['consorcio', 'carta de credito', 'contemplacao', 'lance', 'sorteio'], no: 'consorcio' },
  { termos: ['consignado', 'emprestimo', 'inss', 'aposentado', 'pensionista', 'servidor', 'clt'], no: 'consignado' },
  { termos: ['financiamento', 'financiar', 'casa', 'apartamento', 'imovel', 'fgts', 'sfh'], no: 'financiamento' },
  { termos: ['lote', 'terreno'], no: 'financiamento' },
]

export const mensagensLead = {
  nome: 'Show! Pra eu passar pro consultor, qual é o seu nome?',
  telefone: (nome: string) => `Prazer, ${nome}! Qual o seu celular com DDD? (é por ele que vamos te chamar no WhatsApp)`,
  telefoneInvalido: 'Hmm, esse número não parece certo. Me manda com DDD, tipo (61) 99999-9999.',
  consentimento: 'Ao enviar, você autoriza a Conquistare a entrar em contato sobre essa solicitação.',
}
