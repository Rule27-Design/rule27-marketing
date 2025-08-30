import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseStudyListItem = ({ caseStudy, onViewDetails }) => {
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
    <div className="group relative bg-white rounded-xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-500">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="relative lg:w-80 h-48 lg:h-64 overflow-hidden flex-shrink-0">
          <Image
            src={caseStudy?.heroImage}
            alt={`${caseStudy?.title} case study`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Icon name="Play" size={20} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 lg:p-8">
          <div className="flex flex-col h-full">
            {/* Header with badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {caseStudy?.featured && (
                <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <Icon name="Star" size={12} className="fill-white" />
                  Featured
                </span>
              )}
              <span className="px-3 py-1 bg-muted text-xs font-semibold text-primary rounded-full">
                {caseStudy?.industry}
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                {caseStudy?.serviceType}
              </span>
              <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {caseStudy?.businessStage}
              </span>
            </div>

            {/* Title and Client */}
            <div className="mb-3">
              <h3 className="text-lg lg:text-2xl font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-300">
                {caseStudy?.title}
              </h3>
              <p className="text-sm text-text-secondary font-medium">
                {caseStudy?.client} • {caseStudy?.businessStage}
              </p>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm lg:text-base mb-4 line-clamp-2 lg:line-clamp-3">
              {caseStudy?.description}
            </p>

            {/* Metrics and Timeline */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              {/* Key Metrics */}
              <div className="flex items-center gap-3 lg:gap-4">
                {caseStudy?.keyMetrics?.slice(0, 3)?.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-base lg:text-xl font-bold text-accent">
                      {formatMetric(metric?.value, metric?.type)}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {metric?.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>{caseStudy?.timeline}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{caseStudy?.duration}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <Button
                variant="outline"
                onClick={() => onViewDetails(caseStudy)}
                className="border-accent text-accent hover:bg-accent hover:text-white text-sm lg:text-base"
                iconName="ArrowRight"
                iconPosition="right"
              >
                View Full Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyListItem;