// src/pages/contact-consultation-portal/components/ProcessTimeline.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProcessTimeline = ({ currentStep = 1 }) => {
  const [expandedStep, setExpandedStep] = useState(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const steps = [
    {
      step: 1,
      title: 'Contact Info',
      description: 'Basic details about you',
      icon: 'User',
      duration: '2 min',
      details: 'Tell us who you are and how we can reach you. This helps us personalize your experience.',
      tips: ['Use your business email', 'Include direct phone number', 'Specify your role clearly']
    },
    {
      step: 2,
      title: 'Project Details',
      description: 'Your vision & requirements',
      icon: 'FileText',
      duration: '3 min',
      details: 'Share your project goals, timeline, and budget to help us understand your needs.',
      tips: ['Be specific about goals', 'Include current challenges', 'Share inspiration if any']
    },
    {
      step: 3,
      title: 'Preferences',
      description: 'How we can help',
      icon: 'Settings',
      duration: '2 min',
      details: 'Select services and communication preferences for the best collaboration.',
      tips: ['Select all relevant services', 'Choose preferred meeting times', 'Add any special requirements']
    },
    {
      step: 4,
      title: 'Review & Submit',
      description: 'Confirm everything',
      icon: 'CheckCircle',
      duration: '1 min',
      details: 'Review your information and submit your consultation request.',
      tips: ['Double-check contact info', 'Review project details', 'Accept terms to proceed']
    }
  ];

  // Calculate progress
  useEffect(() => {
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    setAnimatedProgress(progress);
  }, [currentStep, steps.length]);

  // Auto-expand current step
  useEffect(() => {
    setExpandedStep(currentStep);
  }, [currentStep]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-accent to-red-500 rounded-lg flex items-center justify-center">
            <Icon name="GitBranch" size={18} className="text-white sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-heading-regular text-primary uppercase tracking-wider">
            Your Journey
          </h3>
        </div>
        
        {/* Progress indicator */}
        <div className="text-xs sm:text-sm text-accent font-heading-regular uppercase tracking-wider">
          {Math.round(animatedProgress)}% Complete
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 sm:mb-6">
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Steps */}
      <div className="space-y-3 sm:space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.step < currentStep;
          const isCurrent = step.step === currentStep;
          const isExpanded = expandedStep === step.step;

          return (
            <div key={step.step} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`hidden sm:block absolute left-5 sm:left-6 top-10 sm:top-12 w-0.5 h-12 ${
                  isCompleted ? 'bg-accent' : 'bg-border'
                }`} />
              )}

              <div
                className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer ${
                  isCurrent ? 'bg-accent/5 border border-accent/20' : 
                  isCompleted ? 'bg-success/5' : 
                  'hover:bg-surface'
                }`}
                onClick={() => setExpandedStep(isExpanded ? null : step.step)}
              >
                {/* Step Icon */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-success to-emerald-400 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-r from-accent to-red-500 text-white'
                    : 'bg-muted text-text-secondary'
                }`}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Icon name={step.icon} size={16} className="sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    {/* Title */}
                    <h4 className={`font-heading-regular text-sm sm:text-base uppercase tracking-wider ${
                      isCurrent ? 'text-accent' : isCompleted ? 'text-primary' : 'text-text-secondary'
                    }`}>
                      {step.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-text-secondary font-sans">{step.duration}</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon name="ChevronDown" size={14} className="text-text-secondary" />
                      </motion.div>
                    </div>
                  </div>
                  {/* Description */}
                  <p className="text-xs sm:text-sm text-text-secondary mt-0.5 sm:mt-1 font-sans">
                    {step.description}
                  </p>
                  
                  {/* Progress for current step */}
                  {isCurrent && (
                    <div className="h-1 bg-accent/20 rounded-full mt-2">
                      <div className="h-1 bg-gradient-to-r from-accent to-red-500 rounded-full w-1/2" />
                    </div>
                  )}

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs sm:text-sm text-text-secondary mb-2 font-sans">
                            {step.details}
                          </p>
                          <div className="space-y-1">
                            <p className="text-xs font-heading-regular text-primary mb-1 uppercase tracking-wider">Tips:</p>
                            {step.tips.map((tip, tipIndex) => (
                              <div key={tipIndex} className="flex items-start space-x-2">
                                <Icon name="Lightbulb" size={12} className="text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-text-secondary font-sans">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated Time */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-accent" />
            <span className="text-text-secondary font-sans">Total time:</span>
          </div>
          <span className="font-heading-regular text-primary uppercase tracking-wider">
            ~8 minutes
          </span>
        </div>
        
        {/* Motivational message */}
        {currentStep === steps.length && (
          <div className="mt-3 p-2 bg-success/10 rounded-lg">
            <p className="text-xs text-success font-heading-regular text-center uppercase tracking-wider">
              🎉 Almost there! Just review and submit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessTimeline;