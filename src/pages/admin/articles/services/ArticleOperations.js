// src/pages/admin/articles/services/ArticleOperations.js
import { supabase } from '../../../../lib/supabase';

export class ArticleOperationsService {
  constructor() {
    this.table = 'articles';
  }

  // Create article
  async create(articleData) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .insert([{
          ...articleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  // Update article
  async update(id, articleData) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .update({
          ...articleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  // Delete article
  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  // Get single article
  async getById(id) {
    try {
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
      return data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  // Bulk publish
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
      return true;
    } catch (error) {
      console.error('Error bulk publishing articles:', error);
      throw error;
    }
  }

  // Bulk archive
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
      return true;
    } catch (error) {
      console.error('Error bulk archiving articles:', error);
      throw error;
    }
  }

  // Bulk delete
  async bulkDelete(articleIds) {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .in('id', articleIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error bulk deleting articles:', error);
      throw error;
    }
  }

  // Duplicate article
  async duplicate(id) {
    try {
      // Get original article
      const original = await this.getById(id);
      if (!original) throw new Error('Article not found');

      // Remove unique fields and update title
      const { id: _, slug, created_at, updated_at, ...articleData } = original;
      
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
      throw error;
    }
  }

  // Export articles
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

      return true;
    } catch (error) {
      console.error('Error exporting articles:', error);
      throw error;
    }
  }

  // Get metrics
  async getMetrics() {
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      // Get current metrics
      const { data: currentData, error: currentError } = await supabase
        .from(this.table)
        .select('status, view_count, unique_view_count, like_count, share_count', { count: 'exact' });

      if (currentError) throw currentError;

      // Get last month metrics for trends
      const { data: lastMonthData, error: lastMonthError } = await supabase
        .from(this.table)
        .select('status', { count: 'exact' })
        .lte('created_at', lastMonth.toISOString());

      if (lastMonthError) throw lastMonthError;

      // Calculate metrics
      const total = currentData.length;
      const published = currentData.filter(a => a.status === 'published').length;
      const totalViews = currentData.reduce((sum, a) => sum + (a.view_count || 0), 0);
      const totalLikes = currentData.reduce((sum, a) => sum + (a.like_count || 0), 0);
      const totalShares = currentData.reduce((sum, a) => sum + (a.share_count || 0), 0);
      
      // Calculate engagement rate
      const avgEngagement = totalViews > 0 
        ? Math.round(((totalLikes + totalShares) / totalViews) * 100)
        : 0;

      // Calculate trends
      const lastMonthTotal = lastMonthData.length;
      const totalTrend = lastMonthTotal > 0 
        ? Math.round(((total - lastMonthTotal) / lastMonthTotal) * 100)
        : 0;

      return {
        total,
        published,
        draft: currentData.filter(a => a.status === 'draft').length,
        archived: currentData.filter(a => a.status === 'archived').length,
        totalViews,
        avgEngagement,
        totalTrend,
        publishedTrend: 0, // Would need historical data
        viewsTrend: 0, // Would need historical data
        engagementTrend: 0 // Would need historical data
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  // Search articles
  async search(query) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('id, title, slug, excerpt, status')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }

  // Update status
  async updateStatus(id, status) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from(this.table)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating article status:', error);
      throw error;
    }
  }

  // Helper function to convert data to CSV
  convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // Handle arrays and objects
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value)}"`;
        }
        // Escape quotes in strings
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }
}

export default ArticleOperationsService;