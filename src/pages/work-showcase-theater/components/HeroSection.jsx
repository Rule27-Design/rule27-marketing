import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = React.memo(({ featuredCaseStudies, onViewCaseStudy }) => {
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

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => 
      prev === featuredCaseStudies?.length - 1 ? 0 : prev + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [featuredCaseStudies?.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredCaseStudies?.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [featuredCaseStudies?.length]);

  const formatMetric = useCallback((value, type) => {
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
  }, []);

  if (!featuredCaseStudies?.length) return null;

  const currentCase = featuredCaseStudies?.[currentSlide];

  return (
    <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] overflow-hidden bg-black pt-16">
      {/* Background Image with Lazy Loading */}
      <div className="absolute inset-0">
        <Image
          src={currentCase?.heroImage}
          alt={`${currentCase?.title} hero`}
          className="w-full h-full object-cover"
          loading="eager" // Hero image should load immediately
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/60 sm:to-black/40 md:via-black/40 md:to-transparent"></div>
      </div>
      
      {/* Navigation Arrows - Mobile Optimized */}
      {featuredCaseStudies?.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 w-10 h-10 md:w-12 md:h-12"
            aria-label="Previous slide"
          >
            <Icon name="ChevronLeft" size={24} className="md:w-8 md:h-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 w-10 h-10 md:w-12 md:h-12"
            aria-label="Next slide"
          >
            <Icon name="ChevronRight" size={24} className="md:w-8 md:h-8" />
          </Button>
        </>
      )}
      
      {/* Content - Mobile Optimized with Proper Typography */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Badges - Steelfish for Labels */}
            <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
              <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-heading-regular tracking-wider uppercase rounded-full">
                Featured Case Study
              </span>
              <span className="px-3 py-1.5 md:px-4 md:py-2 bg-accent/80 backdrop-blur-sm text-white text-xs md:text-sm font-heading-regular tracking-wider uppercase rounded-full">
                {currentCase?.industry}
              </span>
            </div>

            {/* Client - Mixed Typography */}
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-white font-heading-regular text-lg md:text-xl uppercase">
                  {currentCase?.client?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-white text-lg md:text-xl font-heading-regular tracking-wider uppercase">{currentCase?.client}</h2>
                <p className="text-white/80 text-xs md:text-sm font-sans">{currentCase?.businessStage}</p>
              </div>
            </div>

            {/* Title - Steelfish */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading-regular text-white mb-4 md:mb-6 tracking-wider uppercase">
              {currentCase?.title}
            </h1>

            {/* Description - Helvetica */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none font-sans">
              {currentCase?.description}
            </p>

            {/* Key Metrics - Steelfish for Numbers */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
              {currentCase?.keyMetrics?.slice(0, 3)?.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading-regular text-accent mb-1 uppercase tracking-wider">
                    {formatMetric(metric?.value, metric?.type)}
                  </div>
                  <div className="text-white/80 text-xs md:text-sm font-sans">
                    {metric?.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Steelfish for Impact */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                variant="default"
                size="default"
                onClick={() => onViewCaseStudy(currentCase)}
                className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4"
                iconName="Play"
                iconPosition="left"
              >
                <span className="font-heading-regular tracking-wider uppercase">Watch Full Story</span>
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => window.location.href = '/contact'}
                className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4"
                iconName="MessageCircle"
                iconPosition="left"
              >
                <span className="font-heading-regular tracking-wider uppercase">Start Similar Project</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators - Mobile Optimized */}
      {featuredCaseStudies?.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {featuredCaseStudies?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-accent scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Auto-play Indicator */}
      {isAutoPlaying && featuredCaseStudies?.length > 1 && (
        <div className="hidden sm:flex absolute bottom-16 md:bottom-20 right-4 md:right-8 items-center space-x-2 text-white/60 text-xs md:text-sm z-10">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="font-sans">Auto-playing</span>
        </div>
      )}
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;