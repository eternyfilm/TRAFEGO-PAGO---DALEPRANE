// Catálogo de produtos. Cada página de produto, card, aba do simulador e item
// de menu sai daqui. Pra desligar um produto, `ativo: false`. Pra criar um
// novo, copie um bloco e ajuste.
//
// Linhas de produto tiradas do portfólio da Conquistare: financiamento
// imobiliário, empréstimo consignado, consórcio e correspondente bancário
// (7 bancos). TAXAS SÃO REFERÊNCIAS PROVISÓRIAS: substituir pelas taxas
// reais dos bancos parceiros antes de sair do modo rascunho.

export type Categoria = 'financiamentos' | 'emprestimos' | 'consorcios'
export type IconeProduto = 'casa' | 'carro' | 'carteira' | 'aposentado' | 'chave' | 'terreno' | 'predio'

// Campo extra pedido no simulador, além de valor e prazo.
export interface CampoExtra {
  id: string
  rotulo: string
  tipo: 'moeda' | 'texto' | 'select' | 'ano'
  opcoes?: string[]
  ajuda?: string
}

// Regra que limita o valor pedido.
export type Limite =
  | { tipo: 'percentualDoBem'; campo: string; percentual: number } // financiamento
  | { tipo: 'margemDaRenda'; campo: string; percentual: number } // consignado / renda

export interface Produto {
  slug: string
  ativo: boolean
  categoria: Categoria
  rota: string
  icone: IconeProduto
  nome: string
  nomeCurto: string
  chamada: string // frase de card
  titulo: string // H1 da página
  subtitulo: string
  // credito: juros pela tabela Price. consorcio: sem juros, taxa de administração.
  modalidade: 'credito' | 'consorcio'
  taxaMensal?: number // % a.m. a partir de (crédito)
  taxaAdm?: number // % total sobre a carta (consórcio)
  valorMin: number
  valorMax: number
  valorPadrao: number
  prazos: number[]
  prazoPadrao: number
  rotuloValor?: string // pergunta do simulador
  camposExtras?: CampoExtra[]
  limite?: Limite
  destaques: { titulo: string; texto: string }[]
  paraQuem: string[]
  documentos: string[]
  passos: { titulo: string; texto: string }[]
  faq: { p: string; r: string }[]
}

export const categorias: Record<Categoria, { nome: string; rota: string; titulo: string; texto: string }> = {
  financiamentos: {
    nome: 'Financiamentos',
    rota: '/financiamentos',
    titulo: 'Financie sua conquista com quem compara 7 bancos por você',
    texto: 'Casa, apartamento, lote ou carro. A gente leva seu perfil aos bancos parceiros e acompanha tudo até o dinheiro chegar no vendedor.',
  },
  emprestimos: {
    nome: 'Empréstimos',
    rota: '/emprestimos',
    titulo: 'Empréstimo com desconto em folha e taxa que cabe no mês',
    texto: 'Consignado pra aposentados, pensionistas, servidores e trabalhadores CLT, com processo simples e transparente.',
  },
  consorcios: {
    nome: 'Consórcios',
    rota: '/consorcios',
    titulo: 'Conquiste sem pagar juros',
    texto: 'Planeje a compra do imóvel ou do carro com parcelas que cabem no bolso e sem juros. Só taxa de administração, tudo às claras.',
  },
}

// Fluxo real do financiamento, do portfólio da Conquistare.
const etapasFinanciamento = [
  { titulo: 'Simulação', texto: 'Você escolhe valor e prazo e vê a parcela na hora.' },
  { titulo: 'Aprovação do crédito', texto: 'Levamos seu perfil aos bancos parceiros. Aprovação em até 1 hora.' },
  { titulo: 'Avaliação do imóvel', texto: 'O banco avalia o imóvel. A gente agenda e acompanha.' },
  { titulo: 'Análise jurídica', texto: 'Conferência de documentos e conformidade do imóvel e das partes.' },
  { titulo: 'Assinatura', texto: 'Escritura ou contrato com força de escritura.' },
  { titulo: 'Registro e liberação', texto: 'Registro em cartório e o recurso cai na conta do vendedor.' },
]

const passosConsignado = [
  { titulo: 'Simule', texto: 'Informe quanto precisa e veja a parcela na hora.' },
  { titulo: 'Fale com a gente', texto: 'Um consultor confere sua margem e compara os bancos parceiros.' },
  { titulo: 'Proposta clara', texto: 'Você vê taxa, CET e parcela final antes de decidir.' },
  { titulo: 'Dinheiro na conta', texto: 'Contrato assinado, valor liberado. Sem taxa antecipada.' },
]

const passosConsorcio = [
  { titulo: 'Escolha a carta', texto: 'Defina o valor do bem que você quer conquistar e o prazo.' },
  { titulo: 'Entre no grupo', texto: 'Você começa a pagar parcelas sem juros, só com taxa de administração.' },
  { titulo: 'Contemplação', texto: 'Por sorteio mensal ou por lance, quando você quiser antecipar.' },
  { titulo: 'Compre à vista', texto: 'Com a carta na mão, você negocia como comprador à vista.' },
]

export const produtos: Produto[] = [
  {
    slug: 'financiamento-imobiliario',
    ativo: true,
    categoria: 'financiamentos',
    rota: '/financiamento/imobiliario',
    icone: 'chave',
    nome: 'Financiamento imobiliário',
    nomeCurto: 'Financiamento imobiliário',
    chamada: 'Casa ou apartamento com aprovação em até 1 hora e 7 bancos comparados.',
    titulo: 'A chave da sua casa, com aprovação em até 1 hora',
    subtitulo:
      'Somos correspondente multibancos: levamos seu perfil a Caixa, BRB, Santander, Itaú, Bradesco, Poupex e Inter e acompanhamos cada etapa até o recurso chegar no vendedor.',
    modalidade: 'credito',
    taxaMensal: 0.95,
    valorMin: 100_000,
    valorMax: 5_000_000,
    valorPadrao: 400_000,
    prazos: [120, 240, 360, 420],
    prazoPadrao: 360,
    rotuloValor: 'Quanto você quer financiar?',
    camposExtras: [
      { id: 'valorBem', rotulo: 'Valor do imóvel', tipo: 'moeda' },
      { id: 'renda', rotulo: 'Renda familiar mensal', tipo: 'moeda' },
      { id: 'usoFgts', rotulo: 'Vai usar FGTS?', tipo: 'select', opcoes: ['Sim', 'Não', 'Não sei'] },
      { id: 'situacao', rotulo: 'O imóvel é', tipo: 'select', opcoes: ['Novo / na planta', 'Usado', 'Ainda estou procurando'] },
    ],
    limite: { tipo: 'percentualDoBem', campo: 'valorBem', percentual: 0.8 },
    destaques: [
      { titulo: 'Aprovação em até 1 hora', texto: 'Resposta rápida pra você não perder o imóvel que escolheu.' },
      { titulo: '7 bancos, uma conversa', texto: 'Caixa, BRB, Santander, Itaú, Bradesco, Poupex e Inter comparados pro seu perfil.' },
      { titulo: 'SFH, SFI e FGTS', texto: 'Orientação sobre a modalidade certa e o uso do FGTS na entrada.' },
      { titulo: 'Acompanhamento total', texto: 'Da simulação ao registro, com a gente cuidando da papelada.' },
    ],
    paraQuem: [
      'Vai comprar o primeiro imóvel',
      'Quer trocar de imóvel ou investir',
      'Quer usar o FGTS na entrada',
      'Não quer perder tempo indo de banco em banco',
    ],
    documentos: ['RG e CPF', 'Comprovante de renda', 'Comprovante de estado civil', 'Comprovante de residência', 'Extrato do FGTS (se for usar)'],
    passos: etapasFinanciamento,
    faq: [
      { p: 'Qual a entrada mínima?', r: 'Em geral 20% do valor do imóvel, e o FGTS pode compor essa entrada. Algumas linhas permitem entrada menor.' },
      { p: 'O que é SFH e SFI?', r: 'SFH é o Sistema Financeiro da Habitação, com regras e taxas mais favoráveis pra imóveis até um teto de valor, e permite uso do FGTS. SFI vale pra imóveis acima desse teto.' },
      { p: 'Vocês cobram pela assessoria?', r: 'A assessoria de crédito é remunerada pelos bancos parceiros. Você não paga nada a mais por isso.' },
      { p: 'A aprovação em 1 hora vale pra todo mundo?', r: 'A análise de crédito costuma sair em até 1 hora com a documentação completa. Avaliação, jurídico e registro têm prazos próprios, e a gente acompanha cada um.' },
    ],
  },
  {
    slug: 'financiamento-lote',
    ativo: true,
    categoria: 'financiamentos',
    rota: '/financiamento/lote',
    icone: 'terreno',
    nome: 'Financiamento de lote',
    nomeCurto: 'Lote e terreno',
    chamada: 'Financie o terreno hoje e construa no seu tempo.',
    titulo: 'O primeiro passo da casa dos seus sonhos é o lote',
    subtitulo: 'Financiamento de lotes e terrenos urbanos, com as taxas comparadas entre os bancos parceiros.',
    modalidade: 'credito',
    taxaMensal: 1.15,
    valorMin: 50_000,
    valorMax: 2_000_000,
    valorPadrao: 200_000,
    prazos: [60, 120, 180, 240],
    prazoPadrao: 180,
    rotuloValor: 'Quanto você quer financiar?',
    camposExtras: [
      { id: 'valorBem', rotulo: 'Valor do lote', tipo: 'moeda' },
      { id: 'renda', rotulo: 'Renda familiar mensal', tipo: 'moeda' },
      { id: 'regularizado', rotulo: 'O lote tem escritura/registro?', tipo: 'select', opcoes: ['Sim', 'Não', 'Não sei'] },
    ],
    limite: { tipo: 'percentualDoBem', campo: 'valorBem', percentual: 0.7 },
    destaques: [
      { titulo: 'Taxas comparadas', texto: 'Cada banco tem uma regra pra lote. A gente sabe qual combina com o seu caso.' },
      { titulo: 'Prazo longo', texto: 'Parcelas que cabem enquanto você planeja a obra.' },
      { titulo: 'Análise do terreno', texto: 'Conferimos documentação e regularidade antes de você assinar.' },
      { titulo: 'Depois, a construção', texto: 'Orientação sobre o crédito pra construir quando chegar a hora.' },
    ],
    paraQuem: ['Quer comprar terreno em condomínio ou loteamento', 'Planeja construir nos próximos anos'],
    documentos: ['RG e CPF', 'Comprovante de renda', 'Matrícula do lote', 'Comprovante de residência'],
    passos: etapasFinanciamento.map((e) => (e.titulo === 'Avaliação do imóvel' ? { ...e, titulo: 'Avaliação do lote' } : e)),
    faq: [{ p: 'Todo lote pode ser financiado?', r: 'O lote precisa estar regularizado, com matrícula e em área urbana. A gente confere isso antes de você fechar negócio.' }],
  },
  {
    slug: 'financiamento-veiculo',
    ativo: true, // CONFIRMAR com a Conquistare se opera financiamento de veículo
    categoria: 'financiamentos',
    rota: '/financiamento/veiculo',
    icone: 'carro',
    nome: 'Financiamento de veículo',
    nomeCurto: 'Financiamento de veículo',
    chamada: 'Novo ou seminovo, com a taxa comparada antes de você fechar na loja.',
    titulo: 'Carro novo sem cair na primeira taxa que aparece',
    subtitulo: 'Antes de fechar na concessionária, compare. A gente cota nos bancos parceiros e você decide com calma.',
    modalidade: 'credito',
    taxaMensal: 1.39,
    valorMin: 10_000,
    valorMax: 400_000,
    valorPadrao: 60_000,
    prazos: [24, 36, 48, 60],
    prazoPadrao: 48,
    rotuloValor: 'Quanto você quer financiar?',
    camposExtras: [
      { id: 'valorBem', rotulo: 'Valor do veículo', tipo: 'moeda' },
      { id: 'condicao', rotulo: 'Condição', tipo: 'select', opcoes: ['Zero km', 'Seminovo'] },
    ],
    limite: { tipo: 'percentualDoBem', campo: 'valorBem', percentual: 0.9 },
    destaques: [
      { titulo: 'Taxa comparada', texto: 'Cotação em mais de um banco antes de você assinar.' },
      { titulo: 'Novo ou seminovo', texto: 'Carros, motos e utilitários.' },
      { titulo: 'Até 60 meses', texto: 'Com ou sem entrada, conforme o perfil.' },
      { titulo: 'Sem venda casada', texto: 'Seguro e acessórios só se você quiser.' },
    ],
    paraQuem: ['Vai comprar carro ou moto', 'Quer comparar antes de fechar na loja'],
    documentos: ['CNH', 'Comprovante de renda', 'Comprovante de residência'],
    passos: passosConsignado,
    faq: [{ p: 'Preciso dar entrada?', r: 'Depende do perfil e do banco. Com entrada, a taxa costuma ser melhor.' }],
  },
  {
    slug: 'consignado-inss',
    ativo: true,
    categoria: 'emprestimos',
    rota: '/emprestimo/consignado-inss',
    icone: 'aposentado',
    nome: 'Consignado INSS e servidor público',
    nomeCurto: 'Consignado INSS e servidor',
    chamada: 'Aposentados, pensionistas e servidores, com parcela descontada do benefício.',
    titulo: 'Crédito com respeito pra quem já construiu muito',
    subtitulo:
      'Empréstimo com desconto em folha pra aposentados e pensionistas do INSS e servidores públicos. Processo simples, transparente e com as taxas dos bancos parceiros comparadas.',
    modalidade: 'credito',
    taxaMensal: 1.85,
    valorMin: 1_000,
    valorMax: 150_000,
    valorPadrao: 15_000,
    prazos: [24, 48, 72, 96],
    prazoPadrao: 72,
    rotuloValor: 'De quanto você precisa?',
    camposExtras: [
      { id: 'renda', rotulo: 'Valor do benefício ou salário', tipo: 'moeda', ajuda: 'A parcela respeita a margem consignável de até 35%.' },
      { id: 'vinculo', rotulo: 'Você é', tipo: 'select', opcoes: ['Aposentado INSS', 'Pensionista INSS', 'Servidor federal', 'Servidor do GDF', 'Servidor municipal', 'Militar'] },
    ],
    limite: { tipo: 'margemDaRenda', campo: 'renda', percentual: 0.35 },
    destaques: [
      { titulo: 'Desconto em folha', texto: 'A parcela sai direto do benefício. Sem boleto, sem atraso.' },
      { titulo: 'Taxas comparadas', texto: 'Buscamos a melhor condição entre os bancos parceiros.' },
      { titulo: 'Atendimento humano', texto: 'Explicação clara, sem pressa e sem ligação insistente.' },
      { titulo: 'Portabilidade', texto: 'Já tem consignado? A gente tenta reduzir sua taxa trazendo o contrato.' },
    ],
    paraQuem: ['Aposentados e pensionistas do INSS', 'Servidores públicos federais, distritais e municipais', 'Militares'],
    documentos: ['RG e CPF', 'Extrato do benefício ou contracheque', 'Comprovante de residência'],
    passos: passosConsignado,
    faq: [
      { p: 'A Conquistare liga oferecendo crédito sem eu pedir?', r: 'Não. Só entramos em contato depois que você simula ou pede atendimento. Desconfie de qualquer ligação pedindo depósito antecipado.' },
      { p: 'Posso reduzir a taxa do consignado que já tenho?', r: 'Sim, pela portabilidade. Levamos seu contrato pra um banco com taxa menor e, às vezes, ainda sobra um troco.' },
    ],
  },
  {
    slug: 'consignado-clt',
    ativo: true,
    categoria: 'emprestimos',
    rota: '/emprestimo/consignado-clt',
    icone: 'carteira',
    nome: 'Consignado CLT',
    nomeCurto: 'Consignado CLT',
    chamada: 'Pra quem tem carteira assinada, com parcela descontada direto no salário.',
    titulo: 'Carteira assinada agora vale taxa menor',
    subtitulo: 'Com o consignado do trabalhador, a parcela sai direto da folha. Isso derruba o risco e a taxa.',
    modalidade: 'credito',
    taxaMensal: 2.49,
    valorMin: 1_000,
    valorMax: 100_000,
    valorPadrao: 10_000,
    prazos: [12, 24, 36, 48],
    prazoPadrao: 24,
    rotuloValor: 'De quanto você precisa?',
    camposExtras: [
      { id: 'renda', rotulo: 'Salário bruto mensal', tipo: 'moeda', ajuda: 'A parcela pode comprometer até 35% do salário.' },
      { id: 'tempoEmpresa', rotulo: 'Tempo na empresa atual', tipo: 'select', opcoes: ['Menos de 6 meses', '6 meses a 1 ano', '1 a 3 anos', 'Mais de 3 anos'] },
    ],
    limite: { tipo: 'margemDaRenda', campo: 'renda', percentual: 0.35 },
    destaques: [
      { titulo: 'Desconto em folha', texto: 'A parcela sai do salário todo mês. Zero boleto, zero atraso.' },
      { titulo: 'Taxa menor que o pessoal', texto: 'Menos risco pro banco significa juros menores pra você.' },
      { titulo: 'Troque dívidas caras', texto: 'Quite cartão e cheque especial com um crédito mais barato.' },
      { titulo: 'Até 35% do salário', texto: 'Limite legal que protege seu orçamento.' },
    ],
    paraQuem: ['Trabalhador com carteira assinada (CLT)', 'Empregado doméstico e de MEI registrados no eSocial'],
    documentos: ['RG e CPF', 'Carteira de trabalho digital', 'Último holerite'],
    passos: passosConsignado,
    faq: [{ p: 'Negativado pode contratar?', r: 'Em muitos casos sim, porque a garantia é o desconto em folha. A análise considera o seu vínculo e sua margem.' }],
  },
  {
    slug: 'consorcio-imovel',
    ativo: true,
    categoria: 'consorcios',
    rota: '/consorcio/imovel',
    icone: 'casa',
    nome: 'Consórcio de imóvel',
    nomeCurto: 'Consórcio de imóvel',
    chamada: 'Sua casa própria planejada, com parcelas sem juros.',
    titulo: 'Realize o sonho da casa própria sem pagar juros',
    subtitulo: 'O consórcio é a forma planejada de conquistar seu imóvel: parcelas menores, sem juros e com a chance de ser contemplado a qualquer mês.',
    modalidade: 'consorcio',
    taxaAdm: 16,
    valorMin: 100_000,
    valorMax: 2_000_000,
    valorPadrao: 300_000,
    prazos: [120, 160, 200, 240],
    prazoPadrao: 200,
    rotuloValor: 'Qual o valor da carta de crédito?',
    destaques: [
      { titulo: 'Sem juros', texto: 'Você paga só a taxa de administração, diluída nas parcelas.' },
      { titulo: 'Parcela menor', texto: 'Normalmente bem abaixo da parcela de um financiamento do mesmo valor.' },
      { titulo: 'Use o FGTS', texto: 'Pra dar lance ou complementar a carta, conforme as regras.' },
      { titulo: 'Poder de compra à vista', texto: 'Contemplado, você negocia o imóvel como comprador à vista.' },
    ],
    paraQuem: ['Quer comprar imóvel sem pressa e sem juros', 'Quer investir em imóvel com planejamento', 'Tem FGTS pra usar em lance'],
    documentos: ['RG e CPF', 'Comprovante de renda', 'Comprovante de residência'],
    passos: passosConsorcio,
    faq: [
      { p: 'Consórcio tem juros?', r: 'Não. O custo é a taxa de administração, que é diluída nas parcelas, mais o fundo de reserva previsto no contrato.' },
      { p: 'Como funciona o lance?', r: 'Você oferece antecipar parte das parcelas pra ser contemplado antes. O maior lance do mês leva, além do sorteio.' },
    ],
  },
  {
    slug: 'consorcio-veiculo',
    ativo: true,
    categoria: 'consorcios',
    rota: '/consorcio/veiculo',
    icone: 'carro',
    nome: 'Consórcio de veículo',
    nomeCurto: 'Consórcio de veículo',
    chamada: 'Carro ou moto planejados, sem juros e com parcela leve.',
    titulo: 'Seu próximo carro, planejado e sem juros',
    subtitulo: 'Carta de crédito pra carro, moto ou caminhão, com parcelas que cabem no mês e contemplação por sorteio ou lance.',
    modalidade: 'consorcio',
    taxaAdm: 14,
    valorMin: 30_000,
    valorMax: 500_000,
    valorPadrao: 90_000,
    prazos: [50, 60, 80, 100],
    prazoPadrao: 80,
    rotuloValor: 'Qual o valor da carta de crédito?',
    destaques: [
      { titulo: 'Sem juros', texto: 'Só taxa de administração, diluída nas parcelas.' },
      { titulo: 'Novo ou seminovo', texto: 'A carta vale pra carro, moto ou caminhão.' },
      { titulo: 'Contemplação por lance', texto: 'Antecipe a conquista quando quiser.' },
      { titulo: 'Troca planejada', texto: 'Ideal pra quem troca de carro a cada poucos anos.' },
    ],
    paraQuem: ['Quer trocar de carro sem pagar juros', 'Frotistas e motoristas de aplicativo', 'Quem planeja a compra com antecedência'],
    documentos: ['RG e CPF', 'Comprovante de renda', 'Comprovante de residência'],
    passos: passosConsorcio,
    faq: [{ p: 'Posso usar a carta pra comprar seminovo?', r: 'Sim, dentro das regras da administradora para ano e estado do veículo.' }],
  },
]

export const produtosAtivos = produtos.filter((p) => p.ativo)
export const produtosSimulaveis = produtosAtivos

export function porCategoria(c: Categoria): Produto[] {
  return produtosAtivos.filter((p) => p.categoria === c)
}

export function porSlug(slug: string | null | undefined): Produto | undefined {
  return produtosAtivos.find((p) => p.slug === slug)
}

export function porRota(rota: string): Produto | undefined {
  return produtosAtivos.find((p) => p.rota === rota)
}
