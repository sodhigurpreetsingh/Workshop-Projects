"""
API Router - Route Aggregation
================================
This module aggregates all API routes into a single router.

The router pattern allows:
- Organizing routes into logical groups (chat, auth, users, etc.)
- Keeping each route module focused and maintainable
- Easy addition of new route modules
- Centralized API structure

Current route modules:
- chat: RAG-based Q&A endpoints (/chat/ask, /chat/status, /chat/reload)
- resume: AI resume analysis endpoints (/resume/analyze)
"""
from fastapi import APIRouter
from app.api.routes import chat, resume

# =============================================================================
# Create Main API Router
# =============================================================================
# This router will be mounted in main.py at the API prefix (e.g., /api/v1)
api_router = APIRouter()

# =============================================================================
# Include Route Modules
# =============================================================================
# Each route module has its own prefix and tag for organization

# Chat Routes - RAG-based question answering
# Includes:
# - POST /chat/ask - Ask questions about PDF documents
# - GET /chat/status - Get system status
# - POST /chat/reload - Reload documents
# Mounted at: /api/v1/chat/* (when API prefix is /api/v1)
api_router.include_router(chat.router)

# Resume Routes - AI resume analysis
# Includes:
# - POST /resume/analyze - Upload and analyze resume
# - GET /resume/health - Health check
# Mounted at: /api/v1/resume/* (when API prefix is /api/v1)
api_router.include_router(resume.router)

# =============================================================================
# Health Check Endpoint
# =============================================================================
# Provide a health check at the API level
# This is separate from the root-level /health endpoint

@api_router.get("/health", tags=["health"])
async def health():
    """
    API-level health check endpoint.

    Returns a simple status to confirm the API router is working.

    This endpoint is accessible at: /api/v1/health
    (The root-level health check is at: /health)

    Returns:
        dict: Simple status response

    Example Response:
        {"status": "ok"}
    """
    return {"status": "ok"}


# =============================================================================
# How to Add New Route Modules
# =============================================================================
# 1. Create a new file in app/api/routes/ (e.g., users.py)
# 2. Define your routes with APIRouter in that file
# 3. Import the router here: from app.api.routes import users
# 4. Include it: api_router.include_router(users.router)
#
# Example:
#   from app.api.routes import chat, users, auth
#   api_router.include_router(chat.router)
#   api_router.include_router(users.router)
#   api_router.include_router(auth.router)
