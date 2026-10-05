import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Cena} from './schema';
import {SANS} from './fontes';

const resolver = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

// Movimento lento e contínuo, como um slider: cada take empurra numa direção diferente.
const MOVIMENTOS = [
	{de: [1.0, 0, 0], para: [1.08, -1.2, -0.8]},
	{de: [1.1, 1.5, 0], para: [1.03, -1.5, 0]},
	{de: [1.04, 0, 1.2], para: [1.1, 0, -1.2]},
	{de: [1.09, -1.2, 0.6], para: [1.02, 1.2, -0.6]},
];

export const Midia: React.FC<{cena: Cena; numero: number; movimento: number; duracao: number; escurecer?: number}> = ({
	cena,
	numero,
	movimento,
	duracao,
	escurecer = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const m = MOVIMENTOS[movimento % MOVIMENTOS.length];
	const p = interpolate(frame, [0, duracao], [0, 1], {extrapolateRight: 'clamp'});
	const [escala, x, y] = m.de.map((v, i) => v + (m.para[i] - v) * p);
	const transform = `scale(${escala}) translate(${x}%, ${y}%)`;
	const estilo: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', transform};

	return (
		<AbsoluteFill style={{backgroundColor: '#0B0A09', overflow: 'hidden'}}>
			{cena.src === '' ? (
				<Placeholder numero={numero} transform={transform} />
			) : cena.tipo === 'video' ? (
				<OffthreadVideo src={resolver(cena.src)} trimBefore={Math.round(cena.inicio * fps)} muted style={estilo} />
			) : (
				<Img src={resolver(cena.src)} style={estilo} />
			)}
			{escurecer > 0 ? <AbsoluteFill style={{backgroundColor: `rgba(11, 10, 9, ${escurecer})`}} /> : null}
		</AbsoluteFill>
	);
};

// Sem mídia: luz quente de janela sobre parede, pra dar pra julgar tipografia e ritmo antes das fotos chegarem.
const TONS = [
	['#3B2F25', '#A8875F'],
	['#26292B', '#8C8A82'],
	['#2F2A22', '#C2A57A'],
	['#1F2522', '#7E8C7A'],
	['#332620', '#B07F5E'],
	['#22262E', '#8D97A6'],
];

const Placeholder: React.FC<{numero: number; transform: string}> = ({numero, transform}) => {
	const [escuro, claro] = TONS[numero % TONS.length];
	return (
		<AbsoluteFill style={{transform}}>
			<AbsoluteFill style={{background: `linear-gradient(160deg, ${claro} 0%, ${escuro} 62%)`}} />
			<AbsoluteFill
				style={{
					background: `linear-gradient(115deg, transparent 30%, rgba(255, 236, 205, 0.22) 42%, transparent 54%, rgba(255, 236, 205, 0.12) 64%, transparent 72%)`,
				}}
			/>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: '9%'}}>
				<div
					style={{
						fontFamily: SANS,
						fontSize: 26,
						letterSpacing: 6,
						color: 'rgba(246, 241, 234, 0.35)',
						textTransform: 'uppercase',
					}}
				>
					cena {numero} · sem mídia
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
