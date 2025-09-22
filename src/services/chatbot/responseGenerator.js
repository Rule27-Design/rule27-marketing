// src/services/chatbot/responseGenerator.js

class ResponseGenerator {
  constructor(supabase, aiProvider) {
    this.supabase = supabase;
    this.ai = aiProvider;
    this.templates = {};
    this.loadResponseTemplates();
  }

  async loadResponseTemplates() {
    try {
      const { data: templates, error } = await this.supabase
        .from('response_templates')
        .select('*')
        .eq('active', true);
      
      if (error) {
        console.error('Failed to load response templates:', error);
        return;
      }

      // Group templates by intent
      templates.forEach(template => {
        if (!this.templates[template.intent_name]) {
          this.templates[template.intent_name] = [];
        }
        this.templates[template.intent_name].push(template);
      });
      
      console.log(`Loaded response templates for ${Object.keys(this.templates).length} intents`);
    } catch (error) {
      console.error('Error in loadResponseTemplates:', error);
    }
  }

  async generateResponse(understanding, knowledge, strategy) {
    // Ensure templates are loaded
    if (Object.keys(this.templates).length === 0) {
      await this.loadResponseTemplates();
    }

    // Get templates for this intent
    const intentTemplates = this.templates[understanding.intent.intent] || [];
    
    if (understanding.confidence > 0.7 && intentTemplates.length > 0) {
      // Use database template
      return this.templateBasedResponse(understanding, knowledge, intentTemplates);
    } else if (understanding.confidence > 0.5) {
      // Hybrid approach
      return this.hybridResponse(understanding, knowledge, intentTemplates);
    } else {
      // Low confidence - use AI or ask for clarification
      return this.clarificationResponse(understanding);
    }
  }

  async templateBasedResponse(understanding, knowledge, templates) {
    // Select appropriate template based on scenario
    let template = templates[0]; // Default to first
    
    // If we have scenario-specific templates, use them
    if (understanding.entities?.industry === 'healthcare') {
      const healthcareTemplate = templates.find(t => t.scenario === 'healthcare_specific');
      if (healthcareTemplate) template = healthcareTemplate;
    } else if (understanding.entities?.requestingLink) {
      const linkTemplate = templates.find(t => t.scenario === 'link_request');
      if (linkTemplate) template = linkTemplate;
    } else if (understanding.context?.wantsGeneralInfo) {
      const generalTemplate = templates.find(t => t.scenario === 'general_request');
      if (generalTemplate) template = generalTemplate;
    }
    
    // Get the response text
    let response = template.template_text;
    
    // Replace variables if needed
    if (template.variables && template.variables.length > 0) {
      for (const variable of template.variables) {
        const value = await this.getVariableValue(variable, knowledge, understanding);
        response = response.replace(`{${variable}}`, value);
      }
    }
    
    return {
      text: response,
      intent: understanding.intent.intent,
      confidence: understanding.confidence,
      template_used: template.template_key
    };
  }

  async hybridResponse(understanding, knowledge, templates) {
    // If we have a template, enhance it
    if (templates.length > 0) {
      const baseTemplate = templates[0];
      let response = baseTemplate.template_text;
      
      // Add knowledge-based enhancements
      if (knowledge && knowledge.length > 0) {
        const relevantKnowledge = knowledge[0];
        if (relevantKnowledge.content?.case_studies) {
          // Add specific case study mention
          const caseStudy = relevantKnowledge.content.case_studies[0];
          response += `\n\nFor example, ${caseStudy.description}`;
        }
      }
      
      return {
        text: response,
        intent: understanding.intent.intent,
        confidence: understanding.confidence,
        template_used: 'hybrid'
      };
    }
    
    // Fall back to clarification
    return this.clarificationResponse(understanding);
  }

  async clarificationResponse(understanding) {
    const clarifications = {
      'portfolio_request': "I'd be happy to share our case studies! Are you looking for examples in a specific industry or type of project?",
      'pricing_inquiry': "I can help you with pricing information. Are you interested in project-based pricing or our monthly retainer options?",
      'demo_request': "I'd love to schedule a consultation for you! What's your primary goal for the meeting?",
      'company_info': "I can tell you about Rule27 Design. What aspect interests you most - our team, our process, or our capabilities?",
      'default': "I want to make sure I understand your question correctly. Could you tell me more about what you're looking for?"
    };
    
    const text = clarifications[understanding.suggestedIntent] || clarifications.default;
    
    return {
      text: text,
      intent: 'clarification',
      confidence: understanding.confidence || 0.30
    };
  }
  
  async getVariableValue(variable, knowledge, understanding) {
    // Fetch actual values from knowledge base
    if (variable === 'case_study_links' && knowledge) {
      const caseStudies = knowledge.find(k => k.type === 'case_studies');
      if (caseStudies?.content?.case_studies) {
        return caseStudies.content.case_studies
          .slice(0, 3)
          .map(cs => `• ${cs.title}: ${cs.url}`)
          .join('\n');
      }
    }
    
    if (variable === 'portfolio_urls' && knowledge) {
      const portfolio = knowledge.find(k => k.type === 'portfolio');
      if (portfolio?.content) {
        return portfolio.content.main_url || 'https://rule27design.com/work';
      }
    }
    
    if (variable === 'healthcare_links' && knowledge) {
      const healthcare = knowledge.find(k => k.content?.industry === 'Healthcare');
      if (healthcare?.content?.case_studies) {
        return healthcare.content.case_studies
          .map(cs => `• ${cs.title}: ${cs.url}`)
          .join('\n');
      }
    }
    
    return ''; // Return empty string if variable can't be filled
  }
}

export default ResponseGenerator;