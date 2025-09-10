// src/pages/admin/articles/editor-tabs/SettingsTab.jsx
import React from 'react';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import Input from '../../../../components/ui/Input';

const SettingsTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Publishing Settings */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Publishing</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status || 'draft'}
              onChange={(e) => onChange('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Publication
            </label>
            <Input
              type="datetime-local"
              value={formData.scheduled_at || ''}
              onChange={(e) => onChange('scheduled_at', e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Article will be automatically published at this time
            </p>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Display Options</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={formData.is_featured || false}
              onChange={(e) => onChange('is_featured', e.target.checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Featured Article</span>
              <p className="text-xs text-gray-500">Display prominently on homepage</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <Checkbox
              checked={formData.enable_comments || false}
              onChange={(e) => onChange('enable_comments', e.target.checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Enable Comments</span>
              <p className="text-xs text-gray-500">Allow readers to comment</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <Checkbox
              checked={formData.enable_reactions !== false}
              onChange={(e) => onChange('enable_reactions', e.target.checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Enable Reactions</span>
              <p className="text-xs text-gray-500">Allow likes and other reactions</p>
            </div>
          </label>
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
          placeholder="Notes for editors and admins (not visible to readers)"
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </div>
  );
};