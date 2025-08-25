import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const TeamShowcase = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isInView, setIsInView] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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
    : teamMembers?.filter(member => 
        Array.isArray(member?.category) 
          ? member.category.includes(activeCategory)
          : member?.category === activeCategory
      );

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

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Expertise tag animation
  const tagVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.05,
        type: "spring",
        stiffness: 200
      }
    })
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AppIcon name="Users" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-xs sm:text-sm">Meet Our Team</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            The <motion.span 
              className="text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
            >Certified Experts</motion.span>
          </h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Meet the certified professionals who make Rule27 Design the digital powerhouse it is—experts in marketing 
            platforms, cloud development, and everything in between.
          </motion.p>
        </motion.div>

        {/* Animated Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12 lg:mb-16"
        >
          {teamCategories?.map((category, index) => (
            <motion.button
              key={category?.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category?.id
                  ? 'bg-accent text-white shadow-lg transform scale-105'
                  : 'bg-surface text-text-secondary hover:bg-accent/10 hover:text-accent'
              }`}
            >
              <AppIcon name={category?.icon} size={16} className="flex-shrink-0" />
              <span>{category?.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Team Grid with 3D Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 perspective-1000"
        >
          <AnimatePresence mode="wait">
            {filteredMembers?.map((member, index) => (
              <motion.div
                key={member?.id}
                layout
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover="hover"
                className="group cursor-pointer preserve-3d"
                onClick={() => setSelectedMember(member)}
                onMouseEnter={() => setHoveredCard(member.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <div className="bg-surface rounded-xl sm:rounded-2xl overflow-hidden shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 relative">
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 pointer-events-none"
                    animate={{
                      opacity: hoveredCard === member.id ? 0.1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Enhanced Member Image with parallax */}
                  <div className="relative overflow-hidden">
                    <motion.div 
                      className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
                      animate={{
                        scale: hoveredCard === member.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div 
                        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white rounded-full flex items-center justify-center shadow-brand-lg relative z-10"
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <span className="text-3xl sm:text-4xl font-bold text-primary">{member?.name?.charAt(0)}</span>
                      </motion.div>
                    </motion.div>
                    
                    {/* Animated overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === member.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* View indicator */}
                    <motion.div 
                      className="absolute top-4 right-4"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: hoveredCard === member.id ? 1 : 0,
                        scale: hoveredCard === member.id ? 1 : 0
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                        <AppIcon name="Eye" size={16} className="text-primary" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Enhanced Member Info */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <motion.h3 
                      className="text-lg sm:text-xl font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-300"
                      animate={{
                        x: hoveredCard === member.id ? 5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {member?.name}
                    </motion.h3>
                    <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4">{member?.role}</p>
                    
                    {/* Animated Expertise Tags */}
                    <motion.div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {member?.expertise?.slice(0, 2)?.map((skill, skillIndex) => (
                        <motion.span
                          key={skillIndex}
                          custom={skillIndex}
                          variants={tagVariants}
                          initial="hidden"
                          animate={hoveredCard === member.id ? "visible" : "hidden"}
                          className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                        >
                          {skill}
                        </motion.span>
                      ))}
                      {member?.expertise?.length > 2 && (
                        <motion.span 
                          className="px-2 sm:px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full"
                          animate={{
                            scale: hoveredCard === member.id ? [1, 1.1, 1] : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          +{member?.expertise?.length - 2} more
                        </motion.span>
                      )}
                    </motion.div>

                    {/* Bio Preview with animated text reveal */}
                    <motion.p 
                      className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3"
                      initial={{ opacity: 0.7 }}
                      animate={{
                        opacity: hoveredCard === member.id ? 1 : 0.7
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {member?.bio?.substring(0, 120)}...
                    </motion.p>

                    {/* Animated underline on hover */}
                    <motion.div
                      className="h-0.5 bg-accent mt-4"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: hoveredCard === member.id ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Team Member Detail Modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: '100%', opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl lg:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e?.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  {/* Enhanced Header with animations */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className="flex items-center space-x-4 sm:space-x-6"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.div 
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <span className="text-2xl sm:text-3xl font-bold text-primary">{selectedMember?.name?.charAt(0)}</span>
                      </motion.div>
                      <div>
                        <motion.h3 
                          className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {selectedMember?.name}
                        </motion.h3>
                        <motion.p 
                          className="text-accent font-semibold text-sm sm:text-base lg:text-lg"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.25 }}
                        >
                          {selectedMember?.role}
                        </motion.p>
                        <motion.p 
                          className="text-text-secondary text-xs sm:text-sm"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {selectedMember?.personality}
                        </motion.p>
                      </div>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedMember(null)}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-accent/10 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0"
                    >
                      <AppIcon name="X" size={20} className="text-text-secondary hover:text-accent" />
                    </motion.button>
                  </div>

                  {/* Animated Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Left Column with stagger animation */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {/* Bio */}
                      <div className="mb-6 sm:mb-8">
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">About</h4>
                        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">{selectedMember?.bio}</p>
                      </div>

                      {/* Animated Expertise Tags */}
                      <div className="mb-6 sm:mb-8">
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Expertise</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {selectedMember?.expertise?.map((skill, index) => (
                            <motion.span
                              key={index}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ 
                                delay: 0.4 + (index * 0.05),
                                type: "spring",
                                stiffness: 200
                              }}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent font-medium rounded-full text-sm sm:text-base cursor-default"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Right Column with stagger animation */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      {/* Featured Projects */}
                      <div className="mb-6 sm:mb-8">
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Featured Projects</h4>
                        <ul className="space-y-2 sm:space-y-3">
                          {selectedMember?.projects?.map((project, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-center space-x-3"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 + (index * 0.05) }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <AppIcon name="CheckCircle" size={16} className="text-accent flex-shrink-0" />
                              </motion.div>
                              <span className="text-text-secondary text-sm sm:text-base">{project}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Social Links with hover effects */}
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Connect</h4>
                        <div className="flex space-x-3 sm:space-x-4">
                          {Object?.entries(selectedMember?.social || {})?.map(([platform, link], index) => (
                            <motion.a
                              key={platform}
                              href={link}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                delay: 0.6 + (index * 0.05),
                                type: "spring",
                                stiffness: 200
                              }}
                              whileHover={{ 
                                scale: 1.2,
                                rotate: [0, -10, 10, -10, 0],
                                transition: { duration: 0.5 }
                              }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 hover:bg-accent hover:text-white text-accent rounded-full flex items-center justify-center transition-all duration-300"
                            >
                              <AppIcon 
                                name={platform === 'linkedin' ? 'Linkedin' : platform === 'github' ? 'Github' : 'Share'} 
                                size={20} 
                              />
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add custom styles for 3D effects */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
};

export default TeamShowcase;