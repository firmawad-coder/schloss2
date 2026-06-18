"""Transactional email sending via Resend.

The HTML template is authored with React Email (see ../emails) and rendered to
email_templates/order_confirmation.html as a Jinja2 template. We fill it per
order here and send it with Resend's Python SDK.
"""
import os
import asyncio
import logging
from pathlib import Path
from datetime import datetime

import resend
from jinja2 import Environment, FileSystemLoader, select_autoescape

logger = logging.getLogger(__name__)

TEMPLATE_DIR = Path(__file__).parent / "email_templates"
RESEND_FROM = os.environ.get("RESEND_FROM", "Beauty Am Schloss <onboarding@resend.dev>")

_env = Environment(
    loader=FileSystemLoader(str(TEMPLATE_DIR)),
    autoescape=select_autoescape(["html", "xml"]),
)

MONTHS_DE = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
]


def is_configured() -> bool:
    return bool(os.environ.get("RESEND_API_KEY", "").strip())


def format_eur(value: float) -> str:
    s = f"{float(value):,.2f}"  # 1,234.56
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")  # -> 1.234,56
    return f"{s} €"


def format_date_de(iso: str) -> str:
    try:
        dt = datetime.fromisoformat(iso)
        return f"{dt.day}. {MONTHS_DE[dt.month - 1]} {dt.year}"
    except Exception:  # noqa: BLE001
        return iso


def _recipient(order: dict):
    ship = order.get("shipping") or {}
    return (ship.get("email") or order.get("guest_email") or "").strip() or None


def build_context(order: dict) -> dict:
    ship = order.get("shipping") or {}
    items = [
        {
            "name": it.get("name", ""),
            "brand": it.get("brand", "") or "",
            "qty": it.get("qty", 1),
            "line_total": format_eur(it.get("price", 0) * it.get("qty", 1)),
        }
        for it in order.get("items", [])
    ]
    first = (ship.get("first_name") or "").strip()
    last = (ship.get("last_name") or "").strip()
    full_name = " ".join(p for p in [first, last] if p) or "Kundin/Kunde"
    return {
        "customer_name": first or full_name,
        "order_number": order.get("order_number", ""),
        "order_date": format_date_de(order.get("created_at", "")),
        "items": items,
        "subtotal": format_eur(order.get("subtotal", 0)),
        "shipping_label": "Kostenlos" if not order.get("shipping_cost") else format_eur(order["shipping_cost"]),
        "total": format_eur(order.get("total", 0)),
        "ship": {
            "name": full_name,
            "address": ship.get("address", ""),
            "postal": ship.get("postal", ""),
            "city": ship.get("city", ""),
            "country": ship.get("country", ""),
        },
    }


def render_order_confirmation(order: dict) -> str:
    template = _env.get_template("order_confirmation.html")
    return template.render(**build_context(order))


def _send_sync(order: dict):
    to = _recipient(order)
    if not to:
        logger.warning("Order %s has no recipient email; skipping confirmation.", order.get("id"))
        return
    if not is_configured():
        logger.warning("RESEND_API_KEY not configured; skipping order confirmation email.")
        return
    resend.api_key = os.environ["RESEND_API_KEY"].strip()
    html = render_order_confirmation(order)
    params = {
        "from": RESEND_FROM,
        "to": [to],
        "subject": f"Ihre Bestellung {order.get('order_number', '')} · Beauty Am Schloss",
        "html": html,
    }
    result = resend.Emails.send(params)
    logger.info("Order confirmation sent for %s to %s (resend id=%s)",
                order.get("order_number"), to, (result or {}).get("id"))


def schedule_order_confirmation(order: dict):
    """Fire-and-forget: never block or break checkout if email fails."""
    async def _runner():
        try:
            await asyncio.to_thread(_send_sync, order)
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to send order confirmation for %s: %s", order.get("id"), exc)

    try:
        asyncio.get_running_loop().create_task(_runner())
    except RuntimeError:
        # No running loop (e.g. called from sync context) — run inline.
        try:
            _send_sync(order)
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to send order confirmation for %s: %s", order.get("id"), exc)
