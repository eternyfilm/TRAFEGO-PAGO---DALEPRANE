"""
Cliente fino para a Marketing API do Meta (Facebook/Instagram Ads).

Usa a Graph API diretamente via `requests` em vez do SDK oficial para não
prender o projeto a uma versão pesada de dependência. Toda campanha é criada
com status PAUSED -- ativar gasto real é sempre um passo manual e separado
(no Gerenciador de Anúncios ou em activate_campaign(), nunca automático).
"""

import json

import requests

from . import config

BASE_URL = f"https://graph.facebook.com/{config.META_API_VERSION}"


def _post(path, payload):
    token, _, _ = config.require_meta()
    resp = requests.post(f"{BASE_URL}/{path}", data={**payload, "access_token": token})
    resp.raise_for_status()
    return resp.json()


def _get(path, params=None):
    token, _, _ = config.require_meta()
    resp = requests.get(f"{BASE_URL}/{path}", params={**(params or {}), "access_token": token})
    resp.raise_for_status()
    return resp.json()


def _json(obj):
    return json.dumps(obj, ensure_ascii=False)


def search_locations(query):
    """Busca IDs de localização (cidade, bairro, região) para usar em targeting.geo_locations."""
    return _get("search", {"type": "adgeolocation", "q": query, "location_types": _json(["neighborhood", "city", "region"])})


def search_interests(query):
    """Busca IDs de interesse para usar em targeting.flexible_spec."""
    return _get("search", {"type": "adinterest", "q": query})


def create_campaign(name, objective="OUTCOME_LEADS"):
    _, ad_account_id, _ = config.require_meta()
    return _post(f"{ad_account_id}/campaigns", {
        "name": name,
        "objective": objective,
        "status": "PAUSED",
        "special_ad_categories": _json([]),
    })


def create_ad_set(campaign_id, name, daily_budget_reais, targeting, optimization_goal="LEAD_GENERATION"):
    """
    `targeting` já deve trazer os IDs corretos, ex:
    {
      "geo_locations": {"cities": [{"key": "..."}]},
      "age_min": 30, "age_max": 55,
      "flexible_spec": [{"interests": [{"id": "...", "name": "..."}]}]
    }
    Use search_locations()/search_interests() para descobrir os IDs antes de montar isso.
    """
    _, ad_account_id, page_id = config.require_meta()
    return _post(f"{ad_account_id}/adsets", {
        "name": name,
        "campaign_id": campaign_id,
        "daily_budget": int(round(daily_budget_reais * 100)),
        "billing_event": "IMPRESSIONS",
        "optimization_goal": optimization_goal,
        "targeting": _json(targeting),
        "status": "PAUSED",
        "promoted_object": _json({"page_id": page_id}),
    })


def create_lead_form(name, questions, privacy_policy_url):
    _, _, page_id = config.require_meta()
    formatted_questions = [{"type": "CUSTOM", "label": q} for q in questions]
    return _post(f"{page_id}/leadgen_forms", {
        "name": name,
        "questions": _json(formatted_questions),
        "privacy_policy": _json({"url": privacy_policy_url, "link_text": "Política de Privacidade"}),
    })


def create_ad_creative(name, title, body, description, lead_form_id, link):
    _, ad_account_id, page_id = config.require_meta()
    object_story_spec = {
        "page_id": page_id,
        "link_data": {
            "message": body,
            "name": title,
            "description": description,
            "link": link,
            "call_to_action": {"type": "LEARN_MORE", "value": {"lead_gen_form_id": lead_form_id}},
        },
    }
    return _post(f"{ad_account_id}/adcreatives", {
        "name": name,
        "object_story_spec": _json(object_story_spec),
    })


def create_ad(name, ad_set_id, creative_id):
    _, ad_account_id, _ = config.require_meta()
    return _post(f"{ad_account_id}/ads", {
        "name": name,
        "adset_id": ad_set_id,
        "creative": _json({"creative_id": creative_id}),
        "status": "PAUSED",
    })


def get_insights(object_id, date_preset="yesterday"):
    fields = "spend,reach,clicks,cpc,actions,cost_per_action_type"
    return _get(f"{object_id}/insights", {"date_preset": date_preset, "fields": fields})


def activate_campaign(campaign_id):
    """Liga a campanha de verdade (passa a gastar). Chamar só depois de revisão manual."""
    return _post(campaign_id, {"status": "ACTIVE"})


def create_lead_campaign(brief):
    """
    Monta a campanha completa (campanha, conjunto, formulário, criativo e anúncio) a
    partir de um briefing aprovado no painel Torre Daleprane. Formato esperado de `brief`:
    {
      "nome": str, "orcamento_diario": float,
      "targeting": {...já resolvido com IDs...},
      "formulario": [perguntas...], "privacy_policy_url": str,
      "anuncio": {"titulo": str, "texto": str, "descricao": str},
      "link": str (opcional, default site da Daleprane)
    }
    Tudo criado como PAUSED.
    """
    campaign = create_campaign(brief["nome"])
    campaign_id = campaign["id"]

    ad_set = create_ad_set(
        campaign_id=campaign_id,
        name=f'{brief["nome"]} - Conjunto',
        daily_budget_reais=brief["orcamento_diario"],
        targeting=brief["targeting"],
    )
    ad_set_id = ad_set["id"]

    lead_form = create_lead_form(
        name=f'{brief["nome"]} - Formulário',
        questions=brief["formulario"],
        privacy_policy_url=brief["privacy_policy_url"],
    )
    lead_form_id = lead_form["id"]

    creative = create_ad_creative(
        name=f'{brief["nome"]} - Criativo',
        title=brief["anuncio"]["titulo"],
        body=brief["anuncio"]["texto"],
        description=brief["anuncio"]["descricao"],
        lead_form_id=lead_form_id,
        link=brief.get("link", "https://www.daleprane.com.br"),
    )
    creative_id = creative["id"]

    ad = create_ad(
        name=f'{brief["nome"]} - Anúncio',
        ad_set_id=ad_set_id,
        creative_id=creative_id,
    )

    return {
        "campaign_id": campaign_id,
        "ad_set_id": ad_set_id,
        "lead_form_id": lead_form_id,
        "creative_id": creative_id,
        "ad_id": ad["id"],
        "status": "PAUSED - revise no Gerenciador de Anúncios antes de ativar",
    }
