exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { message, conversationId, visitorId } = JSON.parse(event.body);
  
  // Get OpenAI key from environment (NOT VITE_ prefixed)
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    // Fallback to simple response if no API key
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: "I'm here to help! Our services start at $25K and we excel at both marketing AND development. What's your project about?",
        intent: 'general',
        confidence: 0.8,
        leadScore: 30
      })
    };
  }

  try {
    // Call OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: `You are Larry, Rule27 Design's friendly AI assistant. 
            Keep responses concise (under 100 words).
            Focus on Rule27's unique value: exceptional at BOTH marketing AND development.
            Services start at $25K. Packages: Growth ($25K-50K), Scale ($50K-100K), Enterprise (Custom).
            Always be helpful and guide toward booking a consultation.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await openAIResponse.json();
    
    // Extract response
    const botResponse = data.choices?.[0]?.message?.content || 
      "I'd love to help you with that! Can you tell me more about your project?";
    
    // Simple intent detection
    let intent = 'general';
    let leadScore = 30;
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      intent = 'pricing';
      leadScore = 50;
    } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you')) {
      intent = 'services';
      leadScore = 40;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('call')) {
      intent = 'contact';
      leadScore = 80;
    }
    
    // Dynamic quick actions based on intent
    const quickActions = intent === 'pricing' ? [
      { icon: '💰', text: 'Growth Package Details', value: 'growth' },
      { icon: '🚀', text: 'Scale Package Details', value: 'scale' },
      { icon: '📅', text: 'Get Custom Quote', value: 'quote' }
    ] : [
      { icon: '📅', text: 'Book Discovery Call', value: 'schedule' },
      { icon: '💰', text: 'View Pricing', value: 'pricing' },
      { icon: '📊', text: 'See Case Studies', value: 'portfolio' }
    ];
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: botResponse,
        intent,
        confidence: 0.85,
        leadScore,
        quickActions
      })
    };
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback response if OpenAI fails
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: "I'm here to help! We excel at both marketing AND development. What specific challenge are you facing?",
        intent: 'general',
        confidence: 0.7,
        leadScore: 30,
        quickActions: [
          { icon: '📅', text: 'Schedule Call', value: 'schedule' },
          { icon: '💰', text: 'Pricing Info', value: 'pricing' }
        ]
      })
    };
  }
};