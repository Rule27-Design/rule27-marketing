import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CultureShowcase = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [hoveredPerk, setHoveredPerk] = useState(null);
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);
  const inView = useInView(galleryRef, { once: true, margin: "-100px" });

  const coreValues = [
    {
      id: 1,
      title: 'Consistency & Excellence',
      description: 'We deliver proven quality across both marketing and development. Every project, every time, excellence is our standard.',
      icon: 'Award',
      color: 'from-accent to-red-400',
      examples: [
        'Proven track record across 150+ projects',
        'Certified expertise in 10+ platforms',
        'Same high standards for marketing and development'
      ]
    },
    {
      id: 2,
      title: 'Accountability',
      description: 'We stand behind every line of code and every campaign we create. If something needs fixing, we own it and we fix it.',
      icon: 'Shield',
      color: 'from-blue-500 to-purple-400',
      examples: [
        'We fix issues, no questions asked',
        'Clear ownership of every deliverable',
        'Post-launch support and optimization included'
      ]
    },
    {
      id: 3,
      title: 'Reliability',
      description: 'Day or night, campaign launch or server emergency, we\'re the partner you can always count on.',
      icon: 'Clock',
      color: 'from-green-500 to-teal-400',
      examples: [
        '24/7 support for critical issues',
        'On-time delivery, every time',
        'Consistent team you know and trust'
      ]
    },
    {
      id: 4,
      title: 'Transparency',
      description: 'No surprises, no hidden agendas. We believe in open, honest communication about timelines, budgets, and challenges.',
      icon: 'Eye',
      color: 'from-orange-500 to-yellow-400',
      examples: [
        'Clear project visibility and reporting',
        'Honest feedback and recommendations',
        'Open communication about challenges and solutions'
      ]
    },
    {
      id: 5,
      title: 'Innovation',
      description: 'We combine marketing creativity with technical innovation to deliver solutions that set you apart from the competition.',
      icon: 'Lightbulb',
      color: 'from-purple-500 to-pink-400',
      examples: [
        'Cutting-edge marketing automation',
        'Custom technical solutions',
        'Always learning, always improving'
      ]
    },
    {
      id: 6,
      title: 'Partnership',
      description: 'We\'re not just another vendor. We\'re invested in your success as much as you are.',
      icon: 'Handshake',
      color: 'from-indigo-500 to-blue-500',
      examples: [
        'Strategic guidance beyond the project',
        'Shared success metrics and KPIs',
        'Long-term relationships, not transactions'
      ]
    }
  ];

  const cultureMedia = [
    {
      id: 1,
      type: 'image',
      title: 'War Room Sessions',
      description: 'Where marketing strategy meets technical architecture in collaborative planning.',
      category: 'collaboration',
      icon: 'Users',
      imageUrl: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=300&fit=crop',
      color: 'from-blue-500 to-purple-500',
      details: 'Our war room sessions bring together marketers, developers, and strategists to align on project goals and create integrated solutions that deliver results.'
    },
    {
      id: 2,
      type: 'image',
      title: 'Certification Celebrations',
      description: 'Celebrating new platform certifications—our commitment to continuous excellence.',
      category: 'growth',
      icon: 'Award',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      color: 'from-green-500 to-teal-500',
      details: 'Every new certification represents our commitment to staying ahead of the curve. We celebrate these milestones as a team because expertise benefits everyone.'
    },
    {
      id: 3,
      type: 'image',
      title: 'Marketing Meets Dev',
      description: 'Our unique culture where creatives and developers work side by side.',
      category: 'culture',
      icon: 'Heart',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      color: 'from-accent to-red-500',
      details: 'Breaking down silos between marketing and development creates magic. Our integrated teams deliver solutions that are both beautiful and powerful.'
    },
    {
      id: 4,
      type: 'image',
      title: 'Client Success Stories',
      description: 'Celebrating client wins—from campaign launches to platform deployments.',
      category: 'success',
      icon: 'TrendingUp',
      imageUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=300&fit=crop',
      color: 'from-yellow-500 to-orange-500',
      details: 'Your success is our success. We celebrate every milestone, from successful campaign launches to complex technical deployments that transform businesses.'
    },
    {
      id: 5,
      type: 'image',
      title: 'Platform Training',
      description: 'Weekly sessions on new platforms—from Salesforce to Shopify, AWS to Adobe.',
      category: 'learning',
      icon: 'BookOpen',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
      color: 'from-purple-500 to-pink-500',
      details: 'Continuous learning is in our DNA. Weekly training sessions ensure our team stays certified and current with the latest platform capabilities.'
    },
    {
      id: 6,
      type: 'image',
      title: 'Innovation Lab',
      description: 'Testing new marketing tech and development frameworks before anyone else.',
      category: 'innovation',
      icon: 'Cpu',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
      color: 'from-indigo-500 to-blue-500',
      details: 'Our innovation lab is where we experiment with cutting-edge technologies, ensuring our clients always have access to the latest and greatest solutions.'
    }
  ];

  const officePerks = [
    { icon: 'Trophy', title: 'Certification Support', description: 'Full coverage for platform certifications and training' },
    { icon: 'Users', title: 'Cross-Training', description: 'Marketers learn dev, developers learn marketing' },
    { icon: 'Zap', title: 'Innovation Time', description: '20% time for experimental projects and learning' },
    { icon: 'DollarSign', title: 'Performance Bonuses', description: 'Rewards for certifications and project excellence' },
    { icon: 'Globe', title: 'Remote Flexibility', description: 'Work from anywhere with full support' },
    { icon: 'Heart', title: 'Health & Wellness', description: 'Comprehensive benefits and mental health support' }
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % coreValues?.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const valueVariants = {
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

  const mediaVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#E53E3E_1px,transparent_1px)] bg-[size:30px_30px]"
          animate={{
            backgroundPosition: ["0px 0px", "30px 30px"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
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
            <AppIcon name="Heart" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Our Culture</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Where <motion.span 
              className="text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
            >Excellence</motion.span> Thrives
          </h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Our core values have guided us from day one. These principles, combined with our dual expertise 
            in marketing and development, create a culture where both creativity and technical excellence flourish.
          </motion.p>
        </motion.div>

        {/* Enhanced Core Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Values Navigation with Animation */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12">
            {coreValues?.map((value, index) => (
              <motion.button
                key={value?.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveValue(index)}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
                  activeValue === index
                    ? `bg-gradient-to-r ${value?.color} text-white shadow-lg transform scale-105`
                    : 'bg-surface text-text-secondary hover:bg-accent/5 hover:text-accent'
                }`}
              >
                {/* Animated background */}
                {activeValue === index && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
                <AppIcon name={value?.icon} size={16} className="flex-shrink-0 relative z-10" />
                <span className="hidden sm:inline relative z-10">{value?.title.split(' ')[0]}</span>
                <span className="sm:hidden relative z-10">{value?.title.split(' ')[0]}</span>
              </motion.button>
            ))}
          </div>

          {/* Active Value Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeValue}
              variants={valueVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -50 }}
              className="bg-surface rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 shadow-brand-md relative overflow-hidden"
            >
              {/* Animated gradient background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${coreValues?.[activeValue]?.color} opacity-5`}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center relative z-10">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <motion.div 
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${coreValues?.[activeValue]?.color} rounded-xl sm:rounded-2xl flex items-center justify-center`}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <AppIcon name={coreValues?.[activeValue]?.icon} size={24} className="text-white" />
                    </motion.div>
                    <h4 className="text-2xl sm:text-3xl font-bold text-primary">{coreValues?.[activeValue]?.title}</h4>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed mb-4 sm:mb-6">
                    {coreValues?.[activeValue]?.description}
                  </p>
                  <div>
                    <h5 className="font-bold text-primary mb-3 sm:mb-4">How We Live This:</h5>
                    <ul className="space-y-2 sm:space-y-3">
                      {coreValues?.[activeValue]?.examples?.map((example, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-start space-x-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
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
                            <AppIcon name="CheckCircle" size={20} className="text-accent mt-0.5 flex-shrink-0" />
                          </motion.div>
                          <span className="text-text-secondary text-sm sm:text-base">{example}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="text-center relative z-10">
                      <motion.div 
                        className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r ${coreValues?.[activeValue]?.color} rounded-full flex items-center justify-center mb-4 mx-auto`}
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <AppIcon name={coreValues?.[activeValue]?.icon} size={40} className="text-white" />
                      </motion.div>
                      <p className="text-text-secondary font-medium text-sm sm:text-base">Value in Action</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Culture Gallery */}
        <motion.div
          ref={galleryRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8 sm:mb-12">Behind the Scenes</h3>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {cultureMedia?.map((media, index) => (
              <motion.div
                key={media?.id}
                variants={mediaVariants}
                custom={index}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedMedia(media)}
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl h-48 sm:h-56 lg:h-64 bg-gray-100 group-hover:shadow-brand-elevation-lg transition-all duration-500">
                  {/* Background Image with Parallax */}
                  <motion.div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${media?.imageUrl})`,
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Animated Gradient Overlay */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-t ${media?.color} opacity-80`}
                      whileHover={{ opacity: 0.7 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-4 sm:p-6">
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      <motion.div 
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <AppIcon 
                          name={media?.icon} 
                          size={20} 
                          className="text-white" 
                        />
                      </motion.div>
                      <motion.span 
                        className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        {media?.category}
                      </motion.span>
                    </div>
                    
                    {/* Bottom Section */}
                    <div className="text-white">
                      <motion.h4 
                        className="font-bold text-base sm:text-lg mb-1 sm:mb-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {media?.title}
                      </motion.h4>
                      <motion.p 
                        className="text-white/90 text-xs sm:text-sm line-clamp-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        {media?.description}
                      </motion.p>
                      
                      {/* View More Indicator */}
                      <motion.div 
                        className="mt-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -20 }}
                        whileHover={{ x: 0 }}
                      >
                        <span className="text-xs font-medium">View Details</span>
                        <AppIcon name="ArrowRight" size={14} className="text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Office Perks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8 sm:mb-12">Why We Love Working Here</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {officePerks?.map((perk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onMouseEnter={() => setHoveredPerk(index)}
                onMouseLeave={() => setHoveredPerk(null)}
                className="bg-surface rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-brand-md transition-all duration-300 group relative overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0"
                  animate={{
                    opacity: hoveredPerk === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 group-hover:bg-accent group-hover:text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300"
                      animate={hoveredPerk === index ? {
                        rotate: [0, -10, 10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <AppIcon name={perk?.icon} size={20} className="text-accent group-hover:text-white" />
                    </motion.div>
                    <h4 className="font-bold text-primary text-sm sm:text-base">{perk?.title}</h4>
                  </div>
                  <p className="text-text-secondary text-xs sm:text-sm">{perk?.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* COMPLETE Culture Media Detail Modal */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl lg:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e?.stopPropagation()}
              >
                {/* Modal Image Header */}
                <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${selectedMedia?.imageUrl})`,
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${selectedMedia?.color} opacity-70`} />
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMedia(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <AppIcon name="X" size={20} className="text-white" />
                  </motion.button>

                  {/* Modal Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <motion.div 
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-4"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    >
                      <AppIcon name={selectedMedia?.icon} size={28} className="text-white" />
                    </motion.div>
                    <motion.h3 
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {selectedMedia?.title}
                    </motion.h3>
                    <motion.span 
                      className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    >
                      {selectedMedia?.category}
                    </motion.span>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 sm:p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="text-xl sm:text-2xl font-bold text-primary mb-4">Overview</h4>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {selectedMedia?.description}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="text-xl sm:text-2xl font-bold text-primary mb-4">Details</h4>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {selectedMedia?.details}
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 pt-4 border-t"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="flex-1"
                      onClick={() => setSelectedMedia(null)}
                    >
                      <AppIcon name="ArrowLeft" size={20} className="mr-2" />
                      Back to Gallery
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      <AppIcon name="Share2" size={20} className="mr-2" />
                      Share This
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CultureShowcase;