import { useEffect, useState } from 'react'

export type Rota = 'home' | 'roadmap' | 'funil' | 'comercial' | 'estrategia'

const VALIDAS: Rota[] = ['home', 'roadmap', 'funil', 'comercial', 'estrategia']

function lerHash(): Rota {
  const h = window.location.hash.replace('#/', '').replace('#', '') as Rota
  return VALIDAS.includes(h) ? h : 'home'
}

export function useRota(): Rota {
  const [rota, setRota] = useState<Rota>(lerHash)
  useEffect(() => {
    const onHash = () => setRota(lerHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return rota
}

export function irPara(rota: Rota) {
  window.location.hash = `/${rota}`
}
