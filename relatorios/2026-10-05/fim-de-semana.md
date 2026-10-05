# Fim de semana 03 e 04/10/2026 | UPS Digital

Dados do conector Meta Ads. Valores em R$. Só a conta da Aline teve gasto no fim de semana.
Marcos e Mirian: campanhas ativas, R$ 0 gasto em 03 e 04/10. Tatiane, Ana Paula, Costa Films, Kalleby: nada ativo. Daleprane e Bruno: sem dado (fora do conector).

## Aline, por dia

| Campanha | Sáb 03/10 | Leads | Dom 04/10 | Leads | Fim de semana | Leads | CPL |
|---|---|---|---|---|---|---|---|
| VICENTE PIRES T1 | 64,18 | 3 | 82,79 | 2 | 146,97 | 5 | 29,39 |
| SQSW 306 (original) | 68,84 | 1 | 52,67 | 4 | 121,51 | 5 | 24,30 |
| **Total** | 133,02 | 4 | 135,46 | 6 | **268,48** | **10** | **26,85** |

## SQSW 306 desde a reativação (02/10)

| Dia | Investido | Leads | CPL |
|---|---|---|---|
| Sex 02/10 | 69,39 | 1 | 69,39 |
| Sáb 03/10 | 68,84 | 1 | 68,84 |
| Dom 04/10 | 52,67 | 4 | 13,17 |
| **Total** | **190,90** | **6** | **31,82** |

Hoje (05/10) até a hora da consulta: R$ 8,36, sem lead ainda.
Referência antes da pausa: R$ 33,51 por lead (45 leads). A fase nova está abaixo disso.

## Lista de leads

O conector entrega a contagem, não nome e telefone. A lista sai do CSV do formulário filtrado por data:
`python3 scripts/leads_whatsapp.py leads/ARQUIVO.csv --desde 2026-10-02 --campanha "SQSW 306" --titulo "Aline Daleprane | SQSW 306"`
O filtro descarta os 45 leads de agosto e setembro e o lead da cópia. Resultado vai pra `leads/` (fora do git).
