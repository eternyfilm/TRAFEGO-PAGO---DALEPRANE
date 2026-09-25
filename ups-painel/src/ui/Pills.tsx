import type { StatusTarefa, Dono } from '../types'

const LABEL_STATUS: Record<StatusTarefa, string> = {
  'a-fazer': 'A fazer',
  fazendo: 'Fazendo',
  travado: 'Travado',
  feito: 'Feito',
}

export function StatusPill({ status }: { status: StatusTarefa }) {
  return (
    <span className={`pill ${status}`}>
      <span className="dot" />
      {LABEL_STATUS[status]}
    </span>
  )
}

export function DonoPill({ dono }: { dono: Dono }) {
  return <span className={`pill dono ${dono}`}>{dono}</span>
}

export { LABEL_STATUS }
