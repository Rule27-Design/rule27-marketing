// src/App.jsx - Marketing Site Version (No Auth)
import React, { useEffect } from "react";
import Routes from "./Routes";
import Hotjar from '@hotjar/browser';
import ReactGA from 'react-ga4';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { EventBusProvider } from './components/providers/EventBusProvider.jsx';

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (GA_ID) {
      ReactGA.initialize(GA_ID);
      // Track initial page view
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }

    // Initialize Hotjar
    const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
    if (HOTJAR_ID) {
      Hotjar.init(parseInt(HOTJAR_ID), 6);
    }

    console.log('Site Initialized');
  }, []);

  return (
    <ErrorBoundary
      message="We're sorry, but something went wrong. Please refresh the page or try again later."
    >
      <ToastProvider>
        <EventBusProvider>
          <Routes />
        </EventBusProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
