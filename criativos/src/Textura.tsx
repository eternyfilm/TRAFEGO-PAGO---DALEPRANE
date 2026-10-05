import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

const RUIDO = `url("data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;

// Vinheta, gradiente de leitura na base e grão leve: tira a cara de slide e segura o texto em cima de foto clara.
export const Textura: React.FC<{leitura?: number}> = ({leitura = 0.75}) => {
	const frame = useCurrentFrame();
	const x = Math.floor(random(`gx${frame}`) * 320);
	const y = Math.floor(random(`gy${frame}`) * 320);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, rgba(11,10,9,0.35) 0%, rgba(11,10,9,0) 22%, rgba(11,10,9,0) 45%, rgba(11,10,9,${leitura}) 100%)`,
				}}
			/>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.38) 100%)'}} />
			<AbsoluteFill
				style={{backgroundImage: RUIDO, backgroundPosition: `${x}px ${y}px`, opacity: 0.07, mixBlendMode: 'overlay'}}
			/>
		</AbsoluteFill>
	);
};
