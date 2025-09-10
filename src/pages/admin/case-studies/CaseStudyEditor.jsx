// src/pages/admin/case-studies/CaseStudyEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  EditorModal,
  StatusBadge,
  PreviewModal
} from '../../../components/admin';
import { generateSlug, sanitizeData } from '../../../utils';
import { useFormValidation } from './hooks/useFormValidation';
import { caseStudyOperations } from './services/CaseStudyOperations';
import { useToast } from '../../../components/ui/Toast';

// Import tab components
import OverviewTab from './editor-tabs/OverviewTab';
import ContentTab from './editor-tabs/ContentTab';
import MediaTab from './editor-tabs/MediaTab';
import MetricsTab from './editor-tabs/MetricsTab';
import TeamTab from './editor-tabs/TeamTab';
import SettingsTab from './editor-tabs/SettingsTab';

const CaseStudyEditor = ({
  caseStudy = null,
  userProfile,
  isOpen,
  onClose,
  onSave
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(false);
  
  // Initialize form data
  const initialData = {
    // Basic Info
    title: '',
    slug: '',
    client_name: '',
    client_logo: '',
    client_website: '',
    industry: '',
    service_type: '',
    business_stage: '',
    
    // Media
    hero_image: '',
    hero_video: '',
    gallery: [],
    
    // Content
    description: '',
    challenge: '',
    solution: '',
    implementation: '',
    
    // Timeline
    project_duration: '',
    start_date: '',
    end_date: '',
    
    // Metrics
    key_metrics: [
      { label: '', before: '', after: '', improvement: '', type: 'percentage' }
    ],
    detailed_results: [],
    process_steps: [],
    technologies_used: [],
    deliverables: [],
    
    // Team
    team_members: [],
    project_lead: '',
    testimonial_id: '',
    
    // Settings
    status: 'draft',
    is_featured: false,
    is_confidential: false,
    is_active: true,
    sort_order: 0,
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    
    internal_notes: '',
    ...caseStudy
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

    // Auto-generate slug from title
    if (field === 'title' && !caseStudy) {
      const slug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  }, [clearError, caseStudy]);

  // Handle save
  const handleSave = async () => {
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Validation failed', 'Please fix the errors before saving');
      return false;
    }

    const sanitized = sanitizeData(formData);
    
    // Calculate metrics improvements if not provided
    if (sanitized.key_metrics) {
      sanitized.key_metrics = sanitized.key_metrics.map(metric => {
        if (!metric.improvement && metric.before && metric.after) {
          const before = parseFloat(metric.before.replace(/[^0-9.-]/g, ''));
          const after = parseFloat(metric.after.replace(/[^0-9.-]/g, ''));
          if (!isNaN(before) && !isNaN(after) && before > 0) {
            const improvement = Math.round(((after - before) / before) * 100);
            metric.improvement = `${improvement > 0 ? '+' : ''}${improvement}%`;
          }
        }
        return metric;
      });
    }
    
    let result;
    if (caseStudy?.id) {
      result = await caseStudyOperations.update(caseStudy.id, sanitized);
    } else {
      result = await caseStudyOperations.create(sanitized);
    }

    if (result.success) {
      toast.success(
        caseStudy ? 'Case study updated' : 'Case study created',
        `"${formData.title}" has been saved successfully`
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
      id: 'overview', 
      label: 'Overview',
      errors: getTabErrors('overview', errors)
    },
    { 
      id: 'content', 
      label: 'Content',
      errors: getTabErrors('content', errors)
    },
    { 
      id: 'media', 
      label: 'Media',
      errors: getTabErrors('media', errors)
    },
    { 
      id: 'metrics', 
      label: 'Metrics',
      errors: getTabErrors('metrics', errors)
    },
    { 
      id: 'team', 
      label: 'Team',
      errors: getTabErrors('team', errors)
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
        title={caseStudy ? 'Edit Case Study' : 'New Case Study'}
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
        {activeTab === 'overview' && (
          <OverviewTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'content' && (
          <ContentTab
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
        
        {activeTab === 'metrics' && (
          <MetricsTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'team' && (
          <TeamTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
            userProfile={userProfile}
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
          title={`${formData.client_name} - ${formData.title}`}
        >
          <CaseStudyPreview data={formData} />
        </PreviewModal>
      )}
    </>
  );
};

// Preview Component
const CaseStudyPreview = ({ data }) => {
  return (
    <div className="prose max-w-none">
      {/* Hero Section */}
      {data.hero_image && (
        <img 
          src={data.hero_image} 
          alt={data.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      
      <h1>{data.title}</h1>
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
        <span>{data.client_name}</span>
        <span>•</span>
        <span>{data.industry}</span>
        <span>•</span>
        <span>{data.service_type}</span>
      </div>
      
      {data.description && (
        <div className="lead mb-8">{data.description}</div>
      )}
      
      {/* Challenge */}
      {data.challenge && (
        <div className="mb-8">
          <h2>The Challenge</h2>
          <p>{data.challenge}</p>
        </div>
      )}
      
      {/* Solution */}
      {data.solution && (
        <div className="mb-8">
          <h2>Our Solution</h2>
          <p>{data.solution}</p>
        </div>
      )}
      
      {/* Key Metrics */}
      {data.key_metrics?.length > 0 && (
        <div className="mb-8">
          <h2>Key Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.key_metrics.map((metric, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {metric.improvement || metric.after}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyEditor;