// Diafragma de câmera (aperture). Usado com moderação, sobretudo no progresso
// das fases. `progresso` de 0 a 1 acende as lâminas gradualmente.

interface Props {
  size?: number
  progresso?: number // 0..1
  className?: string
}

const LAMINAS = 6

export function Aperture({ size = 44, progresso = 1, className }: Props) {
  const cx = 50
  const cy = 50
  const rExt = 42
  const acesas = Math.round(progresso * LAMINAS)

  const laminas = Array.from({ length: LAMINAS }, (_, i) => {
    const ang = (i * 360) / LAMINAS
    const ang2 = ((i + 1) * 360) / LAMINAS
    const p1 = ponto(cx, cy, rExt, ang)
    const p2 = ponto(cx, cy, rExt, ang2)
    const acesa = i < acesas
    return (
      <path
        key={i}
        d={`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${rExt} ${rExt} 0 0 1 ${p2.x} ${p2.y} Z`}
        fill={acesa ? 'currentColor' : 'none'}
        fillOpacity={acesa ? 0.16 : 0}
        stroke="currentColor"
        strokeOpacity={acesa ? 0.9 : 0.28}
        strokeWidth={1.4}
        style={{ transition: 'fill-opacity 0.4s, stroke-opacity 0.4s' }}
      />
    )
  })

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Diafragma"
    >
      <circle cx={cx} cy={cy} r={rExt + 3} fill="none" stroke="currentColor" strokeOpacity={0.2} />
      {laminas}
      <circle cx={cx} cy={cy} r={7} fill="currentColor" fillOpacity={0.9} />
    </svg>
  )
}

function ponto(cx: number, cy: number, r: number, angGraus: number) {
  const a = ((angGraus - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}
