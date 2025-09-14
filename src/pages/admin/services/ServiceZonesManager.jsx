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
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: 'Grid',
    description: '',
    sort_order: 0,
    is_active: true
  });
  const toast = useToast();

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
            
            <Input
              label="Icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
            
            <Input
              label="Sort Order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
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
          <h3 className="font-medium mb-4">Existing Zones</h3>
          
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
                <div key={zone.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name={zone.icon || 'Grid'} size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{zone.title}</p>
                      <p className="text-sm text-gray-500">{zone.slug}</p>
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
                      <Icon name="Edit" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDelete(zone.id)}
                      className="text-red-500"
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