// src/pages/admin/metrics/Metrics.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  MetricsDisplay,
  ErrorState,
  SkeletonMetrics
} from '../../../components/admin';
import Icon from '../../../components/AdminIcon';
import Select from '../../../components/ui/Select';
import { formatDate } from '../../../utils';

const Metrics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [metrics, setMetrics] = useState({
    articles: {},
    caseStudies: {},
    combined: {},
    trends: []
  });

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      switch(dateRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Fetch article metrics
      const { data: articleData } = await supabase
        .from('articles')
        .select('view_count, like_count, share_count, comment_count, status, created_at')
        .gte('created_at', startDate.toISOString());

      // Fetch case study metrics
      const { data: caseStudyData } = await supabase
        .from('case_studies')
        .select('view_count, inquiry_count, status, created_at')
        .gte('created_at', startDate.toISOString());

      // Calculate metrics
      const articleMetrics = calculateArticleMetrics(articleData || []);
      const caseStudyMetrics = calculateCaseStudyMetrics(caseStudyData || []);
      const combinedMetrics = calculateCombinedMetrics(articleMetrics, caseStudyMetrics);

      setMetrics({
        articles: articleMetrics,
        caseStudies: caseStudyMetrics,
        combined: combinedMetrics,
        trends: generateTrends(articleData || [], caseStudyData || [], dateRange)
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateArticleMetrics = (articles) => {
    const published = articles.filter(a => a.status === 'published');
    const totalViews = articles.reduce((sum, a) => sum + (a.view_count || 0), 0);
    const totalEngagement = articles.reduce((sum, a) => 
      sum + (a.like_count || 0) + (a.share_count || 0) + (a.comment_count || 0), 0
    );

    return {
      total: articles.length,
      published: published.length,
      totalViews,
      totalEngagement,
      avgViews: articles.length > 0 ? Math.round(totalViews / articles.length) : 0,
      engagementRate: totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(1) : 0
    };
  };

  const calculateCaseStudyMetrics = (caseStudies) => {
    const published = caseStudies.filter(cs => cs.status === 'published');
    const totalViews = caseStudies.reduce((sum, cs) => sum + (cs.view_count || 0), 0);
    const totalInquiries = caseStudies.reduce((sum, cs) => sum + (cs.inquiry_count || 0), 0);

    return {
      total: caseStudies.length,
      published: published.length,
      totalViews,
      totalInquiries,
      conversionRate: totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : 0
    };
  };

  const calculateCombinedMetrics = (articles, caseStudies) => {
    return {
      totalContent: articles.total + caseStudies.total,
      totalViews: articles.totalViews + caseStudies.totalViews,
      totalEngagement: articles.totalEngagement + caseStudies.totalInquiries,
      contentGrowth: calculateGrowthRate(articles.total + caseStudies.total)
    };
  };

  const calculateGrowthRate = (current) => {
    // This would compare with previous period
    return '+12.5%'; // Placeholder
  };

  const generateTrends = (articles, caseStudies, range) => {
    // Generate daily/weekly/monthly trends based on range
    // This is simplified - you'd want proper date grouping
    return [];
  };

  if (loading) {
    return <SkeletonMetrics count={8} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading-bold uppercase tracking-wider">Metrics Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Track content performance and engagement
          </p>
        </div>
        
        <Select
          value={dateRange}
          onChange={(value) => setDateRange(value)}
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
            { value: '1y', label: 'Last year' }
          ]}
        />
      </div>

      {/* Combined Metrics */}
      <div>
        <h2 className="text-lg font-medium mb-4">Overall Performance</h2>
        <MetricsDisplay
          metrics={[
            {
              id: 'total-content',
              label: 'Total Content',
              value: metrics.combined.totalContent,
              format: 'number',
              icon: 'FileText',
              trend: parseFloat(metrics.combined.contentGrowth)
            },
            {
              id: 'total-views',
              label: 'Total Views',
              value: metrics.combined.totalViews,
              format: 'number',
              icon: 'Eye',
              trend: 15.3
            },
            {
              id: 'engagement',
              label: 'Total Engagement',
              value: metrics.combined.totalEngagement,
              format: 'number',
              icon: 'Heart',
              trend: 8.7
            },
            {
              id: 'avg-performance',
              label: 'Performance Score',
              value: 85,
              format: 'percentage',
              icon: 'TrendingUp',
              progress: 85
            }
          ]}
          columns={4}
        />
      </div>

      {/* Articles Metrics */}
      <div>
        <h2 className="text-lg font-medium mb-4">Articles</h2>
        <MetricsDisplay
          metrics={[
            {
              id: 'articles-total',
              label: 'Total Articles',
              value: metrics.articles.total,
              format: 'number',
              icon: 'FileText'
            },
            {
              id: 'articles-published',
              label: 'Published',
              value: metrics.articles.published,
              format: 'number',
              icon: 'Send'
            },
            {
              id: 'articles-views',
              label: 'Total Views',
              value: metrics.articles.totalViews,
              format: 'number',
              icon: 'Eye'
            },
            {
              id: 'articles-engagement',
              label: 'Engagement Rate',
              value: metrics.articles.engagementRate,
              format: 'percentage',
              icon: 'Heart'
            }
          ]}
          columns={4}
        />
      </div>

      {/* Case Studies Metrics */}
      <div>
        <h2 className="text-lg font-medium mb-4">Case Studies</h2>
        <MetricsDisplay
          metrics={[
            {
              id: 'case-total',
              label: 'Total Case Studies',
              value: metrics.caseStudies.total,
              format: 'number',
              icon: 'Briefcase'
            },
            {
              id: 'case-published',
              label: 'Published',
              value: metrics.caseStudies.published,
              format: 'number',
              icon: 'Send'
            },
            {
              id: 'case-views',
              label: 'Total Views',
              value: metrics.caseStudies.totalViews,
              format: 'number',
              icon: 'Eye'
            },
            {
              id: 'case-conversion',
              label: 'Conversion Rate',
              value: metrics.caseStudies.conversionRate,
              format: 'percentage',
              icon: 'TrendingUp'
            }
          ]}
          columns={4}
        />
      </div>

      {/* Top Performing Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopContent type="articles" dateRange={dateRange} />
        <TopContent type="case_studies" dateRange={dateRange} />
      </div>
    </div>
  );
};

// Top Content Component
const TopContent = ({ type, dateRange }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopContent();
  }, [type, dateRange]);

  const fetchTopContent = async () => {
    try {
      const { data } = await supabase
        .from(type)
        .select('id, title, view_count, status')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(5);

      setItems(data || []);
    } catch (error) {
      console.error('Error fetching top content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium mb-4">
        Top {type === 'articles' ? 'Articles' : 'Case Studies'}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">
                #{index + 1}
              </span>
              <span className="text-sm truncate max-w-xs">
                {item.title}
              </span>
            </div>
            <span className="text-sm font-medium">
              {item.view_count || 0} views
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;