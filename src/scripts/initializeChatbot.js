// src/scripts/initializeChatbot.js

import { createClient } from '@supabase/supabase-js';
import  rule27KnowledgeBase  from '../services/chatbot/trainingData/rule27Knowledge';
import { 
  pricingTrainingData,
  serviceTrainingData,
  qualificationTrainingData,
  demoTrainingData,
  competitorTrainingData,
  certificationTrainingData,
  objectionTrainingData,
  companyFAQTrainingData
} from '../services/chatbot/trainingData';
import { responseTemplates } from '../services/chatbot/templates/responseTemplates';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

async function initializeAll() {
  console.log('🚀 Initializing Rule27 Chatbot...');
  
  // 1. Load Knowledge Base
  console.log('📚 Loading knowledge base...');
  for (const knowledge of rule27KnowledgeBase) {
    const { error } = await supabase
      .from('knowledge_base')
      .upsert(knowledge, { onConflict: 'title' });
    
    if (error) console.error('KB error:', error);
  }
  console.log(`✅ Loaded ${rule27KnowledgeBase.length} knowledge items`);
  
  // 2. Load Training Data
  console.log('🎯 Loading training data...');
  const allTraining = [
    ...pricingTrainingData,
    ...serviceTrainingData,
    ...qualificationTrainingData,
    ...demoTrainingData,
    ...competitorTrainingData,
    ...certificationTrainingData,
    ...objectionTrainingData,
    ...companyFAQTrainingData
  ];
  
  for (const training of allTraining) {
    const { error } = await supabase
      .from('training_data')
      .upsert(training, { onConflict: 'user_message' });
    
    if (error) console.error('Training error:', error);
  }
  console.log(`✅ Loaded ${allTraining.length} training examples`);
  
  // 3. Load Response Templates
  console.log('💬 Loading response templates...');
  for (const template of responseTemplates) {
    const { error } = await supabase
      .from('message_variants')
      .upsert({
        scenario_key: template.scenario,
        variant_name: template.template_key,
        message_template: template.template_text,
        is_control: true,
        active: true
      }, { onConflict: 'variant_name' });
    
    if (error) console.error('Template error:', error);
  }
  console.log(`✅ Loaded ${responseTemplates.length} response templates`);
  
  // 4. Initialize Qualification Rules
  console.log('⚙️ Setting up qualification rules...');
  const qualificationRules = [
    {
      rule_name: 'high_budget',
      rule_type: 'keyword',
      conditions: { keywords: ['100k', '250k', 'six figure'] },
      score_adjustment: 30
    },
    {
      rule_name: 'decision_maker',
      rule_type: 'pattern',
      conditions: { pattern: 'ceo|founder|director|vp|head of' },
      score_adjustment: 25
    },
    {
      rule_name: 'urgent_timeline',
      rule_type: 'keyword',
      conditions: { keywords: ['asap', 'urgent', 'immediately', 'this week'] },
      score_adjustment: 20
    }
  ];
  
  for (const rule of qualificationRules) {
    const { error } = await supabase
      .from('qualification_rules')
      .upsert(rule, { onConflict: 'rule_name' });
    
    if (error) console.error('Rule error:', error);
  }
  console.log(`✅ Loaded ${qualificationRules.length} qualification rules`);
  
  console.log('🎉 Chatbot initialization complete!');
}

// Run initialization
initializeAll().catch(console.error);