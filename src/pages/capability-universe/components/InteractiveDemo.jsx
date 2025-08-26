import React, { useState, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveDemo = memo(({ activeZone }) => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Memoize demo content
  const demoContent = useMemo(() => ({
    'creative-studio': {
      title: 'Brand Identity Generator',
      description: 'Experience our creative process in real-time',
      demos: [
        {
          title: 'Logo Concepts',
          content: 'Interactive logo variations with real-time customization',
          preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
        },
        {
          title: 'Color Palettes',
          content: 'Dynamic color scheme generation based on brand personality',
          preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop'
        },
        {
          title: 'Typography Systems',
          content: 'Comprehensive font pairing and hierarchy visualization',
          preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop'
        }
      ]
    },
    'marketing-command': {
      title: 'Performance Dashboard',
      description: 'Live metrics from real client campaigns',
      demos: [
        {
          title: 'ROI Calculator',
          content: 'Calculate potential returns on marketing investment',
          preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
        },
        {
          title: 'Campaign Analytics',
          content: 'Real-time performance tracking across all channels',
          preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
        },
        {
          title: 'Audience Insights',
          content: 'Deep demographic and behavioral analysis tools',
          preview: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop'
        }
      ]
    },
    'development-lab': {
      title: 'Code Playground',
      description: 'Interactive demonstrations of our technical capabilities',
      demos: [
        {
          title: 'React Components',
          content: 'Live component library with customizable properties',
          preview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'
        },
        {
          title: 'API Integration',
          content: 'Real-time data fetching and processing examples',
          preview: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
        },
        {
          title: 'Performance Metrics',
          content: 'Live performance monitoring and optimization tools',
          preview: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
        }
      ]
    },
    'executive-advisory': {
      title: 'Strategy Simulator',
      description: 'Interactive business strategy planning tools',
      demos: [
        {
          title: 'Growth Modeling',
          content: 'Predictive growth scenarios based on strategic decisions',
          preview: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'
        },
        {
          title: 'Market Analysis',
          content: 'Competitive landscape and opportunity assessment',
          preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
        },
        {
          title: 'Resource Planning',
          content: 'Optimal resource allocation and timeline planning',
          preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
        }
      ]
    }
  }), []);

  const currentDemo = useMemo(() => 
    demoContent[activeZone] || demoContent['creative-studio'],
    [activeZone, demoContent]
  );

  const handleDemoChange = useCallback((index) => {
    setActiveDemo(index);
    setIsPlaying(false);
  }, []);

  const handlePlayClick = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-primary">{currentDemo?.title}</h3>
            <p className="text-sm md:text-base text-text-secondary">{currentDemo?.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 md:w-3 h-2 md:h-3 bg-accent rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm text-accent font-medium">Live Demo</span>
          </div>
        </div>
      </div>

      {/* Demo Tabs - Scrollable on mobile */}
      <div className="flex border-b border-border bg-muted/30 overflow-x-auto scrollbar-hide">
        {currentDemo?.demos?.map((demo, index) => (
          <button
            key={index}
            onClick={() => handleDemoChange(index)}
            className={`flex-1 min-w-[120px] px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium 
                     transition-all duration-300 whitespace-nowrap ${
              activeDemo === index
                ? 'text-accent border-b-2 border-accent bg-background' 
                : 'text-text-secondary hover:text-primary hover:bg-muted/50'
            }`}
          >
            {demo?.title}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="p-4 md:p-6">
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 md:space-y-6"
        >
          {/* Demo Preview */}
          <div className="relative bg-muted rounded-xl overflow-hidden">
            <img
              src={currentDemo?.demos?.[activeDemo]?.preview}
              alt={currentDemo?.demos?.[activeDemo]?.title}
              className="w-full h-48 md:h-64 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-4 md:p-6 text-white">
                <h4 className="font-bold text-base md:text-lg">{currentDemo?.demos?.[activeDemo]?.title}</h4>
                <p className="text-white/80 text-xs md:text-sm mt-1">
                  {currentDemo?.demos?.[activeDemo]?.content}
                </p>
              </div>
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayClick}
                className="w-12 h-12 md:w-16 md:h-16 bg-accent text-white rounded-full 
                         flex items-center justify-center shadow-2xl transition-all duration-300"
                aria-label="Play demo"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={20} className="md:hidden" />
                <Icon name={isPlaying ? "Pause" : "Play"} size={24} className="hidden md:block" />
              </motion.button>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <h5 className="font-semibold text-primary text-sm md:text-base">Try It Yourself</h5>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between p-2.5 md:p-3 bg-muted rounded-lg">
                  <span className="text-xs md:text-sm text-text-secondary">Complexity Level</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5]?.map((level) => (
                      <div
                        key={level}
                        className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-colors duration-300 ${
                          level <= 3 ? 'bg-accent' : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 md:p-3 bg-muted rounded-lg">
                  <span className="text-xs md:text-sm text-text-secondary">Customization</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 md:w-12 h-5 md:h-6 bg-accent rounded-full relative">
                      <div className="w-4 md:w-5 h-4 md:h-5 bg-white rounded-full absolute 
                                    top-0.5 right-0.5 transition-transform duration-300"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 md:p-3 bg-muted rounded-lg">
                  <span className="text-xs md:text-sm text-text-secondary">Real-time Updates</span>
                  <Icon name="Check" size={14} className="text-accent md:hidden" />
                  <Icon name="Check" size={16} className="text-accent hidden md:block" />
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h5 className="font-semibold text-primary text-sm md:text-base">Features</h5>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Icon name="Zap" size={14} className="text-accent flex-shrink-0 md:hidden" />
                  <Icon name="Zap" size={16} className="text-accent flex-shrink-0 hidden md:block" />
                  <span className="text-xs md:text-sm text-text-secondary">Instant preview</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Download" size={14} className="text-accent flex-shrink-0 md:hidden" />
                  <Icon name="Download" size={16} className="text-accent flex-shrink-0 hidden md:block" />
                  <span className="text-xs md:text-sm text-text-secondary">Export results</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Share" size={14} className="text-accent flex-shrink-0 md:hidden" />
                  <Icon name="Share" size={16} className="text-accent flex-shrink-0 hidden md:block" />
                  <span className="text-xs md:text-sm text-text-secondary">Share with team</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="History" size={14} className="text-accent flex-shrink-0 md:hidden" />
                  <Icon name="History" size={16} className="text-accent flex-shrink-0 hidden md:block" />
                  <span className="text-xs md:text-sm text-text-secondary">Version history</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              className="bg-accent hover:bg-accent/90 text-sm md:text-base"
              iconName="Play"
              iconPosition="left"
              fullWidth
            >
              <span className="hidden sm:inline">Launch Full Demo</span>
              <span className="sm:hidden">Full Demo</span>
            </Button>
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white text-sm md:text-base"
              iconName="Calendar"
              iconPosition="left"
              fullWidth
            >
              <span className="hidden sm:inline">Schedule Demo Call</span>
              <span className="sm:hidden">Schedule Call</span>
            </Button>
            <Button
              variant="ghost"
              className="text-accent hover:bg-accent/10 text-sm md:text-base hidden sm:flex"
              iconName="ExternalLink"
              iconPosition="right"
            >
              Case Study
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

InteractiveDemo.displayName = 'InteractiveDemo';

export default InteractiveDemo;

// Add this CSS to your global styles or tailwind config
// .scrollbar-hide {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }