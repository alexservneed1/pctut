from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional, Literal
import uuid
import re
import httpx
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Admin token for protected endpoints
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'pktut2025admin')

# --------------------------------------------------------------------------
# VK notification (OPTIONAL)
# --------------------------------------------------------------------------
# To enable VK message notifications for new leads:
#   1. Create a VK community, generate a community token with "messages" scope.
#   2. Set env vars in backend/.env:
#         VK_TOKEN=<your community token>
#         VK_PEER_ID=<user or chat id where messages should be sent>
#      (VK_API_VERSION is optional, defaults to 5.199)
#   3. Restart backend (sudo supervisorctl restart backend).
# If VK_TOKEN or VK_PEER_ID is not set, notifications are silently skipped.
# Failure of the VK API call NEVER breaks the lead-creation flow.
# --------------------------------------------------------------------------
VK_TOKEN = os.environ.get('VK_TOKEN', '')
VK_PEER_ID = os.environ.get('VK_PEER_ID', '')
VK_API_VERSION = os.environ.get('VK_API_VERSION', '5.199')

# Create the main app - expose OpenAPI at /api/openapi.json for QA tooling
app = FastAPI(
    title="ПК ТУТ API",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

api_router = APIRouter(prefix="/api")


# ============================================================
# Models
# ============================================================

SERVICE_OPTIONS = [
    "сборка ПК",
    "апгрейд",
    "диагностика",
    "чистка",
    "установка Windows",
    "консультация",
]

LeadService = Literal[
    "сборка ПК",
    "апгрейд",
    "диагностика",
    "чистка",
    "установка Windows",
    "консультация",
]

LeadStatus = Literal["new", "processed"]


class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str = Field(..., min_length=1, max_length=120)
    phone: str = Field(..., min_length=1, max_length=40)
    service: LeadService
    comment: Optional[str] = Field(default="", max_length=2000)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Имя обязательно")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        digits = re.sub(r"\D", "", v)
        if len(digits) < 10:
            raise ValueError("Некорректный номер телефона")
        return v

    @field_validator("comment")
    @classmethod
    def normalize_comment(cls, v: Optional[str]) -> str:
        return (v or "").strip()


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    service: LeadService
    comment: str = ""
    status: LeadStatus = "new"
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class LeadStatusUpdate(BaseModel):
    status: LeadStatus


# ============================================================
# Helpers
# ============================================================

async def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Недействительный токен администратора")
    return True


async def send_vk_notification(lead: Lead) -> None:
    """Send VK message notification. Silently skips if credentials missing.
    Never raises — failure must not break the API response."""
    if not VK_TOKEN or not VK_PEER_ID:
        return
    try:
        text = (
            "Новая заявка ПК ТУТ\n"
            f"Имя: {lead.name}\n"
            f"Телефон: {lead.phone}\n"
            f"Услуга: {lead.service}\n"
            f"Комментарий: {lead.comment or '—'}\n"
            f"Дата: {lead.created_at}"
        )
        async with httpx.AsyncClient(timeout=8.0) as http:
            resp = await http.post(
                "https://api.vk.com/method/messages.send",
                data={
                    "peer_id": VK_PEER_ID,
                    "message": text,
                    "random_id": 0,
                    "access_token": VK_TOKEN,
                    "v": VK_API_VERSION,
                },
            )
            logger.info("VK notify status=%s body=%s", resp.status_code, resp.text[:200])
    except Exception as e:  # noqa: BLE001
        logger.warning("VK notification failed (ignored): %s", e)


# ============================================================
# Routes
# ============================================================

@api_router.get("/")
async def root():
    return {"message": "ПК ТУТ API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    await db.leads.insert_one(doc)
    # Fire-and-forget-style VK notification (awaited but errors swallowed)
    await send_vk_notification(lead)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(_: bool = Depends(require_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.patch("/leads/{lead_id}", response_model=Lead)
async def update_lead_status(
    lead_id: str,
    payload: LeadStatusUpdate,
    _: bool = Depends(require_admin),
):
    result = await db.leads.find_one_and_update(
        {"id": lead_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    return result


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
