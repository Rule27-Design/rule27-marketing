import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;

  useEffect(() => {
    if (isInView && numericValue) {
      let start = 0;
      const end = numericValue;
      const incrementTime = duration * 1000 / end;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, numericValue, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

const AwardsRecognition = () => {
  const [activeCategory, setActiveCategory] = useState('certifications');
  const [expandedCertCategory, setExpandedCertCategory] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const sectionRef = useRef(null);
  const controls = useAnimation();

  const recognitionData = {
    awards: [
      {
        id: 1,
        title: 'Digital Agency of the Year',
        organization: 'Web Excellence Awards',
        year: '2024',
        category: 'Industry Leadership',
        description: 'Recognized for revolutionary approach to digital experiences and client results.',
        icon: 'Award',
        color: 'from-yellow-400 to-orange-500'
      },
      {
        id: 2,
        title: 'Innovation in UX Design',
        organization: 'UX Design Institute',
        year: '2024',
        category: 'Design Excellence',
        description: 'Honored for pushing boundaries in user experience and interface innovation.',
        icon: 'Palette',
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 3,
        title: 'Best Marketing Campaign',
        organization: 'Marketing Excellence Awards',
        year: '2023',
        category: 'Creative Excellence',
        description: 'Awarded for campaigns that redefined industry standards and drove exceptional ROI.',
        icon: 'Lightbulb',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 4,
        title: 'Cloud Innovation Leader',
        organization: 'Digital Innovation Summit',
        year: '2023',
        category: 'Technology',
        description: 'Recognized for integrating cutting-edge cloud solutions and AI technologies.',
        icon: 'Cpu',
        color: 'from-green-500 to-teal-500'
      }
    ],
    certifications: {
      salesforce: {
        platform: 'Salesforce',
        icon: 'Cloud',
        color: 'from-blue-500 to-cyan-500',
        count: 12,
        certifications: [
          'Administrator',
          'Platform Developer I',
          'Platform Developer II',
          'Data Architect',
          'Marketing Cloud Email Specialist',
          'Marketing Cloud Engagement Consultant',
          'Marketing Cloud Engagement Developer',
          'Marketing Cloud Account Engagement Consultant',
          'Service Cloud Consultant',
          'Sales Cloud Consultant',
          'Experience Cloud Consultant',
          'Platform App Builder'
        ]
      },
      aws: {
        platform: 'Amazon Web Services',
        icon: 'Server',
        color: 'from-orange-500 to-red-500',
        count: 4,
        certifications: [
          'Solutions Architect Associate',
          'Developer Associate',
          'DevOps Engineer Professional',
          'Solutions Architect Professional'
        ]
      },
      google: {
        platform: 'Google',
        icon: 'Globe',
        color: 'from-blue-600 to-green-600',
        count: 8,
        certifications: [
          'Google Ads Search',
          'Google Ads Display',
          'Google Ads Video',
          'Google Ads Shopping',
          'Google Analytics Individual Qualification',
          'Google Analytics 4',
          'Professional Cloud Developer',
          'Cloud Digital Leader'
        ]
      },
      microsoft: {
        platform: 'Microsoft Azure',
        icon: 'Layers',
        color: 'from-indigo-600 to-blue-600',
        count: 3,
        certifications: [
          'Azure Developer Associate',
          'Azure Administrator Associate',
          'Azure Solutions Architect Expert'
        ]
      },
      hubspot: {
        platform: 'HubSpot',
        icon: 'Target',
        color: 'from-orange-600 to-red-600',
        count: 9,
        certifications: [
          'Marketing Software',
          'Inbound Marketing',
          'Content Marketing',
          'Email Marketing',
          'Social Media Marketing',
          'CMS Implementation',
          'Sales Software',
          'Service Hub Software',
          'Revenue Operations'
        ]
      },
      adobe: {
        platform: 'Adobe',
        icon: 'Image',
        color: 'from-red-600 to-purple-600',
        count: 5,
        certifications: [
          'Adobe Experience Manager Sites Developer',
          'Adobe Analytics Developer',
          'Adobe Target Business Practitioner',
          'Adobe Campaign Developer',
          'Adobe Creative Cloud Professional'
        ]
      },
      shopify: {
        platform: 'Shopify',
        icon: 'ShoppingCart',
        color: 'from-green-600 to-teal-600',
        count: 3,
        certifications: [
          'Shopify Partner Academy',
          'Shopify Plus Certified',
          'Shopify App Development'
        ]
      },
      meta: {
        platform: 'Meta',
        icon: 'Share2',
        color: 'from-blue-700 to-indigo-600',
        count: 4,
        certifications: [
          'Meta Certified Digital Marketing Associate',
          'Meta Certified Media Planning Professional',
          'Meta Certified Media Buying Professional',
          'Meta Certified Creative Strategy Professional'
        ]
      },
      other: {
        platform: 'Additional Platforms',
        icon: 'Award',
        color: 'from-purple-600 to-pink-600',
        count: 8,
        certifications: [
          'Klaviyo Partner Certification',
          'Braze Certified Practitioner',
          'Docker Certified Associate',
          'Certified Kubernetes Administrator',
          'Snowflake SnowPro Core',
          'Mixpanel Product Analytics',
          'Segment Customer Data Platform',
          'Netlify Jamstack Certification'
        ]
      }
    },
    media: [
      {
        id: 1,
        title: 'Forbes: "The Full-Stack Digital Powerhouse"',
        organization: 'Forbes Magazine',
        year: '2024',
        category: 'Industry Feature',
        description: 'Featured story on how Rule27 Design combines marketing excellence with technical innovation.',
        icon: 'FileText',
        color: 'from-indigo-500 to-purple-600'
      },
      {
        id: 2,
        title: 'TechCrunch: Marketing Meets Development',
        organization: 'TechCrunch',
        year: '2024',
        category: 'Tech Coverage',
        description: 'Highlighted for bridging the gap between creative marketing and enterprise development.',
        icon: 'Newspaper',
        color: 'from-green-600 to-blue-600'
      },
      {
        id: 3,
        title: 'AdWeek: Digital Transformation Leaders',
        organization: 'AdWeek',
        year: '2023',
        category: 'Marketing Industry',
        description: 'Case study on helping Fortune 500 companies with end-to-end digital transformation.',
        icon: 'Monitor',
        color: 'from-orange-600 to-red-600'
      }
    ]
  };

  // Calculate total certifications
  const totalCertifications = Object.values(recognitionData.certifications).reduce(
    (sum, platform) => sum + platform.count, 0
  );

  const categories = [
    { id: 'certifications', label: 'Certifications', icon: 'Shield', count: totalCertifications },
    { id: 'awards', label: 'Awards', icon: 'Award', count: recognitionData?.awards?.length },
    { id: 'media', label: 'Media', icon: 'Newspaper', count: recognitionData?.media?.length }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
        if (entry?.isIntersecting) {
          controls.start("visible");
        }
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
  }, [controls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const statVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.2
      }
    }
  };

  // Floating particles for background
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-accent/20 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            y: [null, -100],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-surface via-white to-surface relative overflow-hidden">
      {/* Animated background elements */}
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AppIcon name="Trophy" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Recognition</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Industry <motion.span 
              className="text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
            >Recognition</motion.span>
          </h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            With <span className="font-bold text-accent"><AnimatedCounter value={totalCertifications} /></span>+ certifications across 9 major platforms, we're not just certified—we're 
            comprehensively equipped to handle every aspect of your digital transformation.
          </motion.p>
        </motion.div>

        {/* Animated Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12 lg:mb-16"
        >
          {categories?.map((category, index) => (
            <motion.button
              key={category?.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category?.id
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-text-secondary hover:bg-accent/5 hover:text-accent shadow-md'
              }`}
            >
              <AppIcon name={category?.icon} size={16} className="flex-shrink-0" />
              <span>{category?.label}</span>
              <motion.span 
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeCategory === category?.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-accent/10 text-accent'
                }`}
                animate={activeCategory === category?.id ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <AnimatedCounter value={category?.count} duration={1} />
              </motion.span>
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Content Display */}
        <AnimatePresence mode="wait">
          {activeCategory === 'certifications' ? (
            // Certifications Grid with Enhanced Animations
            <motion.div
              key="certifications"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
            >
              {Object.entries(recognitionData.certifications).map(([key, platform], index) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 h-full relative overflow-hidden">
                    {/* Animated background gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${platform?.color} opacity-0`}
                      animate={{
                        opacity: expandedCertCategory === key ? 0.05 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Platform Header with counter animation */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${platform?.color} rounded-xl flex items-center justify-center`}
                          whileHover={{
                            scale: 1.1,
                            rotate: [0, -10, 10, 0],
                            transition: { duration: 0.5 }
                          }}
                        >
                          <AppIcon name={platform?.icon} size={24} className="text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                            {platform?.platform}
                          </h3>
                          <p className="text-accent font-semibold text-sm">
                            <AnimatedCounter value={platform?.count} duration={1.5} /> Certifications
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedCertCategory(expandedCertCategory === key ? null : key)}
                        className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300"
                      >
                        <motion.div
                          animate={{ rotate: expandedCertCategory === key ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AppIcon 
                            name="ChevronDown" 
                            size={16} 
                            className={expandedCertCategory === key ? "text-accent" : "text-text-secondary"}
                          />
                        </motion.div>
                      </motion.button>
                    </div>

                    {/* Animated Certification List */}
                    <motion.div 
                      className="space-y-1.5 overflow-hidden relative z-10"
                      animate={{
                        height: expandedCertCategory === key ? "auto" : 80
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {platform?.certifications.slice(0, expandedCertCategory === key ? undefined : 3).map((cert, certIndex) => (
                        <motion.div 
                          key={certIndex} 
                          className="flex items-center space-x-2"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: certIndex * 0.05 }}
                        >
                          <motion.div
                            animate={{
                              scale: expandedCertCategory === key ? [1, 1.2, 1] : 1
                            }}
                            transition={{ delay: certIndex * 0.1 }}
                          >
                            <AppIcon name="CheckCircle" size={14} className="text-accent flex-shrink-0" />
                          </motion.div>
                          <span className="text-text-secondary text-sm">{cert}</span>
                        </motion.div>
                      ))}
                      {!expandedCertCategory && platform?.certifications.length > 3 && (
                        <motion.p 
                          className="text-accent text-sm font-medium mt-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          +{platform?.certifications.length - 3} more...
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Awards or Media Grid with Card Flip Animation
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
            >
              {recognitionData?.[activeCategory]?.map((item, index) => (
                <motion.div
                  key={item?.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 relative overflow-hidden">
                    {/* Animated gradient background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item?.color} opacity-0`}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Header with animated icon */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
                      <motion.div 
                        className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${item?.color} rounded-xl sm:rounded-2xl flex items-center justify-center`}
                        whileHover={{
                          rotate: 360,
                          scale: 1.1,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <AppIcon name={item?.icon} size={24} className="text-white" />
                      </motion.div>
                      <motion.div 
                        className="text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="inline-block px-2 sm:px-3 py-1 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-semibold">
                          {item?.year}
                        </span>
                      </motion.div>
                    </div>

                    {/* Content with stagger animation */}
                    <motion.div 
                      className="mb-3 sm:mb-4 relative z-10"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2 group-hover:text-accent transition-colors duration-300">
                        {item?.title}
                      </h3>
                      <p className="text-accent font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{item?.organization}</p>
                      <motion.span 
                        className="inline-block px-2 sm:px-3 py-1 bg-surface text-text-secondary rounded-full text-xs sm:text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item?.category}
                      </motion.span>
                    </motion.div>

                    <motion.p 
                      className="text-text-secondary leading-relaxed group-hover:text-primary transition-colors duration-300 text-sm sm:text-base relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {item?.description}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Stats Summary with Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl lg:rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 bg-white rounded-full"
                style={{
                  left: `${i * 25}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <motion.h3 
            className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 relative z-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Digital Powerhouse by the Numbers
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {[
              { number: totalCertifications, suffix: '+', label: 'Platform Certifications', icon: 'Shield' },
              { number: 9, suffix: '+', label: 'Platform Partnerships', icon: 'Network' },
              { number: 25, suffix: '+', label: 'Industry Awards', icon: 'Award' },
              { number: 11, suffix: '+', label: 'Years Excellence', icon: 'TrendingUp' }
            ]?.map((stat, index) => (
              <motion.div
                key={index}
                variants={statVariants}
                className="text-center group cursor-pointer"
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <motion.div 
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto backdrop-blur-sm"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  }}
                  animate={hoveredStat === index ? {
                    rotate: [0, -10, 10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <AppIcon name={stat?.icon} size={24} className="text-white" />
                </motion.div>
                <motion.div 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
                  animate={hoveredStat === index ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedCounter value={stat?.number} duration={2} suffix={stat?.suffix} />
                </motion.div>
                <div className="text-white/80 text-xs sm:text-sm">{stat?.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quote section with typing animation */}
          <motion.div 
            className="mt-8 sm:mt-12 max-w-3xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.p 
              className="text-base sm:text-lg md:text-xl opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              "Our extensive certifications aren't just badges—they're proof of our commitment to mastery 
              across every platform. From Salesforce Admin to Data Architect, from AWS Solutions to DevOps, 
              we have the depth and breadth to handle any challenge."
            </motion.p>
            <motion.div 
              className="flex items-center justify-center space-x-3 mt-4 sm:mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div 
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-bold text-base sm:text-lg">27</span>
              </motion.div>
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Rule27 Leadership Team</div>
                <div className="text-xs sm:text-sm opacity-70">Certified Across Every Platform</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AwardsRecognition;