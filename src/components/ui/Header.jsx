import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

// Navigation configuration - centralized for maintainability
const NAVIGATION_CONFIG = {
  primary: [
    { name: 'Home', path: '/homepage-experience-hub', icon: 'Home' },
    { name: 'Capabilities', path: '/capability-universe', icon: 'Zap' },
    { name: 'Work', path: '/work-showcase-theater', icon: 'Eye' },
    { name: 'Innovation', path: '/innovation-laboratory', icon: 'Lightbulb' },
    { name: 'About', path: '/about-process-studio', icon: 'Users' }
  ],
  secondary: [
    { name: 'Contact', path: '/contact-consultation-portal', icon: 'MessageCircle' }
  ]
};

// Throttle utility for performance
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

// Media query hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Logo Component - Updated for Rule27 Design branding
const Logo = ({ variant = 'horizontal', colorScheme = 'default', className = '', size = 'default' }) => {
  const [imageError, setImageError] = useState(false);
  
  // For header, we'll use horizontal layout on desktop, icon on mobile
  const isMobile = useMediaQuery('(max-width: 640px)');
  const actualVariant = isMobile ? 'icon' : variant;
  
  // Determine logo source based on variant and color scheme
  const getLogoSrc = () => {
    const format = imageError ? 'png' : 'svg';
    const basePath = '/assets/logo';
    
    if (actualVariant === 'icon') {
      switch(colorScheme) {
        case 'white':
          return `${basePath}/rule27-icon-white.${format}`;
        case 'black':
          return `${basePath}/rule27-icon-black.${format}`;
        default:
          return `${basePath}/rule27-icon-color.${format}`;
      }
    }
    
    switch(colorScheme) {
      case 'white':
        return `${basePath}/rule27-white.${format}`;
      case 'black':
        return `${basePath}/rule27-black.${format}`;
      default:
        return `${basePath}/rule27-color.${format}`;
    }
  };

  // Fallback to custom logo if image fails
  if (imageError) {
    return (
      <Link 
        to="/homepage-experience-hub" 
        className={`flex items-center space-x-2 group ${className}`}
        aria-label="Rule27 Design Home"
      >
        <div className="relative">
          <div className={`${size === 'small' ? 'w-8 h-8' : 'w-10 h-10'} bg-[#E53E3E] rounded-full flex items-center justify-center group-hover:bg-[#E53E3E]/90 transition-colors duration-300`}>
            <span className="text-white font-bold text-lg">27</span>
          </div>
        </div>
        {actualVariant !== 'icon' && (
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary group-hover:text-[#E53E3E] transition-colors duration-300">
              RULE27
            </span>
            <span className="text-xs text-text-secondary font-medium tracking-[0.3em] uppercase">
              DESIGN
            </span>
          </div>
        )}
      </Link>
    );
  }

  // Primary logo implementation with image
  return (
    <Link 
      to="/homepage-experience-hub" 
      className={`inline-flex items-center ${className}`}
      aria-label="Rule27 Design Home"
    >
      <img 
        src={getLogoSrc()}
        alt="Rule27 Design Logo"
        className={`${actualVariant === 'icon' ? 'h-10 w-10' : 'h-10 w-auto'} group-hover:scale-105 transition-transform duration-300`}
        onError={() => setImageError(true)}
      />
    </Link>
  );
};

// Mobile Menu Item Component for cleaner code
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
    <span className="font-medium">{item.name}</span>
  </Link>
);

// Desktop Nav Item Component
const DesktopNavItem = ({ item, isActive }) => (
  <Link
    to={item.path}
    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
      isActive
        ? 'text-accent'
        : 'text-text-primary hover:text-accent'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className="relative z-10">{item.name}</span>
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" aria-hidden="true"></div>
    )}
    <div className="absolute inset-0 bg-accent/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
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

  // Throttled scroll handler for performance
  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowStickyCTA(scrollY > 500); // Show sticky CTA after scrolling 500px
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle click outside to close mobile menu
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

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Store last focused element and move focus to menu
      lastFocusedElement.current = document.activeElement;
      
      // Focus first menu item
      const firstMenuItem = mobileMenuRef.current?.querySelector('a');
      firstMenuItem?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus when menu closes
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

  // Handle navigation properly with React Router
  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-brand-header transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md border-b border-border brand-shadow' 
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo variant={isScrolled ? 'default' : 'default'} />
            </div>

            {/* Desktop Navigation */}
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

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigation('/contact-consultation-portal')}
                className="border-accent text-accent hover:bg-accent hover:text-white"
                aria-label="Start consultation"
              >
                Start Consultation
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-primary hover:text-accent"
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
            className="bg-background border-t border-border brand-shadow-lg"
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
              <div className="pt-4 border-t border-border">
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
                  onClick={() => handleNavigation('/contact-consultation-portal')}
                  className="bg-accent hover:bg-accent/90 text-white"
                  aria-label="Start your transformation"
                >
                  Start Your Transformation
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Sticky Consultation CTA - Separate from header for better UX */}
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
          onClick={() => handleNavigation('/contact-consultation-portal')}
          className="bg-accent hover:bg-accent/90 text-white brand-shadow-lg animate-brand-bounce"
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