// src/pages/admin/case-studies/editor-tabs/SettingsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { cn, formatDate } from '../../../../utils';

const SettingsTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Publishing Status */}
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

      {/* Display Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Display Options</h3>
        
        <label className="flex items-center space-x-3">
          <Checkbox
            checked={formData.is_featured || false}
            onChange={(checked) => onChange('is_featured', checked)}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Featured Case Study</span>
            <p className="text-xs text-gray-500">Display prominently on homepage</p>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <Checkbox
            checked={formData.is_confidential || false}
            onChange={(checked) => onChange('is_confidential', checked)}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Confidential</span>
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
            <p className="text-xs text-gray-500">Make this case study visible on the website</p>
          </div>
        </label>
      </div>

      {/* Sort Order */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              onChange={(e) => {
                const keywords = e.target.value
                  .split(',')
                  .map(k => k.trim())
                  .filter(Boolean);
                onChange('meta_keywords', keywords);
              }}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>

      {/* Open Graph Settings */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Social Media Settings</h3>
        
        <div className="space-y-4">
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Description
            </label>
            <textarea
              value={formData.og_description || ''}
              onChange={(e) => onChange('og_description', e.target.value)}
              placeholder={formData.description || 'Description for social media sharing'}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internal Notes
        </label>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onChange('internal_notes', e.target.value)}
          placeholder="Notes for internal use only..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Case Study Stats (Read-only) */}
      {formData.id && (
        <div className={cn(
          "border rounded-lg p-4",
          "bg-gray-50"
        )}>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Case Study Information</h3>
          
          <div className="space-y-2 text-sm">
            {formData.created_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{formatDate(formData.created_at, 'PPP')}</span>
              </div>
            )}
            
            {formData.updated_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span>{formatDate(formData.updated_at, 'PPP')}</span>
              </div>
            )}
            
            {formData.published_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Published:</span>
                <span>{formatDate(formData.published_at, 'PPP')}</span>
              </div>
            )}
            
            {formData.approved_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Approved:</span>
                <span>{formatDate(formData.approved_at, 'PPP')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;