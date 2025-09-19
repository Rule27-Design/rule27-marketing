// src/services/chatbot/aiProvider.js

import OpenAI from 'openai';

export class AIProvider {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    // Add Claude as backup
    this.anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    }) : null;
  }
  
  async generateResponse(context, knowledge, intent) {
    const systemPrompt = `You are Rule27 Design's sales chatbot. 
    
CRITICAL CONTEXT:
- We're a full-service digital powerhouse with 12+ years experience
- We uniquely excel at BOTH marketing AND development (most agencies only do one)
- We have 60+ certifications across all major platforms
- We have 27+ certified experts on our team
- We focus on B2B companies ($5M-$100M revenue)
- Minimum project size is typically $25,000

YOUR PERSONALITY:
- Friendly, encouraging, and professional
- Confident about our unique dual expertise
- Focus on value, not just price
- Always move toward booking a consultation

CURRENT CONTEXT:
Intent: ${intent}
Lead Score: ${context.leadScore || 0}
Stage: ${context.stage || 'discovery'}`;

    const userPrompt = `Customer said: "${context.message}"

Relevant knowledge:
${JSON.stringify(knowledge.slice(0, 3), null, 2)}

Previous context: ${JSON.stringify(context.qualificationData || {})}

Generate a response that:
1. Directly answers their question
2. Highlights our unique value (both marketing AND dev expertise)
3. Includes a qualifying question or moves toward a consultation
4. Stays under 150 words
5. Sounds natural and conversational`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 200
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to template if AI fails
      return null;
    }
  }

  async classifyIntent(message) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Classify this message into one of these intents: pricing_inquiry, service_inquiry, demo_request, company_info, competitor_comparison, objection, qualification, or unknown"
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.3,
      max_tokens: 20
    });
    
    return response.choices[0].message.content.trim().toLowerCase();
  }
}