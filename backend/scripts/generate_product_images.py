"""
Generate unique luxury product photos for Beauty Am Schloss via Gemini Nano Banana.
Saves to /app/backend/static/products/{slug}.png and updates a JSON map.
Run: python /app/backend/scripts/generate_product_images.py
"""
import asyncio
import base64
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = Path("/app/backend/static/products")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Common style suffix for editorial luxury feel
STYLE = (
    "Editorial luxury still-life photography, soft cinematic lighting, "
    "extreme detail, photorealistic, no text on label, no brand name visible, "
    "no logo, museum quality, ultra premium, magazine cover style, 3:4 portrait composition."
)

PRODUCTS = [
    # Perfumes (8)
    {
        "slug": "regents-crown",
        "prompt": (
            "A tall, faceted heavy crystal perfume flacon filled with deep amber-rose liquid, "
            "topped with a polished antique brass cap shaped like a small crown. "
            "Sitting on a slab of warm ivory marble. Backdrop: deep bordeaux velvet drapery. "
            "Soft golden afternoon light, dust particles in the air. "
        ) + STYLE,
    },
    {
        "slug": "oud-noir-imperial",
        "prompt": (
            "An obsidian-black square perfume bottle with hand-engraved geometric oud-wood pattern, "
            "polished gunmetal cap. Beside it: a small carved oud-wood block, a brass incense burner "
            "with a thin curl of smoke. Backdrop: pitch black velvet with subtle gold dust. "
            "Single tight rim light from above. "
        ) + STYLE,
    },
    {
        "slug": "diaghilev-elixir",
        "prompt": (
            "An opulent baroque crystal perfume flacon filled with deep ruby-amber elixir, "
            "wrapped in a delicate handcut gold filigree cage. Sitting on a marble plinth. "
            "Backdrop: deep midnight-blue velvet with embroidered gold thread. "
            "Single warm spotlight from the upper left. "
        ) + STYLE,
    },
    {
        "slug": "naxos-reserve",
        "prompt": (
            "A clean modern smoked-amber glass perfume bottle with simple polished bronze cap. "
            "Mediterranean honey color of the liquid. Sitting on Sicilian travertine stone "
            "with a dried tobacco leaf and a small piece of honeycomb beside it. "
            "Soft warm sunset light. Backdrop: linen the color of raw silk. "
        ) + STYLE,
    },
    {
        "slug": "aurum-chypre",
        "prompt": (
            "A faceted hexagonal crystal perfume bottle filled with golden champagne liquid, "
            "polished 18k gold cap, with a fresh bergamot fruit cut in half beside it. "
            "Single vetiver root and dried patchouli leaves on a polished dark walnut surface. "
            "Backdrop: deep forest green silk. "
        ) + STYLE,
    },
    {
        "slug": "santal-royal",
        "prompt": (
            "A creamy ivory ceramic-finished perfume bottle with smooth rounded shoulders, "
            "polished sandalwood cap. Beside it: raw Mysore sandalwood chips and a soft "
            "cashmere fabric in warm cream. Backdrop: aged unbleached linen. "
            "Soft diffused warm light. "
        ) + STYLE,
    },
    {
        "slug": "reine-de-saba",
        "prompt": (
            "A sculptural perfume bottle in the shape of a tall obelisk, deep amethyst glass, "
            "antique gold collar. Beside it: small mound of raw frankincense resin and a "
            "single white jasmine sambac flower. Backdrop: deep oxblood velvet. "
            "Single golden ray of light from above as if from a cathedral window. "
        ) + STYLE,
    },
    {
        "slug": "erba-pura",
        "prompt": (
            "An iconic minimalist clear crystal perfume bottle with pale citrine-yellow liquid, "
            "polished platinum cap. Beside it: a single Sicilian lemon cut open, fresh "
            "white pear, a baroque pearl. On Carrara white marble. Backdrop: soft pale sky blue. "
            "Bright Mediterranean morning light. "
        ) + STYLE,
    },
    # Skincare (4)
    {
        "slug": "babor-elixir-24",
        "prompt": (
            "A tall sleek dark amber glass dropper bottle with matte black dropper cap and "
            "matte black pump (no label/text). Sitting on a polished black stone slab "
            "with a single drop of golden serum mid-fall just above. Backdrop: deep "
            "charcoal grey with soft graduated lighting. Ultra clean clinical premium. "
        ) + STYLE,
    },
    {
        "slug": "mesoestetic-collagen",
        "prompt": (
            "A heavy frosted-white opaque glass jar of luxury face cream with a brushed "
            "rose-gold metallic cap, lid slightly off showing pure white silken cream texture. "
            "On a slab of pale pink marble. A small jade gua sha stone beside it. "
            "Backdrop: soft blush-cream linen. Soft morning light. "
        ) + STYLE,
    },
    {
        "slug": "babor-reversive-pro",
        "prompt": (
            "An elegant tall white porcelain-finish glass cream jar with polished platinum "
            "metal cap, lid open revealing pearlescent ivory cream with subtle shimmer. "
            "On a slab of white statuary marble. A single droplet of liquid gold serum "
            "in a small crystal dish nearby. Backdrop: soft champagne-cream tone. "
        ) + STYLE,
    },
    {
        "slug": "mesoestetic-energy-c",
        "prompt": (
            "A tall apothecary-style clear crystal glass dropper bottle filled with vivid "
            "golden-orange vitamin-C serum, brushed copper-gold dropper cap. Beside it: "
            "a halved Sicilian blood orange showing rich color, a fresh sprig of orange "
            "blossom. On a slab of warm ivory travertine. Backdrop: pale buttercream. "
            "Bright clean morning light. "
        ) + STYLE,
    },
]


async def generate_one(item):
    out_path = OUT_DIR / f"{item['slug']}.png"
    if out_path.exists() and out_path.stat().st_size > 10000:
        print(f"  ✓ {item['slug']} (exists, skip)")
        return item["slug"], True

    try:
        chat = LlmChat(
            api_key=API_KEY,
            session_id=f"bas-img-{item['slug']}",
            system_message="You are a luxury product photographer.",
        )
        chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])

        msg = UserMessage(text=item["prompt"])
        _text, images = await chat.send_message_multimodal_response(msg)

        if not images:
            print(f"  ✗ {item['slug']} — no image returned")
            return item["slug"], False

        image_bytes = base64.b64decode(images[0]["data"])
        out_path.write_bytes(image_bytes)
        print(f"  ✓ {item['slug']} → {len(image_bytes) // 1024} KB")
        return item["slug"], True
    except Exception as e:
        print(f"  ✗ {item['slug']} — error: {e}")
        return item["slug"], False


async def main():
    print(f"Generating {len(PRODUCTS)} product images via {MODEL}...\n")
    results = []
    # Serial to avoid rate limits
    for item in PRODUCTS:
        result = await generate_one(item)
        results.append(result)

    success = sum(1 for _, ok in results if ok)
    print(f"\nDone. {success}/{len(PRODUCTS)} images generated.")
    print(f"Output dir: {OUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
