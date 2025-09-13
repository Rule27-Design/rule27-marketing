import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import ExperimentalFeatures from './components/ExperimentalFeatures';
import TrendAnalysis from './components/TrendAnalysis';
import InteractiveTools from './components/InteractiveTools';
import ThoughtLeadership from './components/ThoughtLeadership';
import ResourceHub from './components/ResourceHub';

const InnovationLaboratory = () => {
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
        <title>Innovation Lab | Rule27 Design - Where Tomorrow Begins</title>
        <meta 
          name="description" 
          content="Explore cutting-edge tools, AI experiments, and trend analysis. Interactive demos and resources that push the boundaries of digital design." 
        />
        <meta name="keywords" content="innovation lab, experimental features, AI tools, trend analysis, design trends, technology predictions, interactive tools, thought leadership" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Innovation Lab | Rule27 Design - Where Tomorrow Begins" />
        <meta property="og:description" content="Explore cutting-edge tools, AI experiments, and trend analysis. Interactive demos and resources that push the boundaries of digital design." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rule27design.com/innovation" />
        <meta property="og:image" content="/assets/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Innovation Lab | Rule27 Design - Where Tomorrow Begins" />
        <meta name="twitter:description" content="Explore cutting-edge tools, AI experiments, and trend analysis. Interactive demos and resources that push the boundaries of digital design." />
        <meta name="twitter:image" content="/assets/og-image.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://www.rule27design.com/innovation" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/assets/logo/rule27-color.svg" as="image" />
        <link rel="preload" href="/assets/logo/rule27-icon-white.svg" as="image" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="pt-16">
          {/* Hero Section */}
          <section id="hero" className="hero-wrapper">
            <HeroSection />
          </section>

          {/* Experimental Features */}
          <section id="experimental" className="section-wrapper">
            <ExperimentalFeatures />
          </section>

          {/* Trend Analysis */}
          <section id="trends" className="section-wrapper">
            <TrendAnalysis />
          </section>

          {/* Interactive Tools */}
          <section id="tools" className="section-wrapper">
            <InteractiveTools />
          </section>

          {/* Thought Leadership */}
          <section id="insights" className="section-wrapper">
            <ThoughtLeadership />
          </section>

          {/* Resource Hub */}
          <section id="resources" className="section-wrapper">
            <ResourceHub />
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

export default InnovationLaboratory;