// netlify/functions/chatbot-message.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const initSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.log('Supabase credentials not found');
    return null;
  }
  
  return createClient(url, key);
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  const { message, conversationId, visitorId, visitorProfileId } = JSON.parse(event.body);
  
  console.log('=== LARRY PROCESSING ===');
  console.log('Message:', message);
  console.log('ConversationId:', conversationId);
  
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const supabase = initSupabase();
  
  if (!OPENAI_API_KEY) {
    console.error('❌ No OpenAI key');
    return getFallbackResponse(message, headers);
  }

  try {
    // 1. GET/UPDATE CONVERSATION CONTEXT
    let context = await getOrCreateConversationContext(supabase, conversationId);
    
    // 2. DETECT INTENT using your intent_patterns table
    const intent = await detectIntentFromPatterns(supabase, message);
    console.log('🎯 Detected intent:', intent.name, 'Confidence:', intent.confidence);
    
    // Update context with new intent
    if (supabase && context) {
      await updateConversationContext(supabase, conversationId, {
        current_intent: intent.name,
        current_topic: intent.category
      });
    }
    
    // 3. RETRIEVE RELEVANT CONTENT based on intent and message
    const relevantContent = await getRelevantContent(supabase, message, intent);
    console.log('📚 Retrieved content:', {
      knowledge: relevantContent.knowledge?.length || 0,
      services: relevantContent.services?.length || 0,
      caseStudies: relevantContent.caseStudies?.length || 0,
      testimonials: relevantContent.testimonials?.length || 0,
      certifications: relevantContent.certifications?.length || 0
    });
    
    // 4. GET CONVERSATION HISTORY
    const conversationHistory = await getConversationHistory(supabase, conversationId);
    
    // 5. GET VISITOR PROFILE
    const visitorProfile = await getVisitorProfile(supabase, visitorProfileId || visitorId);
    
    // 6. CALCULATE LEAD SCORE using qualification_rules
    const leadScore = await calculateLeadScore(supabase, message, context, visitorProfile);
    console.log('📊 Lead score:', leadScore);
    
    // 7. GET RESPONSE TEMPLATE if exists
    const responseTemplate = await getResponseTemplate(supabase, intent.name, context?.conversation_stage);
    
    // 8. BUILD COMPREHENSIVE PROMPT with all your data
    const systemPrompt = buildComprehensivePrompt({
      relevantContent,
      intent,
      context,
      visitorProfile,
      conversationHistory,
      responseTemplate
    });
    
    // 9. GENERATE RESPONSE with OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...formatConversationHistory(conversationHistory),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 250
      })
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    let botResponse = data.choices?.[0]?.message?.content || "I can help with that!";
    
    // 10. CHECK FOR A/B TEST VARIANT
    const messageVariant = await getMessageVariant(supabase, intent.name, context?.conversation_stage);
    if (messageVariant) {
      // Track variant usage
      await updateVariantMetrics(supabase, messageVariant.id);
      // Use variant if confidence is high
      if (messageVariant.confidence_level > 0.8) {
        botResponse = messageVariant.message_template.replace('{response}', botResponse);
      }
    }
    
    // 11. STORE INTERACTION for learning
    if (supabase) {
      // Store in intent_training_data for future training
      await supabase.from('intent_training_data').insert({
        user_message: message,
        detected_intent: intent.name,
        is_validated: false,
        use_for_training: false
      });
      
      // Update conversation context with discussion topics
      if (context) {
        const topics = context.topics_discussed || [];
        if (!topics.includes(intent.category)) {
          topics.push(intent.category);
          await updateConversationContext(supabase, conversationId, {
            topics_discussed: topics
          });
        }
      }
    }
    
    // 12. GENERATE CONTEXTUAL QUICK ACTIONS
    const quickActions = generateContextualQuickActions(intent, leadScore, context, relevantContent);
    
    // 13. CHECK ESCALATION TRIGGERS
    const shouldEscalate = leadScore > 70 || 
                          intent.name === 'demo_request' || 
                          message.toLowerCase().includes('speak to someone');
    
    console.log('✅ Response generated successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: botResponse,
        intent: intent.name,
        confidence: intent.confidence,
        leadScore,
        quickActions,
        shouldEscalate,
        context: {
          stage: context?.conversation_stage,
          topics: context?.topics_discussed,
          currentTopic: intent.category
        },
        powered_by: 'openai_with_full_knowledge'
      })
    };
    
  } catch (error) {
    console.error('❌ Error:', error);
    return getFallbackResponse(message, headers);
  }
};

// === CONVERSATION CONTEXT MANAGEMENT ===

async function getOrCreateConversationContext(supabase, conversationId) {
  if (!supabase || !conversationId) return null;
  
  try {
    // Try to get existing context
    let { data: context } = await supabase
      .from('conversation_context')
      .select('*')
      .eq('conversation_id', conversationId)
      .single();
    
    if (!context) {
      // Create new context
      const { data: newContext } = await supabase
        .from('conversation_context')
        .insert({
          conversation_id: conversationId,
          conversation_stage: 'greeting',
          topics_discussed: [],
          questions_asked: [],
          objections_raised: []
        })
        .select()
        .single();
      
      context = newContext;
    }
    
    return context;
  } catch (error) {
    console.log('Context error:', error.message);
    return null;
  }
}

async function updateConversationContext(supabase, conversationId, updates) {
  if (!supabase || !conversationId) return;
  
  try {
    await supabase
      .from('conversation_context')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('conversation_id', conversationId);
  } catch (error) {
    console.log('Context update error:', error.message);
  }
}

// === INTENT DETECTION FROM YOUR TABLES ===

async function detectIntentFromPatterns(supabase, message) {
  if (!supabase) return { name: 'unknown', confidence: 0.3, category: 'general' };
  
  const lowerMessage = message.toLowerCase();
  
  try {
    // Get all active intent patterns
    const { data: patterns } = await supabase
      .from('intent_patterns')
      .select('*')
      .eq('active', true);
    
    if (!patterns || patterns.length === 0) {
      // Fallback to basic detection
      return basicIntentDetection(message);
    }
    
    let bestMatch = null;
    let highestScore = 0;
    
    for (const pattern of patterns) {
      let score = 0;
      
      // Check keywords
      if (pattern.keywords) {
        for (const keyword of pattern.keywords) {
          if (lowerMessage.includes(keyword.toLowerCase())) {
            score += 10;
          }
        }
      }
      
      // Check regex patterns
      if (pattern.regex_patterns) {
        for (const regexStr of pattern.regex_patterns) {
          try {
            const regex = new RegExp(regexStr, 'i');
            if (regex.test(message)) {
              score += 15;
            }
          } catch (e) {
            console.log('Invalid regex:', regexStr);
          }
        }
      }
      
      // Check example phrases similarity
      if (pattern.example_phrases) {
        for (const example of pattern.example_phrases) {
          if (calculateSimilarity(lowerMessage, example.toLowerCase()) > 0.7) {
            score += 20;
          }
        }
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = pattern;
      }
    }
    
    if (bestMatch && highestScore > 10) {
      // Update times_matched
      await supabase
        .from('intent_patterns')
        .update({ times_matched: (bestMatch.times_matched || 0) + 1 })
        .eq('id', bestMatch.id);
      
      return {
        name: bestMatch.intent_name,
        confidence: Math.min(highestScore / 30, 1),
        category: bestMatch.intent_category || 'general',
        action: bestMatch.action_type,
        isHighIntent: bestMatch.is_high_intent
      };
    }
  } catch (error) {
    console.log('Intent detection error:', error.message);
  }
  
  return basicIntentDetection(message);
}

