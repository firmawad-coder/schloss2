"""Backend API tests for LUXÉLLE - brands, products, newsletter."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://perfume-luxelle.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ---------- Brands ----------
class TestBrands:
    def test_get_brands_returns_4(self):
        r = requests.get(f"{API}/brands", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 4
        names = {b["name"] for b in data}
        assert names == {
            "Doctor Babor", "Mesoestetic",
            "Boadicea the Victorious", "Fragrance Du Bois",
        }
        for b in data:
            for key in ("id", "name", "tagline", "image", "slug"):
                assert key in b and b[key]


# ---------- Products ----------
class TestProducts:
    def test_get_all_products(self):
        r = requests.get(f"{API}/products", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 8
        # validate shape
        p = data[0]
        for key in ("id", "name", "brand", "category", "price", "image"):
            assert key in p

    def test_get_new_products(self):
        r = requests.get(f"{API}/products", params={"filter": "new"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        assert all(p["is_new"] is True for p in data)

    def test_get_bestseller_products(self):
        r = requests.get(f"{API}/products", params={"filter": "bestseller"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        assert all(p["is_bestseller"] is True for p in data)


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe_valid_email(self):
        email = f"test_{uuid.uuid4().hex[:8]}@luxelle-test.com"
        r = requests.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "subscribed"
        assert "message" in data

    def test_subscribe_duplicate_email(self):
        email = f"dup_{uuid.uuid4().hex[:8]}@luxelle-test.com"
        r1 = requests.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r1.status_code == 200
        assert r1.json()["status"] == "subscribed"
        r2 = requests.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["status"] == "already_subscribed"

    def test_subscribe_invalid_email(self):
        r = requests.post(f"{API}/newsletter", json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 422
