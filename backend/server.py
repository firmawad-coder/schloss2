from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
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

from auth import hash_password, verify_password, create_access_token, decode_token
import mollie
import emailer


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Public base URLs used to build Mollie redirect/webhook URLs.
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000').rstrip('/')
BACKEND_PUBLIC_URL = os.environ.get('BACKEND_PUBLIC_URL', '').rstrip('/')

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
    house: str  # short label e.g. "Haute Parfumerie"
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


# ---------- Account & Order Models ----------
class UserPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    email: str
    phone: Optional[str] = ""
    address: Optional[str] = ""
    created_at: str


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=40)
    address: Optional[str] = Field(default=None, max_length=240)


class OrderItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: Optional[str] = None
    name: str
    brand: Optional[str] = ""
    price: float
    qty: int = Field(ge=1)
    image: Optional[str] = ""
    size: Optional[str] = None


class ShippingInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    first_name: str
    last_name: str
    address: str
    postal: str
    city: str
    country: str
    email: Optional[str] = None


class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping: ShippingInfo


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    order_number: str
    user_id: Optional[str] = None
    is_guest: bool = False
    guest_email: Optional[str] = None
    items: List[OrderItem]
    shipping: ShippingInfo
    subtotal: float
    shipping_cost: float
    total: float
    status: str
    created_at: str
    payment_id: Optional[str] = None
    payment_status: Optional[str] = None
    paid_at: Optional[str] = None
    # Returned on creation so the client can redirect to Mollie; not persisted.
    checkout_url: Optional[str] = None


# ---------- Seed: Parfum-Häuser (Primary) + Pflege (Secondary) ----------
BRANDS_SEED = [
    {
        "name": "Boadicea the Victorious",
        "house": "Haute Parfumerie",
        "tagline": "Britische Royal Niche, von Hand komponiert.",
        "origin": "London",
        "established": "1998",
        "category": "fragrance",
        "image": "/api/static/products/brand-boadicea.png",
        "slug": "boadicea",
    },
    {
        "name": "Fragrance Du Bois",
        "house": "Haus des Oud",
        "tagline": "Reines Wild-Oud aus eigenen Plantagen Südostasiens.",
        "origin": "Singapur",
        "established": "2014",
        "category": "fragrance",
        "image": "/api/static/products/brand-fragrance-du-bois.png",
        "slug": "fragrance-du-bois",
    },
    {
        "name": "Roja Parfums",
        "house": "Couture Olfactive",
        "tagline": "Die Königsklasse britischer Parfumeurs-Kunst.",
        "origin": "London",
        "established": "2011",
        "category": "fragrance",
        "image": "/api/static/products/brand-roja-parfums.png",
        "slug": "roja-parfums",
    },
    {
        "name": "Xerjoff",
        "house": "Haute Parfumerie Italiana",
        "tagline": "Italienische Goldschmiedekunst in flüssiger Form.",
        "origin": "Turin",
        "established": "2003",
        "category": "fragrance",
        "image": "/api/static/products/brand-xerjoff.png",
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
        "image": "/api/static/products/babor-elixir-24.png",
        "slug": "doctor-babor",
    },
    {
        "name": "Mesoestetic",
        "house": "Cosmeceuticals",
        "tagline": "Spanische High-Performance-Cosmeceuticals.",
        "origin": "Barcelona",
        "established": "1985",
        "category": "skincare",
        "image": "/api/static/products/mesoestetic-collagen.png",
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
        "price": 420.00,
        "size": "100 ml",
        "image": "/api/static/products/regents-crown.png",
        "tag": "Édition Privée",
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
        "price": 450.00,
        "size": "100 ml",
        "image": "/api/static/products/oud-noir-imperial.png",
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
        "price": 450.00,
        "size": "100 ml",
        "image": "/api/static/products/diaghilev-elixir.png",
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
        "price": 290.00,
        "size": "100 ml",
        "image": "/api/static/products/naxos-reserve.png",
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
        "price": 380.00,
        "size": "100 ml",
        "image": "/api/static/products/aurum-chypre.png",
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
        "price": 410.00,
        "size": "100 ml",
        "image": "/api/static/products/santal-royal.png",
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
        "price": 440.00,
        "size": "100 ml",
        "image": "/api/static/products/reine-de-saba.png",
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
        "price": 235.00,
        "size": "100 ml",
        "image": "/api/static/products/erba-pura.png",
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
        "price": 295.00,
        "size": "30 ml",
        "image": "/api/static/products/babor-elixir-24.png",
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
        "price": 215.00,
        "size": "50 ml",
        "image": "/api/static/products/mesoestetic-collagen.png",
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
        "price": 320.00,
        "size": "50 ml",
        "image": "/api/static/products/babor-reversive-pro.png",
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
        "price": 165.00,
        "size": "30 ml",
        "image": "/api/static/products/mesoestetic-energy-c.png",
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
        "text": "Naxos Reserve ist meine olfaktorische Signatur geworden. Beauty Am Schloss ist mein einziger Anlaufpunkt für seltene Häuser — hier wird Parfum noch als Kunst zelebriert.",
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


# ---------- Auth ----------
bearer_scheme = HTTPBearer(auto_error=False)

FREE_SHIPPING_THRESHOLD = 150.0
SHIPPING_COST = 9.9


def public_user(doc: dict) -> UserPublic:
    return UserPublic(
        id=doc["id"],
        name=doc["name"],
        email=doc["email"],
        phone=doc.get("phone", ""),
        address=doc.get("address", ""),
        created_at=doc["created_at"],
    )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Nicht angemeldet.")
    user_id = decode_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sitzung ungültig oder abgelaufen.")
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Benutzer nicht gefunden.")
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    """Return the current user if a valid token is present, else None (guest)."""
    if credentials is None:
        return None
    user_id = decode_token(credentials.credentials)
    if not user_id:
        return None
    return await db.users.find_one({"id": user_id}, {"_id": 0})


@api_router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest):
    email = req.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Diese E-Mail ist bereits registriert.")
    user_doc = {
        "id": str(uuid.uuid4()),
        "name": req.name.strip(),
        "email": email,
        "password_hash": hash_password(req.password),
        "phone": "",
        "address": "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_doc["id"])
    return TokenResponse(access_token=token, user=public_user(user_doc))


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    email = req.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "E-Mail oder Passwort ist falsch.")
    token = create_access_token(user["id"])
    return TokenResponse(access_token=token, user=public_user(user))


@api_router.get("/auth/me", response_model=UserPublic)
async def read_me(user: dict = Depends(get_current_user)):
    return public_user(user)


@api_router.put("/auth/me", response_model=UserPublic)
async def update_me(update: ProfileUpdate, user: dict = Depends(get_current_user)):
    changes = update.model_dump(exclude_none=True)
    if changes:
        await db.users.update_one({"id": user["id"]}, {"$set": changes})
        user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return public_user(user)


# ---------- Orders ----------
@api_router.post("/orders", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate, user: Optional[dict] = Depends(get_optional_user)):
    if not payload.items:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Der Warenkorb ist leer.")
    is_guest = user is None
    guest_email = (payload.shipping.email or "").strip().lower() if is_guest else None
    if is_guest and not guest_email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "E-Mail ist für die Bestellung erforderlich.")
    subtotal = round(sum(item.price * item.qty for item in payload.items), 2)
    shipping_cost = 0.0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_COST
    total = round(subtotal + shipping_cost, 2)
    now = datetime.now(timezone.utc)
    seq = await db.orders.count_documents({}) + 1
    order_id = str(uuid.uuid4())
    order_number = f"BAS-{now.year}-{seq:04d}"
    order_doc = {
        "id": order_id,
        "order_number": order_number,
        "user_id": user["id"] if user else None,
        "is_guest": is_guest,
        "guest_email": guest_email,
        "items": [item.model_dump() for item in payload.items],
        "shipping": payload.shipping.model_dump(),
        "subtotal": subtotal,
        "shipping_cost": shipping_cost,
        "total": total,
        # Awaiting payment when a PSP is configured; otherwise treat as placed.
        "status": "pending" if mollie.is_configured() else "In Bearbeitung",
        "created_at": now.isoformat(),
        "payment_id": None,
        "payment_status": None,
        "paid_at": None,
    }
    await db.orders.insert_one(order_doc)

    checkout_url = None
    if mollie.is_configured():
        try:
            payment = await mollie.create_payment(
                amount_eur=total,
                description=f"Beauty Am Schloss · Bestellung {order_number}",
                redirect_url=f"{FRONTEND_URL}/checkout/complete?order={order_id}",
                webhook_url=f"{BACKEND_PUBLIC_URL}/api/webhook/mollie" if BACKEND_PUBLIC_URL else None,
                metadata={"order_id": order_id, "order_number": order_number},
            )
        except Exception as exc:  # noqa: BLE001
            logger.error("Mollie payment creation failed for order %s: %s", order_id, exc)
            await db.orders.update_one({"id": order_id}, {"$set": {"status": "payment_error"}})
            raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Zahlung konnte nicht initialisiert werden.")
        await db.orders.update_one(
            {"id": order_id},
            {"$set": {"payment_id": payment["id"], "payment_status": payment["status"]}},
        )
        order_doc["payment_id"] = payment["id"]
        order_doc["payment_status"] = payment["status"]
        checkout_url = payment["checkout_url"]
    else:
        # No payment step: the order is placed now, send the confirmation email.
        order_doc["confirmation_sent"] = True
        await db.orders.update_one({"id": order_id}, {"$set": {"confirmation_sent": True}})
        emailer.schedule_order_confirmation(order_doc)

    return Order(**order_doc, checkout_url=checkout_url)


@api_router.get("/orders", response_model=List[Order])
async def list_orders(user: dict = Depends(get_current_user)):
    docs = await db.orders.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [Order(**doc) for doc in docs]


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, user: Optional[dict] = Depends(get_optional_user)):
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Bestellung nicht gefunden.")
    # Access control: orders tied to an account require that account; guest
    # orders (no user_id) are retrievable by their unguessable id (capability).
    if doc.get("user_id") and (not user or user["id"] != doc["user_id"]):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Bestellung nicht gefunden.")
    # Reconcile with Mollie when still awaiting payment, so the return/success
    # page is correct even if the webhook is delayed or was missed.
    if doc.get("payment_id") and doc.get("status") in ("pending", "open") and mollie.is_configured():
        try:
            payment = await mollie.get_payment(doc["payment_id"])
            mollie_status = payment.get("status", "")
            new_status = mollie.map_status(mollie_status)
            if new_status != doc.get("status") or mollie_status != doc.get("payment_status"):
                update = {"payment_status": mollie_status, "status": new_status}
                if mollie_status == "paid" and not doc.get("paid_at"):
                    update["paid_at"] = datetime.now(timezone.utc).isoformat()
                await db.orders.update_one({"id": order_id}, {"$set": update})
                doc.update(update)
                if mollie_status == "paid":
                    await _send_confirmation_once({"id": order_id})
        except Exception as exc:  # noqa: BLE001
            logger.warning("Could not reconcile order %s with Mollie: %s", order_id, exc)
    return Order(**doc)


async def _send_confirmation_once(query: dict):
    """Send the order confirmation email exactly once for a paid order."""
    doc = await db.orders.find_one(query, {"_id": 0})
    if not doc or doc.get("confirmation_sent"):
        return
    await db.orders.update_one({"id": doc["id"]}, {"$set": {"confirmation_sent": True}})
    emailer.schedule_order_confirmation(doc)


# ---------- Mollie payment webhook ----------
async def process_mollie_webhook(payment_id: str) -> dict:
    """Handle a Mollie webhook callback.

    Mollie only sends the payment ``id``; we fetch the authoritative payment
    from the Mollie API (using the live key) and update the matching order.
    We never trust a status sent in the request body.
    """
    if not payment_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Missing payment id.")
    if not mollie.is_configured():
        logger.error("Mollie webhook received but MOLLIE_API_KEY is not configured.")
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Payment provider not configured.")

    try:
        payment = await mollie.get_payment(payment_id)
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to fetch Mollie payment %s: %s", payment_id, exc)
        # Non-2xx makes Mollie retry later, which is the desired behaviour here.
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Could not verify payment with Mollie.")

    mollie_status = payment.get("status", "")
    order_status = mollie.map_status(mollie_status)
    order_id = (payment.get("metadata") or {}).get("order_id")

    query = {"id": order_id} if order_id else {"payment_id": payment_id}
    update = {"payment_status": mollie_status, "status": order_status}
    if mollie_status == "paid":
        update["paid_at"] = datetime.now(timezone.utc).isoformat()

    result = await db.orders.update_one(query, {"$set": update})
    if result.matched_count == 0:
        logger.warning(
            "Mollie webhook: no order matched payment %s (order_id=%s, status=%s)",
            payment_id, order_id, mollie_status,
        )
    else:
        logger.info("Mollie webhook: order %s -> %s (mollie=%s)", order_id, order_status, mollie_status)
        if mollie_status == "paid":
            await _send_confirmation_once(query)

    # Always 200 once handled so Mollie stops retrying.
    return {"status": "ok"}


@api_router.post("/webhook/mollie")
async def mollie_webhook(id: str = Form(default="")):
    return await process_mollie_webhook(id)


app.include_router(api_router)


# Bare path alias in case the ingress forwards non-/api paths to the backend.
@app.post("/webhook/mollie")
async def mollie_webhook_root(id: str = Form(default="")):
    return await process_mollie_webhook(id)

# Mount static product images under /api so K8s ingress routes to backend
STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(exist_ok=True)
app.mount("/api/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

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
