import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const sectionRef = useRef(null);
  
  const dynamicWords = ['Transformation', 'Revolution', 'Disruption', 'Innovation', 'Excellence'];
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseDuration = 2000;

  // Animated particles background component
  const ParticlesBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-accent/40 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
          }}
          animate={{
            y: -100,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          style={{
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );

  // Typewriter effect with smoother transitions
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

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Mouse move effect for glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative min-h-[600px] sm:min-h-[700px] md:min-h-[800px] bg-gradient-to-br from-black via-gray-900 to-primary overflow-hidden">
      {/* Mouse Follower Glow - Enhanced */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-30 opacity-0 sm:opacity-100"
        animate={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 62, 62, 0.1), transparent 40%)`,
        }}
        transition={{ type: "spring", damping: 25 }}
      />
      
      {/* Enhanced Animated Background with Multiple Layers */}
      <div className="absolute inset-0">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-radial from-accent/30 to-transparent blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-radial from-accent/20 to-transparent blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-radial from-accent/10 to-transparent blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Animated Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #4f4f4f 1px, transparent 1px),
              linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '64px 64px'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Animated Particles */}
        <ParticlesBackground />
      </div>

      {/* Animated Orbiting Elements */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-0 lg:opacity-30 hidden lg:block">
        <div className="relative w-full h-full">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 15 + (i * 5),
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div 
                className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-accent rounded-full shadow-lg shadow-accent/50"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translateX(${80 + i * 30}px)`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
          {/* Center orb with glow */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-32 sm:h-32 bg-accent/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Floating Elements with Enhanced Animations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="parallax-element absolute top-20 left-10 w-4 h-4 bg-accent/60 rounded-full blur-sm"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="parallax-element absolute top-40 right-20 w-3 h-3 bg-white/40 rounded-full blur-sm"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        <motion.div 
          className="parallax-element absolute bottom-32 left-1/3 w-2 h-2 bg-accent/50 rounded-full blur-sm"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div 
          className="parallax-element absolute top-1/3 right-1/4 w-5 h-5 bg-accent/30 rounded-full blur-md"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.5 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Enhanced Status Badge */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 group"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(229, 62, 62, 0.15)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="w-2 h-2 bg-accent rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-accent font-medium text-sm sm:text-base">Available for New Projects</span>
            <Icon name="Zap" size={16} className="text-accent group-hover:animate-pulse" />
          </motion.div>

          {/* Enhanced Main Headline with Gradient Animation */}
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6"
          >
            <motion.span 
              className="block mb-2"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Start Your
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-red-400 to-accent bg-300% animate-gradient text-5xl sm:text-6xl md:text-7xl lg:text-8xl relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {currentText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-white transition-opacity duration-100`}>
                |
              </span>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.span>
            <motion.span 
              className="block mt-2"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Today
            </motion.span>
          </motion.h1>

          {/* Enhanced Subheadline */}
          <motion.p 
            variants={itemVariants} 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
          >
            No cookie-cutter solutions. No boring meetings. Just honest conversations about 
            <motion.span 
              className="text-accent font-semibold inline-block mx-1"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              breaking boundaries
            </motion.span> 
            and creating 
            <motion.span 
              className="text-white font-semibold inline-block mx-1"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              extraordinary results
            </motion.span>.
          </motion.p>

          {/* Enhanced Quick Stats with Counter Animations */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-8 sm:mb-12"
          >
            {[
              { value: '24hr', label: 'Response Time', icon: 'Clock' },
              { value: '98%', label: 'Satisfaction', icon: 'Heart' },
              { value: '150+', label: 'Projects', icon: 'Briefcase' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <motion.div 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 sm:mb-2 group-hover:text-white transition-colors duration-300"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(229, 62, 62, 0)",
                        "0 0 20px rgba(229, 62, 62, 0.5)",
                        "0 0 0px rgba(229, 62, 62, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base shadow-2xl hover:shadow-accent/50 relative overflow-hidden group"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10">Book Free Strategy Call</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-accent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base backdrop-blur-sm relative overflow-hidden group"
                iconName="MessageCircle"
                iconPosition="left"
                onClick={() => document.getElementById('contact-options')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10">Quick Question?</span>
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

          {/* Enhanced Trust Badge */}
          <motion.div 
            variants={itemVariants} 
            className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm"
          >
            {[
              { icon: 'Shield', text: '100% Confidential' },
              { icon: 'Clock', text: 'No Obligation' },
              { icon: 'Users', text: 'Expert Team' }
            ].map((badge, index) => (
              <motion.div 
                key={badge.text}
                className="flex items-center space-x-1 sm:space-x-2 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1, color: "#E53E3E" }}
              >
                <Icon name={badge.icon} size={14} className="sm:w-4 sm:h-4 group-hover:text-accent transition-colors duration-300" />
                <span className="group-hover:text-gray-300 transition-colors duration-300">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center group cursor-pointer"
          onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <motion.div 
            className="mb-2 text-xs text-accent opacity-70 group-hover:opacity-100 transition-opacity duration-300"
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
          </motion.div>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="absolute inset-0 bg-accent/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Icon name="ChevronDown" size={20} className="text-accent sm:w-6 sm:h-6 relative z-10" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>

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