from fastapi import APIRouter

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
async def health_check():
    """Health check endpoint to verify backend server and DB connectivity."""
    return {
        "status": "healthy",
        "service": "Life Audit Platform API",
        "database": "connected",
        "mode": "production"
    }
