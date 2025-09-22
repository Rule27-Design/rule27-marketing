// src/services/chatbot/conversationEngine.js

import IntentClassifier from './intentClassifier';
import ResponseGenerator from './responseGenerator';

class ConversationEngine {
  constructor(supabase, aiProvider) {
    this.supabase = supabase;
    this.ai = aiProvider;
    this.intentClassifier = new IntentClassifier(supabase);
    this.responseGenerator = new ResponseGenerator(supabase, aiProvider);
    this.contextManager = {
      getContext: async (conversationId) => {
        // Simple context implementation
        const { data } = await this.supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false })
          .limit(5);
        return data || [];
      }
    };
  }

  async processMessage(userMessage, conversationId) {
    try {
      // 1. Classify intent using database patterns
      const intent = await this.intentClassifier.classify(userMessage);
      console.log(`Intent detected: ${intent.intent} with ${(intent.confidence * 100).toFixed(0)}% confidence`);
      
      // 2. Get relevant knowledge from database
      const knowledge = await this.retrieveKnowledge(intent.intent);
      
      // 3. Extract entities from message
      const entities = await this.extractEntities(userMessage);
      
      // 4. Get conversation context
      const context = await this.contextManager.getContext(conversationId);
      
      // 5. Build understanding object
      const understanding = {
        originalMessage: userMessage,
        intent: intent,
        confidence: intent.confidence,
        entities: entities,
        context: context
      };
      
      // 6. Generate response using templates
      const response = await this.responseGenerator.generateResponse(
        understanding,
        knowledge,
        null
      );
      
      // 7. Log the interaction
      await this.logInteraction(userMessage, understanding, response, conversationId);
      
      return response;
    } catch (error) {
      console.error('Error in processMessage:', error);
      return {
        text: "I apologize for the confusion. Let me connect you with our team who can better assist you.",
        intent: 'error',
        confidence: 0
      };
    }
  }

  async retrieveKnowledge(intentName) {
    try {
      // Query knowledge base for intent-specific content
      const { data: knowledge, error } = await this.supabase
        .from('knowledge_base')
        .select('*')
        .contains('tags', [intentName])
        .eq('active', true)
        .limit(5);
      
      if (error) {
        console.error('Failed to retrieve knowledge:', error);
        return [];
      }
      
      return knowledge || [];
    } catch (error) {
      console.error('Error in retrieveKnowledge:', error);
      return [];
    }
  }

  async logInteraction(message, understanding, response, conversationId) {
    try {
      // Store user message
      await this.supabase.from('messages').insert({
        conversation_id: conversationId,
        sender: 'user',
        content: message,
        message_type: 'user_message',
        detected_intent: understanding.intent.intent,
        confidence: understanding.confidence,
        timestamp: new Date().toISOString()
      });
      
      // Store bot response
      await this.supabase.from('messages').insert({
        conversation_id: conversationId,
        sender: 'bot',
        content: response.text,
        message_type: 'bot_response',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }
  
  async extractEntities(message) {
    const entities = {};
    const lowerMessage = message.toLowerCase();
    
    // Check for industry mentions
    const industries = ['healthcare', 'finance', 'saas', 'b2b', 'ecommerce', 'retail', 'manufacturing'];
    for (const industry of industries) {
      if (lowerMessage.includes(industry)) {
        entities.industry = industry;
      }
    }
    
    // Check for link requests
    if (lowerMessage.includes('link') || lowerMessage.includes('url') || lowerMessage.includes('send')) {
      entities.requestingLink = true;
    }
    
    // Check for general info requests
    if (lowerMessage.includes('case stud') || lowerMessage.includes('portfolio') || lowerMessage.includes('examples')) {
      entities.wantsGeneralInfo = true;
    }
    
    // Check for budget mentions
    const budgetMatch = message.match(/\$?(\d+)k|\$(\d{1,3},?\d{3,})/i);
    if (budgetMatch) {
      entities.budget = budgetMatch[0];
    }
    
    return entities;
  }

  async understandMessage(userMessage, conversationId) {
    const context = await this.contextManager.getContext(conversationId);
    const intent = await this.intentClassifier.classify(userMessage);
    const entities = await this.extractEntities(userMessage);
    
    return {
      originalMessage: userMessage,
      intent: intent,
      entities: entities,
      context: context,
      confidence: intent.confidence
    };
  }

  async validateResponse(response, understanding) {
    // Basic validation
    if (!response.text || response.text.length === 0) {
      return {
        text: "I'm here to help! Could you tell me more about what you're looking for?",
        intent: 'fallback',
        confidence: 0.5
      };
    }
    return response;
  }

  async determineStrategy(understanding, knowledge) {
    // Simple strategy determination
    if (understanding.confidence > 0.8) {
      return 'direct_answer';
    } else if (understanding.confidence > 0.5) {
      return 'clarify_and_answer';
    } else {
      return 'ask_clarification';
    }
  }
}

export default ConversationEngine;