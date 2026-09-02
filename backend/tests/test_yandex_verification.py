"""Yandex.Webmaster verification + regression smoke tests (ПК ТУТ landing)."""
import os
import subprocess

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL is missing")
BASE_URL = base_url.rstrip("/")

CODE = "f16f1f4b66bcd604"
ADMIN_TOKEN = "pktut2025admin"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"User-Agent": "Mozilla/5.0 (compatible; QA-Test)"})
    return s


# --- Yandex verification HTML file ---
class TestYandexFile:
    def test_file_served_200_with_verification_substring(self, client):
        r = client.get(f"{BASE_URL}/yandex_{CODE}.html", timeout=30)
        assert r.status_code == 200, f"status={r.status_code} body={r.text[:300]}"
        assert "text/html" in r.headers.get("Content-Type", "").lower(), r.headers.get("Content-Type")
        assert f"Verification: {CODE}" in r.text, r.text[:500]

    def test_file_is_not_spa_fallback(self, client):
        r = client.get(f"{BASE_URL}/yandex_{CODE}.html", timeout=30)
        assert r.status_code == 200
        assert '<div id="root"></div>' not in r.text, "SPA fallback intercepted the yandex file"
        assert 'http-equiv="Content-Type"' in r.text

    def test_wrong_code_file_is_not_served_as_verification(self, client):
        r = client.get(f"{BASE_URL}/yandex_deadbeefdeadbeef.html", timeout=30)
        assert f"Verification: {CODE}" not in r.text


# --- Yandex verification meta tag in index.html ---
class TestIndexMeta:
    def test_root_contains_yandex_meta(self, client):
        r = client.get(f"{BASE_URL}/", timeout=30)
        assert r.status_code == 200
        head = r.text.split("</head>")[0]
        assert f'<meta name="yandex-verification" content="{CODE}" />' in head, "yandex meta missing in <head>"

    def test_root_still_contains_google_meta(self, client):
        r = client.get(f"{BASE_URL}/", timeout=30)
        assert 'name="google-site-verification"' in r.text
        assert "lmxS65ya8GLQKtZHp6q1_GLYimDba0K1nPEfohpQetQ" in r.text


# --- Regression: routes & backend ---
class TestRegression:
    def test_admin_route_loads(self, client):
        r = client.get(f"{BASE_URL}/admin", timeout=30)
        assert r.status_code == 200
        assert '<div id="root"></div>' in r.text

    def test_api_health(self, client):
        r = client.get(f"{BASE_URL}/api/health", timeout=30)
        assert r.status_code == 200, r.text[:300]
        data = r.json()
        assert data.get("status") in ("ok", "healthy"), data

    def test_lead_create_and_cleanup(self, client):
        payload = {
            "name": "TEST_yandex_qa",
            "phone": "+7 999 000-11-22",
            "service": "консультация",
            "comment": "TEST_ automated smoke",
        }
        r = client.post(f"{BASE_URL}/api/leads", json=payload, timeout=30)
        assert r.status_code in (200, 201), f"{r.status_code} {r.text[:300]}"
        created = r.json()
        lead_id = created.get("id") or created.get("lead", {}).get("id")
        assert lead_id, created

        # verify persistence via admin list
        lst = client.get(f"{BASE_URL}/api/leads", headers={"X-Admin-Token": ADMIN_TOKEN}, timeout=30)
        assert lst.status_code == 200, lst.text[:300]
        items = lst.json()
        if isinstance(items, dict):
            items = items.get("leads", items.get("items", []))
        found = [i for i in items if i.get("id") == lead_id]
        assert found, "created lead not returned by GET /api/leads"
        assert found[0]["name"] == payload["name"]
        assert "_id" not in found[0], "MongoDB _id leaked in response"


@pytest.fixture(scope="module", autouse=True)
def cleanup_test_leads():
    """No public DELETE endpoint exists; clean TEST_ leads directly in Mongo."""
    yield
    subprocess.run(["python", "/app/tests/cleanup_leads.py"], check=False, capture_output=True)
