// src/pages/admin/profiles/editor-tabs/SocialSettingsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';

const SocialSettingsTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Social Links */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
        
        <div className="space-y-4">
          <Input
            label="LinkedIn"
            value={formData.linkedin_url}
            onChange={(e) => onChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            error={errors.linkedin_url}
            icon="Linkedin"
          />
          
          <Input
            label="Twitter"
            value={formData.twitter_url}
            onChange={(e) => onChange('twitter_url', e.target.value)}
            placeholder="https://twitter.com/username"
            error={errors.twitter_url}
            icon="Twitter"
          />
          
          <Input
            label="GitHub"
            value={formData.github_url}
            onChange={(e) => onChange('github_url', e.target.value)}
            placeholder="https://github.com/username"
            error={errors.github_url}
            icon="Github"
          />
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility Settings</h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => onChange('is_public', e.target.checked)}
              className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Public Profile</span>
              <p className="text-xs text-gray-500">Show on public team page</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => onChange('is_active', e.target.checked)}
              className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Active Account</span>
              <p className="text-xs text-gray-500">Account is active and accessible</p>
            </div>
          </label>
        </div>
      </div>

      {/* Display Settings */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>
        
        <div>
          <Input
            type="number"
            label="Sort Order"
            value={formData.sort_order}
            onChange={(e) => onChange('sort_order', parseInt(e.target.value) || 0)}
            description="Lower numbers appear first on team page"
            min="0"
            error={errors.sort_order}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialSettingsTab;