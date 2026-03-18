"""
RAG-based Chat Service
======================
This module implements a Retrieval Augmented Generation (RAG) system for answering
questions based on TXT documents using OpenAI.

RAG Pipeline:
1. Load TXT documents
2. Split documents into chunks
3. Create vector embeddings using OpenAI Embeddings
4. Store embeddings in FAISS vector database
5. Retrieve relevant context for user questions
6. Generate answers using GPT LLM with retrieved context
"""
import logging
import os
from pathlib import Path
from typing import Dict, Any, List

# LangChain imports for RAG pipeline
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from app.core.config import settings

# Initialize logger for this module
logger = logging.getLogger(__name__)

# =============================================================================
# OpenAI API Key Setup
# =============================================================================
# Bridge pydantic settings → OS environment variables for OpenAI API key
# This is necessary because OpenAI SDK reads credentials from environment
# variables, but our settings come from .env file via pydantic
if settings.OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY


class ChatService:
    """
    RAG-based Chat Service using OpenAI

    This service handles the complete RAG pipeline:
    - Document loading from TXT files
    - Text chunking and embedding generation
    - Vector storage and similarity search
    - Question answering with context retrieval

    Attributes:
        documents_directory (Path): Directory containing TXT documents
        vector_store (FAISS): Vector database for document embeddings
        embeddings (OpenAIEmbeddings): OpenAI embedding model
        llm (ChatOpenAI): GPT LLM for answer generation
        retriever: Vector store retriever for similarity search
    """

    def __init__(self):
        """
        Initialize the RAG chat service.

        This constructor:
        1. Sets up the TXT documents directory
        2. Initializes AWS Bedrock components (embeddings + LLM)
        3. Documents are loaded lazily on first use (not during init)
        """
        # Initialize instance variables
        self.documents_directory = self._get_documents_directory()
        self.vector_store = None
        self.embeddings = None
        self.llm = None
        self.retriever = None
        self._is_loading = False
        self._load_attempted = False

        # Set up AWS Bedrock components
        self._initialize_components()

        # NOTE: Documents are NOT loaded here to allow fast server startup
        # They will be loaded lazily on first use via _ensure_initialized()
        logger.info("ChatService initialized (documents will load on first use)")

    @staticmethod
    def _get_documents_directory() -> Path:
        """
        Get or create the TXT documents directory.

        Creates the directory structure: app/documents/txts/
        If the directory doesn't exist, it will be created automatically.

        Returns:
            Path: Path object pointing to the TXT storage directory
        """
        # Get the parent directory (app/)
        current_dir = Path(__file__).parent.parent

        # Create path to documents/txts/
        docs_dir = current_dir / "documents" / "txts"

        # Create directory if it doesn't exist (parents=True creates parent dirs too)
        docs_dir.mkdir(parents=True, exist_ok=True)

        return docs_dir

    def _initialize_components(self):
        """
        Initialize OpenAI components (embeddings model + LLM).

        This method sets up:
        1. OpenAI Embeddings - Converts text to vector embeddings
        2. GPT LLM - Generates natural language answers

        Raises:
            Exception: If OpenAI initialization fails (e.g., invalid API key)
        """
        try:
            # =================================================================
            # Initialize OpenAI Embeddings Model
            # =================================================================
            # This model converts text into numerical vectors (embeddings)
            # that capture semantic meaning. Similar texts have similar vectors.
            self.embeddings = OpenAIEmbeddings(
                model=settings.OPENAI_EMBEDDING_MODEL,  # OpenAI embedding model
            )
            logger.info(f"OpenAI embeddings initialized: model={settings.OPENAI_EMBEDDING_MODEL}")

            # =================================================================
            # Initialize GPT LLM (Large Language Model)
            # =================================================================
            # This is the AI model that generates natural language answers
            # based on the context retrieved from documents
            self.llm = ChatOpenAI(
                model=settings.OPENAI_MODEL_ID,  # GPT model
                temperature=0.7,    # Controls randomness (0=deterministic, 1=creative)
                max_tokens=1000     # Maximum length of generated response
            )
            logger.info(f"ChatOpenAI initialized: model={settings.OPENAI_MODEL_ID}")

        except Exception as e:
            logger.error(f"Failed to initialize OpenAI components: {e}")
            raise

    def _load_documents(self):
        """
        Load TXT documents and create vector store for similarity search.

        This method implements the core RAG indexing pipeline:
        1. Find all TXT files in the documents directory
        2. Load each TXT file
        3. Split documents into smaller chunks (for better retrieval)
        4. Generate embeddings for each chunk
        5. Store embeddings in FAISS vector database
        6. Create a retriever for similarity search

        If no TXT files are found, the system will still initialize but won't be
        able to answer questions until documents are added.

        Raises:
            Exception: If there's an error during document loading or indexing
        """
        try:
            # =================================================================
            # Step 1: Find TXT Files
            # =================================================================
            txt_files = list(self.documents_directory.glob("*.txt"))

            # Check if any TXT files exist
            if not txt_files:
                logger.warning(f"No TXT files found in {self.documents_directory}")
                logger.info(f"Please add TXT files to: {self.documents_directory}")
                return  # Exit early if no documents to process

            logger.info(f"Loading {len(txt_files)} TXT files from {self.documents_directory}")

            # =================================================================
            # Step 2: Load TXT Documents
            # =================================================================
            documents = []

            # Process each TXT file
            for txt_file in txt_files:
                try:
                    # Read the text file content
                    loader = TextLoader(str(txt_file), encoding='utf-8')
                    docs = loader.load()

                    # Add to documents list
                    documents.extend(docs)

                    logger.info(f"Loaded {txt_file.name}")
                except Exception as e:
                    # Log error but continue with other files
                    logger.error(f"Error loading {txt_file.name}: {e}")

            # Check if any documents were successfully loaded
            if not documents:
                logger.error("No documents were successfully loaded")
                return

            # =================================================================
            # Step 3: Split Documents into Chunks
            # =================================================================
            # Documents are split into smaller chunks for better retrieval.
            # Why? Because:
            # 1. Embeddings work better on focused content
            # 2. We can retrieve only relevant sections (not entire documents)
            # 3. LLM context windows have size limits
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,       # Each chunk is ~500 characters (smaller for lean docs)
                chunk_overlap=100,    # 100 char overlap between chunks
                length_function=len,
            )
            splits = text_splitter.split_documents(documents)
            logger.info(f"Split documents into {len(splits)} chunks")

            # =================================================================
            # Step 4: Create Vector Store (FAISS)
            # =================================================================
            # Convert text chunks to vectors and store them
            # FAISS (Facebook AI Similarity Search) is an efficient vector database
            self.vector_store = FAISS.from_documents(
                splits,            # Document chunks to index
                self.embeddings    # Embedding model to convert text → vectors
            )

            # =================================================================
            # Step 5: Create Retriever
            # =================================================================
            # A retriever finds the most similar documents to a given query
            self.retriever = self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3}     # Return top 3 most similar chunks
            )
            logger.info("Vector store created successfully")

        except Exception as e:
            logger.error(f"Error loading documents: {e}")
            raise

    def _ensure_initialized(self):
        """
        Ensure documents are loaded before processing requests.

        This method implements lazy initialization - documents are only loaded
        when first needed, not during app startup. This allows the server to
        start quickly and respond to health checks immediately.

        If documents haven't been loaded yet, this loads them now.
        Subsequent calls will skip loading since documents are already in memory.
        """
        # If already loaded, do nothing
        if self.vector_store is not None:
            return

        # Prevent multiple simultaneous loads
        if self._is_loading:
            raise Exception("Documents are currently being loaded. Please try again in a moment.")

        # If we already tried and failed, don't keep retrying automatically
        if self._load_attempted and self.vector_store is None:
            raise Exception("Document loading failed previously. Please use /reload endpoint to retry.")

        # Load documents now
        try:
            self._is_loading = True
            self._load_attempted = True
            logger.info("Loading documents on first use...")
            self._load_documents()
        finally:
            self._is_loading = False

    def answer_question(self, question: str) -> Dict[str, Any]:
        """
        Answer a question using RAG (Retrieval Augmented Generation).

        This is the main RAG inference pipeline:
        1. Ensure documents are loaded (lazy initialization)
        2. Retrieve relevant document chunks based on question
        3. Build context from retrieved chunks
        4. Create a prompt with context + question
        5. Generate answer using Claude LLM
        6. Return answer with source citations

        Args:
            question (str): The user's question

        Returns:
            Dict[str, Any]: Response containing:
                - answer (str): Generated answer
                - sources (list): List of source documents with metadata
                - context_used (str): The context that was provided to the LLM

        Raises:
            Exception: If there's an error during question answering
        """
        try:
            # =================================================================
            # Ensure Documents are Loaded (Lazy Initialization)
            # =================================================================
            self._ensure_initialized()

            # =================================================================
            # Check if System is Initialized
            # =================================================================
            if not self.retriever:
                return {
                    "answer": "The document system is not initialized. Please check that documents are available.",
                    "sources": [],
                    "context_used": ""
                }

            # =================================================================
            # Step 1: Retrieve Relevant Documents
            # =================================================================
            # Use semantic search to find the most relevant document chunks
            # The retriever converts the question to a vector and finds
            # the closest vectors in the FAISS index
            relevant_docs = self.retriever.invoke(question)

            # Check if any relevant documents were found
            if not relevant_docs:
                return {
                    "answer": "I couldn't find relevant information in the documents to answer your question.",
                    "sources": [],
                    "context_used": ""
                }

            # =================================================================
            # Step 2: Build Context from Retrieved Documents
            # =================================================================
            # Combine all retrieved document chunks into a single context string
            # Each document's content is separated by double newlines
            context = "\n\n".join([doc.page_content for doc in relevant_docs])

            # =================================================================
            # Step 3: Create Prompt for LLM
            # =================================================================
            # This is the instruction + context + question that we send to Claude
            # The prompt engineering is important - we tell the model to:
            # 1. Act as a helpful assistant
            # 2. Use only the provided context
            # 3. Admit if it can't answer based on context
            prompt_template = """You are a helpful AI assistant. Use the following context to answer the question.
If you cannot answer the question based on the context, say so.

Context:
{context}

Question: {question}

Answer: """

            # =================================================================
            # Step 4: Generate Answer using Claude LLM
            # =================================================================
            # Fill in the template with our context and question
            prompt = prompt_template.format(context=context, question=question)

            # Send prompt to Claude and get response
            response = self.llm.invoke(prompt)

            # Extract the text content from response
            answer = response.content.strip()

            # =================================================================
            # Step 5: Extract Source Information
            # =================================================================
            # Build a list of sources so users can verify the answer
            # Each source includes: filename and content preview
            sources = []
            for doc in relevant_docs:
                source_info = {
                    "file": doc.metadata.get("source", "Unknown"),       # TXT filename
                    "content_preview": doc.page_content[:200] + "..."   # First 200 chars
                }
                sources.append(source_info)

            # =================================================================
            # Return Complete Response
            # =================================================================
            return {
                "answer": answer,
                "sources": sources,
                # Include context preview (first 500 chars) for transparency
                "context_used": context[:500] + "..." if len(context) > 500 else context
            }

        except Exception as e:
            logger.error(f"Error answering question: {e}")
            raise

    def get_system_status(self) -> Dict[str, Any]:
        """
        Get the current system status and configuration.

        Useful for debugging and monitoring. Shows:
        - Where TXT documents are stored
        - How many TXT files are loaded
        - Which AI models are being used
        - Whether the vector store is initialized

        Returns:
            Dict[str, Any]: System status information
        """
        # Get list of all TXT files in the directory
        txt_files = list(self.documents_directory.glob("*.txt"))

        return {
            "documents_directory": str(self.documents_directory),   # Path to TXT storage
            "num_documents": len(txt_files),                        # Number of TXT files found
            "document_files": [f.name for f in txt_files],          # List of TXT filenames
            "vector_store_initialized": self.vector_store is not None,  # Is system ready?
            "embeddings_model": settings.OPENAI_EMBEDDING_MODEL,    # Embedding model name
            "llm_model": settings.OPENAI_MODEL_ID                   # LLM model name
        }

    def reload_documents(self) -> Dict[str, Any]:
        """
        Reload all documents and rebuild the vector store.

        Use this when:
        - New TXT files have been added to the documents folder
        - Existing TXT files have been modified or edited
        - You want to refresh the index with updated content
        - Previous initialization failed and you want to retry

        This will re-run the entire indexing pipeline:
        1. Find all TXT files
        2. Load them
        3. Split into chunks
        4. Generate embeddings
        5. Rebuild FAISS index

        Returns:
            Dict[str, Any]: Status message and updated system status

        Raises:
            Exception: If there's an error during reload
        """
        try:
            # Reset flags to allow reload even if previous load failed
            self._is_loading = False
            self._load_attempted = False

            # Re-run the document loading pipeline
            self._load_documents()

            # Return success message with updated system status
            return {
                "message": "Documents reloaded successfully",
                **self.get_system_status()  # Include current status
            }
        except Exception as e:
            logger.error(f"Error reloading documents: {e}")
            raise


# =============================================================================
# Create Singleton Instance
# =============================================================================
# Create a single instance of ChatService that will be used throughout the app
# This ensures:
# 1. Documents are loaded only once when the app starts
# 2. Vector store is shared across all API requests
# 3. No need to reinitialize on every request (much faster!)
chat_service = ChatService()
