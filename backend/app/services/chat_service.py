"""
RAG-based Chat Service (ChromaDB)
==================================
This module implements a Retrieval Augmented Generation (RAG) system for answering
questions about Chandigarh University using OpenAI and ChromaDB.

RAG Pipeline:
1. Load TXT documents from app/documents/txts/
2. Split documents into chunks
3. Create vector embeddings using OpenAI text-embedding-3-small
4. Persist embeddings in ChromaDB (app/data/chroma/)
5. Retrieve relevant context for user questions
6. Generate answers using GPT LLM with retrieved context
"""
import json
import logging
import os
import re
import time
from datetime import timezone
from pathlib import Path
from typing import Dict, Any, List, Optional

# LangChain OpenAI imports
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# ChromaDB
import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import settings
from app.core.db import SessionLocal
from app.models.conversation import ConversationTurn

# Initialize logger for this module
logger = logging.getLogger(__name__)

# =============================================================================
# OpenAI API Key Setup
# =============================================================================
if settings.OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

# ChromaDB persist directory (relative to where the server runs, i.e. backend/)
CHROMA_PERSIST_PATH = "./app/data/chroma"
CHROMA_COLLECTION_NAME = "cu_knowledge"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100


def _slug(text: str) -> str:
    """Convert text to a URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


# =============================================================================
# Smart CTA detection
# =============================================================================
# Simple post-hoc keyword matching on the question (same technique used by
# the reference rag-saas chatbot) — no LLM function-calling involved. Checked
# in priority order; first match wins. All URLs are real CU contact points
# pulled from app/documents/txts/admissions.txt and scholarships.txt.
_ACTION_RULES = [
    (
        "callback",
        ["call back", "callback", "talk to someone", "counsellor", "counselor", "speak to", "contact number", "contact me"],
        {"type": "callback", "buttonText": "Call Admissions", "url": "tel:1800-1212-88800"},
    ),
    (
        "apply",
        ["apply", "admission", "enroll", "enrol", "cucet", "register"],
        {"type": "apply", "buttonText": "Apply Now →", "url": "https://cucet.cuchd.in"},
    ),
    (
        "scholarship",
        ["scholarship", "fee waiver", "financial aid"],
        {"type": "scholarship", "buttonText": "View Scholarship Details →", "url": "https://cuchd.in/scholarship/"},
    ),
]


def _detect_action(question: str) -> Optional[Dict[str, str]]:
    """Return a CTA action dict if the question matches a known intent, else None."""
    q = question.lower()
    for _name, keywords, action in _ACTION_RULES:
        if any(kw in q for kw in keywords):
            return action
    return None


class ChatService:
    """
    RAG-based Chat Service using OpenAI + ChromaDB.

    ChromaDB persists embeddings to disk, so restarts are instant.
    Supports add/delete/list/reload operations for document management.

    Attributes:
        documents_directory (Path): Directory containing TXT documents
        chroma_client: ChromaDB persistent client
        collection: ChromaDB collection holding embeddings
        embeddings (OpenAIEmbeddings): OpenAI embedding model
        llm (ChatOpenAI): GPT LLM for answer generation
    """

    def __init__(self):
        self.documents_directory = self._get_documents_directory()
        self.chroma_client = None
        self.collection = None
        self.embeddings = None
        self.llm = None
        self._is_loading = False
        self._load_attempted = False

        self._initialize_components()
        logger.info("ChatService initialized (ChromaDB collection will be verified on first use)")

    # =========================================================================
    # Private helpers
    # =========================================================================

    @staticmethod
    def _get_documents_directory() -> Path:
        """Return (and create if needed) the TXT documents directory."""
        current_dir = Path(__file__).parent.parent
        docs_dir = current_dir / "documents" / "txts"
        docs_dir.mkdir(parents=True, exist_ok=True)
        return docs_dir

    @staticmethod
    def _get_chroma_dir() -> Path:
        """Return (and create if needed) the ChromaDB persist directory."""
        chroma_dir = Path(CHROMA_PERSIST_PATH)
        chroma_dir.mkdir(parents=True, exist_ok=True)
        return chroma_dir

    def _initialize_components(self):
        """
        Initialize OpenAI components and ChromaDB client.

        Sets up:
        1. OpenAI Embeddings — converts text to vectors
        2. GPT LLM — generates natural language answers
        3. ChromaDB PersistentClient + collection
        """
        try:
            self.embeddings = OpenAIEmbeddings(
                model=settings.OPENAI_EMBEDDING_MODEL,
            )
            logger.info(f"OpenAI embeddings initialized: model={settings.OPENAI_EMBEDDING_MODEL}")

            self.llm = ChatOpenAI(
                model=settings.OPENAI_MODEL_ID,
                temperature=0.7,
                max_tokens=1000,
            )
            logger.info(f"ChatOpenAI initialized: model={settings.OPENAI_MODEL_ID}")

            # ChromaDB persistent client
            chroma_path = str(self._get_chroma_dir())
            self.chroma_client = chromadb.PersistentClient(path=chroma_path)
            self.collection = self.chroma_client.get_or_create_collection(
                name=CHROMA_COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"},
            )
            logger.info(
                f"ChromaDB collection '{CHROMA_COLLECTION_NAME}' ready at {chroma_path} "
                f"({self.collection.count()} documents)"
            )

        except Exception as e:
            logger.error(f"Failed to initialize components: {e}")
            raise

    def _ensure_initialized(self):
        """
        Lazily seed the ChromaDB collection on first use.

        If the collection already contains documents, skip re-embedding.
        If empty, call reload_documents() to ingest txt files.
        """
        if self.collection is None:
            raise Exception("ChromaDB collection not initialized.")

        # Already has data — no work needed
        if self.collection.count() > 0:
            return

        # Prevent concurrent seeding
        if self._is_loading:
            raise Exception("Documents are currently being loaded. Please try again.")

        if self._load_attempted and self.collection.count() == 0:
            raise Exception(
                "Document loading failed previously. Use /admin/reload to retry."
            )

        try:
            self._is_loading = True
            self._load_attempted = True
            logger.info("ChromaDB collection is empty — seeding from txt files...")
            self.reload_documents()
        finally:
            self._is_loading = False

    @staticmethod
    def _chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
        """
        Split text into overlapping chunks.

        Args:
            text: Full text to split
            chunk_size: Maximum characters per chunk
            overlap: Character overlap between consecutive chunks

        Returns:
            List of text chunks
        """
        if not text:
            return []

        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            if end >= len(text):
                break
            start = end - overlap  # Slide back by overlap amount

        return chunks

    # =========================================================================
    # Public methods
    # =========================================================================

    def answer_question(self, question: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Answer a question using RAG (Retrieval Augmented Generation).

        Pipeline:
        1. Ensure ChromaDB collection has documents (lazy init)
        2. Embed the question and retrieve top-4 similar chunks
        3. Build context from retrieved chunks
        4. Prompt GPT with context + question
        5. Detect a smart-CTA action from the question (keyword matching)
        6. Persist the turn (if session_id given) and return answer + sources + action

        Args:
            question: The student's question
            session_id: Optional client-generated session id, for history persistence

        Returns:
            Dict with keys: answer, sources, context_used, action
        """
        try:
            self._ensure_initialized()

            if self.collection.count() == 0:
                return {
                    "answer": (
                        "The knowledge base is empty. Please contact the admin to load documents, "
                        "or call 1800-1212-88800 for immediate assistance."
                    ),
                    "sources": [],
                    "context_used": "",
                }

            # Embed the question
            question_embedding = self.embeddings.embed_documents([question])[0]

            # Query ChromaDB for top-4 relevant chunks
            results = self.collection.query(
                query_embeddings=[question_embedding],
                n_results=min(4, self.collection.count()),
            )

            if not results or not results.get("documents") or not results["documents"][0]:
                return {
                    "answer": (
                        "I couldn't find relevant information to answer your question. "
                        "Please call 1800-1212-88800 or email admissions@cumail.in."
                    ),
                    "sources": [],
                    "context_used": "",
                }

            # Build context from retrieved chunks
            docs = results["documents"][0]
            metadatas = results["metadatas"][0] if results.get("metadatas") else [{}] * len(docs)
            context = "\n\n".join(docs)

            # CU counsellor prompt
            prompt = (
                "You are a friendly, enthusiastic student counsellor at Chandigarh University (CU), "
                "Mohali, Punjab, who genuinely enjoys helping students. "
                "Answer using ONLY the context provided below.\n\n"
                "PERSONALITY & TONE:\n"
                "- Be warm, encouraging, and approachable—like chatting with a helpful senior, not a call-center agent\n"
                "- Show genuine enthusiasm when sharing good info (e.g., \"Great question!\", \"You're going to love this!\")\n"
                "- Use casual, natural language and contractions (e.g., \"you'll\", \"that's\", \"here's\")\n"
                "- Sprinkle in relevant emojis to add warmth (e.g., 🎓 📚 🏠 💰 ✅) without overdoing it—one or two per response is plenty\n"
                "- Add a brief friendly sign-off when it fits, like \"Hope that helps! 😊\" or \"Let me know if you'd like more details!\"\n"
                "- Avoid robotic or formal phrasing—no \"I am here to assist you\" or \"Please be advised\"\n\n"
                "If the context doesn't cover the question, say something like: \"Hmm, I don't have the specifics on "
                "that one! 🙏 Give us a call at 1800-1212-88800 or email admissions@cumail.in and the team will "
                "sort you out.\"\n\n"
                "Never invent packages, rankings, or figures not in the context. If the question is unrelated to CU, "
                "gently redirect.\n"
                "Use the conversation history to understand follow-up questions and maintain context.\n\n"
                "FORMATTING RULES:\n"
                "- Use **bold** for important terms, program names, prices, and key info\n"
                "- For multiple items, use a simple numbered list starting at the left margin:\n"
                "1. **Item Name** - key details\n"
                "2. **Item Name** - key details\n"
                "- Write in short, friendly paragraphs with a blank line between them\n"
                "- Keep responses concise and scannable\n\n"
                f"Context:\n{context}\n\n"
                f"Student's question: {question}\n\n"
                "Your response:"
            )

            response = self.llm.invoke(prompt)
            answer = response.content.strip()

            # Build source list
            sources = []
            seen = set()
            for meta in metadatas:
                title = meta.get("title", meta.get("doc_id", "Unknown"))
                if title not in seen:
                    seen.add(title)
                    sources.append({
                        "doc_id": meta.get("doc_id", ""),
                        "title": title,
                        "category": meta.get("category", ""),
                    })

            action = _detect_action(question)

            if session_id:
                self._save_turn(session_id, question, answer, sources, action)

            return {
                "answer": answer,
                "sources": sources,
                "context_used": context[:500] + "..." if len(context) > 500 else context,
                "action": action,
            }

        except Exception as e:
            logger.error(f"Error answering question: {e}")
            raise

    @staticmethod
    def _save_turn(
        session_id: str,
        question: str,
        answer: str,
        sources: List[Dict[str, Any]],
        action: Optional[Dict[str, str]],
    ) -> None:
        """Persist one Q+A turn for session history. Best-effort — never blocks the response."""
        db = SessionLocal()
        try:
            db.add(ConversationTurn(
                session_id=session_id,
                question=question,
                answer=answer,
                sources_json=json.dumps(sources),
                action_json=json.dumps(action) if action else None,
            ))
            db.commit()
        except Exception as e:
            logger.error(f"Error saving conversation turn: {e}")
            db.rollback()
        finally:
            db.close()

    def get_session_history(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Return all persisted turns for a session, oldest first.

        Returns:
            List of dicts with keys: question, answer, sources, action, timestamp
        """
        db = SessionLocal()
        try:
            turns = (
                db.query(ConversationTurn)
                .filter(ConversationTurn.session_id == session_id)
                .order_by(ConversationTurn.created_at.asc())
                .all()
            )
            return [
                {
                    "question": t.question,
                    "answer": t.answer,
                    "sources": json.loads(t.sources_json) if t.sources_json else [],
                    "action": json.loads(t.action_json) if t.action_json else None,
                    # SQLite drops tzinfo on round-trip — created_at is always UTC (see
                    # ConversationTurn.created_at default), so re-attach it explicitly.
                    # Without this, the frontend's `new Date()` misreads the naive string
                    # as local time and displays the wrong hour.
                    "timestamp": t.created_at.replace(tzinfo=timezone.utc).isoformat(),
                }
                for t in turns
            ]
        finally:
            db.close()

    def get_system_status(self) -> Dict[str, Any]:
        """
        Return current system status and configuration.

        Returns:
            Dict with collection_name, num_documents, vector_store_initialized,
            embeddings_model, llm_model
        """
        count = self.collection.count() if self.collection else 0
        return {
            "collection_name": CHROMA_COLLECTION_NAME,
            "num_documents": count,
            "vector_store_initialized": count > 0,
            "embeddings_model": settings.OPENAI_EMBEDDING_MODEL,
            "llm_model": settings.OPENAI_MODEL_ID,
        }

    def reload_documents(self) -> Dict[str, Any]:
        """
        Re-read all .txt files from app/documents/txts/ and upsert into ChromaDB.

        Uses filename stem as doc_id so repeated calls are idempotent (upsert, not delete+insert).

        Returns:
            Dict with message, files_processed, chunks_upserted
        """
        try:
            txt_files = list(self.documents_directory.glob("*.txt"))

            if not txt_files:
                logger.warning(f"No TXT files found in {self.documents_directory}")
                return {
                    "message": "No TXT files found",
                    "files_processed": 0,
                    "chunks_upserted": 0,
                }

            total_chunks = 0

            for txt_file in txt_files:
                try:
                    doc_id = txt_file.stem  # e.g. "placements" for placements.txt
                    content = txt_file.read_text(encoding="utf-8")
                    title = txt_file.stem.replace("_", " ").title()
                    category = txt_file.stem  # use stem as default category

                    chunks = self._chunk_text(content)

                    if not chunks:
                        logger.warning(f"No chunks produced for {txt_file.name}")
                        continue

                    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
                    chunk_embeddings = self.embeddings.embed_documents(chunks)
                    metadatas = [
                        {
                            "doc_id": doc_id,
                            "title": title,
                            "category": category,
                            "chunk_index": i,
                        }
                        for i in range(len(chunks))
                    ]

                    self.collection.upsert(
                        ids=ids,
                        documents=chunks,
                        metadatas=metadatas,
                        embeddings=chunk_embeddings,
                    )

                    total_chunks += len(chunks)
                    logger.info(f"Upserted {len(chunks)} chunks for {txt_file.name}")

                except Exception as e:
                    logger.error(f"Error processing {txt_file.name}: {e}")

            logger.info(f"reload_documents: {len(txt_files)} files, {total_chunks} chunks upserted")
            return {
                "message": "Documents reloaded successfully",
                "files_processed": len(txt_files),
                "chunks_upserted": total_chunks,
            }

        except Exception as e:
            logger.error(f"Error reloading documents: {e}")
            raise

    def add_document(self, title: str, content: str, category: str) -> Dict[str, Any]:
        """
        Add a new document to ChromaDB.

        Chunks the content into 500-char chunks with 100-char overlap, embeds each,
        and stores them with metadata {title, category, chunk_index}.

        Args:
            title: Human-readable document title
            content: Full text content of the document
            category: Category string (e.g. "placements", "admissions")

        Returns:
            Dict with success, doc_id, chunks_added
        """
        try:
            # Generate a stable, URL-safe doc_id from title + timestamp suffix
            timestamp_suffix = str(int(time.time()))[-6:]  # last 6 digits of unix time
            doc_id = f"{_slug(title)}_{timestamp_suffix}"

            chunks = self._chunk_text(content)

            if not chunks:
                return {"success": False, "doc_id": doc_id, "chunks_added": 0}

            ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
            chunk_embeddings = self.embeddings.embed_documents(chunks)
            metadatas = [
                {
                    "doc_id": doc_id,
                    "title": title,
                    "category": category,
                    "chunk_index": i,
                }
                for i in range(len(chunks))
            ]

            self.collection.add(
                ids=ids,
                documents=chunks,
                metadatas=metadatas,
                embeddings=chunk_embeddings,
            )

            logger.info(f"add_document: doc_id={doc_id}, chunks_added={len(chunks)}")
            return {"success": True, "doc_id": doc_id, "chunks_added": len(chunks)}

        except Exception as e:
            logger.error(f"Error adding document '{title}': {e}")
            raise

    def delete_document(self, doc_id: str) -> Dict[str, Any]:
        """
        Delete all chunks associated with a given doc_id.

        Args:
            doc_id: The document identifier (all chunks with this doc_id are removed)

        Returns:
            Dict with success, deleted_count
        """
        try:
            # Fetch IDs of all chunks belonging to this doc_id
            results = self.collection.get(where={"doc_id": doc_id})
            chunk_ids = results.get("ids", [])

            if not chunk_ids:
                logger.info(f"delete_document: no chunks found for doc_id={doc_id}")
                return {"success": False, "deleted_count": 0}

            self.collection.delete(ids=chunk_ids)
            logger.info(f"delete_document: doc_id={doc_id}, deleted_count={len(chunk_ids)}")
            return {"success": True, "deleted_count": len(chunk_ids)}

        except Exception as e:
            logger.error(f"Error deleting document '{doc_id}': {e}")
            raise

    def get_document_content(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """
        Return the full content of a document by joining its chunks in order.

        Returns:
            Dict with doc_id, title, category, chunk_count, content  — or None if not found.
        """
        try:
            results = self.collection.get(where={"doc_id": doc_id})
            if not results or not results.get("ids"):
                return None

            metadatas = results.get("metadatas", [])
            documents = results.get("documents", [])

            # Sort chunks by chunk_index so content reads in order
            paired = sorted(
                zip(metadatas, documents),
                key=lambda x: x[0].get("chunk_index", 0),
            )

            content = "\n".join(doc for _, doc in paired)
            meta = paired[0][0] if paired else {}

            return {
                "doc_id": doc_id,
                "title": meta.get("title", doc_id),
                "category": meta.get("category", ""),
                "chunk_count": len(paired),
                "content": content,
            }

        except Exception as e:
            logger.error(f"Error fetching document content for '{doc_id}': {e}")
            raise

    def list_documents(self) -> List[Dict[str, Any]]:
        """
        Return unique documents in the ChromaDB collection.

        Deduplicates by doc_id and counts chunks per document.

        Returns:
            List of dicts with doc_id, title, category, chunk_count
        """
        try:
            results = self.collection.get()
            metadatas = results.get("metadatas", [])

            # Aggregate by doc_id
            doc_map: Dict[str, Dict[str, Any]] = {}
            for meta in metadatas:
                if not meta:
                    continue
                doc_id = meta.get("doc_id", "unknown")
                if doc_id not in doc_map:
                    doc_map[doc_id] = {
                        "doc_id": doc_id,
                        "title": meta.get("title", doc_id),
                        "category": meta.get("category", ""),
                        "chunk_count": 0,
                    }
                doc_map[doc_id]["chunk_count"] += 1

            return list(doc_map.values())

        except Exception as e:
            logger.error(f"Error listing documents: {e}")
            raise


# =============================================================================
# Singleton instance
# =============================================================================
chat_service = ChatService()
