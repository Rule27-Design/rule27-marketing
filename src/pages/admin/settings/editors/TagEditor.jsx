// src/pages/admin/settings/editors/TagEditor.jsx
import React, { useState, useEffect } from 'react';
import { EditorModal } from '../../../../components/admin';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';

const TagEditor = ({ tag, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    if (tag) {
      setFormData(tag);
    } else {
      setFormData({
        name: '',
        slug: '',
        type: '',
        description: '',
        is_active: true
      });
    }
  }, [tag]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Tag name is required');
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
      title={tag ? 'Edit Tag' : 'New Tag'}
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Tag Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g., JavaScript"
        />

        <Input
          label="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="auto-generated from name"
          description="URL-friendly version of the name"
        />

        <Select
          label="Type"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          options={[
            { value: '', label: 'General' },
            { value: 'technology', label: 'Technology' },
            { value: 'industry', label: 'Industry' },
            { value: 'service', label: 'Service' },
            { value: 'skill', label: 'Skill' }
          ]}
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
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

export default TagEditor;