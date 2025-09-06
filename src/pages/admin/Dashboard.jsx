// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const { userProfile } = useOutletContext();
  const [stats, setStats] = useState({
    articles: { total: 0, draft: 0, published: 0, pending: 0 },
    caseStudies: { total: 0, published: 0 },
    leads: { total: 0, new: 0, hot: 0 },
    services: { total: 0, active: 0 },
    loading: true
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats in parallel
      const [
        articlesRes,
        caseStudiesRes,
        leadsRes,
        servicesRes,
        pendingRes
      ] = await Promise.all([
        // Articles stats
        supabase.from('articles').select('status', { count: 'exact', head: true }),
        // Case studies stats
        supabase.from('case_studies').select('status', { count: 'exact', head: true }),
        // Leads stats
        supabase.from('contact_submissions').select('lead_status, lead_temperature', { count: 'exact' }),
        // Services stats
        supabase.from('services').select('is_active', { count: 'exact' }),
        // Pending approvals
        supabase
          .from('articles')
          .select('id, title, author_id, submitted_for_approval_at')
          .eq('status', 'pending_approval')
          .order('submitted_for_approval_at', { ascending: false })
          .limit(5)
      ]);

      // Calculate article stats
      const { count: totalArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      const { count: draftArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');
      
      const { count: publishedArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
      
      const { count: pendingArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_approval');

      // Calculate case study stats
      const { count: totalCaseStudies } = await supabase
        .from('case_studies')
        .select('*', { count: 'exact', head: true });
      
      const { count: publishedCaseStudies } = await supabase
        .from('case_studies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Calculate lead stats
      const { data: leadsData } = leadsRes;
      const newLeads = leadsData?.filter(l => l.lead_status === 'new').length || 0;
      const hotLeads = leadsData?.filter(l => l.lead_temperature === 'hot').length || 0;

      // Calculate service stats
      const { count: totalServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });
      
      const { count: activeServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        articles: {
          total: totalArticles || 0,
          draft: draftArticles || 0,
          published: publishedArticles || 0,
          pending: pendingArticles || 0
        },
        caseStudies: {
          total: totalCaseStudies || 0,
          published: publishedCaseStudies || 0
        },
        leads: {
          total: leadsData?.length || 0,
          new: newLeads,
          hot: hotLeads
        },
        services: {
          total: totalServices || 0,
          active: activeServices || 0
        },
        loading: false
      });

      setPendingApprovals(pendingRes.data || []);

      // Fetch recent activity
      const { data: recentArticles } = await supabase
        .from('articles')
        .select('id, title, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);

      setRecentActivity(recentArticles || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.articles.total,
      icon: 'FileText',
      color: 'bg-blue-500',
      link: '/admin/articles',
      detail: `${stats.articles.published} published`
    },
    {
      title: 'Case Studies',
      value: stats.caseStudies.total,
      icon: 'Briefcase',
      color: 'bg-green-500',
      link: '/admin/case-studies',
      detail: `${stats.caseStudies.published} published`
    },
    {
      title: 'Leads',
      value: stats.leads.total,
      icon: 'UserCheck',
      color: 'bg-purple-500',
      link: '/admin/leads',
      detail: `${stats.leads.new} new, ${stats.leads.hot} hot`
    },
    {
      title: 'Services',
      value: stats.services.total,
      icon: 'Zap',
      color: 'bg-orange-500',
      link: '/admin/services',
      detail: `${stats.services.active} active`
    }
  ];

  const quickActions = [
    { label: 'New Article', icon: 'FileText', link: '/admin/articles?action=new' },
    { label: 'New Case Study', icon: 'Briefcase', link: '/admin/case-studies?action=new' },
    { label: 'Add Service', icon: 'Plus', link: '/admin/services?action=new' },
    { label: 'View Analytics', icon: 'TrendingUp', link: '/admin/analytics' }
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading-bold uppercase">
              Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Admin'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with Rule27 Design today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Role: <span className="font-medium uppercase">{userProfile?.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <Icon name={stat.icon} size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-heading-bold uppercase mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon name={action.icon} size={24} className="text-accent mb-2" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        {userProfile?.role === 'admin' && pendingApprovals.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading-bold uppercase">Pending Approvals</h2>
              <Link to="/admin/articles?filter=pending_approval" className="text-accent text-sm hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {new Date(item.submitted_for_approval_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `/admin/articles?id=${item.id}&action=review`}
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading-bold uppercase">Recent Activity</h2>
            <Link to="/admin/articles" className="text-accent text-sm hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <Icon name="FileText" size={20} className="text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    Status: <span className={`font-medium ${
                      item.status === 'published' ? 'text-green-600' :
                      item.status === 'pending_approval' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>{item.status}</span>
                    {' • '}
                    {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;