// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Icon from './AppIcon';

const ProtectedRoute = ({ children, session, requiredRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuthorization();
  }, [session, requiredRoles]);

  const checkAuthorization = async () => {
    try {
      // First check if we have a session
      let currentSession = session;
      
      // If no session prop, get it from Supabase
      if (!currentSession) {
        const { data: { session: authSession } } = await supabase.auth.getSession();
        currentSession = authSession;
      }
      
      if (!currentSession) {
        setLoading(false);
        setAuthorized(false);
        return;
      }

      // Get user profile with role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', currentSession.user.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        setAuthorized(false);
        return;
      }

      setUserProfile(profile);
      setUserRole(profile.role);

      // Check if user's role matches required roles
      if (requiredRoles.length > 0) {
        // If specific roles are required, check if user has one of them
        const hasRequiredRole = requiredRoles.includes(profile.role);
        setAuthorized(hasRequiredRole);
      } else {
        // If no specific roles required (backward compatibility)
        // Default to admin, contributor, and client_manager for admin routes
        const adminRoles = ['admin', 'contributor', 'client_manager'];
        setAuthorized(adminRoles.includes(profile.role));
      }

      // Check if onboarding is completed (unless on setup-profile page)
      if (!profile.onboarding_completed && !window.location.pathname.includes('setup-profile')) {
        console.log('Profile onboarding not completed');
        // Don't block access to setup-profile page
        if (!window.location.pathname.includes('setup-profile')) {
          setAuthorized(false);
        }
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
    // Determine where to redirect based on context
    if (!session) {
      // No session - go to login
      return <Navigate to="/login" replace />;
    } else if (userRole === 'standard') {
      // Standard users trying to access admin - redirect to client portal
      return <Navigate to="/client" replace />;
    } else if (userRole && !requiredRoles.includes(userRole)) {
      // User has a role but not the required one
      if (userRole === 'admin' || userRole === 'contributor' || userRole === 'client_manager') {
        // Admin users without access to specific area
        return <Navigate to="/admin" replace />;
      } else {
        // Other users - go home
        return <Navigate to="/" replace />;
      }
    } else if (!userProfile?.onboarding_completed) {
      // Onboarding not complete
      return <Navigate to="/admin/setup-profile" replace />;
    } else {
      // Default to login
      return <Navigate to="/login" replace />;
    }
  }

  // Clone children and pass userProfile as prop
  return React.cloneElement(children, { userProfile, setUserProfile });
};

export default ProtectedRoute;