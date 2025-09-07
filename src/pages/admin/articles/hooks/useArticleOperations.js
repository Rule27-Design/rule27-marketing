// src/pages/admin/articles/hooks/useArticleOperations.js - Common article operations
import { useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';
import { generateSlug } from '../../../../utils/validation';

export const useArticleOperations = (userProfile) => {
  const toast = useToast();

  // Duplicate an article
  const duplicateArticle = useCallback(async (article, onSuccess) => {
    try {
      const duplicatedData = {
        ...article,
        id: undefined, // Remove ID to create new
        title: `${article.title} (Copy)`,
        slug: `${article.slug}-copy-${Date.now()}`,
        status: 'draft',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        published_at: null,
        created_at: undefined,
        updated_at: undefined,
        created_by: userProfile.id,
        updated_by: userProfile.id,
        author_id: userProfile.id
      };

      const { data, error } = await supabase
        .from('articles')
        .insert(duplicatedData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Article duplicated', 'A copy has been created as a draft');
      onSuccess?.(data);
      
      return data;
    } catch (error) {
      console.error('Error duplicating article:', error);
      toast.error('Failed to duplicate article', error.message);
      throw error;
    }
  }, [userProfile, toast]);

  // Bulk update article status
  const bulkUpdateStatus = useCallback(async (articleIds, newStatus, onSuccess) => {
    try {
      const updateData = { 
        status: newStatus,
        updated_by: userProfile.id
      };

      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      } else if (newStatus === 'pending_approval') {
        updateData.submitted_for_approval_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .in('id', articleIds);

      if (error) throw error;

      toast.success(
        'Articles updated', 
        `${articleIds.length} article(s) marked as ${newStatus}`
      );
      onSuccess?.();
    } catch (error) {
      console.error('Error bulk updating articles:', error);
      toast.error('Failed to update articles', error.message);
      throw error;
    }
  }, [userProfile, toast]);

  // Bulk delete articles
  const bulkDelete = useCallback(async (articleIds, onSuccess) => {
    if (!confirm(`Are you sure you want to delete ${articleIds.length} article(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .in('id', articleIds);

      if (error) throw error;

      toast.success(
        'Articles deleted', 
        `${articleIds.length} article(s) have been permanently deleted`
      );
      onSuccess?.();
    } catch (error) {
      console.error('Error bulk deleting articles:', error);
      toast.error('Failed to delete articles', error.message);
      throw error;
    }
  }, [toast]);

  // Schedule article for publishing
  const scheduleArticle = useCallback(async (articleId, scheduledDate, onSuccess) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          scheduled_at: scheduledDate,
          status: 'scheduled',
          updated_by: userProfile.id
        })
        .eq('id', articleId);

      if (error) throw error;

      toast.success(
        'Article scheduled', 
        `Article will be published on ${new Date(scheduledDate).toLocaleDateString()}`
      );
      onSuccess?.();
    } catch (error) {
      console.error('Error scheduling article:', error);
      toast.error('Failed to schedule article', error.message);
      throw error;
    }
  }, [userProfile, toast]);

  // Generate and update article slug
  const updateSlug = useCallback(async (articleId, title, onSuccess) => {
    try {
      const newSlug = generateSlug(title);
      
      // Check if slug already exists
      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', newSlug)
        .neq('id', articleId)
        .single();

      const finalSlug = existingArticle ? `${newSlug}-${Date.now()}` : newSlug;

      const { error } = await supabase
        .from('articles')
        .update({
          slug: finalSlug,
          updated_by: userProfile.id
        })
        .eq('id', articleId);

      if (error) throw error;

      toast.success('Slug updated', `Article slug updated to: ${finalSlug}`);
      onSuccess?.(finalSlug);
      
      return finalSlug;
    } catch (error) {
      console.error('Error updating slug:', error);
      toast.error('Failed to update slug', error.message);
      throw error;
    }
  }, [userProfile, toast]);

  // Toggle article featured status
  const toggleFeatured = useCallback(async (articleId, currentStatus, onSuccess) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          is_featured: !currentStatus,
          updated_by: userProfile.id
        })
        .eq('id', articleId);

      if (error) throw error;

      toast.success(
        'Featured status updated', 
        `Article ${!currentStatus ? 'added to' : 'removed from'} featured articles`
      );
      onSuccess?.();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status', error.message);
      throw error;
    }
  }, [userProfile, toast]);

  // Update article view count (for analytics)
  const incrementViewCount = useCallback(async (articleId) => {
    try {
      // Get current view count
      const { data: article, error: fetchError } = await supabase
        .from('articles')
        .select('view_count')
        .eq('id', articleId)
        .single();

      if (fetchError) throw fetchError;

      // Increment view count
      const { error } = await supabase
        .from('articles')
        .update({
          view_count: (article.view_count || 0) + 1
        })
        .eq('id', articleId);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Don't show toast for this as it's a background operation
    }
  }, []);

  // Export article data
  const exportArticles = useCallback(async (articleIds = null, format = 'json') => {
    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          author:profiles!articles_author_id_fkey(id, full_name, email),
          category:categories!articles_category_id_fkey(id, name, slug)
        `);

      if (articleIds) {
        query = query.in('id', articleIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      let exportData;
      let filename;
      let mimeType;

      switch (format) {
        case 'csv':
          // Convert to CSV format
          const csvHeaders = ['Title', 'Slug', 'Status', 'Author', 'Category', 'Created', 'Views'];
          const csvRows = data.map(article => [
            article.title,
            article.slug,
            article.status,
            article.author?.full_name || 'Unknown',
            article.category?.name || 'None',
            new Date(article.created_at).toLocaleDateString(),
            article.view_count || 0
          ]);
          
          exportData = [csvHeaders, ...csvRows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
          filename = `articles-export-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
          
        case 'json':
        default:
          exportData = JSON.stringify(data, null, 2);
          filename = `articles-export-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
      }

      // Create and download file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Export completed', `${data.length} articles exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting articles:', error);
      toast.error('Failed to export articles', error.message);
      throw error;
    }
  }, [toast]);

  return {
    duplicateArticle,
    bulkUpdateStatus,
    bulkDelete,
    scheduleArticle,
    updateSlug,
    toggleFeatured,
    incrementViewCount,
    exportArticles
  };
};