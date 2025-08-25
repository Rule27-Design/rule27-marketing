import React, { useEffect } from 'react';
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
    // Reduce motion for mobile devices
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
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-device');
      document.documentElement.style.scrollBehavior = 'auto';
      imageObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Global Performance Styles */}
      <style>{`
        /* Faster animations on mobile */
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
          
          /* Immediate visibility for hero content */
          .hero-wrapper {
            opacity: 1 !important;
            transform: none !important;
          }
        }
        
        /* Consistent tab wrapping */
        .flex-wrap {
          row-gap: 0.75rem;
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
        
        .section-wrapper {
          position: relative;
          overflow: visible;
        }
        
        .hero-wrapper {
          position: relative;
          z-index: 1;
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
          <section id="origin-story" className="section-wrapper">
            <OriginStory />
          </section>

          {/* Team Showcase */}
          <section id="team" className="section-wrapper">
            <TeamShowcase />
          </section>

          {/* Methodology Section */}
          <section id="methodology" className="section-wrapper">
            <MethodologySection />
          </section>

          {/* Culture Showcase*/}
          <section id="culture" className="section-wrapper">
            <CultureShowcase />
          </section>

          {/* Awards & Recognition */}
          <section id="awards" className="section-wrapper">
            <AwardsRecognition />
          </section>

          {/* Partnership Ecosystem */}
          <section id="partnerships" className="section-wrapper">
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

// Back to Top Component - Same as homepage
const BackToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
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