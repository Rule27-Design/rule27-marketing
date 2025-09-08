// src/Routes.jsx - Updated with event integration and enhanced auth handling
import React, { useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useNavigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import { useArticleEvents, ARTICLE_EVENTS } from './pages/admin/articles/hooks/useArticleEvents.js';

// Public Pages
import HomepageExperienceHub from './pages/homepage-experience-hub';
import CapabilityUniverse from './pages/capability-universe';
import InnovationLaboratory from './pages/innovation-laboratory';
import WorkShowcaseTheater from './pages/work-showcase-theater';
import CaseStudyDetail from './pages/case-study-detail';
import ArticlesHub from './pages/articles-hub';
import AboutProcessStudio from './pages/about-process-studio';
import ContactConsultationPortal from './pages/contact-consultation-portal';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminArticles from './pages/admin/articles/Articles'
import AdminCaseStudies from './pages/admin/CaseStudies';
import AdminProfiles from './pages/admin/Profiles';
import AdminLeads from './pages/admin/Leads';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminLogin from './pages/admin/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SetupProfile from './pages/admin/SetupProfile';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import { supabase } from './lib/supabase';

// Auth Callback Component with Event Integration
const AuthCallback = () => {
  const navigate = useNavigate();
  const { emit } = useArticleEvents();

  React.useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Emit authentication start event
      emit('auth:callback_started', { timestamp: Date.now() });

      // Get the session from the URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        emit('auth:callback_failed', { error: error.message });
        navigate('/admin/login');
        return;
      }
      
      if (session) {
        console.log('Session found for:', session.user.email);
        
        // Emit successful authentication event
        emit('auth:session_found', { 
          userId: session.user.id, 
          email: session.user.email 
        });
        
        // Wait a moment for the trigger to create/update the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check user profile and role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }
        
        // If no profile exists, create one
        if (!profile) {
          console.log('Creating profile for new user');
          emit('auth:profile_creating', { userId: session.user.id });
          
          const userData = session.user.user_metadata;
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              auth_user_id: session.user.id,
              email: session.user.email,
              full_name: userData?.full_name || session.user.email.split('@')[0],
              role: userData?.role || 'standard',
              is_active: true,
              is_public: false,
              onboarding_completed: false
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Profile creation error:', createError);
            emit('auth:profile_creation_failed', { 
              userId: session.user.id, 
              error: createError.message 
            });
            
            // Try to fetch existing profile by email
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', session.user.email)
              .single();
            
            if (existingProfile) {
              // Update it to link with auth
              await supabase
                .from('profiles')
                .update({ auth_user_id: session.user.id })
                .eq('id', existingProfile.id);
              
              emit('auth:profile_linked', { profileId: existingProfile.id });
              handleNavigation(session, existingProfile);
            } else {
              navigate('/admin/login');
            }
          } else {
            emit('auth:profile_created', { profileId: newProfile.id });
            handleNavigation(session, newProfile);
          }
        } else {
          emit('auth:profile_found', { profileId: profile.id, role: profile.role });
          handleNavigation(session, profile);
        }
      } else {
        console.log('No session found');
        emit('auth:no_session', {});
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      emit('auth:callback_error', { error: error.message });
      navigate('/admin/login');
    }
  };

  const handleNavigation = async (session, profile) => {
    const userData = session.user.user_metadata;
    const hasPassword = userData?.has_password === true;
    const isFirstLogin = userData?.first_login !== false;
    const profileCompleted = profile.onboarding_completed === true;
    
    console.log('Navigation decision:', {
      hasPassword,
      isFirstLogin,
      profileCompleted,
      role: profile.role
    });

    // Emit navigation decision event
    emit('auth:navigation_decision', {
      userId: session.user.id,
      profileId: profile.id,
      hasPassword,
      isFirstLogin,
      profileCompleted,
      role: profile.role
    });
    
    // STEP 1: Password setup (for invited users who haven't set password)
    if (!hasPassword && isFirstLogin) {
      console.log('Redirecting to password setup');
      emit('auth:redirect_password_setup', { userId: session.user.id });
      navigate('/admin/setup-profile?step=password');
    }
    // STEP 2: Profile setup (if password is set but profile not complete)
    else if (!profileCompleted) {
      console.log('Redirecting to profile setup');
      emit('auth:redirect_profile_setup', { userId: session.user.id });
      navigate('/admin/setup-profile?step=profile');
    }
    // STEP 3: Check role access
    else if (profile.role === 'admin' || profile.role === 'contributor') {
      console.log('Redirecting to admin dashboard');
      emit('auth:redirect_admin', { 
        userId: session.user.id, 
        role: profile.role 
      });
      navigate('/admin');
    }
    // STEP 4: No admin access
    else {
      console.log('User has standard role, no admin access');
      emit('auth:redirect_home', { 
        userId: session.user.id, 
        role: profile.role 
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait...</p>
      </div>
    </div>
  );
};

// Enhanced Routes Component with Event Integration
const Routes = ({ session }) => {
  const { emit, subscribe } = useArticleEvents();

  // Set up global route change tracking
  useEffect(() => {
    // Track route changes for analytics
    const handleRouteChange = () => {
      emit('navigation:route_changed', {
        path: window.location.pathname,
        timestamp: Date.now(),
        session: session?.user?.id || null
      });
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Emit initial route
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [emit, session]);

  // Set up session change tracking
  useEffect(() => {
    if (session) {
      emit('session:established', {
        userId: session.user.id,
        email: session.user.email,
        timestamp: Date.now()
      });
    } else {
      emit('session:cleared', {
        timestamp: Date.now()
      });
    }
  }, [session, emit]);

  // Set up global error handling for admin routes
  useEffect(() => {
    const unsubscribe = subscribe('admin:error', (error) => {
      console.error('Admin error detected:', error);
      // Could implement global error handling here
    });

    return unsubscribe;
  }, [subscribe]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<HomepageExperienceHub />} />
          <Route path="/capabilities" element={<CapabilityUniverse />} />
          <Route path="/innovation" element={<InnovationLaboratory />} />
          <Route path="/work" element={<WorkShowcaseTheater />} />
          <Route path="/case-study/:slug" element={<CaseStudyDetail />} />
          <Route path="/articles" element={<ArticlesHub />} />
          <Route path="/about" element={<AboutProcessStudio />} />
          <Route path="/contact" element={<ContactConsultationPortal />} />
          
          {/* Auth Routes */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Admin Auth Routes (Outside of protected routes) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup-profile" element={<SetupProfile />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          
          {/* Protected Admin Routes - Event-enabled */}
          <Route path="/admin" element={
            <ProtectedRoute session={session}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            {/* Articles route - fully event-enabled */}
            <Route path="articles" element={<AdminArticles />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;