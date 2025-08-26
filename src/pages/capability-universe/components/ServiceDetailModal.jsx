import React, { useState, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ServiceDetailModal = memo(({ service, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Reset tab when modal opens with new service
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen, service?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!service) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'process', label: 'Process', icon: 'GitBranch' },
    { id: 'results', label: 'Results', icon: 'TrendingUp' },
    { id: 'pricing', label: 'Investment', icon: 'DollarSign' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-16 bg-background 
                     rounded-2xl md:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
                <div className="flex items-center space-x-3 md:space-x-4 pr-4">
                  <div className="p-2 md:p-3 bg-accent/10 rounded-xl flex-shrink-0">
                    <Icon name={service?.icon} size={20} className="text-accent md:hidden" />
                    <Icon name={service?.icon} size={24} className="text-accent hidden md:block" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg md:text-2xl font-bold text-primary truncate">
                      {service?.title}
                    </h2>
                    <p className="text-xs md:text-sm text-text-secondary truncate">
                      {service?.category}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-text-secondary hover:text-primary flex-shrink-0"
                  aria-label="Close modal"
                >
                  <Icon name="X" size={20} className="md:hidden" />
                  <Icon name="X" size={24} className="hidden md:block" />
                </Button>
              </div>

              {/* Tabs - Scrollable on mobile */}
              <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`flex items-center space-x-1.5 md:space-x-2 px-4 md:px-6 py-3 md:py-4 
                             font-medium transition-all duration-300 whitespace-nowrap text-sm md:text-base ${
                      activeTab === tab?.id
                        ? 'text-accent border-b-2 border-accent bg-accent/5' 
                        : 'text-text-secondary hover:text-primary hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} className="md:hidden" />
                    <Icon name={tab?.icon} size={18} className="hidden md:block" />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6 md:space-y-8">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">
                            Service Overview
                          </h3>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-4 md:mb-6 whitespace-pre-line">
                            {service?.fullDescription}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                              <h4 className="font-semibold text-primary mb-2 md:mb-3 text-sm md:text-base">
                                Key Features
                              </h4>
                              <ul className="space-y-1.5 md:space-y-2">
                                {service?.features?.map((feature, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0 md:hidden" />
                                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0 hidden md:block" />
                                    <span className="text-xs md:text-sm text-text-secondary">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-primary mb-2 md:mb-3 text-sm md:text-base">
                                Technologies Used
                              </h4>
                              <div className="flex flex-wrap gap-1.5 md:gap-2">
                                {service?.technologies?.map((tech, index) => (
                                  <span
                                    key={index}
                                    className="px-2 md:px-3 py-1 bg-muted text-text-secondary 
                                             rounded-full text-xs md:text-sm"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {service?.portfolio && (
                          <div>
                            <h4 className="font-semibold text-primary mb-3 md:mb-4 text-sm md:text-base">
                              Recent Work
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                              {service?.portfolio?.map((item, index) => (
                                <div key={index} className="bg-muted rounded-xl overflow-hidden">
                                  <Image
                                    src={item?.image}
                                    alt={item?.title}
                                    className="w-full h-36 md:h-48 object-cover"
                                  />
                                  <div className="p-3 md:p-4">
                                    <h5 className="font-medium text-primary text-sm md:text-base">
                                      {item?.title}
                                    </h5>
                                    <p className="text-xs md:text-sm text-text-secondary">
                                      {item?.client}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'process' && (
                      <div className="space-y-4 md:space-y-6">
                        <h3 className="text-lg md:text-xl font-bold text-primary">Our Process</h3>
                        <div className="space-y-4 md:space-y-6">
                          {service?.process?.map((step, index) => (
                            <div key={index} className="flex space-x-3 md:space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-accent text-white rounded-full 
                                              flex items-center justify-center font-bold text-xs md:text-sm">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-primary mb-1 md:mb-2 text-sm md:text-base">
                                  {step?.title}
                                </h4>
                                <p className="text-xs md:text-sm text-text-secondary mb-1 md:mb-2">
                                  {step?.description}
                                </p>
                                <div className="text-xs md:text-sm text-accent">
                                  Duration: {step?.duration}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'results' && (
                      <div className="space-y-4 md:space-y-6">
                        <h3 className="text-lg md:text-xl font-bold text-primary">Expected Results</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                          {service?.expectedResults?.map((result, index) => (
                            <div key={index} className="text-center p-4 md:p-6 bg-muted rounded-xl">
                              <div className="text-2xl md:text-3xl font-bold text-accent mb-1 md:mb-2">
                                {result?.metric}
                              </div>
                              <div className="text-xs md:text-sm text-text-secondary">
                                {result?.description}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {service?.caseStudy && (
                          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 md:p-6">
                            <h4 className="font-semibold text-primary mb-3 md:mb-4 text-sm md:text-base">
                              Success Story
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                              <div>
                                <h5 className="font-medium text-primary mb-1 md:mb-2 text-sm md:text-base">
                                  {service?.caseStudy?.client}
                                </h5>
                                <p className="text-text-secondary text-xs md:text-sm">
                                  {service?.caseStudy?.challenge}
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium text-primary mb-1 md:mb-2 text-sm md:text-base">
                                  Results Achieved
                                </h5>
                                <ul className="space-y-1">
                                  {service?.caseStudy?.results?.map((result, index) => (
                                    <li key={index} className="text-xs md:text-sm text-text-secondary 
                                                             flex items-center space-x-2">
                                      <Icon name="TrendingUp" size={12} className="text-accent flex-shrink-0 md:hidden" />
                                      <Icon name="TrendingUp" size={14} className="text-accent flex-shrink-0 hidden md:block" />
                                      <span>{result}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'pricing' && (
                      <div className="space-y-4 md:space-y-6">
                        <h3 className="text-lg md:text-xl font-bold text-primary">Investment Options</h3>
                        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                          {service?.pricingTiers?.map((tier, index) => (
                            <div
                              key={index}
                              className={`p-4 md:p-6 rounded-xl border-2 ${
                                tier?.popular
                                  ? 'border-accent bg-accent/5' 
                                  : 'border-border bg-card'
                              }`}
                            >
                              {tier?.popular && (
                                <div className="text-center mb-3 md:mb-4">
                                  <span className="bg-accent text-white px-2 md:px-3 py-1 rounded-full 
                                                 text-xs md:text-sm font-medium">
                                    Most Popular
                                  </span>
                                </div>
                              )}
                              <div className="text-center mb-4 md:mb-6">
                                <h4 className="font-bold text-primary text-base md:text-lg">
                                  {tier?.name}
                                </h4>
                                <div className="text-2xl md:text-3xl font-bold text-accent mt-1 md:mt-2">
                                  {tier?.price}
                                </div>
                                <div className="text-xs md:text-sm text-text-secondary">
                                  {tier?.billing}
                                </div>
                              </div>
                              <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                                {tier?.features?.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-start space-x-2">
                                    <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0 md:hidden" />
                                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0 hidden md:block" />
                                    <span className="text-xs md:text-sm text-text-secondary">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                variant={tier?.popular ? "default" : "outline"}
                                fullWidth
                                size="sm"
                                className={tier?.popular 
                                  ? "bg-accent hover:bg-accent/90 text-xs md:text-sm" 
                                  : "border-accent text-accent hover:bg-accent hover:text-white text-xs md:text-sm"}
                              >
                                Get Started
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="text-xs md:text-sm text-text-secondary">
                    Ready to get started? Let's discuss your project.
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      iconName="MessageCircle"
                      iconPosition="left"
                      className="border-accent text-accent hover:bg-accent hover:text-white text-sm md:text-base"
                    >
                      Ask Questions
                    </Button>
                    <Button
                      variant="default"
                      iconName="Calendar"
                      iconPosition="left"
                      className="bg-accent hover:bg-accent/90 text-sm md:text-base"
                    >
                      Book Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

ServiceDetailModal.displayName = 'ServiceDetailModal';

export default ServiceDetailModal;