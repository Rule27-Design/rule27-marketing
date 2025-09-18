import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";

// Public Marketing Pages
import HomepageExperienceHub from './pages/homepage-experience-hub';
import CapabilityUniverse from './pages/capability-universe';
import InnovationLaboratory from './pages/innovation-laboratory';
import WorkShowcaseTheater from './pages/work-showcase-theater';
import CaseStudyDetail from './pages/case-study-detail';
import ArticlesHub from './pages/articles-hub';
import AboutProcessStudio from './pages/about-process-studio';
import ContactConsultationPortal from './pages/contact-consultation-portal';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<HomepageExperienceHub />} />
          <Route path="/capabilities" element={<CapabilityUniverse />} />
          <Route path="/innovation" element={<InnovationLaboratory />} />
          <Route path="/case-studies" element={<WorkShowcaseTheater />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/articles" element={<ArticlesHub />} />
          <Route path="/about" element={<AboutProcessStudio />} />
          <Route path="/contact" element={<ContactConsultationPortal />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
