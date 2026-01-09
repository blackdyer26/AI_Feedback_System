import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, ArrowLeft } from 'lucide-react';
import {FyndLogoBlack} from "../assets/logo/";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple password check (in production, use proper authentication)
    setTimeout(() => {
      if (password === 'admin123' || password === 'fynd2026') {
        toast.success('Login successful!');
        sessionStorage.setItem('admin_authenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid password. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={FyndLogoBlack}  alt="Fynd" className="h-8" />
            <span className="text-xl font-bold text-gray-900">Admin Access</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl">Admin Dashboard Access</CardTitle>
          <CardDescription>
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-2">
                Demo password: <code className="bg-gray-100 px-2 py-1 rounded">fynd2026</code>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This is a demo authentication. In production, implement proper authentication with JWT tokens, OAuth, or similar secure methods.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}