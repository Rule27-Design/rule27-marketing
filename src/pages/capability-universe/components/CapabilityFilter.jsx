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
    // On mobile, collapse after selection
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
          className="border-accent/30 text-accent hover:bg-accent hover:text-white justify-between"
          iconName={isExpanded ? "X" : "Filter"}
          iconPosition="right"
        >
          Filter & Search
        </Button>
      </div>

      {/* Filter Content - Collapsible on mobile */}
      <AnimatePresence>
        {(isExpanded || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:overflow-visible"
          >
            <div className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Search */}
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
                />
                <input
                  type="text"
                  placeholder="Search capabilities..."
                  value={debouncedSearchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-muted border border-border rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent 
                           transition-all duration-300 text-sm md:text-base"
                  aria-label="Search capabilities"
                />
                {debouncedSearchTerm && (
                  <button
                    onClick={() => setDebouncedSearchTerm('')}
                    className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-text-secondary 
                             hover:text-primary transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-xs md:text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Service Categories
                </h4>
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <motion.button
                      key={category?.id}
                      onClick={() => handleCategoryClick(category?.id)}
                      className={`w-full flex items-center justify-between p-2.5 md:p-3 rounded-xl 
                               transition-all duration-300 text-sm md:text-base ${
                        activeCategory === category?.id
                          ? 'bg-accent text-white shadow-lg'
                          : 'bg-transparent hover:bg-muted text-text-primary'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <Icon name={category?.icon} size={16} className="md:hidden" />
                        <Icon name={category?.icon} size={18} className="hidden md:block" />
                        <span className="font-medium truncate">{category?.name}</span>
                      </div>
                      <span className={`text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0 ${
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

              {/* Quick Actions - Hidden on mobile for space */}
              <div className="hidden md:block pt-4 border-t border-border space-y-3">
                <h4 className="text-xs md:text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="Calculator"
                    iconPosition="left"
                    className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white text-xs md:text-sm"
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
                    className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white text-xs md:text-sm"
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
                    className="justify-start border-accent/30 text-accent hover:bg-accent hover:text-white text-xs md:text-sm"
                    onClick={() => onQuickAction && onQuickAction('book-consultation')}
                  >
                    Book Consultation
                  </Button>
                </div>
              </div>

              {/* Mobile Quick Actions - Simplified */}
              <div className="md:hidden pt-3 border-t border-border">
                <Button
                  variant="default"
                  fullWidth
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-white"
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => onQuickAction && onQuickAction('book-consultation')}
                >
                  Book Consultation
                </Button>
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