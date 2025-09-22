// Updated TeamShowcase.jsx for the About page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';

const TeamShowcase = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      // Only fetch featured team members for the about page
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .eq('is_public', true)
        .in('role', ['admin', 'leadership'])
        .order('sort_order')
        .limit(6);

      setTeamMembers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <AppIcon name="Users" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-sm font-sans">Meet Our Team</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-regular text-primary mb-6 uppercase tracking-wider">
            The <span className="text-accent">Leadership Team</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto font-sans">
            Meet the certified professionals leading Rule27 Design's digital innovation.
          </p>
        </motion.div>

        {/* Featured Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-surface rounded-2xl overflow-hidden shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 cursor-pointer"
              onClick={() => navigate(`/team/${member.slug}`)}
            >
              <div className="h-64 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                {member.avatar_url ? (
                  <img 
                    src={member.avatar_url} 
                    alt={member.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <span className="text-4xl font-heading-bold text-primary uppercase">
                      {member.full_name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading-regular text-primary mb-1 uppercase tracking-wider">
                  {member.full_name}
                </h3>
                <p className="text-text-secondary text-sm mb-3 font-sans">{member.job_title}</p>
                <div className="flex flex-wrap gap-2">
                  {member.expertise?.slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full font-sans"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/team')}
            className="font-heading-regular uppercase tracking-wider"
          >
            <AppIcon name="Users" size={20} className="mr-2" />
            View All Team Members
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamShowcase;