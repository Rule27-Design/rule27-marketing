import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceZoneCard = memo(({ zone, isActive, onActivate, onExplore }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Memoize handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  const handleExplore = useCallback((e) => {
    e?.stopPropagation();
    onExplore(zone);
  }, [zone, onExplore]);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent shadow-2xl' 
          : 'bg-card hover:bg-muted/50 border border-border hover:border-accent/30'
      }`}
      whileHover={{ scale: 1.02 }}
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
      onClick={onActivate}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-accent rounded-full -translate-y-12 md:-translate-y-16 translate-x-12 md:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 md:w-24 h-20 md:h-24 bg-primary rounded-full translate-y-10 md:translate-y-12 -translate-x-10 md:-translate-x-12"></div>
      </div>
      
      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div className={`p-3 md:p-4 rounded-xl transition-colors duration-300 ${
            isActive ? 'bg-accent text-white' : 'bg-muted text-primary'
          }`}>
            <Icon name={zone?.icon} size={24} className="md:hidden" />
            <Icon name={zone?.icon} size={32} className="hidden md:block" />
          </div>
          <div className={`text-xs md:text-sm font-medium px-2 md:px-3 py-1 rounded-full transition-colors duration-300 ${
            isActive 
              ? 'bg-accent/20 text-accent' 
              : 'bg-muted text-text-secondary'
          }`}>
            {zone?.serviceCount} Services
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 md:space-y-4">
          <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
            isActive ? 'text-accent' : 'text-primary'
          }`}>
            {zone?.title}
          </h3>
          
          <p className="text-sm md:text-base text-text-secondary leading-relaxed line-clamp-3 md:line-clamp-none">
            {zone?.description}
          </p>

          {/* Key Services */}
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {zone?.keyServices?.slice(0, 3)?.map((service, index) => (
              <span
                key={index}
                className={`text-xs px-2 md:px-3 py-1 rounded-full transition-colors duration-300 ${
                  isActive 
                    ? 'bg-accent/10 text-accent border border-accent/20' 
                    : 'bg-muted text-text-secondary'
                }`}
              >
                {service}
              </span>
            ))}
            {zone?.keyServices?.length > 3 && (
              <span className="text-xs px-2 md:px-3 py-1 rounded-full bg-muted text-text-secondary">
                +{zone?.keyServices?.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 pt-3 md:pt-4 border-t border-border">
            <div>
              <div className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                isActive ? 'text-accent' : 'text-primary'
              }`}>
                {zone?.stats?.projects}+
              </div>
              <div className="text-xs text-text-secondary">Projects</div>
            </div>
            <div>
              <div className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                isActive ? 'text-accent' : 'text-primary'
              }`}>
                {zone?.stats?.satisfaction}%
              </div>
              <div className="text-xs text-text-secondary">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 md:mt-6">
          <Button
            variant={isActive ? "default" : "outline"}
            fullWidth
            onClick={handleExplore}
            className={isActive 
              ? "bg-accent hover:bg-accent/90 text-sm md:text-base" 
              : "border-accent text-accent hover:bg-accent hover:text-white text-sm md:text-base"
            }
            iconName="ArrowRight"
            iconPosition="right"
          >
            <span className="hidden sm:inline">Explore {zone?.title}</span>
            <span className="sm:hidden">Explore</span>
          </Button>
        </div>
      </div>
      
      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 pointer-events-none"
        animate={{ opacity: isHovered && !isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

ServiceZoneCard.displayName = 'ServiceZoneCard';

export default ServiceZoneCard;