// src/services/chatbot/intentClassifier.js

class IntentClassifier {
  constructor(supabase) {
    this.supabase = supabase;
    this.intents = {};
    this.loadIntentPatterns(); // Load on initialization
  }

  // Load intent patterns from database
  async loadIntentPatterns() {
    try {
      const { data: patterns, error } = await this.supabase
        .from('intent_patterns')
        .select('*')
        .eq('active', true);
      
      if (error) {
        console.error('Failed to load intent patterns:', error);
        return;
      }

      // Transform database patterns into usable format
      patterns.forEach(pattern => {
        this.intents[pattern.intent_name] = {
          patterns: pattern.regex_patterns?.map(p => {
            try {
              // Remove the /pattern/flags format if present
              const cleanPattern = p.replace(/^\/|\/[igm]*$/g, '');
              return new RegExp(cleanPattern, 'i');
            } catch (e) {
              console.error(`Invalid regex pattern: ${p}`, e);
              return null;
            }
          }).filter(Boolean) || [],
          keywords: pattern.keywords || [],
          examples: pattern.example_phrases || [],
          confidence_threshold: pattern.confidence_threshold,
          highIntent: pattern.is_high_intent,
          requiresData: pattern.required_data,
          action: pattern.action_type
        };
      });
      
      console.log(`Loaded ${Object.keys(this.intents).length} intent patterns`);
    } catch (error) {
      console.error('Error in loadIntentPatterns:', error);
    }
  }

  async classify(message) {
    // Ensure patterns are loaded
    if (Object.keys(this.intents).length === 0) {
      await this.loadIntentPatterns();
    }

    const scores = {};
    
    // Check each intent pattern
    for (const [intentName, intentConfig] of Object.entries(this.intents)) {
      let score = 0;
      
      // Keyword matching (more weight)
      if (intentConfig.keywords) {
        for (const keyword of intentConfig.keywords) {
          if (message.toLowerCase().includes(keyword.toLowerCase())) {
            score += 20;
          }
        }
      }
      
      // Pattern matching
      if (intentConfig.patterns) {
        for (const pattern of intentConfig.patterns) {
          if (pattern && pattern.test(message)) {
            score += 30;
          }
        }
      }
      
      scores[intentName] = Math.min(score, 100); // Cap at 100
    }
    
    // Get highest scoring intent
    const sortedIntents = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedIntents.length === 0 || sortedIntents[0][1] === 0) {
      return {
        intent: 'unknown',
        confidence: 0.30,
        fallback: true
      };
    }
    
    const [topIntent, topScore] = sortedIntents[0];
    const confidence = topScore / 100;
    const threshold = this.intents[topIntent].confidence_threshold || 0.5;
    
    // If confidence meets threshold, use the intent
    if (confidence >= threshold) {
      return {
        intent: topIntent,
        confidence: confidence,
        config: this.intents[topIntent],
        highIntent: this.intents[topIntent].highIntent
      };
    }
    
    // Otherwise, return low confidence
    return {
      intent: topIntent,
      confidence: confidence * 0.5, // Reduce confidence if below threshold
      fallback: true,
      suggestedIntent: topIntent
    };
  }
}

export default IntentClassifier;