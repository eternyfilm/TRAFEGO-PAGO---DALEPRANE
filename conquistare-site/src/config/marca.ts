// Tudo que é identidade e dado institucional da Conquistare mora aqui.
// Trocar cor, contato ou texto legal é mexer só neste arquivo (cores também
// estão espelhadas em src/styles/global.css, bloco :root).

export const marca = {
  nome: 'Conquistare',
  nomeCompleto: 'Conquistare Cred',
  assinatura: 'Crédito pra conquistar o que importa.',

  // Enquanto true, aparece uma faixa no topo avisando que taxas, números e
  // depoimentos são ilustrativos. Desligar só depois de revisar tudo com a
  // Conquistare (checklist no README).
  rascunho: true,

  // Logo oficial: coloque o arquivo em public/ (ex.: public/logo.svg) e
  // aponte aqui. Vazio = usa a marca provisória desenhada em src/ui/Logo.tsx.
  logoUrl: '',

  contato: {
    // Somente dígitos, com DDI + DDD. Ex.: 5561999999999
    whatsapp: '5561999999999',
    telefoneExibicao: '(61) 99999-9999',
    email: 'contato@conquistarecred.com.br',
    endereco: 'Brasília, DF',
    horario: 'Segunda a sexta, 8h às 18h',
  },

  redes: {
    instagram: 'https://www.instagram.com/conquistarecred/',
    facebook: '',
    linkedin: '',
    youtube: '',
  },

  legal: {
    razaoSocial: 'CONQUISTARE [RAZÃO SOCIAL A CONFIRMAR]',
    cnpj: '00.000.000/0001-00',
    // Texto exigido para correspondente bancário (Res. CMN 4.935/2021).
    // Ajustar para o modelo real de operação da Conquistare e listar os
    // bancos parceiros de verdade antes de publicar.
    aviso:
      'A Conquistare atua como correspondente bancário, nos termos da Resolução CMN nº 4.935/2021, ' +
      'e não é instituição financeira. As operações de crédito são concedidas por instituições ' +
      'financeiras parceiras, sujeitas a análise de crédito e às condições vigentes no momento da ' +
      'contratação. A Conquistare não cobra nenhum valor antecipado para liberar crédito.',
    parceiros: ['Banco parceiro A', 'Banco parceiro B', 'Banco parceiro C'],
  },
} as const

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${marca.contato.whatsapp}?text=${encodeURIComponent(mensagem)}`
}
