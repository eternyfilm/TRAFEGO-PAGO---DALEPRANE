"""Filtra o CSV de leads exportado do Meta e monta a lista no formato de WhatsApp.

Uso:
    python3 scripts/leads_whatsapp.py leads/ARQUIVO.csv --desde 2026-10-02 \
        [--ate 2026-10-04] [--campanha "SQSW 306"] [--titulo "Aline Daleprane | SQSW 306"]

Lê o CSV como o Meta exporta (UTF-16 com tab ou UTF-8 com vírgula), mantém só os
leads criados a partir de --desde (e até --ate, se passado), opcionalmente só de
uma campanha/formulário, ordena por prioridade e imprime o texto. O texto também é
salvo em leads/ (fora do git, dado pessoal). Nada aqui vai pro repositório.
"""
import argparse
import csv
import io
import re
import sys
import unicodedata
from datetime import date, datetime
from pathlib import Path


def ler_csv(caminho):
    bruto = Path(caminho).read_bytes()
    for enc in ("utf-16", "utf-8-sig", "latin-1"):
        try:
            texto = bruto.decode(enc)
            if "\x00" in texto:
                continue
            break
        except UnicodeDecodeError:
            continue
    amostra = texto[:2000]
    delim = "\t" if amostra.count("\t") > amostra.count(",") else ","
    return list(csv.DictReader(io.StringIO(texto), delimiter=delim))


def norm(s):
    s = unicodedata.normalize("NFD", str(s or "")).encode("ascii", "ignore").decode()
    return s.lower().strip()


def coluna(cols, *chaves):
    for c in cols:
        n = norm(c)
        if any(k in n for k in chaves):
            return c
    return None


def bonito(valor):
    v = str(valor or "").strip()
    if "_" in v and " " not in v:
        v = v.replace("_", " ").replace(",", ", ").replace("  ", " ").strip().capitalize()
    return v


def telefone(t):
    d = re.sub(r"\D", "", str(t or ""))
    if d.startswith("55") and len(d) in (12, 13):
        d = d[2:]
    if len(d) == 11:
        return f"({d[:2]}) {d[2:7]}-{d[7:]}"
    if len(d) == 10:
        return f"({d[:2]}) {d[2:6]}-{d[6:]}"
    return str(t or "").strip()


def email_ok(e):
    e = str(e or "").strip()
    return e if re.fullmatch(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", e) else ""


def horario(v):
    v = bonito(v)
    if len(re.sub(r"\D", "", v)) >= 8 or len(v.strip(" .-")) == 0:
        return ""
    return v[:1].upper() + v[1:]


def prioridade(objetivo, imovel):
    o, i = norm(objetivo), norm(imovel)
    tem = "trocar" in i or "segundo" in i or i.startswith("sim")
    if "pesquis" in o:
        return 3
    if tem:
        return 1
    return 2


def data_lead(valor):
    v = str(valor or "").strip()
    try:
        return datetime.fromisoformat(v.replace("Z", "+00:00")).date()
    except ValueError:
        try:
            return datetime.strptime(v[:10], "%Y-%m-%d").date()
        except ValueError:
            return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--desde", required=True)
    ap.add_argument("--ate")
    ap.add_argument("--campanha")
    ap.add_argument("--titulo", default="Relatório de leads")
    ap.add_argument("--investimento", type=float, help="investido no período, vindo da conta de anúncios")
    a = ap.parse_args()

    linhas = ler_csv(a.csv)
    if not linhas:
        sys.exit("CSV vazio.")
    cols = list(linhas[0].keys())
    c_data = coluna(cols, "created_time", "criado", "data")
    c_nome = coluna(cols, "full_name", "nome completo", "nome")
    c_tel = coluna(cols, "phone", "telefone", "whatsapp")
    c_mail = coluna(cols, "email", "e-mail")
    c_obj = coluna(cols, "objetivo")
    c_imv = coluna(cols, "possui", "imovel")
    c_hor = coluna(cols, "horario", "melhor")
    c_vis = coluna(cols, "quando", "conhecer", "visita")
    c_camp = [c for c in cols if norm(c) in ("campaign_name", "form_name", "ad_name", "adset_name")]

    desde = date.fromisoformat(a.desde)
    ate = date.fromisoformat(a.ate) if a.ate else None
    fora_data, fora_campanha, leads = 0, 0, []
    for r in linhas:
        d = data_lead(r.get(c_data)) if c_data else None
        if d is None or d < desde or (ate and d > ate):
            fora_data += 1
            continue
        if a.campanha and not any(norm(a.campanha) in norm(r.get(c)) for c in c_camp):
            fora_campanha += 1
            continue
        obj, imv = bonito(r.get(c_obj)), bonito(r.get(c_imv))
        leads.append({"data": d, "nome": str(r.get(c_nome) or "").strip(), "tel": telefone(r.get(c_tel)),
                      "mail": email_ok(r.get(c_mail)), "mail_bruto": str(r.get(c_mail) or "").strip(),
                      "obj": obj, "imv": imv, "hor": horario(r.get(c_hor)), "vis": bonito(r.get(c_vis)) if c_vis else "",
                      "p": prioridade(obj, imv)})

    urg = lambda v: 0 if "quanto antes" in norm(v) else 1 if "proxim" in norm(v) else 2
    leads.sort(key=lambda x: (x["p"], urg(x["vis"]), x["data"]))
    n = len(leads)
    periodo = f"{desde:%d/%m} a {(ate or max([l['data'] for l in leads], default=desde)):%d/%m/%Y}"
    out = [f"📊 *RELATÓRIO DE LEADS*", f"*{a.titulo}*", f"_Formulário · {periodo}_", "",
           f"📩 Leads novos no período: *{n}*"]
    if a.investimento:
        out += [f"💳 Investimento: R$ {a.investimento:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")]
        if n:
            out += [f"💰 Custo por lead: *R$ {a.investimento / n:,.2f}*".replace(",", "X").replace(".", ",").replace("X", ".")]
    out += [""]
    if n:
        conta = lambda f: sum(1 for l in leads if f(l))
        out += ["*PERFIL DOS LEADS*",
                f"🏡 {conta(lambda l: 'morar' in norm(l['obj']))} querem morar · {conta(lambda l: 'invest' in norm(l['obj']))} querem investir · {conta(lambda l: 'pesquis' in norm(l['obj']))} ainda pesquisando",
                f"🔑 {conta(lambda l: 'trocar' in norm(l['imv']) or 'segundo' in norm(l['imv']))} já têm imóvel"]
        if c_vis:
            out += [f"🗓️ {conta(lambda l: urg(l['vis']) == 0)} querem conhecer o quanto antes"]
        fora = conta(lambda l: l['tel'].startswith('(') and l['tel'][1:3] not in ('61',))
        if fora:
            out += [f"📍 {fora} com DDD de fora do DF"]
        out += [""]
        rotulo = {1: "🔥 *PRIORIDADE 1*", 2: "🟡 *PRIORIDADE 2*", 3: "⚪ *PRIORIDADE 3*"}
        atual, i = None, 0
        for l in leads:
            if l["p"] != atual:
                atual = l["p"]
                out += ["━━━━━━━━━━━━━━", rotulo[atual], ""]
            i += 1
            mail = l["mail"] or ("⚠️ conferir no Meta" if l["mail_bruto"] else "")
            tel = l["tel"] + ("  ⚠️ conferir número" if len(re.sub(r"\D", "", l["tel"])) == 10 else "")
            out += [f"*{i}. {l['nome']}*", f"📞 {tel}"] + ([f"📧 {mail}"] if mail else []) + \
                   [" · ".join(x for x in [l["obj"], l["imv"]] if x)] + \
                   ([" · ".join(x for x in [("🗓️ Visita: " + l["vis"]) if l["vis"] else "", ("⏰ " + l["hor"]) if l["hor"] else ""] if x)] if (l["vis"] or l["hor"]) else []) + [
                    f"_Entrou em {l['data']:%d/%m}_", ""]
    out += ["━━━━━━━━━━━━━━",
            "💬 Depois dos primeiros contatos, nos conta: quem atendeu, quem tem perfil e quem agendou visita.",
            "", f"_UPS Digital · atualizado em {date.today():%d/%m/%Y}_"]
    texto = "\n".join(out)
    print(texto)
    destino = Path("leads") / f"{date.today():%Y-%m-%d}-{re.sub(r'[^a-z0-9]+', '-', norm(a.titulo)).strip('-')}.md"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text(texto, encoding="utf-8")
    print(f"\n[filtro] {n} leads mantidos · {fora_data} fora do período · {fora_campanha} de outra campanha · salvo em {destino}", file=sys.stderr)


if __name__ == "__main__":
    main()
