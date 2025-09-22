// uploadTrainingData.js
// Run with: node uploadTrainingData.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for write access
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://emifvqwhylfdjiefboud.supabase.co',
  process.env.SUPABASE_SERVICE_KEY // You need the service role key, not anon key
);

// ================================
// TRAINING DATA FROM YOUR FILES
// ================================

// From certificationIntents.js
const certificationIntents = [
  { user_message: "Are you Salesforce certified?", detected_intent: "certification_inquiry" },
  { user_message: "What platforms are you certified in?", detected_intent: "certification_inquiry" },
  { user_message: "Do you have HubSpot certifications?", detected_intent: "certification_inquiry" },
  { user_message: "Are your developers AWS certified?", detected_intent: "certification_inquiry" },
  { user_message: "How many certified experts do you have?", detected_intent: "certification_inquiry" },
  { user_message: "Do you have Google Ads certifications?", detected_intent: "certification_inquiry" },
  { user_message: "Are you a Shopify Plus partner?", detected_intent: "certification_inquiry" }
];

// From companyFAQs.js
const companyFAQs = [
  { user_message: "How long has Rule27 been in business?", detected_intent: "company_info" },
  { user_message: "Where are you located?", detected_intent: "company_info" },
  { user_message: "How big is your team?", detected_intent: "company_info" },
  { user_message: "Do you work with remote clients?", detected_intent: "company_info" },
  { user_message: "What industries do you specialize in?", detected_intent: "company_info" },
  { user_message: "Who are your typical clients?", detected_intent: "company_info" },
  { user_message: "What does Rule27 mean?", detected_intent: "company_info" },
  { user_message: "Tell me about your company culture", detected_intent: "company_info" }
];

// From competitorIntents.js
const competitorIntents = [
  { user_message: "How are you different from other agencies?", detected_intent: "competitor_comparison" },
  { user_message: "Why should we choose Rule27 over a specialist agency?", detected_intent: "competitor_comparison" },
  { user_message: "Do you really do both marketing AND development well?", detected_intent: "competitor_comparison" },
  { user_message: "Most agencies don't do both creative and technical", detected_intent: "competitor_comparison" },
  { user_message: "We're also talking to other firms", detected_intent: "competitor_comparison" },
  { user_message: "What makes Rule27 unique?", detected_intent: "competitor_comparison" }
];

// From demoIntents.js
const demoIntents = [
  { user_message: "Can we schedule a consultation?", detected_intent: "demo_request" },
  { user_message: "I'd like to discuss our project with someone", detected_intent: "demo_request" },
  { user_message: "Can I see examples of your work?", detected_intent: "portfolio_request" },
  { user_message: "Do you have case studies in our industry?", detected_intent: "portfolio_request" },
  { user_message: "Can we set up a discovery call?", detected_intent: "demo_request" },
  { user_message: "I want to learn more about your process", detected_intent: "demo_request" },
  { user_message: "Can someone walk me through your capabilities?", detected_intent: "demo_request" },
  { user_message: "Let's talk about working together", detected_intent: "demo_request" }
];

// From objectionIntents.js
const objectionIntents = [
  // Price Objections
  { user_message: "That seems expensive", detected_intent: "price_objection" },
  { user_message: "We can get it cheaper elsewhere", detected_intent: "price_objection" },
  { user_message: "Can you lower your rates?", detected_intent: "price_objection" },
  // Trust Objections
  { user_message: "How do we know you can handle both marketing and dev?", detected_intent: "capability_objection" },
  { user_message: "We prefer specialist agencies", detected_intent: "capability_objection" },
  { user_message: "Have you worked with companies like ours?", detected_intent: "experience_objection" },
  // Process Objections
  { user_message: "We've had bad experiences with agencies", detected_intent: "trust_objection" },
  { user_message: "How do we know you'll deliver on time?", detected_intent: "process_objection" },
  { user_message: "What if we're not satisfied with the work?", detected_intent: "guarantee_objection" }
];

// From pricingIntents.js
const pricingIntents = [
  { user_message: "What are your rates?", detected_intent: "pricing_inquiry" },
  { user_message: "How much does a website redesign cost?", detected_intent: "pricing_inquiry" },
  { user_message: "What's your hourly rate for development?", detected_intent: "pricing_inquiry" },
  { user_message: "Do you have retainer packages?", detected_intent: "pricing_inquiry" },
  { user_message: "What's the minimum project size you take on?", detected_intent: "pricing_inquiry" },
  { user_message: "Can you work within a $50k budget?", detected_intent: "budget_qualification" },
  { user_message: "We have $100-250k for digital transformation this year", detected_intent: "budget_qualification" },
  { user_message: "What does a typical Salesforce implementation cost?", detected_intent: "pricing_inquiry" },
  { user_message: "How much for ongoing marketing management?", detected_intent: "pricing_inquiry" },
  { user_message: "Do you offer fractional CTO services and what's the investment?", detected_intent: "pricing_inquiry" },
  { user_message: "What's included in your SEO packages?", detected_intent: "pricing_inquiry" },
  { user_message: "Can you break down costs for creative vs development?", detected_intent: "pricing_inquiry" }
];

// From qualificationIntents.js
const qualificationIntents = [
  // Company Size & Type
  { user_message: "We're a B2B SaaS company with 50 employees", detected_intent: "company_qualification" },
  { user_message: "We're a startup looking to build our first platform", detected_intent: "company_qualification" },
  { user_message: "We're an enterprise with multiple brands", detected_intent: "company_qualification" },
  { user_message: "We're a mid-market company ready to scale", detected_intent: "company_qualification" },
  // Timeline Questions
  { user_message: "We need this launched by Q2", detected_intent: "timeline_qualification" },
  { user_message: "This is urgent - can you start next week?", detected_intent: "timeline_qualification" },
  { user_message: "We're planning for next fiscal year", detected_intent: "timeline_qualification" },
  { user_message: "How quickly can you deliver a new website?", detected_intent: "timeline_qualification" },
  // Current Situation
  { user_message: "Our current website isn't generating leads", detected_intent: "pain_point_identification" },
  { user_message: "We're using HubSpot but not getting results", detected_intent: "pain_point_identification" },
  { user_message: "Our marketing and sales teams aren't aligned", detected_intent: "pain_point_identification" },
  { user_message: "We need to modernize our tech stack", detected_intent: "pain_point_identification" },
  { user_message: "Our brand feels outdated compared to competitors", detected_intent: "pain_point_identification" }
];

// From serviceIntents.js
const serviceIntents = [
  // Creative Studio Questions
  { user_message: "Do you do both digital and print design?", detected_intent: "creative_services_inquiry" },
  { user_message: "Can you create our entire brand identity?", detected_intent: "creative_services_inquiry" },
  { user_message: "Do you write content or just design?", detected_intent: "creative_services_inquiry" },
  { user_message: "How many design revisions are included?", detected_intent: "creative_services_inquiry" },
  { user_message: "Can you work with our existing brand guidelines?", detected_intent: "creative_services_inquiry" },
  // Marketing Command Questions
  { user_message: "How long until we see SEO results?", detected_intent: "marketing_services_inquiry" },
  { user_message: "What's the minimum ad spend for PPC campaigns?", detected_intent: "marketing_services_inquiry" },
  { user_message: "Do you manage all social media platforms?", detected_intent: "marketing_services_inquiry" },
  { user_message: "Can you integrate marketing automation with our CRM?", detected_intent: "marketing_services_inquiry" },
  { user_message: "How do you track and report on campaign ROI?", detected_intent: "marketing_services_inquiry" },
  { user_message: "Do you handle email marketing and automation?", detected_intent: "marketing_services_inquiry" },
  // Development Lab Questions
  { user_message: "Do you build custom websites or use templates?", detected_intent: "development_services_inquiry" },
  { user_message: "Can you integrate with Salesforce?", detected_intent: "development_services_inquiry" },
  { user_message: "Do you develop mobile apps too?", detected_intent: "development_services_inquiry" },
  { user_message: "Can you migrate us from WordPress to Shopify?", detected_intent: "development_services_inquiry" },
  { user_message: "Do you provide ongoing support after launch?", detected_intent: "development_services_inquiry" },
  { user_message: "Can you build custom integrations between our systems?", detected_intent: "development_services_inquiry" },
  { user_message: "Do you work with AWS or Azure?", detected_intent: "development_services_inquiry" },
  // Executive Advisory Questions
  { user_message: "How does fractional CMO services work?", detected_intent: "executive_advisory_inquiry" },
  { user_message: "Can you help with digital transformation strategy?", detected_intent: "executive_advisory_inquiry" },
  { user_message: "Do you offer fractional CTO services?", detected_intent: "executive_advisory_inquiry" },
  { user_message: "Can you mentor our internal marketing team?", detected_intent: "executive_advisory_inquiry" },
  { user_message: "What does operations disruption mean?", detected_intent: "executive_advisory_inquiry" }
];

// Combine all training data
const allTrainingData = [
  ...certificationIntents,
  ...companyFAQs,
  ...competitorIntents,
  ...demoIntents,
  ...objectionIntents,
  ...pricingIntents,
  ...qualificationIntents,
  ...serviceIntents
];

// From rule27Knowledge.js - converted to knowledge_base format
const knowledgeBaseData = [
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
    },
    search_text: 'creative design graphics video content brand identity',
    tags: ['creative', 'design', 'branding'],
    priority: 90
  },
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
    },
    search_text: 'marketing seo sem ppc social media email automation digital',
    tags: ['marketing', 'digital', 'seo', 'ppc'],
    priority: 95
  },
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
    },
    search_text: 'development web mobile app crm cloud integration ecommerce shopify salesforce',
    tags: ['development', 'web', 'mobile', 'crm', 'ecommerce'],
    priority: 100
  },
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
    },
    search_text: 'fractional cto cmo executive advisory consulting strategy',
    tags: ['executive', 'fractional', 'strategy'],
    priority: 85
  },
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
    },
    search_text: 'certifications salesforce aws hubspot google adobe meta azure certified',
    tags: ['certifications', 'expertise', 'platforms'],
    priority: 95
  },
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
    },
    search_text: 'pricing cost investment budget package retainer',
    tags: ['pricing', 'investment', 'budget'],
    priority: 100
  }
];

// Intent patterns for the intent_patterns table
const intentPatterns = [
  {
    intent_name: 'pricing_inquiry',
    intent_category: 'sales',
    keywords: ['price', 'cost', 'budget', 'invest', 'how much', 'package', 'pricing', 'expensive', 'cheap', 'afford', 'rate'],
    regex_patterns: ['how much.*cost', 'what.*price', 'pricing.*package', 'budget.*range'],
    example_phrases: ['What are your prices?', 'How much does a website cost?', 'What\'s your hourly rate?'],
    confidence_threshold: 0.7,
    is_high_intent: true,
    action_type: 'provide_pricing'
  },
  {
    intent_name: 'demo_request',
    intent_category: 'sales',
    keywords: ['demo', 'consultation', 'meeting', 'call', 'schedule', 'book', 'appointment', 'discuss'],
    regex_patterns: ['book.*call', 'schedule.*meeting', 'set up.*consultation', 'arrange.*demo'],
    example_phrases: ['Can we schedule a consultation?', 'I\'d like to book a demo', 'Let\'s set up a call'],
    confidence_threshold: 0.8,
    is_high_intent: true,
    action_type: 'schedule_meeting'
  },
  {
    intent_name: 'service_inquiry',
    intent_category: 'exploration',
    keywords: ['service', 'offer', 'what do you do', 'capabilities', 'solutions'],
    regex_patterns: ['what.*services', 'what.*offer', 'what can you', 'do you provide'],
    example_phrases: ['What services do you offer?', 'What can you help with?', 'Tell me about your capabilities'],
    confidence_threshold: 0.7,
    is_high_intent: false,
    action_type: 'list_services'
  },
  {
    intent_name: 'portfolio_request',
    intent_category: 'exploration',
    keywords: ['case study', 'example', 'portfolio', 'work', 'project', 'client', 'showcase'],
    regex_patterns: ['show.*work', 'see.*example', 'case stud', 'portfolio'],
    example_phrases: ['Can I see your work?', 'Show me case studies', 'Do you have examples?'],
    confidence_threshold: 0.7,
    is_high_intent: false,
    action_type: 'show_portfolio'
  },
  {
    intent_name: 'certification_inquiry',
    intent_category: 'trust',
    keywords: ['certified', 'certification', 'qualified', 'expert', 'credential', 'partner'],
    regex_patterns: ['are you.*certified', 'what.*certifications', '.*certified in'],
    example_phrases: ['Are you Salesforce certified?', 'What certifications do you have?'],
    confidence_threshold: 0.6,
    is_high_intent: false,
    action_type: 'list_certifications'
  },
  {
    intent_name: 'competitor_comparison',
    intent_category: 'evaluation',
    keywords: ['different', 'unique', 'versus', 'compare', 'better', 'why you', 'competition'],
    regex_patterns: ['how.*different', 'what makes.*unique', 'versus|vs', 'compared to'],
    example_phrases: ['How are you different?', 'Why choose you?', 'What makes you unique?'],
    confidence_threshold: 0.7,
    is_high_intent: false,
    action_type: 'differentiation'
  }
];

// Qualification rules for lead scoring
const qualificationRules = [
  {
    rule_name: 'budget_mentioned',
    rule_type: 'keyword',
    conditions: { message_pattern: '\\$[0-9]+k|budget.*[0-9]+|invest.*[0-9]+' },
    score_adjustment: 20,
    priority: 100
  },
  {
    rule_name: 'timeline_urgent',
    rule_type: 'keyword',
    conditions: { message_pattern: 'urgent|asap|immediately|this week|next week' },
    score_adjustment: 15,
    priority: 90
  },
  {
    rule_name: 'decision_maker',
    rule_type: 'keyword',
    conditions: { message_pattern: 'we need|our team|our company|we want|we require' },
    score_adjustment: 10,
    priority: 80
  },
  {
    rule_name: 'high_value_project',
    rule_type: 'keyword',
    conditions: { message_pattern: 'enterprise|platform|transformation|rebuild|overhaul' },
    score_adjustment: 15,
    priority: 85
  }
];

// Response templates
const responseTemplates = [
  {
    template_key: 'greeting_new_visitor',
    intent_name: 'greeting',
    scenario: 'new_visitor',
    template_text: 'Welcome to Rule27 Design! I\'m Larry, your AI assistant. We\'re the digital powerhouse that excels at BOTH marketing AND development - something most agencies can\'t do. What brings you here today?',
    variables: [],
    active: true
  },
  {
    template_key: 'pricing_response',
    intent_name: 'pricing_inquiry',
    scenario: 'pricing_discovery',
    template_text: 'Our projects typically start at $25,000. We offer three main packages: Growth ($25K-50K) for startups, Scale ($50K-100K) for established companies, and Enterprise (Custom) for complex needs. What size project are you considering?',
    variables: ['project_type'],
    active: true
  },
  {
    template_key: 'demo_scheduling',
    intent_name: 'demo_request',
    scenario: 'qualified_lead',
    template_text: 'I\'d love to connect you with our team! We can discuss your specific needs and show you exactly how we\'ve helped similar companies. Are you available for a 30-minute strategy session this week?',
    variables: [],
    active: true
  }
];

// ================================
// UPLOAD FUNCTIONS
// ================================

async function clearExistingData() {
  console.log('🧹 Clearing existing training data...');
  
  // Clear tables in order to avoid foreign key constraints
  const tablesToClear = [
    'intent_training_data',
    'knowledge_base',
    'intent_patterns',
    'qualification_rules',
    'response_templates'
  ];
  
  for (const table of tablesToClear) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (error) {
        console.log(`⚠️  Could not clear ${table}:`, error.message);
      } else {
        console.log(`✅ Cleared ${table}`);
      }
    } catch (err) {
      console.log(`⚠️  Table ${table} might not exist`);
    }
  }
}

async function uploadIntentTrainingData() {
  console.log('\n📝 Uploading intent training data...');
  
  for (const item of allTrainingData) {
    try {
      const { error } = await supabase
        .from('intent_training_data')
        .insert({
          user_message: item.user_message,
          detected_intent: item.detected_intent,
          is_validated: true,
          use_for_training: true
        });
      
      if (error) {
        console.log(`⚠️  Failed to insert: "${item.user_message.substring(0, 50)}..."`, error.message);
      }
    } catch (err) {
      console.log(`⚠️  Error with training data:`, err.message);
    }
  }
  
  console.log(`✅ Uploaded ${allTrainingData.length} training examples`);
}

async function uploadKnowledgeBase() {
  console.log('\n📚 Uploading knowledge base...');
  
  for (const item of knowledgeBaseData) {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .insert({
          type: item.type,
          category: item.category,
          title: item.title,
          content: item.content,
          search_text: item.search_text,
          tags: item.tags,
          priority: item.priority,
          active: true
        });
      
      if (error) {
        console.log(`⚠️  Failed to insert knowledge: "${item.title}"`, error.message);
      }
    } catch (err) {
      console.log(`⚠️  Error with knowledge base:`, err.message);
    }
  }
  
  console.log(`✅ Uploaded ${knowledgeBaseData.length} knowledge base entries`);
}

