import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const MethodologySection = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const methodology = [
    {
      id: 1,
      phase: 'Discovery & Strategy',
      subtitle: 'Understanding Your Complete Digital Needs',
      icon: 'Search',
      color: 'from-accent to-red-400',
      duration: '1-2 weeks',
      steps: [
        { 
          title: 'Business & Technical Audit', 
          description: 'We analyze your current marketing performance and technical infrastructure to identify opportunities.',
          tools: ['Marketing Analytics Review', 'Technical Stack Assessment', 'Competitor Analysis']
        },
        { 
          title: 'Platform & Integration Planning', 
          description: 'Mapping out the ideal combination of marketing platforms and technical solutions for your goals.',
          tools: ['Platform Selection', 'Integration Architecture', 'Data Flow Mapping']
        },
        { 
          title: 'Strategic Roadmap Development', 
          description: 'Creating a unified strategy that aligns marketing objectives with technical capabilities.',
          tools: ['Marketing Strategy', 'Technical Requirements', 'Timeline Planning']
        }
      ],
      deliverables: ['Digital Strategy Document', 'Platform Recommendations', 'Project Roadmap'],
      collaboration: 'Stakeholder workshops, discovery sessions, and transparent planning'
    },
    {
      id: 2,
      phase: 'Design & Architecture',
      subtitle: 'Creating the Blueprint for Success',
      icon: 'Palette',
      color: 'from-orange-500 to-yellow-400',
      duration: '2-3 weeks',
      steps: [
        { 
          title: 'Creative Concept Development', 
          description: 'Designing compelling brand experiences and marketing campaigns that resonate with your audience.',
          tools: ['Brand Design', 'Campaign Creative', 'UX/UI Design']
        },
        { 
          title: 'Technical Architecture Design', 
          description: 'Planning scalable, secure infrastructure and development frameworks.',
          tools: ['Cloud Architecture', 'API Design', 'Security Planning']
        },
        { 
          title: 'Marketing Automation Blueprints', 
          description: 'Designing automated workflows that nurture leads and drive conversions.',
          tools: ['Workflow Design', 'Lead Scoring Models', 'Customer Journey Mapping']
        }
      ],
      deliverables: ['Design Systems', 'Technical Architecture', 'Automation Workflows'],
      collaboration: 'Design reviews, technical planning sessions, and iterative refinement'
    },
    {
      id: 3,
      phase: 'Build & Configure',
      subtitle: 'Bringing Strategy to Life',
      icon: 'Code',
      color: 'from-green-500 to-teal-400',
      duration: '4-8 weeks',
      steps: [
        { 
          title: 'Platform Implementation', 
          description: 'Setting up and configuring marketing platforms like Salesforce, HubSpot, and Shopify.',
          tools: ['CRM Setup', 'Marketing Automation', 'E-commerce Configuration']
        },
        { 
          title: 'Custom Development', 
          description: 'Building custom applications, integrations, and features using certified expertise.',
          tools: ['Full-Stack Development', 'API Integration', 'Cloud Deployment']
        },
        { 
          title: 'Quality Assurance & Testing', 
          description: 'Rigorous testing of both marketing systems and technical implementations.',
          tools: ['Campaign Testing', 'Performance Testing', 'Security Audits']
        }
      ],
      deliverables: ['Configured Platforms', 'Custom Applications', 'Testing Documentation'],
      collaboration: 'Sprint reviews, continuous feedback, and agile development'
    },
    {
      id: 4,
      phase: 'Launch & Optimize',
      subtitle: 'Driving Continuous Success',
      icon: 'Rocket',
      color: 'from-blue-500 to-purple-400',
      duration: 'Ongoing',
      steps: [
        { 
          title: 'Coordinated Launch', 
          description: 'Seamless deployment of marketing campaigns and technical solutions.',
          tools: ['Campaign Launch', 'Deployment Management', 'Go-Live Support']
        },
        { 
          title: 'Performance Monitoring', 
          description: 'Real-time tracking of marketing metrics and technical performance.',
          tools: ['Analytics Dashboards', 'Performance Monitoring', 'A/B Testing']
        },
        { 
          title: 'Continuous Optimization', 
          description: 'Ongoing refinement based on data insights and user feedback.',
          tools: ['Conversion Optimization', 'Performance Tuning', 'Feature Enhancement']
        }
      ],
      deliverables: ['Launch Plan', 'Analytics Reports', 'Optimization Recommendations'],
      collaboration: 'Regular reviews, performance reports, and strategic adjustments'
    }
  ];

  const activeMethodology = methodology?.[activePhase];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
      },
      { 
        threshold: 0.05,
        rootMargin: '100px'
      }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    if (window.innerWidth < 768) {
      setIsInView(true);
    }

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % methodology?.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-surface via-white to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
            <AppIcon name="Cog" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Our Methodology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            The <span className="text-accent">Integrated Approach</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
            Our battle-tested methodology seamlessly combines marketing strategy with technical execution. 
            One team, one process, delivering complete digital transformation.
          </p>
        </motion.div>

        {/* Process Navigation - FIXED: Now with flex-wrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12 lg:mb-16"
        >
          {methodology?.map((phase, index) => (
            <button
              key={phase?.id}
              onClick={() => setActivePhase(index)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                activePhase === index
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-text-secondary hover:bg-accent/5 hover:text-accent shadow-md'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                activePhase === index ? 'bg-white/20' : 'bg-accent/10'
              }`}>
                <AppIcon 
                  name={phase?.icon} 
                  size={14} 
                  className={activePhase === index ? 'text-white' : 'text-accent'} 
                />
              </div>
              <span>Phase {index + 1}</span>
            </button>
          ))}
        </motion.div>

        {/* Active Phase Content - Mobile Optimized */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-brand-elevation-lg overflow-hidden"
          >
            {/* Phase Header */}
            <div className={`bg-gradient-to-r ${activeMethodology?.color} p-6 sm:p-8 text-white`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <AppIcon name={activeMethodology?.icon} size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{activeMethodology?.phase}</h3>
                    <p className="text-base sm:text-xl opacity-90">{activeMethodology?.subtitle}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs sm:text-sm opacity-75">Duration</div>
                  <div className="text-base sm:text-lg font-semibold">{activeMethodology?.duration}</div>
                </div>
              </div>
            </div>

            {/* Phase Content - Stack on mobile */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Steps */}
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Process Steps</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {activeMethodology?.steps?.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`border rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300 ${
                          expandedStep === stepIndex 
                            ? 'border-accent shadow-brand-md' 
                            : 'border-gray-200 hover:border-accent/50'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedStep(expandedStep === stepIndex ? null : stepIndex)}
                          className="w-full p-4 sm:p-5 lg:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-accent font-semibold text-xs sm:text-sm">{stepIndex + 1}</span>
                            </div>
                            <h5 className="font-bold text-primary text-sm sm:text-base">{step?.title}</h5>
                          </div>
                          <AppIcon 
                            name="ChevronDown" 
                            size={20} 
                            className={`text-text-secondary transition-transform duration-300 flex-shrink-0 ${
                              expandedStep === stepIndex ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedStep === stepIndex && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                <p className="text-text-secondary mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{step?.description}</p>
                                <div>
                                  <h6 className="font-semibold text-primary mb-2 text-sm sm:text-base">Tools & Methods:</h6>
                                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {step?.tools?.map((tool, toolIndex) => (
                                      <span
                                        key={toolIndex}
                                        className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs sm:text-sm font-medium rounded-full"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables & Collaboration */}
                <div className="mt-6 lg:mt-0">
                  {/* Deliverables */}
                  <div className="mb-6 sm:mb-8">
                    <h4 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Key Deliverables</h4>
                    <div className="bg-surface rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6">
                      <ul className="space-y-2 sm:space-y-3">
                        {activeMethodology?.deliverables?.map((deliverable, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <AppIcon name="CheckCircle" size={20} className="text-accent flex-shrink-0" />
                            <span className="text-text-secondary font-medium text-sm sm:text-base">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Collaboration */}
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Client Collaboration</h4>
                    <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <AppIcon name="Users" size={24} className="text-accent mt-1 flex-shrink-0" />
                        <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                          {activeMethodology?.collaboration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Process Flow Visualization - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-center text-primary mb-6 sm:mb-8">End-to-End Digital Journey</h3>
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-4">
              {methodology?.map((phase, index) => (
                <React.Fragment key={phase?.id}>
                  <div
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      index <= activePhase 
                        ? 'bg-accent text-white shadow-brand-md' 
                        : 'bg-gray-200 text-text-secondary'
                    }`}
                  >
                    <AppIcon name={phase?.icon} size={20} />
                  </div>
                  {index < methodology?.length - 1 && (
                    <div className={`w-6 sm:w-8 h-1 transition-colors duration-300 ${
                      index < activePhase ? 'bg-accent' : 'bg-gray-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MethodologySection;