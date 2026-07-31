from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.compliance import router as compliance_router
from app.api.health import router as health_router
from app.api.documents import router as documents_router
from app.api.recommendations import router as recommendations_router
from app.api.shipments import router as shipments_router
from app.database import Base, engine
from app.models.document import Document
from app.models.shipment import Shipment


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Create database tables after all model mappings are registered."""

    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="ExportPilot API",
    version="0.1.0",
    description="Backend foundation for ExportPilot AI.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(shipments_router)
app.include_router(documents_router)
app.include_router(compliance_router)
app.include_router(recommendations_router)
