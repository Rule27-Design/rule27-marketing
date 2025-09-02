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

  const dynamicWords = React.useMemo(() => 
    ['Obsessive Perfection', 'Relentless Excellence', 'Meticulous Craft', 'Flawless Execution', 'Uncompromising Quality'], 
  []);

  // Animated particles background component
  const ParticlesBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  // Typewriter effect
  useEffect(() => {
    const word = dynamicWords[currentWordIndex];
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

        {/* Animated Particles */}
        <ParticlesBackground />
      </div>

      {/* Animated Orbiting Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[600px] opacity-20 lg:opacity-30 hidden lg:block">
        <div className="relative w-full h-full">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + (i * 5),
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div 
                className="absolute w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translateX(${100 + i * 30}px)`
                }}
              />
            </motion.div>
          ))}
          {/* Center orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Floating Elements with Enhanced Animations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="floating-element floating-interactive absolute top-20 left-10 w-4 h-4 bg-accent rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="floating-element floating-interactive absolute top-40 right-20 w-3 h-3 bg-white/30 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div 
          className="floating-element floating-interactive absolute bottom-32 left-1/3 w-2 h-2 bg-accent/60 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Enhanced Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          className="mb-8 sm:mb-12 flex justify-center"
        >
          <div className="relative group">
            <motion.div 
              className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-all duration-500 transform group-hover:scale-110 shadow-brand-elevation-lg relative z-10"
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 40px rgba(229, 62, 62, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-primary font-heading-bold text-2xl sm:text-3xl group-hover:text-white transition-colors duration-300 uppercase">27</span>
            </motion.div>
            <motion.div 
              className="absolute -inset-4 bg-gradient-to-r from-accent to-white rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-lg"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Main Headline with Enhanced Animations */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading-regular text-white mb-6 sm:mb-8 uppercase tracking-wider">
            <motion.span 
              className="block mb-2"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              The Rebels Behind
            </motion.span>
            <motion.span 
              className="block text-accent mb-2"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Rule27 Design
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheading with Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 font-sans">
            Born from <span className="text-accent font-semibold">rebellious innovation</span> and crafted with{' '}
            <span className="relative inline-block min-w-[200px] md:min-w-[320px] text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white bg-300% animate-gradient font-semibold">
                {currentText}
              </span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-white transition-opacity duration-100`}>
                |
              </span>
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
            <br />
            Meet the minds, methodology, and culture that make conventional boundaries disappear.
          </p>
        </motion.div>

        {/* Interactive Stats with Enhanced Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12"
        >
          {[
            { number: '27+', label: 'Visionary Minds', delay: 0.8 },
            { number: '150+', label: 'Projects Transformed', delay: 0.9 },
            { number: '11+', label: 'Years Disrupting', delay: 1.0 },
            { number: '∞', label: 'Conventional Rules Broken', delay: 1.1 }
          ]?.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              whileHover={{ 
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <motion.div 
                className="text-2xl sm:text-3xl md:text-4xl font-heading-regular text-accent mb-1 sm:mb-2 group-hover:text-white transition-colors duration-300 uppercase tracking-wider"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  delay: stat.delay + 0.1
                }}
              >
                {stat?.number}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-sans">
                {stat?.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons with Enhanced Hover Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-heading-regular uppercase tracking-wider transform transition-all duration-300 shadow-2xl hover:shadow-accent/50 min-h-[48px] relative overflow-hidden group"
              onClick={() => document.getElementById('origin-story')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10 flex items-center">
                <AppIcon name="ChevronDown" size={20} className="mr-2" />
                Discover Our Story
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-accent"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white hover:text-primary backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-heading-regular uppercase tracking-wider transform transition-all duration-300 min-h-[48px] relative overflow-hidden group"
              onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10 flex items-center">
                <AppIcon name="Users" size={20} className="mr-2" />
                Meet the Rebels
              </span>
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ scale: 0, borderRadius: "100%" }}
                whileHover={{ scale: 2, borderRadius: "0%" }}
                transition={{ duration: 0.5 }}
                style={{ originX: 0.5, originY: 0.5 }}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-12"
        >
          <div className="flex flex-col items-center text-gray-400 group cursor-pointer">
            <motion.span 
              className="text-sm mb-2 tracking-wide group-hover:text-accent transition-colors duration-300 font-sans"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Discover More
            </motion.span>
            <div className="relative">
              <motion.div 
                className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AppIcon name="ChevronDown" size={24} className="text-accent" />
              </motion.div>
            </div>
          </div>
        </motion.div>
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