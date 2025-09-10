// src/pages/admin/services/editor-tabs/BasicInfoTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils';

const BasicInfoTab = ({ formData, errors, onChange }) => {
  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'support', label: 'Support' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'integration', label: 'Integration' }
  ];

  const zones = [
    { value: 'discovery', label: 'Discovery', icon: 'Search' },
    { value: 'strategy', label: 'Strategy', icon: 'Target' },
    { value: 'design', label: 'Design', icon: 'Palette' },
    { value: 'development', label: 'Development', icon: 'Code' },
    { value: 'growth', label: 'Growth', icon: 'TrendingUp' },
    { value: 'support', label: 'Support', icon: 'Headphones' }
  ];

  const icons = [
    '🚀', '💡', '🎨', '🛠️', '📊', '🔍', '💻', '📱',
    '🌟', '⚡', '🔧', '📈', '🎯', '🏆', '💎', '🔥'
  ];

  return (
    <div className="space-y-6">
      {/* Service Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Name *
        </label>
        <Input
          type="text"
          value={formData.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g., Custom Web Development"
          error={errors.name}
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL Slug *
        </label>
        <Input
          type="text"
          value={formData.slug || ''}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder="service-url-slug"
          error={errors.slug}
        />
      </div>

      {/* Category and Zone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Select
            value={formData.category || ''}
            onChange={(value) => onChange('category', value)}
            options={[
              { value: '', label: 'Select category' },
              ...categories
            ]}
            error={errors.category}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Zone
          </label>
          <Select
            value={formData.zone || ''}
            onChange={(value) => onChange('zone', value)}
            options={[
              { value: '', label: 'Select zone' },
              ...zones
            ]}
          />
        </div>
      </div>

      {/* Icon Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Icon
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {icons.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => onChange('icon', icon)}
              className={cn(
                "w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl transition-all",
                formData.icon === icon
                  ? "border-accent bg-accent/10"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {icon}
            </button>
          ))}
        </div>
        <Input
          type="text"
          value={formData.icon || ''}
          onChange={(e) => onChange('icon', e.target.value)}
          placeholder="Or enter custom emoji or icon"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description *
        </label>
        <textarea
          value={formData.short_description || ''}
          onChange={(e) => onChange('short_description', e.target.value)}
          placeholder="Brief description (shown in service cards)"
          rows={3}
          maxLength={200}
          className={cn(
            "w-full px-3 py-2 border rounded-md",
            errors.short_description ? 'border-red-500' : 'border-gray-300'
          )}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            Keep it concise and compelling
          </p>
          <span className={cn(
            "text-xs",
            (formData.short_description?.length || 0) > 200 ? 'text-red-500' : 'text-gray-500'
          )}>
            {formData.short_description?.length || 0}/200
          </span>
        </div>
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
          placeholder="Provide a comprehensive description of the service..."
          minHeight="250px"
        />
      </div>

      {/* Value Proposition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value Proposition
        </label>
        <textarea
          value={formData.value_proposition || ''}
          onChange={(e) => onChange('value_proposition', e.target.value)}
          placeholder="What unique value does this service provide?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Audience
        </label>
        <Input
          type="text"
          value={formData.target_audience || ''}
          onChange={(e) => onChange('target_audience', e.target.value)}
          placeholder="e.g., Startups, Enterprise, E-commerce businesses"
        />
      </div>

      {/* Preview Card */}
      {(formData.name || formData.short_description) && (
        <div className={cn(
          "border rounded-lg p-4",
          "bg-gray-50"
        )}>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start space-x-3">
              {formData.icon && (
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-2xl">
                  {formData.icon}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {formData.name || 'Service Name'}
                </h3>
                {formData.zone && (
                  <span className="text-xs text-gray-500">
                    {zones.find(z => z.value === formData.zone)?.label}
                  </span>
                )}
              </div>
            </div>
            {formData.short_description && (
              <p className="mt-3 text-sm text-gray-600">
                {formData.short_description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoTab;