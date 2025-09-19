// src/scripts/generateAnalytics.js

import { createClient } from '@supabase/supabase-js';
import { AnalyticsService } from '../services/chatbot/analyticsService.js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

async function generateAnalytics() {
  console.log('📊 Generating Chatbot Analytics...\n');
  
  const analytics = new AnalyticsService(supabase);
  
  // Get conversion funnel
  const funnel = await analytics.getConversionFunnel('7d');
  console.log('🎯 Conversion Funnel (Last 7 Days):');
  console.log(`   Visitors: ${funnel?.total_visitors || 0}`);
  console.log(`   Engaged: ${funnel?.engaged_visitors || 0} (${funnel?.engagement_rate || 0}%)`);
  console.log(`   Qualified: ${funnel?.qualified_leads || 0} (${funnel?.qualification_rate || 0}%)`);
  console.log(`   Converted: ${funnel?.conversions || 0} (${funnel?.close_rate || 0}%)`);
  
  // Get variant performance
  const variants = await analytics.getVariantPerformance();
  console.log('\n🔬 Top Performing Message Variants:');
  variants?.slice(0, 5).forEach(v => {
    console.log(`   ${v.scenario_key}: ${v.conversion_rate}% conversion (${v.times_shown} views)`);
  });
  
  // Get objection patterns
  const objections = await analytics.getObjectionPatterns();
  console.log('\n⚠️ Common Objections:');
  objections?.slice(0, 5).forEach(o => {
    console.log(`   "${o.objection}": ${o.frequency} times (${(o.overcome_rate * 100).toFixed(0)}% overcome)`);
  });
  
  // Calculate ROI
  const roi = await analytics.calculateROI('30d');
  console.log('\n💰 ROI Metrics (Last 30 Days):');
  console.log(`   Total Leads: ${roi?.total_leads || 0}`);
  console.log(`   Demos Booked: ${roi?.demos || 0}`);
  console.log(`   Estimated Value: $${roi?.total_revenue || 0}`);
  console.log(`   ROI Multiplier: ${roi?.roi_multiplier || 0}x`);
  
  process.exit(0);
}

generateAnalytics().catch(console.error);