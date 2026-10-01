// Meta Pixel, GA4, UTMs e consentimento de cookies (LGPD).
// Pixel e GA só carregam depois que o visitante aceita os cookies.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: unknown
    dataLayer?: unknown[]
    gtag?: (...args: any[]) => void
  }
}

const PIXEL = import.meta.env.VITE_META_PIXEL_ID as string | undefined
const GA = import.meta.env.VITE_GA_ID as string | undefined
const CHAVE_CONSENT = 'conquistare:cookies'
const CHAVE_UTM = 'conquistare:utm'

function ler(chave: string, store: Storage = localStorage): string | null {
  try {
    return store.getItem(chave)
  } catch {
    return null
  }
}
function gravar(chave: string, valor: string, store: Storage = localStorage) {
  try {
    store.setItem(chave, valor)
  } catch {
    /* navegação privada */
  }
}

export function consentimento(): 'aceito' | 'recusado' | null {
  const v = ler(CHAVE_CONSENT)
  return v === 'aceito' || v === 'recusado' ? v : null
}

export function definirConsentimento(v: 'aceito' | 'recusado') {
  gravar(CHAVE_CONSENT, v)
  if (v === 'aceito') iniciarRastreio()
}

let iniciado = false
export function iniciarRastreio() {
  if (iniciado || consentimento() !== 'aceito') return
  iniciado = true
  if (PIXEL) {
    const f: any = window
    const n: any = (f.fbq = function (...a: any[]) {
      n.callMethod ? n.callMethod(...a) : n.queue.push(a)
    })
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(s)
    window.fbq!('init', PIXEL)
  }
  if (GA) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      // gtag exige o objeto arguments
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA, { send_page_view: false })
  }
  paginaVista()
}

export function paginaVista() {
  if (!iniciado) return
  window.fbq?.('track', 'PageView')
  window.gtag?.('event', 'page_view', { page_path: location.pathname + location.search })
}

export function evento(nome: 'Lead' | 'Contact' | 'SimulacaoIniciada', dados: Record<string, unknown> = {}) {
  if (!iniciado) return
  if (nome === 'SimulacaoIniciada') window.fbq?.('trackCustom', nome, dados)
  else window.fbq?.('track', nome, dados)
  window.gtag?.('event', nome === 'Lead' ? 'generate_lead' : nome.toLowerCase(), dados)
}

// Guarda os UTMs da primeira página que o visitante abriu na sessão, pra
// saber de qual anúncio veio o lead mesmo depois de navegar pelo site.
export function capturarUtm() {
  const q = new URLSearchParams(location.search)
  const campos = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']
  const achados: Record<string, string> = {}
  campos.forEach((c) => {
    const v = q.get(c)
    if (v) achados[c] = v
  })
  if (Object.keys(achados).length) gravar(CHAVE_UTM, JSON.stringify(achados), sessionStorage)
}

export function utms(): Record<string, string> {
  try {
    return JSON.parse(ler(CHAVE_UTM, sessionStorage) || '{}')
  } catch {
    return {}
  }
}
