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
        {/* Image Section */}
        <div className="relative lg:w-80 h-48 lg:h-64 overflow-hidden flex-shrink-0">
          <Image
            src={article?.featuredImage}
            alt={`${article?.title} featured image`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Featured Badge on Image */}
          {article?.featured && (
            <div className="absolute bottom-4 right-4 z-10">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Icon name="Star" size={18} className="text-white fill-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 lg:p-8">
          <div className="flex flex-col h-full">
            {/* Header with badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {article?.featured && (
                <span className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <Icon name="Star" size={12} className="fill-white" />
                  Featured
                </span>
              )}
              <span className="px-3 py-1 bg-muted text-xs font-semibold text-primary rounded-full">
                {article?.category}
              </span>
              <span className="px-3 py-1 bg-black/10 text-xs font-medium rounded-full flex items-center gap-1">
                <Icon name="Clock" size={12} />
                {article?.readTime} min read
              </span>
              <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {formatDate(article?.publishedDate)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg lg:text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
              {article?.title}
            </h3>

            {/* Excerpt */}
            <p className="text-text-secondary text-sm lg:text-base mb-4 line-clamp-2 lg:line-clamp-3">
              {article?.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={article?.author?.avatar}
                alt={article?.author?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-primary text-sm">
                  {article?.author?.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {article?.author?.role} • {formatDate(article?.publishedDate)}
                </p>
              </div>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article?.topics?.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-xs text-text-secondary rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Footer with Stats and CTA */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-100">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={16} />
                  {article?.views?.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Heart" size={16} />
                  {article?.likes?.toLocaleString()} likes
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Share2" size={16} />
                  Share
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-secondary hover:text-accent"
                  iconName="Bookmark"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(article)}
                  className="border-accent text-accent hover:bg-accent hover:text-white text-sm lg:text-base"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Read Article
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