async function uploadIntentPatterns() {
  console.log('\n🎯 Uploading intent patterns...');
  
  for (const pattern of intentPatterns) {
    try {
      const { error } = await supabase
        .from('intent_patterns')
        .insert({
          intent_name: pattern.intent_name,
          intent_category: pattern.intent_category,
          keywords: pattern.keywords,
          regex_patterns: pattern.regex_patterns,
          example_phrases: pattern.example_phrases,
          confidence_threshold: pattern.confidence_threshold,
          is_high_intent: pattern.is_high_intent,
          action_type: pattern.action_type,
          active: true
        });
      
      if (error) {
        console.log(`⚠️  Failed to insert pattern: "${pattern.intent_name}"`, error.message);
      }
    } catch (err) {
      console.log(`⚠️  Error with intent patterns:`, err.message);
    }
  }
  
  console.log(`✅ Uploaded ${intentPatterns.length} intent patterns`);
}

async function uploadQualificationRules() {
  console.log('\n📊 Uploading qualification rules...');
  
  for (const rule of qualificationRules) {
    try {
      const { error } = await supabase
        .from('qualification_rules')
        .insert({
          rule_name: rule.rule_name,
          rule_type: rule.rule_type,
          conditions: rule.conditions,
          score_adjustment: rule.score_adjustment,
          priority: rule.priority,
          active: true
        });
      
      if (error) {
        console.log(`⚠️  Failed to insert rule: "${rule.rule_name}"`, error.message);
      }
    } catch (err) {
      console.log(`⚠️  Error with qualification rules:`, err.message);
    }
  }
  
  console.log(`✅ Uploaded ${qualificationRules.length} qualification rules`);
}

async function uploadResponseTemplates() {
  console.log('\n💬 Uploading response templates...');
  
  for (const template of responseTemplates) {
    try {
      const { error } = await supabase
        .from('response_templates')
        .insert({
          template_key: template.template_key,
          intent_name: template.intent_name,
          scenario: template.scenario,
          template_text: template.template_text,
          variables: template.variables,
          active: template.active
        });
      
      if (error) {
        console.log(`⚠️  Failed to insert template: "${template.template_key}"`, error.message);
      }
    } catch (err) {
      console.log(`⚠️  Error with response templates:`, err.message);
    }
  }
  
  console.log(`✅ Uploaded ${responseTemplates.length} response templates`);
}

async function verifyUpload() {
  console.log('\n🔍 Verifying upload...');
  
  const tables = [
    'intent_training_data',
    'knowledge_base',
    'intent_patterns',
    'qualification_rules',
    'response_templates'
  ];
  
  for (const table of tables) {
    try {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 ${table}: ${count || 0} records`);
    } catch (err) {
      console.log(`⚠️  Could not verify ${table}`);
    }
  }
}

// ================================
// MAIN EXECUTION
// ================================

async function main() {
  console.log('🚀 Starting Rule27 Training Data Upload');
  console.log('================================\n');
  
  // Check connection
  const { data: test, error: testError } = await supabase
    .from('intent_patterns')
    .select('count(*)', { count: 'exact', head: true });
  
  if (testError) {
    console.error('❌ Cannot connect to Supabase:', testError.message);
    console.log('\n⚠️  Please check:');
    console.log('1. SUPABASE_URL is correct');
    console.log('2. SUPABASE_SERVICE_KEY is set (not anon key)');
    console.log('3. Tables exist in your database');
    process.exit(1);
  }
  
  console.log('✅ Connected to Supabase\n');
  
  // Ask if user wants to clear existing data
  console.log('⚠️  This will replace existing training data.');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Clear existing data
    await clearExistingData();
    
    // Upload all data
    await uploadIntentTrainingData();
    await uploadKnowledgeBase();
    await uploadIntentPatterns();
    await uploadQualificationRules();
    await uploadResponseTemplates();
    
    // Verify
    await verifyUpload();
    
    console.log('\n✅ Training data upload complete!');
    console.log('🎉 Larry is now trained with Rule27 knowledge!');
    
  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    process.exit(1);
  }
}

// Run the upload
main().catch(console.error);