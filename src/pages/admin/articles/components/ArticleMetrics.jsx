// src/pages/admin/articles/components/ArticleMetrics.jsx - Stats display
import React from 'react';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils/cn';

export const ArticleMetrics = ({ 
  articles = [], 
  className = '',
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  // Calculate comprehensive stats
  const stats = React.useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const pending = articles.filter(a => a.status === 'pending_approval').length;
    const featured = articles.filter(a => a.is_featured).length;
    
    const totalViews = articles.reduce((sum, article) => sum + (article.view_count || 0), 0);
    const totalLikes = articles.reduce((sum, article) => sum + (article.like_count || 0), 0);
    const totalComments = articles.reduce((sum, article) => sum + (article.comment_count || 0), 0);
    
    const avgViews = published > 0 ? Math.round(totalViews / published) : 0;
    const avgReadTime = articles.length > 0 
      ? Math.round(articles.reduce((sum, a) => sum + (a.read_time || 0), 0) / articles.length)
      : 0;
    
    const engagementRate = totalViews > 0 
      ? Math.round(((totalLikes + totalComments) / totalViews) * 100 * 100) / 100 
      : 0;

    return {
      total,
      published,
      drafts,
      pending,
      featured,
      totalViews,
      totalLikes,
      totalComments,
      avgViews,
      avgReadTime,
      engagementRate
    };
  }, [articles]);

  if (variant === 'compact') {
    return (
      <div className={cn('grid grid-cols-4 gap-4', className)}>
        <MetricCard
          icon="FileText"
          value={stats.total}
          label="Total"
          color="gray"
          size="sm"
        />
        <MetricCard
          icon="Globe"
          value={stats.published}
          label="Published"
          color="green"
          size="sm"
        />
        <MetricCard
          icon="Eye"
          value={formatNumber(stats.totalViews)}
          label="Views"
          color="blue"
          size="sm"
        />
        <MetricCard
          icon="Heart"
          value={formatNumber(stats.totalLikes)}
          label="Likes"
          color="red"
          size="sm"
        />
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon="FileText"
            value={stats.total}
            label="Total Articles"
            color="gray"
            trend={getTrend(stats.total, 'total')}
          />
          <MetricCard
            icon="Globe"
            value={stats.published}
            label="Published"
            color="green"
            trend={getTrend(stats.published, 'published')}
          />
          <MetricCard
            icon="Clock"
            value={stats.pending}
            label="Pending Review"
            color="yellow"
            trend={getTrend(stats.pending, 'pending')}
          />
          <MetricCard
            icon="Star"
            value={stats.featured}
            label="Featured"
            color="purple"
            trend={getTrend(stats.featured, 'featured')}
          />
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon="Eye"
            value={formatNumber(stats.totalViews)}
            label="Total Views"
            subtitle={`${stats.avgViews} avg per article`}
            color="blue"
          />
          <MetricCard
            icon="Heart"
            value={formatNumber(stats.totalLikes)}
            label="Total Likes"
            subtitle={`${stats.engagementRate}% engagement rate`}
            color="red"
          />
          <MetricCard
            icon="MessageCircle"
            value={formatNumber(stats.totalComments)}
            label="Total Comments"
            subtitle={`${stats.avgReadTime} min avg read time`}
            color="indigo"
          />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      <MetricCard
        icon="FileText"
        value={stats.total}
        label="Total Articles"
        color="gray"
      />
      <MetricCard
        icon="Globe"
        value={stats.published}
        label="Published"
        color="green"
      />
      <MetricCard
        icon="Eye"
        value={formatNumber(stats.totalViews)}
        label="Total Views"
        color="blue"
      />
      <MetricCard
        icon="Heart"
        value={formatNumber(stats.totalLikes)}
        label="Total Likes"
        color="red"
      />
    </div>
  );
};

// Individual metric card component
const MetricCard = ({ 
  icon, 
  value, 
  label, 
  subtitle, 
  color = 'gray', 
  trend, 
  size = 'default',
  className = '' 
}) => {
  const colorClasses = {
    gray: 'bg-gray-50 text-gray-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  const sizeClasses = {
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24
  };

  const valueSize = {
    sm: 'text-lg',
    default: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn(
      'bg-white rounded-lg border',
      sizeClasses[size],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className={cn(
          'rounded-lg p-2',
          colorClasses[color]
        )}>
          <Icon name={icon} size={iconSizes[size]} />
        </div>
        {trend && <TrendIndicator trend={trend} />}
      </div>
      
      <div className="mt-3">
        <div className={cn('font-bold text-gray-900', valueSize[size])}>
          {value}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

// Trend indicator component
const TrendIndicator = ({ trend }) => {
  if (!trend || trend.value === 0) return null;

  const isPositive = trend.value > 0;
  
  return (
    <div className={cn(
      'flex items-center text-xs font-medium',
      isPositive ? 'text-green-600' : 'text-red-600'
    )}>
      <Icon 
        name={isPositive ? 'TrendingUp' : 'TrendingDown'} 
        size={12} 
        className="mr-1" 
      />
      {Math.abs(trend.value)}%
    </div>
  );
};

// Status breakdown component
export const ArticleStatusBreakdown = ({ articles = [], className = '' }) => {
  const statusCounts = React.useMemo(() => {
    const counts = {
      draft: 0,
      pending_approval: 0,
      approved: 0,
      published: 0,
      archived: 0
    };
    
    articles.forEach(article => {
      if (counts.hasOwnProperty(article.status)) {
        counts[article.status]++;
      }
    });
    
    return counts;
  }, [articles]);

  const total = articles.length;

  const statusConfig = {
    published: { label: 'Published', color: 'bg-green-500', icon: 'Globe' },
    draft: { label: 'Drafts', color: 'bg-gray-500', icon: 'FileText' },
    pending_approval: { label: 'Pending', color: 'bg-yellow-500', icon: 'Clock' },
    approved: { label: 'Approved', color: 'bg-blue-500', icon: 'CheckCircle' },
    archived: { label: 'Archived', color: 'bg-red-500', icon: 'Archive' }
  };

  return (
    <div className={cn('bg-white rounded-lg border p-4', className)}>
      <h3 className="text-sm font-medium text-gray-900 mb-4">Article Status</h3>
      
      <div className="space-y-3">
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = statusConfig[status];
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          
          return (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn('w-3 h-3 rounded-full', config.color)} />
                <span className="text-sm text-gray-700">{config.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{count}</span>
                <span className="text-xs text-gray-500">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="h-full flex">
          {Object.entries(statusCounts).map(([status, count]) => {
            const config = statusConfig[status];
            const width = total > 0 ? (count / total) * 100 : 0;
            
            return (
              <div
                key={status}
                className={config.color}
                style={{ width: `${width}%` }}
                title={`${config.label}: ${count} (${Math.round(width)}%)`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Performance insights component
export const ArticleInsights = ({ articles = [], className = '' }) => {
  const insights = React.useMemo(() => {
    if (articles.length === 0) return [];

    const published = articles.filter(a => a.status === 'published');
    const insights = [];

    // Top performing article
    const topArticle = published.reduce((top, article) => 
      (article.view_count || 0) > (top.view_count || 0) ? article : top
    , published[0]);

    if (topArticle) {
      insights.push({
        type: 'success',
        icon: 'TrendingUp',
        title: 'Top Performer',
        message: `"${topArticle.title}" has ${formatNumber(topArticle.view_count || 0)} views`
      });
    }

    // Publishing frequency
    const thisMonth = articles.filter(a => {
      const date = new Date(a.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    if (thisMonth > 0) {
      insights.push({
        type: 'info',
        icon: 'Calendar',
        title: 'Publishing Pace',
        message: `${thisMonth} article${thisMonth === 1 ? '' : 's'} published this month`
      });
    }

    // Draft reminder
    const oldDrafts = articles.filter(a => {
      const updated = new Date(a.updated_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return a.status === 'draft' && updated < weekAgo;
    }).length;

    if (oldDrafts > 0) {
      insights.push({
        type: 'warning',
        icon: 'Clock',
        title: 'Stale Drafts',
        message: `${oldDrafts} draft${oldDrafts === 1 ? '' : 's'} haven't been updated in a week`
      });
    }

    return insights;
  }, [articles]);

  if (insights.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {insights.map((insight, index) => (
        <InsightCard key={index} {...insight} />
      ))}
    </div>
  );
};

// Individual insight card
const InsightCard = ({ type, icon, title, message }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={cn(
      'p-3 rounded-lg border',
      typeClasses[type]
    )}>
      <div className="flex items-start space-x-2">
        <Icon name={icon} size={16} className="mt-0.5 flex-shrink-0" />
        <div>
          <div className="font-medium text-sm">{title}</div>
          <div className="text-sm opacity-90">{message}</div>
        </div>
      </div>
    </div>
  );
};

// Utility functions
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const getTrend = (current, type) => {
  // Mock trend calculation - in real app, compare with previous period
  const mockTrends = {
    total: Math.floor(Math.random() * 20) - 10,
    published: Math.floor(Math.random() * 15) - 5,
    pending: Math.floor(Math.random() * 10) - 5,
    featured: Math.floor(Math.random() * 5) - 2
  };
  
  return { value: mockTrends[type] || 0 };
};

export default ArticleMetrics;