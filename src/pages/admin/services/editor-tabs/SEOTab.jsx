// src/pages/admin/services/editor-tabs/SEOTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AdminIcon';

const SEOTab = ({ formData, errors, onChange, serviceId }) => {
  return (
    <div className="space-y-6">
      {/* SEO Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        
        <div className="space-y-4">
          <Input
            label="Meta Title"
            value={formData.meta_title}
            onChange={(e) => onChange('meta_title', e.target.value)}
            placeholder={formData.title || "SEO optimized title (60 chars max)"}
            error={errors.meta_title}
            maxLength={60}
          />
          <div className="text-xs text-gray-500">
            {formData.meta_title?.length || 0} / 60 characters
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => onChange('meta_description', e.target.value)}
              placeholder={formData.description || "SEO description (155-160 characters)"}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent ${
                errors.meta_description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              maxLength={160}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formData.meta_description?.length || 0} / 160 characters</span>
              {errors.meta_description && (
                <span className="text-red-500">{errors.meta_description}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {serviceId && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Icon name="Eye" size={20} className="text-blue-500" />
                <span className="text-2xl font-bold">{formData.view_count || 0}</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">Total Views</div>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Icon name="Users" size={20} className="text-green-500" />
                <span className="text-2xl font-bold">{formData.unique_view_count || 0}</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">Unique Views</div>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Icon name="MessageCircle" size={20} className="text-purple-500" />
                <span className="text-2xl font-bold">{formData.inquiry_count || 0}</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">Inquiries</div>
            </div>
          </div>

          {/* Conversion Rate */}
          {formData.view_count > 0 && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                <span className="text-lg font-bold text-accent">
                  {((formData.inquiry_count / formData.view_count) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full"
                  style={{ width: `${Math.min(100, (formData.inquiry_count / formData.view_count) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEO Preview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Search Engine Preview</h3>
        
        <div className="bg-white border rounded-lg p-4">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {formData.meta_title || formData.title || 'Service Title'}
          </div>
          <div className="text-green-700 text-sm mt-1">
            www.rule27design.com/services/{formData.slug || 'service-slug'}
          </div>
          <div className="text-gray-600 text-sm mt-2">
            {formData.meta_description || formData.description || 'Service description will appear here...'}
          </div>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">SEO Optimization Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep meta titles between 50-60 characters</li>
          <li>• Meta descriptions should be 155-160 characters</li>
          <li>• Include primary keywords naturally in both</li>
          <li>• Make each service page's meta data unique</li>
          <li>• Focus on user intent and value proposition</li>
        </ul>
      </div>
    </div>
  );
};

export default SEOTab;