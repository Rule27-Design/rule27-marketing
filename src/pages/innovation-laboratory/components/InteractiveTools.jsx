import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InteractiveTools = () => {
  const [activeTool, setActiveTool] = useState('brand-analyzer');
  const [brandAnalysis, setBrandAnalysis] = useState({
    brandName: '',
    industry: '',
    targetAudience: '',
    results: null
  });
  const [roiCalculation, setRoiCalculation] = useState({
    currentRevenue: '',
    marketingBudget: '',
    conversionRate: '',
    results: null
  });

  const tools = [
    {
      id: 'brand-analyzer',
      title: 'AI Brand Analyzer',
      description: 'Get instant insights into your brand positioning and competitive landscape',
      icon: 'Brain',
      color: 'from-blue-500 to-cyan-500',
      category: 'Brand Strategy'
    },
    {
      id: 'roi-calculator',
      title: 'ROI Calculator',
      description: 'Calculate potential return on investment for your digital transformation',
      icon: 'Calculator',
      color: 'from-green-500 to-emerald-500',
      category: 'Financial Planning'
    },
    {
      id: 'design-generator',
      title: 'Design System Generator',
      description: 'Create a comprehensive design system based on your brand guidelines',
      icon: 'Palette',
      color: 'from-purple-500 to-pink-500',
      category: 'Design Tools'
    },
    {
      id: 'performance-audit',
      title: 'Performance Auditor',
      description: 'Comprehensive analysis of your website performance and optimization opportunities',
      icon: 'Zap',
      color: 'from-orange-500 to-red-500',
      category: 'Technical Analysis'
    }
  ];

  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Retail' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' }
  ];

  const audienceOptions = [
    { value: 'b2b', label: 'B2B Decision Makers' },
    { value: 'consumers', label: 'General Consumers' },
    { value: 'millennials', label: 'Millennials' },
    { value: 'gen-z', label: 'Gen Z' },
    { value: 'enterprise', label: 'Enterprise Clients' },
    { value: 'startups', label: 'Startups' }
  ];

  const handleBrandAnalysis = () => {
    // Simulate AI analysis
    setTimeout(() => {
      setBrandAnalysis(prev => ({
        ...prev,
        results: {
          brandStrength: Math.floor(Math.random() * 30) + 70,
          marketPosition: ['Leader', 'Challenger', 'Follower']?.[Math.floor(Math.random() * 3)],
          opportunities: [
            'Digital presence optimization',
            'Content marketing expansion',
            'Social media engagement',
            'Brand consistency improvement'
          ],
          threats: [
            'Increasing competition',
            'Market saturation',
            'Changing consumer preferences'
          ],
          recommendations: [
            'Invest in digital transformation',
            'Strengthen brand messaging',
            'Expand market reach',
            'Improve customer experience'
          ]
        }
      }));
    }, 2000);
  };

  const handleROICalculation = () => {
    const revenue = parseFloat(roiCalculation?.currentRevenue) || 0;
    const budget = parseFloat(roiCalculation?.marketingBudget) || 0;
    const conversion = parseFloat(roiCalculation?.conversionRate) || 0;

    const projectedIncrease = revenue * 0.25; // 25% increase assumption
    const roi = ((projectedIncrease - budget) / budget) * 100;

    setRoiCalculation(prev => ({
      ...prev,
      results: {
        currentROI: roi?.toFixed(1),
        projectedRevenue: (revenue + projectedIncrease)?.toLocaleString(),
        paybackPeriod: Math.ceil(budget / (projectedIncrease / 12)),
        recommendations: [
          'Focus on high-converting channels',
          'Optimize conversion funnel',
          'Implement marketing automation',
          'A/B test key touchpoints'
        ]
      }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const renderToolInterface = () => {
    switch (activeTool) {
      case 'brand-analyzer':
        return (
          <div className="space-y-6">
            <Input
              label="Brand Name"
              type="text"
              placeholder="Enter your brand name"
              value={brandAnalysis?.brandName}
              onChange={(e) => setBrandAnalysis(prev => ({ ...prev, brandName: e?.target?.value }))}
            />
            <Select
              label="Industry"
              placeholder="Select your industry"
              options={industryOptions}
              value={brandAnalysis?.industry}
              onChange={(value) => setBrandAnalysis(prev => ({ ...prev, industry: value }))}
            />
            <Select
              label="Target Audience"
              placeholder="Select your primary audience"
              options={audienceOptions}
              value={brandAnalysis?.targetAudience}
              onChange={(value) => setBrandAnalysis(prev => ({ ...prev, targetAudience: value }))}
            />
            <Button
              variant="default"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              onClick={handleBrandAnalysis}
              disabled={!brandAnalysis?.brandName || !brandAnalysis?.industry}
              iconName="Brain"
              iconPosition="left"
            >
              Analyze Brand
            </Button>
            {brandAnalysis?.results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-6 mt-6"
              >
                <h4 className="text-lg font-bold text-black mb-4">Analysis Results</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent mb-1">
                      {brandAnalysis?.results?.brandStrength}%
                    </div>
                    <div className="text-sm text-gray-600">Brand Strength Score</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-bold text-black mb-1">
                      {brandAnalysis?.results?.marketPosition}
                    </div>
                    <div className="text-sm text-gray-600">Market Position</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-black mb-2">Key Opportunities</h5>
                    <ul className="space-y-1">
                      {brandAnalysis?.results?.opportunities?.map((opportunity, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-black mb-2">Recommendations</h5>
                    <ul className="space-y-1">
                      {brandAnalysis?.results?.recommendations?.map((rec, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <Icon name="ArrowRight" size={16} className="text-accent mr-2" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 'roi-calculator':
        return (
          <div className="space-y-6">
            <Input
              label="Current Annual Revenue"
              type="number"
              placeholder="Enter current revenue ($)"
              value={roiCalculation?.currentRevenue}
              onChange={(e) => setRoiCalculation(prev => ({ ...prev, currentRevenue: e?.target?.value }))}
            />
            <Input
              label="Marketing Budget"
              type="number"
              placeholder="Enter marketing budget ($)"
              value={roiCalculation?.marketingBudget}
              onChange={(e) => setRoiCalculation(prev => ({ ...prev, marketingBudget: e?.target?.value }))}
            />
            <Input
              label="Current Conversion Rate"
              type="number"
              placeholder="Enter conversion rate (%)"
              value={roiCalculation?.conversionRate}
              onChange={(e) => setRoiCalculation(prev => ({ ...prev, conversionRate: e?.target?.value }))}
            />
            <Button
              variant="default"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              onClick={handleROICalculation}
              disabled={!roiCalculation?.currentRevenue || !roiCalculation?.marketingBudget}
              iconName="Calculator"
              iconPosition="left"
            >
              Calculate ROI
            </Button>
            {roiCalculation?.results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-6 mt-6"
              >
                <h4 className="text-lg font-bold text-black mb-4">ROI Projection</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent mb-1">
                      {roiCalculation?.results?.currentROI}%
                    </div>
                    <div className="text-sm text-gray-600">Projected ROI</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-bold text-black mb-1">
                      ${roiCalculation?.results?.projectedRevenue}
                    </div>
                    <div className="text-sm text-gray-600">Projected Revenue</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-bold text-black mb-1">
                      {roiCalculation?.results?.paybackPeriod} months
                    </div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-black mb-2">Optimization Recommendations</h5>
                  <ul className="space-y-1">
                    {roiCalculation?.results?.recommendations?.map((rec, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <Icon name="TrendingUp" size={16} className="text-green-500 mr-2" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Icon name="Wrench" size={48} className="text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-black mb-2">Tool Coming Soon</h4>
            <p className="text-gray-600">This interactive tool is currently in development.</p>
            <Button
              variant="outline"
              className="mt-4 border-accent text-accent hover:bg-accent hover:text-white"
              iconName="Bell"
              iconPosition="left"
            >
              Notify When Ready
            </Button>
          </div>
        );
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Icon name="Wrench" size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Interactive Tools</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-black mb-6">
            Hands-On <span className="text-accent">Innovation</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Try our cutting-edge tools that provide immediate value while demonstrating our technical expertise and innovative approach.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Selection */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {tools?.map((tool) => (
              <motion.div
                key={tool?.id}
                variants={itemVariants}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activeTool === tool?.id
                    ? 'border-accent bg-white shadow-xl'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => setActiveTool(tool?.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool?.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={tool?.icon} size={24} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-black">{tool?.title}</h3>
                      {activeTool === tool?.id && (
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{tool?.description}</p>
                    
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                      {tool?.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tool Interface */}
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
              {/* Tool Header */}
              <div className={`h-2 bg-gradient-to-r ${tools?.find(t => t?.id === activeTool)?.color}`}></div>
              
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tools?.find(t => t?.id === activeTool)?.color} flex items-center justify-center`}>
                    <Icon name={tools?.find(t => t?.id === activeTool)?.icon} size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black">
                      {tools?.find(t => t?.id === activeTool)?.title}
                    </h3>
                    <p className="text-gray-600">
                      {tools?.find(t => t?.id === activeTool)?.description}
                    </p>
                  </div>
                </div>

                {/* Tool Interface */}
                {renderToolInterface()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveTools;