// src/pages/admin/articles/editor-tabs/MediaTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import ImageUpload from '../../../../components/ui/ImageUpload';
import { cn } from '../../../../utils';

const MediaTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image
        </label>
        <ImageUpload
          value={formData.featured_image}
          onChange={(url) => onChange('featured_image', url)}
          bucket="media"
          folder="articles"
        />
        {errors.featured_image && (
          <p className="text-xs text-red-500 mt-1">{errors.featured_image}</p>
        )}
      </div>

      {/* Featured Image Alt Text */}
      {formData.featured_image && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alt Text
          </label>
          <Input
            type="text"
            value={formData.featured_image_alt || ''}
            onChange={(e) => onChange('featured_image_alt', e.target.value)}
            placeholder="Describe the image for accessibility"
          />
        </div>
      )}

      {/* Featured Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Video URL
        </label>
        <Input
          type="url"
          value={formData.featured_video || ''}
          onChange={(e) => onChange('featured_video', e.target.value)}
          placeholder="https://youtube.com/watch?v=... or Vimeo URL"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: Add a video to complement your article
        </p>
      </div>

      {/* Preview */}
      {(formData.featured_image || formData.featured_video) && (
        <div className={cn(
          "border rounded-lg p-4",
          "bg-gray-50"
        )}>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          
          {formData.featured_image && (
            <div className="mb-4">
              <img
                src={formData.featured_image}
                alt={formData.featured_image_alt || 'Featured image'}
                className="w-full rounded-lg"
              />
            </div>
          )}
          
          {formData.featured_video && (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <span className="text-white">Video: {formData.featured_video}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaTab;