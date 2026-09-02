"""Cleanup helper: removes QA-created leads (TEST_* prefix and 'Metrika QA')."""
import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(__file__).resolve().parents[1] / "backend" / ".env")


async def main():
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]
    res = await db.leads.delete_many(
        {"$or": [{"name": {"$regex": "^TEST_"}}, {"name": "Metrika QA"}]}
    )
    print("deleted:", res.deleted_count)
    print("remaining:", await db.leads.count_documents({}))
    client.close()


asyncio.run(main())
