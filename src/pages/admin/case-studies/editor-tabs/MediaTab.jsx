// src/pages/admin/case-studies/editor-tabs/MediaTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import ImageUpload, { GalleryUpload } from '../../../../components/ui/ImageUpload';
import { cn } from '../../../../utils';

const MediaTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Image *
        </label>
        <ImageUpload
          value={formData.hero_image}
          onChange={(url) => onChange('hero_image', url)}
          bucket="media"
          folder="case-studies/hero"
        />
        {errors.hero_image && (
          <p className="text-xs text-red-500 mt-1">{errors.hero_image}</p>
        )}
      </div>

      {/* Hero Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Video URL
        </label>
        <Input
          type="url"
          value={formData.hero_video || ''}
          onChange={(e) => onChange('hero_video', e.target.value)}
          placeholder="https://youtube.com/watch?v=... or Vimeo URL"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: Add a video to showcase the project
        </p>
      </div>

      {/* Project Gallery */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Gallery
        </label>
        <GalleryUpload
          value={formData.gallery || []}
          onChange={(gallery) => onChange('gallery', gallery)}
          maxImages={20}
          bucket="media"
          folder="case-studies/gallery"
        />
        <p className="text-xs text-gray-500 mt-2">
          Add up to 20 images showcasing different aspects of the project
        </p>
      </div>

      {/* Process Steps Images */}
      {formData.process_steps?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Process Step Images
          </h3>
          <div className="space-y-3">
            {formData.process_steps.map((step, idx) => (
              <div key={idx} className={cn(
                "p-3 border rounded-lg",
                "bg-gray-50"
              )}>
                <div className="mb-2">
                  <span className="text-sm font-medium">
                    Step {idx + 1}: {step.title || 'Untitled'}
                  </span>
                </div>
                <ImageUpload
                  value={step.image}
                  onChange={(url) => {
                    const newSteps = [...formData.process_steps];
                    newSteps[idx].image = url;
                    onChange('process_steps', newSteps);
                  }}
                  bucket="media"
                  folder="case-studies/process"
                  aspectRatio="16:9"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Section */}
      {(formData.hero_image || formData.gallery?.length > 0) && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Media Preview</h4>
          
          {formData.hero_image && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Hero Image</p>
              <img
                src={formData.hero_image}
                alt="Hero"
                className="w-full rounded-lg"
              />
            </div>
          )}
          
          {formData.gallery?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Gallery ({formData.gallery.length} images)
              </p>
              <div className="grid grid-cols-4 gap-2">
                {formData.gallery.slice(0, 8).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
                {formData.gallery.length > 8 && (
                  <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-600 text-sm">
                      +{formData.gallery.length - 8}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaTab;