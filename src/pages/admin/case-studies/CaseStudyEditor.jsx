// src/pages/admin/case-studies/CaseStudyEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  EditorModal,
  StatusBadge,
  PreviewModal
} from '../../../components/admin';
import { generateSlug, sanitizeData } from '../../../utils';
import { useFormValidation } from './hooks/useFormValidation';
import { useAutoSave } from './hooks/useAutoSave';
import { caseStudyOperations } from './services/CaseStudyOperations';
import { useToast } from '../../../components/ui/Toast';
import Icon from '../../../components/AdminIcon';
import Button from '../../../components/ui/Button';

// Import tab components
import OverviewTab from './editor-tabs/OverviewTab';
import ResultsTab from './editor-tabs/ResultsTab';
import MediaTab from './editor-tabs/MediaTab';
import DetailsTab from './editor-tabs/DetailsTab';
import AnalyticsTab from './editor-tabs/AnalyticsTab';

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
  const [saving, setSaving] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  
  // Initialize form data
  const initialData = {
    title: '',
    slug: '',
    client_name: '',
    client_logo: '',
    client_website: '',
    client_industry: '',
    client_company_size: '',
    project_duration: '',
    project_start_date: '',
    project_end_date: '',
    project_investment: '',
    service_type: '',
    service_category: '',
    deliverables: [],
    technologies_used: [],
    team_size: null,
    team_members: [],
    challenge: '',
    solution: '',
    implementation_process: '',
    key_metrics: [],
    results_narrative: '',
    testimonial_id: null,
    hero_image: '',
    hero_video: '',
    gallery_images: [],
    status: 'draft',
    is_featured: false,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    internal_notes: '',
    view_count: 0,
    inquiry_count: 0,
    ...caseStudy
  };

  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  // Form validation
  const { errors, validateForm, clearError, getTabErrors } = useFormValidation();

  // Auto-save functionality (only for existing case studies)
  const { saveStatus, triggerAutoSave } = useAutoSave(
    formData, 
    caseStudy?.id,
    caseStudy?.id ? true : false
  );

  // Fetch testimonials for selection
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, client_name, client_title, company_name')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  // Track dirty state
  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData]);

  // Auto-save trigger for existing case studies
  useEffect(() => {
    if (caseStudy?.id && isDirty) {
      const timer = setTimeout(() => {
        triggerAutoSave();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, caseStudy?.id, isDirty, triggerAutoSave]);

  // Handle field changes
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title for new case studies
      if (field === 'title' && !caseStudy && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      
      // Auto-generate meta title if empty
      if (field === 'title' && !prev.meta_title) {
        updated.meta_title = value.substring(0, 60);
      }
      
      // Auto-generate meta description from challenge
      if (field === 'challenge' && !prev.meta_description) {
        updated.meta_description = value.substring(0, 160);
      }
      
      // Calculate project duration from dates
      if ((field === 'project_start_date' || field === 'project_end_date') && 
          updated.project_start_date && updated.project_end_date) {
        const start = new Date(updated.project_start_date);
        const end = new Date(updated.project_end_date);
        const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
        updated.project_duration = `${months} months`;
      }
      
      return updated;
    });
    
    clearError(field);
  }, [clearError, caseStudy]);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      // Find the first tab with errors and switch to it
      const tabsWithErrors = getTabsWithErrors(validationErrors);
      if (tabsWithErrors.length > 0) {
        setActiveTab(tabsWithErrors[0]);
      }
      
      toast.error('Validation failed', 'Please fix the errors before saving');
      setSaving(false);
      return false;
    }

    const sanitized = sanitizeData(formData);
    
    // Auto-generate canonical URL if not provided
    if (!sanitized.canonical_url && sanitized.slug) {
      sanitized.canonical_url = `https://rule27design.com/case-studies/${sanitized.slug}`;
    }
    
    let result;
    if (caseStudy?.id) {
      result = await caseStudyOperations.update(caseStudy.id, sanitized, userProfile);
    } else {
      result = await caseStudyOperations.create(sanitized, userProfile);
    }

    if (result.success) {
      toast.success(
        caseStudy ? 'Case study updated' : 'Case study created',
        `"${formData.title}" has been saved successfully`
      );
      
      if (onSave) {
        await onSave(result.data);
      }
      setSaving(false);
      return true;
    } else {
      toast.error('Save failed', result.error);
      setSaving(false);
      return false;
    }
  };

  // Handle save with status change
  const handleSaveWithStatus = async (status) => {
    setFormData(prev => ({ ...prev, status }));
    setTimeout(() => handleSave(), 100);
  };

  // Tab configuration with error indicators
  const getTabsWithErrors = (currentErrors = errors) => {
    const tabErrors = {
      overview: ['title', 'slug', 'client_name', 'client_industry', 'service_type', 'project_start_date', 'project_end_date'],
      results: ['challenge', 'solution', 'implementation_process', 'key_metrics', 'results_narrative'],
      media: ['hero_image', 'gallery_images'],
      details: ['meta_title', 'meta_description', 'status', 'internal_notes']
    };
    
    const tabsWithErrors = [];
    Object.entries(tabErrors).forEach(([tab, fields]) => {
      if (fields.some(field => currentErrors[field])) {
        tabsWithErrors.push(tab);
      }
    });
    
    return tabsWithErrors;
  };

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview',
      icon: 'FileText',
      hasErrors: getTabsWithErrors().includes('overview')
    },
    { 
      id: 'results', 
      label: 'Results',
      icon: 'TrendingUp',
      hasErrors: getTabsWithErrors().includes('results')
    },
    { 
      id: 'media', 
      label: 'Media',
      icon: 'Image',
      hasErrors: getTabsWithErrors().includes('media')
    },
    { 
      id: 'details', 
      label: 'Details & SEO',
      icon: 'Settings',
      hasErrors: getTabsWithErrors().includes('details')
    }
  ];

  // Add analytics tab only for existing case studies
  if (caseStudy?.id) {
    tabs.push({
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart',
      hasErrors: false
    });
  }

  // Render preview
  const renderPreview = () => (
    <div className="prose prose-lg max-w-none">
      {/* Hero Section */}
      {formData.hero_image && (
        <img 
          src={formData.hero_image} 
          alt={formData.title}
          className="w-full rounded-lg mb-6"
        />
      )}
      
      <h1 className="text-4xl font-bold mb-4">
        {formData.title || 'Untitled Case Study'}
      </h1>
      
      {/* Client Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-500">Client</div>
            <div className="font-medium">{formData.client_name || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Industry</div>
            <div className="font-medium">{formData.client_industry || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Service</div>
            <div className="font-medium">{formData.service_type || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-medium">{formData.project_duration || 'N/A'}</div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      {formData.key_metrics && formData.key_metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {formData.key_metrics.map((metric, index) => (
            <div key={index} className="bg-accent bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-accent">
                {metric.value}{metric.unit}
              </div>
              <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
              {metric.improvement && (
                <div className="text-xs text-green-600 mt-1">
                  {metric.improvement} improvement
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Challenge */}
      {formData.challenge && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">The Challenge</h2>
          <p className="text-gray-700">{formData.challenge}</p>
        </div>
      )}
      
      {/* Solution */}
      {formData.solution && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Our Solution</h2>
          <p className="text-gray-700">{formData.solution}</p>
        </div>
      )}
      
      {/* Implementation Process */}
      {formData.implementation_process && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Implementation Process</h2>
          <p className="text-gray-700">{formData.implementation_process}</p>
        </div>
      )}
      
      {/* Results */}
      {formData.results_narrative && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Results</h2>
          <p className="text-gray-700">{formData.results_narrative}</p>
        </div>
      )}
      
      {/* Gallery */}
      {formData.gallery_images && formData.gallery_images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Project Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {formData.gallery_images.map((image, index) => (
              <figure key={index}>
                <img
                  src={image.url}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  className="w-full rounded-lg"
                />
                {image.caption && (
                  <figcaption className="text-sm text-gray-600 mt-2 text-center">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
      
      {/* Technologies */}
      {formData.technologies_used && formData.technologies_used.length > 0 && (
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
          <div className="flex flex-wrap gap-2">
            {formData.technologies_used.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Modal actions
  const modalActions = [
    {
      label: 'Preview',
      icon: 'Eye',
      onClick: () => setShowPreview(true),
      variant: 'ghost'
    }
  ];

  // Add publish action for admins
  if (userProfile?.role === 'admin' && formData.status !== 'published') {
    modalActions.push({
      label: 'Save & Publish',
      icon: 'Send',
      onClick: () => handleSaveWithStatus('published'),
      variant: 'success'
    });
  }

  return (
    <>
      <EditorModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        title={caseStudy ? `Edit: ${caseStudy.title}` : 'New Case Study'}
        subtitle={saveStatus === 'saving' ? 'Auto-saving...' : saveStatus === 'saved' ? 'All changes saved' : ''}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDirty={isDirty}
        isSaving={saving}
        actions={modalActions}
      >
        {activeTab === 'overview' && (
          <OverviewTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
            userProfile={userProfile}
          />
        )}
        
        {activeTab === 'results' && (
          <ResultsTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
            testimonials={testimonials}
          />
        )}
        
        {activeTab === 'media' && (
          <MediaTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'details' && (
          <DetailsTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'analytics' && caseStudy?.id && (
          <AnalyticsTab
            caseStudyId={caseStudy.id}
          />
        )}
      </EditorModal>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Case Study Preview"
          subtitle={`Preview of: ${formData.title || 'Untitled'}`}
        >
          {renderPreview()}
        </PreviewModal>
      )}
    </>
  );
};

export default CaseStudyEditor;