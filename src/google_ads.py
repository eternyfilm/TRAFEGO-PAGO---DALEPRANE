"""
Integração com Google Ads -- fase 2, ainda não implementada.

Pré-requisitos antes de mexer aqui:
1. Developer token aprovado no Google Ads (Ferramentas e config. > Central de API).
   Acesso "Standard" pode levar de 1 a alguns dias úteis pra aprovar.
2. Conta gerenciadora (MCC) vinculada à conta de anúncios da Daleprane.
3. Credenciais OAuth (client_id, client_secret, refresh_token), geradas seguindo o
   guia de autenticação da biblioteca oficial `google-ads` (google-ads-python).
4. customer_id da conta de anúncios (sem hífen).

Com isso em mãos: instalar `google-ads`, configurar via variáveis de ambiente
(GOOGLE_ADS_* em .env.example) e implementar aqui create_campaign, create_ad_group,
create_responsive_search_ad e get_campaign_metrics, no mesmo padrão de
src/meta_ads.py (sempre criando pausado, ativação manual separada).
"""
