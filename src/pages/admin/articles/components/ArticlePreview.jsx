// src/pages/admin/articles/components/ArticlePreview.jsx
import React from 'react';
import { PreviewModal } from '../../../../components/admin';
import { formatDate } from '../../../../utils/dateUtils';

const ArticlePreview = ({ 
  article, 
  isOpen, 
  onClose,
  author
}) => {
  const calculateReadTime = (content) => {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  return (
    <PreviewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Article Preview"
      showDeviceSelector={true}
      actions={[
        {
          label: 'View Live',
          icon: 'ExternalLink',
          onClick: () => window.open(`/blog/${article.slug}`, '_blank')
        },
        {
          label: 'Copy Link',
          icon: 'Link',
          onClick: () => {
            navigator.clipboard.writeText(`${window.location.origin}/blog/${article.slug}`);
          }
        }
      ]}
    >
      <article className="prose prose-lg max-w-none p-8">
        {/* Category Badge */}
        {article.category && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-accent text-white text-sm rounded-full">
              {article.category.name}
            </span>
          </div>
        )}

        {/* Featured Image */}
        {article.featured_image && (
          <div className="mb-8 -mx-8">
            <img
              src={article.featured_image}
              alt={article.featured_image_alt || article.title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-4 border-b">
          <div className="flex items-center gap-2">
            {author?.avatar_url && (
              <img 
                src={author.avatar_url} 
                alt={author.full_name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>By {author?.full_name || 'Author'}</span>
          </div>
          <span>•</span>
          <span>{formatDate(article.published_at || article.created_at)}</span>
          <span>•</span>
          <span>{calculateReadTime(article.content)} min read</span>
          {article.view_count > 0 && (
            <>
              <span>•</span>
              <span>{article.view_count.toLocaleString()} views</span>
            </>
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <a
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {author && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-4">
              {author.avatar_url && (
                <img 
                  src={author.avatar_url} 
                  alt={author.full_name}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  About {author.full_name}
                </h3>
                {author.bio && (
                  <p className="text-gray-600">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </PreviewModal>
  );
};

export default ArticlePreview;