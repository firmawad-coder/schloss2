"""Beauty Am Schloss backend API tests"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://perfume-luxelle.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Brands ----------
class TestBrands:
    def test_brands_fragrance(self, client):
        r = client.get(f"{API}/brands", params={"category": "fragrance"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 4
        names = sorted([b["name"] for b in data])
        assert names == sorted([
            "Boadicea the Victorious",
            "Fragrance Du Bois",
            "Roja Parfums",
            "Xerjoff",
        ])
        for b in data:
            assert b["category"] == "fragrance"
            assert all(k in b for k in ["id", "name", "house", "tagline", "origin", "established", "image", "slug"])

    def test_brands_skincare(self, client):
        r = client.get(f"{API}/brands", params={"category": "skincare"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 2
        names = sorted([b["name"] for b in data])
        assert names == ["Doctor Babor", "Mesoestetic"]

    def test_brands_all(self, client):
        r = client.get(f"{API}/brands")
        assert r.status_code == 200
        assert len(r.json()) == 6


# ---------- Products ----------
class TestProducts:
    def test_products_fragrance(self, client):
        r = client.get(f"{API}/products", params={"category": "fragrance"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 8
        for p in data:
            assert p["category"] == "fragrance"
            assert p["price"] > 0
            assert isinstance(p.get("notes", []), list)

    def test_products_skincare(self, client):
        r = client.get(f"{API}/products", params={"category": "skincare"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        for p in data:
            assert p["category"] == "skincare"

    def test_products_bestseller_fragrance(self, client):
        r = client.get(f"{API}/products", params={"filter": "bestseller", "category": "fragrance"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for p in data:
            assert p["is_bestseller"] is True
            assert p["category"] == "fragrance"

    def test_products_new_fragrance(self, client):
        r = client.get(f"{API}/products", params={"filter": "new", "category": "fragrance"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for p in data:
            assert p["is_new"] is True
            assert p["category"] == "fragrance"


# ---------- Reviews ----------
class TestReviews:
    def test_reviews(self, client):
        r = client.get(f"{API}/reviews")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3
        for rev in data:
            for k in ["author", "city", "rating", "title", "text", "product"]:
                assert k in rev
            assert 1 <= rev["rating"] <= 5


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe_valid(self, client):
        email = f"bas_{uuid.uuid4().hex[:8]}@test-bas.com"
        r = client.post(f"{API}/newsletter", json={"email": email})
        assert r.status_code == 200
        body = r.json()
        assert body["status"] == "subscribed"

    def test_subscribe_duplicate(self, client):
        email = f"bas_dup_{uuid.uuid4().hex[:8]}@test-bas.com"
        r1 = client.post(f"{API}/newsletter", json={"email": email})
        assert r1.status_code == 200
        assert r1.json()["status"] == "subscribed"
        r2 = client.post(f"{API}/newsletter", json={"email": email})
        assert r2.status_code == 200
        assert r2.json()["status"] == "already_subscribed"

    def test_subscribe_invalid(self, client):
        r = client.post(f"{API}/newsletter", json={"email": "not-an-email"})
        assert r.status_code == 422
