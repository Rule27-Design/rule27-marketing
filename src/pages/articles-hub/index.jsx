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

  // Sample articles data (truncated for brevity - use your existing data)
  const articles = [
    // ... your existing articles data
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