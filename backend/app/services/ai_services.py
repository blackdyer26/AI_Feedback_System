import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

class AIService:
    @staticmethod
    def analyze_sentiment(review_text: str, rating: int) -> str:
        """
        Analyze sentiment from review text and rating.
        Returns: positive, negative, neutral, or sarcasm
        """
        try:
            prompt = f"""Analyze the sentiment of this review (rating: {rating}/5):
"{review_text}"

Classify as one of: positive, negative, neutral, sarcasm

Consider:
- Rating vs text mismatch may indicate sarcasm
- Tone and word choice
- Overall emotion

Return ONLY one word: positive, negative, neutral, or sarcasm"""

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a sentiment analysis expert for e-commerce feedback."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=10,
                temperature=0.3
            )
            
            sentiment = response.choices[0].message.content.strip().lower()
            
            # Validate sentiment
            valid_sentiments = ["positive", "negative", "neutral", "sarcasm"]
            if sentiment not in valid_sentiments:
                # Fallback based on rating
                if rating >= 4:
                    return "positive"
                elif rating <= 2:
                    return "negative"
                else:
                    return "neutral"
            
            return sentiment
            
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            # Fallback based on rating
            if rating >= 4:
                return "positive"
            elif rating <= 2:
                return "negative"
            else:
                return "neutral"

    @staticmethod
    def generate_user_response(review_text: str, rating: int, sentiment: str) -> str:
        """
        Generate contextual AI response for the user based on sentiment.
        """
        try:
            sentiment_templates = {
                "positive": "Thank you for your wonderful feedback! We're thrilled to hear about your positive experience with Fynd. Your satisfaction is our top priority, and we look forward to serving you again!",
                "negative": "We sincerely apologize for your disappointing experience. Your feedback is invaluable to us, and we'll be more careful next time. Our team will review this immediately to ensure we improve. Please contact our support team so we can make this right.",
                "neutral": "Thank you for taking the time to share your feedback. We appreciate your honest review and are always working to improve our services. If there's anything specific we can help with, please let us know!",
                "sarcasm": "We appreciate your feedback and understand your concerns. We take all reviews seriously and would like to address any issues you've experienced. Our team is committed to improving, and we'd love the opportunity to make things right."
            }
            
            base_response = sentiment_templates.get(sentiment, sentiment_templates["neutral"])
            
            # Add personalized touch using AI
            prompt = f"""Create a brief, empathetic response to this {sentiment} review (rating: {rating}/5):
"{review_text}"

Base response: {base_response}

Enhance it to be more personal and specific to their feedback. Keep it under 100 words, professional, and action-oriented."""

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a customer service expert for Fynd e-commerce platform."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating user response: {e}")
            # Fallback to template
            sentiment_templates = {
                "positive": "Thank you for your wonderful feedback! We're thrilled to hear about your positive experience with Fynd.",
                "negative": "We sincerely apologize for your experience. We'll be more careful next time and work to improve.",
                "neutral": "Thank you for your feedback. We appreciate your input and are always working to improve.",
                "sarcasm": "We appreciate your feedback and take all reviews seriously. We're committed to improving your experience."
            }
            return sentiment_templates.get(sentiment, "Thank you for your feedback!")

    @staticmethod
    def generate_summary(review_text: str, rating: int) -> str:
        """
        Generate a concise summary for admin dashboard.
        """
        try:
            prompt = f"""Summarize this customer review (rating: {rating}/5) in one concise sentence:
"{review_text}"

Focus on the key point or main concern/praise."""

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert at summarizing customer feedback."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                temperature=0.5
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating summary: {e}")
            return f"Customer rated {rating}/5 stars: {review_text[:100]}..."

    @staticmethod
    def generate_recommendations(review_text: str, rating: int, sentiment: str) -> str:
        """
        Generate actionable business recommendations based on the review.
        """
        try:
            prompt = f"""Based on this {sentiment} review (rating: {rating}/5):
"{review_text}"

Provide 2-3 specific, actionable recommendations for the business to:
1. Address the feedback
2. Improve customer experience
3. Prevent similar issues (if negative) or replicate success (if positive)

Be concise and practical."""

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a business consultant specializing in e-commerce customer experience."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            # Fallback recommendations
            if sentiment == "positive":
                return "1. Share positive feedback with team\n2. Maintain current service quality\n3. Request customer testimonial"
            elif sentiment == "negative":
                return "1. Contact customer immediately\n2. Investigate root cause\n3. Implement corrective measures"
            else:
                return "1. Follow up with customer for more details\n2. Monitor for patterns\n3. Continue service improvements"