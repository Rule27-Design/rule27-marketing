import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import AppIcon from '../../../components/AppIcon';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-primary">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo with Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 flex justify-center"
        >
          <div className="relative group">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-all duration-500 transform group-hover:scale-110 shadow-brand-elevation-lg">
              <span className="text-black font-bold text-3xl group-hover:text-white transition-colors duration-300">27</span>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-accent to-white rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-lg"></div>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="block mb-2">The Rebels Behind</span>
            <span className="block text-accent">Rule27</span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Born from <span className="text-accent font-semibold">rebellious innovation</span> and crafted with 
            <span className="text-white font-semibold"> Apple-level execution</span>. Meet the minds, methodology, 
            and culture that make conventional boundaries disappear.
          </p>
        </motion.div>

        {/* Interactive Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {[
            { number: '27+', label: 'Visionary Minds' },
            { number: '150+', label: 'Projects Transformed' },
            { number: '8+', label: 'Years Disrupting' },
            { number: '∞', label: 'Conventional Rules Broken' }
          ]?.map((stat, index) => (
            <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2 group-hover:text-white transition-colors duration-300">
                {stat?.number}
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {stat?.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Button
            variant="default"
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-brand-elevation"
            onClick={() => document.getElementById('origin-story')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <AppIcon name="ChevronDown" size={20} className="mr-2" />
            Discover Our Story
          </Button>
        </motion.div>
      </div>
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;