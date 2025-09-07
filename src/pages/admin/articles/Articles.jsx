// src/pages/admin/Articles.jsx - Main Container
import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useToast } from '../../components/ui/Toast';
import { 
  validateData, 
  validationSchemas, 
  sanitizeData, 
  generateSlug, 
  cleanTimestampField,
  useValidation 
} from '../../utils/validation';

import ArticlesList from './ArticlesList';
import ArticleEditor from './ArticleEditor';

const Articles = () => {
  const { userProfile } = useOutletContext();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Main state
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Filter state
  const [filters, setFilters] = useState({
    status: searchParams.get('filter') || 'all',
    search: '',
    category: 'all',
    author: 'all',
    featured: 'all'
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: null,
    featured_image: '',
    featured_image_alt: '',
    featured_video: '',
    category_id: '',
    tags: [],
    co_authors: [],
    status: 'draft',
    is_featured: false,
    enable_comments: false,
    enable_reactions: true,
    scheduled_at: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    canonical_url: '',
    read_time: null,
    internal_notes: '',
    schema_markup: null
  });

  // Validation hook
  const { errors, validate, clearErrors, hasErrors } = useValidation(validationSchemas.article);

  // Data fetching
  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchAuthors();

    if (searchParams.get('action') === 'new') {
      setShowEditor(true);
    }
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('articles')
        .select(`
          *,
          author:profiles!articles_author_id_fkey(id, full_name, email, avatar_url),
          category:categories!articles_category_id_fkey(id, name, slug)
        `)
        .order('updated_at', { ascending: false });

      if (userProfile?.role === 'contributor') {
        query = query.eq('author_id', userProfile.id);
      }

      const { data, error } = await query;

      if (error) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('articles')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        setArticles(fallbackData || []);
        toast.warning('Articles loaded', 'Some data might be missing due to database constraints');
      } else {
        setArticles(data || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles', error.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'article')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories', error.message);
    }
  };

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('role', ['admin', 'contributor'])
        .eq('is_active', true)
        .order('full_name');
      
      if (error) throw error;
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast.error('Failed to load authors', error.message);
    }
  };

  // Content debugging function
  const debugAndFixContent = useCallback((content, articleTitle = 'Unknown') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 [${articleTitle}] Processing content:`, typeof content);
    }
    
    if (!content) {
      return { html: '', text: '', wordCount: 0, type: 'tiptap', version: '2.0' };
    }
    
    if (typeof content === 'string') {
      return {
        type: 'tiptap',
        html: content,
        text: content.replace(/<[^>]*>/g, ''),
        wordCount: content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length,
        version: '1.0'
      };
    }
    
    if (typeof content === 'object') {
      if (content.type === 'doc' && Array.isArray(content.content)) {
        const extractTextFromTipTap = (node) => {
          let text = '';
          if (node.text) {
            text += node.text;
          }
          if (node.content && Array.isArray(node.content)) {
            text += node.content.map(extractTextFromTipTap).join(' ');
          }
          return text;
        };
        
        const extractedText = extractTextFromTipTap(content);
        const wordCount = extractedText.split(/\s+/).filter(w => w.length > 0).length;
        
        return {
          type: 'tiptap',
          json: content,
          text: extractedText,
          wordCount: wordCount,
          version: '2.0'
        };
      }
      
      if (content.html || content.json) {
        return content;
      }
      
      if (content.content && typeof content.content === 'string') {
        return {
          type: 'tiptap',
          html: content.content,
          text: content.content.replace(/<[^>]*>/g, ''),
          wordCount: content.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length,
          version: '1.0'
        };
      }
    }
    
    return { html: '', text: '', wordCount: 0, type: 'tiptap', version: '2.0' };
  }, []);

  const handleEditArticle = useCallback((article) => {
    setEditingArticle(article);
    
    const fixedContent = debugAndFixContent(article.content, article.title);
    
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: fixedContent,
      featured_image: article.featured_image || '',
      featured_image_alt: article.featured_image_alt || '',
      featured_video: article.featured_video || '',
      category_id: article.category_id || '',
      tags: article.tags || [],
      co_authors: article.co_authors || [],
      status: article.status || 'draft',
      is_featured: article.is_featured || false,
      enable_comments: article.enable_comments || false,
      enable_reactions: article.enable_reactions !== false,
      scheduled_at: article.scheduled_at || '',
      meta_title: article.meta_title || '',
      meta_description: article.meta_description || '',
      meta_keywords: article.meta_keywords || [],
      og_title: article.og_title || '',
      og_description: article.og_description || '',
      og_image: article.og_image || '',
      twitter_card: article.twitter_card || 'summary_large_image',
      canonical_url: article.canonical_url || '',
      read_time: article.read_time,
      internal_notes: article.internal_notes || '',
      schema_markup: article.schema_markup
    });
    
    setShowEditor(true);
  }, [debugAndFixContent]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: null,
      featured_image: '',
      featured_image_alt: '',
      featured_video: '',
      category_id: '',
      tags: [],
      co_authors: [],
      status: 'draft',
      is_featured: false,
      enable_comments: false,
      enable_reactions: true,
      scheduled_at: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_card: 'summary_large_image',
      canonical_url: '',
      read_time: null,
      internal_notes: '',
      schema_markup: null
    });
    clearErrors();
  }, [clearErrors]);

  // Pass all necessary props and handlers to child components
  const editorProps = {
    showEditor,
    editingArticle,
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    categories,
    authors,
    errors,
    hasErrors,
    saving,
    setSaving,
    validate,
    clearErrors,
    toast,
    userProfile,
    supabase,
    onClose: () => {
      setShowEditor(false);
      setEditingArticle(null);
      setActiveTab('overview');
      resetForm();
    },
    onSave: async () => {
      try {
        setSaving(true);
        clearErrors();

        const sanitizedData = sanitizeData(formData);

        if (!sanitizedData.slug && sanitizedData.title) {
          sanitizedData.slug = generateSlug(sanitizedData.title);
        }

        if (!sanitizedData.canonical_url && sanitizedData.slug) {
          sanitizedData.canonical_url = `https://rule27design.com/articles/${sanitizedData.slug}`;
        }

        if (!validate(sanitizedData)) {
          toast.error('Validation failed', 'Please fix the errors and try again');
          return;
        }

        if (sanitizedData.content && sanitizedData.content.wordCount) {
          sanitizedData.read_time = Math.ceil(sanitizedData.content.wordCount / 200);
        }

        const articleData = {
          ...sanitizedData,
          author_id: userProfile.id,
          updated_by: userProfile.id,
          tags: sanitizedData.tags.filter(Boolean),
          meta_keywords: sanitizedData.meta_keywords.filter(Boolean),
          co_authors: sanitizedData.co_authors.filter(Boolean),
          scheduled_at: cleanTimestampField(sanitizedData.scheduled_at)
        };

        if (editingArticle) {
          const { error } = await supabase
            .from('articles')
            .update(articleData)
            .eq('id', editingArticle.id);

          if (error) throw error;
          toast.success('Article updated', 'Your changes have been saved successfully');
        } else {
          articleData.created_by = userProfile.id;
          const { error } = await supabase
            .from('articles')
            .insert(articleData);

          if (error) throw error;
          toast.success('Article created', 'Your article has been created successfully');
        }

        await fetchArticles();
        setShowEditor(false);
        setEditingArticle(null);
        setActiveTab('overview');
        resetForm();
      } catch (error) {
        console.error('Error saving article:', error);
        if (error.name === 'ValidationError') {
          toast.error('Validation failed', Object.values(error.errors).join(', '));
        } else {
          toast.error('Failed to save article', error.message);
        }
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <ErrorBoundary>
      <div>
        <ArticlesList
          articles={articles}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          authors={authors}
          userProfile={userProfile}
          onEdit={handleEditArticle}
          onDelete={async (id) => {
            if (!confirm('Are you sure you want to delete this article?')) return;
            try {
              const { error } = await supabase.from('articles').delete().eq('id', id);
              if (error) throw error;
              toast.success('Article deleted', 'The article has been permanently deleted');
              await fetchArticles();
            } catch (error) {
              console.error('Error deleting article:', error);
              toast.error('Failed to delete article', error.message);
            }
          }}
          onStatusChange={async (id, newStatus) => {
            try {
              const updateData = { status: newStatus };
              
              if (newStatus === 'pending_approval') {
                updateData.submitted_for_approval_at = new Date().toISOString();
              } else if (newStatus === 'approved') {
                updateData.approved_by = userProfile.id;
                updateData.approved_at = new Date().toISOString();
              } else if (newStatus === 'published') {
                updateData.published_at = new Date().toISOString();
              }

              const { error } = await supabase.from('articles').update(updateData).eq('id', id);
              if (error) throw error;
              toast.success('Status updated', `Article status changed to ${newStatus}`);
              await fetchArticles();
            } catch (error) {
              console.error('Error updating status:', error);
              toast.error('Failed to update status', error.message);
            }
          }}
          onNewArticle={() => setShowEditor(true)}
          onRefresh={fetchArticles}
        />

        {showEditor && <ArticleEditor {...editorProps} />}
      </div>
    </ErrorBoundary>
  );
};

export default Articles;