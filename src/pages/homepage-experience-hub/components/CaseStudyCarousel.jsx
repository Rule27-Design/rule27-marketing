import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CaseStudyCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const caseStudies = [
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
    },
    {
      id: 2,
      title: "EcoVibe Marketplace",
      category: "E-commerce Revolution",
      description: "Sustainable marketplace platform that connected eco-conscious consumers with verified green brands.",
      beforeMetric: "$45K Monthly Revenue",
      afterMetric: "$340K Monthly Revenue",
      improvement: "+656% Revenue",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      videoPreview: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      tags: ["E-commerce", "Digital Marketing", "Brand Strategy"],
      timeline: "12 weeks",
      industry: "Retail"
    },
    {
      id: 3,
      title: "FinanceForward",
      category: "Fintech Innovation",
      description: "Revolutionary financial planning app that simplified complex investment strategies for millennials.",
      beforeMetric: "12K App Downloads",
      afterMetric: "180K App Downloads",
      improvement: "+1400% Users",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      videoPreview: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      tags: ["Mobile App", "UX Research", "Product Strategy"],
      timeline: "16 weeks",
      industry: "Finance"
    },
    {
      id: 4,
      title: "HealthHub Connect",
      category: "Healthcare Digital Transformation",
      description: "Comprehensive telemedicine platform that revolutionized patient care delivery and provider workflows.",
      beforeMetric: "23% Patient Satisfaction",
      afterMetric: "94% Patient Satisfaction",
      improvement: "+309% Satisfaction",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      videoPreview: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      tags: ["Healthcare", "Platform Design", "User Experience"],
      timeline: "20 weeks",
      industry: "Healthcare"
    }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % caseStudies?.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, caseStudies?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies?.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies?.length) % caseStudies?.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Transformation Stories That
            <span className="text-accent block mt-2">Speak for Themselves</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
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
              {caseStudies?.map((study, index) => (
                <div key={study?.id} className="w-full flex-shrink-0">
                  <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
                    {/* Image Section */}
                    <div className="relative overflow-hidden group">
                      <Image
                        src={study?.image}
                        alt={study?.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Video Preview Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Icon name="Play" size={32} className="text-white ml-1" />
                        </div>
                      </div>

                      {/* Industry Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {study?.industry}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <span className="text-accent font-semibold text-sm uppercase tracking-wide">
                          {study?.category}
                        </span>
                        <h3 className="text-3xl font-bold text-primary mt-2 mb-4">
                          {study?.title}
                        </h3>
                        <p className="text-text-secondary text-lg leading-relaxed">
                          {study?.description}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-sm text-text-secondary mb-1">Before</div>
                          <div className="font-bold text-primary">{study?.beforeMetric}</div>
                        </div>
                        <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                          <div className="text-sm text-accent mb-1">After</div>
                          <div className="font-bold text-accent">{study?.afterMetric}</div>
                        </div>
                      </div>

                      {/* Improvement Badge */}
                      <div className="text-center mb-8">
                        <span className="bg-success text-white px-6 py-3 rounded-full font-bold text-lg">
                          {study?.improvement}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {study?.tags?.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center text-text-secondary mb-8">
                        <Icon name="Clock" size={16} className="mr-2" />
                        <span className="text-sm">Completed in {study?.timeline}</span>
                      </div>

                      {/* CTA */}
                      <Link to="/work-showcase-theater">
                        <Button
                          variant="outline"
                          className="border-accent text-accent hover:bg-accent hover:text-white w-full"
                          iconName="ArrowRight"
                          iconPosition="right"
                        >
                          View Full Case Study
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full brand-shadow-lg transition-all duration-300 hover:scale-110 z-10"
          >
            <Icon name="ChevronLeft" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full brand-shadow-lg transition-all duration-300 hover:scale-110 z-10"
          >
            <Icon name="ChevronRight" size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {caseStudies?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-accent scale-125' :'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link to="/work-showcase-theater">
            <Button
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4"
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

export default CaseStudyCarousel;