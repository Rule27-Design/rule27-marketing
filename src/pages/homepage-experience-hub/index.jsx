import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import CaseStudyCarousel from './components/CaseStudyCarousel';
import CapabilityZones from './components/CapabilityZones';
import InnovationTicker from './components/InnovationTicker';
import SocialProofSection from './components/SocialProofSection';

const HomepageExperienceHub = () => {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add page transition animation
    document.body.classList.add('page-loaded');
    
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
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.classList.remove('page-loaded');
      imageObserver.disconnect();
    };
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Rule27 Design - Digital Powerhouse | Creative + Technical Excellence</title>
        <meta 
          name="description" 
          content="Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders." 
        />
        <meta name="keywords" content="creative agency, digital marketing, web development, brand design, Rule27 Design, premium creative services, innovation, digital transformation" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Rule27 Design - Digital Powerhouse | Creative + Technical Excellence" />
        <meta property="og:description" content="Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rule27design.com" />
        <meta property="og:image" content="/assets/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rule27 Design - Digital Powerhouse | Creative + Technical Excellence" />
        <meta name="twitter:description" content="Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders." />
        <meta name="twitter:image" content="/assets/og-image.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rule27design.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/assets/logo/rule27-color.svg" as="image" />
        <link rel="preload" href="/assets/logo/rule27-icon-white.svg" as="image" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="pt-16">
          {/* Hero Section with Enhanced Animations */}
          <section id="hero" className="hero-wrapper">
            <HeroSection />
          </section>

          {/* Case Study Carousel */}
          <section id="work" className="section-wrapper">
            <CaseStudyCarousel />
          </section>

          {/* Capability Zones */}
          <section id="capabilities" className="section-wrapper">
            <CapabilityZones />
          </section>

          {/* Innovation Ticker */}
          <section id="innovation" className="section-wrapper">
            <InnovationTicker />
          </section>

          {/* Social Proof Section */}
          <section id="social-proof" className="section-wrapper">
            <SocialProofSection />
          </section>
        </main>

        {/* Footer */}
        <Footer />

        {/* Back to Top Button */}
        <BackToTop />
      </div>

      {/* Page-specific styles */}
      <style jsx>{`
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
    </>
  );
};

// Back to Top Component
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

export default HomepageExperienceHub;