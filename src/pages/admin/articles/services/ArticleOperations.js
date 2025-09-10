// src/pages/admin/articles/services/ArticleOperations.js
import { BaseOperations } from '../../../../services/BaseOperations';
import { BaseCache } from '../../../../services/BaseCache';
import { supabase } from '../../../../lib/supabase';
import { generateSlug, sanitizeData } from '../../../../utils';

export class ArticleOperationsService extends BaseOperations {
  constructor() {
    // Initialize with caching
    const cache = new BaseCache('articles', {
      ttl: 5 * 60 * 1000, // 5 minutes
      storage: 'sessionStorage'
    });

    super('articles', {
      cache,
      primaryKey: 'id',
      timestamps: true,
      softDelete: false
    });

    this.table = 'articles';
  }

  /**
   * Create article with full validation
   */
  async create(articleData) {
    try {
      // Sanitize and prepare data
      const sanitized = sanitizeData(articleData);
      
      // Generate slug if not provided
      if (!sanitized.slug && sanitized.title) {
        sanitized.slug = generateSlug(sanitized.title);
      }

      // Add canonical URL
      if (!sanitized.canonical_url && sanitized.slug) {
        sanitized.canonical_url = `https://rule27design.com/articles/${sanitized.slug}`;
      }

      // Calculate read time
      if (sanitized.content && sanitized.content.wordCount) {
        sanitized.read_time = Math.ceil(sanitized.content.wordCount / 200);
      }

      const { data, error } = await supabase
        .from(this.table)
        .insert([{
          ...sanitized,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Invalidate cache
      if (this.options.cache) {
        this.options.cache.invalidatePattern('articles');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating article:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update article
   */
  async update(id, articleData) {
    try {
      const sanitized = sanitizeData(articleData);
      
      // Recalculate read time if content changed
      if (sanitized.content && sanitized.content.wordCount) {
        sanitized.read_time = Math.ceil(sanitized.content.wordCount / 200);
      }

      const { data, error } = await supabase
        .from(this.table)
        .update({
          ...sanitized,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate specific cache entries
      if (this.options.cache) {
        this.options.cache.delete(`article_${id}`);
        this.options.cache.invalidatePattern('articles_list');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error updating article:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete article
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Clear cache
      if (this.options.cache) {
        this.options.cache.delete(`article_${id}`);
        this.options.cache.invalidatePattern('articles');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting article:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get single article with relations
   */
  async getById(id) {
    try {
      // Check cache first
      const cacheKey = `article_${id}`;
      if (this.options.cache) {
        const cached = this.options.cache.get(cacheKey);
        if (cached) return { success: true, data: cached, fromCache: true };
      }

      const { data, error } = await supabase
        .from(this.table)
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url),
          category:categories(id, name, slug),
          co_authors:profiles!co_authors(id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Cache the result
      if (this.options.cache && data) {
        this.options.cache.set(cacheKey, data);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching article:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk publish articles
   */
  async bulkPublish(articleIds) {
    try {
      const { error } = await supabase
        .from(this.table)
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', articleIds);

      if (error) throw error;

      // Clear cache for all affected articles
      articleIds.forEach(id => {
        if (this.options.cache) {
          this.options.cache.delete(`article_${id}`);
        }
      });
      
      if (this.options.cache) {
        this.options.cache.invalidatePattern('articles');
      }

      // Track analytics event
      await this.trackBulkEvent('publish', articleIds);

      return { success: true };
    } catch (error) {
      console.error('Error bulk publishing articles:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk archive articles
   */
  async bulkArchive(articleIds) {
    try {
      const { error } = await supabase
        .from(this.table)
        .update({
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .in('id', articleIds);

      if (error) throw error;

      // Clear cache
      this.invalidateBulkCache(articleIds);

      // Track event
      await this.trackBulkEvent('archive', articleIds);

      return { success: true };
    } catch (error) {
      console.error('Error bulk archiving articles:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk delete articles
   */
  async bulkDelete(articleIds) {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .in('id', articleIds);

      if (error) throw error;

      // Clear cache
      this.invalidateBulkCache(articleIds);

      // Track event
      await this.trackBulkEvent('delete', articleIds);

      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting articles:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Duplicate article
   */
  async duplicate(id) {
    try {
      // Get original article
      const original = await this.getById(id);
      if (!original.success || !original.data) {
        throw new Error('Article not found');
      }

      // Remove unique fields and update title
      const { 
        id: _, 
        slug, 
        created_at, 
        updated_at,
        published_at,
        view_count,
        unique_view_count,
        like_count,
        share_count,
        bookmark_count,
        average_read_depth,
        average_time_on_page,
        ...articleData 
      } = original.data;
      
      const duplicatedData = {
        ...articleData,
        title: `${articleData.title} (Copy)`,
        slug: `${slug}-copy-${Date.now()}`,
        status: 'draft',
        published_at: null,
        view_count: 0,
        unique_view_count: 0,
        like_count: 0,
        share_count: 0,
        bookmark_count: 0
      };

      return await this.create(duplicatedData);
    } catch (error) {
      console.error('Error duplicating article:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Export articles to CSV
   */
  async exportArticles(articleIds) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .in('id', articleIds);

      if (error) throw error;

      // Convert to CSV
      const csv = this.convertToCSV(data);
      
      // Download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `articles-export-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting articles:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get comprehensive metrics
   */
  async getMetrics() {
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get current metrics
      const { data: currentData, error: currentError } = await supabase
        .from(this.table)
        .select('status, view_count, unique_view_count, like_count, share_count, bookmark_count', 
          { count: 'exact' });

      if (currentError) throw currentError;

      // Get last month metrics for trends
      const { data: lastMonthData, error: lastMonthError } = await supabase
        .from(this.table)
        .select('status', { count: 'exact' })
        .lte('created_at', lastMonth.toISOString());

      if (lastMonthError) throw lastMonthError;

      // Get this week's published articles
      const { data: weekData, error: weekError } = await supabase
        .from(this.table)
        .select('id', { count: 'exact' })
        .gte('published_at', lastWeek.toISOString())
        .eq('status', 'published');

      if (weekError) throw weekError;

      // Calculate metrics
      const total = currentData.length;
      const published = currentData.filter(a => a.status === 'published').length;
      const draft = currentData.filter(a => a.status === 'draft').length;
      const archived = currentData.filter(a => a.status === 'archived').length;
      const scheduled = currentData.filter(a => a.status === 'scheduled').length;
      
      const totalViews = currentData.reduce((sum, a) => sum + (a.view_count || 0), 0);
      const totalUniqueViews = currentData.reduce((sum, a) => sum + (a.unique_view_count || 0), 0);
      const totalLikes = currentData.reduce((sum, a) => sum + (a.like_count || 0), 0);
      const totalShares = currentData.reduce((sum, a) => sum + (a.share_count || 0), 0);
      const totalBookmarks = currentData.reduce((sum, a) => sum + (a.bookmark_count || 0), 0);
      
      // Calculate engagement rate
      const avgEngagement = totalViews > 0 
        ? Math.round(((totalLikes + totalShares + totalBookmarks) / totalViews) * 100)
        : 0;

      // Calculate trends
      const lastMonthTotal = lastMonthData.length;
      const totalTrend = lastMonthTotal > 0 
        ? Math.round(((total - lastMonthTotal) / lastMonthTotal) * 100)
        : 0;

      const publishedThisWeek = weekData.length;

      return {
        success: true,
        data: {
          // Counts
          total,
          published,
          draft,
          archived,
          scheduled,
          publishedThisWeek,

          // Engagement
          totalViews,
          totalUniqueViews,
          totalLikes,
          totalShares,
          totalBookmarks,
          avgEngagement,

          // Trends
          totalTrend,
          viewsPerArticle: published > 0 ? Math.round(totalViews / published) : 0,
          likesPerArticle: published > 0 ? Math.round(totalLikes / published) : 0,

          // Performance
          topPerforming: currentData
            .filter(a => a.status === 'published')
            .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
            .slice(0, 5)
        }
      };
    } catch (error) {
      console.error('Error getting metrics:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Search articles
   */
  async search(query, filters = {}) {
    try {
      let supabaseQuery = supabase
        .from(this.table)
        .select(`
          id,
          title,
          slug,
          excerpt,
          status,
          featured_image,
          published_at,
          view_count,
          author:profiles!author_id(full_name, avatar_url),
          category:categories(name, slug)
        `);

      // Apply search
      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      // Apply filters
      if (filters.status && filters.status !== 'all') {
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

      // Order by relevance (view_count) and recency
      supabaseQuery = supabaseQuery.order('view_count', { ascending: false })
                                   .order('published_at', { ascending: false })
                                   .limit(20);

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error searching articles:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get related articles
   */
  async getRelated(articleId, limit = 5) {
    try {
      // Get the article to find related ones
      const { data: article, error: articleError } = await supabase
        .from(this.table)
        .select('category_id, tags')
        .eq('id', articleId)
        .single();

      if (articleError) throw articleError;

      // Find articles with same category or overlapping tags
      const { data, error } = await supabase
        .from(this.table)
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          published_at,
          view_count
        `)
        .eq('status', 'published')
        .neq('id', articleId)
        .or(`category_id.eq.${article.category_id},tags.ov.{${article.tags.join(',')}}`)
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error getting related articles:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Schedule article for publishing
   */
  async schedule(id, scheduledAt) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .update({
          status: 'scheduled',
          scheduled_at: scheduledAt,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Clear cache
      if (this.options.cache) {
        this.options.cache.delete(`article_${id}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error scheduling article:', error);
      return { success: false, error: error.message };
    }
  }

  // ========== HELPER METHODS ==========

  /**
   * Convert data to CSV format
   */
  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  /**
   * Invalidate cache for multiple articles
   */
  invalidateBulkCache(articleIds) {
    if (!this.options.cache) return;

    articleIds.forEach(id => {
      this.options.cache.delete(`article_${id}`);
    });
    this.options.cache.invalidatePattern('articles');
  }

  /**
   * Track bulk events for analytics
   */
  async trackBulkEvent(eventType, articleIds) {
    try {
      const events = articleIds.map(article_id => ({
        article_id,
        event_type: `bulk_${eventType}`,
        user_id: null, // Should be passed from context
        metadata: { bulk: true, count: articleIds.length },
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('article_events')
        .insert(events);

      if (error) console.error('Error tracking bulk event:', error);
    } catch (error) {
      console.error('Error in trackBulkEvent:', error);
    }
  }

  /**
   * Update article analytics
   */
  async trackView(articleId, sessionId, userId = null) {
    try {
      // Insert analytics record
      await supabase
        .from('article_analytics')
        .insert({
          article_id: articleId,
          session_id: sessionId,
          user_id: userId,
          created_at: new Date().toISOString()
        });

      // Increment view count
      await supabase.rpc('increment_article_views', { 
        article_id: articleId 
      });

    } catch (error) {
      console.error('Error tracking article view:', error);
    }
  }
}

// Export singleton instance
export const articleOperations = new ArticleOperationsService();