// src/pages/admin/services/editor-tabs/BasicInfoTab.jsx
import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { ColorPicker } from '../../../../components/ui/ColorPicker';

const BasicInfoTab = ({ formData, errors, onChange }) => {
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  const categories = [
    'development', 'design', 'marketing', 
    'consulting', 'support', 'maintenance'
  ];

  const availableIcons = [
    'Code', 'Palette', 'TrendingUp', 'Users', 
    'Headphones', 'Tool', 'Zap', 'Globe',
    'Smartphone', 'Monitor', 'Database', 'Cloud',
    'Shield', 'Lock', 'Search', 'BarChart',
    'Package', 'Layers', 'Grid', 'Cpu'
  ];

  return (
    <div className="space-y-6">
      {/* Name & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter service name"
            error={errors.name}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="service-url-slug"
            error={errors.slug}
          />
        </div>
      </div>

      {/* Category & Icon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.category || ''}
            onChange={(value) => onChange('category', value)}
            options={[
              { value: '', label: 'Select category...' },
              ...categories.map(cat => ({ 
                value: cat, 
                label: cat.charAt(0).toUpperCase() + cat.slice(1) 
              }))
            ]}
            error={errors.category}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Icon
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Input
                type="text"
                value={formData.icon || ''}
                onChange={(e) => onChange('icon', e.target.value)}
                placeholder="Icon name (e.g., Code)"
                readOnly={showIconPicker}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIconPicker(!showIconPicker)}
            >
              {showIconPicker ? 'Close' : 'Pick Icon'}
            </Button>
            {formData.icon && (
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <Icon name={formData.icon} size={20} />
              </div>
            )}
          </div>
          
          {showIconPicker && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-6 gap-2">
                {availableIcons.map(iconName => (
                  <button
                    key={iconName}
                    onClick={() => {
                      onChange('icon', iconName);
                      setShowIconPicker(false);
                    }}
                    className={`p-3 rounded hover:bg-white border transition-colors ${
                      formData.icon === iconName ? 'border-accent bg-white' : 'border-transparent'
                    }`}
                  >
                    <Icon name={iconName} size={20} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accent Color
        </label>
        <div className="flex items-center space-x-3">
          <Input
            type="text"
            value={formData.accent_color || '#5B4FE5'}
            onChange={(e) => onChange('accent_color', e.target.value)}
            placeholder="#5B4FE5"
            className="w-32"
          />
          <input
            type="color"
            value={formData.accent_color || '#5B4FE5'}
            onChange={(e) => onChange('accent_color', e.target.value)}
            className="w-10 h-10 rounded border cursor-pointer"
          />
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Preview:</span>
            <div 
              className="w-20 h-8 rounded"
              style={{ backgroundColor: formData.accent_color || '#5B4FE5' }}
            />
          </div>
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.short_description || ''}
          onChange={(e) => onChange('short_description', e.target.value)}
          placeholder="Brief description (appears in listings)"
          rows={3}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.short_description?.length || 0}/200 characters
        </p>
        {errors.short_description && (
          <p className="text-xs text-red-500 mt-1">{errors.short_description}</p>
        )}
      </div>

      {/* Long Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description
        </label>
        <TiptapContentEditor
          content={formData.long_description}
          onChange={(content) => onChange('long_description', content)}
          placeholder="Provide a detailed description of the service..."
          minHeight="300px"
        />
        {errors.long_description && (
          <p className="text-xs text-red-500 mt-1">{errors.long_description}</p>
        )}
      </div>

      {/* Icon Variations */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Icon Variations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Hover Icon (optional)
            </label>
            <Input
              type="text"
              value={formData.hover_icon || ''}
              onChange={(e) => onChange('hover_icon', e.target.value)}
              placeholder="Icon name for hover state"
              size="sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Featured Icon (optional)
            </label>
            <Input
              type="text"
              value={formData.featured_icon || ''}
              onChange={(e) => onChange('featured_icon', e.target.value)}
              placeholder="Icon when featured"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;