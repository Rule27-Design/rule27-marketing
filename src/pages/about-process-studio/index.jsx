import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import OriginStory from './components/OriginStory';
import TeamShowcase from './components/TeamShowcase';
import MethodologySection from './components/MethodologySection';
import CultureShowcase from './components/CultureShowcase';
import AwardsRecognition from './components/AwardsRecognition';
import PartnershipEcosystem from './components/PartnershipEcosystem';

const AboutProcessStudio = () => {
  useEffect(() => {
    // Performance optimizations
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Add a class to body for conditional CSS
      document.body.classList.add('mobile-device');
    }
    
    // Smooth scroll with less delay
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Faster page appearance
    document.body.style.opacity = '1';
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Performance optimization - lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01
      }
    );
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimize animations for mobile
    if (isMobile) {
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach(el => {
        el.style.animationDuration = '0.3s';
        el.style.transitionDuration = '0.2s';
      });
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-device');
      document.documentElement.style.scrollBehavior = 'auto';
      imageObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>About | Rule27 Design - The Rebels Behind Digital Innovation</title>
        <meta 
          name="description" 
          content="Meet the certified experts, discover our methodology, and explore the culture that makes Rule27 Design the digital powerhouse where excellence thrives." 
        />
        <meta name="keywords" content="about rule27 design, digital agency team, creative methodology, company culture, design process, certified experts, digital innovation" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About | Rule27 Design - The Rebels Behind Digital Innovation" />
        <meta property="og:description" content="Meet the certified experts, discover our methodology, and explore the culture that makes Rule27 Design the digital powerhouse where excellence thrives." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rule27design.com/about" />
        <meta property="og:image" content="/assets/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About | Rule27 Design - The Rebels Behind Digital Innovation" />
        <meta name="twitter:description" content="Meet the certified experts, discover our methodology, and explore the culture that makes Rule27 Design the digital powerhouse where excellence thrives." />
        <meta name="twitter:image" content="/assets/og-image.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rule27design.com/about" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/src/assets/Fonts/steelfish.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/src/assets/Fonts/steelfish-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Helmet>

      {/* Global Performance Styles */}
      <style>{`
        /* Optimized animations for mobile */
        @media (max-width: 768px) {
          * {
            animation-duration: 0.3s !important;
            transition-duration: 0.2s !important;
          }
          
          /* Disable complex animations on mobile for performance */
          .animate-pulse {
            animation: none;
            opacity: 0.3;
          }
          
          /* Reduce motion for particles on mobile */
          .floating-element {
            animation: none !important;
          }
          
          /* Immediate visibility for hero content */
          .hero-wrapper {
            opacity: 1 !important;
            transform: none !important;
          }
          
          /* Simplify gradients on mobile */
          .bg-gradient-radial {
            background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to)) !important;
          }
        }
        
        /* Better touch targets */
        button {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Prevent white flash on load */
        body {
          opacity: 1;
          background-color: #ffffff;
        }
        
        /* Page load animation */
        .page-loaded {
          animation: pageLoad 0.6s ease-out;
        }
        
        @keyframes pageLoad {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Optimized section wrapper */
        .section-wrapper {
          position: relative;
          overflow: visible;
          contain: layout style;
        }
        
        /* Hero specific optimizations */
        .hero-wrapper {
          position: relative;
          z-index: 1;
          will-change: transform;
        }
        
        /* Image loading optimization */
        img {
          loading: lazy;
          decoding: async;
        }
        
        img.loaded {
          animation: imageLoad 0.6s ease-out;
        }
        
        @keyframes imageLoad {
          from {
            opacity: 0;
            filter: blur(5px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
        
        /* Font rendering optimization */
        .font-heading-regular,
        .font-heading-bold {
          font-display: swap;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Reduce motion preference support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        /* Performance optimization for large sections */
        .origin-story,
        .team-showcase,
        .methodology-section,
        .culture-showcase,
        .awards-recognition,
        .partnership-ecosystem {
          contain: layout;
        }
      `}</style>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header - Same component as homepage */}
        <Header />

        {/* Main Content */}
        <main className="pt-16">
          {/* Hero Section */}
          <section id="hero" className="hero-wrapper">
            <HeroSection />
          </section>

          {/* Origin Story */}
          <section id="origin-story" className="section-wrapper origin-story">
            <OriginStory />
          </section>

          {/* Team Showcase */}
          <section id="team" className="section-wrapper team-showcase">
            <TeamShowcase />
          </section>

          {/* Methodology Section */}
          <section id="methodology" className="section-wrapper methodology-section">
            <MethodologySection />
          </section>

          {/* Culture Showcase */}
          <section id="culture" className="section-wrapper culture-showcase">
            <CultureShowcase />
          </section>

          {/* Awards & Recognition */}
          <section id="awards" className="section-wrapper awards-recognition">
            <AwardsRecognition />
          </section>

          {/* Partnership Ecosystem */}
          <section id="partnerships" className="section-wrapper partnership-ecosystem">
            <PartnershipEcosystem />
          </section>
        </main>

        {/* Footer - Same component as homepage */}
        <Footer />

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </>
  );
};

// Optimized Back to Top Component
const BackToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    let ticking = false;
    
    const updateScrollState = () => {
      const currentScrollY = window.pageYOffset;
      setIsVisible(currentScrollY > 500);
      setLastScrollY(currentScrollY);
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
    return () => window.removeEventListener('scroll', requestTick);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-40 bg-primary hover:bg-accent text-white p-3 rounded-full shadow-lg transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
    </button>
  );
};

export default AboutProcessStudio;