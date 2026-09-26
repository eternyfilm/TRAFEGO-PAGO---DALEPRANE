# CLAUDE.md, Painel de Execução da Nova UPS

Este arquivo é a memória do projeto. Em toda sessão futura, leia ele por inteiro
antes de mexer em qualquer coisa. Ele carrega a estratégia que justifica cada
decisão do produto.

---

## Contexto estratégico

### A tese
Agência que vende post, vídeo e tráfego virou commodity. A Nova UPS se posiciona
como **"UPS Digital, sistemas de crescimento para o mercado imobiliário"**:
Marketing → Aquisição → Comercial → Processos → Dados, com IA e automação
atravessando tudo. IA é a tecnologia por trás, nunca o produto. Não nos
posicionamos como "agência de IA".

### O problema escolhido
**Lead → Visita.** Já dominamos aquisição (leads baratos). O vazamento está no
atendimento: lead que não é respondido rápido, não é qualificado, não é
acompanhado. Frase de venda: "Você não tem problema de lead. Tem problema de
atendimento."

Funil que medimos:
Anúncio → Lead → Atendimento → Qualificação → Visita → Proposta → Venda

Métrica principal: **% de leads que viram visita.**

### A Daleprane é o laboratório
Daleprane Inteligência Imobiliária (cerca de 48 corretores, Brasília) é nosso
cliente principal e o ambiente de teste. Todo problema resolvido lá passa pela
pergunta: "isso acontece em outras imobiliárias?" Se sim, vira produto.

Ciclo: Problema → Diagnóstico → Solução → Teste → Dados → Melhoria → Processo →
Case → Produto.

### Escada de oferta
1. **Diagnóstico de Funil ("Raio-X")**, vendável em outubro. 7 a 10 dias. Inclui
   cliente oculto (leads fictícios nos anúncios da imobiliária, cronometrando o
   atendimento), análise de tempo de resposta, % atendidos, % qualificados, %
   visitas. Entrega: relatório visual + plano de correção. Hipótese de preço a
   validar: R$ 1.500 a R$ 3.000, abatido se fechar o degrau 2.
2. **Sistema Lead → Visita**, novembro/dezembro. Tráfego + primeiro contato
   automático no WhatsApp em até 1 minuto + qualificação + repasse ao corretor
   com resumo + follow-up automático + painel semanal do funil. Setup +
   mensalidade.
3. **Sistema de crescimento completo**, 2027, com case e dados.

### Ferramentas internas (não são produto de venda agora)
- **Operador de tráfego com IA:** recebe cliente, corretor, link do imóvel,
  verba, duração e objetivo; gera copy, título, formulário, público, estrutura,
  naming e orçamento; cria a campanha via Marketing API da Meta sempre
  pausada/rascunho; pede aprovação humana. Relatório diário às 8h com
  recomendação (manter, aumentar, trocar criativo, revisar público) e aplicação
  só com aprovação. Prioridade: novembro. (O scaffold Python dele vive na raiz
  deste repositório, fora da pasta `ups-painel`.)
- **Inteligência proprietária** (benchmarks de CPL por bairro e faixa, padrões
  de qualificação): só faz sentido com volume de vários clientes. Horizonte 2027.

### Regras que guiam as decisões
- Não construir 15 sistemas. Um problema brutalmente específico por vez.
- Fazer na mão antes de automatizar.
- Nada de site, logo nova ou apresentação bonita antes de ter prova.
- Não prometer ao mercado o que ainda não foi testado.

### Riscos conhecidos
- **Conflito com a Aline:** vender o método para imobiliárias concorrentes em
  Brasília usando a Daleprane como laboratório. Conversar com ela antes de
  vender. Alternativas: vender fora de Brasília, para segmentos que não competem,
  ou trazê-la como parceira.
- **Capacidade:** dois fundadores já no limite, com a Daleprane dependendo muito
  de nós. Toda oferta nova precisa ser leve de entregar.
- **Dados de visita:** se os corretores não registram visita em lugar nenhum, a
  primeira tarefa vira fazer esse registro acontecer.

### Prazo final
**31/01/2027:** case publicável com números, primeiros clientes externos e
receita mostrando que o modelo funciona.

---

## Quem toca o projeto
- **Kalleby:** negócio, comercial, growth, tráfego, produto, relacionamento com
  cliente.
- **Caio:** marketing, criação, audiovisual, design, tecnologia aplicada,
  experimentação com IA.

---

## Como rodar

```bash
cd ups-painel
npm install
npm run dev      # sobe em http://localhost:5173
npm run build    # typecheck + build de produção em dist/
npm run preview  # serve o build de produção
```

Sem variáveis de ambiente, os dados vivem em `localStorage` (modo local). Na Home
tem **Exportar JSON** e **Importar JSON** pra backup. Um selo na Home mostra se
está em modo **Local** ou **Sincronizado**.

### Modo sincronizado (Supabase + realtime)

Faz Kalleby e Caio verem cada check ao vivo. Passos:

1. **Supabase:** crie um projeto em [supabase.com](https://supabase.com). Em SQL
   Editor, rode `supabase/schema.sql` (cria a tabela `painel_estado`, liga o
   realtime e as policies).
2. **Chaves:** em Project Settings > API, copie a `URL` e a chave `anon` (pública).
3. **Env:** copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY` e `VITE_APP_SENHA` (senha de acesso ao painel).
4. **Deploy:** suba o repo na Vercel (ou Netlify). Aponte a raiz do projeto pra
   `ups-painel`, e cadastre as mesmas três variáveis no painel de Environment
   Variables do host. Cada push no branch redeploya.

Segurança: a senha (`VITE_APP_SENHA`) é uma trava de interface, não criptografia.
As policies do Supabase liberam a chave anon, então quem tiver URL + chave anon
acessa os dados via API direto. Para dois fundadores e dados de operação, ok. Pra
proteção real, migrar para Supabase Auth (login por email) e policies por usuário.

Fonte de marca Coolvetica versionada em `src/styles/fonts/` (empacotada pelo
Vite). Regular liga na marca "UPS DIGITAL" via `@font-face` em `theme.css`. Ficam
lá também itálico, heavy compressed (family `Coolvetica Heavy`), condensed e
crammed para uso futuro.

## Arquitetura (resumo)

- **Vite + React + TypeScript.** SPA com roteamento por hash (`src/state/router.ts`).
- **Camada de dados isolada** em `src/lib/storage.ts`: interface `StorageAdapter`
  com `LocalStorageAdapter` (local) e `SupabaseAdapter` (sincronizado com
  realtime). O adapter é escolhido por env. Nenhuma tela fala com storage direto,
  elas passam pelo `store` (`src/state/store.tsx`, Context + reducer, com
  assinatura realtime, guarda contra loop e debounce nos saves).
- **Trava de acesso** em `src/ui/PortaSenha.tsx` (senha simples via env).
- **Dados iniciais** em `src/data/seed.ts` (todas as tarefas do plano, escada de
  oferta e riscos). Datas no fuso America/Sao_Paulo, formato BR (`src/lib/dates.ts`).
- **Telas** em `src/telas/`: Home, Roadmap, Funil, Comercial, Estrategia.
- **Seletores derivados** (progresso, fase atual, conversões do funil, vazamento)
  em `src/state/selectors.ts`.

## Próximas melhorias

- **Sync entre Kalleby e Caio (Supabase):** feito. Próximo nível é login por
  email (Supabase Auth) e granularidade por registro em vez de blob único.
- **Diagnóstico como export:** a tela Funil já tem os dados pra virar o relatório
  visual do degrau 1. Falta um layout de exportação (PDF ou página imprimível).
- **Ligar o funil ao Comercial:** puxar o resultado lead → visita do teste pra
  dentro do pitch do Diagnóstico automaticamente.
- **Prazos e alertas:** destacar tarefas vencidas e da semana atual na Home.
- **Drag and drop no kanban** do Comercial (hoje avança por botão).
