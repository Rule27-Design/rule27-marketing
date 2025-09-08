// src/pages/admin/articles/components/ArticlePreview.jsx - Live preview modal
import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { TiptapContentDisplay } from '../../../../components/ui/TiptapContentEditor';
import { cn } from '../../../../utils/cn';

const ArticlePreview = ({ 
  article, 
  isOpen, 
  onClose,
  onEdit,
  onPublish,
  userProfile 
}) => {
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [isLoading, setIsLoading] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  // Simulate loading delay for realistic preview
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, article]);

  // Calculate article statistics
  const articleStats = useMemo(() => {
    if (!article?.content) return { words: 0, readTime: 0, characters: 0 };
    
    const text = article.content.text || '';
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const characters = text.length;
    const readTime = Math.ceil(words / 200);
    
    return { words, readTime, characters };
  }, [article?.content]);

  // Preview viewport configurations
  const viewportConfigs = {
    desktop: { width: '100%', maxWidth: '1200px', height: '100%' },
    tablet: { width: '768px', maxWidth: '768px', height: '1024px' },
    mobile: { width: '375px', maxWidth: '375px', height: '667px' }
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Article Preview</h2>
              <p className="text-sm text-gray-600 mt-1">{article.title}</p>
            </div>
            
            {/* Article Stats */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Icon name="Type" size={14} className="mr-1" />
                {articleStats.words} words
              </span>
              <span className="flex items-center">
                <Icon name="Clock" size={14} className="mr-1" />
                {articleStats.readTime} min read
              </span>
              <span className="flex items-center">
                <Icon name="Eye" size={14} className="mr-1" />
                {article.view_count || 0} views
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Viewport Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {Object.entries(viewportConfigs).map(([mode, config]) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={cn(
                    'px-3 py-1 rounded text-sm font-medium transition-colors',
                    previewMode === mode 
                      ? 'bg-white shadow text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} preview`}
                >
                  <Icon 
                    name={mode === 'desktop' ? 'Monitor' : mode === 'tablet' ? 'Tablet' : 'Smartphone'} 
                    size={16} 
                  />
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(article)}
              iconName="Edit"
            >
              Edit
            </Button>

            {userProfile?.role === 'admin' && article.status !== 'published' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onPublish(article.id)}
                className="bg-green-600 hover:bg-green-700"
                iconName="Globe"
              >
                Publish
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
          <div className="h-full flex items-center justify-center">
            {isLoading ? (
              <PreviewSkeleton />
            ) : (
              <div 
                className="bg-white shadow-lg transition-all duration-300 ease-in-out overflow-auto"
                style={{
                  width: viewportConfigs[previewMode].width,
                  maxWidth: viewportConfigs[previewMode].maxWidth,
                  height: viewportConfigs[previewMode].height,
                  maxHeight: '100%'
                }}
              >
                <ArticlePreviewContent article={article} stats={articleStats} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Status: 
                <span className={cn(
                  'ml-1 font-medium',
                  article.status === 'published' ? 'text-green-600' :
                  article.status === 'draft' ? 'text-gray-600' :
                  'text-yellow-600'
                )}>
                  {article.status.replace('_', ' ')}
                </span>
              </span>
              {article.published_at && (
                <span>Published: {new Date(article.published_at).toLocaleDateString()}</span>
              )}
              {article.updated_at && (
                <span>Updated: {new Date(article.updated_at).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                iconName="ExternalLink"
                disabled={article.status !== 'published'}
              >
                View Live
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/articles/${article.slug}`);
                }}
                iconName="Link"
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Article preview content component
const ArticlePreviewContent = ({ article, stats }) => {
  return (
    <article className="max-w-4xl mx-auto p-8">
      {/* Article Header */}
      <header className="mb-8">
        {article.featured_image && (
          <img 
            src={article.featured_image} 
            alt={article.featured_image_alt || article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <div className="space-y-4">
          {article.category && (
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {article.category.name}
              </span>
              {article.is_featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center">
                  <Icon name="Star" size={14} className="mr-1" />
                  Featured
                </span>
              )}
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {article.author && (
                <div className="flex items-center space-x-2">
                  {article.author.avatar_url ? (
                    <img 
                      src={article.author.avatar_url} 
                      alt={article.author.full_name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Icon name="User" size={16} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{article.author.full_name}</p>
                    <p className="text-sm text-gray-500">Author</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Icon name="Clock" size={14} className="mr-1" />
                {stats.readTime} min read
              </span>
              <span className="flex items-center">
                <Icon name="Calendar" size={14} className="mr-1" />
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {article.content ? (
          <TiptapContentDisplay content={article.content} />
        ) : (
          <p className="text-gray-500 italic">No content available</p>
        )}
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        {article.tags && article.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Icon name="Eye" size={14} className="mr-1" />
              {article.view_count || 0} views
            </span>
            <span className="flex items-center">
              <Icon name="Heart" size={14} className="mr-1" />
              {article.like_count || 0} likes
            </span>
            {article.comment_count > 0 && (
              <span className="flex items-center">
                <Icon name="MessageCircle" size={14} className="mr-1" />
                {article.comment_count} comments
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Icon name="Heart" size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
              <Icon name="Share2" size={18} />
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
};

// Loading skeleton for preview
const PreviewSkeleton = () => (
  <div className="bg-white shadow-lg w-full max-w-4xl h-full p-8 animate-pulse">
    <div className="space-y-6">
      {/* Image skeleton */}
      <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
      
      {/* Category skeleton */}
      <div className="w-24 h-6 bg-gray-200 rounded-full"></div>
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
      </div>
      
      {/* Excerpt skeleton */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
      </div>
      
      {/* Author skeleton */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-1">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className={`h-4 bg-gray-200 rounded ${
              i === 3 || i === 7 ? 'w-3/4' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

export default ArticlePreview;