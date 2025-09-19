// src/services/chatbot/humanReviewQueue.js

export class HumanReviewQueue {
  constructor(supabase) {
    this.supabase = supabase;
  }
  
  async addForReview(item) {
    const { data, error } = await this.supabase
      .from('human_review_queue')
      .insert({
        ...item,
        status: 'pending',
        created_at: new Date()
      });
      
    if (error) console.error('Failed to add to review queue:', error);
    return data;
  }
  
  async getReviewQueue(status = 'pending') {
    const { data } = await this.supabase
      .from('human_review_queue')
      .select('*')
      .eq('status', status)
      .order('confidence', { ascending: true })
      .limit(20);
      
    return data;
  }
  
  async reviewItem(itemId, review) {
    // Update the review item
    await this.supabase
      .from('human_review_queue')
      .update({
        status: 'reviewed',
        reviewed_at: new Date(),
        reviewer_notes: review.notes,
        correct_intent: review.correctIntent,
        improved_response: review.improvedResponse
      })
      .eq('id', itemId);
    
    // If approved, add to training data
    if (review.approved) {
      await this.addToTrainingData(itemId, review);
    }
    
    // Update intent classifier if needed
    if (review.correctIntent && review.correctIntent !== review.originalIntent) {
      await this.updateIntentClassifier(itemId, review);
    }
  }
  
  async addToTrainingData(itemId, review) {
    const { data: item } = await this.supabase
      .from('human_review_queue')
      .select('*')
      .eq('id', itemId)
      .single();
    
    await this.supabase
      .from('training_data')
      .insert({
        user_message: item.message,
        detected_intent: review.correctIntent || item.detected_intent,
        bot_response: review.improvedResponse || item.bot_response,
        is_validated: true,
        validated_by: review.reviewerId,
        use_for_training: true
      });
  }
}