"""
ConversationTurn model
=======================
One row per Q+A turn, keyed by a client-generated session_id, so a
chat session's history can be reloaded after a page refresh.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, DateTime, Index

from app.core.db import Base


class ConversationTurn(Base):
    __tablename__ = "conversation_turns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(64), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    sources_json = Column(Text, nullable=False, default="[]")
    action_json = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("ix_conversation_turns_session_id", "session_id"),
    )
