import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ServiceZoneCard from './components/ServiceZoneCard';
import CapabilityFilter from './components/CapabilityFilter';
import ServiceDetailModal from './components/ServiceDetailModal';
import InteractiveDemo from './components/InteractiveDemo';
import CapabilityAssessment from './components/CapabilityAssessment';

const CapabilityUniverse = () => {
  const [activeZone, setActiveZone] = useState('creative-studio');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoize service zones to prevent recreation on every render
  const serviceZones = useMemo(() => [
    {
      id: 'creative-studio',
      title: 'Creative Studio',
      icon: 'Palette',
      description: 'Transform your brand identity with cutting-edge creative solutions that captivate audiences and drive engagement across all touchpoints.',
      serviceCount: 12,
      keyServices: ['Brand Identity', 'Campaign Creative', 'Digital Experiences', 'Content Strategy'],
      stats: { projects: 150, satisfaction: 98 }
    },
    {
      id: 'marketing-command',
      title: 'Digital Marketing Command',
      icon: 'Target',
      description: 'Data-driven marketing strategies that deliver measurable results through performance optimization and strategic channel management.',
      serviceCount: 8,
      keyServices: ['Performance Marketing', 'SEO Strategy', 'Social Media', 'Analytics'],
      stats: { projects: 200, satisfaction: 96 }
    },
    {
      id: 'development-lab',
      title: 'Development Lab',
      icon: 'Code',
      description: 'Custom technical solutions built with modern technologies to solve complex business challenges and enhance operational efficiency.',
      serviceCount: 15,
      keyServices: ['Web Development', 'Mobile Apps', 'E-commerce', 'Integrations'],
      stats: { projects: 120, satisfaction: 99 }
    },
    {
      id: 'executive-advisory',
      title: 'Executive Advisory',
      icon: 'Users',
      description: 'Strategic leadership and fractional executive services to guide business growth and navigate complex market challenges.',
      serviceCount: 6,
      keyServices: ['Strategic Planning', 'Fractional CMO', 'Business Development', 'Market Entry'],
      stats: { projects: 80, satisfaction: 100 }
    }
  ], []);

  // Memoize detailed services to prevent recreation
  const detailedServices = useMemo(() => [
    {
      id: 'brand-identity',
      title: 'Brand Identity Design',
      category: 'Creative Studio',
      zone: 'creative-studio',
      icon: 'Palette',
      description: 'Complete brand identity systems that establish market presence',
      fullDescription: `Our brand identity design service creates comprehensive visual systems that establish your unique market presence and resonate with your target audience. We develop cohesive brand elements that work seamlessly across all touchpoints, from digital platforms to physical applications.\n\nOur process combines strategic thinking with creative excellence to ensure your brand not only looks exceptional but also communicates your values and differentiates you from competitors.`,
      features: [
        'Logo design and variations',
        'Color palette development',
        'Typography system',
        'Brand guidelines',
        'Application examples',
        'Digital asset library'
      ],
      technologies: ['Adobe Creative Suite', 'Figma', 'Sketch', 'Principle', 'After Effects'],
      process: [
        {
          title: 'Discovery & Research',
          description: 'Deep dive into your business, market, and competitive landscape',
          duration: '1-2 weeks'
        },
        {
          title: 'Concept Development',
          description: 'Create multiple design directions based on strategic insights',
          duration: '2-3 weeks'
        },
        {
          title: 'Refinement & Testing',
          description: 'Refine chosen concept and test across various applications',
          duration: '1-2 weeks'
        },
        {
          title: 'Finalization & Delivery',
          description: 'Complete brand guidelines and asset delivery',
          duration: '1 week'
        }
      ],
      expectedResults: [
        { metric: '40%', description: 'Increase in brand recognition' },
        { metric: '25%', description: 'Improvement in customer trust' },
        { metric: '60%', description: 'Enhanced brand consistency' }
      ],
      pricingTiers: [
        {
          name: 'Essential',
          price: '$15,000',
          billing: 'One-time',
          features: ['Logo design', 'Basic color palette', 'Typography selection', 'Simple guidelines'],
          popular: false
        },
        {
          name: 'Professional',
          price: '$25,000',
          billing: 'One-time',
          features: ['Complete identity system', 'Extended color palette', 'Typography system', 'Comprehensive guidelines', 'Application examples'],
          popular: true
        },
        {
          name: 'Enterprise',
          price: '$45,000',
          billing: 'One-time',
          features: ['Full brand ecosystem', 'Multiple variations', 'Advanced guidelines', 'Training materials', 'Ongoing support'],
          popular: false
        }
      ],
      portfolio: [
        {
          title: 'TechStart Rebrand',
          client: 'Technology Startup',
          image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
        },
        {
          title: 'Luxury Hotel Identity',
          client: 'Hospitality Group',
          image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop'
        }
      ],
      caseStudy: {
        client: 'GreenTech Solutions',
        challenge: 'Outdated brand identity that didn\'t reflect their innovative approach to sustainability',
        results: [
          '45% increase in brand recognition',
          '30% improvement in lead quality',
          '25% boost in customer trust scores'
        ]
      }
    },
    {
      id: 'performance-marketing',
      title: 'Performance Marketing',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'TrendingUp',
      description: 'Data-driven campaigns that deliver measurable ROI',
      fullDescription: `Our performance marketing service focuses on delivering measurable results through strategic campaign optimization and data-driven decision making. We create and manage campaigns across multiple channels to maximize your return on investment.\n\nUsing advanced analytics and testing methodologies, we continuously optimize your campaigns to improve performance and reduce acquisition costs while scaling successful initiatives.`,
      features: [
        'Multi-channel campaign management',
        'Advanced audience targeting',
        'Conversion optimization',
        'Real-time performance tracking',
        'A/B testing framework',
        'ROI reporting and analysis'
      ],
      technologies: ['Google Ads', 'Facebook Ads Manager', 'Google Analytics', 'Hotjar', 'Optimizely', 'Tableau'],
      process: [
        {
          title: 'Strategy Development',
          description: 'Define goals, KPIs, and channel strategy based on business objectives',
          duration: '1 week'
        },
        {
          title: 'Campaign Setup',
          description: 'Create campaigns, audiences, and tracking infrastructure',
          duration: '1-2 weeks'
        },
        {
          title: 'Launch & Optimization',
          description: 'Launch campaigns and begin continuous optimization process',
          duration: 'Ongoing'
        },
        {
          title: 'Analysis & Scaling',
          description: 'Analyze performance and scale successful campaigns',
          duration: 'Ongoing'
        }
      ],
      expectedResults: [
        { metric: '150%', description: 'Average ROI improvement' },
        { metric: '35%', description: 'Reduction in cost per acquisition' },
        { metric: '80%', description: 'Increase in qualified leads' }
      ],
      pricingTiers: [
        {
          name: 'Starter',
          price: '$5,000',
          billing: 'Per month',
          features: ['2 channels', 'Basic reporting', 'Monthly optimization', 'Email support'],
          popular: false
        },
        {
          name: 'Growth',
          price: '$10,000',
          billing: 'Per month',
          features: ['4 channels', 'Advanced analytics', 'Bi-weekly optimization', 'Phone support', 'A/B testing'],
          popular: true
        },
        {
          name: 'Scale',
          price: '$20,000',
          billing: 'Per month',
          features: ['Unlimited channels', 'Custom reporting', 'Weekly optimization', 'Dedicated manager', 'Advanced testing'],
          popular: false
        }
      ],
      portfolio: [
        {
          title: 'E-commerce Growth Campaign',
          client: 'Fashion Retailer',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
        },
        {
          title: 'SaaS Lead Generation',
          client: 'Software Company',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
        }
      ],
      caseStudy: {
        client: 'FinTech Startup',
        challenge: 'High customer acquisition costs and low conversion rates across digital channels',
        results: [
          '180% improvement in ROI',
          '45% reduction in cost per acquisition',
          '120% increase in qualified leads'
        ]
      }
    },
    {
      id: 'web-development',
      title: 'Custom Web Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Code',
      description: 'Modern web applications built for performance and scalability',
      fullDescription: `Our custom web development service creates high-performance, scalable web applications using modern technologies and best practices. We build solutions that not only meet your current needs but are architected to grow with your business.\n\nFrom responsive websites to complex web applications, we ensure optimal performance, security, and user experience across all devices and platforms.`,
      features: [
        'Responsive design implementation',
        'Modern framework development',
        'API integration and development',
        'Performance optimization',
        'Security implementation',
        'Ongoing maintenance and support'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      process: [
        {
          title: 'Requirements Analysis',
          description: 'Detailed analysis of functional and technical requirements',
          duration: '1-2 weeks'
        },
        {
          title: 'Architecture Design',
          description: 'System architecture and technology stack planning',
          duration: '1 week'
        },
        {
          title: 'Development & Testing',
          description: 'Iterative development with continuous testing and feedback',
          duration: '6-12 weeks'
        },
        {
          title: 'Deployment & Launch',
          description: 'Production deployment and go-live support',
          duration: '1 week'
        }
      ],
      expectedResults: [
        { metric: '50%', description: 'Faster page load times' },
        { metric: '99.9%', description: 'Uptime reliability' },
        { metric: '40%', description: 'Improved user engagement' }
      ],
      pricingTiers: [
        {
          name: 'Basic',
          price: '$25,000',
          billing: 'One-time',
          features: ['5-10 pages', 'Responsive design', 'Basic CMS', 'Contact forms', '3 months support'],
          popular: false
        },
        {
          name: 'Professional',
          price: '$50,000',
          billing: 'One-time',
          features: ['Custom functionality', 'Advanced CMS', 'API integrations', 'Performance optimization', '6 months support'],
          popular: true
        },
        {
          name: 'Enterprise',
          price: '$100,000',
          billing: 'One-time',
          features: ['Complex applications', 'Custom integrations', 'Advanced security', 'Scalable architecture', '12 months support'],
          popular: false
        }
      ],
      portfolio: [
        {
          title: 'E-commerce Platform',
          client: 'Retail Company',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'
        },
        {
          title: 'SaaS Dashboard',
          client: 'Technology Startup',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
        }
      ],
      caseStudy: {
        client: 'Healthcare Provider',
        challenge: 'Legacy system replacement with modern, scalable web application',
        results: [
          '60% improvement in system performance',
          '40% reduction in operational costs',
          '95% user satisfaction score'
        ]
      }
    },
    {
      id: 'strategic-planning',
      title: 'Strategic Business Planning',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'Target',
      description: 'Comprehensive strategic planning and execution guidance',
      fullDescription: `Our strategic business planning service provides comprehensive guidance for long-term business success. We work closely with leadership teams to develop actionable strategies that align with market opportunities and organizational capabilities.\n\nThrough data-driven analysis and proven frameworks, we help businesses navigate complex challenges and capitalize on growth opportunities.`,
      features: [
        'Market analysis and competitive research',
        'Strategic framework development',
        'Goal setting and KPI definition',
        'Implementation roadmap',
        'Performance monitoring',
        'Ongoing strategic guidance'
      ],
      technologies: ['Tableau', 'Salesforce', 'HubSpot', 'Google Analytics', 'Slack', 'Asana'],
      process: [
        {
          title: 'Current State Assessment',
          description: 'Comprehensive analysis of current business position and capabilities',
          duration: '2-3 weeks'
        },
        {
          title: 'Market & Competitive Analysis',
          description: 'Deep dive into market dynamics and competitive landscape',
          duration: '2 weeks'
        },
        {
          title: 'Strategy Development',
          description: 'Collaborative strategy formulation and validation',
          duration: '3-4 weeks'
        },
        {
          title: 'Implementation Planning',
          description: 'Detailed roadmap and execution planning',
          duration: '1-2 weeks'
        }
      ],
      expectedResults: [
        { metric: '25%', description: 'Revenue growth acceleration' },
        { metric: '30%', description: 'Operational efficiency improvement' },
        { metric: '90%', description: 'Strategic goal achievement rate' }
      ],
      pricingTiers: [
        {
          name: 'Consultation',
          price: '$15,000',
          billing: 'One-time',
          features: ['Strategic assessment', 'Recommendations report', 'Implementation guidance', '2 follow-up sessions'],
          popular: false
        },
        {
          name: 'Planning Package',
          price: '$35,000',
          billing: 'One-time',
          features: ['Complete strategic plan', 'Implementation roadmap', 'KPI framework', '6 months guidance'],
          popular: true
        },
        {
          name: 'Ongoing Advisory',
          price: '$10,000',
          billing: 'Per month',
          features: ['Monthly strategic reviews', 'Continuous guidance', 'Performance monitoring', 'Quarterly planning'],
          popular: false
        }
      ],
      portfolio: [
        {
          title: 'Market Expansion Strategy',
          client: 'Manufacturing Company',
          image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'
        },
        {
          title: 'Digital Transformation Plan',
          client: 'Financial Services',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
        }
      ],
      caseStudy: {
        client: 'Regional Bank',
        challenge: 'Digital transformation strategy to compete with fintech startups',
        results: [
          '35% increase in digital adoption',
          '20% improvement in customer satisfaction',
          '15% reduction in operational costs'
        ]
      }
    }
  ], []);

  // Memoize filter categories
  const filterCategories = useMemo(() => [
    { id: 'all', name: 'All Services', icon: 'Grid', count: detailedServices.length },
    { id: 'Creative Studio', name: 'Creative Studio', icon: 'Palette', count: detailedServices.filter(s => s.category === 'Creative Studio').length },
    { id: 'Digital Marketing Command', name: 'Marketing Command', icon: 'Target', count: detailedServices.filter(s => s.category === 'Digital Marketing Command').length },
    { id: 'Development Lab', name: 'Development Lab', icon: 'Code', count: detailedServices.filter(s => s.category === 'Development Lab').length },
    { id: 'Executive Advisory', name: 'Executive Advisory', icon: 'Users', count: detailedServices.filter(s => s.category === 'Executive Advisory').length }
  ], [detailedServices]);

  // Optimize filtering with useMemo
  useEffect(() => {
    let filtered = detailedServices;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(service => service.category === activeCategory);
    }

    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(lowercaseSearch) ||
        service.description?.toLowerCase().includes(lowercaseSearch) ||
        service.features?.some(feature => feature.toLowerCase().includes(lowercaseSearch))
      );
    }

    setFilteredServices(filtered);
  }, [activeCategory, searchTerm, detailedServices]);

  // Memoize handlers
  const handleZoneActivate = useCallback((zoneId) => {
    setActiveZone(zoneId);
  }, []);

  const handleZoneExplore = useCallback((zone) => {
    setActiveZone(zone.id);
    // Smooth scroll with fallback
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleServiceSelect = useCallback((service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedService(null);
  }, []);

  return (
    <>
      <Helmet>
        <title>Capability Universe - Rule27 Design Digital Powerhouse</title>
        <meta name="description" content="Explore Rule27 Design's comprehensive service capabilities across Creative Studio, Digital Marketing Command, Development Lab, and Executive Advisory. Interactive demonstrations and personalized assessments." />
        <meta name="keywords" content="digital agency services, creative studio, marketing command, development lab, executive advisory, capability assessment" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-6 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                    Capability <span className="text-accent">Universe</span>
                  </h1>
                  <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed px-4">
                    Four distinct experience zones showcase Rule27 Design's comprehensive service mastery through immersive, 
                    interactive presentations. Discover the perfect solution for your business transformation.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center px-4"
                >
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
                    iconName="Zap"
                    iconPosition="left"
                    onClick={() => document.getElementById('zones-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Capabilities
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-accent text-accent hover:bg-accent hover:text-white w-full sm:w-auto"
                    iconName="Calculator"
                    iconPosition="left"
                    onClick={() => document.getElementById('assessment-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Take Assessment
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Service Zones Section */}
          <section id="zones-section" className="py-12 md:py-16 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Service Experience Zones
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Each zone represents a core competency area with specialized expertise and proven methodologies
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {serviceZones.map((zone) => (
                  <ServiceZoneCard
                    key={zone.id}
                    zone={zone}
                    isActive={activeZone === zone.id}
                    onActivate={() => handleZoneActivate(zone.id)}
                    onExplore={handleZoneExplore}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Demo Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Interactive Demonstrations
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Experience our capabilities through live, interactive demonstrations
                </p>
              </div>

              <InteractiveDemo activeZone={activeZone} />
            </div>
          </section>

          {/* Detailed Services Section */}
          <section id="services-section" className="py-12 md:py-16 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Detailed Service Catalog
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Explore our comprehensive service offerings with detailed information and case studies
                </p>
              </div>

              <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
                {/* Filter Sidebar - Hidden on mobile by default */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <CapabilityFilter
                      categories={filterCategories}
                      activeCategory={activeCategory}
                      onCategoryChange={handleCategoryChange}
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchChange}
                    />
                  </div>
                </div>

                {/* Services Grid */}
                <div className="lg:col-span-3">
                  <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    {filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-border rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => handleServiceSelect(service)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-accent/10 rounded-xl">
                            <Icon name={service.icon} size={24} className="text-accent" />
                          </div>
                          <span className="text-xs px-2 py-1 bg-muted text-text-secondary rounded-full">
                            {service.category}
                          </span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{service.title}</h3>
                        <p className="text-sm md:text-base text-text-secondary mb-4">{service.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {service.features?.slice(0, 2).map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-muted text-text-secondary rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          <Icon name="ArrowRight" size={16} className="text-accent flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-primary mb-2">No services found</h3>
                      <p className="text-text-secondary">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Capability Assessment Section */}
          <section id="assessment-section" className="py-12 md:py-16 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Capability Assessment
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Get personalized service recommendations based on your business needs and goals
                </p>
              </div>

              <CapabilityAssessment />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-accent text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Let's discuss how our capabilities can drive your success
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  iconName="Calendar"
                  iconPosition="left"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                >
                  Schedule Strategy Call
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto"
                >
                  Start Conversation
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Service Detail Modal */}
        <ServiceDetailModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </>
  );
};

export default CapabilityUniverse;