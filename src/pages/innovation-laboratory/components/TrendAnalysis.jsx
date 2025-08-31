import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendAnalysis = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const trendData = {
    design: {
      title: "Design Trends 2025",
      subtitle: "Visual design patterns shaping the future",
      chart: [
        { month: 'Jan', minimalism: 85, brutalism: 45, glassmorphism: 65, neumorphism: 35 },
        { month: 'Feb', minimalism: 88, brutalism: 52, glassmorphism: 70, neumorphism: 32 },
        { month: 'Mar', minimalism: 92, brutalism: 58, glassmorphism: 75, neumorphism: 28 },
        { month: 'Apr', minimalism: 95, brutalism: 65, glassmorphism: 80, neumorphism: 25 },
        { month: 'May', minimalism: 97, brutalism: 72, glassmorphism: 85, neumorphism: 22 },
        { month: 'Jun', minimalism: 98, brutalism: 78, glassmorphism: 88, neumorphism: 20 }
      ],
      insights: [
        { trend: "Minimalism", growth: "+15%", confidence: "98%", color: "#E53E3E" },
        { trend: "Brutalism", growth: "+73%", confidence: "85%", color: "#000000" },
        { trend: "Glassmorphism", growth: "+35%", confidence: "92%", color: "#3B82F6" },
        { trend: "Neumorphism", growth: "-43%", confidence: "89%", color: "#6B7280" }
      ]
    },
    technology: {
      title: "Technology Adoption",
      subtitle: "Emerging technologies in web development",
      chart: [
        { category: 'AI/ML', adoption: 78, potential: 95 },
        { category: 'WebAssembly', adoption: 45, potential: 85 },
        { category: 'Web3', adoption: 32, potential: 70 },
        { category: 'AR/VR', adoption: 28, potential: 88 },
        { category: 'IoT', adoption: 55, potential: 75 },
        { category: 'Edge Computing', adoption: 42, potential: 90 }
      ],
      insights: [
        { trend: "AI Integration", growth: "+156%", confidence: "96%", color: "#E53E3E" },
        { trend: "WebAssembly", growth: "+89%", confidence: "78%", color: "#000000" },
        { trend: "Progressive Web Apps", growth: "+67%", confidence: "91%", color: "#3B82F6" },
        { trend: "Serverless Architecture", growth: "+124%", confidence: "87%", color: "#10B981" }
      ]
    },
    user: {
      title: "User Behavior Patterns",
      subtitle: "How users interact with digital products",
      chart: [
        { behavior: 'Mobile First', percentage: 78 },
        { behavior: 'Voice Search', percentage: 45 },
        { behavior: 'Dark Mode', percentage: 67 },
        { behavior: 'Micro-interactions', percentage: 89 },
        { behavior: 'Personalization', percentage: 92 },
        { behavior: 'Accessibility', percentage: 85 }
      ],
      insights: [
        { trend: "Mobile Usage", growth: "+23%", confidence: "99%", color: "#E53E3E" },
        { trend: "Voice Interactions", growth: "+145%", confidence: "82%", color: "#000000" },
        { trend: "Dark Mode Preference", growth: "+78%", confidence: "94%", color: "#3B82F6" },
        { trend: "Accessibility Focus", growth: "+67%", confidence: "88%", color: "#10B981" }
      ]
    }
  };

  const tabs = [
    { id: 'design', label: 'Design Trends', icon: 'Palette' },
    { id: 'technology', label: 'Technology', icon: 'Cpu' },
    { id: 'user', label: 'User Behavior', icon: 'Users' }
  ];

  const currentData = trendData?.[activeTab];

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const renderChart = () => {
    if (activeTab === 'design') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentData?.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }} 
            />
            <Line type="monotone" dataKey="minimalism" stroke="#E53E3E" strokeWidth={2} dot={{ fill: '#E53E3E', strokeWidth: 1, r: 3 }} />
            <Line type="monotone" dataKey="brutalism" stroke="#000000" strokeWidth={2} dot={{ fill: '#000000', strokeWidth: 1, r: 3 }} />
            <Line type="monotone" dataKey="glassmorphism" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 1, r: 3 }} />
            <Line type="monotone" dataKey="neumorphism" stroke="#6B7280" strokeWidth={2} dot={{ fill: '#6B7280', strokeWidth: 1, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (activeTab === 'technology') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentData?.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="category" stroke="#6B7280" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
            <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }} 
            />
            <Bar dataKey="adoption" fill="#E53E3E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="potential" fill="#000000" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentData?.chart} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" tick={{ fontSize: 12 }} />
            <YAxis dataKey="behavior" type="category" stroke="#6B7280" width={80} tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }} 
            />
            <Bar dataKey="percentage" fill="#E53E3E" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center justify-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 mx-auto">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-accent font-body font-medium text-xs sm:text-sm">Trend Analysis</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold text-black mb-4 sm:mb-6 text-center tracking-wider uppercase">
            Data-Driven <span className="text-accent">Insights</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 text-center font-body">
            Real-time analysis of industry trends, user behaviors, and emerging technologies to guide strategic decisions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex justify-center mb-8 sm:mb-12 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gray-100 rounded-2xl p-1 sm:p-2 inline-flex overflow-x-auto max-w-full justify-center">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-body font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-white text-accent shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon name={tab?.icon} size={16} className="sm:hidden" />
                <Icon name={tab?.icon} size={20} className="hidden sm:block" />
                <span className="text-xs sm:text-base">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {/* Chart Section */}
          <div className={`lg:col-span-2 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6 md:mb-8">
                <h3 className="text-xl sm:text-2xl font-heading-bold text-black mb-2 tracking-wider uppercase">{currentData?.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 font-body">{currentData?.subtitle}</p>
              </div>
              
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 overflow-x-auto">
                {renderChart()}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className={`space-y-4 sm:space-y-6 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="bg-black rounded-2xl p-6 sm:p-8 text-white">
              <h4 className="text-lg sm:text-xl font-heading-bold mb-4 sm:mb-6 flex items-center tracking-wider uppercase">
                <Icon name="Zap" size={20} className="text-accent mr-2 sm:hidden" />
                <Icon name="Zap" size={24} className="text-accent mr-2 hidden sm:block" />
                Key Insights
              </h4>
              
              <div className="space-y-3 sm:space-y-4">
                {currentData?.insights?.map((insight, index) => (
                  <div key={index} className="border-b border-gray-700 pb-3 sm:pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body font-medium text-sm sm:text-base">{insight?.trend}</span>
                      <span className={`text-xs sm:text-sm px-2 py-0.5 sm:py-1 rounded font-heading-regular tracking-wider ${
                        insight?.growth?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {insight?.growth}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="h-1.5 sm:h-2 rounded-full"
                          style={{ 
                            width: insight?.confidence, 
                            backgroundColor: insight?.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-400 font-body">{insight?.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4 sm:mt-6 border-accent text-accent hover:bg-accent hover:text-white text-sm sm:text-base"
                iconName="Download"
                iconPosition="left"
              >
                <span className="font-heading-regular tracking-wider uppercase">Download Report</span>
              </Button>
            </div>

            {/* Prediction Card */}
            <div className="bg-gradient-to-br from-accent to-red-600 rounded-2xl p-6 sm:p-8 text-white">
              <h4 className="text-lg sm:text-xl font-heading-bold mb-3 sm:mb-4 flex items-center tracking-wider uppercase">
                <Icon name="Sparkles" size={20} className="mr-2 sm:hidden" />
                <Icon name="Sparkles" size={24} className="mr-2 hidden sm:block" />
                AI Prediction
              </h4>
              <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 font-body">
                Based on current data patterns, we predict the next major shift will occur in Q3 2025.
              </p>
              <div className="bg-white/20 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-heading-bold mb-1 tracking-wider">87%</div>
                <div className="text-xs sm:text-sm opacity-80 font-body">Confidence Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendAnalysis;