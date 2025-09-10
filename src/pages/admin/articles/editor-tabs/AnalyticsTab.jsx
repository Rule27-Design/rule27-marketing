// src/pages/admin/articles/editor-tabs/AnalyticsTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../../../utils';
import { cn } from '../../../../utils';

const AnalyticsTab = ({ articleId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [articleId, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      // Fetch analytics data
      const { data, error } = await supabase
        .from('article_analytics')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process data for charts
      const processed = processAnalyticsData(data);
      setAnalytics(processed);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data) => {
    // Group by date and event type
    const byDate = {};
    const eventCounts = {
      view: 0,
      unique_view: 0,
      like: 0,
      share: 0,
      bookmark: 0
    };

    data?.forEach(event => {
      const date = formatDate(event.created_at, 'MMM d');
      
      if (!byDate[date]) {
        byDate[date] = { date, views: 0, likes: 0, shares: 0 };
      }

      if (event.event_type === 'view') {
        byDate[date].views++;
        eventCounts.view++;
      } else if (event.event_type === 'like') {
        byDate[date].likes++;
        eventCounts.like++;
      } else if (event.event_type === 'share') {
        byDate[date].shares++;
        eventCounts.share++;
      }

      if (event.event_type in eventCounts) {
        eventCounts[event.event_type]++;
      }
    });

    return {
      timeline: Object.values(byDate),
      totals: eventCounts,
      recentEvents: data?.slice(0, 10) || []
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Analytics Overview</h3>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-sm border-gray-300 rounded-md"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className={cn(
          "text-center p-4 rounded-lg",
          "bg-blue-50"
        )}>
          <div className="text-2xl font-bold text-blue-600">
            {analytics?.totals.view || 0}
          </div>
          <div className="text-xs text-gray-600">Total Views</div>
        </div>
        <div className={cn(
          "text-center p-4 rounded-lg",
          "bg-green-50"
        )}>
          <div className="text-2xl font-bold text-green-600">
            {analytics?.totals.unique_view || 0}
          </div>
          <div className="text-xs text-gray-600">Unique Views</div>
        </div>
        <div className={cn(
          "text-center p-4 rounded-lg",
          "bg-red-50"
        )}>
          <div className="text-2xl font-bold text-red-600">
            {analytics?.totals.like || 0}
          </div>
          <div className="text-xs text-gray-600">Likes</div>
        </div>
        <div className={cn(
          "text-center p-4 rounded-lg",
          "bg-purple-50"
        )}>
          <div className="text-2xl font-bold text-purple-600">
            {analytics?.totals.share || 0}
          </div>
          <div className="text-xs text-gray-600">Shares</div>
        </div>
      </div>

      {/* Views Chart */}
      {analytics?.timeline?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Engagement Timeline</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" name="Views" />
                <Line type="monotone" dataKey="likes" stroke="#EF4444" name="Likes" />
                <Line type="monotone" dataKey="shares" stroke="#8B5CF6" name="Shares" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {analytics?.recentEvents?.map((event, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className={cn(
                  "text-xs px-2 py-1 rounded",
                  event.event_type === 'view' && 'bg-blue-100 text-blue-700',
                  event.event_type === 'like' && 'bg-red-100 text-red-700',
                  event.event_type === 'share' && 'bg-purple-100 text-purple-700'
                )}>
                  {event.event_type}
                </span>
                <span className="text-sm text-gray-600">
                  {event.user_id ? 'Registered user' : 'Anonymous'}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(event.created_at, 'MMM d, h:mm a')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;