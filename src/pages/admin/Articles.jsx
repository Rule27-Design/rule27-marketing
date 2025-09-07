// src/pages/admin/Articles.jsx - Fixed version with improvements
import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AdminIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import ImageUpload from '../../components/ui/ImageUpload';
import TiptapContentEditor, { TiptapContentDisplay } from '../../components/ui/TiptapContentEditor';
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

const Articles = () => {
  const { userProfile } = useOutletContext();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    status: searchParams.get('filter') || 'all',
    search: '',
    category: 'all',
    author: 'all',
    featured: 'all'
  });
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Enhanced Article form state
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

  // FIXED: Content debugging function (cleaned up for production)
  const debugAndFixContent = useCallback((content, articleTitle = 'Unknown') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 [${articleTitle}] Processing content:`, typeof content);
    }
    
    // If content is null or undefined, return empty content
    if (!content) {
      return { html: '', text: '', wordCount: 0, type: 'tiptap', version: '2.0' };
    }
    
    // If content is a string (likely HTML), convert to proper format
    if (typeof content === 'string') {
      return {
        type: 'tiptap',
        html: content,
        text: content.replace(/<[^>]*>/g, ''),
        wordCount: content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length,
        version: '1.0'
      };
    }
    
    // If content is object, check what type
    if (typeof content === 'object') {
      // TipTap JSON format
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
      
      // Already processed format
      if (content.html || content.json) {
        return content;
      }
      
      // Legacy format
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
        // Fallback to simpler query if joins fail
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

  const handleSaveArticle = async () => {
    try {
      setSaving(true);
      clearErrors();

      // Sanitize data
      const sanitizedData = sanitizeData(formData);

      // Generate slug if not provided
      if (!sanitizedData.slug && sanitizedData.title) {
        sanitizedData.slug = generateSlug(sanitizedData.title);
      }

      // Validate data
      if (!validate(sanitizedData)) {
        toast.error('Validation failed', 'Please fix the errors and try again');
        return;
      }

      // Calculate read time if content exists
      if (sanitizedData.content && sanitizedData.content.wordCount) {
        sanitizedData.read_time = Math.ceil(sanitizedData.content.wordCount / 200);
      }

      // Prepare data with cleaned fields
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
  };

  const handleDeleteArticle = async (id) => {
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
  };

  const handleStatusChange = async (id, newStatus) => {
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
  };

  // FIXED: Handle edit article function
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

  // FIXED: Content change handler with stable reference
  const handleContentChange = useCallback((content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  }, []);

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const newArray = (prev[field] || []).filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  };

  const filterArticles = () => {
    return articles.filter(article => {
      if (filters.status !== 'all' && article.status !== filters.status) return false;
      if (filters.category !== 'all' && article.category_id !== filters.category) return false;
      if (filters.author !== 'all' && article.author_id !== filters.author) return false;
      if (filters.featured !== 'all') {
        const isFeatured = article.is_featured ? 'featured' : 'not_featured';
        if (isFeatured !== filters.featured) return false;
      }
      if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredArticles = filterArticles();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-heading-bold uppercase">Articles Management</h1>
              <p className="text-gray-600 mt-1">{filteredArticles.length} of {articles.length} articles</p>
            </div>
            <Button
              variant="default"
              onClick={() => setShowEditor(true)}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              New Article
            </Button>
          </div>

          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Input
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full"
            />
            
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'pending_approval', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' }
              ]}
            />

            <Select
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value })}
              options={[
                { value: 'all', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name }))
              ]}
            />

            <Select
              value={filters.author}
              onChange={(value) => setFilters({ ...filters, author: value })}
              options={[
                { value: 'all', label: 'All Authors' },
                ...authors.map(author => ({ value: author.id, label: author.full_name }))
              ]}
            />

            <Select
              value={filters.featured}
              onChange={(value) => setFilters({ ...filters, featured: value })}
              options={[
                { value: 'all', label: 'All Articles' },
                { value: 'featured', label: 'Featured' },
                { value: 'not_featured', label: 'Not Featured' }
              ]}
            />

            <Button
              variant="outline"
              onClick={fetchArticles}
              iconName="RefreshCw"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Article
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Author
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Category
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Stats
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Updated
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 w-2/5">
                      <div className="flex items-start space-x-3">
                        {article.featured_image && (
                          <img 
                            src={article.featured_image} 
                            alt={article.title}
                            className="w-16 h-12 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm leading-5 line-clamp-2">{article.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            {article.is_featured && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Icon name="Star" size={10} className="mr-1" />
                                Featured
                              </span>
                            )}
                            {article.read_time && (
                              <span className="text-xs text-gray-400">{article.read_time}min</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 w-32">
                      <div className="flex items-center space-x-2">
                        {article.author?.avatar_url && (
                          <img 
                            src={article.author.avatar_url} 
                            alt={article.author.full_name}
                            className="w-6 h-6 rounded-full flex-shrink-0"
                          />
                        )}
                        <span className="text-xs text-gray-600 font-medium block truncate">
                          {article.author?.full_name || 'Unknown'}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-4 w-24">
                      <span className="text-xs text-gray-600 truncate block">
                        {article.category?.name || 'None'}
                      </span>
                    </td>

                    <td className="px-3 py-4 w-20">
                      <span className={`px-2 py-1 text-xs rounded-full truncate block text-center ${getStatusBadgeClass(article.status)}`}>
                        {article.status === 'pending_approval' ? 'Pending' : article.status}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-center w-24">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Icon name="Eye" size={10} className="mr-1" />
                            {article.view_count || 0}
                          </span>
                          <span className="flex items-center">
                            <Icon name="Heart" size={10} className="mr-1" />
                            {article.like_count || 0}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-xs text-gray-600 w-20">
                      {new Date(article.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="px-3 py-4 text-right w-32">
                      <div className="flex items-center justify-end space-x-1">
                        {userProfile?.role === 'admin' ? (
                          <>
                            {(article.status === 'draft' || article.status === 'pending_approval' || article.status === 'approved') && (
                              <Button
                                size="xs"
                                variant="default"
                                onClick={() => handleStatusChange(article.id, 'published')}
                                className="bg-green-500 hover:bg-green-600 text-xs px-2 py-1"
                              >
                                Publish
                              </Button>
                            )}
                            {article.status === 'published' && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleStatusChange(article.id, 'archived')}
                                className="border-orange-300 text-orange-600 hover:bg-orange-50 text-xs px-2 py-1"
                              >
                                Archive
                              </Button>
                            )}
                          </>
                        ) : (
                          article.status === 'draft' && (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleStatusChange(article.id, 'pending_approval')}
                              className="text-xs px-2 py-1"
                            >
                              Submit
                            </Button>
                          )
                        )}
                        
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleEditArticle(article)}
                          title="Edit article"
                          className="p-1"
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                        
                        {(userProfile?.role === 'admin' || article.author_id === userProfile?.id) && (
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete article"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Icon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  {articles.length === 0 ? 'No articles found' : 'No articles match your filters'}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowEditor(true)}
                >
                  Create your first article
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* FIXED: Enhanced Article Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gray-50">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingArticle(null);
                    setActiveTab('overview');
                    resetForm();
                  }}
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>

              {/* Tab Navigation */}
              <div className="border-b bg-white">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: 'FileText' },
                    { id: 'content', label: 'Content', icon: 'Edit' },
                    { id: 'media', label: 'Media', icon: 'Image' },
                    { id: 'seo', label: 'SEO', icon: 'Search' },
                    { id: 'settings', label: 'Settings', icon: 'Settings' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-accent text-accent'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Enter article title"
                        error={errors.title}
                      />
                      
                      <Input
                        label="Slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="auto-generated-from-title"
                        error={errors.slug}
                      />
                    </div>

                    <Input
                      label="Excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the article"
                      error={errors.excerpt}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Category"
                        value={formData.category_id}
                        onChange={(value) => setFormData({ ...formData, category_id: value })}
                        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                        error={errors.category_id}
                      />

                      <Select
                        label="Status"
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value })}
                        options={[
                          { value: 'draft', label: 'Draft' },
                          { value: 'pending_approval', label: 'Pending Approval' },
                          { value: 'approved', label: 'Approved' },
                          { value: 'published', label: 'Published' }
                        ]}
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Tags</label>
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={tag}
                            onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                            placeholder="Tag name"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArrayItem('tags', index)}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('tags')}
                        iconName="Plus"
                      >
                        Add Tag
                      </Button>
                    </div>

                    {/* Co-Authors */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Co-Authors</label>
                      <Select
                        value=""
                        onChange={(value) => {
                          if (value && !formData.co_authors.includes(value)) {
                            setFormData({
                              ...formData,
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
                                  onClick={() => removeArrayItem('co_authors', index)}
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
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* FIXED: TipTap Content Editor with stable key */}
                    <TiptapContentEditor
                      key={`content-editor-${editingArticle?.id || 'new'}`} // Stable key based only on article ID
                      value={formData.content}
                      onChange={handleContentChange} // Stable reference
                      label="Article Content"
                      minHeight="400px"
                      error={errors.content}
                    />

                    {/* Content Preview */}
                    {formData.content && (
                      <div className="border-t pt-6">
                        <h3 className="font-medium mb-4">Content Preview</h3>
                        <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                          <TiptapContentDisplay content={formData.content?.json || formData.content} />
                        </div>
                        
                        {/* Content Stats */}
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
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
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <ImageUpload
                      label="Featured Image"
                      value={formData.featured_image}
                      onChange={(value) => setFormData({ ...formData, featured_image: value })}
                      bucket="media"
                      folder="articles"
                    />

                    <Input
                      label="Featured Image Alt Text"
                      value={formData.featured_image_alt}
                      onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                      placeholder="Describe the image for accessibility"
                    />

                    <Input
                      label="Featured Video URL (optional)"
                      value={formData.featured_video}
                      onChange={(e) => setFormData({ ...formData, featured_video: e.target.value })}
                      placeholder="YouTube, Vimeo, or direct video URL"
                    />
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Meta Title"
                        value={formData.meta_title}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                        placeholder="SEO optimized title (60 chars max)"
                        error={errors.meta_title}
                      />
                      
                      <Input
                        label="Canonical URL (optional)"
                        value={formData.canonical_url}
                        onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                        placeholder="https://example.com/canonical-url"
                        error={errors.canonical_url}
                      />
                    </div>

                    <Input
                      label="Meta Description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="SEO description (155-160 characters)"
                      error={errors.meta_description}
                    />

                    {/* Meta Keywords */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                      {formData.meta_keywords.map((keyword, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={keyword}
                            onChange={(e) => updateArrayItem('meta_keywords', index, e.target.value)}
                            placeholder="Keyword or phrase"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArrayItem('meta_keywords', index)}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('meta_keywords')}
                        iconName="Plus"
                      >
                        Add Keyword
                      </Button>
                    </div>

                    {/* Social Media */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4">Social Media</h3>
                      <div className="space-y-4">
                        <Input
                          label="Open Graph Title"
                          value={formData.og_title}
                          onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                          placeholder="Title for social media sharing"
                        />
                        
                        <Input
                          label="Open Graph Description"
                          value={formData.og_description}
                          onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                          placeholder="Description for social media sharing"
                        />

                        <ImageUpload
                          label="Open Graph Image"
                          value={formData.og_image}
                          onChange={(value) => setFormData({ ...formData, og_image: value })}
                          bucket="media"
                          folder="articles/social"
                          showPreview={true}
                          error={errors.og_image}
                        />

                        <Select
                          label="Twitter Card Type"
                          value={formData.twitter_card}
                          onChange={(value) => setFormData({ ...formData, twitter_card: value })}
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
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Publishing Options</h3>
                        
                        <Checkbox
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                          label="Featured Article"
                          description="Display this article prominently on the homepage"
                        />
                        
                        <Checkbox
                          checked={formData.enable_comments}
                          onCheckedChange={(checked) => setFormData({ ...formData, enable_comments: checked })}
                          label="Enable Comments"
                          description="Allow readers to comment on this article"
                        />
                        
                        <Checkbox
                          checked={formData.enable_reactions}
                          onCheckedChange={(checked) => setFormData({ ...formData, enable_reactions: checked })}
                          label="Enable Reactions"
                          description="Allow readers to like and share this article"
                        />

                        <Input
                          type="datetime-local"
                          label="Scheduled Publication (optional)"
                          value={formData.scheduled_at}
                          onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Editorial Notes</h3>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Internal Notes</label>
                          <textarea
                            value={formData.internal_notes}
                            onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
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
                )}
              </div>

              {/* Footer Actions */}
              <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditor(false);
                      setEditingArticle(null);
                      setActiveTab('overview');
                      resetForm();
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  
                  {hasErrors && (
                    <span className="text-sm text-red-600">
                      Please fix validation errors
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {userProfile?.role === 'admin' ? (
                    (formData.status === 'draft' || formData.status === 'pending_approval') && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData({ ...formData, status: 'published' });
                          setTimeout(handleSaveArticle, 100);
                        }}
                        className="bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                        disabled={saving}
                      >
                        Save & Publish
                      </Button>
                    )
                  ) : (
                    formData.status === 'draft' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData({ ...formData, status: 'pending_approval' });
                          setTimeout(handleSaveArticle, 100);
                        }}
                        className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
                        disabled={saving}
                      >
                        Submit for Review
                      </Button>
                    )
                  )}
                  
                  <Button
                    variant="default"
                    onClick={handleSaveArticle}
                    className="bg-accent hover:bg-accent/90"
                    iconName="Save"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (editingArticle ? 'Update Article' : 'Save Article')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Articles;