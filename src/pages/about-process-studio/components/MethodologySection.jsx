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
      phase: 'Discovery & Disruption',
      subtitle: 'Break the Rules Before Following Them',
      icon: 'Search',
      color: 'from-accent to-red-400',
      duration: '1-2 weeks',
      steps: [
        { 
          title: 'Rule Breaking Audit', 
          description: 'We identify every conventional approach in your industry - then figure out how to break them intelligently.',
          tools: ['Industry Analysis', 'Competitor Deconstruction', 'Trend Disruption Map']
        },
        { 
          title: 'User Psychology Deep Dive', 
          description: 'Understanding your users better than they understand themselves through behavioral analysis.',
          tools: ['User Journey Mapping', 'Behavioral Psychology', 'Emotional Trigger Analysis']
        },
        { 
          title: 'Innovation Opportunity Matrix', 
          description: 'Mapping untapped opportunities where creativity meets business impact.',
          tools: ['Innovation Workshops', 'Blue Ocean Strategy', 'Disruptive Innovation Framework']
        }
      ],
      deliverables: ['Innovation Strategy', 'User Psychology Report', 'Disruption Roadmap'],
      collaboration: 'Daily standups, real-time feedback loops, and transparent progress tracking'
    },
    {
      id: 2,
      phase: 'Ideation & Innovation',
      subtitle: 'Where Impossible Becomes Inevitable',
      icon: 'Lightbulb',
      color: 'from-orange-500 to-yellow-400',
      duration: '2-3 weeks',
      steps: [
        { 
          title: 'Creative Storm Sessions', 
          description: 'High-energy collaborative sessions where no idea is too wild and every boundary is questioned.',
          tools: ['Design Thinking Workshops', 'Rapid Prototyping', 'Assumption Challenging']
        },
        { 
          title: 'Technical Feasibility Mapping', 
          description: 'Ensuring every creative vision has a technically sound execution path.',
          tools: ['Technical Architecture', 'Performance Planning', 'Scalability Assessment']
        },
        { 
          title: 'Experience Architecture', 
          description: 'Crafting user experiences that don\'t just work - they create emotional connections.',
          tools: ['User Experience Design', 'Emotional Journey Mapping', 'Interaction Design']
        }
      ],
      deliverables: ['Creative Concepts', 'Technical Architecture', 'Experience Blueprints'],
      collaboration: 'Co-creation sessions with your team, iterative feedback, and concept refinement'
    },
    {
      id: 3,
      phase: 'Design & Development',
      subtitle: 'Apple-Level Execution Excellence',
      icon: 'Palette',
      color: 'from-green-500 to-teal-400',
      duration: '4-8 weeks',
      steps: [
        { 
          title: 'Pixel-Perfect Design Systems', 
          description: 'Creating design systems that scale beautifully and maintain consistency across all touchpoints.',
          tools: ['Design System Creation', 'Component Library', 'Brand Guidelines']
        },
        { 
          title: 'Performance-First Development', 
          description: 'Building digital experiences that load faster than you can think and perform flawlessly.',
          tools: ['Modern Frameworks', 'Performance Optimization', 'Quality Assurance']
        },
        { 
          title: 'User Testing & Refinement', 
          description: 'Continuous testing and iteration to ensure every interaction exceeds expectations.',
          tools: ['User Testing', 'A/B Testing', 'Analytics Implementation']
        }
      ],
      deliverables: ['Production-Ready Design', 'Fully Developed Solution', 'Testing Reports'],
      collaboration: 'Weekly demos, continuous feedback integration, and agile development sprints'
    },
    {
      id: 4,
      phase: 'Launch & Amplification',
      subtitle: 'Making Extraordinary the New Ordinary',
      icon: 'Rocket',
      color: 'from-blue-500 to-purple-400',
      duration: '1-2 weeks',
      steps: [
        { 
          title: 'Strategic Launch Planning', 
          description: 'Coordinating every element of your launch to maximize impact and minimize risk.',
          tools: ['Launch Strategy', 'Risk Assessment', 'Rollout Planning']
        },
        { 
          title: 'Performance Monitoring', 
          description: 'Real-time monitoring and optimization to ensure peak performance from day one.',
          tools: ['Analytics Setup', 'Performance Monitoring', 'User Behavior Tracking']
        },
        { 
          title: 'Success Amplification', 
          description: 'Identifying and amplifying what works to accelerate growth and engagement.',
          tools: ['Success Metrics Analysis', 'Optimization Recommendations', 'Growth Strategy']
        }
      ],
      deliverables: ['Launch Strategy', 'Performance Dashboard', 'Growth Playbook'],
      collaboration: 'Launch coordination, real-time support, and ongoing optimization strategy'
    }
  ];

  const activeMethodology = methodology?.[activePhase];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
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
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-surface via-white to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <AppIcon name="Cog" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-sm">Our Methodology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            The <span className="text-accent">Rule27 Process</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Our battle-tested methodology that transforms ambitious ideas into extraordinary digital experiences. 
            No two projects are the same, but our approach ensures consistent excellence.
          </p>
        </motion.div>

        {/* Process Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {methodology?.map((phase, index) => (
            <button
              key={phase?.id}
              onClick={() => setActivePhase(index)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-500 ${
                activePhase === index
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-brand-elevation transform scale-105'
                  : 'bg-white text-text-secondary hover:bg-accent/5 hover:text-accent shadow-brand-md'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activePhase === index ? 'bg-white/20' : 'bg-accent/10'
              }`}>
                <AppIcon 
                  name={phase?.icon} 
                  size={16} 
                  className={activePhase === index ? 'text-white' : 'text-accent'} 
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Phase {index + 1}</div>
                <div className="text-xs opacity-80">{phase?.phase}</div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Active Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-brand-elevation-lg overflow-hidden"
          >
            {/* Phase Header */}
            <div className={`bg-gradient-to-r ${activeMethodology?.color} p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <AppIcon name={activeMethodology?.icon} size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{activeMethodology?.phase}</h3>
                    <p className="text-xl opacity-90">{activeMethodology?.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-75">Duration</div>
                  <div className="text-lg font-semibold">{activeMethodology?.duration}</div>
                </div>
              </div>
            </div>

            {/* Phase Content */}
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Steps */}
                <div>
                  <h4 className="text-2xl font-bold text-primary mb-6">Process Steps</h4>
                  <div className="space-y-4">
                    {activeMethodology?.steps?.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                          expandedStep === stepIndex 
                            ? 'border-accent shadow-brand-md' 
                            : 'border-gray-200 hover:border-accent/50'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedStep(expandedStep === stepIndex ? null : stepIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                              <span className="text-accent font-semibold text-sm">{stepIndex + 1}</span>
                            </div>
                            <h5 className="font-bold text-primary">{step?.title}</h5>
                          </div>
                          <AppIcon 
                            name="ChevronDown" 
                            size={20} 
                            className={`text-text-secondary transition-transform duration-300 ${
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
                              <div className="px-6 pb-6">
                                <p className="text-text-secondary mb-4 leading-relaxed">{step?.description}</p>
                                <div>
                                  <h6 className="font-semibold text-primary mb-2">Tools & Methods:</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {step?.tools?.map((tool, toolIndex) => (
                                      <span
                                        key={toolIndex}
                                        className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full"
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
                <div>
                  {/* Deliverables */}
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-primary mb-6">Key Deliverables</h4>
                    <div className="bg-surface rounded-2xl p-6">
                      <ul className="space-y-3">
                        {activeMethodology?.deliverables?.map((deliverable, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <AppIcon name="CheckCircle" size={20} className="text-accent" />
                            <span className="text-text-secondary font-medium">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Collaboration */}
                  <div>
                    <h4 className="text-2xl font-bold text-primary mb-6">Client Collaboration</h4>
                    <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-2xl p-6">
                      <div className="flex items-start space-x-4">
                        <AppIcon name="Users" size={24} className="text-accent mt-1" />
                        <p className="text-text-secondary leading-relaxed">
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

        {/* Process Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center text-primary mb-8">End-to-End Journey</h3>
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {methodology?.map((phase, index) => (
                <React.Fragment key={phase?.id}>
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      index <= activePhase 
                        ? 'bg-accent text-white shadow-brand-md' 
                        : 'bg-gray-200 text-text-secondary'
                    }`}
                  >
                    <AppIcon name={phase?.icon} size={24} />
                  </div>
                  {index < methodology?.length - 1 && (
                    <div className={`w-8 h-1 transition-colors duration-300 ${
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