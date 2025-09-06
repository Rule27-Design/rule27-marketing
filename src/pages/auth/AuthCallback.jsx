// src/pages/auth/AuthCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Get the session from the URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // Check if this is a first-time login (invited user)
        const isFirstLogin = session.user.user_metadata?.first_login !== false;
        const needsPasswordSetup = !session.user.user_metadata?.has_password;
        
        // Determine where to redirect
        if (!profile) {
          // No profile exists - shouldn't happen with trigger, but handle it
          navigate('/admin/setup-profile?step=1');
        } else if (isFirstLogin || needsPasswordSetup) {
          // First time user or needs password - go to setup
          navigate('/admin/setup-profile?step=password');
        } else if (!profile.onboarding_completed) {
          // Profile exists but onboarding not complete
          navigate('/admin/setup-profile?step=1');
        } else if (profile.role === 'admin' || profile.role === 'contributor') {
          // Established user with admin access
          navigate('/admin');
        } else {
          // Standard user - no admin access
          navigate('/no-access');
        }
      } else {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      setError(error.message);
      setTimeout(() => navigate('/admin/login'), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-red-600 mb-2">Authentication Error</p>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-xs text-gray-500 mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;