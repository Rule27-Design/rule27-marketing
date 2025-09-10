// src/pages/admin/case-studies/editor-tabs/OverviewTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import ImageUpload from '../../../../components/ui/ImageUpload';
import { cn } from '../../../../utils';

const OverviewTab = ({ formData, errors, onChange }) => {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Education',
    'Manufacturing', 'Real Estate', 'Transportation', 'Entertainment',
    'Non-Profit', 'Government', 'Other'
  ];

  const serviceTypes = [
    'Web Development', 'Mobile App', 'Digital Marketing', 'Brand Strategy',
    'UX/UI Design', 'E-commerce', 'Data Analytics', 'Cloud Migration',
    'Consulting', 'Custom Software', 'SEO/SEM', 'Content Strategy'
  ];

  const businessStages = [
    'Startup', 'Growth Stage', 'Established', 'Enterprise', 'Non-Profit'
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Case Study Title *
        </label>
        <Input
          type="text"
          value={formData.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g., Transforming E-commerce for Brand X"
          error={errors.title}
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
          placeholder="case-study-url-slug"
          error={errors.slug}
        />
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name *
          </label>
          <Input
            type="text"
            value={formData.client_name || ''}
            onChange={(e) => onChange('client_name', e.target.value)}
            placeholder="Company or Client Name"
            error={errors.client_name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Website
          </label>
          <Input
            type="url"
            value={formData.client_website || ''}
            onChange={(e) => onChange('client_website', e.target.value)}
            placeholder="https://client-website.com"
          />
        </div>
      </div>

      {/* Client Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client Logo
        </label>
        <ImageUpload
          value={formData.client_logo}
          onChange={(url) => onChange('client_logo', url)}
          bucket="media"
          folder="case-studies/logos"
          aspectRatio="square"
        />
      </div>

      {/* Industry and Service Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <Select
            value={formData.industry || ''}
            onChange={(value) => onChange('industry', value)}
            options={[
              { value: '', label: 'Select industry' },
              ...industries.map(ind => ({ value: ind, label: ind }))
            ]}
            error={errors.industry}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type *
          </label>
          <Select
            value={formData.service_type || ''}
            onChange={(value) => onChange('service_type', value)}
            options={[
              { value: '', label: 'Select service type' },
              ...serviceTypes.map(service => ({ value: service, label: service }))
            ]}
            error={errors.service_type}
          />
        </div>
      </div>

      {/* Business Stage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Stage
        </label>
        <Select
          value={formData.business_stage || ''}
          onChange={(value) => onChange('business_stage', value)}
          options={[
            { value: '', label: 'Select business stage' },
            ...businessStages.map(stage => ({ value: stage, label: stage }))
          ]}
        />
      </div>

      {/* Project Timeline */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Duration
          </label>
          <Input
            type="text"
            value={formData.project_duration || ''}
            onChange={(e) => onChange('project_duration', e.target.value)}
            placeholder="e.g., 6 months"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <Input
            type="date"
            value={formData.start_date || ''}
            onChange={(e) => onChange('start_date', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={formData.end_date || ''}
            onChange={(e) => onChange('end_date', e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brief Description *
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="A brief overview of the project and its impact..."
          rows={4}
          className={cn(
            "w-full px-3 py-2 border rounded-md",
            errors.description ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;