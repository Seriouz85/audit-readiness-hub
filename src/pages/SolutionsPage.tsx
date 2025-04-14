import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Building2, Banknote, Hospital, Cloud, Server, Database, Users, FileText, Settings } from 'lucide-react';

const SolutionsPage = () => {
  const solutions = [
    {
      icon: <Building2 className="h-8 w-8 text-blue-500" />,
      title: "Enterprise Solutions",
      description: "Comprehensive compliance management for large organizations with complex requirements.",
      features: [
        "Multi-framework support",
        "Enterprise-grade security",
        "Custom integrations"
      ],
      industries: ["Technology", "Manufacturing", "Retail"]
    },
    {
      icon: <Banknote className="h-8 w-8 text-blue-500" />,
      title: "Financial Services",
      description: "Specialized compliance solutions for banking, insurance, and financial institutions.",
      features: [
        "GLBA compliance",
        "PCI DSS support",
        "Financial regulations"
      ],
      industries: ["Banking", "Insurance", "FinTech"]
    },
    {
      icon: <Hospital className="h-8 w-8 text-blue-500" />,
      title: "Healthcare",
      description: "HIPAA-compliant solutions for healthcare providers and medical organizations.",
      features: [
        "HIPAA compliance",
        "PHI protection",
        "Medical data security"
      ],
      industries: ["Hospitals", "Clinics", "HealthTech"]
    },
    {
      icon: <Cloud className="h-8 w-8 text-blue-500" />,
      title: "Cloud & SaaS",
      description: "Compliance solutions for cloud service providers and SaaS companies.",
      features: [
        "Cloud security",
        "SaaS compliance",
        "Multi-tenant support"
      ],
      industries: ["Cloud Providers", "SaaS Companies", "Tech Startups"]
    }
  ];

  const frameworks = [
    {
      name: "SOC 2",
      description: "Service Organization Control reports for security, availability, processing integrity, confidentiality, and privacy.",
      icon: <Shield className="h-6 w-6 text-blue-500" />
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management systems.",
      icon: <Server className="h-6 w-6 text-blue-500" />
    },
    {
      name: "GDPR",
      description: "General Data Protection Regulation compliance for data privacy and protection.",
      icon: <Database className="h-6 w-6 text-blue-500" />
    },
    {
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act compliance for healthcare data.",
      icon: <Hospital className="h-6 w-6 text-blue-500" />
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
            <Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/solutions" className="text-blue-400">Solutions</Link>
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
            <h1 className="text-5xl font-bold mb-6">Industry-Specific Solutions</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tailored compliance solutions for your industry's unique requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {solutions.map((solution, index) => (
              <Card key={index} className="p-6 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
                <div className="mb-4">{solution.icon}</div>
                <h3 className="text-xl font-bold mb-2">{solution.title}</h3>
                <p className="text-gray-400 mb-4">{solution.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="text-gray-300">• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Industries:</h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.industries.map((industry, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Supported Compliance Frameworks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {frameworks.map((framework, index) => (
                <Card key={index} className="p-6 bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    {framework.icon}
                    <h3 className="text-xl font-bold ml-2">{framework.name}</h3>
                  </div>
                  <p className="text-gray-400">{framework.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Solution?</h2>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Contact Sales
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

export default SolutionsPage; 