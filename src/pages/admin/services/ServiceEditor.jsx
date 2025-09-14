// src/pages/admin/services/ServiceEditor.jsx
import React, { useState, useEffect } from 'react';
import { 
  EditorModal,
  PreviewModal
} from '../../../components/admin';
import { generateSlug, sanitizeData } from '../../../utils';
import { useFormValidation } from './hooks/useFormValidation';
import { useAutoSave } from './hooks/useAutoSave';
import { serviceOperations } from './services/ServiceOperations';
import { useToast } from '../../../components/ui/Toast';
import Button from '../../../components/ui/Button';

// Import tab components
import BasicTab from './editor-tabs/BasicTab';
import FeaturesTab from './editor-tabs/FeaturesTab';
import PricingTab from './editor-tabs/PricingTab';
import SEOTab from './editor-tabs/SEOTab';

const ServiceEditor = ({
  service = null,
  userProfile,
  zones = [],
  isOpen,
  onClose,
  onSave
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  
  // Initialize form data
  const initialData = {
    title: service?.title || '',
    slug: service?.slug || '',
    category: service?.category || '',
    zone_id: service?.zone_id || '',
    icon: service?.icon || 'Zap',
    description: service?.description || '',
    full_description: service?.full_description || '',
    features: service?.features || [],
    technologies: service?.technologies || [],
    process_steps: service?.process_steps || [],
    expected_results: service?.expected_results || [],
    pricing_tiers: service?.pricing_tiers || [
      { name: 'Basic', price: '', billing: 'Per month', features: [] },
      { name: 'Pro', price: '', billing: 'Per month', features: [] },
      { name: 'Enterprise', price: 'Custom', billing: 'Contact us', features: [] }
    ],
    is_active: service?.is_active !== false,
    is_featured: service?.is_featured || false,
    meta_title: service?.meta_title || '',
    meta_description: service?.meta_description || '',
    view_count: service?.view_count || 0,
    unique_view_count: service?.unique_view_count || 0,
    inquiry_count: service?.inquiry_count || 0,
    created_at: service?.created_at || null,
    updated_at: service?.updated_at || null
  };

  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  // Form validation
  const { errors, validateForm, clearError, getTabErrors } = useFormValidation();

  // Auto-save functionality (only for existing services)
  const { saveStatus, triggerAutoSave } = useAutoSave(
    formData, 
    service?.id,
    service?.id ? true : false
  );

  // Track dirty state
  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData]);

  // Auto-save trigger
  useEffect(() => {
    if (service?.id && isDirty) {
      const timer = setTimeout(() => {
        triggerAutoSave();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, service?.id, isDirty, triggerAutoSave]);

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title
      if (field === 'title' && !service && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      
      // Auto-generate meta title
      if (field === 'title' && !prev.meta_title) {
        updated.meta_title = value.substring(0, 60);
      }
      
      return updated;
    });
    
    // Clear validation error
    if (validationAttempted) {
      clearError(field);
    }
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setValidationAttempted(true);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      const tabErrors = getTabErrors();
      const firstTabWithErrors = Object.keys(tabErrors).find(tab => 
        tabErrors[tab].length > 0
      );
      
      if (firstTabWithErrors) {
        setActiveTab(firstTabWithErrors);
      }
      
      toast.error('Please fix validation errors');
      setSaving(false);
      return false;
    }

    const sanitized = sanitizeData(formData);
    
    let result;
    if (service?.id) {
      result = await serviceOperations.update(service.id, sanitized, userProfile);
    } else {
      result = await serviceOperations.create(sanitized, userProfile);
    }

    if (result.success) {
      toast.success(
        service ? 'Service updated' : 'Service created',
        `"${formData.title}" has been saved successfully`
      );
      
      if (onSave) {
        await onSave(result.data);
      }
      setSaving(false);
      setValidationAttempted(false);
      return true;
    } else {
      toast.error('Save failed', result.error);
      setSaving(false);
      return false;
    }
  };

  // Tab configuration
  const tabErrors = getTabErrors();
  const tabs = [
    { 
      id: 'basic', 
      label: 'Basic Info',
      icon: 'FileText',
      hasErrors: tabErrors.basic.length > 0,
      errorCount: tabErrors.basic.length
    },
    { 
      id: 'features', 
      label: 'Features',
      icon: 'List',
      hasErrors: tabErrors.features.length > 0,
      errorCount: tabErrors.features.length
    },
    { 
      id: 'pricing', 
      label: 'Pricing',
      icon: 'DollarSign',
      hasErrors: tabErrors.pricing.length > 0,
      errorCount: tabErrors.pricing.length
    },
    { 
      id: 'seo', 
      label: 'SEO & Analytics',
      icon: 'Search',
      hasErrors: tabErrors.seo.length > 0,
      errorCount: tabErrors.seo.length
    }
  ];

  // Modal actions
  const modalActions = [
    {
      label: 'Preview',
      icon: 'Eye',
      onClick: () => setShowPreview(true),
      variant: 'ghost'
    }
  ];

  return (
    <>
      <EditorModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        title={service ? `Edit: ${service.title}` : 'New Service'}
        subtitle={
          saveStatus === 'saving' ? 'Auto-saving...' : 
          saveStatus === 'saved' ? 'All changes saved' : ''
        }
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDirty={isDirty}
        isSaving={saving}
        actions={modalActions}
        showValidationErrors={validationAttempted && Object.keys(errors).length > 0}
      >
        {activeTab === 'basic' && (
          <BasicTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
            onChange={handleFieldChange}
            zones={zones}
          />
        )}
        
        {activeTab === 'features' && (
          <FeaturesTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'pricing' && (
          <PricingTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'seo' && (
          <SEOTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
            onChange={handleFieldChange}
            serviceId={service?.id}
          />
        )}
      </EditorModal>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Service Preview"
          subtitle={`Preview of: ${formData.title || 'Untitled'}`}
        >
          {/* Service preview content */}
          <div className="prose prose-lg max-w-none">
            <h1>{formData.title}</h1>
            <p className="lead">{formData.description}</p>
            {/* Add more preview content */}
          </div>
        </PreviewModal>
      )}
    </>
  );
};

export default ServiceEditor;