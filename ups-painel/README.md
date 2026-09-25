# Painel de Execução da Nova UPS

Painel visual pra acompanhar a execução da estratégia da UPS Digital, marcar cada
processo concluído e ver os números do teste na Daleprane. Estética escura,
editorial, premium.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
```

`npm run build` faz typecheck e gera o build de produção em `dist/`.

## Telas

- **Visão geral:** contagem regressiva até 31/01/2027, progresso geral e por fase,
  fase atual pela data de hoje, próximas 3 tarefas de cada fundador, bloco Travado,
  frase-guia em destaque. Exportar/importar JSON.
- **Roadmap:** linha do tempo das fases (Fase 0 até janeiro), CRUD de tarefas,
  detalhe editável (status, dono, prazo, notas), filtro por dono.
- **Funil (laboratório Daleprane):** registro por período e grupo (linha de base,
  teste, controle), conversões automáticas, funil teste vs controle lado a lado,
  métrica principal lead → visita e destaque do maior vazamento.
- **Comercial:** kanban do pipeline do Diagnóstico, contadores (prospects ativos,
  reuniões, diagnósticos pagos, receita do mês).
- **Estratégia:** escada de oferta, riscos com status, log de decisões.

## Dados

Dois modos, escolhidos por variável de ambiente:

- **Local** (sem env): `localStorage`, salva só neste navegador.
- **Sincronizado** (com env do Supabase): banco único na nuvem com realtime,
  Kalleby e Caio veem cada mudança ao vivo, protegido por uma senha simples.

A camada de dados (`src/lib/storage.ts`) é isolada por trás de `StorageAdapter`,
então as telas não mudam entre um modo e outro. Setup do modo sincronizado
(Supabase + deploy + `supabase/schema.sql`) e nota de segurança no `CLAUDE.md`.
