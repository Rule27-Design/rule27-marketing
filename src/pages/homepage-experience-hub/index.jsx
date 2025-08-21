import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import CaseStudyCarousel from './components/CaseStudyCarousel';
import CapabilityZones from './components/CapabilityZones';
import InnovationTicker from './components/InnovationTicker';
import SocialProofSection from './components/SocialProofSection';

const HomepageExperienceHub = () => {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup on unmount
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Rule27 Digital Powerhouse - Where Creative Audacity Meets Technical Precision</title>
        <meta 
          name="description" 
          content="Rule27 Design is the apex creative and development partner for ambitious brands. We don't just follow design trends—we create them. Break conventional boundaries with the creative partner that makes other agencies look ordinary." 
        />
        <meta name="keywords" content="creative agency, digital marketing, web development, brand design, Rule27, premium creative services" />
        <meta property="og:title" content="Rule27 Digital Powerhouse - Creative Excellence Redefined" />
        <meta property="og:description" content="The 27th rule that breaks conventional boundaries. Discover the creative partner that transforms ambitious brands into industry leaders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rule27.com/homepage-experience-hub" />
        <link rel="canonical" href="https://rule27.com/homepage-experience-hub" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="pt-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Case Study Carousel */}
          <CaseStudyCarousel />

          {/* Capability Zones */}
          <CapabilityZones />

          {/* Innovation Ticker */}
          <InnovationTicker />

          {/* Social Proof Section */}
          <SocialProofSection />
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">27</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Rule27</h3>
                    <p className="text-gray-300 text-sm">Digital Powerhouse</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  The creative partner that breaks conventional boundaries and makes 
                  other agencies look ordinary. Where creative audacity meets technical precision.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                    <span className="sr-only">LinkedIn</span>
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                    <span className="sr-only">Twitter</span>
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                    <span className="sr-only">Instagram</span>
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold mb-4">Explore</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/capability-universe" className="hover:text-accent transition-colors duration-300">Capabilities</a></li>
                  <li><a href="/work-showcase-theater" className="hover:text-accent transition-colors duration-300">Work</a></li>
                  <li><a href="/innovation-laboratory" className="hover:text-accent transition-colors duration-300">Innovation</a></li>
                  <li><a href="/about-process-studio" className="hover:text-accent transition-colors duration-300">About</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold mb-4">Connect</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/contact-consultation-portal" className="hover:text-accent transition-colors duration-300">Start Consultation</a></li>
                  <li><a href="mailto:hello@rule27.com" className="hover:text-accent transition-colors duration-300">hello@rule27.com</a></li>
                  <li><a href="tel:+1-555-RULE-27" className="hover:text-accent transition-colors duration-300">+1 (555) RULE-27</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm mb-4 md:mb-0">
                © {new Date()?.getFullYear()} Rule27 Digital Powerhouse. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-300">
                <a href="#" className="hover:text-accent transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-accent transition-colors duration-300">Terms of Service</a>
                <a href="#" className="hover:text-accent transition-colors duration-300">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomepageExperienceHub;