import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import ArticleHeroSection from './components/ArticleHeroSection';
import ArticleFilterBar from './components/ArticleFilterBar';
import ArticleCard from './components/ArticleCard';
import ArticleListItem from './components/ArticleListItem';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useArticles, useArticleFilters } from '../../hooks/useArticles';

const ArticlesHub = () => {
  const navigate = useNavigate();
  const { articles, featuredArticles, loading, error } = useArticles();
  const filters = useArticleFilters();
  
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

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.category.toLowerCase().includes(searchLower) ||
        article.topics.some(topic => topic.toLowerCase().includes(searchLower)) ||
        article.author.name.toLowerCase().includes(searchLower)
      );
    }

    // Category filters
    if (activeFilters.category.length > 0) {
      filtered = filtered.filter(article => 
        activeFilters.category.includes(article.category)
      );
    }
    
    // Topic filters
    if (activeFilters.topic.length > 0) {
      filtered = filtered.filter(article =>
        article.topics.some(topic => activeFilters.topic.includes(topic))
      );
    }
    
    // Read time filters
    if (activeFilters.readTime.length > 0) {
      filtered = filtered.filter(article => {
        return activeFilters.readTime.some(filter => {
          if (filter === '< 5 min') return article.readTime < 5;
          if (filter === '5-10 min') return article.readTime >= 5 && article.readTime <= 10;
          if (filter === '> 10 min') return article.readTime > 10;
          return false;
        });
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedDate) - new Date(a.publishedDate);
        case 'oldest':
          return new Date(a.publishedDate) - new Date(b.publishedDate);
        case 'popular':
          return b.views - a.views;
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, searchQuery, activeFilters, sortBy]);

  // Handlers
  const handleFilterChange = useCallback((category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({
      category: [],
      topic: [],
      readTime: []
    });
    setSearchQuery('');
  }, []);

  const handleViewArticle = useCallback((article) => {
    navigate(`/article/${article.slug}`);
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary font-sans">Loading articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-heading-regular text-primary mb-2 tracking-wider uppercase">Error Loading Articles</h2>
            <p className="text-text-secondary font-sans">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4 border-accent text-accent hover:bg-accent hover:text-white"
            >
              <span className="font-heading-regular tracking-wider uppercase">Try Again</span>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Articles & Insights - Rule27 Design Digital Powerhouse</title>
        <meta name="description" content="Expert insights on design, development, and digital marketing. Learn from Rule27 Design's team about the latest trends, strategies, and techniques driving digital success." />
        <meta name="keywords" content="design articles, development tutorials, marketing insights, digital strategy, UX design, brand strategy, web development" />
        <meta property="og:title" content="Articles & Insights - Rule27 Design Digital Powerhouse" />
        <meta property="og:description" content="Expert insights and thought leadership from Rule27 Design's team of digital innovators." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/articles" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        {featuredArticles.length > 0 && (
          <ArticleHeroSection 
            featuredArticles={featuredArticles}
            onViewArticle={handleViewArticle}
          />
        )}

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

        {/* Articles Grid */}
        <section className="py-8 sm:py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-heading-regular text-primary tracking-wider uppercase">
                  <span className="font-heading-regular">{filteredArticles.length}</span> Article{filteredArticles.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text-secondary font-sans">
                  Insights and expertise from our team
                </p>
              </div>
              
              {/* View Toggle */}
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

            {/* Articles Display */}
            {filteredArticles.length > 0 ? (
              <div className="transition-all duration-300 ease-in-out">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-fade-in">
                    {filteredArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onViewDetails={handleViewArticle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    {filteredArticles.map((article) => (
                      <ArticleListItem
                        key={article.id}
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
                <h3 className="text-base sm:text-lg md:text-xl font-heading-regular text-primary mb-2 tracking-wider uppercase">
                  No articles found
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-text-secondary mb-3 sm:mb-4 md:mb-6 font-sans">
                  {articles.length === 0 ? 'No articles available yet' : 'Try adjusting your filters or search terms'}
                </p>
                {articles.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-accent text-accent hover:bg-accent hover:text-white text-xs sm:text-sm md:text-base px-3 py-2 font-heading-regular tracking-wider uppercase"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>

      {/* Animation Styles */}
      <style>{`
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