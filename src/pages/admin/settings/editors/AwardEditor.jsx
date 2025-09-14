// src/pages/admin/settings/editors/AwardEditor.jsx
import React, { useState, useEffect } from 'react';
import { EditorModal } from '../../../../components/admin';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import IconPicker from '../../../../components/ui/IconPicker';
import ColorPicker from '../../../../components/ui/ColorPicker';

const AwardEditor = ({ award, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: new Date().getFullYear().toString(),
    category: '',
    description: '',
    icon: '',
    color: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (award) {
      setFormData(award);
    } else {
      setFormData({
        title: '',
        organization: '',
        year: new Date().getFullYear().toString(),
        category: '',
        description: '',
        icon: 'Award',
        color: 'bg-yellow-100',
        sort_order: 0,
        is_active: true
      });
    }
  }, [award]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.organization || !formData.year) {
      alert('Title, organization, and year are required');
      return false;
    }
    await onSave(formData);
    return true;
  };

  // Generate year options (last 20 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

  return (
    <EditorModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit}
      title={award ? 'Edit Award' : 'New Award'}
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Award Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="e.g., Best Digital Agency"
        />

        <Input
          label="Awarding Organization"
          value={formData.organization}
          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          required
          placeholder="e.g., Web Design Awards"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Year"
            value={formData.year}
            onChange={(value) => setFormData({ ...formData, year: value })}
            options={yearOptions}
            required
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={[
              { value: 'design', label: 'Design' },
              { value: 'development', label: 'Development' },
              { value: 'innovation', label: 'Innovation' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'service', label: 'Service Excellence' },
              { value: 'leadership', label: 'Leadership' },
              { value: 'certification', label: 'Certification' },
              { value: 'other', label: 'Other' }
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
            placeholder="Brief description of the award..."
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

export default AwardEditor;