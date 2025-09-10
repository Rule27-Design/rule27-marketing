// src/pages/admin/articles/ArticleEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  EditorModal,
  StatusBadge,
  PreviewModal
} from '../../../components/admin';
import { generateSlug, sanitizeData } from '../../../utils';
import { useFormValidation } from './hooks/useFormValidation';
import { useAutoSave } from './hooks/useAutoSave';
import { articleOperations } from './services/ArticleOperations';
import { useToast } from '../../../components/ui/Toast';

// Import tab components
import ContentTab from './editor-tabs/ContentTab';
import MediaTab from './editor-tabs/MediaTab';
import SEOTab from './editor-tabs/SEOTab';
import SettingsTab from './editor-tabs/SettingsTab';
import AnalyticsTab from './editor-tabs/AnalyticsTab';

const ArticleEditor = ({
  article = null,
  userProfile,
  isOpen,
  onClose,
  onSave
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  
  // Initialize form data
  const initialData = {
    title: '',
    slug: '',
    excerpt: '',
    content: null,
    featured_image: '',
    featured_image_alt: '',
    featured_video: '',
    author_id: userProfile?.id || '',
    co_authors: [],
    category_id: '',
    tags: [],
    status: 'draft',
    scheduled_at: '',
    is_featured: false,
    enable_comments: false,
    enable_reactions: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    internal_notes: '',
    ...article
  };

  const [formData, setFormData] = useState(initialData);

  // Form validation
  const { errors, validateForm, clearError, getTabErrors } = useFormValidation();

  // Auto-save functionality (only for existing articles)
  const { saveStatus, triggerAutoSave } = useAutoSave(
    formData, 
    article?.id,
    article?.id ? true : false
  );

  // Handle field changes
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    clearError(field);

    // Auto-generate slug from title
    if (field === 'title' && !article) {
      const slug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  }, [clearError, article]);

  // Handle save
  const handleSave = async () => {
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Validation failed', 'Please fix the errors before saving');
      return false;
    }

    const sanitized = sanitizeData(formData);
    
    let result;
    if (article?.id) {
      result = await articleOperations.update(article.id, sanitized);
    } else {
      result = await articleOperations.create(sanitized);
    }

    if (result.success) {
      toast.success(
        article ? 'Article updated' : 'Article created',
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

  // Tab configuration with error indicators
  const tabs = [
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
      id: 'seo', 
      label: 'SEO',
      errors: getTabErrors('seo', errors)
    },
    { 
      id: 'settings', 
      label: 'Settings',
      errors: getTabErrors('settings', errors)
    }
  ];

  // Add analytics tab only for existing articles
  if (article?.id) {
    tabs.push({
      id: 'analytics',
      label: 'Analytics',
      errors: []
    });
  }

  // Render preview
  const renderPreview = () => (
    <div className="prose max-w-none">
      <h1>{formData.title || 'Untitled Article'}</h1>
      {formData.featured_image && (
        <img 
          src={formData.featured_image} 
          alt={formData.featured_image_alt || formData.title}
          className="w-full rounded-lg"
        />
      )}
      {formData.excerpt && (
        <p className="lead text-lg text-gray-600">{formData.excerpt}</p>
      )}
      {formData.content?.html && (
        <div dangerouslySetInnerHTML={{ __html: formData.content.html }} />
      )}
    </div>
  );

  return (
    <>
      <EditorModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        title={article ? 'Edit Article' : 'New Article'}
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
        {activeTab === 'content' && (
          <ContentTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
            userProfile={userProfile}
          />
        )}
        
        {activeTab === 'media' && (
          <MediaTab
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}
        
        {activeTab === 'seo' && (
          <SEOTab
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
        
        {activeTab === 'analytics' && article?.id && (
          <AnalyticsTab
            articleId={article.id}
          />
        )}
      </EditorModal>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={formData.title || 'Article Preview'}
        >
          {renderPreview()}
        </PreviewModal>
      )}
    </>
  );
};

export default ArticleEditor;