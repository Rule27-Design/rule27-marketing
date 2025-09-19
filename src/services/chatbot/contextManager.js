// services/contextManager.js

class ContextManager {
  constructor(supabase) {
    this.supabase = supabase;
    this.conversationStates = new Map();
  }

  async getContext(conversationId) {
    // Check memory cache first
    if (this.conversationStates.has(conversationId)) {
      return this.conversationStates.get(conversationId);
    }
    
    // Load from database
    const { data: messages } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true })
      .limit(10); // Last 10 messages for context
    
    const { data: conversation } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    const context = {
      conversationId,
      messages: messages || [],
      qualificationData: {
        budget: conversation?.budget_identified,
        authority: conversation?.authority_level,
        need: conversation?.use_case,
        timeline: conversation?.timeline
      },
      currentTopic: this.extractCurrentTopic(messages),
      conversationStage: this.determineStage(conversation),
      previousIntents: this.extractPreviousIntents(messages),
      unansweredQuestions: this.findUnansweredQuestions(messages)
    };
    
    // Cache it
    this.conversationStates.set(conversationId, context);
    
    return context;
  }

  extractCurrentTopic(messages) {
    if (!messages || messages.length === 0) return null;
    
    // Look at last 3 messages for topic continuity
    const recentMessages = messages.slice(-3);
    const topics = [];
    
    for (const msg of recentMessages) {
      if (msg.detected_intent) {
        topics.push(msg.detected_intent);
      }
    }
    
    // Most common recent topic
    return this.mostCommon(topics);
  }

  determineStage(conversation) {
    if (!conversation) return 'greeting';
    
    const score = conversation.lead_score_change || 0;
    const messageCount = conversation.total_messages || 0;
    
    if (messageCount === 0) return 'greeting';
    if (messageCount < 3) return 'discovery';
    if (score < 20) return 'exploration';
    if (score < 50) return 'evaluation';
    if (score < 80) return 'consideration';
    return 'decision';
  }

  async updateContext(conversationId, newInfo) {
    const context = await this.getContext(conversationId);
    
    // Update with new information
    const updated = {
      ...context,
      ...newInfo,
      lastUpdated: new Date()
    };
    
    // Save to cache
    this.conversationStates.set(conversationId, updated);
    
    // Persist important changes
    if (newInfo.qualificationData) {
      await this.supabase
        .from('conversations')
        .update({
          budget_identified: newInfo.qualificationData.budget,
          authority_level: newInfo.qualificationData.authority,
          use_case: newInfo.qualificationData.need,
          timeline: newInfo.qualificationData.timeline
        })
        .eq('id', conversationId);
    }
    
    return updated;
  }
}