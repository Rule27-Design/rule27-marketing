// src/services/chatbot/trainingData/objectionIntents.js

export const objectionTrainingData = [
  // Price Objections
  {
    user_message: "That seems expensive",
    detected_intent: "price_objection",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We can get it cheaper elsewhere",
    detected_intent: "price_objection",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "Can you lower your rates?",
    detected_intent: "price_objection",
    is_validated: true,
    use_for_training: true
  },

  // Trust Objections
  {
    user_message: "How do we know you can handle both marketing and dev?",
    detected_intent: "capability_objection",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "We prefer specialist agencies",
    detected_intent: "capability_objection",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "Have you worked with companies like ours?",
    detected_intent: "experience_objection",
    is_validated: true,
    use_for_training: true
  },

  // Process Objections
  {
    user_message: "We've had bad experiences with agencies",
    detected_intent: "trust_objection",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "How do we know you'll deliver on time?",
    detected_intent: "process_objection",
    is_validated: true,
    use_for_training: true
  },
  {
    user_message: "What if we're not satisfied with the work?",
    detected_intent: "guarantee_objection",
    is_validated: true,
    use_for_training: true
  }
];