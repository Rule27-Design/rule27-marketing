// src/pages/admin/Articles.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const Articles = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get('filter') || 'all',
    search: '',
    category: 'all'
  });
  const [categories, setCategories] = useState([]);

  // Article form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    tags: [],
    status: 'draft',
    featured_image: '',
    enable_comments: false,
    enable_reactions: true,
    is_featured: false,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();

    // Check if we should open the editor
    if (searchParams.get('action') === 'new') {
      setShowEditor(true);
    }
  }, []);

  useEffect(() => {
    const filtered = filterArticles();
    setArticles(filtered);
  }, [filters]);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          author:profiles!author_id(full_name, email),
          category:categories!category_id(name)
        `)
        .order('created_at', { ascending: false });

      // If contributor, only show their articles
      if (userProfile?.role === 'contributor') {
        query = query.eq('author_id', userProfile.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'article')
      .eq('is_active', true)
      .order('name');
    
    setCategories(data || []);
  };

  const filterArticles = () => {
    return articles.filter(article => {
      if (filters.status !== 'all' && article.status !== filters.status) return false;
      if (filters.category !== 'all' && article.category_id !== filters.category) return false;
      if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  };

  const handleSaveArticle = async () => {
    try {
      // Generate slug if not provided
      if (!formData.slug && formData.title) {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      // Prepare data
      const articleData = {
        ...formData,
        author_id: userProfile.id,
        updated_by: userProfile.id,
        content: { blocks: [{ type: 'paragraph', content: formData.content }] }, // Simple content structure
        tags: formData.tags.filter(Boolean)
      };

      if (editingArticle) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
      } else {
        // Create new article
        articleData.created_by = userProfile.id;
        const { error } = await supabase
          .from('articles')
          .insert(articleData);

        if (error) throw error;
      }

      // Refresh articles list
      await fetchArticles();
      setShowEditor(false);
      setEditingArticle(null);
      resetForm();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article: ' + error.message);
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
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article: ' + error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updateData = { status: newStatus };
      
      // Add timestamps based on status
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
      await fetchArticles();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_id: '',
      tags: [],
      status: 'draft',
      featured_image: '',
      enable_comments: false,
      enable_reactions: true,
      is_featured: false,
      meta_title: '',
      meta_description: ''
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading-bold uppercase">Articles Management</h1>
          <Button
            variant="default"
            onClick={() => setShowEditor(true)}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            New Article
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              { value: 'pending_approval', label: 'Pending Approval' },
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{article.title}</p>
                      {article.is_featured && (
                        <span className="text-xs text-accent">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.author?.full_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.category?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.view_count || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* Status Actions */}
                    {article.status === 'draft' && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleStatusChange(article.id, 'pending_approval')}
                      >
                        Submit
                      </Button>
                    )}
                    {article.status === 'pending_approval' && userProfile?.role === 'admin' && (
                      <Button
                        size="xs"
                        variant="success"
                        onClick={() => handleStatusChange(article.id, 'approved')}
                      >
                        Approve
                      </Button>
                    )}
                    {article.status === 'approved' && (
                      <Button
                        size="xs"
                        variant="default"
                        onClick={() => handleStatusChange(article.id, 'published')}
                      >
                        Publish
                      </Button>
                    )}
                    
                    {/* Edit/Delete */}
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setEditingArticle(article);
                        setFormData(article);
                        setShowEditor(true);
                      }}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    
                    {(userProfile?.role === 'admin' || article.author_id === userProfile?.id) && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {articles.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No articles found</p>
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

      {/* Article Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-heading-bold uppercase">
                {editingArticle ? 'Edit Article' : 'New Article'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingArticle(null);
                  resetForm();
                }}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                
                <Input
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
              </div>

              <Input
                label="Excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the article"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full h-64 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                  placeholder="Write your article content here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={formData.category_id}
                  onChange={(value) => setFormData({ ...formData, category_id: value })}
                  options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
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

              <Input
                label="Featured Image URL"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />

              <div className="space-y-3">
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
                />
                
                <Checkbox
                  checked={formData.enable_reactions}
                  onCheckedChange={(checked) => setFormData({ ...formData, enable_reactions: checked })}
                  label="Enable Reactions"
                />
              </div>

              {/* SEO Fields */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <Input
                    label="Meta Title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="SEO optimized title"
                  />
                  
                  <Input
                    label="Meta Description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="SEO description (155-160 characters)"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditor(false);
                  setEditingArticle(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveArticle}
                className="bg-accent hover:bg-accent/90"
              >
                {editingArticle ? 'Update Article' : 'Create Article'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;