import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const dynamicWords = ['Transformation', 'Revolution', 'Disruption', 'Innovation'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % dynamicWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] bg-gradient-to-br from-black via-gray-900 to-primary overflow-hidden">
      {/* Animated Background - Simplified for mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-accent/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
        <div className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 sm:opacity-100"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Status Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-accent font-medium text-sm sm:text-base">Available for New Projects</span>
            <Icon name="Zap" size={16} className="text-accent" />
          </motion.div>

          {/* Main Headline - Mobile Optimized */}
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6">
            <span className="block mb-1 sm:mb-2">Start Your</span>
            <span className="block text-accent text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {dynamicWords[currentWord]}
            </span>
            <span className="block mt-1 sm:mt-2">Today</span>
          </motion.h1>

          {/* Subheadline - Mobile Optimized */}
          <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            No cookie-cutter solutions. No boring meetings. Just honest conversations about 
            <span className="text-accent font-semibold"> breaking boundaries</span> and creating 
            <span className="text-white font-semibold"> extraordinary results</span>.
          </motion.p>

          {/* Quick Stats - Mobile Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mb-1 sm:mb-2">24hr</div>
              <div className="text-gray-400 text-xs sm:text-sm">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mb-1 sm:mb-2">98%</div>
              <div className="text-gray-400 text-xs sm:text-sm">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mb-1 sm:mb-2">150+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Projects</div>
            </div>
          </motion.div>

          {/* CTA Buttons - Mobile Stack */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              iconName="Calendar"
              iconPosition="left"
              onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Free Strategy Call
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => document.getElementById('contact-options')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quick Question?
            </Button>
          </motion.div>

          {/* Trust Badge - Mobile Optimized */}
          <motion.div variants={itemVariants} className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Icon name="Shield" size={14} className="sm:w-4 sm:h-4" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Icon name="Clock" size={14} className="sm:w-4 sm:h-4" />
              <span>No Obligation</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Icon name="Users" size={14} className="sm:w-4 sm:h-4" />
              <span>Expert Team</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <Icon name="ChevronDown" size={20} className="text-accent sm:w-6 sm:h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;