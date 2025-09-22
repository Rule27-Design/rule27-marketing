import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const TeamMemberPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedMembers, setRelatedMembers] = useState([]);

  useEffect(() => {
    fetchMember();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchMember = async () => {
    try {
      // Fetch the specific member
      const { data: memberData, error: memberError } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (memberError) throw memberError;

      setMember(memberData);

      // Fetch related team members from same department
      if (memberData?.department?.length > 0) {
        const { data: relatedData } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_active', true)
          .eq('is_public', true)
          .contains('department', memberData.department)
          .neq('id', memberData.id)
          .limit(3);

        setRelatedMembers(relatedData || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching member:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary font-sans">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AppIcon name="UserX" size={48} className="text-text-secondary mx-auto mb-4" />
            <h2 className="text-xl font-heading-regular text-primary mb-2 uppercase tracking-wider">Team Member Not Found</h2>
            <p className="text-text-secondary mb-4 font-sans">This team member doesn't exist or is no longer available.</p>
            <Button
              variant="outline"
              onClick={() => navigate('/team')}
              className="border-accent text-accent hover:bg-accent hover:text-white"
            >
              <span className="font-heading-regular tracking-wider uppercase">View All Team</span>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{member.full_name || member.display_name} - {member.job_title} | Rule27 Design</title>
        <meta name="description" content={member.bio || `Meet ${member.full_name}, ${member.job_title} at Rule27 Design.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-surface to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image/Avatar */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl overflow-hidden shadow-brand-elevation-lg">
                    {member.avatar_url ? (
                      <img 
                        src={member.avatar_url} 
                        alt={member.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-heading-bold text-primary uppercase">
                          {member.full_name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl font-heading-regular text-primary mb-2 uppercase tracking-wider">
                    {member.full_name || member.display_name}
                  </h1>
                  <p className="text-xl text-accent font-semibold mb-4 font-sans">{member.job_title}</p>
                  
                  {/* Department Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.department?.map((dept, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-accent/10 text-accent font-medium rounded-full font-sans"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-text-secondary leading-relaxed mb-6 font-sans">
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex space-x-4">
                    {member.linkedin_url && (
                      <motion.a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-accent/10 hover:bg-accent hover:text-white text-accent rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <AppIcon name="Linkedin" size={20} />
                      </motion.a>
                    )}
                    {member.twitter_url && (
                      <motion.a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-accent/10 hover:bg-accent hover:text-white text-accent rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <AppIcon name="Twitter" size={20} />
                      </motion.a>
                    )}
                    {member.github_url && (
                      <motion.a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-accent/10 hover:bg-accent hover:text-white text-accent rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <AppIcon name="Github" size={20} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        {member.expertise && member.expertise.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-heading-regular text-primary mb-8 uppercase tracking-wider">
                Areas of Expertise
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {member.expertise.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-surface rounded-xl p-4 text-center hover:shadow-brand-md transition-all duration-300"
                  >
                    <AppIcon name="CheckCircle" size={24} className="text-accent mx-auto mb-2" />
                    <span className="text-text-primary font-sans">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Team Members */}
        {relatedMembers.length > 0 && (
          <section className="py-16 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-heading-regular text-primary mb-8 uppercase tracking-wider">
                Related Team Members
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedMembers.map((relatedMember) => (
                  <motion.div
                    key={relatedMember.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/team/${relatedMember.slug}`)}
                  >
                    <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      {relatedMember.avatar_url ? (
                        <img 
                          src={relatedMember.avatar_url} 
                          alt={relatedMember.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-heading-bold text-primary uppercase">
                          {relatedMember.full_name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading-regular text-primary mb-1 uppercase tracking-wider">
                        {relatedMember.full_name}
                      </h3>
                      <p className="text-text-secondary text-sm font-sans">
                        {relatedMember.job_title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Team CTA */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate('/team')}
              className="font-heading-regular uppercase tracking-wider"
            >
              <AppIcon name="Users" size={20} className="mr-2" />
              View All Team Members
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TeamMemberPage;