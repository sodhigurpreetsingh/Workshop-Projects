"""
Chat API Routes - RAG-based Q&A System
=======================================
This module defines the REST API endpoints for the RAG chat system.

Endpoints:
- POST /chat/ask - Main endpoint to ask questions about PDF documents
- GET /chat/status - Get system status and configuration
- POST /chat/reload - Reload documents and rebuild vector store
"""
import logging
import time
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, field_validator
from app.services.chat_service import chat_service

# Initialize logger for this module
logger = logging.getLogger(__name__)


# =============================================================================
# Request/Response Models
# =============================================================================

class ChatRequest(BaseModel):
    """
    Request model for RAG-based chat questions.

    Attributes:
        question (str): The user's question about the PDF documents
                       Must be between 3-1000 characters

    Example:
        {
            "question": "What is the company's mission statement?"
        }
    """
    question: str

    @field_validator('question')
    @classmethod
    def validate_question(cls, v: str) -> str:
        """
        Validate the question field.

        Ensures:
        1. Question is not empty (after trimming whitespace)
        2. Minimum length of 3 characters (prevents "?" or "hi")
        3. Maximum length of 1000 characters (prevents abuse)

        Args:
            v (str): The question string to validate

        Returns:
            str: The validated and trimmed question

        Raises:
            ValueError: If validation fails
        """
        # Remove leading/trailing whitespace
        v = v.strip()

        # Check minimum length
        if len(v) < 3:
            raise ValueError('Question must be at least 3 characters')

        # Check maximum length
        if len(v) > 1000:
            raise ValueError('Question must be at most 1000 characters')

        return v


# =============================================================================
# Router Setup
# =============================================================================
# Create an API router with prefix "/chat" and tag for documentation
router = APIRouter(prefix="/chat", tags=["chat"])


# =============================================================================
# Endpoints
# =============================================================================

@router.post("/ask", response_model=dict, status_code=status.HTTP_200_OK)
async def ask(body: ChatRequest):
    """
    Ask a question and get an AI-generated answer based on PDF documents.

    This is the main RAG endpoint. It:
    1. Receives a question from the user
    2. Searches for relevant content in indexed PDF documents
    3. Uses Claude LLM to generate an answer based on retrieved context
    4. Returns the answer with source citations

    **Request Body:**
    ```json
    {
        "question": "What products does the company offer?"
    }
    ```

    **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "answer": "The company offers three main products: AI Assistant Pro...",
        "sources": [
            {
                "file": "/path/to/product_catalog.pdf",
                "page": 0,
                "content_preview": "Product Catalog 2024..."
            }
        ],
        "context_used": "Relevant context that was used...",
        "metadata": {
            "original_question": "What products does the company offer?",
            "execution_time_ms": 2450.5,
            "num_sources": 3
        }
    }
    ```

    **Error Response:**
    ```json
    {
        "success": false,
        "answer": "Error message explaining what went wrong",
        "sources": [],
        "context_used": "",
        "metadata": {
            "original_question": "...",
            "execution_time_ms": 10.5,
            "error": "Detailed error message"
        }
    }
    ```

    Args:
        body (ChatRequest): Request containing the question

    Returns:
        dict: Response with answer, sources, and metadata

    Raises:
        HTTPException: If there's a critical error (re-raised from service)
    """
    # Track execution time for performance monitoring
    start_time = time.time()

    try:
        # =====================================================================
        # Process Question Through RAG Pipeline
        # =====================================================================
        # Call the chat service to:
        # 1. Retrieve relevant document chunks
        # 2. Generate answer using Claude LLM
        # 3. Return answer with source citations
        result = chat_service.answer_question(question=body.question)

        # Calculate total execution time in milliseconds
        execution_time_ms = (time.time() - start_time) * 1000

        # =====================================================================
        # Return Success Response
        # =====================================================================
        return {
            "success": True,
            "answer": result["answer"],                    # AI-generated answer
            "sources": result.get("sources", []),          # Source documents with citations
            "context_used": result.get("context_used", ""),  # Context provided to LLM
            "metadata": {
                "original_question": body.question,        # Echo back the question
                "execution_time_ms": round(execution_time_ms, 2),  # Performance metric
                "num_sources": len(result.get("sources", []))      # Number of sources used
            }
        }

    except HTTPException:
        # Re-raise HTTP exceptions (don't catch and modify)
        raise

    except Exception as e:
        # =====================================================================
        # Handle Unexpected Errors
        # =====================================================================
        # Log the error for debugging
        logger.error(f"Error processing question: {e}")

        # Calculate execution time even for errors
        execution_time_ms = (time.time() - start_time) * 1000

        # Return error response (user-friendly message)
        return {
            "success": False,
            "answer": f"I encountered an error while processing your question: {str(e)}",
            "sources": [],
            "context_used": "",
            "metadata": {
                "original_question": body.question,
                "execution_time_ms": round(execution_time_ms, 2),
                "error": str(e)  # Include error details for debugging
            }
        }


@router.get("/status", status_code=status.HTTP_200_OK)
async def get_status():
    """
    Get the current status and configuration of the RAG system.

    Useful for:
    - Health checks
    - Debugging issues
    - Monitoring system state
    - Verifying documents are loaded

    **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "pdf_directory": "/path/to/pdfs",
        "num_pdfs": 3,
        "pdf_files": ["doc1.pdf", "doc2.pdf", "doc3.pdf"],
        "vector_store_initialized": true,
        "embeddings_model": "amazon.titan-embed-text-v1",
        "llm_model": "us.anthropic.claude-haiku-4-5-20251001-v1:0"
    }
    ```

    Returns:
        dict: System status and configuration information

    Raises:
        HTTPException: If unable to retrieve status (500 Internal Server Error)
    """
    try:
        # Get status from chat service
        status_info = chat_service.get_system_status()

        # Return status with success flag
        return {
            "success": True,
            **status_info  # Unpack all status fields
        }

    except Exception as e:
        # Log error and return 500 status code
        logger.error(f"Error getting system status: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/reload", status_code=status.HTTP_200_OK)
async def reload_documents():
    """
    Reload all PDF documents and rebuild the vector store.

    Use this endpoint when:
    - You've added new PDF files to the documents directory
    - You've updated existing PDF files
    - You want to refresh the document index

    This will:
    1. Re-scan the PDF directory
    2. Load all PDF files
    3. Split documents into chunks
    4. Generate new embeddings
    5. Rebuild the FAISS vector store

    **Note:** This operation can take several seconds depending on the number
    and size of documents. The system will be unavailable during reload.

    **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "message": "Documents reloaded successfully",
        "pdf_directory": "/path/to/pdfs",
        "num_pdfs": 5,
        "pdf_files": ["doc1.pdf", "doc2.pdf", ...],
        "vector_store_initialized": true,
        "embeddings_model": "amazon.titan-embed-text-v1",
        "llm_model": "us.anthropic.claude-haiku-4-5-20251001-v1:0"
    }
    ```

    Returns:
        dict: Success message and updated system status

    Raises:
        HTTPException: If reload fails (500 Internal Server Error)
    """
    try:
        # Trigger document reload in chat service
        result = chat_service.reload_documents()

        # Return success response with updated status
        return {
            "success": True,
            **result  # Includes message and system status
        }

    except Exception as e:
        # Log error and return 500 status code
        logger.error(f"Error reloading documents: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
