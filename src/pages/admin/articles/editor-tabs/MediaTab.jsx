// src/pages/admin/articles/editor-tabs/MediaTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import ImageUpload from '../../../../components/ui/ImageUpload';

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
          className="w-full"
        />
        {errors.featured_image && (
          <p className="text-xs text-red-500 mt-1">{errors.featured_image}</p>
        )}
        
        {formData.featured_image && (
          <div className="mt-4">
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
      </div>

      {/* Featured Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Video URL
        </label>
        <Input
          type="url"
          value={formData.featured_video || ''}
          onChange={(e) => onChange('featured_video', e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          error={errors.featured_video}
        />
        <p className="mt-1 text-xs text-gray-500">
          Supports YouTube, Vimeo, and direct video URLs
        </p>
      </div>

      {/* Preview */}
      {(formData.featured_image || formData.featured_video) && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            {formData.featured_image && (
              <img
                src={formData.featured_image}
                alt={formData.featured_image_alt || 'Featured image'}
                className="w-full h-64 object-cover"
              />
            )}
            {formData.featured_video && (
              <div className="p-4">
                <p className="text-sm text-gray-600">
                  Video: {formData.featured_video}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaTab;