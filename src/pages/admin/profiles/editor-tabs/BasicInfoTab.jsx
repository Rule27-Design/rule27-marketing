// src/pages/admin/profiles/editor-tabs/BasicInfoTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';
import ImageUpload from '../../../../components/ui/ImageUpload';

const BasicInfoTab = ({ formData, errors, onChange, isEditing }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          {/* Profile Photo Upload - Using correct bucket */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <ImageUpload
                label="Profile Photo"
                value={formData.avatar_url || ''}
                onChange={(value) => onChange('avatar_url', value)}
                bucket="avatar"  // Changed from avatars to profile
                folder="profiles"
                accept="image/*"
                maxSize={2 * 1024 * 1024} // 2MB
                showPreview={true}
                className="w-full"
                optimize={true}
                optimizeOptions={{
                  maxWidth: 400,
                  maxHeight: 400,
                  quality: 0.9
                }}
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => onChange('full_name', e.target.value)}
                  required
                  placeholder="John Doe"
                  error={errors.full_name}
                />
                
                <Input
                  label="Display Name"
                  value={formData.display_name}
                  onChange={(e) => onChange('display_name', e.target.value)}
                  placeholder="Optional display name"
                  error={errors.display_name}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  required
                  placeholder="john@example.com"
                  error={errors.email}
                  disabled={isEditing}
                />
                
                <Input
                  label="Job Title"
                  value={formData.job_title}
                  onChange={(e) => onChange('job_title', e.target.value)}
                  placeholder="e.g., Senior Developer"
                  error={errors.job_title}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => onChange('bio', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Brief bio for team page..."
              maxLength={500}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">
                {formData.bio?.length || 0} / 500 characters
              </span>
              {errors.bio && (
                <span className="text-red-500">{errors.bio}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;