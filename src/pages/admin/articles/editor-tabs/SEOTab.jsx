// src/pages/admin/articles/editor-tabs/SEOTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';

const SEOTab = ({ formData, errors, onChange }) => {
  const handleKeywordInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newKeyword = e.target.value.trim();
      if (!formData.meta_keywords.includes(newKeyword)) {
        onChange('meta_keywords', [...formData.meta_keywords, newKeyword]);
      }
      e.target.value = '';
    }
  };

  const removeKeyword = (keyword) => {
    onChange('meta_keywords', formData.meta_keywords.filter(k => k !== keyword));
  };

  return (
    <div className="space-y-6">
      {/* Meta Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Title
        </label>
        <Input
          type="text"
          value={formData.meta_title || ''}
          onChange={(e) => onChange('meta_title', e.target.value)}
          placeholder={formData.title || 'Page title for search engines'}
          maxLength={60}
          error={errors.meta_title}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.meta_title?.length || 0}/60 characters (recommended)
        </p>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          value={formData.meta_description || ''}
          onChange={(e) => onChange('meta_description', e.target.value)}
          placeholder={formData.excerpt || 'Page description for search engines'}
          rows={3}
          maxLength={160}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.meta_description?.length || 0}/160 characters (recommended)
        </p>
        {errors.meta_description && (
          <p className="text-xs text-red-500 mt-1">{errors.meta_description}</p>
        )}
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Keywords
        </label>
        <input
          type="text"
          placeholder="Type keyword and press Enter"
          onKeyDown={handleKeywordInput}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
        />
        
        {formData.meta_keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.meta_keywords.map(keyword => (
              <span
                key={keyword}
                className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Canonical URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Canonical URL
        </label>
        <Input
          type="url"
          value={formData.canonical_url || ''}
          onChange={(e) => onChange('canonical_url', e.target.value)}
          placeholder={`https://rule27design.com/articles/${formData.slug || 'article-slug'}`}
          error={errors.canonical_url}
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to auto-generate from slug
        </p>
      </div>

      {/* Open Graph */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Open Graph / Social Media</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Title
            </label>
            <Input
              type="text"
              value={formData.og_title || ''}
              onChange={(e) => onChange('og_title', e.target.value)}
              placeholder={formData.meta_title || formData.title || 'Social media title'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Description
            </label>
            <textarea
              value={formData.og_description || ''}
              onChange={(e) => onChange('og_description', e.target.value)}
              placeholder={formData.meta_description || formData.excerpt || 'Social media description'}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Image
            </label>
            <Input
              type="url"
              value={formData.og_image || ''}
              onChange={(e) => onChange('og_image', e.target.value)}
              placeholder={formData.featured_image || 'https://example.com/image.jpg'}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 1200×630 pixels
            </p>
          </div>
        </div>
      </div>

      {/* SEO Preview */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Search Engine Preview</h3>
        <div className="p-4 bg-white border rounded-lg">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {formData.meta_title || formData.title || 'Article Title'}
          </div>
          <div className="text-green-700 text-sm mt-1">
            https://rule27design.com/articles/{formData.slug || 'article-slug'}
          </div>
          <div className="text-gray-600 text-sm mt-1">
            {formData.meta_description || formData.excerpt || 'Article description will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOTab;