import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import ConsultationForm from './components/ConsultationForm.jsx';
import ProcessTimeline from './components/ProcessTimeline';
import ContactOptions from './components/ContactOptions';
import TrustIndicators from './components/TrustIndicators';
import FAQSection from './components/FAQSection';

const ContactConsultationPortal = () => {
  const [formData, setFormData] = useState({
    step: 1,
    contactInfo: {},
    projectDetails: {},
    preferences: {}
  });

  const handleFormUpdate = (stepData, stepName) => {
    setFormData(prev => ({
      ...prev,
      [stepName]: { ...prev[stepName], ...stepData }
    }));
  };

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
      <Helmet>
        <title>Contact & Consultation Portal - Rule27 Design Digital Powerhouse</title>
        <meta 
          name="description" 
          content="Start your transformation journey with Rule27 Design. Book a strategic consultation, explore our process, and discover how we turn ambitious brands into industry leaders. No ordinary meetings, just game-changing conversations." 
        />
        <meta name="keywords" content="consultation, strategy session, contact Rule27 Design, digital transformation consultation, brand strategy meeting, creative agency consultation" />
        <meta property="og:title" content="Start Your Transformation - Rule27 Design Consultation Portal" />
        <meta property="og:description" content="Ready to break conventional boundaries? Book your strategic consultation with Rule27 Design's rebel innovators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://Rule27Design.com/contact-consultation-portal" />
        <link rel="canonical" href="https://Rule27Design.com/contact-consultation-portal" />
      </Helmet>

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
        
        .consultation-grid {
          position: relative;
        }
        
        /* Ensure dropdowns are visible */
        .consultation-grid > * {
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
        
        /* Mobile-specific optimizations for contact page */
        @media (max-width: 768px) {
          .consultation-grid {
            display: flex;
            flex-direction: column;
          }
          
          .form-sidebar {
            margin-top: 2rem;
          }
          
          .trust-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header - Same component as homepage and about page */}
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section id="hero" className="hero-wrapper">
            <HeroSection />
          </section>
          
          {/* Main Content Grid - Mobile Optimized */}
          <section id="consultation" className="section-wrapper py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="consultation-grid grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left Column - Form with Sticky Positioning */}
                <div className="order-1 lg:col-span-2">
                  <div className="lg:sticky lg:top-20">
                    <ConsultationForm 
                      formData={formData}
                      onFormUpdate={handleFormUpdate}
                    />
                  </div>
                </div>
                
                {/* Right Column - Support Info - Mobile Optimized */}
                <div className="form-sidebar order-2 space-y-6 sm:space-y-8">
                  <ProcessTimeline currentStep={formData.step} />
                  <ContactOptions />
                </div>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section id="trust" className="section-wrapper">
            <TrustIndicators />
          </section>

          {/* FAQ Section */}
          <section id="faq" className="section-wrapper">
            <FAQSection />
          </section>
        </main>

        {/* Footer - Same component as homepage and about page */}
        <Footer />

        {/* Back to Top Button - Same as homepage and about page */}
        <BackToTop />
      </div>
    </>
  );
};

// Back to Top Component - Same as homepage and about page
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

export default ContactConsultationPortal;