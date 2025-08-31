import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleListItem = ({ article, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-500">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section - Mobile Optimized */}
        <div className="relative w-full lg:w-80 h-48 lg:h-64 overflow-hidden flex-shrink-0">
          <Image
            src={article?.featuredImage}
            alt={`${article?.title} featured image`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Featured Badge on Image */}
          {article?.featured && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Icon name="Star" size={18} className="text-white fill-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section - Mobile Optimized */}
        <div className="flex-1 p-4 sm:p-5 lg:p-8">
          <div className="flex flex-col h-full">
            {/* Header with badges - Mobile Responsive */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {article?.featured && (
                <span className="px-2 sm:px-3 py-1 bg-accent text-white text-xs font-heading-regular tracking-wider uppercase rounded-full flex items-center gap-1">
                  <Icon name="Star" size={12} className="fill-white" />
                  Featured
                </span>
              )}
              <span className="px-2 sm:px-3 py-1 bg-muted text-xs font-heading-regular tracking-wider uppercase text-primary rounded-full">
                {article?.category}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-black/10 text-xs font-body font-medium rounded-full flex items-center gap-1">
                <Icon name="Clock" size={12} />
                {article?.readTime} min read
              </span>
              <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-body">
                {formatDate(article?.publishedDate)}
              </span>
            </div>

            {/* Title - Mobile Responsive */}
            <h3 className="text-base sm:text-lg lg:text-2xl font-heading-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300 tracking-wider uppercase">
              {article?.title}
            </h3>

            {/* Excerpt - Mobile Responsive */}
            <p className="text-text-secondary text-xs sm:text-sm lg:text-base mb-4 line-clamp-2 lg:line-clamp-3 font-body">
              {article?.excerpt}
            </p>

            {/* Author Info - Mobile Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
              <img
                src={article?.author?.avatar}
                alt={article?.author?.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
              <div>
                <p className="font-body font-medium text-primary text-xs sm:text-sm">
                  {article?.author?.name}
                </p>
                <p className="text-[10px] sm:text-xs text-text-secondary font-body">
                  {article?.author?.role} • {formatDate(article?.publishedDate)}
                </p>
              </div>
            </div>

            {/* Topics - Mobile Responsive */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {article?.topics?.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-[10px] sm:text-xs text-text-secondary rounded-full font-body"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Footer with Stats and CTA - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row lg:items-center justify-between gap-3 sm:gap-4 mt-auto pt-3 sm:pt-4 border-t border-gray-100">
              {/* Stats - Mobile Responsive */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-text-secondary font-body">
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-heading-regular tracking-wider">{article?.views?.toLocaleString()}</span>
                  <span className="sm:hidden font-heading-regular tracking-wider">{article?.views > 1000 ? `${(article?.views / 1000).toFixed(0)}K` : article?.views}</span>
                  <span className="hidden sm:inline">views</span>
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Heart" size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-heading-regular tracking-wider">{article?.likes?.toLocaleString()}</span>
                  <span className="sm:hidden font-heading-regular tracking-wider">{article?.likes > 1000 ? `${(article?.likes / 1000).toFixed(0)}K` : article?.likes}</span>
                  <span className="hidden sm:inline">likes</span>
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Share2" size={14} className="sm:w-4 sm:h-4" />
                  Share
                </span>
              </div>

              {/* CTA Buttons - Mobile Responsive */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-secondary hover:text-accent text-xs sm:text-sm"
                  iconName="Bookmark"
                >
                  <span className="hidden sm:inline font-heading-regular tracking-wider uppercase">Save</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(article)}
                  className="border-accent text-accent hover:bg-accent hover:text-white text-xs sm:text-sm lg:text-base px-3 py-1.5 sm:px-4 sm:py-2"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  <span className="font-heading-regular tracking-wider uppercase">Read Article</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleListItem;