import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import AppIcon from '../../../components/AppIcon';

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseDuration = 2000;

  // Dynamic words for typewriter effect
  const dynamicWords = React.useMemo(() => 
    ['Obsessive Perfection', 'Relentless Excellence', 'Meticulous Craft', 'Flawless Execution', 'Uncompromising Quality'], 
  []);

  // Typewriter effect
  useEffect(() => {
    const word = dynamicWords[currentWordIndex];
    let timeout;

    if (!isDeleting) {
      // Typing
      if (currentText !== word) {
        timeout = setTimeout(() => {
          setCurrentText(prev => word.slice(0, prev.length + 1));
        }, typeSpeed);
      } else {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (currentText !== '') {
        timeout = setTimeout(() => {
          setCurrentText(prev => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, dynamicWords]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroElement = document.querySelector('.hero-background');
      const floatingElements = document.querySelectorAll('.floating-element');
      
      if (heroElement) {
        heroElement.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
      
      floatingElements.forEach((el, index) => {
        const speed = 0.2 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const heroSection = e.currentTarget;
      const rect = heroSection.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      setMousePosition({ x: relativeX, y: relativeY });
      
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      const floatingElements = document.querySelectorAll('.floating-interactive');
      floatingElements.forEach((el, index) => {
        const speed = 20 + (index * 10);
        el.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
      });
    };

    const heroElement = document.querySelector('.hero-section');
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('mouseleave', () => {
        setMousePosition({ x: -1000, y: -1000 });
      });
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Mouse Follower Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 62, 62, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Animated Background with Gradient Mesh */}
      <div className="hero-background absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-primary">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-accent/20 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-accent/10 to-transparent blur-3xl"></div>
            <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
        </div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>

      {/* Floating Elements with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-element floating-interactive absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
        <div className="floating-element floating-interactive absolute top-40 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-700"></div>
        <div className="floating-element floating-interactive absolute bottom-32 left-1/3 w-2 h-2 bg-accent/60 rounded-full animate-pulse delay-1000"></div>
        <div className="floating-element absolute top-1/2 right-1/4 w-6 h-6 bg-gradient-to-br from-accent to-transparent rounded-full blur-xl animate-bounce delay-500"></div>
        <div className="floating-element absolute bottom-20 right-10 w-5 h-5 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg animate-bounce delay-300"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo with Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 sm:mb-12 flex justify-center"
        >
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-all duration-500 transform group-hover:scale-110 shadow-brand-elevation-lg">
              <span className="text-black font-bold text-2xl sm:text-3xl group-hover:text-white transition-colors duration-300">27</span>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-accent to-white rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-lg"></div>
          </div>
        </motion.div>

        {/* Main Headline with Typewriter Effect */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            <span className="block mb-2">The Rebels Behind</span>
            <span className="block text-accent mb-2">Rule27</span>
          </h1>
        </div>

        {/* Subheading with Typewriter Effect */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Born from <span className="text-accent font-semibold">rebellious innovation</span> and crafted with{' '}
            <span className="relative inline-block min-w-[200px] md:min-w-[320px] text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white bg-300% animate-gradient font-semibold">
                {currentText}
              </span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-white transition-opacity duration-100`}>
                |
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform origin-left animate-pulse"></div>
            </span>
            <br />
            Meet the minds, methodology, and culture that make conventional boundaries disappear.
          </p>
        </div>

        {/* Interactive Stats - Mobile Optimized Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12"
        >
          {[
            { number: '27+', label: 'Visionary Minds' },
            { number: '150+', label: 'Projects Transformed' },
            { number: '11+', label: 'Years Disrupting' },
            { number: '∞', label: 'Conventional Rules Broken' }
          ]?.map((stat, index) => (
            <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 sm:mb-2 group-hover:text-white transition-colors duration-300">
                {stat?.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {stat?.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Button - Touch Friendly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50 min-h-[48px]"
            onClick={() => document.getElementById('origin-story')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <AppIcon name="ChevronDown" size={20} className="mr-2" />
            Discover Our Story
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white hover:text-black backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transform hover:scale-105 transition-all duration-300 min-h-[48px]"
            onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <AppIcon name="Users" size={20} className="mr-2" />
            Meet the Rebels
          </Button>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mt-12`}>
          <div className="flex flex-col items-center text-gray-400 group cursor-pointer">
            <span className="text-sm mb-2 tracking-wide group-hover:text-accent transition-colors duration-300">
              Discover More
            </span>
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="animate-bounce">
                <AppIcon name="ChevronDown" size={24} className="text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        
        .bg-300\% {
          background-size: 300% 300%;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </section>
  );
};

export default HeroSection;