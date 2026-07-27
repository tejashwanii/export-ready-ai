from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/", summary="Backend status")
def root() -> dict[str, str]:
    return {"message": "ExportPilot Backend Running"}


@router.get("/health", summary="Health check")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}
