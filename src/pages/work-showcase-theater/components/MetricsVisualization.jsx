import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const MetricsVisualization = React.memo(({ caseStudies }) => {
  // Aggregate metrics data - Memoized
  const { industryData, serviceTypeData, totalProjects, totalRevenue, avgGrowth } = useMemo(() => {
    const industryMap = caseStudies?.reduce((acc, study) => {
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

    const serviceMap = caseStudies?.reduce((acc, study) => {
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

    const projects = caseStudies?.length;
    const revenue = caseStudies?.reduce((sum, study) => {
      const revenueMetric = study?.keyMetrics?.find(m => m?.type === 'currency');
      return sum + (revenueMetric?.value || 0);
    }, 0);
    const growth = Math.round(
      caseStudies?.reduce((sum, study) => {
        const growthMetric = study?.keyMetrics?.find(m => m?.type === 'percentage');
        return sum + (growthMetric?.value || 0);
      }, 0) / caseStudies?.length
    );

    return {
      industryData: industryMap,
      serviceTypeData: serviceMap,
      totalProjects: projects,
      totalRevenue: revenue,
      avgGrowth: growth
    };
  }, [caseStudies]);

  const timelineData = [
    { month: 'Jan', projects: 8, revenue: 450000 },
    { month: 'Feb', projects: 12, revenue: 680000 },
    { month: 'Mar', projects: 15, revenue: 890000 },
    { month: 'Apr', projects: 18, revenue: 1200000 },
    { month: 'May', projects: 22, revenue: 1450000 },
    { month: 'Jun', projects: 25, revenue: 1680000 }
  ];

  const COLORS = ['#E53E3E', '#000000', '#6B7280', '#F59E0B', '#10B981'];

  // Custom mobile-friendly tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs sm:text-sm font-heading-regular text-gray-900 uppercase tracking-wider">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs sm:text-sm font-sans" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? `$${(entry.value / 1000).toFixed(0)}K` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Mobile responsive label formatter for pie chart
  const renderCustomLabel = ({ service, percent }) => {
    if (window.innerWidth < 640) {
      return `${(percent * 100).toFixed(0)}%`;
    }
    return `${service} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <section className="py-12 sm:py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Steelfish for Impact */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading-regular text-primary mb-3 sm:mb-4 tracking-wider uppercase">
            Our Impact in Numbers
          </h2>
          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto px-4 sm:px-0 font-sans">
            Data-driven results across industries, showcasing measurable transformations 
            and sustainable growth for our clients.
          </p>
        </div>

        {/* Key Stats - Steelfish for Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center brand-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icon name="Briefcase" size={20} className="text-accent sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">{totalProjects}+</div>
            <div className="text-xs sm:text-base text-text-secondary font-sans">Projects Completed</div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center brand-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icon name="DollarSign" size={20} className="text-accent sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">
              ${(totalRevenue / 1000000)?.toFixed(1)}M+
            </div>
            <div className="text-xs sm:text-base text-text-secondary font-sans">Revenue Generated</div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center brand-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icon name="TrendingUp" size={20} className="text-accent sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">{avgGrowth}%</div>
            <div className="text-xs sm:text-base text-text-secondary font-sans">Average Growth</div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center brand-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Icon name="Users" size={20} className="text-accent sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading-regular text-primary mb-1 sm:mb-2 uppercase tracking-wider">98%</div>
            <div className="text-xs sm:text-base text-text-secondary font-sans">Client Satisfaction</div>
          </div>
        </div>

        {/* Charts Grid - Typography Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Industry Performance */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 brand-shadow">
            <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-4 sm:mb-6 tracking-wider uppercase">Performance by Industry</h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="industry" 
                    tick={{ fontSize: 10, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    stroke="#6B7280"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    stroke="#6B7280"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgGrowth" fill="#E53E3E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 brand-shadow">
            <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-4 sm:mb-6 tracking-wider uppercase">Service Distribution</h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth < 640 ? 60 : 80}
                    dataKey="projects"
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {serviceTypeData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 brand-shadow">
          <h3 className="text-lg sm:text-xl font-heading-regular text-primary mb-4 sm:mb-6 tracking-wider uppercase">Growth Timeline (2024)</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  stroke="#6B7280"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 10, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  stroke="#6B7280"
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: 10, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  stroke="#6B7280"
                  hide={window.innerWidth < 640}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="projects" fill="#E53E3E" radius={[4, 4, 0, 0]} />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={{ fill: '#000000', strokeWidth: 1, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
});

MetricsVisualization.displayName = 'MetricsVisualization';

export default MetricsVisualization;