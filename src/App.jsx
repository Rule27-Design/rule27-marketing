import React, { useEffect } from "react";
import Routes from "./Routes";
import Hotjar from '@hotjar/browser';
import ReactGA from 'react-ga4';

function App() {
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
  }, []);

  return (
    <Routes />
  );
}

export default App;