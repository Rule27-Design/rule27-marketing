import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EnhancedCapabilityAssessment = memo(() => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Enhanced assessment questions with industry and more detail
  const assessmentQuestions = useMemo(() => [
    {
      id: 'industry',
      title: 'What industry is your business in?',
      type: 'single',
      required: true,
      options: [
        { value: 'technology', label: 'Technology / SaaS', icon: 'Cpu' },
        { value: 'ecommerce', label: 'E-commerce / Retail', icon: 'ShoppingCart' },
        { value: 'healthcare', label: 'Healthcare / Medical', icon: 'Heart' },
        { value: 'finance', label: 'Finance / Banking', icon: 'DollarSign' },
        { value: 'realestate', label: 'Real Estate', icon: 'Home' },
        { value: 'education', label: 'Education / Training', icon: 'GraduationCap' },
        { value: 'hospitality', label: 'Hospitality / Travel', icon: 'MapPin' },
        { value: 'manufacturing', label: 'Manufacturing / Industrial', icon: 'Factory' },
        { value: 'nonprofit', label: 'Non-profit / NGO', icon: 'Heart' },
        { value: 'other', label: 'Other / Multiple', icon: 'Grid' }
      ]
    },
    {
      id: 'business-stage',
      title: 'What stage is your business in?',
      type: 'single',
      required: true,
      options: [
        { value: 'idea', label: 'Idea Stage (Pre-launch)', icon: 'Lightbulb' },
        { value: 'startup', label: 'Startup (0-2 years)', icon: 'Rocket' },
        { value: 'growth', label: 'Growth Stage (2-5 years)', icon: 'TrendingUp' },
        { value: 'established', label: 'Established (5+ years)', icon: 'Building' },
        { value: 'enterprise', label: 'Enterprise (Large scale)', icon: 'Globe' }
      ]
    },
    {
      id: 'team-size',
      title: 'What\'s your current team size?',
      type: 'single',
      required: true,
      options: [
        { value: 'solo', label: 'Just me', icon: 'User' },
        { value: 'small', label: '2-10 employees', icon: 'Users' },
        { value: 'medium', label: '11-50 employees', icon: 'Users' },
        { value: 'large', label: '51-200 employees', icon: 'Building' },
        { value: 'enterprise', label: '200+ employees', icon: 'Globe' }
      ]
    },
    {
      id: 'primary-goals',
      title: 'What are your top 3 business goals?',
      subtitle: 'Select up to 3 priorities',
      type: 'multiple',
      maxSelections: 3,
      required: true,
      options: [
        { value: 'brand-awareness', label: 'Increase Brand Awareness', icon: 'Eye' },
        { value: 'lead-generation', label: 'Generate More Leads', icon: 'Users' },
        { value: 'sales-growth', label: 'Boost Sales Revenue', icon: 'DollarSign' },
        { value: 'digital-presence', label: 'Improve Digital Presence', icon: 'Smartphone' },
        { value: 'operational-efficiency', label: 'Enhance Operations', icon: 'Settings' },
        { value: 'customer-retention', label: 'Improve Customer Retention', icon: 'Heart' },
        { value: 'market-expansion', label: 'Enter New Markets', icon: 'Globe' },
        { value: 'product-launch', label: 'Launch New Product/Service', icon: 'Package' }
      ]
    },
    {
      id: 'biggest-challenge',
      title: 'What\'s your BIGGEST challenge right now?',
      subtitle: 'Choose the most critical issue',
      type: 'single',
      required: true,
      options: [
        { value: 'no-leads', label: 'Not Getting Enough Leads', icon: 'UserX' },
        { value: 'low-conversion', label: 'Leads Don\'t Convert to Sales', icon: 'TrendingDown' },
        { value: 'no-visibility', label: 'No One Knows We Exist', icon: 'EyeOff' },
        { value: 'outdated-tech', label: 'Outdated Technology/Website', icon: 'AlertTriangle' },
        { value: 'no-strategy', label: 'No Clear Strategy', icon: 'HelpCircle' },
        { value: 'limited-resources', label: 'Limited Resources/Budget', icon: 'DollarSign' },
        { value: 'scaling-issues', label: 'Can\'t Scale Operations', icon: 'TrendingUp' },
        { value: 'competition', label: 'Losing to Competition', icon: 'Target' }
      ]
    },
    {
      id: 'current-marketing',
      title: 'How are you currently handling marketing?',
      type: 'multiple',
      required: true,
      options: [
        { value: 'internal-team', label: 'Internal Marketing Team', icon: 'Users' },
        { value: 'freelancers', label: 'Freelancers/Contractors', icon: 'UserCheck' },
        { value: 'agency', label: 'Marketing Agency', icon: 'Building' },
        { value: 'diy', label: 'DIY/Founder-led', icon: 'User' },
        { value: 'none', label: 'Not Doing Much Marketing', icon: 'X' }
      ]
    },
    {
      id: 'tech-stack',
      title: 'What technology/platforms do you currently use?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      required: false,
      options: [
        { value: 'wordpress', label: 'WordPress', icon: 'Globe' },
        { value: 'shopify', label: 'Shopify', icon: 'ShoppingCart' },
        { value: 'salesforce', label: 'Salesforce', icon: 'Cloud' },
        { value: 'hubspot', label: 'HubSpot', icon: 'Settings' },
        { value: 'custom-built', label: 'Custom Built System', icon: 'Code' },
        { value: 'google-workspace', label: 'Google Workspace', icon: 'Mail' },
        { value: 'microsoft', label: 'Microsoft 365', icon: 'FileText' },
        { value: 'none', label: 'Basic/No Major Platforms', icon: 'X' }
      ]
    },
    {
      id: 'budget-range',
      title: 'What\'s your annual budget for growth initiatives?',
      subtitle: 'This helps us recommend the right solutions',
      type: 'slider',
      required: true,
      min: 0,
      max: 500000,
      step: 10000,
      defaultValue: 50000,
      format: 'currency',
      ranges: [
        { min: 0, max: 25000, label: 'Bootstrap Budget' },
        { min: 25000, max: 100000, label: 'Growth Budget' },
        { min: 100000, max: 250000, label: 'Scale Budget' },
        { min: 250000, max: 500000, label: 'Enterprise Budget' }
      ]
    },
    {
      id: 'timeline',
      title: 'When do you need to see results?',
      subtitle: 'Be realistic about your expectations',
      type: 'single',
      required: true,
      options: [
        { value: 'asap', label: 'ASAP (Within 30 days)', icon: 'Zap' },
        { value: '3-months', label: 'Next Quarter (3 months)', icon: 'Calendar' },
        { value: '6-months', label: 'Next 6 months', icon: 'Clock' },
        { value: '1-year', label: 'Within the year', icon: 'Target' },
        { value: 'planning', label: 'Just Planning Ahead', icon: 'Map' }
      ]
    },
    {
      id: 'decision-maker',
      title: 'Are you the primary decision maker?',
      type: 'single',
      required: true,
      options: [
        { value: 'yes-sole', label: 'Yes, I make the final decision', icon: 'Check' },
        { value: 'yes-team', label: 'Yes, but I consult my team', icon: 'Users' },
        { value: 'influencer', label: 'I influence the decision', icon: 'UserCheck' },
        { value: 'researcher', label: 'I\'m researching for someone else', icon: 'Search' }
      ]
    }
  ], []);

  // Handle different answer types including slider
  const handleAnswer = useCallback((questionId, value, isMultiple = false) => {
    const question = assessmentQuestions.find(q => q.id === questionId);
    
    setAnswers(prev => {
      if (question?.type === 'slider') {
        return { ...prev, [questionId]: value };
      } else if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const maxSelections = question?.maxSelections || Infinity;
        
        if (currentAnswers.includes(value)) {
          return { ...prev, [questionId]: currentAnswers.filter(v => v !== value) };
        } else if (currentAnswers.length < maxSelections) {
          return { ...prev, [questionId]: [...currentAnswers, value] };
        }
        return prev;
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  }, [assessmentQuestions]);

  // Calculate sophisticated scoring and recommendations
  const getSmartRecommendations = useMemo(() => {
    if (!showResults) return { services: [], packages: [], insights: {} };
    
    const {
      industry,
      'business-stage': stage,
      'team-size': teamSize,
      'primary-goals': goals = [],
      'biggest-challenge': biggestChallenge,
      'current-marketing': currentMarketing = [],
      'tech-stack': techStack = [],
      'budget-range': budget,
      timeline,
      'decision-maker': decisionMaker
    } = answers;

    const recommendations = [];
    const insights = {
      score: 0,
      readiness: 'low',
      priority: 'standard',
      approach: 'gradual'
    };

    // Calculate business maturity score
    const maturityScore = 
      (stage === 'enterprise' ? 40 : stage === 'established' ? 30 : stage === 'growth' ? 20 : 10) +
      (teamSize === 'enterprise' ? 30 : teamSize === 'large' ? 25 : teamSize === 'medium' ? 15 : 5) +
      (budget > 250000 ? 30 : budget > 100000 ? 20 : budget > 50000 ? 10 : 5);

    insights.score = maturityScore;
    insights.readiness = maturityScore > 70 ? 'high' : maturityScore > 40 ? 'medium' : 'low';

    // PRIORITY 1: Address the biggest challenge
    if (biggestChallenge === 'no-leads' || biggestChallenge === 'low-conversion') {
      recommendations.push({
        service: 'Digital Marketing Command Suite',
        priority: 'Critical',
        services: ['SEO Services', 'PPC Management', 'Email Marketing'],
        reason: 'Your lead generation challenge requires immediate attention with proven digital marketing strategies.',
        estimatedROI: '300-400%',
        timeToResults: '30-60 days',
        investment: '$5,000 - $15,000/month'
      });
    }

    if (biggestChallenge === 'no-visibility') {
      recommendations.push({
        service: 'Brand Awareness Package',
        priority: 'Critical',
        services: ['Graphic Design', 'Social Media Marketing', 'Content Writing'],
        reason: 'Building brand visibility requires consistent creative and content across all channels.',
        estimatedROI: '200-300%',
        timeToResults: '60-90 days',
        investment: '$7,500 - $20,000/month'
      });
    }

    if (biggestChallenge === 'outdated-tech') {
      recommendations.push({
        service: 'Digital Transformation',
        priority: 'Critical',
        services: ['Web Development', 'Web Design', techStack.includes('salesforce') ? 'Salesforce Consulting' : 'CRM Implementation'],
        reason: 'Modern technology infrastructure is essential for competing in today\'s market.',
        estimatedROI: '250-500%',
        timeToResults: '90-120 days',
        investment: '$30,000 - $75,000 one-time'
      });
    }

    // PRIORITY 2: Industry-specific recommendations
    const industryRecommendations = {
      technology: {
        services: ['Custom Web Development', 'AWS Development', 'Content Writing'],
        focus: 'Technical excellence and thought leadership'
      },
      ecommerce: {
        services: ['Shopify Development', 'PPC Management', 'Email Marketing'],
        focus: 'Conversion optimization and customer retention'
      },
      healthcare: {
        services: ['Web Design', 'SEO Services', 'Content Writing'],
        focus: 'Trust building and compliance'
      },
      finance: {
        services: ['Salesforce Consulting', 'Web Development', 'Business Consulting'],
        focus: 'Security and professional credibility'
      },
      realestate: {
        services: ['Photography', 'Videography', 'Social Media Marketing'],
        focus: 'Visual storytelling and local presence'
      },
      hospitality: {
        services: ['Photography', 'Social Media Marketing', 'Web Design'],
        focus: 'Experience showcase and booking optimization'
      }
    };

    if (industryRecommendations[industry]) {
      recommendations.push({
        service: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry Package`,
        priority: 'High',
        services: industryRecommendations[industry].services,
        reason: industryRecommendations[industry].focus,
        estimatedROI: '200-350%',
        timeToResults: '60-90 days',
        investment: 'Custom quote'
      });
    }

    // PRIORITY 3: Growth stage specific needs
    if (stage === 'startup' || stage === 'idea') {
      if (!recommendations.some(r => r.services.includes('Fractional CMO'))) {
        recommendations.push({
          service: 'Startup Growth Package',
          priority: 'High',
          services: ['Fractional CMO', 'Brand Identity', 'WordPress Development'],
          reason: 'Early-stage businesses need strategic guidance and foundational brand assets.',
          estimatedROI: '400-600%',
          timeToResults: '90-180 days',
          investment: '$8,000 - $20,000/month'
        });
      }
    }

    if (stage === 'growth' && teamSize !== 'enterprise') {
      if (goals.includes('operational-efficiency')) {
        recommendations.push({
          service: 'Scale Operations Package',
          priority: 'Medium',
          services: ['Fractional COO', 'Operation Disruption', 'Integrations Development'],
          reason: 'Growing businesses need operational excellence to scale efficiently.',
          estimatedROI: '300-500%',
          timeToResults: '90-120 days',
          investment: '$15,000 - $30,000/month'
        });
      }
    }

    // PRIORITY 4: Goal-based recommendations
    if (goals.includes('market-expansion')) {
      recommendations.push({
        service: 'Market Expansion Strategy',
        priority: 'Medium',
        services: ['Business Consulting', 'Market Research', 'Digital Marketing'],
        reason: 'Entering new markets requires strategic planning and targeted marketing.',
        estimatedROI: '250-400%',
        timeToResults: '120-180 days',
        investment: '$10,000 - $25,000/month'
      });
    }

    if (goals.includes('product-launch')) {
      recommendations.push({
        service: 'Product Launch Campaign',
        priority: 'High',
        services: ['Motion Graphics', 'Videography', 'Paid Advertising'],
        reason: 'Product launches need compelling creative and strategic promotion.',
        estimatedROI: '300-500%',
        timeToResults: '30-60 days',
        investment: '$15,000 - $40,000'
      });
    }

    // Create service packages based on budget
    const packages = [];
    
    if (budget < 25000) {
      packages.push({
        name: 'Essentials Package',
        description: 'Foundation for growth',
        services: recommendations[0]?.services.slice(0, 2) || ['SEO Services', 'Social Media Marketing'],
        investment: '$2,500 - $5,000/month',
        timeline: '3-6 months',
        suitable: true
      });
    } else if (budget < 100000) {
      packages.push({
        name: 'Growth Package',
        description: 'Accelerated expansion',
        services: recommendations.slice(0, 2).flatMap(r => r.services).slice(0, 4),
        investment: '$7,500 - $15,000/month',
        timeline: '6-12 months',
        suitable: true
      });
    } else {
      packages.push({
        name: 'Transformation Package',
        description: 'Complete business evolution',
        services: recommendations.slice(0, 3).flatMap(r => r.services).slice(0, 6),
        investment: '$20,000 - $50,000/month',
        timeline: '12-18 months',
        suitable: true
      });
    }

    // Determine urgency and approach
    insights.priority = timeline === 'asap' ? 'urgent' : timeline === '3-months' ? 'high' : 'standard';
    insights.approach = budget > 100000 && timeline !== 'asap' ? 'comprehensive' : 'phased';

    return { services: recommendations.slice(0, 4), packages, insights };
  }, [showResults, answers]);

  const nextStep = useCallback(() => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  }, [currentStep, assessmentQuestions.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const resetAssessment = useCallback(() => {
    setShowResults(false);
    setShowCalendar(false);
    setCurrentStep(0);
    setAnswers({});
    setSelectedPackage(null);
  }, []);

  const handleScheduleCall = useCallback((pkg) => {
    setSelectedPackage(pkg);
    setShowCalendar(true);
  }, []);

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;
  
  // Check if current question is answered
  const isAnswered = currentQuestion && (
    currentQuestion.type === 'slider' 
      ? answers[currentQuestion.id] !== undefined
      : currentQuestion.type === 'multiple' 
        ? (answers[currentQuestion.id]?.length > 0)
        : !!answers[currentQuestion.id]
  );

  // Format currency for slider
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calendar Modal Component
  const CalendarModal = () => (
    <AnimatePresence>
      {showCalendar && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowCalendar(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                     bg-white rounded-2xl shadow-2xl z-50 max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">Schedule Your Strategy Call</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {selectedPackage ? `Discussing: ${selectedPackage.name}` : 'Free 30-minute consultation'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCalendar(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* This is where you'd embed Calendly or your calendar widget */}
              <div className="bg-muted rounded-lg p-8 text-center">
                <Icon name="Calendar" size={48} className="text-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-primary mb-2">Calendar Integration</h4>
                <p className="text-text-secondary mb-6">
                  Connect your Calendly, Cal.com, or Google Calendar here
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  />
                  <textarea
                    placeholder="Tell us about your project (Optional)"
                    className="w-full px-4 py-2 border border-border rounded-lg"
                    rows="3"
                  />
                  <Button
                    variant="default"
                    fullWidth
                    className="bg-accent hover:bg-accent/90"
                  >
                    Request Callback
                  </Button>
                </div>
                <p className="text-xs text-text-secondary mt-4">
                  We'll confirm your appointment within 2 hours during business hours
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (showResults) {
    const { services, packages, insights } = getSmartRecommendations;
    
    return (
      <>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Results Header */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-accent/10 to-transparent border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent text-white rounded-lg">
                <Icon name="CheckCircle" size={20} className="md:hidden" />
                <Icon name="CheckCircle" size={24} className="hidden md:block" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-primary">Your Personalized Growth Plan</h3>
                <p className="text-sm md:text-base text-text-secondary">
                  Business Readiness Score: {insights.score}/100
                </p>
              </div>
            </div>
          </div>
          
          {/* Insights Bar */}
          <div className="p-4 md:p-6 bg-muted/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-text-secondary mb-1">Readiness</div>
                <div className={`font-bold ${
                  insights.readiness === 'high' ? 'text-green-600' : 
                  insights.readiness === 'medium' ? 'text-yellow-600' : 'text-orange-600'
                }`}>
                  {insights.readiness.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary mb-1">Priority</div>
                <div className={`font-bold ${
                  insights.priority === 'urgent' ? 'text-red-600' : 
                  insights.priority === 'high' ? 'text-orange-600' : 'text-blue-600'
                }`}>
                  {insights.priority.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary mb-1">Approach</div>
                <div className="font-bold text-primary">
                  {insights.approach.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {/* Recommended Services */}
            <div>
              <h4 className="font-bold text-primary text-lg mb-4">Recommended Services</h4>
              {services.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-border rounded-xl p-4 md:p-6 space-y-3 mb-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-primary text-base md:text-lg">{rec.service}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{rec.reason}</p>
                      
                      {/* Services included */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {rec.services.map((service, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-muted rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-sm">
                      <div>
                        <div className="text-text-secondary text-xs">ROI</div>
                        <div className="font-bold text-accent">{rec.estimatedROI}</div>
                      </div>
                      <div>
                        <div className="text-text-secondary text-xs">Time to Results</div>
                        <div className="font-semibold">{rec.timeToResults}</div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <div className="text-text-secondary text-xs">Investment</div>
                        <div className="font-semibold">{rec.investment}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Package Recommendations */}
            <div>
              <h4 className="font-bold text-primary text-lg mb-4">Recommended Packages</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`border-2 rounded-xl p-4 ${
                      pkg.suitable ? 'border-accent bg-accent/5' : 'border-border'
                    }`}
                  >
                    <h5 className="font-bold text-primary mb-1">{pkg.name}</h5>
                    <p className="text-xs text-text-secondary mb-3">{pkg.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-text-secondary">Investment: </span>
                        <span className="font-semibold">{pkg.investment}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-text-secondary">Timeline: </span>
                        <span className="font-semibold">{pkg.timeline}</span>
                      </div>
                    </div>
                    <Button
                      variant={pkg.suitable ? "default" : "outline"}
                      size="sm"
                      fullWidth
                      className={pkg.suitable ? "bg-accent hover:bg-accent/90" : ""}
                      onClick={() => handleScheduleCall(pkg)}
                    >
                      Discuss This Package
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
              <Button
                variant="default"
                className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => handleScheduleCall(null)}
              >
                Schedule Free Consultation
              </Button>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-white w-full sm:w-auto"
                iconName="Download"
                iconPosition="left"
              >
                Download Full Report (PDF)
              </Button>
              <Button
                variant="ghost"
                onClick={resetAssessment}
                className="text-accent hover:bg-accent/10 w-full sm:w-auto"
              >
                Retake Assessment
              </Button>
            </div>
          </div>
        </div>
        
        <CalendarModal />
      </>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-bold text-primary">Business Growth Assessment</h3>
          <span className="text-xs md:text-sm text-text-secondary">
            {currentStep + 1} of {assessmentQuestions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-1.5 md:h-2">
          <motion.div
            className="bg-accent h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 md:space-y-6"
          >
            <div>
              <h4 className="text-base md:text-lg font-semibold text-primary">
                {currentQuestion?.title}
              </h4>
              {currentQuestion?.subtitle && (
                <p className="text-sm text-text-secondary mt-1">{currentQuestion.subtitle}</p>
              )}
            </div>

            {/* Slider Question Type */}
            {currentQuestion?.type === 'slider' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {formatCurrency(answers[currentQuestion.id] || currentQuestion.defaultValue)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {currentQuestion.ranges?.find(r => 
                      (answers[currentQuestion.id] || currentQuestion.defaultValue) >= r.min && 
                      (answers[currentQuestion.id] || currentQuestion.defaultValue) <= r.max
                    )?.label}
                  </div>
                </div>
                
                <div className="px-4">
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    step={currentQuestion.step}
                    value={answers[currentQuestion.id] || currentQuestion.defaultValue}
                    onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-2">
                    <span>{formatCurrency(currentQuestion.min)}</span>
                    <span>{formatCurrency(currentQuestion.max)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Multiple Choice Options */}
            {(currentQuestion?.type === 'single' || currentQuestion?.type === 'multiple') && (
              <div className="grid gap-2 md:gap-3">
                {currentQuestion?.options?.map((option) => {
                  const isSelected = currentQuestion.type === 'multiple'
                    ? (answers[currentQuestion.id] || []).includes(option.value)
                    : answers[currentQuestion.id] === option.value;

                  const isDisabled = currentQuestion.type === 'multiple' && 
                    currentQuestion.maxSelections && 
                    (answers[currentQuestion.id] || []).length >= currentQuestion.maxSelections &&
                    !isSelected;

                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => !isDisabled && handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                      className={`flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl border-2 
                               transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-accent bg-accent/10 text-accent' 
                          : isDisabled 
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-border hover:border-accent/30 hover:bg-muted/50 text-text-primary'
                      }`}
                      whileHover={!isDisabled ? { scale: 1.02 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    >
                      <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                        isSelected ? 'bg-accent text-white' : 
                        isDisabled ? 'bg-gray-200 text-gray-400' :
                        'bg-muted text-text-secondary'
                      }`}>
                        <Icon name={option.icon} size={16} className="md:hidden" />
                        <Icon name={option.icon} size={20} className="hidden md:block" />
                      </div>
                      <span className="font-medium text-sm md:text-base flex-1">{option.label}</span>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <Icon name="Check" size={16} className="text-accent md:hidden" />
                          <Icon name="Check" size={20} className="text-accent hidden md:block" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
                
                {currentQuestion?.type === 'multiple' && currentQuestion?.maxSelections && (
                  <p className="text-xs text-text-secondary text-center mt-2">
                    {(answers[currentQuestion.id] || []).length} of {currentQuestion.maxSelections} selected
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 md:p-6 border-t border-border">
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            iconName="ArrowLeft"
            iconPosition="left"
            className="border-accent text-accent hover:bg-accent hover:text-white 
                     disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <Button
            variant="default"
            onClick={nextStep}
            disabled={currentQuestion?.required && !isAnswered}
            className="bg-accent hover:bg-accent/90 disabled:opacity-50 
                     disabled:cursor-not-allowed text-sm md:text-base"
            iconName={currentStep === assessmentQuestions.length - 1 ? "CheckCircle" : "ArrowRight"}
            iconPosition="right"
          >
            {currentStep === assessmentQuestions.length - 1 ? 'Get Results' : 'Next'}
          </Button>
        </div>
        
        {!currentQuestion?.required && (
          <button
            onClick={nextStep}
            className="w-full text-center text-sm text-text-secondary hover:text-accent mt-3 transition-colors"
          >
            Skip this question
          </button>
        )}
      </div>
    </div>
  );
});

EnhancedCapabilityAssessment.displayName = 'EnhancedCapabilityAssessment';

export default EnhancedCapabilityAssessment;