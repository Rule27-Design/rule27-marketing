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
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    
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
      document.documentElement.style.scrollBehavior = 'auto';
      imageObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>About & Process Studio - Rule27 Digital Powerhouse</title>
        <meta 
          name="description" 
          content="Discover the rebellious spirit of Rule27 - where innovation meets Apple-level execution. Meet our team, explore our methodology, and experience the culture that breaks conventional boundaries." 
        />
        <meta name="keywords" content="Rule27 team, creative process, agency methodology, digital innovation, team expertise, company culture" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About & Process Studio - Rule27's Authentic Brand Story" />
        <meta property="og:description" content="The rebellious spirit of innovation wrapped in Apple-level execution excellence. Meet the team and methodology behind Rule27's confident disruption." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rule27.com/about-process-studio" />
        <meta property="og:image" content="/assets/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Rule27 - The Digital Powerhouse" />
        <meta name="twitter:description" content="Meet the rebels behind Rule27's creative excellence" />
        <meta name="twitter:image" content="/assets/og-image.jpg" />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rule27.com/about-process-studio" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/assets/logo/rule27-color.svg" as="image" />
        <link rel="preload" href="/assets/logo/rule27-white.svg" as="image" />
      </Helmet>

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

          {/* Culture Showcase */}
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