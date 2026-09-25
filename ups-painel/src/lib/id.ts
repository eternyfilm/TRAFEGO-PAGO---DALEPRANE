// Gera um id curto e único o bastante para itens criados na interface.
export function novoId(prefixo = 'id'): string {
  const rnd = Math.random().toString(36).slice(2, 8)
  const t = Date.now().toString(36).slice(-4)
  return `${prefixo}-${t}${rnd}`
}
