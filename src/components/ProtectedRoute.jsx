// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Icon from './AppIcon';

const ProtectedRoute = ({ children, session }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkAuthorization();
  }, [session]);

  const checkAuthorization = async () => {
    try {
      // Check if user is logged in
      if (!session) {
        setLoading(false);
        setAuthorized(false);
        return;
      }

      // Get user profile with role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        setAuthorized(false);
        return;
      }

      // Check if user has admin or contributor role
      if (profile.role === 'admin' || profile.role === 'contributor') {
        setUserProfile(profile);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (error) {
      console.error('Authorization error:', error);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  // Clone children and pass userProfile as prop
  return React.cloneElement(children, { userProfile });
};

export default ProtectedRoute;