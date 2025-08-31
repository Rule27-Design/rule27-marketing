import React, { useState } from 'react';
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

  const faqs = {
    general: [
      {
        id: 'g1',
        question: "What makes Rule27 Design different from other agencies?",
        answer: "We're not just another agency—we're creative rebels who break conventional boundaries. Our unique approach combines creative audacity with technical precision, delivering results that make other agencies look ordinary. We achieve 40% higher conversion rates on average through our proprietary methodology that blends behavioral psychology, data science, and bold creativity.",
        highlight: true
      },
      {
        id: 'g2',
        question: "Do you work with startups or only established companies?",
        answer: "We work with ambitious brands at every stage—from pre-seed startups to Fortune 500 enterprises. What matters isn't your size but your ambition. We've helped startups achieve unicorn status and transformed established brands into industry disruptors. Our scalable approach adapts to your needs and budget."
      },
      {
        id: 'g3',
        question: "What industries do you specialize in?",
        answer: "While we excel across all industries, we have deep expertise in Technology, Healthcare, Finance, E-commerce, and SaaS. Our diverse portfolio includes 150+ successful projects spanning 25+ industries. We believe great design and strategy transcend industry boundaries."
      },
      {
        id: 'g4',
        question: "Can you work with our existing team?",
        answer: "Absolutely! We seamlessly integrate with your existing teams, whether as strategic partners, creative collaborators, or technical consultants. Our fractional executive services mean you get C-suite expertise without the overhead. We're experts at knowledge transfer and empowering your team."
      },
      {
        id: 'g5',
        question: "What's your typical client engagement model?",
        answer: "We offer flexible engagement models: Project-based for specific initiatives, Retainer for ongoing partnership, and Fractional Executive for strategic leadership. Most clients start with a project and evolve into long-term partnerships as they experience our impact."
      },
      {
        id: 'g6',
        question: "Do you offer consultations before starting a project?",
        answer: "Yes! We offer a complimentary 60-minute strategy session where we dive deep into your challenges, opportunities, and goals. This isn't a sales pitch—it's a valuable working session where you'll leave with actionable insights, whether or not we work together."
      },
      {
        id: 'g7',
        question: "What size projects do you typically handle?",
        answer: "We handle everything from $10K brand refreshes to $1M+ digital transformations. Our modular approach means we can scale our services to match your needs and budget. Every project, regardless of size, receives the same level of excellence and attention."
      },
      {
        id: 'g8',
        question: "How do you measure success?",
        answer: "Success isn't subjective—it's measurable. We establish clear KPIs at the project outset: conversion rates, revenue growth, user engagement, brand awareness, or operational efficiency. Our average client sees 340% ROI within the first year. We're so confident that we offer performance-based pricing options."
      }
    ],
    process: [
      {
        id: 'p1',
        question: "What's your typical project process?",
        answer: "Our process follows four phases: Discovery (deep dive into your business), Strategy (data-driven planning), Execution (bringing vision to life), and Optimization (continuous improvement). Each phase has clear deliverables, timelines, and checkpoints. We maintain complete transparency throughout with weekly updates and open communication channels."
      },
      {
        id: 'p2',
        question: "How involved do we need to be during the project?",
        answer: "Your involvement is flexible based on your preferences. Minimum requirement is weekly 30-minute check-ins and timely feedback on deliverables. Many clients prefer deeper collaboration, which we encourage. We've designed our process to respect your time while ensuring your vision is perfectly realized."
      },
      {
        id: 'p3',
        question: "How do you handle revisions and feedback?",
        answer: "We believe in getting it right, not just getting it done. Our contracts include 3 rounds of revisions at each major milestone. We use structured feedback tools to ensure clear communication. Additional revisions are handled transparently with pre-agreed rates. Our goal is your complete satisfaction."
      },
      {
        id: 'p4',
        question: "What happens after project completion?",
        answer: "Launch is just the beginning. All projects include 30-day post-launch support. We offer ongoing maintenance packages, performance monitoring, and optimization services. Many clients transition to retainer relationships for continuous improvement and support."
      },
      {
        id: 'p5',
        question: "Do you provide training for our team?",
        answer: "Yes! Knowledge transfer is crucial for long-term success. We provide comprehensive documentation, video tutorials, and hands-on training sessions. Our goal is to empower your team to maintain and evolve what we build together."
      },
      {
        id: 'p6',
        question: "How do you ensure project stays on timeline?",
        answer: "We use agile project management with weekly sprints and daily standups. Our project dashboard gives you real-time visibility into progress. We build in buffer time for unexpected challenges and maintain a 96% on-time delivery rate. If delays occur, we communicate immediately with solutions."
      }
    ],
    pricing: [
      {
        id: 'pr1',
        question: "How much do your services typically cost?",
        answer: "Our projects range from $10,000 to $500,000+ depending on scope and complexity. We offer transparent, value-based pricing with clear deliverables. Most importantly, we focus on ROI—our average client sees returns of 340% within the first year. We'll provide a detailed quote after understanding your specific needs.",
        highlight: true
      },
      {
        id: 'pr2',
        question: "Do you offer payment plans?",
        answer: "Yes! We offer flexible payment structures: 50/50 split (half upfront, half on completion), Monthly installments for larger projects, and Performance-based models where part of our fee is tied to results. We want to be your partner, not a financial burden."
      },
      {
        id: 'pr3',
        question: "What's included in your pricing?",
        answer: "Our quotes are comprehensive with no hidden fees. They include: strategy and planning, design and development, project management, quality assurance, 30-day post-launch support, training and documentation. Any additional services or scope changes are discussed transparently."
      },
      {
        id: 'pr4',
        question: "Do you offer discounts for startups or non-profits?",
        answer: "We believe in supporting innovation and social impact. We offer special rates for qualifying startups and significant discounts for registered non-profits. We also run a pro-bono program where we take on one impactful project per quarter at no cost."
      },
      {
        id: 'pr5',
        question: "How do retainer agreements work?",
        answer: "Retainers provide ongoing access to our team at predictable monthly rates. Plans range from $5,000/month for basic support to $50,000/month for comprehensive partnerships. Retainer clients get priority support, discounted project rates, and dedicated team members."
      }
    ],
    timeline: [
      {
        id: 't1',
        question: "How long do projects typically take?",
        answer: "Timeline varies by project scope: Brand Identity (4-6 weeks), Website Design & Development (8-12 weeks), Complete Digital Transformation (3-6 months), Marketing Campaigns (2-4 weeks setup + ongoing). We can accommodate rush projects with adjusted pricing."
      },
      {
        id: 't2',
        question: "Can you handle urgent or rush projects?",
        answer: "Yes! We maintain capacity for urgent projects. Rush delivery (50% faster) incurs a 25-50% premium. Our record is launching a complete e-commerce platform in 10 days. However, we never compromise quality for speed."
      },
      {
        id: 't3',
        question: "When can you start our project?",
        answer: "We typically begin new projects within 1-2 weeks of contract signing. Urgent projects can start immediately. Our current availability varies, but we always make room for exciting opportunities. The discovery phase can often begin while we're wrapping up other commitments."
      },
      {
        id: 't4',
        question: "How far in advance should we plan?",
        answer: "Ideal planning timeline is 4-6 weeks before your desired launch. This allows for thorough discovery, strategic planning, and quality execution. However, we're experts at working with tight deadlines when necessary."
      }
    ],
    support: [
      {
        id: 's1',
        question: "What kind of support do you provide?",
        answer: "We offer comprehensive support: 24/7 emergency hotline for critical issues, Business hours support via phone/email/chat, Dedicated account managers for retainer clients, Technical documentation and training, Ongoing optimization and maintenance packages."
      },
      {
        id: 's2',
        question: "Do you offer maintenance packages?",
        answer: "Yes! Our maintenance packages range from basic monitoring ($500/month) to comprehensive management ($5,000+/month) including updates, optimization, content management, and performance monitoring. All packages include priority support and regular health checks."
      },
      {
        id: 's3',
        question: "What if something breaks after launch?",
        answer: "All projects include 30-day warranty covering any defects or issues. Our 24/7 emergency hotline ensures critical issues are addressed immediately. We maintain 99.9% uptime for managed services and respond to critical issues within 15 minutes."
      },
      {
        id: 's4',
        question: "Can you help with hosting and infrastructure?",
        answer: "Absolutely! We're AWS and Google Cloud partners. We can manage your entire infrastructure, recommend optimal hosting solutions, handle migrations, and ensure scalability. Our DevOps team maintains infrastructure for clients handling millions of daily users."
      },
      {
        id: 's5',
        question: "Do you provide analytics and reporting?",
        answer: "Yes! We set up comprehensive analytics, create custom dashboards, and provide monthly performance reports. Our data team turns metrics into actionable insights. Retainer clients receive weekly reports and quarterly strategy reviews."
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

  const filteredFaqs = Object.entries(faqs).reduce((acc, [category, items]) => {
    if (activeCategory === 'all' || activeCategory === category) {
      const filtered = items.filter(item => 
        searchTerm === '' || 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    }
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Frequently Asked <span className="text-accent">Questions</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto px-4">
            Everything you need to know about working with Rule27 Design. Can't find your answer? Let's talk.
          </motion.p>
        </motion.div>

        {/* Search Bar - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </motion.div>

        {/* Category Tabs - Mobile Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 overflow-x-auto"
        >
          <div className="flex space-x-2 pb-2 min-w-max sm:flex-wrap sm:justify-center sm:min-w-0">
            <button
              onClick={() => setActiveCategory('general')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                activeCategory === 'general'
                  ? 'bg-accent text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Questions
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon name={category.icon} size={14} className="sm:w-4 sm:h-4" />
                <span>{category.label}</span>
                <span className="text-xs opacity-80">({category.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items - Mobile Optimized */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3 sm:space-y-4"
        >
          {Object.entries(filteredFaqs).map(([category, items]) => (
            <div key={category} className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={`bg-white rounded-lg sm:rounded-xl border overflow-hidden transition-all duration-300 ${
                    item.highlight ? 'border-accent shadow-lg' : 'border-border hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between group"
                  >
                    <div className="flex-1 pr-3 sm:pr-4">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                        {item.question}
                      </h3>
                      {item.highlight && (
                        <span className="inline-block mt-1 sm:mt-2 px-2 py-0.5 sm:py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                          Most Asked
                        </span>
                      )}
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
                          <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Still Have Questions CTA - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 lg:mt-16 text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-border"
        >
          <Icon name="MessageCircle" size={36} className="text-accent mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">
            Still Have Questions?
          </h3>
          <p className="text-text-secondary mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
            Can't find what you're looking for? Our team is here to help with any questions you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button
              variant="default"
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-sm sm:text-base"
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule a Call
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-white text-sm sm:text-base"
              iconName="Mail"
              iconPosition="left"
            >
              Email Support
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;