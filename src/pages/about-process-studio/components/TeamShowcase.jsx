import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const TeamShowcase = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const teamCategories = [
    { id: 'all', label: 'All Team', icon: 'Users' },
    { id: 'leadership', label: 'Leadership', icon: 'Crown' },
    { id: 'creative', label: 'Creative', icon: 'Palette' },
    { id: 'technical', label: 'Technical', icon: 'Code' },
    { id: 'strategy', label: 'Strategy', icon: 'Target' }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Founder & Creative Visionary',
      category: 'leadership',
      image: '/api/placeholder/300/300',
      expertise: ['Brand Strategy', 'Creative Direction', 'Innovation Leadership'],
      bio: 'The rebel who asked "What if design had no limits?" Alex founded Rule27 on the belief that creativity should break boundaries, not follow them.',
      projects: ['Nike Revolution Campaign', 'Tesla Interface Redesign', 'Apple Store Experience'],
      personality: 'Visionary, Bold, Perfectionist',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Co-Founder & Technical Architect',
      category: 'leadership',
      image: '/api/placeholder/300/300',
      expertise: ['System Architecture', 'Full-Stack Development', 'AI Integration'],
      bio: 'The technical mastermind who makes impossible possible. Sarah ensures every creative vision is backed by flawless execution.',
      projects: ['Netflix Recommendation Engine', 'Spotify AI Features', 'Amazon Voice Interface'],
      personality: 'Perfectionist, Innovative, Problem Solver',
      social: { linkedin: '#', github: '#', twitter: '#' }
    },
    {
      id: 3,
      name: 'Marcus Rodriguez',
      role: 'Head of Brand Experience',
      category: 'creative',
      image: '/api/placeholder/300/300',
      expertise: ['Brand Identity', 'Motion Graphics', 'Experience Design'],
      bio: 'The creative force who turns brands into movements. Marcus crafts identities that don\'t just look good—they inspire action.',
      projects: ['Airbnb Rebrand', 'Google Material Design', 'Microsoft Fluent System'],
      personality: 'Artistic, Passionate, Detail-oriented',
      social: { linkedin: '#', behance: '#', instagram: '#' }
    },
    {
      id: 4,
      name: 'Emily Watson',
      role: 'Lead UX Strategist',
      category: 'strategy',
      image: '/api/placeholder/300/300',
      expertise: ['User Research', 'Journey Mapping', 'Behavioral Psychology'],
      bio: 'The strategist who understands humans better than they understand themselves. Emily turns user insights into breakthrough experiences.',
      projects: ['Uber Experience Optimization', 'Instagram Stories UX', 'LinkedIn Learning Platform'],
      personality: 'Analytical, Empathetic, Data-driven',
      social: { linkedin: '#', medium: '#', twitter: '#' }
    },
    {
      id: 5,
      name: 'David Kim',
      role: 'Senior Full-Stack Developer',
      category: 'technical',
      image: '/api/placeholder/300/300',
      expertise: ['React/Node.js', 'Cloud Architecture', 'Performance Optimization'],
      bio: 'The code artist who makes websites fly. David builds digital experiences that load faster than you can think.',
      projects: ['Shopify Speed Optimization', 'PayPal Payment Gateway', 'Zoom Video Platform'],
      personality: 'Logical, Efficient, Coffee-powered',
      social: { linkedin: '#', github: '#', stackoverflow: '#' }
    },
    {
      id: 6,
      name: 'Lisa Park',
      role: 'Head of Innovation Lab',
      category: 'creative',
      image: '/api/placeholder/300/300',
      expertise: ['Emerging Tech', 'AR/VR Design', 'Future Thinking'],
      bio: 'The future-seer who makes tomorrow happen today. Lisa explores technologies that don\'t exist yet to create experiences that shouldn\'t be possible.',
      projects: ['Meta VR Interfaces', 'Apple Vision Pro Apps', 'Tesla Autopilot UX'],
      personality: 'Futuristic, Experimental, Visionary',
      social: { linkedin: '#', twitter: '#', medium: '#' }
    }
  ];

  const filteredMembers = activeCategory === 'all' 
    ? teamMembers 
    : teamMembers?.filter(member => member?.category === activeCategory);

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
            <AppIcon name="Users" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Meet Our Team</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            The <span className="text-accent">Rebel Alliance</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
            Meet the visionaries, creators, and technical wizards who make Rule27 the digital powerhouse 
            that transforms ambitious brands into industry leaders.
          </p>
        </motion.div>

        {/* Category Filter - FIXED: Now with flex-wrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12 lg:mb-16"
        >
          {teamCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category?.id
                  ? 'bg-accent text-white shadow-lg transform scale-105'
                  : 'bg-surface text-text-secondary hover:bg-accent/10 hover:text-accent'
              }`}
            >
              <AppIcon name={category?.icon} size={16} className="flex-shrink-0" />
              <span>{category?.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Team Grid - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredMembers?.map((member, index) => (
              <motion.div
                key={member?.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="bg-surface rounded-xl sm:rounded-2xl overflow-hidden shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 transform group-hover:-translate-y-2">
                  {/* Member Image */}
                  <div className="relative overflow-hidden">
                    <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white rounded-full flex items-center justify-center shadow-brand-lg">
                        <span className="text-3xl sm:text-4xl font-bold text-primary">{member?.name?.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                        <AppIcon name="Eye" size={16} className="text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-300">
                      {member?.name}
                    </h3>
                    <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4">{member?.role}</p>
                    
                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {member?.expertise?.slice(0, 2)?.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {member?.expertise?.length > 2 && (
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full">
                          +{member?.expertise?.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Bio Preview */}
                    <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {member?.bio?.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Team Member Detail Modal - Mobile Optimized */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-brand-modal"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl lg:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e?.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  {/* Header with mobile-friendly close button */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl font-bold text-primary">{selectedMember?.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">{selectedMember?.name}</h3>
                        <p className="text-accent font-semibold text-sm sm:text-base lg:text-lg">{selectedMember?.role}</p>
                        <p className="text-text-secondary text-xs sm:text-sm">{selectedMember?.personality}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-accent/10 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0"
                    >
                      <AppIcon name="X" size={20} className="text-text-secondary hover:text-accent" />
                    </button>
                  </div>

                  {/* Content Grid - Stack on mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Left Column */}
                    <div>
                      {/* Bio */}
                      <div className="mb-6 sm:mb-8">
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">About</h4>
                        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">{selectedMember?.bio}</p>
                      </div>

                      {/* Expertise */}
                      <div className="mb-6 sm:mb-8">
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Expertise</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {selectedMember?.expertise?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent font-medium rounded-full text-sm sm:text-base"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      {/* Featured Projects */}
                      <div className="mb-6 sm:mb-8">
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Featured Projects</h4>
                        <ul className="space-y-2 sm:space-y-3">
                          {selectedMember?.projects?.map((project, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <AppIcon name="CheckCircle" size={16} className="text-accent flex-shrink-0" />
                              <span className="text-text-secondary text-sm sm:text-base">{project}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Social Links */}
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Connect</h4>
                        <div className="flex space-x-3 sm:space-x-4">
                          {Object?.entries(selectedMember?.social || {})?.map(([platform, link]) => (
                            <a
                              key={platform}
                              href={link}
                              className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 hover:bg-accent hover:text-white text-accent rounded-full flex items-center justify-center transition-all duration-300"
                            >
                              <AppIcon 
                                name={platform === 'linkedin' ? 'Linkedin' : platform === 'github' ? 'Github' : 'Share'} 
                                size={20} 
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TeamShowcase;