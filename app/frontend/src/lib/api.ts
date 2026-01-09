import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ReviewCreate {
  rating: number;
  review_text: string;
}

export interface Review {
  id: number;
  rating: number;
  review_text: string;
  sentiment: string;
  ai_response: string;
  ai_summary: string;
  recommended_actions: string;
  created_at: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
}

export interface AnalyticsResponse {
  total_reviews: number;
  average_rating: number;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
    sarcasm: number;
  };
  rating_distribution: {
    [key: string]: number;
  };
}

export const reviewsApi = {
  create: async (data: ReviewCreate): Promise<Review> => {
    const response = await api.post<Review>('/api/reviews', data);
    return response.data;
  },

  getAll: async (params?: {
    skip?: number;
    limit?: number;
    rating?: number;
    sentiment?: string;
    search?: string;
  }): Promise<ReviewListResponse> => {
    const response = await api.get<ReviewListResponse>('/api/reviews', { params });
    return response.data;
  },

  getAnalytics: async (): Promise<AnalyticsResponse> => {
    const response = await api.get<AnalyticsResponse>('/api/analytics');
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; service: string }> => {
    const response = await api.get('/api/health');
    return response.data;
  },
};