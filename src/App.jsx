// src/App.jsx - Marketing Site Version with Larry ChatBot
import React, { useEffect, useState, useRef } from "react";
import Routes from "./Routes";
import Hotjar from '@hotjar/browser';
import ReactGA from 'react-ga4';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { EventBusProvider } from './components/providers/EventBusProvider.jsx';
import ChatBotWidget from './components/ChatBotWidget';
import { supabase } from './lib/supabase';

function App() {
  const [chatbotReady, setChatbotReady] = useState(false);
  const [chatbotConfig, setChatbotConfig] = useState({
    position: 'bottom-right',
    primaryColor: '#E53E3E',
    companyName: 'Rule27 Design',
    autoOpen: false,
    customWelcome: null
  });
  
  // Track current page for context
  const currentPath = useRef(window.location.pathname);

  useEffect(() => {
    // Initialize Google Analytics
    const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (GA_ID) {
      ReactGA.initialize(GA_ID);
      // Track initial page view
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
      
      // Set up Larry event tracking
      window.addEventListener('chatbot:opened', (e) => {
        ReactGA.event({
          category: 'Larry_ChatBot',
          action: 'Opened',
          label: `From_${currentPath.current}`
        });
      });
      
      window.addEventListener('chatbot:message', (e) => {
        ReactGA.event({
          category: 'Larry_ChatBot',
          action: 'Message_Sent',
          label: e.detail?.intent || 'User_Message',
          value: e.detail?.leadScore
        });
      });
    }

    // Initialize Hotjar
    const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
    if (HOTJAR_ID) {
      Hotjar.init(parseInt(HOTJAR_ID), 6);
      
      // Track Larry interactions in Hotjar
      window.addEventListener('chatbot:opened', () => {
        if (window.hj) {
          window.hj('event', 'larry_chat_opened');
        }
      });
      
      window.addEventListener('chatbot:message', () => {
        if (window.hj) {
          window.hj('event', 'larry_message_sent');
        }
      });
    }

    console.log('Site Initialized');

    // Initialize Larry after a slight delay for better UX
    const initTimer = setTimeout(() => {
      setChatbotReady(true);
      console.log('🤖 Larry ChatBot Ready!');
      
      // Check if should auto-open on certain pages
      const path = window.location.pathname;
      if (path === '/contact' || path === '/pricing') {
        setChatbotConfig(prev => ({ ...prev, autoOpen: true }));
      }
    }, 2000); // 2 second delay

    // Clean up
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('chatbot:opened', () => {});
      window.removeEventListener('chatbot:message', () => {});
    };
  }, []);

  // Update chatbot context when route changes
  useEffect(() => {
    const updateChatbotContext = () => {
      const path = window.location.pathname;
      currentPath.current = path;
      
      // Get page-specific welcome message and behavior
      const config = getPageSpecificConfig(path);
      setChatbotConfig(prev => ({
        ...prev,
        ...config
      }));
    };

    // Listen for route changes
    window.addEventListener('popstate', updateChatbotContext);
    window.addEventListener('pushstate', updateChatbotContext);
    window.addEventListener('replacestate', updateChatbotContext);
    
    // Override history methods to catch programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      updateChatbotContext();
    };
    
    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      updateChatbotContext();
    };

    return () => {
      window.removeEventListener('popstate', updateChatbotContext);
      window.removeEventListener('pushstate', updateChatbotContext);
      window.removeEventListener('replacestate', updateChatbotContext);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Helper function to get page-specific configuration
  function getPageSpecificConfig(pathname) {
    // Parse the pathname to understand context
    const pathSegments = pathname.split('/').filter(Boolean);
    const primaryPath = pathSegments[0] || 'home';
    const secondaryPath = pathSegments[1];
    
    const configs = {
      // Home page
      'home': {
        customWelcome: "👋 Hey! I'm Larry, your Rule27 AI assistant. Looking to transform your digital presence? I can show you how we combine marketing AND development expertise - something most agencies can't do. What's your biggest digital challenge right now?",
        autoOpen: false
      },
      
      // Services/Capabilities page
      'capabilities': {
        customWelcome: "🚀 I see you're exploring our capabilities! I'm Larry, and I can help you understand our unique dual expertise in both marketing AND development. Which service caught your eye? Web development, mobile apps, digital marketing, or something else?",
        autoOpen: false
      },
      
      // Case Studies
      'case-studies': {
        customWelcome: secondaryPath 
          ? `📊 Impressive work, right? I'm Larry! I can share insights about this ${formatCaseStudyName(secondaryPath)} project or help you envision similar results for your business. What aspects interest you most - the strategy, execution, or results?`
          : "📊 Checking out our portfolio? I'm Larry! With 500+ successful projects across marketing and development, I can help you find relevant examples for your industry. What type of project are you planning?",
        autoOpen: false
      },
      
      // Pricing page
      'pricing': {
        customWelcome: "💰 I'm Larry, here to help you understand our pricing! Our packages range from Growth ($25K-50K) to Enterprise (custom). I can also create a tailored quote based on your specific needs. What's your project timeline and budget range?",
        autoOpen: true // Auto-open on pricing page
      },
      
      // Contact page
      'contact': {
        customWelcome: "📞 Ready to start something amazing? I'm Larry! I can schedule a consultation with our team right now, or answer any immediate questions. Would you prefer a call this week or next week?",
        autoOpen: true // Auto-open on contact page
      },
      
      // About page
      'about': {
        customWelcome: "🎯 Want to know what makes Rule27 different? I'm Larry! We've been dominating digital for 12+ years with our unique dual expertise. Our 27+ certified experts don't just talk strategy - they execute. What would you like to know about our team or approach?",
        autoOpen: false
      },
      
      // Blog/Articles
      'blog': {
        customWelcome: secondaryPath
          ? `📚 Great article choice! I'm Larry, and I can discuss the insights from this post or help you apply these strategies to your business. What resonated with you most?`
          : "📚 Welcome to our knowledge hub! I'm Larry, and I can help you find insights on marketing, development, or business growth. What topics interest you?",
        autoOpen: false
      },
      
      // Resources
      'resources': {
        customWelcome: "📖 Looking for tools and guides? I'm Larry! I can help you find the perfect resources for your project, from templates to frameworks. What are you trying to accomplish?",
        autoOpen: false
      },
      
      // Portfolio
      'portfolio': {
        customWelcome: "🎨 Exploring our creative work? I'm Larry! Each project showcases our dual expertise in design and development. Which industry or project type matches your vision?",
        autoOpen: false
      },
      
      // Methodology
      'methodology': {
        customWelcome: "⚙️ Interested in our process? I'm Larry! Our proven methodology combines agile development with data-driven marketing. Where are you in your project journey - planning, execution, or scaling?",
        autoOpen: false
      },
      
      // Default for unknown pages
      'default': {
        customWelcome: "👋 Hey there! I'm Larry, your Rule27 AI assistant. I can help you explore our marketing and development services, or connect you with our team. What brings you here today?",
        autoOpen: false
      }
    };
    
    // Special handling for service zone pages
    if (pathname.includes('/capabilities/') || pathname.includes('/services/')) {
      const serviceName = formatServiceName(secondaryPath);
      return {
        customWelcome: `💡 Interested in ${serviceName}? I'm Larry! This is one of our specialty areas where we excel. I can share case studies, explain our process, or get you a custom quote. What specific goals do you have for this project?`,
        autoOpen: false
      };
    }
    
    return configs[primaryPath] || configs['default'];
  }

  // Helper function to format case study names
  function formatCaseStudyName(slug) {
    if (!slug) return 'project';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Helper function to format service names
  function formatServiceName(slug) {
    if (!slug) return 'our services';
    const serviceMap = {
      'web-development': 'Web Development',
      'mobile-apps': 'Mobile App Development',
      'digital-marketing': 'Digital Marketing',
      'seo': 'SEO Services',
      'branding': 'Branding & Design',
      'ecommerce': 'E-commerce Solutions',
      'automation': 'Marketing Automation',
      'analytics': 'Analytics & Insights'
    };
    return serviceMap[slug] || formatCaseStudyName(slug);
  }

  return (
    <ErrorBoundary
      message="We're sorry, but something went wrong. Please refresh the page or try again later."
    >
      <ToastProvider>
        <EventBusProvider>
          {/* Main Application Routes */}
          <Routes />
          
          {/* Larry ChatBot Widget - Persistent across all pages */}
          {chatbotReady && (
            <ChatBotWidget 
              key="larry-chatbot" // Key ensures it doesn't remount
              supabaseClient={supabase}
              {...chatbotConfig}
            />
          )}
          
          {/* Loading indicator while Larry initializes */}
          {!chatbotReady && (
            <div className="fixed bottom-6 right-6 z-40">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-pulse flex items-center space-x-2">
                <span className="animate-spin">⚡</span>
                <span>Larry is getting ready...</span>
              </div>
            </div>
          )}
        </EventBusProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;