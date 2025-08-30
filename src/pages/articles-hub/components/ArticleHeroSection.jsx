import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleHeroSection = ({ featuredArticles, onViewArticle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || featuredArticles?.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredArticles?.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredArticles?.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === featuredArticles?.length - 1 ? 0 : prev + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredArticles?.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!featuredArticles?.length) return null;

  const currentArticle = featuredArticles?.[currentSlide];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-black pt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentArticle?.featuredImage}
          alt={`${currentArticle?.title} hero`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 md:via-black/40 md:to-transparent"></div>
      </div>
      
      {/* Navigation Arrows - Mobile Optimized */}
      {featuredArticles?.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 w-10 h-10 md:w-12 md:h-12"
          >
            <Icon name="ChevronLeft" size={24} className="md:w-8 md:h-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 w-10 h-10 md:w-12 md:h-12"
          >
            <Icon name="ChevronRight" size={24} className="md:w-8 md:h-8" />
          </Button>
        </>
      )}
      
      {/* Content - Mobile Optimized */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Category & Meta - Mobile Responsive */}
            <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
              <span className="px-3 py-1.5 md:px-4 md:py-2 bg-accent/80 backdrop-blur-sm text-white text-xs md:text-sm font-semibold rounded-full">
                {currentArticle?.category}
              </span>
              <div className="flex items-center space-x-4 text-white/80 text-xs md:text-sm">
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={14} />
                  {currentArticle?.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={14} />
                  {currentArticle?.views?.toLocaleString()} views
                </span>
              </div>
            </div>

            {/* Title - Mobile Responsive */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              {currentArticle?.title}
            </h1>

            {/* Excerpt - Mobile Responsive */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {currentArticle?.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-6 md:mb-8">
              <img
                src={currentArticle?.author?.avatar}
                alt={currentArticle?.author?.name}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20"
              />
              <div>
                <p className="text-white font-semibold text-sm md:text-base">
                  {currentArticle?.author?.name}
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  {currentArticle?.author?.role} • {formatDate(currentArticle?.publishedDate)}
                </p>
              </div>
            </div>

            {/* CTA Buttons - Mobile Responsive Stack */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                variant="default"
                size="default"
                onClick={() => onViewArticle(currentArticle)}
                className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4"
                iconName="BookOpen"
                iconPosition="left"
              >
                Read Full Article
              </Button>
              <Button
                variant="outline"
                size="default"
                className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4"
                iconName="Bookmark"
                iconPosition="left"
              >
                Save for Later
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators - Mobile Optimized */}
      {featuredArticles?.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {featuredArticles?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-accent scale-125' :'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ArticleHeroSection;