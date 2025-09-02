import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const OriginStory = () => {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const inView = useInView(timelineRef, { once: true, margin: "-100px" });

  const milestones = [
    {
      year: '2014',
      title: 'Founded as Rule27 Design',
      description: 'Started as a Web Design & Marketing shop by rebels who believed agencies were playing it too safe. We asked: "What if creativity and technology had no limits?"',
      icon: 'Zap',
      color: 'from-accent to-red-400'
    },
    {
      year: '2015',
      title: 'The 27th Rule Philosophy',
      description: 'Discovered our philosophy: while others follow 26 design principles, we write the 27th rule that breaks them all. Excellence through innovation became our mantra.',
      icon: 'Compass',
      color: 'from-accent to-orange-400'
    },
    {
      year: '2017',
      title: 'CRM & Marketing Automation',
      description: 'Expanded into CRM implementations and marketing automation. Earned our first Salesforce certifications, marking our evolution into relationship architects.',
      icon: 'Network',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      year: '2019',
      title: 'Full-Service Digital Agency',
      description: 'Grew our team to provide comprehensive IT & Marketing consulting. Achieved AWS and Google Cloud certifications, becoming our clients\' one-stop digital powerhouse.',
      icon: 'Layers',
      color: 'from-green-500 to-teal-400'
    },
    {
      year: '2020',
      title: 'Enterprise Partnerships',
      description: 'Secured partnerships with HubSpot, Adobe, and Microsoft Azure. Pivoted to serve enterprise clients during global digital transformation.',
      icon: 'Rocket',
      color: 'from-accent to-pink-400'
    },
    {
      year: '2021',
      title: 'AI & Advanced Technology',
      description: 'Integrated AI and machine learning into our service offerings. Launched partnerships with Shopify and expanded our development capabilities.',
      icon: 'Cpu',
      color: 'from-purple-500 to-indigo-400'
    },
    {
      year: '2023',
      title: 'Innovation Laboratory',
      description: 'Established our R&D division, pushing boundaries between marketing creativity and technical innovation. Added Snowflake and advanced analytics partnerships.',
      icon: 'Lightbulb',
      color: 'from-accent to-purple-400'
    },
    {
      year: '2025',
      title: 'The Digital Powerhouse',
      description: 'Today we stand as the complete digital partner—10+ platform certifications, 18+ strategic partnerships, delivering marketing excellence with technical precision.',
      icon: 'Crown',
      color: 'from-accent to-blue-400'
    }
  ];

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

  // Auto-advance timeline
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % milestones.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [milestones.length]);

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
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
    <section id="origin-story" ref={sectionRef} className="py-6 sm:py-10 md:py-14 lg:py-16 bg-gradient-to-br from-surface to-white relative overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AppIcon name="BookOpen" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm font-sans">Our Origin Story</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading-regular text-primary mb-3 sm:mb-4 uppercase tracking-wider">
            From <motion.span 
              className="text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
            >Rebellious Startup</motion.span> to Digital Powerhouse
          </h2>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed px-4 font-sans"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Every revolution starts with a simple question: "What if we did things differently?" 
            Here's how Rule27 Design evolved from a rebellious idea to a certified leader in both marketing and development.
          </motion.p>
        </motion.div>

        {/* Enhanced Timeline with Animations */}
        <div className="relative" ref={timelineRef}>
          {/* Animated Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
            <motion.div 
              className="w-full bg-gradient-to-b from-accent to-gray-300"
              initial={{ height: 0 }}
              animate={inView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {/* Milestone Cards with Enhanced Animations */}
          <motion.div 
            className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10"
            variants={timelineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {milestones?.map((milestone, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                onMouseEnter={() => setActiveTimeline(index)}
                onTouchStart={() => setActiveTimeline(index)}
              >
                {/* Content Card with Hover Effects */}
                <motion.div 
                  className={`flex-1 w-full ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 group cursor-pointer relative overflow-hidden ${
                    activeTimeline === index ? 'ring-2 ring-accent' : ''
                  }`}>
                    {/* Animated background gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${milestone?.color} opacity-0`}
                      animate={{
                        opacity: activeTimeline === index ? 0.05 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                        <motion.div 
                          className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${milestone?.color} rounded-full flex items-center justify-center`}
                          animate={activeTimeline === index ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 360],
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <AppIcon name={milestone?.icon} size={16} className="text-white" />
                        </motion.div>
                        <motion.div 
                          className="text-lg sm:text-xl font-heading-regular text-accent uppercase tracking-wider"
                          animate={activeTimeline === index ? {
                            x: [0, 5, 0],
                          } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {milestone?.year}
                        </motion.div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-2 group-hover:text-accent transition-colors duration-300 uppercase tracking-wider">
                        {milestone?.title}
                      </h3>
                      <p className="text-sm sm:text-base text-text-secondary leading-relaxed group-hover:text-primary transition-colors duration-300 font-sans">
                        {milestone?.description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Animated Timeline Node */}
                <motion.div 
                  className="hidden md:flex w-6 h-6 bg-accent rounded-full border-4 border-white shadow-brand-md z-10 relative"
                  animate={activeTimeline === index ? {
                    scale: [1, 1.5, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-accent rounded-full"
                    animate={activeTimeline === index ? {
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 2, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Spacer */}
                <div className="hidden md:block flex-1"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Philosophy Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 sm:mt-10 lg:mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl p-6 sm:p-10 text-white max-w-4xl mx-auto relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[size:20px_20px]"
                animate={{
                  backgroundPosition: ["0px 0px", "20px 20px"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            >
              <AppIcon name="Quote" size={28} className="mx-auto mb-3 sm:mb-4 opacity-70" />
            </motion.div>
            <motion.h3 
              className="text-xl sm:text-2xl font-heading-regular mb-3 sm:mb-4 uppercase tracking-wider"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              The 27th Rule Philosophy
            </motion.h3>
            <motion.p 
              className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90 relative z-10 font-sans"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              "While the industry follows 26 established principles, we believe in writing the 27th rule—the one that 
              breaks conventions and creates extraordinary from ordinary. We're not just another agency or dev shop. 
              We're the digital powerhouse that delivers marketing brilliance with technical excellence, making us the 
              only partner you'll ever need for complete digital transformation."
            </motion.p>
            <motion.div 
              className="mt-4 sm:mt-6 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-heading-bold text-sm sm:text-base uppercase">27</span>
                </motion.div>
                <div className="text-left">
                  <div className="font-heading-regular text-xs sm:text-sm uppercase tracking-wider">Rule27 Design Founders</div>
                  <div className="text-xs opacity-70 font-sans">Digital Innovators</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OriginStory;