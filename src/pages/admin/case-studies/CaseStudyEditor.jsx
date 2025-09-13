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

// Default no-image placeholder
const NO_IMAGE_URL = '/build/assets/images/no_image.png';

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
  const [validationAttempted, setValidationAttempted] = useState(false);
  
  // Initialize form data with ALL fields from the schema
  const initialData = {
    // Core fields
    title: caseStudy?.title || '',
    slug: caseStudy?.slug || '',
    client_name: caseStudy?.client_name || '',
    client_logo: caseStudy?.client_logo || '',
    client_website: caseStudy?.client_website || '',
    client_industry: caseStudy?.client_industry || '',
    client_company_size: caseStudy?.client_company_size || '',
    business_stage: caseStudy?.business_stage || '',
    
    // Project details
    project_duration: caseStudy?.project_duration || '',
    project_start_date: caseStudy?.project_start_date || '',
    project_end_date: caseStudy?.project_end_date || '',
    project_investment: caseStudy?.project_investment || '',
    
    // Service details
    service_type: caseStudy?.service_type || '',
    service_category: caseStudy?.service_category || '',
    
    // Arrays and JSON fields
    deliverables: caseStudy?.deliverables || [],
    technologies_used: caseStudy?.technologies_used || [],
    team_size: caseStudy?.team_size || null,
    team_members: caseStudy?.team_members || [],
    
    // Rich text fields (JSONB in database)
    challenge: caseStudy?.challenge || null,
    solution: caseStudy?.solution || null,
    implementation_process: caseStudy?.implementation_process || null,
    
    // Results narrative - Now an array of structured metrics
    results_narrative: caseStudy?.results_narrative || [],
    
    // Plain text summary
    results_summary: caseStudy?.results_summary || '',
    
    // Metrics and gallery
    key_metrics: caseStudy?.key_metrics || [],
    gallery_images: caseStudy?.gallery_images || [],
    process_steps: caseStudy?.process_steps || [],
    
    // Media
    hero_image: caseStudy?.hero_image || '',
    hero_image_alt: caseStudy?.hero_image_alt || '',
    hero_video: caseStudy?.hero_video || '',
    
    // References
    testimonial_id: caseStudy?.testimonial_id || null,
    project_lead: caseStudy?.project_lead || null,
    
    // Status and settings
    status: caseStudy?.status || 'draft',
    is_featured: caseStudy?.is_featured || false,
    is_confidential: caseStudy?.is_confidential || false,
    is_active: caseStudy?.is_active !== false,
    sort_order: caseStudy?.sort_order || 0,
    
    // SEO fields
    meta_title: caseStudy?.meta_title || '',
    meta_description: caseStudy?.meta_description || '',
    meta_keywords: caseStudy?.meta_keywords || [],
    og_title: caseStudy?.og_title || '',
    og_description: caseStudy?.og_description || '',
    og_image: caseStudy?.og_image || '',
    canonical_url: caseStudy?.canonical_url || '',
    
    // Internal
    internal_notes: caseStudy?.internal_notes || '',
    
    // Analytics
    view_count: caseStudy?.view_count || 0,
    unique_view_count: caseStudy?.unique_view_count || 0,
    inquiry_count: caseStudy?.inquiry_count || 0,
    average_time_on_page: caseStudy?.average_time_on_page || null,
    
    // Phase 2-4 fields
    scheduled_at: caseStudy?.scheduled_at || null,
    published_at: caseStudy?.published_at || null,
    language: caseStudy?.language || 'en',
    translations: caseStudy?.translations || {},
    ab_test_variant: caseStudy?.ab_test_variant || null,
    performance_score: caseStudy?.performance_score || 0,
    seo_score: caseStudy?.seo_score || 0,
    ai_tags: caseStudy?.ai_tags || [],
    ai_summary: caseStudy?.ai_summary || '',
    predicted_performance: caseStudy?.predicted_performance || null,
    related_case_studies: caseStudy?.related_case_studies || [],
    custom_fields: caseStudy?.custom_fields || {},
    version: caseStudy?.version || 1,
    
    // Metadata
    created_at: caseStudy?.created_at || null,
    updated_at: caseStudy?.updated_at || null,
    created_by: caseStudy?.created_by || null,
    updated_by: caseStudy?.updated_by || null
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
        .select('id, client_name, client_title, client_company, quote, rating')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
      
      console.log('Fetched testimonials:', data);
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
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

  // Calculate SEO Score
  const calculateSEOScore = (data) => {
    let score = 0;
    const checks = {
      metaTitle: data.meta_title && data.meta_title.length >= 30 && data.meta_title.length <= 60,
      metaDescription: data.meta_description && data.meta_description.length >= 120 && data.meta_description.length <= 160,
      keywords: data.meta_keywords && data.meta_keywords.length >= 3,
      ogImage: !!data.og_image && !data.og_image.includes('placeholder'),
      canonicalUrl: !!data.canonical_url,
      slug: data.slug && data.slug.length <= 50,
      heroImage: !!data.hero_image && !data.hero_image.includes('placeholder'),
      content: data.challenge && data.solution && Array.isArray(data.results_narrative) && data.results_narrative.length > 0
    };

    Object.values(checks).forEach(check => {
      if (check) score += 12.5;
    });

    return Math.round(score);
  };

  // Calculate Performance Score
  const calculatePerformanceScore = (data) => {
    let score = 0;
    
    // Content completeness (40 points)
    if (data.challenge) score += 10;
    if (data.solution) score += 10;
    if (data.implementation_process) score += 10;
    if (Array.isArray(data.results_narrative) && data.results_narrative.length > 0) score += 10;
    
    // Media (20 points)
    if (data.hero_image && !data.hero_image.includes('placeholder')) score += 10;
    if (data.gallery_images && data.gallery_images.length > 0) {
      const realImages = data.gallery_images.filter(img => 
        img.url && !img.url.includes('placeholder')
      );
      if (realImages.length > 0) score += 10;
    }
    
    // Metrics (20 points)
    if (data.key_metrics && data.key_metrics.length >= 3) score += 20;
    
    // SEO (10 points)
    if (data.seo_score >= 75) score += 10;
    
    // Engagement potential (10 points)
    if (data.testimonial_id) score += 10;
    
    return Math.min(100, score);
  };

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
      
      // Auto-generate meta description from challenge (if rich text)
      if (field === 'challenge' && !prev.meta_description && value) {
        const text = typeof value === 'object' && value.content ? 
          value.content[0]?.content?.[0]?.text || '' : 
          typeof value === 'string' ? value : '';
        updated.meta_description = text.substring(0, 160);
      }
      
      // Calculate project duration from dates
      if ((field === 'project_start_date' || field === 'project_end_date') && 
          updated.project_start_date && updated.project_end_date) {
        const start = new Date(updated.project_start_date);
        const end = new Date(updated.project_end_date);
        const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
        updated.project_duration = months > 0 ? `${months} months` : updated.project_duration;
      }
      
      // Calculate scores when relevant fields change
      if (['meta_title', 'meta_description', 'meta_keywords', 'og_image', 'hero_image', 
          'challenge', 'solution', 'results_narrative'].includes(field)) {
        updated.seo_score = calculateSEOScore(updated);
      }
      
      if (['challenge', 'solution', 'implementation_process', 'results_narrative', 
          'hero_image', 'gallery_images', 'key_metrics', 'testimonial_id'].includes(field)) {
        updated.performance_score = calculatePerformanceScore(updated);
      }
      
      return updated;
    });
    
    // Clear validation error for this field
    if (validationAttempted) {
      clearError(field);
    }
  }, [clearError, caseStudy, validationAttempted]);

  // Handle save with improved error display
  const handleSave = async () => {
    setSaving(true);
    setValidationAttempted(true);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      // Find which tab has errors
      const tabErrors = getTabErrors();
      const firstTabWithErrors = Object.keys(tabErrors).find(tab => 
        tabErrors[tab].length > 0
      );
      
      if (firstTabWithErrors) {
        setActiveTab(firstTabWithErrors);
      }
      
      // Create detailed error message
      const errorList = Object.entries(tabErrors)
        .filter(([tab, errs]) => errs.length > 0)
        .map(([tab, errs]) => {
          const tabName = tab.charAt(0).toUpperCase() + tab.slice(1);
          const errorMessages = errs.map(e => `• ${e.error}`).join('\n');
          return `${tabName} Tab:\n${errorMessages}`;
        })
        .join('\n\n');
      
      toast.error(
        'Please fix the following errors',
        errorList
      );
      
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
      setValidationAttempted(false);
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
    if (status === 'published' && !formData.published_at) {
      setFormData(prev => ({ ...prev, published_at: new Date().toISOString() }));
    }
    setTimeout(() => handleSave(), 100);
  };

  // Handle scheduling
  const handleSchedule = async (scheduledDate) => {
    setFormData(prev => ({ 
      ...prev, 
      status: 'scheduled',
      scheduled_at: scheduledDate 
    }));
    setTimeout(() => handleSave(), 100);
  };

  // Tab configuration with error indicators
  const tabErrors = getTabErrors();
  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview',
      icon: 'FileText',
      hasErrors: tabErrors.overview.length > 0,
      errorCount: tabErrors.overview.length
    },
    { 
      id: 'results', 
      label: 'Results',
      icon: 'TrendingUp',
      hasErrors: tabErrors.results.length > 0,
      errorCount: tabErrors.results.length
    },
    { 
      id: 'media', 
      label: 'Media',
      icon: 'Image',
      hasErrors: tabErrors.media.length > 0,
      errorCount: tabErrors.media.length
    },
    { 
      id: 'details', 
      label: 'Details & SEO',
      icon: 'Settings',
      hasErrors: tabErrors.details.length > 0,
      errorCount: tabErrors.details.length
    }
  ];

  // Add analytics tab only for existing case studies
  if (caseStudy?.id) {
    tabs.push({
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart',
      hasErrors: false,
      errorCount: 0
    });
  }

  // Helper function to get image URL with fallback
  const getImageUrl = (url) => {
    if (!url || url === 'null' || url.includes('placeholder')) {
      return NO_IMAGE_URL;
    }
    return url;
  };

  // Format value for display in preview
  const formatMetricValue = (value, type) => {
    if (!value) return '';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return value;
    }
  };

  // Render preview with rich text content
  const renderPreview = () => (
    <div className="prose prose-lg max-w-none">
      {/* Hero Section */}
      {formData.hero_image && (
        <img 
          src={getImageUrl(formData.hero_image)}
          alt={formData.hero_image_alt || formData.title}
          className="w-full rounded-lg mb-6"
          onError={(e) => {
            e.target.src = NO_IMAGE_URL;
          }}
        />
      )}
      
      <h1 className="text-4xl font-bold mb-4">
        {formData.title || 'Untitled Case Study'}
      </h1>
      
      {/* Client Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        {formData.client_logo && (
          <img 
            src={getImageUrl(formData.client_logo)}
            alt={formData.client_name}
            className="h-12 mb-4"
            onError={(e) => {
              e.target.src = NO_IMAGE_URL;
            }}
          />
        )}
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
      
      {/* Challenge - Render rich text */}
      {formData.challenge && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">The Challenge</h2>
          {typeof formData.challenge === 'object' && formData.challenge.content ? (
            <div className="text-gray-700">
              {formData.challenge.content[0]?.content?.[0]?.text || ''}
            </div>
          ) : (
            <p className="text-gray-700">{formData.challenge}</p>
          )}
        </div>
      )}
      
      {/* Solution - Render rich text */}
      {formData.solution && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Our Solution</h2>
          {typeof formData.solution === 'object' && formData.solution.content ? (
            <div className="text-gray-700">
              {formData.solution.content[0]?.content?.[0]?.text || ''}
            </div>
          ) : (
            <p className="text-gray-700">{formData.solution}</p>
          )}
        </div>
      )}
      
      {/* Detailed Results - Now as structured metrics */}
      {formData.results_narrative && formData.results_narrative.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Detailed Results</h2>
          <div className="space-y-4">
            {formData.results_narrative.map((result, index) => (
              <div key={index} className="border-l-4 border-accent pl-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-accent">
                    {formatMetricValue(result.value, result.type)}
                  </span>
                  <span className="text-lg font-medium">{result.metric}</span>
                </div>
                {result.description && (
                  <p className="text-gray-600">{result.description}</p>
                )}
              </div>
            ))}
          </div>
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
                  src={getImageUrl(image.url)}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.target.src = NO_IMAGE_URL;
                  }}
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

  // Add schedule action
  if (formData.status === 'draft') {
    modalActions.push({
      label: 'Schedule',
      icon: 'Calendar',
      onClick: () => {
        const scheduledDate = prompt('Enter scheduled date (YYYY-MM-DD HH:MM):');
        if (scheduledDate) {
          handleSchedule(scheduledDate);
        }
      },
      variant: 'ghost'
    });
  }

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
        subtitle={
          <>
            {saveStatus === 'saving' && 'Auto-saving...'}
            {saveStatus === 'saved' && 'All changes saved'}
            {formData.version > 1 && ` • Version ${formData.version}`}
            {formData.seo_score > 0 && ` • SEO Score: ${formData.seo_score}%`}
            {formData.performance_score > 0 && ` • Quality Score: ${formData.performance_score}%`}
          </>
        }
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDirty={isDirty}
        isSaving={saving}
        actions={modalActions}
        showValidationErrors={validationAttempted && Object.keys(errors).length > 0}
      >
        {activeTab === 'overview' && (
          <OverviewTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
            onChange={handleFieldChange}
            userProfile={userProfile}
          />
        )}
        
        {activeTab === 'results' && (
          <ResultsTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
            onChange={handleFieldChange}
            testimonials={testimonials}
          />
        )}
        
        {activeTab === 'media' && (
          <MediaTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'details' && (
          <DetailsTab
            formData={formData}
            errors={validationAttempted ? errors : {}}
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