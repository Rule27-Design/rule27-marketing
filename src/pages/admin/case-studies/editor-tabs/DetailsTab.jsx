// src/pages/admin/case-studies/editor-tabs/DetailsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { QualityCheck } from '../../../../components/admin';

const DetailsTab = ({ formData, errors, onChange }) => {
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
      {/* Quality Check */}
      <QualityCheck 
        data={formData} 
        config="case-study"
        onScoreChange={(score) => {
          if (score !== formData.qualityScore) {
            onChange('qualityScore', score);
          }
        }}
      />
      
      {/* Publishing Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing Settings</h3>
        
        <div className="space-y-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => onChange('status', value)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' }
            ]}
            error={errors.status}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Checkbox
                checked={formData.is_featured}
                onCheckedChange={(checked) => onChange('is_featured', checked)}
                label="Featured Case Study"
                description="Display prominently on homepage"
              />
            </div>
            
            <Input
              type="number"
              label="Sort Order"
              value={formData.sort_order || 0}
              onChange={(e) => onChange('sort_order', parseInt(e.target.value) || 0)}
              min="0"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        
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
              placeholder={formData.challenge ? formData.challenge.substring(0, 160) : "SEO description (155-160 characters)"}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              rows={3}
              maxLength={160}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.meta_description?.length || 0} / 160 characters
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

          <Input
            label="Canonical URL"
            value={formData.canonical_url}
            onChange={(e) => onChange('canonical_url', e.target.value)}
            placeholder={`https://rule27design.com/case-studies/${formData.slug || 'case-study-slug'}`}
            error={errors.canonical_url}
          />
        </div>
      </div>

      {/* Open Graph Settings */}
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
              placeholder={formData.challenge || "Description for social media sharing"}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              rows={3}
            />
          </div>

          <Input
            label="Open Graph Image URL"
            value={formData.og_image}
            onChange={(e) => onChange('og_image', e.target.value)}
            placeholder={formData.hero_image || "Image URL for social sharing"}
          />
        </div>
      </div>

      {/* Internal Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internal Notes
        </label>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onChange('internal_notes', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          rows={4}
          placeholder="Notes for the team (not visible to visitors)..."
        />
      </div>

      {/* Case Study Statistics - Only show for existing case studies */}
      {formData.id && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Views:</dt>
              <dd className="text-gray-900">{formData.view_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Unique Views:</dt>
              <dd className="text-gray-900">{formData.unique_view_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Inquiries Generated:</dt>
              <dd className="text-gray-900">{formData.inquiry_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created:</dt>
              <dd className="text-gray-900">
                {formData.created_at ? new Date(formData.created_at).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Last Updated:</dt>
              <dd className="text-gray-900">
                {formData.updated_at ? new Date(formData.updated_at).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Publishing Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Publishing Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Aim for a quality score of 60% or higher before publishing</li>
          <li>• Ensure client approval before publishing case studies</li>
          <li>• Featured case studies appear on the homepage</li>
          <li>• Use sort order to control display sequence</li>
          <li>• Include compelling metrics to demonstrate value</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsTab;