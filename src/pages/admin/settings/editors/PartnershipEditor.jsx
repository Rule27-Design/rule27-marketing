// src/pages/admin/settings/editors/PartnershipEditor.jsx
import React, { useState, useEffect } from 'react';
import { EditorModal } from '../../../../components/admin';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import IconPicker from '../../../../components/ui/IconPicker';
import ColorPicker from '../../../../components/ui/ColorPicker';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const PartnershipEditor = ({ partnership, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    category: '',
    icon: '',
    color: '',
    description: '',
    services: [],
    certification_count: 0,
    project_count: 0,
    benefits: [],
    features: [], // This is jsonb
    is_active: true,
    is_featured: false,
    sort_order: 0
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [newService, setNewService] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (partnership) {
      setFormData({
        ...partnership,
        features: partnership.features || []
      });
    } else {
      setFormData({
        slug: '',
        name: '',
        category: '',
        icon: '',
        color: '',
        description: '',
        services: [],
        certification_count: 0,
        project_count: 0,
        benefits: [],
        features: [],
        is_active: true,
        is_featured: false,
        sort_order: 0
      });
    }
  }, [partnership]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Partnership name is required');
      return false;
    }
    await onSave(formData);
    return true;
  };

  const addItem = (type, value) => {
    if (value.trim()) {
      if (type === 'features') {
        // Features is jsonb array - store as objects
        const newFeature = { name: value.trim() };
        setFormData({
          ...formData,
          features: [...(formData.features || []), newFeature]
        });
        setNewFeature('');
      } else {
        // Services and benefits are text arrays
        setFormData({
          ...formData,
          [type]: [...(formData[type] || []), value.trim()]
        });
        if (type === 'services') setNewService('');
        if (type === 'benefits') setNewBenefit('');
      }
    }
  };

  const removeItem = (type, index) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index)
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'Info' },
    { id: 'services', label: 'Services', icon: 'Layers' },
    { id: 'benefits', label: 'Benefits & Features', icon: 'Star' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  return (
    <EditorModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit}
      title={partnership ? 'Edit Partnership' : 'New Partnership'}
      size="lg"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <Input
            label="Partnership Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Microsoft Azure"
          />

          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated from name"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={[
              { value: 'cloud', label: 'Cloud Platform' },
              { value: 'analytics', label: 'Analytics' },
              { value: 'crm', label: 'CRM' },
              { value: 'development', label: 'Development Tools' },
              { value: 'security', label: 'Security' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'other', label: 'Other' }
            ]}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              placeholder="Brief description of the partnership..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <IconPicker
              label="Icon"
              value={formData.icon}
              onChange={(value) => setFormData({ ...formData, icon: value })}
            />
            <ColorPicker
              label="Color"
              value={formData.color}
              onChange={(value) => setFormData({ ...formData, color: value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Certifications"
              value={formData.certification_count}
              onChange={(e) => setFormData({ ...formData, certification_count: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              label="Projects Completed"
              value={formData.project_count}
              onChange={(e) => setFormData({ ...formData, project_count: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Services Offered</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add a service..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('services', newService);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('services', newService)}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.services || []).map((service, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{service}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => removeItem('services', index)}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Key Benefits</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('benefits', newBenefit);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('benefits', newBenefit)}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.benefits || []).map((benefit, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{benefit}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => removeItem('benefits', index)}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('features', newFeature);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('features', newFeature)}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.features || []).map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    {typeof feature === 'object' ? feature.name : feature}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => removeItem('features', index)}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <Input
            type="number"
            label="Sort Order"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            description="Lower numbers appear first"
          />

          <Checkbox
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            label="Featured Partnership"
          />

          <Checkbox
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            label="Active"
          />
        </div>
      )}
    </EditorModal>
  );
};

export default PartnershipEditor;