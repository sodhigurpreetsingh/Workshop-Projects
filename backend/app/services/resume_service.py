"""
Resume Analysis Service
========================
AI-powered resume analysis using OpenAI GPT.
Extracts text from PDF/DOCX, sends to GPT, returns structured feedback.
"""
import logging
import os
import io
import json
from typing import Dict, Any

from langchain_openai import ChatOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

if settings.OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

# Truncate resume text to ~3000 chars before sending to the LLM — keeps
# token usage predictable and avoids hitting context limits on large PDFs.
MAX_RESUME_CHARS = 3000


class ResumeService:
    """AI-powered resume analysis: extract text → GPT analysis → structured feedback."""

    def __init__(self):
        self.llm = None
        self._initialize_llm()
        logger.info("ResumeService initialized")

    def _initialize_llm(self):
        try:
            self.llm = ChatOpenAI(
                model=settings.OPENAI_MODEL_ID,
                temperature=0.3,   # lower = more consistent, factual output
                max_tokens=800     # sufficient for structured JSON feedback
            )
            logger.info(f"GPT LLM initialized: {settings.OPENAI_MODEL_ID}")
        except Exception as e:
            logger.error(f"Failed to initialize GPT LLM: {e}")
            raise

    def _extract_text_from_pdf(self, file_content: bytes) -> str:
        try:
            import PyPDF2
            reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
        except ImportError:
            raise Exception("PyPDF2 not installed. Run: pip install PyPDF2")
        except Exception as e:
            raise Exception(f"Failed to read PDF: {e}")

    def _extract_text_from_docx(self, file_content: bytes) -> str:
        try:
            import docx
            doc = docx.Document(io.BytesIO(file_content))
            return "\n".join(p.text for p in doc.paragraphs).strip()
        except ImportError:
            raise Exception("python-docx not installed. Run: pip install python-docx")
        except Exception as e:
            raise Exception(f"Failed to read DOCX: {e}")

    def _extract_text(self, file_content: bytes, filename: str) -> str:
        ext = filename.lower().rsplit(".", 1)[-1]
        if ext == "pdf":
            return self._extract_text_from_pdf(file_content)
        elif ext == "docx":
            return self._extract_text_from_docx(file_content)
        elif ext == "doc":
            raise Exception("Legacy .doc format is not supported. Please convert to .docx or .pdf.")
        raise Exception(f"Unsupported file format: .{ext}")

    async def analyze_resume(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Extract text from resume file and return GPT analysis."""
        logger.info(f"Extracting text from {filename}")
        resume_text = self._extract_text(file_content, filename)

        if len(resume_text.strip()) < 50:
            raise Exception("Could not extract enough text. The file may be empty, image-based, or corrupted.")

        # Truncate to keep token usage bounded
        if len(resume_text) > MAX_RESUME_CHARS:
            resume_text = resume_text[:MAX_RESUME_CHARS] + "\n[truncated]"

        prompt = self._build_prompt(resume_text)

        logger.info("Sending resume to GPT for analysis")
        # Use ainvoke since this runs inside an async FastAPI route
        response = await self.llm.ainvoke(prompt)
        return self._parse_response(response.content.strip())

    def _build_prompt(self, resume_text: str) -> str:
        return f"""You are a professional resume reviewer. Analyze the resume below and respond ONLY with a valid JSON object — no extra text.

Resume:
{resume_text}

JSON format:
{{
  "ats_score": <integer 0–100>,
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "suggestions": ["...", "...", "..."],
  "summary": "2–3 sentence overall assessment",
  "keywords": ["skill1", "skill2", "skill3", "skill4", "skill5"]
}}

Rules:
- ats_score: ATS compatibility (standard headings, keywords, clean format)
- strengths / weaknesses / suggestions: 3–4 items each, concise and specific
- keywords: 5–8 skills or qualifications found in the resume
- Respond with JSON only."""

    def _parse_response(self, text: str) -> Dict[str, Any]:
        try:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start == -1 or end == 0:
                raise ValueError("No JSON in response")
            result = json.loads(text[start:end])
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"JSON parse failed: {e} | raw: {text[:200]}")
            result = {}

        defaults = {
            "ats_score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "summary": "Analysis could not be completed. Please try again.",
            "keywords": [],
        }
        for key, default in defaults.items():
            result.setdefault(key, default)

        result["ats_score"] = max(0, min(100, int(result["ats_score"])))
        return result


resume_service = ResumeService()
