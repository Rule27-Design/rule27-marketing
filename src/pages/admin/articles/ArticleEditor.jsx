// src/pages/admin/articles/ArticleEditor.jsx - Enhanced Editor with Hook Integration
import React from 'react';
import Icon from '../../../components/AdminIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import ImageUpload from '../../../components/ui/ImageUpload';
import TiptapContentEditor, { TiptapContentDisplay } from '../../../components/ui/TiptapContentEditor';

const ArticleEditor = ({
  // From useArticleEditor hook
  formData,
  activeTab,
  saving,
  errors = {},
  hasErrors,
  setActiveTab,
  updateFormData,
  handleContentChange,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  getTabsWithErrors,
  
  // From main component
  showEditor,
  editingArticle,
  categories = [],
  authors = [],
  userProfile,
  onClose,
  onSave,
  onSaveWithStatus,
  
  // Enhanced operations
  onDuplicate,
  onSchedule,
  onUpdateSlug,
  
  // Status utilities
  getStatusConfig,
  canTransitionTo,
  isEditable
}) => {

  if (!showEditor) return null;

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'content', label: 'Content', icon: 'Edit' },
    { id: 'media', label: 'Media', icon: 'Image' },
    { id: 'seo', label: 'SEO', icon: 'Search' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const tabsWithErrors = getTabsWithErrors ? getTabsWithErrors(errors) : [];

  // Auto-generate slug from title
  const handleTitleChange = (value) => {
    updateFormData({ title: value });
    
    // Auto-generate slug if editing new article and no custom slug set
    if (!editingArticle && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      updateFormData({ slug: autoSlug });
    }
  };

  // Handle save with status validation
  const handleSaveWithStatusValidation = (status) => {
    if (canTransitionTo && !canTransitionTo(formData.status, status, userProfile?.role)) {
      return;
    }
    onSaveWithStatus(status);
  };

  // Enhanced form data change handler
  const handleFormChange = (updates) => {
    updateFormData(updates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl font-heading-bold uppercase">
                  {editingArticle ? 'Edit Article' : 'New Article'}
                </h2>
                {editingArticle && (
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {new Date(editingArticle.updated_at).toLocaleString()}
                  </p>
                )}
              </div>
              
              {/* Status indicator */}
              {editingArticle && getStatusConfig && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusConfig(formData.status).bgClass} ${getStatusConfig(formData.status).textClass}`}>
                    {getStatusConfig(formData.status).label}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Quick actions */}
            {editingArticle && onDuplicate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(editingArticle)}
                iconName="Copy"
                title="Duplicate article"
              >
                Duplicate
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={24} />
            </Button>
          </div>
        </div>

        {/* Tab Navigation with Error Indicators */}
        <div className="border-b bg-white">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const tabHasErrors = tabsWithErrors.includes(tab.id);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 relative transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                  
                  {/* Error indicator */}
                  {tabHasErrors && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Error summary under tabs */}
          {hasErrors && (
            <div className="px-6 py-2 bg-red-50 border-t border-red-200">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-red-600" />
                <span className="text-sm text-red-700">
                  Errors in: {tabsWithErrors.map(tab => 
                    tab.charAt(0).toUpperCase() + tab.slice(1)
                  ).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <OverviewTab 
              formData={formData}
              errors={errors}
              categories={categories}
              authors={authors}
              onFormChange={handleFormChange}
              onTitleChange={handleTitleChange}
              onAddArrayItem={addArrayItem}
              onUpdateArrayItem={updateArrayItem}
              onRemoveArrayItem={removeArrayItem}
              onUpdateSlug={onUpdateSlug}
              editingArticle={editingArticle}
            />
          )}

          {activeTab === 'content' && (
            <ContentTab 
              formData={formData}
              errors={errors}
              onContentChange={handleContentChange}
              editingArticle={editingArticle}
            />
          )}

          {activeTab === 'media' && (
            <MediaTab 
              formData={formData}
              errors={errors}
              onFormChange={handleFormChange}
            />
          )}

          {activeTab === 'seo' && (
            <SeoTab 
              formData={formData}
              errors={errors}
              onFormChange={handleFormChange}
              onAddArrayItem={addArrayItem}
              onUpdateArrayItem={updateArrayItem}
              onRemoveArrayItem={removeArrayItem}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              formData={formData}
              userProfile={userProfile}
              onFormChange={handleFormChange}
              onSchedule={onSchedule}
              editingArticle={editingArticle}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            
            {hasErrors && (
              <span className="text-sm text-red-600 flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-2" />
                Please fix validation errors
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick publish for admins */}
            {userProfile?.role === 'admin' && 
             (formData.status === 'draft' || formData.status === 'pending_approval') && (
              <Button
                variant="outline"
                onClick={() => handleSaveWithStatusValidation('published')}
                className="bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                disabled={saving}
                iconName="Globe"
              >
                Save & Publish
              </Button>
            )}
            
            {/* Submit for review for contributors */}
            {userProfile?.role === 'contributor' && formData.status === 'draft' && (
              <Button
                variant="outline"
                onClick={() => handleSaveWithStatusValidation('pending_approval')}
                className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
                disabled={saving}
                iconName="Send"
              >
                Submit for Review
              </Button>
            )}
            
            <Button
              variant="default"
              onClick={onSave}
              className="bg-accent hover:bg-accent/90"
              iconName="Save"
              disabled={saving || hasErrors}
            >
              {saving ? 'Saving...' : (editingArticle ? 'Update Article' : 'Save Article')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ 
  formData, 
  errors, 
  categories, 
  authors, 
  onFormChange,
  onTitleChange,
  onAddArrayItem, 
  onUpdateArrayItem, 
  onRemoveArrayItem,
  onUpdateSlug,
  editingArticle
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
        placeholder="Enter article title"
        error={errors.title}
      />
      
      <div className="relative">
        <Input
          label="Slug"
          value={formData.slug}
          onChange={(e) => onFormChange({ slug: e.target.value })}
          placeholder="auto-generated-from-title"
          error={errors.slug}
        />
        {editingArticle && onUpdateSlug && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onUpdateSlug(editingArticle.id, formData.title)}
            className="absolute right-2 top-8 text-xs"
          >
            Regenerate
          </Button>
        )}
      </div>
    </div>

    <Input
      label="Excerpt"
      value={formData.excerpt}
      onChange={(e) => onFormChange({ excerpt: e.target.value })}
      placeholder="Brief description of the article"
      error={errors.excerpt}
      maxLength={300}
      showCount
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        label="Category"
        value={formData.category_id}
        onChange={(value) => onFormChange({ category_id: value })}
        options={[
          { value: '', label: 'Select category...' },
          ...categories.map(cat => ({ value: cat.id, label: cat.name }))
        ]}
        error={errors.category_id}
        required
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => onFormChange({ status: value })}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'pending_approval', label: 'Pending Approval' },
          { value: 'approved', label: 'Approved' },
          { value: 'published', label: 'Published' }
        ]}
      />
    </div>

    {/* Tags */}
    <ArrayFieldEditor
      label="Tags"
      items={formData.tags}
      placeholder="Tag name"
      onAdd={() => onAddArrayItem('tags')}
      onUpdate={(index, value) => onUpdateArrayItem('tags', index, value)}
      onRemove={(index) => onRemoveArrayItem('tags', index)}
    />

    {/* Co-Authors */}
    <div>
      <label className="block text-sm font-medium mb-2">Co-Authors</label>
      <Select
        value=""
        onChange={(value) => {
          if (value && !formData.co_authors.includes(value)) {
            onFormChange({
              co_authors: [...formData.co_authors, value]
            });
          }
        }}
        options={[
          { value: '', label: 'Select co-author...' },
          ...authors
            .filter(author => !formData.co_authors.includes(author.id))
            .map(author => ({ value: author.id, label: author.full_name }))
        ]}
      />
      {formData.co_authors.length > 0 && (
        <div className="mt-2 space-y-1">
          {formData.co_authors.map((authorId, index) => {
            const author = authors.find(a => a.id === authorId);
            return (
              <div key={authorId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>{author?.full_name || 'Unknown'}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onRemoveArrayItem('co_authors', index)}
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

// Content Tab Component
const ContentTab = ({ formData, errors, onContentChange, editingArticle }) => (
  <div className="space-y-6">
    <TiptapContentEditor
      key={`content-editor-${editingArticle?.id || 'new'}`}
      value={formData.content}
      onChange={onContentChange}
      label="Article Content"
      minHeight="400px"
      error={errors.content}
      placeholder="Start writing your article..."
    />

    {/* Content Preview & Stats */}
    {formData.content && (
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Content Preview & Statistics</h3>
        
        {/* Content Stats */}
        <div className="grid grid-cols-4 gap-4 text-sm mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="font-medium text-blue-900">{formData.content.wordCount || 0}</div>
            <div className="text-blue-600 text-xs">Words</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="font-medium text-green-900">{formData.content.text?.length || 0}</div>
            <div className="text-green-600 text-xs">Characters</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="font-medium text-purple-900">{Math.ceil((formData.content.wordCount || 0) / 200)}</div>
            <div className="text-purple-600 text-xs">Min Read</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="font-medium text-orange-900">{Math.ceil((formData.content.wordCount || 0) / 100)}</div>
            <div className="text-orange-600 text-xs">SEO Score</div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <TiptapContentDisplay content={formData.content?.json || formData.content} />
        </div>
      </div>
    )}
  </div>
);

// Media Tab Component
const MediaTab = ({ formData, errors, onFormChange }) => (
  <div className="space-y-6">
    <ImageUpload
      label="Featured Image"
      value={formData.featured_image}
      onChange={(value) => onFormChange({ featured_image: value })}
      bucket="media"
      folder="articles"
      error={errors.featured_image}
    />

    <Input
      label="Featured Image Alt Text"
      value={formData.featured_image_alt}
      onChange={(e) => onFormChange({ featured_image_alt: e.target.value })}
      placeholder="Describe the image for accessibility"
      error={errors.featured_image_alt}
    />

    <Input
      label="Featured Video URL (optional)"
      value={formData.featured_video}
      onChange={(e) => onFormChange({ featured_video: e.target.value })}
      placeholder="YouTube, Vimeo, or direct video URL"
      error={errors.featured_video}
    />
  </div>
);

// SEO Tab Component
const SeoTab = ({ formData, errors, onFormChange, onAddArrayItem, onUpdateArrayItem, onRemoveArrayItem }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Meta Title"
        value={formData.meta_title}
        onChange={(e) => onFormChange({ meta_title: e.target.value })}
        placeholder="SEO optimized title (60 chars max)"
        error={errors.meta_title}
        maxLength={60}
        showCount
      />
      
      <Input
        label="Canonical URL (optional)"
        value={formData.canonical_url}
        onChange={(e) => onFormChange({ canonical_url: e.target.value })}
        placeholder={formData.slug ? `https://rule27design.com/articles/${formData.slug}` : "Will auto-generate from article slug"}
        description="Leave empty to auto-generate from article slug"
        error={errors.canonical_url}
      />
    </div>

    <Input
      label="Meta Description"
      value={formData.meta_description}
      onChange={(e) => onFormChange({ meta_description: e.target.value })}
      placeholder="SEO description (155-160 characters)"
      error={errors.meta_description}
      maxLength={160}
      showCount
    />

    {/* Meta Keywords */}
    <ArrayFieldEditor
      label="Meta Keywords"
      items={formData.meta_keywords}
      placeholder="Keyword or phrase"
      onAdd={() => onAddArrayItem('meta_keywords')}
      onUpdate={(index, value) => onUpdateArrayItem('meta_keywords', index, value)}
      onRemove={(index) => onRemoveArrayItem('meta_keywords', index)}
    />

    {/* Social Media */}
    <div className="border-t pt-6">
      <h3 className="font-medium mb-4">Social Media</h3>
      <div className="space-y-4">
        <Input
          label="Open Graph Title"
          value={formData.og_title}
          onChange={(e) => onFormChange({ og_title: e.target.value })}
          placeholder="Title for social media sharing"
        />
        
        <Input
          label="Open Graph Description"
          value={formData.og_description}
          onChange={(e) => onFormChange({ og_description: e.target.value })}
          placeholder="Description for social media sharing"
        />

        <ImageUpload
          label="Open Graph Image"
          value={formData.og_image}
          onChange={(value) => onFormChange({ og_image: value })}
          bucket="media"
          folder="articles/social"
          showPreview={true}
          error={errors.og_image}
        />

        <Select
          label="Twitter Card Type"
          value={formData.twitter_card}
          onChange={(value) => onFormChange({ twitter_card: value })}
          options={[
            { value: 'summary', label: 'Summary' },
            { value: 'summary_large_image', label: 'Summary Large Image' },
            { value: 'app', label: 'App' },
            { value: 'player', label: 'Player' }
          ]}
        />
      </div>
    </div>
  </div>
);

// Settings Tab Component
const SettingsTab = ({ formData, userProfile, onFormChange, onSchedule, editingArticle }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-medium">Publishing Options</h3>
        
        <Checkbox
          checked={formData.is_featured}
          onCheckedChange={(checked) => onFormChange({ is_featured: checked })}
          label="Featured Article"
          description="Display this article prominently on the homepage"
        />
        
        <Checkbox
          checked={formData.enable_comments}
          onCheckedChange={(checked) => onFormChange({ enable_comments: checked })}
          label="Enable Comments"
          description="Allow readers to comment on this article"
        />
        
        <Checkbox
          checked={formData.enable_reactions}
          onCheckedChange={(checked) => onFormChange({ enable_reactions: checked })}
          label="Enable Reactions"
          description="Allow readers to like and share this article"
        />

        <Input
          type="datetime-local"
          label="Scheduled Publication (optional)"
          value={formData.scheduled_at}
          onChange={(e) => onFormChange({ scheduled_at: e.target.value })}
        />
        
        {formData.scheduled_at && onSchedule && editingArticle && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSchedule(editingArticle.id, formData.scheduled_at)}
            iconName="Calendar"
          >
            Schedule Article
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Editorial Notes</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Internal Notes</label>
          <textarea
            value={formData.internal_notes}
            onChange={(e) => onFormChange({ internal_notes: e.target.value })}
            className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
            placeholder="Notes for the editorial team..."
          />
        </div>

        {formData.content?.wordCount && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <Icon name="Clock" size={16} className="inline mr-2" />
              Estimated read time: {Math.ceil(formData.content.wordCount / 200)} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Reusable Array Field Editor Component
const ArrayFieldEditor = ({ label, items = [], placeholder, onAdd, onUpdate, onRemove }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {items.map((item, index) => (
      <div key={index} className="flex gap-2 mb-2">
        <Input
          value={item}
          onChange={(e) => onUpdate(index, e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onAdd}
      iconName="Plus"
    >
      Add {label.slice(0, -1)}
    </Button>
  </div>
);

export default ArticleEditor;