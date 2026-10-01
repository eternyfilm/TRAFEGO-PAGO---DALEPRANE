// Conteúdo institucional: números, depoimentos, FAQ geral e blog.
// Fonte: portfólio "Conquistare Cred.pdf" (Drive da agência).

// Só fatos que estão no portfólio. Volume de crédito e nº de clientes
// entram quando a Conquistare passar os números reais.
export const numeros = [
  { valor: '7', rotulo: 'bancos parceiros comparados' },
  { valor: '1h', rotulo: 'pra aprovação do financiamento' },
  { valor: '4', rotulo: 'soluções: financiamento, empréstimo, consórcio e correspondente' },
  { valor: '100%', rotulo: 'acompanhado, da simulação ao registro' },
]

export const beneficios = [
  { icone: 'relogio', titulo: 'Aprovação em até 1 hora', texto: 'Resposta rápida pra você não perder o imóvel que escolheu.' },
  { icone: 'balanca', titulo: 'Correspondente multibancos', texto: 'Caixa, BRB, Santander, Itaú, Bradesco, Poupex e Inter comparados pro seu perfil.' },
  { icone: 'pessoa', titulo: 'Consultoria sob medida', texto: 'Um trabalho direcionado pro seu perfil, com as melhores taxas e vantagens apresentadas com clareza.' },
  { icone: 'escudo', titulo: 'Acompanhamento até o fim', texto: 'Da aprovação até o recurso chegar no vendedor. Tranquilidade pra você e pros parceiros.' },
] as const

// Avaliações públicas no Google, transcritas do portfólio. Confirmar com a
// Conquistare se pode exibir o nome completo ou só primeiro nome + inicial.
export const depoimentos = [
  {
    nome: 'Diego D.',
    origem: 'Avaliação no Google',
    produto: 'Financiamento imobiliário',
    texto:
      'Tinha um sonho de adquirir um imóvel, estava com bastante ansiedade, e ela foi essencial, me auxiliou e cuidou de todo o trâmite para o financiamento. Consegui comprar meu primeiro imóvel.',
  },
  {
    nome: 'Cleidionice V.',
    origem: 'Avaliação no Google',
    produto: 'Financiamento bancário',
    texto: 'Achei a equipe bastante profissional, demonstraram experiência, cumpridores de prazos. A assessoria junto ao setor de financiamento bancário foi a que mais gostei. Atendimento nota 10.',
  },
  {
    nome: 'Lilianne R.',
    origem: 'Avaliação no Google',
    produto: 'Pós-venda',
    texto: 'Está muito além do papel de uma correspondente bancária, mas sim de alguém que verdadeiramente se preocupa com o próximo! Atendimento e profissionalismo além do esperado! Nota 1000.',
  },
]

export const missao =
  'Facilitar o acesso a soluções financeiras confiáveis e personalizadas, permitindo que nossos clientes realizem seus sonhos de aquisição de imóveis, veículos e viagens, alcancem estabilidade financeira e realizem seus projetos de vida.'

export const visao =
  'Ser a principal escolha em serviços financeiros, reconhecida pela excelência na oferta de crédito responsável e soluções inovadoras para aquisição de bens e investimentos.'

export const valores = [
  { titulo: 'Integridade', texto: 'Agimos com honestidade e ética em todas as transações, construindo confiança e respeito com clientes e parceiros.' },
  { titulo: 'Inovação financeira', texto: 'Buscamos constantemente maneiras de tornar o crédito mais acessível e personalizado.' },
  { titulo: 'Atendimento ao cliente', texto: 'Colocamos as necessidades e objetivos dos clientes em primeiro lugar.' },
  { titulo: 'Responsabilidade social', texto: 'Contribuímos para a realização de projetos de vida e para a estabilidade financeira de famílias.' },
  { titulo: 'Colaboração', texto: 'Trabalhamos em equipe, num ambiente de aprendizagem contínua.' },
]

export const faqGeral = [
  { p: 'A Conquistare é um banco?', r: 'Não. Somos correspondente bancário multibancos: trabalhamos com Caixa, BRB, Santander, Itaú, Bradesco, Poupex e Inter, comparamos as propostas pro seu perfil e acompanhamos todo o processo. O crédito é concedido pelo banco.' },
  { p: 'Vocês cobram alguma taxa antecipada?', r: 'Nunca. Nenhum valor é cobrado antes da liberação do crédito. Se alguém pedir depósito ou pagamento antecipado em nome da Conquistare, é golpe.' },
  { p: 'A aprovação sai mesmo em 1 hora?', r: 'A aprovação de crédito do financiamento costuma sair em até 1 hora com a documentação completa. As etapas seguintes (avaliação, jurídico, registro) têm prazos próprios, e a gente acompanha cada uma.' },
  { p: 'Consórcio ou financiamento: qual é melhor pra mim?', r: 'Financiamento te dá o bem agora e você paga juros. Consórcio não tem juros, mas você depende de sorteio ou lance pra ser contemplado. Se tem pressa, financiamento. Se pode planejar, o consórcio costuma sair mais barato. A gente simula os dois pra você comparar.' },
  { p: 'Simular compromete meu CPF?', r: 'Não. A simulação não gera consulta que afete seu score. A análise de crédito só acontece com a sua autorização.' },
  { p: 'Onde vocês ficam?', r: 'No SIG, Quadra 01, Ed. Platinum Office, sala 405, em Brasília/DF. Atendemos também por WhatsApp e telefone.' },
]

export interface Artigo {
  slug: string
  titulo: string
  resumo: string
  categoria: string
  leitura: string
  data: string
  corpo: { tipo: 'p' | 'h2' | 'li'; texto: string }[]
}

export const artigos: Artigo[] = [
  {
    slug: 'o-que-e-cet',
    titulo: 'CET: o número que ninguém te explica e que decide se o crédito é bom',
    resumo: 'Taxa de juros não conta a história toda. Entenda o Custo Efetivo Total e compare propostas do jeito certo.',
    categoria: 'Educação financeira',
    leitura: '4 min',
    data: '2026-09-10',
    corpo: [
      { tipo: 'p', texto: 'Quando você recebe uma proposta de crédito, a primeira coisa que salta aos olhos é a taxa de juros. Mas ela é só uma parte do custo. O número que realmente importa é o CET, Custo Efetivo Total.' },
      { tipo: 'h2', texto: 'O que entra no CET' },
      { tipo: 'li', texto: 'Juros do contrato' },
      { tipo: 'li', texto: 'IOF, o imposto sobre operações financeiras' },
      { tipo: 'li', texto: 'Seguros embutidos, como o prestamista' },
      { tipo: 'li', texto: 'Tarifas de cadastro, avaliação ou registro, quando existirem' },
      { tipo: 'h2', texto: 'Como usar isso a seu favor' },
      { tipo: 'p', texto: 'Duas propostas com a mesma taxa de juros podem ter CETs bem diferentes. Sempre compare o CET anual e o valor total a pagar. Por lei, toda instituição precisa informar o CET antes da contratação.' },
      { tipo: 'p', texto: 'Na Conquistare, o especialista mostra o CET de cada opção lado a lado antes de você decidir.' },
    ],
  },
  {
    slug: 'trocar-divida-cara-por-barata',
    titulo: 'Como trocar dívida cara por dívida barata e respirar no fim do mês',
    resumo: 'Cartão e cheque especial cobram juros que dobram a dívida rápido. Veja como a portabilidade e o crédito com garantia mudam o jogo.',
    categoria: 'Dívidas',
    leitura: '5 min',
    data: '2026-08-28',
    corpo: [
      { tipo: 'p', texto: 'O rotativo do cartão e o cheque especial estão entre os créditos mais caros do país. Quem fica preso neles paga juros sobre juros todo mês.' },
      { tipo: 'h2', texto: 'A lógica da troca' },
      { tipo: 'p', texto: 'A ideia é simples: pegar um crédito com taxa muito menor, como consignado ou empréstimo com garantia, quitar tudo o que é caro e ficar com uma parcela só, previsível e menor.' },
      { tipo: 'h2', texto: 'Cuidados antes de fazer' },
      { tipo: 'li', texto: 'Some todas as dívidas e o custo mensal de cada uma' },
      { tipo: 'li', texto: 'Compare o CET do novo crédito com o que você paga hoje' },
      { tipo: 'li', texto: 'Garanta que a nova parcela cabe com folga no orçamento' },
      { tipo: 'li', texto: 'Depois da troca, não volte a usar o limite do cartão sem controle' },
    ],
  },
  {
    slug: 'consignado-clt-como-funciona',
    titulo: 'Consignado CLT: o que mudou e quem pode contratar',
    resumo: 'Trabalhador com carteira assinada agora tem acesso a crédito com desconto em folha via eSocial. Entenda as regras.',
    categoria: 'Consignado',
    leitura: '4 min',
    data: '2026-08-12',
    corpo: [
      { tipo: 'p', texto: 'O consignado para trabalhadores do setor privado ganhou novas regras e passou a usar os dados do eSocial. Na prática, ficou mais fácil para quem tem carteira assinada acessar crédito com desconto em folha.' },
      { tipo: 'h2', texto: 'Quem pode' },
      { tipo: 'li', texto: 'Empregados com carteira assinada' },
      { tipo: 'li', texto: 'Empregados domésticos' },
      { tipo: 'li', texto: 'Empregados de MEI' },
      { tipo: 'h2', texto: 'Limite da parcela' },
      { tipo: 'p', texto: 'A parcela pode comprometer até 35% do salário. Esse limite existe pra proteger o seu orçamento.' },
    ],
  },
  {
    slug: 'consorcio-ou-financiamento',
    titulo: 'Consórcio ou financiamento: qual leva você mais rápido (e mais barato) ao imóvel?',
    resumo: 'Um tem juros e te entrega o bem agora. O outro não tem juros e pede planejamento. Veja como escolher.',
    categoria: 'Consórcio',
    leitura: '5 min',
    data: '2026-07-30',
    corpo: [
      { tipo: 'p', texto: 'Na hora de comprar um imóvel ou um carro, as duas portas mais comuns são o financiamento e o consórcio. Nenhum é melhor em tudo. Depende do seu momento.' },
      { tipo: 'h2', texto: 'Financiamento: o bem agora' },
      { tipo: 'p', texto: 'Você recebe o imóvel logo após a aprovação e o registro, e paga juros por isso. Ideal pra quem já achou o imóvel ou não pode esperar.' },
      { tipo: 'h2', texto: 'Consórcio: sem juros, com planejamento' },
      { tipo: 'p', texto: 'Você paga parcelas com taxa de administração, sem juros, e é contemplado por sorteio ou lance. Costuma sair bem mais barato no total, mas exige paciência.' },
      { tipo: 'h2', texto: 'Como decidir' },
      { tipo: 'li', texto: 'Tem pressa ou já escolheu o imóvel? Financiamento.' },
      { tipo: 'li', texto: 'Pode esperar e quer pagar menos no total? Consórcio.' },
      { tipo: 'li', texto: 'Tem FGTS ou uma reserva? Os dois aceitam, de jeitos diferentes.' },
      { tipo: 'p', texto: 'Na Conquistare a gente simula os dois lado a lado pra você decidir com números, não com achismo.' },
    ],
  },
]
