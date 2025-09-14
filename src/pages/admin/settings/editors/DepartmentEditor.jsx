// src/pages/admin/settings/editors/DepartmentEditor.jsx
import React, { useState, useEffect } from 'react';
import { EditorModal } from '../../../../components/admin';
import Input from '../../../../components/ui/Input';
import { Checkbox } from '../../../../components/ui/Checkbox';
import IconPicker from '../../../../components/ui/IconPicker';
import ColorPicker from '../../../../components/ui/ColorPicker';

const DepartmentEditor = ({ department, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (department) {
      setFormData(department);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: 'Building',
        color: 'bg-blue-100',
        sort_order: 0,
        is_active: true
      });
    }
  }, [department]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Department name is required');
      return false;
    }
    await onSave(formData);
    return true;
  };

  return (
    <EditorModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit}
      title={department ? 'Edit Department' : 'New Department'}
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Department Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g., Engineering"
        />

        <Input
          label="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="auto-generated from name"
          description="URL-friendly version of the name"
        />

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
            placeholder="Brief description of this department..."
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

        <Input
          type="number"
          label="Sort Order"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          description="Lower numbers appear first"
        />

        <Checkbox
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          label="Active"
        />
      </div>
    </EditorModal>
  );
};

export default DepartmentEditor;