// services/personalizationEngine.js

class PersonalizationEngine {
  constructor(supabase) {
    this.supabase = supabase;
    this.messageVariants = new Map();
    this.personalityProfiles = new Map();
  }

  async generateResponse(context) {
    // 1. Identify visitor personality
    const personality = await this.identifyPersonality(context);
    
    // 2. Get visitor's stage in journey
    const stage = this.identifyStage(context);
    
    // 3. Fetch relevant message variants
    const variants = await this.getMessageVariants(stage, personality);
    
    // 4. Select best performing variant (or test new)
    const selectedVariant = await this.selectVariant(variants);
    
    // 5. Personalize the message
    const personalizedMessage = await this.personalizeMessage(
      selectedVariant,
      context
    );
    
    // 6. Track variant performance
    await this.trackVariantUsage(selectedVariant.id, context);
    
    return personalizedMessage;
  }

  async identifyPersonality(context) {
    const { messages, visitor_profile } = context;
    
    // Analyze linguistic patterns
    const patterns = {
      analytical: {
        indicators: [
          /\b(data|metrics|roi|specifically|exactly|analyze)\b/gi,
          /\b(how does|what exactly|specific|detailed)\b/gi
        ],
        score: 0
      },
      expressive: {
        indicators: [
          /\b(awesome|excited|love|amazing|great|fantastic)\b/gi,
          /[!]{2,}/g,
          /[😀-🙏]{1,}/g
        ],
        score: 0
      },
      driver: {
        indicators: [
          /\b(quickly|now|immediately|bottom line|just)\b/gi,
          /\b(need|want|must have|require)\b/gi,
          // Short, direct sentences
          messages.filter(m => m.length < 50).length > messages.length * 0.6
        ],
        score: 0
      },
      amiable: {
        indicators: [
          /\b(help|support|concern|hope|feel|think)\b/gi,
          /\b(maybe|perhaps|possibly|if possible)\b/gi,
          /\?{2,}/g  // Multiple questions
        ],
        score: 0
      }
    };

    // Score each personality type
    messages.forEach(msg => {
      for (const [type, config] of Object.entries(patterns)) {
        config.indicators.forEach(pattern => {
          if (pattern instanceof RegExp) {
            const matches = msg.message_text.match(pattern);
            if (matches) {
              patterns[type].score += matches.length;
            }
          }
        });
      }
    });

    // Return dominant personality
    const dominant = Object.entries(patterns)
      .sort((a, b) => b[1].score - a[1].score)[0][0];
    
    // Store in profile for future use
    await this.updateVisitorPersonality(visitor_profile.id, dominant);
    
    return dominant;
  }

  identifyStage(context) {
    const { conversation, lead_score } = context;
    
    // Journey stages based on behavior and score
    if (lead_score < 20) return 'awareness';
    if (lead_score < 40) return 'interest';
    if (lead_score < 60) return 'consideration';
    if (lead_score < 80) return 'evaluation';
    return 'decision';
  }

  async getMessageVariants(stage, personality) {
    // Fetch A/B test variants for this scenario
    const { data: variants } = await this.supabase
      .from('message_variants')
      .select('*')
      .eq('scenario_key', `${stage}_${personality}`)
      .eq('active', true);
    
    // If no specific variants, fall back to stage variants
    if (!variants || variants.length === 0) {
      const { data: fallbackVariants } = await this.supabase
        .from('message_variants')
        .select('*')
        .eq('scenario_key', stage)
        .eq('active', true);
      
      return fallbackVariants || [];
    }
    
    return variants;
  }

  async selectVariant(variants) {
    if (variants.length === 0) {
      return this.getDefaultMessage();
    }
    
    // Multi-armed bandit algorithm (Thompson Sampling)
    const scores = await Promise.all(
      variants.map(async (variant) => {
        const successRate = variant.conversions / 
          Math.max(variant.times_shown, 1);
        
        // Add exploration bonus for less-tested variants
        const explorationBonus = 1 / Math.sqrt(variant.times_shown + 1);
        
        return {
          variant,
          score: successRate + (explorationBonus * 0.1)
        };
      })
    );
    
    // Select variant probabilistically based on scores
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    let random = Math.random() * totalScore;
    
    for (const scoreObj of scores) {
      random -= scoreObj.score;
      if (random <= 0) {
        return scoreObj.variant;
      }
    }
    
    return scores[0].variant; // Fallback
  }

  async personalizeMessage(variant, context) {
    let message = variant.message_template;
    
    // Dynamic variable replacement
    const replacements = {
      '{name}': context.visitor_profile?.first_name || 'there',
      '{company}': context.visitor_profile?.company_name || 'your company',
      '{industry}': context.visitor_profile?.industry || 'your industry',
      '{use_case}': context.conversation?.use_case || 'your needs',
      '{pain_point}': context.detected_pain_point || 'that challenge',
      '{city}': context.visitor_profile?.location?.city || 'your area',
      '{time_of_day}': this.getTimeGreeting(),
      '{similar_company}': await this.getSimilarCompany(context),
      '{relevant_stat}': await this.getRelevantStat(context),
      '{social_proof}': await this.getSocialProof(context),
      '{urgency_element}': this.getUrgencyElement(context)
    };
    
    // Replace all variables
    for (const [key, value] of Object.entries(replacements)) {
      message = message.replace(new RegExp(key, 'g'), value);
    }
    
    // Add personality-specific modifications
    message = this.applyPersonalityTone(message, context.personality);
    
    return message;
  }

  applyPersonalityTone(message, personality) {
    const toneModifications = {
      analytical: {
        addStats: true,
        format: 'bullet_points',
        emoji: false,
        prefix: "Based on the data, "
      },
      expressive: {
        addStats: false,
        format: 'conversational',
        emoji: true,
        enthusiasm: 'high',
        suffix: " 🎯"
      },
      driver: {
        addStats: false,
        format: 'brief',
        emoji: false,
        maxLength: 100
      },
      amiable: {
        addStats: false,
        format: 'supportive',
        emoji: 'moderate',
        prefix: "I understand, "
      }
    };
    
    const tone = toneModifications[personality];
    
    // Apply modifications
    if (tone.prefix) message = tone.prefix + message;
    if (tone.suffix) message = message + tone.suffix;
    if (tone.maxLength) message = message.substring(0, tone.maxLength) + '...';
    
    return message;
  }
}