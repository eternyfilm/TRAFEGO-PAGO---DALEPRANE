import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react'

// Roteamento por history API (URLs limpas, boas pra SEO e pra UTM de anúncio).
// O host precisa reescrever tudo pra index.html: vercel.json e public/_redirects.

const EVENTO = 'conquistare:rota'

export function navegar(para: string) {
  if (para !== location.pathname + location.search) history.pushState({}, '', para)
  window.dispatchEvent(new Event(EVENTO))
  window.scrollTo({ top: 0 })
}

export function useRota() {
  const [rota, setRota] = useState(() => ({ path: location.pathname, busca: location.search }))
  useEffect(() => {
    const atualizar = () => setRota({ path: location.pathname, busca: location.search })
    window.addEventListener('popstate', atualizar)
    window.addEventListener(EVENTO, atualizar)
    return () => {
      window.removeEventListener('popstate', atualizar)
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
  function clicar(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (externo || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (para.startsWith('#')) {
      document.getElementById(para.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navegar(para)
  }
  return (
    <a href={para} onClick={clicar} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...resto}>
      {children}
    </a>
  )
}
