import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactOptions = () => {
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const contactMethods = [
    {
      id: 'email',
      icon: 'Mail',
      title: 'Email Us',
      value: 'hello@rule27design.com',
      description: 'For general inquiries',
      action: 'mailto:hello@rule27design.com',
      color: 'from-blue-500 to-cyan-500',
      responseTime: '< 24 hours',
      available: true
    },
    {
      id: 'phone',
      icon: 'Phone',
      title: 'Call Us',
      value: '+1 (555) RULE-27',
      description: 'Mon-Fri, 9am-6pm PST',
      action: 'tel:+15557853277',
      color: 'from-green-500 to-emerald-500',
      responseTime: 'Immediate',
      available: isBusinessHours
    },
    {
      id: 'chat',
      icon: 'MessageCircle',
      title: 'Live Chat',
      value: 'Start a conversation',
      description: 'Quick questions',
      action: '#',
      color: 'from-purple-500 to-pink-500',
      responseTime: '< 5 minutes',
      available: true
    },
    {
      id: 'location',
      icon: 'MapPin',
      title: 'Visit Us',
      value: 'Scottsdale, AZ',
      description: 'By appointment only',
      action: '#',
      color: 'from-orange-500 to-red-500',
      responseTime: 'Schedule visit',
      available: true
    }
  ];

  const socialLinks = [
    { icon: 'Linkedin', url: 'https://www.linkedin.com/company/rule27design', label: 'LinkedIn', color: 'from-blue-600 to-blue-700' },
    { icon: 'Facebook', url: 'https://www.facebook.com/Rule27Design/', label: 'Facebook', color: 'from-blue-500 to-indigo-600' },
    { icon: 'Instagram', url: 'https://www.instagram.com/rule27design', label: 'Instagram', color: 'from-pink-500 to-purple-600' },
    { icon: 'Github', url: 'https://github.com/rule27', label: 'GitHub', color: 'from-gray-700 to-gray-900' }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST', isOpen: true },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST', isOpen: true },
    { day: 'Sunday', hours: 'Closed', isOpen: false }
  ];

  // Check if currently business hours
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      
      // Simple business hours check (Mon-Fri 9-18, Sat 10-16 PST)
      if (day === 0) {
        setIsBusinessHours(false); // Sunday
      } else if (day === 6) {
        setIsBusinessHours(hour >= 10 && hour < 16); // Saturday
      } else {
        setIsBusinessHours(hour >= 9 && hour < 18); // Weekday
      }
    };

    checkBusinessHours();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkBusinessHours();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating particles for background
  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 sm:w-32 sm:h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(229, 62, 62, 0.1), transparent)`,
            filter: 'blur(40px)',
          }}
          initial={{
            x: Math.random() * 300,
            y: Math.random() * 400,
          }}
          animate={{
            x: [null, Math.random() * 300, null],
            y: [null, Math.random() * 400, null],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      id="contact-options" 
      className="space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Contact Card with Enhanced Animations */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Animated background orbs */}
        <FloatingOrbs />

        {/* Header with animated icon */}
        <motion.div 
          className="flex items-center justify-between mb-3 sm:mb-4 relative z-10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-base sm:text-lg font-bold text-primary flex items-center">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Icon name="Phone" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
            </motion.div>
            Quick Contact
          </h3>
          <motion.span 
            className="text-xs text-accent font-medium"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {isBusinessHours ? 'Available Now' : 'After Hours'}
          </motion.span>
        </motion.div>

        {/* Contact Methods Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 relative z-10">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.id}
              href={method.action}
              variants={itemVariants}
              className="relative group"
              onMouseEnter={() => setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="flex items-center space-x-3 p-2.5 sm:p-3 rounded-lg hover:bg-surface transition-all duration-300 relative overflow-hidden"
                initial={{ borderColor: 'transparent' }}
                animate={{
                  borderColor: hoveredMethod === method.id ? '#E53E3E' : 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-0`}
                  animate={{
                    opacity: hoveredMethod === method.id ? 0.05 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Glow effect */}
                {hoveredMethod === method.id && (
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 62, 62, 0.2), transparent 50%)`,
                    }}
                  />
                )}

                {/* Icon with animation */}
                <motion.div 
                  className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center text-white flex-shrink-0 relative`}
                  animate={hoveredMethod === method.id ? {
                    rotate: [0, -10, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {/* Pulse effect for available methods */}
                  {method.available && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-lg"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                    />
                  )}
                  <Icon name={method.icon} size={18} className="sm:w-5 sm:h-5 relative z-10" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-primary text-xs sm:text-sm">{method.title}</div>
                    {method.available && (
                      <motion.div 
                        className="w-1.5 h-1.5 bg-success rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.1,
                        }}
                      />
                    )}
                  </div>
                  <motion.div 
                    className="text-accent text-xs sm:text-sm font-medium truncate"
                    animate={hoveredMethod === method.id ? {
                      x: [0, 5, 0],
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {method.value}
                  </motion.div>
                  <div className="flex items-center justify-between">
                    <div className="text-text-secondary text-xs">{method.description}</div>
                    <motion.div 
                      className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      animate={{ x: hoveredMethod === method.id ? 0 : -10 }}
                    >
                      {method.responseTime}
                    </motion.div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  animate={{
                    x: hoveredMethod === method.id ? 5 : 0,
                    opacity: hoveredMethod === method.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon name="ArrowRight" size={14} className="text-accent" />
                </motion.div>
              </motion.div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Social Links Card with Enhanced Animations */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Animated pattern background */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%),
              linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)
            `,
            backgroundSize: '20px 20px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '20px 20px'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.h3 
          className="text-base sm:text-lg font-bold mb-3 sm:mb-4 relative z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Connect on Social
        </motion.h3>
        
        <div className="flex space-x-2 sm:space-x-3 relative z-10">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.4 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              onMouseEnter={() => setHoveredSocial(social.label)}
              onMouseLeave={() => setHoveredSocial(null)}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              aria-label={social.label}
            >
              <motion.div 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300"
                animate={hoveredSocial === social.label ? {
                  boxShadow: '0 0 20px rgba(255,255,255,0.5)',
                } : {}}
              >
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${social.color} rounded-lg`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredSocial === social.label ? 0.3 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <Icon name={social.icon} size={18} className="sm:w-5 sm:h-5 relative z-10" />
                
                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredSocial === social.label && (
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                    >
                      {social.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.a>
          ))}
        </div>

        {/* Animated message */}
        <motion.div 
          className="mt-4 flex items-center space-x-2 text-xs sm:text-sm opacity-90 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon name="Heart" size={14} className="text-white" />
          </motion.div>
          <span>Join our community of innovators</span>
        </motion.div>
      </motion.div>

      {/* Office Hours Card with Enhanced Status */}
      <motion.div
        variants={itemVariants}
        className="bg-surface rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5"
          animate={{
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.h3 
          className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4 flex items-center relative z-10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Icon name="Clock" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
          </motion.div>
          Office Hours
        </motion.h3>

        {/* Hours list with stagger animation */}
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm relative z-10">
          {officeHours.map((schedule, index) => (
            <motion.div 
              key={schedule.day}
              className="flex justify-between items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <span className="text-text-secondary">{schedule.day}</span>
              <motion.span 
                className={`font-semibold ${schedule.isOpen ? 'text-primary' : 'text-text-secondary'}`}
                animate={schedule.isOpen && isBusinessHours ? {
                  color: ['#000000', '#E53E3E', '#000000'],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {schedule.hours}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Live status indicator */}
        <motion.div 
          className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <motion.div 
                className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-success' : 'bg-warning'}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className={`font-medium ${isBusinessHours ? 'text-success' : 'text-warning'}`}>
                {isBusinessHours ? 'Currently Open' : 'Currently Closed'}
              </span>
            </div>
            <motion.span 
              className="text-xs text-text-secondary"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {currentTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                timeZone: 'America/Los_Angeles'
              })} PST
            </motion.span>
          </div>
        </motion.div>

        {/* Quick action button */}
        <motion.div 
          className="mt-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300"
            iconName="Calendar"
            iconPosition="left"
          >
            Schedule a Call
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ContactOptions;