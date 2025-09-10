// src/pages/admin/articles/services/ArticleOperations.js
import { supabase } from '../../../../lib/supabase';
import { sanitizeData } from '../../../../utils';

export class ArticleOperationsService {
  // Calculate read time helper
  calculateReadTime(content) {
    if (!content) return 0;
    const text = typeof content === 'string' ? content : content.text || '';
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Create article
  async create(data) {
    try {
      // Calculate read time if content exists
      if (data.content) {
        data.read_time = this.calculateReadTime(data.content);
      }

      const cleanData = sanitizeData(data);

      const { data: article, error } = await supabase
        .from('articles')
        .insert([{
          ...cleanData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Create initial analytics record
      await this.createAnalyticsRecord(article.id);

      return { success: true, data: article };
    } catch (error) {
      console.error('Error creating article:', error);
      return { success: false, error: error.message };
    }
  }

  // Update article
  async update(id, data) {
    try {
      // Calculate read time if content exists
      if (data.content) {
        data.read_time = this.calculateReadTime(data.content);
      }

      const cleanData = sanitizeData(data);

      // Check if status is changing to published
      const { data: currentArticle } = await supabase
        .from('articles')
        .select('status')
        .eq('id', id)
        .single();

      const isPublishing = currentArticle?.status !== 'published' && cleanData.status === 'published';

      const updateData = {
        ...cleanData,
        updated_at: new Date().toISOString()
      };

      // Add published_at if publishing for the first time
      if (isPublishing) {
        updateData.published_at = new Date().toISOString();
      }

      const { data: article, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Track status change in analytics
      if (currentArticle?.status !== article.status) {
        await this.trackStatusChange(id, currentArticle.status, article.status);
      }

      return { success: true, data: article };
    } catch (error) {
      console.error('Error updating article:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete article
  async delete(id) {
    try {
      // Delete related data first
      await this.deleteRelatedData(id);

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting article:', error);
      return { success: false, error: error.message };
    }
  }

  // Duplicate article
  async duplicate(id) {
    try {
      // Get original article
      const { data: original, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create duplicate with modified title and slug
      const duplicate = {
        ...original,
        id: undefined,
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        status: 'draft',
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: null,
        view_count: 0,
        unique_view_count: 0,
        like_count: 0,
        share_count: 0,
        bookmark_count: 0
      };

      const { data: newArticle, error: insertError } = await supabase
        .from('articles')
        .insert([duplicate])
        .select()
        .single();

      if (insertError) throw insertError;

      // Create analytics record for new article
      await this.createAnalyticsRecord(newArticle.id);

      return { success: true, data: newArticle };
    } catch (error) {
      console.error('Error duplicating article:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule article publishing
  async schedulePublishing(id, scheduledDate) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: 'scheduled',
          scheduled_at: scheduledDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Create scheduled job (would integrate with a job queue in production)
      await this.createScheduledJob(id, scheduledDate);

      return { success: true, data };
    } catch (error) {
      console.error('Error scheduling article:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk operations
  async bulkPublish(ids) {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      // Track bulk action
      await this.trackBulkAction('publish', ids);

      return { success: true };
    } catch (error) {
      console.error('Error bulk publishing:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkArchive(ids) {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ 
          status: 'archived',
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      // Track bulk action
      await this.trackBulkAction('archive', ids);

      return { success: true };
    } catch (error) {
      console.error('Error bulk archiving:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkDelete(ids) {
    try {
      // Delete related data for all articles
      for (const id of ids) {
        await this.deleteRelatedData(id);
      }

      const { error } = await supabase
        .from('articles')
        .delete()
        .in('id', ids);

      if (error) throw error;

      // Track bulk action
      await this.trackBulkAction('delete', ids);

      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkUpdateStatus(ids, status) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .in('id', ids);

      if (error) throw error;

      // Track bulk action
      await this.trackBulkAction(`status_${status}`, ids);

      return { success: true };
    } catch (error) {
      console.error('Error bulk updating status:', error);
      return { success: false, error: error.message };
    }
  }

  // Archive/Unarchive
  async archive(id) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: 'archived',
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error archiving article:', error);
      return { success: false, error: error.message };
    }
  }

  async unarchive(id) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: 'draft',
          archived_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error unarchiving article:', error);
      return { success: false, error: error.message };
    }
  }

  // Update metrics
  async updateViewCount(id, sessionId) {
    try {
      // Check if this session has already viewed
      const { data: existingView } = await supabase
        .from('article_analytics')
        .select('id')
        .eq('article_id', id)
        .eq('session_id', sessionId)
        .single();

      if (!existingView) {
        // Record new view
        await supabase
          .from('article_analytics')
          .insert({
            article_id: id,
            session_id: sessionId,
            event_type: 'view',
            created_at: new Date().toISOString()
          });

        // Increment view counts
        const { data: article } = await supabase
          .from('articles')
          .select('view_count, unique_view_count')
          .eq('id', id)
          .single();

        await supabase
          .from('articles')
          .update({
            view_count: (article?.view_count || 0) + 1,
            unique_view_count: (article?.unique_view_count || 0) + 1
          })
          .eq('id', id);
      } else {
        // Just increment total view count
        const { data: article } = await supabase
          .from('articles')
          .select('view_count')
          .eq('id', id)
          .single();

        await supabase
          .from('articles')
          .update({
            view_count: (article?.view_count || 0) + 1
          })
          .eq('id', id);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating view count:', error);
      return { success: false, error: error.message };
    }
  }

  async updateLikeCount(id, userId, action = 'like') {
    try {
      const { data: article } = await supabase
        .from('articles')
        .select('like_count')
        .eq('id', id)
        .single();

      const newCount = action === 'like' 
        ? (article?.like_count || 0) + 1
        : Math.max(0, (article?.like_count || 0) - 1);

      await supabase
        .from('articles')
        .update({ like_count: newCount })
        .eq('id', id);

      // Track in analytics
      await supabase
        .from('article_analytics')
        .insert({
          article_id: id,
          user_id: userId,
          event_type: action,
          created_at: new Date().toISOString()
        });

      return { success: true, count: newCount };
    } catch (error) {
      console.error('Error updating like count:', error);
      return { success: false, error: error.message };
    }
  }

  async updateShareCount(id, platform) {
    try {
      const { data: article } = await supabase
        .from('articles')
        .select('share_count')
        .eq('id', id)
        .single();

      const newCount = (article?.share_count || 0) + 1;

      await supabase
        .from('articles')
        .update({ share_count: newCount })
        .eq('id', id);

      // Track in analytics
      await supabase
        .from('article_analytics')
        .insert({
          article_id: id,
          event_type: 'share',
          metadata: { platform },
          created_at: new Date().toISOString()
        });

      return { success: true, count: newCount };
    } catch (error) {
      console.error('Error updating share count:', error);
      return { success: false, error: error.message };
    }
  }

  async updateBookmarkCount(id, userId, action = 'bookmark') {
    try {
      const { data: article } = await supabase
        .from('articles')
        .select('bookmark_count')
        .eq('id', id)
        .single();

      const newCount = action === 'bookmark'
        ? (article?.bookmark_count || 0) + 1
        : Math.max(0, (article?.bookmark_count || 0) - 1);

      await supabase
        .from('articles')
        .update({ bookmark_count: newCount })
        .eq('id', id);

      // Track in analytics
      await supabase
        .from('article_analytics')
        .insert({
          article_id: id,
          user_id: userId,
          event_type: action,
          created_at: new Date().toISOString()
        });

      return { success: true, count: newCount };
    } catch (error) {
      console.error('Error updating bookmark count:', error);
      return { success: false, error: error.message };
    }
  }

  // Track reading progress
  async trackReadingProgress(id, userId, progress, timeOnPage) {
    try {
      await supabase
        .from('article_analytics')
        .insert({
          article_id: id,
          user_id: userId,
          event_type: 'read_progress',
          metadata: {
            scroll_depth: progress,
            time_on_page: timeOnPage
          },
          created_at: new Date().toISOString()
        });

      // Update average read depth if progress is complete
      if (progress >= 90) {
        const { data: article } = await supabase
          .from('articles')
          .select('average_read_depth, average_time_on_page')
          .eq('id', id)
          .single();

        // Calculate new averages (simplified - in production, use proper averaging)
        const newAvgDepth = article?.average_read_depth 
          ? (article.average_read_depth + progress) / 2
          : progress;
        
        const newAvgTime = article?.average_time_on_page
          ? (article.average_time_on_page + timeOnPage) / 2
          : timeOnPage;

        await supabase
          .from('articles')
          .update({
            average_read_depth: newAvgDepth,
            average_time_on_page: newAvgTime
          })
          .eq('id', id);
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking reading progress:', error);
      return { success: false, error: error.message };
    }
  }

  // Get related articles
  async getRelatedArticles(id, limit = 5) {
    try {
      // Get current article
      const { data: currentArticle } = await supabase
        .from('articles')
        .select('category_id, tags')
        .eq('id', id)
        .single();

      if (!currentArticle) {
        return { success: false, error: 'Article not found' };
      }

      // Find related by category and tags
      let query = supabase
        .from('articles')
        .select('id, title, slug, excerpt, featured_image, published_at, author:profiles!author_id(full_name)')
        .eq('status', 'published')
        .neq('id', id)
        .limit(limit);

      // Prioritize same category
      if (currentArticle.category_id) {
        query = query.eq('category_id', currentArticle.category_id);
      }

      const { data: relatedArticles, error } = await query;

      if (error) throw error;

      // If not enough articles in same category, get more from other categories
      if (relatedArticles.length < limit) {
        const { data: moreArticles } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_at, author:profiles!author_id(full_name)')
          .eq('status', 'published')
          .neq('id', id)
          .neq('category_id', currentArticle.category_id)
          .limit(limit - relatedArticles.length);

        if (moreArticles) {
          relatedArticles.push(...moreArticles);
        }
      }

      return { success: true, data: relatedArticles };
    } catch (error) {
      console.error('Error getting related articles:', error);
      return { success: false, error: error.message };
    }
  }

  // Search articles
  async searchArticles(query, filters = {}) {
    try {
      let supabaseQuery = supabase
        .from('articles')
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url),
          category:categories(id, name, slug)
        `);

      // Apply search query
      if (query) {
        supabaseQuery = supabaseQuery.or(`
          title.ilike.%${query}%,
          excerpt.ilike.%${query}%,
          content.ilike.%${query}%
        `);
      }

      // Apply filters
      if (filters.status) {
        supabaseQuery = supabaseQuery.eq('status', filters.status);
      }
      if (filters.category_id) {
        supabaseQuery = supabaseQuery.eq('category_id', filters.category_id);
      }
      if (filters.author_id) {
        supabaseQuery = supabaseQuery.eq('author_id', filters.author_id);
      }
      if (filters.is_featured !== undefined) {
        supabaseQuery = supabaseQuery.eq('is_featured', filters.is_featured);
      }

      // Date range filters
      if (filters.start_date) {
        supabaseQuery = supabaseQuery.gte('published_at', filters.start_date);
      }
      if (filters.end_date) {
        supabaseQuery = supabaseQuery.lte('published_at', filters.end_date);
      }

      // Sorting
      const sortField = filters.sort_by || 'published_at';
      const sortOrder = filters.sort_order || 'desc';
      supabaseQuery = supabaseQuery.order(sortField, { ascending: sortOrder === 'asc' });

      // Pagination
      if (filters.page && filters.page_size) {
        const from = (filters.page - 1) * filters.page_size;
        const to = from + filters.page_size - 1;
        supabaseQuery = supabaseQuery.range(from, to);
      }

      const { data, error, count } = await supabaseQuery;

      if (error) throw error;

      return { 
        success: true, 
        data,
        total: count,
        page: filters.page || 1,
        page_size: filters.page_size || data.length
      };
    } catch (error) {
      console.error('Error searching articles:', error);
      return { success: false, error: error.message };
    }
  }

  // Export articles
  async exportArticles(ids = null) {
    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          author:profiles!author_id(full_name),
          category:categories(name)
        `);

      if (ids && ids.length > 0) {
        query = query.in('id', ids);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Convert to CSV
      const csv = this.convertToCSV(data);
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `articles-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting articles:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper methods
  async deleteRelatedData(articleId) {
    try {
      // Delete analytics data
      await supabase
        .from('article_analytics')
        .delete()
        .eq('article_id', articleId);

      // Delete comments
      await supabase
        .from('article_comments')
        .delete()
        .eq('article_id', articleId);

      // Delete reactions
      await supabase
        .from('article_reactions')
        .delete()
        .eq('article_id', articleId);

      // Delete bookmarks
      await supabase
        .from('article_bookmarks')
        .delete()
        .eq('article_id', articleId);

      return { success: true };
    } catch (error) {
      console.error('Error deleting related data:', error);
      return { success: false, error: error.message };
    }
  }

  async createAnalyticsRecord(articleId) {
    try {
      await supabase
        .from('article_analytics')
        .insert({
          article_id: articleId,
          event_type: 'created',
          created_at: new Date().toISOString()
        });

      return { success: true };
    } catch (error) {
      console.error('Error creating analytics record:', error);
      return { success: false, error: error.message };
    }
  }

  async trackStatusChange(articleId, oldStatus, newStatus) {
    try {
      await supabase
        .from('article_analytics')
        .insert({
          article_id: articleId,
          event_type: 'status_change',
          metadata: { old_status: oldStatus, new_status: newStatus },
          created_at: new Date().toISOString()
        });

      return { success: true };
    } catch (error) {
      console.error('Error tracking status change:', error);
      return { success: false, error: error.message };
    }
  }

  async trackBulkAction(action, articleIds) {
    try {
      await supabase
        .from('article_analytics')
        .insert({
          event_type: 'bulk_action',
          metadata: { action, article_ids: articleIds },
          created_at: new Date().toISOString()
        });

      return { success: true };
    } catch (error) {
      console.error('Error tracking bulk action:', error);
      return { success: false, error: error.message };
    }
  }

  async createScheduledJob(articleId, scheduledDate) {
    // In production, this would integrate with a job queue like Bull or similar
    // For now, just log it
    console.log(`Scheduled publishing for article ${articleId} at ${scheduledDate}`);
    return { success: true };
  }

  convertToCSV(data) {
    if (data.length === 0) return '';

    // Flatten nested objects
    const flattenedData = data.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      author: row.author?.full_name || '',
      category: row.category?.name || '',
      published_at: row.published_at,
      created_at: row.created_at,
      view_count: row.view_count,
      like_count: row.like_count,
      share_count: row.share_count,
      is_featured: row.is_featured
    }));

    const headers = Object.keys(flattenedData[0]);
    const csvHeaders = headers.join(',');
    const csvRows = flattenedData.map(row => {
      return headers.map(header => {
        const value = row[header] || '';
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }
}

// Export singleton instance
export const articleOperations = new ArticleOperationsService();