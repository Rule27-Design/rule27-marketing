import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseStudyListItem = React.memo(({ caseStudy }) => {
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
    <div className="group relative bg-white rounded-xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-500">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section - Make clickable */}
        <div 
          className="relative lg:w-80 h-48 lg:h-64 overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer"
          onClick={handleViewDetails}
        >
          <Image
            src={caseStudy?.heroImage}
            alt={`${caseStudy?.title} case study`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          
          {/* View Case Study Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
              <span className="text-sm font-heading-regular text-primary tracking-wider uppercase">View Case Study</span>
              <Icon name="ArrowRight" size={16} className="text-primary" />
            </div>
          </div>
          
          {/* Featured Badge on Image */}
          {caseStudy?.featured && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Icon name="Star" size={18} className="text-white fill-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 lg:p-8">
          <div className="flex flex-col h-full">
            {/* Header with badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {caseStudy?.featured && (
                <span className="px-3 py-1 bg-accent text-white text-xs font-heading-regular tracking-wider uppercase rounded-full flex items-center gap-1">
                  <Icon name="Star" size={12} className="fill-white" />
                  Featured
                </span>
              )}
              <span className="px-3 py-1 bg-muted text-xs font-heading-regular tracking-wider uppercase text-primary rounded-full">
                {caseStudy?.industry}
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-heading-regular tracking-wider uppercase rounded-full">
                {caseStudy?.serviceType}
              </span>
              <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-sans">
                {caseStudy?.businessStage}
              </span>
            </div>

            {/* Title and Client - Make title clickable */}
            <div className="mb-3">
              <h3 
                className="text-lg lg:text-2xl font-heading-regular text-primary mb-1 group-hover:text-accent transition-colors duration-300 tracking-wider uppercase cursor-pointer"
                onClick={handleViewDetails}
              >
                {caseStudy?.title}
              </h3>
              <p className="text-sm text-text-secondary font-sans">
                <span className="font-heading-regular tracking-wider uppercase">{caseStudy?.client}</span> • {caseStudy?.businessStage}
              </p>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm lg:text-base mb-4 line-clamp-2 lg:line-clamp-3 font-sans">
              {caseStudy?.description}
            </p>

            {/* Metrics and Timeline */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              {/* Key Metrics */}
              <div className="flex items-center gap-3 lg:gap-4">
                {caseStudy?.keyMetrics?.slice(0, 3)?.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-base lg:text-xl font-heading-regular text-accent uppercase tracking-wider">
                      {formatMetric(metric?.value, metric?.type)}
                    </div>
                    <div className="text-xs text-text-secondary font-sans">
                      {metric?.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span className="font-sans">{caseStudy?.timeline}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span className="font-sans">{caseStudy?.duration}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <Button
                variant="outline"
                onClick={handleViewDetails}
                className="border-accent text-accent hover:bg-accent hover:text-white text-sm lg:text-base"
                iconName="ArrowRight"
                iconPosition="right"
              >
                <span className="font-heading-regular tracking-wider uppercase">View Full Story</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CaseStudyListItem.displayName = 'CaseStudyListItem';

export default CaseStudyListItem;