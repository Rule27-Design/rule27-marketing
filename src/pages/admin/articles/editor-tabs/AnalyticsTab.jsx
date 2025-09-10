// src/pages/admin/articles/editor-tabs/AnalyticsTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import Icon from '../../../../components/AdminIcon';
import { format } from 'date-fns';

const AnalyticsTab = ({ articleId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (articleId) {
      fetchAnalytics();
    }
  }, [articleId]);

  const fetchAnalytics = async () => {
    try {
      // Get article with analytics
      const { data: article } = await supabase
        .from('articles')
        .select(`
          view_count,
          unique_view_count,
          like_count,
          share_count,
          bookmark_count,
          average_read_depth,
          average_time_on_page,
          published_at
        `)
        .eq('id', articleId)
        .single();

      // Get recent analytics events
      const { data: events } = await supabase
        .from('article_analytics')
        .select('created_at, time_on_page, scroll_depth')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false })
        .limit(100);

      setAnalytics({
        ...article,
        events
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <Icon name="BarChart" size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-text-secondary">No analytics data available</p>
      </div>
    );
  }

  const engagementRate = analytics.view_count > 0
    ? Math.round(((analytics.like_count + analytics.share_count + analytics.bookmark_count) / analytics.view_count) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Eye" size={16} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.view_count || 0}
            </div>
            <div className="text-xs text-gray-500">Total Views</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Users" size={16} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.unique_view_count || 0}
            </div>
            <div className="text-xs text-gray-500">Unique Visitors</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Heart" size={16} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.like_count || 0}
            </div>
            <div className="text-xs text-gray-500">Likes</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Share2" size={16} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.share_count || 0}
            </div>
            <div className="text-xs text-gray-500">Shares</div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Engagement</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Engagement Rate</span>
              <span className="text-sm font-medium">{engagementRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full"
                style={{ width: `${Math.min(engagementRate, 100)}%` }}
              />
            </div>
          </div>

          {analytics.average_read_depth && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Average Read Depth</span>
                <span className="text-sm font-medium">{analytics.average_read_depth}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${analytics.average_read_depth}%` }}
                />
              </div>
            </div>
          )}

          {analytics.average_time_on_page && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Time on Page</span>
              <span className="text-sm font-medium">
                {Math.floor(analytics.average_time_on_page / 60)}m {analytics.average_time_on_page % 60}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Publishing Info */}
      {analytics.published_at && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Publishing</h3>
          <div className="text-sm text-gray-600">
            Published on {format(new Date(analytics.published_at), 'MMMM d, yyyy h:mm a')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;