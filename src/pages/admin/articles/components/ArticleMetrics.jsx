// src/pages/admin/articles/components/ArticleMetrics.jsx
import React from 'react';
import { MetricsDisplay } from '../../../../components/admin';

const ArticleMetrics = ({ metrics, loading = false }) => {
  // Article-specific metric configurations
  const articleMetrics = [
    {
      id: 'total',
      label: 'Total Articles',
      value: metrics?.total || 0,
      icon: 'FileText',
      format: 'number',
      trend: metrics?.totalTrend,
      className: 'border-blue-200'
    },
    {
      id: 'published',
      label: 'Published',
      value: metrics?.published || 0,
      icon: 'Upload',
      format: 'number',
      trend: metrics?.publishedTrend,
      className: 'border-green-200',
      subtitle: `${metrics?.draft || 0} drafts`
    },
    {
      id: 'views',
      label: 'Total Views',
      value: metrics?.totalViews || 0,
      icon: 'Eye',
      format: 'number',
      trend: metrics?.viewsTrend,
      className: 'border-purple-200'
    },
    {
      id: 'engagement',
      label: 'Avg. Engagement',
      value: metrics?.avgEngagement || 0,
      icon: 'TrendingUp',
      format: 'percentage',
      trend: metrics?.engagementTrend,
      positiveIsUp: true,
      className: 'border-orange-200',
      progress: metrics?.avgEngagement,
      progressLabel: 'Target: 5%'
    }
  ];

  return (
    <MetricsDisplay
      metrics={articleMetrics}
      loading={loading}
      columns={4}
      size="md"
    />
  );
};

export default ArticleMetrics;