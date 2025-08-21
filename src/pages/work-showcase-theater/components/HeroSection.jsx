import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ featuredCaseStudies, onViewCaseStudy }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || featuredCaseStudies?.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredCaseStudies?.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredCaseStudies?.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === featuredCaseStudies?.length - 1 ? 0 : prev + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredCaseStudies?.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!featuredCaseStudies?.length) return null;

  const currentCase = featuredCaseStudies?.[currentSlide];

  const formatMetric = (value, type) => {
    switch (type) {
      case 'percentage':
        return `+${value}%`;
      case 'currency':
        return `$${value?.toLocaleString()}`;
      case 'multiplier':
        return `${value}x`;
      default:
        return value;
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentCase?.heroImage}
          alt={`${currentCase?.title} hero`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>
      {/* Navigation Arrows */}
      {featuredCaseStudies?.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <Icon name="ChevronLeft" size={32} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <Icon name="ChevronRight" size={32} />
          </Button>
        </>
      )}
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                Featured Case Study
              </span>
              <span className="px-4 py-2 bg-accent/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                {currentCase?.industry}
              </span>
            </div>

            {/* Client */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {currentCase?.client?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">{currentCase?.client}</h2>
                <p className="text-white/80 text-sm">{currentCase?.businessStage}</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {currentCase?.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {currentCase?.description}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {currentCase?.keyMetrics?.slice(0, 3)?.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-1">
                    {formatMetric(metric?.value, metric?.type)}
                  </div>
                  <div className="text-white/80 text-sm">
                    {metric?.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => onViewCaseStudy(currentCase)}
                className="bg-accent hover:bg-accent/90 text-white"
                iconName="Play"
                iconPosition="left"
              >
                Watch Full Story
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/contact-consultation-portal'}
                className="border-white text-white hover:bg-white hover:text-primary"
                iconName="MessageCircle"
                iconPosition="left"
              >
                Start Similar Project
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Slide Indicators */}
      {featuredCaseStudies?.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {featuredCaseStudies?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-accent scale-125' :'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
      {/* Auto-play Indicator */}
      {isAutoPlaying && featuredCaseStudies?.length > 1 && (
        <div className="absolute bottom-20 right-8 flex items-center space-x-2 text-white/60 text-sm z-10">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span>Auto-playing</span>
        </div>
      )}
    </section>
  );
};

export default HeroSection;