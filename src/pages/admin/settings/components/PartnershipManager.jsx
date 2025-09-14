// src/pages/admin/settings/components/PartnershipManager.jsx
import React, { useState } from 'react';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { settingsOperations } from '../services/SettingsOperations';
import PartnershipEditor from '../editors/PartnershipEditor';
import { useToast } from '../../../../components/ui/Toast';

const PartnershipManager = ({ partnerships, userProfile, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPartnership, setEditingPartnership] = useState(null);
  const toast = useToast();

  const handleEdit = (partnership) => {
    setEditingPartnership(partnership);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingPartnership(null);
    setShowEditor(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingPartnership) {
        await settingsOperations.updatePartnership(editingPartnership.id, data);
        toast.success('Partnership updated successfully');
      } else {
        await settingsOperations.createPartnership(data);
        toast.success('Partnership created successfully');
      }
      setShowEditor(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to save partnership', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this partnership?')) return;
    
    try {
      await settingsOperations.deletePartnership(id);
      toast.success('Partnership deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete partnership', error.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-heading-bold text-lg uppercase">Technology Partnerships</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your technology partnerships and integrations</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreate}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Partnership
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {partnerships.map((partnership) => (
            <div key={partnership.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {partnership.icon && (
                    <div className={`p-2 rounded-lg ${partnership.color || 'bg-gray-100'}`}>
                      <Icon name={partnership.icon} size={20} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{partnership.name}</h3>
                    <p className="text-xs text-gray-500">{partnership.category}</p>
                  </div>
                </div>
                {partnership.is_featured && (
                  <Icon name="Star" size={16} className="text-yellow-500" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {partnership.description}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Award" size={12} />
                  <span>{partnership.certification_count || 0} Certs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Briefcase" size={12} />
                  <span>{partnership.project_count || 0} Projects</span>
                </div>
              </div>

              {partnership.services && partnership.services.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {partnership.services.slice(0, 3).map((service, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {service}
                    </span>
                  ))}
                  {partnership.services.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      +{partnership.services.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  partnership.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {partnership.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleEdit(partnership)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDelete(partnership.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditor && (
        <PartnershipEditor
          partnership={editingPartnership}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default PartnershipManager;