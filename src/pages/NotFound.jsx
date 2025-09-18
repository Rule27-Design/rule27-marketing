import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import Logo from 'components/ui/Logo';

const NotFound = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mouse move effect for glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // Animated background particles
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Mouse Follower Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 62, 62, 0.15), transparent 40%)`,
        }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-accent/20 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-accent/10 to-transparent blur-3xl"></div>
            <motion.div 
              className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Floating Particles */}
        <FloatingParticles />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={isVisible ? { scale: 1, opacity: 1, rotate: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative group">
            <Logo 
              variant="icon"
              colorScheme="white"
              linkTo="/"
              className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
            <motion.div 
              className="absolute -inset-4 bg-gradient-to-r from-accent to-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
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

        {/* 404 Display with Glitch Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8"
        >
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-heading-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-red-400 to-accent bg-300% animate-gradient uppercase tracking-wider relative">
            404
            <motion.span
              className="absolute inset-0 text-white/10"
              animate={{
                x: [-2, 2, -2],
                y: [2, -2, 2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              404
            </motion.span>
          </h1>
          <motion.div 
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-32 bg-gradient-to-r from-transparent via-accent to-transparent"
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
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-regular text-white mb-4 uppercase tracking-wider">
            You've Broken
            <span className="text-accent block mt-2">The 27th Rule</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
            This page doesn't exist in our universe. But that's okay—
            <span className="text-accent font-semibold"> breaking rules is what we do best.</span> Let's get you back to somewhere extraordinary.
          </p>
        </motion.div>

        {/* Stats for Fun */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-12 max-w-md mx-auto"
        >
          <div className="text-center group cursor-pointer">
            <motion.div 
              className="text-3xl font-heading-regular text-accent mb-1 uppercase"
              whileHover={{ scale: 1.1 }}
            >
              404
            </motion.div>
            <div className="text-xs text-gray-400 font-sans">Pages Lost</div>
          </div>
          <div className="text-center group cursor-pointer">
            <motion.div 
              className="text-3xl font-heading-regular text-accent mb-1 uppercase"
              whileHover={{ scale: 1.1 }}
            >
              ∞
            </motion.div>
            <div className="text-xs text-gray-400 font-sans">Possibilities</div>
          </div>
          <div className="text-center group cursor-pointer">
            <motion.div 
              className="text-3xl font-heading-regular text-accent mb-1 uppercase"
              whileHover={{ scale: 1.1 }}
            >
              1
            </motion.div>
            <div className="text-xs text-gray-400 font-sans">Way Forward</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-heading-regular uppercase tracking-wider transform transition-all duration-300 shadow-2xl hover:shadow-accent/50 min-h-[48px] relative overflow-hidden group"
              iconName="Home"
              iconPosition="left"
              onClick={handleGoHome}
            >
              <span className="relative z-10">Return to Homepage</span>
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
              className="border-2 border-white/50 text-white hover:bg-white hover:text-primary backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-heading-regular uppercase tracking-wider transform transition-all duration-300 min-h-[48px] relative overflow-hidden group"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={handleGoBack}
            >
              <span className="relative z-10">Go Back</span>
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

        {/* Alternative Navigation Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <p className="text-gray-400 text-sm mb-4 font-sans">Or explore our universe:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Capabilities', path: '/capabilities', icon: 'Zap' },
              { name: 'Case Studies', path: '/case-studies', icon: 'Eye' },
              { name: 'About', path: '/about', icon: 'Users' },
              { name: 'Contact', path: '/contact', icon: 'MessageCircle' }
            ].map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Link
                  to={link.path}
                  className="flex items-center space-x-2 text-gray-400 hover:text-accent transition-colors duration-300 group"
                >
                  <Icon 
                    name={link.icon} 
                    size={16} 
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="font-heading-regular uppercase tracking-wider text-sm">
                    {link.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
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
    </div>
  );
};

export default NotFound;