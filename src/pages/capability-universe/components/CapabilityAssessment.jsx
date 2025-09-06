import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Download, Calendar, Check, X, Play, Pause, Search, 
  Filter, Zap, Clock, DollarSign, Target, TrendingUp, Eye, Users, Globe, 
  Lightbulb, Rocket, Building, User, ShoppingCart, Heart, Home, GraduationCap, 
  MapPin, Factory, Grid3x3 as Grid, Package, UserX, TrendingDown, EyeOff, 
  AlertTriangle, HelpCircle, UserCheck, Code, Mail, FileText, Shield, 
  CheckCircle, ArrowLeft, ArrowRight, Cpu, Map
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// Button Component (keeping the same)
const Button = memo(({ 
  children, 
  variant = 'default', 
  fullWidth = false, 
  size = 'md',
  iconName,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-accent text-white hover:bg-accent/90',
    outline: 'border-2 border-border text-text-primary hover:border-accent hover:bg-accent hover:text-white',
    ghost: 'text-text-secondary hover:bg-accent/10',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  };
  
  const icons = {
    ChevronRight, ChevronLeft, Download, Calendar, Check, X, Play, 
    CheckCircle, ArrowLeft, ArrowRight
  };
  
  const Icon = iconName ? icons[iconName] : null;
  
  return (
    <button 
      className={`
        ${baseClass} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} className="mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} className="ml-2" />}
    </button>
  );
});

// Icon Component (keeping the same)
const Icon = memo(({ name, size = 20, className = '' }) => {
  const icons = {
    Cpu, ShoppingCart, Heart, DollarSign, Home, GraduationCap, MapPin, Factory, 
    Grid, Lightbulb, Rocket, TrendingUp, Building, Globe, User, Users, Eye, 
    UserX, TrendingDown, EyeOff, AlertTriangle, HelpCircle, Target, UserCheck,
    Package, X, Zap, Calendar, Clock, Map, Check, Search, Shield, Mail, Code,
    FileText, Download, CheckCircle, ArrowLeft, ArrowRight
  };
  
  const IconComponent = icons[name];
  if (!IconComponent) return null;
  
  return <IconComponent size={size} className={className} />;
});

const EnhancedCapabilityAssessment = memo(() => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Track assessment start time
  useEffect(() => {
    if (currentStep === 0 && !startTime) {
      setStartTime(Date.now());
    }
  }, [currentStep, startTime]);

  // Get session ID for tracking
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }, []);

  // Enhanced assessment questions (keeping the same)
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
        { value: 'digital-presence', label: 'Improve Digital Presence', icon: 'Globe' },
        { value: 'operational-efficiency', label: 'Enhance Operations', icon: 'TrendingUp' },
        { value: 'customer-retention', label: 'Improve Customer Retention', icon: 'Heart' },
        { value: 'market-expansion', label: 'Enter New Markets', icon: 'Globe' },
        { value: 'product-launch', label: 'Launch New Product/Service', icon: 'Package' }
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
      type: 'single',
      required: true,
      options: [
        { value: 'asap', label: 'ASAP (Within 30 days)', icon: 'Zap' },
        { value: '3-months', label: 'Next Quarter (3 months)', icon: 'Calendar' },
        { value: '6-months', label: 'Next 6 months', icon: 'Clock' },
        { value: '1-year', label: 'Within the year', icon: 'Target' },
        { value: 'planning', label: 'Just Planning Ahead', icon: 'Map' }
      ]
    }
  ], []);

  // Handle answers
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

  // Save assessment to database
  const saveAssessment = useCallback(async (recommendations) => {
    try {
      setIsSaving(true);
      const sessionId = getSessionId();
      const completionTime = startTime ? Math.round((Date.now() - startTime) / 1000) : null;
      
      const { data, error } = await supabase
        .from('capability_assessments')
        .insert({
          session_id: sessionId,
          answers: answers,
          recommendations: recommendations,
          score: recommendations.insights.score,
          readiness_level: recommendations.insights.readiness,
          priority_level: recommendations.insights.priority,
          approach_type: recommendations.insights.approach,
          completed: true,
          completion_time: completionTime,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      setAssessmentId(data.id);
      
      // Create email notification for admin
      await supabase
        .from('email_notifications')
        .insert({
          recipient_email: 'admin@rule27design.com',
          subject: 'New Capability Assessment Completed',
          template: 'assessment_complete',
          data: {
            assessment_id: data.id,
            score: recommendations.insights.score,
            readiness: recommendations.insights.readiness,
            budget: answers['budget-range'],
            industry: answers.industry,
            timeline: answers.timeline
          }
        });

    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setIsSaving(false);
    }
  }, [answers, startTime, getSessionId]);

  // Get recommendations (keeping the same logic)
  const getSmartRecommendations = useMemo(() => {
    if (!showResults) return { services: [], packages: [], insights: {} };
    
    const budget = answers['budget-range'] || 50000;
    
    const recommendations = [
      {
        service: 'Digital Marketing Command Suite',
        priority: 'Critical',
        services: ['SEO Services', 'PPC Management', 'Email Marketing'],
        reason: 'Comprehensive digital marketing to drive growth and visibility.',
        estimatedROI: '300-400%',
        timeToResults: '30-60 days',
        investment: '$5,000 - $15,000/month'
      },
      {
        service: 'Brand Transformation Package',
        priority: 'High',
        services: ['Web Design', 'Content Strategy', 'Social Media'],
        reason: 'Build a strong brand presence that resonates with your audience.',
        estimatedROI: '200-300%',
        timeToResults: '60-90 days',
        investment: '$10,000 - $25,000'
      }
    ];

    const packages = [
      {
        name: budget < 50000 ? 'Essentials Package' : 'Growth Package',
        description: budget < 50000 ? 'Foundation for growth' : 'Accelerated expansion',
        services: ['SEO', 'Social Media', 'Web Design'],
        investment: budget < 50000 ? '$2,500/month' : '$7,500/month',
        timeline: budget < 50000 ? '3-6 months' : '6-12 months',
        suitable: true
      }
    ];

    const insights = {
      score: budget > 100000 ? 85 : budget > 50000 ? 65 : 45,
      readiness: budget > 100000 ? 'high' : budget > 50000 ? 'medium' : 'low',
      priority: answers.timeline === 'asap' ? 'urgent' : 'standard',
      approach: budget > 100000 ? 'comprehensive' : 'phased'
    };

    return { services: recommendations, packages, insights };
  }, [showResults, answers]);

  // Navigation
  const nextStep = useCallback(async () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
      // Save assessment when showing results
      const recommendations = getSmartRecommendations;
      if (recommendations.insights.score !== undefined) {
        await saveAssessment(recommendations);
      }
    }
  }, [currentStep, assessmentQuestions.length, getSmartRecommendations, saveAssessment]);

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
    setAssessmentId(null);
    setStartTime(Date.now());
  }, []);

  const handleScheduleCall = useCallback(async (pkg) => {
    setSelectedPackage(pkg);
    setShowCalendar(true);
    
    // Track that user requested contact
    if (assessmentId) {
      await supabase
        .from('capability_assessments')
        .update({ contacted: true, contact_date: new Date().toISOString() })
        .eq('id', assessmentId);
    }
  }, [assessmentId]);

  // Generate PDF function (keeping the same)
  const generatePDF = useCallback(() => {
    setIsGeneratingPDF(true);
    
    const { services, packages, insights } = getSmartRecommendations;
    
    const htmlContent = `
      <html>
        <head>
          <title>Capability Assessment Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; }
            h1 { color: #E53E3E; }
            h2 { color: #E53E3E; margin-top: 30px; }
            .metric { display: inline-block; margin: 10px 20px 10px 0; }
            .metric strong { color: #E53E3E; font-size: 24px; }
            .service { background: #f3f4f6; padding: 20px; margin: 15px 0; border-radius: 8px; }
            .package { background: #e0f2fe; padding: 20px; margin: 15px 0; border-radius: 8px; border: 2px solid #E53E3E; }
            .priority { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .critical { background: #fee2e2; color: #b91c1c; }
            .high { background: #fef3c7; color: #d97706; }
          </style>
        </head>
        <body>
          <h1>Your Personalized Growth Plan</h1>
          <p><strong>Business Readiness Score:</strong> ${insights.score}/100</p>
          <p><strong>Assessment ID:</strong> ${assessmentId || 'Not saved'}</p>
          
          <h2>Assessment Summary</h2>
          <div class="metric"><strong>Readiness:</strong> ${insights.readiness.toUpperCase()}</div>
          <div class="metric"><strong>Priority:</strong> ${insights.priority.toUpperCase()}</div>
          <div class="metric"><strong>Approach:</strong> ${insights.approach.toUpperCase()}</div>
          
          <h2>Recommended Services</h2>
          ${services.map(s => `
            <div class="service">
              <h3>${s.service} <span class="priority ${s.priority.toLowerCase()}">${s.priority}</span></h3>
              <p>${s.reason}</p>
              <p><strong>Services Included:</strong> ${s.services.join(', ')}</p>
              <p><strong>Expected ROI:</strong> ${s.estimatedROI} | <strong>Timeline:</strong> ${s.timeToResults}</p>
              <p><strong>Investment:</strong> ${s.investment}</p>
            </div>
          `).join('')}
          
          <h2>Recommended Package</h2>
          ${packages.map(p => `
            <div class="package">
              <h3>${p.name}</h3>
              <p>${p.description}</p>
              <p><strong>Services:</strong> ${p.services.join(', ')}</p>
              <p><strong>Investment:</strong> ${p.investment}</p>
              <p><strong>Timeline:</strong> ${p.timeline}</p>
            </div>
          `).join('')}
          
          <p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
            Report generated on ${new Date().toLocaleDateString()} | Rule27 Design
          </p>
        </body>
      </html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        setIsGeneratingPDF(false);
      };
    } else {
      // Fallback: direct download
      const a = document.createElement('a');
      a.href = url;
      a.download = `capability-assessment-${assessmentId || Date.now()}.html`;
      a.click();
      setIsGeneratingPDF(false);
    }
  }, [getSmartRecommendations, assessmentId]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;
  
  const isAnswered = currentQuestion && (
    currentQuestion.type === 'slider' 
      ? answers[currentQuestion.id] !== undefined
      : currentQuestion.type === 'multiple' 
        ? (answers[currentQuestion.id]?.length > 0)
        : !!answers[currentQuestion.id]
  );

  // Calendar Modal with Calendly Integration (keeping the same)
  const CalendarModal = () => (
    <>
      {showCalendar && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowCalendar(false)}
          />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                     bg-background rounded-2xl shadow-2xl z-50 max-w-4xl w-full h-[90vh] md:h-[80vh] overflow-hidden">
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">Schedule Your Strategy Call</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {selectedPackage ? `Discussing: ${selectedPackage.name}` : 'Free 60-minute consultation'}
                  </p>
                </div>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="h-[calc(100%-80px)] overflow-hidden">
              {/* Calendly Embed */}
              <iframe
                src="https://calendly.com/joshanderson-rule27design/60-minute-meeting?embed_type=inline&hide_landing_page_details=true&hide_gdpr_banner=true&primary_color=E53E3E"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule a meeting"
              />
            </div>
          </div>
        </>
      )}
    </>
  );

  // Results View (updated with saving indicator)
  if (showResults) {
    const { services, packages, insights } = getSmartRecommendations;
    
    return (
      <>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Results Header */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-accent/10 to-transparent border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent text-white rounded-lg">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Your Personalized Growth Plan</h3>
                <p className="text-sm text-text-secondary">
                  Business Readiness Score: {insights.score}/100
                  {assessmentId && <span className="ml-2 text-xs">(Saved)</span>}
                </p>
              </div>
            </div>
          </div>
          
          {/* Rest of the results view remains the same */}
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
                  insights.priority === 'urgent' ? 'text-red-600' : 'text-accent'
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
                <div
                  key={index}
                  className="border border-border rounded-xl p-4 md:p-6 space-y-3 mb-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-primary">{rec.service}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          'bg-accent/10 text-accent'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{rec.reason}</p>
                      
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
                        <div className="text-text-secondary text-xs">Timeline</div>
                        <div className="font-semibold">{rec.timeToResults}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Package Recommendations */}
            <div>
              <h4 className="font-bold text-primary text-lg mb-4">Recommended Package</h4>
              <div className="grid md:grid-cols-1 gap-4">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className="border-2 border-accent bg-accent/5 rounded-xl p-4"
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
                      variant="default"
                      size="sm"
                      fullWidth
                      className="bg-accent hover:bg-accent/90"
                      onClick={() => handleScheduleCall(pkg)}
                    >
                      Discuss This Package
                    </Button>
                  </div>
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
                onClick={generatePDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? 'Generating...' : 'Download Report (PDF)'}
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

  // Question View (same as before)
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary">Business Growth Assessment</h3>
          <span className="text-sm text-text-secondary">
            {currentStep + 1} of {assessmentQuestions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-accent h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-primary">
              {currentQuestion?.title}
            </h4>
            {currentQuestion?.subtitle && (
              <p className="text-sm text-text-secondary mt-1">{currentQuestion.subtitle}</p>
            )}
          </div>

          {/* Slider Question */}
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
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((answers[currentQuestion.id] || currentQuestion.defaultValue) - currentQuestion.min) / (currentQuestion.max - currentQuestion.min) * 100}%, var(--muted) ${((answers[currentQuestion.id] || currentQuestion.defaultValue) - currentQuestion.min) / (currentQuestion.max - currentQuestion.min) * 100}%, var(--muted) 100%)`
                  }}
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
            <div className="grid gap-3">
              {currentQuestion?.options?.map((option) => {
                const isSelected = currentQuestion.type === 'multiple'
                  ? (answers[currentQuestion.id] || []).includes(option.value)
                  : answers[currentQuestion.id] === option.value;

                const isDisabled = currentQuestion.type === 'multiple' && 
                  currentQuestion.maxSelections && 
                  (answers[currentQuestion.id] || []).length >= currentQuestion.maxSelections &&
                  !isSelected;

                return (
                  <button
                    key={option.value}
                    onClick={() => !isDisabled && handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 
                             transition-all duration-300 text-left ${
                      isSelected
                        ? 'border-accent bg-accent/10 text-accent' 
                        : isDisabled 
                          ? 'border-muted bg-muted/50 text-text-secondary cursor-not-allowed opacity-50'
                          : 'border-border hover:border-accent/30 hover:bg-muted/50 text-text-primary'
                    }`}
                    disabled={isDisabled}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isSelected ? 'bg-accent text-white' : 
                      isDisabled ? 'bg-muted text-text-secondary' :
                      'bg-muted text-text-secondary'
                    }`}>
                      <Icon name={option.icon} size={20} />
                    </div>
                    <span className="font-medium flex-1">{option.label}</span>
                    {isSelected && (
                      <Check size={20} className="text-accent flex-shrink-0" />
                    )}
                  </button>
                );
              })}
              
              {currentQuestion?.type === 'multiple' && currentQuestion?.maxSelections && (
                <p className="text-xs text-text-secondary text-center mt-2">
                  {(answers[currentQuestion.id] || []).length} of {currentQuestion.maxSelections} selected
                </p>
              )}
            </div>
          )}
        </div>
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
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          
          <Button
            variant="default"
            onClick={nextStep}
            disabled={currentQuestion?.required && !isAnswered}
            className="bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            iconName={currentStep === assessmentQuestions.length - 1 ? "CheckCircle" : "ArrowRight"}
            iconPosition="right"
          >
            {currentStep === assessmentQuestions.length - 1 ? 
              (isSaving ? 'Saving...' : 'Get Results') : 
              'Next'}
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

export default EnhancedCapabilityAssessment;