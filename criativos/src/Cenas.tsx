import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Criativo} from './schema';
import {SANS, SERIF} from './fontes';
import {COR, entrada, margensDe, saida} from './estilo';
import {assinaturaDe, brl, ctaDe, ehPremium} from './regras';

// Escala de tipo: vertical tem mais altura pra respirar, feed precisa ser mais contido.
const useEscala = () => {
	const {width, height} = useVideoConfig();
	const vertical = height / width > 1.6;
	return {m: margensDe(width, height), k: vertical ? 1 : 0.86};
};

const Area: React.FC<{children: React.ReactNode; alinhar?: 'flex-start' | 'center' | 'flex-end'}> = ({
	children,
	alinhar = 'flex-end',
}) => {
	const {m} = useEscala();
	return (
		<AbsoluteFill
			style={{
				padding: `${m.topo}px ${m.dir}px ${m.base}px ${m.esq}px`,
				justifyContent: alinhar,
				color: COR.texto,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

const sombraTexto = '0 2px 24px rgba(0, 0, 0, 0.35)';

export const Gancho: React.FC<{c: Criativo; duracao: number}> = ({c, duracao}) => {
	const frame = useCurrentFrame();
	const {k} = useEscala();
	const palavras = c.gancho.setup.split(/\s+/).filter(Boolean);
	const passo = 3;
	const fimSetup = 4 + palavras.length * passo + 10;
	// A pausa das reticências: meio segundo de silêncio antes da revelação.
	const tRevela = Math.min(fimSetup + 15, duracao - 40);
	const sai = saida(frame, duracao, 6);

	return (
		<Area alinhar="center">
			<div style={{opacity: sai}}>
				<div style={{fontFamily: SERIF, fontSize: 82 * k, lineHeight: 1.08, letterSpacing: -0.5, textShadow: sombraTexto}}>
					{palavras.map((p, i) => (
						<span key={i} style={{display: 'inline-block', marginRight: '0.24em', ...entrada(frame, 4 + i * passo, 12, 18)}}>
							{p}
						</span>
					))}
				</div>
				<div
					style={{
						fontFamily: SERIF,
						fontStyle: 'italic',
						fontSize: 104 * k,
						lineHeight: 1.02,
						marginTop: 26 * k,
						color: COR.champagne,
						textShadow: sombraTexto,
						...entrada(frame, tRevela, 14, 0),
						transform: `scale(${interpolate(frame, [tRevela, tRevela + 20], [1.06, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})})`,
						transformOrigin: 'left center',
					}}
				>
					{c.gancho.revelacao}
				</div>
			</div>
		</Area>
	);
};

export const Take: React.FC<{legenda: string; duracao: number}> = ({legenda, duracao}) => {
	const frame = useCurrentFrame();
	const {k} = useEscala();
	if (!legenda.trim()) return null;
	const e = entrada(frame, 3, 10, 14);
	return (
		<Area>
			<div
				style={{
					fontFamily: SANS,
					fontWeight: 500,
					fontSize: 38 * k,
					lineHeight: 1.25,
					maxWidth: 760,
					textShadow: sombraTexto,
					...e,
					opacity: Math.min(e.opacity as number, saida(frame, duracao, 5)),
				}}
			>
				{legenda}
			</div>
		</Area>
	);
};

const Fio: React.FC<{frame: number; inicio: number}> = ({frame, inicio}) => (
	<div
		style={{
			height: 2,
			width: 120,
			backgroundColor: COR.champagne,
			marginBottom: 30,
			transformOrigin: 'left',
			transform: `scaleX(${interpolate(frame, [inicio, inicio + 18], [0, 1], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})})`,
		}}
	/>
);

export const Destaque: React.FC<{c: Criativo; duracao: number}> = ({c, duracao}) => {
	const frame = useCurrentFrame();
	const {k} = useEscala();
	return (
		<Area>
			<div style={{opacity: saida(frame, duracao, 6)}}>
				<Fio frame={frame} inicio={2} />
				<div style={{fontFamily: SERIF, fontSize: 70 * k, lineHeight: 1.1, textShadow: sombraTexto, ...entrada(frame, 6, 18)}}>
					{c.destaque}
				</div>
				{c.assinadoPor.trim() ? (
					<div
						style={{
							fontFamily: SANS,
							fontSize: 32 * k,
							letterSpacing: 1,
							marginTop: 28,
							color: COR.suave,
							...entrada(frame, 26, 14, 12),
						}}
					>
						{c.assinadoPor}
					</div>
				) : null}
			</div>
		</Area>
	);
};

export const Ficha: React.FC<{c: Criativo; duracao: number}> = ({c, duracao}) => {
	const frame = useCurrentFrame();
	const {k} = useEscala();
	const im = c.imovel;
	const local = [im.bairro, im.quadra].filter((v) => v.trim()).join(' · ');
	const specs = [
		im.area ? `${im.area} m²` : '',
		im.quartos ? `${im.quartos} ${im.quartos === '1' ? 'quarto' : 'quartos'}` : '',
		im.vagas ? `${im.vagas} ${im.vagas === '1' ? 'vaga' : 'vagas'}` : '',
	].filter(Boolean);

	return (
		<Area>
			<div style={{opacity: saida(frame, duracao, 6), textShadow: sombraTexto}}>
				<div
					style={{
						fontFamily: SANS,
						fontWeight: 500,
						fontSize: 26 * k,
						letterSpacing: 7,
						textTransform: 'uppercase',
						color: COR.champagne,
						...entrada(frame, 2, 12, 10),
					}}
				>
					{local}
				</div>
				<div style={{fontFamily: SERIF, fontSize: 86 * k, lineHeight: 1.04, marginTop: 14, ...entrada(frame, 6, 16)}}>
					{im.nome}
				</div>
				{specs.length ? (
					<div
						style={{
							display: 'flex',
							gap: 0,
							marginTop: 34 * k,
							paddingTop: 26 * k,
							borderTop: `1px solid ${COR.linha}`,
							fontFamily: SANS,
							fontSize: 34 * k,
							color: COR.suave,
						}}
					>
						{specs.map((s, i) => (
							<div
								key={s}
								style={{
									paddingRight: 30,
									marginRight: 30,
									borderRight: i < specs.length - 1 ? `1px solid ${COR.linha}` : 'none',
									...entrada(frame, 16 + i * 4, 12, 10),
								}}
							>
								{s}
							</div>
						))}
					</div>
				) : null}
				<div style={{fontFamily: SERIF, fontSize: 64 * k, marginTop: 26 * k, ...entrada(frame, 30, 14, 12)}}>
					{brl(im.preco)}
				</div>
			</div>
		</Area>
	);
};

export const Objecao: React.FC<{c: Criativo; duracao: number}> = ({c, duracao}) => {
	const frame = useCurrentFrame();
	const {k} = useEscala();
	return (
		<Area>
			<div style={{opacity: saida(frame, duracao, 6)}}>
				<Fio frame={frame} inicio={2} />
				<div style={{fontFamily: SERIF, fontSize: 66 * k, lineHeight: 1.12, textShadow: sombraTexto, ...entrada(frame, 6, 16)}}>
					{c.objecao}
				</div>
			</div>
		</Area>
	);
};

export const Fechamento: React.FC<{c: Criativo}> = ({c}) => {
	const frame = useCurrentFrame();
	const {k} = useEscala();
	const premium = ehPremium(c);
	return (
		<Area alinhar="center">
			<div style={{fontFamily: SERIF, fontSize: 78 * k, lineHeight: 1.08, textShadow: sombraTexto, ...entrada(frame, 4, 18)}}>
				{ctaDe(c)}
			</div>
			<div
				style={{
					height: 1,
					backgroundColor: COR.linha,
					margin: `${48 * k}px 0 ${34 * k}px`,
					transformOrigin: 'left',
					transform: `scaleX(${interpolate(frame, [20, 44], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
				}}
			/>
			<div
				style={{
					fontFamily: SANS,
					fontWeight: 600,
					fontSize: 27 * k,
					letterSpacing: 6,
					textTransform: 'uppercase',
					color: COR.suave,
					...entrada(frame, 30, 14, 10),
				}}
			>
				{c.marca.nome}
			</div>
			{premium ? (
				<div
					style={{
						fontFamily: SERIF,
						fontStyle: 'italic',
						fontSize: 50 * k,
						lineHeight: 1.15,
						marginTop: 18,
						color: COR.champagne,
						...entrada(frame, 40, 18, 12),
					}}
				>
					{assinaturaDe(c)}
				</div>
			) : (
				<div style={{fontFamily: SANS, fontSize: 36 * k, marginTop: 16, color: COR.suave, ...entrada(frame, 40, 14, 10)}}>
					{assinaturaDe(c)}
				</div>
			)}
		</Area>
	);
};
