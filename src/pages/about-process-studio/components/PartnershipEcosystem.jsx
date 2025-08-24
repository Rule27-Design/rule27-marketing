import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PartnershipEcosystem = () => {
  const [activePartner, setActivePartner] = useState(null);
  const [partnerCategory, setPartnerCategory] = useState('technology');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const partnershipCategories = [
    { id: 'technology', label: 'Technology', icon: 'Cpu', count: 8 },
    { id: 'creative', label: 'Creative', icon: 'Palette', count: 5 },
    { id: 'strategic', label: 'Strategic', icon: 'Target', count: 6 },
    { id: 'data', label: 'Data & Analytics', icon: 'BarChart3', count: 4 }
  ];

  const partnerships = {
    technology: [
      {
        id: 1,
        name: 'Google Cloud',
        type: 'Premier Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Infrastructure & AI Services',
        description: 'Advanced cloud infrastructure, AI/ML capabilities, and enterprise-grade security for scalable digital solutions.',
        benefits: ['Global infrastructure', 'Advanced AI tools', 'Enterprise security', '24/7 support'],
        projects: ['Netflix scaling solution', 'AI-powered recommendation engine'],
        partnership_since: '2020'
      },
      {
        id: 2,
        name: 'AWS',
        type: 'Solution Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Cloud Architecture & DevOps',
        description: 'Comprehensive cloud solutions, serverless computing, and DevOps automation for enterprise clients.',
        benefits: ['Scalable infrastructure', 'DevOps automation', 'Cost optimization', 'Security compliance'],
        projects: ['Shopify performance optimization', 'Fintech security platform'],
        partnership_since: '2019'
      },
      {
        id: 3,
        name: 'Microsoft Azure',
        type: 'Gold Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Enterprise Solutions',
        description: 'Enterprise-grade solutions, Office 365 integration, and hybrid cloud architectures.',
        benefits: ['Enterprise integration', 'Hybrid cloud', 'Office 365 sync', 'Advanced analytics'],
        projects: ['Fortune 500 digital transformation', 'Healthcare data platform'],
        partnership_since: '2021'
      },
      {
        id: 4,
        name: 'Vercel',
        type: 'Technology Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Next.js & JAMstack',
        description: 'Cutting-edge frontend deployment and edge computing for lightning-fast digital experiences.',
        benefits: ['Edge computing', 'Instant deployment', 'Global CDN', 'Performance optimization'],
        projects: ['E-commerce platform rebuild', 'SaaS application frontend'],
        partnership_since: '2022'
      }
    ],
    creative: [
      {
        id: 5,
        name: 'Adobe',
        type: 'Solution Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Creative Technology',
        description: 'Enterprise Creative Cloud solutions, digital asset management, and creative workflow optimization.',
        benefits: ['Creative Cloud Enterprise', 'Asset management', 'Workflow automation', 'Team collaboration'],
        projects: ['Brand asset management system', 'Creative workflow automation'],
        partnership_since: '2018'
      },
      {
        id: 6,
        name: 'Figma',
        type: 'Strategic Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Design Collaboration',
        description: 'Advanced design systems, real-time collaboration, and enterprise design operations.',
        benefits: ['Real-time collaboration', 'Design systems', 'Version control', 'Developer handoff'],
        projects: ['Design system for Fortune 100', 'Multi-brand design platform'],
        partnership_since: '2020'
      },
      {
        id: 7,
        name: 'Webflow',
        type: 'Partner Agency',
        logo: '/api/placeholder/120/60',
        relationship: 'No-Code Development',
        description: 'Advanced web development platform for rapid prototyping and content management solutions.',
        benefits: ['Rapid prototyping', 'Visual development', 'CMS flexibility', 'Client empowerment'],
        projects: ['Marketing site rebuilds', 'Content management platforms'],
        partnership_since: '2021'
      }
    ],
    strategic: [
      {
        id: 8,
        name: 'Deloitte Digital',
        type: 'Strategic Alliance',
        logo: '/api/placeholder/120/60',
        relationship: 'Enterprise Consulting',
        description: 'Joint enterprise digital transformation initiatives and strategic consulting partnerships.',
        benefits: ['Enterprise reach', 'Strategic consulting', 'Industry expertise', 'Global scale'],
        projects: ['Fortune 500 transformation', 'Digital strategy consulting'],
        partnership_since: '2022'
      },
      {
        id: 9,
        name: 'Accenture Interactive',
        type: 'Collaboration Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Innovation Labs',
        description: 'Collaborative innovation projects and emerging technology exploration for enterprise clients.',
        benefits: ['Innovation research', 'Emerging tech', 'Enterprise connections', 'R&D collaboration'],
        projects: ['AI innovation lab', 'VR/AR prototypes'],
        partnership_since: '2023'
      }
    ],
    data: [
      {
        id: 10,
        name: 'Snowflake',
        type: 'Technology Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Data Cloud Platform',
        description: 'Advanced data warehousing, analytics, and machine learning capabilities for data-driven solutions.',
        benefits: ['Data warehousing', 'Advanced analytics', 'ML capabilities', 'Real-time insights'],
        projects: ['Customer analytics platform', 'Predictive modeling system'],
        partnership_since: '2022'
      },
      {
        id: 11,
        name: 'Mixpanel',
        type: 'Analytics Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'User Analytics',
        description: 'Advanced user behavior analytics and product intelligence for optimized user experiences.',
        benefits: ['User behavior tracking', 'Cohort analysis', 'A/B testing', 'Product intelligence'],
        projects: ['SaaS analytics dashboard', 'User journey optimization'],
        partnership_since: '2021'
      }
    ]
  };

  const activePartners = partnerships?.[partnerCategory] || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
      },
      { 
        threshold: 0.05, // Changed from 0.2 to 0.05 - triggers much sooner
        rootMargin: '100px' // Add this - starts animation 100px before element is visible
      }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    // Also set visibility immediately on mobile
    if (window.innerWidth < 768) {
      setIsInView(true); // Immediate visibility on mobile
    }

    return () => observer?.disconnect();
  }, []);

  const getPartnershipStats = () => {
    const allPartners = Object?.values(partnerships)?.flat();
    return {
      total: allPartners?.length,
      premier: allPartners?.filter(p => p?.type?.includes('Premier'))?.length,
      strategic: allPartners?.filter(p => p?.type?.includes('Strategic'))?.length,
      years: Math.max(...allPartners?.map(p => 2025 - parseInt(p?.partnership_since)))
    };
  };

  const stats = getPartnershipStats();

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
            <AppIcon name="Network" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Partnership Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Strategic <span className="text-accent">Alliances</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
            Our network of world-class partners enables us to deliver solutions that combine 
            cutting-edge technology with creative excellence. Together, we make the impossible possible.
          </p>
        </motion.div>

        {/* Partnership Stats - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
        >
          {[
            { number: stats?.total + '+', label: 'Strategic Partners', icon: 'Users' },
            { number: stats?.premier + '', label: 'Premier Partnerships', icon: 'Crown' },
            { number: stats?.years + '+', label: 'Years of Collaboration', icon: 'Clock' },
            { number: '∞', label: 'Possibilities Unlocked', icon: 'Infinity' }
          ]?.map((stat, index) => (
            <div
              key={index}
              className="bg-surface rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-brand-md transition-all duration-300 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 group-hover:bg-accent rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto transition-all duration-300">
                <AppIcon name={stat?.icon} size={20} className="text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{stat?.number}</div>
              <div className="text-text-secondary text-xs sm:text-sm">{stat?.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Category Filter - FIXED: Now with flex-wrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12 lg:mb-16"
        >
          {partnershipCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setPartnerCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                partnerCategory === category?.id
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg transform scale-105'
                  : 'bg-surface text-text-secondary hover:bg-accent/5 hover:text-accent'
              }`}
            >
              <AppIcon name={category?.icon} size={16} className="flex-shrink-0" />
              <span>{category?.label.split(' ')[0]}</span>
              {category?.count && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  partnerCategory === category?.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-accent/10 text-accent'
                }`}>
                  {category?.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Partners Grid - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
        >
          {activePartners?.map((partner, index) => (
            <motion.div
              key={partner?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="group cursor-pointer"
              onClick={() => setActivePartner(partner)}
            >
              <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-brand-elevation-lg transition-all duration-500 group-hover:-translate-y-2">
                {/* Partner Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <span className="font-bold text-primary text-base sm:text-lg">{partner?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                        {partner?.name}
                      </h3>
                      <p className="text-accent font-semibold text-xs sm:text-sm">{partner?.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary text-xs sm:text-sm">Since {partner?.partnership_since}</span>
                  </div>
                </div>

                {/* Partnership Details */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-primary font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{partner?.relationship}</p>
                  <p className="text-text-secondary leading-relaxed text-xs sm:text-sm">
                    {partner?.description}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {partner?.benefits?.slice(0, 3)?.map((benefit, benefitIndex) => (
                    <span
                      key={benefitIndex}
                      className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                  {partner?.benefits?.length > 3 && (
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full">
                      +{partner?.benefits?.length - 3} more
                    </span>
                  )}
                </div>

                {/* View More Indicator */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-text-secondary">
                    {partner?.projects?.length} joint projects
                  </span>
                  <div className="flex items-center space-x-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View details</span>
                    <AppIcon name="ArrowRight" size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership Benefits - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl lg:rounded-3xl p-8 sm:p-12 text-white text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">The Partnership Advantage</h3>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Our strategic partnerships aren't just about technology—they're about expanding possibilities, 
            accelerating innovation, and delivering solutions that individual agencies simply can't match.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {[
              {
                icon: 'Zap',
                title: 'Accelerated Innovation',
                description: 'Access to cutting-edge tools and technologies before they hit the market.'
              },
              {
                icon: 'Shield',
                title: 'Enterprise-Grade Security',
                description: 'Bank-level security and compliance through our certified partnerships.'
              },
              {
                icon: 'Globe',
                title: 'Global Scale',
                description: 'Worldwide infrastructure and support for projects of any size.'
              }
            ]?.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <AppIcon name={advantage?.icon} size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{advantage?.title}</h4>
                <p className="text-white/80 text-xs sm:text-sm">{advantage?.description}</p>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 sm:px-8 py-3 sm:py-4 font-semibold min-h-[48px]"
          >
            <AppIcon name="Network" size={20} className="mr-2" />
            Explore Partnership Opportunities
          </Button>
        </motion.div>

        {/* Partner Detail Modal - Mobile Optimized */}
        {activePartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-brand-modal"
            onClick={() => setActivePartner(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto"
              onClick={(e) => e?.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <span className="font-bold text-primary text-lg sm:text-xl">{activePartner?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-primary">{activePartner?.name}</h3>
                      <p className="text-accent font-semibold text-sm sm:text-base">{activePartner?.type}</p>
                      <p className="text-text-secondary text-xs sm:text-sm">Partnership since {activePartner?.partnership_since}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePartner(null)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-accent/10 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0"
                  >
                    <AppIcon name="X" size={20} className="text-text-secondary hover:text-accent" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-bold text-primary mb-2 text-base sm:text-lg">Partnership Focus</h4>
                    <p className="text-accent font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{activePartner?.relationship}</p>
                    <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{activePartner?.description}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-primary mb-2 sm:mb-3 text-base sm:text-lg">Key Benefits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {activePartner?.benefits?.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AppIcon name="CheckCircle" size={16} className="text-accent flex-shrink-0" />
                          <span className="text-text-secondary text-xs sm:text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-primary mb-2 sm:mb-3 text-base sm:text-lg">Featured Projects</h4>
                    <ul className="space-y-2">
                      {activePartner?.projects?.map((project, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <AppIcon name="ArrowRight" size={14} className="text-accent flex-shrink-0" />
                          <span className="text-text-secondary text-xs sm:text-sm">{project}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PartnershipEcosystem;