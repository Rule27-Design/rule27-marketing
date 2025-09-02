// src/pages/contact-consultation-portal/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  const dynamicWords = ['Transformation', 'Revolution', 'Disruption', 'Innovation', 'Excellence'];
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseDuration = 2000;

  // Typewriter effect
  useEffect(() => {
    const word = dynamicWords[currentWord];
    let timeout;

    if (!isDeleting) {
      if (currentText !== word) {
        timeout = setTimeout(() => {
          setCurrentText(prev => word.slice(0, prev.length + 1));
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (currentText !== '') {
        timeout = setTimeout(() => {
          setCurrentText(prev => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWord((prev) => (prev + 1) % dynamicWords.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWord, dynamicWords]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative min-h-[600px] sm:min-h-[700px] md:min-h-[800px] bg-gradient-to-br from-black via-gray-900 to-primary overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-radial from-accent/20 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-radial from-accent/10 to-transparent blur-3xl"></div>
          </div>
        </div>
        
        {/* Simple Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #4f4f4f 1px, transparent 1px),
              linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Status Badge */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8"
          >
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-accent font-heading-regular text-sm sm:text-base uppercase tracking-wider">
              Available for New Projects
            </span>
            <Icon name="Zap" size={16} className="text-accent" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading-regular text-white mb-4 sm:mb-6 uppercase tracking-wider"
          >
            <span className="block mb-2">Start Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-red-400 to-accent text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {currentText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-white transition-opacity duration-100`}>
                |
              </span>
            </span>
            <span className="block mt-2">Today</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants} 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 font-sans"
          >
            No cookie-cutter solutions. No boring meetings. Just honest conversations about 
            <span className="text-accent font-semibold mx-1">breaking boundaries</span> 
            and creating 
            <span className="text-white font-semibold mx-1">extraordinary results</span>.
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-8 sm:mb-12"
          >
            {[
              { value: '24hr', label: 'Response Time' },
              { value: '98%', label: 'Satisfaction' },
              { value: '150+', label: 'Projects' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-heading-regular text-accent mb-1 sm:mb-2 uppercase tracking-wider">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm font-sans">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base shadow-2xl font-heading-regular uppercase tracking-wider"
              iconName="Calendar"
              iconPosition="left"
              onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Free Strategy Call
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base backdrop-blur-sm font-heading-regular uppercase tracking-wider"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => document.getElementById('contact-options')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quick Question?
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div 
            variants={itemVariants} 
            className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm font-sans"
          >
            {[
              { icon: 'Shield', text: '100% Confidential' },
              { icon: 'Clock', text: 'No Obligation' },
              { icon: 'Users', text: 'Expert Team' }
            ].map((badge) => (
              <div key={badge.text} className="flex items-center space-x-1 sm:space-x-2">
                <Icon name={badge.icon} size={14} className="sm:w-4 sm:h-4" />
                <span>{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div
          className="text-center cursor-pointer group"
          onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="mb-2 text-sm text-white/90 font-heading-regular uppercase tracking-wider group-hover:text-accent transition-colors duration-300">
            Discover More
          </div>
          <div className="animate-bounce flex justify-center">
            <Icon name="ChevronDown" size={24} className="text-white/90 group-hover:text-accent transition-colors duration-300 sm:w-6 sm:h-6" />
          </div>
        </div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </section>
  );
};

export default HeroSection;