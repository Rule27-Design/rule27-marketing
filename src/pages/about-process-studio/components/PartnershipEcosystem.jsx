import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PartnershipEcosystem = () => {
  const [activePartner, setActivePartner] = useState(null);
  const [partnerCategory, setPartnerCategory] = useState('marketing');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const partnershipCategories = [
    { id: 'marketing', label: 'Marketing', icon: 'Target', count: 10 },
    { id: 'development', label: 'Development', icon: 'Code', count: 8 },
    { id: 'cloud', label: 'Cloud & Infrastructure', icon: 'Cloud', count: 6 },
    { id: 'analytics', label: 'Data & Analytics', icon: 'BarChart3', count: 5 }
  ];

  const partnerships = {
    marketing: [
      {
        id: 1,
        name: 'Salesforce',
        type: 'Marketing Cloud Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Marketing Automation Excellence',
        description: 'Certified across Marketing Cloud Email Specialist, Engagement Consultant, Engagement Developer, and Account Engagement Consultant.',
        benefits: ['Marketing automation', 'Customer journey mapping', 'Multi-channel campaigns', 'Lead nurturing'],
        projects: ['Enterprise CRM implementations', 'Marketing automation workflows', 'Customer engagement platforms'],
        partnership_since: '2017'
      },
      {
        id: 2,
        name: 'HubSpot',
        type: 'Solutions Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Inbound Marketing & CRM',
        description: 'Strategic partner for inbound marketing, CRM implementation, and RevOps optimization with multiple certifications.',
        benefits: ['Inbound methodology', 'Marketing automation', 'CRM integration', 'RevOps optimization'],
        projects: ['Full-funnel marketing systems', 'Lead generation campaigns', 'Sales enablement platforms'],
        partnership_since: '2019'
      },
      {
        id: 3,
        name: 'Google',
        type: 'Premier Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Digital Marketing & Analytics',
        description: 'Premier Partner status for Google Ads, Analytics, and marketing solutions with proven performance excellence.',
        benefits: ['PPC management', 'Analytics implementation', 'SEO optimization', 'Display advertising'],
        projects: ['Multi-million dollar ad campaigns', 'Analytics migration projects', 'Performance optimization'],
        partnership_since: '2018'
      },
      {
        id: 4,
        name: 'Adobe',
        type: 'Solution Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Creative & Experience Cloud',
        description: 'Certified partner for Adobe Creative Cloud and Experience Manager implementations.',
        benefits: ['Creative workflows', 'Digital asset management', 'Experience optimization', 'Content management'],
        projects: ['Enterprise DAM systems', 'Creative automation workflows', 'Personalization engines'],
        partnership_since: '2020'
      },
      {
        id: 5,
        name: 'Shopify',
        type: 'Partner Plus',
        logo: '/api/placeholder/120/60',
        relationship: 'E-commerce Solutions',
        description: 'Service Partner with Verified Skills for building and optimizing high-converting e-commerce experiences.',
        benefits: ['Custom storefronts', 'App development', 'Conversion optimization', 'Multi-channel selling'],
        projects: ['Enterprise e-commerce platforms', 'Headless commerce solutions', 'Custom app development'],
        partnership_since: '2021'
      },
      {
        id: 6,
        name: 'Mailchimp',
        type: 'Pro Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Email Marketing',
        description: 'Certified partner for advanced email marketing strategies and automation workflows.',
        benefits: ['Email automation', 'Audience segmentation', 'Campaign optimization', 'A/B testing'],
        projects: ['Multi-brand email systems', 'Automated nurture campaigns', 'Personalization strategies'],
        partnership_since: '2019'
      },
      {
        id: 7,
        name: 'Meta',
        type: 'Business Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Social Advertising',
        description: 'Certified across Meta platforms with 4 professional certifications for advanced social advertising.',
        benefits: ['Facebook advertising', 'Instagram marketing', 'WhatsApp Business', 'Audience targeting'],
        projects: ['Multi-million dollar social campaigns', 'Conversion optimization', 'Retargeting strategies'],
        partnership_since: '2018'
      },
      {
        id: 8,
        name: 'Klaviyo',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Email & SMS Marketing',
        description: 'Certified partner for e-commerce email and SMS marketing automation.',
        benefits: ['Advanced segmentation', 'Predictive analytics', 'SMS marketing', 'Revenue attribution'],
        projects: ['E-commerce email programs', 'Abandoned cart recovery', 'Customer retention campaigns'],
        partnership_since: '2021'
      },
      {
        id: 9,
        name: 'Braze',
        type: 'Certified Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Customer Engagement',
        description: 'Certified practitioner for multi-channel customer engagement and lifecycle marketing.',
        benefits: ['Cross-channel messaging', 'Customer journeys', 'Real-time personalization', 'Mobile engagement'],
        projects: ['Omnichannel campaigns', 'App engagement programs', 'Lifecycle marketing'],
        partnership_since: '2022'
      },
      {
        id: 10,
        name: 'Marketo',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'B2B Marketing Automation',
        description: 'Expert partner for B2B marketing automation and lead management.',
        benefits: ['Lead scoring', 'Account-based marketing', 'Revenue attribution', 'Campaign automation'],
        projects: ['B2B demand generation', 'Lead nurturing programs', 'Marketing operations'],
        partnership_since: '2020'
      }
    ],
    development: [
      {
        id: 11,
        name: 'AWS',
        type: 'Advanced Tier Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Cloud Architecture & DevOps',
        description: 'AWS Certified Developer Associate and DevOps Engineer Professional certifications for enterprise cloud solutions.',
        benefits: ['Scalable infrastructure', 'Serverless architecture', 'DevOps automation', 'Security compliance'],
        projects: ['Enterprise migrations', 'Microservices architectures', 'CI/CD pipelines'],
        partnership_since: '2019'
      },
      {
        id: 12,
        name: 'Microsoft Azure',
        type: 'Gold Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Enterprise Cloud Solutions',
        description: 'Azure Developer Associate certified for building enterprise-grade cloud applications and services.',
        benefits: ['Hybrid cloud solutions', 'Enterprise integration', 'Azure DevOps', 'AI/ML services'],
        projects: ['Fortune 500 cloud migrations', 'Enterprise app modernization', 'Data platform builds'],
        partnership_since: '2020'
      },
      {
        id: 13,
        name: 'Google Cloud',
        type: 'Technology Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Cloud Development & AI',
        description: 'Professional Cloud Developer and Digital Leader certifications for cutting-edge cloud solutions.',
        benefits: ['Kubernetes expertise', 'AI/ML platforms', 'BigQuery analytics', 'Serverless computing'],
        projects: ['Data warehouses', 'ML model deployments', 'Real-time analytics platforms'],
        partnership_since: '2021'
      },
      {
        id: 14,
        name: 'Vercel',
        type: 'Agency Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Next.js & JAMstack',
        description: 'Specialized partner for building blazing-fast web applications with Next.js and modern JAMstack architecture.',
        benefits: ['Edge computing', 'Performance optimization', 'Serverless functions', 'Global CDN'],
        projects: ['Enterprise web apps', 'E-commerce platforms', 'Marketing sites'],
        partnership_since: '2022'
      },
      {
        id: 15,
        name: 'GitHub',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'DevOps & Collaboration',
        description: 'Strategic partner for source control, CI/CD, and collaborative development workflows.',
        benefits: ['Version control', 'CI/CD automation', 'Code review', 'Security scanning'],
        projects: ['Enterprise DevOps transformations', 'Automated deployment pipelines', 'Code quality systems'],
        partnership_since: '2018'
      },
      {
        id: 16,
        name: 'Docker',
        type: 'Certified Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Containerization',
        description: 'Docker Certified Associate partner for container-based application deployment.',
        benefits: ['Container orchestration', 'Microservices', 'Development efficiency', 'Scalable deployments'],
        projects: ['Containerized applications', 'Microservices architectures', 'DevOps pipelines'],
        partnership_since: '2020'
      },
      {
        id: 17,
        name: 'Kubernetes',
        type: 'Certified',
        logo: '/api/placeholder/120/60',
        relationship: 'Container Orchestration',
        description: 'Certified Kubernetes Administrator for enterprise container orchestration.',
        benefits: ['Auto-scaling', 'Self-healing', 'Load balancing', 'Rolling updates'],
        projects: ['K8s clusters', 'Cloud-native apps', 'Multi-cloud deployments'],
        partnership_since: '2021'
      },
      {
        id: 18,
        name: 'GitLab',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'DevOps Platform',
        description: 'Partner for complete DevOps lifecycle management and CI/CD.',
        benefits: ['Complete DevOps', 'Auto DevOps', 'Security scanning', 'Monitoring'],
        projects: ['DevOps transformations', 'Pipeline automation', 'Security integration'],
        partnership_since: '2022'
      }
    ],
    cloud: [
      {
        id: 19,
        name: 'Cloudflare',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Performance & Security',
        description: 'Partner for enterprise CDN, security, and performance optimization solutions.',
        benefits: ['Global CDN', 'DDoS protection', 'Web application firewall', 'Edge computing'],
        projects: ['Enterprise security implementations', 'Global performance optimization', 'Zero Trust networks'],
        partnership_since: '2020'
      },
      {
        id: 20,
        name: 'MongoDB',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Database Solutions',
        description: 'Certified partner for NoSQL database implementations and data platform architecture.',
        benefits: ['Scalable databases', 'Real-time sync', 'Atlas cloud', 'Performance optimization'],
        projects: ['Real-time applications', 'IoT data platforms', 'Content management systems'],
        partnership_since: '2021'
      },
      {
        id: 21,
        name: 'Redis',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'In-Memory Data',
        description: 'Partner for high-performance caching and real-time data processing solutions.',
        benefits: ['Caching solutions', 'Session management', 'Real-time analytics', 'Message queuing'],
        projects: ['High-traffic applications', 'Real-time dashboards', 'Gaming backends'],
        partnership_since: '2022'
      },
      {
        id: 22,
        name: 'Netlify',
        type: 'Agency Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'JAMstack Platform',
        description: 'Certified partner for modern web development and deployment with JAMstack architecture.',
        benefits: ['Instant deployments', 'Serverless functions', 'Form handling', 'Identity management'],
        projects: ['Marketing sites', 'Static site generators', 'Progressive web apps'],
        partnership_since: '2021'
      },
      {
        id: 23,
        name: 'Fastly',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Edge Computing',
        description: 'Partner for edge cloud platform and content delivery network solutions.',
        benefits: ['Edge computing', 'Real-time analytics', 'Instant purging', 'Security'],
        projects: ['Global CDN setup', 'Edge applications', 'Performance optimization'],
        partnership_since: '2022'
      },
      {
        id: 24,
        name: 'DigitalOcean',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Cloud Infrastructure',
        description: 'Partner for simplified cloud infrastructure and developer-friendly hosting.',
        benefits: ['Simple cloud hosting', 'Managed databases', 'Kubernetes service', 'App platform'],
        projects: ['Startup hosting', 'Development environments', 'Application deployments'],
        partnership_since: '2019'
      }
    ],
    analytics: [
      {
        id: 25,
        name: 'Segment',
        type: 'Technology Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Customer Data Platform',
        description: 'Certified partner for customer data infrastructure and unified analytics implementations.',
        benefits: ['Data collection', 'Customer profiles', 'Event tracking', 'Data governance'],
        projects: ['CDP implementations', 'Multi-channel tracking', 'Data warehouse integration'],
        partnership_since: '2022'
      },
      {
        id: 26,
        name: 'Mixpanel',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Product Analytics',
        description: 'Certified partner for advanced product analytics and user behavior tracking.',
        benefits: ['User analytics', 'Funnel analysis', 'Cohort analysis', 'A/B testing'],
        projects: ['SaaS analytics', 'Mobile app tracking', 'Conversion optimization'],
        partnership_since: '2021'
      },
      {
        id: 27,
        name: 'Snowflake',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Data Cloud',
        description: 'SnowPro Core certified partner for cloud data warehousing and advanced analytics solutions.',
        benefits: ['Data warehousing', 'Data sharing', 'ML/AI workloads', 'Real-time processing'],
        projects: ['Enterprise data platforms', 'Analytics migrations', 'ML pipelines'],
        partnership_since: '2023'
      },
      {
        id: 28,
        name: 'Tableau',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Data Visualization',
        description: 'Partner for business intelligence and data visualization solutions.',
        benefits: ['Interactive dashboards', 'Self-service analytics', 'Data storytelling', 'Real-time insights'],
        projects: ['Executive dashboards', 'Sales analytics', 'Marketing performance'],
        partnership_since: '2020'
      },
      {
        id: 29,
        name: 'Databricks',
        type: 'Partner',
        logo: '/api/placeholder/120/60',
        relationship: 'Data & AI Platform',
        description: 'Partner for unified data analytics and AI platform solutions.',
        benefits: ['Data lakehouse', 'ML workflows', 'Real-time analytics', 'Collaborative notebooks'],
        projects: ['Data pipelines', 'ML model deployment', 'Analytics platforms'],
        partnership_since: '2023'
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

  const getPartnershipStats = () => {
    const allPartners = Object?.values(partnerships)?.flat();
    return {
      total: allPartners?.length,
      premier: allPartners?.filter(p => p?.type?.includes('Premier') || p?.type?.includes('Gold'))?.length,
      strategic: allPartners?.filter(p => p?.type?.includes('Partner'))?.length,
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
            Our comprehensive partner network of 29+ strategic alliances spans marketing platforms, cloud providers, 
            and development tools—enabling us to deliver integrated solutions that drive both creative excellence and technical innovation.
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
            { number: '60+', label: 'Total Certifications', icon: 'Shield' },
            { number: stats?.years + '+', label: 'Years Collaboration', icon: 'Clock' },
            { number: '100%', label: 'Platform Coverage', icon: 'Globe' }
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
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">The Complete Digital Advantage</h3>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Our strategic partnerships across marketing and development platforms enable us to deliver 
            end-to-end solutions that seamlessly integrate creative strategy with technical excellence.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {[
              {
                icon: 'Layers',
                title: 'Full-Stack Solutions',
                description: 'From marketing automation to cloud infrastructure, we cover every digital need.'
              },
              {
                icon: 'Shield',
                title: 'Enterprise-Grade',
                description: 'Certified partnerships ensure security, scalability, and compliance at every level.'
              },
              {
                icon: 'Zap',
                title: 'Seamless Integration',
                description: 'Our expertise across platforms means everything works together perfectly.'
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