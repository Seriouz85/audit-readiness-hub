import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, BarChart, Users, Zap, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">AuditReady</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/solutions" className="hover:text-blue-400 transition-colors">Solutions</Link>
            <Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            <Link to="/login">
              <Button variant="outline" className="bg-transparent border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Transform Your Compliance Journey with <span className="text-blue-500">AuditReady</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your compliance processes, automate audit workflows, and ensure regulatory adherence with our cutting-edge platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">99.9%</div>
              <div className="text-gray-400">Compliance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-gray-400">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">50%</div>
              <div className="text-gray-400">Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AuditReady?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
              <Zap className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Streamlined Workflows</h3>
              <p className="text-gray-400 mb-4">Automate repetitive tasks and focus on what matters most - your business growth.</p>
              <Link to="/features" className="text-blue-400 hover:text-blue-300 flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Card>
            <Card className="p-6 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
              <BarChart className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p className="text-gray-400 mb-4">Make data-driven decisions with comprehensive dashboards and reports.</p>
              <Link to="/features" className="text-blue-400 hover:text-blue-300 flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Card>
            <Card className="p-6 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
              <Users className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-gray-400 mb-4">Seamlessly work together with built-in communication and task management.</p>
              <Link to="/features" className="text-blue-400 hover:text-blue-300 flex items-center">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Compliance Process?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that trust AuditReady for their compliance needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">AuditReady</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 