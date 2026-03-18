# AI Resume Analyzer - Complete Guide

## Overview

The AI Resume Analyzer is a full-stack application that provides AI-powered resume analysis using AWS Bedrock Claude LLM. Users can upload their resume (PDF, DOC, or DOCX) and receive instant feedback including:

- **ATS Compatibility Score** (0-100)
- **Strengths** - What's working well in the resume
- **Weaknesses** - Areas that need improvement
- **Suggestions** - Actionable recommendations
- **Summary** - Overall assessment
- **Keywords** - Key skills and technologies identified

## Project Structure

```
resume-analyzer/               # Frontend (Vue.js)
├── src/
│   ├── components/
│   │   └── ResumeAnalyzer.vue  # Main component
│   ├── utils/
│   │   └── my-axios.js         # API client
│   ├── App.vue
│   └── main.js
├── index.html
└── package.json

../backend/                    # Backend (FastAPI)
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── chat.py         # Existing RAG chat routes
│   │       └── resume.py       # NEW: Resume analysis routes
│   ├── services/
│   │   ├── chat_service.py     # Existing RAG service
│   │   └── resume_service.py   # NEW: Resume analysis service
│   └── main.py
└── requirements.txt
```

## Features

### Frontend
- Modern, responsive Vue 3 UI
- Drag & drop file upload
- File validation (PDF, DOC, DOCX, max 5MB)
- Real-time analysis progress indicator
- Beautiful results display with:
  - Color-coded ATS score
  - Categorized feedback sections
  - Keyword tags
  - Professional styling

### Backend
- FastAPI REST API
- AWS Bedrock Claude integration
- Text extraction from PDF/DOCX files
- Structured AI analysis
- Error handling and validation

## Setup Instructions

### 1. Backend Setup

```bash
cd /Users/momentum/PROJECTS/llm-lecture/Day3/projects/backend

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (.env file should already exist)
# Ensure these are set:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_REGION
# - BEDROCK_MODEL_ID

# Start the backend server
./start_backend.sh
# OR
uvicorn app.main:app --reload --port 8000
```

The backend will be available at: `http://localhost:8000`

### 2. Frontend Setup

```bash
cd /Users/momentum/PROJECTS/llm-lecture/Day3/projects/resume-analyzer

# Install dependencies (already installed)
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## API Endpoints

### Resume Analysis

**POST** `/api/v1/resume/analyze`

Upload and analyze a resume file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (PDF, DOC, or DOCX)

**Response:**
```json
{
  "success": true,
  "analysis": {
    "ats_score": 85,
    "strengths": [
      "Clear and concise summary",
      "Quantified achievements with numbers",
      "Strong action verbs throughout"
    ],
    "weaknesses": [
      "Missing relevant technical keywords",
      "Inconsistent date formatting",
      "No links to portfolio or LinkedIn"
    ],
    "suggestions": [
      "Add more industry-specific keywords",
      "Include measurable results for each role",
      "Add a skills section with technical competencies"
    ],
    "summary": "Strong resume with clear achievements. Improve keyword optimization for better ATS compatibility.",
    "keywords": ["Python", "AWS", "Machine Learning", "FastAPI", "Docker"]
  },
  "metadata": {
    "filename": "resume.pdf",
    "file_size": 245678,
    "execution_time_ms": 3450.5
  }
}
```

**GET** `/api/v1/resume/health`

Health check for resume analysis service.

## How It Works

### Frontend Flow
1. User uploads or drags & drops resume file
2. File is validated (type and size)
3. File is sent to backend API via multipart/form-data
4. Loading spinner displays during analysis
5. Results are displayed in organized sections
6. User can analyze another resume

### Backend Flow
1. Receive uploaded file
2. Validate file type and size
3. Extract text content:
   - PDF: Using PyPDF2
   - DOCX: Using python-docx
4. Create structured prompt for Claude
5. Send resume text to Claude LLM
6. Parse JSON response from Claude
7. Return structured analysis

### AI Analysis Prompt
The system uses a carefully crafted prompt that instructs Claude to:
- Rate ATS compatibility (0-100)
- Identify specific strengths (3-5 items)
- Identify weaknesses (3-5 items)
- Provide actionable suggestions (3-5 items)
- Write an overall summary
- Extract key skills and keywords

## Technologies Used

### Frontend
- Vue 3 (Composition API)
- Axios for HTTP requests
- Vite for build tooling
- Modern CSS with gradients and animations

### Backend
- FastAPI (Python web framework)
- AWS Bedrock (Claude LLM)
- LangChain AWS
- PyPDF2 (PDF text extraction)
- python-docx (DOCX text extraction)
- Pydantic (data validation)

## Testing

### Manual Testing

1. **Valid PDF Resume:**
   - Upload a PDF resume
   - Verify text extraction works
   - Check all analysis fields are populated

2. **Valid DOCX Resume:**
   - Upload a DOCX resume
   - Verify analysis completes successfully

3. **Invalid File Type:**
   - Try uploading a .txt or .jpg file
   - Verify error message displays

4. **Large File:**
   - Try uploading a file > 5MB
   - Verify size limit error

5. **Empty/Corrupted File:**
   - Upload an empty PDF
   - Verify appropriate error handling

### API Testing with cURL

```bash
# Test resume analysis
curl -X POST "http://localhost:8000/api/v1/resume/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/resume.pdf"

# Health check
curl "http://localhost:8000/api/v1/resume/health"
```

## Common Issues & Solutions

### Issue: "PyPDF2 is required"
**Solution:** Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Issue: "AWS credentials not found"
**Solution:** Configure .env file in backend
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

### Issue: "Network Error" in frontend
**Solution:**
- Check backend is running on port 8000
- Verify CORS is enabled in backend
- Check axios baseURL in frontend

### Issue: "Could not extract text from resume"
**Solution:**
- Ensure file is a valid PDF/DOCX
- Check file is not password-protected
- Try converting DOC to DOCX format

## Future Enhancements

- [ ] Add resume scoring history
- [ ] Compare multiple resumes side-by-side
- [ ] Industry-specific analysis (tech, finance, healthcare)
- [ ] Resume templates and examples
- [ ] Export analysis as PDF report
- [ ] Job description matching
- [ ] Resume builder with AI suggestions
- [ ] Multi-language support

## License

This project is part of the LLM Lecture series.

## Support

For issues or questions, please contact the development team.
