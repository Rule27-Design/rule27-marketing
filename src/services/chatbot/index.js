// src/services/chatbot/index.js

import ConversationEngine from './conversationEngine';
import QualificationEngine from './qualificationEngine';
import PersonalizationEngine from './personalizationEngine';
import OptimizationEngine from './optimizationEngine';
import AnalyticsService from './analyticsService';
import AIProvider from './aiProvider';
import HumanReviewQueue from './humanReviewQueue';

export class Rule27Chatbot {
  constructor(supabase) {
    this.supabase = supabase;
    this.initialized = false;
    this.ai = new AIProvider();
    this.conversation = new ConversationEngine(supabase, this.ai);
    
    // Initialize other engines if they exist
    try {
      this.qualification = new QualificationEngine(supabase);
    } catch (e) {
      console.log('QualificationEngine not available');
      this.qualification = null;
    }
    
    try {
      this.personalization = new PersonalizationEngine(supabase);
    } catch (e) {
      console.log('PersonalizationEngine not available');
      this.personalization = null;
    }
    
    try {
      this.optimization = new OptimizationEngine(supabase);
      this.optimization.initializeExperiments();
    } catch (e) {
      console.log('OptimizationEngine not available');
      this.optimization = null;
    }
    
    try {
      this.analytics = new AnalyticsService(supabase);
    } catch (e) {
      console.log('AnalyticsService not available');
      this.analytics = null;
    }
    
    try {
      this.reviewQueue = new HumanReviewQueue(supabase);
    } catch (e) {
      console.log('HumanReviewQueue not available');
      this.reviewQueue = null;
    }
    
    // Initialize on construction
    this.initialize();
  }
  
  async initialize() {
    if (this.initialized) return;
    
    console.log('Initializing Rule27 Chatbot...');
    
    try {
      // Ensure all patterns are loaded
      await this.conversation.intentClassifier.loadIntentPatterns();
      await this.conversation.responseGenerator.loadResponseTemplates();
      
      this.initialized = true;
      console.log('Chatbot initialized successfully');
    } catch (error) {
      console.error('Error initializing chatbot:', error);
    }
  }
  
  async handleMessage(message, conversationId, visitorId) {
    // Ensure initialization
    await this.initialize();
    
    const startTime = Date.now();
    
    try {
      // 1. Process message using database patterns and templates
      const response = await this.conversation.processMessage(message, conversationId);
      
      // 2. Calculate lead score if qualification engine exists
      let score = { totalScore: 0 };
      if (this.qualification) {
        score = await this.qualification.calculateLeadScore(
          { id: conversationId },
          message
        );
      }
      
      // 3. Check for low confidence
      if (response.confidence < 0.6 && this.reviewQueue) {
        await this.reviewQueue.addForReview({
          conversation_id: conversationId,
          message: message,
          bot_response: response.text,
          confidence: response.confidence,
          detected_intent: response.intent,
          reason: 'low_confidence'
        });
      }
      
      // 4. Check if we should escalate to human
      if ((score.totalScore > 80 || this.shouldEscalate(response)) && score.totalScore > 0) {
        await this.escalateToHuman(conversationId, score);
        response.escalated = true;
      }
      
      // 5. Track for optimization if available
      if (this.optimization) {
        await this.optimization.trackInteraction({
          conversation_id: conversationId,
          message_variant_id: response.variantId,
          user_response: message,
          response_time: Date.now() - startTime,
          score_change: score.totalScore
        });
      }
      
      // 6. Add score to response
      response.score = score;
      
      // 7. Store for learning
      await this.storeInteraction(conversationId, message, response, score);
      
      console.log(`Response confidence: ${(response.confidence * 100).toFixed(0)}%`);
      
      return response;
      
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Log error for review if available
      if (this.reviewQueue) {
        await this.reviewQueue.addForReview({
          conversation_id: conversationId,
          message: message,
          error: error.message,
          reason: 'error'
        });
      }
      
      // Return safe fallback
      return {
        text: "I apologize for the confusion. Let me connect you with our team who can better assist you with your questions about our marketing and development services.",
        confidence: 0,
        intent: 'error',
        shouldEscalate: true
      };
    }
  }
  
  shouldEscalate(response) {
    // Escalation triggers
    const triggers = [
      response.intent === 'high_value_request',
      response.requestedHuman === true,
      response.confidence < 0.3,
      response.objectionCount > 2
    ];
    
    return triggers.some(trigger => trigger === true);
  }
  
  async escalateToHuman(conversationId, score) {
    try {
      // Send to your team (Slack, email, etc)
      await this.supabase.from('escalations').insert({
        conversation_id: conversationId,
        lead_score: score.totalScore,
        score_components: score.components || {},
        escalated_at: new Date().toISOString(),
        status: 'pending'
      });
      
      // Notify via webhook if configured
      if (process.env.SLACK_WEBHOOK_URL) {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🔥 Hot lead alert! Score: ${score.totalScore}/100`,
            blocks: [{
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*New Qualified Lead*\n*Score:* ${score.totalScore}/100\n*Recommendation:* ${score.recommendations?.message || 'Follow up immediately'}`
              }
            }]
          })
        });
      }
    } catch (error) {
      console.error('Error escalating to human:', error);
    }
  }
  
  async storeInteraction(conversationId, userMessage, botResponse, score) {
    try {
      // Store for continuous learning
      await this.supabase.from('training_data').insert({
        conversation_id: conversationId,
        user_message: userMessage,
        bot_response: botResponse.text,
        detected_intent: botResponse.intent,
        confidence: botResponse.confidence,
        lead_score_after: score.totalScore,
        timestamp: new Date().toISOString(),
        use_for_training: true
      });
    } catch (error) {
      console.error('Error storing interaction:', error);
    }
  }
}

export default Rule27Chatbot;