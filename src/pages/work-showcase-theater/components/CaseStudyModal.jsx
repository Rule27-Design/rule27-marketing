import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseStudyModal = ({ caseStudy, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !caseStudy) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'process', label: 'Process', icon: 'GitBranch' },
    { id: 'results', label: 'Results', icon: 'TrendingUp' },
    { id: 'testimonial', label: 'Testimonial', icon: 'MessageSquare' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === caseStudy?.gallery?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? caseStudy?.gallery?.length - 1 : prev - 1
    );
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-white rounded-2xl overflow-hidden brand-shadow-lg">
        {/* Header */}
        <div className="relative h-80 overflow-hidden">
          <Image
            src={caseStudy?.gallery?.[currentImageIndex]}
            alt={`${caseStudy?.title} gallery image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <Icon name="X" size={24} />
          </Button>

          {/* Gallery Navigation */}
          {caseStudy?.gallery?.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <Icon name="ChevronLeft" size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <Icon name="ChevronRight" size={24} />
              </Button>
            </>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold text-white rounded-full">
                {caseStudy?.industry}
              </span>
              <span className="px-3 py-1 bg-accent/80 backdrop-blur-sm text-xs font-semibold text-white rounded-full">
                {caseStudy?.serviceType}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{caseStudy?.title}</h2>
            <p className="text-white/90">{caseStudy?.client} • {caseStudy?.businessStage}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <div className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors duration-300 ${
                  activeTab === tab?.id
                    ? 'border-accent text-accent' :'border-transparent text-text-secondary hover:text-primary'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Challenge</h3>
                <p className="text-text-secondary leading-relaxed">{caseStudy?.challenge}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Solution</h3>
                <p className="text-text-secondary leading-relaxed">{caseStudy?.solution}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {caseStudy?.keyMetrics?.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-accent mb-1">
                      {formatMetric(metric?.value, metric?.type)}
                    </div>
                    <div className="text-sm text-text-secondary">{metric?.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary mb-4">Our Methodology</h3>
              <div className="space-y-4">
                {caseStudy?.processSteps?.map((step, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">{step?.title}</h4>
                      <p className="text-text-secondary text-sm">{step?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary mb-4">Measurable Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudy?.detailedResults?.map((result, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary">{result?.metric}</span>
                      <span className="text-2xl font-bold text-accent">
                        {formatMetric(result?.value, result?.type)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{result?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonial' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={caseStudy?.testimonial?.avatar}
                    alt={caseStudy?.testimonial?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <blockquote className="text-lg text-primary italic mb-4">
                  "{caseStudy?.testimonial?.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-primary">{caseStudy?.testimonial?.name}</div>
                  <div className="text-sm text-text-secondary">{caseStudy?.testimonial?.position}</div>
                  <div className="text-sm text-text-secondary">{caseStudy?.client}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Project completed in {caseStudy?.timeline} • {caseStudy?.duration}
            </div>
            <Button
              variant="default"
              onClick={onClose}
              className="bg-accent hover:bg-accent/90 text-white"
              iconName="ExternalLink"
              iconPosition="right"
            >
              Start Similar Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyModal;