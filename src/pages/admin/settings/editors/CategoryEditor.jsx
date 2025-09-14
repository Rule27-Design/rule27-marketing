// src/pages/admin/settings/editors/CategoryEditor.jsx
import React, { useState, useEffect } from 'react';
import { EditorModal } from '../../../../components/admin';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import IconPicker from '../../../../components/ui/IconPicker';
import ColorPicker from '../../../../components/ui/ColorPicker';

const CategoryEditor = ({ category, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'article',
    icon: '',
    color: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        type: 'article',
        icon: 'Folder',
        color: 'bg-gray-100',
        sort_order: 0,
        is_active: true
      });
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Category name is required');
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
      title={category ? 'Edit Category' : 'New Category'}
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g., Technology"
        />

        <Input
          label="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="auto-generated from name"
          description="URL-friendly version of the name"
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this category"
        />

        <Select
          label="Type"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          options={[
            { value: 'article', label: 'Article' },
            { value: 'resource', label: 'Resource' },
            { value: 'case_study', label: 'Case Study' },
            { value: 'service', label: 'Service' }
          ]}
        />

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

export default CategoryEditor;