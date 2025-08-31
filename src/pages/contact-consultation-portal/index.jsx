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
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formData, setFormData] = useState({
    contactInfo: {},
    projectDetails: {},
    preferences: {}
  });

  const handleFormUpdate = (data, type) => {
    if (type === 'step') {
      setCurrentFormStep(data);
    } else {
      setFormData(prev => ({
        ...prev,
        [type]: { ...prev[type], ...data }
      }));
    }
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

      {/* Global Performance Styles with enhanced sticky form */}
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
          overflow: hidden;
          isolation: isolate;
        }
        
        /* Remove any default margins that could cause gaps */
        section {
          margin: 0;
        }
        
        main > * {
          margin: 0;
        }
        
        /* Consultation grid container */
        .consultation-section {
          position: relative;
          min-height: 100vh;
        }
        
        .consultation-grid {
          position: relative;
        }
        
        /* Ensure dropdowns are visible */
        .consultation-grid > * {
          overflow: visible;
        }
        
        /* Sticky form container - Desktop */
        @media (min-width: 1024px) {
          .sticky-form-wrapper {
            height: 100%;
          }
          
          .sticky-form-container {
            position: sticky;
            top: 80px; /* Account for header */
            height: calc(100vh - 100px);
            overflow-y: auto;
            padding-right: 1rem;
            z-index: 10;
          }
          
          /* Custom scrollbar for form container */
          .sticky-form-container::-webkit-scrollbar {
            width: 4px;
          }
          
          .sticky-form-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          .sticky-form-container::-webkit-scrollbar-thumb {
            background: #E53E3E;
            border-radius: 4px;
          }
          
          .sticky-form-container::-webkit-scrollbar-thumb:hover {
            background: #c53030;
          }
          
          /* Sidebar should scroll independently */
          .form-sidebar-wrapper {
            max-height: calc(100vh - 100px);
            overflow-y: auto;
            padding-left: 1rem;
          }
        }
        
        /* Mobile - Normal stacking */
        @media (max-width: 1023px) {
          .sticky-form-container {
            position: relative;
            height: auto;
          }
          
          .form-sidebar-wrapper {
            position: relative;
            height: auto;
          }
        }
        
        .hero-wrapper {
          position: relative;
          z-index: 1;
        }
        
        /* Proper z-index layering */
        #trust {
          position: relative;
          z-index: 1;
        }
        
        #consultation {
          position: relative;
          z-index: 2;
        }
        
        #faq {
          position: relative;
          z-index: 1;
        }
        
        /* Contain floating elements */
        .form-sidebar {
          position: relative;
          z-index: 5;
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
          
          {/* Main Content Grid with Sticky Form - Enhanced structure */}
          <section id="consultation" className="consultation-section bg-gradient-to-b from-white via-white to-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="consultation-grid grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left Column - Form with Enhanced Sticky Container */}
                <div className="order-1 lg:col-span-2">
                  <div className="sticky-form-wrapper">
                    <div className="sticky-form-container">
                      <ConsultationForm 
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        currentStep={currentFormStep}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Support Info with Independent Scroll */}
                <div className="form-sidebar order-2">
                  <div className="form-sidebar-wrapper space-y-6 sm:space-y-8">
                    <ProcessTimeline currentStep={currentFormStep} />
                    <ContactOptions />
                    
                    {/* Additional Information Cards for desktop to add scroll content */}
                    <div className="hidden lg:block space-y-6">
                      {/* Response Time Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-brand-md">
                        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                          <Icon name="Zap" size={18} className="text-accent mr-2" />
                          Quick Response
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">
                          We typically respond to consultation requests within 24 hours. For urgent projects, select ASAP in the timeline question.
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          <span className="text-xs text-success font-medium">Team available now</span>
                        </div>
                      </div>
                      
                      {/* What to Expect Card */}
                      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">What to Expect</h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                          <li className="flex items-start space-x-2">
                            <span className="text-accent font-bold">1.</span>
                            <span>Complete the assessment form</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-accent font-bold">2.</span>
                            <span>Receive confirmation email</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-accent font-bold">3.</span>
                            <span>Strategy expert reaches out</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-accent font-bold">4.</span>
                            <span>Schedule your consultation</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Privacy & Security Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-brand-md">
                        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                          <Icon name="Shield" size={18} className="text-accent mr-2" />
                          Your Privacy Matters
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">
                          All information shared is strictly confidential and protected by our privacy policy. We never share your data with third parties.
                        </p>
                        <a href="/privacy" className="text-accent hover:text-accent/80 text-sm font-medium inline-flex items-center">
                          View Privacy Policy
                          <Icon name="ArrowRight" size={14} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Indicators - Gray background, seamless flow */}
          <TrustIndicators />

          {/* FAQ Section - Gray background, seamless flow */}
          <FAQSection />
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