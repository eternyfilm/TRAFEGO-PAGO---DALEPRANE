// Máscaras e validações de formulário.

export function mascaraMoeda(s: string): string {
  const n = s.replace(/\D/g, '')
  if (!n) return ''
  return 'R$ ' + Number(n).toLocaleString('pt-BR')
}

export function mascaraCPF(s: string): string {
  return s
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function mascaraTelefone(s: string): string {
  const d = s.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function mascaraCEP(s: string): string {
  return s.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
}

export function mascaraData(s: string): string {
  return s.replace(/\D/g, '').slice(0, 8).replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2')
}

export function cpfValido(s: string): boolean {
  const d = s.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const calc = (fim: number) => {
    let soma = 0
    for (let i = 0; i < fim; i++) soma += Number(d[i]) * (fim + 1 - i)
    const r = (soma * 10) % 11
    return r === 10 ? 0 : r
  }
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10])
}

export function telefoneValido(s: string): boolean {
  const d = s.replace(/\D/g, '')
  return d.length === 11 && d[2] === '9'
}

export function emailValido(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())
}

export const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
