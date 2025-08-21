import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendAnalysis = () => {
  const [activeTab, setActiveTab] = useState('design');

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const renderChart = () => {
    if (activeTab === 'design') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={currentData?.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Line type="monotone" dataKey="minimalism" stroke="#E53E3E" strokeWidth={3} dot={{ fill: '#E53E3E', strokeWidth: 2, r: 6 }} />
            <Line type="monotone" dataKey="brutalism" stroke="#000000" strokeWidth={3} dot={{ fill: '#000000', strokeWidth: 2, r: 6 }} />
            <Line type="monotone" dataKey="glassmorphism" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} />
            <Line type="monotone" dataKey="neumorphism" stroke="#6B7280" strokeWidth={3} dot={{ fill: '#6B7280', strokeWidth: 2, r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (activeTab === 'technology') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={currentData?.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="category" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="adoption" fill="#E53E3E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="potential" fill="#000000" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={currentData?.chart} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" />
            <YAxis dataKey="behavior" type="category" stroke="#6B7280" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="percentage" fill="#E53E3E" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Trend Analysis</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-black mb-6">
            Data-Driven <span className="text-accent">Insights</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time analysis of industry trends, user behaviors, and emerging technologies to guide strategic decisions.
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center mb-12"
        >
          <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
            {tabs?.map((tab) => (
              <motion.button
                key={tab?.id}
                variants={itemVariants}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab?.id
                    ? 'bg-white text-accent shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon name={tab?.icon} size={20} />
                <span>{tab?.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Chart Section */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">{currentData?.title}</h3>
                <p className="text-gray-600">{currentData?.subtitle}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                {renderChart()}
              </div>
            </div>
          </motion.div>

          {/* Insights Panel */}
          <motion.div
            key={`insights-${activeTab}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-black rounded-2xl p-8 text-white">
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <Icon name="Zap" size={24} className="text-accent mr-2" />
                Key Insights
              </h4>
              
              <div className="space-y-4">
                {currentData?.insights?.map((insight, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{insight?.trend}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        insight?.growth?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {insight?.growth}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: insight?.confidence, 
                            backgroundColor: insight?.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">{insight?.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-6 border-accent text-accent hover:bg-accent hover:text-white"
                iconName="Download"
                iconPosition="left"
              >
                Download Report
              </Button>
            </div>

            {/* Prediction Card */}
            <div className="bg-gradient-to-br from-accent to-red-600 rounded-2xl p-8 text-white">
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <Icon name="Crystal" size={24} className="mr-2" />
                AI Prediction
              </h4>
              <p className="text-sm opacity-90 mb-4">
                Based on current data patterns, we predict the next major shift will occur in Q3 2025.
              </p>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">87%</div>
                <div className="text-sm opacity-80">Confidence Level</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrendAnalysis;