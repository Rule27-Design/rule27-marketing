// src/pages/admin/settings/components/CategoryManager.jsx
import React, { useState } from 'react';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { settingsOperations } from '../services/SettingsOperations';
import CategoryEditor from '../editors/CategoryEditor';
import { useToast } from '../../../../components/ui/Toast';

const CategoryManager = ({ categories, userProfile, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const toast = useToast();

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowEditor(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingCategory) {
        await settingsOperations.updateCategory(editingCategory.id, data);
        toast.success('Category updated successfully');
      } else {
        await settingsOperations.createCategory(data);
        toast.success('Category created successfully');
      }
      setShowEditor(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to save category', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await settingsOperations.deleteCategory(id);
      toast.success('Category deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete category', error.message);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'resource': return 'bg-green-100 text-green-800';
      case 'case_study': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-heading-bold text-lg uppercase">Content Categories</h2>
            <p className="text-sm text-gray-600 mt-1">Organize your content with categories</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreate}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Category
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {category.icon && (
                        <div className={`p-1.5 rounded ${category.color || 'bg-gray-100'}`}>
                          <Icon name={category.icon} size={16} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{category.name}</p>
                        {category.description && (
                          <p className="text-xs text-gray-500">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{category.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(category.type)}`}>
                      {category.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">{category.sort_order || 0}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleEdit(category)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEditor && (
        <CategoryEditor
          category={editingCategory}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default CategoryManager;