// src/pages/admin/articles/editor-tabs/SettingsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';

const SettingsTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Publishing Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Publishing</h3>
        
        <div className="space-y-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status || 'draft'}
              onChange={(value) => onChange('status', value)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'archived', label: 'Archived' }
              ]}
            />
          </div>

          {/* Schedule Date */}
          {formData.status === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Date & Time
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduled_at || ''}
                onChange={(e) => onChange('scheduled_at', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                error={errors.scheduled_at}
              />
            </div>
          )}
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
              <span className="text-sm font-medium text-gray-700">Featured Article</span>
              <p className="text-xs text-gray-500">Display prominently on homepage and listings</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.enable_comments || false}
              onChange={(checked) => onChange('enable_comments', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Enable Comments</span>
              <p className="text-xs text-gray-500">Allow readers to comment on this article</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.enable_reactions !== false}
              onChange={(checked) => onChange('enable_reactions', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Enable Reactions</span>
              <p className="text-xs text-gray-500">Allow readers to like and bookmark</p>
            </div>
          </label>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Internal Notes</h3>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onChange('internal_notes', e.target.value)}
          placeholder="Notes for internal use only (not visible to readers)"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>
    </div>
  );
};

export default SettingsTab;