function basicIntentDetection(message) {
  const lowerMessage = message.toLowerCase();
  
  if (/price|cost|budget|invest|how much/.test(lowerMessage)) {
    return { name: 'pricing_inquiry', confidence: 0.8, category: 'sales' };
  }
  if (/demo|consult|meet|call|book/.test(lowerMessage)) {
    return { name: 'demo_request', confidence: 0.9, category: 'sales' };
  }
  if (/service|what do you|offer|capabilities/.test(lowerMessage)) {
    return { name: 'service_inquiry', confidence: 0.7, category: 'exploration' };
  }
  if (/case study|example|portfolio|work/.test(lowerMessage)) {
    return { name: 'portfolio_request', confidence: 0.8, category: 'exploration' };
  }
  
  return { name: 'general', confidence: 0.5, category: 'general' };
}

// === RETRIEVE RELEVANT CONTENT FROM ALL YOUR TABLES ===

async function getRelevantContent(supabase, message, intent) {
  if (!supabase) return {};
  
  const content = {};
  const lowerMessage = message.toLowerCase();
  
  try {
    // 1. Get from knowledge_base table
    const { data: knowledge } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('active', true)
      .or(`type.eq.${intent.category},tags.cs.{${intent.name}}`)
      .limit(5);
    
    content.knowledge = knowledge || [];
    
    // 2. Get relevant services
    if (lowerMessage.includes('service') || lowerMessage.includes('what') || 
        lowerMessage.includes('offer') || lowerMessage.includes('development') ||
        lowerMessage.includes('marketing')) {
      
      const { data: services } = await supabase
        .from('services')
        .select(`
          *,
          zone:service_zones(*)
        `)
        .eq('is_active', true)
        .limit(10);
      
      content.services = services || [];
    }
    
    // 3. Get case studies/articles if mentioned
    if (lowerMessage.includes('case') || lowerMessage.includes('example') || 
        lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
      
      const { data: caseStudies } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .eq('type', 'case-study')
        .limit(5);
      
      content.caseStudies = caseStudies || [];
    }
    
    // 4. Get testimonials for social proof
    if (intent.name === 'demo_request' || intent.name === 'pricing_inquiry') {
      const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .limit(3);
      
      content.testimonials = testimonials || [];
    }
    
    // 5. Get certifications if mentioned
    if (lowerMessage.includes('certif') || lowerMessage.includes('qualified') || 
        lowerMessage.includes('expert')) {
      
      const { data: certifications } = await supabase
        .from('platform_certifications')
        .select('*')
        .eq('is_active', true);
      
      content.certifications = certifications || [];
    }
    
    // 6. Get awards if reputation questioned
    if (lowerMessage.includes('award') || lowerMessage.includes('recogni') || 
        lowerMessage.includes('best')) {
      
      const { data: awards } = await supabase
        .from('awards')
        .select('*')
        .eq('is_active', true)
        .limit(5);
      
      content.awards = awards || [];
    }
    
    // 7. Get partnerships/integrations
    if (lowerMessage.includes('partner') || lowerMessage.includes('integrat')) {
      const { data: partnerships } = await supabase
        .from('partnerships')
        .select('*')
        .eq('is_active', true);
      
      content.partnerships = partnerships || [];
    }
    
  } catch (error) {
    console.log('Content retrieval error:', error.message);
  }
  
  return content;
}

// === LEAD SCORING WITH YOUR RULES ===

async function calculateLeadScore(supabase, message, context, profile) {
  let score = 0;
  
  if (!supabase) return 30;
  
  try {
    // Get qualification rules
    const { data: rules } = await supabase
      .from('qualification_rules')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false });
    
    if (rules) {
      for (const rule of rules) {
        // Check if rule conditions match
        if (rule.conditions) {
          const conditions = rule.conditions;
          let matches = false;
          
          // Check message patterns
          if (conditions.message_pattern) {
            const pattern = new RegExp(conditions.message_pattern, 'i');
            if (pattern.test(message)) {
              matches = true;
            }
          }
          
          // Check context conditions
          if (conditions.stage && context?.conversation_stage === conditions.stage) {
            matches = true;
          }
          
          if (matches) {
            score += rule.score_adjustment || 0;
          }
        }
      }
    }
    
    // Add base scoring
    if (context) {
      const messageCount = context.questions_asked?.length || 0;
      score += Math.min(messageCount * 5, 20);
      
      if (context.bant_status) {
        if (context.bant_status.budget) score += 15;
        if (context.bant_status.authority) score += 15;
        if (context.bant_status.need) score += 10;
        if (context.bant_status.timeline) score += 10;
      }
    }
    
    // Profile scoring
    if (profile) {
      if (profile.company_name) score += 10;
      if (profile.email) score += 5;
    }
    
  } catch (error) {
    console.log('Lead scoring error:', error.message);
  }
  
  return Math.min(score, 100);
}

// === GET RESPONSE TEMPLATES ===

async function getResponseTemplate(supabase, intentName, stage) {
  if (!supabase) return null;
  
  try {
    const { data: template } = await supabase
      .from('response_templates')
      .select('*')
      .eq('active', true)
      .eq('intent_name', intentName)
      .or(`scenario.eq.${stage},scenario.is.null`)
      .single();
    
    return template;
  } catch (error) {
    return null;
  }
}

// === GET MESSAGE VARIANTS FOR A/B TESTING ===

async function getMessageVariant(supabase, intentName, stage) {
  if (!supabase) return null;
  
  try {
    const scenarioKey = `${stage}_${intentName}`;
    
    const { data: variants } = await supabase
      .from('message_variants')
      .select('*')
      .eq('active', true)
      .eq('scenario_key', scenarioKey);
    
    if (!variants || variants.length === 0) return null;
    
    // Use Thompson sampling for selection
    let bestVariant = null;
    let bestScore = 0;
    
    for (const variant of variants) {
      const successRate = variant.conversions / Math.max(variant.times_shown, 1);
      const explorationBonus = 1 / Math.sqrt(variant.times_shown + 1);
      const score = successRate + (explorationBonus * 0.1);
      
      if (score > bestScore) {
        bestScore = score;
        bestVariant = variant;
      }
    }
    
    return bestVariant;
  } catch (error) {
    return null;
  }
}

async function updateVariantMetrics(supabase, variantId) {
  if (!supabase) return;
  
  try {
    await supabase.rpc('increment_variant_shown', { variant_id: variantId });
  } catch (error) {
    console.log('Variant update error:', error.message);
  }
}

// === BUILD COMPREHENSIVE PROMPT ===

function buildComprehensivePrompt(data) {
  const { relevantContent, intent, context, visitorProfile, responseTemplate } = data;
  
  let prompt = `You are Larry, Rule27 Design's AI assistant. You have access to real company data to provide accurate, helpful responses.

CURRENT CONTEXT:
- Visitor Intent: ${intent.name} (${Math.round(intent.confidence * 100)}% confidence)
- Conversation Stage: ${context?.conversation_stage || 'greeting'}
- Topics Discussed: ${context?.topics_discussed?.join(', ') || 'none yet'}
- Visitor Company: ${visitorProfile?.company_name || 'unknown'}

AVAILABLE KNOWLEDGE:`;

  // Add services information
  if (relevantContent.services?.length > 0) {
    prompt += '\n\nOUR SERVICES:\n';
    relevantContent.services.forEach(service => {
      prompt += `- ${service.title}: ${service.description}\n`;
      if (service.features?.length > 0) {
        prompt += `  Features: ${service.features.slice(0, 3).join(', ')}\n`;
      }
      if (service.technologies?.length > 0) {
        prompt += `  Technologies: ${service.technologies.slice(0, 5).join(', ')}\n`;
      }
    });
  }

  // Add case studies
  if (relevantContent.caseStudies?.length > 0) {
    prompt += '\n\nRELEVANT CASE STUDIES:\n';
    relevantContent.caseStudies.forEach(cs => {
      prompt += `- ${cs.title}: ${cs.excerpt || cs.meta_description}\n`;
    });
  }

  // Add testimonials
  if (relevantContent.testimonials?.length > 0) {
    prompt += '\n\nCLIENT TESTIMONIALS:\n';
    relevantContent.testimonials.forEach(t => {
      prompt += `- "${t.quote}" - ${t.client_name}, ${t.client_title} at ${t.client_company}\n`;
    });
  }

  // Add certifications
  if (relevantContent.certifications?.length > 0) {
    prompt += `\n\nOUR CERTIFICATIONS (${relevantContent.certifications.length} total):\n`;
    const platforms = {};
    relevantContent.certifications.forEach(cert => {
      platforms[cert.platform] = (platforms[cert.platform] || 0) + 1;
    });
    Object.entries(platforms).forEach(([platform, count]) => {
      prompt += `- ${platform}: ${count} certifications\n`;
    });
  }

  // Add response template if exists
  if (responseTemplate) {
    prompt += `\n\nRESPONSE TEMPLATE GUIDANCE:\n${responseTemplate.template_text}\n`;
  }

  prompt += `\n\nRESPONSE GUIDELINES:
- Use specific information from the knowledge provided
- Keep responses under 150 words unless providing detailed information
- Reference specific services, case studies, or certifications when relevant
- For high-intent queries (demo, pricing), emphasize urgency and value
- Always be helpful and move the conversation forward
- End with a relevant question or call-to-action

Remember: You have real data - use it! Don't make generic statements when you can reference specific services, case studies, or capabilities.`;

  return prompt;
}

// === HELPER FUNCTIONS ===

function getConversationHistory(supabase, conversationId) {
  if (!supabase || !conversationId) return [];
  
  return supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true })
    .limit(10)
    .then(({ data }) => data || []);
}

function getVisitorProfile(supabase, visitorId) {
  if (!supabase || !visitorId) return null;
  
  return supabase
    .from('visitor_profiles')
    .select('*')
    .or(`id.eq.${visitorId},visitor_id.eq.${visitorId}`)
    .single()
    .then(({ data }) => data)
    .catch(() => null);
}

function formatConversationHistory(history) {
  if (!history || history.length === 0) return [];
  
  return history.slice(-5).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content || msg.message_text
  }));
}

function generateContextualQuickActions(intent, leadScore, context, content) {
  const actions = [];
  
  // Service-specific actions
  if (content.services?.length > 0) {
    const topServices = content.services.slice(0, 2);
    topServices.forEach(service => {
      actions.push({
        icon: '🎯',
        text: `Learn about ${service.title}`,
        value: `Tell me more about ${service.title}`
      });
    });
  }
  
  // High-intent actions
  if (leadScore > 60 || intent.isHighIntent) {
    actions.push({
      icon: '📅',
      text: 'Schedule Consultation',
      value: 'I want to schedule a consultation'
    });
  }
  
  // Case study actions
  if (content.caseStudies?.length > 0) {
    actions.push({
      icon: '📊',
      text: 'View Case Studies',
      value: 'Show me relevant case studies'
    });
  }
  
  // Default contextual actions
  if (actions.length < 3) {
    const defaults = [
      { icon: '💰', text: 'Pricing Information', value: 'What are your prices?' },
      { icon: '🚀', text: 'Our Services', value: 'What services do you offer?' },
      { icon: '📞', text: 'Contact Team', value: 'I want to speak with someone' }
    ];
    
    defaults.forEach(action => {
      if (actions.length < 4) actions.push(action);
    });
  }
  
  return actions.slice(0, 4);
}

function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const commonWords = words1.filter(w => words2.includes(w));
  return commonWords.length / Math.max(words1.length, words2.length);
}

function getFallbackResponse(message, headers) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      response: "I'm having trouble connecting to my knowledge base right now. Please email hello@rule27design.com or call (555) RULE-27 for immediate assistance.",
      intent: 'error',
      confidence: 0,
      leadScore: 0,
      quickActions: [
        { icon: '📧', text: 'Email Us', value: 'email' },
        { icon: '📞', text: 'Call Us', value: 'call' },
        { icon: '🔄', text: 'Try Again', value: 'retry' }
      ]
    })
  };
}