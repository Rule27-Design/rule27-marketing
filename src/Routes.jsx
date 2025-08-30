import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomepageExperienceHub from './pages/homepage-experience-hub';
import CapabilityUniverse from './pages/capability-universe';
import InnovationLaboratory from './pages/innovation-laboratory';
import WorkShowcaseTheater from './pages/work-showcase-theater';
import ArticlesHub from './pages/articles-hub';
import AboutProcessStudio from './pages/about-process-studio';
import ContactConsultationPortal from './pages/contact-consultation-portal';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HomepageExperienceHub />} />
        <Route path="/homepage-experience-hub" element={<HomepageExperienceHub />} />
        <Route path="/capability-universe" element={<CapabilityUniverse />} />
        <Route path="/innovation-laboratory" element={<InnovationLaboratory />} />
        <Route path="/work-showcase-theater" element={<WorkShowcaseTheater />} />
        <Route path="/articles-hub" element={<ArticlesHub />} />
        <Route path="/about-process-studio" element={<AboutProcessStudio />} />
        <Route path="/contact-consultation-portal" element={<ContactConsultationPortal />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;