import {z} from 'zod';

// Os campos de corretor e imovel têm os mesmos nomes do pedido do UPS Campanhas,
// para dar pra montar o criativo direto do documento da fila.
export const cenaSchema = z.object({
	// Caminho dentro de public/ (ex: "midia/sqsw306/sala.jpg") ou URL. Vazio = placeholder.
	src: z.string().default(''),
	tipo: z.enum(['foto', 'video']).default('foto'),
	// Segundo do vídeo de onde o take começa.
	inicio: z.number().min(0).default(0),
	// Frase curta e situacional que aparece no take. Opcional: montagem respira melhor sem texto.
	legenda: z.string().default(''),
});

export const criativoSchema = z.object({
	corretor: z.string(),
	marca: z.object({
		nome: z.string(),
		slogan: z.string(),
	}),
	imovel: z.object({
		nome: z.string(),
		tipo: z.string().default('Apartamento'),
		bairro: z.string(),
		quadra: z.string().default(''),
		area: z.string().default(''),
		quartos: z.string().default(''),
		vagas: z.string().default(''),
		preco: z.number().min(0),
	}),
	// Reticências no fim do setup e exclamação na revelação são direção de ritmo:
	// o setup cria a tensão, a pausa segura, a revelação vira aspiração.
	gancho: z.object({
		setup: z.string(),
		revelacao: z.string(),
	}),
	// O diferencial dito de forma específica. Ex: "De dia você não acende luz. A casa faz isso sozinha."
	destaque: z.string(),
	// Validação por marca ou arquiteto. Ex: "Projeto de interiores assinado por ...". Vazio = não aparece.
	assinadoPor: z.string().default(''),
	// Quebra da principal objeção antes do CTA. Ex: "Habite-se emitido. Aceita permuta."
	objecao: z.string().default(''),
	// {corretor} vira o primeiro nome do corretor.
	cta: z.string().default('Preencha o formulário e fale com {corretor}'),
	// auto = decide pelos critérios de alto padrão (regras.ts).
	premium: z.enum(['auto', 'sim', 'nao']).default('auto'),
	// Assinatura premium (em definição com a Aline).
	assinaturaPremium: z.string().default('Comprar com inteligência, viver com sofisticação.'),
	cenas: z.array(cenaSchema).min(1),
	// Caminho em public/ ou URL. Vazio = sem trilha.
	trilha: z.string().default(''),
});

export type Criativo = z.infer<typeof criativoSchema>;
export type Cena = z.infer<typeof cenaSchema>;
