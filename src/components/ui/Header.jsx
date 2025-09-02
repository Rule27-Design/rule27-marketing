import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Logo from './Logo';

// Navigation configuration
const NAVIGATION_CONFIG = {
  primary: [
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'Capabilities', path: '/capabilities', icon: 'Zap' },
    { name: 'Work', path: '/work', icon: 'Eye' },
    { name: 'Articles', path: '/articles', icon: 'FileText' },
    { name: 'Innovation', path: '/innovation', icon: 'Lightbulb' },
    { name: 'About', path: '/about', icon: 'Users' }
  ],
  secondary: [
    { name: 'Contact', path: '/contact', icon: 'MessageCircle' }
  ]
};

// Throttle utility
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Mobile Menu Item Component
const MobileNavItem = ({ item, isActive, onClick }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-accent/10 text-accent border-l-4 border-accent'
        : 'text-text-primary hover:bg-muted hover:text-accent'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <Icon name={item.icon} size={20} aria-hidden="true" />
    <span className="font-heading-regular text-lg tracking-wide uppercase">{item.name}</span>
  </Link>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowStickyCTA(scrollY > 500);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lastFocusedElement.current = document.activeElement;
      
      const firstMenuItem = mobileMenuRef.current?.querySelector('a');
      firstMenuItem?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!isMenuOpen && lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    };
  }, [isMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const focusableElements = mobileMenuRef.current?.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  // Desktop Nav Item Component - Using Steelfish for navigation
  const DesktopNavItem = ({ item, isActive }) => (
    <Link
      to={item.path}
      className={`relative px-3 py-2 font-heading-regular text-heading-base tracking-wider uppercase transition-all duration-300 group ${
        isActive 
          ? 'text-accent' 
          : 'text-gray-700 hover:text-accent'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative z-10">{item.name}</span>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent transition-colors duration-300" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-accent/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
    </Link>
  );

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Always show color version */}
            <div className="flex-shrink-0">
              <Logo 
                variant="full"
                colorScheme="default" // Always show the red/color logo
              />
            </div>

            {/* Desktop Navigation - Steelfish font for impact */}
            <nav 
              className="hidden lg:flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {NAVIGATION_CONFIG.primary.map((item) => (
                <DesktopNavItem
                  key={item.path}
                  item={item}
                  isActive={isActivePath(item.path)}
                />
              ))}
            </nav>

            {/* Desktop CTA - Using Steelfish for button text */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleNavigation('/contact')}
                className="bg-accent text-white border-2 border-accent hover:bg-white hover:text-accent transition-all duration-300 font-heading-regular tracking-wider uppercase text-heading-base"
                aria-label="Start consultation"
              >
                Start Consultation
              </Button>
            </div>

            {/* Mobile Menu Button - Always dark */}
            <div className="lg:hidden">
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-gray-700 hover:text-accent transition-colors duration-300"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`lg:hidden transition-all duration-300 ease-out ${
            isMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <nav 
            className="bg-white border-t border-gray-200 shadow-lg"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Items */}
              {NAVIGATION_CONFIG.primary.map((item) => (
                <MobileNavItem
                  key={item.path}
                  item={item}
                  isActive={isActivePath(item.path)}
                  onClick={closeMenu}
                />
              ))}

              {/* Mobile Secondary Items */}
              <div className="pt-4 border-t border-gray-200">
                {NAVIGATION_CONFIG.secondary.map((item) => (
                  <MobileNavItem
                    key={item.path}
                    item={item}
                    isActive={isActivePath(item.path)}
                    onClick={closeMenu}
                  />
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="pt-4">
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => handleNavigation('/contact')}
                  className="bg-accent text-white border-2 border-accent hover:bg-white hover:text-accent transition-all duration-300 font-heading-regular tracking-wider uppercase text-lg"
                  aria-label="Start your transformation"
                >
                  Start Your Transformation
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Sticky Consultation CTA */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          showStickyCTA 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
        aria-hidden={!showStickyCTA}
      >
        <Button
          variant="default"
          size="lg"
          onClick={() => handleNavigation('/contact')}
          className="bg-accent text-white border-2 border-accent hover:bg-white hover:text-accent shadow-xl transition-all animate-pulse font-heading-regular tracking-wider uppercase text-base lg:text-heading-sm"
          iconName="ArrowRight"
          iconPosition="right"
          aria-label="Book consultation"
        >
          Book Consultation
        </Button>
      </div>
    </>
  );
};

export default Header;