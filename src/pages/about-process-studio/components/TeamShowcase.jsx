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
    { id: 'marketing', label: 'Marketing', icon: 'Target' },
    { id: 'development', label: 'Development', icon: 'Code' },
    { id: 'creative', label: 'Creative', icon: 'Palette' }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Josh Anderson',
      role: 'Founder & CEO',
      category: ['leadership','development'],
      image: '/api/placeholder/300/300',
      expertise: ['Business Strategy', 'Digital Transformation', 'Innovation Leadership', 'Cloud Architecture', 'DevOps Strategy', 'Technical Innovation'],
      bio: 'With a passion for driving growth and delivering exceptional results, Josh has successfully spearheaded numerous projects, leading cross-functional teams to achieve remarkable success. With his strong analytical skills and a keen eye for detail, Josh excels in optimizing processes, enhancing operational efficiency, and cultivating strong client relationships. Committed to continuous learning and staying ahead of industry trends, Josh brings a wealth of knowledge and expertise to every endeavor. Whether it\'s crafting innovative strategies or implementing impactful solutions, Josh\'s unwavering dedication and strong leadership qualities make him a valuable asset in driving organizational success.',
      projects: ['Fortune 500 Digital Transformations', 'Multi-Million Dollar Campaigns', 'Enterprise Platform Builds'],
      personality: 'Visionary, Strategic, Results-Driven',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    {
      id: 2,
      name: 'Warren Jones',
      role: 'Co-Founder & COO',
      category: ['leadership', 'marketing', 'creative'],
      image: '/api/placeholder/300/300',
      expertise: ['Marketing Strategy', 'Brand Development', 'Campaign Management'],
      bio: '12+ year\'s experience developing and executing Marketing Strategies. He created impactful campaigns and design for state politicians, local fundraisers, board game manufacturers, medical marijuana operators, radio personalities, mixed media organizations and construction companies. Throughout his career he has perfected the process of reading into peoples personalities to make sure that your design will reach the most impactful audience.',
      projects: ['$10M+ Ad Campaigns', 'Marketing Automation Systems', 'Brand Transformations'],
      personality: 'Creative, Data-Driven, Strategic',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    {
      id: 3,
      name: 'Chris Stepanski',
      role: 'Head of Development',
      category: 'development',
      image: '/api/placeholder/300/300',
      expertise: ['Full-Stack Development', 'Cloud Solutions', 'API Architecture'],
      bio: 'Highly accomplished software engineer with a passion for cutting-edge technology and innovation. With a strong foundation in programming languages and a deep understanding of software development methodologies, has successfully designed and implemented scalable solutions for complex projects. His meticulous attention to detail and problem-solving abilities make him a valuable asset in delivering robust software solutions that exceed client expectations.',
      projects: ['E-commerce Platforms', 'SaaS Applications', 'Enterprise Integrations'],
      personality: 'Technical, Detail-Oriented, Efficient',
      social: { linkedin: '#', github: '#', stackoverflow: '#' }
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Marketing Automation Lead',
      category: 'marketing',
      image: '/api/placeholder/300/300',
      expertise: ['Salesforce Marketing Cloud', 'HubSpot', 'Email Marketing'],
      bio: 'Certified across multiple marketing platforms, David architects automation workflows that drive engagement and conversions.',
      projects: ['Multi-Touch Attribution Models', 'Lead Nurturing Systems', 'Marketing Analytics Dashboards'],
      personality: 'Analytical, Strategic, Results-Focused',
      social: { linkedin: '#', twitter: '#', medium: '#' }
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'Senior Cloud Architect',
      category: 'development',
      image: '/api/placeholder/300/300',
      expertise: ['AWS Solutions', 'Azure Architecture', 'DevOps'],
      bio: 'Multi-cloud certified architect who designs and implements enterprise-grade infrastructure for our clients.',
      projects: ['Cloud Migrations', 'Microservices Architecture', 'CI/CD Pipelines'],
      personality: 'Technical, Innovative, Systematic',
      social: { linkedin: '#', github: '#', twitter: '#' }
    },
    {
      id: 6,
      name: 'Michael Torres',
      role: 'Creative Director',
      category: 'creative',
      image: '/api/placeholder/300/300',
      expertise: ['Brand Design', 'UX/UI Design', 'Creative Strategy'],
      bio: 'The creative force who ensures every digital experience is not just functional but unforgettable.',
      projects: ['Brand Identity Systems', 'Website Redesigns', 'Campaign Creative'],
      personality: 'Artistic, Visionary, Perfectionist',
      social: { linkedin: '#', behance: '#', instagram: '#' }
    },
    {
      id: 7,
      name: 'Rachel Green',
      role: 'Shopify & E-commerce Lead',
      category: 'development',
      image: '/api/placeholder/300/300',
      expertise: ['Shopify Development', 'E-commerce Strategy', 'Conversion Optimization'],
      bio: 'Shopify Partner certified expert who builds high-converting e-commerce experiences that drive revenue.',
      projects: ['Multi-Million Dollar Stores', 'Custom Shopify Apps', 'Headless Commerce'],
      personality: 'Strategic, Technical, Revenue-Focused',
      social: { linkedin: '#', github: '#', twitter: '#' }
    },
    {
      id: 8,
      name: 'James Wilson',
      role: 'Data & Analytics Director',
      category: 'marketing',
      image: '/api/placeholder/300/300',
      expertise: ['Google Analytics', 'Data Science', 'Marketing Analytics'],
      bio: 'Google certified analyst who transforms data into actionable insights that drive marketing and business decisions.',
      projects: ['Analytics Implementations', 'Attribution Modeling', 'Predictive Analytics'],
      personality: 'Analytical, Precise, Insightful',
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
            The <span className="text-accent">Certified Experts</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
            Meet the certified professionals who make Rule27 Design the digital powerhouse it is—experts in marketing 
            platforms, cloud development, and everything in between.
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