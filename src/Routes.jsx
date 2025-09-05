import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomepageExperienceHub from './pages/homepage-experience-hub';
import CapabilityUniverse from './pages/capability-universe';
import InnovationLaboratory from './pages/innovation-laboratory';
import WorkShowcaseTheater from './pages/work-showcase-theater';
import CaseStudyDetail from './pages/case-study-detail'; // ADD THIS
import ArticlesHub from './pages/articles-hub';
import AboutProcessStudio from './pages/about-process-studio';
import ContactConsultationPortal from './pages/contact-consultation-portal';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<HomepageExperienceHub />} />
        <Route path="/capabilities" element={<CapabilityUniverse />} />
        <Route path="/innovation" element={<InnovationLaboratory />} />
        <Route path="/work" element={<WorkShowcaseTheater />} />
        <Route path="/case-study/:slug" element={<CaseStudyDetail />} /> {/* ADD THIS */}
        <Route path="/articles" element={<ArticlesHub />} />
        <Route path="/about" element={<AboutProcessStudio />} />
        <Route path="/contact" element={<ContactConsultationPortal />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;