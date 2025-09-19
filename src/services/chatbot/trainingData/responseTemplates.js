// src/services/chatbot/templates/responseTemplates.js

export const responseTemplates = [
  // Greeting Templates
  {
    template_key: 'greeting_b2b_visitor',
    scenario: 'new_b2b_visitor',
    template_text: 'Welcome to Rule27 Design! I see you\'re exploring {page_context}. We help B2B companies like yours achieve digital transformation through integrated marketing and development solutions. What brings you here today - are you looking to {suggested_goal}?',
    variables: ['page_context', 'suggested_goal'],
    personality_variants: {
      analytical: 'Welcome. Rule27 Design provides integrated marketing and development solutions with 60+ platform certifications. What specific challenge are you looking to solve?',
      friendly: 'Hey there! 👋 Welcome to Rule27 Design! We\'re the digital powerhouse that handles both marketing AND development. What exciting project brings you our way?'
    }
  },

  // Qualification Templates
  {
    template_key: 'budget_qualification',
    scenario: 'budget_discovery',
    template_text: 'To ensure we recommend the right solution for your needs, what budget range have you allocated for this initiative? Most of our {project_type} projects range from {typical_range}.',
    variables: ['project_type', 'typical_range']
  },

  // Objection Handling Templates
  {
    template_key: 'price_objection_response',
    scenario: 'price_concern',
    template_text: 'I understand ROI is crucial. Our clients typically see {roi_metric} within {timeframe}. What if I could show you how similar companies achieved {specific_result}? The real question is: what\'s the cost of NOT transforming your {pain_point}?',
    variables: ['roi_metric', 'timeframe', 'specific_result', 'pain_point']
  },

  // Demo Booking Templates
  {
    template_key: 'demo_scheduling',
    scenario: 'qualified_lead',
    template_text: 'Based on what you\'ve shared about {their_challenge}, I\'d love to connect you with our {expert_type} expert. They can show you exactly how we\'ve helped companies like yours {achievement}. Are you available for a 30-minute strategy session this week?',
    variables: ['their_challenge', 'expert_type', 'achievement']
  }
];