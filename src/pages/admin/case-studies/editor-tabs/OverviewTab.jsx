// src/pages/admin/case-studies/editor-tabs/OverviewTab.jsx
import React, { useEffect, useState } from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import ImageUpload from '../../../../components/ui/ImageUpload';
import Icon from '../../../../components/AdminIcon';

const OverviewTab = ({ formData, errors, onChange }) => {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 
    'Education', 'Manufacturing', 'Real Estate', 'Other'
  ];
  
  const serviceTypes = [
    'Web Development', 'Mobile App Development', 'Digital Marketing',
    'Brand Strategy', 'UX/UI Design', 'Consulting', 'Other'
  ];
  
  const businessStages = [
    'Startup', 'Growth', 'Enterprise', 'Non-Profit'
  ];

  return (
    <div className="space-y-6">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Enter project title"
            error={errors.title}
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
            placeholder="project-url-slug"
            error={errors.slug}
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Client Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.client_name || ''}
              onChange={(e) => onChange('client_name', e.target.value)}
              placeholder="Client company name"
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
              placeholder="https://example.com"
              error={errors.client_website}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Logo
          </label>
          <ImageUpload
            value={formData.client_logo}
            onChange={(url) => onChange('client_logo', url)}
            bucket="media"
            folder="case-studies/logos"
            maxSize={2 * 1024 * 1024} // 2MB
          />
        </div>
      </div>

      {/* Project Classification */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Project Classification</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.industry || ''}
              onChange={(value) => onChange('industry', value)}
              options={[
                { value: '', label: 'Select industry...' },
                ...industries.map(ind => ({ value: ind, label: ind }))
              ]}
              error={errors.industry}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.service_type || ''}
              onChange={(value) => onChange('service_type', value)}
              options={[
                { value: '', label: 'Select service...' },
                ...serviceTypes.map(type => ({ value: type, label: type }))
              ]}
              error={errors.service_type}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Stage
            </label>
            <Select
              value={formData.business_stage || ''}
              onChange={(value) => onChange('business_stage', value)}
              options={[
                { value: '', label: 'Select stage...' },
                ...businessStages.map(stage => ({ value: stage, label: stage }))
              ]}
            />
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Brief overview of the project..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;