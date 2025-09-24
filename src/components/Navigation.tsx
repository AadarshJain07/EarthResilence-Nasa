import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, BarChart3, User, Zap, Users, MessageCircle, Menu, X, BookOpen, ShoppingCart } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Globe },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/coach', label: 'AI Coach', icon: MessageCircle },
    { path: '/simulate', label: 'Simulate', icon: Zap },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/games', label: 'Games', icon: BookOpen },
    { path: '/marketplace', label: 'Shop', icon: ShoppingCart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between w-full px-6 py-4 glassmorphism border-b border-border/20">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-primary-glow" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
            Earth Resilient
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={isActive(path) ? 'secondary' : 'ghost'}
                size="sm"
                className={`transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-primary/20 text-primary-glow shadow-glow'
                    : 'hover:bg-primary/10 hover:text-primary-glow'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <div className="flex items-center justify-between w-full px-4 py-3 glassmorphism border-b border-border/20">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-primary-glow" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
              Earth Resilient
            </span>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 glassmorphism border-b border-border/20">
            <div className="flex flex-col p-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(path) ? 'secondary' : 'ghost'}
                    className={`w-full justify-start transition-all duration-300 ${
                      isActive(path)
                        ? 'bg-primary/20 text-primary-glow shadow-glow'
                        : 'hover:bg-primary/10 hover:text-primary-glow'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
