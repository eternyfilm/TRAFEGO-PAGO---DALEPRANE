// Tudo no fuso America/Sao_Paulo e formato brasileiro.

const FUSO = 'America/Sao_Paulo'

// "Hoje" no fuso de São Paulo, como string ISO yyyy-mm-dd.
export function hojeISO(): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return fmt.format(new Date()) // en-CA já entrega yyyy-mm-dd
}

// Formata uma data ISO (yyyy-mm-dd) para dd/mm/aaaa.
export function formatarBR(iso: string | null): string {
  if (!iso) return 'sem prazo'
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) return iso
  return `${dia}/${mes}/${ano}`
}

// Formata datetime ISO para dd/mm/aaaa.
export function formatarDataBR(iso: string): string {
  return formatarBR(iso.slice(0, 10))
}

// Diferença em dias inteiros entre hoje e uma data ISO (positivo = futuro).
export function diasAte(iso: string): number {
  const hoje = new Date(hojeISO() + 'T00:00:00')
  const alvo = new Date(iso + 'T00:00:00')
  const ms = alvo.getTime() - hoje.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export interface Regressiva {
  dias: number
  semanas: number
  vencido: boolean
}

export function contagemRegressiva(alvoISO: string): Regressiva {
  const dias = diasAte(alvoISO)
  return {
    dias: Math.abs(dias),
    semanas: Math.floor(Math.abs(dias) / 7),
    vencido: dias < 0,
  }
}

// Um ISO date está dentro do intervalo [inicio, fim]?
export function dentroDoIntervalo(
  iso: string,
  inicio: string | null,
  fim: string | null,
): boolean {
  if (!inicio || !fim) return false
  return iso >= inicio && iso <= fim
}
