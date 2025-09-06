// src/pages/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AdminIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const Analytics = () => {
  const { userProfile } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d, all
  const [activeTab, setActiveTab] = useState('overview'); // overview, content, services, conversions
  
  const [analytics, setAnalytics] = useState({
    overview: {
      totalPageViews: 0,
      uniqueVisitors: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
      topPages: [],
      topReferrers: []
    },
    content: {
      articles: {
        totalViews: 0,
        avgReadTime: 0,
        topArticles: [],
        engagementRate: 0
      },
      caseStudies: {
        totalViews: 0,
        conversionRate: 0,
        topStudies: []
      }
    },
    services: {
      totalViews: 0,
      totalInquiries: 0,
      conversionRate: 0,
      topServices: [],
      byZone: []
    },
    conversions: {
      leads: {
        total: 0,
        bySource: [],
        byStatus: [],
        conversionRate: 0
      },
      assessments: {
        started: 0,
        completed: 0,
        completionRate: 0,
        avgScore: 0
      }
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch(dateRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case 'all':
          startDate.setFullYear(2020); // Set to earliest date
          break;
      }

      // Fetch all analytics data
      const [
        pageAnalyticsRes,
        articleAnalyticsRes,
        serviceAnalyticsRes,
        articlesRes,
        caseStudiesRes,
        servicesRes,
        leadsRes,
        assessmentsRes,
        journeysRes
      ] = await Promise.all([
        // Page analytics
        supabase
          .from('page_analytics')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Article analytics
        supabase
          .from('article_analytics')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Service analytics
        supabase
          .from('service_analytics')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Articles with view counts
        supabase
          .from('articles')
          .select('id, title, slug, view_count, unique_view_count, like_count, average_time_on_page')
          .eq('status', 'published')
          .order('view_count', { ascending: false })
          .limit(10),
        
        // Case studies with metrics
        supabase
          .from('case_studies')
          .select('id, title, slug, view_count, conversion_count')
          .eq('status', 'published')
          .order('view_count', { ascending: false })
          .limit(10),
        
        // Services with inquiries
        supabase
          .from('services')
          .select(`
            id, title, slug, view_count, inquiry_count,
            zone:service_zones!zone_id(title)
          `)
          .eq('is_active', true)
          .order('view_count', { ascending: false })
          .limit(10),
        
        // Leads
        supabase
          .from('contact_submissions')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Assessments
        supabase
          .from('capability_assessments')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // User journeys
        supabase
          .from('user_journeys')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      // Process the data
      const pageAnalytics = pageAnalyticsRes.data || [];
      const articleAnalytics = articleAnalyticsRes.data || [];
      const serviceAnalytics = serviceAnalyticsRes.data || [];
      
      // Calculate overview metrics
      const uniqueSessions = [...new Set(pageAnalytics.map(p => p.session_id))].length;
      const uniqueUsers = [...new Set(pageAnalytics.filter(p => p.user_id).map(p => p.user_id))].length;
      const avgTimeOnPage = pageAnalytics.reduce((sum, p) => sum + (p.time_on_page || 0), 0) / pageAnalytics.length || 0;
      const bounces = pageAnalytics.filter(p => p.bounce).length;
      const bounceRate = pageAnalytics.length > 0 ? (bounces / pageAnalytics.length) * 100 : 0;

      // Top pages
      const pageViews = {};
      pageAnalytics.forEach(p => {
        pageViews[p.page_path] = (pageViews[p.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageViews)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, views]) => ({ path, views }));

      // Top referrers
      const referrers = {};
      pageAnalytics.filter(p => p.referrer_domain).forEach(p => {
        referrers[p.referrer_domain] = (referrers[p.referrer_domain] || 0) + 1;
      });
      const topReferrers = Object.entries(referrers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([domain, visits]) => ({ domain, visits }));

      // Article metrics
      const articleViews = articleAnalytics.length;
      const avgReadTime = articleAnalytics.reduce((sum, a) => sum + (a.time_on_page || 0), 0) / articleAnalytics.length || 0;
      const articleEngagement = articleAnalytics.filter(a => a.liked || a.bookmarked || a.shared).length;
      const engagementRate = articleAnalytics.length > 0 ? (articleEngagement / articleAnalytics.length) * 100 : 0;

      // Service metrics
      const serviceViews = serviceAnalytics.length;
      const serviceInquiries = servicesRes.data?.reduce((sum, s) => sum + (s.inquiry_count || 0), 0) || 0;
      const serviceConversionRate = serviceViews > 0 ? (serviceInquiries / serviceViews) * 100 : 0;

      // Service by zone
      const servicesByZone = {};
      servicesRes.data?.forEach(s => {
        const zoneName = s.zone?.title || 'Uncategorized';
        if (!servicesByZone[zoneName]) {
          servicesByZone[zoneName] = {
            name: zoneName,
            views: 0,
            inquiries: 0
          };
        }
        servicesByZone[zoneName].views += s.view_count || 0;
        servicesByZone[zoneName].inquiries += s.inquiry_count || 0;
      });

      // Lead metrics
      const leads = leadsRes.data || [];
      const leadsBySource = {};
      const leadsByStatus = {};
      
      leads.forEach(lead => {
        const source = lead.utm_source || lead.source || 'Direct';
        leadsBySource[source] = (leadsBySource[source] || 0) + 1;
        
        const status = lead.lead_status || 'new';
        leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
      });

      // Assessment metrics
      const assessments = assessmentsRes.data || [];
      const completedAssessments = assessments.filter(a => a.completed);
      const assessmentCompletionRate = assessments.length > 0 
        ? (completedAssessments.length / assessments.length) * 100 
        : 0;
      const avgAssessmentScore = completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length || 0;

      // Set analytics state
      setAnalytics({
        overview: {
          totalPageViews: pageAnalytics.length,
          uniqueVisitors: uniqueSessions,
          avgTimeOnPage: Math.round(avgTimeOnPage),
          bounceRate: Math.round(bounceRate),
          topPages,
          topReferrers
        },
        content: {
          articles: {
            totalViews: articleViews,
            avgReadTime: Math.round(avgReadTime / 60), // Convert to minutes
            topArticles: articlesRes.data || [],
            engagementRate: Math.round(engagementRate)
          },
          caseStudies: {
            totalViews: caseStudiesRes.data?.reduce((sum, cs) => sum + (cs.view_count || 0), 0) || 0,
            conversionRate: 0, // Calculate based on actual conversions
            topStudies: caseStudiesRes.data || []
          }
        },
        services: {
          totalViews: serviceViews,
          totalInquiries: serviceInquiries,
          conversionRate: Math.round(serviceConversionRate),
          topServices: servicesRes.data || [],
          byZone: Object.values(servicesByZone)
        },
        conversions: {
          leads: {
            total: leads.length,
            bySource: Object.entries(leadsBySource).map(([source, count]) => ({ source, count })),
            byStatus: Object.entries(leadsByStatus).map(([status, count]) => ({ status, count })),
            conversionRate: 0 // Calculate based on actual conversions
          },
          assessments: {
            started: assessments.length,
            completed: completedAssessments.length,
            completionRate: Math.round(assessmentCompletionRate),
            avgScore: Math.round(avgAssessmentScore)
          }
        }
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon, color = 'bg-gray-500' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading-bold uppercase">Analytics Dashboard</h1>
          <div className="flex space-x-2">
            <Select
              value={dateRange}
              onChange={setDateRange}
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
                { value: 'all', label: 'All time' }
              ]}
            />
            <Button
              variant="outline"
              onClick={fetchAnalytics}
              iconName="RefreshCw"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'content' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'services' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('conversions')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'conversions' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Conversions
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Page Views"
              value={analytics.overview.totalPageViews.toLocaleString()}
              icon="Eye"
              color="bg-blue-500"
            />
            <StatCard
              title="Unique Visitors"
              value={analytics.overview.uniqueVisitors.toLocaleString()}
              icon="Users"
              color="bg-green-500"
            />
            <StatCard
              title="Avg. Time on Page"
              value={`${analytics.overview.avgTimeOnPage}s`}
              icon="Clock"
              color="bg-purple-500"
            />
            <StatCard
              title="Bounce Rate"
              value={`${analytics.overview.bounceRate}%`}
              icon="TrendingDown"
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-heading-bold text-lg uppercase mb-4">Top Pages</h3>
              <div className="space-y-3">
                {analytics.overview.topPages.map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                      <span className="text-sm font-medium truncate">{page.path}</span>
                    </div>
                    <span className="text-sm text-gray-600">{page.views} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-heading-bold text-lg uppercase mb-4">Top Referrers</h3>
              <div className="space-y-3">
                {analytics.overview.topReferrers.map((referrer, index) => (
                  <div key={referrer.domain} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                      <span className="text-sm font-medium">{referrer.domain}</span>
                    </div>
                    <span className="text-sm text-gray-600">{referrer.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div>
          {/* Content Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Article Views"
              value={analytics.content.articles.totalViews.toLocaleString()}
              icon="FileText"
              color="bg-blue-500"
            />
            <StatCard
              title="Avg. Read Time"
              value={`${analytics.content.articles.avgReadTime} min`}
              icon="Clock"
              color="bg-green-500"
            />
            <StatCard
              title="Engagement Rate"
              value={`${analytics.content.articles.engagementRate}%`}
              icon="Heart"
              color="bg-purple-500"
            />
            <StatCard
              title="Case Study Views"
              value={analytics.content.caseStudies.totalViews.toLocaleString()}
              icon="Briefcase"
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Articles */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="font-heading-bold text-lg uppercase">Top Articles</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Likes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.content.articles.topArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium truncate">{article.title}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {article.view_count || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {article.like_count || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Case Studies */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="font-heading-bold text-lg uppercase">Top Case Studies</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Conversions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.content.caseStudies.topStudies.map((study) => (
                      <tr key={study.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium truncate">{study.title}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {study.view_count || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {study.conversion_count || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          {/* Service Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Service Views"
              value={analytics.services.totalViews.toLocaleString()}
              icon="Eye"
              color="bg-blue-500"
            />
            <StatCard
              title="Total Inquiries"
              value={analytics.services.totalInquiries.toLocaleString()}
              icon="MessageSquare"
              color="bg-green-500"
            />
            <StatCard
              title="Conversion Rate"
              value={`${analytics.services.conversionRate}%`}
              icon="TrendingUp"
              color="bg-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Services */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="font-heading-bold text-lg uppercase">Top Services</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Inquiries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.services.topServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium truncate">{service.title}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {service.view_count || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {service.inquiry_count || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Services by Zone */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-heading-bold text-lg uppercase mb-4">Performance by Zone</h3>
              <div className="space-y-4">
                {analytics.services.byZone.map((zone) => (
                  <div key={zone.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{zone.name}</span>
                      <span className="text-sm text-gray-600">
                        {zone.views} views / {zone.inquiries} inquiries
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${Math.min((zone.inquiries / zone.views) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversions Tab */}
      {activeTab === 'conversions' && (
        <div>
          {/* Conversion Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Leads"
              value={analytics.conversions.leads.total.toLocaleString()}
              icon="UserCheck"
              color="bg-blue-500"
            />
            <StatCard
              title="Assessments Started"
              value={analytics.conversions.assessments.started.toLocaleString()}
              icon="FileCheck"
              color="bg-green-500"
            />
            <StatCard
              title="Assessments Completed"
              value={analytics.conversions.assessments.completed.toLocaleString()}
              icon="CheckCircle"
              color="bg-purple-500"
            />
            <StatCard
              title="Completion Rate"
              value={`${analytics.conversions.assessments.completionRate}%`}
              icon="TrendingUp"
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads by Source */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-heading-bold text-lg uppercase mb-4">Leads by Source</h3>
              <div className="space-y-3">
                {analytics.conversions.leads.bySource.map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.source}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.count}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ 
                            width: `${(item.count / analytics.conversions.leads.total) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads by Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-heading-bold text-lg uppercase mb-4">Lead Pipeline</h3>
              <div className="space-y-3">
                {analytics.conversions.leads.byStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{item.status}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.count}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === 'won' ? 'bg-green-500' :
                            item.status === 'qualified' ? 'bg-blue-500' :
                            item.status === 'contacted' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}
                          style={{ 
                            width: `${(item.count / analytics.conversions.leads.total) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessment Insights */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="font-heading-bold text-lg uppercase mb-4">Assessment Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">
                  {analytics.conversions.assessments.avgScore}
                </p>
                <p className="text-sm text-gray-600 mt-1">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">
                  {analytics.conversions.assessments.completionRate}%
                </p>
                <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">
                  {analytics.conversions.assessments.completed}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Completed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;