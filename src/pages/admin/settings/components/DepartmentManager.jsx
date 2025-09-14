// src/pages/admin/settings/components/DepartmentManager.jsx
import React, { useState } from 'react';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { settingsOperations } from '../services/SettingsOperations';
import DepartmentEditor from '../editors/DepartmentEditor';
import { useToast } from '../../../../components/ui/Toast';

const DepartmentManager = ({ departments, userProfile, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const toast = useToast();

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingDepartment(null);
    setShowEditor(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingDepartment) {
        await settingsOperations.updateDepartment(editingDepartment.id, data);
        toast.success('Department updated successfully');
      } else {
        await settingsOperations.createDepartment(data);
        toast.success('Department created successfully');
      }
      setShowEditor(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to save department', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department? This may affect user profiles.')) return;
    
    try {
      await settingsOperations.deleteDepartment(id);
      toast.success('Department deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete department', error.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-heading-bold text-lg uppercase">Departments</h2>
            <p className="text-sm text-gray-600 mt-1">Organize your team structure</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreate}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Department
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {departments.map((dept) => (
            <div key={dept.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {dept.icon && (
                    <div className={`p-2 rounded-lg ${dept.color || 'bg-gray-100'}`}>
                      <Icon name={dept.icon} size={20} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{dept.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{dept.slug}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  dept.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {dept.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {dept.description && (
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Order: {dept.sort_order || 0}</span>
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleEdit(dept)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDelete(dept.id)}
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
        <DepartmentEditor
          department={editingDepartment}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default DepartmentManager;