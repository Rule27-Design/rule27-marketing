// src/pages/contact-consultation-portal/components/FAQSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'general', label: 'General', icon: 'HelpCircle', count: 8 },
    { id: 'process', label: 'Process', icon: 'GitBranch', count: 6 },
    { id: 'pricing', label: 'Pricing', icon: 'DollarSign', count: 5 },
    { id: 'timeline', label: 'Timeline', icon: 'Clock', count: 4 },
    { id: 'support', label: 'Support', icon: 'Headphones', count: 5 }
  ];

  const allFaqs = {
    general: [
      {
        id: 'g1',
        question: "What makes Rule27 Design different from other agencies?",
        answer: "We're not just another agency—we're creative rebels who break conventional boundaries. Our unique approach combines creative audacity with technical precision, delivering results that make other agencies look ordinary.",
        highlight: true
      },
      {
        id: 'g2',
        question: "Do you work with startups or only established companies?",
        answer: "We work with ambitious brands at every stage—from pre-seed startups to Fortune 500 enterprises. What matters isn't your size but your ambition."
      },
      {
        id: 'g3',
        question: "What industries do you specialize in?",
        answer: "While we excel across all industries, we have deep expertise in Technology, Healthcare, Finance, E-commerce, and SaaS."
      }
    ],
    process: [
      {
        id: 'p1',
        question: "What's your typical project process?",
        answer: "Our process follows four phases: Discovery (deep dive into your business), Strategy (data-driven planning), Execution (bringing vision to life), and Optimization (continuous improvement)."
      },
      {
        id: 'p2',
        question: "How involved do we need to be during the project?",
        answer: "Your involvement is flexible based on your preferences. Minimum requirement is weekly 30-minute check-ins and timely feedback on deliverables."
      }
    ],
    pricing: [
      {
        id: 'pr1',
        question: "How much do your services typically cost?",
        answer: "Our projects range from $10,000 to $500,000+ depending on scope and complexity. We offer transparent, value-based pricing with clear deliverables.",
        highlight: true
      },
      {
        id: 'pr2',
        question: "Do you offer payment plans?",
        answer: "Yes! We offer flexible payment structures: 50/50 split, monthly installments for larger projects, and performance-based models."
      }
    ],
    timeline: [
      {
        id: 't1',
        question: "How long do projects typically take?",
        answer: "Timeline varies by project scope: Brand Identity (4-6 weeks), Website Design & Development (8-12 weeks), Complete Digital Transformation (3-6 months)."
      },
      {
        id: 't2',
        question: "Can you handle urgent or rush projects?",
        answer: "Yes! We maintain capacity for urgent projects. Rush delivery (50% faster) incurs a 25-50% premium."
      }
    ],
    support: [
      {
        id: 's1',
        question: "What kind of support do you provide?",
        answer: "We offer comprehensive support: Business hours support via phone/email/chat, dedicated account managers, technical documentation and training."
      },
      {
        id: 's2',
        question: "Do you offer maintenance packages?",
        answer: "Yes! Our maintenance packages range from basic monitoring ($500/month) to comprehensive management ($5,000+/month)."
      }
    ]
  };

  const toggleItem = (itemId) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Get filtered FAQs
  const getFilteredFaqs = () => {
    let results = [];
    const categoryFaqs = allFaqs[activeCategory];
    
    if (categoryFaqs) {
      categoryFaqs.forEach(faq => {
        results.push({
          ...faq,
          category: activeCategory
        });
      });
    }
    
    if (searchTerm && searchTerm.trim() !== '') {
      results = results.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return results;
  };

  const filteredFaqs = getFilteredFaqs();

  return (
    <section className="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading-regular text-primary mb-3 sm:mb-4 uppercase tracking-wider">
            Frequently Asked
            <span className="text-accent block mt-2 font-heading-regular uppercase">Questions</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-sans">
            Everything you need to know about working with Rule27 Design. Can't find your answer? Let's talk.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base font-sans"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-heading-regular uppercase tracking-wider transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon name={category.icon} size={14} className="sm:w-4 sm:h-4" />
                <span>{category.label}</span>
                <span className="text-xs opacity-80 font-sans">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-border">
              <Icon name="Search" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-heading-regular text-gray-600 uppercase tracking-wider">No questions found</p>
              <p className="text-sm text-gray-500 mt-2 font-sans">
                {searchTerm 
                  ? "Try searching for different keywords"
                  : "Please try selecting a different category"}
              </p>
            </div>
          ) : (
            filteredFaqs.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg sm:rounded-xl border overflow-hidden transition-all duration-300 ${
                  item.highlight ? 'border-accent shadow-lg' : 'border-border hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between group"
                >
                  <div className="flex-1 pr-3 sm:pr-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-heading-regular text-primary group-hover:text-accent transition-colors duration-300 uppercase tracking-wider">
                      {item.question}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {item.highlight && (
                        <span className="inline-block px-2 py-0.5 sm:py-1 bg-accent/10 text-accent text-xs font-heading-regular uppercase tracking-wider rounded">
                          Most Asked
                        </span>
                      )}
                      <span className="text-xs text-gray-500 capitalize font-sans">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 flex-shrink-0 ${
                    openItems.includes(item.id) ? 'rotate-180' : ''
                  }`}>
                    <Icon name="ChevronDown" size={18} className="text-gray-400 sm:w-5 sm:h-5" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                        <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-sans">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-border">
          <Icon name="MessageCircle" size={36} className="text-accent mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
          <h3 className="text-xl sm:text-2xl font-heading-regular text-primary mb-3 sm:mb-4 uppercase tracking-wider">
            Still Have Questions?
          </h3>
          <p className="text-text-secondary mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base font-sans">
            Can't find what you're looking for? Our team is here to help with any questions you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              variant="default"
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-sm sm:text-base font-heading-regular uppercase tracking-wider"
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule a Call
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-white text-sm sm:text-base font-heading-regular uppercase tracking-wider"
              iconName="Mail"
              iconPosition="left"
            >
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;