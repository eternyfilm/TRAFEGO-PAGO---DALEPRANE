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

Tudo em `localStorage` na v1. A camada de dados (`src/lib/storage.ts`) é isolada
por trás de uma interface `StorageAdapter`, então dá pra plugar Supabase depois
sem reescrever telas. Detalhes de arquitetura e roadmap técnico no `CLAUDE.md`.
