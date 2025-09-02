// src/pages/contact-consultation-portal/index.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import ConsultationForm from './components/ConsultationForm';
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
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
    
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact | Rule27 Design - Start Your Transformation</title>
        <meta 
          name="description" 
          content="Ready to break conventional boundaries? Schedule a consultation with Rule27 Design's expert team and discover how we can transform your digital presence." 
        />
        <meta name="keywords" content="contact rule27, schedule consultation, digital transformation, creative agency contact, start project, expert consultation, digital strategy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact | Rule27 Design - Start Your Transformation" />
        <meta property="og:description" content="Ready to break conventional boundaries? Schedule a consultation with Rule27 Design's expert team and discover how we can transform your digital presence." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rule27design.com/contact" />
        <meta property="og:image" content="/assets/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact | Rule27 Design - Start Your Transformation" />
        <meta name="twitter:description" content="Ready to break conventional boundaries? Schedule a consultation with Rule27 Design's expert team." />
        <meta name="twitter:image" content="/assets/og-image.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rule27design.com/contact" />
        
        {/* NO FONT PRELOADS - They're already loaded by the main CSS */}
      </Helmet>

      {/* Optimized Styles */}
      <style>{`
        /* Performance optimizations */
        * {
          will-change: auto !important;
        }
        
        .consultation-grid {
          position: relative;
        }
        
        /* Sticky form on desktop */
        @media (min-width: 1024px) {
          .sticky-form-container {
            position: sticky;
            top: 80px;
            height: fit-content;
            z-index: 10;
          }
        }
      `}</style>

      <AnimatePresence>
        {isLoaded && (
          <motion.div 
            className="min-h-screen bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <Header />
            
            <main className="pt-16">
              {/* Hero Section */}
              <HeroSection />
              
              {/* Main Content Grid */}
              <section 
                id="consultation" 
                className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 md:py-20 lg:py-24"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="consultation-grid grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Form Column */}
                    <div className="order-1 lg:col-span-2">
                      <div className="sticky-form-container">
                        <ConsultationForm 
                          formData={formData}
                          onFormUpdate={handleFormUpdate}
                          currentStep={currentFormStep}
                        />
                      </div>
                    </div>
                    
                    {/* Support Info Column */}
                    <div className="form-sidebar order-2 space-y-6 sm:space-y-8">
                      <ProcessTimeline currentStep={currentFormStep} />
                      <ContactOptions />
                    </div>
                  </div>
                </div>
              </section>

              {/* Trust Indicators */}
              <TrustIndicators />

              {/* FAQ Section */}
              <FAQSection />
            </main>

            {/* Footer */}
            <Footer />

            {/* Simple Back to Top Button */}
            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Simplified Back to Top Component
const BackToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-40 bg-primary hover:bg-accent text-white p-3 rounded-full shadow-lg transition-all duration-300"
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