import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import CaseStudyCard from './components/CaseStudyCard';
import CaseStudyListItem from './components/CaseStudyListItem';
import CaseStudyModal from './components/CaseStudyModal';
import MetricsVisualization from './components/MetricsVisualization';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const WorkShowcaseTheater = () => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState(() => {
    // Get saved view mode from localStorage or default to 'grid'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('caseStudyViewMode') || 'grid';
    }
    return 'grid';
  });
  const [activeFilters, setActiveFilters] = useState({
    industry: [],
    serviceType: [],
    businessStage: []
  });

  // Save view mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('caseStudyViewMode', viewMode);
    }
  }, [viewMode]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setViewMode('grid');
      } else if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setViewMode('list');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Mock case studies data
  const caseStudies = [
    {
      id: 1,
      title: "E-commerce Revolution: 400% Revenue Growth",
      client: "TechFlow Solutions",
      industry: "Technology",
      serviceType: "Full Rebrand",
      businessStage: "Growth Stage",
      heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      description: `Transformed a struggling tech startup into a market leader through comprehensive brand strategy, cutting-edge web development, and data-driven marketing campaigns that delivered unprecedented growth.`,
      challenge: `TechFlow Solutions was losing market share to competitors despite having superior technology. Their outdated brand identity and poor digital presence were hindering growth and investor confidence.`,
      solution: `We implemented a complete brand transformation including new visual identity, responsive web platform, and integrated marketing automation system that positioned them as industry innovators.`,
      timeline: "6 months",
      duration: "Jan - Jun 2024",
      featured: true,
      keyMetrics: [
        { label: "Revenue Growth", value: 400, type: "percentage" },
        { label: "Lead Generation", value: 250, type: "percentage" },
        { label: "Brand Recognition", value: 180, type: "percentage" }
      ],
      detailedResults: [
        { metric: "Monthly Revenue", value: 2500000, type: "currency", description: "From $500K to $2.5M monthly recurring revenue" },
        { metric: "Website Conversion", value: 340, type: "percentage", description: "Conversion rate improved from 2.1% to 7.2%" },
        { metric: "Customer Acquisition Cost", value: 65, type: "percentage", description: "Reduced CAC by 65% through optimized funnels" },
        { metric: "Brand Awareness", value: 180, type: "percentage", description: "Measured through brand recall surveys" }
      ],
      processSteps: [
        { title: "Discovery & Research", description: "Comprehensive market analysis and competitor research to identify opportunities" },
        { title: "Brand Strategy", description: "Developed new brand positioning and messaging framework" },
        { title: "Visual Identity", description: "Created modern, scalable brand identity system" },
        { title: "Digital Platform", description: "Built responsive, conversion-optimized website" },
        { title: "Marketing Automation", description: "Implemented integrated CRM and marketing systems" },
        { title: "Launch & Optimization", description: "Coordinated launch with ongoing performance optimization" }
      ],
      testimonial: {
        name: "Sarah Chen",
        position: "CEO & Founder",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        quote: "Rule27 Design didn't just redesign our brand - they transformed our entire business trajectory. The results exceeded every expectation we had."
      },
      gallery: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 2,
      title: "Healthcare Innovation: Digital Transformation",
      client: "MedCore Systems",
      industry: "Healthcare",
      serviceType: "Digital Strategy",
      businessStage: "Enterprise",
      heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      description: `Revolutionized patient care delivery through innovative digital solutions, streamlined workflows, and user-centered design that improved outcomes while reducing operational costs.`,
      challenge: `MedCore's legacy systems were creating bottlenecks in patient care, leading to longer wait times, frustrated staff, and declining patient satisfaction scores.`,
      solution: `We designed and implemented a comprehensive digital ecosystem including patient portal, staff dashboard, and automated workflow management system.`,
      timeline: "8 months",
      duration: "Mar - Oct 2024",
      featured: true,
      keyMetrics: [
        { label: "Patient Satisfaction", value: 95, type: "percentage" },
        { label: "Operational Efficiency", value: 160, type: "percentage" },
        { label: "Cost Reduction", value: 35, type: "percentage" }
      ],
      detailedResults: [
        { metric: "Patient Wait Time", value: 45, type: "percentage", description: "Average wait time reduced by 45%" },
        { metric: "Staff Productivity", value: 160, type: "percentage", description: "60% increase in daily patient capacity" },
        { metric: "System Uptime", value: 99.8, type: "percentage", description: "Achieved 99.8% system reliability" },
        { metric: "Annual Savings", value: 850000, type: "currency", description: "Operational cost savings in first year" }
      ],
      processSteps: [
        { title: "Stakeholder Interviews", description: "Conducted extensive interviews with patients, staff, and administrators" },
        { title: "System Architecture", description: "Designed scalable, secure healthcare technology infrastructure" },
        { title: "User Experience Design", description: "Created intuitive interfaces for all user types" },
        { title: "Development & Testing", description: "Built and rigorously tested all system components" },
        { title: "Staff Training", description: "Comprehensive training program for seamless adoption" },
        { title: "Phased Rollout", description: "Careful implementation with continuous monitoring" }
      ],
      testimonial: {
        name: "Dr. Michael Rodriguez",
        position: "Chief Medical Officer",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        quote: "The digital transformation Rule27 Design delivered has fundamentally changed how we deliver patient care. Our staff is happier, patients are more satisfied, and our outcomes have never been better."
      },
      gallery: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 3,
      title: "Fintech Startup: From Idea to IPO",
      client: "PayStream",
      industry: "Financial Services",
      serviceType: "Complete Package",
      businessStage: "Startup",
      heroImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      description: `Guided a fintech startup from concept to successful IPO through strategic branding, product development, and market positioning that attracted top-tier investors and customers.`,
      challenge: `PayStream had innovative technology but lacked market credibility, brand recognition, and the strategic positioning needed to compete with established financial institutions.`,
      solution: `We provided end-to-end support including brand development, product strategy, regulatory compliance guidance, and investor relations materials.`,
      timeline: "18 months",
      duration: "Jan 2023 - Jun 2024",
      featured: true,
      keyMetrics: [
        { label: "Valuation Growth", value: 15, type: "multiplier" },
        { label: "User Acquisition", value: 500, type: "percentage" },
        { label: "Investment Raised", value: 125000000, type: "currency" }
      ],
      detailedResults: [
        { metric: "Company Valuation", value: 750000000, type: "currency", description: "From $50M to $750M valuation" },
        { metric: "Active Users", value: 2500000, type: "number", description: "Grew from 50K to 2.5M active users" },
        { metric: "Revenue Growth", value: 800, type: "percentage", description: "Monthly recurring revenue increased 8x" },
        { metric: "Market Share", value: 12, type: "percentage", description: "Captured 12% of target market segment" }
      ],
      processSteps: [
        { title: "Market Research", description: "Deep analysis of fintech landscape and regulatory requirements" },
        { title: "Brand Foundation", description: "Built trust-focused brand identity for financial services" },
        { title: "Product Strategy", description: "Refined product-market fit and user experience" },
        { title: "Compliance Framework", description: "Established regulatory compliance and security protocols" },
        { title: "Go-to-Market", description: "Executed multi-channel launch and user acquisition strategy" },
        { title: "Scale & IPO Prep", description: "Prepared company for public offering and institutional investment" }
      ],
      testimonial: {
        name: "Jennifer Walsh",
        position: "Co-Founder & CEO",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        quote: "Rule27 Design was instrumental in our journey from startup to IPO. Their strategic guidance and execution excellence made the impossible possible."
      },
      gallery: [
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 4,
      title: "Retail Renaissance: Omnichannel Excellence",
      client: "Urban Threads",
      industry: "Retail",
      serviceType: "Marketing Campaign",
      businessStage: "Established",
      heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      description: `Transformed traditional retail brand into omnichannel powerhouse through integrated digital strategy, personalized customer experiences, and data-driven optimization.`,
      challenge: `Urban Threads was losing customers to online competitors and struggling to create cohesive experiences across their physical and digital touchpoints.`,
      solution: `We implemented unified customer data platform, redesigned e-commerce experience, and created seamless integration between online and offline channels.`,
      timeline: "10 months",
      duration: "Aug 2023 - May 2024",
      featured: false,
      keyMetrics: [
        { label: "Online Sales", value: 280, type: "percentage" },
        { label: "Customer Retention", value: 145, type: "percentage" },
        { label: "Store Traffic", value: 65, type: "percentage" }
      ],
      detailedResults: [
        { metric: "E-commerce Revenue", value: 3200000, type: "currency", description: "Annual online revenue growth" },
        { metric: "Customer Lifetime Value", value: 145, type: "percentage", description: "45% increase in CLV" },
        { metric: "Cross-channel Sales", value: 220, type: "percentage", description: "Customers shopping both online and in-store" },
        { metric: "Inventory Turnover", value: 180, type: "percentage", description: "Improved inventory efficiency" }
      ],
      processSteps: [
        { title: "Customer Journey Mapping", description: "Analyzed all customer touchpoints and pain points" },
        { title: "Technology Integration", description: "Unified POS, inventory, and customer data systems" },
        { title: "E-commerce Redesign", description: "Built mobile-first, conversion-optimized online store" },
        { title: "Personalization Engine", description: "Implemented AI-driven product recommendations" },
        { title: "Staff Training", description: "Trained retail staff on new omnichannel processes" },
        { title: "Performance Optimization", description: "Continuous testing and optimization of all channels" }
      ],
      testimonial: {
        name: "Marcus Thompson",
        position: "Retail Operations Director",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        quote: "Rule27 Design helped us bridge the gap between our physical and digital presence. Our customers now have seamless experiences regardless of how they choose to shop with us."
      },
      gallery: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 5,
      title: "Manufacturing 4.0: Smart Factory Revolution",
      client: "Precision Industries",
      industry: "Manufacturing",
      serviceType: "Digital Strategy",
      businessStage: "Enterprise",
      heroImage: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&h=600&fit=crop",
      description: `Modernized traditional manufacturing operations through IoT integration, predictive analytics, and automated quality control systems that increased efficiency and reduced waste.`,
      challenge: `Precision Industries was facing increasing competition from overseas manufacturers and needed to dramatically improve efficiency while maintaining quality standards.`,
      solution: `We designed and implemented Industry 4.0 solutions including IoT sensors, predictive maintenance systems, and real-time production monitoring dashboards.`,
      timeline: "12 months",
      duration: "Feb 2023 - Jan 2024",
      featured: false,
      keyMetrics: [
        { label: "Production Efficiency", value: 185, type: "percentage" },
        { label: "Quality Improvement", value: 95, type: "percentage" },
        { label: "Waste Reduction", value: 40, type: "percentage" }
      ],
      detailedResults: [
        { metric: "Overall Equipment Effectiveness", value: 185, type: "percentage", description: "85% improvement in OEE scores" },
        { metric: "Defect Rate", value: 95, type: "percentage", description: "95% reduction in product defects" },
        { metric: "Energy Consumption", value: 30, type: "percentage", description: "30% reduction in energy usage" },
        { metric: "Annual Savings", value: 4200000, type: "currency", description: "Cost savings from efficiency improvements" }
      ],
      processSteps: [
        { title: "Current State Analysis", description: "Comprehensive audit of existing manufacturing processes" },
        { title: "IoT Infrastructure", description: "Installed sensors and connectivity throughout facility" },
        { title: "Data Analytics Platform", description: "Built real-time monitoring and analytics dashboard" },
        { title: "Predictive Maintenance", description: "Implemented AI-powered maintenance scheduling" },
        { title: "Quality Control Automation", description: "Automated inspection and quality assurance processes" },
        { title: "Continuous Improvement", description: "Ongoing optimization based on data insights" }
      ],
      testimonial: {
        name: "David Kim",
        position: "VP of Operations",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        quote: "The smart factory transformation Rule27 Design delivered has positioned us as a leader in manufacturing innovation. Our efficiency gains have been remarkable."
      },
      gallery: [
        "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 6,
      title: "EdTech Innovation: Learning Platform Revolution",
      client: "EduNext",
      industry: "Education",
      serviceType: "Product Development",
      businessStage: "Growth Stage",
      heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      description: `Created next-generation learning platform that personalizes education through AI-driven content delivery, interactive assessments, and real-time progress tracking.`,
      challenge: `EduNext needed to differentiate their platform in a crowded EdTech market while ensuring scalability for millions of students and educators worldwide.`,
      solution: `We developed a comprehensive learning management system with adaptive learning algorithms, collaborative tools, and analytics dashboard for educators.`,
      timeline: "14 months",
      duration: "Sep 2022 - Oct 2023",
      featured: false,
      keyMetrics: [
        { label: "Student Engagement", value: 220, type: "percentage" },
        { label: "Learning Outcomes", value: 165, type: "percentage" },
        { label: "Platform Adoption", value: 340, type: "percentage" }
      ],
      detailedResults: [
        { metric: "Active Users", value: 5000000, type: "number", description: "Grew to 5M+ active monthly users" },
        { metric: "Course Completion Rate", value: 165, type: "percentage", description: "65% improvement in completion rates" },
        { metric: "Student Performance", value: 140, type: "percentage", description: "40% improvement in test scores" },
        { metric: "Revenue Growth", value: 450, type: "percentage", description: "350% increase in subscription revenue" }
      ],
      processSteps: [
        { title: "Educational Research", description: "Studied learning science and pedagogical best practices" },
        { title: "User Experience Design", description: "Designed intuitive interfaces for students and educators" },
        { title: "AI Algorithm Development", description: "Built personalized learning recommendation engine" },
        { title: "Content Management System", description: "Created flexible system for course creation and delivery" },
        { title: "Assessment Tools", description: "Developed interactive quizzes and progress tracking" },
        { title: "Scale & Performance", description: "Optimized platform for millions of concurrent users" }
      ],
      testimonial: {
        name: "Dr. Lisa Park",
        position: "Chief Academic Officer",
        avatar: "https://randomuser.me/api/portraits/women/55.jpg",
        quote: "Rule27 Design's platform has revolutionized how our students learn. The personalized approach and engaging interface have dramatically improved learning outcomes."
      },
      gallery: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
      ]
    }
  ];

  // Filter options
  const filters = {
    industries: [...new Set(caseStudies.map(study => study.industry))],
    serviceTypes: [...new Set(caseStudies.map(study => study.serviceType))],
    businessStages: [...new Set(caseStudies.map(study => study.businessStage))]
  };

  // Featured case studies for hero section
  const featuredCaseStudies = caseStudies?.filter(study => study?.featured);

  // Filter and sort case studies
  const filteredCaseStudies = caseStudies?.filter(study => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery?.toLowerCase();
      const matchesSearch = 
        study?.title?.toLowerCase()?.includes(searchLower) ||
        study?.client?.toLowerCase()?.includes(searchLower) ||
        study?.description?.toLowerCase()?.includes(searchLower) ||
        study?.industry?.toLowerCase()?.includes(searchLower) ||
        study?.serviceType?.toLowerCase()?.includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Category filters
    if (activeFilters?.industry?.length > 0 && !activeFilters?.industry?.includes(study?.industry)) {
      return false;
    }
    if (activeFilters?.serviceType?.length > 0 && !activeFilters?.serviceType?.includes(study?.serviceType)) {
      return false;
    }
    if (activeFilters?.businessStage?.length > 0 && !activeFilters?.businessStage?.includes(study?.businessStage)) {
      return false;
    }

    return true;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        if (a?.featured && !b?.featured) return -1;
        if (!a?.featured && b?.featured) return 1;
        return b?.id - a?.id;
      case 'newest':
        return b?.id - a?.id;
      case 'impact':
        const aImpact = a?.keyMetrics?.reduce((sum, metric) => sum + metric?.value, 0);
        const bImpact = b?.keyMetrics?.reduce((sum, metric) => sum + metric?.value, 0);
        return bImpact - aImpact;
      case 'alphabetical':
        return a?.title?.localeCompare(b?.title);
      default:
        return 0;
    }
  });

  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev?.[category]?.includes(value)
        ? prev?.[category]?.filter(item => item !== value)
        : [...prev?.[category], value]
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      industry: [],
      serviceType: [],
      businessStage: []
    });
    setSearchQuery('');
  };

  const handleViewCaseStudy = (caseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
  };

  return (
    <>
      <Helmet>
        <title>Work Showcase Theater - Rule27 Design Digital Powerhouse</title>
        <meta name="description" content="Explore Rule27 Design's portfolio of transformative case studies. See how we've delivered measurable results across industries through strategic design, development, and marketing excellence." />
        <meta name="keywords" content="case studies, portfolio, digital transformation, brand strategy, web development, marketing results, client success stories" />
        <meta property="og:title" content="Work Showcase Theater - Rule27 Design Digital Powerhouse" />
        <meta property="og:description" content="Cinematic case study presentations showcasing Rule27 Design's transformation ability through detailed success stories with measurable outcomes." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/work-showcase-theater" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <HeroSection 
          featuredCaseStudies={featuredCaseStudies}
          onViewCaseStudy={handleViewCaseStudy}
        />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Case Studies Grid */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary">
                  {filteredCaseStudies?.length} Case Stud{filteredCaseStudies?.length !== 1 ? 'ies' : 'y'}
                </h2>
                <p className="text-sm sm:text-base text-text-secondary">
                  Transformation stories with measurable impact
                </p>
              </div>
              
              {/* View Toggle - Now visible on mobile too */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-accent'}
                  aria-label="Grid view"
                  title="Grid view (Ctrl+G)"
                >
                  <Icon name="Grid3X3" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-accent'}
                  aria-label="List view"
                  title="List view (Ctrl+L)"
                >
                  <Icon name="List" size={20} />
                </Button>
              </div>
            </div>

            {/* Case Studies - Grid or List View with Animation */}
            {filteredCaseStudies?.length > 0 ? (
              <div className="transition-all duration-300 ease-in-out">
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-in">
                    {filteredCaseStudies?.map((caseStudy) => (
                      <CaseStudyCard
                        key={caseStudy?.id}
                        caseStudy={caseStudy}
                        onViewDetails={handleViewCaseStudy}
                      />
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="space-y-6 animate-fade-in">
                    {filteredCaseStudies?.map((caseStudy) => (
                      <CaseStudyListItem
                        key={caseStudy?.id}
                        caseStudy={caseStudy}
                        onViewDetails={handleViewCaseStudy}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Icon name="Search" size={28} className="text-text-secondary sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                  No case studies found
                </h3>
                <p className="text-sm sm:text-base text-text-secondary mb-4 sm:mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-accent text-accent hover:bg-accent hover:text-white text-sm sm:text-base"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Metrics Visualization */}
        <MetricsVisualization caseStudies={caseStudies} />

        {/* CTA Section - Mobile Responsive */}
        <section className="py-12 sm:py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Create Your Success Story?
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 px-4 sm:px-0">
              Join the ranks of industry leaders who've transformed their businesses with Rule27 Design. 
              Let's discuss how we can deliver similar results for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="default"
                size="default"
                onClick={() => window.location.href = '/contact-consultation-portal'}
                className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                iconName="Calendar"
                iconPosition="left"
              >
                Book Strategy Session
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => window.location.href = '/capability-universe'}
                className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                iconName="Zap"
                iconPosition="left"
              >
                Explore Our Services
              </Button>
            </div>
          </div>
        </section>

        {/* Case Study Modal */}
        <CaseStudyModal
          caseStudy={selectedCaseStudy}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        {/* Footer */}
        <Footer />
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default WorkShowcaseTheater;