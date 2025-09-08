// src/pages/admin/articles/hooks/useArticles.js - Enhanced with new loading and error handling
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';
import { useLoadingState } from './useLoadingState.js';
import { useErrorHandler } from './useErrorHandler.js';

export const useArticles = (userProfile) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  
  // Use new loading state management
  const {
    fetching,
    saving,
    deleting,
    withLoading,
    setLoading,
    isReadOnly
  } = useLoadingState();

  // Use new error handling
  const {
    handleError,
    clearError,
    hasError,
    getError,
    retryOperation
  } = useErrorHandler();

  const toast = useToast();

  // Content debugging function (unchanged)
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

  // Enhanced fetch articles with loading and error handling
  const fetchArticles = useCallback(async () => {
    return withLoading('fetching', async () => {
      try {
        // Clear any previous errors
        clearError('fetching');
        
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
          // Try fallback query without relations
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('articles')
            .select('*')
            .order('updated_at', { ascending: false });
          
          if (fallbackError) throw fallbackError;
          
          setArticles(fallbackData || []);
          toast.warning('Articles loaded', 'Some data might be missing due to database constraints');
          
          // Log the relation error but don't throw
          handleError('fetching', error, { 
            isFallback: true, 
            userRole: userProfile?.role 
          }, false);
          
        } else {
          setArticles(data || []);
        }
      } catch (error) {
        // Handle critical fetch errors
        handleError('fetching', error, { 
          userRole: userProfile?.role,
          operation: 'fetchArticles'
        });
        setArticles([]);
        throw error; // Re-throw for component to handle
      }
    });
  }, [userProfile?.role, userProfile?.id, withLoading, handleError, clearError, toast]);

  // Enhanced fetch categories with error handling
  const fetchCategories = useCallback(async () => {
    return withLoading('fetching', async () => {
      try {
        clearError('categories');
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('type', 'article')
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        handleError('categories', error, { operation: 'fetchCategories' });
        setCategories([]);
      }
    });
  }, [withLoading, handleError, clearError]);

  // Enhanced fetch authors with error handling
  const fetchAuthors = useCallback(async () => {
    return withLoading('fetching', async () => {
      try {
        clearError('authors');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('role', ['admin', 'contributor'])
          .eq('is_active', true)
          .order('full_name');
        
        if (error) throw error;
        setAuthors(data || []);
      } catch (error) {
        handleError('authors', error, { operation: 'fetchAuthors' });
        setAuthors([]);
      }
    });
  }, [withLoading, handleError, clearError]);

  // Enhanced handle edit with loading state
  const handleEdit = useCallback((article) => {
    if (isReadOnly) {
      toast.warning('System Busy', 'Please wait for current operations to complete');
      return;
    }
    
    setEditingArticle(article);
    setShowEditor(true);
  }, [isReadOnly, toast]);

  // Enhanced handle delete with loading and error handling
  const handleDelete = useCallback(async (id) => {
    if (isReadOnly) {
      toast.warning('System Busy', 'Please wait for current operations to complete');
      return;
    }

    if (!confirm('Are you sure you want to delete this article?')) return;

    return withLoading('deleting', async () => {
      try {
        clearError('deleting');
        
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast.success('Article deleted', 'The article has been permanently deleted');
        await fetchArticles();
      } catch (error) {
        handleError('deleting', error, { 
          articleId: id,
          operation: 'deleteArticle'
        });
        throw error;
      }
    });
  }, [isReadOnly, withLoading, handleError, clearError, fetchArticles, toast]);

  // Enhanced handle status change with loading and error handling
  const handleStatusChange = useCallback(async (id, newStatus) => {
    if (isReadOnly) {
      toast.warning('System Busy', 'Please wait for current operations to complete');
      return;
    }

    return withLoading('saving', async () => {
      try {
        clearError('statusChange');
        
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
        handleError('statusChange', error, { 
          articleId: id,
          newStatus,
          userRole: userProfile?.role,
          operation: 'changeStatus'
        });
        throw error;
      }
    });
  }, [isReadOnly, userProfile?.id, userProfile?.role, withLoading, handleError, clearError, fetchArticles, toast]);

  // Retry functions for failed operations
  const retryFetchArticles = useCallback(() => {
    return retryOperation('fetching', fetchArticles);
  }, [retryOperation, fetchArticles]);

  const retryFetchCategories = useCallback(() => {
    return retryOperation('categories', fetchCategories);
  }, [retryOperation, fetchCategories]);

  const retryFetchAuthors = useCallback(() => {
    return retryOperation('authors', fetchAuthors);
  }, [retryOperation, fetchAuthors]);

  // Initialize data on mount with error handling
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Run fetches in parallel where possible
        await Promise.allSettled([
          fetchArticles(),
          fetchCategories(),
          fetchAuthors()
        ]);
      } catch (error) {
        // Individual errors are already handled, this is for catastrophic failures
        console.error('Failed to initialize articles data:', error);
      }
    };

    initializeData();
  }, [fetchArticles, fetchCategories, fetchAuthors]);

  return {
    // State
    articles,
    categories,
    authors,
    showEditor,
    editingArticle,
    
    // Loading states
    loading: fetching, // Backward compatibility
    fetching,
    saving,
    deleting,
    isReadOnly,
    
    // Error states
    errors: {
      fetching: getError('fetching'),
      categories: getError('categories'),
      authors: getError('authors'),
      deleting: getError('deleting'),
      statusChange: getError('statusChange')
    },
    hasErrors: hasError('fetching') || hasError('categories') || hasError('authors'),
    
    // Actions
    handleEdit,
    handleDelete,
    handleStatusChange,
    setShowEditor,
    setEditingArticle,
    
    // Retry functions
    retryFetchArticles,
    retryFetchCategories,
    retryFetchAuthors,
    
    // Utilities
    debugAndFixContent,
    refetch: fetchArticles,
    
    // Error management
    clearError,
    clearAllErrors: () => {
      clearError('fetching');
      clearError('categories');
      clearError('authors');
      clearError('deleting');
      clearError('statusChange');
    }
  };
};