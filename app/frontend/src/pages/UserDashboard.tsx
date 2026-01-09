import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/StarRating';
import { SentimentBadge } from '@/components/SentimentBadge';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { reviewsApi, Review } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { KailyChat } from '@/components/KailyChat';
import { FyndLogo, FyndLogoBlack } from "../assets/logo/";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittedReview, setSubmittedReview] = useState<Review | null>(null);

  const mutation = useMutation({
    mutationFn: reviewsApi.create,
    onSuccess: (data) => {
      setSubmittedReview(data);
      toast.success('Thank you for your feedback!');
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Failed to submit review. Please try again.';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    if (reviewText.length > 5000) {
      toast.error('Review is too long. Maximum 5000 characters.');
      return;
    }

    mutation.mutate({
      rating,
      review_text: reviewText,
    });
  };

  const handleReset = () => {
    setRating(0);
    setReviewText('');
    setSubmittedReview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <KailyChat />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={FyndLogoBlack} alt="Fynd" className="h-8" />
            <span className="text-xl font-bold text-gray-900">Customer Feedback</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {!submittedReview ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Share Your Experience</CardTitle>
                <CardDescription>
                  Your feedback helps us improve our services and serve you better.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      How would you rate your experience?
                    </label>
                    <div className="flex items-center gap-4">
                      <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                      {rating > 0 && (
                        <span className="text-sm text-gray-600">
                          {rating === 1 && 'Poor'}
                          {rating === 2 && 'Fair'}
                          {rating === 3 && 'Good'}
                          {rating === 4 && 'Very Good'}
                          {rating === 5 && 'Excellent'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tell us about your experience
                    </label>
                    <Textarea
                      placeholder="Share your thoughts, suggestions, or concerns..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {reviewText.length} / 5000 characters
                      </span>
                      {reviewText.length > 4500 && (
                        <span className="text-xs text-amber-600">
                          Approaching character limit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <Card className="shadow-lg border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">
                        Thank You for Your Feedback!
                      </h3>
                      <p className="text-green-800">
                        Your review has been successfully submitted and analyzed by our AI system.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Review */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Review</CardTitle>
                    <SentimentBadge sentiment={submittedReview.sentiment} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rating</label>
                    <div className="mt-1">
                      <StarRating rating={submittedReview.rating} readonly size="md" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Your Feedback</label>
                    <p className="mt-1 text-gray-900">{submittedReview.review_text}</p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Response */}
              <Card className="shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-indigo-600">AI Response</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative"
                    style={{
                      backgroundImage: `url('https://mgx-backend-cdn.metadl.com/generate/images/714998/2026-01-07/ebde2997-9b8e-4202-b28a-5b34cd5d68dd.png')`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'right',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.9,
                    }}
                  >
                    <p className="text-gray-900 leading-relaxed bg-white/80 p-4 rounded-lg backdrop-blur-sm">
                      {submittedReview.ai_response}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Submit Another Review
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={FyndLogo} alt="Fynd" className="h-8 brightness-0 invert" />
            <span className="text-lg font-semibold">Fynd AI Feedback System</span>
          </div>
          <p className="text-sm">
            © 2026 Shopsense Retail Technologies | Invented in India
          </p>
        </div>
      </footer>
    </div>
  );
}