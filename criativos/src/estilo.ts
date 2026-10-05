import {interpolate, Easing} from 'remotion';
import type {CSSProperties} from 'react';

export const COR = {
	texto: '#F6F1EA',
	suave: 'rgba(246, 241, 234, 0.72)',
	linha: 'rgba(246, 241, 234, 0.32)',
	champagne: '#D8C3A0',
	sombra: '#0B0A09',
};

export type Margens = {topo: number; base: number; esq: number; dir: number};

// Zonas seguras: no Reels/Stories o topo tem o nome do perfil e a base tem legenda e botão do anúncio;
// a direita tem os ícones de curtir e comentar.
export const margensDe = (w: number, h: number): Margens =>
	h / w > 1.6 ? {topo: 260, base: 460, esq: 84, dir: 170} : {topo: 96, base: 120, esq: 84, dir: 84};

const suave = Easing.bezier(0.22, 1, 0.36, 1);

// Entrada padrão de texto: sobe pouco, ganha foco, sem quicar.
export const entrada = (frame: number, inicio: number, dur = 16, distancia = 28): CSSProperties => {
	const p = interpolate(frame, [inicio, inicio + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: suave,
	});
	return {
		opacity: p,
		transform: `translateY(${(1 - p) * distancia}px)`,
		filter: `blur(${(1 - p) * 8}px)`,
	};
};

export const saida = (frame: number, fim: number, dur = 8): number =>
	interpolate(frame, [fim - dur, fim], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
