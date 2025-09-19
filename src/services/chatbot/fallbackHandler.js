// services/fallbackHandler.js

class FallbackHandler {
  constructor() {
    this.fallbackStrategies = [
      this.clarificationStrategy,
      this.suggestionStrategy,
      this.escalationStrategy
    ];
  }

  async handleUnknownIntent(message, context) {
    // Try each strategy in order
    for (const strategy of this.fallbackStrategies) {
      const response = await strategy(message, context);
      if (response) return response;
    }
    
    // Ultimate fallback
    return this.defaultFallback();
  }

  async clarificationStrategy(message, context) {
    // Ask for clarification
    const clarifications = [
      "I want to make sure I understand - are you asking about pricing, features, or how to get started?",
      "Could you tell me a bit more about what you're looking to accomplish?",
      "I'd love to help! Are you exploring solutions for your team or just researching?"
    ];
    
    return clarifications[Math.floor(Math.random() * clarifications.length)];
  }

  async suggestionStrategy(message, context) {
    // Suggest common topics
    return `I'm not quite sure I understood that, but I can help you with:
    
    • Pricing and plans
    • Product features and capabilities  
    • Integration options
    • Getting a demo
    
    What would be most helpful?`;
  }

  async escalationStrategy(message, context) {
    // Offer human handoff
    return `I want to make sure you get the right information. Would you like me to connect you with our team? They can answer any specific questions you have.`;
  }

  defaultFallback() {
    return "I'm not sure I understood that correctly. Could you rephrase your question? Or I can connect you with our team if you prefer!";
  }
}