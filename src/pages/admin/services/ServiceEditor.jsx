// src/pages/admin/services/ServiceEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  EditorModal,
  StatusBadge,
  PreviewModal
} from '../../../components/admin';
import { generateSlug, sanitizeData } from '../../../utils';
import { useFormValidation } from './hooks/useFormValidation';
import { serviceOperations } from './services/ServiceOperations';
import { useToast } from '../../../components/ui/Toast';

// Import tab components
import BasicInfoTab from './editor-tabs/BasicInfoTab';
import FeaturesTab from './editor-tabs/FeaturesTab';
import PricingTab from './editor-tabs/PricingTab';
import ProcessTab from './editor-tabs/ProcessTab';
import MediaTab from './editor-tabs/MediaTab';
import FAQTab from './editor-tabs/FAQTab';
import SettingsTab from './editor-tabs/SettingsTab';

const ServiceEditor = ({
  service = null,
  userProfile,
  isOpen,
  onClose,
  onSave
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  
  // Initialize form data with comprehensive defaults
  const initialData = {
    // Basic Info
    name: '',
    slug: '',
    category: '',
    short_description: '',
    long_description: '',
    icon: '',
    hover_icon: '',
    featured_icon: '',
    accent_color: '#5B4FE5',
    
    // Features & Benefits
    features: [],
    benefits: [],
    key_features: [],
    unique_selling_points: [],
    
    // Pricing
    pricing_model: 'tiered', // tiered | fixed | custom | subscription
    pricing_tiers: [],
    starting_price: null,
    custom_pricing_note: '',
    
    // Process
    process_steps: [],
    timeline: '',
    
    // Media
    hero_image: '',
    hero_video: '',
    gallery: [],
    
    // Tools & Technologies
    tools_used: [],
    technologies: [],
    integrations: [],
    
    // FAQs
    faqs: [],
    
    // Related
    related_services: [],
    parent_service: null,
    
    // Settings
    status: 'draft',
    is_featured: false,
    is_popular: false,
    is_new: false,
    sort_order: 0,
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    
    // Stats (read-only)
    view_count: 0,
    inquiry_count: 0,
    conversion_rate: 0,
    
    internal_notes: '',
    ...service
  };

  const [formData, setFormData] = useState(initialData);

  // Form validation
  const { errors, validateForm, clearError, getTabErrors } = useFormValidation();

  // Handle field changes
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    clearError(field);

    // Auto-generate slug from name
    if (field === 'name' && !service) {
      const slug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  }, [clearError, service]);

  // Handle save
  const handleSave = async () => {
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Validation failed', 'Please fix the errors before saving');
      return false;
    }

    const sanitized = sanitizeData(formData);
    
    // Calculate starting price from tiers
    if (sanitized.pricing_tiers?.length > 0) {
      sanitized.starting_price = Math.min(...sanitized.pricing_tiers.map(t => t.price));
    }
    
    let result;
    if (service?.id) {
      result = await serviceOperations.update(service.id, sanitized);
    } else {
      result = await serviceOperations.create(sanitized);
    }

    if (result.success) {
      toast.success(
        service ? 'Service updated' : 'Service created',
        `"${formData.name}" has been saved successfully`
      );
      
      if (onSave) {
        await onSave(result.data);
      }
      return true;
    } else {
      toast.error('Save failed', result.error);
      return false;
    }
  };

  // Tab configuration
  const tabs = [
    { 
      id: 'basic', 
      label: 'Basic Info',
      errors: getTabErrors('basic', errors)
    },
    { 
      id: 'features', 
      label: 'Features',
      errors: getTabErrors('features', errors)
    },
    { 
      id: 'pricing', 
      label: 'Pricing',
      errors: getTabErrors('pricing', errors)
    },
    { 
      id: 'process', 
      label: 'Process',
      errors: getTabErrors('process', errors)
    },
    { 
      id: 'media', 
      label: 'Media',
      errors: getTabErrors('media', errors)
    },
    { 
      id: 'faq', 
      label: 'FAQs',
      errors: getTabErrors('faq', errors)
    },
    { 
      id: 'settings', 
      label: 'Settings',
      errors: getTabErrors('settings', errors)
    }
  ];

  return (
    <>
      <EditorModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        title={service ? 'Edit Service' : 'New Service'}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDirty={JSON.stringify(formData) !== JSON.stringify(initialData)}
        actions={[
          {
            label: 'Preview',
            icon: 'Eye',
            onClick: () => setShowPreview(true),
            variant: 'ghost'
          }
        ]}
      >
        {activeTab === 'basic' && (
          <BasicInfoTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'features' && (
          <FeaturesTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'pricing' && (
          <PricingTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'process' && (
          <ProcessTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'media' && (
          <MediaTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'faq' && (
          <FAQTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
      </EditorModal>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={formData.name || 'Service Preview'}
        >
          <ServicePreview data={formData} />
        </PreviewModal>
      )}
    </>
  );
};

// Preview Component
const ServicePreview = ({ data }) => {
  return (
    <div className="prose max-w-none">
      <div className="flex items-center space-x-4 mb-6">
        {data.icon && (
          <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name={data.icon} size={32} className="text-accent" />
          </div>
        )}
        <div>
          <h1 className="mb-0">{data.name}</h1>
          <p className="text-gray-600 mt-1">{data.short_description}</p>
        </div>
      </div>
      
      {data.long_description && (
        <div className="mb-8">{data.long_description}</div>
      )}
      
      {/* Features */}
      {data.features?.length > 0 && (
        <div className="mb-8">
          <h2>Features</h2>
          <ul>
            {data.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Pricing */}
      {data.pricing_tiers?.length > 0 && (
        <div className="mb-8">
          <h2>Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.pricing_tiers.map((tier, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h3 className="text-lg">{tier.name}</h3>
                <div className="text-2xl font-bold mt-2">
                  ${tier.price.toLocaleString()}
                  {tier.billing_period && <span className="text-sm">/{tier.billing_period}</span>}
                </div>
                <ul className="mt-4 text-sm space-y-1">
                  {tier.features?.map((feature, fidx) => (
                    <li key={fidx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceEditor;