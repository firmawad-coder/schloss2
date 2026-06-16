"""Generate brand cover & ambient editorial images for Beauty Am Schloss."""
import asyncio
import base64
import os
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = Path("/app/backend/static/products")
OUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE = (
    "Editorial luxury still-life photography, soft cinematic lighting, "
    "extreme detail, photorealistic, no text on label, no brand name visible, "
    "no logo, museum quality, ultra premium, magazine cover style. 3:4 portrait composition."
)

ASSETS = [
    {
        "slug": "brand-boadicea",
        "prompt": (
            "A heavy faceted crystal perfume flacon with intricate cut-glass pattern reminiscent of a "
            "crown jewel, polished antique brass cap, sitting on a slab of dark red Carrara marble. "
            "Beside it: a single deep red British rose with dewdrops, a strip of indigo silk. "
            "Dramatic chiaroscuro lighting from a single window. Backdrop: deep oxblood velvet. "
        ) + STYLE,
    },
    {
        "slug": "brand-fragrance-du-bois",
        "prompt": (
            "An obsidian-black square perfume bottle with carved oud-wood geometric pattern, "
            "polished gunmetal cap, surrounded by raw chunks of dark aquilaria oud wood, a tiny brass "
            "incense burner with a thin curl of fragrant smoke rising. Backdrop: pitch black silk. "
            "Single warm rim light from above. "
        ) + STYLE,
    },
    {
        "slug": "brand-roja-parfums",
        "prompt": (
            "An opulent baroque crystal perfume bottle filled with deep ruby liquid, wrapped in "
            "handcut 18k gold filigree cage, displayed on a polished black onyx pedestal. "
            "Background: deep midnight blue velvet drapery with embroidered gold thread, hint of "
            "candlelight. Single warm spotlight. "
        ) + STYLE,
    },
    {
        "slug": "brand-xerjoff",
        "prompt": (
            "A sleek modern clear crystal perfume bottle with pale citrine liquid and polished "
            "platinum cap. On a slab of warm Italian travertine. Beside it: a single Sicilian "
            "lemon, a baroque pearl, a sprig of olive leaves. Backdrop: pale terracotta linen. "
            "Bright Mediterranean morning light. "
        ) + STYLE,
    },
    {
        "slug": "hero-cover",
        "prompt": (
            "Wide editorial composition: three luxury perfume flacons arranged on a slab of dark "
            "marble, dramatic side-lit from the right. One amber, one obsidian, one crystal. "
            "Smoke / mist drifting between them. Backdrop: deep espresso brown velvet fading to "
            "black. Single golden ray of light from the upper right. Cinematic mood, dark luxury. "
            "Landscape 16:9 composition."
        ),
    },
    {
        "slug": "philosophy-atelier",
        "prompt": (
            "An atelier still-life: a vintage brass perfume organ with small glass essence bottles "
            "in neat rows, a leather-bound journal, a single antique gold pen, a small flacon being "
            "decanted with a glass dropper. Hand of a parfumeur (out of focus) in soft white sleeve. "
            "Warm natural window light from the left. Backdrop: aged cream plaster wall. "
            "Editorial 4:5 composition. " + STYLE
        ),
    },
]


async def generate_one(item):
    out_path = OUT_DIR / f"{item['slug']}.png"
    if out_path.exists() and out_path.stat().st_size > 10000:
        print(f"  ✓ {item['slug']} (exists, skip)")
        return True

    try:
        chat = LlmChat(api_key=API_KEY, session_id=f"bas-{item['slug']}", system_message="You are a luxury product photographer.")
        chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])

        msg = UserMessage(text=item["prompt"])
        _text, images = await chat.send_message_multimodal_response(msg)

        if not images:
            print(f"  ✗ {item['slug']} — no image returned")
            return False

        image_bytes = base64.b64decode(images[0]["data"])
        out_path.write_bytes(image_bytes)
        print(f"  ✓ {item['slug']} → {len(image_bytes) // 1024} KB")
        return True
    except Exception as e:
        print(f"  ✗ {item['slug']} — error: {e}")
        return False


async def main():
    print(f"Generating {len(ASSETS)} brand/ambient images...\n")
    ok = 0
    for item in ASSETS:
        if await generate_one(item):
            ok += 1
    print(f"\nDone. {ok}/{len(ASSETS)} images generated.")


if __name__ == "__main__":
    asyncio.run(main())
