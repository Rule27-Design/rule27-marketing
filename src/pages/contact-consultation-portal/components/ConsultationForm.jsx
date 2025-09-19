// src/pages/contact-consultation-portal/components/ConsultationForm.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useContactSubmissions } from '../../../hooks/useContactSubmissions';

const ConsultationForm = ({ formData, onFormUpdate, currentStep: parentStep }) => {
  const [currentStep, setCurrentStep] = useState(parentStep || 1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { submitContactForm, submitting: isApiSubmitting } = useContactSubmissions();

  const totalSteps = 4;

  // Sync with parent's step
  useEffect(() => {
    if (parentStep && parentStep !== currentStep) {
      setCurrentStep(parentStep);
    }
  }, [parentStep, currentStep]);

  // Form state
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: ''
  });

  const [projectDetails, setProjectDetails] = useState({
    projectType: '',
    budget: '',
    timeline: '',
    currentWebsite: '',
    challenges: ''
  });

  const [preferences, setPreferences] = useState({
    services: [],
    communicationPreference: '',
    bestTimeToCall: '',
    referralSource: '',
    additionalInfo: ''
  });

  const [agreement, setAgreement] = useState({
    termsAccepted: false,
    newsletterOptIn: false
  });

  // Options for selects
  const roleOptions = [
    { value: 'founder', label: 'Founder / CEO' },
    { value: 'cmo', label: 'CMO / Marketing Director' },
    { value: 'cto', label: 'CTO / Tech Lead' },
    { value: 'designer', label: 'Head of Design' },
    { value: 'manager', label: 'Project Manager' },
    { value: 'other', label: 'Other' }
  ];

  const projectTypeOptions = [
    { value: 'new-brand', label: 'Complete Brand Creation' },
    { value: 'rebrand', label: 'Brand Refresh / Rebrand' },
    { value: 'website', label: 'Website Design & Development' },
    { value: 'marketing', label: 'Digital Marketing Campaign' },
    { value: 'strategy', label: 'Strategic Consulting' },
    { value: 'other', label: 'Something Else' }
  ];

  const budgetOptions = [
    { value: 'under-25k', label: 'Under $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-250k', label: '$100,000 - $250,000' },
    { value: 'over-250k', label: 'Over $250,000' },
    { value: 'not-sure', label: 'Not Sure Yet' }
  ];

  const timelineOptions = [
    { value: 'asap', label: 'ASAP (Within 2 weeks)' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '1-3-months', label: '1-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'flexible', label: 'Flexible timeline' }
  ];

  const serviceOptions = [
    { value: 'brand-strategy', label: 'Brand Strategy' },
    { value: 'visual-identity', label: 'Visual Identity Design' },
    { value: 'web-design', label: 'Web Design' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'content-creation', label: 'Content Creation' },
    { value: 'seo', label: 'SEO Optimization' },
    { value: 'consulting', label: 'Strategic Consulting' }
  ];

  const communicationOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'video', label: 'Video Call' },
    { value: 'in-person', label: 'In-Person Meeting' }
  ];

  const timeSlotOptions = [
    { value: 'morning', label: 'Morning (9am - 12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
    { value: 'evening', label: 'Evening (5pm - 8pm)' },
    { value: 'flexible', label: 'Flexible' }
  ];

  const referralOptions = [
    { value: 'google', label: 'Google Search' },
    { value: 'social', label: 'Social Media' },
    { value: 'referral', label: 'Client Referral' },
    { value: 'portfolio', label: 'Portfolio Site' },
    { value: 'other', label: 'Other' }
  ];

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!contactInfo.firstName) newErrors.firstName = 'First name is required';
        if (!contactInfo.lastName) newErrors.lastName = 'Last name is required';
        if (!contactInfo.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) newErrors.email = 'Invalid email format';
        if (!contactInfo.phone) newErrors.phone = 'Phone number is required';
        if (!contactInfo.company) newErrors.company = 'Company name is required';
        break;
      case 2:
        if (!projectDetails.projectType) newErrors.projectType = 'Please select a project type';
        if (!projectDetails.budget) newErrors.budget = 'Please select a budget range';
        if (!projectDetails.timeline) newErrors.timeline = 'Please select a timeline';
        if (!projectDetails.challenges) newErrors.challenges = 'Please describe your challenges';
        break;
      case 3:
        if (preferences.services.length === 0) newErrors.services = 'Please select at least one service';
        if (!preferences.communicationPreference) newErrors.communicationPreference = 'Please select a communication preference';
        break;
      case 4:
        if (!agreement.termsAccepted) newErrors.termsAccepted = 'You must accept the terms to proceed';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        onFormUpdate(newStep, 'step');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onFormUpdate(newStep, 'step');
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    // Combine all form data
    const fullFormData = {
      contactInfo,
      projectDetails,
      preferences,
      agreement
    };
    
    // Submit to Supabase
    const result = await submitContactForm(fullFormData);
    
    if (result.success) {
      setIsSuccess(true);
      // Clear form data after 5 seconds
      setTimeout(() => {
        window.location.reload(); // Simple reload to reset everything
      }, 5000);
    } else {
      // Show error message
      setErrors({ submit: 'Failed to submit form. Please try again or contact us directly at hello@rule27design.com' });
    }
    
    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">
                Let's Get Acquainted
              </h3>
              <p className="text-text-secondary text-sm sm:text-base font-sans">
                Tell us who you are and how we can reach you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="First Name"
                required
                value={contactInfo.firstName}
                onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                error={errors.firstName}
                placeholder="John"
                className="font-sans"
              />
              <Input
                label="Last Name"
                required
                value={contactInfo.lastName}
                onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                error={errors.lastName}
                placeholder="Doe"
                className="font-sans"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              required
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              error={errors.email}
              placeholder="john@company.com"
              className="font-sans"
            />

            <Input
              label="Phone Number"
              type="tel"
              required
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
              className="font-sans"
            />

            <Input
              label="Company Name"
              required
              value={contactInfo.company}
              onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
              error={errors.company}
              placeholder="Awesome Company Inc."
              className="font-sans"
            />

            <Select
              label="Your Role"
              placeholder="Select your role"
              options={roleOptions}
              value={contactInfo.role}
              onChange={(value) => setContactInfo({ ...contactInfo, role: value })}
              error={errors.role}
              className="font-sans"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">
                Tell Us About Your Project
              </h3>
              <p className="text-text-secondary text-sm sm:text-base font-sans">
                Help us understand your vision and requirements.
              </p>
            </div>

            <Select
              label="Project Type"
              required
              placeholder="What do you need help with?"
              options={projectTypeOptions}
              value={projectDetails.projectType}
              onChange={(value) => setProjectDetails({ ...projectDetails, projectType: value })}
              error={errors.projectType}
              className="font-sans"
            />

            <Select
              label="Budget Range"
              required
              placeholder="Select your budget range"
              options={budgetOptions}
              value={projectDetails.budget}
              onChange={(value) => setProjectDetails({ ...projectDetails, budget: value })}
              error={errors.budget}
              className="font-sans"
            />

            <Select
              label="Timeline"
              required
              placeholder="When do you need this completed?"
              options={timelineOptions}
              value={projectDetails.timeline}
              onChange={(value) => setProjectDetails({ ...projectDetails, timeline: value })}
              error={errors.timeline}
              className="font-sans"
            />

            <Input
              label="Current Website (if applicable)"
              type="url"
              value={projectDetails.currentWebsite}
              onChange={(e) => setProjectDetails({ ...projectDetails, currentWebsite: e.target.value })}
              placeholder="https://yourwebsite.com"
              className="font-sans"
            />

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Current Challenges & Goals <span className="text-accent">*</span>
              </label>
              <textarea
                value={projectDetails.challenges}
                onChange={(e) => setProjectDetails({ ...projectDetails, challenges: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none text-sm sm:text-base font-sans"
                rows={4}
                placeholder="Tell us about your current challenges and what you hope to achieve..."
              />
              {errors.challenges && (
                <p className="text-sm text-destructive mt-1">
                  {errors.challenges}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">
                Your Preferences
              </h3>
              <p className="text-text-secondary text-sm sm:text-base font-sans">
                Let us know how we can best serve you.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2 sm:mb-3">
                Services Needed <span className="text-accent">*</span>
              </label>
              <div className="space-y-2 sm:space-y-3">
                {serviceOptions.map((service) => (
                  <Checkbox
                    key={service.value}
                    label={service.label}
                    checked={preferences.services.includes(service.value)}
                    onChange={(e) => {
                      const newServices = e.target.checked
                        ? [...preferences.services, service.value]
                        : preferences.services.filter(s => s !== service.value);
                      setPreferences({ ...preferences, services: newServices });
                    }}
                    className="font-sans"
                  />
                ))}
              </div>
              {errors.services && (
                <p className="text-sm text-destructive mt-2">
                  {errors.services}
                </p>
              )}
            </div>

            <Select
              label="Preferred Communication Method"
              required
              placeholder="How should we contact you?"
              options={communicationOptions}
              value={preferences.communicationPreference}
              onChange={(value) => setPreferences({ ...preferences, communicationPreference: value })}
              error={errors.communicationPreference}
              className="font-sans"
            />

            <Select
              label="Best Time to Call"
              placeholder="When are you available?"
              options={timeSlotOptions}
              value={preferences.bestTimeToCall}
              onChange={(value) => setPreferences({ ...preferences, bestTimeToCall: value })}
              className="font-sans"
            />

            <Select
              label="How Did You Hear About Us?"
              placeholder="Select an option"
              options={referralOptions}
              value={preferences.referralSource}
              onChange={(value) => setPreferences({ ...preferences, referralSource: value })}
              className="font-sans"
            />

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Additional Information
              </label>
              <textarea
                value={preferences.additionalInfo}
                onChange={(e) => setPreferences({ ...preferences, additionalInfo: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none text-sm sm:text-base font-sans"
                rows={3}
                placeholder="Anything else you'd like us to know?"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">
                Almost There!
              </h3>
              <p className="text-text-secondary text-sm sm:text-base font-sans">
                Review your information and agree to our terms.
              </p>
            </div>

            {/* Show any submission errors */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gradient-to-br from-surface to-white rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h4 className="font-heading-regular text-primary text-sm sm:text-base uppercase tracking-wider">
                Summary
              </h4>
              
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-text-secondary font-sans">Name:</span>
                  <span className="text-primary font-heading-regular uppercase tracking-wider">
                    {contactInfo.firstName} {contactInfo.lastName}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-text-secondary font-sans">Company:</span>
                  <span className="text-primary font-heading-regular uppercase tracking-wider">
                    {contactInfo.company}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-text-secondary font-sans">Project Type:</span>
                  <span className="text-primary font-sans">
                    {projectTypeOptions.find(opt => opt.value === projectDetails.projectType)?.label}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-text-secondary font-sans">Budget:</span>
                  <span className="text-primary font-sans">
                    {budgetOptions.find(opt => opt.value === projectDetails.budget)?.label}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-text-secondary font-sans">Timeline:</span>
                  <span className="text-primary font-sans">
                    {timelineOptions.find(opt => opt.value === projectDetails.timeline)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Agreements */}
            <div className="space-y-3 sm:space-y-4">
              <Checkbox
                label="I accept the terms of service and privacy policy"
                required
                checked={agreement.termsAccepted}
                onChange={(e) => setAgreement({ ...agreement, termsAccepted: e.target.checked })}
                error={errors.termsAccepted}
                className="font-sans"
              />
              
              <Checkbox
                label="Send me occasional updates about Rule27 Design's innovations and insights"
                checked={agreement.newsletterOptIn}
                onChange={(e) => setAgreement({ ...agreement, newsletterOptIn: e.target.checked })}
                className="font-sans"
              />
            </div>

            {/* What Happens Next */}
            <div className="bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h4 className="font-heading-regular text-primary mb-2 sm:mb-3 flex items-center text-sm sm:text-base uppercase tracking-wider">
                <Icon name="Info" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
                What Happens Next?
              </h4>
              <ol className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-text-secondary font-sans">
                <li className="flex items-start">
                  <span className="text-accent font-heading-regular mr-2 uppercase">1.</span>
                  We'll review your submission within 24 hours
                </li>
                <li className="flex items-start">
                  <span className="text-accent font-heading-regular mr-2 uppercase">2.</span>
                  A strategy expert will reach out to schedule your consultation
                </li>
                <li className="flex items-start">
                  <span className="text-accent font-heading-regular mr-2 uppercase">3.</span>
                  We'll prepare a custom proposal based on your needs
                </li>
                <li className="flex items-start">
                  <span className="text-accent font-heading-regular mr-2 uppercase">4.</span>
                  Your transformation journey begins!
                </li>
              </ol>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-brand-elevation p-8 sm:p-12 text-center"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Icon name="CheckCircle" size={32} className="text-success sm:w-10 sm:h-10" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-heading-regular text-primary mb-3 sm:mb-4 uppercase tracking-wider">
          Submission Successful!
        </h2>
        
        <p className="text-text-secondary mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4 font-sans">
          Thank you for reaching out to Rule27 Design. We've received your consultation request and will be in touch within 24 hours.
        </p>
        
        <div className="space-y-3 sm:space-y-4">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white text-sm sm:text-base shadow-lg font-heading-regular uppercase tracking-wider"
            iconName="Calendar"
            iconPosition="left"
          >
            Add to Calendar
          </Button>
          <p className="text-xs sm:text-sm text-text-secondary font-sans">
            Check your email for confirmation details
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-brand-elevation overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-surface to-white p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-heading-regular text-primary uppercase tracking-wider">
            Start Your Journey
          </h2>
          <span className="text-xs sm:text-sm text-text-secondary font-sans">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-accent to-red-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < currentStep ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="w-full sm:w-auto order-2 sm:order-1 border-2 border-accent text-accent hover:bg-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-heading-regular uppercase tracking-wider"
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              variant="default"
              onClick={handleNext}
              className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white text-sm sm:text-base shadow-lg font-heading-regular uppercase tracking-wider"
              iconName="ArrowRight"
              iconPosition="right"
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={isSubmitting || isApiSubmitting}
              className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white disabled:opacity-50 text-sm sm:text-base shadow-lg font-heading-regular uppercase tracking-wider"
              iconName={isSubmitting || isApiSubmitting ? "Loader" : "Send"}
              iconPosition="right"
            >
              {isSubmitting || isApiSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;