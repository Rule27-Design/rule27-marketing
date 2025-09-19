// src/scripts/testChatbot.js

import { createClient } from '@supabase/supabase-js';
import { Rule27Chatbot } from '../services/chatbot/index.js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

async function testChatbot() {
  console.log('🧪 Testing Rule27 Chatbot...\n');
  
  const chatbot = new Rule27Chatbot(supabase);
  
  // Test conversations
  const testMessages = [
    "What makes Rule27 different from other agencies?",
    "How much does a website redesign cost?",
    "Do you have Salesforce certifications?",
    "We're a B2B SaaS company with 50 employees and need help",
    "Can we schedule a consultation?",
    "That seems expensive",
    "How long have you been in business?"
  ];
  
  const conversationId = 'test-' + Date.now();
  const visitorId = 'test-visitor-' + Date.now();
  
  for (const message of testMessages) {
    console.log(`\n👤 USER: ${message}`);
    
    try {
      const response = await chatbot.handleMessage(
        message,
        conversationId,
        visitorId
      );
      
      console.log(`🤖 BOT: ${response.text}`);
      console.log(`   [Intent: ${response.intent}, Confidence: ${response.confidence?.toFixed(2)}, Score: ${response.score?.totalScore || 0}]`);
      
      // Simulate delay between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✅ Test complete!');
  process.exit(0);
}

testChatbot().catch(console.error);