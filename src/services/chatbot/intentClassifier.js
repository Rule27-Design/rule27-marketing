// services/intentClassifier.js

class IntentClassifier {
  constructor() {
    // Define intent patterns and keywords
    this.intents = {
      // INFORMATIONAL INTENTS
      pricing_inquiry: {
        patterns: [
          /how much/i, /cost/i, /pricing/i, /price/i, 
          /expensive/i, /affordable/i, /budget/i, /plans/i
        ],
        examples: [
          "How much does it cost?",
          "What are your pricing plans?",
          "Is there a free trial?"
        ],
        requiresData: ['pricing_table', 'plans']
      },
      
      feature_question: {
        patterns: [
          /can (it|you|the software)/i, /does (it|this)/i,
          /feature/i, /functionality/i, /capability/i,
          /is it possible/i, /able to/i
        ],
        examples: [
          "Can it integrate with Salesforce?",
          "Does it support multiple languages?",
          "What features do you have?"
        ],
        requiresData: ['features', 'capabilities']
      },
      
      integration_inquiry: {
        patterns: [
          /integrate/i, /connect/i, /work with/i, /compatible/i,
          /api/i, /webhook/i, /sync/i
        ],
        examples: [
          "Does it integrate with Slack?",
          "Can I connect my CRM?",
          "Do you have an API?"
        ],
        requiresData: ['integrations', 'api_docs']
      },
      
      use_case_exploration: {
        patterns: [
          /use it for/i, /help me with/i, /solve/i,
          /use case/i, /scenario/i, /suitable for/i
        ],
        examples: [
          "Can I use this for customer support?",
          "Will it help with lead generation?",
          "Is it suitable for e-commerce?"
        ],
        requiresData: ['use_cases', 'customer_stories']
      },
      
      // TRANSACTIONAL INTENTS
      demo_request: {
        patterns: [
          /demo/i, /see it in action/i, /try it/i,
          /show me/i, /walk me through/i
        ],
        action: 'schedule_demo',
        highIntent: true
      },
      
      trial_request: {
        patterns: [
          /free trial/i, /try for free/i, /test it/i,
          /trial period/i, /try before/i
        ],
        action: 'start_trial',
        highIntent: true
      },
      
      // SUPPORT INTENTS
      technical_support: {
        patterns: [
          /not working/i, /error/i, /bug/i, /issue/i,
          /problem/i, /broken/i, /help with/i
        ],
        action: 'route_to_support',
        requiresAuth: true
      },
      
      // COMPARISON INTENTS
      competitor_comparison: {
        patterns: [
          /versus/i, /vs/i, /compared to/i, /better than/i,
          /difference between/i, /competitor/i
        ],
        requiresData: ['competitor_matrix', 'differentiators']
      },
      
      // OBJECTIONS
      objection_price: {
        patterns: [
          /too expensive/i, /cheaper/i, /discount/i,
          /lower price/i, /budget is/i
        ],
        type: 'objection',
        handleWithCare: true
      }
    };
  }

  async classify(message) {
    const scores = {};
    
    // Check each intent pattern
    for (const [intentName, intentConfig] of Object.entries(this.intents)) {
      let score = 0;
      
      // Pattern matching
      for (const pattern of intentConfig.patterns) {
        if (pattern.test(message)) {
          score += 10;
        }
      }
      
      // ML-based classification (if using AI)
      if (this.mlClassifier) {
        const mlScore = await this.mlClassifier.predict(message, intentName);
        score += mlScore * 50;
      }
      
      scores[intentName] = score;
    }
    
    // Get highest scoring intent
    const topIntent = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0];
    
    // Check confidence threshold
    const confidence = topIntent[1] / 100;
    
    if (confidence < 0.3) {
      return {
        intent: 'unknown',
        confidence: confidence,
        fallback: true
      };
    }
    
    return {
      intent: topIntent[0],
      confidence: confidence,
      config: this.intents[topIntent[0]]
    };
  }
}