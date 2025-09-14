// src/pages/admin/services/ServiceZonesManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { EditorModal } from '../../../components/admin';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';
import { useToast } from '../../../components/ui/Toast';
import { generateSlug } from '../../../utils';

const ServiceZonesManager = ({ isOpen, onClose, onUpdate }) => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: 'Grid',
    description: '',
    sort_order: 0,
    is_active: true
  });
  const toast = useToast();

  // Available icons for zones
  const zoneIcons = [
    'Grid', 'Layers', 'Box', 'Package', 'Folder',
    'Archive', 'Server', 'Database', 'HardDrive', 'Cpu',
    'Zap', 'Globe', 'Map', 'Navigation', 'Compass',
    'Layout', 'PanelTop', 'Columns', 'Square', 'Circle',
    'Hexagon', 'Triangle', 'Star', 'Heart', 'Flag',
    'Target', 'Award', 'Trophy', 'Shield', 'Lock',
    'Key', 'Settings', 'Wrench', 'Hammer', 'Paintbrush',
    'Palette', 'Camera', 'Image', 'Film', 'Music',
    'Headphones', 'Mic', 'Volume2', 'Wifi', 'Cloud'
  ];

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('service_zones')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setZones(data || []);
    } catch (error) {
      console.error('Error fetching zones:', error);
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.slug && formData.title) {
        formData.slug = generateSlug(formData.title);
      }

      if (editingZone) {
        const { error } = await supabase
          .from('service_zones')
          .update(formData)
          .eq('id', editingZone.id);

        if (error) throw error;
        toast.success('Zone updated');
      } else {
        const { error } = await supabase
          .from('service_zones')
          .insert(formData);

        if (error) throw error;
        toast.success('Zone created');
      }

      await fetchZones();
      resetForm();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving zone:', error);
      toast.error('Failed to save zone');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this zone? Services in this zone will need to be reassigned.')) return;

    try {
      const { error } = await supabase
        .from('service_zones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Zone deleted');
      await fetchZones();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting zone:', error);
      toast.error('Failed to delete zone');
    }
  };

  const resetForm = () => {
    setEditingZone(null);
    setFormData({
      title: '',
      slug: '',
      icon: 'Grid',
      description: '',
      sort_order: 0,
      is_active: true
    });
    setShowIconSelector(false);
  };

  const selectIcon = (iconName) => {
    setFormData({ ...formData, icon: iconName });
    setShowIconSelector(false);
  };

  return (
    <EditorModal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Service Zones"
      size="xl"
    >
      <div className="space-y-6">
        {/* Zone Form */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-4">
            {editingZone ? 'Edit Zone' : 'Add New Zone'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Zone Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated"
            />
            
            {/* Icon Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Icon name={formData.icon} size={20} />
                  <span>{formData.icon}</span>
                  <Icon name="ChevronDown" size={16} className="text-gray-400" />
                </button>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Or type icon name"
                  className="flex-1"
                />
              </div>
              
              {/* Icon Grid Dropdown */}
              {showIconSelector && (
                <div className="absolute z-10 mt-2 p-4 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto">
                  <div className="grid grid-cols-8 gap-2">
                    {zoneIcons.map(iconName => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => selectIcon(iconName)}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          formData.icon === iconName ? 'bg-accent/10 border-accent border' : ''
                        }`}
                        title={iconName}
                      >
                        <Icon name={iconName} size={20} className="mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Input
              label="Sort Order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                rows={3}
                placeholder="Brief description of this service zone..."
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <p className="text-xs text-gray-500">Zone is visible and services can be assigned to it</p>
                </div>
              </label>
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-2">
              {editingZone && (
                <Button variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button variant="primary" onClick={handleSave}>
                {editingZone ? 'Update' : 'Create'} Zone
              </Button>
            </div>
          </div>
        </div>

        {/* Zones List */}
        <div>
          <h3 className="font-medium mb-4">Existing Zones ({zones.length})</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : zones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No zones created yet
            </div>
          ) : (
            <div className="space-y-2">
              {zones.map((zone) => (
                <div key={zone.id} className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon name={zone.icon || 'Grid'} size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{zone.title}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>/{zone.slug}</span>
                        <span>•</span>
                        <span>Order: {zone.sort_order}</span>
                        {zone.service_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{zone.service_count} services</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      zone.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {zone.is_active ? 'Active' : 'Inactive'}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setEditingZone(zone);
                        setFormData(zone);
                      }}
                    >
                      <Icon name="Edit2" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDelete(zone.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EditorModal>
  );
};

export default ServiceZonesManager;