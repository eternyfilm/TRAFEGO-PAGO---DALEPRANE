# Tráfego Pago Daleprane

Automação de gestão de tráfego (Meta Ads + Google Ads) para a Daleprane Inteligência
Imobiliária: aprovação de campanhas, criação via API e relatório diário automático
pro corretor.

## Como as peças se encaixam

1. **Painel Torre Daleprane** (link à parte, artifact publicado): você revisa cada
   campanha (público, orçamento, copy, formulário) e aprova, pede ajuste ou reprova.
   Hoje ele roda com dados de exemplo; quando a API estiver ligada, as campanhas
   reais entram lá automaticamente.
2. **`src/create_campaign.py`**: pega um briefing aprovado e cria a campanha completa
   no Meta Ads (campanha, conjunto, formulário de lead, criativo e anúncio). Sempre
   como `PAUSED` — ativar gasto real é sempre manual, nunca automático.
3. **`src/daily_report.py`** + `.github/workflows/relatorio-diario.yml`: todo dia
   útil às 8h (Brasília), busca as métricas de ontem de cada campanha ativa e manda
   um WhatsApp pro corretor responsável. Roda no GitHub Actions, então funciona
   mesmo sem uma sessão do Claude aberta.

## Configuração necessária (Meta Ads + WhatsApp)

Marketing API e WhatsApp Cloud API vivem no mesmo App do Meta for Developers, então
dá pra configurar os dois de uma vez.

1. **Confirme o Business Manager.** Entre em [business.facebook.com](https://business.facebook.com)
   e confirme que você é admin do Business Manager que contém a conta de anúncios
   da Daleprane e a página do Facebook/Instagram usada nos anúncios.
2. **Crie um App.** Em [developers.facebook.com/apps](https://developers.facebook.com/apps),
   crie um App tipo "Negócios", vinculado a esse Business Manager.
3. **Adicione os produtos.** Dentro do App, adicione os produtos **Marketing API** e
   **WhatsApp**.
4. **Gere um token de sistema.** Em *Configurações do Business* → *Usuários* →
   *Usuários do sistema*: crie um usuário do sistema com papel Admin, atribua a ele
   a conta de anúncios e a página, e gere um token de acesso (permissões
   `ads_management`, `ads_read`, `business_management`, `whatsapp_business_messaging`,
   `whatsapp_business_management`). Prefira o token de sistema (não expira por uso,
   só é revogado manualmente) em vez do token de usuário normal (expira em 60 dias).
5. **Pegue o ID da conta de anúncios** (formato `act_XXXXXXXXXX`) em
   *Configurações do Gerenciador de Anúncios*.
6. **Pegue o Page ID** da página do Facebook/Instagram usada nos anúncios.
7. **Pegue o Phone Number ID do WhatsApp** dentro do produto WhatsApp do App, em
   "Começar a usar" (você pode usar um número de teste do Meta primeiro, e trocar
   pelo número real da Daleprane/UPS depois de verificado).
8. **Crie o template de mensagem do relatório.** Em *WhatsApp Manager* → *Templates
   de mensagem*, crie um template chamado `relatorio_diario_trafego`, categoria
   "Utilidade", com 5 variáveis no corpo, por exemplo:
   ```
   Bom dia! Resumo de ontem da campanha {{1}}.
   Investimento: R$ {{2}} | Alcance: {{3}} pessoas | Cliques: {{4}} | Leads: {{5}}.
   Qualquer dúvida, chama a gente.
   ```
   A aprovação do Meta costuma sair em minutos a poucas horas. Sem template
   aprovado, mensagem iniciada pela empresa (fora da janela de 24h) não sai.

**Nunca cole essas credenciais direto no chat de forma que fiquem salvas em texto
puro.** Guarde localmente em `.env` (já está no `.gitignore`) e, para o robô do
relatório diário funcionar, cadastre as mesmas variáveis em
*Settings → Secrets and variables → Actions* do repositório no GitHub:
`META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_PAGE_ID`, `WHATSAPP_TOKEN`,
`WHATSAPP_PHONE_ID`.

## Uso local

```bash
pip install -r requirements.txt
cp .env.example .env   # preencha com suas credenciais

# criar uma campanha a partir de um briefing aprovado
python -m src.create_campaign config/campaign_brief.example.json

# rodar o relatório diário manualmente (fora do horário automático)
cp config/campaigns.example.json config/campaigns.json   # preencha com dados reais
python -m src.daily_report
```

## Google Ads (fase 2)

Ainda não implementado (`src/google_ads.py` tem só o plano). Precisa de developer
token aprovado pelo Google (pode levar dias), conta MCC vinculada e credenciais
OAuth via a biblioteca oficial `google-ads`. Faz sentido priorizar Meta Ads primeiro
e ligar o Google Ads depois que o fluxo do Meta estiver validado na prática.

## Segurança

- Nenhuma campanha é ativada automaticamente: `create_campaign.py` sempre cria como
  `PAUSED`. Ativar é uma chamada separada e deliberada
  (`meta_ads.activate_campaign`), ou feito manualmente no Gerenciador de Anúncios.
- `config/campaigns.json` (com telefone real de corretor) não é versionado.
- Tokens e segredos ficam em `.env` local ou em GitHub Actions Secrets, nunca no
  código ou em commits.
