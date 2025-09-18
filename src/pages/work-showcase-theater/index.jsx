import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import CaseStudyCard from './components/CaseStudyCard';
import CaseStudyListItem from './components/CaseStudyListItem';
import MetricsVisualization from './components/MetricsVisualization';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useCaseStudies, useCaseStudyFilters } from '../../hooks/useCaseStudies';

const WorkShowcaseTheater = () => {
  const navigate = useNavigate();
  const { caseStudies, featuredCaseStudies, loading, error } = useCaseStudies();
  const { industries, serviceTypes, businessStages } = useCaseStudyFilters();
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

  // Filter options
  const filters = useMemo(() => ({
    industries,
    serviceTypes,
    businessStages
  }), [industries, serviceTypes, businessStages]);

  // Filter and sort case studies
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
          return 0;
        case 'newest':
          return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
        case 'impact':
          const aImpact = a?.keyMetrics?.reduce((sum, metric) => sum + (metric?.value || 0), 0);
          const bImpact = b?.keyMetrics?.reduce((sum, metric) => sum + (metric?.value || 0), 0);
          return bImpact - aImpact;
        case 'alphabetical':
          return a?.title?.localeCompare(b?.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [caseStudies, searchQuery, activeFilters, sortBy]);

  // Callbacks
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

  // Navigate to case study detail page
  const handleViewCaseStudy = useCallback((caseStudy) => {
    navigate(`/case-study/${caseStudy.slug}`);
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary font-sans">Loading case studies...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertCircle" size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-heading-regular text-primary mb-2 tracking-wider uppercase">Error Loading Case Studies</h2>
            <p className="text-text-secondary mb-4 font-sans">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-accent text-accent hover:bg-accent hover:text-white"
            >
              <span className="font-heading-regular tracking-wider uppercase">Try Again</span>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Our Case Studies | Rule27 Design - Transformational Case Studies</title>
        <meta 
          name="description" 
          content="Explore success stories with 500%+ growth. See how we transform brands through strategic creativity and technical excellence." 
        />
        <meta name="keywords" content="case studies, portfolio, digital transformation, brand strategy, web development, marketing results, client success stories, 500% growth" />
        <meta property="og:title" content="Our Case Studies | Rule27 Design - Transformational Case Studies" />
        <meta property="og:description" content="Explore success stories with 500%+ growth. See how we transform brands through strategic creativity and technical excellence." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/case-studies" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section - Now navigates to case study page */}
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
            {/* Results Header */}
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
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    {filteredCaseStudies?.map((caseStudy) => (
                      <CaseStudyListItem
                        key={caseStudy?.id}
                        caseStudy={caseStudy}
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
                  {caseStudies.length === 0 ? 'No case studies available yet' : 'Try adjusting your filters or search terms'}
                </p>
                {caseStudies.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-accent text-accent hover:bg-accent hover:text-white text-xs sm:text-sm md:text-base px-3 py-2 font-heading-regular tracking-wider uppercase"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Metrics Visualization - Only show if we have data */}
        {caseStudies.length > 0 && (
          <MetricsVisualization caseStudies={caseStudies} />
        )}

        {/* CTA Section */}
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
                onClick={() => navigate('/contact')}
                className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                iconName="Calendar"
                iconPosition="left"
              >
                <span className="font-heading-regular tracking-wider uppercase">Book Strategy Session</span>
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => navigate('/capabilities')}
                className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                iconName="Zap"
                iconPosition="left"
              >
                <span className="font-heading-regular tracking-wider uppercase">Explore Our Services</span>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Animation Styles */}
      <style>{`
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