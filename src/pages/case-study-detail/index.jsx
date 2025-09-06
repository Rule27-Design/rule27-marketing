import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';
import { useCaseStudy } from '../../hooks/useCaseStudies';
import { supabase } from '../../lib/supabase';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { caseStudy, loading, error } = useCaseStudy(slug);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedCaseStudies, setRelatedCaseStudies] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (caseStudy) {
      fetchRelatedCaseStudies();
      trackView();
    }
  }, [caseStudy]);

  const fetchRelatedCaseStudies = async () => {
    if (!caseStudy) return;
    
    const { data } = await supabase
      .from('case_studies')
      .select('id, title, slug, client_name, hero_image, industry, service_type, key_metrics')
      .eq('status', 'published')
      .or(`industry.eq.${caseStudy.industry},service_type.eq.${caseStudy.service_type}`)
      .neq('id', caseStudy.id)
      .limit(3);
    
    if (data) {
      setRelatedCaseStudies(data);
    }
  };

  const trackView = async () => {
    if (!caseStudy?.id) return;
    
    // Update view count
    await supabase
      .from('case_studies')
      .update({ 
        view_count: supabase.raw('view_count + 1'),
        unique_view_count: supabase.raw('unique_view_count + 1')
      })
      .eq('id', caseStudy.id);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'process', label: 'Process', icon: 'GitBranch' },
    { id: 'results', label: 'Results', icon: 'TrendingUp' },
    { id: 'testimonial', label: 'Testimonial', icon: 'MessageSquare' }
  ];

  const nextImage = () => {
    const gallery = caseStudy?.gallery || [];
    setCurrentImageIndex((prev) => 
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    const gallery = caseStudy?.gallery || [];
    setCurrentImageIndex((prev) => 
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };

  const formatMetric = (value, type) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `$${value?.toLocaleString()}`;
      case 'multiplier':
        return `${value}x`;
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary font-sans">Loading case study...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertCircle" size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-heading-regular text-primary mb-2 tracking-wider uppercase">Case Study Not Found</h2>
            <p className="text-text-secondary mb-4 font-sans">{error || 'The case study you are looking for does not exist.'}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/work')}
              className="border-accent text-accent hover:bg-accent hover:text-white"
            >
              <span className="font-heading-regular tracking-wider uppercase">Back to Work</span>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery = caseStudy?.gallery?.map(item => 
    typeof item === 'string' ? item : item.url
  ) || [caseStudy?.hero_image];

  return (
    <>
      <Helmet>
        <title>{caseStudy.title} | Rule27 Design Case Study</title>
        <meta name="description" content={caseStudy.description} />
        <meta name="keywords" content={`${caseStudy.industry}, ${caseStudy.service_type}, case study, ${caseStudy.client_name}`} />
        <meta property="og:title" content={`${caseStudy.title} | Rule27 Design`} />
        <meta property="og:description" content={caseStudy.description} />
        <meta property="og:image" content={caseStudy.hero_image} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`/case-study/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] overflow-hidden pt-16">
          <div className="absolute inset-0">
            <Image
              src={gallery[currentImageIndex]}
              alt={`${caseStudy.title} image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          </div>

          {/* Gallery Navigation */}
          {gallery.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <Icon name="ChevronLeft" size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <Icon name="ChevronRight" size={24} />
              </Button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-8 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-heading-regular tracking-wider uppercase text-white rounded-full">
                  {caseStudy.industry}
                </span>
                <span className="px-3 py-1 bg-accent/80 backdrop-blur-sm text-xs font-heading-regular tracking-wider uppercase text-white rounded-full">
                  {caseStudy.service_type}
                </span>
                {caseStudy.is_featured && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-heading-regular tracking-wider uppercase text-white rounded-full flex items-center gap-1">
                    <Icon name="Star" size={12} className="fill-white" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading-regular text-white mb-2 tracking-wider uppercase">
                {caseStudy.title}
              </h1>
              <p className="text-white/90 text-lg font-sans">
                <span className="font-heading-regular tracking-wider uppercase">{caseStudy.client_name}</span> • {caseStudy.business_stage}
              </p>
            </div>
          </div>
        </section>

        {/* Key Metrics Bar */}
        <section className="bg-primary text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {caseStudy.key_metrics?.slice(0, 6).map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-heading-regular text-accent mb-1 uppercase tracking-wider">
                    {formatMetric(metric.value, metric.type)}
                  </div>
                  <div className="text-xs text-white/80 font-sans">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-accent' 
                      : 'border-transparent text-text-secondary hover:text-primary'
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span className="font-heading-regular tracking-wider uppercase">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-heading-regular text-primary mb-4 tracking-wider uppercase">The Challenge</h2>
                      <p className="text-text-secondary leading-relaxed font-sans">{caseStudy.challenge}</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading-regular text-primary mb-4 tracking-wider uppercase">Our Solution</h2>
                      <p className="text-text-secondary leading-relaxed font-sans">{caseStudy.solution}</p>
                    </div>
                    {caseStudy.implementation && (
                      <div>
                        <h2 className="text-2xl font-heading-regular text-primary mb-4 tracking-wider uppercase">Implementation</h2>
                        <p className="text-text-secondary leading-relaxed font-sans">{caseStudy.implementation}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'process' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-heading-regular text-primary mb-6 tracking-wider uppercase">Our Methodology</h2>
                    <div className="space-y-6">
                      {caseStudy.process_steps?.map((step, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-heading-regular">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-heading-regular text-primary mb-2 text-lg tracking-wider uppercase">{step.title}</h3>
                            <p className="text-text-secondary font-sans">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'results' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-heading-regular text-primary mb-6 tracking-wider uppercase">Measurable Impact</h2>
                    <div className="grid grid-cols-1 gap-6">
                      {caseStudy.detailed_results?.map((result, index) => (
                        <div key={index} className="p-6 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-heading-regular text-primary text-lg tracking-wider uppercase">{result.metric}</span>
                            <span className="text-3xl font-heading-regular text-accent uppercase tracking-wider">
                              {formatMetric(result.value, result.type)}
                            </span>
                          </div>
                          <p className="text-text-secondary font-sans">{result.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'testimonial' && caseStudy.testimonial && (
                  <div className="space-y-8">
                    <div className="text-center">
                      {caseStudy.testimonial.client_avatar && (
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                          <Image
                            src={caseStudy.testimonial.client_avatar}
                            alt={caseStudy.testimonial.client_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <blockquote className="text-2xl text-primary italic mb-6 font-sans">
                        "{caseStudy.testimonial.quote}"
                      </blockquote>
                      <div>
                        <div className="font-heading-regular text-primary text-lg tracking-wider uppercase">
                          {caseStudy.testimonial.client_name}
                        </div>
                        <div className="text-text-secondary font-sans">
                          {caseStudy.testimonial.client_title}
                        </div>
                        <div className="text-text-secondary font-heading-regular tracking-wider uppercase">
                          {caseStudy.client_name}
                        </div>
                      </div>
                      {caseStudy.testimonial.rating && (
                        <div className="flex justify-center mt-4">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={24}
                              className={i < caseStudy.testimonial.rating ? 'text-accent fill-accent' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-8">
                  {/* Project Details */}
                  <div className="bg-muted rounded-xl p-6">
                    <h3 className="text-lg font-heading-regular text-primary mb-4 tracking-wider uppercase">Project Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary font-sans">Timeline</span>
                        <span className="font-heading-regular text-primary uppercase">{caseStudy.project_duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary font-sans">Industry</span>
                        <span className="font-heading-regular text-primary uppercase">{caseStudy.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary font-sans">Service</span>
                        <span className="font-heading-regular text-primary uppercase">{caseStudy.service_type}</span>
                      </div>
                      {caseStudy.technologies_used?.length > 0 && (
                        <div>
                          <span className="text-text-secondary font-sans">Technologies</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {caseStudy.technologies_used.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-white text-xs rounded font-sans">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-accent text-white rounded-xl p-6">
                    <h3 className="text-lg font-heading-regular mb-3 tracking-wider uppercase">Start Your Project</h3>
                    <p className="text-white/90 mb-4 text-sm font-sans">
                      Ready to achieve similar results for your business?
                    </p>
                    <Button
                      variant="default"
                      fullWidth
                      onClick={() => navigate('/contact')}
                      className="bg-white text-accent hover:bg-white/90"
                      iconName="ArrowRight"
                      iconPosition="right"
                    >
                      <span className="font-heading-regular tracking-wider uppercase">Get Started</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        {relatedCaseStudies.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-heading-regular text-primary mb-8 tracking-wider uppercase">Related Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedCaseStudies.map((study) => (
                  <div
                    key={study.id}
                    className="bg-white rounded-xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/case-study/${study.slug}`)}
                  >
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={study.hero_image}
                        alt={study.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-heading-regular text-accent uppercase tracking-wider">
                          {study.industry}
                        </span>
                        <span className="text-xs text-text-secondary">•</span>
                        <span className="text-xs text-text-secondary font-sans">
                          {study.service_type}
                        </span>
                      </div>
                      <h3 className="font-heading-regular text-primary text-lg mb-1 tracking-wider uppercase line-clamp-2">
                        {study.title}
                      </h3>
                      <p className="text-sm text-text-secondary font-heading-regular tracking-wider uppercase">
                        {study.client_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default CaseStudyDetail;