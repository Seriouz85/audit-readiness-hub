
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link to={to}>
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-3 py-3 mb-1 font-medium",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { to: '/', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { to: '/standards', icon: <Shield size={20} />, label: 'Standards' },
    { to: '/requirements', icon: <BookOpen size={20} />, label: 'Requirements' },
    { to: '/assessments', icon: <CheckSquare size={20} />, label: 'Assessments' },
    { to: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar overflow-y-auto">
        <div className="p-4 pb-2 flex items-center border-b border-sidebar-border">
          <Shield className="text-accent mr-2" size={24} />
          <h1 className="text-sidebar-foreground text-xl font-bold">AuditReady</h1>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sidebar-foreground/80 text-sm">
            <p>Cybersecurity Compliance</p>
            <p className="text-xs mt-1">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside 
        className={cn(
          "fixed inset-0 z-40 w-full bg-sidebar transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 pb-2 flex items-center border-b border-sidebar-border">
          <Shield className="text-accent mr-2" size={24} />
          <h1 className="text-sidebar-foreground text-xl font-bold">AuditReady</h1>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sidebar-foreground/80 text-sm">
            <p>Cybersecurity Compliance</p>
            <p className="text-xs mt-1">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
