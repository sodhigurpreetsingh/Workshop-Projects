"""
Resume Analysis Service
========================
This module implements AI-powered resume analysis using OpenAI GPT LLM.

Features:
- Text extraction from PDF, DOC, DOCX files
- AI-powered resume analysis
- ATS score calculation
- Strengths and weaknesses identification
- Actionable suggestions for improvement
"""
import logging
import os
import io
import json
from typing import Dict, Any
from pathlib import Path

from langchain_openai import ChatOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

# Set OpenAI API key
if settings.OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY


class ResumeService:
    """
    AI-powered Resume Analysis Service using OpenAI GPT.

    This service handles:
    - Text extraction from various file formats
    - Resume analysis using GPT LLM
    - Structured feedback generation
    """

    def __init__(self):
        """Initialize the resume analysis service."""
        self.llm = None
        self._initialize_llm()
        logger.info("ResumeService initialized")

    def _initialize_llm(self):
        """
        Initialize GPT LLM for resume analysis.

        Raises:
            Exception: If OpenAI initialization fails
        """
        try:
            self.llm = ChatOpenAI(
                model=settings.OPENAI_MODEL_ID,
                temperature=0.5,
                max_tokens=3000
            )
            logger.info(f"GPT LLM initialized: {settings.OPENAI_MODEL_ID}")
        except Exception as e:
            logger.error(f"Failed to initialize GPT LLM: {e}")
            raise

    def _extract_text_from_pdf(self, file_content: bytes) -> str:
        """
        Extract text from PDF file.

        Args:
            file_content (bytes): PDF file content

        Returns:
            str: Extracted text

        Raises:
            Exception: If PDF extraction fails
        """
        try:
            import PyPDF2
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"

            return text.strip()
        except ImportError:
            raise Exception("PyPDF2 is required for PDF processing. Install it with: pip install PyPDF2")
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    def _extract_text_from_docx(self, file_content: bytes) -> str:
        """
        Extract text from DOCX file.

        Args:
            file_content (bytes): DOCX file content

        Returns:
            str: Extracted text

        Raises:
            Exception: If DOCX extraction fails
        """
        try:
            import docx
            doc_file = io.BytesIO(file_content)
            doc = docx.Document(doc_file)

            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"

            return text.strip()
        except ImportError:
            raise Exception("python-docx is required for DOCX processing. Install it with: pip install python-docx")
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {e}")
            raise Exception(f"Failed to extract text from DOCX: {str(e)}")

    def _extract_text_from_doc(self, file_content: bytes) -> str:
        """
        Extract text from DOC file.

        Note: DOC format is legacy and harder to parse. This is a basic implementation.

        Args:
            file_content (bytes): DOC file content

        Returns:
            str: Extracted text

        Raises:
            Exception: If DOC extraction fails
        """
        raise Exception("Legacy .doc format is not fully supported. Please convert to .docx or .pdf format.")

    def _extract_text(self, file_content: bytes, filename: str) -> str:
        """
        Extract text from resume file based on extension.

        Args:
            file_content (bytes): File content
            filename (str): Original filename

        Returns:
            str: Extracted text content

        Raises:
            Exception: If text extraction fails
        """
        file_ext = filename.lower().split('.')[-1]

        if file_ext == 'pdf':
            return self._extract_text_from_pdf(file_content)
        elif file_ext == 'docx':
            return self._extract_text_from_docx(file_content)
        elif file_ext == 'doc':
            return self._extract_text_from_doc(file_content)
        else:
            raise Exception(f"Unsupported file format: {file_ext}")

    async def analyze_resume(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Analyze a resume using GPT LLM.

        Args:
            file_content (bytes): Resume file content
            filename (str): Original filename

        Returns:
            Dict[str, Any]: Structured analysis containing:
                - ats_score (int): ATS compatibility score (0-100)
                - strengths (list): List of strengths
                - weaknesses (list): List of weaknesses
                - suggestions (list): Actionable improvement suggestions
                - summary (str): Overall summary
                - keywords (list): Key skills and keywords found

        Raises:
            Exception: If analysis fails
        """
        try:
            # Extract text from resume
            logger.info(f"Extracting text from {filename}")
            resume_text = self._extract_text(file_content, filename)

            if not resume_text or len(resume_text.strip()) < 50:
                raise Exception("Could not extract sufficient text from resume. The file may be empty or corrupted.")

            # Create analysis prompt
            prompt = self._create_analysis_prompt(resume_text)

            # Get analysis from GPT
            logger.info("Analyzing resume with GPT LLM")
            response = self.llm.invoke(prompt)
            analysis_text = response.content.strip()

            # Parse the structured response
            analysis = self._parse_analysis(analysis_text)

            return analysis

        except Exception as e:
            logger.error(f"Error analyzing resume: {e}")
            raise

    def _create_analysis_prompt(self, resume_text: str) -> str:
        """
        Create a structured prompt for resume analysis.

        Args:
            resume_text (str): Extracted resume text

        Returns:
            str: Formatted prompt for GPT
        """
        prompt = f"""You are an expert resume analyst and career coach. Analyze the following resume and provide detailed feedback.

Resume Content:
{resume_text}

Please analyze this resume and provide your response in the following JSON format:
{{
    "ats_score": <number between 0-100>,
    "strengths": [
        "strength 1",
        "strength 2",
        "strength 3"
    ],
    "weaknesses": [
        "weakness 1",
        "weakness 2",
        "weakness 3"
    ],
    "suggestions": [
        "suggestion 1",
        "suggestion 2",
        "suggestion 3"
    ],
    "summary": "A comprehensive summary of the resume analysis",
    "keywords": ["keyword1", "keyword2", "keyword3"]
}}

Analysis Guidelines:
1. ATS Score: Rate the resume's compatibility with Applicant Tracking Systems (0-100). Consider:
   - Use of standard section headings
   - Keyword optimization
   - Format compatibility
   - Clear structure

2. Strengths: Identify 3-5 strong points such as:
   - Clear achievements with quantifiable results
   - Relevant skills and experience
   - Professional formatting
   - Strong action verbs

3. Weaknesses: Identify 3-5 areas that need improvement:
   - Missing information
   - Formatting issues
   - Lack of quantifiable achievements
   - Unclear descriptions

4. Suggestions: Provide 3-5 actionable recommendations:
   - Specific changes to make
   - Content to add or modify
   - Formatting improvements

5. Summary: Write a 2-3 sentence overall assessment

6. Keywords: Extract 5-10 key skills, technologies, or qualifications found in the resume

Respond ONLY with valid JSON. Do not include any text before or after the JSON object."""

        return prompt

    def _parse_analysis(self, analysis_text: str) -> Dict[str, Any]:
        """
        Parse the LLM response into structured data.

        Args:
            analysis_text (str): Raw response from GPT

        Returns:
            Dict[str, Any]: Parsed analysis

        Raises:
            Exception: If parsing fails
        """
        try:
            # Try to find JSON in the response
            start_idx = analysis_text.find('{')
            end_idx = analysis_text.rfind('}') + 1

            if start_idx == -1 or end_idx == 0:
                raise Exception("No JSON found in response")

            json_str = analysis_text[start_idx:end_idx]
            analysis = json.loads(json_str)

            # Validate required fields
            required_fields = ['ats_score', 'strengths', 'weaknesses', 'suggestions', 'summary', 'keywords']
            for field in required_fields:
                if field not in analysis:
                    logger.warning(f"Missing field in analysis: {field}")
                    if field == 'ats_score':
                        analysis[field] = 0
                    elif field == 'summary':
                        analysis[field] = "Analysis completed"
                    else:
                        analysis[field] = []

            # Ensure ats_score is an integer between 0-100
            analysis['ats_score'] = max(0, min(100, int(analysis['ats_score'])))

            return analysis

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from LLM response: {e}")
            logger.error(f"Response text: {analysis_text}")

            # Return a basic analysis if parsing fails
            return {
                "ats_score": 50,
                "strengths": ["Resume received successfully"],
                "weaknesses": ["Could not perform detailed analysis"],
                "suggestions": ["Please try uploading again or contact support"],
                "summary": "Analysis could not be completed. Please try again.",
                "keywords": []
            }


# Create singleton instance
resume_service = ResumeService()
