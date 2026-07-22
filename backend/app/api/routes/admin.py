"""
Admin Routes
============
Protected admin endpoints for managing the ChromaDB knowledge base.

All endpoints require the header:
    X-Admin-Pin: 2025cu

Endpoints:
    POST   /admin/add       — Add a new document
    DELETE /admin/delete    — Delete a document by doc_id
    GET    /admin/documents — List all documents
    POST   /admin/reload    — Reload txt files from disk into ChromaDB
    GET    /admin/status    — Get system status
"""
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.services.chat_service import chat_service

router = APIRouter(prefix="/admin", tags=["admin"])

# Hardcoded admin PIN (in production, move to environment variable)
ADMIN_PIN = "2025cu"

VALID_CATEGORIES = [
    "admissions",
    "placements",
    "programs",
    "fees",
    "scholarships",
    "hostel",
    "campus_life",
    "research",
    "general",
]


# =============================================================================
# Auth helper
# =============================================================================

def _verify_pin(x_admin_pin: Optional[str]) -> None:
    """Raise 401 if the PIN is missing or wrong."""
    if not x_admin_pin or x_admin_pin != ADMIN_PIN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin PIN. Provide 'X-Admin-Pin' header.",
        )


# =============================================================================
# Request / Response models
# =============================================================================

class AddDocumentRequest(BaseModel):
    title: str
    content: str
    category: str


class DeleteDocumentRequest(BaseModel):
    doc_id: str


# =============================================================================
# Endpoints
# =============================================================================

@router.post("/add", summary="Add a new document to the knowledge base")
async def add_document(
    body: AddDocumentRequest,
    x_admin_pin: Optional[str] = Header(default=None, alias="X-Admin-Pin"),
):
    """
    Add a new document to ChromaDB.

    The content is chunked, embedded, and stored.
    Returns the generated doc_id and number of chunks created.

    Requires header: X-Admin-Pin: 2025cu
    """
    _verify_pin(x_admin_pin)

    if body.category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid category '{body.category}'. Valid categories: {VALID_CATEGORIES}",
        )

    result = chat_service.add_document(
        title=body.title,
        content=body.content,
        category=body.category,
    )
    return result


@router.delete("/delete", summary="Delete a document from the knowledge base")
async def delete_document(
    body: DeleteDocumentRequest,
    x_admin_pin: Optional[str] = Header(default=None, alias="X-Admin-Pin"),
):
    """
    Delete all chunks associated with a doc_id.

    Returns success status and number of chunks deleted.

    Requires header: X-Admin-Pin: 2025cu
    """
    _verify_pin(x_admin_pin)

    result = chat_service.delete_document(doc_id=body.doc_id)
    return result


@router.get("/documents", summary="List all documents in the knowledge base")
async def list_documents(
    x_admin_pin: Optional[str] = Header(default=None, alias="X-Admin-Pin"),
):
    """
    Return a deduplicated list of all documents in ChromaDB.

    Each entry includes doc_id, title, category, and chunk_count.

    Requires header: X-Admin-Pin: 2025cu
    """
    _verify_pin(x_admin_pin)

    documents = chat_service.list_documents()
    return {"documents": documents, "total": len(documents)}


@router.post("/reload", summary="Reload txt files from disk into ChromaDB")
async def reload_documents(
    x_admin_pin: Optional[str] = Header(default=None, alias="X-Admin-Pin"),
):
    """
    Re-read all .txt files from app/documents/txts/ and upsert into ChromaDB.

    This is idempotent — re-running updates existing chunks without duplicating.

    Requires header: X-Admin-Pin: 2025cu
    """
    _verify_pin(x_admin_pin)

    result = chat_service.reload_documents()
    return result


@router.get("/status", summary="Get system status")
async def get_status(
    x_admin_pin: Optional[str] = Header(default=None, alias="X-Admin-Pin"),
):
    """
    Return current system status:
    - collection_name
    - num_documents (total chunks)
    - vector_store_initialized
    - embeddings_model
    - llm_model

    Requires header: X-Admin-Pin: 2025cu
    """
    _verify_pin(x_admin_pin)

    return chat_service.get_system_status()
