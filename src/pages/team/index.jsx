import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import AppIcon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const TeamPage = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  const teamCategories = [
    { id: 'all', label: 'All Team', icon: 'Users' },
    { id: 'Leadership', label: 'Leadership', icon: 'Crown' },
    { id: 'Marketing', label: 'Marketing', icon: 'Target' },
    { id: 'Development', label: 'Development', icon: 'Code' },
    { id: 'Creative', label: 'Creative', icon: 'Palette' }
  ];

  useEffect(() => {
    fetchTeamMembers();
    window.scrollTo(0, 0);
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .eq('is_public', true)
        .order('sort_order')
        .order('full_name');

      if (error) throw error;

      setTeamMembers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      setLoading(false);
    }
  };

  const filteredMembers = activeCategory === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => 
        member.department && member.department.includes(activeCategory)
      );

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary font-sans">Loading team...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Our Team | Rule27 Design - Meet the Digital Experts</title>
        <meta name="description" content="Meet the certified professionals who make Rule27 Design the digital powerhouse it is—experts in marketing platforms, cloud development, and everything in between." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 bg-gradient-to-br from-surface to-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div 
                className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <AppIcon name="Users" size={16} className="text-accent" />
                <span className="text-accent font-semibold text-sm font-sans">Meet Our Team</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading-regular text-primary mb-6 uppercase tracking-wider">
                The <span className="text-accent">Certified Experts</span>
              </h1>
              
              <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto font-sans">
                Meet the certified professionals who make Rule27 Design the digital powerhouse it is—experts in marketing 
                platforms, cloud development, and everything in between.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-white sticky top-16 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {teamCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-full font-heading-regular uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-accent text-white shadow-lg transform scale-105'
                      : 'bg-surface text-text-secondary hover:bg-accent/10 hover:text-accent'
                  }`}
                >
                  <AppIcon name={category.icon} size={16} />
                  <span>{category.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    layout
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover="hover"
                    className="group cursor-pointer"
                    onClick={() => navigate(`/team/${member.slug}`)}
                    onMouseEnter={() => setHoveredCard(member.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="bg-surface rounded-2xl overflow-hidden shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 relative">
                      {/* Member Image/Avatar */}
                      <div className="relative overflow-hidden">
                        <div className="w-full h-64 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                          {member.avatar_url ? (
                            <img 
                              src={member.avatar_url} 
                              alt={member.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-brand-lg">
                              <span className="text-4xl font-heading-bold text-primary uppercase">
                                {member.full_name?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <motion.div 
                          className="absolute top-4 right-4"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: hoveredCard === member.id ? 1 : 0,
                            scale: hoveredCard === member.id ? 1 : 0
                          }}
                        >
                          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                            <AppIcon name="ArrowRight" size={16} className="text-primary" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Member Info */}
                      <div className="p-5">
                        <h3 className="text-xl font-heading-regular text-primary mb-1 group-hover:text-accent transition-colors duration-300 uppercase tracking-wider">
                          {member.full_name || member.display_name}
                        </h3>
                        <p className="text-text-secondary text-sm mb-3 font-sans">{member.job_title}</p>
                        
                        {/* Department Tags */}
                        <div className="flex flex-wrap gap-2">
                          {member.department?.slice(0, 2).map((dept, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full font-sans"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-secondary font-sans">No team members found in this category.</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TeamPage;