// src/pages/admin/articles/editor-tabs/SEOTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import ImageUpload from '../../../../components/ui/ImageUpload';

const SEOTab = ({ formData, errors, onChange }) => {
  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const keyword = e.target.value.trim().toLowerCase();
      if (!formData.meta_keywords?.includes(keyword)) {
        onChange('meta_keywords', [...(formData.meta_keywords || []), keyword]);
      }
      e.target.value = '';
    }
  };

  const handleRemoveKeyword = (keyword) => {
    onChange('meta_keywords', formData.meta_keywords?.filter(k => k !== keyword) || []);
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
          value={formData.meta_title || formData.title || ''}
          onChange={(e) => onChange('meta_title', e.target.value)}
          placeholder="SEO title (defaults to article title)"
          maxLength={60}
        />
        {errors.meta_title && (
          <p className="mt-1 text-sm text-red-600">{errors.meta_title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.meta_title?.length || formData.title?.length || 0}/60 characters (recommended)
        </p>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          value={formData.meta_description || formData.excerpt || ''}
          onChange={(e) => onChange('meta_description', e.target.value)}
          placeholder="SEO description (defaults to excerpt)"
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          maxLength={160}
        />
        {errors.meta_description && (
          <p className="mt-1 text-sm text-red-600">{errors.meta_description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.meta_description?.length || formData.excerpt?.length || 0}/160 characters (recommended)
        </p>
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Keywords
        </label>
        <Input
          type="text"
          onKeyDown={handleAddKeyword}
          placeholder="Type a keyword and press Enter"
        />
        {formData.meta_keywords?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.meta_keywords.map(keyword => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="text-purple-600 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Open Graph */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium text-gray-900">Social Media Preview</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OG Title
          </label>
          <Input
            type="text"
            value={formData.og_title || ''}
            onChange={(e) => onChange('og_title', e.target.value)}
            placeholder="Defaults to meta title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OG Description
          </label>
          <textarea
            value={formData.og_description || ''}
            onChange={(e) => onChange('og_description', e.target.value)}
            placeholder="Defaults to meta description"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OG Image
          </label>
          <ImageUpload
            value={formData.og_image}
            onChange={(url) => onChange('og_image', url)}
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            Recommended: 1200x630px for best display on social media
          </p>
        </div>
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
          placeholder="https://example.com/original-article"
        />
        <p className="mt-1 text-xs text-gray-500">
          Only set if this content exists elsewhere
        </p>
      </div>
    </div>
  );
};