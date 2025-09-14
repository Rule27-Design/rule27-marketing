// src/pages/admin/settings/components/TagManager.jsx
import React, { useState } from 'react';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { settingsOperations } from '../services/SettingsOperations';
import TagEditor from '../editors/TagEditor';
import { useToast } from '../../../../components/ui/Toast';

const TagManager = ({ tags, userProfile, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const toast = useToast();

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingTag(null);
    setShowEditor(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingTag) {
        await settingsOperations.updateTag(editingTag.id, data);
        toast.success('Tag updated successfully');
      } else {
        await settingsOperations.createTag(data);
        toast.success('Tag created successfully');
      }
      setShowEditor(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to save tag', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      await settingsOperations.deleteTag(id);
      toast.success('Tag deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete tag', error.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-heading-bold text-lg uppercase">Tags</h2>
            <p className="text-sm text-gray-600 mt-1">Organize content with tags</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreate}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Tag
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {tags.map((tag) => (
            <div key={tag.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium">{tag.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{tag.slug}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tag.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tag.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {tag.description && (
                <p className="text-sm text-gray-600 mb-3">{tag.description}</p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Used {tag.usage_count || 0} times
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleEdit(tag)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDelete(tag.id)}
                    className="text-red-600"
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
        <TagEditor
          tag={editingTag}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default TagManager;