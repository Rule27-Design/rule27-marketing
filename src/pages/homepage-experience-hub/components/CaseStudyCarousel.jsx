import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CaseStudyCarousel = ({ caseStudies = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  // Handle empty state
  if (!caseStudies || caseStudies.length === 0) {
    // Return static fallback content
    return <CaseStudyCarouselStatic />;
  }

  useEffect(() => {
    if (isAutoPlaying && caseStudies.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, caseStudies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Navigate to case study detail page (future implementation)
  const handleViewCaseStudy = (caseStudy) => {
    // For now, navigate to work page
    // In future: navigate(`/work/${caseStudy.slug}`);
    navigate('/work');
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading-regular text-primary mb-6 uppercase tracking-wider">
            Transformation Stories That
            <span className="text-accent block mt-2 font-heading-regular uppercase">Speak for Themselves</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-sans">
            Real results from real partnerships. See how we've helped ambitious brands 
            break through their limitations and achieve extraordinary outcomes.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl brand-shadow-lg">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {caseStudies.map((study, index) => (
                <div key={study.id || index} className="w-full flex-shrink-0">
                  <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
                    {/* Image Section */}
                    <div className="relative overflow-hidden group">
                      <Image
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Video Preview Overlay */}
                      {study.videoPreview && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <Icon name="Play" size={32} className="text-white ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Industry Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-heading-regular uppercase tracking-wider">
                          {study.industry}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <span className="text-accent font-heading-regular text-sm uppercase tracking-wider">
                          {study.category}
                        </span>
                        <h3 className="text-4xl font-heading-regular text-primary mt-2 mb-4 uppercase tracking-wide">
                          {study.title}
                        </h3>
                        <p className="text-text-secondary text-lg leading-relaxed font-sans">
                          {study.description}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-sm text-text-secondary mb-1 font-sans">Before</div>
                          <div className="font-heading-regular text-primary uppercase">{study.beforeMetric}</div>
                        </div>
                        <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                          <div className="text-sm text-accent mb-1 font-sans">After</div>
                          <div className="font-heading-regular text-accent uppercase">{study.afterMetric}</div>
                        </div>
                      </div>

                      {/* Improvement Badge */}
                      <div className="text-center mb-8">
                        <span className="bg-success text-white px-6 py-3 rounded-full font-heading-regular text-xl uppercase tracking-wider">
                          {study.improvement}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {study.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-sans"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center text-text-secondary mb-8 font-sans">
                        <Icon name="Clock" size={16} className="mr-2" />
                        <span className="text-sm">Completed in {study.timeline}</span>
                      </div>

                      {/* CTA */}
                      <Button
                        variant="outline"
                        className="border-accent text-accent hover:bg-accent hover:text-white w-full font-heading-regular uppercase tracking-wider"
                        iconName="ArrowRight"
                        iconPosition="right"
                        onClick={() => handleViewCaseStudy(study)}
                      >
                        View Full Case Study
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {caseStudies.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full brand-shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous case study"
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full brand-shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next case study"
              >
                <Icon name="ChevronRight" size={24} />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {caseStudies.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {caseStudies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-accent scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to case study ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link to="/work">
            <Button
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 font-heading-regular uppercase tracking-wider"
              iconName="Eye"
              iconPosition="left"
            >
              Explore All Success Stories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Static fallback component when no data
const CaseStudyCarouselStatic = () => {
  // Return the original static content as fallback
  const staticCaseStudies = [
    {
      id: 1,
      title: "TechFlow Solutions",
      category: "SaaS Platform Transformation",
      description: "Complete brand overhaul and platform redesign that transformed a struggling startup into an industry leader.",
      beforeMetric: "2.3% Conversion Rate",
      afterMetric: "18.7% Conversion Rate",
      improvement: "+712% Growth",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      videoPreview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80",
      tags: ["Brand Identity", "UX/UI Design", "Development"],
      timeline: "8 weeks",
      industry: "Technology"
    }
  ];

  return <CaseStudyCarousel caseStudies={staticCaseStudies} />;
};

export default CaseStudyCarousel;