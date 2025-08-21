import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', path: '/homepage-experience-hub', icon: 'Home' },
    { name: 'Capabilities', path: '/capability-universe', icon: 'Zap' },
    { name: 'Work', path: '/work-showcase-theater', icon: 'Eye' },
    { name: 'Innovation', path: '/innovation-laboratory', icon: 'Lightbulb' },
    { name: 'About', path: '/about-process-studio', icon: 'Users' }
  ];

  const secondaryItems = [
    { name: 'Contact', path: '/contact-consultation-portal', icon: 'MessageCircle' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const Logo = () => (
    <Link to="/homepage-experience-hub" className="flex items-center space-x-2 group">
      <div className="relative">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
          <span className="text-white font-bold text-lg">27</span>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
          Rule27
        </span>
        <span className="text-xs text-text-secondary font-medium tracking-wide">
          Digital Powerhouse
        </span>
      </div>
    </Link>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-brand-header transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border brand-shadow' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActivePath(item?.path)
                    ? 'text-accent' :'text-text-primary hover:text-accent'
                }`}
              >
                <span className="relative z-10">{item?.name}</span>
                {isActivePath(item?.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
                )}
                <div className="absolute inset-0 bg-accent/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/contact-consultation-portal'}
              className="border-accent text-accent hover:bg-accent hover:text-white"
            >
              Start Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-primary hover:text-accent"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100' :'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-background border-t border-border brand-shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Items */}
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActivePath(item?.path)
                    ? 'bg-accent/10 text-accent border-l-4 border-accent' :'text-text-primary hover:bg-muted hover:text-accent'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.name}</span>
              </Link>
            ))}

            {/* Mobile Secondary Items */}
            <div className="pt-4 border-t border-border">
              {secondaryItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActivePath(item?.path)
                      ? 'bg-accent/10 text-accent border-l-4 border-accent' :'text-text-primary hover:bg-muted hover:text-accent'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="pt-4">
              <Button
                variant="default"
                fullWidth
                onClick={() => {
                  closeMenu();
                  window.location.href = '/contact-consultation-portal';
                }}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                Start Your Transformation
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Sticky Consultation CTA */}
      <div className={`sticky-cta ${isScrolled ? 'visible' : ''}`}>
        <Button
          variant="default"
          size="lg"
          onClick={() => window.location.href = '/contact-consultation-portal'}
          className="bg-accent hover:bg-accent/90 text-white brand-shadow-lg animate-brand-bounce"
          iconName="ArrowRight"
          iconPosition="right"
        >
          Book Consultation
        </Button>
      </div>
    </header>
  );
};

export default Header;