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
  
  // Initialize form data
  const initialData = {
    // Basic Info
    name: '',
    slug: '',
    category: '',
    zone: '',
    icon: '',
    short_description: '',
    long_description: '',
    value_proposition: '',
    target_audience: '',
    
    // Features
    features: [],
    benefits: [],
    key_features: [],
    
    // Pricing
    pricing_model: 'tiered', // fixed, tiered, custom, subscription
    starting_price: null,
    pricing_unit: '',
    pricing_tiers: [],
    custom_pricing_note: '',
    payment_terms: '',
    
    // Process
    process_steps: [],
    timeline: '',
    deliverables: [],
    
    // Media
    hero_image: '',
    hero_video: '',
    gallery: [],
    tools_used: [],
    technologies: [],
    integrations: [],
    
    // FAQs
    faqs: [],
    
    // Settings
    status: 'draft',
    is_featured: false,
    is_popular: false,
    is_new: false,
    sort_order: 0,
    parent_service: null,
    related_services: [],
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    
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

    // Update starting price based on pricing tiers
    if (field === 'pricing_tiers' && value?.length > 0) {
      const lowestPrice = Math.min(...value.map(tier => tier.price).filter(p => p > 0));
      setFormData(prev => ({
        ...prev,
        starting_price: lowestPrice
      }));
    }
  }, [clearError, service]);

  // Handle save
  const handleSave = async () => {
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Validation failed', 'Please fix the errors before saving');
      
      // Switch to first tab with errors
      const tabsWithErrors = ['basic', 'features', 'pricing', 'process', 'media', 'faq', 'settings'];
      for (const tab of tabsWithErrors) {
        if (getTabErrors(tab, validationErrors).length > 0) {
          setActiveTab(tab);
          break;
        }
      }
      return false;
    }

    const sanitized = sanitizeData(formData);
    
    // Calculate service metrics
    if (sanitized.pricing_tiers?.length > 0) {
      sanitized.starting_price = Math.min(...sanitized.pricing_tiers.map(t => t.price));
      sanitized.tier_count = sanitized.pricing_tiers.length;
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
          },
          service?.id && {
            label: 'Duplicate',
            icon: 'Copy',
            onClick: async () => {
              const result = await serviceOperations.duplicate(service.id);
              if (result.success) {
                toast.success('Service duplicated');
                onSave && onSave(result.data);
              }
            },
            variant: 'ghost'
          }
        ].filter(Boolean)}
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
      {/* Hero Section */}
      {data.hero_image && (
        <img 
          src={data.hero_image} 
          alt={data.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-4">
        {data.icon && (
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <span className="text-2xl">{data.icon}</span>
          </div>
        )}
        <div>
          <h1 className="m-0">{data.name}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{data.category}</span>
            {data.zone && (
              <>
                <span>•</span>
                <span>{data.zone}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {data.short_description && (
        <div className="lead text-lg text-gray-600 mb-6">
          {data.short_description}
        </div>
      )}
      
      {/* Value Proposition */}
      {data.value_proposition && (
        <div className="bg-accent/5 p-6 rounded-lg mb-8">
          <h3 className="mt-0">Why Choose This Service?</h3>
          <p>{data.value_proposition}</p>
        </div>
      )}
      
      {/* Features */}
      {data.key_features?.length > 0 && (
        <div className="mb-8">
          <h2>Key Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.key_features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <div className="font-medium">{feature.title}</div>
                  {feature.description && (
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Pricing Tiers */}
      {data.pricing_tiers?.length > 0 && (
        <div className="mb-8">
          <h2>Pricing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.pricing_tiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`border rounded-lg p-6 ${tier.is_popular ? 'border-accent bg-accent/5' : ''}`}
              >
                {tier.is_popular && (
                  <div className="text-xs bg-accent text-white px-2 py-1 rounded-full inline-block mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className="mt-0">{tier.name}</h3>
                <div className="text-3xl font-bold mb-2">
                  ${tier.price}
                  {tier.billing_period && (
                    <span className="text-sm text-gray-500">/{tier.billing_period}</span>
                  )}
                </div>
                {tier.description && (
                  <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                )}
                {tier.features?.length > 0 && (
                  <ul className="space-y-2">
                    {tier.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Process Steps */}
      {data.process_steps?.length > 0 && (
        <div className="mb-8">
          <h2>Our Process</h2>
          <div className="space-y-4">
            {data.process_steps.map((step, idx) => (
              <div key={idx} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-medium mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.duration && (
                    <span className="text-xs text-gray-500">Duration: {step.duration}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceEditor;