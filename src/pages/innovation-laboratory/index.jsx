import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import ExperimentalFeatures from './components/ExperimentalFeatures';
import TrendAnalysis from './components/TrendAnalysis';
import InteractiveTools from './components/InteractiveTools';
import ThoughtLeadership from './components/ThoughtLeadership';
import ResourceHub from './components/ResourceHub';

const InnovationLaboratory = () => {
  return (
    <>
      <Helmet>
        <title>Innovation Laboratory - Rule27 Digital Powerhouse</title>
        <meta name="description" content="Explore cutting-edge experimental features, emerging technology demonstrations, and forward-thinking insights at Rule27's Innovation Laboratory. Interactive tools, trend analysis, and thought leadership content." />
        <meta name="keywords" content="innovation lab, experimental features, AI tools, trend analysis, design trends, technology predictions, interactive tools, thought leadership" />
        <meta property="og:title" content="Innovation Laboratory - Rule27 Digital Powerhouse" />
        <meta property="og:description" content="Where tomorrow begins. Experimental features, emerging technologies, and forward-thinking insights that shape the future of digital experiences." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Innovation Laboratory - Rule27 Digital Powerhouse" />
        <meta name="twitter:description" content="Cutting-edge tools and technologies that push the boundaries of what's possible in digital design and development." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        
        <main>
          <HeroSection />
          <ExperimentalFeatures />
          <TrendAnalysis />
          <InteractiveTools />
          <ThoughtLeadership />
          <ResourceHub />
        </main>
      </div>
    </>
  );
};

export default InnovationLaboratory;