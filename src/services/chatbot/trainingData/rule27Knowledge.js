// src/services/chatbot/knowledgeBase/rule27Knowledge.js

export const rule27KnowledgeBase = [
  // Company Overview
  {
    type: 'company_info',
    category: 'about',
    title: 'About Rule27 Design',
    content: {
      description: 'Rule27 Design is a full-service digital powerhouse that uniquely combines marketing excellence with technical innovation. With 12 years of experience and 27+ team members, we deliver complete digital transformation through our four service zones: Creative Studio, Marketing Command, Development Lab, and Executive Advisory.',
      founded: '2014',
      team_size: '27+ certified experts',
      unique_value: 'We\'re the only agency that truly excels at both creative marketing AND enterprise development, with 60+ certifications across all major platforms.'
    },
    search_text: 'rule27 design about company agency digital marketing development',
    tags: ['company', 'about', 'overview'],
    priority: 100
  },

  // Service Zone: Creative Studio
  {
    type: 'service',
    category: 'creative_studio',
    title: 'Creative Studio Services',
    content: {
      services: ['Graphic Design', 'Motion Graphics', 'Videography', 'Photography', 'Content Writing'],
      description: 'Transform your brand identity with cutting-edge creative solutions that captivate audiences and drive engagement across all touchpoints.',
      key_benefits: [
        'Complete brand identity packages',
        'Digital and print design',
        'Content creation with strategic messaging',
        'Motion graphics and video production'
      ],
      typical_projects: ['Brand identity systems', 'Marketing collateral', 'Video campaigns', 'Content strategy'],
      starting_investment: 'Projects typically range from $5,000 to $50,000'
    }
  },

  // Service Zone: Marketing Command
  {
    type: 'service',
    category: 'marketing_command',
    title: 'Digital Marketing Command Services',
    content: {
      services: ['SEO', 'SEM', 'Social Media Marketing', 'Email Marketing', 'PPC', 'Marketing Automation'],
      description: 'Data-driven marketing strategies that deliver measurable results through performance optimization and strategic channel management.',
      key_benefits: [
        'Multi-channel campaign management',
        'Marketing automation implementation',
        'Performance tracking and ROI reporting',
        'Lead generation and nurturing'
      ],
      certifications: ['Google Ads', 'HubSpot', 'Meta', 'Klaviyo'],
      typical_results: '200% average increase in qualified leads, 40% reduction in cost per acquisition',
      starting_investment: 'Monthly retainers from $2,500 to $20,000'
    }
  },

  // Service Zone: Development Lab
  {
    type: 'service',
    category: 'development_lab',
    title: 'Development Lab Services',
    content: {
      services: ['Web Development', 'Mobile Apps', 'CRM Implementation', 'Cloud Solutions', 'Integrations', 'E-commerce'],
      description: 'Custom technical solutions built with modern technologies to solve complex business challenges and enhance operational efficiency.',
      key_benefits: [
        'Custom application development',
        'Platform implementations (Salesforce, HubSpot, Shopify)',
        'System integrations and APIs',
        'Cloud architecture and DevOps'
      ],
      certifications: ['Salesforce (12+)', 'AWS', 'Azure', 'Shopify Plus'],
      technologies: ['React', 'Node.js', 'Python', 'AWS', 'Salesforce'],
      starting_investment: 'Projects typically range from $25,000 to $250,000'
    }
  },

  // Service Zone: Executive Advisory
  {
    type: 'service',
    category: 'executive_advisory',
    title: 'Executive Advisory Services',
    content: {
      services: ['Fractional CTO', 'Fractional CMO', 'Fractional COO', 'Fractional CRO', 'Business Consulting', 'Operation Disruption'],
      description: 'Strategic leadership and fractional executive services to guide business growth and navigate complex market challenges.',
      key_benefits: [
        'C-level expertise without full-time cost',
        'Strategic planning and execution',
        'Digital transformation guidance',
        'Team mentorship and development'
      ],
      ideal_for: 'Companies between $5M-$100M revenue looking to scale',
      starting_investment: 'Monthly engagements from $7,500 to $50,000'
    }
  },

  // Certifications & Partnerships
  {
    type: 'certifications',
    category: 'expertise',
    title: 'Platform Certifications',
    content: {
      total_certifications: '60+',
      major_platforms: {
        'Salesforce': '12 certifications including Administrator, Developer, Marketing Cloud',
        'AWS': '4 certifications including Solutions Architect',
        'HubSpot': '9 certifications across all hubs',
        'Google': '8 certifications including Analytics and Ads',
        'Adobe': '5 certifications in Experience Cloud',
        'Meta': '4 certifications for advertising',
        'Microsoft Azure': '3 certifications'
      },
      value_prop: 'Our extensive certifications mean we can implement, integrate, and optimize any platform in your tech stack.'
    }
  },

  // Process & Methodology
  {
    type: 'process',
    category: 'methodology',
    title: 'Our Integrated Approach',
    content: {
      phases: [
        {
          name: 'Discovery & Strategy',
          duration: '1-2 weeks',
          description: 'Business audit, platform planning, strategic roadmap'
        },
        {
          name: 'Design & Architecture',
          duration: '2-3 weeks',
          description: 'Creative concepts, technical architecture, automation blueprints'
        },
        {
          name: 'Build & Configure',
          duration: '4-8 weeks',
          description: 'Platform implementation, custom development, quality assurance'
        },
        {
          name: 'Launch & Optimize',
          duration: 'Ongoing',
          description: 'Coordinated launch, performance monitoring, continuous optimization'
        }
      ],
      differentiator: 'One team handles both marketing and development, ensuring perfect alignment and faster delivery.'
    }
  },

  // Pricing & Investment
  {
    type: 'pricing',
    category: 'investment',
    title: 'Investment Guidelines',
    content: {
      approach: 'We provide custom proposals based on your specific needs, but here are typical investment ranges:',
      project_ranges: {
        'Brand Identity Package': '$10,000 - $50,000',
        'Website Design & Development': '$25,000 - $150,000',
        'Marketing Campaigns': '$5,000 - $50,000 per campaign',
        'CRM Implementation': '$25,000 - $100,000',
        'Mobile App Development': '$50,000 - $250,000'
      },
      retainer_ranges: {
        'Marketing Management': '$2,500 - $20,000/month',
        'Development Support': '$5,000 - $25,000/month',
        'Fractional Executive': '$7,500 - $50,000/month'
      },
      minimum_engagement: 'We typically work with companies that can invest at least $25,000 in their digital transformation.'
    }
  },

  // Ideal Client Profile
  {
    type: 'qualification',
    category: 'ideal_client',
    title: 'Who We Work Best With',
    content: {
      company_profile: {
        'Size': '20-500 employees',
        'Revenue': '$5M - $100M',
        'Type': 'B2B companies, SaaS, Professional Services, Manufacturing',
        'Mindset': 'Growth-focused, value long-term partnerships, ready to innovate'
      },
      good_fit_signals: [
        'Need both marketing and technical expertise',
        'Want integrated solutions, not band-aids',
        'Value certified expertise and proven processes',
        'Ready to invest in transformation, not just tactics'
      ],
      not_a_fit: [
        'Looking for the cheapest option',
        'Want quick fixes without strategy',
        'Not open to change or innovation',
        'Expect overnight results'
      ]
    }
  },

  // FAQs
  {
    type: 'faq',
    category: 'general',
    title: 'How are you different from other agencies?',
    content: {
      question: 'How are you different from other agencies?',
      answer: 'We\'re the only agency that truly excels at both creative marketing AND enterprise development. While others specialize in one area, we have certified experts in both, with 60+ platform certifications. This means you get integrated solutions from one team, faster delivery, and perfect alignment between your marketing and technical systems.',
      proof_points: [
        '12+ Salesforce certifications',
        '9 HubSpot certifications',
        'AWS and Azure certified developers',
        'Google, Meta, and Adobe certified marketers'
      ]
    }
  },
  {
    type: 'faq',
    category: 'timeline',
    title: 'How long do projects typically take?',
    content: {
      question: 'How long do projects typically take?',
      answer: 'Timeline depends on scope, but typical projects run:',
      timelines: {
        'Brand Identity': '4-6 weeks',
        'Website Design & Development': '8-12 weeks',
        'CRM Implementation': '8-16 weeks',
        'Marketing Campaign Launch': '2-4 weeks',
        'Mobile App Development': '12-20 weeks'
      },
      note: 'We can accelerate timelines for urgent projects with additional resources.'
    }
  },
  {
    type: 'faq',
    category: 'support',
    title: 'Do you provide ongoing support?',
    content: {
      question: 'Do you provide ongoing support?',
      answer: 'Absolutely! We offer multiple support options:',
      options: [
        'Monthly retainers for continuous optimization',
        'Support packages for maintenance and updates',
        'Fractional executive services for strategic guidance',
        'Training for your internal teams'
      ],
      philosophy: 'We believe in long-term partnerships. 80% of our clients have been with us for over 2 years.'
    }
  }
];