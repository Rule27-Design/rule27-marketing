// src/pages/admin/articles/editor-tabs/MediaTab.jsx
import React, { useState } from 'react';
import ImageUpload from '../../../../components/ui/ImageUpload';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';

const MediaTab = ({ formData, errors, onChange }) => {
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Handle gallery images
  const gallery = formData.gallery_images || [];

  const addGalleryImage = (imageData) => {
    const newImage = typeof imageData === 'string' 
      ? { url: imageData, alt: '', caption: '' }
      : imageData;
    
    onChange('gallery_images', [...gallery, newImage]);
  };

  const updateGalleryImage = (index, field, value) => {
    const updatedGallery = [...gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    onChange('gallery_images', updatedGallery);
  };

  const removeGalleryImage = (index) => {
    const updatedGallery = gallery.filter((_, i) => i !== index);
    onChange('gallery_images', updatedGallery);
  };

  const moveGalleryImage = (fromIndex, toIndex) => {
    const updatedGallery = [...gallery];
    const [movedItem] = updatedGallery.splice(fromIndex, 1);
    updatedGallery.splice(toIndex, 0, movedItem);
    onChange('gallery_images', updatedGallery);
  };

  return (
    <div className="space-y-6">
      {/* Featured Image */}
      <div>
        <ImageUpload
          label="Featured Image"
          value={formData.featured_image}
          onChange={(value) => onChange('featured_image', value)}
          bucket="media"
          folder="articles/featured"
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
            <div className="flex items-center justify-center h-full text-gray-400">
              <Icon name="Video" size={48} />
              <span className="ml-2">Video Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Gallery Images (Optional)
          </label>
          {gallery.length > 0 && (
            <span className="text-xs text-gray-500">
              {gallery.length} image{gallery.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((image, index) => (
            <div key={index} className="relative group bg-white rounded-lg border overflow-hidden">
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              
              {/* Image actions */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    onClick={() => moveGalleryImage(index, index - 1)}
                    className="bg-white rounded p-1 shadow hover:bg-gray-100"
                    title="Move left"
                  >
                    <Icon name="ChevronLeft" size={14} />
                  </button>
                )}
                {index < gallery.length - 1 && (
                  <button
                    onClick={() => moveGalleryImage(index, index + 1)}
                    className="bg-white rounded p-1 shadow hover:bg-gray-100"
                    title="Move right"
                  >
                    <Icon name="ChevronRight" size={14} />
                  </button>
                )}
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="bg-red-500 text-white rounded p-1 shadow hover:bg-red-600"
                  title="Remove"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
              
              {/* Image details */}
              <div className="p-2 space-y-1">
                <input
                  type="text"
                  placeholder="Alt text"
                  value={image.alt || ''}
                  onChange={(e) => updateGalleryImage(index, 'alt', e.target.value)}
                  className="w-full text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={image.caption || ''}
                  onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)}
                  className="w-full text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          ))}
          
          {/* Add image button */}
          <ImageUpload
            value=""
            onChange={addGalleryImage}
            bucket="media"
            folder="articles/gallery"
            showPreview={false}
            onUploadStart={() => setUploadingGallery(true)}
            onUploadEnd={() => setUploadingGallery(false)}
            className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 cursor-pointer transition-colors"
          >
            <div className="text-center">
              {uploadingGallery ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto" />
              ) : (
                <>
                  <Icon name="Plus" size={24} className="mx-auto text-gray-400" />
                  <span className="text-sm text-gray-500 mt-1">Add Image</span>
                </>
              )}
            </div>
          </ImageUpload>
        </div>

        {/* Gallery tips */}
        {gallery.length > 0 && (
          <div className="mt-4 text-xs text-gray-500">
            <p>• Drag images to reorder them in the gallery</p>
            <p>• Alt text is important for SEO and accessibility</p>
            <p>• Captions will be displayed below images in the article</p>
          </div>
        )}
      </div>

      {/* Media Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Media Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Featured image should be at least 1200x630px for social sharing</li>
          <li>• Use WebP or optimized JPEG/PNG for best performance</li>
          <li>• Gallery images work best at 16:9 or 4:3 aspect ratio</li>
          <li>• Always include alt text for accessibility and SEO</li>
        </ul>
      </div>
    </div>
  );
};

export default MediaTab;