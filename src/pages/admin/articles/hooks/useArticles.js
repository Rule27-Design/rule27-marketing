// src/pages/admin/articles/hooks/useArticles.js - Fixed with better error handling and fallback queries
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';
import { useLoadingState } from './useLoadingState.js'; 
import { useErrorHandler } from './useErrorHandler.js';

// Cache configuration
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  BACKGROUND_REFRESH_THRESHOLD: 2 * 60 * 1000, // 2 minutes
  MAX_CACHE_SIZE: 1000, // Max number of cached items
  SELECTIVE_FIELDS: {
    list: [
      'id', 'title', 'slug', 'excerpt', 'status', 'is_featured',
      'view_count', 'like_count', 'read_time',
      'created_at', 'updated_at', 'published_at', 'author_id', 'category_id'
    ],
    detail: '*', // Full fields for editing
    relations: {
      author: 'id, full_name, email, avatar_url',
      category: 'id, name, slug'
    }
  }
};

// In-memory cache with timestamp validation
class ArticleCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.backgroundRefreshQueue = new Set();
  }

  set(key, data, ttl = CACHE_CONFIG.TTL) {
    // Cleanup old entries if cache is too large
    if (this.cache.size >= CACHE_CONFIG.MAX_CACHE_SIZE) {
      this.cleanup();
    }

    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    
    if (!timestamp || Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    // Check if we should background refresh
    const backgroundThreshold = timestamp - CACHE_CONFIG.BACKGROUND_REFRESH_THRESHOLD;
    if (Date.now() > backgroundThreshold) {
      this.backgroundRefreshQueue.add(key);
    }

    return this.cache.get(key);
  }

  shouldBackgroundRefresh(key) {
    return this.backgroundRefreshQueue.has(key);
  }

  markRefreshed(key) {
    this.backgroundRefreshQueue.delete(key);
  }

  invalidate(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    this.backgroundRefreshQueue.delete(key);
  }

  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.invalidate(key);
      }
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now > timestamp) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        this.backgroundRefreshQueue.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
    this.backgroundRefreshQueue.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      backgroundQueue: this.backgroundRefreshQueue.size,
      hitRatio: this._hitRatio || 0
    };
  }
}

// Singleton cache instance
const articleCache = new ArticleCache();

export const useArticles = (userProfile) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    hasMore: false
  });

  // Performance tracking
  const queryCount = useRef(0);
  const lastFetchTime = useRef(0);
  
  // Use loading and error management hooks
  const {
    fetching,
    saving,
    deleting,
    withLoading,
    setLoading,
    isReadOnly
  } = useLoadingState();

  const {
    handleError,
    clearError,
    hasError,
    getError,
    retryOperation
  } = useErrorHandler();

  const toast = useToast();

  // Generate cache keys
  const getCacheKey = useCallback((type, params = {}) => {
    const baseKey = `articles_${type}`;
    const userKey = userProfile?.role === 'contributor' ? `_user_${userProfile.id}` : '';
    const paramsKey = Object.keys(params).length > 0 ? `_${JSON.stringify(params)}` : '';
    return `${baseKey}${userKey}${paramsKey}`;
  }, [userProfile?.role, userProfile?.id]);

  // Check if foreign tables exist (helper function)
  const checkTableAccess = useCallback(async () => {
    try {
      // Try to query a single row from each related table
      const profilesCheck = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
      const categoriesCheck = await supabase
        .from('categories')
        .select('id')
        .limit(1);

      return {
        hasProfiles: !profilesCheck.error,
        hasCategories: !categoriesCheck.error,
        profilesError: profilesCheck.error,
        categoriesError: categoriesCheck.error
      };
    } catch (error) {
      return {
        hasProfiles: false,
        hasCategories: false,
        error
      };
    }
  }, []);

  // Build optimized query with better error handling
  const buildQuery = useCallback((type = 'list', options = {}) => {
    const { 
      page = 1, 
      limit = 50, 
      includeRelations = true,
      selectFields = CACHE_CONFIG.SELECTIVE_FIELDS.list,
      filters = {},
      forceBasic = false
    } = options;

    let query = supabase.from('articles');

    // Select appropriate fields
    if (type === 'detail') {
      if (includeRelations && !forceBasic) {
        // Try full query with relations first
        query = query.select(`
          *,
          author:profiles!articles_author_id_fkey(id, full_name, email, avatar_url),
          category:categories!articles_category_id_fkey(id, name, slug)
        `);
      } else {
        query = query.select('*');
      }
    } else if (includeRelations && !forceBasic) {
      // Try query with relations
      query = query.select(`
        ${selectFields.join(', ')},
        author:profiles!articles_author_id_fkey(id, full_name, email, avatar_url),
        category:categories!articles_category_id_fkey(id, name, slug)
      `);
    } else {
      // Basic query without relations
      query = query.select(selectFields.join(', '));
    }

    // Apply user-based filtering
    if (userProfile?.role === 'contributor') {
      query = query.eq('author_id', userProfile.id);
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    // Add pagination
    if (type === 'list') {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    // Default ordering
    query = query.order('updated_at', { ascending: false });

    return query;
  }, [userProfile?.role, userProfile?.id]);

  // Content debugging function (unchanged from original)
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

  // Enhanced fetch with multiple fallback strategies
  const fetchArticles = useCallback(async (options = {}) => {
    const { 
      forceRefresh = false,
      page = pagination.page,
      limit = pagination.limit,
      backgroundRefresh = false
    } = options;

    const cacheKey = getCacheKey('list', { page, limit });
    
    // Check cache first (unless forcing refresh)
    if (!forceRefresh && !backgroundRefresh) {
      const cached = articleCache.get(cacheKey);
      if (cached) {
        setArticles(cached.articles);
        setPagination(cached.pagination);
        
        // Check for background refresh
        if (articleCache.shouldBackgroundRefresh(cacheKey)) {
          // Trigger background refresh without loading state
          fetchArticles({ ...options, backgroundRefresh: true, forceRefresh: true });
        }
        
        return cached;
      }
    }

    return withLoading('fetching', async () => {
      try {
        clearError('fetching');
        queryCount.current++;
        lastFetchTime.current = Date.now();

        let result = null;
        let usedFallback = false;

        // Strategy 1: Try with relations
        try {
          const query = buildQuery('list', { page, limit, includeRelations: true });
          const { data, error, count } = await query;

          if (error) {
            console.warn('Query with relations failed:', error.message);
            throw error;
          }

          result = {
            articles: data || [],
            pagination: {
              page,
              limit,
              total: count || 0,
              hasMore: (data?.length || 0) === limit
            }
          };
        } catch (relationError) {
          console.warn('Relations query failed, trying basic query:', relationError.message);
          usedFallback = true;

          // Strategy 2: Try without relations
          try {
            const basicQuery = buildQuery('list', { 
              page, 
              limit, 
              includeRelations: false,
              forceBasic: true
            });
            const { data, error, count } = await basicQuery;

            if (error) {
              console.error('Basic query also failed:', error.message);
              throw error;
            }

            result = {
              articles: data || [],
              pagination: {
                page,
                limit,
                total: count || 0,
                hasMore: (data?.length || 0) === limit
              }
            };

            // Fetch related data separately if basic query succeeded
            if (result.articles.length > 0) {
              await fetchRelatedDataSeparately(result.articles);
            }

          } catch (basicError) {
            console.error('All query strategies failed:', basicError.message);
            throw basicError;
          }
        }

        // Update state
        setArticles(result.articles);
        setPagination(result.pagination);
        
        // Cache successful results
        articleCache.set(cacheKey, result);
        articleCache.markRefreshed(cacheKey);

        // Show warning if using fallback
        if (usedFallback && !backgroundRefresh) {
          toast.warning(
            'Limited Data Loaded', 
            'Some related information may be missing due to database configuration.'
          );
        }
        
        return result;

      } catch (error) {
        console.error('All fetch strategies failed:', error);
        handleError('fetching', error, { 
          userRole: userProfile?.role,
          operation: 'fetchArticles',
          queryCount: queryCount.current,
          hasRelatedTables: await checkTableAccess()
        });
        setArticles([]);
        throw error;
      }
    });
  }, [userProfile?.role, pagination.page, pagination.limit, getCacheKey, buildQuery, withLoading, handleError, clearError, toast, checkTableAccess]);

  // Fetch related data separately when main query fails
  const fetchRelatedDataSeparately = useCallback(async (articlesData) => {
    try {
      // Fetch authors
      const authorIds = [...new Set(articlesData.map(a => a.author_id).filter(Boolean))];
      if (authorIds.length > 0) {
        const { data: authorsData } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', authorIds);

        if (authorsData) {
          // Map authors back to articles
          articlesData.forEach(article => {
            if (article.author_id) {
              article.author = authorsData.find(author => author.id === article.author_id);
            }
          });
        }
      }

      // Fetch categories
      const categoryIds = [...new Set(articlesData.map(a => a.category_id).filter(Boolean))];
      if (categoryIds.length > 0) {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id, name, slug')
          .in('id', categoryIds);

        if (categoriesData) {
          // Map categories back to articles
          articlesData.forEach(article => {
            if (article.category_id) {
              article.category = categoriesData.find(cat => cat.id === article.category_id);
            }
          });
        }
      }
    } catch (error) {
      console.warn('Failed to fetch related data separately:', error.message);
      // Don't throw - this is a best-effort enhancement
    }
  }, []);

  // Enhanced fetch for single article (with full content)
  const fetchArticle = useCallback(async (id) => {
    const cacheKey = getCacheKey('detail', { id });
    
    // Check cache first
    const cached = articleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      let result = null;

      // Try with relations first
      try {
        const query = buildQuery('detail', { includeRelations: true });
        const { data, error } = await query.eq('id', id).single();

        if (error) throw error;
        result = data;
      } catch (relationError) {
        console.warn('Detail query with relations failed, trying basic:', relationError.message);
        
        // Fallback to basic query
        const basicQuery = buildQuery('detail', { includeRelations: false, forceBasic: true });
        const { data, error } = await basicQuery.eq('id', id).single();

        if (error) throw error;
        result = data;

        // Fetch related data separately
        if (result) {
          await fetchRelatedDataSeparately([result]);
        }
      }

      articleCache.set(cacheKey, result);
      return result;

    } catch (error) {
      handleError('fetching', error, { articleId: id, operation: 'fetchArticle' });
      throw error;
    }
  }, [getCacheKey, buildQuery, handleError, fetchRelatedDataSeparately]);

  // Enhanced categories fetch with better error handling
  const fetchCategories = useCallback(async () => {
    const cacheKey = getCacheKey('categories');
    
    const cached = articleCache.get(cacheKey);
    if (cached) {
      setCategories(cached);
      return cached;
    }

    return withLoading('fetching', async () => {
      try {
        clearError('categories');
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('type', 'article')
          .eq('is_active', true)
          .order('name');
        
        if (error) {
          // If categories table doesn't exist or has different structure, provide fallback
          if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
            console.warn('Categories table not found, using empty array');
            const fallbackData = [];
            setCategories(fallbackData);
            articleCache.set(cacheKey, fallbackData);
            return fallbackData;
          }
          throw error;
        }
        
        const result = data || [];
        setCategories(result);
        articleCache.set(cacheKey, result);
        
        return result;
      } catch (error) {
        console.warn('Categories fetch failed:', error.message);
        handleError('categories', error, { operation: 'fetchCategories' });
        
        // Provide empty fallback instead of throwing
        const fallbackData = [];
        setCategories(fallbackData);
        return fallbackData;
      }
    });
  }, [getCacheKey, withLoading, handleError, clearError]);

  // Enhanced authors fetch with better error handling
  const fetchAuthors = useCallback(async () => {
    const cacheKey = getCacheKey('authors');
    
    const cached = articleCache.get(cacheKey);
    if (cached) {
      setAuthors(cached);
      return cached;
    }

    return withLoading('fetching', async () => {
      try {
        clearError('authors');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('role', ['admin', 'contributor'])
          .eq('is_active', true)
          .order('full_name');
        
        if (error) {
          // If profiles table doesn't exist or has different structure, provide fallback
          if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
            console.warn('Profiles table not found or has different structure, using current user as fallback');
            const fallbackData = userProfile ? [{ 
              id: userProfile.id, 
              full_name: userProfile.full_name || userProfile.email || 'Current User',
              email: userProfile.email 
            }] : [];
            setAuthors(fallbackData);
            articleCache.set(cacheKey, fallbackData);
            return fallbackData;
          }
          throw error;
        }
        
        const result = data || [];
        setAuthors(result);
        articleCache.set(cacheKey, result);
        
        return result;
      } catch (error) {
        console.warn('Authors fetch failed:', error.message);
        handleError('authors', error, { operation: 'fetchAuthors' });
        
        // Provide current user as fallback
        const fallbackData = userProfile ? [{ 
          id: userProfile.id, 
          full_name: userProfile.full_name || userProfile.email || 'Current User',
          email: userProfile.email 
        }] : [];
        setAuthors(fallbackData);
        return fallbackData;
      }
    });
  }, [getCacheKey, withLoading, handleError, clearError, userProfile]);

  // Cache invalidation helpers
  const invalidateCache = useCallback((pattern = 'articles_') => {
    articleCache.invalidatePattern(pattern);
  }, []);

  const invalidateArticleCache = useCallback((articleId) => {
    articleCache.invalidate(getCacheKey('detail', { id: articleId }));
    invalidateCache('articles_list'); // Invalidate all list caches
  }, [getCacheKey, invalidateCache]);

  // Enhanced operations with cache invalidation
  const handleEdit = useCallback((article) => {
    if (isReadOnly) {
      toast.warning('System Busy', 'Please wait for current operations to complete');
      return;
    }
    
    setEditingArticle(article);
    setShowEditor(true);
  }, [isReadOnly, toast]);

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
        
        // Invalidate caches
        invalidateArticleCache(id);
        
        toast.success('Article deleted', 'The article has been permanently deleted');
        await fetchArticles({ forceRefresh: true });
      } catch (error) {
        handleError('deleting', error, { 
          articleId: id,
          operation: 'deleteArticle'
        });
        throw error;
      }
    });
  }, [isReadOnly, withLoading, handleError, clearError, invalidateArticleCache, fetchArticles, toast]);

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
        
        // Invalidate caches
        invalidateArticleCache(id);
        
        toast.success('Status updated', `Article status changed to ${newStatus}`);
        await fetchArticles({ forceRefresh: true });
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
  }, [isReadOnly, userProfile?.id, userProfile?.role, withLoading, handleError, clearError, invalidateArticleCache, fetchArticles, toast]);

  // Pagination helpers
  const loadMore = useCallback(async () => {
    if (pagination.hasMore && !fetching) {
      await fetchArticles({ 
        page: pagination.page + 1,
        limit: pagination.limit
      });
    }
  }, [pagination.hasMore, pagination.page, pagination.limit, fetching, fetchArticles]);

  const resetPagination = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Initialize data on mount with better error handling
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check table access first
        const tableAccess = await checkTableAccess();
        console.log('Table access check:', tableAccess);

        // Run fetches in parallel but handle failures gracefully
        const results = await Promise.allSettled([
          fetchArticles(),
          fetchCategories(),
          fetchAuthors()
        ]);

        // Log any failures for debugging
        results.forEach((result, index) => {
          const operations = ['articles', 'categories', 'authors'];
          if (result.status === 'rejected') {
            console.warn(`Failed to fetch ${operations[index]}:`, result.reason);
          }
        });

      } catch (error) {
        console.error('Failed to initialize articles data:', error);
        // Don't throw - let individual components handle their errors
      }
    };

    initializeData();
  }, [fetchArticles, fetchCategories, fetchAuthors, checkTableAccess]);

  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      // Only clear cache if no other instances are using it
      if (typeof window !== 'undefined' && window.articlesInstanceCount === 1) {
        articleCache.clear();
      }
    };
  }, []);

  return {
    // State
    articles,
    categories,
    authors,
    showEditor,
    editingArticle,
    pagination,
    
    // Loading states
    loading: fetching,
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
    
    // Enhanced operations
    fetchArticle,
    loadMore,
    resetPagination,
    
    // Cache management
    invalidateCache,
    invalidateArticleCache,
    
    // Utilities
    debugAndFixContent,
    refetch: () => fetchArticles({ forceRefresh: true }),
    
    // Performance metrics
    cacheStats: articleCache.getStats(),
    queryCount: queryCount.current,
    lastFetchTime: lastFetchTime.current,
    
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