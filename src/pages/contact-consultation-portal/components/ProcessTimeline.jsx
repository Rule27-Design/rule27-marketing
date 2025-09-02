// src/pages/contact-consultation-portal/components/ProcessTimeline.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProcessTimeline = ({ currentStep = 1 }) => {
  const [hoveredStep, setHoveredStep] = useState(null);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5"
        animate={{
          opacity: [0, 0.05, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Header - Using Steelfish */}
      <motion.div 
        className="flex items-center justify-between mb-4 sm:mb-6 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-accent to-red-500 rounded-lg flex items-center justify-center"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Icon name="GitBranch" size={18} className="text-white sm:w-5 sm:h-5" />
          </motion.div>
          <h3 className="text-base sm:text-lg font-heading-regular text-primary uppercase tracking-wider">
            Your Journey
          </h3>
        </div>
        
        {/* Progress indicator - Using Steelfish for numbers */}
        <motion.div 
          className="text-xs sm:text-sm text-accent font-heading-regular uppercase tracking-wider"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          {Math.round(animatedProgress)}% Complete
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-4 sm:mb-6 relative z-10">
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-red-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
          >
            {/* Animated shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Steps */}
      <motion.div 
        className="space-y-3 sm:space-y-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => {
          const isCompleted = step.step < currentStep;
          const isCurrent = step.step === currentStep;
          const isExpanded = expandedStep === step.step;

          return (
            <motion.div
              key={step.step}
              variants={stepVariants}
              className="relative"
              onMouseEnter={() => setHoveredStep(step.step)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <motion.div
                  className={`hidden sm:block absolute left-5 sm:left-6 top-10 sm:top-12 w-0.5 ${
                    isCompleted ? 'bg-accent' : 'bg-border'
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: isExpanded ? 'auto' : '3rem' }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-accent to-red-500"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{ transformOrigin: 'top' }}
                    />
                  )}
                </motion.div>
              )}

              <motion.div
                className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer ${
                  isCurrent ? 'bg-accent/5 border border-accent/20' : 
                  isCompleted ? 'bg-success/5' : 
                  'hover:bg-surface'
                }`}
                whileHover={{ x: 5 }}
                onClick={() => setExpandedStep(isExpanded ? null : step.step)}
              >
                {/* Step Icon */}
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 relative ${
                    isCompleted
                      ? 'bg-gradient-to-r from-success to-emerald-400 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-r from-accent to-red-500 text-white'
                      : 'bg-muted text-text-secondary'
                  }`}
                  animate={isCurrent ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {/* Glow effect for current */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 bg-accent rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  
                  <motion.div
                    animate={hoveredStep === step.step ? {
                      rotate: 360,
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isCompleted ? (
                      <Icon name="Check" size={16} className="sm:w-5 sm:h-5 relative z-10" />
                    ) : (
                      <Icon name={step.icon} size={16} className="sm:w-5 sm:h-5 relative z-10" />
                    )}
                  </motion.div>
                </motion.div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    {/* Title - Using Steelfish */}
                    <motion.h4
                      className={`font-heading-regular text-sm sm:text-base uppercase tracking-wider ${
                        isCurrent ? 'text-accent' : isCompleted ? 'text-primary' : 'text-text-secondary'
                      }`}
                      animate={isCurrent ? {
                        color: ['#E53E3E', '#FF6B6B', '#E53E3E'],
                      } : {}}
                      transition={{
                        duration: 3,
                        repeat: isCurrent ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      {step.title}
                    </motion.h4>
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
                  {/* Description - Sans font */}
                  <p className="text-xs sm:text-sm text-text-secondary mt-0.5 sm:mt-1 font-sans">
                    {step.description}
                  </p>
                  
                  {/* Progress for current step */}
                  {isCurrent && (
                    <motion.div
                      className="h-1 bg-accent/20 rounded-full mt-2"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                    >
                      <motion.div
                        className="h-1 bg-gradient-to-r from-accent to-red-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          repeatType: 'reverse',
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
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
                              <motion.div
                                key={tipIndex}
                                className="flex items-start space-x-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: tipIndex * 0.1 }}
                              >
                                <Icon name="Lightbulb" size={12} className="text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-text-secondary font-sans">{tip}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Estimated Time - Mixed fonts */}
      <motion.div 
        className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon name="Clock" size={14} className="text-accent" />
            </motion.div>
            <span className="text-text-secondary font-sans">Total time:</span>
          </div>
          <motion.span 
            className="font-heading-regular text-primary uppercase tracking-wider"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ~8 minutes
          </motion.span>
        </div>
        
        {/* Motivational message */}
        {currentStep === steps.length && (
          <motion.div
            className="mt-3 p-2 bg-success/10 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-success font-heading-regular text-center uppercase tracking-wider">
              🎉 Almost there! Just review and submit.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProcessTimeline;