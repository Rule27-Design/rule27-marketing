import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const filters = [
    { id: 'all', label: 'All Resources', count: 47 },
    { id: 'templates', label: 'Templates', count: 12 },
    { id: 'frameworks', label: 'Frameworks', count: 8 },
    { id: 'tools', label: 'Tools', count: 15 },
    { id: 'reports', label: 'Reports', count: 12 }
  ];

  const resources = [
    {
      id: 1,
      title: "Brand Strategy Canvas",
      description: "Comprehensive framework for developing winning brand strategies with step-by-step guidance and real-world examples.",
      type: "templates",
      format: "PDF Template",
      size: "2.4 MB",
      downloads: "3.2K",
      rating: 4.9,
      price: "Free",
      tags: ["Brand Strategy", "Canvas", "Framework"],
      preview: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "UX Research Toolkit",
      description: "Complete collection of user research templates, interview guides, and analysis frameworks used by top design teams.",
      type: "tools",
      format: "Figma Kit",
      size: "15.7 MB",
      downloads: "1.8K",
      rating: 4.8,
      price: "$29",
      tags: ["UX Research", "Templates", "Figma"],
      preview: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 3,
      title: "Digital Transformation Playbook",
      description: "Strategic guide for leading digital transformation initiatives with proven methodologies and case studies.",
      type: "frameworks",
      format: "Interactive PDF",
      size: "8.9 MB",
      downloads: "2.7K",
      rating: 4.9,
      price: "$49",
      tags: ["Digital Transformation", "Strategy", "Leadership"],
      preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 4,
      title: "Conversion Rate Optimization Checklist",
      description: "Comprehensive 127-point checklist for optimizing conversion rates across all digital touchpoints.",
      type: "templates",
      format: "Google Sheets",
      size: "1.2 MB",
      downloads: "4.1K",
      rating: 4.7,
      price: "Free",
      tags: ["CRO", "Checklist", "Optimization"],
      preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "2025 Design Trends Report",
      description: "In-depth analysis of emerging design trends with predictions and actionable insights for the year ahead.",
      type: "reports",
      format: "PDF Report",
      size: "12.3 MB",
      downloads: "5.6K",
      rating: 4.8,
      price: "Free",
      tags: ["Trends", "Design", "2025"],
      preview: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 6,
      title: "ROI Calculator Spreadsheet",
      description: "Advanced Excel template for calculating marketing ROI with multiple attribution models and scenario planning.",
      type: "tools",
      format: "Excel Template",
      size: "3.8 MB",
      downloads: "2.9K",
      rating: 4.6,
      price: "$19",
      tags: ["ROI", "Calculator", "Marketing"],
      preview: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 7,
      title: "Design System Starter Kit",
      description: "Complete design system foundation with components, tokens, and documentation templates for Figma and Sketch.",
      type: "templates",
      format: "Design Kit",
      size: "45.2 MB",
      downloads: "1.4K",
      rating: 4.9,
      price: "$79",
      tags: ["Design System", "Components", "UI Kit"],
      preview: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 8,
      title: "Customer Journey Mapping Framework",
      description: "Structured approach to mapping customer journeys with templates, worksheets, and analysis tools.",
      type: "frameworks",
      format: "Workshop Kit",
      size: "7.1 MB",
      downloads: "3.5K",
      rating: 4.8,
      price: "$39",
      tags: ["Customer Journey", "Mapping", "UX"],
      preview: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      featured: false
    }
  ];

  const filteredResources = resources?.filter(resource => {
    const matchesFilter = activeFilter === 'all' || resource?.type === activeFilter;
    const matchesSearch = resource?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         resource?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         resource?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const featuredResources = resources?.filter(resource => resource?.featured);

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center justify-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 mx-auto">
            <Icon name="Download" size={16} className="text-accent" />
            <span className="text-accent font-body font-medium text-xs sm:text-sm">Resource Hub</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold text-black mb-4 sm:mb-6 text-center tracking-wider uppercase">
            Strategic <span className="text-accent">Resources</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 text-center font-body">
            Downloadable templates, frameworks, and tools that provide immediate value while demonstrating our expertise and approach.
          </p>
        </div>

        {/* Search and Filter */}
        <div className={`mb-8 sm:mb-12 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 sm:space-y-6 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-full lg:max-w-md">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10 font-body"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {filters?.map((filter) => (
                <button
                  key={filter?.id}
                  onClick={() => setActiveFilter(filter?.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-body font-medium transition-all duration-300 text-xs sm:text-sm ${
                    activeFilter === filter?.id
                      ? 'bg-accent text-white' :'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter?.label} ({filter?.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Resources - Only show on desktop and when filter is 'all' */}
        {activeFilter === 'all' && (
          <div className={`mb-12 sm:mb-16 hidden lg:block transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h3 className="text-xl sm:text-2xl font-heading-bold text-black mb-6 sm:mb-8 flex items-center justify-center lg:justify-start tracking-wider uppercase">
              <Icon name="Star" size={20} className="text-accent mr-2 sm:hidden" />
              <Icon name="Star" size={24} className="text-accent mr-2 hidden sm:block" />
              Featured Resources
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredResources?.map((resource, index) => (
                <div
                  key={resource?.id}
                  className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: `${index * 100 + 600}ms`
                  }}
                >
                  <div className="relative">
                    <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                      <Icon name="FileText" size={24} className="text-accent sm:hidden" />
                      <Icon name="FileText" size={32} className="text-accent hidden sm:block" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-accent text-white px-2 py-0.5 sm:py-1 rounded text-xs font-body font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <h4 className="font-heading-regular text-black mb-2 line-clamp-2 text-sm sm:text-base tracking-wider uppercase">{resource?.title}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 font-body">{resource?.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base sm:text-lg font-heading-bold text-accent tracking-wider">{resource?.price}</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} className="text-yellow-500 sm:hidden" />
                        <Icon name="Star" size={14} className="text-yellow-500 hidden sm:block" />
                        <span className="text-xs sm:text-sm text-gray-600 font-body">{resource?.rating}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      <span className="font-heading-regular tracking-wider uppercase">Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 transition-all duration-700 delay-600 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {filteredResources?.map((resource, index) => (
            <div
              key={resource?.id}
              className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 100 + 800}ms`
              }}
            >
              {/* Resource Preview */}
              <div className="relative">
                <div className="w-full h-36 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <Icon name="FileText" size={36} className="text-gray-400 sm:hidden" />
                  <Icon name="FileText" size={48} className="text-gray-400 hidden sm:block" />
                </div>
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="bg-black/80 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-body font-medium capitalize">
                    {resource?.type}
                  </span>
                </div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                    <Icon name="Heart" size={14} className="text-gray-600 sm:hidden" />
                    <Icon name="Heart" size={16} className="text-gray-600 hidden sm:block" />
                  </div>
                </div>
              </div>

              {/* Resource Content */}
              <div className="p-4 sm:p-6">
                {/* Title & Description */}
                <h4 className="text-base sm:text-xl font-heading-regular text-black mb-2 sm:mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300 tracking-wider uppercase">
                  {resource?.title}
                </h4>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 font-body">
                  {resource?.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {resource?.tags?.slice(0, 2)?.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 sm:py-1 rounded text-xs font-body">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 sm:mb-4 font-body">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="Download" size={10} className="sm:hidden" />
                      <Icon name="Download" size={12} className="hidden sm:block" />
                      <span className="font-heading-regular tracking-wider">{resource?.downloads}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="File" size={10} className="sm:hidden" />
                      <Icon name="File" size={12} className="hidden sm:block" />
                      <span>{resource?.size}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={10} className="text-yellow-500 sm:hidden" />
                    <Icon name="Star" size={12} className="text-yellow-500 hidden sm:block" />
                    <span className="font-heading-regular tracking-wider">{resource?.rating}</span>
                  </div>
                </div>

                {/* Price & Download */}
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-heading-bold text-accent tracking-wider">{resource?.price}</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm"
                    iconName="Download"
                    iconPosition="left"
                  >
                    <span className="font-heading-regular tracking-wider uppercase">
                      {resource?.price === 'Free' ? 'Download' : 'Purchase'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className={`text-center mt-8 sm:mt-12 transition-all duration-700 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-white px-6 sm:px-8"
            iconName="Plus"
            iconPosition="left"
          >
            <span className="font-heading-regular tracking-wider uppercase">Load More Resources</span>
          </Button>
        </div>

        {/* Resource Request */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 mt-12 sm:mt-16 text-center transition-all duration-700 delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Icon name="MessageSquare" size={36} className="text-accent mx-auto mb-4 sm:hidden" />
          <Icon name="MessageSquare" size={48} className="text-accent mx-auto mb-6 hidden sm:block" />
          <h3 className="text-2xl sm:text-3xl font-heading-bold text-black mb-3 sm:mb-4 tracking-wider uppercase">
            Need a Custom Resource?
          </h3>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base font-body">
            Can't find what you're looking for? Our team can create custom templates, frameworks, and tools tailored to your specific needs.
          </p>
          <Link to="/contact-consultation-portal">
            <Button
              variant="default"
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white px-6 sm:px-8"
              iconName="MessageCircle"
              iconPosition="left"
            >
              <span className="font-heading-regular tracking-wider uppercase">Request Custom Resource</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResourceHub;