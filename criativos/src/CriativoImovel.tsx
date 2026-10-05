import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';
import type {Criativo} from './schema';
import {Midia} from './Midia';
import {Textura} from './Textura';
import {Destaque, Fechamento, Ficha, Gancho, Objecao, Take} from './Cenas';
import {linhaDoTempo} from './regras';

const ESCURECER: Record<string, number> = {gancho: 0.18, take: 0, destaque: 0.2, ficha: 0.25, objecao: 0.25, fechamento: 0.5};

export const CriativoImovel: React.FC<Criativo> = (c) => {
	const {durationInFrames} = useVideoConfig();
	const blocos = linhaDoTempo(c);

	return (
		<AbsoluteFill style={{backgroundColor: '#0B0A09'}}>
			{blocos.map((b, i) => (
				<Sequence key={i} from={b.inicio} durationInFrames={b.duracao} name={b.tipo}>
					<Midia cena={c.cenas[b.cena]} numero={b.cena} movimento={i} duracao={b.duracao} escurecer={ESCURECER[b.tipo]} />
					<Textura leitura={b.tipo === 'take' ? 0.45 : 0.8} />
					{b.tipo === 'gancho' ? <Gancho c={c} duracao={b.duracao} /> : null}
					{b.tipo === 'take' ? <Take legenda={c.cenas[b.cena].legenda} duracao={b.duracao} /> : null}
					{b.tipo === 'destaque' ? <Destaque c={c} duracao={b.duracao} /> : null}
					{b.tipo === 'ficha' ? <Ficha c={c} duracao={b.duracao} /> : null}
					{b.tipo === 'objecao' ? <Objecao c={c} duracao={b.duracao} /> : null}
					{b.tipo === 'fechamento' ? <Fechamento c={c} /> : null}
				</Sequence>
			))}
			{c.trilha ? (
				<Audio
					src={/^https?:\/\//.test(c.trilha) ? c.trilha : staticFile(c.trilha)}
					volume={(f) =>
						interpolate(f, [0, 10, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
