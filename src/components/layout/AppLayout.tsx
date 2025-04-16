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
  X,
  Building,
  Laptop,
  FolderOpen,
  ChevronRight,
  AlertCircle,
  FileOutput
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/LanguageSelector';
import { NotificationsMenu } from '@/components/NotificationsMenu';
import { useTranslation } from '@/lib/i18n';

type SubNavItem = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  subItems?: SubNavItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
};

const NavItem = ({ to, icon, label, isActive, subItems, isExpanded, onToggle }: NavItemProps) => {
  const hasSubItems = subItems && subItems.length > 0;
  const location = useLocation();

  const buttonContent = (
    <>
      {icon}
      <span>{label}</span>
      {hasSubItems && (
        <ChevronRight className={cn(
          "ml-auto h-4 w-4 transition-transform duration-200",
          isExpanded && "rotate-90"
        )} />
      )}
    </>
  );

  return (
    <div>
      {hasSubItems ? (
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-3 py-3 mb-1 font-medium",
            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
          onClick={onToggle}
        >
          {buttonContent}
        </Button>
      ) : (
        <Link to={to}>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 py-3 mb-1 font-medium",
              isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            {buttonContent}
          </Button>
        </Link>
      )}
      
      {hasSubItems && isExpanded && (
        <div className="ml-6 space-y-1 border-l border-sidebar-border pl-2">
          {subItems.map((subItem) => (
            <Link key={subItem.to} to={subItem.to}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 py-2 text-sm",
                  location.pathname === subItem.to ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {subItem.icon}
                <span>{subItem.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleExpanded = (itemTo: string) => {
    setExpandedItems(prev => 
      prev.includes(itemTo) 
        ? prev.filter(item => item !== itemTo)
        : [...prev, itemTo]
    );
  };

  const navItems = [
    { to: '/app', icon: <BarChart3 size={20} />, label: t('nav.dashboard') },
    { to: '/app/organizations', icon: <Building size={20} />, label: t('nav.organizations') },
    { to: '/app/standards', icon: <Shield size={20} />, label: t('nav.standards') },
    { to: '/app/requirements', icon: <BookOpen size={20} />, label: t('nav.requirements') },
    { to: '/app/assessments', icon: <CheckSquare size={20} />, label: t('nav.assessments') },
    { to: '/app/applications', icon: <Laptop size={20} />, label: t('nav.applications') },
    { to: '/app/suppliers', icon: <Building size={20} />, label: t('nav.suppliers') },
    { 
      to: '/app/documents', 
      icon: <FolderOpen size={20} />, 
      label: t('nav.documents'),
      subItems: [
        { to: '/app/documents/linked', icon: <FileText size={16} />, label: 'Linked Documents' },
        { to: '/app/documents/missing', icon: <AlertCircle size={16} />, label: 'Missing Evidence' },
        { to: '/app/documents/generator', icon: <FileOutput size={16} />, label: 'Document Generator' },
      ]
    },
    { to: '/app/reports', icon: <FileText size={20} />, label: t('nav.reports') },
    { to: '/app/settings', icon: <Settings size={20} />, label: t('nav.settings') },
  ];

  const renderNav = () => (
    <nav className="flex-1 p-4">
      {navItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={location.pathname.startsWith(item.to)}
          subItems={item.subItems}
          isExpanded={expandedItems.includes(item.to)}
          onToggle={() => toggleExpanded(item.to)}
        />
      ))}
    </nav>
  );

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
        <div className="p-4 pb-6 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center">
            <Shield className="text-accent mr-2" size={24} />
            <h1 className="text-sidebar-foreground text-xl font-bold">AuditReady</h1>
          </div>
        </div>
        
        {renderNav()}
        
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
        <div className="p-4 pb-6 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center">
            <Shield className="text-accent mr-2" size={24} />
            <h1 className="text-sidebar-foreground text-xl font-bold">AuditReady</h1>
          </div>
        </div>
        
        {renderNav()}
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sidebar-foreground/80 text-sm">
            <p>Cybersecurity Compliance</p>
            <p className="text-xs mt-1">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-end items-center p-3 border-b">
          <div className="flex items-center gap-2">
            <NotificationsMenu />
            <LanguageSelector />
          </div>
        </div>
        <div className="flex-1 px-6 py-5 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
