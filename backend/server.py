from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    subtitle: Optional[str] = ""
    brand: str
    category: str  # "fragrance" | "skincare"
    price: float
    size: Optional[str] = None
    image: str
    tag: Optional[str] = None
    description: Optional[str] = ""
    notes: Optional[List[str]] = []
    rating: float = 5.0
    review_count: int = 0
    is_bestseller: bool = False
    is_new: bool = False


class Brand(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    house: str  # short label e.g. "Maison de Parfum"
    tagline: str
    origin: str
    established: str
    category: str  # "fragrance" | "skincare"
    image: str
    slug: str


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Seed: Parfum-Maisons (Primary) + Pflege (Secondary) ----------
BRANDS_SEED = [
    {
        "name": "Boadicea the Victorious",
        "house": "Haute Parfumerie",
        "tagline": "Britische Royal Niche, von Hand komponiert.",
        "origin": "London",
        "established": "1998",
        "category": "fragrance",
        "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?crop=entropy&cs=srgb&fm=jpg&w=1400&q=90",
        "slug": "boadicea",
    },
    {
        "name": "Fragrance Du Bois",
        "house": "Maison d'Oud",
        "tagline": "Reines Wild-Oud aus eigenen Plantagen Südostasiens.",
        "origin": "Singapur",
        "established": "2014",
        "category": "fragrance",
        "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?crop=entropy&cs=srgb&fm=jpg&w=1400&q=90",
        "slug": "fragrance-du-bois",
    },
    {
        "name": "Roja Parfums",
        "house": "Couture Olfactive",
        "tagline": "Die Königsklasse britischer Parfumeurs-Kunst.",
        "origin": "London",
        "established": "2011",
        "category": "fragrance",
        "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?crop=entropy&cs=srgb&fm=jpg&w=1400&q=90",
        "slug": "roja-parfums",
    },
    {
        "name": "Xerjoff",
        "house": "Haute Parfumerie Italiana",
        "tagline": "Italienische Goldschmiedekunst in flüssiger Form.",
        "origin": "Turin",
        "established": "2003",
        "category": "fragrance",
        "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?crop=entropy&cs=srgb&fm=jpg&w=1400&q=90",
        "slug": "xerjoff",
    },
]

SECONDARY_BRANDS = [
    {
        "name": "Doctor Babor",
        "house": "Medical Skincare",
        "tagline": "Klinische Pflege – Made in Germany.",
        "origin": "Aachen",
        "established": "1956",
        "category": "skincare",
        "image": "https://images.unsplash.com/photo-1631438420064-8f1b2b52b2e6?crop=entropy&cs=srgb&fm=jpg&w=1200&q=90",
        "slug": "doctor-babor",
    },
    {
        "name": "Mesoestetic",
        "house": "Cosmeceuticals",
        "tagline": "Spanische High-Performance-Cosmeceuticals.",
        "origin": "Barcelona",
        "established": "1985",
        "category": "skincare",
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?crop=entropy&cs=srgb&fm=jpg&w=1200&q=90",
        "slug": "mesoestetic",
    },
]

# ---------- Products: 8 Parfums + 4 Pflege ----------
PRODUCTS_SEED = [
    # PARFUMS (primary)
    {
        "name": "Régent's Crown",
        "subtitle": "Eau de Parfum Intense",
        "brand": "Boadicea the Victorious",
        "category": "fragrance",
        "price": 485.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Maison Édition",
        "notes": ["Bulgarische Rose", "Indisches Oud", "Madagaskar Vanille"],
        "description": "Eine Hommage an die britische Krone. Bulgarische Rose im Morgentau, eingebettet in patinierte Oud-Hölzer und Madagaskar-Vanille. Eine Komposition von majestätischer Tiefe — handabgefüllt in limitierter Edition.",
        "rating": 4.9,
        "review_count": 184,
        "is_new": True,
    },
    {
        "name": "Oud Noir Impérial",
        "subtitle": "Extrait de Parfum",
        "brand": "Fragrance Du Bois",
        "category": "fragrance",
        "price": 620.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Limitiert · 200 Flakons",
        "notes": ["Wild-Oud Assam", "Schwarzer Pfeffer", "Räucherweihrauch"],
        "description": "Dreißig Jahre gereiftes Wild-Oud aus den eigenen Plantagen — destilliert in Mondlichtnächten. Schwarzer Pfeffer und Weihrauch umhüllen das Herz in samtiger Dunkelheit. Ein Parfum, das nicht spricht, sondern flüstert.",
        "rating": 5.0,
        "review_count": 92,
        "is_new": True,
        "is_bestseller": True,
    },
    {
        "name": "Diaghilev Élixir",
        "subtitle": "Parfum Extrait",
        "brand": "Roja Parfums",
        "category": "fragrance",
        "price": 920.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1610461888750-10bfc601b874?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Chef d'Œuvre",
        "notes": ["Türkische Rose", "Iris Pallida", "Sandalholz Mysore"],
        "description": "Roja Dove's Meisterwerk — eine Chypre-Komposition von atemberaubender Komplexität. Türkische Rose küsst Iris Pallida, getragen von gereiftem Mysore-Sandelholz. Inspiriert von den Ballets Russes.",
        "rating": 5.0,
        "review_count": 67,
        "is_bestseller": True,
    },
    {
        "name": "Naxos Reserve",
        "subtitle": "Eau de Parfum",
        "brand": "Xerjoff",
        "category": "fragrance",
        "price": 395.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Bestseller",
        "notes": ["Sizilianischer Tabak", "Honigblüte", "Kaschmir-Lavendel"],
        "description": "Mediterrane Sommernacht in einem Flakon. Sizilianischer Tabak und goldener Honig, gewärmt durch Lavendel aus Kaschmir. Sinnlich, sonnenverwöhnt, unwiderstehlich.",
        "rating": 4.9,
        "review_count": 312,
        "is_bestseller": True,
    },
    {
        "name": "Aurum Chypre",
        "subtitle": "Eau de Parfum",
        "brand": "Boadicea the Victorious",
        "category": "fragrance",
        "price": 540.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Neu",
        "notes": ["Bergamotte Calabrese", "Patchouli", "Vetiver Haiti"],
        "description": "Eine moderne Chypre, gefasst in flüssiges Gold. Kalabrische Bergamotte zerbricht auf erdigem Patchouli, getragen von haitianischem Vetiver. Ein olfaktorisches Schmuckstück.",
        "rating": 4.8,
        "review_count": 148,
        "is_new": True,
    },
    {
        "name": "Santal Royal",
        "subtitle": "Extrait de Parfum",
        "brand": "Fragrance Du Bois",
        "category": "fragrance",
        "price": 580.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1615160460366-2c9a41771b51?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Bestseller",
        "notes": ["Mysore-Sandelholz", "Kaschmir", "Cremiges Amber"],
        "description": "Reines Mysore-Sandelholz, gereift wie ein großer Cognac. Umhüllt von Kaschmir-Wärme und cremigem Amber. Ein Holz-Gourmand von meditativer Eleganz.",
        "rating": 5.0,
        "review_count": 256,
        "is_bestseller": True,
    },
    {
        "name": "Reine de Saba",
        "subtitle": "Parfum",
        "brand": "Roja Parfums",
        "category": "fragrance",
        "price": 760.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Édition Privée",
        "notes": ["Weihrauch Oman", "Jasmin Sambac", "Tonkabohne"],
        "description": "Die Königin von Saba in olfaktorischer Form. Heiliger Weihrauch aus Oman trifft auf Jasmin Sambac und cremige Tonkabohne. Sakral und sinnlich zugleich.",
        "rating": 4.9,
        "review_count": 78,
        "is_new": True,
    },
    {
        "name": "Erba Pura",
        "subtitle": "Eau de Parfum",
        "brand": "Xerjoff",
        "category": "fragrance",
        "price": 365.00,
        "size": "100 ml",
        "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Icon",
        "notes": ["Sizilianische Zitrone", "Weiße Früchte", "Ambergris"],
        "description": "Der zeitlose Klassiker aus Turin. Sizilianische Zitrone trifft auf weiße Früchte und einen Hauch Ambergris. Frisch wie ein mediterraner Morgen, kostbar wie eine Perle.",
        "rating": 4.9,
        "review_count": 428,
        "is_bestseller": True,
    },

    # SKINCARE (secondary)
    {
        "name": "Doctor Babor Elixir 24",
        "subtitle": "Cellular Anti-Aging Serum",
        "brand": "Doctor Babor",
        "category": "skincare",
        "price": 245.00,
        "size": "30 ml",
        "image": "https://images.unsplash.com/photo-1631438420064-8f1b2b52b2e6?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Hero Product",
        "description": "Hochkonzentriertes 24-Stunden-Elixier mit zellaktiven Wirkstoffen. Klinisch erprobt, dermatologisch kuratiert.",
        "rating": 4.9,
        "review_count": 521,
        "is_bestseller": True,
    },
    {
        "name": "Mesoestetic Collagen Couture",
        "subtitle": "Premium Lifting Cream",
        "brand": "Mesoestetic",
        "category": "skincare",
        "price": 198.00,
        "size": "50 ml",
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Cosmeceutical",
        "description": "Hochleistungs-Collagen-Lifting aus dem spanischen Labor. Eine sichtbare Architektur der Haut.",
        "rating": 4.8,
        "review_count": 287,
        "is_new": True,
    },
    {
        "name": "Doctor Babor Reversive Pro",
        "subtitle": "Youth Glow Cream",
        "brand": "Doctor Babor",
        "category": "skincare",
        "price": 285.00,
        "size": "50 ml",
        "image": "https://images.unsplash.com/photo-1643123158391-8543727c85f5?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Bestseller",
        "description": "Hochwirksame Anti-Aging-Pflege mit patentiertem Reversive-Komplex. Für eine sichtbar verjüngte Haut.",
        "rating": 4.9,
        "review_count": 396,
        "is_bestseller": True,
    },
    {
        "name": "Mesoestetic Energy C Concentrate",
        "subtitle": "Vitamin C Intensive",
        "brand": "Mesoestetic",
        "category": "skincare",
        "price": 168.00,
        "size": "30 ml",
        "image": "https://images.unsplash.com/photo-1763503836825-97f5450d155a?crop=entropy&cs=srgb&fm=jpg&w=1100&q=90",
        "tag": "Cult Favorite",
        "description": "Reinste Vitamin-C-Konzentration mit Sofort-Glow-Effekt. Antioxidativer Schutz auf Klinikniveau.",
        "rating": 4.8,
        "review_count": 412,
        "is_bestseller": True,
    },
]

ALL_BRANDS = BRANDS_SEED + SECONDARY_BRANDS

REVIEWS_SEED = [
    {
        "author": "Charlotte v. R.",
        "city": "München",
        "rating": 5,
        "title": "Eine Offenbarung",
        "text": "Die Beratung war auf Concierge-Niveau. Mein Oud Noir Impérial wurde mit handgeschriebener Karte und Proben geliefert. Niemand sonst in Deutschland bietet diese Auswahl.",
        "product": "Oud Noir Impérial",
    },
    {
        "author": "Dr. Isabel M.",
        "city": "Hamburg",
        "rating": 5,
        "title": "Wahre Haute Parfumerie",
        "text": "Naxos Reserve ist meine olfaktorische Signatur geworden. Beauty Am Schloss ist mein einziger Anlaufpunkt für seltene Maisons — hier wird Parfum noch als Kunst zelebriert.",
        "product": "Naxos Reserve",
    },
    {
        "author": "Alexander K.",
        "city": "Berlin",
        "rating": 5,
        "title": "Diskret. Exquisit. Persönlich.",
        "text": "Diaghilev Élixir habe ich in Paris vergeblich gesucht — hier wurde es mir in einer Holzbox überreicht. Service wie auf der Place Vendôme.",
        "product": "Diaghilev Élixir",
    },
]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Beauty Am Schloss API"}


@api_router.get("/brands", response_model=List[Brand])
async def get_brands(category: Optional[str] = None):
    brands = [Brand(**b) for b in ALL_BRANDS]
    if category:
        brands = [b for b in brands if b.category == category]
    return brands


@api_router.get("/products", response_model=List[Product])
async def get_products(filter: Optional[str] = None, category: Optional[str] = None):
    products = [Product(**p) for p in PRODUCTS_SEED]
    if category:
        products = [p for p in products if p.category == category]
    if filter == "new":
        products = [p for p in products if p.is_new]
    elif filter == "bestseller":
        products = [p for p in products if p.is_bestseller]
    return products


@api_router.get("/reviews")
async def get_reviews():
    return REVIEWS_SEED


@api_router.post("/newsletter")
async def subscribe_newsletter(payload: NewsletterSubscribe):
    existing = await db.newsletter.find_one({"email": payload.email})
    if existing:
        return {"status": "already_subscribed", "message": "Sie sind bereits Teil des Cercles."}
    entry = NewsletterEntry(email=payload.email)
    await db.newsletter.insert_one(entry.model_dump())
    return {"status": "subscribed", "message": "Willkommen im Cercle Beauty Am Schloss."}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
