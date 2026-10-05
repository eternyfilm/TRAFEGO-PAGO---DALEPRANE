import type {Criativo} from './schema';

export const FPS = 30;

const NOBRES = ['lago sul', 'lago norte', 'park way', 'jardim botânico'];
const PREMIUM_LOCAL = ['lago sul', 'park way'];

const norm = (s: string) => s.trim().toLowerCase();

// Assinatura premium é da Aline. Critério: pelo menos 2 de
// valor acima de R$ 2,5 mi, casa em bairro nobre, assinatura de arquiteto/designer, localização premium.
// Itens raros (piscina aquecida, automação completa) não dá pra ler do pedido: nesses casos use premium "sim".
export const criteriosPremium = (c: Criativo) => {
	const bairro = norm(c.imovel.bairro);
	return {
		valor: c.imovel.preco >= 2_500_000,
		casaNobre: norm(c.imovel.tipo).includes('casa') && NOBRES.some((b) => bairro.includes(b)),
		assinado: c.assinadoPor.trim() !== '',
		localPremium: PREMIUM_LOCAL.some((b) => bairro.includes(b)),
	};
};

export const primeiroNome = (nome: string) => nome.trim().split(/\s+/)[0] ?? '';

export const ehPremium = (c: Criativo) => {
	if (c.premium === 'sim') return true;
	if (c.premium === 'nao') return false;
	if (norm(primeiroNome(c.corretor)) !== 'aline') return false;
	return Object.values(criteriosPremium(c)).filter(Boolean).length >= 2;
};

export const assinaturaDe = (c: Criativo) => (ehPremium(c) ? c.assinaturaPremium : c.marca.slogan);

export const brl = (n: number) =>
	'R$ ' + n.toLocaleString('pt-BR', {minimumFractionDigits: 0, maximumFractionDigits: 0});

export const ctaDe = (c: Criativo) => c.cta.replace('{corretor}', primeiroNome(c.corretor));

// Linha do tempo em frames. Gancho curto e seco, montagem respirada sem fala,
// depois o corpo (destaque, ficha, objeção) e o fechamento com o corretor.
const s = (seg: number) => Math.round(seg * FPS);
export const DUR = {
	gancho: s(4.6),
	take: s(1.3),
	destaque: s(3.2),
	ficha: s(3.2),
	objecao: s(2.6),
	fechamento: s(3.8),
};

export type Bloco = {
	tipo: 'gancho' | 'take' | 'destaque' | 'ficha' | 'objecao' | 'fechamento';
	inicio: number;
	duracao: number;
	cena: number;
};

// Cena 0 é a imagem forte: abre no gancho e volta no fechamento.
export const linhaDoTempo = (c: Criativo): Bloco[] => {
	const n = c.cenas.length;
	const blocos: Omit<Bloco, 'inicio'>[] = [{tipo: 'gancho', duracao: DUR.gancho, cena: 0}];
	for (let i = 1; i < n; i++) blocos.push({tipo: 'take', duracao: DUR.take, cena: i});
	blocos.push({tipo: 'destaque', duracao: DUR.destaque, cena: 1 % n});
	blocos.push({tipo: 'ficha', duracao: DUR.ficha, cena: 2 % n});
	if (c.objecao.trim()) blocos.push({tipo: 'objecao', duracao: DUR.objecao, cena: 3 % n});
	blocos.push({tipo: 'fechamento', duracao: DUR.fechamento, cena: 0});

	let t = 0;
	return blocos.map((b) => {
		const out = {...b, inicio: t};
		t += b.duracao;
		return out;
	});
};

export const duracaoTotal = (c: Criativo) =>
	linhaDoTempo(c).reduce((acc, b) => acc + b.duracao, 0);
