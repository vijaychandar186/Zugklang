from __future__ import annotations

import os

from prisma import Prisma

from config import settings


# Prisma resolves datasource URL from DATABASE_URL.
os.environ.setdefault("DATABASE_URL", settings.database_url)

db = Prisma()


async def connect_db() -> None:
    if not db.is_connected():
        await db.connect()


async def disconnect_db() -> None:
    if db.is_connected():
        await db.disconnect()
