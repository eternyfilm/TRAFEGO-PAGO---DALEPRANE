"""
CLI: cria no Meta Ads uma campanha completa a partir de um briefing já aprovado
(mesmo formato usado no painel Torre Daleprane).

Uso:
    python -m src.create_campaign config/campaign_brief.example.json

A campanha sai sempre como PAUSED. Ativar é um passo manual separado
(Gerenciador de Anúncios, ou meta_ads.activate_campaign(campaign_id)).
"""

import argparse
import json

from . import meta_ads


def main():
    parser = argparse.ArgumentParser(description="Cria uma campanha de leads no Meta Ads a partir de um briefing aprovado.")
    parser.add_argument("briefing", help="Caminho para o JSON do briefing aprovado")
    args = parser.parse_args()

    with open(args.briefing, encoding="utf-8") as f:
        brief = json.load(f)

    result = meta_ads.create_lead_campaign(brief)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    print("\nCampanha criada como PAUSED. Revise no Gerenciador de Anúncios antes de ativar.")


if __name__ == "__main__":
    main()
