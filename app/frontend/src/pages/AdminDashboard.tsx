import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StarRating } from '@/components/StarRating';
import { SentimentBadge } from '@/components/SentimentBadge';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api';
import { Search, Download, RefreshCw, Users, Star, TrendingUp, MessageSquare } from 'lucide-react';
import { KailyChat } from '@/components/KailyChat';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FyndLogo, FyndLogoBlack } from "../assets/logo/";

const COLORS = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#F59E0B',
  sarcasm: '#8B5CF6',
};

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch reviews
  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', ratingFilter, sentimentFilter, searchQuery],
    queryFn: () =>
      reviewsApi.getAll({
        rating: ratingFilter !== 'all' ? parseInt(ratingFilter) : undefined,
        sentiment: sentimentFilter !== 'all' ? sentimentFilter : undefined,
        search: searchQuery || undefined,
      }),
    refetchInterval: autoRefresh ? 30000 : false,
  });

  // Fetch analytics
  const { data: analyticsData, refetch: refetchAnalytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: reviewsApi.getAnalytics,
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const handleExport = () => {
    if (!reviewsData?.reviews) return;

    const csv = [
      ['ID', 'Rating', 'Review', 'Sentiment', 'AI Summary', 'Recommended Actions', 'Created At'],
      ...reviewsData.reviews.map((review) => [
        review.id,
        review.rating,
        `"${review.review_text.replace(/"/g, '""')}"`,
        review.sentiment,
        `"${review.ai_summary.replace(/"/g, '""')}"`,
        `"${review.recommended_actions.replace(/"/g, '""')}"`,
        new Date(review.created_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fynd-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleRefresh = () => {
    refetchReviews();
    refetchAnalytics();
  };

  const sentimentChartData = analyticsData
    ? Object.entries(analyticsData.sentiment_distribution).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    : [];

  const ratingChartData = analyticsData
    ? Object.entries(analyticsData.rating_distribution).map(([rating, count]) => ({
        rating: `${rating} ★`,
        count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <KailyChat />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={FyndLogoBlack} alt="Fynd" className="h-8" />
            <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Analytics Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-2 border-indigo-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {analyticsData?.total_reviews || 0}
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {analyticsData?.average_rating.toFixed(1) || '0.0'}
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Positive Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {analyticsData?.sentiment_distribution.positive || 0}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {reviewsData?.reviews.slice(0, 5).length || 0}
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>Breakdown of customer sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Number of reviews by star rating</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Table */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Reviews</CardTitle>
                <CardDescription>
                  {reviewsData?.total || 0} total reviews
                  {autoRefresh && ' • Auto-refreshing every 30 seconds'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={autoRefresh ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="sarcasm">Sarcasm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead className="w-32">Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead className="w-32">Sentiment</TableHead>
                    <TableHead>AI Summary</TableHead>
                    <TableHead>Recommended Actions</TableHead>
                    <TableHead className="w-40">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewsData?.reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">#{review.id}</TableCell>
                      <TableCell>
                        <StarRating rating={review.rating} readonly size="sm" />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2 text-sm">{review.review_text}</p>
                      </TableCell>
                      <TableCell>
                        <SentimentBadge sentiment={review.sentiment} />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2 text-sm text-gray-600">{review.ai_summary}</p>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2 text-sm text-gray-600">{review.recommended_actions}</p>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {reviewsData?.reviews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reviews found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
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