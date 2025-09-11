// src/pages/admin/articles/editor-tabs/AnalyticsTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import Icon from '../../../../components/AdminIcon';

const AnalyticsTab = ({ articleId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [articleId]);

  const fetchAnalytics = async () => {
    try {
      // This would fetch real analytics data
      setAnalytics({
        views: 1234,
        uniqueViews: 890,
        avgReadTime: '3:45',
        bounceRate: '45%',
        shares: 56,
        comments: 23,
        topReferrers: [
          { source: 'Google', visits: 456 },
          { source: 'Facebook', visits: 234 },
          { source: 'Direct', visits: 123 }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Icon name="Eye" size={20} className="text-blue-500" />
            <span className="text-2xl font-bold">{analytics.views}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Total Views</div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Icon name="Users" size={20} className="text-green-500" />
            <span className="text-2xl font-bold">{analytics.uniqueViews}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Unique Views</div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Icon name="Clock" size={20} className="text-purple-500" />
            <span className="text-2xl font-bold">{analytics.avgReadTime}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Avg Read Time</div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Icon name="TrendingUp" size={20} className="text-orange-500" />
            <span className="text-2xl font-bold">{analytics.bounceRate}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Bounce Rate</div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium mb-4">Top Traffic Sources</h3>
        <div className="space-y-2">
          {analytics.topReferrers.map((referrer, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{referrer.source}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(referrer.visits / analytics.views) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{referrer.visits}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;