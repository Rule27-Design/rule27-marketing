// src/pages/admin/articles/hooks/useArticleMetrics.js - Article analytics and metrics
import { useMemo, useCallback } from 'react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

export const useArticleMetrics = (articles = []) => {
  
  // Calculate comprehensive article statistics
  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const pending = articles.filter(a => a.status === 'pending_approval').length;
    const featured = articles.filter(a => a.is_featured).length;
    
    // Calculate total views and engagement
    const totalViews = articles.reduce((sum, article) => sum + (article.view_count || 0), 0);
    const totalLikes = articles.reduce((sum, article) => sum + (article.like_count || 0), 0);
    const totalComments = articles.reduce((sum, article) => sum + (article.comment_count || 0), 0);
    
    // Average metrics
    const avgViews = published > 0 ? Math.round(totalViews / published) : 0;
    const avgReadTime = articles.length > 0 
      ? Math.round(articles.reduce((sum, a) => sum + (a.read_time || 0), 0) / articles.length)
      : 0;
    
    // Engagement rate (likes + comments per view)
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

  // Get trending articles (high views in recent period)
  const getTrendingArticles = useCallback((timeframe = 'week', limit = 5) => {
    const now = new Date();
    
    return articles
      .filter(article => {
        if (!article.published_at) return false;
        const publishedDate = new Date(article.published_at);
        
        switch (timeframe) {
          case 'today':
            return isToday(publishedDate);
          case 'yesterday':
            return isYesterday(publishedDate);
          case 'week':
            return isThisWeek(publishedDate);
          case 'month':
            return isThisMonth(publishedDate);
          default:
            return true;
        }
      })
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, limit);
  }, [articles]);

  // Get top performing articles by engagement
  const getTopPerformingArticles = useCallback((metric = 'views', limit = 5) => {
    const sortKey = {
      'views': 'view_count',
      'likes': 'like_count', 
      'comments': 'comment_count',
      'engagement': 'engagement_score'
    }[metric] || 'view_count';

    return articles
      .filter(article => article.status === 'published')
      .map(article => ({
        ...article,
        engagement_score: (article.like_count || 0) + (article.comment_count || 0)
      }))
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
      .slice(0, limit);
  }, [articles]);

  // Calculate publishing frequency and patterns
  const getPublishingStats = useCallback(() => {
    const publishedArticles = articles.filter(a => a.published_at && a.status === 'published');
    
    if (publishedArticles.length === 0) {
      return {
        frequency: 0,
        thisMonth: 0,
        lastMonth: 0,
        weeklyAverage: 0,
        mostActiveDay: 'N/A',
        publishingTrend: 'stable'
      };
    }

    const now = new Date();
    const thisMonth = publishedArticles.filter(a => isThisMonth(new Date(a.published_at))).length;
    
    // Calculate last month
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthCount = publishedArticles.filter(a => {
      const publishedDate = new Date(a.published_at);
      return publishedDate >= lastMonth && publishedDate <= lastMonthEnd;
    }).length;

    // Calculate weekly average over last 4 weeks
    const fourWeeksAgo = new Date(now.getTime() - (4 * 7 * 24 * 60 * 60 * 1000));
    const recentArticles = publishedArticles.filter(a => new Date(a.published_at) >= fourWeeksAgo);
    const weeklyAverage = Math.round(recentArticles.length / 4);

    // Find most active day of week
    const dayCount = {};
    publishedArticles.forEach(article => {
      const dayName = format(new Date(article.published_at), 'EEEE');
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });
    const mostActiveDay = Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, 'N/A');

    // Calculate trend
    let publishingTrend = 'stable';
    if (thisMonth > lastMonthCount * 1.2) publishingTrend = 'increasing';
    else if (thisMonth < lastMonthCount * 0.8) publishingTrend = 'decreasing';

    return {
      frequency: publishedArticles.length,
      thisMonth,
      lastMonth: lastMonthCount,
      weeklyAverage,
      mostActiveDay,
      publishingTrend
    };
  }, [articles]);

  // Get articles that need attention (low performance, old drafts, etc.)
  const getArticlesNeedingAttention = useCallback(() => {
    const issues = [];
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Old drafts
    const oldDrafts = articles.filter(article => 
      article.status === 'draft' && 
      new Date(article.updated_at) < oneWeekAgo
    );
    if (oldDrafts.length > 0) {
      issues.push({
        type: 'old_drafts',
        count: oldDrafts.length,
        message: `${oldDrafts.length} draft(s) haven't been updated in over a week`,
        articles: oldDrafts.slice(0, 3),
        severity: 'medium'
      });
    }

    // Articles pending approval
    const pendingArticles = articles.filter(article => article.status === 'pending_approval');
    if (pendingArticles.length > 0) {
      issues.push({
        type: 'pending_approval',
        count: pendingArticles.length,
        message: `${pendingArticles.length} article(s) waiting for approval`,
        articles: pendingArticles,
        severity: 'high'
      });
    }

    // Low performing published articles (published > 1 week ago with low views)
    const lowPerformingArticles = articles.filter(article => 
      article.status === 'published' &&
      article.published_at &&
      new Date(article.published_at) < oneWeekAgo &&
      (article.view_count || 0) < 50
    );
    if (lowPerformingArticles.length > 0) {
      issues.push({
        type: 'low_performance',
        count: lowPerformingArticles.length,
        message: `${lowPerformingArticles.length} published article(s) have low engagement`,
        articles: lowPerformingArticles.slice(0, 3),
        severity: 'low'
      });
    }

    return issues;
  }, [articles]);

  // Calculate content health score
  const getContentHealthScore = useCallback(() => {
    if (articles.length === 0) return 0;

    const published = articles.filter(a => a.status === 'published').length;
    const withImages = articles.filter(a => a.featured_image).length;
    const withExcerpts = articles.filter(a => a.excerpt && a.excerpt.length > 50).length;
    const withMetaData = articles.filter(a => a.meta_title && a.meta_description).length;
    const recentlyUpdated = articles.filter(a => {
      const oneMonthAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
      return new Date(a.updated_at) > oneMonthAgo;
    }).length;

    const score = Math.round(
      (published / articles.length * 0.3 +
       withImages / articles.length * 0.2 +
       withExcerpts / articles.length * 0.2 +
       withMetaData / articles.length * 0.2 +
       recentlyUpdated / articles.length * 0.1) * 100
    );

    return Math.min(score, 100);
  }, [articles]);

  return {
    stats,
    getTrendingArticles,
    getTopPerformingArticles,
    getPublishingStats,
    getArticlesNeedingAttention,
    getContentHealthScore
  };
};