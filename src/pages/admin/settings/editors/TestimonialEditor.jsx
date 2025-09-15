// src/pages/admin/settings/editors/TestimonialEditor.jsx
import React, { useState, useEffect } from 'react';
import { EditorModal } from '../../../../components/admin';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import ImageUpload from '../../../../components/ui/ImageUpload';

const TestimonialEditor = ({ testimonial, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    client_company: '',
    client_avatar: '',
    client_logo: '',
    quote: '',
    long_quote: '',
    rating: 5,
    video_url: '',
    video_thumbnail: '',
    is_featured: false,
    display_locations: [],
    industry: '',
    service_type: '',
    project_value: '',
    sort_order: 0,
    status: 'draft'
  });

  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    } else {
      setFormData({
        client_name: '',
        client_title: '',
        client_company: '',
        client_avatar: '',
        client_logo: '',
        quote: '',
        long_quote: '',
        rating: 5,
        video_url: '',
        video_thumbnail: '',
        is_featured: false,
        display_locations: [],
        industry: '',
        service_type: '',
        project_value: '',
        sort_order: 0,
        status: 'draft'
      });
    }
  }, [testimonial]);

  const handleSubmit = async () => {
    if (!formData.client_name || !formData.quote) {
      alert('Client name and quote are required');
      return false;
    }
    await onSave(formData);
    return true;
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'User' },
    { id: 'content', label: 'Content', icon: 'MessageSquare' },
    { id: 'media', label: 'Media', icon: 'Image' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  return (
    <EditorModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit}
      title={testimonial ? 'Edit Testimonial' : 'New Testimonial'}
      size="lg"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <Input
            label="Client Name"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Title/Position"
              value={formData.client_title}
              onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
            />
            <Input
              label="Company"
              value={formData.client_company}
              onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., Technology, Healthcare"
            />
            <Input
              label="Service Type"
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              placeholder="e.g., Web Development"
            />
          </div>

          <Input
            label="Project Value"
            value={formData.project_value}
            onChange={(e) => setFormData({ ...formData, project_value: e.target.value })}
            placeholder="e.g., $10,000 - $50,000"
          />
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Short Quote (Required)</label>
            <textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              placeholder="Brief testimonial quote..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Extended Quote</label>
            <textarea
              value={formData.long_quote}
              onChange={(e) => setFormData({ ...formData, long_quote: e.target.value })}
              className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              placeholder="Full testimonial content..."
            />
          </div>

          <Select
            label="Rating"
            value={formData.rating}
            onChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
            options={[
              { value: 5, label: '5 Stars' },
              { value: 4, label: '4 Stars' },
              { value: 3, label: '3 Stars' },
              { value: 2, label: '2 Stars' },
              { value: 1, label: '1 Star' }
            ]}
          />

          <Input
            label="Video URL"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      )}

      {activeTab === 'media' && (
        <div className="space-y-4">
          <ImageUpload
            label="Client Avatar"
            value={formData.client_avatar || ''}
            onChange={(value) => setFormData({ ...formData, client_avatar: value })}
            bucket="avatar"
            folder="profiles"
            maxSize={1 * 1024 * 1024}
            optimize={true}
            optimizeOptions={{
              maxWidth: 200,
              maxHeight: 200,
              quality: 0.9
            }}
          />

          <ImageUpload
            label="Company Logo"
            value={formData.client_logo || ''}
            onChange={(value) => setFormData({ ...formData, client_logo: value })}
            bucket="media"
            folder="logos"
            maxSize={2 * 1024 * 1024}
          />

          <ImageUpload
            label="Video Thumbnail"
            value={formData.video_thumbnail || ''}
            onChange={(value) => setFormData({ ...formData, video_thumbnail: value })}
            bucket="media"
            folder="thumbnails"
            maxSize={2 * 1024 * 1024}
          />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' }
            ]}
          />

          <Input
            type="number"
            label="Sort Order"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            description="Lower numbers appear first"
          />

          <Checkbox
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            label="Featured Testimonial"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Display Locations</label>
            <div className="space-y-2">
              {['homepage', 'about', 'services', 'case-studies'].map(location => (
                <Checkbox
                  key={location}
                  checked={formData.display_locations?.includes(location)}
                  onCheckedChange={(checked) => {
                    const locations = formData.display_locations || [];
                    if (checked) {
                      setFormData({ ...formData, display_locations: [...locations, location] });
                    } else {
                      setFormData({ 
                        ...formData, 
                        display_locations: locations.filter(l => l !== location) 
                      });
                    }
                  }}
                  label={location.charAt(0).toUpperCase() + location.slice(1).replace('-', ' ')}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </EditorModal>
  );
};

export default TestimonialEditor;