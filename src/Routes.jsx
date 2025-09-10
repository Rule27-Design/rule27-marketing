// src/Routes.jsx - Updated with correct import paths for admin modules
import React, { useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useNavigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Import event systems for all admin modules
import { useArticleEvents, ARTICLE_EVENTS } from './pages/admin/articles/hooks/useArticleEvents';
import { useCaseStudyEvents, CASE_STUDY_EVENTS } from './pages/admin/case-studies/hooks/useCaseStudyEvents';
import { useServiceEvents, SERVICE_EVENTS } from './pages/admin/services/hooks/useServiceEvents';

// Public Pages
import HomepageExperienceHub from './pages/homepage-experience-hub';
import CapabilityUniverse from './pages/capability-universe';
import InnovationLaboratory from './pages/innovation-laboratory';
import WorkShowcaseTheater from './pages/work-showcase-theater';
import CaseStudyDetail from './pages/case-study-detail';
import ArticlesHub from './pages/articles-hub';
import AboutProcessStudio from './pages/about-process-studio';
import ContactConsultationPortal from './pages/contact-consultation-portal';

// Admin Pages - Updated import paths
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/services/Services'; // Updated path
import AdminArticles from './pages/admin/articles/Articles'; // Already correct
import AdminCaseStudies from './pages/admin/case-studies/CaseStudies'; // Updated path
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
  const { emit: emitArticle } = useArticleEvents();
  const { emit: emitCaseStudy } = useCaseStudyEvents();
  const { emit: emitService } = useServiceEvents();

  React.useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Emit authentication start events to all modules
      emitArticle('auth:callback_started', { timestamp: Date.now() });
      emitCaseStudy('auth:callback_started', { timestamp: Date.now() });
      emitService('auth:callback_started', { timestamp: Date.now() });

      // Get the session from the URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        emitArticle('auth:callback_failed', { error: error.message });
        emitCaseStudy('auth:callback_failed', { error: error.message });
        emitService('auth:callback_failed', { error: error.message });
        navigate('/admin/login');
        return;
      }
      
      if (session) {
        console.log('Session found for:', session.user.email);
        
        // Emit successful authentication events
        const authData = { 
          userId: session.user.id, 
          email: session.user.email 
        };
        emitArticle('auth:session_found', authData);
        emitCaseStudy('auth:session_found', authData);
        emitService('auth:session_found', authData);
        
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
          const profileCreatingData = { userId: session.user.id };
          emitArticle('auth:profile_creating', profileCreatingData);
          emitCaseStudy('auth:profile_creating', profileCreatingData);
          emitService('auth:profile_creating', profileCreatingData);
          
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
            const errorData = { 
              userId: session.user.id, 
              error: createError.message 
            };
            emitArticle('auth:profile_creation_failed', errorData);
            emitCaseStudy('auth:profile_creation_failed', errorData);
            emitService('auth:profile_creation_failed', errorData);
            
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
              
              const linkedData = { profileId: existingProfile.id };
              emitArticle('auth:profile_linked', linkedData);
              emitCaseStudy('auth:profile_linked', linkedData);
              emitService('auth:profile_linked', linkedData);
              handleNavigation(session, existingProfile);
            } else {
              navigate('/admin/login');
            }
          } else {
            const createdData = { profileId: newProfile.id };
            emitArticle('auth:profile_created', createdData);
            emitCaseStudy('auth:profile_created', createdData);
            emitService('auth:profile_created', createdData);
            handleNavigation(session, newProfile);
          }
        } else {
          const foundData = { profileId: profile.id, role: profile.role };
          emitArticle('auth:profile_found', foundData);
          emitCaseStudy('auth:profile_found', foundData);
          emitService('auth:profile_found', foundData);
          handleNavigation(session, profile);
        }
      } else {
        console.log('No session found');
        const noSessionData = {};
        emitArticle('auth:no_session', noSessionData);
        emitCaseStudy('auth:no_session', noSessionData);
        emitService('auth:no_session', noSessionData);
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      const errorData = { error: error.message };
      emitArticle('auth:callback_error', errorData);
      emitCaseStudy('auth:callback_error', errorData);
      emitService('auth:callback_error', errorData);
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

    // Emit navigation decision events
    const navData = {
      userId: session.user.id,
      profileId: profile.id,
      hasPassword,
      isFirstLogin,
      profileCompleted,
      role: profile.role
    };
    emitArticle('auth:navigation_decision', navData);
    emitCaseStudy('auth:navigation_decision', navData);
    emitService('auth:navigation_decision', navData);
    
    // STEP 1: Password setup (for invited users who haven't set password)
    if (!hasPassword && isFirstLogin) {
      console.log('Redirecting to password setup');
      const redirectData = { userId: session.user.id };
      emitArticle('auth:redirect_password_setup', redirectData);
      emitCaseStudy('auth:redirect_password_setup', redirectData);
      emitService('auth:redirect_password_setup', redirectData);
      navigate('/admin/setup-profile?step=password');
    }
    // STEP 2: Profile setup (if password is set but profile not complete)
    else if (!profileCompleted) {
      console.log('Redirecting to profile setup');
      const redirectData = { userId: session.user.id };
      emitArticle('auth:redirect_profile_setup', redirectData);
      emitCaseStudy('auth:redirect_profile_setup', redirectData);
      emitService('auth:redirect_profile_setup', redirectData);
      navigate('/admin/setup-profile?step=profile');
    }
    // STEP 3: Check role access
    else if (profile.role === 'admin' || profile.role === 'contributor') {
      console.log('Redirecting to admin dashboard');
      const redirectData = { 
        userId: session.user.id, 
        role: profile.role 
      };
      emitArticle('auth:redirect_admin', redirectData);
      emitCaseStudy('auth:redirect_admin', redirectData);
      emitService('auth:redirect_admin', redirectData);
      navigate('/admin');
    }
    // STEP 4: No admin access
    else {
      console.log('User has standard role, no admin access');
      const redirectData = { 
        userId: session.user.id, 
        role: profile.role 
      };
      emitArticle('auth:redirect_home', redirectData);
      emitCaseStudy('auth:redirect_home', redirectData);
      emitService('auth:redirect_home', redirectData);
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

// Enhanced Routes Component with Event Integration for all modules
const Routes = ({ session }) => {
  const { emit: emitArticle, subscribeToEvents: subscribeArticle } = useArticleEvents();
  const { emit: emitCaseStudy, subscribeToEvents: subscribeCaseStudy } = useCaseStudyEvents();
  const { emit: emitService, subscribeToEvents: subscribeService } = useServiceEvents();

  // Set up global route change tracking
  useEffect(() => {
    // Track route changes for analytics
    const handleRouteChange = () => {
      const routeData = {
        path: window.location.pathname,
        timestamp: Date.now(),
        session: session?.user?.id || null
      };
      emitArticle('navigation:route_changed', routeData);
      emitCaseStudy('navigation:route_changed', routeData);
      emitService('navigation:route_changed', routeData);
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Emit initial route
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [emitArticle, emitCaseStudy, emitService, session]);

  // Set up session change tracking
  useEffect(() => {
    if (session) {
      const sessionData = {
        userId: session.user.id,
        email: session.user.email,
        timestamp: Date.now()
      };
      emitArticle('session:established', sessionData);
      emitCaseStudy('session:established', sessionData);
      emitService('session:established', sessionData);
    } else {
      const clearedData = {
        timestamp: Date.now()
      };
      emitArticle('session:cleared', clearedData);
      emitCaseStudy('session:cleared', clearedData);
      emitService('session:cleared', clearedData);
    }
  }, [session, emitArticle, emitCaseStudy, emitService]);

  // Set up global error handling for admin routes
  useEffect(() => {
    const unsubscribeArticle = subscribeArticle('admin:error', (error) => {
      console.error('Admin error detected (articles):', error);
    });

    const unsubscribeCaseStudy = subscribeCaseStudy('admin:error', (error) => {
      console.error('Admin error detected (case studies):', error);
    });

    const unsubscribeService = subscribeService('admin:error', (error) => {
      console.error('Admin error detected (services):', error);
    });

    return () => {
      unsubscribeArticle();
      unsubscribeCaseStudy();
      unsubscribeService();
    };
  }, [subscribeArticle, subscribeCaseStudy, subscribeService]);

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
          
          {/* Protected Admin Routes - All event-enabled */}
          <Route path="/admin" element={
            <ProtectedRoute session={session}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
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