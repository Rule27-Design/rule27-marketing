// src/App.jsx - Updated with EventBusProvider and enhanced error handling
import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import Hotjar from '@hotjar/browser';
import ReactGA from 'react-ga4';
import { supabase } from './lib/supabase';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { EventBusProvider } from './components/providers/EventBusProvider.jsx';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Analytics
    const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (GA_ID) {
      ReactGA.initialize(GA_ID);
    }

    // Initialize Hotjar
    const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
    if (HOTJAR_ID) {
      Hotjar.init(parseInt(HOTJAR_ID), 6);
    }

    // Handle Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      // Check if we're coming from a magic link for admin
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      if (accessToken && type === 'magiclink') {
        // Check if user should go to admin
        if (window.location.pathname === '/' || window.location.pathname === '/admin/login') {
          checkAdminAccess(session);
        }
        // Clear the hash after handling
        window.history.replaceState(null, '', window.location.pathname);
      } else if (window.location.hash.includes('access_token')) {
        // Handle other auth callbacks
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      // If just logged in and on homepage or login page, check for admin access
      if (_event === 'SIGNED_IN') {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/admin/login') {
          await checkAdminAccess(session);
        }
      }
      
      // Clear URL hash after auth
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to check admin access and redirect
  const checkAdminAccess = async (session) => {
    if (!session) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('auth_user_id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      // If user has admin/contributor role, redirect to admin
      if (profile && (profile.role === 'admin' || profile.role === 'contributor')) {
        // Use window.location.href for a full page navigation
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      message="We're sorry, but something went wrong. Please refresh the page or try again later."
    >
      <ToastProvider>
        {/* Wrap Routes with EventBusProvider for event-driven communication */}
        <EventBusProvider>
          <Routes session={session} />
        </EventBusProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;