import { useEffect, type ReactNode } from 'react'

interface Props {
  titulo: string
  aberto: boolean
  aoFechar: () => void
  children: ReactNode
}

export function Modal({ titulo, aberto, aoFechar, children }: Props) {
  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto, aoFechar])

  if (!aberto) return null

  return (
    <div className="overlay" onMouseDown={aoFechar}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="entre mb">
          <h2>{titulo}</h2>
          <button className="btn ghost pequeno" onClick={aoFechar} aria-label="Fechar">
            Fechar
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
