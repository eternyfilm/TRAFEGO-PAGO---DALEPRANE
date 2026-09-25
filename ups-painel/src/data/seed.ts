import type { AppState, Fase, Tarefa, DegrauOferta, Risco } from '../types'

// Frase-guia da estratégia, exibida em destaque na Home.
export const FRASE_GUIA =
  'Você não tem problema de lead. Tem problema de atendimento.'

// Data-alvo do case publicável.
export const DATA_ALVO = '2027-01-31'

const fases: Fase[] = [
  {
    id: 'fase-0',
    nome: 'Fase 0, Alinhamento',
    periodoLabel: '25/09 a 27/09',
    inicio: '2026-09-25',
    fim: '2026-09-27',
    ordem: 0,
  },
  {
    id: 'semana-1',
    nome: 'Semana 1, Linha de base',
    periodoLabel: '28/09 a 04/10',
    inicio: '2026-09-28',
    fim: '2026-10-04',
    ordem: 1,
  },
  {
    id: 'semana-2',
    nome: 'Semana 2, Intervenção manual',
    periodoLabel: '05/10 a 11/10',
    inicio: '2026-10-05',
    fim: '2026-10-11',
    ordem: 2,
  },
  {
    id: 'semana-3',
    nome: 'Semana 3, Coleta e venda',
    periodoLabel: '12/10 a 18/10',
    inicio: '2026-10-12',
    fim: '2026-10-18',
    ordem: 3,
  },
  {
    id: 'semana-4',
    nome: 'Semana 4 e fechamento',
    periodoLabel: '19/10 a 31/10',
    inicio: '2026-10-19',
    fim: '2026-10-31',
    ordem: 4,
  },
  {
    id: 'novembro',
    nome: 'Novembro, Automatizar o que funcionou',
    periodoLabel: 'Novembro',
    inicio: '2026-11-01',
    fim: '2026-11-30',
    ordem: 5,
  },
  {
    id: 'dezembro',
    nome: 'Dezembro, Primeira implementação externa',
    periodoLabel: 'Dezembro',
    inicio: '2026-12-01',
    fim: '2026-12-31',
    ordem: 6,
  },
  {
    id: 'janeiro',
    nome: 'Janeiro, Prova',
    periodoLabel: 'Janeiro',
    inicio: '2027-01-01',
    fim: '2027-01-31',
    ordem: 7,
  },
]

type SeedTarefa = Omit<Tarefa, 'id' | 'status' | 'notas' | 'prazo' | 'faseId'> & {
  prazo?: string | null
}

// Prazo padrão de cada tarefa: o fim da sua fase. Editável na tela Roadmap.
function tarefasDaFase(faseId: string, itens: SeedTarefa[]): Tarefa[] {
  const fase = fases.find((f) => f.id === faseId)!
  return itens.map((item, i) => ({
    id: `${faseId}-t${i + 1}`,
    titulo: item.titulo,
    descricao: item.descricao,
    dono: item.dono,
    faseId,
    prazo: item.prazo ?? fase.fim,
    status: 'a-fazer',
    notas: '',
  }))
}

