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
    
    // Mobile optimization
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.body.classList.add('mobile-device');
    }
    
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.opacity = '1';
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Lazy load images
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
    }, { rootMargin: '50px' });
    
    images.forEach(img => imageObserver.observe(img));
    
    return () => {
      document.body.classList.remove('mobile-device');
      document.documentElement.style.scrollBehavior = 'auto';
      imageObserver.disconnect();
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
        <meta name="twitter:description" content="Ready to break conventional boundaries? Schedule a consultation with Rule27 Design's expert team and discover how we can transform your digital presence." />
        <meta name="twitter:image" content="/assets/og-image.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rule27design.com/contact" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/src/assets/Fonts/steelfish.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/src/assets/Fonts/steelfish-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Helmet>

      {/* Optimized Global Styles */}
      <style>{`
        /* Optimized animations */
        @keyframes float-up {
          from {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          to {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }

        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-animation {
          background-size: 200% 200%;
          animation: gradient-flow 4s ease infinite;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .floating-particle,
          .mouse-glow {
            display: none !important;
          }
          
          * {
            animation-duration: 0.3s !important;
          }
          
          .hero-wrapper {
            opacity: 1 !important;
            transform: none !important;
          }
        }
        
        /* Consistent form styling */
        .consultation-grid {
          position: relative;
        }
        
        .consultation-grid > * {
          overflow: visible;
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
        
        /* Performance optimizations */
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

      <AnimatePresence>
        {isLoaded && (
          <motion.div 
            className="min-h-screen bg-background overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header - Consistent with homepage */}
            <Header />
            
            <main className="pt-16">
              {/* Hero Section */}
              <motion.section 
                id="hero" 
                className="hero-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <HeroSection />
              </motion.section>
              
              {/* Main Content Grid */}
              <motion.section 
                id="consultation" 
                className="section-transition bg-gradient-to-b from-white via-white to-gray-50 py-12 sm:py-16 md:py-20 lg:py-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="consultation-grid grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Form Column */}
                    <motion.div 
                      className="order-1 lg:col-span-2"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <div className="sticky-form-container">
                        <ConsultationForm 
                          formData={formData}
                          onFormUpdate={handleFormUpdate}
                          currentStep={currentFormStep}
                        />
                      </div>
                    </motion.div>
                    
                    {/* Support Info Column */}
                    <motion.div 
                      className="form-sidebar order-2 space-y-6 sm:space-y-8"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <ProcessTimeline currentStep={currentFormStep} />
                      <ContactOptions />
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Trust Indicators */}
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <TrustIndicators />
              </motion.section>

              {/* FAQ Section */}
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <FAQSection />
              </motion.section>
            </main>

            {/* Footer - Consistent with homepage */}
            <Footer />

            {/* Back to Top Button */}
            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Optimized Back to Top Component
const BackToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [scrollPercentage, setScrollPercentage] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      
      setScrollPercentage(scrolled);
      setIsVisible(scrollTop > 500);
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

  return (
    <motion.button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-40 bg-primary hover:bg-accent text-white p-3 rounded-full shadow-lg transition-all duration-500 group ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
      }`}
      aria-label="Back to top"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.2"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${scrollPercentage * 1.5} 150`}
          className="text-accent transition-all duration-300"
        />
      </svg>
      
      <svg 
        className="w-5 h-5 relative z-10 group-hover:animate-pulse" 
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
    </motion.button>
  );
};

export default ContactConsultationPortal;