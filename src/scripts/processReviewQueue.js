// src/scripts/processReviewQueue.js

import { createClient } from '@supabase/supabase-js';
import { HumanReviewQueue } from '../services/chatbot/humanReviewQueue.js';
import readline from 'readline';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function processReviewQueue() {
  console.log('👁️ Processing Review Queue...\n');
  
  const queue = new HumanReviewQueue(supabase);
  const items = await queue.getReviewQueue();
  
  if (!items || items.length === 0) {
    console.log('✅ No items to review!');
    process.exit(0);
  }
  
  console.log(`Found ${items.length} items to review\n`);
  
  for (const item of items) {
    console.log('─'.repeat(50));
    console.log(`\n📝 Review Item #${item.id}`);
    console.log(`Confidence: ${(item.confidence * 100).toFixed(0)}%`);
    console.log(`Detected Intent: ${item.detected_intent || 'unknown'}`);
    console.log(`\n👤 User: "${item.message}"`);
    console.log(`🤖 Bot: "${item.bot_response}"`);
    
    const action = await new Promise(resolve => {
      rl.question('\n✅ Approve, ❌ Reject, or 🔄 Skip? (a/r/s): ', resolve);
    });
    
    if (action.toLowerCase() === 'a') {
      await queue.reviewItem(item.id, {
        approved: true,
        correctIntent: item.detected_intent,
        improvedResponse: item.bot_response,
        notes: 'Approved via CLI'
      });
      console.log('✅ Approved and added to training data');
    } else if (action.toLowerCase() === 'r') {
      await queue.reviewItem(item.id, {
        approved: false,
        notes: 'Rejected via CLI'
      });
      console.log('❌ Rejected');
    } else {
      console.log('⏭️ Skipped');
    }
  }
  
  console.log('\n✅ Review complete!');
  rl.close();
  process.exit(0);
}

processReviewQueue().catch(console.error);