// src/pages/admin/articles/editor-tabs/SettingsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { QualityCheck } from '../../../../components/admin';

const SettingsTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Quality Check - Shows content optimization score */}
      <QualityCheck 
        data={formData} 
        config="article"
        onScoreChange={(score) => {
          // Optionally track the score in formData
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
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'archived', label: 'Archived' }
            ]}
            error={errors.status}
          />

          {formData.status === 'scheduled' && (
            <Input
              type="datetime-local"
              label="Schedule Publication"
              value={formData.scheduled_at}
              onChange={(e) => onChange('scheduled_at', e.target.value)}
              error={errors.scheduled_at}
              required
            />
          )}

          <div className="space-y-3">
            <Checkbox
              checked={formData.is_featured}
              onCheckedChange={(checked) => onChange('is_featured', checked)}
              label="Featured Article"
              description="Display this article prominently on the homepage"
            />
            
            <Checkbox
              checked={formData.enable_comments}
              onCheckedChange={(checked) => onChange('enable_comments', checked)}
              label="Enable Comments"
              description="Allow readers to comment on this article"
            />
            
            <Checkbox
              checked={formData.enable_reactions}
              onCheckedChange={(checked) => onChange('enable_reactions', checked)}
              label="Enable Reactions"
              description="Allow readers to like and share this article"
            />
          </div>
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
          placeholder="Notes for the editorial team (not visible to readers)..."
        />
      </div>

      {/* Article Statistics - Only show for existing articles */}
      {formData.id && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Article Information</h3>
          <dl className="space-y-2 text-sm">
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
            {formData.published_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Published:</dt>
                <dd className="text-gray-900">
                  {new Date(formData.published_at).toLocaleDateString()}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Views:</dt>
              <dd className="text-gray-900">{formData.view_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Likes:</dt>
              <dd className="text-gray-900">{formData.like_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Shares:</dt>
              <dd className="text-gray-900">{formData.share_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Comments:</dt>
              <dd className="text-gray-900">{formData.comment_count || 0}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Publishing Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Publishing Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Aim for a quality score of 60% or higher before publishing</li>
          <li>• Schedule posts for optimal engagement times (10am or 2pm)</li>
          <li>• Featured articles appear on the homepage carousel</li>
          <li>• Internal notes are only visible to editors and admins</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsTab;