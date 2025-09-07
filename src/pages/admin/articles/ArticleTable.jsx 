// src/pages/admin/articles/ArticleTable.jsx - Just the table component (200 lines)
import React from 'react';
import Icon from '../../../components/AdminIcon';
import Button from '../../../components/ui/Button';
import { ArticleStatusBadge } from './components/ArticleStatusBadge';
import { ArticleActions } from './components/ArticleActions';

const ArticleTable = ({
  articles = [],
  userProfile,
  onEdit,
  onDelete,
  onStatusChange,
  onNewArticle
}) => {

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-4">No articles found</p>
        <Button
          variant="outline"
          onClick={onNewArticle}
        >
          Create your first article
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
              Article
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Author
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Category
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
              Status
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Stats
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
              Updated
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {articles.map((article) => (
            <ArticleTableRow
              key={article.id}
              article={article}
              userProfile={userProfile}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Individual table row component for better performance
const ArticleTableRow = React.memo(({ 
  article, 
  userProfile, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Article Column */}
      <td className="px-4 py-4 w-2/5">
        <ArticleInfo article={article} />
      </td>

      {/* Author Column */}
      <td className="px-3 py-4 w-32">
        <AuthorInfo author={article.author} />
      </td>

      {/* Category Column */}
      <td className="px-3 py-4 w-24">
        <CategoryInfo category={article.category} />
      </td>

      {/* Status Column */}
      <td className="px-3 py-4 w-20">
        <ArticleStatusBadge status={article.status} />
      </td>

      {/* Stats Column */}
      <td className="px-3 py-4 text-center w-24">
        <ArticleStats article={article} />
      </td>

      {/* Updated Column */}
      <td className="px-3 py-4 text-xs text-gray-600 w-20">
        <UpdatedDate date={article.updated_at} />
      </td>

      {/* Actions Column */}
      <td className="px-3 py-4 text-right w-32">
        <ArticleActions
          article={article}
          userProfile={userProfile}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </td>
    </tr>
  );
});

// Article Info Component
const ArticleInfo = ({ article }) => (
  <div className="flex items-start space-x-3">
    {article.featured_image && (
      <img 
        src={article.featured_image} 
        alt={article.title}
        className="w-16 h-12 object-cover rounded flex-shrink-0"
        loading="lazy"
      />
    )}
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 text-sm leading-5 line-clamp-2">
        {article.title}
      </p>
      {article.excerpt && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {article.excerpt}
        </p>
      )}
      <ArticleBadges article={article} />
    </div>
  </div>
);

// Article badges (featured, read time, etc.)
const ArticleBadges = ({ article }) => (
  <div className="flex items-center space-x-2 mt-2">
    {article.is_featured && (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        <Icon name="Star" size={10} className="mr-1" />
        Featured
      </span>
    )}
    {article.read_time && (
      <span className="text-xs text-gray-400 flex items-center">
        <Icon name="Clock" size={10} className="mr-1" />
        {article.read_time}min
      </span>
    )}
    {article.scheduled_at && new Date(article.scheduled_at) > new Date() && (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        <Icon name="Calendar" size={10} className="mr-1" />
        Scheduled
      </span>
    )}
  </div>
);

// Author Info Component
const AuthorInfo = ({ author }) => (
  <div className="flex items-center space-x-2">
    {author?.avatar_url ? (
      <img 
        src={author.avatar_url} 
        alt={author.full_name}
        className="w-6 h-6 rounded-full flex-shrink-0"
        loading="lazy"
      />
    ) : (
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <Icon name="User" size={12} className="text-gray-500" />
      </div>
    )}
    <span className="text-xs text-gray-600 font-medium block truncate">
      {author?.full_name || 'Unknown'}
    </span>
  </div>
);

// Category Info Component
const CategoryInfo = ({ category }) => (
  <div className="flex items-center space-x-1">
    {category?.name ? (
      <>
        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
        <span className="text-xs text-gray-600 truncate block">
          {category.name}
        </span>
      </>
    ) : (
      <span className="text-xs text-gray-400 italic">No category</span>
    )}
  </div>
);

// Article Stats Component
const ArticleStats = ({ article }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
      <span className="flex items-center" title="Views">
        <Icon name="Eye" size={10} className="mr-1" />
        {formatNumber(article.view_count || 0)}
      </span>
      <span className="flex items-center" title="Likes">
        <Icon name="Heart" size={10} className="mr-1" />
        {formatNumber(article.like_count || 0)}
      </span>
    </div>
    {(article.comment_count || 0) > 0 && (
      <div className="text-xs text-gray-400 text-center">
        {formatNumber(article.comment_count)} comments
      </div>
    )}
  </div>
);

// Updated Date Component
const UpdatedDate = ({ date }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div title={new Date(date).toLocaleString()}>
      {formatDate(date)}
    </div>
  );
};

// Utility function to format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Export individual components for reuse
export { ArticleInfo, AuthorInfo, CategoryInfo, ArticleStats, UpdatedDate };

export default ArticleTable;