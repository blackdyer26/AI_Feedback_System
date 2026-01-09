import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BarChart3, Sparkles, TrendingUp } from 'lucide-react';
import { KailyChat } from '@/components/KailyChat';
import { FyndLogo, FyndLogoBlack } from "../assets/logo/";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <KailyChat />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={FyndLogoBlack} alt="Fynd" className="h-8" />
            <span className="text-xl font-bold text-gray-900">AI Feedback System</span>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/user')}>
              Submit Feedback
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://mgx-backend-cdn.metadl.com/generate/images/714998/2026-01-07/17ada00e-3a5d-4c12-9746-3772c9a786dc.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Customer Feedback with{' '}
              <span className="text-indigo-600">AI Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Powered by advanced NLP and sentiment analysis, our system helps you understand, respond to, and act on customer feedback in real-time.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => navigate('/user')}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Submit Your Feedback
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Intelligent Feedback Management
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered system analyzes every review to provide actionable insights and personalized responses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Advanced sentiment detection including positive, negative, neutral, and even sarcasm recognition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Responses</h3>
                <p className="text-gray-600 text-sm">
                  Contextual AI-generated responses that address customer concerns immediately and empathetically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-Time Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Live dashboard with sentiment trends, rating distribution, and comprehensive feedback metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
                <p className="text-gray-600 text-sm">
                  AI-generated recommendations to improve customer experience and address specific concerns.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, efficient, and intelligent feedback management in three steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Feedback</h3>
              <p className="text-gray-600">
                Customers rate their experience and share detailed reviews through our intuitive interface.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI instantly analyzes sentiment, generates responses, and creates actionable insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Action</h3>
              <p className="text-gray-600">
                View comprehensive analytics and implement AI-recommended improvements to enhance customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Feedback Process?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join leading e-commerce businesses using AI to understand their customers better.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/user')}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
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