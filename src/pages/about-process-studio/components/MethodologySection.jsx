import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const MethodologySection = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [hoveredPhase, setHoveredPhase] = useState(null);
  const sectionRef = useRef(null);
  const processRef = useRef(null);
  const inView = useInView(processRef, { once: true, margin: "-100px" });

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

  const phaseVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const stepVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: { type: "spring", stiffness: 100, damping: 15 },
        opacity: { duration: 0.3 }
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-surface via-white to-surface relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-br from-accent to-primary rounded-full blur-3xl"
            style={{
              left: `${i * 40}%`,
              top: `${i * 30}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AppIcon name="Cog" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm font-sans">Our Methodology</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading-regular text-primary mb-4 sm:mb-6 uppercase tracking-wider">
            The <motion.span 
              className="text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
            >Integrated Approach</motion.span>
          </h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4 font-sans"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Our battle-tested methodology seamlessly combines marketing strategy with technical execution. 
            One team, one process, delivering complete digital transformation.
          </motion.p>
        </motion.div>

        {/* Enhanced Process Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12 lg:mb-16"
        >
          {methodology?.map((phase, index) => (
            <motion.button
              key={phase?.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePhase(index)}
              onMouseEnter={() => setHoveredPhase(index)}
              onMouseLeave={() => setHoveredPhase(null)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-heading-regular uppercase tracking-wider transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                activePhase === index
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-text-secondary hover:bg-accent/5 hover:text-accent shadow-md'
              }`}
            >
              {/* Animated background on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20"
                initial={{ x: "-100%" }}
                animate={{ x: hoveredPhase === index ? "0%" : "-100%" }}
                transition={{ duration: 0.3 }}
              />
              
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                activePhase === index ? 'bg-white/20' : 'bg-accent/10'
              }`}>
                <AppIcon 
                  name={phase?.icon} 
                  size={14} 
                  className={activePhase === index ? 'text-white' : 'text-accent'} 
                />
              </div>
              <span className="relative z-10">Phase {index + 1}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Active Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            variants={phaseVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-brand-elevation-lg overflow-hidden relative"
          >
            {/* Animated gradient background */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${activeMethodology?.color} opacity-5`}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Phase Header with Animation */}
            <div className={`bg-gradient-to-r ${activeMethodology?.color} p-6 sm:p-8 text-white relative overflow-hidden`}>
              <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <motion.div 
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <AppIcon name={activeMethodology?.icon} size={24} className="text-white" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-2xl sm:text-3xl font-heading-regular mb-1 sm:mb-2 uppercase tracking-wider"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {activeMethodology?.phase}
                    </motion.h3>
                    <motion.p 
                      className="text-base sm:text-xl opacity-90 font-sans"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {activeMethodology?.subtitle}
                    </motion.p>
                  </div>
                </div>
                <motion.div 
                  className="text-left sm:text-right"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  <div className="text-xs sm:text-sm opacity-75 font-sans">Duration</div>
                  <div className="text-base sm:text-lg font-heading-regular uppercase tracking-wider">{activeMethodology?.duration}</div>
                </motion.div>
              </div>
            </div>

            {/* Phase Content with Enhanced Animations */}
            <div className="p-6 sm:p-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Process Steps with Stagger Animation */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-xl sm:text-2xl font-heading-regular text-primary mb-4 sm:mb-6 uppercase tracking-wider">Process Steps</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {activeMethodology?.steps?.map((step, stepIndex) => (
                      <motion.div
                        key={stepIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + stepIndex * 0.1 }}
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
                            <motion.div 
                              className="w-6 h-6 sm:w-8 sm:h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0"
                              animate={expandedStep === stepIndex ? {
                                scale: [1, 1.2, 1],
                                backgroundColor: ["rgba(229, 62, 62, 0.1)", "rgba(229, 62, 62, 0.2)", "rgba(229, 62, 62, 0.1)"],
                              } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <span className="text-accent font-heading-regular text-xs sm:text-sm uppercase">{stepIndex + 1}</span>
                            </motion.div>
                            <h5 className="font-heading-regular text-primary text-sm sm:text-base uppercase tracking-wider">{step?.title}</h5>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedStep === stepIndex ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <AppIcon 
                              name="ChevronDown" 
                              size={20} 
                              className={`text-text-secondary flex-shrink-0`}
                            />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedStep === stepIndex && (
                            <motion.div
                              variants={stepVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                <p className="text-text-secondary mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base font-sans">{step?.description}</p>
                                <div>
                                  <h6 className="font-heading-regular text-primary mb-2 text-sm sm:text-base uppercase tracking-wider">Tools & Methods:</h6>
                                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {step?.tools?.map((tool, toolIndex) => (
                                      <motion.span
                                        key={toolIndex}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                          type: "spring",
                                          stiffness: 200,
                                          delay: toolIndex * 0.05 
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs sm:text-sm font-medium rounded-full font-sans"
                                      >
                                        {tool}
                                      </motion.span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Deliverables & Collaboration with Animation */}
                <motion.div 
                  className="mt-6 lg:mt-0"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {/* Deliverables */}
                  <div className="mb-6 sm:mb-8">
                    <h4 className="text-xl sm:text-2xl font-heading-regular text-primary mb-4 sm:mb-6 uppercase tracking-wider">Key Deliverables</h4>
                    <motion.div 
                      className="bg-surface rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ul className="space-y-2 sm:space-y-3">
                        {activeMethodology?.deliverables?.map((deliverable, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center space-x-3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.2,
                              }}
                            >
                              <AppIcon name="CheckCircle" size={20} className="text-accent flex-shrink-0" />
                            </motion.div>
                            <span className="text-text-secondary font-medium text-sm sm:text-base font-sans">{deliverable}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Collaboration */}
                  <div>
                    <h4 className="text-xl sm:text-2xl font-heading-regular text-primary mb-4 sm:mb-6 uppercase tracking-wider">Client Collaboration</h4>
                    <motion.div 
                      className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <AppIcon name="Users" size={24} className="text-accent mt-1 flex-shrink-0" />
                        </motion.div>
                        <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-sans">
                          {activeMethodology?.collaboration}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Process Flow Visualization */}
        <motion.div
          ref={processRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <h3 className="text-xl sm:text-2xl font-heading-regular text-center text-primary mb-6 sm:mb-8 uppercase tracking-wider">End-to-End Digital Journey</h3>
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-4">
              {methodology?.map((phase, index) => (
                <React.Fragment key={phase?.id}>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={inView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1 
                    }}
                    whileHover={{ scale: 1.1 }}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      index <= activePhase 
                        ? 'bg-accent text-white shadow-brand-md' 
                        : 'bg-gray-200 text-text-secondary'
                    }`}
                    onClick={() => setActivePhase(index)}
                  >
                    <AppIcon name={phase?.icon} size={20} />
                  </motion.div>
                  {index < methodology?.length - 1 && (
                    <motion.div 
                      className="w-6 sm:w-8 h-1 transition-colors duration-300"
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{ 
                        duration: 0.5,
                        delay: index * 0.1 + 0.2
                      }}
                      style={{
                        background: index < activePhase 
                          ? 'linear-gradient(90deg, #E53E3E 0%, #E53E3E 100%)' 
                          : '#E5E7EB',
                        originX: 0
                      }}
                    />
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