"""
SQLite persistence for chat conversation history.
==================================================
Lightweight session-history storage — one row per Q+A turn — so the
chatbot can recall a conversation across a page reload. Deliberately
minimal (SQLite, no migrations framework) to match the rest of this
project's stack.
"""
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_PATH = Path(__file__).parent.parent / "data" / "chat_history.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def init_db() -> None:
    """Create tables that don't exist yet. Safe to call on every startup."""
    from app.models.conversation import ConversationTurn  # noqa: F401
    Base.metadata.create_all(bind=engine)
