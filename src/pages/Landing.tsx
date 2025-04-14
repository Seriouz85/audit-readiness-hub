import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, BarChart3, FileText, CheckCircle2, ArrowRight, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const stats = [
    { value: "99.9%", label: "Compliance Rate" },
    { value: "500+", label: "Enterprise Clients" },
    { value: "24/7", label: "Support Available" },
    { value: "50%", label: "Time Saved" },
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automation",
      description: "Automate repetitive tasks and focus on what matters most - your business growth."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics",
      description: "Make data-driven decisions with comprehensive dashboards and reports."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration",
      description: "Seamlessly work together with built-in communication and task management."
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">AuditReady</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#solutions" className="text-gray-300 hover:text-white">Solutions</a>
            <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
            <a href="#contact" className="text-gray-300 hover:text-white">Contact</a>
            <Link to="/login">
              <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Transform Your Compliance Journey with{" "}
          <span className="text-blue-500">AuditReady</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Streamline your compliance processes, automate audit workflows, and
          ensure regulatory adherence with our cutting-edge platform.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Start Free Trial
            </Button>
          </Link>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#1a1f2e]">
            Learn More
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">{stat.value}</div>
            <div className="text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Why Choose Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AuditReady?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="border border-blue-500/20 rounded-lg p-8 hover:border-blue-500 transition-colors">
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
              <a href="#learn-more" className="text-blue-500 flex items-center mt-4 hover:text-blue-400">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Compliance Process?</h2>
        <p className="text-gray-300 mb-8">
          Join thousands of organizations that trust AuditReady for their compliance needs.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Get Started Now
            </Button>
          </Link>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#1a1f2e]">
            Contact Sales
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-white">AuditReady</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-white">Privacy Policy</a>
              <a href="#terms" className="hover:text-white">Terms of Service</a>
              <a href="#contact" className="hover:text-white">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 