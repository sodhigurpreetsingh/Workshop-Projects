"""
Application Configuration
=========================
This module defines all application settings using Pydantic Settings.

Configuration is loaded from:
1. Environment variables
2. .env file (if present)
3. Default values defined below

Pydantic automatically:
- Validates data types
- Loads from .env file
- Provides type hints for IDE support
- Ensures required settings are present
"""
from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application Settings

    All settings can be overridden via environment variables or .env file.
    Setting names are case-sensitive and must match exactly.

    Example .env file:
        APP_NAME="My RAG System"
        DEBUG=true
        AWS_REGION="us-west-2"
    """

    # =========================================================================
    # Application Settings
    # =========================================================================
    APP_NAME: str = "RAG Chat System"
    """Application name displayed in API docs and responses"""

    APP_VERSION: str = "1.0.0"
    """Application version (semantic versioning)"""

    APP_DESCRIPTION: str = "AI-powered RAG-based Chat with PDF Documents"
    """Application description shown in API documentation"""

    DEBUG: bool = True
    """
    Enable debug mode.
    When True:
    - More detailed error messages
    - Auto-reload on code changes (with --reload flag)
    - Additional logging
    Set to False in production!
    """

    # =========================================================================
    # Server Settings
    # =========================================================================
    HOST: str = "127.0.0.1"
    """
    Server host address.
    - "127.0.0.1" = localhost only (secure, local development)
    - "0.0.0.0" = all network interfaces (accessible from other machines)
    """

    PORT: int = 8000
    """Server port number (default: 8000)"""

    # =========================================================================
    # CORS Settings (Cross-Origin Resource Sharing)
    # =========================================================================
    # CORS controls which web origins can access your API
    # Important when your frontend and backend are on different domains

    CORS_ORIGINS: List[str] = ["*"]
    """
    List of allowed origins (domains) that can access the API.
    Examples:
    - ["*"] = Allow all origins (development only!)
    - ["http://localhost:3000"] = Allow only your React app
    - ["https://myapp.com", "https://www.myapp.com"] = Production domains
    """

    CORS_ALLOW_CREDENTIALS: bool = True
    """
    Allow cookies and authentication headers in cross-origin requests.
    Set to True if your frontend needs to send cookies or auth tokens.
    """

    CORS_ALLOW_METHODS: List[str] = ["*"]
    """
    Allowed HTTP methods in cross-origin requests.
    ["*"] = all methods (GET, POST, PUT, DELETE, etc.)
    Or specify: ["GET", "POST"] for specific methods
    """

    CORS_ALLOW_HEADERS: List[str] = ["*"]
    """
    Allowed headers in cross-origin requests.
    ["*"] = all headers
    Or specify: ["Content-Type", "Authorization"]
    """

    # =========================================================================
    # API Settings
    # =========================================================================
    API_V1_PREFIX: str = "/api/v1"
    """
    API version prefix for all routes.
    Example: With prefix "/api/v1", the chat endpoint becomes:
    /api/v1/chat/ask (instead of just /chat/ask)

    Benefits:
    - Version your API (v1, v2, etc.)
    - Group all API endpoints under one prefix
    - Keep root path (/) available for landing page
    """

    # =========================================================================
    # OpenAI Configuration
    # =========================================================================
    # OpenAI provides access to GPT models and embeddings
    # You need an OpenAI API key from platform.openai.com

    OPENAI_API_KEY: Optional[str] = None
    """
    OpenAI API Key for authentication.
    Required for OpenAI API access.

    How to get:
    1. Go to platform.openai.com
    2. Sign in or create an account
    3. Go to API Keys section
    4. Create a new API key

    Security: Never commit this to git! Use .env file instead.
    """

    OPENAI_MODEL_ID: str = "gpt-4o-mini"
    """
    OpenAI model ID for answer generation.

    Available models:
    - "gpt-4o-mini" (Fast, cost-effective, recommended)
    - "gpt-4o" (Most capable)
    - "gpt-3.5-turbo" (Budget-friendly)

    See: https://platform.openai.com/docs/models
    """

    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    """
    OpenAI embedding model for document vectorization.

    Available models:
    - "text-embedding-3-small" (Fast, cost-effective)
    - "text-embedding-3-large" (Better quality, higher cost)
    - "text-embedding-ada-002" (Legacy model)

    See: https://platform.openai.com/docs/guides/embeddings
    """

    # =========================================================================
    # Configuration Metadata
    # =========================================================================
    class Config:
        """Pydantic configuration"""

        env_file = ".env"
        """Load settings from .env file if it exists"""

        case_sensitive = True
        """Environment variable names must match exactly (case-sensitive)"""


# =============================================================================
# Settings Instance with Caching
# =============================================================================

@lru_cache
def get_settings() -> Settings:
    """
    Get application settings (cached).

    Uses lru_cache decorator to create settings only once and reuse.
    This is more efficient than creating Settings() on every import.

    Returns:
        Settings: Cached settings instance

    Example:
        from app.core.config import settings
        print(settings.APP_NAME)
        print(settings.AWS_REGION)
    """
    return Settings()


# Create a single cached instance that can be imported everywhere
settings = get_settings()
"""
Global settings instance (cached).

Import this in your code:
    from app.core.config import settings

Usage:
    settings.APP_NAME
    settings.AWS_ACCESS_KEY_ID
    settings.BEDROCK_MODEL_ID
"""
