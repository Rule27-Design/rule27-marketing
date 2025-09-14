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
    features: [],
    is_active: true,
    is_featured: false,
    sort_order: 0
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [newService, setNewService] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');

  useEffect(() => {
    if (partnership) {
      // Parse features if it's a string
      let parsedFeatures = partnership.features;
      if (typeof partnership.features === 'string') {
        try {
          parsedFeatures = JSON.parse(partnership.features);
        } catch (e) {
          console.error('Failed to parse features:', e);
          parsedFeatures = [];
        }
      }
      
      setFormData({
        ...partnership,
        features: parsedFeatures || [],
        color: partnership.color || 'bg-gray-100'
      });
    } else {
      setFormData({
        slug: '',
        name: '',
        category: '',
        icon: 'Handshake',
        color: 'bg-blue-100',
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
    
    // Ensure features is properly formatted as JSON for storage
    const dataToSave = {
      ...formData,
      features: formData.features // Keep as array, let backend handle stringification if needed
    };
    
    await onSave(dataToSave);
    return true;
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData({
        ...formData,
        services: [...(formData.services || []), newService.trim()]
      });
      setNewService('');
    }
  };

  const removeService = (index) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...(formData.benefits || []), newBenefit.trim()]
      });
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    });
  };

  const addFeature = () => {
    if (newFeatureName.trim() && newFeatureValue.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), { 
          name: newFeatureName.trim(), 
          value: newFeatureValue.trim() 
        }]
      });
      setNewFeatureName('');
      setNewFeatureValue('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
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
            value={formData.category || ''}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={[
              { value: '', label: 'Select Category' },
              { value: 'Development Platform', label: 'Development Platform' },
              { value: 'Cloud Platform', label: 'Cloud Platform' },
              { value: 'Analytics', label: 'Analytics' },
              { value: 'CRM', label: 'CRM' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Security', label: 'Security' },
              { value: 'Other', label: 'Other' }
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
            
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#000000 or bg-blue-100"
              />
            </div>
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
                    addService();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addService}
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
                    onClick={() => removeService(index)}
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
                    addBenefit();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addBenefit}
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
                    onClick={() => removeBenefit(index)}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features / Stats</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                placeholder="Feature name..."
                className="flex-1"
              />
              <Input
                value={newFeatureValue}
                onChange={(e) => setNewFeatureValue(e.target.value)}
                placeholder="Value..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.features || []).map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    <strong>{feature.name}:</strong> {feature.value}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => removeFeature(index)}
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