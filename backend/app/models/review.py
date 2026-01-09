from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database.connection import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text, nullable=False)
    sentiment = Column(String(20), nullable=False)
    ai_response = Column(Text, nullable=False)
    ai_summary = Column(Text, nullable=False)
    recommended_actions = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())