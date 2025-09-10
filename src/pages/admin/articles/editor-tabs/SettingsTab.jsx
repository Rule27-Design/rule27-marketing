// src/pages/admin/articles/editor-tabs/SettingsTab.jsx
import React from 'react';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import Input from '../../../../components/ui/Input';
import { cn, formatDate } from '../../../../utils';

const SettingsTab = ({ formData, errors, onChange }) => {
  const handleScheduleToggle = (enabled) => {
    if (enabled) {
      onChange('status', 'scheduled');
    } else {
      onChange('status', 'draft');
      onChange('scheduled_at', '');
    }
  };

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
            { value: 'published', label: 'Published' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'archived', label: 'Archived' }
          ]}
        />
      </div>

      {/* Scheduled Publishing */}
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
          />
          {formData.scheduled_at && (
            <p className="text-xs text-gray-500 mt-1">
              Will be published on {formatDate(formData.scheduled_at, 'PPP p')}
            </p>
          )}
        </div>
      )}

      {/* Display Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Display Options</h3>
        
        <label className="flex items-center space-x-3">
          <Checkbox
            checked={formData.is_featured || false}
            onChange={(checked) => onChange('is_featured', checked)}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Featured Article</span>
            <p className="text-xs text-gray-500">Display prominently on homepage</p>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <Checkbox
            checked={formData.enable_comments !== false}
            onChange={(checked) => onChange('enable_comments', checked)}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Enable Comments</span>
            <p className="text-xs text-gray-500">Allow readers to comment</p>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <Checkbox
            checked={formData.enable_reactions !== false}
            onChange={(checked) => onChange('enable_reactions', checked)}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Enable Reactions</span>
            <p className="text-xs text-gray-500">Allow readers to react with emojis</p>
          </div>
        </label>
      </div>

      {/* Internal Notes */}
      <div>
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

      {/* Article Stats (Read-only) */}
      {formData.id && (
        <div className={cn(
          "border rounded-lg p-4",
          "bg-gray-50"
        )}>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Article Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formData.view_count || 0}
              </div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formData.like_count || 0}
              </div>
              <div className="text-xs text-gray-500">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formData.share_count || 0}
              </div>
              <div className="text-xs text-gray-500">Shares</div>
            </div>
          </div>
          
          {formData.published_at && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">
                Published: {formatDate(formData.published_at, 'PPP')}
              </p>
              <p className="text-xs text-gray-500">
                Last updated: {formatDate(formData.updated_at, 'PPP')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsTab;