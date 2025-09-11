// src/pages/admin/articles/editor-tabs/MediaTab.jsx
import React from 'react';
import ImageUpload from '../../../../components/ui/ImageUpload';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AdminIcon';

const MediaTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Featured Image */}
      <div>
        <ImageUpload
          label="Featured Image"
          value={formData.featured_image}
          onChange={(value) => onChange('featured_image', value)}
          bucket="media"
          folder="articles"
          error={errors.featured_image}
          showPreview={true}
          acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
          maxSizeMB={5}
        />
        
        {formData.featured_image && (
          <div className="mt-4">
            <Input
              label="Featured Image Alt Text"
              value={formData.featured_image_alt}
              onChange={(e) => onChange('featured_image_alt', e.target.value)}
              placeholder="Describe the image for accessibility"
              error={errors.featured_image_alt}
              required
            />
          </div>
        )}
      </div>

      {/* Featured Video */}
      <div>
        <Input
          label="Featured Video URL (Optional)"
          value={formData.featured_video}
          onChange={(e) => onChange('featured_video', e.target.value)}
          placeholder="YouTube, Vimeo, or direct video URL"
          error={errors.featured_video}
        />
        
        {formData.featured_video && (
          <div className="mt-2 aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {/* Video preview would go here */}
            <div className="flex items-center justify-center h-full text-gray-400">
              Video Preview
            </div>
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gallery Images (Optional)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(formData.gallery_images || []).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt=""
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  const newGallery = [...(formData.gallery_images || [])];
                  newGallery.splice(index, 1);
                  onChange('gallery_images', newGallery);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          
          <ImageUpload
            value=""
            onChange={(value) => {
              onChange('gallery_images', [...(formData.gallery_images || []), value]);
            }}
            bucket="media"
            folder="articles/gallery"
            showPreview={false}
            className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400"
          >
            <div className="text-center">
              <Icon name="Plus" size={24} className="mx-auto text-gray-400" />
              <span className="text-sm text-gray-500">Add Image</span>
            </div>
          </ImageUpload>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;