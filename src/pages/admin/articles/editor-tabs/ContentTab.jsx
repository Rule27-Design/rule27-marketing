// src/pages/admin/articles/editor-tabs/ContentTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils';

const ContentTab = ({ formData, errors, onChange, userProfile }) => {
  const [categories, setCategories] = useState([]);
  const [coAuthors, setCoAuthors] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchCoAuthors();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .eq('type', 'article')
      .order('name');
    setCategories(data || []);
  };

  const fetchCoAuthors = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('role', ['admin', 'contributor'])
      .order('full_name');
    setCoAuthors(data || []);
  };

  const fetchTags = async () => {
    const { data } = await supabase
      .from('tags')
      .select('id, name')
      .order('name');
    setTags(data || []);
  };

  const handleAddTag = (tagName) => {
    if (!tagName.trim()) return;
    
    const existingTag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    const currentTags = formData.tags || [];
    
    if (existingTag && !currentTags.includes(existingTag.id)) {
      onChange('tags', [...currentTags, existingTag.id]);
    } else if (!existingTag) {
      // Create new tag (would need backend support)
      const tempId = `new-${Date.now()}`;
      onChange('tags', [...currentTags, tempId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <Input
          type="text"
          value={formData.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Enter article title"
          error={errors.title}
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug *
        </label>
        <Input
          type="text"
          value={formData.slug || ''}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder="article-url-slug"
          error={errors.slug}
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt || ''}
          onChange={(e) => onChange('excerpt', e.target.value)}
          placeholder="Brief description of the article"
          rows={3}
          className={cn(
            "w-full px-3 py-2 border rounded-md",
            errors.excerpt ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.excerpt && (
          <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <TiptapContentEditor
          content={formData.content}
          onChange={(content) => onChange('content', content)}
          placeholder="Write your article content..."
          error={errors.content}
        />
      </div>

      {/* Category and Author */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Select
            value={formData.category_id || ''}
            onChange={(value) => onChange('category_id', value)}
            options={[
              { value: '', label: 'Select category' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
            error={errors.category_id}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <Select
            value={formData.author_id || userProfile?.id || ''}
            onChange={(value) => onChange('author_id', value)}
            options={[
              { value: userProfile?.id, label: 'Me' },
              ...coAuthors
                .filter(a => a.id !== userProfile?.id)
                .map(author => ({
                  value: author.id,
                  label: author.full_name
                }))
            ]}
          />
        </div>
      </div>

      {/* Co-Authors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Co-Authors
        </label>
        <Select
          value=""
          onChange={(value) => {
            const current = formData.co_authors || [];
            if (!current.includes(value)) {
              onChange('co_authors', [...current, value]);
            }
          }}
          options={[
            { value: '', label: 'Add co-author...' },
            ...coAuthors
              .filter(a => 
                a.id !== userProfile?.id && 
                a.id !== formData.author_id &&
                !(formData.co_authors || []).includes(a.id)
              )
              .map(author => ({
                value: author.id,
                label: author.full_name
              }))
          ]}
        />
        
        {formData.co_authors?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.co_authors.map(authorId => {
              const author = coAuthors.find(a => a.id === authorId);
              return (
                <span
                  key={authorId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                >
                  {author?.full_name}
                  <button
                    onClick={() => {
                      onChange('co_authors', 
                        formData.co_authors.filter(id => id !== authorId)
                      );
                    }}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Add tags..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add tags..."]');
              handleAddTag(input.value);
              input.value = '';
            }}
          >
            Add
          </Button>
        </div>
        
        {formData.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tagId => {
              const tag = tags.find(t => t.id === tagId) || { name: tagId };
              return (
                <span
                  key={tagId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                >
                  #{tag.name}
                  <button
                    onClick={() => {
                      onChange('tags', formData.tags.filter(id => id !== tagId));
                    }}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTab;