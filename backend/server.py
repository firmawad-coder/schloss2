from fastapi import FastAPI, APIRouter, HTTPException
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
    brand: str
    category: str  # "skincare" | "fragrance"
    price: float
    image: str
    tag: Optional[str] = None  # "Neu", "Bestseller", "Limitiert"
    description: Optional[str] = ""
    is_bestseller: bool = False
    is_new: bool = False


class Brand(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    tagline: str
    image: str
    slug: str


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Seed Data ----------
BRANDS_SEED = [
    {
        "name": "Doctor Babor",
        "tagline": "Medical Beauty aus Deutschland",
        "image": "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        "slug": "doctor-babor",
    },
    {
        "name": "Mesoestetic",
        "tagline": "Spanische Hochleistungs-Cosmeceuticals",
        "image": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        "slug": "mesoestetic",
    },
    {
        "name": "Boadicea the Victorious",
        "tagline": "Britische Haute Parfumerie",
        "image": "https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        "slug": "boadicea-the-victorious",
    },
    {
        "name": "Fragrance Du Bois",
        "tagline": "Pures Oud aus den Wäldern Asiens",
        "image": "https://images.unsplash.com/photo-1615160460366-2c9a41771b51?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        "slug": "fragrance-du-bois",
    },
]

PRODUCTS_SEED = [
    {
        "name": "Doctor Babor Lifting Cellular Cream",
        "brand": "Doctor Babor",
        "category": "skincare",
        "price": 178.00,
        "image": "https://images.unsplash.com/photo-1631438420064-8f1b2b52b2e6?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Neu",
        "is_new": True,
    },
    {
        "name": "Mesoestetic Collagen 360° Eye Contour",
        "brand": "Mesoestetic",
        "category": "skincare",
        "price": 96.00,
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Neu",
        "is_new": True,
    },
    {
        "name": "Boadicea Hanover Square Eau de Parfum",
        "brand": "Boadicea the Victorious",
        "category": "fragrance",
        "price": 290.00,
        "image": "https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Limitiert",
        "is_new": True,
    },
    {
        "name": "Fragrance Du Bois Oud Jaune Intense",
        "brand": "Fragrance Du Bois",
        "category": "fragrance",
        "price": 420.00,
        "image": "https://images.unsplash.com/photo-1615160460366-2c9a41771b51?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Neu",
        "is_new": True,
    },
    {
        "name": "Doctor Babor Ultimate Repair Gel-Cream",
        "brand": "Doctor Babor",
        "category": "skincare",
        "price": 132.00,
        "image": "https://images.unsplash.com/photo-1643123158391-8543727c85f5?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Bestseller",
        "is_bestseller": True,
    },
    {
        "name": "Mesoestetic Energy C Intensive Serum",
        "brand": "Mesoestetic",
        "category": "skincare",
        "price": 88.00,
        "image": "https://images.unsplash.com/photo-1763503836825-97f5450d155a?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Bestseller",
        "is_bestseller": True,
    },
    {
        "name": "Boadicea Glorious Eau de Parfum",
        "brand": "Boadicea the Victorious",
        "category": "fragrance",
        "price": 310.00,
        "image": "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Bestseller",
        "is_bestseller": True,
    },
    {
        "name": "Fragrance Du Bois Santal Complet",
        "brand": "Fragrance Du Bois",
        "category": "fragrance",
        "price": 380.00,
        "image": "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
        "tag": "Bestseller",
        "is_bestseller": True,
    },
]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "LUXÉLLE API"}


@api_router.get("/brands", response_model=List[Brand])
async def get_brands():
    return [Brand(**b) for b in BRANDS_SEED]


@api_router.get("/products", response_model=List[Product])
async def get_products(filter: Optional[str] = None):
    products = [Product(**p) for p in PRODUCTS_SEED]
    if filter == "new":
        return [p for p in products if p.is_new]
    if filter == "bestseller":
        return [p for p in products if p.is_bestseller]
    return products


@api_router.post("/newsletter")
async def subscribe_newsletter(payload: NewsletterSubscribe):
    existing = await db.newsletter.find_one({"email": payload.email})
    if existing:
        return {"status": "already_subscribed", "message": "Sie sind bereits angemeldet."}
    entry = NewsletterEntry(email=payload.email)
    await db.newsletter.insert_one(entry.model_dump())
    return {"status": "subscribed", "message": "Willkommen bei LUXÉLLE."}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
