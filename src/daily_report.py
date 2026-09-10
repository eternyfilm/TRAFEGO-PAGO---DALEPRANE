"""
Roda todo dia útil (via GitHub Actions, veja .github/workflows/relatorio-diario.yml):
pega as métricas de ontem de cada campanha ativa e manda um WhatsApp pro corretor
responsável, usando o template aprovado `relatorio_diario_trafego`.

Fonte das campanhas ativas: config/campaigns.json (não versionado, tem telefone real
de corretor -- copie de config/campaigns.example.json e preencha).
"""

import json
import os

from . import meta_ads, whatsapp

CAMPAIGNS_FILE = os.environ.get("CAMPAIGNS_FILE", "config/campaigns.json")


def load_active_campaigns():
    with open(CAMPAIGNS_FILE, encoding="utf-8") as f:
        return json.load(f)


def _lead_count(actions):
    return next((a["value"] for a in actions or [] if a.get("action_type") == "lead"), "0")


def build_report_params(campanha_nome, insights):
    data = insights.get("data", [{}])[0] if insights.get("data") else {}
    spend = data.get("spend", "0")
    reach = data.get("reach", "0")
    clicks = data.get("clicks", "0")
    leads = _lead_count(data.get("actions"))
    return [campanha_nome, spend, reach, clicks, leads]


def run():
    campaigns = load_active_campaigns()
    if not campaigns:
        print("Nenhuma campanha ativa em config/campaigns.json. Nada a reportar hoje.")
        return

    for item in campaigns:
        insights = meta_ads.get_insights(item["campaign_id"])
        params = build_report_params(item["campanha_nome"], insights)
        whatsapp.send_template_message(
            to_phone_e164=item["corretor_whatsapp"],
            template_name="relatorio_diario_trafego",
            language_code="pt_BR",
            parameters=params,
        )
        print(f'Relatório enviado para {item["corretor_nome"]} ({item["campanha_nome"]})')


if __name__ == "__main__":
    run()
