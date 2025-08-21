import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Icon name="Download" size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Resource Hub</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-black mb-6">
            Strategic <span className="text-accent">Resources</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Downloadable templates, frameworks, and tools that provide immediate value while demonstrating our expertise and approach.
          </motion.p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Search */}
            <motion.div variants={itemVariants} className="flex-1 max-w-md">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {filters?.map((filter) => (
                <button
                  key={filter?.id}
                  onClick={() => setActiveFilter(filter?.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeFilter === filter?.id
                      ? 'bg-accent text-white' :'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter?.label} ({filter?.count})
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Resources */}
        {activeFilter === 'all' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.h3 variants={itemVariants} className="text-2xl font-bold text-black mb-8 flex items-center">
              <Icon name="Star" size={24} className="text-accent mr-2" />
              Featured Resources
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredResources?.map((resource) => (
                <motion.div
                  key={resource?.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                      <Icon name="FileText" size={32} className="text-accent" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-black mb-2 line-clamp-2">{resource?.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource?.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-accent">{resource?.price}</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={14} className="text-yellow-500" />
                        <span className="text-sm text-gray-600">{resource?.rating}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-accent hover:bg-accent/90 text-white"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Resources */}
        <motion.div
          key={activeFilter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredResources?.map((resource) => (
            <motion.div
              key={resource?.id}
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Resource Preview */}
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <Icon name="FileText" size={48} className="text-gray-400" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {resource?.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Icon name="Heart" size={16} className="text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Resource Content */}
              <div className="p-6">
                {/* Title & Description */}
                <h4 className="text-xl font-bold text-black mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                  {resource?.title}
                </h4>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource?.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource?.tags?.slice(0, 2)?.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="Download" size={12} />
                      <span>{resource?.downloads}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="File" size={12} />
                      <span>{resource?.size}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-yellow-500" />
                    <span>{resource?.rating}</span>
                  </div>
                </div>

                {/* Price & Download */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">{resource?.price}</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-white"
                    iconName="Download"
                    iconPosition="left"
                  >
                    {resource?.price === 'Free' ? 'Download' : 'Purchase'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-white px-8"
            iconName="Plus"
            iconPosition="left"
          >
            Load More Resources
          </Button>
        </motion.div>

        {/* Resource Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 mt-16 text-center"
        >
          <Icon name="MessageSquare" size={48} className="text-accent mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-black mb-4">
            Need a Custom Resource?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team can create custom templates, frameworks, and tools tailored to your specific needs.
          </p>
          <Button
            variant="default"
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white px-8"
            iconName="MessageCircle"
            iconPosition="left"
          >
            Request Custom Resource
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ResourceHub;