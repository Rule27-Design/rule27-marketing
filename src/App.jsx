import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import Hotjar from '@hotjar/browser';
import ReactGA from 'react-ga4';
import { supabase } from './lib/supabase';

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
      
      // If we just logged in from an invite, clear the URL hash
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Clear URL hash after auth
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Routes session={session} />;
}

export default App;