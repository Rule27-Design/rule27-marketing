// services/optimizationEngine.js

class OptimizationEngine {
  constructor(supabase) {
    this.supabase = supabase;
    this.experiments = new Map();
    this.initializeExperiments();
  }

  async initializeExperiments() {
    // Load active experiments
    const { data: experiments } = await this.supabase
      .from('ab_experiments')
      .select('*')
      .eq('status', 'active');
    
    experiments?.forEach(exp => {
      this.experiments.set(exp.id, exp);
    });
  }

  // Track every interaction for learning
  async trackInteraction(interaction) {
    const {
      conversation_id,
      message_variant_id,
      user_response,
      response_time,
      led_to_conversion,
      score_change
    } = interaction;
    
    // 1. Update variant performance
    await this.updateVariantPerformance(
      message_variant_id,
      {
        response_received: !!user_response,
        positive_response: this.isPositiveResponse(user_response),
        led_to_conversion,
        score_change
      }
    );
    
    // 2. Update conversation metrics
    await this.updateConversationMetrics(conversation_id, interaction);
    
    // 3. Check for statistical significance
    await this.checkSignificance(message_variant_id);
    
    // 4. Update ML model training data
    await this.addToTrainingData(interaction);
  }

  isPositiveResponse(response) {
    if (!response) return false;
    
    const positiveIndicators = [
      /\b(yes|sure|okay|great|perfect|interested|tell me more)\b/i,
      /\b(sounds good|let's do it|sign me up)\b/i,
      /[👍😊🎉]/
    ];
    
    return positiveIndicators.some(pattern => 
      pattern.test(response)
    );
  }

  async updateVariantPerformance(variantId, metrics) {
    // Fetch current stats
    const { data: variant } = await this.supabase
      .from('message_variants')
      .select('*')
      .eq('id', variantId)
      .single();
    
    if (!variant) return;
    
    // Update with new metrics
    const updates = {
      times_shown: variant.times_shown + 1,
      responses_received: variant.responses_received + 
        (metrics.response_received ? 1 : 0),
      positive_responses: variant.positive_responses + 
        (metrics.positive_response ? 1 : 0),
      conversions: variant.conversions + 
        (metrics.led_to_conversion ? 1 : 0),
      avg_score_increase: this.calculateNewAverage(
        variant.avg_score_increase,
        metrics.score_change,
        variant.times_shown
      )
    };
    
    await this.supabase
      .from('message_variants')
      .update(updates)
      .eq('id', variantId);
  }

  async checkSignificance(variantId) {
    // Get variant and its control
    const { data: variant } = await this.supabase
      .from('message_variants')
      .select('*')
      .eq('id', variantId)
      .single();
    
    const { data: control } = await this.supabase
      .from('message_variants')
      .select('*')
      .eq('scenario_key', variant.scenario_key)
      .eq('is_control', true)
      .single();
    
    if (!control || variant.times_shown < 100) return;
    
    // Calculate statistical significance (simplified chi-square)
    const variantConversionRate = variant.conversions / variant.times_shown;
    const controlConversionRate = control.conversions / control.times_shown;
    
    const pooledProbability = 
      (variant.conversions + control.conversions) / 
      (variant.times_shown + control.times_shown);
    
    const standardError = Math.sqrt(
      pooledProbability * (1 - pooledProbability) * 
      (1/variant.times_shown + 1/control.times_shown)
    );
    
    const zScore = 
      (variantConversionRate - controlConversionRate) / standardError;
    
    // 95% confidence = 1.96 z-score
    const isSignificant = Math.abs(zScore) > 1.96;
    
    if (isSignificant) {
      const isWinner = variantConversionRate > controlConversionRate;
      
      await this.supabase
        .from('message_variants')
        .update({
          confidence_level: this.zScoreToConfidence(zScore),
          is_winner: isWinner
        })
        .eq('id', variantId);
      
      // Auto-promote winner if confidence > 99%
      if (this.zScoreToConfidence(zScore) > 0.99 && isWinner) {
        await this.promoteWinner(variantId, control.id);
      }
    }
  }

  zScoreToConfidence(zScore) {
    // Simplified confidence calculation
    const confidence = 2 * (1 - this.normalCDF(Math.abs(zScore)));
    return 1 - confidence;
  }

  async promoteWinner(winnerId, controlId) {
    // Make winner the new control
    await this.supabase
      .from('message_variants')
      .update({ is_control: false })
      .eq('id', controlId);
    
    await this.supabase
      .from('message_variants')
      .update({ is_control: true, is_winner: true })
      .eq('id', winnerId);
    
    // Create new challenger variant
    await this.createNewChallenger(winnerId);
  }

  async createNewChallenger(winnerId) {
    const { data: winner } = await this.supabase
      .from('message_variants')
      .select('*')
      .eq('id', winnerId)
      .single();
    
    // AI-generated variation of winner
    const newVariant = await this.generateVariation(winner.message_template);
    
    await this.supabase
      .from('message_variants')
      .insert({
        scenario_key: winner.scenario_key,
        variant_name: `challenger_${Date.now()}`,
        message_template: newVariant,
        is_control: false,
        active: true
      });
  }
}