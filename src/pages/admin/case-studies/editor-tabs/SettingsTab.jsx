// src/pages/admin/case-studies/editor-tabs/SettingsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import Icon from '../../../../components/AdminIcon';

const SettingsTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Publishing Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Publishing Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status || 'draft'}
              onChange={(value) => onChange('status', value)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'pending_approval', label: 'Pending Approval' },
                { value: 'approved', label: 'Approved' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <Input
              type="number"
              value={formData.sort_order || 0}
              onChange={(e) => onChange('sort_order', parseInt(e.target.value))}
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Display Settings</h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.is_featured || false}
              onChange={(checked) => onChange('is_featured', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Featured Case Study</span>
              <p className="text-xs text-gray-500">Display prominently on homepage and listings</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.is_confidential || false}
              onChange={(checked) => onChange('is_confidential', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Confidential Project</span>
              <p className="text-xs text-gray-500">Hide sensitive client information</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.is_active !== false}
              onChange={(checked) => onChange('is_active', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Active</span>
              <p className="text-xs text-gray-500">Make this case study visible when published</p>
            </div>
          </label>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">SEO Settings</h3>
        
        <div className="space-y-4">
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
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_title?.length || 0}/60 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description || ''}
              onChange={(e) => onChange('meta_description', e.target.value)}
              placeholder={formData.description || 'Page description for search engines'}
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_description?.length || 0}/160 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <Input
              type="text"
              value={(formData.meta_keywords || []).join(', ')}
              onChange={(e) => onChange('meta_keywords', 
                e.target.value.split(',').map(k => k.trim()).filter(Boolean)
              )}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Social Media Preview</h3>
        
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
              placeholder={formData.meta_description || formData.description || 'Social media description'}
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
              placeholder={formData.hero_image || 'https://example.com/image.jpg'}
            />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Internal Notes</h3>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onChange('internal_notes', e.target.value)}
          placeholder="Notes for internal use only (not visible to public)"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      {/* Status Preview */}
      {formData.status === 'published' && (
        <div className="border-t pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Published Case Study</p>
                <p className="text-sm text-green-700 mt-1">
                  This case study is live and visible to the public.
                  {formData.is_featured && ' It is featured on the homepage.'}
                  {formData.is_confidential && ' Client details are hidden.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;