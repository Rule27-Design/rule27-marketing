import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleModal = ({ article, isOpen, onClose }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !article) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content - Mobile Optimized */}
      <div className="relative w-full max-w-4xl h-[90vh] mx-4 bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden brand-shadow-lg">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>
        
        {/* Header with Close Button */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <Icon name="X" size={20} />
              </Button>
              <span className="text-sm text-text-secondary">
                {article?.readTime} min read
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? 'text-accent' : 'text-text-secondary hover:text-accent'}
              >
                <Icon name="Heart" size={20} className={isLiked ? 'fill-current' : ''} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? 'text-accent' : 'text-text-secondary hover:text-accent'}
              >
                <Icon name="Bookmark" size={20} className={isBookmarked ? 'fill-current' : ''} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-text-secondary hover:text-accent"
              >
                <Icon name="Share2" size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-96">
            <Image
              src={article?.featuredImage}
              alt={article?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                {article?.category}
              </span>
            </div>
          </div>

          {/* Article Body */}
          <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 max-w-3xl mx-auto">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
              {article?.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={article?.author?.avatar}
                  alt={article?.author?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-primary">
                    {article?.author?.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {article?.author?.role} • {formatDate(article?.publishedDate)}
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={16} />
                  {article?.views?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Heart" size={16} />
                  {article?.likes?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Article Excerpt */}
            <p className="text-lg text-text-secondary mb-8 leading-relaxed font-medium">
              {article?.excerpt}
            </p>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-text-primary leading-relaxed mb-6">
                {article?.content}
              </p>
              
              {/* Add more content sections as needed */}
              <p className="text-text-primary leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Key Takeaways */}
            {article?.keyTakeaways && (
              <div className="bg-accent/5 border-l-4 border-accent p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon name="Lightbulb" size={20} className="text-accent" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {article?.keyTakeaways?.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                      <span className="text-text-secondary">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topics */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {article?.topics?.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-sm text-text-secondary rounded-full hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4">
                <img
                  src={article?.author?.avatar}
                  alt={article?.author?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-1">
                    About {article?.author?.name}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    {article?.author?.role} at Rule27 Design
                  </p>
                  <p className="text-sm text-text-secondary">
                    With over 10 years of experience in digital design and strategy, {article?.author?.name} leads our creative initiatives and helps brands discover their authentic voice in the digital landscape.
                  </p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-2">Share this article</p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${article?.title}`, '_blank')}
                    >
                      <Icon name="Twitter" size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                    >
                      <Icon name="Linkedin" size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                    >
                      <Icon name="Facebook" size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                      onClick={handleShare}
                    >
                      <Icon name="Link" size={18} />
                    </Button>
                  </div>
                </div>
                
                <Button
                  variant="default"
                  className="bg-accent hover:bg-accent/90 text-white"
                  iconName="Mail"
                  iconPosition="left"
                >
                  Subscribe for More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;