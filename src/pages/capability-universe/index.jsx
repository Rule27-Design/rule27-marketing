import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ServiceZoneCard from './components/ServiceZoneCard';
import CapabilityFilter from './components/CapabilityFilter';
import ServiceDetailModal from './components/ServiceDetailModal';
import InteractiveDemo from './components/InteractiveDemo';
import CapabilityAssessment from './components/CapabilityAssessment';
import { useServices, useServiceFilters, getSessionId } from '../../hooks/useServices';

const CapabilityUniverse = () => {
  const navigate = useNavigate();
  const { services, serviceZones, loading, error, trackServiceView } = useServices();
  const { categories: filterCategories } = useServiceFilters();
  
  const [activeZone, setActiveZone] = useState('creative-studio');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const sessionId = getSessionId();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Set initial active zone when data loads
  useEffect(() => {
    if (serviceZones.length > 0 && !serviceZones.find(z => z.id === activeZone)) {
      setActiveZone(serviceZones[0].id);
    }
  }, [serviceZones, activeZone]);

  // Filter services based on category and search
  useEffect(() => {
    let filtered = services;

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
  }, [activeCategory, searchTerm, services]);

  // Memoized callbacks
  const handleZoneActivate = useCallback((zoneId) => {
    setActiveZone(zoneId);
  }, []);

  const handleZoneExplore = useCallback((zone) => {
    setActiveZone(zone.id);
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleServiceSelect = useCallback(async (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    
    // Track service view
    if (service?.id) {
      await trackServiceView(service.id, sessionId);
    }
  }, [trackServiceView, sessionId]);

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

  const handleQuickAction = useCallback((action) => {
    if (action === 'book-consultation' || action === 'roi-calculator') {
      navigate('/contact');
    } else if (action === 'capability-assessment') {
      document.getElementById('assessment-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary font-sans">Loading capabilities...</p>
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
            <h2 className="text-xl font-heading-regular text-primary mb-2 tracking-wider uppercase">Error Loading Services</h2>
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
        <title>Capabilities | Rule27 Design - Full-Stack Digital Services</title>
        <meta 
          name="description" 
          content="From brand strategy to development, discover our comprehensive digital services. Creative studio, marketing command, development lab, and executive advisory." 
        />
        <meta name="keywords" content="digital agency services, creative studio, marketing command, development lab, executive advisory, capability assessment, full-stack services, digital transformation" />
        <meta property="og:title" content="Capabilities | Rule27 Design - Full-Stack Digital Services" />
        <meta property="og:description" content="From brand strategy to development, discover our comprehensive digital services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rule27design.com/capabilities" />
        <link rel="canonical" href="https://www.rule27design.com/capabilities" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-6"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading-regular text-primary uppercase tracking-wider">
                  Capability <span className="text-accent">Universe</span>
                </h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto font-body">
                  Four distinct experience zones showcase Rule27 Design's comprehensive service mastery through immersive, 
                  interactive presentations. Discover the perfect solution for your business transformation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-accent hover:bg-accent/90 font-heading-regular uppercase tracking-wider"
                    iconName="Zap"
                    iconPosition="left"
                    onClick={() => document.getElementById('zones-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Capabilities
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-accent text-accent hover:bg-accent hover:text-white font-heading-regular uppercase tracking-wider"
                    iconName="Calculator"
                    iconPosition="left"
                    onClick={() => document.getElementById('assessment-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Take Assessment
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Service Zones Section */}
          {serviceZones.length > 0 && (
            <section id="zones-section" className="py-16 md:py-20 bg-muted/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading-regular text-primary mb-4 uppercase tracking-wider">
                    Service Experience Zones
                  </h2>
                  <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
                    Each zone represents a core competency area with specialized expertise and proven methodologies
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
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
          )}

          {/* Interactive Demo Section */}
          <section className="py-16 md:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading-regular text-primary mb-4 uppercase tracking-wider">
                  Interactive Demonstrations
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
                  Experience our capabilities through live, interactive demonstrations
                </p>
              </div>

              <InteractiveDemo activeZone={activeZone} />
            </div>
          </section>

          {/* Detailed Services Section */}
          <section id="services-section" className="py-16 md:py-20 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading-regular text-primary mb-4 uppercase tracking-wider">
                  Detailed Service Catalog
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
                  Explore our comprehensive service offerings with detailed information and case studies
                </p>
              </div>

              <div className="grid lg:grid-cols-4 gap-8">
                {/* Filter Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <CapabilityFilter
                      categories={filterCategories}
                      activeCategory={activeCategory}
                      onCategoryChange={handleCategoryChange}
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchChange}
                      onQuickAction={handleQuickAction}
                    />
                  </div>
                </div>

                {/* Services Grid */}
                <div className="lg:col-span-3">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => handleServiceSelect(service)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                            <Icon name={service.icon} size={24} className="text-accent" />
                          </div>
                          <span className="text-xs px-3 py-1 bg-muted text-text-secondary rounded-full font-body">
                            {service.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-heading-regular text-primary mb-2 group-hover:text-accent transition-colors uppercase tracking-wider">
                          {service.title}
                        </h3>
                        <p className="text-text-secondary mb-4 line-clamp-2 font-body">
                          {service.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {service.features?.slice(0, 2).map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-muted text-text-secondary rounded-full font-body"
                              >
                                {feature.length > 20 ? feature.substring(0, 20) + '...' : feature}
                              </span>
                            ))}
                          </div>
                          <Icon name="ArrowRight" size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-heading-regular text-primary mb-2 uppercase tracking-wider">No services found</h3>
                      <p className="text-text-secondary font-body">
                        {services.length === 0 
                          ? 'No services available yet' 
                          : 'Try adjusting your search or filter criteria'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Capability Assessment Section */}
          <section id="assessment-section" className="py-16 md:py-20 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading-regular text-primary mb-4 uppercase tracking-wider">
                  Capability Assessment
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
                  Get personalized service recommendations based on your business needs and goals
                </p>
              </div>

              <CapabilityAssessment />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-20 bg-gradient-to-r from-accent to-accent text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading-regular mb-4 uppercase tracking-wider">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 opacity-90 font-body">
                Let's discuss how our capabilities can drive your success
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  iconName="Calendar"
                  iconPosition="left"
                  className="bg-white text-primary hover:bg-white/90 font-heading-regular uppercase tracking-wider"
                  onClick={() => navigate('/contact')}
                >
                  Schedule Strategy Call
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="border-white text-white hover:bg-white hover:text-primary font-heading-regular uppercase tracking-wider"
                  onClick={() => navigate('/contact')}
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