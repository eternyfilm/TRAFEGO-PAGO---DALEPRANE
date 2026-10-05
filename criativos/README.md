# Criativos (Remotion)

Template de criativo de imóvel em vídeo. Um JSON por imóvel gera o anúncio em dois formatos:
`Vertical` (1080x1920, Reels e Stories) e `Feed` (1080x1350, 4:5). Cerca de 24s com 6 cenas.

## Estrutura do vídeo

1. **Gancho** (4,6s): o setup aparece palavra por palavra, segura meio segundo nas reticências e a revelação entra em itálico. Fica sobre a cena 0.
2. **Montagem** (1,3s por take): cenas 1 em diante, cortes secos, sem fala. Legenda só se a cena tiver `legenda`.
3. **Destaque** (3,2s): o diferencial dito de forma específica, com `assinadoPor` embaixo se houver arquiteto ou marca.
4. **Ficha** (3,2s): bairro, quadra, nome, m², quartos, vagas, preço.
5. **Objeção** (2,6s): só aparece se `objecao` estiver preenchido.
6. **Fechamento** (3,8s): CTA com o primeiro nome do corretor, marca e assinatura.

A ordem das cenas importa: **cena 0 é a imagem mais forte**, abre o gancho e volta no fechamento.
Todo texto fica dentro da zona segura do Reels (fora do nome do perfil, dos ícones e do botão do anúncio).

## Assinatura

- **Premium** (`assinaturaPremium`, em itálico, destaque): só para a Aline, quando o imóvel bate pelo menos 2 critérios: valor acima de R$ 2,5 mi, casa em bairro nobre, `assinadoPor` preenchido, Lago Sul ou Park Way. Itens raros (piscina aquecida, automação) não dá pra ler do JSON: nesses casos use `"premium": "sim"`.
- **Padrão**: `marca.slogan` ("Seu imóvel sem stress"), discreto.
- A linha premium ainda está em definição com a Aline. Mudou, troca no JSON.

## Como usar

```bash
cd criativos
npm install
npm run studio                                   # preview e ajuste ao vivo no navegador
npm run render -- exemplos/exemplo-medio.json    # gera out/exemplo-medio-vertical.mp4 e -feed.mp4
npm run render -- meu-imovel.json feed           # só um formato
```

Fotos e vídeos do imóvel vão em `public/midia/` (fora do git) e entram no JSON como
`"src": "midia/sqsw306/sala.jpg"`. Vídeo usa `"tipo": "video"` e `"inicio"` em segundos.
Cena com `src` vazio vira placeholder, útil pra aprovar texto e ritmo antes das imagens.
Trilha: `"trilha": "midia/trilha.mp3"`, com fade no começo e no fim.

## Montando o JSON a partir do UPS Campanhas

`corretor` e `imovel` têm os mesmos campos do pedido da fila. O que o pedido não tem e precisa ser escrito
(o Claude escreve junto com a copy):

- `gancho.setup` e `gancho.revelacao`: quebra de expectativa que vira aspiração. Não copiar a frase do exemplo, replicar o mecanismo.
- `destaque`: o diferencial situacional ("de manhã você não acende luz"), não o genérico ("ótima iluminação").
- `objecao`: a condição que quebra a objeção do pedido.

Os dois arquivos em `exemplos/` são fictícios, só para testar o template.

## Fontes e render

Instrument Serif (emoção: gancho, destaque, CTA) e Inter Tight (informação), ambas OFL, em `public/fontes/`.
Ficam no projeto para o render não depender de rede.

Em ambiente sem download de navegador, `render.mjs` usa o Chromium do Playwright se encontrar,
ou o caminho em `REMOTION_BROWSER`.

**Licença do Remotion:** gratuito para pessoa física e empresa de até 3 funcionários. Acima disso,
a empresa precisa da licença paga (remotion.pro).
