"""
Quiz Generation Service
========================
Generates MCQ quizzes from a topic or notes using OpenAI GPT.

Flow:
1. Receive topic + num_questions + difficulty from API
2. Build a structured prompt asking for JSON MCQ array
3. Call GPT, parse the JSON response
4. Return list of questions with options, answer, and explanation
"""
import logging
import os
import json
from typing import List, Dict, Any

from langchain_openai import ChatOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

if settings.OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

MAX_TOPIC_CHARS = 2000  # cap topic/notes length to keep tokens predictable


class QuizService:
    """Generates multiple-choice quizzes using GPT."""

    def __init__(self):
        self.llm = None
        self._initialize_llm()
        logger.info("QuizService initialized")

    def _initialize_llm(self):
        try:
            self.llm = ChatOpenAI(
                model=settings.OPENAI_MODEL_ID,
                temperature=0.7,   # slight creativity for varied questions
                max_tokens=1500    # enough for 10 detailed MCQs
            )
            logger.info(f"QuizService LLM: {settings.OPENAI_MODEL_ID}")
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {e}")
            raise

    async def generate_quiz(
        self,
        topic: str,
        num_questions: int = 5,
        difficulty: str = "Medium"
    ) -> List[Dict[str, Any]]:
        """
        Generate MCQ questions for a given topic.

        Args:
            topic: Topic name or pasted study notes
            num_questions: How many questions to generate (3–10)
            difficulty: Easy | Medium | Hard

        Returns:
            List of question dicts:
            {
              "question": str,
              "options": {"A": str, "B": str, "C": str, "D": str},
              "answer": "A" | "B" | "C" | "D",
              "explanation": str
            }
        """
        # Clamp inputs
        num_questions = max(3, min(10, num_questions))
        if difficulty not in ("Easy", "Medium", "Hard"):
            difficulty = "Medium"
        if len(topic) > MAX_TOPIC_CHARS:
            topic = topic[:MAX_TOPIC_CHARS] + "\n[truncated]"

        prompt = self._build_prompt(topic, num_questions, difficulty)

        logger.info(f"Generating {num_questions} {difficulty} MCQs for: {topic[:60]!r}")
        response = await self.llm.ainvoke(prompt)
        return self._parse_response(response.content.strip(), num_questions)

    def _build_prompt(self, topic: str, num_questions: int, difficulty: str) -> str:
        return f"""Generate exactly {num_questions} multiple-choice questions about the topic below.
Difficulty level: {difficulty}

Topic / Notes:
{topic}

Respond ONLY with a valid JSON array — no other text before or after.

[
  {{
    "question": "Clear question text ending with a question mark?",
    "options": {{"A": "option text", "B": "option text", "C": "option text", "D": "option text"}},
    "answer": "A",
    "explanation": "1-2 sentences explaining why the answer is correct."
  }}
]

Rules:
- Exactly 4 options per question (A, B, C, D)
- Only one correct answer per question
- answer field contains only the letter: A, B, C, or D
- Distractors (wrong options) should be plausible, not obviously wrong
- Easy: recall facts | Medium: understand concepts | Hard: apply or analyse
- JSON array only — no markdown, no commentary"""

    def _parse_response(self, text: str, expected: int) -> List[Dict[str, Any]]:
        try:
            start = text.find("[")
            end   = text.rfind("]") + 1
            if start == -1 or end == 0:
                raise ValueError("No JSON array in response")
            questions = json.loads(text[start:end])
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"JSON parse failed: {e} | raw: {text[:300]}")
            raise Exception("Failed to parse quiz from AI response. Please try again.")

        validated = []
        for q in questions:
            if not isinstance(q, dict):
                continue
            # Ensure required keys exist
            opts = q.get("options", {})
            if not all(k in opts for k in ("A", "B", "C", "D")):
                continue
            answer = str(q.get("answer", "")).strip().upper()
            if answer not in ("A", "B", "C", "D"):
                continue
            validated.append({
                "question":    str(q.get("question", "")).strip(),
                "options":     {k: str(v).strip() for k, v in opts.items()},
                "answer":      answer,
                "explanation": str(q.get("explanation", "")).strip(),
            })

        if not validated:
            raise Exception("AI returned no valid questions. Please try a different topic.")

        return validated


quiz_service = QuizService()
