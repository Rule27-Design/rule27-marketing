import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Sample case studies data - memoized
  const caseStudies = useMemo(() => [
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
    }
  ], []);

  // Filter options - memoized
  const filters = useMemo(() => ({
    industries: [...new Set(caseStudies.map(study => study.industry))],
    serviceTypes: [...new Set(caseStudies.map(study => study.serviceType))],
    businessStages: [...new Set(caseStudies.map(study => study.businessStage))]
  }), [caseStudies]);

  // Featured case studies for hero section - memoized
  const featuredCaseStudies = useMemo(() => 
    caseStudies?.filter(study => study?.featured),
  [caseStudies]);

  // Filter and sort case studies - memoized
  const filteredCaseStudies = useMemo(() => {
    let filtered = [...caseStudies];

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery?.toLowerCase();
      filtered = filtered.filter(study => 
        study?.title?.toLowerCase()?.includes(searchLower) ||
        study?.client?.toLowerCase()?.includes(searchLower) ||
        study?.description?.toLowerCase()?.includes(searchLower) ||
        study?.industry?.toLowerCase()?.includes(searchLower) ||
        study?.serviceType?.toLowerCase()?.includes(searchLower)
      );
    }

    // Category filters
    if (activeFilters?.industry?.length > 0) {
      filtered = filtered.filter(study => 
        activeFilters?.industry?.includes(study?.industry)
      );
    }
    if (activeFilters?.serviceType?.length > 0) {
      filtered = filtered.filter(study => 
        activeFilters?.serviceType?.includes(study?.serviceType)
      );
    }
    if (activeFilters?.businessStage?.length > 0) {
      filtered = filtered.filter(study => 
        activeFilters?.businessStage?.includes(study?.businessStage)
      );
    }

    // Sort
    filtered.sort((a, b) => {
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

    return filtered;
  }, [caseStudies, searchQuery, activeFilters, sortBy]);

  // Memoized callbacks
  const handleFilterChange = useCallback((category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev?.[category]?.includes(value)
        ? prev?.[category]?.filter(item => item !== value)
        : [...prev?.[category], value]
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({
      industry: [],
      serviceType: [],
      businessStage: []
    });
    setSearchQuery('');
  }, []);

  const handleViewCaseStudy = useCallback((caseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Work | Rule27 Design - Transformational Case Studies</title>
        <meta 
          name="description" 
          content="Explore success stories with 500%+ growth. See how we transform brands through strategic creativity and technical excellence." 
        />
        <meta name="keywords" content="case studies, portfolio, digital transformation, brand strategy, web development, marketing results, client success stories, 500% growth" />
        <meta property="og:title" content="Our Work | Rule27 Design - Transformational Case Studies" />
        <meta property="og:description" content="Explore success stories with 500%+ growth. See how we transform brands through strategic creativity and technical excellence." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/work" />
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
        <section className="py-8 sm:py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header - Typography Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-heading-regular text-primary tracking-wider uppercase">
                  <span className="font-heading-regular">{filteredCaseStudies?.length}</span> Case Stud{filteredCaseStudies?.length !== 1 ? 'ies' : 'y'}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text-secondary font-sans">
                  Transformation stories with measurable impact
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-accent'} w-8 h-8 sm:w-10 sm:h-10`}
                  aria-label="Grid view"
                >
                  <Icon name="Grid3X3" size={18} className="sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-accent'} w-8 h-8 sm:w-10 sm:h-10`}
                  aria-label="List view"
                >
                  <Icon name="List" size={18} className="sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Case Studies Display */}
            {filteredCaseStudies?.length > 0 ? (
              <div className="transition-all duration-300 ease-in-out">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-fade-in">
                    {filteredCaseStudies?.map((caseStudy) => (
                      <CaseStudyCard
                        key={caseStudy?.id}
                        caseStudy={caseStudy}
                        onViewDetails={handleViewCaseStudy}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
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
              <div className="text-center py-8 sm:py-12 md:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <Icon name="Search" size={24} className="text-text-secondary sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-heading-regular text-primary mb-2 tracking-wider uppercase">
                  No case studies found
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-text-secondary mb-3 sm:mb-4 md:mb-6 font-sans">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-accent text-accent hover:bg-accent hover:text-white text-xs sm:text-sm md:text-base px-3 py-2 font-heading-regular tracking-wider uppercase"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Metrics Visualization */}
        <MetricsVisualization caseStudies={caseStudies} />

        {/* CTA Section - Typography Optimized */}
        <section className="py-12 sm:py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading-regular mb-4 sm:mb-6 tracking-wider uppercase">
              Ready to Create Your Success Story?
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 px-4 sm:px-0 font-sans">
              Join the ranks of industry leaders who've transformed their businesses with Rule27 Design. 
              Let's discuss how we can deliver similar results for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="default"
                size="default"
                onClick={() => window.location.href = '/contact'}
                className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                iconName="Calendar"
                iconPosition="left"
              >
                <span className="font-heading-regular tracking-wider uppercase">Book Strategy Session</span>
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => window.location.href = '/capabilities'}
                className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                iconName="Zap"
                iconPosition="left"
              >
                <span className="font-heading-regular tracking-wider uppercase">Explore Our Services</span>
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