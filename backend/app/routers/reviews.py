from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database.connection import get_db
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewListResponse, AnalyticsResponse
from app.services.ai_services import AIService
from typing import Optional

router = APIRouter(prefix="/api", tags=["reviews"])

@router.post("/reviews", response_model=ReviewResponse)
async def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    """
    Submit a new review with AI analysisS.
    """
    try:
        # Perform AI analysis
        sentiment = AIService.analyze_sentiment(review.review_text, review.rating)
        ai_response = AIService.generate_user_response(review.review_text, review.rating, sentiment)
        ai_summary = AIService.generate_summary(review.review_text, review.rating)
        recommended_actions = AIService.generate_recommendations(review.review_text, review.rating, sentiment)
        
        # Create review record
        db_review = Review(
            rating=review.rating,
            review_text=review.review_text,
            sentiment=sentiment,
            ai_response=ai_response,
            ai_summary=ai_summary,
            recommended_actions=recommended_actions
        )
        
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        
        return db_review
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing review: {str(e)}")

@router.get("/reviews", response_model=ReviewListResponse)
async def get_reviews(
    skip: int = 0,
    limit: int = 100,
    rating: Optional[int] = None,
    sentiment: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all reviews with optional filters.
    """
    try:
        query = db.query(Review)
        
        # Apply filters
        if rating is not None:
            query = query.filter(Review.rating == rating)
        
        if sentiment:
            query = query.filter(Review.sentiment == sentiment)
        
        if search:
            query = query.filter(Review.review_text.ilike(f"%{search}%"))
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        reviews = query.order_by(desc(Review.created_at)).offset(skip).limit(limit).all()
        
        return ReviewListResponse(reviews=reviews, total=total)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reviews: {str(e)}")

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(db: Session = Depends(get_db)):
    """
    Get analytics data for admin dashboard.
    """
    try:
        # Total reviews
        total_reviews = db.query(func.count(Review.id)).scalar()
        
        # Average rating
        avg_rating = db.query(func.avg(Review.rating)).scalar() or 0.0
        
        # Sentiment distribution
        sentiment_counts = db.query(
            Review.sentiment,
            func.count(Review.id)
        ).group_by(Review.sentiment).all()
        
        sentiment_distribution = {
            "positive": 0,
            "negative": 0,
            "neutral": 0,
            "sarcasm": 0
        }
        for sentiment, count in sentiment_counts:
            sentiment_distribution[sentiment] = count
        
        # Rating distribution
        rating_counts = db.query(
            Review.rating,
            func.count(Review.id)
        ).group_by(Review.rating).all()
        
        rating_distribution = {str(i): 0 for i in range(1, 6)}
        for rating, count in rating_counts:
            rating_distribution[str(rating)] = count
        
        return AnalyticsResponse(
            total_reviews=total_reviews,
            average_rating=round(avg_rating, 2),
            sentiment_distribution=sentiment_distribution,
            rating_distribution=rating_distribution
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "service": "Fynd AI Feedback System"}