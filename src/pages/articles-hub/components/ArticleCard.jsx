import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleCard = ({ article, onViewDetails }) => {
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
    <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col h-full">
      {/* Featured Image - Mobile Optimized */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={article?.featuredImage}
          alt={`${article?.title} featured image`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge - Mobile Size */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary rounded-full">
            {article?.category}
          </span>
        </div>

        {/* Read Time Badge - Mobile Size */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-black/70 backdrop-blur-sm text-xs font-semibold text-white rounded-full flex items-center gap-1">
            <Icon name="Clock" size={12} />
            {article?.readTime} min
          </span>
        </div>

        {/* Featured Star Badge */}
        {article?.featured && (
          <div className="absolute bottom-3 right-3 z-10">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <Icon name="Star" size={18} className="text-white fill-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Content - Mobile Optimized */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6">
        {/* Author & Date - Mobile Responsive */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <img
              src={article?.author?.avatar}
              alt={article?.author?.name}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
            />
            <div className="text-xs sm:text-sm">
              <p className="font-medium text-primary truncate max-w-[100px] sm:max-w-[120px]">
                {article?.author?.name}
              </p>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs text-text-secondary">
            {formatDate(article?.publishedDate)}
          </span>
        </div>

        {/* Title - Mobile Text Sizes */}
        <h3 className="text-base sm:text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {article?.title}
        </h3>

        {/* Excerpt */}
        <p className="text-text-secondary text-xs sm:text-sm mb-4 line-clamp-3 flex-1">
          {article?.excerpt}
        </p>

        {/* Topics - Mobile Optimized */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
          {article?.topics?.slice(0, 3)?.map((topic, index) => (
            <span
              key={index}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-[10px] sm:text-xs text-text-secondary rounded-full"
            >
              {topic}
            </span>
          ))}
          {article?.topics?.length > 3 && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-[10px] sm:text-xs text-text-secondary rounded-full">
              +{article?.topics?.length - 3}
            </span>
          )}
        </div>

        {/* Footer with Stats and CTA - Mobile Optimized */}
        <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Icon name="Eye" size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="hidden sm:inline">{article?.views?.toLocaleString()}</span>
              <span className="sm:hidden">{article?.views > 1000 ? `${(article?.views / 1000).toFixed(0)}K` : article?.views}</span>
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Heart" size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="hidden sm:inline">{article?.likes?.toLocaleString()}</span>
              <span className="sm:hidden">{article?.likes > 1000 ? `${(article?.likes / 1000).toFixed(0)}K` : article?.likes}</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(article)}
            className="text-accent hover:text-accent/80 text-xs sm:text-sm p-1"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Read
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;