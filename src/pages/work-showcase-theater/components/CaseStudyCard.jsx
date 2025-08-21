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
    <div className="group relative bg-white rounded-2xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-500 hover:-translate-y-2">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={caseStudy?.heroImage}
          alt={`${caseStudy?.title} case study`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Industry Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary rounded-full">
            {caseStudy?.industry}
          </span>
        </div>

        {/* Service Type Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-accent/90 backdrop-blur-sm text-xs font-semibold text-white rounded-full">
            {caseStudy?.serviceType}
          </span>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon name="Play" size={24} color="white" />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {/* Client Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {caseStudy?.client?.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-primary">{caseStudy?.client}</h3>
            <p className="text-sm text-text-secondary">{caseStudy?.businessStage}</p>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
          {caseStudy?.title}
        </h4>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {caseStudy?.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {caseStudy?.keyMetrics?.slice(0, 3)?.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-accent">
                {formatMetric(metric?.value, metric?.type)}
              </div>
              <div className="text-xs text-text-secondary">
                {metric?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={16} />
            <span>{caseStudy?.timeline}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={16} />
            <span>{caseStudy?.duration}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="outline"
          fullWidth
          onClick={() => onViewDetails(caseStudy)}
          className="border-accent text-accent hover:bg-accent hover:text-white"
          iconName="ArrowRight"
          iconPosition="right"
        >
          View Full Story
        </Button>
      </div>
      {/* Featured Badge */}
      {caseStudy?.featured && (
        <div className="absolute -top-2 -right-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Star" size={16} color="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyCard;