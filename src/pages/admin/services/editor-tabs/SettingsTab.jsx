// src/pages/admin/services/editor-tabs/SettingsTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import Icon from '../../../../components/AdminIcon';
import { cn, formatDate } from '../../../../utils';

const SettingsTab = ({ formData, errors, onChange }) => {
  const [relatedServices, setRelatedServices] = useState([]);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, category')
      .eq('status', 'published')
      .order('name');
    
    setAllServices(data || []);
  };

  // Handle related services
  const addRelatedService = (serviceId) => {
    if (serviceId && !formData.related_services?.includes(serviceId)) {
      onChange('related_services', [...(formData.related_services || []), serviceId]);
    }
  };

  const removeRelatedService = (serviceId) => {
    onChange('related_services', 
      formData.related_services.filter(id => id !== serviceId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Publishing Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Publishing Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status || 'draft'}
              onChange={(value) => onChange('status', value)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <Input
              type="number"
              value={formData.sort_order || 0}
              onChange={(e) => onChange('sort_order', parseInt(e.target.value))}
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Display Settings</h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.is_featured || false}
              onChange={(checked) => onChange('is_featured', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Featured Service</span>
              <p className="text-xs text-gray-500">Display prominently on homepage</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.is_popular || false}
              onChange={(checked) => onChange('is_popular', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Popular Service</span>
              <p className="text-xs text-gray-500">Show "Popular" badge</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <Checkbox
              checked={formData.is_new || false}
              onChange={(checked) => onChange('is_new', checked)}
            />
            <div>
              <span className="text-sm font-medium text-gray-700">New Service</span>
              <p className="text-xs text-gray-500">Show "New" badge</p>
            </div>
          </label>
        </div>
      </div>

      {/* Related Services */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Related Services</h3>
        
        <div className="mb-3">
          <Select
            value=""
            onChange={(value) => addRelatedService(value)}
            options={[
              { value: '', label: 'Select related service...' },
              ...allServices
                .filter(s => 
                  s.id !== formData.id && 
                  !formData.related_services?.includes(s.id)
                )
                .map(service => ({
                  value: service.id,
                  label: `${service.name} (${service.category})`
                }))
            ]}
          />
        </div>
        
        {formData.related_services?.length > 0 && (
          <div className="space-y-2">
            {formData.related_services.map(serviceId => {
              const service = allServices.find(s => s.id === serviceId);
              if (!service) return null;
              
              return (
                <div key={serviceId} className={cn(
                  "flex items-center justify-between p-2 rounded",
                  "bg-gray-50"
                )}>
                  <span className="text-sm">{service.name}</span>
                  <button
                    onClick={() => removeRelatedService(serviceId)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Parent Service */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent Service (Optional)
        </label>
        <Select
          value={formData.parent_service || ''}
          onChange={(value) => onChange('parent_service', value)}
          options={[
            { value: '', label: 'No parent service' },
            ...allServices
              .filter(s => s.id !== formData.id)
              .map(service => ({
                value: service.id,
                label: service.name
              }))
          ]}
        />
        <p className="text-xs text-gray-500 mt-1">
          Make this a sub-service of another service
        </p>
      </div>

      {/* SEO Settings */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">SEO Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <Input
              type="text"
              value={formData.meta_title || ''}
              onChange={(e) => onChange('meta_title', e.target.value)}
              placeholder={formData.name || 'Page title for search engines'}
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_title?.length || 0}/60 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description || ''}
              onChange={(e) => onChange('meta_description', e.target.value)}
              placeholder={formData.short_description || 'Page description for search engines'}
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_description?.length || 0}/160 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <Input
              type="text"
              value={(formData.meta_keywords || []).join(', ')}
              onChange={(e) => {
                const keywords = e.target.value
                  .split(',')
                  .map(k => k.trim())
                  .filter(Boolean);
                onChange('meta_keywords', keywords);
              }}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>

      {/* Open Graph Settings */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Social Media Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Title
            </label>
            <Input
              type="text"
              value={formData.og_title || ''}
              onChange={(e) => onChange('og_title', e.target.value)}
              placeholder={formData.name || 'Title for social media sharing'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Description
            </label>
            <textarea
              value={formData.og_description || ''}
              onChange={(e) => onChange('og_description', e.target.value)}
              placeholder={formData.short_description || 'Description for social media sharing'}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Image
            </label>
            <Input
              type="url"
              value={formData.og_image || ''}
              onChange={(e) => onChange('og_image', e.target.value)}
              placeholder={formData.hero_image || 'Image URL for social sharing'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canonical URL
            </label>
            <Input
              type="url"
              value={formData.canonical_url || ''}
              onChange={(e) => onChange('canonical_url', e.target.value)}
              placeholder="https://example.com/services/service-slug"
            />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Internal Notes</h3>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onChange('internal_notes', e.target.value)}
          placeholder="Notes for internal use only..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Service Stats (Read-only) */}
      {formData.id && (
        <div className={cn(
          "border rounded-lg p-4",
          "bg-gray-50"
        )}>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Service Statistics</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formData.view_count || 0}
              </div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formData.inquiry_count || 0}
              </div>
              <div className="text-xs text-gray-500">Inquiries</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formData.conversion_rate || 0}%
              </div>
              <div className="text-xs text-gray-500">Conversion</div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm border-t pt-4">
            {formData.created_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{formatDate(formData.created_at, 'PPP')}</span>
              </div>
            )}
            
            {formData.updated_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span>{formatDate(formData.updated_at, 'PPP')}</span>
              </div>
            )}
            
            {formData.published_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Published:</span>
                <span>{formatDate(formData.published_at, 'PPP')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;