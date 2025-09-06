// src/Routes.jsx - Updated with Admin routes
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
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
import AdminArticles from './pages/admin/Articles';
import AdminCaseStudies from './pages/admin/CaseStudies';
import AdminProfiles from './pages/admin/Profiles';
import AdminLeads from './pages/admin/Leads';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminLogin from './pages/admin/Login';
import ProtectedRoute from './components/ProtectedRoute';

const Routes = ({ session }) => {
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
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
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
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;