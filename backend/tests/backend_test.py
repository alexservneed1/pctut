"""
Backend API tests for ПК ТУТ (PK TUT) — landing site backend.
Tests: leads CRUD, admin auth, validation, openapi.
"""
import os
import re
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load frontend .env to get the public backend URL
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_TOKEN = "pktut2025admin"

VALID_SERVICES = [
    "сборка ПК",
    "апгрейд",
    "диагностика",
    "чистка",
    "установка Windows",
    "консультация",
]

created_lead_ids = []


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_api(api):
    s = requests.Session()
    s.headers.update({
        "Content-Type": "application/json",
        "X-Admin-Token": ADMIN_TOKEN,
    })
    return s



@pytest.fixture(scope="class")
def own_lead_id(api):
    """Create a dedicated lead for this class (xdist-safe, no cross-worker state)."""
    r = api.post(f"{BASE_URL}/api/leads", json={
        "name": "TEST_Patch Target",
        "phone": "9990001122",
        "service": "апгрейд",
        "comment": "patch target",
    }, timeout=15)
    assert r.status_code == 201, r.text
    return r.json()["id"]

# =========================================================
# Health / OpenAPI
# =========================================================
class TestHealthAndOpenAPI:
    def test_openapi_available(self, api):
        r = api.get(f"{BASE_URL}/api/openapi.json", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "openapi" in data
        assert "/api/leads" in data.get("paths", {})

    def test_health(self, api):
        r = api.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200, r.text
        assert r.json() == {"status": "healthy"}

    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# =========================================================
# POST /api/leads — creation & validation
# =========================================================
class TestLeadCreation:
    def test_create_lead_success(self, api):
        payload = {
            "name": "TEST_Иван Петров",
            "phone": "+7 (999) 123-45-67",
            "service": "сборка ПК",
            "comment": "Интересует сборка для игр.",
        }
        r = api.post(f"{BASE_URL}/api/leads", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["phone"] == payload["phone"]
        assert data["service"] == "сборка ПК"
        assert data["comment"] == payload["comment"]
        assert data["status"] == "new"
        # UUID validation
        assert isinstance(data["id"], str)
        assert re.match(r"^[0-9a-f-]{36}$", data["id"])
        # ISO datetime
        assert "T" in data["created_at"]
        created_lead_ids.append(data["id"])

    def test_create_lead_persists_and_retrievable_by_admin(self, api, admin_api):
        payload = {
            "name": "TEST_Persist Check",
            "phone": "89991112233",
            "service": "диагностика",
            "comment": "persistence",
        }
        r = api.post(f"{BASE_URL}/api/leads", json=payload, timeout=15)
        assert r.status_code == 201
        lead_id = r.json()["id"]
        created_lead_ids.append(lead_id)

        # Retrieve via admin list
        r2 = admin_api.get(f"{BASE_URL}/api/leads", timeout=15)
        assert r2.status_code == 200
        ids = [x["id"] for x in r2.json()]
        assert lead_id in ids

    def test_create_lead_all_services_valid(self, api):
        for svc in VALID_SERVICES:
            r = api.post(f"{BASE_URL}/api/leads", json={
                "name": f"TEST_{svc}",
                "phone": "9991234567",
                "service": svc,
                "comment": "",
            }, timeout=15)
            assert r.status_code == 201, f"{svc} failed: {r.text}"
            created_lead_ids.append(r.json()["id"])

    def test_reject_empty_name(self, api):
        r = api.post(f"{BASE_URL}/api/leads", json={
            "name": "",
            "phone": "+7 (999) 123-45-67",
            "service": "сборка ПК",
            "comment": "",
        }, timeout=15)
        assert r.status_code == 422, r.text

    def test_reject_whitespace_only_name(self, api):
        r = api.post(f"{BASE_URL}/api/leads", json={
            "name": "   ",
            "phone": "+7 (999) 123-45-67",
            "service": "сборка ПК",
            "comment": "",
        }, timeout=15)
        assert r.status_code == 422

    def test_reject_short_phone(self, api):
        r = api.post(f"{BASE_URL}/api/leads", json={
            "name": "TEST_short",
            "phone": "12345",
            "service": "сборка ПК",
            "comment": "",
        }, timeout=15)
        assert r.status_code == 422

    def test_reject_invalid_service(self, api):
        r = api.post(f"{BASE_URL}/api/leads", json={
            "name": "TEST_svc",
            "phone": "9991234567",
            "service": "неизвестная услуга",
            "comment": "",
        }, timeout=15)
        assert r.status_code == 422


# =========================================================
# GET /api/leads — admin auth
# =========================================================
class TestListLeads:
    def test_list_requires_token(self, api):
        r = api.get(f"{BASE_URL}/api/leads", timeout=15)
        assert r.status_code == 401

    def test_list_wrong_token(self, api):
        r = api.get(
            f"{BASE_URL}/api/leads",
            headers={"X-Admin-Token": "wrong"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_list_correct_token(self, admin_api):
        r = admin_api.get(f"{BASE_URL}/api/leads", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Check sorted newest first
        created_ats = [x["created_at"] for x in data]
        assert created_ats == sorted(created_ats, reverse=True)
        # ensure no mongo _id leaked
        for item in data:
            assert "_id" not in item


# =========================================================
# PATCH /api/leads/{id} — status update
# =========================================================
class TestPatchLead:
    def test_patch_requires_token(self, api, own_lead_id):
        lead_id = own_lead_id
        r = api.patch(
            f"{BASE_URL}/api/leads/{lead_id}",
            json={"status": "processed"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_patch_wrong_token(self, api, own_lead_id):
        lead_id = own_lead_id
        r = api.patch(
            f"{BASE_URL}/api/leads/{lead_id}",
            json={"status": "processed"},
            headers={"X-Admin-Token": "wrong"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_patch_toggle_new_to_processed_and_back(self, admin_api, own_lead_id):
        lead_id = own_lead_id

        r = admin_api.patch(
            f"{BASE_URL}/api/leads/{lead_id}",
            json={"status": "processed"},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "processed"
        assert "_id" not in r.json()

        r2 = admin_api.patch(
            f"{BASE_URL}/api/leads/{lead_id}",
            json={"status": "new"},
            timeout=15,
        )
        assert r2.status_code == 200
        assert r2.json()["status"] == "new"

    def test_patch_nonexistent_id(self, admin_api):
        r = admin_api.patch(
            f"{BASE_URL}/api/leads/nonexistent-id-xxx",
            json={"status": "processed"},
            timeout=15,
        )
        assert r.status_code == 404

    def test_patch_invalid_status(self, admin_api, own_lead_id):
        r = admin_api.patch(
            f"{BASE_URL}/api/leads/{own_lead_id}",
            json={"status": "archived"},
            timeout=15,
        )
        assert r.status_code == 422
