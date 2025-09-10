// src/pages/admin/articles/editor-tabs/ContentTab.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import Icon from '../../../../components/AdminIcon';

const ContentTab = ({ formData, errors, onChange, userProfile }) => {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name')
      .eq('type', 'article')
      .eq('is_active', true)
      .order('name');
    
    setCategories(categoriesData || []);

    // Fetch potential co-authors
    const { data: authorsData } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('role', ['admin', 'contributor'])
      .neq('id', userProfile?.id)
      .order('full_name');
    
    setAuthors(authorsData || []);

    // Fetch available tags
    const { data: tagsData } = await supabase
      .from('tags')
      .select('name')
      .eq('is_active', true)
      .order('name');
    
    setTags(tagsData?.map(t => t.name) || []);
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        onChange('tags', [...formData.tags, newTag]);
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    onChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Enter article title"
            error={errors.title}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="article-url-slug"
            error={errors.slug}
          />
        </div>
      </div>

      {/* Category & Co-authors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.category_id || ''}
            onChange={(value) => onChange('category_id', value)}
            options={[
              { value: '', label: 'Select category...' },
              ...categories.map(cat => ({
                value: cat.id,
                label: cat.name
              }))
            ]}
            error={errors.category_id}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Co-authors
          </label>
          <Select
            value=""
            onChange={(value) => {
              if (value && !formData.co_authors.includes(value)) {
                onChange('co_authors', [...formData.co_authors, value]);
              }
            }}
            options={[
              { value: '', label: 'Add co-author...' },
              ...authors
                .filter(a => !formData.co_authors.includes(a.id))
                .map(author => ({
                  value: author.id,
                  label: author.full_name
                }))
            ]}
          />
          
          {/* Selected co-authors */}
          {formData.co_authors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.co_authors.map(authorId => {
                const author = authors.find(a => a.id === authorId);
                return author ? (
                  <span
                    key={authorId}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs"
                  >
                    {author.full_name}
                    <button
                      onClick={() => onChange('co_authors', 
                        formData.co_authors.filter(id => id !== authorId)
                      )}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt || ''}
          onChange={(e) => onChange('excerpt', e.target.value)}
          placeholder="Brief description of the article (appears in listings)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
          maxLength={300}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.excerpt?.length || 0}/300 characters
        </p>
        {errors.excerpt && (
          <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>
        )}
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <TiptapContentEditor
          content={formData.content}
          onChange={(content) => onChange('content', content)}
          placeholder="Start writing your article..."
        />
        {errors.content && (
          <p className="text-xs text-red-500 mt-1">{errors.content}</p>
        )}
        
        {/* Word count */}
        {formData.content?.wordCount && (
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{formData.content.wordCount} words</span>
            <span>~{Math.ceil(formData.content.wordCount / 200)} min read</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          placeholder="Type tag and press Enter"
          onKeyDown={handleTagInput}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
          list="tags-list"
        />
        <datalist id="tags-list">
          {tags.map(tag => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
        
        {/* Selected tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-red-500"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTab;