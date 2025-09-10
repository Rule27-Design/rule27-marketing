// src/pages/admin/services/editor-tabs/MediaTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import ImageUpload, { GalleryUpload } from '../../../../components/ui/ImageUpload';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils';

const MediaTab = ({ formData, errors, onChange }) => {
  // Handle tools
  const addTool = () => {
    onChange('tools_used', [...(formData.tools_used || []), { name: '', icon: '', url: '' }]);
  };

  const updateTool = (index, field, value) => {
    const newTools = [...(formData.tools_used || [])];
    newTools[index] = { ...newTools[index], [field]: value };
    onChange('tools_used', newTools);
  };

  const removeTool = (index) => {
    onChange('tools_used', formData.tools_used.filter((_, i) => i !== index));
  };

  // Handle technologies
  const addTechnology = () => {
    onChange('technologies', [...(formData.technologies || []), '']);
  };

  const updateTechnology = (index, value) => {
    const newTech = [...(formData.technologies || [])];
    newTech[index] = value;
    onChange('technologies', newTech);
  };

  const removeTechnology = (index) => {
    onChange('technologies', formData.technologies.filter((_, i) => i !== index));
  };

  // Handle integrations
  const addIntegration = () => {
    onChange('integrations', [...(formData.integrations || []), 
      { name: '', logo: '', description: '' }
    ]);
  };

  const updateIntegration = (index, field, value) => {
    const newIntegrations = [...(formData.integrations || [])];
    newIntegrations[index] = { ...newIntegrations[index], [field]: value };
    onChange('integrations', newIntegrations);
  };

  const removeIntegration = (index) => {
    onChange('integrations', formData.integrations.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Image
        </label>
        <ImageUpload
          value={formData.hero_image}
          onChange={(url) => onChange('hero_image', url)}
          bucket="media"
          folder="services/hero"
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
          Optional: Add a video to showcase this service
        </p>
      </div>

      {/* Service Gallery */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Gallery
        </label>
        <GalleryUpload
          value={formData.gallery || []}
          onChange={(gallery) => onChange('gallery', gallery)}
          maxImages={12}
          bucket="media"
          folder="services/gallery"
        />
        <p className="text-xs text-gray-500 mt-2">
          Add up to 12 images showcasing this service
        </p>
      </div>

      {/* Tools Used */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Tools & Software
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addTool}
            iconName="Plus"
          >
            Add Tool
          </Button>
        </div>
        
        <div className="space-y-3">
          {(formData.tools_used || []).map((tool, index) => (
            <div key={index} className={cn(
              "p-3 rounded-lg",
              "bg-gray-50"
            )}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="text"
                  value={tool.name || ''}
                  onChange={(e) => updateTool(index, 'name', e.target.value)}
                  placeholder="Tool name"
                  size="sm"
                />
                <Input
                  type="text"
                  value={tool.icon || ''}
                  onChange={(e) => updateTool(index, 'icon', e.target.value)}
                  placeholder="Icon or logo URL"
                  size="sm"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="url"
                    value={tool.url || ''}
                    onChange={(e) => updateTool(index, 'url', e.target.value)}
                    placeholder="Tool website"
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeTool(index)}
                    className="text-red-500"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {(!formData.tools_used || formData.tools_used.length === 0) && (
          <div className={cn(
            "text-center py-6 border-2 border-dashed rounded-lg",
            "border-gray-300"
          )}>
            <Icon name="Tool" size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No tools added yet</p>
          </div>
        )}
      </div>

      {/* Technologies */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Technologies
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addTechnology}
            iconName="Plus"
          >
            Add Technology
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(formData.technologies || []).map((tech, index) => (
            <div key={index} className={cn(
              "flex items-center space-x-1 px-3 py-1 rounded-full",
              "bg-blue-100 text-blue-800"
            )}>
              <input
                type="text"
                value={tech}
                onChange={(e) => updateTechnology(index, e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-24"
                placeholder="Technology"
              />
              <button
                onClick={() => removeTechnology(index)}
                className="text-blue-600 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
          
          {(!formData.technologies || formData.technologies.length === 0) && (
            <span className="text-sm text-gray-500">
              Click "Add Technology" to start adding technologies
            </span>
          )}
        </div>
      </div>

      {/* Integrations */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Integrations
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addIntegration}
            iconName="Plus"
          >
            Add Integration
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(formData.integrations || []).map((integration, index) => (
            <div key={index} className={cn(
              "p-3 rounded-lg",
              "bg-gray-50"
            )}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={integration.name || ''}
                    onChange={(e) => updateIntegration(index, 'name', e.target.value)}
                    placeholder="Integration name"
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeIntegration(index)}
                    className="text-red-500"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                <Input
                  type="url"
                  value={integration.logo || ''}
                  onChange={(e) => updateIntegration(index, 'logo', e.target.value)}
                  placeholder="Logo URL"
                  size="sm"
                />
                <Input
                  type="text"
                  value={integration.description || ''}
                  onChange={(e) => updateIntegration(index, 'description', e.target.value)}
                  placeholder="Brief description"
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
        
        {(!formData.integrations || formData.integrations.length === 0) && (
          <div className={cn(
            "text-center py-6 border-2 border-dashed rounded-lg",
            "border-gray-300"
          )}>
            <Icon name="Plug" size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No integrations added yet</p>
          </div>
        )}
      </div>

      {/* Media Preview */}
      {(formData.hero_image || formData.gallery?.length > 0) && (
        <div className={cn(
          "border rounded-lg p-4",
          "bg-gray-50"
        )}>
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
                  <div className={cn(
                    "w-full h-20 rounded flex items-center justify-center",
                    "bg-gray-200"
                  )}>
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