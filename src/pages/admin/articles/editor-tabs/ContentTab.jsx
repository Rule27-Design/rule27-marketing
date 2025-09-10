// src/pages/admin/articles/editor-tabs/ContentTab.jsx
import React, { useState, useEffect } from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import Icon from '../../../../components/AdminIcon';
import { generateSlug } from '../../../../utils/generateSlug';
import { supabase } from '../../../../lib/supabase';

const ContentTab = ({ formData, errors, onChange, userProfile }) => {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Load categories and authors
  useEffect(() => {
    loadCategories();
    loadAuthors();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .eq('type', 'article')
      .order('name');
    
    setCategories(data || []);
  };

  const loadAuthors = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('role', ['admin', 'editor', 'author'])
      .order('full_name');
    
    setAuthors(data || []);
  };

  const handleSlugGenerate = () => {
    if (formData.title) {
      onChange('slug', generateSlug(formData.title));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags?.includes(newTag)) {
        onChange('tags', [...(formData.tags || []), newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  const handleAddCoAuthor = (authorId) => {
    if (authorId && !formData.co_authors?.includes(authorId)) {
      onChange('co_authors', [...(formData.co_authors || []), authorId]);
    }
  };

  const handleRemoveCoAuthor = (authorId) => {
    onChange('co_authors', formData.co_authors?.filter(id => id !== authorId) || []);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
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
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => onChange('slug', e.target.value.toLowerCase())}
            placeholder="article-slug"
            className="flex-1"
            error={errors.slug}
          />
          <button
            type="button"
            onClick={handleSlugGenerate}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Generate from title"
          >
            <Icon name="RefreshCw" size={16} />
          </button>
        </div>
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          URL: /blog/{formData.slug || 'article-slug'}
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt || ''}
          onChange={(e) => onChange('excerpt', e.target.value)}
          placeholder="Brief description of the article (optional)"
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          maxLength={300}
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.excerpt?.length || 0}/300 characters
        </p>
      </div>

      {/* Category and Author */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Select
            value={formData.category_id || ''}
            onChange={(e) => onChange('category_id', e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Author
          </label>
          <Select
            value={formData.author_id || userProfile?.id || ''}
            onChange={(e) => onChange('author_id', e.target.value)}
          >
            <option value="">Select author</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.full_name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Co-Authors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Co-Authors
        </label>
        <Select
          value=""
          onChange={(e) => handleAddCoAuthor(e.target.value)}
        >
          <option value="">Add co-author</option>
          {authors
            .filter(a => a.id !== formData.author_id && !formData.co_authors?.includes(a.id))
            .map(author => (
              <option key={author.id} value={author.id}>
                {author.full_name}
              </option>
            ))}
        </Select>
        {formData.co_authors?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.co_authors.map(authorId => {
              const author = authors.find(a => a.id === authorId);
              return author ? (
                <span
                  key={authorId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {author.full_name}
                  <button
                    type="button"
                    onClick={() => handleRemoveCoAuthor(authorId)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <Input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type a tag and press Enter"
        />
        {formData.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-600 hover:text-red-600"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <TiptapContentEditor
          content={formData.content || ''}
          onChange={(content) => onChange('content', content)}
          placeholder="Start writing your article..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>
    </div>
  );
};

export default ContentTab;