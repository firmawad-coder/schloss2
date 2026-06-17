"""Mollie payment client.

Security note: Mollie webhooks are NOT signed (there is no HMAC header to
verify). The documented, secure flow is:

  1. Mollie POSTs only the payment ``id`` to our webhook.
  2. We call the Mollie API with our secret (live) key to fetch the payment.
  3. We trust ONLY the status returned by that API call — never the request body.

So fetching the payment with the live key *is* the verification step: an
attacker cannot forge a "paid" status because they cannot read a payment they
do not own, and we always re-read the authoritative status from Mollie.
"""
import os
import logging
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

MOLLIE_API_BASE = "https://api.mollie.com/v2"


def api_key() -> str:
    """Read the key at call time so it works regardless of import/.env order."""
    return os.environ.get("MOLLIE_API_KEY", "").strip()

# Map Mollie payment statuses to our internal order statuses.
STATUS_MAP = {
    "paid": "paid",
    "authorized": "authorized",
    "pending": "pending",
    "open": "pending",
    "failed": "failed",
    "canceled": "canceled",
    "expired": "expired",
}


def is_configured() -> bool:
    return bool(api_key())


def map_status(mollie_status: str) -> str:
    """Translate a Mollie payment status into our order status."""
    return STATUS_MAP.get(mollie_status, "pending")


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {api_key()}",
        "Content-Type": "application/json",
    }


async def create_payment(
    *,
    amount_eur: float,
    description: str,
    redirect_url: str,
    webhook_url: Optional[str],
    metadata: dict,
) -> dict:
    """Create a Mollie payment and return {id, status, checkout_url}."""
    body = {
        "amount": {"currency": "EUR", "value": f"{amount_eur:.2f}"},
        "description": description,
        "redirectUrl": redirect_url,
        "metadata": metadata,
    }
    # Mollie rejects non-public webhook URLs (e.g. localhost). Only send a
    # real, publicly reachable HTTPS URL — otherwise omit it.
    if webhook_url and webhook_url.startswith("https://") and "localhost" not in webhook_url:
        body["webhookUrl"] = webhook_url

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.post(f"{MOLLIE_API_BASE}/payments", headers=_headers(), json=body)
        resp.raise_for_status()
        data = resp.json()

    return {
        "id": data["id"],
        "status": data.get("status", "open"),
        "checkout_url": (data.get("_links", {}).get("checkout") or {}).get("href"),
    }


async def get_payment(payment_id: str) -> dict:
    """Fetch the authoritative payment object from Mollie."""
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(f"{MOLLIE_API_BASE}/payments/{payment_id}", headers=_headers())
        resp.raise_for_status()
        return resp.json()
