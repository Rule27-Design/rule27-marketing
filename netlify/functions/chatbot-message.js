exports.handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  // === DEBUGGING START ===
  console.log('=== LARRY CHATBOT DEBUG ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Environment check:', {
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    keyPreview: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    nodeVersion: process.version
  });

  const { message, conversationId, visitorId } = JSON.parse(event.body);
  
  console.log('Request received:', {
    message,
    conversationId,
    visitorId,
    messageLength: message.length
  });
  // === DEBUGGING END ===
  
  // Get OpenAI key from environment (NOT VITE_ prefixed)
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.error('❌ OpenAI API key not configured in Netlify environment variables');
    console.log('Returning fallback response');
    
    // Improved fallback responses based on intent
    const lowerMessage = message.toLowerCase();
    let fallbackResponse = "I'd love to help you with that! Can you tell me more about your project?";
    let intent = 'general';
    let leadScore = 30;
    let quickActions = [];
    
    // Basic intent matching for fallback
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      fallbackResponse = "Our projects typically start at $25K and scale based on your needs. We offer Growth ($25K-50K), Scale ($50K-100K), and Enterprise (Custom) packages. What size project are you considering?";
      intent = 'pricing';
      leadScore = 60;
      quickActions = [
        { icon: '📅', text: 'Schedule Call', value: 'schedule' },
        { icon: '📊', text: 'Case Studies', value: 'portfolio' }
      ];
    } else if (lowerMessage.includes('website') || lowerMessage.includes('develop')) {
      fallbackResponse = "Excellent! We build everything from marketing sites to complex web applications using modern tech like React and Next.js. We handle both design AND development. What type of project do you have in mind?";
      intent = 'development';
      leadScore = 70;
      quickActions = [
        { icon: '🛍️', text: 'E-commerce', value: 'ecommerce' },
        { icon: '⚡', text: 'Web App', value: 'webapp' },
        { icon: '📅', text: 'Let\'s Talk', value: 'consultation' }
      ];
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      fallbackResponse = "Hey there! 👋 I'm Larry from Rule27 Design. We're experts in both marketing AND development - a rare combo! What can I help you with today?";
      intent = 'greeting';
      quickActions = [
        { icon: '💰', text: 'Pricing Info', value: 'pricing' },
        { icon: '🚀', text: 'Our Services', value: 'services' },
        { icon: '📅', text: 'Book a Call', value: 'consultation' }
      ];
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: fallbackResponse,
        intent,
        confidence: 0.8,
        leadScore,
        quickActions: quickActions.length > 0 ? quickActions : [
          { icon: '📅', text: 'Book Discovery Call', value: 'schedule' },
          { icon: '💰', text: 'View Pricing', value: 'pricing' },
          { icon: '📊', text: 'See Case Studies', value: 'portfolio' }
        ]
      })
    };
  }

  try {
    console.log('✅ OpenAI API key found, making request...');
    
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
            Always be helpful and guide toward booking a consultation.
            When asked about pricing, always mention the specific packages.
            For greetings, be warm and mention both marketing AND development capabilities.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    console.log('OpenAI Response Status:', openAIResponse.status);
    
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API Error:', openAIResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    
    console.log('OpenAI Response Data:', {
      hasChoices: !!data.choices,
      choicesCount: data.choices?.length,
      usage: data.usage,
      model: data.model
    });
    
    // Check for API errors
    if (data.error) {
      console.error('OpenAI Error Response:', data.error);
      throw new Error(data.error.message || 'OpenAI API error');
    }
    
    // Extract response
    const botResponse = data.choices?.[0]?.message?.content || 
      "I'd love to help you with that! Can you tell me more about your project?";
    
    console.log('Bot response extracted:', botResponse.substring(0, 50) + '...');
    
    // Enhanced intent detection
    let intent = 'general';
    let leadScore = 30;
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget') || lowerMessage.includes('pricing')) {
      intent = 'pricing';
      leadScore = 60;
    } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you') || lowerMessage.includes('offer')) {
      intent = 'services';
      leadScore = 40;
    } else if (lowerMessage.includes('website') || lowerMessage.includes('app') || lowerMessage.includes('develop')) {
      intent = 'development';
      leadScore = 70;
    } else if (lowerMessage.includes('market') || lowerMessage.includes('brand') || lowerMessage.includes('campaign')) {
      intent = 'marketing';
      leadScore = 65;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('meet') || lowerMessage.includes('consultation')) {
      intent = 'contact';
      leadScore = 80;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      intent = 'greeting';
      leadScore = 20;
    }
    
    console.log('Intent detected:', intent, 'Lead score:', leadScore);
    
    // Dynamic quick actions based on intent
    let quickActions = [];
    
    switch(intent) {
      case 'pricing':
        quickActions = [
          { icon: '💰', text: 'Growth Package Details', value: 'growth' },
          { icon: '🚀', text: 'Scale Package Details', value: 'scale' },
          { icon: '📅', text: 'Get Custom Quote', value: 'quote' }
        ];
        break;
      case 'development':
        quickActions = [
          { icon: '🛍️', text: 'E-commerce Sites', value: 'ecommerce' },
          { icon: '⚡', text: 'Web Applications', value: 'webapp' },
          { icon: '📅', text: 'Start Project', value: 'consultation' }
        ];
        break;
      case 'marketing':
        quickActions = [
          { icon: '🎯', text: 'Brand Strategy', value: 'branding' },
          { icon: '📈', text: 'Growth Marketing', value: 'growth-marketing' },
          { icon: '📅', text: 'Marketing Consultation', value: 'consultation' }
        ];
        break;
      case 'contact':
        quickActions = [
          { icon: '📅', text: 'Book on Calendly', value: 'calendly' },
          { icon: '📞', text: 'Call Us Now', value: 'call' },
          { icon: '📧', text: 'Email Us', value: 'email' }
        ];
        break;
      case 'greeting':
        quickActions = [
          { icon: '💰', text: 'Pricing Info', value: 'pricing' },
          { icon: '🚀', text: 'Our Services', value: 'services' },
          { icon: '📊', text: 'Case Studies', value: 'portfolio' },
          { icon: '📅', text: 'Book a Call', value: 'consultation' }
        ];
        break;
      default:
        quickActions = [
          { icon: '📅', text: 'Book Discovery Call', value: 'schedule' },
          { icon: '💰', text: 'View Pricing', value: 'pricing' },
          { icon: '📊', text: 'See Case Studies', value: 'portfolio' }
        ];
    }
    
    console.log('✅ Returning successful OpenAI response');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: botResponse,
        intent,
        confidence: 0.85,
        leadScore,
        quickActions,
        powered_by: 'openai' // Add this to verify OpenAI is working
      })
    };
    
  } catch (error) {
    console.error('❌ Error in OpenAI processing:', error.message);
    console.error('Full error:', error);
    
    // Fallback response if OpenAI fails
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: "I'm here to help! We excel at both marketing AND development. What specific challenge are you facing?",
        intent: 'general',
        confidence: 0.7,
        leadScore: 30,
        quickActions: [
          { icon: '📅', text: 'Schedule Call', value: 'schedule' },
          { icon: '💰', text: 'Pricing Info', value: 'pricing' }
        ],
        error_fallback: true // Add this to identify when fallback is used
      })
    };
  }
};