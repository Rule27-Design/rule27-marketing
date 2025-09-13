// src/pages/admin/articles/editor-tabs/SEOTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import ImageUpload from '../../../../components/ui/ImageUpload';

const SEOTab = ({ formData, errors, onChange }) => {
  const handleMetaKeywordsChange = (value, index) => {
    const newKeywords = [...(formData.meta_keywords || [])];
    newKeywords[index] = value;
    onChange('meta_keywords', newKeywords);
  };

  const addMetaKeyword = () => {
    onChange('meta_keywords', [...(formData.meta_keywords || []), '']);
  };

  const removeMetaKeyword = (index) => {
    const newKeywords = [...(formData.meta_keywords || [])];
    newKeywords.splice(index, 1);
    onChange('meta_keywords', newKeywords);
  };

  return (
    <div className="space-y-6">
      {/* Basic SEO */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Search Engine Optimization</h3>
        
        <div className="space-y-4">
          <Input
            label="Meta Title"
            value={formData.meta_title}
            onChange={(e) => onChange('meta_title', e.target.value)}
            placeholder={formData.title || "SEO optimized title (60 chars max)"}
            error={errors.meta_title}
            maxLength={60}
            showCount
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => onChange('meta_description', e.target.value)}
              placeholder={formData.excerpt || "SEO description (155-160 characters)"}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              rows={3}
              maxLength={160}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.meta_description?.length || 0} / 160 characters
            </div>
          </div>

          <Input
            label="Canonical URL"
            value={formData.canonical_url}
            onChange={(e) => onChange('canonical_url', e.target.value)}
            placeholder={`https://www.rule27design.com/articles/${formData.slug || 'article-slug'}`}
            error={errors.canonical_url}
          />
        </div>
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Keywords
        </label>
        {(formData.meta_keywords || []).map((keyword, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={keyword}
              onChange={(e) => handleMetaKeywordsChange(e.target.value, index)}
              placeholder="Keyword or phrase"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeMetaKeyword(index)}
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMetaKeyword}
        >
          Add Keyword
        </Button>
      </div>

      {/* Social Media */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Preview</h3>
        
        <div className="space-y-4">
          <Input
            label="Open Graph Title"
            value={formData.og_title}
            onChange={(e) => onChange('og_title', e.target.value)}
            placeholder={formData.title || "Title for social media sharing"}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Description
            </label>
            <textarea
              value={formData.og_description}
              onChange={(e) => onChange('og_description', e.target.value)}
              placeholder={formData.excerpt || "Description for social media sharing"}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              rows={3}
            />
          </div>

          <ImageUpload
            label="Open Graph Image"
            value={formData.og_image}
            onChange={(value) => onChange('og_image', value)}
            bucket="media"
            folder="articles/social"
            showPreview={true}
            error={errors.og_image}
          />

          <Select
            label="Twitter Card Type"
            value={formData.twitter_card || 'summary_large_image'}
            onChange={(value) => onChange('twitter_card', value)}
            options={[
              { value: 'summary', label: 'Summary' },
              { value: 'summary_large_image', label: 'Summary Large Image' },
              { value: 'app', label: 'App' },
              { value: 'player', label: 'Player' }
            ]}
          />
        </div>
      </div>

      {/* SEO Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Google Search Preview</h3>
        <div className="bg-white rounded p-3 border">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {formData.meta_title || formData.title || 'Article Title'}
          </div>
          <div className="text-green-700 text-sm">
            https://www.rule27design.com/articles/{formData.slug || 'article-slug'}
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