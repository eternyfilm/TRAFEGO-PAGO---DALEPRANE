// Conteúdo institucional: números, depoimentos, FAQ geral e blog.
// Números e depoimentos abaixo são ILUSTRATIVOS. Trocar por dados reais da
// Conquistare (e depoimentos com autorização por escrito) antes de publicar.

export const numeros = [
  { valor: 'R$ 50 mi+', rotulo: 'em crédito intermediado' },
  { valor: '4.000+', rotulo: 'clientes atendidos' },
  { valor: '15+', rotulo: 'bancos e seguradoras parceiros' },
  { valor: '24h', rotulo: 'pra primeira resposta' },
]

export const beneficios = [
  { icone: 'grafico', titulo: 'Taxa menor de verdade', texto: 'Com garantia ou consignado, você sai do juro de cartão e cheque especial e paga uma fração disso.' },
  { icone: 'balanca', titulo: 'Vários bancos, uma proposta', texto: 'A gente compara as instituições parceiras e traz a condição que faz mais sentido pro seu perfil.' },
  { icone: 'pessoa', titulo: 'Gente de verdade do seu lado', texto: 'Especialista que explica CET, prazo e parcela antes de você assinar qualquer coisa.' },
  { icone: 'cadeado', titulo: 'Zero taxa antecipada', texto: 'Nenhum valor é cobrado pra liberar crédito. Se alguém pedir depósito antes, não é a Conquistare.' },
] as const

// Taxa média aproximada ao mês, para comparação visual. Fonte de referência:
// estatísticas de juros do Banco Central. Revisar os valores periodicamente.
export const comparativoTaxas = [
  { rotulo: 'Rotativo do cartão', taxa: 14.5, destaque: false },
  { rotulo: 'Cheque especial', taxa: 7.8, destaque: false },
  { rotulo: 'Crédito pessoal comum', taxa: 5.9, destaque: false },
  { rotulo: 'Conquistare com garantia', taxa: 1.09, destaque: true },
]

export const depoimentos = [
  { nome: 'Mariana S.', cidade: 'Brasília, DF', produto: 'Garantia de imóvel', texto: 'Juntei três dívidas de cartão numa parcela só e a economia no mês pagou a escola das crianças. Me explicaram cada número antes de assinar.' },
  { nome: 'Roberto A.', cidade: 'Águas Claras, DF', produto: 'Consignado INSS', texto: 'Trouxeram meu consignado pra um banco com taxa menor e a parcela caiu. Atendimento com paciência, sem aquela pressão de telemarketing.' },
  { nome: 'Juliana e Pedro', cidade: 'Goiânia, GO', produto: 'Financiamento imobiliário', texto: 'Compararam quatro bancos pra gente. Fechamos com uma taxa que sozinhos não teríamos conseguido.' },
  { nome: 'Carlos M.', cidade: 'Taguatinga, DF', produto: 'Garantia de veículo', texto: 'Precisava de capital de giro rápido pra loja. Usei a caminhonete como garantia e continuei trabalhando com ela.' },
]

export const faqGeral = [
  { p: 'A Conquistare é um banco?', r: 'Não. Somos correspondentes bancários: conectamos você às instituições financeiras parceiras, comparamos propostas e acompanhamos todo o processo. O crédito é concedido pelo banco.' },
  { p: 'Vocês cobram alguma taxa antecipada?', r: 'Nunca. Nenhum valor é cobrado antes da liberação do crédito. Se alguém pedir depósito ou pagamento antecipado em nome da Conquistare, é golpe. Denuncie pelos nossos canais oficiais.' },
  { p: 'Simular compromete meu CPF?', r: 'Não. A simulação não gera consulta que afete seu score. A análise de crédito só acontece com a sua autorização.' },
  { p: 'Negativado pode conseguir crédito?', r: 'Em várias modalidades sim, principalmente com garantia ou consignado, porque o risco pro banco é menor. Cada caso é analisado individualmente.' },
  { p: 'O que é CET?', r: 'Custo Efetivo Total. É a taxa que inclui juros, impostos (IOF), seguros e tarifas. É o número que você deve comparar entre propostas, e ele sempre aparece na sua proposta antes da assinatura.' },
  { p: 'Quanto tempo até o dinheiro cair?', r: 'Consignado e garantia de veículo costumam sair em poucos dias. Garantia de imóvel e financiamento imobiliário levam de 15 a 30 dias por causa da avaliação e do registro.' },
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
    slug: 'home-equity-mitos',
    titulo: '5 mitos sobre empréstimo com garantia de imóvel',
    resumo: '"Vou perder minha casa", "é só pra quem está quebrado". Separamos o que é verdade do que é medo.',
    categoria: 'Garantia de imóvel',
    leitura: '6 min',
    data: '2026-07-30',
    corpo: [
      { tipo: 'p', texto: 'O empréstimo com garantia de imóvel, também chamado de home equity, é muito usado em outros países e ainda gera desconfiança por aqui. Vamos aos mitos.' },
      { tipo: 'h2', texto: '1. "Vou perder minha casa"' },
      { tipo: 'p', texto: 'O imóvel só é executado após inadimplência prolongada e um rito legal com várias notificações. Com a parcela bem dimensionada, o risco é controlado.' },
      { tipo: 'h2', texto: '2. "É só pra quem está endividado"' },
      { tipo: 'p', texto: 'Muita gente usa pra investir no próprio negócio, reformar ou financiar um projeto grande com juro baixo.' },
      { tipo: 'h2', texto: '3. "Preciso sair do imóvel"' },
      { tipo: 'p', texto: 'Não. Você continua morando, alugando ou usando normalmente.' },
      { tipo: 'h2', texto: '4. "Imóvel financiado não serve"' },
      { tipo: 'p', texto: 'Dependendo do saldo devedor, serve sim.' },
      { tipo: 'h2', texto: '5. "É muito burocrático"' },
      { tipo: 'p', texto: 'Tem etapas a mais que um crédito comum, mas o especialista cuida da maior parte delas pra você.' },
    ],
  },
]
