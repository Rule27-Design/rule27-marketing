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
      title: 'Consistency & Excellence',
      description: 'We deliver proven quality across both marketing and development. Every project, every time, excellence is our standard.',
      icon: 'Award',
      color: 'from-accent to-red-400',
      examples: [
        'Proven track record across 150+ projects',
        'Certified expertise in 10+ platforms',
        'Same high standards for marketing and development'
      ]
    },
    {
      id: 2,
      title: 'Accountability',
      description: 'We stand behind every line of code and every campaign we create. If something needs fixing, we own it and we fix it.',
      icon: 'Shield',
      color: 'from-blue-500 to-purple-400',
      examples: [
        'We fix issues, no questions asked',
        'Clear ownership of every deliverable',
        'Post-launch support and optimization included'
      ]
    },
    {
      id: 3,
      title: 'Reliability',
      description: 'Day or night, campaign launch or server emergency, we\'re the partner you can always count on.',
      icon: 'Clock',
      color: 'from-green-500 to-teal-400',
      examples: [
        '24/7 support for critical issues',
        'On-time delivery, every time',
        'Consistent team you know and trust'
      ]
    },
    {
      id: 4,
      title: 'Transparency',
      description: 'No surprises, no hidden agendas. We believe in open, honest communication about timelines, budgets, and challenges.',
      icon: 'Eye',
      color: 'from-orange-500 to-yellow-400',
      examples: [
        'Clear project visibility and reporting',
        'Honest feedback and recommendations',
        'Open communication about challenges and solutions'
      ]
    },
    {
      id: 5,
      title: 'Innovation',
      description: 'We combine marketing creativity with technical innovation to deliver solutions that set you apart from the competition.',
      icon: 'Lightbulb',
      color: 'from-purple-500 to-pink-400',
      examples: [
        'Cutting-edge marketing automation',
        'Custom technical solutions',
        'Always learning, always improving'
      ]
    },
    {
      id: 6,
      title: 'Partnership',
      description: 'We\'re not just another vendor. We\'re invested in your success as much as you are.',
      icon: 'Handshake',
      color: 'from-indigo-500 to-blue-500',
      examples: [
        'Strategic guidance beyond the project',
        'Shared success metrics and KPIs',
        'Long-term relationships, not transactions'
      ]
    }
  ];

  const cultureMedia = [
    {
      id: 1,
      type: 'image',
      title: 'War Room Sessions',
      description: 'Where marketing strategy meets technical architecture in collaborative planning.',
      category: 'collaboration',
      icon: 'Users',
      imageUrl: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=300&fit=crop',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 2,
      type: 'image',
      title: 'Certification Celebrations',
      description: 'Celebrating new platform certifications—our commitment to continuous excellence.',
      category: 'growth',
      icon: 'Award',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 3,
      type: 'image',
      title: 'Marketing Meets Dev',
      description: 'Our unique culture where creatives and developers work side by side.',
      category: 'culture',
      icon: 'Heart',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      color: 'from-accent to-red-500'
    },
    {
      id: 4,
      type: 'image',
      title: 'Client Success Stories',
      description: 'Celebrating client wins—from campaign launches to platform deployments.',
      category: 'success',
      icon: 'TrendingUp',
      imageUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=300&fit=crop',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 5,
      type: 'image',
      title: 'Platform Training',
      description: 'Weekly sessions on new platforms—from Salesforce to Shopify, AWS to Adobe.',
      category: 'learning',
      icon: 'BookOpen',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 6,
      type: 'image',
      title: 'Innovation Lab',
      description: 'Testing new marketing tech and development frameworks before anyone else.',
      category: 'innovation',
      icon: 'Cpu',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const officePerks = [
    { icon: 'Trophy', title: 'Certification Support', description: 'Full coverage for platform certifications and training' },
    { icon: 'Users', title: 'Cross-Training', description: 'Marketers learn dev, developers learn marketing' },
    { icon: 'Zap', title: 'Innovation Time', description: '20% time for experimental projects and learning' },
    { icon: 'DollarSign', title: 'Performance Bonuses', description: 'Rewards for certifications and project excellence' },
    { icon: 'Globe', title: 'Remote Flexibility', description: 'Work from anywhere with full support' },
    { icon: 'Heart', title: 'Health & Wellness', description: 'Comprehensive benefits and mental health support' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
      },
      { 
        threshold: 0.05,
        rootMargin: '100px'
      }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    if (window.innerWidth < 768) {
      setIsInView(true);
    }

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % coreValues?.length);
    }, 6000);

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
            Where <span className="text-accent">Excellence</span> Thrives
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
            Our core values have guided us from day one. These principles, combined with our dual expertise 
            in marketing and development, create a culture where both creativity and technical excellence flourish.
          </p>
        </motion.div>

        {/* Core Values - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Values Navigation - FIXED: Already has flex-wrap, keeping consistency */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12">
            {coreValues?.map((value, index) => (
              <button
                key={value?.id}
                onClick={() => setActiveValue(index)}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeValue === index
                    ? `bg-gradient-to-r ${value?.color} text-white shadow-lg transform scale-105`
                    : 'bg-surface text-text-secondary hover:bg-accent/5 hover:text-accent'
                }`}
              >
                <AppIcon name={value?.icon} size={16} className="flex-shrink-0" />
                <span className="hidden sm:inline">{value?.title.split(' ')[0]}</span>
                <span className="sm:hidden">{value?.title.split(' ')[0]}</span>
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
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl h-48 sm:h-56 lg:h-64 bg-gray-100 group-hover:shadow-brand-elevation-lg transition-all duration-500">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${media?.imageUrl})`,
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${media?.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`}></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-4 sm:p-6">
                    {/* Top Section - Icon and Category Badge */}
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                        <AppIcon 
                          name={media?.icon} 
                          size={20} 
                          className="text-white" 
                        />
                      </div>
                      <span className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                        {media?.category}
                      </span>
                    </div>
                    
                    {/* Bottom Section - Title and Description */}
                    <div className="text-white">
                      <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 group-hover:translate-x-1 transition-transform duration-300">
                        {media?.title}
                      </h4>
                      <p className="text-white/90 text-xs sm:text-sm line-clamp-2">
                        {media?.description}
                      </p>
                      
                      {/* View More Indicator */}
                      <div className="mt-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs font-medium">View Details</span>
                        <AppIcon name="ArrowRight" size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
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
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Join the Powerhouse?</h3>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              We're always looking for certified professionals and aspiring experts who want to work at the 
              intersection of marketing brilliance and technical excellence.
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
                Send Your Resume
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CultureShowcase;