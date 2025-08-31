import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProcessTimeline = ({ currentStep = 1 }) => {
  const steps = [
    {
      step: 1,
      title: 'Contact Info',
      description: 'Basic details about you',
      icon: 'User',
      duration: '2 min'
    },
    {
      step: 2,
      title: 'Project Details',
      description: 'Your vision & requirements',
      icon: 'FileText',
      duration: '3 min'
    },
    {
      step: 3,
      title: 'Preferences',
      description: 'How we can help',
      icon: 'Settings',
      duration: '2 min'
    },
    {
      step: 4,
      title: 'Review & Submit',
      description: 'Confirm everything',
      icon: 'CheckCircle',
      duration: '1 min'
    }
  ];

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md">
      <h3 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4 flex items-center">
        <Icon name="GitBranch" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
        Your Journey
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.step < currentStep;
          const isCurrent = step.step === currentStep;
          const isUpcoming = step.step > currentStep;

          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection Line - Hidden on small mobile */}
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block absolute left-5 sm:left-6 top-10 sm:top-12 w-0.5 h-12 sm:h-16 ${
                    isCompleted ? 'bg-accent' : 'bg-border'
                  }`}
                />
              )}

              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Step Icon - Mobile Sized */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-accent text-white'
                      : isCurrent
                      ? 'bg-accent/10 text-accent border-2 border-accent'
                      : 'bg-muted text-text-secondary'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={16} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Icon name={step.icon} size={16} className="sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step Content - Mobile Text Sizes */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-semibold text-sm sm:text-base ${
                        isCurrent ? 'text-accent' : isCompleted ? 'text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span className="text-xs text-text-secondary">{step.duration}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary mt-0.5 sm:mt-1">{step.description}</p>
                  
                  {isCurrent && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="h-1 bg-accent/20 rounded-full mt-1.5 sm:mt-2"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-1 bg-accent rounded-full"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Estimated Time - Mobile Optimized */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-text-secondary">Total time:</span>
          <span className="font-semibold text-primary">~8 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessTimeline;