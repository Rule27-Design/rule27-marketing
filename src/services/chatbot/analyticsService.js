// services/analyticsService.js

class AnalyticsService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Real-time conversion funnel
  async getConversionFunnel(timeframe = '24h') {
    const query = `
      WITH funnel_stages AS (
        SELECT 
          COUNT(DISTINCT visitor_profile_id) as total_visitors,
          COUNT(DISTINCT CASE 
            WHEN total_messages > 0 THEN visitor_profile_id 
          END) as engaged_visitors,
          COUNT(DISTINCT CASE 
            WHEN lead_score_change > 20 THEN visitor_profile_id 
          END) as qualified_leads,
          COUNT(DISTINCT CASE 
            WHEN conversion_event IS NOT NULL THEN visitor_profile_id 
          END) as conversions
        FROM conversations
        WHERE started_at > NOW() - INTERVAL '${timeframe}'
      )
      SELECT 
        total_visitors,
        engaged_visitors,
        qualified_leads,
        conversions,
        ROUND(engaged_visitors::NUMERIC / NULLIF(total_visitors, 0) * 100, 2) as engagement_rate,
        ROUND(qualified_leads::NUMERIC / NULLIF(engaged_visitors, 0) * 100, 2) as qualification_rate,
        ROUND(conversions::NUMERIC / NULLIF(qualified_leads, 0) * 100, 2) as close_rate
      FROM funnel_stages;
    `;
    
    const { data } = await this.supabase.rpc('execute_sql', { query });
    return data;
  }

  // Message variant performance
  async getVariantPerformance() {
    const query = `
      SELECT 
        scenario_key,
        variant_name,
        times_shown,
        ROUND(positive_responses::NUMERIC / NULLIF(times_shown, 0) * 100, 2) as response_rate,
        ROUND(conversions::NUMERIC / NULLIF(times_shown, 0) * 100, 2) as conversion_rate,
        avg_score_increase,
        confidence_level,
        is_control,
        is_winner
      FROM message_variants
      WHERE active = true
      ORDER BY scenario_key, conversion_rate DESC;
    `;
    
    const { data } = await this.supabase.rpc('execute_sql', { query });
    return data;
  }

  // Lead velocity and quality trends
  async getLeadTrends(days = 30) {
    const query = `
      SELECT 
        DATE(started_at) as date,
        COUNT(*) as total_conversations,
        AVG(lead_score_change) as avg_lead_score,
        COUNT(CASE WHEN lead_score_change > 60 THEN 1 END) as high_quality_leads,
        COUNT(CASE WHEN conversion_event IS NOT NULL THEN 1 END) as conversions,
        AVG(total_messages) as avg_conversation_length,
        AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as avg_duration_minutes
      FROM conversations
      WHERE started_at > CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(started_at)
      ORDER BY date DESC;
    `;
    
    const { data } = await this.supabase.rpc('execute_sql', { query });
    return data;
  }

  // Objection analysis
  async getObjectionPatterns() {
    const query = `
      SELECT 
        unnest(objections_raised) as objection,
        COUNT(*) as frequency,
        AVG(CASE WHEN conversion_event IS NOT NULL THEN 1 ELSE 0 END) as overcome_rate
      FROM conversations
      WHERE objections_raised IS NOT NULL
        AND started_at > CURRENT_DATE - INTERVAL '30 days'
      GROUP BY objection
      ORDER BY frequency DESC;
    `;
    
    const { data } = await this.supabase.rpc('execute_sql', { query });
    return data;
  }

  // Drop-off analysis
  async getDropOffPoints() {
    const query = `
      SELECT 
        dropped_at_question,
        COUNT(*) as drop_count,
        AVG(lead_score_change) as avg_score_at_drop
      FROM conversations
      WHERE dropped_at_question IS NOT NULL
        AND started_at > CURRENT_DATE - INTERVAL '7 days'
      GROUP BY dropped_at_question
      ORDER BY drop_count DESC
      LIMIT 10;
    `;
    
    const { data } = await this.supabase.rpc('execute_sql', { query });
    return data;
  }

  // ROI calculation
  async calculateROI(timeframe = '30d') {
    const query = `
      WITH roi_metrics AS (
        SELECT 
          COUNT(DISTINCT c.visitor_profile_id) as total_leads,
          COUNT(CASE WHEN c.conversion_event = 'demo_booked' THEN 1 END) as demos,
          COUNT(CASE WHEN c.conversion_event = 'sale_closed' THEN 1 END) as sales,
          SUM(c.conversion_value) as total_revenue,
          COUNT(*) * 0.003 as estimated_ai_cost -- $0.003 per conversation
        FROM conversations c
        WHERE c.started_at > NOW() - INTERVAL '${timeframe}'
      )
      SELECT 
        total_leads,
        demos,
        sales,
        total_revenue,
        estimated_ai_cost,
        ROUND((total_revenue - estimated_ai_cost) / NULLIF(estimated_ai_cost, 0), 2) as roi_multiplier
      FROM roi_metrics;
    `;
    
    const { data } = await this.supabase.rpc('execute_sql', { query });
    return data;
  }
}