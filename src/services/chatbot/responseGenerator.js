// services/responseGenerator.js

class ResponseGenerator {
  constructor(aiProvider) {
    this.ai = aiProvider;
    this.templates = new ResponseTemplates();
  }

  async generateResponse(understanding, knowledge, strategy) {
    // Choose generation method based on intent confidence
    if (understanding.confidence > 0.8 && knowledge.primary.length > 0) {
      // High confidence - use template-based response
      return this.templateBasedResponse(understanding, knowledge);
    } else if (understanding.confidence > 0.5) {
      // Medium confidence - hybrid approach
      return this.hybridResponse(understanding, knowledge);
    } else {
      // Low confidence - use AI generation
      return this.aiGeneratedResponse(understanding, knowledge);
    }
  }

  async templateBasedResponse(understanding, knowledge) {
    const { intent, entities } = understanding;
    
    // Get appropriate template
    const template = this.templates.getTemplate(intent.intent);
    
    // Fill in the template with knowledge
    let response = template;
    
    // Replace placeholders with actual data
    if (intent.intent === 'pricing_inquiry') {
      const pricingData = knowledge.primary.find(k => k.type === 'pricing');
      response = response.replace('{pricing}', this.formatPricing(pricingData));
      response = response.replace('{cta}', "Would you like to see which plan fits your needs?");
    }
    
    if (intent.intent === 'feature_question') {
      const feature = knowledge.primary.find(k => 
        k.content.title.toLowerCase().includes(entities.feature?.toLowerCase())
      );
      
      if (feature) {
        response = `Yes! Our ${feature.content.title} ${feature.content.description}`;
        response += `\n\nThis is perfect for ${feature.content.use_cases.join(' and ')}.`;
        response += "\n\nWant me to show you how it works?";
      }
    }
    
    return this.personalizeResponse(response, understanding);
  }

  async hybridResponse(understanding, knowledge) {
    // Start with template structure
    const baseTemplate = this.templates.getTemplate(understanding.intent.intent);
    
    // Enhance with AI
    const prompt = `
      User asked: "${understanding.originalMessage}"
      Intent detected: ${understanding.intent.intent}
      
      Relevant information:
      ${JSON.stringify(knowledge.primary.slice(0, 3))}
      
      Base response template: "${baseTemplate}"
      
      Generate a helpful, conversational response that:
      1. Directly answers their question
      2. Uses the provided information
      3. Ends with a relevant follow-up question
      4. Maintains a ${understanding.sentiment} appropriate tone
      
      Response:
    `;
    
    const response = await this.ai.complete(prompt);
    return this.validateResponse(response);
  }

  async aiGeneratedResponse(understanding, knowledge) {
    // Full AI generation for complex or unclear queries
    const systemPrompt = `
      You are a helpful sales chatbot for [Company].
      Your goal is to answer questions and qualify leads.
      Be conversational but professional.
      Always try to move the conversation toward a conversion.
    `;
    
    const userPrompt = `
      Customer message: "${understanding.originalMessage}"
      
      Context from conversation: ${JSON.stringify(understanding.context)}
      
      Available knowledge:
      ${JSON.stringify(knowledge.all.slice(0, 5))}
      
      Generate a response that:
      1. Acknowledges their question
      2. Provides helpful information
      3. Asks a qualifying question if appropriate
      4. Maintains conversation momentum
    `;
    
    const response = await this.ai.chat(systemPrompt, userPrompt);
    return response;
  }
}