// src/pages/admin/articles/hooks/useArticles.js - Data fetching & CRUD (150 lines)
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';

export const useArticles = (userProfile) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const toast = useToast();

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

  // Fetch articles with proper error handling
  const fetchArticles = useCallback(async () => {
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
  }, [userProfile?.role, userProfile?.id, toast]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
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
  }, [toast]);

  // Fetch authors
  const fetchAuthors = useCallback(async () => {
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
  }, [toast]);

  // Handle edit article
  const handleEdit = useCallback((article) => {
    setEditingArticle(article);
    setShowEditor(true);
  }, []);

  // Handle delete article
  const handleDelete = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Article deleted', 'The article has been permanently deleted');
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article', error.message);
    }
  }, [fetchArticles, toast]);

  // Handle status change
  const handleStatusChange = useCallback(async (id, newStatus) => {
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

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      toast.success('Status updated', `Article status changed to ${newStatus}`);
      await fetchArticles();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', error.message);
    }
  }, [userProfile?.id, fetchArticles, toast]);

  // Initialize data on mount
  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchAuthors();
  }, [fetchArticles, fetchCategories, fetchAuthors]);

  return {
    // State
    articles,
    categories,
    authors,
    loading,
    showEditor,
    editingArticle,
    
    // Actions
    handleEdit,
    handleDelete,
    handleStatusChange,
    setShowEditor,
    setEditingArticle,
    
    // Utilities
    debugAndFixContent,
    refetch: fetchArticles
  };
};