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
            className="fixed inset-8 lg:inset-16 bg-background rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Icon name={service?.icon} size={24} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading-regular text-primary uppercase tracking-wider">
                      {service?.title}
                    </h2>
                    <p className="text-sm text-text-secondary font-body">
                      {service?.category}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-text-secondary hover:text-primary"
                  aria-label="Close modal"
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-300 ${
                      activeTab === tab?.id
                        ? 'text-accent border-accent' 
                        : 'border-transparent text-text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span className="font-body">{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-heading-regular text-primary mb-4 uppercase tracking-wider">
                            Service Overview
                          </h3>
                          <p className="text-text-secondary leading-relaxed mb-6 whitespace-pre-line font-body">
                            {service?.fullDescription}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-heading-regular text-primary mb-3 uppercase tracking-wider">
                                Key Features
                              </h4>
                              <ul className="space-y-2">
                                {service?.features?.map((feature, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                                    <span className="text-sm text-text-secondary font-body">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-heading-regular text-primary mb-3 uppercase tracking-wider">
                                Technologies Used
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {service?.technologies?.map((tech, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-muted text-text-secondary rounded-full text-sm font-body"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'process' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-heading-regular text-primary uppercase tracking-wider">Our Process</h3>
                        <div className="space-y-6">
                          {service?.process?.map((step, index) => (
                            <div key={index} className="flex space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-accent text-white rounded-full 
                                              flex items-center justify-center font-heading-regular uppercase">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-heading-regular text-primary mb-2 uppercase tracking-wider">
                                  {step?.title}
                                </h4>
                                <p className="text-sm text-text-secondary mb-2 font-body">
                                  {step?.description}
                                </p>
                                <div className="text-sm text-accent font-body">
                                  Duration: {step?.duration}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'results' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-heading-regular text-primary uppercase tracking-wider">Expected Results</h3>
                        <div className="grid grid-cols-3 gap-6">
                          {service?.expectedResults?.map((result, index) => (
                            <div key={index} className="text-center p-6 bg-muted rounded-xl">
                              <div className="text-3xl font-heading-regular text-accent mb-2 uppercase tracking-wider">
                                {result?.metric}
                              </div>
                              <div className="text-sm text-text-secondary font-body">
                                {result?.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'pricing' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-heading-regular text-primary uppercase tracking-wider">Investment Options</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          {service?.pricingTiers?.map((tier, index) => (
                            <div
                              key={index}
                              className={`p-6 rounded-xl border-2 ${
                                tier?.popular
                                  ? 'border-accent bg-accent/5' 
                                  : 'border-border bg-card'
                              }`}
                            >
                              {tier?.popular && (
                                <div className="text-center mb-4">
                                  <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-heading-regular uppercase tracking-wider">
                                    Most Popular
                                  </span>
                                </div>
                              )}
                              <div className="text-center mb-6">
                                <h4 className="font-heading-regular text-primary text-lg uppercase tracking-wider">
                                  {tier?.name}
                                </h4>
                                <div className="text-3xl font-heading-regular text-accent mt-2 uppercase tracking-wider">
                                  {tier?.price}
                                </div>
                                <div className="text-sm text-text-secondary font-body">
                                  {tier?.billing}
                                </div>
                              </div>
                              <ul className="space-y-3 mb-6">
                                {tier?.features?.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-start space-x-2">
                                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                                    <span className="text-sm text-text-secondary font-body">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                variant={tier?.popular ? "default" : "outline"}
                                fullWidth
                                size="sm"
                                className={`font-heading-regular uppercase tracking-wider ${
                                  tier?.popular 
                                    ? "bg-accent hover:bg-accent/90" 
                                    : "border-accent text-accent hover:bg-accent hover:text-white"
                                }`}
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
              <div className="border-t border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary font-body">
                    Ready to get started? Let's discuss your project.
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      iconName="MessageCircle"
                      iconPosition="left"
                      className="border-accent text-accent hover:bg-accent hover:text-white font-heading-regular uppercase tracking-wider"
                    >
                      Ask Questions
                    </Button>
                    <Button
                      variant="default"
                      iconName="Calendar"
                      iconPosition="left"
                      className="bg-accent hover:bg-accent/90 font-heading-regular uppercase tracking-wider"
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