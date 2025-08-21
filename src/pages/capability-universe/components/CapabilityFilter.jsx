import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CapabilityFilter = ({ categories, activeCategory, onCategoryChange, searchTerm, onSearchChange }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      {/* Search */}
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" 
        />
        <input
          type="text"
          placeholder="Search capabilities..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
        />
      </div>
      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
          Service Categories
        </h4>
        <div className="space-y-2">
          {categories?.map((category) => (
            <motion.button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                activeCategory === category?.id
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-transparent hover:bg-muted text-text-primary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <Icon name={category?.icon} size={18} />
                <span className="font-medium">{category?.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeCategory === category?.id
                  ? 'bg-white/20 text-white' :'bg-muted text-text-secondary'
              }`}>
                {category?.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="pt-4 border-t border-border space-y-3">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Calculator"
            iconPosition="left"
            className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white"
          >
            ROI Calculator
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="FileText"
            iconPosition="left"
            className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white"
          >
            Capability Assessment
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Calendar"
            iconPosition="left"
            className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white"
          >
            Book Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CapabilityFilter;