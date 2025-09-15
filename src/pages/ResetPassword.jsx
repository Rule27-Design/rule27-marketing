// src/pages/ResetPassword.jsx (moved from admin folder)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import Logo from '../components/ui/Logo';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [session, setSession] = useState(null);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    } else {
      setSession(session);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      // Get user profile to determine where to redirect
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('auth_user_id', session.user.id)
          .single();

        if (profile) {
          // Route based on role
          if (profile.role === 'admin' || profile.role === 'contributor') {
            navigate('/admin');
          } else if (profile.role === 'standard') {
            navigate('/client');
          } else {
            navigate('/');
          }
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Mouse Follower Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 62, 62, 0.15), transparent 40%)`,
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo 
            variant="icon"
            colorScheme="white"
            linkTo="/"
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-heading-bold text-white uppercase">Set New Password</h1>
          <p className="text-gray-400 mt-2">Choose a strong password for your account</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <Input
              type="password"
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
              labelClassName="text-gray-300"
            />

            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
              className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
              labelClassName="text-gray-300"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={loading}
              disabled={loading || !password || !confirmPassword}
              className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white"
              iconName="Lock"
            >
              Update Password
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;