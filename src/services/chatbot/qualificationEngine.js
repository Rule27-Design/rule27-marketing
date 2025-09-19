// services/qualificationEngine.js

class QualificationEngine {
  constructor(supabase) {
    this.supabase = supabase;
    this.rules = new Map();
    this.scoreFactors = new Map();
    this.loadRules();
  }

  // Dynamic rule loading from database
  async loadRules() {
    const { data: rules } = await this.supabase
      .from('qualification_rules')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false });
    
    rules.forEach(rule => {
      this.rules.set(rule.rule_name, rule);
    });
  }

  // Main scoring algorithm
  async calculateLeadScore(conversation, newMessage) {
    let scoreAdjustments = {
      budget: 0,
      authority: 0,
      need: 0,
      timeline: 0,
      engagement: 0,
      fit: 0
    };

    // 1. Keyword Detection Scoring
    const keywordScore = this.analyzeKeywords(newMessage);
    
    // 2. Behavioral Scoring
    const behaviorScore = await this.analyzeBehavior(conversation);
    
    // 3. Progressive Disclosure Scoring
    const disclosureScore = this.analyzeDisclosure(conversation);
    
    // 4. Velocity Scoring
    const velocityScore = this.analyzeVelocity(conversation);
    
    // 5. Pattern Matching
    const patternScore = await this.matchPatterns(conversation, newMessage);

    // Weighted combination
    const totalScore = 
      (keywordScore * 0.25) +
      (behaviorScore * 0.20) +
      (disclosureScore * 0.15) +
      (velocityScore * 0.10) +
      (patternScore * 0.30);

    return {
      totalScore,
      components: {
        keywordScore,
        behaviorScore,
        disclosureScore,
        velocityScore,
        patternScore
      },
      recommendations: this.getRecommendations(totalScore)
    };
  }

  analyzeKeywords(message) {
    const scoringKeywords = {
      highIntent: {
        words: ['buy', 'purchase', 'pricing', 'demo', 'trial', 'implement'],
        score: 15
      },
      mediumIntent: {
        words: ['compare', 'evaluate', 'options', 'features', 'how'],
        score: 8
      },
      lowIntent: {
        words: ['information', 'learn', 'what is', 'research'],
        score: 3
      },
      urgency: {
        words: ['asap', 'urgent', 'immediately', 'today', 'now'],
        score: 20
      },
      budget: {
        words: ['budget', 'cost', 'invest', 'roi', 'pricing'],
        score: 12
      },
      authority: {
        words: ['team', 'we', 'our', 'company', 'decision'],
        score: 10
      }
    };

    let score = 0;
    const lowerMessage = message.toLowerCase();

    for (const [category, config] of Object.entries(scoringKeywords)) {
      const matches = config.words.filter(word => 
        lowerMessage.includes(word)
      );
      if (matches.length > 0) {
        score += config.score;
        // Log for analytics
        this.logKeywordMatch(category, matches);
      }
    }

    return Math.min(score, 100); // Cap at 100
  }

  async analyzeBehavior(conversation) {
    // Response time analysis
    const avgResponseTime = await this.getAvgResponseTime(conversation.id);
    let score = 0;

    if (avgResponseTime < 5) score += 20;  // Very engaged
    else if (avgResponseTime < 15) score += 10;  // Engaged
    else if (avgResponseTime < 30) score += 5;   // Moderate
    
    // Message depth analysis
    const avgMessageLength = await this.getAvgMessageLength(conversation.id);
    if (avgMessageLength > 50) score += 15;  // Detailed responses
    else if (avgMessageLength > 20) score += 8;
    
    // Question asking pattern
    const questionsAsked = await this.getQuestionsAsked(conversation.id);
    score += questionsAsked * 5; // 5 points per question
    
    // Page navigation pattern
    const pagesVisited = await this.getPagesVisited(conversation.visitor_profile_id);
    if (pagesVisited.includes('/pricing')) score += 15;
    if (pagesVisited.includes('/demo')) score += 20;
    if (pagesVisited.includes('/case-studies')) score += 10;
    
    return Math.min(score, 100);
  }

  analyzeDisclosure(conversation) {
    let score = 0;
    const disclosed = [];

    // Check what they've revealed
    if (conversation.company_name) {
      score += 20;
      disclosed.push('company');
    }
    if (conversation.budget_identified) {
      score += 25;
      disclosed.push('budget');
    }
    if (conversation.timeline) {
      score += 20;
      disclosed.push('timeline');
    }
    if (conversation.use_case) {
      score += 15;
      disclosed.push('use_case');
    }
    if (conversation.authority_level) {
      score += 20;
      disclosed.push('authority');
    }

    // Bonus for complete BANT
    if (disclosed.length >= 4) {
      score += 25; // BANT bonus
    }

    return Math.min(score, 100);
  }

  analyzeVelocity(conversation) {
    let score = 0;
    
    // Conversation momentum
    const messageCount = conversation.total_messages || 0;
    const duration = (Date.now() - conversation.started_at) / 1000 / 60; // minutes
    const messagesPerMinute = messageCount / Math.max(duration, 1);
    
    if (messagesPerMinute > 2) score += 30;  // Rapid exchange
    else if (messagesPerMinute > 1) score += 20;
    else if (messagesPerMinute > 0.5) score += 10;
    
    // Depth progression
    if (messageCount > 10) score += 20;
    else if (messageCount > 5) score += 10;
    
    // Return visit bonus
    if (conversation.visitor_profile?.total_visits > 1) {
      score += 15;
    }
    
    return Math.min(score, 100);
  }

  async matchPatterns(conversation, message) {
    // Complex pattern matching for buying signals
    const patterns = [
      {
        name: 'decision_maker',
        pattern: /\b(i|we)\s+(need|want|require|looking for)\b/i,
        score: 25
      },
      {
        name: 'comparison_shopper',
        pattern: /\b(versus|vs|compared to|better than|difference)\b/i,
        score: 20
      },
      {
        name: 'implementation_planning',
        pattern: /\b(integrate|implement|setup|onboard|deploy)\b/i,
        score: 30
      },
      {
        name: 'budget_holder',
        pattern: /\b(budget|approve|purchase|procurement)\b/i,
        score: 25
      },
      {
        name: 'technical_evaluator',
        pattern: /\b(api|security|compliance|technical|documentation)\b/i,
        score: 15
      }
    ];

    let score = 0;
    const matchedPatterns = [];

    for (const patternConfig of patterns) {
      if (patternConfig.pattern.test(message)) {
        score += patternConfig.score;
        matchedPatterns.push(patternConfig.name);
      }
    }

    // Store matched patterns for personalization
    if (matchedPatterns.length > 0) {
      await this.storePatternMatches(conversation.id, matchedPatterns);
    }

    return Math.min(score, 100);
  }

  getRecommendations(score) {
    if (score >= 80) {
      return {
        action: 'immediate_handoff',
        message: 'Hot lead - connect to sales immediately',
        routing: 'sales_team',
        urgency: 'high'
      };
    } else if (score >= 60) {
      return {
        action: 'qualify_further',
        message: 'Qualified lead - gather remaining BANT',
        routing: 'continue_bot',
        urgency: 'medium'
      };
    } else if (score >= 40) {
      return {
        action: 'nurture',
        message: 'Interested but not ready - move to nurture',
        routing: 'email_capture',
        urgency: 'low'
      };
    } else {
      return {
        action: 'educate',
        message: 'Early stage - provide resources',
        routing: 'self_serve',
        urgency: 'none'
      };
    }
  }
}