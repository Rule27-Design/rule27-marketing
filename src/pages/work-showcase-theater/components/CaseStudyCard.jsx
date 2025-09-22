import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseStudyCard = React.memo(({ caseStudy }) => {
  const navigate = useNavigate();
  
  const formatMetric = useMemo(() => (value, type) => {
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

  const handleViewDetails = () => {
    navigate(`/case-studies/${caseStudy.slug}`);
  };

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2">
      {/* Hero Image with Lazy Loading - Make clickable */}
      <div 
        className="relative h-48 sm:h-56 md:h-64 overflow-hidden cursor-pointer"
        onClick={handleViewDetails}
      >
        <Image
          src={caseStudy?.heroImage}
          alt={`${caseStudy?.title} case study`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Industry Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm text-xs font-heading-regular tracking-wider uppercase text-primary rounded-full">
            {caseStudy?.industry}
          </span>
        </div>

        {/* Service Type Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-accent/90 backdrop-blur-sm text-xs font-heading-regular tracking-wider uppercase text-white rounded-full">
            {caseStudy?.serviceType}
          </span>
        </div>
        
        {/* Featured Star Badge */}
        {caseStudy?.featured && (
          <div className="absolute bottom-3 right-3 z-10">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <Icon name="Star" size={18} className="text-white fill-white" />
            </div>
          </div>
        )}

        {/* View Case Study Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
            <span className="text-sm font-heading-regular text-primary tracking-wider uppercase">View Case Study</span>
            <Icon name="ArrowRight" size={16} className="text-primary" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        {/* Client Info */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm font-heading-regular text-primary uppercase">
              {caseStudy?.client?.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-heading-regular text-primary text-sm sm:text-base truncate tracking-wider uppercase">{caseStudy?.client}</h3>
            <p className="text-xs sm:text-sm text-text-secondary truncate font-sans">{caseStudy?.businessStage}</p>
          </div>
        </div>

        {/* Title - Make clickable */}
        <h4 
          className="text-lg sm:text-xl font-heading-regular text-primary mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2 tracking-wider uppercase cursor-pointer"
          onClick={handleViewDetails}
        >
          {caseStudy?.title}
        </h4>
        
        {/* Description */}
        <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 font-sans">
          {caseStudy?.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {caseStudy?.keyMetrics?.slice(0, 3)?.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-base sm:text-lg font-heading-regular text-accent uppercase tracking-wider">
                {formatMetric(metric?.value, metric?.type)}
              </div>
              <div className="text-[10px] sm:text-xs text-text-secondary font-sans">
                {metric?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} className="sm:w-4 sm:h-4" />
            <span className="font-sans">{caseStudy?.timeline}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} className="sm:w-4 sm:h-4" />
            <span className="font-sans">{caseStudy?.duration}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleViewDetails}
          className="border-accent text-accent hover:bg-accent hover:text-white text-sm sm:text-base py-2.5 sm:py-3"
          iconName="ArrowRight"
          iconPosition="right"
        >
          <span className="font-heading-regular tracking-wider uppercase">View Full Story</span>
        </Button>
      </div>
    </div>
  );
});

CaseStudyCard.displayName = 'CaseStudyCard';

export default CaseStudyCard;