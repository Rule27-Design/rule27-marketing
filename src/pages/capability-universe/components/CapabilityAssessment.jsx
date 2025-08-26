import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CapabilityAssessment = memo(() => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Memoize assessment questions
  const assessmentQuestions = useMemo(() => [
    {
      id: 'business-stage',
      title: 'What stage is your business in?',
      type: 'single',
      options: [
        { value: 'startup', label: 'Startup (0-2 years)', icon: 'Rocket' },
        { value: 'growth', label: 'Growth Stage (2-5 years)', icon: 'TrendingUp' },
        { value: 'established', label: 'Established (5+ years)', icon: 'Building' },
        { value: 'enterprise', label: 'Enterprise (Large scale)', icon: 'Globe' }
      ]
    },
    {
      id: 'primary-goals',
      title: 'What are your primary goals?',
      type: 'multiple',
      options: [
        { value: 'brand-awareness', label: 'Increase Brand Awareness', icon: 'Eye' },
        { value: 'lead-generation', label: 'Generate More Leads', icon: 'Users' },
        { value: 'sales-growth', label: 'Boost Sales Revenue', icon: 'DollarSign' },
        { value: 'digital-presence', label: 'Improve Digital Presence', icon: 'Smartphone' },
        { value: 'operational-efficiency', label: 'Enhance Operations', icon: 'Settings' }
      ]
    },
    {
      id: 'current-challenges',
      title: 'What challenges are you facing?',
      type: 'multiple',
      options: [
        { value: 'outdated-website', label: 'Outdated Website', icon: 'Globe' },
        { value: 'low-conversion', label: 'Low Conversion Rates', icon: 'TrendingDown' },
        { value: 'poor-branding', label: 'Inconsistent Branding', icon: 'Palette' },
        { value: 'limited-reach', label: 'Limited Market Reach', icon: 'Target' },
        { value: 'technical-issues', label: 'Technical Problems', icon: 'AlertTriangle' }
      ]
    },
    {
      id: 'budget-range',
      title: 'What\'s your investment range?',
      type: 'single',
      options: [
        { value: 'under-10k', label: 'Under $10,000', icon: 'DollarSign' },
        { value: '10k-25k', label: '$10,000 - $25,000', icon: 'DollarSign' },
        { value: '25k-50k', label: '$25,000 - $50,000', icon: 'DollarSign' },
        { value: 'over-50k', label: 'Over $50,000', icon: 'DollarSign' }
      ]
    },
    {
      id: 'timeline',
      title: 'What\'s your preferred timeline?',
      type: 'single',
      options: [
        { value: 'asap', label: 'ASAP (Rush project)', icon: 'Zap' },
        { value: '1-3-months', label: '1-3 months', icon: 'Calendar' },
        { value: '3-6-months', label: '3-6 months', icon: 'Clock' },
        { value: 'flexible', label: 'Flexible timeline', icon: 'MoreHorizontal' }
      ]
    }
  ], []);

  const handleAnswer = useCallback((questionId, value, isMultiple = false) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(v => v !== value)
          : [...currentAnswers, value];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  }, []);

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
    setCurrentStep(0);
    setAnswers({});
  }, []);

  const getRecommendations = useMemo(() => {
    if (!showResults) return [];
    
    const businessStage = answers['business-stage'];
    const goals = answers['primary-goals'] || [];
    const recommendations = [];

    if (goals.includes('brand-awareness') || goals.includes('digital-presence')) {
      recommendations.push({
        service: 'Creative Studio',
        priority: 'High',
        reason: 'Your focus on brand awareness indicates a need for strong visual identity and creative assets.',
        estimatedCost: '$15,000 - $35,000',
        timeline: '6-8 weeks'
      });
    }

    if (goals.includes('lead-generation') || goals.includes('sales-growth')) {
      recommendations.push({
        service: 'Digital Marketing Command',
        priority: 'High',
        reason: 'Lead generation and sales growth require strategic marketing campaigns and optimization.',
        estimatedCost: '$20,000 - $50,000',
        timeline: '3-6 months'
      });
    }

    if (businessStage === 'startup' || businessStage === 'growth') {
      recommendations.push({
        service: 'Executive Advisory',
        priority: 'Medium',
        reason: 'Growing businesses benefit from strategic guidance and fractional executive support.',
        estimatedCost: '$10,000 - $25,000',
        timeline: 'Ongoing'
      });
    }

    recommendations.push({
      service: 'Development Lab',
      priority: goals.includes('operational-efficiency') ? 'High' : 'Medium',
      reason: 'Custom development solutions can address technical challenges and improve efficiency.',
      estimatedCost: '$25,000 - $75,000',
      timeline: '8-12 weeks'
    });

    return recommendations;
  }, [showResults, answers]);

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;
  const isAnswered = currentQuestion && (
    currentQuestion.type === 'multiple' 
      ? answers[currentQuestion.id]?.length > 0
      : !!answers[currentQuestion.id]
  );

  if (showResults) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 md:p-6 bg-gradient-to-r from-accent/10 to-transparent border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent text-white rounded-lg">
              <Icon name="CheckCircle" size={20} className="md:hidden" />
              <Icon name="CheckCircle" size={24} className="hidden md:block" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-primary">Assessment Complete!</h3>
              <p className="text-sm md:text-base text-text-secondary">Here are our personalized recommendations</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {getRecommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-xl p-4 md:p-6 space-y-3 md:space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h4 className="font-bold text-primary text-base md:text-lg">{rec.service}</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    rec.priority === 'High' 
                      ? 'bg-accent/20 text-accent' 
                      : 'bg-muted text-text-secondary'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-semibold text-primary text-sm md:text-base">{rec.estimatedCost}</div>
                  <div className="text-xs md:text-sm text-text-secondary">{rec.timeline}</div>
                </div>
              </div>
              
              <p className="text-sm md:text-base text-text-secondary">{rec.reason}</p>
              
              <Button
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent hover:text-white w-full sm:w-auto"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Learn More
              </Button>
            </motion.div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t border-border">
            <Button
              variant="default"
              className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule Strategy Call
            </Button>
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white w-full sm:w-auto"
              iconName="Download"
              iconPosition="left"
            >
              Download Report
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
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-bold text-primary">Capability Assessment</h3>
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
            <h4 className="text-base md:text-lg font-semibold text-primary">
              {currentQuestion?.title}
            </h4>

            <div className="grid gap-2 md:gap-3">
              {currentQuestion?.options?.map((option) => {
                const isSelected = currentQuestion.type === 'multiple'
                  ? (answers[currentQuestion.id] || []).includes(option.value)
                  : answers[currentQuestion.id] === option.value;

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                    className={`flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl border-2 
                             transition-all duration-300 text-left ${
                      isSelected
                        ? 'border-accent bg-accent/10 text-accent' 
                        : 'border-border hover:border-accent/30 hover:bg-muted/50 text-text-primary'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                      isSelected ? 'bg-accent text-white' : 'bg-muted text-text-secondary'
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
            </div>
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
            disabled={!isAnswered}
            className="bg-accent hover:bg-accent/90 disabled:opacity-50 
                     disabled:cursor-not-allowed text-sm md:text-base"
            iconName={currentStep === assessmentQuestions.length - 1 ? "CheckCircle" : "ArrowRight"}
            iconPosition="right"
          >
            {currentStep === assessmentQuestions.length - 1 ? 'Get Results' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
});

CapabilityAssessment.displayName = 'CapabilityAssessment';

export default CapabilityAssessment;