import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const AwardsRecognition = () => {
  const [activeCategory, setActiveCategory] = useState('certifications');
  const [expandedCertCategory, setExpandedCertCategory] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

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
        description: 'Featured story on how Rule27 combines marketing excellence with technical innovation.',
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
            <AppIcon name="Trophy" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Recognition</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Industry <span className="text-accent">Recognition</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
            With {totalCertifications}+ certifications across 9 major platforms, we're not just certified—we're 
            comprehensively equipped to handle every aspect of your digital transformation.
          </p>
        </motion.div>

        {/* Category Navigation - FIXED: Now with flex-wrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12 lg:mb-16"
        >
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category?.id
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-text-secondary hover:bg-accent/5 hover:text-accent shadow-md'
              }`}
            >
              <AppIcon name={category?.icon} size={16} className="flex-shrink-0" />
              <span>{category?.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeCategory === category?.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-accent/10 text-accent'
              }`}>
                {category?.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Content Display */}
        {activeCategory === 'certifications' ? (
          // Certifications Grid Display
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
          >
            {Object.entries(recognitionData.certifications).map(([key, platform], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="group"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 group-hover:-translate-y-2 h-full">
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${platform?.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <AppIcon name={platform?.icon} size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                          {platform?.platform}
                        </h3>
                        <p className="text-accent font-semibold text-sm">{platform?.count} Certifications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCertCategory(expandedCertCategory === key ? null : key)}
                      className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300"
                    >
                      <AppIcon 
                        name={expandedCertCategory === key ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                        className={expandedCertCategory === key ? "text-accent" : "text-text-secondary"}
                      />
                    </button>
                  </div>

                  {/* Certification List - Expandable */}
                  <div className={`space-y-1.5 overflow-hidden transition-all duration-500 ${
                    expandedCertCategory === key ? 'max-h-96' : 'max-h-20'
                  }`}>
                    {platform?.certifications.slice(0, expandedCertCategory === key ? undefined : 3).map((cert, certIndex) => (
                      <div key={certIndex} className="flex items-center space-x-2">
                        <AppIcon name="CheckCircle" size={14} className="text-accent flex-shrink-0" />
                        <span className="text-text-secondary text-sm">{cert}</span>
                      </div>
                    ))}
                    {!expandedCertCategory && platform?.certifications.length > 3 && (
                      <p className="text-accent text-sm font-medium mt-2">
                        +{platform?.certifications.length - 3} more...
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Awards or Media Grid Display
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
          >
            {recognitionData?.[activeCategory]?.map((item, index) => (
              <motion.div
                key={item?.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="group"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 group-hover:-translate-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${item?.color} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <AppIcon name={item?.icon} size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 sm:px-3 py-1 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-semibold">
                        {item?.year}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2 group-hover:text-accent transition-colors duration-300">
                      {item?.title}
                    </h3>
                    <p className="text-accent font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{item?.organization}</p>
                    <span className="inline-block px-2 sm:px-3 py-1 bg-surface text-text-secondary rounded-full text-xs sm:text-sm">
                      {item?.category}
                    </span>
                  </div>

                  <p className="text-text-secondary leading-relaxed group-hover:text-primary transition-colors duration-300 text-sm sm:text-base">
                    {item?.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Summary - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl lg:rounded-3xl p-8 sm:p-12 text-white text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Digital Powerhouse by the Numbers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { number: totalCertifications + '+', label: 'Platform Certifications', icon: 'Shield' },
              { number: '9+', label: 'Platform Partnerships', icon: 'Network' },
              { number: '25+', label: 'Industry Awards', icon: 'Award' },
              { number: '11+', label: 'Years Excellence', icon: 'TrendingUp' }
            ]?.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:bg-white/30 transition-colors duration-300">
                  <AppIcon name={stat?.icon} size={24} className="text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{stat?.number}</div>
                <div className="text-white/80 text-xs sm:text-sm">{stat?.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-12 max-w-3xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl opacity-90">
              "Our extensive certifications aren't just badges—they're proof of our commitment to mastery 
              across every platform. From Salesforce Admin to Data Architect, from AWS Solutions to DevOps, 
              we have the depth and breadth to handle any challenge."
            </p>
            <div className="flex items-center justify-center space-x-3 mt-4 sm:mt-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold text-base sm:text-lg">27</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Rule27 Leadership Team</div>
                <div className="text-xs sm:text-sm opacity-70">Certified Across Every Platform</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AwardsRecognition;