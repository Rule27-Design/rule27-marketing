import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import ArticleHeroSection from './components/ArticleHeroSection';
import ArticleFilterBar from './components/ArticleFilterBar';
import ArticleCard from './components/ArticleCard';
import ArticleListItem from './components/ArticleListItem';
import ArticleModal from './components/ArticleModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ArticlesHub = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('articleViewMode') || 'grid';
    }
    return 'grid';
  });
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    topic: [],
    readTime: []
  });

  // Save view mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('articleViewMode', viewMode);
    }
  }, [viewMode]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample articles data
  const articles = [
    {
      id: 1,
      title: "The Psychology of Color in Brand Design: What Your Palette Says About You",
      slug: "psychology-color-brand-design",
      excerpt: "Discover how color choices influence consumer perception and behavior, and learn to craft palettes that resonate with your target audience's deepest psychological triggers.",
      content: `Color is more than aesthetics—it's a powerful psychological tool that can make or break your brand's connection with its audience. In this comprehensive guide, we explore the science behind color psychology and how to leverage it for maximum brand impact...`,
      author: {
        name: "Sarah Chen",
        role: "Creative Director",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      category: "Design",
      topics: ["Brand Strategy", "Visual Identity", "Psychology"],
      featuredImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-28",
      readTime: 8,
      featured: true,
      views: 15420,
      likes: 892,
      keyTakeaways: [
        "Red increases urgency and appetite—perfect for food and retail brands",
        "Blue builds trust and reliability—ideal for financial and healthcare",
        "Green signals growth and wellness—great for eco and health brands",
        "Black conveys luxury and sophistication—premium brand essential"
      ],
      relatedLinks: [
        { title: "Color Theory Fundamentals", url: "#" },
        { title: "Brand Identity Guidelines", url: "#" }
      ]
    },
    {
      id: 2,
      title: "Microinteractions That Convert: The Secret to Addictive UX",
      slug: "microinteractions-convert-ux",
      excerpt: "Learn how tiny animations and feedback loops can transform your user experience from functional to unforgettable, driving engagement and conversions through the roof.",
      content: `Microinteractions are the unsung heroes of great UX design. These small, functional animations provide feedback, guide tasks, and inject personality into your digital products...`,
      author: {
        name: "Marcus Rodriguez",
        role: "UX Lead",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      category: "Development",
      topics: ["UX Design", "Web Development", "Conversion"],
      featuredImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-25",
      readTime: 6,
      featured: true,
      views: 12330,
      likes: 743,
      keyTakeaways: [
        "Loading animations reduce perceived wait time by 40%",
        "Hover effects increase click-through rates by 23%",
        "Success animations boost user satisfaction scores",
        "Subtle transitions create seamless user flow"
      ],
      codeSnippets: true,
      demoLink: "https://codepen.io/example"
    },
    {
      id: 3,
      title: "AI-Powered Marketing: Beyond the Hype to Real ROI",
      slug: "ai-powered-marketing-roi",
      excerpt: "Cut through the AI buzz and discover practical applications that actually move the needle on your marketing metrics, with real case studies and implementation strategies.",
      content: `Artificial Intelligence in marketing isn't just buzzword bingo—it's delivering measurable results for brands willing to move beyond the hype...`,
      author: {
        name: "Jennifer Walsh",
        role: "Marketing Strategy Director",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      category: "Marketing",
      topics: ["AI", "Digital Marketing", "Analytics"],
      featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-22",
      readTime: 10,
      featured: true,
      views: 18920,
      likes: 1205,
      statistics: {
        avgROIIncrease: "340%",
        timesSaved: "65%",
        accuracyImprovement: "89%"
      },
      caseStudies: [
        "E-commerce personalization increasing conversions 45%",
        "Predictive analytics reducing ad spend by 30%",
        "Chatbots handling 80% of customer inquiries"
      ]
    },
    {
      id: 4,
      title: "Mobile-First Design: Why Desktop is Dead (And How to Adapt)",
      slug: "mobile-first-design-desktop-dead",
      excerpt: "The mobile revolution isn't coming—it's here. Learn why mobile-first design is non-negotiable and how to create experiences that thrive on small screens.",
      content: `With 70% of web traffic now coming from mobile devices, designing for desktop first is like preparing for yesterday's war...`,
      author: {
        name: "David Kim",
        role: "Technical Lead",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg"
      },
      category: "Design",
      topics: ["Mobile Design", "Responsive Design", "UX"],
      featuredImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-20",
      readTime: 7,
      featured: false,
      views: 9840,
      likes: 567,
      keyTakeaways: [
        "Start with 320px viewport and scale up",
        "Prioritize thumb-friendly navigation zones",
        "Optimize for one-handed operation",
        "Performance is a design feature, not an afterthought"
      ]
    },
    {
      id: 5,
      title: "The $100K Landing Page: Anatomy of Conversions That Print Money",
      slug: "100k-landing-page-conversions",
      excerpt: "Dissecting high-converting landing pages that generate six figures monthly, with teardowns of real pages and the psychology behind their success.",
      content: `What separates a landing page that converts at 2% from one that converts at 20%? We analyzed 500+ high-performing pages to find out...`,
      author: {
        name: "Lisa Park",
        role: "Conversion Specialist",
        avatar: "https://randomuser.me/api/portraits/women/55.jpg"
      },
      category: "Marketing",
      topics: ["Conversion Optimization", "Landing Pages", "A/B Testing"],
      featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-18",
      readTime: 12,
      featured: false,
      views: 22100,
      likes: 1876,
      conversionTips: [
        "Headlines that speak to pain points convert 2.5x better",
        "Social proof above the fold increases trust by 40%",
        "Single CTA buttons outperform multiple by 67%",
        "Video backgrounds decrease conversions by 23%"
      ],
      templates: true
    },
    {
      id: 6,
      title: "Design Systems at Scale: Building Consistency Across 1000+ Components",
      slug: "design-systems-scale",
      excerpt: "How top tech companies maintain design consistency across massive product ecosystems, and how you can implement their strategies regardless of your size.",
      content: `Design systems aren't just for Google and Apple. Any team can benefit from the consistency, efficiency, and scalability they provide...`,
      author: {
        name: "Alex Thompson",
        role: "Design Systems Architect",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg"
      },
      category: "Development",
      topics: ["Design Systems", "Component Libraries", "Scalability"],
      featuredImage: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-15",
      readTime: 15,
      featured: false,
      views: 8920,
      likes: 445,
      resources: [
        "Component documentation template",
        "Token naming convention guide",
        "Figma to code workflow automation"
      ]
    },
    {
      id: 7,
      title: "The Death of Stock Photos: Why Authentic Imagery Wins Every Time",
      slug: "death-stock-photos-authentic-imagery",
      excerpt: "Generic stock photos are killing your brand's authenticity. Discover why real imagery converts better and how to create it without breaking the bank.",
      content: `That perfectly lit, overly enthusiastic businessman shaking hands? Your audience sees right through it. Here's why authenticity beats polish...`,
      author: {
        name: "Maria Santos",
        role: "Brand Photographer",
        avatar: "https://randomuser.me/api/portraits/women/82.jpg"
      },
      category: "Design",
      topics: ["Photography", "Brand Authenticity", "Visual Content"],
      featuredImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-12",
      readTime: 5,
      featured: false,
      views: 7650,
      likes: 423,
      photographyTips: [
        "Behind-the-scenes shots build trust",
        "Real employees over models increase relatability",
        "Imperfect moments feel more genuine",
        "User-generated content outperforms professional shoots"
      ]
    },
    {
      id: 8,
      title: "Performance Marketing Secrets: What $10M in Ad Spend Taught Us",
      slug: "performance-marketing-secrets-10m-ad-spend",
      excerpt: "Raw lessons from managing eight-figure ad budgets across every major platform. No theory, just battle-tested strategies that actually work.",
      content: `After burning through millions in ad spend (some wisely, some not), we've distilled our hard-won lessons into actionable insights...`,
      author: {
        name: "James Wilson",
        role: "Head of Paid Media",
        avatar: "https://randomuser.me/api/portraits/men/56.jpg"
      },
      category: "Marketing",
      topics: ["Paid Advertising", "ROI", "Campaign Strategy"],
      featuredImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-10",
      readTime: 9,
      featured: false,
      views: 16800,
      likes: 998,
      adMetrics: {
        avgCPCReduction: "45%",
        ROASImprovement: "280%",
        conversionRateUplift: "156%"
      }
    },
    {
      id: 9,
      title: "Typography That Sells: The Hidden Psychology of Font Choices",
      slug: "typography-sells-psychology-fonts",
      excerpt: "Your font choices are silently influencing buying decisions. Uncover the psychological triggers behind typography and how to weaponize them for conversions.",
      content: `Typography isn't just about readability—it's about emotion, trust, and ultimately, sales. Here's how to choose fonts that convert...`,
      author: {
        name: "Rachel Green",
        role: "Typography Specialist",
        avatar: "https://randomuser.me/api/portraits/women/90.jpg"
      },
      category: "Design",
      topics: ["Typography", "Brand Psychology", "Web Design"],
      featuredImage: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=1200&h=600&fit=crop",
      publishedDate: "2024-08-08",
      readTime: 6,
      featured: false,
      views: 11200,
      likes: 667,
      fontPairings: [
        { heading: "Playfair Display", body: "Source Sans Pro", vibe: "Editorial elegance" },
        { heading: "Montserrat", body: "Open Sans", vibe: "Modern tech" },
        { heading: "Bebas Neue", body: "Roboto", vibe: "Bold impact" }
      ]
    }
  ];

  // Filter options
  const filters = {
    categories: [...new Set(articles.map(article => article.category))],
    topics: [...new Set(articles.flatMap(article => article.topics))],
    readTimes: ['< 5 min', '5-10 min', '> 10 min']
  };

  // Featured articles for hero section
  const featuredArticles = articles?.filter(article => article?.featured);

  // Filter and sort articles
  const filteredArticles = articles?.filter(article => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery?.toLowerCase();
      const matchesSearch = 
        article?.title?.toLowerCase()?.includes(searchLower) ||
        article?.excerpt?.toLowerCase()?.includes(searchLower) ||
        article?.category?.toLowerCase()?.includes(searchLower) ||
        article?.topics?.some(topic => topic?.toLowerCase()?.includes(searchLower)) ||
        article?.author?.name?.toLowerCase()?.includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Category filters
    if (activeFilters?.category?.length > 0 && !activeFilters?.category?.includes(article?.category)) {
      return false;
    }
    
    // Topic filters
    if (activeFilters?.topic?.length > 0) {
      const hasMatchingTopic = article?.topics?.some(topic => activeFilters?.topic?.includes(topic));
      if (!hasMatchingTopic) return false;
    }
    
    // Read time filters
    if (activeFilters?.readTime?.length > 0) {
      const readTimeMatch = activeFilters?.readTime?.some(filter => {
        if (filter === '< 5 min') return article?.readTime < 5;
        if (filter === '5-10 min') return article?.readTime >= 5 && article?.readTime <= 10;
        if (filter === '> 10 min') return article?.readTime > 10;
        return false;
      });
      if (!readTimeMatch) return false;
    }

    return true;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b?.publishedDate) - new Date(a?.publishedDate);
      case 'oldest':
        return new Date(a?.publishedDate) - new Date(b?.publishedDate);
      case 'popular':
        return b?.views - a?.views;
      case 'readTime':
        return a?.readTime - b?.readTime;
      default:
        return 0;
    }
  });

  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev?.[category]?.includes(value)
        ? prev?.[category]?.filter(item => item !== value)
        : [...prev?.[category], value]
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      category: [],
      topic: [],
      readTime: []
    });
    setSearchQuery('');
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <Helmet>
        <title>Articles & Insights - Rule27 Design Digital Powerhouse</title>
        <meta name="description" content="Expert insights on design, development, and digital marketing. Learn from Rule27's team about the latest trends, strategies, and techniques driving digital success." />
        <meta name="keywords" content="design articles, development tutorials, marketing insights, digital strategy, UX design, brand strategy, web development" />
        <meta property="og:title" content="Articles & Insights - Rule27 Design Digital Powerhouse" />
        <meta property="og:description" content="Expert insights and thought leadership from Rule27's team of digital innovators." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/articles-hub" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <ArticleHeroSection 
          featuredArticles={featuredArticles}
          onViewArticle={handleViewArticle}
        />

        {/* Filter Bar */}
        <ArticleFilterBar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Articles Grid - Mobile Optimized */}
        <section className="py-8 sm:py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  {filteredArticles?.length} Article{filteredArticles?.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text-secondary">
                  Insights and expertise from our team
                </p>
              </div>
              
              {/* View Toggle - Mobile Visible */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-accent'} w-8 h-8 sm:w-10 sm:h-10`}
                  aria-label="Grid view"
                >
                  <Icon name="Grid3X3" size={18} className="sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-accent'} w-8 h-8 sm:w-10 sm:h-10`}
                  aria-label="List view"
                >
                  <Icon name="List" size={18} className="sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Articles - Grid or List View with Responsive Spacing */}
            {filteredArticles?.length > 0 ? (
              <div className="transition-all duration-300 ease-in-out">
                {viewMode === 'grid' ? (
                  // Grid View - Mobile Optimized
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-fade-in">
                    {filteredArticles?.map((article) => (
                      <ArticleCard
                        key={article?.id}
                        article={article}
                        onViewDetails={handleViewArticle}
                      />
                    ))}
                  </div>
                ) : (
                  // List View - Mobile Optimized
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    {filteredArticles?.map((article) => (
                      <ArticleListItem
                        key={article?.id}
                        article={article}
                        onViewDetails={handleViewArticle}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 md:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <Icon name="FileText" size={24} className="text-text-secondary sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2">
                  No articles found
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-text-secondary mb-3 sm:mb-4 md:mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-accent text-accent hover:bg-accent hover:text-white text-xs sm:text-sm md:text-base px-3 py-2"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Article Modal */}
        <ArticleModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        {/* Footer */}
        <Footer />
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ArticlesHub;