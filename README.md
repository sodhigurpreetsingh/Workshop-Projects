# 🤖 AI-Powered Document Analysis Suite

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 16+](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)
[![Vue.js 3](https://img.shields.io/badge/Vue.js-3.3+-4FC08D.svg)](https://vuejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991.svg)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-Educational-yellow.svg)](LICENSE)

A collection of modern, full-stack applications demonstrating **Retrieval Augmented Generation (RAG)** and AI-powered document analysis using **OpenAI GPT models**. This project suite includes a RAG-based chat system and an intelligent resume analyzer, both built with FastAPI and Vue.js.

Perfect for learning AI application development, RAG systems, and modern full-stack architecture!

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Tech Stack](#️-tech-stack)
- [Documentation](#-detailed-documentation)
- [Use Cases](#-use-cases)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security-considerations)
- [Cost Considerations](#-cost-considerations)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Project Overview

This repository contains **three interconnected applications** that showcase modern AI capabilities:

| Project | Description | Technology |
|---------|-------------|------------|
| 🤖 **RAG Chat System** | Ask questions about your documents and get AI-generated answers with source citations | Vue.js 3 + FastAPI |
| 📄 **AI Resume Analyzer** | Upload resumes and receive instant feedback with ATS scoring and improvement suggestions | Vue.js 3 + FastAPI |
| ⚙️ **Backend API** | Unified FastAPI backend powering both applications with OpenAI GPT-4o-mini integration | Python + FastAPI + LangChain |

> **🎓 Educational Focus:** This project is designed for students and developers learning about RAG systems, AI integration, and modern full-stack development.

---

## 🌟 Key Features

### RAG Chat System
- 💬 Natural language Q&A over your documents
- 📚 Upload and index TXT documents
- 🔍 Semantic search using vector embeddings
- 🎯 Source citations with every answer
- ⚡ Real-time responses powered by GPT-4o-mini

### Resume Analyzer
- 📄 Support for PDF and DOCX resumes
- 🎯 ATS (Applicant Tracking System) compatibility scoring
- ✅ Strengths and weaknesses analysis
- 💡 Actionable improvement suggestions
- 🔑 Automatic keyword extraction
- 📊 Comprehensive feedback in seconds

### Backend API
- 🚀 Fast, modern FastAPI framework
- 🤖 OpenAI GPT integration (GPT-4o-mini)
- 🔄 Vector similarity search with FAISS
- 📝 Document processing and embeddings
- 🔒 Secure API with CORS support
- 📚 Interactive API documentation (Swagger)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Applications                     │
├──────────────────────────────┬────────────────────────────────┤
│   RAG Chat (Vue.js + Vite)   │  Resume Analyzer (Vue.js)     │
│   Port: 5173                 │  Port: 5174 (or 5173)         │
└──────────────┬───────────────┴─────────────┬──────────────────┘
               │                              │
               │      HTTP/REST API           │
               │                              │
┌──────────────┴──────────────────────────────┴──────────────────┐
│              Backend API (FastAPI + Python)                    │
│              Port: 8000                                        │
│  ┌──────────────────┐  ┌─────────────────────────────────┐  │
│  │  RAG Service     │  │  Resume Analysis Service        │  │
│  │  - Document Load │  │  - PDF/DOCX Extraction          │  │
│  │  - Embeddings    │  │  - AI Analysis                  │  │
│  │  - Vector Search │  │  - ATS Scoring                  │  │
│  │  - Q&A           │  │  - Feedback Generation          │  │
│  └──────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ API Calls
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   OpenAI API (GPT-4o-mini)                   │
│  - Text Generation  - Embeddings  - Analysis                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **OpenAI API Key** ([Get one](https://platform.openai.com/api-keys))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd projects
```

### 2. Set Up Backend

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env and add your OpenAI API key
nano .env  # or use your preferred editor

# Start the backend
python main.py
```

Backend will run on: http://127.0.0.1:8000

### 3. Set Up RAG Chat Frontend

```bash
cd ../chatbot

# Install dependencies
npm install

# Start development server
npm run dev
```

Chat interface will run on: http://localhost:5173

### 4. Set Up Resume Analyzer Frontend

```bash
cd ../resume-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Resume analyzer will run on: http://localhost:5173 (or 5174 if 5173 is in use)

---

## 📁 Project Structure

```
projects/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/     # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── services/       # Business logic
│   │   └── documents/      # Document storage
│   │       └── txts/       # TXT files for RAG
│   ├── main.py            # Application entry
│   ├── requirements.txt   # Python dependencies
│   ├── .env              # Environment variables
│   └── README.md         # Backend documentation
│
├── chatbot/               # RAG Chat Frontend
│   ├── src/
│   │   ├── components/   # Vue components
│   │   └── utils/        # API client
│   ├── package.json      # Dependencies
│   └── README.md         # Frontend documentation
│
├── resume-analyzer/       # Resume Analyzer Frontend
│   ├── src/
│   │   ├── components/   # Vue components
│   │   └── utils/        # API client
│   ├── package.json      # Dependencies
│   └── README.md         # Frontend documentation
│
└── README.md             # This file
```

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - LLM orchestration
- **OpenAI** - GPT models and embeddings
- **FAISS** - Vector similarity search
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX processing
- **Pydantic** - Data validation

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Axios** - HTTP client
- **CSS3** - Modern styling

### AI/ML
- **GPT-4o-mini** - Language model for text generation
- **text-embedding-3-small** - Text embeddings
- **FAISS** - Fast vector similarity search
- **RAG** - Retrieval Augmented Generation

---

## 📚 Detailed Documentation

Each project has its own comprehensive README:

- 📖 **[Backend Documentation](./backend/README.md)** - API setup, endpoints, configuration
- 📖 **[Chatbot Documentation](./chatbot/README.md)** - Frontend setup, usage, customization
- 📖 **[Resume Analyzer Documentation](./resume-analyzer/README.md)** - Upload, analysis, deployment

---

## 🎓 Use Cases

### Educational
- Learn about RAG systems
- Understand vector embeddings
- Practice FastAPI and Vue.js
- Explore AI integration patterns

### Professional
- Document Q&A systems
- Internal knowledge bases
- Resume screening automation
- ATS optimization tools

### Personal
- Chat with your documents
- Improve your resume
- Learn AI application development

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# OpenAI Configuration
OPENAI_API_KEY="sk-proj-your-key-here"
OPENAI_MODEL_ID="gpt-4o-mini"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

# Application Settings
DEBUG=true
HOST="127.0.0.1"
PORT=8000

# CORS Settings (adjust for production)
CORS_ORIGINS=["*"]
```

### Frontend API Endpoints

Both frontends connect to the backend at `http://127.0.0.1:8000/api/v1`

Update in respective files:
- Chatbot: `chatbot/src/utils/my-axios.js`
- Resume Analyzer: `resume-analyzer/src/utils/my-axios.js`

---

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://127.0.0.1:8000/api/v1/health

# Check API docs
open http://127.0.0.1:8000/docs
```

### Test RAG Chat

1. Add TXT files to `backend/app/documents/txts/`
2. Open chat interface at http://localhost:5173
3. Ask: "What is in the documents?"

### Test Resume Analyzer

1. Open analyzer at http://localhost:5173 (or 5174)
2. Upload a PDF or DOCX resume
3. Review the analysis results

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check Python version (3.11+)
- Verify OpenAI API key in `.env`
- Ensure dependencies are installed

**Frontend won't connect**
- Verify backend is running on port 8000
- Check CORS settings in backend `.env`
- Confirm API URL in frontend config

**No documents found (RAG Chat)**
- Add `.txt` files to `backend/app/documents/txts/`
- Call `/api/v1/chat/reload` endpoint

**Resume upload fails**
- Check file format (PDF, DOCX only)
- Verify file size (usually <10MB)
- Check backend logs for errors

For detailed troubleshooting, see individual project READMEs.

---

## 🚀 Deployment

### Backend Deployment

**Options:**
- AWS EC2 / Lambda
- Google Cloud Run
- Heroku
- DigitalOcean Droplets
- Docker containers

**Requirements:**
- Set `DEBUG=false` in production
- Use proper CORS origins
- Secure API keys with environment variables
- Use HTTPS

### Frontend Deployment

**Options:**
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Cloudflare Pages

**Steps:**
1. Build: `npm run build`
2. Upload `dist/` folder to hosting
3. Configure API URL for production

---

## 🔒 Security Considerations

- ✅ Never commit `.env` files to Git
- ✅ Use environment variables for API keys
- ✅ Enable HTTPS in production
- ✅ Restrict CORS origins in production
- ✅ Implement rate limiting
- ✅ Validate all user inputs
- ✅ Keep dependencies updated
- ✅ Review OpenAI usage and costs

---

## 💰 Cost Considerations

### OpenAI API Costs

**GPT-4o-mini** (text generation):
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

**text-embedding-3-small** (embeddings):
- ~$0.02 per 1M tokens

**Typical Usage:**
- RAG Chat query: ~$0.001-0.005 per query
- Resume analysis: ~$0.005-0.01 per resume

**Tips to reduce costs:**
- Use smaller chunk sizes
- Cache frequent queries
- Monitor usage in OpenAI dashboard
- Set spending limits

---

## 🎓 Learning Resources

### Concepts
- [RAG Overview](https://python.langchain.com/docs/use_cases/question_answering/)
- [Vector Embeddings Explained](https://platform.openai.com/docs/guides/embeddings)
- [Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)

### Frameworks
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Guide](https://python.langchain.com/)
- [Vue.js 3 Guide](https://vuejs.org/guide/)
- [Vite Documentation](https://vitejs.dev/)

### Tools
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [FAISS Documentation](https://faiss.ai/)

---

## 🤝 Contributing

Contributions are welcome! This is an educational project.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Ideas

- Add new document formats support
- Implement user authentication
- Add conversation history
- Create more analysis features
- Improve UI/UX
- Add tests
- Optimize performance
- Add multi-language support

---

## 📸 Screenshots

### RAG Chat System
![RAG Chat Interface](docs/screenshots/chat-interface.png)
*Ask questions about your documents and get instant AI-powered answers*

### Resume Analyzer
![Resume Analyzer](docs/screenshots/resume-analyzer.png)
*Upload resumes and receive comprehensive AI analysis*

### API Documentation
![API Docs](docs/screenshots/api-docs.png)
*Interactive Swagger API documentation*

> **Note:** Add screenshots to `docs/screenshots/` directory for better visual presentation.

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star! ⭐

---

## 📝 License

This project is for **educational purposes**. Feel free to use and modify for learning.

**Note:** OpenAI API usage is subject to OpenAI's terms of service.

---

## 📚 Citation

If you use this project in your research or teaching, please cite:

```bibtex
@software{ai_document_analysis_suite,
  title = {AI-Powered Document Analysis Suite},
  author = {Your Name},
  year = {2024},
  url = {https://github.com/yourusername/your-repo}
}
```

---

## 🙏 Acknowledgments

- **OpenAI** - For GPT models and embeddings API
- **LangChain** - For RAG framework
- **FastAPI** - For backend framework
- **Vue.js** - For frontend framework
- **FAISS** - For vector similarity search

---

## 📧 Support & Community

### Getting Help

For issues, questions, or suggestions:

1. 📖 Check individual project READMEs
2. 🔍 Review troubleshooting sections
3. 🐛 Check backend logs and browser console
4. 💬 Open an issue on GitHub
5. 📧 Contact the maintainers

### Community

- 💬 [Discussions](https://github.com/yourusername/your-repo/discussions) - Ask questions and share ideas
- 🐛 [Issues](https://github.com/yourusername/your-repo/issues) - Report bugs
- 🚀 [Pull Requests](https://github.com/yourusername/your-repo/pulls) - Contribute code

### Stay Updated

- ⭐ Star this repository to stay updated
- 👀 Watch for new releases
- 🍴 Fork to create your own version

---

## 🗺️ Roadmap

Future enhancements:

- [ ] User authentication and sessions
- [ ] Conversation history persistence
- [ ] Support for more document formats (DOCX, HTML, Markdown)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Batch resume processing
- [ ] API rate limiting
- [ ] Automated testing suite
- [ ] Docker compose setup
- [ ] CI/CD pipeline

---

## 📊 Project Status

- ✅ Backend API - Stable
- ✅ RAG Chat System - Stable
- ✅ Resume Analyzer - Stable
- 🚧 Docker Support - In Progress
- 🚧 Authentication - Planned
- 🚧 Testing Suite - Planned

---

**Built with ❤️ for learning and education**

**Happy Coding! 🚀**
