// src/services/chatbot/trainingData/qualificationIntents.js

export const qualificationTrainingData = [
  // Company Size & Type
  {
    user_message: "We're a B2B SaaS company with 50 employees",
    detected_intent: "company_qualification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We're a startup looking to build our first platform",
    detected_intent: "company_qualification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We're an enterprise with multiple brands",
    detected_intent: "company_qualification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We're a mid-market company ready to scale",
    detected_intent: "company_qualification",
    is_validated: true,
    use_for_training: true
  },

  // Timeline Questions
  {
    user_message: "We need this launched by Q2",
    detected_intent: "timeline_qualification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "This is urgent - can you start next week?",
    detected_intent: "timeline_qualification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We're planning for next fiscal year",
    detected_intent: "timeline_qualification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "How quickly can you deliver a new website?",
    detected_intent: "timeline_qualification",
    is_validated: true,
    use_for_training: true
  },

  // Current Situation
  {
    user_message: "Our current website isn't generating leads",
    detected_intent: "pain_point_identification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We're using HubSpot but not getting results",
    detected_intent: "pain_point_identification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "Our marketing and sales teams aren't aligned",
    detected_intent: "pain_point_identification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We need to modernize our tech stack",
    detected_intent: "pain_point_identification",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "Our brand feels outdated compared to competitors",
    detected_intent: "pain_point_identification",
    is_validated: true,
    use_for_training: true
  }
];