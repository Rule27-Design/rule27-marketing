import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Innovation Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-6 py-3 mb-8">
            <Icon name="Zap" size={20} className="text-accent" />
            <span className="text-accent font-medium">Innovation Laboratory</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
            <span className="block">Where</span>
            <span className="block text-accent">Tomorrow</span>
            <span className="block">Begins</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Experimental features, emerging technologies, and forward-thinking insights that shape the future of digital experiences. Welcome to Rule27 Design's innovation playground.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Button
              variant="default"
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg"
              iconName="ArrowRight"
              iconPosition="right"
            >
              Explore Experiments
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg"
              iconName="Play"
              iconPosition="left"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Innovation Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">27+</div>
              <div className="text-gray-400">Active Experiments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">150K+</div>
              <div className="text-gray-400">Data Points Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-gray-400">Prediction Accuracy</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-gray-400 text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon name="ChevronDown" size={24} className="text-accent" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;