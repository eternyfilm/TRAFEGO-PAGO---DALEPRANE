# Site Conquistare Cred

Site da Conquistare Cred (Soluções Financeiras), correspondente multibancos em Brasília, com a
estrutura da Creditas como referência: simulador no hero com abas por produto, página própria pra cada
produto, simulação em etapas que vira lead, página pra imobiliárias e corretores, blog, central de
ajuda com busca, área do cliente e páginas legais.

Identidade e conteúdo vêm do material oficial no Drive da agência (`Conquistare.ai`, portfólio
`Conquistare Cred.pdf`): roxo `#61027E`, verde `#338D53`, o "$" vazado como grafismo, produtos
(financiamento imobiliário, consórcio, consignado, correspondente com 7 bancos), aprovação em até
1 hora, missão, visão, valores, endereço e avaliações do Google.

## Rodar

```bash
cd conquistare-site
npm install
npm run dev      # http://localhost:5174
npm run build    # typecheck + build em dist/
```

## Onde mexer

| Quero mudar... | Arquivo |
| --- | --- |
| Nome, WhatsApp, e-mail, CNPJ, texto legal, logo | `src/config/marca.ts` |
| Cores e fonte | `src/styles/global.css` (bloco `:root` no topo) |
| Produtos, taxas, limites, prazos, FAQs de produto | `src/config/produtos.ts` |
| Números, depoimentos, FAQ geral, comparativo de taxas, blog | `src/config/conteudo.ts` |

Cada produto em `produtos.ts` gera sozinho: card na home, item no menu, aba no simulador, página
própria, opção no fluxo de simulação e bloco na central de ajuda. `ativo: false` esconde o produto do
site inteiro.

## Pra onde vai o lead

1. **Sempre:** a página de obrigado mostra um botão de WhatsApp com a simulação já escrita
   (produto, valor, prazo, nome).
2. **Com `VITE_LEAD_WEBHOOK`:** o lead completo vai por POST em JSON (nome, CPF, celular, e-mail,
   cidade, produto, valor, prazo, parcela estimada, campos extras e **UTMs do anúncio**). Serve pra
   Make, Zapier, n8n, Google Apps Script (planilha) ou uma Edge Function do Supabase.
3. **Com `VITE_META_PIXEL_ID` / `VITE_GA_ID`:** dispara `PageView` e `Lead` (Meta) e
   `generate_lead` (GA4). Só carrega depois que o visitante aceita os cookies (LGPD).

Os UTMs (`utm_*`, `fbclid`, `gclid`) da primeira página ficam guardados na sessão, então o lead sabe
de qual campanha veio mesmo se a pessoa navegou pelo site antes de simular.

Copie `.env.example` para `.env.local` e cadastre as mesmas variáveis no host.

## Deploy

Vercel ou Netlify, com a raiz do projeto apontando pra `conquistare-site`. As URLs são limpas
(`/emprestimo/garantia-de-imovel`), e os arquivos `vercel.json` e `public/_redirects` já fazem o host
servir o `index.html` em qualquer rota.

## Antes de publicar (checklist com a Conquistare)

A faixa amarela de "versão de rascunho" fica no ar enquanto `marca.rascunho` for `true`. Desligar só
depois de passar por esta lista:

- [ ] Logo oficial (SVG ou PNG transparente) em `public/` e `marca.logoUrl` preenchido. Hoje o topo
      mostra o nome em texto nas cores da marca, sem símbolo inventado
- [ ] Confirmar a fonte da marca (o site usa Poppins como aproximação)
- [ ] Número de WhatsApp (hoje aponta pro fixo (61) 3547-0030), e-mail e horário de atendimento
- [ ] Razão social e CNPJ
- [ ] Taxas reais por banco (financiamento, lote, consignado) e taxa de administração dos consórcios
- [ ] Confirmar se opera financiamento de veículo (`ativo` em `produtos.ts`)
- [ ] Autorização pra exibir as avaliações do Google (hoje com primeiro nome + inicial)
- [ ] Números de volume (crédito intermediado, clientes) se quiserem exibir
- [ ] Revisão jurídica da política de privacidade e dos termos
- [ ] Fotos próprias (ver abaixo)

## Imagens

Hoje o site não usa foto: o hero é o próprio simulador e as capas do blog são gradientes da marca.
Isso é proposital pra não colocar banco de imagem genérico. O salto visual real vem de fotos próprias
(clientes reais, a equipe, o escritório, momentos de conquista), que é exatamente onde a produção da
Eterny entra. Os pontos óbvios pra encaixar: ao lado do hero das páginas de produto, a página "Quem
somos" e as capas do blog.
