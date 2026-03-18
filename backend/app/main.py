"""
FastAPI Application - RAG Chat System
======================================
This is the main application entry point that sets up the FastAPI server.

The application provides a RESTful API for:
- Asking questions about PDF documents using RAG (Retrieval Augmented Generation)
- Managing the document index
- Health checks and system status

To run the server:
    uvicorn app.main:app --reload --port 8000

Or use the provided script:
    ./start_backend.sh
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router

# =============================================================================
# Logging Configuration
# =============================================================================
# Configure logging for the entire application
# Format: timestamp [log_level] logger_name: message
# Example: 2026-03-05 10:30:45 [INFO] app.services.chat_service: Vector store created successfully
logging.basicConfig(
    level=logging.INFO,  # Show INFO level and above (INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)


# =============================================================================
# Application Lifespan Management
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.

    This async context manager handles startup and shutdown events.

    Startup (before yield):
    - Logs application startup
    - Can be used to initialize resources (database connections, etc.)
    - In our case, chat_service is initialized on import (singleton pattern)

    Shutdown (after yield):
    - Logs application shutdown
    - Clean up resources if needed

    Args:
        app (FastAPI): The FastAPI application instance

    Yields:
        None: Control flow returns here during application lifetime
    """
    # =========================================================================
    # Startup Phase
    # =========================================================================
    logger.info("Application starting up")
    # Note: chat_service initializes automatically when imported
    # It loads PDFs and creates vector store during import

    # Yield control back to FastAPI to run the application
    yield

    # =========================================================================
    # Shutdown Phase
    # =========================================================================
    logger.info("Application shutting down")
    # Add cleanup code here if needed (close connections, save state, etc.)


# =============================================================================
# Application Factory
# =============================================================================

def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.

    This factory pattern allows:
    - Easy testing (create test app with different settings)
    - Multiple app instances if needed
    - Clean separation of app creation and configuration

    Returns:
        FastAPI: Configured FastAPI application instance
    """

    # =========================================================================
    # Create FastAPI App Instance
    # =========================================================================
    app = FastAPI(
        title=settings.APP_NAME,                # Shown in API docs
        description=settings.APP_DESCRIPTION,   # Shown in API docs
        version=settings.APP_VERSION,           # Shown in API docs
        debug=settings.DEBUG,                   # Enable debug mode if configured
        lifespan=lifespan,                      # Attach lifespan manager
    )

    # =========================================================================
    # Add CORS Middleware
    # =========================================================================
    # CORS (Cross-Origin Resource Sharing) allows your frontend (running on
    # a different domain/port) to make requests to this API
    #
    # Example: If your React app runs on http://localhost:3000 and your API
    # runs on http://localhost:8000, CORS allows the React app to call the API
    #
    # Without CORS, browsers block cross-origin requests for security
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,              # Which domains can access
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS, # Allow cookies/auth
        allow_methods=settings.CORS_ALLOW_METHODS,        # Which HTTP methods
        allow_headers=settings.CORS_ALLOW_HEADERS,        # Which headers
    )

    # =========================================================================
    # Include API Router
    # =========================================================================
    # Mount all API routes under the configured prefix (default: /api/v1)
    # This includes:
    # - /api/v1/chat/ask - Ask questions
    # - /api/v1/chat/status - System status
    # - /api/v1/chat/reload - Reload documents
    # - /api/v1/health - Health check
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    # =========================================================================
    # Root Endpoint
    # =========================================================================
    @app.get("/", tags=["root"])
    async def root():
        """
        Root endpoint - welcome message and API information.

        Returns basic information about the API:
        - Application name and version
        - Link to interactive API documentation
        - Link to health check endpoint

        Example Response:
        {
            "message": "Welcome to RAG Chat System!",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/api/v1/health"
        }
        """
        return {
            "message": f"Welcome to {settings.APP_NAME}!",
            "version": settings.APP_VERSION,
            "docs": "/docs",                              # Interactive API docs (Swagger UI)
            "health": f"{settings.API_V1_PREFIX}/health"  # Health check endpoint
        }

    # =========================================================================
    # Root-level Health Check
    # =========================================================================
    @app.get("/health", tags=["health"])
    async def root_health():
        """
        Root-level health check endpoint.

        This is a simple endpoint that returns {"status": "ok"} if the
        server is running and responding.

        Useful for:
        - Load balancers to check if server is alive
        - Monitoring systems to detect downtime
        - Quick sanity check that API is accessible

        Note: There's also /api/v1/health which provides more detailed info
        """
        return {"status": "ok"}

    # Return the fully configured application
    return app


# =============================================================================
# Create Application Instance
# =============================================================================
# This is what uvicorn loads: `uvicorn app.main:app`
# The app is created once when the module is imported
app = create_application()

# =============================================================================
# How This Works
# =============================================================================
# 1. When you run: uvicorn app.main:app --reload
# 2. Uvicorn imports this module (app/main.py)
# 3. create_application() is called, which:
#    - Creates FastAPI instance
#    - Adds CORS middleware
#    - Includes API routes
#    - Defines root endpoints
# 4. The lifespan manager runs:
#    - Logs "Application starting up"
#    - chat_service loads PDFs and creates vector store (on import)
# 5. Server starts listening on configured HOST:PORT
# 6. API is now ready to receive requests!
#
# When you stop the server (Ctrl+C):
# 1. Lifespan manager cleanup runs
# 2. Logs "Application shutting down"
# 3. Server stops gracefully
