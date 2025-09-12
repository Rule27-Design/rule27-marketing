// src/pages/admin/case-studies/editor-tabs/AnalyticsTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import Icon from '../../../../components/AdminIcon';

const AnalyticsTab = ({ caseStudyId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [caseStudyId]);

  const fetchAnalytics = async () => {
    try {
      // This would fetch real analytics data
      setAnalytics({
        views: 2456,
        uniqueViews: 1890,
        avgTimeOnPage: '5:23',
        conversionRate: '12.5%',
        inquiries: 34,
        downloads: 78,
        topReferrers: [
          { source: 'Google', visits: 890 },
          { source: 'LinkedIn', visits: 456 },
          { source: 'Direct', visits: 345 }
        ],
        viewsByMonth: [
          { month: 'Jan', views: 234 },
          { month: 'Feb', views: 345 },
          { month: 'Mar', views: 456 }
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <Icon name="MessageCircle" size={20} className="text-purple-500" />
            <span className="text-2xl font-bold">{analytics.inquiries}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Inquiries</div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Icon name="TrendingUp" size={20} className="text-orange-500" />
            <span className="text-2xl font-bold">{analytics.conversionRate}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Conversion Rate</div>
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

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium mb-4">Views by Month</h3>
        <div className="flex items-end justify-between space-x-2">
          {analytics.viewsByMonth.map((month, index) => (
            <div key={index} className="flex-1 text-center">
              <div 
                className="bg-accent bg-opacity-20 rounded-t"
                style={{ 
                  height: `${(month.views / 500) * 100}px`,
                  minHeight: '20px'
                }}
              >
                <span className="text-xs font-medium">{month.views}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">{month.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;