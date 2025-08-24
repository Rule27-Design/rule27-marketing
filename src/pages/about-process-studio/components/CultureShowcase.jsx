import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CultureShowcase = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const sectionRef = useRef(null);

  const coreValues = [
    {
      id: 1,
      title: 'Confident Disruption',
      description: 'We don\'t follow trends—we create them. Every project is an opportunity to challenge the status quo.',
      icon: 'Zap',
      color: 'from-accent to-red-400',
      examples: [
        'Questioning every "that\'s how we\'ve always done it"',
        'Turning constraints into creative opportunities',
        'Making bold decisions backed by smart strategy'
      ]
    },
    {
      id: 2,
      title: 'Apple-Level Excellence',
      description: 'Obsessive attention to detail, relentless pursuit of perfection, and user-first thinking in everything we create.',
      icon: 'Award',
      color: 'from-blue-500 to-purple-400',
      examples: [
        'Pixel-perfect designs that scale beautifully',
        'Code that\'s as clean as the user interface',
        'Testing until it\'s better than expected'
      ]
    },
    {
      id: 3,
      title: 'Collaborative Innovation',
      description: 'The best ideas come from diverse minds working together. We believe in co-creation, not just collaboration.',
      icon: 'Users',
      color: 'from-green-500 to-teal-400',
      examples: [
        'Cross-functional teams on every project',
        'Client partnerships, not vendor relationships',
        'Learning from everyone, teaching everyone'
      ]
    },
    {
      id: 4,
      title: 'Continuous Evolution',
      description: 'The digital world moves fast. We move faster. Always learning, always improving, never settling.',
      icon: 'TrendingUp',
      color: 'from-orange-500 to-yellow-400',
      examples: [
        'Weekly learning sessions on emerging tech',
        'Experiment-first approach to new solutions',
        'Iterating based on real user feedback'
      ]
    }
  ];

  const cultureMedia = [
    {
      id: 1,
      type: 'image',
      title: 'Innovation War Room',
      description: 'Where breakthrough ideas are born and impossible becomes inevitable.',
      category: 'workspace'
    },
    {
      id: 2,
      type: 'image',
      title: 'Team Collaboration',
      description: 'Cross-functional magic happening in real-time.',
      category: 'teamwork'
    },
    {
      id: 3,
      type: 'video',
      title: 'Behind the Scenes',
      description: 'A day in the life of digital rebels making extraordinary happen.',
      category: 'culture'
    },
    {
      id: 4,
      type: 'image',
      title: 'Celebration Moments',
      description: 'Celebrating wins, big and small, because every breakthrough matters.',
      category: 'events'
    },
    {
      id: 5,
      type: 'image',
      title: 'Learning Sessions',
      description: 'Continuous learning is part of our DNA—staying ahead of tomorrow.',
      category: 'growth'
    },
    {
      id: 6,
      type: 'video',
      title: 'Client Co-Creation',
      description: 'Partnership in action—creating solutions together.',
      category: 'collaboration'
    }
  ];

  const officePerks = [
    { icon: 'Coffee', title: 'Unlimited Coffee', description: 'Premium coffee, because great ideas need great fuel' },
    { icon: 'Gamepad', title: 'Gaming Zone', description: 'Xbox, PS5, and retro games for creative breaks' },
    { icon: 'Dumbbell', title: 'Fitness Center', description: 'On-site gym because healthy body = creative mind' },
    { icon: 'BookOpen', title: 'Learning Library', description: 'Unlimited access to courses, books, and conferences' },
    { icon: 'Plane', title: 'Remote Freedom', description: 'Work from anywhere that sparks your creativity' },
    { icon: 'Heart', title: 'Mental Health', description: 'Wellness programs and mental health support' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
      },
      { 
        threshold: 0.05, // Changed from 0.2 to 0.05 - triggers much sooner
        rootMargin: '100px' // Add this - starts animation 100px before element is visible
      }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    // Also set visibility immediately on mobile
    if (window.innerWidth < 768) {
      setIsInView(true); // Immediate visibility on mobile
    }

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % coreValues?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
            <AppIcon name="Heart" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Our Culture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Where <span className="text-accent">Innovation</span> Lives
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
            Our culture isn't just about perks and ping-pong tables. It's about creating an environment 
            where extraordinary people do extraordinary work, every single day.
          </p>
        </motion.div>

        {/* Core Values - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8 sm:mb-12">Our Core Values</h3>
          
          {/* Values Navigation - FIXED: Already has flex-wrap, keeping consistency */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12">
            {coreValues?.map((value, index) => (
              <button
                key={value?.id}
                onClick={() => setActiveValue(index)}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base min-w-[140px] sm:min-w-auto ${
                  activeValue === index
                    ? `bg-gradient-to-r ${value?.color} text-white shadow-lg transform scale-105`
                    : 'bg-surface text-text-secondary hover:bg-accent/5 hover:text-accent'
                }`}
              >
                <AppIcon name={value?.icon} size={16} className="flex-shrink-0" />
                <span>{value?.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Value Content - Mobile Optimized */}
          <div className="bg-surface rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 shadow-brand-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${coreValues?.[activeValue]?.color} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
                    <AppIcon name={coreValues?.[activeValue]?.icon} size={24} className="text-white" />
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-primary">{coreValues?.[activeValue]?.title}</h4>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed mb-4 sm:mb-6">
                  {coreValues?.[activeValue]?.description}
                </p>
                <div>
                  <h5 className="font-bold text-primary mb-3 sm:mb-4">How We Live This:</h5>
                  <ul className="space-y-2 sm:space-y-3">
                    {coreValues?.[activeValue]?.examples?.map((example, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <AppIcon name="CheckCircle" size={20} className="text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary text-sm sm:text-base">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r ${coreValues?.[activeValue]?.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                      <AppIcon name={coreValues?.[activeValue]?.icon} size={40} className="text-white" />
                    </div>
                    <p className="text-text-secondary font-medium text-sm sm:text-base">Value in Action</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Culture Gallery - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8 sm:mb-12">Behind the Scenes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cultureMedia?.map((media, index) => (
              <motion.div
                key={media?.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="group cursor-pointer"
                onClick={() => setSelectedMedia(media)}
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 h-48 sm:h-56 lg:h-64 group-hover:shadow-brand-elevation-lg transition-all duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <AppIcon 
                        name={media?.type === 'video' ? 'Play' : 'Image'} 
                        size={36} 
                        className="text-white mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" 
                      />
                      <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{media?.title}</h4>
                      <p className="text-white/80 text-xs sm:text-sm px-4">{media?.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {media?.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Office Perks - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8 sm:mb-12">Why We Love Working Here</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {officePerks?.map((perk, index) => (
              <div
                key={index}
                className="bg-surface rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-brand-md transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 group-hover:bg-accent group-hover:text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300">
                    <AppIcon name={perk?.icon} size={20} className="text-accent group-hover:text-white" />
                  </div>
                  <h4 className="font-bold text-primary text-sm sm:text-base">{perk?.title}</h4>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">{perk?.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl lg:rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Join the Rebellion?</h3>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              We're always looking for extraordinary people who want to create extraordinary work. 
              Be part of the team that makes other agencies look ordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 sm:px-8 py-3 sm:py-4 font-semibold min-h-[48px]"
              >
                <AppIcon name="Users" size={20} className="mr-2" />
                View Open Positions
              </Button>
              <Button
                variant="default"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 font-semibold min-h-[48px]"
              >
                <AppIcon name="Mail" size={20} className="mr-2" />
                Send Your Portfolio
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CultureShowcase;