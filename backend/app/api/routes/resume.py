"""
Resume Analysis API Routes
============================
This module defines the REST API endpoints for the AI resume analyzer.

Endpoints:
- POST /resume/analyze - Upload and analyze a resume
"""
import logging
import time
from fastapi import APIRouter, HTTPException, status, UploadFile, File
from app.services.resume_service import resume_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/analyze", response_model=dict, status_code=status.HTTP_200_OK)
async def analyze_resume(file: UploadFile = File(...)):
    """
    Analyze a resume and provide AI-powered feedback.

    This endpoint:
    1. Receives a resume file (PDF, DOC, or DOCX)
    2. Extracts text content from the file
    3. Uses Claude LLM to analyze the resume
    4. Returns structured analysis with ATS score, strengths, weaknesses, suggestions

    **Request:**
    - Multipart form data with file upload
    - Accepts: PDF, DOC, DOCX
    - Max size: 5MB

    **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "analysis": {
            "ats_score": 85,
            "strengths": [
                "Clear and concise summary",
                "Quantified achievements"
            ],
            "weaknesses": [
                "Missing relevant keywords",
                "Inconsistent formatting"
            ],
            "suggestions": [
                "Add more technical skills",
                "Include measurable results"
            ],
            "summary": "Overall strong resume with room for improvement...",
            "keywords": ["Python", "AWS", "Machine Learning"]
        },
        "metadata": {
            "filename": "resume.pdf",
            "file_size": 245678,
            "execution_time_ms": 3450.5
        }
    }
    ```

    **Error Response:**
    ```json
    {
        "success": false,
        "message": "Error message",
        "analysis": null
    }
    ```

    Args:
        file (UploadFile): The resume file to analyze

    Returns:
        dict: Analysis results with metadata

    Raises:
        HTTPException: For invalid file types or processing errors
    """
    start_time = time.time()

    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file uploaded"
            )

        # Check file extension
        allowed_extensions = ['.pdf', '.doc', '.docx']
        file_ext = file.filename.lower().split('.')[-1]
        if f'.{file_ext}' not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )

        # Read file content
        file_content = await file.read()

        # Check file size (5MB limit)
        max_size = 5 * 1024 * 1024
        if len(file_content) > max_size:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 5MB limit"
            )

        # Analyze resume
        logger.info(f"Analyzing resume: {file.filename}")
        analysis = await resume_service.analyze_resume(file_content, file.filename)

        execution_time_ms = (time.time() - start_time) * 1000

        return {
            "success": True,
            "analysis": analysis,
            "metadata": {
                "filename": file.filename,
                "file_size": len(file_content),
                "execution_time_ms": round(execution_time_ms, 2)
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Error analyzing resume: {e}")
        execution_time_ms = (time.time() - start_time) * 1000

        return {
            "success": False,
            "message": f"Failed to analyze resume: {str(e)}",
            "analysis": None,
            "metadata": {
                "filename": file.filename if file.filename else "unknown",
                "execution_time_ms": round(execution_time_ms, 2),
                "error": str(e)
            }
        }


@router.get("/health", status_code=status.HTTP_200_OK)
async def resume_health():
    """
    Health check for resume analysis service.

    Returns:
        dict: Service status
    """
    return {
        "status": "ok",
        "service": "resume-analyzer"
    }
