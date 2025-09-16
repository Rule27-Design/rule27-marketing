// src/pages/client/ClientSetupProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Logo from '../../components/ui/Logo';
import { useToast } from '../../components/ui/Toast';

const ClientSetupProfile = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [profileData, setProfileData] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    job_title: '',
    company_website: '',
    industry: '',
    company_size: '',
    timezone: '',
    communication_preference: 'email'
  });

  useEffect(() => {
    setIsVisible(true);
    loadProfile();
  }, []);

  // Mouse move effect for glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (profile) {
        setProfileData(prev => ({
          ...prev,
          full_name: profile.full_name || '',
          company_name: profile.company_name || '',
          phone: profile.phone || '',
          job_title: profile.job_title || ''
        }));

        // Load client data
        const { data: client } = await supabase
          .from('clients')
          .select('*')
          .eq('profile_id', profile.id)
          .single();

        if (client) {
          setProfileData(prev => ({
            ...prev,
            company_website: client.company_website || '',
            industry: client.industry || '',
            company_size: profile.company_size || '',
            timezone: client.metadata?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
          }));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          company_name: profileData.company_name,
          phone: profileData.phone,
          job_title: profileData.job_title,
          company_size: profileData.company_size,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      // Update client record
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          company_website: profileData.company_website,
          industry: profileData.industry,
          metadata: {
            timezone: profileData.timezone,
            communication_preference: profileData.communication_preference,
            onboarding_completed_at: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', profile.id);

      if (clientError) throw clientError;

      toast.success('Profile setup complete!');
      navigate('/client');
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  // Animated background particles
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-heading-bold text-white mb-2">Personal Information</h3>
              <p className="text-gray-400 text-sm">Let's start with your basic details</p>
            </div>
            <div>
              <Input
                label="Full Name"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                required
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                labelClassName="text-gray-300"
                placeholder="John Smith"
              />
            </div>
            <div>
              <Input
                label="Job Title"
                value={profileData.job_title}
                onChange={(e) => setProfileData({ ...profileData, job_title: e.target.value })}
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                labelClassName="text-gray-300"
                placeholder="CEO"
              />
            </div>
            <div>
              <Input
                label="Phone Number"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                labelClassName="text-gray-300"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-heading-bold text-white mb-2">Company Details</h3>
              <p className="text-gray-400 text-sm">Tell us about your organization</p>
            </div>
            <div>
              <Input
                label="Company Name"
                value={profileData.company_name}
                onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                required
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                labelClassName="text-gray-300"
                placeholder="Acme Corporation"
              />
            </div>
            <div>
              <Input
                label="Company Website"
                type="url"
                value={profileData.company_website}
                onChange={(e) => setProfileData({ ...profileData, company_website: e.target.value })}
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                labelClassName="text-gray-300"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
              <select
                value={profileData.industry}
                onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-accent"
              >
                <option value="">Select Industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="education">Education</option>
                <option value="nonprofit">Non-Profit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
              <select
                value={profileData.company_size}
                onChange={(e) => setProfileData({ ...profileData, company_size: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-accent"
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-heading-bold text-white mb-2">Preferences</h3>
              <p className="text-gray-400 text-sm">How would you like to work with us?</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-accent"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Phoenix">Arizona Time (MST)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Communication</label>
              <select
                value={profileData.communication_preference}
                onChange={(e) => setProfileData({ ...profileData, communication_preference: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-accent"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="video">Video Call</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h4 className="text-white font-medium mb-2">What's Next?</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <Icon name="CheckCircle" size={16} className="text-accent mt-0.5 mr-2 flex-shrink-0" />
                  <span>Access your client dashboard</span>
                </li>
                <li className="flex items-start">
                  <Icon name="CheckCircle" size={16} className="text-accent mt-0.5 mr-2 flex-shrink-0" />
                  <span>View project progress and updates</span>
                </li>
                <li className="flex items-start">
                  <Icon name="CheckCircle" size={16} className="text-accent mt-0.5 mr-2 flex-shrink-0" />
                  <span>Collaborate with your team</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        <FloatingParticles />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        {/* Logo and Header */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={isVisible ? { scale: 1, opacity: 1, rotate: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <Logo 
                variant="icon"
                colorScheme="white"
                linkTo="#"
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
          </div>
          <h1 className="text-4xl font-heading-bold text-white uppercase tracking-wider">
            Welcome to Rule27
          </h1>
          <p className="text-gray-400 mt-2 font-sans">
            Let's get your account set up
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-accent to-red-500 text-white' 
                    : 'bg-white/10 text-gray-500 border border-white/20'
                  }
                `}>
                  {currentStep > step ? <Icon name="Check" size={20} /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 transition-all duration-300 ${
                    currentStep > step ? 'bg-accent' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10"
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </motion.div>

        {/* Skip Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => {
              navigate('/client');
            }}
            className="text-gray-400 hover:text-accent transition-colors text-sm"
          >
            Skip for now →
          </button>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
};

export default ClientSetupProfile;