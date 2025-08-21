import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceZoneCard = ({ zone, isActive, onActivate, onExplore }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent shadow-2xl' 
          : 'bg-card hover:bg-muted/50 border border-border hover:border-accent/30'
      }`}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onActivate}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-xl transition-colors duration-300 ${
            isActive ? 'bg-accent text-white' : 'bg-muted text-primary'
          }`}>
            <Icon name={zone?.icon} size={32} />
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-300 ${
            isActive 
              ? 'bg-accent/20 text-accent' :'bg-muted text-text-secondary'
          }`}>
            {zone?.serviceCount} Services
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className={`text-2xl font-bold transition-colors duration-300 ${
            isActive ? 'text-accent' : 'text-primary'
          }`}>
            {zone?.title}
          </h3>
          
          <p className="text-text-secondary leading-relaxed">
            {zone?.description}
          </p>

          {/* Key Services */}
          <div className="flex flex-wrap gap-2">
            {zone?.keyServices?.slice(0, 3)?.map((service, index) => (
              <span
                key={index}
                className={`text-xs px-3 py-1 rounded-full transition-colors duration-300 ${
                  isActive 
                    ? 'bg-accent/10 text-accent border border-accent/20' :'bg-muted text-text-secondary'
                }`}
              >
                {service}
              </span>
            ))}
            {zone?.keyServices?.length > 3 && (
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-text-secondary">
                +{zone?.keyServices?.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                isActive ? 'text-accent' : 'text-primary'
              }`}>
                {zone?.stats?.projects}+
              </div>
              <div className="text-xs text-text-secondary">Projects</div>
            </div>
            <div>
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                isActive ? 'text-accent' : 'text-primary'
              }`}>
                {zone?.stats?.satisfaction}%
              </div>
              <div className="text-xs text-text-secondary">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            variant={isActive ? "default" : "outline"}
            fullWidth
            onClick={(e) => {
              e?.stopPropagation();
              onExplore(zone);
            }}
            className={isActive ? "bg-accent hover:bg-accent/90" : "border-accent text-accent hover:bg-accent hover:text-white"}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Explore {zone?.title}
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
};

export default ServiceZoneCard;