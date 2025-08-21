import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExperimentalFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 1,
      title: "AI Brand Analysis Engine",
      description: "Advanced machine learning algorithms analyze brand positioning, competitive landscape, and market opportunities in real-time.",
      status: "Live Beta",
      category: "Artificial Intelligence",
      icon: "Brain",
      metrics: {
        accuracy: "94.7%",
        speed: "2.3s",
        insights: "127"
      },
      preview: "Upload your brand assets and get instant competitive analysis with actionable recommendations.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Interactive Design System Generator",
      description: "Automatically generates comprehensive design systems based on brand guidelines and user preferences.",
      status: "Alpha Testing",
      category: "Design Automation",
      icon: "Palette",
      metrics: {
        components: "200+",
        variants: "1,500+",
        themes: "50+"
      },
      preview: "Input your brand colors and typography to generate a complete design system with components.",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Real-time Trend Tracker",
      description: "Monitors global design trends, social media patterns, and emerging technologies to predict future directions.",
      status: "Production",
      category: "Trend Analysis",
      icon: "TrendingUp",
      metrics: {
        sources: "10K+",
        updates: "Real-time",
        predictions: "85% accurate"
      },
      preview: "Track emerging design trends and get predictions for the next 6-12 months.",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "Performance Optimization Lab",
      description: "Advanced testing environment for website performance, accessibility, and user experience optimization.",
      status: "Beta",
      category: "Performance",
      icon: "Zap",
      metrics: {
        tests: "500+",
        improvements: "40% avg",
        compliance: "100%"
      },
      preview: "Comprehensive performance analysis with automated optimization recommendations.",
      color: "from-orange-500 to-red-500"
    }
  ];

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

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Icon name="Flask" size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Experimental Features</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-black mb-6">
            Innovation in <span className="text-accent">Action</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cutting-edge tools and technologies that push the boundaries of what's possible in digital design and development.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Feature List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features?.map((feature, index) => (
              <motion.div
                key={feature?.id}
                variants={itemVariants}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? 'border-accent bg-white shadow-xl'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature?.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={feature?.icon} size={24} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-black">{feature?.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feature?.status === 'Production' ? 'bg-green-100 text-green-800' :
                        feature?.status === 'Live Beta' ? 'bg-blue-100 text-blue-800' :
                        feature?.status === 'Beta'? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feature?.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{feature?.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{feature?.category}</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} />
                        <span>Active Users: {Math.floor(Math.random() * 1000) + 500}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-8"
          >
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
              {/* Preview Header */}
              <div className={`h-2 bg-gradient-to-r ${features?.[activeFeature]?.color}`}></div>
              
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${features?.[activeFeature]?.color} flex items-center justify-center`}>
                    <Icon name={features?.[activeFeature]?.icon} size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black">{features?.[activeFeature]?.title}</h3>
                    <p className="text-gray-600">{features?.[activeFeature]?.category}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  {features?.[activeFeature]?.preview}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {Object.entries(features?.[activeFeature]?.metrics)?.map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-accent mb-1">{value}</div>
                      <div className="text-sm text-gray-600 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="default"
                    className="bg-accent hover:bg-accent/90 text-white flex-1"
                    iconName="Play"
                    iconPosition="left"
                  >
                    Try Demo
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
                    iconName="BookOpen"
                    iconPosition="left"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperimentalFeatures;