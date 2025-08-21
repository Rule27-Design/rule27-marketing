import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const MetricsVisualization = ({ caseStudies }) => {
  // Aggregate metrics data
  const industryData = caseStudies?.reduce((acc, study) => {
    const existing = acc?.find(item => item?.industry === study?.industry);
    if (existing) {
      existing.count += 1;
      existing.avgGrowth += study?.keyMetrics?.find(m => m?.type === 'percentage')?.value || 0;
    } else {
      acc?.push({
        industry: study?.industry,
        count: 1,
        avgGrowth: study?.keyMetrics?.find(m => m?.type === 'percentage')?.value || 0
      });
    }
    return acc;
  }, [])?.map(item => ({
    ...item,
    avgGrowth: Math.round(item?.avgGrowth / item?.count)
  }));

  const serviceTypeData = caseStudies?.reduce((acc, study) => {
    const existing = acc?.find(item => item?.service === study?.serviceType);
    if (existing) {
      existing.projects += 1;
    } else {
      acc?.push({
        service: study?.serviceType,
        projects: 1
      });
    }
    return acc;
  }, []);

  const timelineData = [
    { month: 'Jan', projects: 8, revenue: 450000 },
    { month: 'Feb', projects: 12, revenue: 680000 },
    { month: 'Mar', projects: 15, revenue: 890000 },
    { month: 'Apr', projects: 18, revenue: 1200000 },
    { month: 'May', projects: 22, revenue: 1450000 },
    { month: 'Jun', projects: 25, revenue: 1680000 }
  ];

  const COLORS = ['#E53E3E', '#000000', '#6B7280', '#F59E0B', '#10B981'];

  const totalProjects = caseStudies?.length;
  const totalRevenue = caseStudies?.reduce((sum, study) => {
    const revenueMetric = study?.keyMetrics?.find(m => m?.type === 'currency');
    return sum + (revenueMetric?.value || 0);
  }, 0);
  const avgGrowth = Math.round(
    caseStudies?.reduce((sum, study) => {
      const growthMetric = study?.keyMetrics?.find(m => m?.type === 'percentage');
      return sum + (growthMetric?.value || 0);
    }, 0) / caseStudies?.length
  );

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Data-driven results across industries, showcasing measurable transformations 
            and sustainable growth for our clients.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center brand-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Briefcase" size={24} className="text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">{totalProjects}+</div>
            <div className="text-text-secondary">Projects Completed</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center brand-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="DollarSign" size={24} className="text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              ${(totalRevenue / 1000000)?.toFixed(1)}M+
            </div>
            <div className="text-text-secondary">Revenue Generated</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center brand-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="TrendingUp" size={24} className="text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">{avgGrowth}%</div>
            <div className="text-text-secondary">Average Growth</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center brand-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={24} className="text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-text-secondary">Client Satisfaction</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Industry Performance */}
          <div className="bg-white rounded-2xl p-6 brand-shadow">
            <h3 className="text-xl font-bold text-primary mb-6">Performance by Industry</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="industry" 
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="avgGrowth" fill="#E53E3E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="bg-white rounded-2xl p-6 brand-shadow">
            <h3 className="text-xl font-bold text-primary mb-6">Service Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="projects"
                    label={({ service, percent }) => `${service} ${(percent * 100)?.toFixed(0)}%`}
                  >
                    {serviceTypeData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-white rounded-2xl p-6 brand-shadow">
          <h3 className="text-xl font-bold text-primary mb-6">Growth Timeline (2024)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${(value / 1000)?.toFixed(0)}K` : value,
                    name === 'revenue' ? 'Revenue' : 'Projects'
                  ]}
                />
                <Bar yAxisId="left" dataKey="projects" fill="#E53E3E" radius={[4, 4, 0, 0]} />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#000000" 
                  strokeWidth={3}
                  dot={{ fill: '#000000', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsVisualization;