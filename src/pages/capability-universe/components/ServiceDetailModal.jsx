import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ServiceDetailModal = ({ service, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Icon name={service?.icon} size={24} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{service?.title}</h2>
                    <p className="text-text-secondary">{service?.category}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-text-secondary hover:text-primary"
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                      activeTab === tab?.id
                        ? 'text-accent border-b-2 border-accent bg-accent/5' :'text-text-secondary hover:text-primary hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4">Service Overview</h3>
                      <p className="text-text-secondary leading-relaxed mb-6">
                        {service?.fullDescription}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-primary mb-3">Key Features</h4>
                          <ul className="space-y-2">
                            {service?.features?.map((feature, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                                <span className="text-text-secondary">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-3">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {service?.technologies?.map((tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-muted text-text-secondary rounded-full text-sm"
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
                        <h4 className="font-semibold text-primary mb-4">Recent Work</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {service?.portfolio?.map((item, index) => (
                            <div key={index} className="bg-muted rounded-xl overflow-hidden">
                              <Image
                                src={item?.image}
                                alt={item?.title}
                                className="w-full h-48 object-cover"
                              />
                              <div className="p-4">
                                <h5 className="font-medium text-primary">{item?.title}</h5>
                                <p className="text-sm text-text-secondary">{item?.client}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'process' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-primary">Our Process</h3>
                    <div className="space-y-6">
                      {service?.process?.map((step, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-primary mb-2">{step?.title}</h4>
                            <p className="text-text-secondary">{step?.description}</p>
                            <div className="text-sm text-accent mt-2">
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
                    <h3 className="text-xl font-bold text-primary">Expected Results</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {service?.expectedResults?.map((result, index) => (
                        <div key={index} className="text-center p-6 bg-muted rounded-xl">
                          <div className="text-3xl font-bold text-accent mb-2">{result?.metric}</div>
                          <div className="text-sm text-text-secondary">{result?.description}</div>
                        </div>
                      ))}
                    </div>
                    
                    {service?.caseStudy && (
                      <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
                        <h4 className="font-semibold text-primary mb-4">Success Story</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-primary mb-2">{service?.caseStudy?.client}</h5>
                            <p className="text-text-secondary text-sm">{service?.caseStudy?.challenge}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-primary mb-2">Results Achieved</h5>
                            <ul className="space-y-1">
                              {service?.caseStudy?.results?.map((result, index) => (
                                <li key={index} className="text-sm text-text-secondary flex items-center space-x-2">
                                  <Icon name="TrendingUp" size={14} className="text-accent" />
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
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-primary">Investment Options</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {service?.pricingTiers?.map((tier, index) => (
                        <div
                          key={index}
                          className={`p-6 rounded-xl border-2 ${
                            tier?.popular
                              ? 'border-accent bg-accent/5' :'border-border bg-card'
                          }`}
                        >
                          {tier?.popular && (
                            <div className="text-center mb-4">
                              <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                                Most Popular
                              </span>
                            </div>
                          )}
                          <div className="text-center mb-6">
                            <h4 className="font-bold text-primary text-lg">{tier?.name}</h4>
                            <div className="text-3xl font-bold text-accent mt-2">{tier?.price}</div>
                            <div className="text-sm text-text-secondary">{tier?.billing}</div>
                          </div>
                          <ul className="space-y-3 mb-6">
                            {tier?.features?.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start space-x-2">
                                <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                                <span className="text-sm text-text-secondary">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            variant={tier?.popular ? "default" : "outline"}
                            fullWidth
                            className={tier?.popular ? "bg-accent hover:bg-accent/90" : "border-accent text-accent hover:bg-accent hover:text-white"}
                          >
                            Get Started
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    Ready to get started? Let's discuss your project.
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      iconName="MessageCircle"
                      iconPosition="left"
                      className="border-accent text-accent hover:bg-accent hover:text-white"
                    >
                      Ask Questions
                    </Button>
                    <Button
                      variant="default"
                      iconName="Calendar"
                      iconPosition="left"
                      className="bg-accent hover:bg-accent/90"
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
};

export default ServiceDetailModal;