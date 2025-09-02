import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseStudyModal = React.memo(({ caseStudy, isOpen, onClose }) => {
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

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'process', label: 'Process', icon: 'GitBranch' },
    { id: 'results', label: 'Results', icon: 'TrendingUp' },
    { id: 'testimonial', label: 'Testimonial', icon: 'MessageSquare' }
  ], []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === caseStudy?.gallery?.length - 1 ? 0 : prev + 1
    );
  }, [caseStudy?.gallery?.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? caseStudy?.gallery?.length - 1 : prev - 1
    );
  }, [caseStudy?.gallery?.length]);

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

  if (!isOpen || !caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content - Mobile Optimized */}
      <div className="relative w-full sm:max-w-6xl h-[90vh] sm:max-h-[90vh] sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden brand-shadow-lg animate-slide-up sm:animate-none">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>
        
        {/* Header - Mobile Optimized */}
        <div className="relative h-60 sm:h-80 overflow-hidden">
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
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:bg-white/20 w-10 h-10"
          >
            <Icon name="X" size={20} className="sm:w-6 sm:h-6" />
          </Button>

          {/* Gallery Navigation */}
          {caseStudy?.gallery?.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-10 h-10"
              >
                <Icon name="ChevronLeft" size={20} className="sm:w-6 sm:h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-10 h-10"
              >
                <Icon name="ChevronRight" size={20} className="sm:w-6 sm:h-6" />
              </Button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {caseStudy?.gallery?.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Title Overlay - Proper Typography */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm text-xs font-heading-regular tracking-wider uppercase text-white rounded-full">
                {caseStudy?.industry}
              </span>
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-accent/80 backdrop-blur-sm text-xs font-heading-regular tracking-wider uppercase text-white rounded-full">
                {caseStudy?.serviceType}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-heading-regular text-white mb-1 sm:mb-2 line-clamp-2 tracking-wider uppercase">{caseStudy?.title}</h2>
            <p className="text-white/90 text-sm sm:text-base font-sans">
              <span className="font-heading-regular tracking-wider uppercase">{caseStudy?.client}</span> • {caseStudy?.businessStage}
            </p>
          </div>
        </div>

        {/* Tab Navigation - Steelfish for Labels */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex px-4 sm:px-6 min-w-max">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-3 sm:py-4 border-b-2 transition-colors duration-300 text-sm sm:text-base ${
                  activeTab === tab?.id
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-text-secondary hover:text-primary'
                }`}
              >
                <Icon name={tab?.icon} size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="font-heading-regular tracking-wider uppercase whitespace-nowrap">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content - Typography Optimized */}
        <div className="p-4 sm:p-6 h-[calc(100%-21rem)] sm:max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-2 sm:mb-3 tracking-wider uppercase">Challenge</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">{caseStudy?.challenge}</p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-2 sm:mb-3 tracking-wider uppercase">Solution</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">{caseStudy?.solution}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {caseStudy?.keyMetrics?.map((metric, index) => (
                  <div key={index} className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                    <div className="text-lg sm:text-2xl font-heading-regular text-accent mb-1 uppercase tracking-wider">
                      {formatMetric(metric?.value, metric?.type)}
                    </div>
                    <div className="text-xs sm:text-sm text-text-secondary font-sans">{metric?.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-3 sm:mb-4 tracking-wider uppercase">Our Methodology</h3>
              <div className="space-y-3 sm:space-y-4">
                {caseStudy?.processSteps?.map((step, index) => (
                  <div key={index} className="flex space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-accent rounded-full flex items-center justify-center text-white font-heading-regular text-xs sm:text-sm uppercase">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-heading-regular text-primary mb-1 text-sm sm:text-base tracking-wider uppercase">{step?.title}</h4>
                      <p className="text-text-secondary text-xs sm:text-sm font-sans">{step?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-3 sm:mb-4 tracking-wider uppercase">Measurable Impact</h3>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {caseStudy?.detailedResults?.map((result, index) => (
                  <div key={index} className="p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading-regular text-primary text-sm sm:text-base tracking-wider uppercase">{result?.metric}</span>
                      <span className="text-xl sm:text-2xl font-heading-regular text-accent uppercase tracking-wider">
                        {formatMetric(result?.value, result?.type)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary font-sans">{result?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonial' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                  <Image
                    src={caseStudy?.testimonial?.avatar}
                    alt={caseStudy?.testimonial?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <blockquote className="text-base sm:text-lg text-primary italic mb-3 sm:mb-4 font-sans">
                  "{caseStudy?.testimonial?.quote}"
                </blockquote>
                <div>
                  <div className="font-heading-regular text-primary text-sm sm:text-base tracking-wider uppercase">{caseStudy?.testimonial?.name}</div>
                  <div className="text-xs sm:text-sm text-text-secondary font-sans">{caseStudy?.testimonial?.position}</div>
                  <div className="text-xs sm:text-sm text-text-secondary font-heading-regular tracking-wider uppercase">{caseStudy?.client}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Typography Optimized */}
        <div className="border-t border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-text-secondary font-sans">
              Project completed in {caseStudy?.timeline} • {caseStudy?.duration}
            </div>
            <Button
              variant="default"
              onClick={onClose}
              className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto text-sm sm:text-base"
              iconName="ExternalLink"
              iconPosition="right"
            >
              <span className="font-heading-regular tracking-wider uppercase">Start Similar Project</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
});

CaseStudyModal.displayName = 'CaseStudyModal';

export default CaseStudyModal;