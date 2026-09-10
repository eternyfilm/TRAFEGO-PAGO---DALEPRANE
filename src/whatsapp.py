"""
Envio de mensagens via WhatsApp Cloud API (mesmo App do Meta for Developers
usado para o Marketing API).

Importante: fora de uma janela de atendimento de 24h (o corretor te
mandando mensagem primeiro), o WhatsApp só permite mensagem iniciada pela
empresa através de um TEMPLATE pré-aprovado no WhatsApp Manager. Por isso
o relatório diário usa send_template_message, não texto livre. Veja o
README para o passo a passo de criar e aprovar o template.
"""

import requests

from . import config


def _url():
    _, phone_id = config.require_whatsapp()
    return f"https://graph.facebook.com/{config.META_API_VERSION}/{phone_id}/messages"


def send_template_message(to_phone_e164, template_name, language_code, parameters):
    token, _ = config.require_whatsapp()
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone_e164,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {"code": language_code},
            "components": [{
                "type": "body",
                "parameters": [{"type": "text", "text": str(p)} for p in parameters],
            }],
        },
    }
    resp = requests.post(_url(), json=payload, headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    return resp.json()


def send_text_message(to_phone_e164, body):
    """Só funciona dentro da janela de 24h de atendimento. Útil pra teste manual."""
    token, _ = config.require_whatsapp()
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone_e164,
        "type": "text",
        "text": {"body": body},
    }
    resp = requests.post(_url(), json=payload, headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    return resp.json()
