// src/pages/admin/settings/components/TestimonialManager.jsx
import React, { useState } from 'react';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { settingsOperations } from '../services/SettingsOperations';
import TestimonialEditor from '../editors/TestimonialEditor';
import { useToast } from '../../../../components/ui/Toast';

const TestimonialManager = ({ testimonials, userProfile, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const toast = useToast();

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingTestimonial(null);
    setShowEditor(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingTestimonial) {
        await settingsOperations.updateTestimonial(editingTestimonial.id, data);
        toast.success('Testimonial updated successfully');
      } else {
        await settingsOperations.createTestimonial(data);
        toast.success('Testimonial created successfully');
      }
      setShowEditor(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to save testimonial', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await settingsOperations.deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete testimonial', error.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-heading-bold text-lg uppercase">Testimonials</h2>
            <p className="text-sm text-gray-600 mt-1">Client testimonials and reviews</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreate}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Testimonial
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {testimonial.client_avatar ? (
                    <img 
                      src={testimonial.client_avatar} 
                      alt={testimonial.client_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{testimonial.client_name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.client_title}
                      {testimonial.client_company && ` at ${testimonial.client_company}`}
                    </p>
                  </div>
                </div>
                {testimonial.is_featured && (
                  <Icon name="Star" size={16} className="text-yellow-500" />
                )}
              </div>
              
              <p className="text-sm text-gray-700 italic mb-4 line-clamp-3">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {testimonial.rating && (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Icon 
                          key={i} 
                          name="Star" 
                          size={14} 
                          className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    testimonial.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : testimonial.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {testimonial.status || 'draft'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDelete(testimonial.id)}
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
        <TestimonialEditor
          testimonial={editingTestimonial}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default TestimonialManager;