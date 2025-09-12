// src/pages/admin/case-studies/services/CaseStudyOperations.js
import { supabase } from '../../../../lib/supabase';
import { generateSlug, sanitizeData, cleanTimestampField } from '../../../../utils/validation';

class CaseStudyOperationsService {
  // Create case study
  async create(caseStudyData, userProfile) {
    try {
      // Define all valid columns from the case_studies schema
      const validColumns = [
        'title', 'slug', 'client_name', 'client_logo', 'client_website',
        'client_industry', 'client_company_size', 'project_duration',
        'project_start_date', 'project_end_date', 'project_investment',
        'service_type', 'service_category', 'deliverables', 'technologies_used',
        'team_size', 'team_members', 'challenge', 'solution', 'implementation_process',
        'key_metrics', 'results_narrative', 'testimonial_id', 'hero_image',
        'hero_video', 'gallery_images', 'status', 'is_featured', 'sort_order',
        'meta_title', 'meta_description', 'meta_keywords', 'og_title',
        'og_description', 'og_image', 'canonical_url', 'internal_notes',
        'created_by', 'updated_by'
      ];

      // Create clean data with only valid columns
      const cleanData = {};
      validColumns.forEach(column => {
        if (caseStudyData[column] !== undefined) {
          cleanData[column] = caseStudyData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);
      
      // Generate slug if not provided
      if (!sanitized.slug && sanitized.title) {
        sanitized.slug = generateSlug(sanitized.title);
      }

      // Auto-generate canonical URL if not provided
      if (!sanitized.canonical_url && sanitized.slug) {
        sanitized.canonical_url = `https://rule27design.com/case-studies/${sanitized.slug}`;
      }

      // Clean timestamp fields
      if (sanitized.project_start_date) {
        sanitized.project_start_date = cleanTimestampField(sanitized.project_start_date);
      }
      if (sanitized.project_end_date) {
        sanitized.project_end_date = cleanTimestampField(sanitized.project_end_date);
      }

      // Set creator
      if (userProfile) {
        sanitized.created_by = userProfile.id;
        sanitized.updated_by = userProfile.id;
      }

      // Remove any null or empty string values for array fields
      if (sanitized.deliverables) {
        sanitized.deliverables = sanitized.deliverables.filter(Boolean);
      }
      if (sanitized.technologies_used) {
        sanitized.technologies_used = sanitized.technologies_used.filter(Boolean);
      }
      if (sanitized.meta_keywords) {
        sanitized.meta_keywords = sanitized.meta_keywords.filter(Boolean);
      }

      // Ensure key_metrics is properly formatted
      if (sanitized.key_metrics && Array.isArray(sanitized.key_metrics)) {
        sanitized.key_metrics = sanitized.key_metrics.filter(metric => 
          metric && metric.label && metric.value
        );
      }

      const { data, error } = await supabase
        .from('case_studies')
        .insert(sanitized)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Update case study
  async update(caseStudyId, caseStudyData, userProfile) {
    try {
      // Define all valid columns
      const validColumns = [
        'title', 'slug', 'client_name', 'client_logo', 'client_website',
        'client_industry', 'client_company_size', 'project_duration',
        'project_start_date', 'project_end_date', 'project_investment',
        'service_type', 'service_category', 'deliverables', 'technologies_used',
        'team_size', 'team_members', 'challenge', 'solution', 'implementation_process',
        'key_metrics', 'results_narrative', 'testimonial_id', 'hero_image',
        'hero_video', 'gallery_images', 'status', 'is_featured', 'sort_order',
        'meta_title', 'meta_description', 'meta_keywords', 'og_title',
        'og_description', 'og_image', 'canonical_url', 'internal_notes',
        'view_count', 'unique_view_count', 'inquiry_count', 'updated_by'
      ];

      // Create clean data with only valid columns
      const cleanData = {};
      validColumns.forEach(column => {
        if (caseStudyData[column] !== undefined) {
          cleanData[column] = caseStudyData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);

      // Clean timestamp fields
      if (sanitized.project_start_date) {
        sanitized.project_start_date = cleanTimestampField(sanitized.project_start_date);
      }
      if (sanitized.project_end_date) {
        sanitized.project_end_date = cleanTimestampField(sanitized.project_end_date);
      }

      // Add updated metadata
      sanitized.updated_at = new Date().toISOString();
      if (userProfile) {
        sanitized.updated_by = userProfile.id;
      }

      // Remove any null or empty string values for array fields
      if (sanitized.deliverables) {
        sanitized.deliverables = sanitized.deliverables.filter(Boolean);
      }
      if (sanitized.technologies_used) {
        sanitized.technologies_used = sanitized.technologies_used.filter(Boolean);
      }
      if (sanitized.meta_keywords) {
        sanitized.meta_keywords = sanitized.meta_keywords.filter(Boolean);
      }

      // Ensure key_metrics is properly formatted
      if (sanitized.key_metrics && Array.isArray(sanitized.key_metrics)) {
        sanitized.key_metrics = sanitized.key_metrics.filter(metric => 
          metric && metric.label && metric.value
        );
      }

      const { data, error } = await supabase
        .from('case_studies')
        .update(sanitized)
        .eq('id', caseStudyId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete case study
  async delete(caseStudyId) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', caseStudyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Duplicate a case study
  async duplicate(caseStudy, userProfile) {
    try {
      const duplicatedData = {
        ...caseStudy,
        id: undefined,
        title: `${caseStudy.title} (Copy)`,
        slug: `${caseStudy.slug}-copy-${Date.now()}`,
        status: 'draft',
        view_count: 0,
        unique_view_count: 0,
        inquiry_count: 0,
        created_at: undefined,
        updated_at: undefined,
        created_by: userProfile?.id,
        updated_by: userProfile?.id
      };

      const { data, error } = await supabase
        .from('case_studies')
        .insert(duplicatedData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error duplicating case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk publish case studies
  async bulkPublish(caseStudyIds) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .in('id', caseStudyIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk publishing:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk archive case studies
  async bulkArchive(caseStudyIds) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ 
          status: 'archived',
          is_active: false
        })
        .in('id', caseStudyIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk archiving:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk delete case studies
  async bulkDelete(caseStudyIds) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .in('id', caseStudyIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting:', error);
      return { success: false, error: error.message };
    }
  }

  // Toggle featured status
  async toggleFeatured(caseStudyId, currentStatus, userProfile) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({
          is_featured: !currentStatus,
          updated_by: userProfile?.id
        })
        .eq('id', caseStudyId);

      if (error) throw error;
      return { success: true, featured: !currentStatus };
    } catch (error) {
      console.error('Error toggling featured status:', error);
      return { success: false, error: error.message };
    }
  }

  // Update view count
  async incrementViewCount(caseStudyId) {
    try {
      const { data: caseStudy, error: fetchError } = await supabase
        .from('case_studies')
        .select('view_count')
        .eq('id', caseStudyId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('case_studies')
        .update({
          view_count: (caseStudy.view_count || 0) + 1
        })
        .eq('id', caseStudyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return { success: false, error: error.message };
    }
  }

  // Update inquiry count
  async incrementInquiryCount(caseStudyId) {
    try {
      const { data: caseStudy, error: fetchError } = await supabase
        .from('case_studies')
        .select('inquiry_count')
        .eq('id', caseStudyId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('case_studies')
        .update({
          inquiry_count: (caseStudy.inquiry_count || 0) + 1
        })
        .eq('id', caseStudyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error incrementing inquiry count:', error);
      return { success: false, error: error.message };
    }
  }

  // Export case studies
  async exportCaseStudies(caseStudyIds = null, format = 'csv') {
    try {
      let query = supabase
        .from('case_studies')
        .select('*');

      if (caseStudyIds) {
        query = query.in('id', caseStudyIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      let exportData;
      let filename;
      let mimeType;

      switch (format) {
        case 'csv':
          exportData = this.convertToCSV(data);
          filename = `case-studies-export-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
          
        case 'json':
          exportData = JSON.stringify(data, null, 2);
          filename = `case-studies-export-${Date.now()}.json`;
          mimeType = 'application/json';
          break;

        default:
          throw new Error('Unsupported export format');
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

      return { success: true };
    } catch (error) {
      console.error('Error exporting case studies:', error);
      return { success: false, error: error.message };
    }
  }

  // Convert to CSV format
  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = [
      'Title',
      'Client',
      'Industry',
      'Service Type',
      'Status',
      'Featured',
      'Project Duration',
      'Start Date',
      'End Date',
      'Views',
      'Inquiries',
      'Created',
      'Updated'
    ];
    
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(cs => {
      const row = [
        this.escapeCSV(cs.title),
        this.escapeCSV(cs.client_name),
        this.escapeCSV(cs.client_industry || ''),
        this.escapeCSV(cs.service_type || ''),
        cs.status,
        cs.is_featured ? 'Yes' : 'No',
        this.escapeCSV(cs.project_duration || ''),
        cs.project_start_date ? new Date(cs.project_start_date).toLocaleDateString() : '',
        cs.project_end_date ? new Date(cs.project_end_date).toLocaleDateString() : '',
        cs.view_count || 0,
        cs.inquiry_count || 0,
        new Date(cs.created_at).toLocaleDateString(),
        new Date(cs.updated_at).toLocaleDateString()
      ];
      
      return row.join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  // Escape CSV values
  escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  // Get case study statistics
  async getStatistics(dateRange = null) {
    try {
      let query = supabase
        .from('case_studies')
        .select('*', { count: 'exact' });
      
      if (dateRange) {
        if (dateRange.start) {
          query = query.gte('created_at', dateRange.start);
        }
        if (dateRange.end) {
          query = query.lte('created_at', dateRange.end);
        }
      }
      
      const { data, error, count } = await query;
      if (error) throw error;
      
      const stats = {
        total: count || 0,
        byStatus: {},
        byIndustry: {},
        byServiceType: {},
        featured: 0,
        totalViews: 0,
        totalInquiries: 0,
        avgProjectDuration: 0
      };
      
      data.forEach(cs => {
        // Status breakdown
        stats.byStatus[cs.status] = (stats.byStatus[cs.status] || 0) + 1;
        
        // Industry breakdown
        if (cs.client_industry) {
          stats.byIndustry[cs.client_industry] = (stats.byIndustry[cs.client_industry] || 0) + 1;
        }
        
        // Service type breakdown
        if (cs.service_type) {
          stats.byServiceType[cs.service_type] = (stats.byServiceType[cs.service_type] || 0) + 1;
        }
        
        // Featured count
        if (cs.is_featured) stats.featured++;
        
        // Engagement metrics
        stats.totalViews += cs.view_count || 0;
        stats.totalInquiries += cs.inquiry_count || 0;
      });
      
      return { success: true, stats };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return { success: false, error: error.message };
    }
  }
}

export const caseStudyOperations = new CaseStudyOperationsService();