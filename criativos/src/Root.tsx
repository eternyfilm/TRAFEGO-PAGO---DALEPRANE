import {Composition, type CalculateMetadataFunction} from 'remotion';
import {CriativoImovel} from './CriativoImovel';
import {criativoSchema, type Criativo} from './schema';
import {FPS, duracaoTotal} from './regras';
import exemplo from '../exemplos/exemplo-medio.json';

// A duração sai do número de cenas, e os defaults do schema completam o JSON do pedido.
const calcular: CalculateMetadataFunction<Criativo> = ({props}) => {
	const c = criativoSchema.parse(props);
	return {props: c, durationInFrames: duracaoTotal(c)};
};

const padrao = criativoSchema.parse(exemplo);

export const Root: React.FC = () => (
	<>
		{/* Reels e Stories */}
		<Composition
			id="Vertical"
			component={CriativoImovel}
			schema={criativoSchema}
			defaultProps={padrao}
			calculateMetadata={calcular}
			width={1080}
			height={1920}
			fps={FPS}
			durationInFrames={duracaoTotal(padrao)}
		/>
		{/* Feed 4:5 */}
		<Composition
			id="Feed"
			component={CriativoImovel}
			schema={criativoSchema}
			defaultProps={padrao}
			calculateMetadata={calcular}
			width={1080}
			height={1350}
			fps={FPS}
			durationInFrames={duracaoTotal(padrao)}
		/>
	</>
);
