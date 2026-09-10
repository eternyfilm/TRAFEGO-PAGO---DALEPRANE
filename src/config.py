import os

from dotenv import load_dotenv

load_dotenv()

META_ACCESS_TOKEN = os.environ.get("META_ACCESS_TOKEN")
META_AD_ACCOUNT_ID = os.environ.get("META_AD_ACCOUNT_ID")  # formato: act_1234567890
META_PAGE_ID = os.environ.get("META_PAGE_ID")
META_API_VERSION = os.environ.get("META_API_VERSION", "v21.0")

WHATSAPP_TOKEN = os.environ.get("WHATSAPP_TOKEN")
WHATSAPP_PHONE_ID = os.environ.get("WHATSAPP_PHONE_ID")


def _require(name, value):
    if not value:
        raise RuntimeError(
            f"Variável de ambiente {name} não configurada. Veja .env.example e o README."
        )
    return value


def require_meta():
    return (
        _require("META_ACCESS_TOKEN", META_ACCESS_TOKEN),
        _require("META_AD_ACCOUNT_ID", META_AD_ACCOUNT_ID),
        _require("META_PAGE_ID", META_PAGE_ID),
    )


def require_whatsapp():
    return (
        _require("WHATSAPP_TOKEN", WHATSAPP_TOKEN),
        _require("WHATSAPP_PHONE_ID", WHATSAPP_PHONE_ID),
    )
