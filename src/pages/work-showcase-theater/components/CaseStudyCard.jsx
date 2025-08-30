import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseStudyCard = ({ caseStudy, onViewDetails }) => {
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
    <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2">
      {/* Hero Image - Mobile Optimized */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <Image
          src={caseStudy?.heroImage}
          alt={`${caseStudy?.title} case study`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Industry Badge - Mobile Size */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary rounded-full">
            {caseStudy?.industry}
          </span>
        </div>

        {/* Service Type Badge - Mobile Size */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-accent/90 backdrop-blur-sm text-xs font-semibold text-white rounded-full">
            {caseStudy?.serviceType}
          </span>
        </div>
        
        {/* Featured Star Badge - Properly Positioned */}
        {caseStudy?.featured && (
          <div className="absolute bottom-3 right-3 z-10">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <Icon name="Star" size={18} className="text-white fill-white" />
            </div>
          </div>
        )}

        {/* Play Button Overlay - Touch Friendly */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon name="Play" size={20} color="white" className="sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
      
      {/* Content - Mobile Optimized */}
      <div className="p-4 sm:p-5 md:p-6">
        {/* Client Info - Mobile Responsive */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold text-primary">
              {caseStudy?.client?.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-primary text-sm sm:text-base truncate">{caseStudy?.client}</h3>
            <p className="text-xs sm:text-sm text-text-secondary truncate">{caseStudy?.businessStage}</p>
          </div>
        </div>

        {/* Title & Description - Mobile Text Sizes */}
        <h4 className="text-lg sm:text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {caseStudy?.title}
        </h4>
        <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {caseStudy?.description}
        </p>

        {/* Key Metrics - Mobile Optimized Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {caseStudy?.keyMetrics?.slice(0, 3)?.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-base sm:text-lg font-bold text-accent">
                {formatMetric(metric?.value, metric?.type)}
              </div>
              <div className="text-[10px] sm:text-xs text-text-secondary">
                {metric?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline - Mobile Responsive */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} className="sm:w-4 sm:h-4" />
            <span>{caseStudy?.timeline}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} className="sm:w-4 sm:h-4" />
            <span>{caseStudy?.duration}</span>
          </div>
        </div>

        {/* CTA Button - Mobile Optimized */}
        <Button
          variant="outline"
          fullWidth
          onClick={() => onViewDetails(caseStudy)}
          className="border-accent text-accent hover:bg-accent hover:text-white text-sm sm:text-base py-2.5 sm:py-3"
          iconName="ArrowRight"
          iconPosition="right"
        >
          View Full Story
        </Button>
      </div>
    </div>
  );
};

export default CaseStudyCard;