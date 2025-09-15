// src/pages/AcceptInvite.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import Logo from '../components/ui/Logo';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const token = searchParams.get('token');

  useEffect(() => {
    setIsVisible(true);
    if (token) {
      validateInvitation();
    }
  }, [token]);

  // Mouse move effect for glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('client_invitations')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !data) {
        setError('Invalid or expired invitation');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired');
        return;
      }

      if (data.status !== 'pending') {
        setError('This invitation has already been used');
        return;
      }

      setInvitation(data);
    } catch (err) {
      setError('Failed to validate invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    navigate(`/login?mode=signup&email=${invitation.email}&invitation=${token}`);
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
          {/* Gradient Mesh */}
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
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Floating Particles */}
        <FloatingParticles />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
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
                linkTo="/"
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
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : error ? (
            <>
              <h1 className="text-4xl font-heading-bold text-white uppercase tracking-wider">
                Invalid Invitation
              </h1>
              <p className="text-gray-400 mt-2 font-sans">
                This invitation link is not valid
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-heading-bold text-white uppercase tracking-wider">
                You're Invited!
              </h1>
              <p className="text-gray-400 mt-2 font-sans">
                Welcome to Rule27 Design Digital Powerhouse
              </p>
            </>
          )}
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10"
        >
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Validating your invitation...</p>
            </div>
          ) : error ? (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-center space-x-3">
                  <Icon name="AlertCircle" size={24} className="text-red-400" />
                  <div>
                    <p className="text-red-400 font-medium">{error}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Please contact your administrator for a new invitation
                    </p>
                  </div>
                </div>
              </motion.div>

              <Button
                type="button"
                variant="default"
                fullWidth
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white font-heading-regular uppercase tracking-wider transform hover:scale-[1.02] transition-all duration-300"
              >
                Go to Login
              </Button>
            </div>
          ) : invitation ? (
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="text-center">
                <h2 className="text-2xl font-heading-bold text-white mb-2">
                  Welcome {invitation.metadata?.full_name?.split(' ')[0] || 'Aboard'}!
                </h2>
                <p className="text-gray-400">
                  You're about to join Rule27 Design on your journey toward something great.
                </p>
              </div>

              {/* Invitation Details */}
              <div className="bg-white/5 rounded-lg p-4 space-y-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Email:</span>
                  <span className="text-white font-medium">{invitation.email}</span>
                </div>
                {invitation.metadata?.company_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Company:</span>
                    <span className="text-white font-medium">{invitation.metadata.company_name}</span>
                  </div>
                )}
                {invitation.metadata?.invited_by_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Invited by:</span>
                    <span className="text-white font-medium">{invitation.metadata.invited_by_name}</span>
                  </div>
                )}
              </div>

              {/* Personal Message */}
              {invitation.metadata?.personal_message && (
                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <p className="text-sm text-gray-300 italic">
                    "{invitation.metadata.personal_message}"
                  </p>
                </div>
              )}

              {/* What's Next */}
              <div className="space-y-3">
                <h3 className="text-white font-heading-regular uppercase tracking-wider text-sm">
                  What happens next?
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-accent mt-0.5" />
                    <p className="text-gray-400 text-sm">Create your secure account</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-accent mt-0.5" />
                    <p className="text-gray-400 text-sm">Access project dashboards</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-accent mt-0.5" />
                    <p className="text-gray-400 text-sm">Collaborate with your team</p>
                  </div>
                </div>
              </div>

              {/* Accept Button */}
              <Button
                type="button"
                variant="default"
                fullWidth
                onClick={handleAccept}
                className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white font-heading-regular uppercase tracking-wider transform hover:scale-[1.02] transition-all duration-300"
                iconName="ArrowRight"
              >
                Accept Invitation
              </Button>

              {/* Expiry Notice */}
              <p className="text-center text-gray-500 text-xs">
                This invitation expires on {new Date(invitation.expires_at).toLocaleDateString()}
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* Bottom Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="flex justify-center space-x-6 text-sm">
            <Link 
              to="/" 
              className="text-gray-400 hover:text-accent transition-colors flex items-center space-x-1"
            >
              <Icon name="Home" size={14} />
              <span>Home</span>
            </Link>
            <Link 
              to="/login" 
              className="text-gray-400 hover:text-accent transition-colors flex items-center space-x-1"
            >
              <Icon name="LogIn" size={14} />
              <span>Login</span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-400 hover:text-accent transition-colors flex items-center space-x-1"
            >
              <Icon name="MessageCircle" size={14} />
              <span>Support</span>
            </Link>
          </div>
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

export default AcceptInvite;