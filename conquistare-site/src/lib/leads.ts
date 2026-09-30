import { marca, linkWhatsApp } from '../config/marca'
import { evento, utms } from './rastreio'

export interface Lead {
  produto: string
  produtoNome: string
  nome: string
  cpf?: string
  telefone: string
  email?: string
  cidade?: string
  uf?: string
  valor?: number
  prazo?: number
  parcelaEstimada?: number
  extras: Record<string, string>
  mensagem?: string
  origem: string // página de onde veio
}

export interface LeadEnviado extends Lead {
  id: string
  criadoEm: string
  utm: Record<string, string>
}

const WEBHOOK = import.meta.env.VITE_LEAD_WEBHOOK as string | undefined
const CHAVE_ULTIMO = 'conquistare:ultimo-lead'

// Envia o lead. Com VITE_LEAD_WEBHOOK configurado, faz POST JSON (Make,
// Zapier, n8n, Apps Script, Supabase...). Sem webhook, o lead segue pelo
// WhatsApp na página de obrigado. Nunca trava o visitante: se o webhook
// falhar, ele ainda cai no WhatsApp.
export async function enviarLead(lead: Lead): Promise<LeadEnviado> {
  const completo: LeadEnviado = {
    ...lead,
    id: crypto.randomUUID?.() ?? String(Date.now()),
    criadoEm: new Date().toISOString(),
    utm: utms(),
  }
  if (WEBHOOK) {
    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita preflight CORS em Apps Script
        body: JSON.stringify(completo),
      })
    } catch {
      /* segue pro WhatsApp */
    }
  }
  evento('Lead', { content_name: lead.produtoNome, value: lead.valor, currency: 'BRL' })
  try {
    sessionStorage.setItem(CHAVE_ULTIMO, JSON.stringify(completo))
  } catch {
    /* ok */
  }
  return completo
}

export function ultimoLead(): LeadEnviado | null {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_ULTIMO) || 'null')
  } catch {
    return null
  }
}

export function whatsDoLead(l: LeadEnviado): string {
  const linhas = [
    `Olá, ${marca.nome}! Acabei de fazer uma simulação no site.`,
    `Produto: ${l.produtoNome}`,
    l.valor ? `Valor: R$ ${l.valor.toLocaleString('pt-BR')}` : '',
    l.prazo ? `Prazo: ${l.prazo} meses` : '',
    `Nome: ${l.nome}`,
  ].filter(Boolean)
  return linkWhatsApp(linhas.join('\n'))
}
