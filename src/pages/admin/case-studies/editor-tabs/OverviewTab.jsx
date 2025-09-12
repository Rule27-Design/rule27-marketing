// src/pages/admin/case-studies/editor-tabs/OverviewTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { generateSlug } from '../../../../utils';

const OverviewTab = ({ formData, errors, onChange, userProfile }) => {
  // Industry options
  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
    'Education', 'Real Estate', 'Hospitality', 'Non-Profit', 'Government',
    'Media & Entertainment', 'Transportation', 'Energy', 'Other'
  ];

  // Service type options
  const serviceTypeOptions = [
    'Web Development', 'Mobile App Development', 'UI/UX Design',
    'Digital Marketing', 'SEO Optimization', 'Brand Strategy',
    'Content Creation', 'E-commerce Solutions', 'Custom Software',
    'Consulting', 'Digital Transformation', 'Other'
  ];

  // Company size options
  const companySizeOptions = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ];

  // Handle title change with auto-slug
  const handleTitleChange = (value) => {
    onChange('title', value);
    
    // Auto-generate slug if new case study
    if (!formData.id && !formData.slug) {
      onChange('slug', generateSlug(value));
    }
  };

  // Team members management
  const addTeamMember = () => {
    onChange('team_members', [...(formData.team_members || []), { name: '', role: '' }]);
  };

  const updateTeamMember = (index, field, value) => {
    const newTeamMembers = [...(formData.team_members || [])];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    onChange('team_members', newTeamMembers);
  };

  const removeTeamMember = (index) => {
    const newTeamMembers = [...(formData.team_members || [])];
    newTeamMembers.splice(index, 1);
    onChange('team_members', newTeamMembers);
  };

  // Deliverables management
  const addDeliverable = () => {
    onChange('deliverables', [...(formData.deliverables || []), '']);
  };

  const updateDeliverable = (index, value) => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables[index] = value;
    onChange('deliverables', newDeliverables);
  };

  const removeDeliverable = (index) => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables.splice(index, 1);
    onChange('deliverables', newDeliverables);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Case Study Title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Enter case study title"
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
            {formData.id && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onChange('slug', generateSlug(formData.title))}
                className="absolute right-2 top-8"
              >
                Regenerate
              </Button>
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Client Information */}
        <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Client Name"
            value={formData.client_name}
            onChange={(e) => onChange('client_name', e.target.value)}
            required
            placeholder="Company or client name"
            error={errors.client_name}
          />
          
          <Input
            label="Client Website"
            value={formData.client_website}
            onChange={(e) => onChange('client_website', e.target.value)}
            placeholder="https://example.com"
            type="url"
            error={errors.client_website}
          />

          <Select
            label="Industry"
            value={formData.client_industry}
            onChange={(value) => onChange('client_industry', value)}
            options={[
              { value: '', label: 'Select industry...' },
              ...industryOptions.map(ind => ({ value: ind, label: ind }))
            ]}
            error={errors.client_industry}
            required
          />

          <Select
            label="Company Size"
            value={formData.client_company_size}
            onChange={(value) => onChange('client_company_size', value)}
            options={[
              { value: '', label: 'Select size...' },
              ...companySizeOptions.map(size => ({ value: size, label: size }))
            ]}
            error={errors.client_company_size}
          />
        </div>

        <Input
          label="Client Logo URL"
          value={formData.client_logo}
          onChange={(e) => onChange('client_logo', e.target.value)}
          placeholder="URL to client's logo"
          error={errors.client_logo}
        />

        <hr className="border-gray-200" />

        {/* Project Details */}
        <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Service Type"
            value={formData.service_type}
            onChange={(value) => onChange('service_type', value)}
            options={[
              { value: '', label: 'Select service...' },
              ...serviceTypeOptions.map(st => ({ value: st, label: st }))
            ]}
            error={errors.service_type}
            required
          />

          <Input
            label="Service Category"
            value={formData.service_category}
            onChange={(e) => onChange('service_category', e.target.value)}
            placeholder="e.g., Development, Design, Marketing"
            error={errors.service_category}
          />

          <Input
            type="date"
            label="Project Start Date"
            value={formData.project_start_date}
            onChange={(e) => onChange('project_start_date', e.target.value)}
            error={errors.project_start_date}
            required
          />

          <Input
            type="date"
            label="Project End Date"
            value={formData.project_end_date}
            onChange={(e) => onChange('project_end_date', e.target.value)}
            error={errors.project_end_date}
          />

          <Input
            label="Project Duration"
            value={formData.project_duration}
            onChange={(e) => onChange('project_duration', e.target.value)}
            placeholder="e.g., 6 months"
            error={errors.project_duration}
          />

          <Input
            label="Project Investment"
            value={formData.project_investment}
            onChange={(e) => onChange('project_investment', e.target.value)}
            placeholder="e.g., $50,000 - $100,000"
            error={errors.project_investment}
          />
        </div>

        {/* Team */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Members
          </label>
          {(formData.team_members || []).map((member, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={member.name}
                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                placeholder="Team member name"
                className="flex-1"
              />
              <Input
                value={member.role}
                onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                placeholder="Role"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTeamMember(index)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addTeamMember}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Deliverables */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deliverables
          </label>
          {(formData.deliverables || []).map((deliverable, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={deliverable}
                onChange={(e) => updateDeliverable(index, e.target.value)}
                placeholder="Deliverable item"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDeliverable(index)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addDeliverable}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Deliverable
          </Button>
        </div>

        {/* Technologies Used */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technologies Used
          </label>
          <input
            type="text"
            value={formData.technologies_used?.join(', ') || ''}
            onChange={(e) => onChange('technologies_used', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            placeholder="React, Node.js, PostgreSQL (comma-separated)"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;