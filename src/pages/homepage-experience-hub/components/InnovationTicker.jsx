import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const InnovationTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const innovations = [
    {
      id: 1,
      type: 'award',
      icon: 'Award',
      title: 'Best Creative Agency 2024',
      description: 'Recognized by Design Excellence Awards for outstanding creative innovation',
      date: '2024-08-15',
      category: 'Recognition',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 2,
      type: 'achievement',
      icon: 'TrendingUp',
      title: '500% Client Growth Rate',
      description: 'Average revenue increase achieved across our client portfolio this quarter',
      date: '2024-08-10',
      category: 'Performance',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'innovation',
      icon: 'Lightbulb',
      title: 'AI-Powered Design System',
      description: 'Launched proprietary AI tool that reduces design iteration time by 60%',
      date: '2024-08-05',
      category: 'Technology',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      type: 'partnership',
      icon: 'Handshake',
      title: 'Strategic Partnership with Adobe',
      description: 'Exclusive collaboration to develop next-generation creative workflows',
      date: '2024-07-28',
      category: 'Partnership',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 5,
      type: 'thought-leadership',
      icon: 'BookOpen',
      title: 'Published "Future of Brand Design"',
      description: 'Industry whitepaper downloaded 1,000+ times in first week',
      date: '2024-07-20',
      category: 'Thought Leadership',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 6,
      type: 'client-success',
      icon: 'Target',
      title: 'Client Achieves Unicorn Status',
      description: 'TechFlow Solutions reaches $1B valuation after our complete rebrand',
      date: '2024-07-15',
      category: 'Client Success',
      color: 'text-accent',
      bgColor: 'bg-red-50'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.innovation-ticker');
    if (element) observer?.observe(element);

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % innovations?.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible, innovations?.length]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="innovation-ticker py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            <span className="text-accent font-semibold uppercase tracking-wide text-sm">
              Live Innovation Feed
            </span>
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real-Time Excellence Updates
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay connected to our latest achievements, innovations, and industry recognition 
            as we continue pushing creative boundaries.
          </p>
        </div>

        {/* Main Ticker Display */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Current Innovation */}
              <div className="md:col-span-2">
                <div className="flex items-start space-x-4">
                  <div className={`${innovations?.[currentIndex]?.bgColor} p-3 rounded-lg flex-shrink-0`}>
                    <Icon 
                      name={innovations?.[currentIndex]?.icon} 
                      size={24} 
                      className={innovations?.[currentIndex]?.color}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`${innovations?.[currentIndex]?.color} font-semibold text-sm uppercase tracking-wide`}>
                        {innovations?.[currentIndex]?.category}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatDate(innovations?.[currentIndex]?.date)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {innovations?.[currentIndex]?.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {innovations?.[currentIndex]?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex md:flex-col justify-center space-x-2 md:space-x-0 md:space-y-2">
                {innovations?.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 md:h-2 w-8 md:w-full rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-accent'
                        : index < currentIndex
                        ? 'bg-accent/50' :'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mini Ticker Strip */}
          <div className="relative overflow-hidden bg-accent/10 rounded-lg p-4 mb-8">
            <div className="flex animate-marquee space-x-8">
              {[...innovations, ...innovations]?.map((item, index) => (
                <div key={`${item?.id}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
                  <Icon name={item?.icon} size={16} className="text-accent" />
                  <span className="text-white font-medium">{item?.title}</span>
                  <span className="text-gray-400">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-accent mb-1">25+</div>
              <div className="text-gray-300 text-sm">Awards Won</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-accent mb-1">500%</div>
              <div className="text-gray-300 text-sm">Avg Growth</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-accent mb-1">150+</div>
              <div className="text-gray-300 text-sm">Projects</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-accent mb-1">98%</div>
              <div className="text-gray-300 text-sm">Satisfaction</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link to="/innovation-laboratory">
              <button className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto">
                <Icon name="Lightbulb" size={20} />
                <span>Explore Innovation Lab</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Custom CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default InnovationTicker;