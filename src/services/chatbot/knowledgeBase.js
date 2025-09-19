// services/knowledgeBase.js

class KnowledgeBase {
  constructor(supabase) {
    this.supabase = supabase;
    this.embeddings = new EmbeddingService();
  }

  async initialize() {
    // Load all your content into vector database
    await this.loadKnowledgeBase();
  }

  async loadKnowledgeBase() {
    const knowledgeSources = [
      // Product documentation
      {
        type: 'product_features',
        content: [
          {
            title: "Analytics Dashboard",
            description: "Real-time analytics with custom reports...",
            tags: ['analytics', 'reporting', 'dashboard'],
            use_cases: ['performance tracking', 'ROI measurement']
          },
          // ... more features
        ]
      },
      
      // Pricing information
      {
        type: 'pricing',
        content: [
          {
            plan: "Starter",
            price: "$49/month",
            features: ["Up to 1,000 contacts", "Basic automation"],
            limitations: ["No API access", "Email support only"]
          },
          // ... more plans
        ]
      },
      
      // FAQs
      {
        type: 'faq',
        content: [
          {
            question: "How long does implementation take?",
            answer: "Most customers are up and running in 2-3 hours...",
            category: "onboarding"
          },
          // ... more FAQs
        ]
      },
      
      // Use cases and case studies
      {
        type: 'use_cases',
        content: [
          {
            industry: "SaaS",
            problem: "Reducing churn",
            solution: "Using our retention workflows...",
            result: "40% reduction in churn"
          },
          // ... more use cases
        ]
      },
      
      // Competitor comparisons
      {
        type: 'competitors',
        content: [
          {
            competitor: "Competitor A",
            our_advantages: ["50% less expensive", "Better support"],
            their_advantages: ["More integrations"],
            positioning: "We're better for growing teams..."
          },
          // ... more comparisons
        ]
      },
      
      // Objection handlers
      {
        type: 'objection_handlers',
        content: [
          {
            objection: "too expensive",
            response: "I understand price is important. Most customers see ROI within 30 days because...",
            follow_up_questions: ["What's your current solution costing you?"]
          },
          // ... more objection handlers
        ]
      }
    ];

    // Convert to embeddings and store
    for (const source of knowledgeSources) {
      for (const item of source.content) {
        const embedding = await this.embeddings.create(
          JSON.stringify(item)
        );
        
        await this.supabase
          .from('knowledge_base')
          .insert({
            type: source.type,
            content: item,
            embedding: embedding,
            search_text: this.createSearchText(item)
          });
      }
    }
  }

  async retrieveKnowledge(understanding) {
    const { intent, entities, context } = understanding;
    
    // 1. Get intent-specific knowledge
    const intentKnowledge = await this.getIntentKnowledge(intent);
    
    // 2. Semantic search for relevant content
    const semanticResults = await this.semanticSearch(
      understanding.originalMessage
    );
    
    // 3. Entity-specific information
    const entityKnowledge = await this.getEntityKnowledge(entities);
    
    // 4. Context-aware retrieval
    const contextualKnowledge = await this.getContextualKnowledge(
      context,
      intent
    );
    
    return {
      primary: intentKnowledge,
      semantic: semanticResults,
      entities: entityKnowledge,
      contextual: contextualKnowledge,
      all: [...intentKnowledge, ...semanticResults, ...entityKnowledge]
    };
  }

  async semanticSearch(query, limit = 5) {
    // Generate embedding for the query
    const queryEmbedding = await this.embeddings.create(query);
    
    // Find similar content using vector similarity
    const { data } = await this.supabase
      .rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit
      });
    
    return data;
  }

  async getIntentKnowledge(intent) {
    // Retrieve pre-mapped knowledge for specific intents
    const intentMapping = {
      pricing_inquiry: ['pricing', 'plans', 'discounts'],
      feature_question: ['product_features', 'capabilities'],
      integration_inquiry: ['integrations', 'api_docs'],
      use_case_exploration: ['use_cases', 'case_studies'],
      competitor_comparison: ['competitors', 'differentiators']
    };
    
    const types = intentMapping[intent.intent] || [];
    
    const { data } = await this.supabase
      .from('knowledge_base')
      .select('*')
      .in('type', types)
      .limit(10);
    
    return data;
  }
}