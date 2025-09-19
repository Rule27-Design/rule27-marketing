// src/services/chatbot/index.js

import { ConversationEngine } from './conversationEngine';
import { QualificationEngine } from './qualificationEngine';
import { PersonalizationEngine } from './personalizationEngine';
import { OptimizationEngine } from './optimizationEngine';
import { AnalyticsService } from './analyticsService';
import { AIProvider } from './aiProvider';
import { HumanReviewQueue } from './humanReviewQueue';

export class Rule27Chatbot {
  constructor(supabase) {
    this.supabase = supabase;
    this.ai = new AIProvider();
    this.conversation = new ConversationEngine(supabase, this.ai);
    this.qualification = new QualificationEngine(supabase);
    this.personalization = new PersonalizationEngine(supabase);
    this.optimization = new OptimizationEngine(supabase);
    this.analytics = new AnalyticsService(supabase);
    this.reviewQueue = new HumanReviewQueue(supabase);
    
    // Start optimization loop
    this.optimization.initializeExperiments();
  }
  
  async handleMessage(message, conversationId, visitorId) {
    const startTime = Date.now();
    
    try {
      // 1. Process and understand the message
      const response = await this.conversation.processMessage(message, conversationId);
      
      // 2. Calculate/update lead score
      const score = await this.qualification.calculateLeadScore(
        { id: conversationId },
        message
      );
      
      // 3. Check for low confidence (add to human review)
      if (response.confidence < 0.6) {
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
      if (score.totalScore > 80 || this.shouldEscalate(response)) {
        await this.escalateToHuman(conversationId, score);
        response.escalated = true;
      }
      
      // 5. Track for optimization
      await this.optimization.trackInteraction({
        conversation_id: conversationId,
        message_variant_id: response.variantId,
        user_response: message,
        response_time: Date.now() - startTime,
        score_change: score.totalScore
      });
      
      // 6. Return personalized response
      const personalizedResponse = await this.personalization.generateResponse({
        ...response,
        score: score,
        conversationId,
        visitorId
      });
      
      // 7. Store for learning
      await this.storeInteraction(conversationId, message, personalizedResponse, score);
      
      return personalizedResponse;
      
    } catch (error) {
      console.error('Chatbot error:', error);
      // Log error for review
      await this.reviewQueue.addForReview({
        conversation_id: conversationId,
        message: message,
        error: error.message,
        reason: 'error'
      });
      
      // Return safe fallback
      return {
        text: "I apologize, but I'm having a moment. Can I connect you with one of our experts directly? They can answer all your questions about our marketing and development services.",
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
    // Send to your team (Slack, email, etc)
    await this.supabase.from('escalations').insert({
      conversation_id: conversationId,
      lead_score: score.totalScore,
      score_components: score.components,
      escalated_at: new Date(),
      status: 'pending'
    });
    
    // Notify via webhook
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
              text: `*New Qualified Lead*\n*Score:* ${score.totalScore}/100\n*Recommendation:* ${score.recommendations.message}`
            }
          }]
        })
      });
    }
  }
  
  async storeInteraction(conversationId, userMessage, botResponse, score) {
    // Store for continuous learning
    await this.supabase.from('training_data').insert({
      conversation_id: conversationId,
      user_message: userMessage,
      bot_response: botResponse.text,
      detected_intent: botResponse.intent,
      confidence: botResponse.confidence,
      lead_score_after: score.totalScore,
      timestamp: new Date(),
      use_for_training: true
    });
  }
}