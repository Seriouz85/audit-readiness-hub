import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Key, Fingerprint, AlertTriangle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@auditready.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Left side - Login Form */}
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-500" />
                <h1 className="text-3xl font-bold ml-4">AuditReady</h1>
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400">Secure access to your compliance dashboard</p>
              <p className="text-sm text-gray-500 mt-2">Demo credentials: demo@auditready.com / demo123</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-white">Remember me</Label>
                </div>
                <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">OR</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Sign in with SSO
              </Button>
            </form>
          </div>

          {/* Right side - Features */}
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Why Choose AuditReady?</h3>
              <p className="text-gray-400 mb-8">
                Join thousands of organizations that trust AuditReady for their compliance needs
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500/10 text-blue-500">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Comprehensive Compliance</h4>
                  <p className="mt-1 text-gray-400">
                    Manage multiple compliance frameworks in one place
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500/10 text-blue-500">
                    <Key className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Enterprise Security</h4>
                  <p className="mt-1 text-gray-400">
                    Bank-grade security with end-to-end encryption
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500/10 text-blue-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Automated Workflows</h4>
                  <p className="mt-1 text-gray-400">
                    Streamline your compliance processes with automation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 