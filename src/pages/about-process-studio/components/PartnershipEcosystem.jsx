import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const PartnershipEcosystem = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredPartner, setHoveredPartner] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, margin: "-100px" });

  const partnerCategories = [
    { id: 'all', label: 'All Partners', icon: 'Network', count: 18 },
    { id: 'marketing', label: 'Marketing Platforms', icon: 'Target', count: 8 },
    { id: 'development', label: 'Development & Cloud', icon: 'Code', count: 6 },
    { id: 'analytics', label: 'Analytics & Data', icon: 'BarChart', count: 4 }
  ];

  const partners = [
    {
      id: 1,
      name: 'Salesforce',
      category: 'marketing',
      description: 'Complete CRM and marketing cloud solutions with 12+ certifications',
      services: ['CRM Implementation', 'Marketing Cloud', 'Service Cloud', 'Commerce Cloud'],
      certifications: 12,
      projects: 50,
      icon: 'Cloud',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      benefits: ['Enterprise CRM', 'Marketing Automation', 'Customer 360 Platform', 'AI-Powered Insights']
    },
    {
      id: 2,
      name: 'AWS',
      category: 'development',
      description: 'Enterprise cloud infrastructure and development platform',
      services: ['Cloud Architecture', 'DevOps', 'Serverless', 'Machine Learning'],
      certifications: 4,
      projects: 35,
      icon: 'Server',
      color: 'from-orange-500 to-yellow-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-yellow-500',
      benefits: ['Scalable Infrastructure', 'Global CDN', 'Enterprise Security', 'Cost Optimization']
    },
    {
      id: 3,
      name: 'HubSpot',
      category: 'marketing',
      description: 'Inbound marketing, sales, and service platform',
      services: ['Marketing Hub', 'Sales Hub', 'Service Hub', 'CMS Hub'],
      certifications: 9,
      projects: 45,
      icon: 'Target',
      color: 'from-orange-600 to-red-600',
      gradient: 'bg-gradient-to-br from-orange-600 to-red-600',
      benefits: ['All-in-One Platform', 'Marketing Automation', 'Lead Generation', 'Customer Service']
    },
    {
      id: 4,
      name: 'Google Cloud',
      category: 'development',
      description: 'AI-first cloud platform with marketing integrations',
      services: ['Cloud Platform', 'BigQuery', 'AI/ML', 'Google Ads Integration'],
      certifications: 8,
      projects: 30,
      icon: 'Globe',
      color: 'from-blue-600 to-green-600',
      gradient: 'bg-gradient-to-br from-blue-600 to-green-600',
      benefits: ['AI & Machine Learning', 'Data Analytics', 'Global Scale', 'Google Ecosystem']
    },
    {
      id: 5,
      name: 'Shopify',
      category: 'development',
      description: 'E-commerce platform for online stores and retail',
      services: ['Store Development', 'Plus Solutions', 'Custom Apps', 'Headless Commerce'],
      certifications: 3,
      projects: 40,
      icon: 'ShoppingCart',
      color: 'from-green-600 to-teal-600',
      gradient: 'bg-gradient-to-br from-green-600 to-teal-600',
      benefits: ['E-commerce Excellence', 'Multi-channel Selling', 'App Ecosystem', 'Scalable Commerce']
    },
    {
      id: 6,
      name: 'Adobe',
      category: 'marketing',
      description: 'Creative and marketing cloud solutions',
      services: ['Experience Manager', 'Analytics', 'Target', 'Campaign'],
      certifications: 5,
      projects: 25,
      icon: 'Image',
      color: 'from-red-600 to-purple-600',
      gradient: 'bg-gradient-to-br from-red-600 to-purple-600',
      benefits: ['Creative Cloud', 'Experience Cloud', 'Personalization', 'Content Management']
    },
    {
      id: 7,
      name: 'Microsoft Azure',
      category: 'development',
      description: 'Enterprise cloud computing and AI services',
      services: ['Azure Cloud', 'Office 365 Integration', 'Power Platform', 'Azure AI'],
      certifications: 3,
      projects: 20,
      icon: 'Layers',
      color: 'from-indigo-600 to-blue-600',
      gradient: 'bg-gradient-to-br from-indigo-600 to-blue-600',
      benefits: ['Enterprise Integration', 'Hybrid Cloud', 'Security & Compliance', 'Microsoft Ecosystem']
    },
    {
      id: 8,
      name: 'Meta',
      category: 'marketing',
      description: 'Social media advertising and commerce platforms',
      services: ['Facebook Ads', 'Instagram Marketing', 'WhatsApp Business', 'Commerce'],
      certifications: 4,
      projects: 60,
      icon: 'Share2',
      color: 'from-blue-700 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-700 to-indigo-600',
      benefits: ['Social Advertising', 'Audience Targeting', 'Commerce Integration', 'Cross-Platform Reach']
    },
    {
      id: 9,
      name: 'Klaviyo',
      category: 'marketing',
      description: 'Email and SMS marketing automation platform',
      services: ['Email Marketing', 'SMS Campaigns', 'Segmentation', 'Personalization'],
      certifications: 1,
      projects: 35,
      icon: 'Mail',
      color: 'from-purple-600 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-600 to-pink-600',
      benefits: ['Advanced Segmentation', 'Predictive Analytics', 'Revenue Attribution', 'E-commerce Focus']
    },
    {
      id: 10,
      name: 'Snowflake',
      category: 'analytics',
      description: 'Cloud data platform for analytics and AI',
      services: ['Data Warehouse', 'Data Lake', 'Data Sharing', 'Analytics'],
      certifications: 1,
      projects: 15,
      icon: 'Database',
      color: 'from-cyan-600 to-blue-600',
      gradient: 'bg-gradient-to-br from-cyan-600 to-blue-600',
      benefits: ['Unified Data Platform', 'Real-time Analytics', 'Data Sharing', 'Multi-cloud']
    },
    {
      id: 11,
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Web analytics and measurement platform',
      services: ['GA4 Setup', 'Conversion Tracking', 'Custom Reports', 'Attribution'],
      certifications: 2,
      projects: 80,
      icon: 'BarChart',
      color: 'from-yellow-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      benefits: ['User Behavior Insights', 'Conversion Tracking', 'Custom Reporting', 'Free Platform']
    },
    {
      id: 12,
      name: 'Braze',
      category: 'marketing',
      description: 'Customer engagement and lifecycle marketing',
      services: ['Lifecycle Campaigns', 'Push Notifications', 'In-App Messaging', 'Personalization'],
      certifications: 1,
      projects: 10,
      icon: 'MessageSquare',
      color: 'from-teal-600 to-cyan-600',
      gradient: 'bg-gradient-to-br from-teal-600 to-cyan-600',
      benefits: ['Omnichannel Engagement', 'Real-time Personalization', 'Customer Journey', 'AI Optimization']
    },
    {
      id: 13,
      name: 'Mixpanel',
      category: 'analytics',
      description: 'Product analytics for user behavior tracking',
      services: ['Product Analytics', 'User Funnels', 'Retention Analysis', 'A/B Testing'],
      certifications: 1,
      projects: 20,
      icon: 'Activity',
      color: 'from-purple-500 to-indigo-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      benefits: ['Product Analytics', 'User Journey Tracking', 'Cohort Analysis', 'Real-time Data']
    },
    {
      id: 14,
      name: 'Segment',
      category: 'analytics',
      description: 'Customer data platform and integration hub',
      services: ['Data Collection', 'Data Routing', 'Identity Resolution', 'Privacy Management'],
      certifications: 1,
      projects: 15,
      icon: 'GitBranch',
      color: 'from-green-500 to-teal-500',
      gradient: 'bg-gradient-to-br from-green-500 to-teal-500',
      benefits: ['Single Data Source', '300+ Integrations', 'Privacy Compliance', 'Real-time Sync']
    },
    {
      id: 15,
      name: 'Docker',
      category: 'development',
      description: 'Container platform for application deployment',
      services: ['Containerization', 'Kubernetes', 'CI/CD', 'Microservices'],
      certifications: 1,
      projects: 25,
      icon: 'Box',
      color: 'from-blue-500 to-cyan-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      benefits: ['Container Orchestration', 'Scalable Deployment', 'DevOps Integration', 'Portability']
    },
    {
      id: 16,
      name: 'Netlify',
      category: 'development',
      description: 'Modern web development and hosting platform',
      services: ['Jamstack Hosting', 'Serverless Functions', 'Edge CDN', 'Build Automation'],
      certifications: 1,
      projects: 30,
      icon: 'Globe',
      color: 'from-teal-500 to-green-500',
      gradient: 'bg-gradient-to-br from-teal-500 to-green-500',
      benefits: ['Instant Deployment', 'Global CDN', 'Serverless Backend', 'Git Integration']
    },
    {
      id: 17,
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Marketing automation and email platform',
      services: ['Email Campaigns', 'Automation', 'Landing Pages', 'Audience Management'],
      certifications: 1,
      projects: 40,
      icon: 'Send',
      color: 'from-yellow-600 to-orange-600',
      gradient: 'bg-gradient-to-br from-yellow-600 to-orange-600',
      benefits: ['Easy Email Marketing', 'Marketing CRM', 'Creative Tools', 'E-commerce Integration']
    },
    {
      id: 18,
      name: 'WordPress',
      category: 'development',
      description: 'Content management and website platform',
      services: ['Custom Development', 'WooCommerce', 'Performance Optimization', 'Security'],
      certifications: 0,
      projects: 50,
      icon: 'FileText',
      color: 'from-blue-600 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-600 to-indigo-600',
      benefits: ['Flexible CMS', 'Plugin Ecosystem', 'SEO Friendly', 'Community Support']
    }
  ];

  const filteredPartners = activeCategory === 'all' 
    ? partners 
    : partners?.filter(partner => partner?.category === activeCategory);

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

  const partnerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }
    })
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

  // Calculate statistics
  const totalCertifications = partners?.reduce((sum, p) => sum + p.certifications, 0);
  const totalProjects = partners?.reduce((sum, p) => sum + p.projects, 0);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-surface via-white to-surface relative overflow-hidden">
      {/* Animated Network Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#E53E3E" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-pattern)" />
          {/* Animated connection lines */}
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${20 * i}%`}
              y1="0%"
              x2={`${20 * i + 20}%`}
              y2="100%"
              stroke="#E53E3E"
              strokeWidth="0.5"
              opacity="0.1"
              animate={{
                y1: ["0%", "100%", "0%"],
                y2: ["100%", "0%", "100%"],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>
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
            <AppIcon name="Network" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm font-sans">Partnership Ecosystem</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading-regular text-primary mb-4 sm:mb-6 uppercase tracking-wider">
            Our <motion.span 
              className="text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
            >Strategic Partners</motion.span>
          </h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4 font-sans"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            We partner with the world's leading platforms to deliver integrated solutions. 
            Our {totalCertifications}+ certifications across {partners?.length} platforms ensure you get expert implementation every time.
          </motion.p>
        </motion.div>

        {/* Animated Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-12 lg:mb-16"
        >
          {[
            { label: 'Strategic Partners', value: partners?.length, icon: 'Network', color: 'from-accent to-red-400' },
            { label: 'Total Certifications', value: totalCertifications, icon: 'Award', color: 'from-blue-500 to-cyan-400' },
            { label: 'Projects Delivered', value: totalProjects, icon: 'CheckCircle', color: 'from-green-500 to-teal-400' },
            { label: 'Industries Served', value: '15+', icon: 'Globe', color: 'from-purple-500 to-pink-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={statVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-300 relative overflow-hidden"
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mb-2 sm:mb-3 mx-auto`}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <AppIcon name={stat.icon} size={20} className="text-white" />
              </motion.div>
              <motion.div 
                className="text-2xl sm:text-3xl font-heading-regular text-primary mb-1 uppercase tracking-wider"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 0.3 + index * 0.1
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs sm:text-sm text-text-secondary font-sans">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12"
        >
          {partnerCategories?.map((category, index) => (
            <motion.button
              key={category?.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-heading-regular uppercase tracking-wider transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category?.id
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-text-secondary hover:bg-accent/5 hover:text-accent shadow-md'
              }`}
            >
              <AppIcon name={category?.icon} size={16} className="flex-shrink-0" />
              <span>{category?.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-heading-regular uppercase ${
                activeCategory === category?.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-accent/10 text-accent'
              }`}>
                {category?.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Partners Grid */}
        <motion.div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredPartners?.map((partner, index) => (
              <motion.div
                key={partner?.id}
                layout
                variants={partnerVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedPartner(partner)}
                onMouseEnter={() => setHoveredPartner(partner.id)}
                onMouseLeave={() => setHoveredPartner(null)}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 h-full relative overflow-hidden">
                  {/* Animated gradient background */}
                  <motion.div
                    className={`absolute inset-0 ${partner?.gradient} opacity-0`}
                    animate={{
                      opacity: hoveredPartner === partner.id ? 0.05 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Partner Header */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                    <motion.div 
                      className={`w-12 h-12 sm:w-14 sm:h-14 ${partner?.gradient} rounded-xl flex items-center justify-center`}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <AppIcon name={partner?.icon} size={24} className="text-white" />
                    </motion.div>
                    <motion.div 
                      className="text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredPartner === partner.id ? 1 : 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      {partner?.certifications > 0 && (
                        <div className="flex items-center space-x-1">
                          <AppIcon name="Award" size={14} className="text-accent" />
                          <span className="text-accent font-heading-regular text-sm uppercase">{partner?.certifications}</span>
                        </div>
                      )}
                      <div className="text-xs text-text-secondary font-sans">{partner?.projects} projects</div>
                    </motion.div>
                  </div>

                  {/* Partner Info */}
                  <h3 className="font-heading-regular text-primary mb-2 group-hover:text-accent transition-colors duration-300 text-base sm:text-lg uppercase tracking-wider">
                    {partner?.name}
                  </h3>
                  <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 font-sans">
                    {partner?.description}
                  </p>

                  {/* Service Tags with animation */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                    {partner?.services?.slice(0, 2).map((service, serviceIndex) => (
                      <motion.span
                        key={serviceIndex}
                        initial={{ scale: 0 }}
                        animate={{ scale: hoveredPartner === partner.id ? 1 : 0.9 }}
                        transition={{ 
                          delay: serviceIndex * 0.05,
                          type: "spring",
                          stiffness: 200
                        }}
                        className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-full font-sans"
                      >
                        {service}
                      </motion.span>
                    ))}
                    {partner?.services?.length > 2 && (
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium font-sans">
                        +{partner?.services?.length - 2}
                      </span>
                    )}
                  </div>

                  {/* View Details indicator */}
                  <motion.div 
                    className="flex items-center space-x-2 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: -10 }}
                    animate={{ x: hoveredPartner === partner.id ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-sans">View Details</span>
                    <AppIcon name="ArrowRight" size={14} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl lg:rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden"
        >
          {/* Animated pattern background */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
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
            transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto"
          >
            <AppIcon name="Handshake" size={32} className="text-white" />
          </motion.div>
          
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-heading-regular mb-3 sm:mb-4 relative z-10 uppercase tracking-wider"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            The Power of Partnership
          </motion.h3>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-90 relative z-10 font-sans"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            With certified expertise across every major platform, we're not just implementing tools—we're 
            architecting complete digital ecosystems that drive real business results.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-accent rounded-full font-heading-regular uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Explore Our Capabilities</span>
              <motion.div 
                className="absolute inset-0 bg-accent"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-heading-regular uppercase tracking-wider hover:bg-white hover:text-accent transition-all duration-300"
            >
              Talk to Our Experts
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Partner Detail Modal */}
        <AnimatePresence>
          {selectedPartner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
              onClick={() => setSelectedPartner(null)}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: '100%', opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl lg:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e?.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`w-16 h-16 sm:w-20 sm:h-20 ${selectedPartner?.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center`}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <AppIcon name={selectedPartner?.icon} size={32} className="text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-heading-regular text-primary mb-1 uppercase tracking-wider">
                          {selectedPartner?.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm">
                          {selectedPartner?.certifications > 0 && (
                            <div className="flex items-center space-x-1">
                              <AppIcon name="Award" size={16} className="text-accent" />
                              <span className="text-accent font-heading-regular uppercase">{selectedPartner?.certifications} Certifications</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <AppIcon name="Briefcase" size={16} className="text-text-secondary" />
                            <span className="text-text-secondary font-sans">{selectedPartner?.projects} Projects</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedPartner(null)}
                      className="w-10 h-10 bg-gray-100 hover:bg-accent/10 rounded-full flex items-center justify-center transition-colors duration-300"
                    >
                      <AppIcon name="X" size={20} className="text-text-secondary hover:text-accent" />
                    </motion.button>
                  </div>

                  {/* Modal Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Services */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-xl font-heading-regular text-primary mb-4 uppercase tracking-wider">Our Services</h4>
                      <div className="space-y-3">
                        {selectedPartner?.services?.map((service, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-center space-x-3"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
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
                              <AppIcon name="CheckCircle" size={16} className="text-accent flex-shrink-0" />
                            </motion.div>
                            <span className="text-text-secondary font-sans">{service}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <h4 className="text-xl font-heading-regular text-primary mb-4 uppercase tracking-wider">Key Benefits</h4>
                      <div className="space-y-3">
                        {selectedPartner?.benefits?.map((benefit, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-center space-x-3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.35 + index * 0.05 }}
                          >
                            <AppIcon name="Star" size={16} className="text-accent flex-shrink-0" />
                            <span className="text-text-secondary font-sans">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.div 
                    className="mt-6 p-4 sm:p-6 bg-surface rounded-xl sm:rounded-2xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-text-secondary leading-relaxed font-sans">
                      {selectedPartner?.description}. Our certified experts leverage this partnership to deliver 
                      enterprise-grade solutions that drive measurable business outcomes. From implementation to 
                      optimization, we ensure you get maximum value from your investment.
                    </p>
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

export default PartnershipEcosystem;