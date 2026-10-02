// Motion de carregamento: a bolinha (o "sol") sai do pico do telhado, contorna a
// casinha no sentido anti-horário, encolhe enquanto viaja e pousa de volta no
// pico com um respiro. Só SVG + CSS (keyframes em theme.css, bloco
// "Carregador"), então roda no compositor e não depende de JS por quadro.
//
// Geometria: logo vetorizado em unidades de 24 (espessura do traço), inclinação
// do telhado de 30°. Origem no canto superior esquerdo do logo, pico em (200, 0).
// A órbita gira em torno de (100, 160), o que mantém a bolinha longe dos cantos.
//
// Cores: o logo usa currentColor; a bolinha usa --carregador-sol.

interface Props {
  size?: number
  texto?: string
  className?: string
}

const RAIO_ORBITA = 188.68

export function Carregador({ size = 96, texto, className }: Props) {
  return (
    <div
      className={['carregador', className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <svg width={size} height={size} viewBox="-120 -60 440 440" aria-hidden="true">
        <g className="carregador-orbita">
          <path
            className="carregador-rastro"
            pathLength={100}
            d={`M 200 0 A ${RAIO_ORBITA} ${RAIO_ORBITA} 0 0 1 173.71 333.69`}
          />
          <circle className="carregador-sol" cx={200} cy={0} r={50} />
        </g>
        <g fill="currentColor">
          <polygon points="56,83.14 200,0 200,266 176,266 176,41.57 80,96.99 80,146.48 56,132.62" />
          <polygon points="0,128 134,205.36 134,266 110,266 110,219.22 24,169.57 24,266 0,266" />
          <rect x={56} y={232} width={24} height={34} />
        </g>
      </svg>
      {texto ? <span className="carregador-texto">{texto}</span> : <span className="sr-only">Carregando</span>}
    </div>
  )
}
