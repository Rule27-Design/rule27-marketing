// src/pages/admin/articles/editor-tabs/SEOTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import ImageUpload from '../../../../components/ui/ImageUpload';
import { cn } from '../../../../utils';

const SEOTab = ({ formData, errors, onChange }) => {
  const metaTitleLength = formData.meta_title?.length || 0;
  const metaDescLength = formData.meta_description?.length || 0;

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
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            Recommended: 50-60 characters
          </p>
          <span className={cn(
            "text-xs",
            metaTitleLength > 60 ? 'text-red-500' : 'text-gray-500'
          )}>
            {metaTitleLength}/60
          </span>
        </div>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            Recommended: 150-160 characters
          </p>
          <span className={cn(
            "text-xs",
            metaDescLength > 160 ? 'text-red-500' : 'text-gray-500'
          )}>
            {metaDescLength}/160
          </span>
        </div>
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Keywords
        </label>
        <Input
          type="text"
          value={(formData.meta_keywords || []).join(', ')}
          onChange={(e) => {
            const keywords = e.target.value
              .split(',')
              .map(k => k.trim())
              .filter(Boolean);
            onChange('meta_keywords', keywords);
          }}
          placeholder="keyword1, keyword2, keyword3"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate keywords with commas
        </p>
      </div>

      {/* Open Graph Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open Graph Title
        </label>
        <Input
          type="text"
          value={formData.og_title || ''}
          onChange={(e) => onChange('og_title', e.target.value)}
          placeholder={formData.title || 'Title for social media sharing'}
        />
      </div>

      {/* Open Graph Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open Graph Description
        </label>
        <textarea
          value={formData.og_description || ''}
          onChange={(e) => onChange('og_description', e.target.value)}
          placeholder={formData.excerpt || 'Description for social media sharing'}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Open Graph Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open Graph Image
        </label>
        <ImageUpload
          value={formData.og_image || formData.featured_image}
          onChange={(url) => onChange('og_image', url)}
          bucket="media"
          folder="articles/og"
        />
        <p className="text-xs text-gray-500 mt-1">
          Recommended: 1200x630px for optimal display on social media
        </p>
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
          placeholder="https://example.com/article-slug"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to use the default article URL
        </p>
      </div>

      {/* SEO Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Search Engine Preview
        </h4>
        <div className="space-y-1">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {formData.meta_title || formData.title || 'Article Title'}
          </div>
          <div className="text-green-700 text-sm">
            example.com › articles › {formData.slug || 'article-slug'}
          </div>
          <div className="text-gray-600 text-sm">
            {formData.meta_description || formData.excerpt || 'Article description will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOTab;