// Catálogo de produtos. Cada página de produto, card, aba do simulador e item
// de menu sai daqui. Pra desligar um produto, `ativo: false`. Pra criar um
// novo, copie um bloco e ajuste.
//
// TAXAS SÃO REFERÊNCIAS DE MERCADO PROVISÓRIAS. Substituir pelas taxas reais
// dos bancos parceiros da Conquistare antes de sair do modo rascunho.

export type Categoria = 'emprestimos' | 'financiamentos' | 'seguros'
export type IconeProduto =
  | 'casa'
  | 'carro'
  | 'carteira'
  | 'aposentado'
  | 'chave'
  | 'escudo'
  | 'coracao'
  | 'predio'

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
  | { tipo: 'percentualDoBem'; campo: string; percentual: number } // garantia/financiamento
  | { tipo: 'margemDaRenda'; campo: string; percentual: number } // consignado

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
  simulavel: boolean
  taxaMensal?: number // % a.m. a partir de
  taxaRotulo?: string // quando o destaque não é taxa (seguros)
  valorMin?: number
  valorMax?: number
  valorPadrao?: number
  prazos?: number[]
  prazoPadrao?: number
  camposExtras?: CampoExtra[]
  limite?: Limite
  destaques: { titulo: string; texto: string }[]
  paraQuem: string[]
  documentos: string[]
  passos: { titulo: string; texto: string }[]
  faq: { p: string; r: string }[]
}

export const categorias: Record<Categoria, { nome: string; rota: string; titulo: string; texto: string }> = {
  emprestimos: {
    nome: 'Empréstimos',
    rota: '/emprestimos',
    titulo: 'Empréstimo com taxa baixa de verdade',
    texto:
      'Usar um bem como garantia ou a sua margem consignável derruba a taxa. Você paga menos juros e ganha prazo pra respirar.',
  },
  financiamentos: {
    nome: 'Financiamentos',
    rota: '/financiamentos',
    titulo: 'Financie a próxima conquista',
    texto: 'Casa própria ou carro novo, com a gente comparando os bancos pra você fechar a melhor condição.',
  },
  seguros: {
    nome: 'Seguros',
    rota: '/seguros',
    titulo: 'Proteção sem letra miúda',
    texto: 'Cotação com várias seguradoras em um só lugar e alguém de verdade pra te explicar a apólice.',
  },
}

const passosCredito = [
  { titulo: 'Simule em 2 minutos', texto: 'Escolha valor e prazo e veja a parcela na hora, sem compromisso.' },
  { titulo: 'Envie seus dados', texto: 'Um especialista analisa seu perfil e compara as propostas dos bancos parceiros.' },
  { titulo: 'Receba a proposta', texto: 'Você vê taxa, CET e parcela final antes de decidir qualquer coisa.' },
  { titulo: 'Dinheiro na conta', texto: 'Assinou, o valor cai direto na sua conta. Sem taxa antecipada.' },
]

export const produtos: Produto[] = [
  {
    slug: 'garantia-imovel',
    ativo: true,
    categoria: 'emprestimos',
    rota: '/emprestimo/garantia-de-imovel',
    icone: 'casa',
    nome: 'Empréstimo com garantia de imóvel',
    nomeCurto: 'Garantia de imóvel',
    chamada: 'Até 60% do valor do seu imóvel, com a menor taxa do crédito pessoal.',
    titulo: 'Seu imóvel vale mais do que você imagina',
    subtitulo:
      'Use sua casa ou apartamento como garantia e consiga crédito alto, com taxa baixa e até 20 anos pra pagar. Você continua morando nele normalmente.',
    simulavel: true,
    taxaMensal: 1.09,
    valorMin: 50_000,
    valorMax: 3_000_000,
    valorPadrao: 200_000,
    prazos: [36, 60, 120, 180, 240],
    prazoPadrao: 180,
    camposExtras: [
      { id: 'valorBem', rotulo: 'Valor aproximado do imóvel', tipo: 'moeda' },
      { id: 'tipoImovel', rotulo: 'Tipo de imóvel', tipo: 'select', opcoes: ['Casa', 'Apartamento', 'Sala comercial', 'Terreno'] },
      {
        id: 'quitado',
        rotulo: 'O imóvel está quitado?',
        tipo: 'select',
        opcoes: ['Sim, quitado', 'Não, ainda estou pagando'],
        ajuda: 'Imóvel financiado também pode ser usado, dependendo do saldo devedor.',
      },
    ],
    limite: { tipo: 'percentualDoBem', campo: 'valorBem', percentual: 0.6 },
    destaques: [
      { titulo: 'Taxa a partir de 1,09% a.m.', texto: 'Muito abaixo do empréstimo pessoal comum, porque o imóvel reduz o risco pro banco.' },
      { titulo: 'Até 240 meses', texto: 'Parcela que cabe no mês, sem apertar o orçamento da família.' },
      { titulo: 'O imóvel continua seu', texto: 'Você segue morando, alugando ou usando o imóvel como sempre.' },
      { titulo: 'Use como quiser', texto: 'Quitar dívidas caras, investir no negócio, reformar ou realizar um projeto.' },
    ],
    paraQuem: [
      'Tem imóvel residencial ou comercial em área urbana',
      'Imóvel no seu nome ou de familiar que topa participar',
      'Quer trocar dívidas caras por uma só, com juros menores',
      'Precisa de um valor alto pra um projeto grande',
    ],
    documentos: ['RG e CPF', 'Comprovante de renda', 'Comprovante de residência', 'Matrícula atualizada do imóvel', 'IPTU do ano'],
    passos: [
      ...passosCredito.slice(0, 2),
      { titulo: 'Avaliação do imóvel', texto: 'Um engenheiro parceiro visita o imóvel pra confirmar o valor. Sem custo antecipado.' },
      { titulo: 'Contrato e liberação', texto: 'Contrato registrado em cartório e o dinheiro cai na sua conta.' },
    ],
    faq: [
      { p: 'Posso perder meu imóvel?', r: 'O imóvel só é executado em caso de inadimplência prolongada, seguindo um rito legal com vários avisos. Por isso a gente dimensiona a parcela pra caber com folga no seu orçamento.' },
      { p: 'Imóvel financiado serve como garantia?', r: 'Pode servir, dependendo do saldo devedor. Em alguns casos o novo crédito quita o financiamento antigo e libera a diferença pra você.' },
      { p: 'Quanto tempo leva?', r: 'Da simulação até o dinheiro na conta costuma levar de 15 a 30 dias, porque envolve avaliação e registro em cartório.' },
      { p: 'Existe custo pra começar?', r: 'Não. Nenhum valor é cobrado antes da liberação. Custos de avaliação e registro, quando existem, entram no próprio contrato.' },
    ],
  },
  {
    slug: 'garantia-veiculo',
    ativo: true,
    categoria: 'emprestimos',
    rota: '/emprestimo/garantia-de-veiculo',
    icone: 'carro',
    nome: 'Empréstimo com garantia de veículo',
    nomeCurto: 'Garantia de veículo',
    chamada: 'Seu carro quitado vira crédito rápido, e você continua dirigindo.',
    titulo: 'Seu carro vira crédito. E continua na sua garagem.',
    subtitulo: 'Use seu carro, moto ou caminhão quitado como garantia e consiga crédito com taxa menor e até 60 meses pra pagar.',
    simulavel: true,
    taxaMensal: 1.49,
    valorMin: 5_000,
    valorMax: 150_000,
    valorPadrao: 30_000,
    prazos: [12, 24, 36, 48, 60],
    prazoPadrao: 36,
    camposExtras: [
      { id: 'valorBem', rotulo: 'Valor aproximado do veículo (FIPE)', tipo: 'moeda' },
      { id: 'anoVeiculo', rotulo: 'Ano do veículo', tipo: 'ano' },
      { id: 'tipoVeiculo', rotulo: 'Tipo', tipo: 'select', opcoes: ['Carro', 'Moto', 'Caminhão', 'Utilitário'] },
    ],
    limite: { tipo: 'percentualDoBem', campo: 'valorBem', percentual: 0.9 },
    destaques: [
      { titulo: 'Taxa a partir de 1,49% a.m.', texto: 'Bem abaixo do cartão e do cheque especial.' },
      { titulo: 'Até 90% da FIPE', texto: 'Quanto mais valioso o veículo, maior o crédito disponível.' },
      { titulo: 'Continue dirigindo', texto: 'O veículo fica com você durante todo o contrato.' },
      { titulo: 'Liberação rápida', texto: 'Processo mais simples que o de imóvel, com dinheiro em poucos dias.' },
    ],
    paraQuem: ['Tem carro, moto ou caminhão quitado', 'Veículo com até 20 anos de fabricação', 'Documento no seu nome', 'Quer crédito rápido sem se desfazer do veículo'],
    documentos: ['CNH ou RG e CPF', 'Comprovante de renda', 'Comprovante de residência', 'CRLV do veículo'],
    passos: passosCredito,
    faq: [
      { p: 'Preciso deixar o carro com vocês?', r: 'Não. O veículo continua com você. Só fica registrada uma alienação no documento até a quitação.' },
      { p: 'Carro financiado serve?', r: 'Normalmente o veículo precisa estar quitado. Em alguns casos dá pra quitar o saldo com o próprio empréstimo, fale com um especialista.' },
      { p: 'Posso vender o carro depois?', r: 'Sim, após quitar o contrato a alienação é baixada e o veículo fica livre.' },
    ],
  },
  {
    slug: 'consignado-clt',
    ativo: true,
    categoria: 'emprestimos',
    rota: '/emprestimo/consignado-clt',
    icone: 'carteira',
    nome: 'Crédito consignado CLT',
    nomeCurto: 'Consignado CLT',
    chamada: 'Pra quem tem carteira assinada, com parcela descontada direto no salário.',
    titulo: 'Carteira assinada agora vale taxa menor',
    subtitulo:
      'Com o consignado do trabalhador, a parcela sai direto da folha. Isso derruba o risco e a taxa. Sem boleto, sem esquecer vencimento.',
    simulavel: true,
    taxaMensal: 2.49,
    valorMin: 1_000,
    valorMax: 100_000,
    valorPadrao: 10_000,
    prazos: [12, 24, 36, 48],
    prazoPadrao: 24,
    camposExtras: [
      { id: 'renda', rotulo: 'Salário bruto mensal', tipo: 'moeda', ajuda: 'A parcela pode comprometer até 35% do salário.' },
      { id: 'tempoEmpresa', rotulo: 'Tempo na empresa atual', tipo: 'select', opcoes: ['Menos de 6 meses', '6 meses a 1 ano', '1 a 3 anos', 'Mais de 3 anos'] },
    ],
    limite: { tipo: 'margemDaRenda', campo: 'renda', percentual: 0.35 },
    destaques: [
      { titulo: 'Desconto em folha', texto: 'A parcela sai do salário todo mês. Zero boleto, zero atraso.' },
      { titulo: 'Taxa menor que o pessoal', texto: 'Menos risco pro banco significa juros menores pra você.' },
      { titulo: 'Troque dívidas caras', texto: 'Quite cartão e cheque especial com um crédito muito mais barato.' },
      { titulo: 'Até 35% do salário', texto: 'Limite legal que protege seu orçamento.' },
    ],
    paraQuem: ['Trabalhador com carteira assinada (CLT)', 'Empregado doméstico e de MEI registrados no eSocial', 'Quer sair do rotativo do cartão ou do cheque especial'],
    documentos: ['RG e CPF', 'Carteira de trabalho digital', 'Último holerite'],
    passos: passosCredito,
    faq: [
      { p: 'Minha empresa precisa ser conveniada?', r: 'Com o crédito do trabalhador, a contratação usa os dados do eSocial. Um especialista confirma se o seu vínculo já está habilitado.' },
      { p: 'E se eu for demitido?', r: 'Parte da rescisão pode ser usada pra abater o saldo, e o contrato segue com as condições combinadas. A gente te explica tudo antes de assinar.' },
      { p: 'Negativado pode contratar?', r: 'Em muitos casos sim, porque a garantia é o desconto em folha. A análise considera o seu vínculo e sua margem.' },
    ],
  },
  {
    slug: 'consignado-inss',
    ativo: true,
    categoria: 'emprestimos',
    rota: '/emprestimo/consignado-inss',
    icone: 'aposentado',
    nome: 'Consignado INSS e servidor público',
    nomeCurto: 'Consignado INSS',
    chamada: 'Aposentados, pensionistas e servidores, com as menores taxas permitidas.',
    titulo: 'Crédito com respeito pra quem já construiu muito',
    subtitulo: 'Aposentados, pensionistas do INSS e servidores públicos têm acesso às menores taxas do crédito pessoal, com parcela descontada do benefício.',
    simulavel: true,
    taxaMensal: 1.85,
    valorMin: 1_000,
    valorMax: 150_000,
    valorPadrao: 15_000,
    prazos: [24, 48, 72, 96],
    prazoPadrao: 72,
    camposExtras: [
      { id: 'renda', rotulo: 'Valor do benefício ou salário', tipo: 'moeda', ajuda: 'A parcela respeita a margem consignável de até 35%.' },
      { id: 'vinculo', rotulo: 'Você é', tipo: 'select', opcoes: ['Aposentado INSS', 'Pensionista INSS', 'Servidor federal', 'Servidor estadual', 'Servidor municipal', 'Militar'] },
    ],
    limite: { tipo: 'margemDaRenda', campo: 'renda', percentual: 0.35 },
    destaques: [
      { titulo: 'Taxa dentro do teto oficial', texto: 'O teto de juros do consignado INSS é definido pelo governo, e a gente busca o melhor abaixo dele.' },
      { titulo: 'Até 96 meses', texto: 'Parcelas menores, mais tempo pra pagar.' },
      { titulo: 'Atendimento humano', texto: 'Explicação clara, sem pressa e sem ligação insistente.' },
      { titulo: 'Portabilidade', texto: 'Já tem consignado? A gente tenta reduzir sua taxa trazendo o contrato.' },
    ],
    paraQuem: ['Aposentados e pensionistas do INSS', 'Servidores públicos federais, estaduais e municipais', 'Militares das Forças Armadas'],
    documentos: ['RG e CPF', 'Extrato do benefício ou contracheque', 'Comprovante de residência'],
    passos: passosCredito,
    faq: [
      { p: 'A Conquistare liga oferecendo crédito sem eu pedir?', r: 'Não. Só entramos em contato depois que você simula ou pede atendimento. Desconfie de qualquer ligação pedindo depósito antecipado.' },
      { p: 'Posso reduzir a taxa do consignado que já tenho?', r: 'Sim, pela portabilidade. Levamos seu contrato pra um banco com taxa menor e, às vezes, ainda sobra um troco.' },
      { p: 'Qual o prazo máximo?', r: 'Para INSS, até 96 meses. Para servidores, depende do convênio do órgão.' },
    ],
  },
  {
    slug: 'financiamento-imobiliario',
    ativo: true,
    categoria: 'financiamentos',
    rota: '/financiamento/imobiliario',
    icone: 'chave',
    nome: 'Financiamento imobiliário',
    nomeCurto: 'Financiamento imobiliário',
    chamada: 'A gente compara os bancos e acompanha tudo até a entrega das chaves.',
    titulo: 'A chave da sua casa, sem burocracia no caminho',
    subtitulo: 'Comparamos as condições dos principais bancos e cuidamos da papelada do começo ao registro. Você só escolhe a melhor proposta.',
    simulavel: true,
    taxaMensal: 0.95,
    valorMin: 100_000,
    valorMax: 5_000_000,
    valorPadrao: 400_000,
    prazos: [120, 240, 360, 420],
    prazoPadrao: 360,
    camposExtras: [
      { id: 'valorBem', rotulo: 'Valor do imóvel que você quer comprar', tipo: 'moeda' },
      { id: 'renda', rotulo: 'Renda familiar mensal', tipo: 'moeda' },
      { id: 'usoFgts', rotulo: 'Vai usar FGTS?', tipo: 'select', opcoes: ['Sim', 'Não', 'Não sei'] },
    ],
    limite: { tipo: 'percentualDoBem', campo: 'valorBem', percentual: 0.8 },
    destaques: [
      { titulo: 'Vários bancos, uma conversa', texto: 'Levamos seu perfil pros bancos parceiros e trazemos a melhor proposta.' },
      { titulo: 'Até 80% do imóvel', texto: 'Com prazo de até 35 anos.' },
      { titulo: 'Uso do FGTS', texto: 'A gente orienta como usar o FGTS na entrada ou pra amortizar.' },
      { titulo: 'Acompanhamento até o registro', texto: 'Da análise ao cartório, você não fica sozinho.' },
    ],
    paraQuem: ['Quem vai comprar o primeiro imóvel', 'Quem quer trocar de imóvel', 'Quem busca comparar bancos sem perder tempo'],
    documentos: ['RG e CPF', 'Comprovante de renda', 'Comprovante de estado civil', 'Extrato do FGTS (se for usar)'],
    passos: [
      { titulo: 'Simule', texto: 'Veja uma estimativa de parcela e de entrada.' },
      { titulo: 'Análise de crédito', texto: 'Enviamos seu perfil aos bancos parceiros.' },
      { titulo: 'Avaliação e documentação', texto: 'Cuidamos da avaliação do imóvel e da papelada.' },
      { titulo: 'Assinatura e chaves', texto: 'Contrato assinado, registro feito, chave na mão.' },
    ],
    faq: [
      { p: 'Qual a entrada mínima?', r: 'Em geral 20% do valor do imóvel, podendo usar FGTS. Em alguns programas a entrada pode ser menor.' },
      { p: 'Vocês cobram pela assessoria?', r: 'A assessoria de crédito é remunerada pelos bancos parceiros. Você não paga nada a mais por isso.' },
    ],
  },
  {
    slug: 'financiamento-veiculo',
    ativo: true,
    categoria: 'financiamentos',
    rota: '/financiamento/veiculo',
    icone: 'carro',
    nome: 'Financiamento de veículo',
    nomeCurto: 'Financiamento de veículo',
    chamada: 'Novo ou seminovo, com a taxa comparada entre vários bancos.',
    titulo: 'Carro novo sem cair na primeira taxa que aparece',
    subtitulo: 'Antes de fechar na concessionária, compare. A gente cota em vários bancos e você decide com calma.',
    simulavel: true,
    taxaMensal: 1.39,
    valorMin: 10_000,
    valorMax: 400_000,
    valorPadrao: 60_000,
    prazos: [24, 36, 48, 60],
    prazoPadrao: 48,
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
    paraQuem: ['Quem vai comprar carro ou moto', 'Quem quer comparar antes de fechar na loja'],
    documentos: ['CNH', 'Comprovante de renda', 'Comprovante de residência'],
    passos: passosCredito,
    faq: [
      { p: 'Preciso dar entrada?', r: 'Depende do perfil e do banco. Com entrada, a taxa costuma ser melhor.' },
      { p: 'Posso comprar de particular?', r: 'Sim, alguns bancos parceiros financiam veículos de particular.' },
    ],
  },
  {
    slug: 'seguro-auto',
    ativo: true,
    categoria: 'seguros',
    rota: '/seguro/auto',
    icone: 'escudo',
    nome: 'Seguro auto',
    nomeCurto: 'Seguro auto',
    chamada: 'Cotação em várias seguradoras e assistência 24h.',
    titulo: 'Seu carro protegido, sua cabeça tranquila',
    subtitulo: 'Comparamos seguradoras e montamos a cobertura certa pro seu uso, sem pagar por aquilo que você não precisa.',
    simulavel: false,
    taxaRotulo: 'Cotação grátis',
    camposExtras: [
      { id: 'modelo', rotulo: 'Modelo e ano do veículo', tipo: 'texto' },
      { id: 'cep', rotulo: 'CEP de pernoite', tipo: 'texto' },
    ],
    destaques: [
      { titulo: 'Várias seguradoras', texto: 'Uma cotação, várias opções lado a lado.' },
      { titulo: 'Assistência 24h', texto: 'Guincho, chaveiro e carro reserva conforme o plano.' },
      { titulo: 'Ajuda no sinistro', texto: 'A gente acompanha seu caso com a seguradora.' },
      { titulo: 'Renovação sem susto', texto: 'Avisamos antes de vencer e recotamos pra você.' },
    ],
    paraQuem: ['Quem tem carro, moto ou utilitário', 'Quem quer renovar pagando menos'],
    documentos: ['CNH', 'CRLV do veículo'],
    passos: [
      { titulo: 'Conte sobre o veículo', texto: 'Modelo, ano e onde ele dorme.' },
      { titulo: 'Receba as cotações', texto: 'Comparamos as seguradoras parceiras.' },
      { titulo: 'Escolha e contrate', texto: 'Apólice emitida e proteção ativa.' },
    ],
    faq: [{ p: 'A cotação tem custo?', r: 'Não. A cotação é gratuita e sem compromisso.' }],
  },
  {
    slug: 'seguro-vida',
    ativo: true,
    categoria: 'seguros',
    rota: '/seguro/vida',
    icone: 'coracao',
    nome: 'Seguro de vida',
    nomeCurto: 'Seguro de vida',
    chamada: 'Proteção pra quem depende de você, a partir de poucos reais por mês.',
    titulo: 'Cuidar de quem você ama também é planejamento',
    subtitulo: 'Seguro de vida com coberturas pra morte, invalidez e doenças graves, montado de acordo com a sua fase de vida.',
    simulavel: false,
    taxaRotulo: 'Cotação grátis',
    camposExtras: [{ id: 'nascimento', rotulo: 'Data de nascimento', tipo: 'texto' }],
    destaques: [
      { titulo: 'Coberturas sob medida', texto: 'Morte, invalidez, doenças graves e diária por internação.' },
      { titulo: 'Cabe no orçamento', texto: 'Planos acessíveis e ajustáveis.' },
      { titulo: 'Sem inventário', texto: 'A indenização não entra em inventário e sai rápido pra família.' },
      { titulo: 'Beneficiários livres', texto: 'Você escolhe quem recebe.' },
    ],
    paraQuem: ['Quem tem filhos ou dependentes', 'Quem tem financiamento ou dívidas de longo prazo', 'Profissionais autônomos'],
    documentos: ['RG e CPF'],
    passos: [
      { titulo: 'Conte sobre você', texto: 'Idade, profissão e o que quer proteger.' },
      { titulo: 'Receba as opções', texto: 'Planos comparados entre seguradoras.' },
      { titulo: 'Contrate', texto: 'Proteção ativa em poucos dias.' },
    ],
    faq: [{ p: 'Posso mudar os beneficiários depois?', r: 'Sim, a qualquer momento, direto com a seguradora ou com a nossa ajuda.' }],
  },
  {
    slug: 'seguro-residencial',
    ativo: true,
    categoria: 'seguros',
    rota: '/seguro/residencial',
    icone: 'predio',
    nome: 'Seguro residencial',
    nomeCurto: 'Seguro residencial',
    chamada: 'Casa protegida contra incêndio, roubo e danos, com assistências úteis no dia a dia.',
    titulo: 'Sua casa protegida por menos do que você imagina',
    subtitulo: 'Incêndio, roubo, danos elétricos e uma lista de serviços de assistência pra casa, como encanador e eletricista.',
    simulavel: false,
    taxaRotulo: 'Cotação grátis',
    camposExtras: [
      { id: 'cep', rotulo: 'CEP do imóvel', tipo: 'texto' },
      { id: 'tipoImovel', rotulo: 'Tipo de imóvel', tipo: 'select', opcoes: ['Casa', 'Apartamento'] },
    ],
    destaques: [
      { titulo: 'Coberturas essenciais', texto: 'Incêndio, roubo, danos elétricos e vendaval.' },
      { titulo: 'Assistência 24h', texto: 'Encanador, eletricista, chaveiro e vidraceiro.' },
      { titulo: 'Preço acessível', texto: 'Um dos seguros com melhor custo-benefício.' },
      { titulo: 'Proprietário ou inquilino', texto: 'Serve pros dois casos.' },
    ],
    paraQuem: ['Proprietários', 'Inquilinos', 'Quem tem imóvel financiado'],
    documentos: ['RG e CPF', 'Endereço do imóvel'],
    passos: [
      { titulo: 'Informe o imóvel', texto: 'Endereço e tipo.' },
      { titulo: 'Compare', texto: 'Planos lado a lado.' },
      { titulo: 'Contrate', texto: 'Casa protegida.' },
    ],
    faq: [{ p: 'Inquilino pode contratar?', r: 'Sim. O seguro protege seus bens e responsabilidades, mesmo sem ser dono do imóvel.' }],
  },
]

export const produtosAtivos = produtos.filter((p) => p.ativo)
export const produtosSimulaveis = produtosAtivos.filter((p) => p.simulavel)

export function porCategoria(c: Categoria): Produto[] {
  return produtosAtivos.filter((p) => p.categoria === c)
}

export function porSlug(slug: string | null | undefined): Produto | undefined {
  return produtosAtivos.find((p) => p.slug === slug)
}

export function porRota(rota: string): Produto | undefined {
  return produtosAtivos.find((p) => p.rota === rota)
}
