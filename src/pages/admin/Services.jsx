// src/pages/admin/Services.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AdminIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const Services = () => {
  const { userProfile } = useOutletContext();
  const [services, setServices] = useState([]);
  const [serviceZones, setServiceZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // list, zones
  
  // Service form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    zone_id: '',
    icon: 'Zap',
    description: '',
    full_description: '',
    features: [''],
    technologies: [''],
    pricing_tiers: [
      { name: 'Basic', price: '', billing: 'Per month', features: [''] },
      { name: 'Pro', price: '', billing: 'Per month', features: [''] },
      { name: 'Enterprise', price: 'Custom', billing: 'Contact us', features: [''] }
    ],
    process_steps: [],
    expected_results: [],
    is_active: true,
    is_featured: false,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchServices();
    fetchServiceZones();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          zone:service_zones!zone_id(
            id,
            slug,
            title,
            icon
          )
        `)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceZones = async () => {
    try {
      const { data, error } = await supabase
        .from('service_zones')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServiceZones(data || []);
    } catch (error) {
      console.error('Error fetching service zones:', error);
    }
  };

  const handleSaveService = async () => {
    try {
      // Generate slug if not provided
      if (!formData.slug && formData.title) {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      // Clean up arrays - remove empty strings
      const serviceData = {
        ...formData,
        features: formData.features.filter(Boolean),
        technologies: formData.technologies.filter(Boolean),
        pricing_tiers: formData.pricing_tiers.map(tier => ({
          ...tier,
          features: tier.features.filter(Boolean)
        })),
        updated_by: userProfile.id
      };

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        // Create new service
        serviceData.created_by = userProfile.id;
        const { error } = await supabase
          .from('services')
          .insert(serviceData);

        if (error) throw error;
      }

      // Refresh services list
      await fetchServices();
      setShowEditor(false);
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service: ' + error.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service: ' + error.message);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleAddArrayItem = (field, index = null) => {
    const newData = { ...formData };
    if (index !== null) {
      // For nested arrays like pricing tiers features
      newData.pricing_tiers[index].features.push('');
    } else {
      // For top-level arrays
      newData[field].push('');
    }
    setFormData(newData);
  };

  const handleRemoveArrayItem = (field, index, subIndex = null) => {
    const newData = { ...formData };
    if (subIndex !== null) {
      // For nested arrays
      newData.pricing_tiers[index].features.splice(subIndex, 1);
    } else {
      // For top-level arrays
      newData[field].splice(index, 1);
    }
    setFormData(newData);
  };

  const handleArrayItemChange = (field, index, value, subField = null, subIndex = null) => {
    const newData = { ...formData };
    if (subField && subIndex !== null) {
      // For nested arrays like pricing tier features
      newData[field][index][subField][subIndex] = value;
    } else if (subField) {
      // For object fields within arrays
      newData[field][index][subField] = value;
    } else {
      // For simple arrays
      newData[field][index] = value;
    }
    setFormData(newData);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: '',
      zone_id: '',
      icon: 'Zap',
      description: '',
      full_description: '',
      features: [''],
      technologies: [''],
      pricing_tiers: [
        { name: 'Basic', price: '', billing: 'Per month', features: [''] },
        { name: 'Pro', price: '', billing: 'Per month', features: [''] },
        { name: 'Enterprise', price: 'Custom', billing: 'Contact us', features: [''] }
      ],
      process_steps: [],
      expected_results: [],
      is_active: true,
      is_featured: false,
      meta_title: '',
      meta_description: ''
    });
  };

  // Group services by zone
  const servicesByZone = serviceZones.map(zone => ({
    ...zone,
    services: services.filter(service => service.zone_id === zone.id)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading-bold uppercase">Services Management</h1>
          <Button
            variant="default"
            onClick={() => setShowEditor(true)}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            New Service
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'list' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'zones' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            By Zone
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'list' ? (
        /* Services List */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiries
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Icon name={service.icon || 'Zap'} size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{service.title}</p>
                          <p className="text-xs text-gray-500">{service.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-lg bg-gray-100">
                        {service.zone?.title || 'No Zone'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {service.category}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(service.id, service.is_active)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          service.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {service.view_count || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {service.inquiry_count || 0}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setEditingService(service);
                          setFormData(service);
                          setShowEditor(true);
                        }}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      
                      {userProfile?.role === 'admin' && (
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Services by Zone */
        <div className="space-y-6">
          {servicesByZone.map((zone) => (
            <div key={zone.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon name={zone.icon || 'Zap'} size={24} className="text-accent" />
                  <div>
                    <h3 className="text-lg font-heading-bold uppercase">{zone.title}</h3>
                    <p className="text-sm text-gray-600">{zone.services.length} services</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFormData({ ...formData, zone_id: zone.id });
                    setShowEditor(true);
                  }}
                  iconName="Plus"
                >
                  Add Service
                </Button>
              </div>
              
              {zone.services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {zone.services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <Icon name={service.icon || 'Zap'} size={20} className="text-gray-400" />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          service.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{service.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{service.view_count || 0} views</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setFormData(service);
                              setShowEditor(true);
                            }}
                            className="text-accent hover:text-accent/80"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No services in this zone yet</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Service Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-heading-bold uppercase">
                {editingService ? 'Edit Service' : 'New Service'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingService(null);
                  resetForm();
                }}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Service Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                
                <Input
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Service Zone"
                  value={formData.zone_id}
                  onChange={(value) => setFormData({ ...formData, zone_id: value })}
                  options={serviceZones.map(zone => ({ 
                    value: zone.id, 
                    label: zone.title 
                  }))}
                />

                <Input
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Design, Development, Marketing"
                />
              </div>

              <Input
                label="Short Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description for listings"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                  placeholder="Detailed service description..."
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleArrayItemChange('features', index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveArrayItem('features', index)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddArrayItem('features')}
                  iconName="Plus"
                >
                  Add Feature
                </Button>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2">Technologies</label>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={tech}
                      onChange={(e) => handleArrayItemChange('technologies', index, e.target.value)}
                      placeholder="Technology name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveArrayItem('technologies', index)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddArrayItem('technologies')}
                  iconName="Plus"
                >
                  Add Technology
                </Button>
              </div>

              {/* Pricing Tiers */}
              <div>
                <label className="block text-sm font-medium mb-4">Pricing Tiers</label>
                <div className="space-y-4">
                  {formData.pricing_tiers.map((tier, tierIndex) => (
                    <div key={tierIndex} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <Input
                          label="Tier Name"
                          value={tier.name}
                          onChange={(e) => handleArrayItemChange('pricing_tiers', tierIndex, e.target.value, 'name')}
                        />
                        <Input
                          label="Price"
                          value={tier.price}
                          onChange={(e) => handleArrayItemChange('pricing_tiers', tierIndex, e.target.value, 'price')}
                        />
                        <Input
                          label="Billing"
                          value={tier.billing}
                          onChange={(e) => handleArrayItemChange('pricing_tiers', tierIndex, e.target.value, 'billing')}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Features</label>
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2 mt-1">
                            <Input
                              value={feature}
                              onChange={(e) => handleArrayItemChange('pricing_tiers', tierIndex, e.target.value, 'features', featureIndex)}
                              placeholder="Tier feature"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveArrayItem('pricing_tiers', tierIndex, featureIndex)}
                            >
                              <Icon name="X" size={14} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleAddArrayItem('pricing_tiers', tierIndex)}
                          className="mt-2"
                        >
                          + Add Feature
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-6">
                <Checkbox
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  label="Active"
                  description="Service is visible to users"
                />
                
                <Checkbox
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  label="Featured"
                  description="Highlight this service"
                />
              </div>

              {/* SEO Fields */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <Input
                    label="Meta Title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  />
                  
                  <Input
                    label="Meta Description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditor(false);
                  setEditingService(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveService}
                className="bg-accent hover:bg-accent/90"
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;