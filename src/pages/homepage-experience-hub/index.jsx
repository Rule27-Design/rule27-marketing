import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import CaseStudyCarousel from './components/CaseStudyCarousel';
import CapabilityZones from './components/CapabilityZones';
import InnovationTicker from './components/InnovationTicker';
import SocialProofSection from './components/SocialProofSection';
import { useHomePageData } from '../../hooks/useHomePageData';

const HomepageExperienceHub = () => {
  const { 
    caseStudies, 
    testimonials, 
    serviceZones, 
    awards, 
    partnerships, 
    stats, 
    loading, 
    error 
  } = useHomePageData();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.classList.add('page-loaded');
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.classList.remove('page-loaded');
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-heading-regular text-primary uppercase tracking-wider">Loading Experience...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error('Homepage data error:', error);
    // Fall back to static content or show error message
  }

  return (
    <>
      <Helmet>
        <title>Rule27 Design - Digital Powerhouse | Creative + Technical Excellence</title>
        <meta 
          name="description" 
          content="Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders." 
        />
        <meta name="keywords" content="creative agency, digital marketing, web development, brand design, Rule27 Design, premium creative services, innovation, digital transformation" />
        <meta property="og:title" content="Rule27 Design - Digital Powerhouse | Creative + Technical Excellence" />
        <meta property="og:description" content="Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rule27design.com" />
        <meta property="og:image" content="/assets/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rule27 Design - Digital Powerhouse | Creative + Technical Excellence" />
        <meta name="twitter:description" content="Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders." />
        <meta name="twitter:image" content="/assets/og-image.jpg" />
        <link rel="canonical" href="https://rule27design.com" />
        <link rel="preload" href="/assets/logo/rule27-color.svg" as="image" />
        <link rel="preload" href="/assets/logo/rule27-icon-white.svg" as="image" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />

        <main className="pt-16">
          {/* Hero Section - Remains static/hardcoded */}
          <section id="hero" className="hero-wrapper">
            <HeroSection />
          </section>

          {/* Case Study Carousel - Now database-driven */}
          <section id="work" className="section-wrapper">
            <CaseStudyCarousel caseStudies={caseStudies} />
          </section>

          {/* Capability Zones - Now database-driven */}
          <section id="capabilities" className="section-wrapper">
            <CapabilityZones serviceZones={serviceZones} />
          </section>

          {/* Innovation Ticker - Remains hardcoded for now */}
          <section id="innovation" className="section-wrapper">
            <InnovationTicker />
          </section>

          {/* Social Proof Section - Now database-driven */}
          <section id="social-proof" className="section-wrapper">
            <SocialProofSection 
              testimonials={testimonials}
              awards={awards}
              partnerships={partnerships}
              stats={stats}
            />
          </section>
        </main>

        <Footer />
        <BackToTop />
      </div>

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
      `}</style>
    </>
  );
};

// Back to Top Component remains the same
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