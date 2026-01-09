# Fynd AI Feedback System

## Development Tasks

### Phase 1: Project Setup & Backend Foundation
1. **Backend Directory Structure** - Create FastAPI backend with proper folder structure (app/, models/, schemas/, routers/, services/, database/)
2. **Pydantic Schemas** - Define request/response schemas with validation
3. **Database Connection** - Setup PostgreSQL connection with SQLAlchemy engine and session management
4. **API Endpoints** - Create RESTful endpoints: POST /api/reviews (submit), GET /api/reviews (fetch all), GET /api/health (health check), GET /api/analytics (dashboard stats)
5. **AI Service Integration** - Implement server-side LLM calls for sentiment analysis, review summarization, recommended actions, user responses
6. **Error Handling** - Implement comprehensive error handling and validation
7. **CORS Configuration** - Setup CORS middleware for frontend communication

### Phase 2: Frontend - Landing Page
1. **Landing Page Layout** - Create hero section with Fynd branding, navigation header with logo, feature highlights section, call-to-action buttons
2. **Navigation Component** - Header with Fynd logo, links to User Dashboard and Admin Dashboard
3. **Hero Section** - Gradient background, compelling headline about AI feedback system, description of features, dual CTA buttons (Submit Feedback / Admin Login)
4. **Features Section** - Showcase key features: AI-powered analysis, Real-time insights, Sentiment detection, Actionable recommendations
5. **Kaily Chatbot Integration** - Embed Kaily widget on landing page

### Phase 3: Frontend - User Dashboard
1. **User Dashboard Layout** - Clean, user-friendly interface with Fynd branding
2. **Star Rating Component** - Interactive 5-star rating selector with hover effects
3. **Review Form** - Text area for review input with character count, validation for empty/long reviews
4. **Submit Button** - Primary action button with loading states
5. **Sentiment Indicator** - Visual indicator (emoji/badge) showing detected sentiment
6. **Success/Error States** - Toast notifications and modal displays for submission results
7. **Kaily Chatbot** - Embed chatbot for user assistance

### Phase 4: Frontend - Admin Dashboard
1. **Admin Dashboard Layout** - Professional analytics interface with sidebar navigation
2. **Analytics Overview Cards** - Display total reviews, average rating, sentiment distribution, recent activity
3. **Review List Component** - Table/card view showing all reviews with rating, review text, sentiment, AI summary, recommended actions, timestamp
4. **Auto-Refresh Functionality** - Implement polling or WebSocket for live updates (every 30 seconds)
5. **Filter Controls** - Dropdown filters for rating (1-5) and sentiment (positive/negative/neutral/sarcasm)
6. **Search Functionality** - Search bar to find reviews by text content
7. **Sentiment Visualization** - Pie chart showing sentiment distribution
8. **Rating Distribution Chart** - Bar chart showing rating counts (1-5 stars)
9. **Trends Chart** - Line chart showing review submissions over time
10. **Export Functionality** - Button to export data as CSV/JSON

### Phase 5: Backend - AI Integration Details
1. **Sentiment Analysis Service** - Implement NLP-based sentiment detection (positive/negative/neutral/sarcasm)
2. **Contextual Response Generator** - Generate appropriate user-facing responses based on sentiment
3. **Review Summarization** - Create concise summaries for admin dashboard
4. **Action Recommendations** - Generate actionable business recommendations
5. **Graceful Fallback** - Handle LLM API failures with default responses

### Phase 6: API Integration & State Management
1. **API Client Setup** - Create axios instance with base URL configuration
2. **React Query Setup** - Implement data fetching and caching with TanStack Query
3. **Form State Management** - Handle form submissions with proper validation
4. **Error Boundary** - Implement error boundaries for graceful error handling
5. **Loading States** - Add skeleton loaders and spinners for all async operations

### Phase 7: Deployment Configuration
1. **Backend Deployment (Render)** - Create render.yaml for FastAPI service, setup environment variables (DATABASE_URL, LLM_API_KEY), configure build and start commands
2. **Database Provisioning** - Setup PostgreSQL database on Render
3. **Frontend Deployment (Vercel/Render)** - Configure build settings, setup environment variables (VITE_API_URL), optimize production build
4. **Environment Variables** - Document all required environment variables
5. **Deployment Scripts** - Create deployment documentation and scripts
---

## Technical Stack Summary

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Recharts for data visualization
- Axios for API calls

### Backend
- FastAPI (Python)
- PostgreSQL database
- Pydantic for validation
- Server-side LLM integration
- CORS middleware

### Deployment
- Frontend: Render
- Backend: Render
- Database: PostgreSQL on Render

---

## API Endpoints Schema

### POST /api/reviews
Request:
```json
{
  "rating": 5,
  "review_text": "Great experience!"
}
```

Response:
```json
{
  "id": 1,
  "rating": 5,
  "review_text": "Great experience!",
  "sentiment": "positive",
  "ai_response": "Thank you for your wonderful feedback! We're thrilled to hear about your positive experience.",
  "ai_summary": "Customer expresses satisfaction with service",
  "recommended_actions": "Continue current service quality, share positive feedback with team",
  "created_at": "2026-01-07T10:30:00Z"
}
```

### GET /api/reviews
Response:
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "review_text": "Great experience!",
      "sentiment": "positive",
      "ai_summary": "Customer expresses satisfaction",
      "recommended_actions": "Maintain service quality",
      "created_at": "2026-01-07T10:30:00Z"
    }
  ],
  "total": 1
}
```

### GET /api/analytics
Response:
```json
{
  "total_reviews": 150,
  "average_rating": 4.2,
  "sentiment_distribution": {
    "positive": 80,
    "neutral": 45,
    "negative": 20,
    "sarcasm": 5
  },
  "rating_distribution": {
    "1": 10,
    "2": 15,
    "3": 25,
    "4": 40,
    "5": 60
  }
}
```
## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/dbname
LLM_API_KEY=your_llm_api_key
CORS_ORIGINS=https://fynd-feedback-system.onrender.com
```
---
Live : User : https://fynd-feedback-system.onrender.com
       Admin: https://fynd-feedback-system.onrender.com/admin
