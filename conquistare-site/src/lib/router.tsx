import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react'

// Roteamento por history API (URLs limpas, boas pra SEO e pra UTM de anúncio).
// O host precisa reescrever tudo pra index.html: vercel.json e public/_redirects.
// Na prévia de arquivo único (VITE_ROTEAMENTO=hash) as rotas vão depois do #.

const EVENTO = 'conquistare:rota'
const HASH = import.meta.env.VITE_ROTEAMENTO === 'hash'

function lerRota() {
  if (!HASH) return { path: location.pathname, busca: location.search }
  const h = location.hash.slice(1) || '/'
  const i = h.indexOf('?')
  return i === -1 ? { path: h, busca: '' } : { path: h.slice(0, i), busca: h.slice(i) }
}

export function navegar(para: string) {
  if (HASH) {
    if (location.hash.slice(1) !== para) location.hash = para
  } else if (para !== location.pathname + location.search) {
    history.pushState({}, '', para)
  }
  window.dispatchEvent(new Event(EVENTO))
  window.scrollTo({ top: 0 })
}

export function useRota() {
  const [rota, setRota] = useState(lerRota)
  useEffect(() => {
    const atualizar = () => setRota(lerRota())
    window.addEventListener('popstate', atualizar)
    window.addEventListener('hashchange', atualizar)
    window.addEventListener(EVENTO, atualizar)
    return () => {
      window.removeEventListener('popstate', atualizar)
      window.removeEventListener('hashchange', atualizar)
      window.removeEventListener(EVENTO, atualizar)
    }
  }, [])
  return rota
}

export function useBusca(): URLSearchParams {
  const { busca } = useRota()
  return new URLSearchParams(busca)
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { para: string }

export function Link({ para, onClick, children, ...resto }: LinkProps) {
  const externo = /^(https?:|mailto:|tel:)/.test(para)
  const ancora = para.startsWith('#')
  const href = externo || ancora || !HASH ? para : `#${para}`
  function clicar(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (externo || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (ancora) {
      document.getElementById(para.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navegar(para)
  }
  return (
    <a href={href} onClick={clicar} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...resto}>
      {children}
    </a>
  )
}
