import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ThoughtLeadership = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const categories = [
    { id: 'all', label: 'All Content', icon: 'Grid' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' },
    { id: 'methodology', label: 'Methodology', icon: 'Settings' },
    { id: 'case-studies', label: 'Case Studies', icon: 'FileText' },
    { id: 'predictions', label: 'Predictions', icon: 'Sparkles' }
  ];

  const content = [
    {
      id: 1,
      category: 'trends',
      type: 'Article',
      title: "The Death of Traditional Web Design: Why Brutalism is Taking Over",
      excerpt: `The design world is witnessing a seismic shift away from polished minimalism toward raw, uncompromising brutalist aesthetics. This isn't just a trend—it's a rebellion against the homogenization of digital experiences.\n\nOur analysis of 10,000+ websites shows a 73% increase in brutalist design elements over the past 18 months.`,
      author: "Sarah Chen",
      role: "Creative Director",
      readTime: "8 min read",
      publishDate: "2025-01-15",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
      tags: ["Design Trends", "Brutalism", "Web Design"],
      engagement: { views: "12.5K", shares: "847", comments: "156" }
    },
    {
      id: 2,
      category: 'methodology',
      type: 'Deep Dive',
      title: "The Rule27 Design Method: How We Achieve 40% Higher Conversion Rates",
      excerpt: `After analyzing 500+ projects, we've identified the exact methodology that consistently delivers exceptional results. This isn't theory—it's battle-tested strategy.\n\nOur proprietary approach combines behavioral psychology, data science, and creative audacity to create experiences that don't just look good—they perform.`,
      author: "Marcus Rodriguez",
      role: "Strategy Lead",
      readTime: "12 min read",
      publishDate: "2025-01-10",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      tags: ["Methodology", "Conversion", "Strategy"],
      engagement: { views: "8.9K", shares: "623", comments: "89" }
    },
    {
      id: 3,
      category: 'predictions',
      type: 'Forecast',
      title: "2025 Predictions: The Technologies That Will Reshape Digital",
      excerpt: `Based on our analysis of emerging technologies and market signals, we're making bold predictions about what will dominate the digital landscape in 2025.\n\nFrom AI-powered design systems to quantum computing interfaces, the future is arriving faster than most realize.`,
      author: "Dr. Alex Kim",
      role: "Innovation Lead",
      readTime: "15 min read",
      publishDate: "2025-01-05",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
      tags: ["Predictions", "Technology", "Future"],
      engagement: { views: "15.2K", shares: "1.2K", comments: "234" }
    },
    {
      id: 4,
      category: 'case-studies',
      type: 'Case Study',
      title: "How We Increased TechCorp's Revenue by 300% in 6 Months",
      excerpt: `A complete breakdown of our most successful transformation project. From initial audit to final results, we share every strategy, challenge, and breakthrough.\n\nThis case study reveals the exact tactics we used to triple revenue while reducing customer acquisition costs by 45%.`,
      author: "Jennifer Walsh",
      role: "Account Director",
      readTime: "10 min read",
      publishDate: "2024-12-28",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      tags: ["Case Study", "Revenue Growth", "Transformation"],
      engagement: { views: "22.1K", shares: "1.8K", comments: "312" }
    },
    {
      id: 5,
      category: 'trends',
      type: 'Analysis',
      title: "The Rise of Micro-Interactions: Why Small Details Drive Big Results",
      excerpt: `Our research into user behavior reveals that micro-interactions can increase engagement by up to 67%. Here's how to implement them strategically.\n\nWe analyzed 1,000+ websites to identify the micro-interactions that create the most impact on user experience and conversion rates.`,
      author: "David Park",
      role: "UX Research Lead",
      readTime: "7 min read",
      publishDate: "2024-12-20",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
      tags: ["UX Design", "Micro-interactions", "User Behavior"],
      engagement: { views: "9.7K", shares: "542", comments: "78" }
    },
    {
      id: 6,
      category: 'methodology',
      type: 'Framework',
      title: "The Psychology of Color in Digital Experiences: A Data-Driven Approach",
      excerpt: `Color isn't just aesthetic—it's psychological warfare. Our comprehensive study of color psychology in digital interfaces reveals surprising insights.\n\nBased on A/B testing 50,000+ users, we've identified the exact color combinations that drive action and build trust.`,
      author: "Lisa Thompson",
      role: "Design Psychology Expert",
      readTime: "11 min read",
      publishDate: "2024-12-15",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop",
      tags: ["Color Psychology", "Design", "Conversion"],
      engagement: { views: "13.4K", shares: "891", comments: "167" }
    }
  ];

  const filteredContent = activeCategory === 'all' 
    ? content 
    : content?.filter(item => item?.category === activeCategory);

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

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center justify-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 mx-auto">
            <Icon name="BookOpen" size={16} className="text-accent" />
            <span className="text-accent font-body font-medium text-xs sm:text-sm">Thought Leadership</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold text-black mb-4 sm:mb-6 text-center tracking-wider uppercase">
            Industry <span className="text-accent">Insights</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 text-center font-body">
            Deep-dive analysis, strategic frameworks, and forward-thinking perspectives that shape the future of digital experiences.
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center mb-8 sm:mb-12 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gray-100 rounded-2xl p-1 sm:p-2 inline-flex flex-wrap max-w-full overflow-x-auto justify-center">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => setActiveCategory(category?.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl font-body font-medium transition-all duration-300 m-0.5 sm:m-1 whitespace-nowrap ${
                  activeCategory === category?.id
                    ? 'bg-white text-accent shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon name={category?.icon} size={14} className="sm:hidden" />
                <Icon name={category?.icon} size={16} className="hidden sm:block" />
                <span className="text-xs sm:text-base">{category?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {filteredContent?.map((item, index) => (
            <article
              key={item?.id}
              className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 100 + 600}ms`
              }}
            >
              {/* Article Image */}
              <div className="relative overflow-hidden h-40 sm:h-48">
                <Image
                  src={item?.image}
                  alt={item?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="bg-black/80 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-body font-medium">
                    {item?.type}
                  </span>
                </div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                    <Icon name="Bookmark" size={14} className="text-gray-600 sm:hidden" />
                    <Icon name="Bookmark" size={16} className="text-gray-600 hidden sm:block" />
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-4 sm:p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                  {item?.tags?.slice(0, 2)?.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 sm:py-1 rounded text-xs font-body">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-xl font-heading-regular text-black mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300 tracking-wider uppercase">
                  {item?.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3 font-body">
                  {item?.excerpt?.split('\n')?.[0]}
                </p>

                {/* Author & Meta */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-accent to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] sm:text-xs font-heading-regular">
                        {item?.author?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-body font-medium text-black">{item?.author}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 font-body">{item?.role}</div>
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-body">
                    {item?.readTime}
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4 font-body">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="Eye" size={10} className="sm:hidden" />
                      <Icon name="Eye" size={12} className="hidden sm:block" />
                      <span className="font-heading-regular tracking-wider">{item?.engagement?.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Share" size={10} className="sm:hidden" />
                      <Icon name="Share" size={12} className="hidden sm:block" />
                      <span className="font-heading-regular tracking-wider">{item?.engagement?.shares}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={10} className="sm:hidden" />
                      <Icon name="MessageCircle" size={12} className="hidden sm:block" />
                      <span className="font-heading-regular tracking-wider">{item?.engagement?.comments}</span>
                    </span>
                  </div>
                  <span>{new Date(item.publishDate)?.toLocaleDateString()}</span>
                </div>

                {/* Read More Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-300 text-gray-700 hover:border-accent hover:text-accent text-xs sm:text-sm"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  <span className="font-heading-regular tracking-wider uppercase">Read Full Article</span>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className={`text-center mt-8 sm:mt-12 transition-all duration-700 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-white px-6 sm:px-8"
            iconName="Plus"
            iconPosition="left"
          >
            <span className="font-heading-regular tracking-wider uppercase">Load More Articles</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ThoughtLeadership;