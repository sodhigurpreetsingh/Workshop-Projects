# RAG Chat & Resume Analyzer Backend API

A FastAPI-based backend service that provides two main features:
1. **RAG (Retrieval Augmented Generation) Chat System** - AI-powered Q&A based on uploaded TXT documents
2. **AI Resume Analyzer** - Intelligent resume analysis with ATS scoring and feedback

This backend uses **OpenAI GPT models** for natural language processing and embeddings.

---

## 🚀 Features

### RAG Chat System
- Upload and index TXT documents
- Ask questions about your documents
- Get AI-generated answers with source citations
- Vector similarity search using FAISS
- Semantic search with OpenAI embeddings

### Resume Analyzer
- Upload resumes (PDF, DOCX formats)
- AI-powered analysis and feedback
- ATS (Applicant Tracking System) compatibility score
- Identify strengths and weaknesses
- Get actionable improvement suggestions
- Extract key skills and keywords

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Python 3.11+** installed ([Download Python](https://www.python.org/downloads/))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **pip** package manager (comes with Python)

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Create a Virtual Environment (Recommended)

**On macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**On Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

1. Copy the `.env` file (it should already exist)
2. Edit `.env` and add your OpenAI API key:

```env
# OpenAI Configuration
OPENAI_API_KEY="sk-proj-your-actual-api-key-here"

# OpenAI Model Configuration
OPENAI_MODEL_ID="gpt-4o-mini"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
```

> ⚠️ **Important:** Never commit your `.env` file to git! It contains your API key.

---

## 🎯 Usage

### Start the Server

```bash
python main.py
```

The server will start on `http://127.0.0.1:8000`

You should see output like:
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Access the API

- **API Documentation (Swagger UI):** http://127.0.0.1:8000/docs
- **Alternative Docs (ReDoc):** http://127.0.0.1:8000/redoc
- **Health Check:** http://127.0.0.1:8000/api/v1/health

---

## 📚 API Endpoints

### RAG Chat System

#### 1. Ask a Question
```http
POST /api/v1/chat/ask
Content-Type: application/json

{
  "question": "What is the company's mission statement?"
}
```

#### 2. Get System Status
```http
GET /api/v1/chat/status
```

#### 3. Reload Documents
```http
POST /api/v1/chat/reload
```

### Resume Analyzer

#### 1. Analyze Resume
```http
POST /api/v1/resume/analyze
Content-Type: multipart/form-data

file: <resume.pdf or resume.docx>
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── chat.py          # RAG chat endpoints
│   │   │   └── resume.py        # Resume analyzer endpoints
│   │   └── router.py            # Main router
│   ├── core/
│   │   └── config.py            # Configuration settings
│   ├── services/
│   │   ├── chat_service.py      # RAG chat logic
│   │   └── resume_service.py    # Resume analysis logic
│   ├── documents/
│   │   └── txts/                # Store TXT files here for RAG
│   └── main.py                  # FastAPI app initialization
├── main.py                      # Application entry point
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (API keys)
└── README.md                    # This file
```

---

## 🗂️ Adding Documents for RAG Chat

1. Place your `.txt` files in `app/documents/txts/`
2. The system will automatically load them on first use
3. To reload after adding new files, call the `/api/v1/chat/reload` endpoint

Example:
```bash
# Create the directory if it doesn't exist
mkdir -p app/documents/txts

# Add your text files
cp your-document.txt app/documents/txts/
```

---

## 🧪 Testing the API

### Using cURL

**Test Health Check:**
```bash
curl http://127.0.0.1:8000/api/v1/health
```

**Ask a Question:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/chat/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?"}'
```

**Analyze Resume:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/resume/analyze \
  -F "file=@/path/to/resume.pdf"
```

### Using the Interactive Docs

1. Open http://127.0.0.1:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"

---

## 🔧 Configuration

Edit `.env` to customize settings:

```env
# Application Settings
APP_NAME="RAG Chat System"
DEBUG=true
HOST="127.0.0.1"
PORT=8000

# OpenAI Configuration
OPENAI_API_KEY="your-key-here"
OPENAI_MODEL_ID="gpt-4o-mini"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

# CORS Settings
CORS_ORIGINS=["*"]
CORS_ALLOW_CREDENTIALS=true
```

---

## 🐛 Troubleshooting

### Issue: "OpenAI API key not found"
- Make sure you've added your API key to `.env`
- Check that the key starts with `sk-proj-` or `sk-`
- Verify the `.env` file is in the `backend` directory

### Issue: "No documents found"
- Add `.txt` files to `app/documents/txts/`
- Call `/api/v1/chat/reload` to reload documents

### Issue: "Port 8000 already in use"
- Change the `PORT` in `.env` to another number (e.g., 8001)
- Or stop the process using port 8000

### Issue: Import errors
- Make sure your virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

---

## 📦 Dependencies

Key packages used:
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **LangChain** - LLM orchestration framework
- **OpenAI** - GPT models and embeddings
- **FAISS** - Vector similarity search
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX text extraction

See `requirements.txt` for complete list.

---

## 🔒 Security Notes

- **Never commit `.env` files** with API keys
- The `.gitignore` file is configured to ignore `.env`
- Keep your OpenAI API key secret
- Use environment variables for all sensitive data
- In production, use proper authentication and HTTPS

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [RAG (Retrieval Augmented Generation) Explained](https://python.langchain.com/docs/use_cases/question_answering/)

---

## 📝 License

This project is for educational purposes.

---

## 🤝 Contributing

This is a student project. Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

---

## 👨‍💻 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the API docs at http://127.0.0.1:8000/docs
3. Check the server logs for error messages
4. Ensure your OpenAI API key is valid and has credits

---

**Happy Learning! 🚀**
