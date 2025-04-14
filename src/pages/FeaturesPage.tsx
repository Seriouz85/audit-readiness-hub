import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Key, Fingerprint, AlertTriangle, CheckCircle, BarChart, Users, Clock, Zap, FileText, Settings, Bell, Database, Code, Cloud } from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Compliance Management",
      description: "Automated compliance tracking and reporting across multiple frameworks including SOC 2, ISO 27001, and GDPR.",
      benefits: [
        "Automated evidence collection",
        "Real-time compliance status",
        "Custom framework support"
      ]
    },
    {
      icon: <BarChart className="h-8 w-8 text-blue-500" />,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis with automated scoring and mitigation recommendations.",
      benefits: [
        "Automated risk scoring",
        "Mitigation tracking",
        "Risk heat maps"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Team Collaboration",
      description: "Seamless team coordination with built-in task management and communication tools.",
      benefits: [
        "Role-based access control",
        "Task assignment and tracking",
        "Real-time notifications"
      ]
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      title: "Document Management",
      description: "Centralized document repository with version control and automated categorization.",
      benefits: [
        "Version history tracking",
        "Automated categorization",
        "Secure document sharing"
      ]
    },
    {
      icon: <Settings className="h-8 w-8 text-blue-500" />,
      title: "Workflow Automation",
      description: "Customizable workflows to streamline your compliance processes.",
      benefits: [
        "Drag-and-drop workflow builder",
        "Automated task routing",
        "Custom approval chains"
      ]
    },
    {
      icon: <Database className="h-8 w-8 text-blue-500" />,
      title: "Data Analytics",
      description: "Advanced analytics and reporting capabilities for data-driven decision making.",
      benefits: [
        "Custom report builder",
        "Real-time dashboards",
        "Export capabilities"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">AuditReady</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/features" className="text-blue-400">Features</Link>
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

      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">Powerful Features for Modern Compliance</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how AuditReady's comprehensive feature set can transform your compliance management process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Compliance Process?</h2>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 bg-gray-900">
        <div className="container mx-auto text-center text-gray-400">
          <p>© 2024 AuditReady. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage; 