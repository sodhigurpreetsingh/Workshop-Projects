"""
Quiz Generation API Routes
===========================
POST /quiz/generate  — generate MCQ questions from a topic or notes
GET  /quiz/health    — health check
"""
import logging
import time
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.quiz_service import quiz_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/quiz", tags=["quiz"])


class QuizRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=2000,
                       description="Topic name or pasted study notes")
    num_questions: int = Field(default=5, ge=3, le=10,
                               description="Number of MCQs to generate (3–10)")
    difficulty: str = Field(default="Medium",
                            description="Easy | Medium | Hard")


@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_quiz(body: QuizRequest):
    """
    Generate multiple-choice questions from a topic or study notes.

    Request body:
        topic (str): Topic name or pasted notes (3–2000 chars)
        num_questions (int): 3–10 questions (default 5)
        difficulty (str): Easy | Medium | Hard (default Medium)

    Success response:
        {
            "success": true,
            "questions": [
                {
                    "question": "...",
                    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
                    "answer": "B",
                    "explanation": "..."
                }
            ],
            "metadata": { "topic": "...", "num_questions": 5,
                          "difficulty": "Medium", "execution_time_ms": 2100 }
        }
    """
    start = time.time()
    try:
        questions = await quiz_service.generate_quiz(
            topic=body.topic,
            num_questions=body.num_questions,
            difficulty=body.difficulty,
        )
        return {
            "success": True,
            "questions": questions,
            "metadata": {
                "topic": body.topic[:80],
                "num_questions": len(questions),
                "difficulty": body.difficulty,
                "execution_time_ms": round((time.time() - start) * 1000, 2),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quiz generation failed: {e}")
        return {
            "success": False,
            "message": str(e),
            "questions": [],
        }


@router.get("/health", status_code=status.HTTP_200_OK)
async def quiz_health():
    return {"status": "ok", "service": "quiz-generator"}
