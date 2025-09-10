// src/pages/admin/articles/ArticleEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  EditorModal,
  StatusBadge,
  UndoRedoControls,
  PreviewModal
} from '../../../components/admin';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';
import ImageUpload from '../../../components/ui/ImageUpload';
import TiptapContentEditor from '../../../components/ui/TiptapContentEditor';
import { generateSlug } from '../../../utils/generateSlug';
import { useFormValidation } from './hooks/useFormValidation';
import { useAutoSave } from './hooks/useAutoSave';
import { useToast } from '../../../components/ui/Toast';
import { cn } from '../../../utils/cn';

// Import tab components
import ContentTab from './editor-tabs/ContentTab';
import MediaTab from './editor-tabs/MediaTab';
import SEOTab from './editor-tabs/SEOTab';
import SettingsTab from './editor-tabs/SettingsTab';
import AnalyticsTab from './editor-tabs/AnalyticsTab';

const ArticleEditor = ({
  article = null,
  isOpen,
  onClose,
  onSave,
  userProfile
}) => {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
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
  const [isDirty, setIsDirty] = useState(false);

  // Form validation
  const { errors, validateField, validateForm, clearError } = useFormValidation();

  // Auto-save functionality
  const { saveStatus, triggerAutoSave } = useAutoSave(formData, article?.id);

  // Undo/Redo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
    setIsDirty(hasChanges);
  }, [formData]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !article) {
      const slug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, article]);

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
    
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...formData, [field]: value });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle save
  const handleSave = async () => {
    const isValid = validateForm(formData);
    if (!isValid) {
      toast.error('Please fix the validation errors');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      toast.success(article ? 'Article updated' : 'Article created');
      onClose();
    } catch (error) {
      toast.error('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    const publishData = { ...formData, status: 'published', published_at: new Date().toISOString() };
    const isValid = validateForm(publishData);
    if (!isValid) {
      toast.error('Please fix the validation errors before publishing');
      return;
    }

    setSaving(true);
    try {
      await onSave(publishData);
      toast.success('Article published successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to publish article');
    } finally {
      setSaving(false);
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setFormData(history[prevIndex]);
      setHistoryIndex(prevIndex);
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setFormData(history[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  // Calculate read time
  const calculateReadTime = (content) => {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200); // Assuming 200 words per minute
  };

  // Tab configuration
  const tabs = [
    {
      id: 'content',
      label: 'Content',
      icon: 'FileText',
      hasError: !!(errors.title || errors.content)
    },
    {
      id: 'media',
      label: 'Media',
      icon: 'Image'
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: 'Search'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart',
      disabled: !article // Only show for existing articles
    }
  ].filter(tab => !tab.disabled);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        handlePublish();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowPreview(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  return (
    <>
      <EditorModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        title={article ? 'Edit Article' : 'New Article'}
        subtitle={article && `ID: ${article.id}`}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        saving={saving}
        isDirty={isDirty}
        validationErrors={errors}
        size="xl"
      >
        {/* Header Actions */}
        <div className="absolute top-4 right-20 flex items-center gap-2">
          <UndoRedoControls
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            <Icon name="Eye" size={16} />
            Preview
          </Button>
          {formData.status !== 'published' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
            >
              <Icon name="Upload" size={16} />
              Publish
            </Button>
          )}
        </div>

        {/* Status and Auto-save indicator */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={formData.status} />
            {saveStatus === 'saving' && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Icon name="Loader" size={14} className="animate-spin" />
                Auto-saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Icon name="Check" size={14} />
                Saved
              </span>
            )}
          </div>
          {formData.content && (
            <span className="text-sm text-gray-500">
              ~{calculateReadTime(formData.content)} min read
            </span>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
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

          {activeTab === 'analytics' && article && (
            <AnalyticsTab
              articleId={article.id}
            />
          )}
        </div>
      </EditorModal>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Article Preview"
          showDeviceSelector={true}
          actions={[
            {
              label: 'Copy Link',
              icon: 'Link',
              onClick: () => {
                navigator.clipboard.writeText(`${window.location.origin}/blog/${formData.slug}`);
                toast.success('Link copied to clipboard');
              }
            }
          ]}
        >
          <article className="prose max-w-none p-8">
            {/* Featured Image */}
            {formData.featured_image && (
              <div className="mb-8">
                <img
                  src={formData.featured_image}
                  alt={formData.featured_image_alt || formData.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span>By {userProfile?.full_name || 'Author'}</span>
              <span>•</span>
              <span>{calculateReadTime(formData.content)} min read</span>
              {formData.category_id && (
                <>
                  <span>•</span>
                  <span>Category</span>
                </>
              )}
            </div>

            {/* Excerpt */}
            {formData.excerpt && (
              <p className="text-lg text-gray-600 mb-8">{formData.excerpt}</p>
            )}

            {/* Content */}
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />

            {/* Tags */}
            {formData.tags?.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </PreviewModal>
      )}
    </>
  );
};

export default ArticleEditor;