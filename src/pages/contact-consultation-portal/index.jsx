import React, { useState, useEffect } from 'react';
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
    // Enhanced loading animation
    setIsLoaded(true);
    
    // Reduce motion for mobile devices
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
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
        /* Enhanced animations and effects */
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

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }

        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .floating-particle {
          position: absolute;
          pointer-events: none;
          animation: float-up 10s linear infinite;
        }

        .glow-effect {
          filter: drop-shadow(0 0 20px rgba(229, 62, 62, 0.3));
        }

        .gradient-animation {
          background-size: 200% 200%;
          animation: gradient-flow 4s ease infinite;
        }

        /* Mouse follower glow */
        .mouse-glow {
          pointer-events: none;
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(229, 62, 62, 0.15), transparent 40%);
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        /* Faster animations on mobile */
        @media (max-width: 768px) {
          * {
            animation-duration: 0.3s !important;
            transition-duration: 0.2s !important;
          }
          
          .floating-particle {
            display: none;
          }
          
          .mouse-glow {
            display: none;
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
        
        /* Enhanced section transitions */
        .section-transition {
          position: relative;
        }
        
        .section-transition::before {
          content: '';
          position: absolute;
          top: -50px;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(229, 62, 62, 0.02));
          pointer-events: none;
        }
        
        /* Remove any default margins that could cause gaps */
        section {
          margin: 0;
        }
        
        main > * {
          margin: 0;
        }
        
        .consultation-grid {
          position: relative;
        }
        
        /* Ensure dropdowns are visible */
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
        
        /* Enhanced scroll animations */
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-animate.visible {
          opacity: 1;
          transform: translateY(0);
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

      <AnimatePresence>
        {isLoaded && (
          <motion.div 
            className="min-h-screen bg-background overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header - Same component as homepage and about page */}
            <Header />
            
            <main className="pt-16">
              {/* Hero Section with Enhanced Features */}
              <motion.section 
                id="hero" 
                className="hero-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <HeroSection />
              </motion.section>
              
              {/* Main Content Grid - Enhanced gradient transition */}
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
                    {/* Left Column - Form with Sticky Container */}
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
                    
                    {/* Right Column - Support Info - Mobile Optimized */}
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

              {/* Trust Indicators - Enhanced animations */}
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <TrustIndicators />
              </motion.section>

              {/* FAQ Section - Enhanced animations */}
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <FAQSection />
              </motion.section>
            </main>

            {/* Footer - Same component as homepage and about page */}
            <Footer />

            {/* Back to Top Button - Enhanced */}
            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Enhanced Back to Top Component
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

    window.addEventListener('scroll', handleScroll);
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