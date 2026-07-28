# Workshop Projects — AI & Cybersecurity

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 16+](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)
[![Vue.js 3](https://img.shields.io/badge/Vue.js-3.3+-4FC08D.svg)](https://vuejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991.svg)](https://openai.com/)
[![License: Educational](https://img.shields.io/badge/License-Educational-yellow.svg)](LICENSE)

Three full-stack AI applications built for the **How LLMs Work** workshop at Chandigarh University, plus seven interactive browser demos for the AI and Cybersecurity workshop sessions. All projects are open source, free to clone, and designed to be running in under 10 minutes.

---

## Projects

| Project | What it does | Stack |
|---------|-------------|-------|
| 🤖 **RAG Chatbot** | Answers questions about CU programs, placements, and campus life using Retrieval Augmented Generation — grounded in your own documents | Vue.js 3 · FastAPI · LangChain · ChromaDB · OpenAI |
| 📄 **Resume Analyzer** | Upload a PDF or DOCX résumé and receive an ATS score, strengths, improvement areas, and extracted keywords | Vue.js 3 · FastAPI · OpenAI · PyPDF2 |
| ❓ **Quiz Generator** | Type any topic or paste study notes — AI generates multiple-choice questions with difficulty control and explanations | Vue.js 3 · FastAPI · OpenAI |

All three share one FastAPI backend.

---

## Interactive Demos

Standalone browser demos — no server required, open the HTML file directly.

### AI Workshop (`demo/ai/`)

| Demo | What it shows |
|------|--------------|
| `demo-tokens.html` | Live token visualizer — paste any text and see it split into colour-coded tokens with cost estimate. Compares English, Python, and Hindi tokenisation. |
| `demo-prompt-lab.html` | Messages array builder — shows how zero-shot, few-shot, chain-of-thought, and role-based prompting change the JSON sent to the API. |
| `demo-hallucination.html` | 8-round quiz — Real or Hallucination? Tests whether students can identify fabricated facts in confident-sounding AI responses. |

### Cybersecurity Workshop (`demo/cybersecurity/`)

| Demo | What it shows |
|------|--------------|
| `demo-sqli.html` | Live SQL injection lab — type `admin' --` into a vulnerable login form and watch the query break. Side-by-side comparison with parameterised queries. |
| `demo-xss.html` | XSS playground — post a script tag into a fake comment section. Fires on the `innerHTML` panel, harmless on the `textContent` panel. |
| `demo-phishing.html` | 8-round phishing URL quiz — spot typosquatting, subdomain tricks, and Punycode lookalikes. |
| `demo-passwords.html` | Password cracking visualizer — compares MD5 (10B hashes/sec) vs bcrypt vs Argon2 crack times with live calculation. |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 16+
- OpenAI API key — [get one here](https://platform.openai.com/api-keys)

> **Workshop cost:** Using GPT-4o-mini, a full 2–3 hour session costs well under $1 per student.

### 1. Clone

```bash
git clone https://github.com/sodhigurpreetsingh/Workshop-Projects.git
cd Workshop-Projects
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt

# Create backend/.env with your API key:
# OPENAI_API_KEY=sk-proj-...

uvicorn app.main:app --reload
# Running at http://127.0.0.1:8000
```

### 3. RAG Chatbot frontend

```bash
cd ../chatbot
npm install
npm run dev
# Running at http://localhost:5173
```

### 4. Resume Analyzer frontend

```bash
cd ../resume-analyzer
npm install
npm run dev
# Running at http://localhost:5173 (or 5174)
```

### 5. Quiz Generator frontend

```bash
cd ../quiz-generator
npm install
npm run dev
# Running at http://localhost:5173 (or next available port)
```

### Admin panel (RAG Chatbot)

Go to `http://localhost:5173/admin` — PIN: `2025cu`

Use this to add, delete, or reload documents in the knowledge base without restarting the server.

---

## Project Structure

```
Workshop-Projects/
├── backend/                        # Shared FastAPI backend
│   └── app/
│       ├── api/routes/             # chat, resume, quiz, admin endpoints
│       ├── services/               # chat_service.py (RAG), resume_service.py, quiz_service.py
│       ├── documents/txts/         # Seed TXT files for the RAG knowledge base
│       └── data/chroma/            # ChromaDB vector store (auto-created on first run)
│
├── chatbot/                        # RAG Chatbot — Vue.js 3 + Vite
├── resume-analyzer/                # Resume Analyzer — Vue.js 3 + Vite
├── quiz-generator/                 # Quiz Generator — Vue.js 3 + Vite
│
└── demo/
    ├── ai/                         # AI workshop browser demos
    │   ├── demo-tokens.html
    │   ├── demo-prompt-lab.html
    │   └── demo-hallucination.html
    └── cybersecurity/              # Cybersecurity workshop browser demos
        ├── demo-sqli.html
        ├── demo-xss.html
        ├── demo-phishing.html
        └── demo-passwords.html
```

---

## Architecture (RAG Chatbot)

```
Browser (Vue.js)
    │
    │  POST /api/v1/chat
    ▼
FastAPI backend
    │
    ├── Embed question  ──────────────────────────────► OpenAI text-embedding-3-small
    │
    ├── Query ChromaDB  ──► top-4 relevant chunks from documents/txts/
    │
    ├── Build prompt    ──► system role + retrieved context + question
    │
    └── Generate answer ──────────────────────────────► OpenAI GPT-4o-mini
```

**Key design decision:** ChromaDB persists embeddings to disk (`app/data/chroma/`). On restart, the vector store is ready instantly — no re-embedding required. Earlier versions used FAISS (in-memory, rebuilt every restart).

---

## Environment Variables

Create `backend/.env`:

```env
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL_ID=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

No other configuration required for local development.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/chat` | Send a message, get a RAG-grounded answer |
| `POST` | `/api/v1/resume/analyze` | Upload and analyze a résumé |
| `POST` | `/api/v1/quiz/generate` | Generate MCQs for a topic |
| `GET`  | `/api/v1/admin/documents` | List documents in the knowledge base |
| `POST` | `/api/v1/admin/documents` | Add a document (requires PIN header) |
| `DELETE` | `/api/v1/admin/documents/{id}` | Remove a document |
| `POST` | `/api/v1/admin/reload` | Re-embed all TXT files |
| `GET`  | `/docs` | Interactive Swagger API docs |

Admin endpoints require header `X-Admin-Pin: 2025cu`.

---

## Cost

| Operation | Approximate cost |
|-----------|-----------------|
| RAG chat query | ~$0.001–0.003 |
| Resume analysis | ~$0.005–0.01 |
| Quiz generation (5 questions) | ~$0.002–0.005 |
| Full workshop session per student | < $1 |

Based on GPT-4o-mini pricing ($0.15/1M input tokens, $0.60/1M output tokens) and text-embedding-3-small ($0.02/1M tokens).

---

## Troubleshooting

**Backend fails to start** — Check that `backend/.env` exists and contains a valid `OPENAI_API_KEY`.

**Chatbot says "knowledge base is empty"** — The ChromaDB collection needs seeding. Hit `POST /api/v1/admin/reload` or use the admin panel.

**Port already in use** — Kill the existing process or pass `--port 8001` to uvicorn / change the port in `vite.config.js`.

**npm install fails** — Ensure Node.js 16+. Delete `node_modules/` and `package-lock.json` then retry.

---

## About

Built by [Gurpreet Singh Sodhi](https://linkedin.com/in/gurpreetsodhi) for the AI & Cybersecurity workshop series at Chandigarh University.

- Website: [mset.io](https://mset.io)
- LinkedIn: [linkedin.com/in/gurpreetsodhi](https://linkedin.com/in/gurpreetsodhi)
- GitHub: [github.com/sodhigurpreetsingh](https://github.com/sodhigurpreetsingh)
