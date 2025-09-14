// src/pages/admin/services/editor-tabs/BasicTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Icon from '../../../../components/AdminIcon';
import { generateSlug } from '../../../../utils';

const BasicTab = ({ formData, errors, onChange, zones }) => {
  // Icon options - using valid Lucide icon names
  const iconOptions = [
    'Zap', 'Code', 'Palette', 'Globe', 'ShoppingCart',
    'TrendingUp', 'Users', 'Settings', 'Database', 'Cloud',
    'Smartphone', 'Monitor', 'Layout', 'Package', 'Wrench'
  ];

  // Category suggestions
  const categoryOptions = [
    'Design', 'Development', 'Marketing', 'Consulting',
    'E-commerce', 'Analytics', 'Infrastructure', 'Support'
  ];

  // Handle title change with auto-slug
  const handleTitleChange = (value) => {
    onChange('title', value);
    
    // Auto-generate slug if new service
    if (!formData.id && !formData.slug) {
      onChange('slug', generateSlug(value));
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Service Title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Enter service title"
              error={errors.title}
            />
            
            <div className="relative">
              <Input
                label="URL Slug"
                value={formData.slug}
                onChange={(e) => onChange('slug', e.target.value)}
                placeholder="auto-generated-from-title"
                error={errors.slug}
              />
              {formData.title && !formData.id && (
                <button
                  type="button"
                  onClick={() => onChange('slug', generateSlug(formData.title))}
                  className="absolute right-2 top-8 text-xs text-accent hover:text-accent/80"
                >
                  Regenerate
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Service Zone"
              value={formData.zone_id}
              onChange={(value) => onChange('zone_id', value)}
              options={[
                { value: '', label: 'Select a zone...' },
                ...zones.map(zone => ({
                  value: zone.id,
                  label: zone.title
                }))
              ]}
              error={errors.zone_id}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                list="category-options"
                value={formData.category}
                onChange={(e) => onChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Select or enter category"
              />
              <datalist id="category-options">
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Icon
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {iconOptions.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => onChange('icon', iconName)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.icon === iconName
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={iconName}
                >
                  <Icon name={iconName} size={20} className="mx-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Input
              label="Short Description"
              value={formData.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Brief description for listings (max 500 characters)"
              error={errors.description}
              required
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.description?.length || 0} / 500 characters
            </div>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <textarea
              value={formData.full_description}
              onChange={(e) => onChange('full_description', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              rows={6}
              placeholder="Detailed service description for the service page..."
            />
          </div>

          {/* Status - Using native checkboxes instead of Checkbox component */}
          <div className="pt-4 border-t">
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => onChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <p className="text-xs text-gray-500">Service is visible to users</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => onChange('is_featured', e.target.checked)}
                  className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                  <p className="text-xs text-gray-500">Highlight this service</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicTab;