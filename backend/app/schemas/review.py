from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")
    review_text: str = Field(..., min_length=1, max_length=5000, description="Review text")

    @field_validator('review_text')
    def validate_review_text(cls, v):
        if not v or v.strip() == "":
            raise ValueError("Review text cannot be empty")
        return v.strip()

class ReviewResponse(BaseModel):
    id: int
    rating: int
    review_text: str
    sentiment: str
    ai_response: str
    ai_summary: str
    recommended_actions: str
    created_at: datetime

    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    total_reviews: int
    average_rating: float
    sentiment_distribution: dict
    rating_distribution: dict

class ReviewListResponse(BaseModel):
    reviews: list[ReviewResponse]
    total: int