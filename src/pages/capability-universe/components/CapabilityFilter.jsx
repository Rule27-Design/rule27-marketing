import React, { memo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CapabilityFilter = memo(({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange,
  onQuickAction 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(debouncedSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, onSearchChange]);

  const handleSearchChange = useCallback((e) => {
    setDebouncedSearchTerm(e?.target?.value || '');
  }, []);

  const handleCategoryClick = useCallback((categoryId) => {
    onCategoryChange(categoryId);
    if (window.innerWidth < 1024) {
      setIsExpanded(false);
    }
  }, [onCategoryChange]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          fullWidth
          onClick={toggleExpanded}
          className="border-accent/30 text-accent hover:bg-accent hover:text-white justify-between font-heading-regular uppercase tracking-wider"
          iconName={isExpanded ? "X" : "Filter"}
          iconPosition="right"
        >
          Filter & Search
        </Button>
      </div>

      {/* Filter Content */}
      <AnimatePresence>
        {(isExpanded || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:overflow-visible"
          >
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              {/* Search */}
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
                />
                <input
                  type="text"
                  placeholder="Search capabilities..."
                  value={debouncedSearchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent 
                           transition-all duration-300 font-body"
                  aria-label="Search capabilities"
                />
                {debouncedSearchTerm && (
                  <button
                    onClick={() => setDebouncedSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary 
                             hover:text-primary transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-sm font-heading-regular text-text-secondary uppercase tracking-wider">
                  Service Categories
                </h4>
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <motion.button
                      key={category?.id}
                      onClick={() => handleCategoryClick(category?.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl 
                               transition-all duration-300 ${
                        activeCategory === category?.id
                          ? 'bg-accent text-white shadow-lg'
                          : 'bg-transparent hover:bg-muted text-text-primary'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name={category?.icon} size={18} />
                        <span className="font-body">{category?.name}</span>
                      </div>
                      <span className={`text-xs font-heading-regular px-2 py-1 rounded-full uppercase tracking-wider ${
                        activeCategory === category?.id
                          ? 'bg-white/20 text-white' 
                          : 'bg-muted text-text-secondary'
                      }`}>
                        {category?.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-sm font-heading-regular text-text-secondary uppercase tracking-wider">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="Calculator"
                    iconPosition="left"
                    className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white font-body"
                    onClick={() => onQuickAction && onQuickAction('roi-calculator')}
                  >
                    ROI Calculator
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="FileText"
                    iconPosition="left"
                    className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white font-body"
                    onClick={() => onQuickAction && onQuickAction('capability-assessment')}
                  >
                    Capability Assessment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="Calendar"
                    iconPosition="left"
                    className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white font-body"
                    onClick={() => onQuickAction && onQuickAction('book-consultation')}
                  >
                    Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

CapabilityFilter.displayName = 'CapabilityFilter';

export default CapabilityFilter;