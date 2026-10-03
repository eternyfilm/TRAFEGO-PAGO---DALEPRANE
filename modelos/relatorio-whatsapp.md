# Modelo: relatório de campanha para WhatsApp

Usado nas campanhas de formulário. Formatação nativa do WhatsApp: `*negrito*` e `_itálico_`.
Exemplo preenchido (com dados reais) fica em `leads/`, pasta fora do git.

## Regras de montagem

1. **Resultado primeiro.** Leads, custo por lead e investimento, nessa ordem. Investimento sai da conta de anúncios, nunca calculado de cabeça.
2. **Perfil dos leads em 3 linhas.** Objetivo (morar, investir, pesquisando), se já tem imóvel e DDD fora do DF. É o que o corretor precisa para planejar a abordagem.
3. **Leads ordenados por prioridade, não por ordem de chegada.**
   - 🔥 Prioridade 1: quer morar ou investir E já tem imóvel (troca ou segundo imóvel). Maior capacidade de compra.
   - 🟡 Prioridade 2: quer morar e não tem imóvel. Confirmar entrada e financiamento cedo.
   - ⚪ Prioridade 3: ainda pesquisando.
   É uma heurística de capacidade de compra, não garantia. Ajustar quando o retorno dos corretores mostrar outro padrão.
4. **Cada lead em 4 linhas:** nome, telefone no formato (61) 99999-9999, e-mail, e uma linha com objetivo · imóvel · melhor horário.
5. **Limpeza:** padronizar telefone, trocar "No zap" por "Prefere WhatsApp", marcar com ⚠️ e-mail com caractere inválido em vez de corrigir no chute.
6. **Fechamento pede retorno de qualidade** (quem atendeu, quem tem perfil, quem agendou visita).
7. Sem travessão.

## Modelo

```
📊 *RELATÓRIO DE CAMPANHA*
*{Corretor} | {Imóvel}*
_Formulário · {DD/MM} a {DD/MM/AAAA}_

*RESULTADO*
📩 Leads: *{N}*
💰 Custo por lead: *R$ {CPL}*
💳 Investimento: R$ {investido}

*PERFIL DOS LEADS*
🏡 {a} querem morar · {b} querem investir · {c} ainda pesquisando
🔑 {d} já têm imóvel ({e} querem trocar, {f} buscam o segundo)
📍 {g} com DDD de fora do DF

*ORDEM DE ATENDIMENTO SUGERIDA*
🔥 *Prioridade 1 ({n1}):* já têm imóvel e querem comprar. Maior capacidade de compra. Na troca, já perguntar se o imóvel atual entra no negócio.
🟡 *Prioridade 2 ({n2}):* querem morar e ainda não têm imóvel. Confirmar entrada e financiamento logo no primeiro contato.
⚪ *Prioridade 3 ({n3}):* ainda pesquisando. Contato leve e acompanhamento.

━━━━━━━━━━━━━━
🔥 *PRIORIDADE 1*

*1. {Nome}*
📞 (61) 99999-9999
📧 email@exemplo.com
Quer morar · Tem imóvel, quer trocar · ⏰ Manhã

(... demais leads ...)

━━━━━━━━━━━━━━
💬 Depois dos primeiros contatos, nos conta: quem atendeu, quem tem perfil e quem agendou visita. É esse retorno que deixa a campanha cada vez mais certeira.

_UPS Digital · atualizado em {DD/MM/AAAA}_
```

## Versão diária curta (só leads novos de ontem)

```
📊 *{Corretor} | {Imóvel}*
_Ontem, {DD/MM}_

📩 {N} lead(s) novo(s) · 💰 R$ {CPL} por lead
Acumulado da campanha: {N_total} leads · R$ {CPL_total} por lead

🔥 *1. {Nome}* · (61) 99999-9999
Quer morar · Tem imóvel, quer trocar · ⏰ Manhã
```
