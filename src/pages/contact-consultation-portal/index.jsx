import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import ConsultationForm from './components/ConsultationForm.jsx';
import ProcessTimeline from './components/ProcessTimeline';
import ContactOptions from './components/ContactOptions';
import TrustIndicators from './components/TrustIndicators';
import FAQSection from './components/FAQSection';
import EmergencyContact from './components/EmergencyContact';

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

  return (
    <>
      <Helmet>
        <title>Contact & Consultation Portal - Rule27 Digital Powerhouse</title>
        <meta 
          name="description" 
          content="Start your transformation journey with Rule27. Book a strategic consultation, explore our process, and discover how we turn ambitious brands into industry leaders. No ordinary meetings, just game-changing conversations." 
        />
        <meta name="keywords" content="consultation, strategy session, contact Rule27, digital transformation consultation, brand strategy meeting, creative agency consultation" />
        <meta property="og:title" content="Start Your Transformation - Rule27 Consultation Portal" />
        <meta property="og:description" content="Ready to break conventional boundaries? Book your strategic consultation with Rule27's rebel innovators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rule27.com/contact-consultation-portal" />
        <link rel="canonical" href="https://rule27.com/contact-consultation-portal" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Main Content Grid */}
          <section className="py-24 bg-gradient-to-b from-white to-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Left Column - Form */}
                <div className="lg:col-span-2">
                  <ConsultationForm 
                    formData={formData}
                    onFormUpdate={handleFormUpdate}
                  />
                </div>
                
                {/* Right Column - Support Info */}
                <div className="space-y-8">
                  <ProcessTimeline currentStep={formData.step} />
                  <ContactOptions />
                  <EmergencyContact />
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
        <footer className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">27</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Ready to Write Your Own Rules?
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Every transformation starts with a conversation. Let's make yours extraordinary.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ContactConsultationPortal;