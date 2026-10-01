// Tudo que é identidade e dado institucional da Conquistare mora aqui.
// Trocar cor, contato ou texto legal é mexer só neste arquivo (cores também
// estão espelhadas em src/styles/global.css, bloco :root).

export const marca = {
  nome: 'Conquistare',
  nomeCompleto: 'Conquistare Cred',
  descritor: 'Soluções Financeiras',
  assinatura: 'Chegou a hora de conquistar!',

  // Enquanto true, aparece uma faixa no topo avisando que taxas, números e
  // depoimentos são ilustrativos. Desligar só depois de revisar tudo com a
  // Conquistare (checklist no README).
  rascunho: true,

  // Logos oficiais em public/marca. A versão branca foi extraída do logo
  // branco oficial (fundo roxo removido). Quando houver SVG, é só trocar aqui.
  logos: {
    roxo: '/marca/logo-empilhado-roxo.png',
    branco: '/marca/logo-empilhado-branco.png',
    simbolo: '/marca/simbolo.png',
  },

  // Mascote/porta-voz da marca. PNG com fundo transparente em public/marca.
  mascote: {
    nome: 'Cadú',
    imagem: '/marca/cadu.png',
  },

  contato: {
    // Somente dígitos, com DDI + DDD. CONFIRMAR: hoje aponta pro fixo do
    // portfólio, que só funciona se ele tiver WhatsApp Business.
    whatsapp: '556135470030',
    telefone: '556135470030',
    telefoneExibicao: '(61) 3547-0030',
    email: 'contato@conquistarecred.com.br', // CONFIRMAR
    endereco: 'SIG Qd. 01, Lote 385, Ed. Platinum Office, Sala 405, Brasília/DF, CEP 70610-480',
    enderecoCurto: 'SIG, Ed. Platinum Office, Brasília/DF',
    horario: 'Segunda a sexta, 8h às 18h', // CONFIRMAR
  },

  redes: {
    instagram: 'https://www.instagram.com/conquistarecred/',
    facebook: '',
    linkedin: '',
    youtube: '',
  },

  legal: {
    razaoSocial: 'CONQUISTARE CRED [RAZÃO SOCIAL A CONFIRMAR]',
    cnpj: '00.000.000/0001-00',
    // Texto exigido para correspondente bancário (Res. CMN 4.935/2021).
    // Ajustar para o modelo real de operação da Conquistare e listar os
    // bancos parceiros de verdade antes de publicar.
    aviso:
      'A Conquistare Cred atua como correspondente bancário multibancos, nos termos da Resolução CMN ' +
      'nº 4.935/2021, e não é instituição financeira. As operações de crédito e consórcio são concedidas ' +
      'pelas instituições parceiras, sujeitas a análise e às condições vigentes no momento da contratação. ' +
      'A Conquistare não cobra nenhum valor antecipado para liberar crédito.',
    // Do portfólio da Conquistare (correspondente multibancos).
    parceiros: ['Caixa', 'BRB', 'Santander', 'Itaú', 'Bradesco', 'Poupex', 'Inter'],
  },
} as const

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${marca.contato.whatsapp}?text=${encodeURIComponent(mensagem)}`
}