const tarefas: Tarefa[] = [
  ...tarefasDaFase('fase-0', [
    {
      titulo: 'Conversar com a Aline sobre laboratório e venda do método',
      descricao:
        'Alinhar Daleprane como laboratório e a venda do método para outras imobiliárias antes de qualquer oferta externa.',
      dono: 'Ambos',
    },
    {
      titulo: 'Descobrir onde os corretores registram lead que virou visita',
      descricao: 'CRM, planilha ou nada. Se for nada, criar o registro vira a primeira tarefa.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Definir quem faz o primeiro contato manual no teste da semana 2',
      descricao: 'Decidir a pessoa responsável pelo primeiro contato durante a intervenção manual.',
      dono: 'Ambos',
    },
  ]),
  ...tarefasDaFase('semana-1', [
    {
      titulo: 'Exportar leads dos últimos 30 dias da Daleprane',
      descricao: 'Base bruta pra montar o funil real.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Montar o funil real',
      descricao:
        'Atendidos, tempo da primeira resposta, qualificados, visitas, propostas, vendas.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Rodar cliente oculto na Daleprane (Aline ciente)',
      descricao: 'Pelo menos 10 leads fictícios nos anúncios, cronometrando cada resposta.',
      dono: 'Caio',
    },
    {
      titulo: 'Registrar os 3 maiores vazamentos encontrados',
      descricao: 'Onde o funil mais perde lead, com evidência.',
      dono: 'Ambos',
    },
  ]),
  ...tarefasDaFase('semana-2', [
    {
      titulo: 'Separar campanhas em grupo teste e grupo controle',
      descricao: 'Base do experimento lead → visita.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Escrever roteiro de primeiro contato e perguntas de qualificação',
      descricao: 'Script humano que depois vira base da automação.',
      dono: 'Caio',
    },
    {
      titulo: 'Rodar primeiro contato em menos de 5 minutos no grupo teste',
      descricao: 'Com repasse ao corretor contendo resumo do lead.',
      dono: 'Ambos',
    },
    {
      titulo: 'Montar lista de 20 imobiliárias prospects para o Diagnóstico',
      descricao: 'Alvos do degrau 1 da escada de oferta.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Escrever o pitch do Diagnóstico e definir preço de teste',
      descricao: 'Hipótese de preço R$ 1.500 a R$ 3.000, abatido se fechar o degrau 2.',
      dono: 'Kalleby',
    },
  ]),
  ...tarefasDaFase('semana-3', [
    {
      titulo: 'Acompanhar e registrar o funil dos dois grupos diariamente',
      descricao: 'Teste vs controle, dado limpo todo dia.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Desenhar o modelo do relatório do Diagnóstico',
      descricao: 'Visual, pronto pra reaproveitar em qualquer cliente.',
      dono: 'Caio',
    },
    {
      titulo: 'Primeiras abordagens e reuniões com prospects',
      descricao: 'Colocar o pitch do Diagnóstico na rua.',
      dono: 'Kalleby',
    },
  ]),
  ...tarefasDaFase('semana-4', [
    {
      titulo: 'Comparar teste vs controle na taxa lead → visita',
      descricao: 'A métrica principal, com número na mão.',
      dono: 'Ambos',
    },
    {
      titulo: 'Escrever o mini case da Daleprane com os números',
      descricao: 'Primeira prova, base do case final.',
      dono: 'Caio',
    },
    {
      titulo: 'Fechar de 1 a 3 diagnósticos pagos',
      descricao: 'Primeira receita do degrau 1.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Revisão de outubro: decidir go/no-go do degrau 2',
      descricao: 'Decisão registrada no log da tela Estratégia.',
      dono: 'Ambos',
    },
  ]),
  ...tarefasDaFase('novembro', [
    {
      titulo: 'Automatizar primeiro contato no WhatsApp com qualificação e repasse',
      descricao: 'Transformar o roteiro manual validado em automação.',
      dono: 'Caio',
    },
    {
      titulo: 'Operador de tráfego v1 interno',
      descricao: 'Criação de campanha via API sempre pausada, com aprovação humana.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Entregar os diagnósticos vendidos',
      descricao: 'Cumprir o que foi fechado no degrau 1.',
      dono: 'Ambos',
    },
    {
      titulo: 'Montar proposta comercial do Sistema Lead → Visita',
      descricao: 'Setup + mensalidade, o degrau 2.',
      dono: 'Kalleby',
    },
  ]),
  ...tarefasDaFase('dezembro', [
    {
      titulo: 'Fechar primeiro cliente do Sistema Lead → Visita',
      descricao: 'Primeira implementação externa do degrau 2.',
      dono: 'Kalleby',
    },
    {
      titulo: 'Implementar e rodar painel semanal do funil do cliente',
      descricao: 'Entrega recorrente que sustenta a mensalidade.',
      dono: 'Ambos',
    },
  ]),
  ...tarefasDaFase('janeiro', [
    {
      titulo: 'Publicar case com números',
      descricao: '"Aumentamos X% a taxa de visita." A prova pública.',
      dono: 'Caio',
    },
    {
      titulo: 'Revisão final da meta de 31/01/2027',
      descricao: 'Case, primeiros clientes externos e receita mostrando que o modelo funciona.',
      dono: 'Ambos',
    },
  ]),
]

const escada: DegrauOferta[] = [
  {
    id: 'degrau-1',
    numero: 1,
    titulo: 'Diagnóstico de Funil (Raio-X)',
    quando: 'Vendável em outubro, 7 a 10 dias',
    descricao:
      'Cliente oculto, análise de tempo de resposta, % atendidos, % qualificados, % visitas. Entrega: relatório visual + plano de correção. Preço a validar: R$ 1.500 a R$ 3.000, abatido se fechar o degrau 2.',
  },
  {
    id: 'degrau-2',
    numero: 2,
    titulo: 'Sistema Lead → Visita',
    quando: 'Novembro / dezembro',
    descricao:
      'Tráfego + primeiro contato automático no WhatsApp em até 1 minuto + qualificação + repasse ao corretor com resumo + follow-up automático + painel semanal do funil. Setup + mensalidade.',
  },
  {
    id: 'degrau-3',
    numero: 3,
    titulo: 'Sistema de crescimento completo',
    quando: '2027, com case e dados',
    descricao:
      'Marketing → Aquisição → Comercial → Processos → Dados, com IA e automação atravessando tudo. Só depois de prova.',
  },
]

const riscos: Risco[] = [
  {
    id: 'risco-aline',
    titulo: 'Conflito com a Aline',
    descricao:
      'Vender o método para imobiliárias concorrentes em Brasília usando a Daleprane como laboratório. Conversar com ela antes de vender. Alternativas: vender fora de Brasília, para segmentos que não competem, ou trazê-la como parceira.',
    status: 'aberto',
  },
  {
    id: 'risco-capacidade',
    titulo: 'Capacidade',
    descricao:
      'Dois fundadores já no limite, com a Daleprane dependendo muito de nós. Toda oferta nova precisa ser leve de entregar.',
    status: 'aberto',
  },
  {
    id: 'risco-dados-visita',
    titulo: 'Dados de visita',
    descricao:
      'Se os corretores não registram visita em lugar nenhum, a primeira tarefa vira fazer esse registro acontecer.',
    status: 'aberto',
  },
]

export const seedState: AppState = {
  versao: 1,
  fases,
  tarefas,
  funil: [],
  prospects: [],
  riscos,
  decisoes: [],
  escada,
}
