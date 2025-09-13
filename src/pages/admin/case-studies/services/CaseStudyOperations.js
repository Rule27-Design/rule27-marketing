// src/pages/admin/case-studies/services/CaseStudyOperations.js
import { supabase } from '../../../../lib/supabase';
import { generateSlug, sanitizeData, cleanTimestampField } from '../../../../utils/validation';

// Default no-image placeholder
const NO_IMAGE_URL = '/build/assets/images/no_image.png';

class CaseStudyOperationsService {
  // Handle placeholder images
  cleanImageUrls(data) {
    if (data.client_logo && (data.client_logo.includes('placeholder') || data.client_logo === 'null')) {
      data.client_logo = NO_IMAGE_URL;
    }
    if (data.hero_image && (data.hero_image.includes('placeholder') || data.hero_image === 'null')) {
      data.hero_image = NO_IMAGE_URL;
    }
    if (data.og_image && (data.og_image.includes('placeholder') || data.og_image === 'null')) {
      data.og_image = NO_IMAGE_URL;
    }
    
    // Clean gallery images
    if (data.gallery_images && Array.isArray(data.gallery_images)) {
      data.gallery_images = data.gallery_images.map(img => {
        if (img.url && (img.url.includes('placeholder') || img.url === 'null')) {
          return { ...img, url: NO_IMAGE_URL };
        }
        return img;
      });
    }
    
    return data;
  }

  // Create case study
  async create(caseStudyData, userProfile) {
    try {
      // Define all valid columns including Phase 2-4 fields
      const validColumns = [
        // Core fields
        'title', 'slug', 'client_name', 'client_logo', 'client_website',
        'client_industry', 'client_company_size','business_stage', 'project_duration',
        'project_start_date', 'project_end_date', 'project_investment',
        'service_type', 'service_category', 'deliverables', 'technologies_used',
        'team_size', 'team_members', 
        // Rich text fields
        'challenge', 'solution', 'implementation_process',
        'results_narrative', 'results_summary',
        // Metrics and media
        'key_metrics', 'testimonial_id', 'hero_image', 'hero_image_alt',
        'hero_video', 'gallery_images', 'process_steps',
        // Status and settings
        'status', 'is_featured', 'is_active', 'is_confidential', 'sort_order',
        // SEO fields
        'meta_title', 'meta_description', 'meta_keywords', 'og_title',
        'og_description', 'og_image', 'canonical_url', 
        // Internal fields
        'internal_notes', 'created_by', 'updated_by',
        // Phase 2 fields
        'related_case_studies', 'custom_fields', 'version',
        // Phase 3 fields
        'published_at', 'scheduled_at', 'language', 'translations',
        'ab_test_variant',
        // Phase 4 fields
        'performance_score', 'seo_score', 'ai_tags', 'ai_summary',
        'predicted_performance'
      ];

      // Create clean data with only valid columns
      const cleanData = {};
      validColumns.forEach(column => {
        if (caseStudyData[column] !== undefined) {
          cleanData[column] = caseStudyData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);
      
      // Clean image URLs
      this.cleanImageUrls(sanitized);
      
      // Generate slug if not provided
      if (!sanitized.slug && sanitized.title) {
        sanitized.slug = generateSlug(sanitized.title);
      }

      // Auto-generate canonical URL if not provided
      if (!sanitized.canonical_url && sanitized.slug) {
        sanitized.canonical_url = `https://www.rule27design.com/case-studies/${sanitized.slug}`;
      }

      // Clean timestamp fields
      if (sanitized.project_start_date) {
        sanitized.project_start_date = cleanTimestampField(sanitized.project_start_date);
      }
      if (sanitized.project_end_date) {
        sanitized.project_end_date = cleanTimestampField(sanitized.project_end_date);
      }
      if (sanitized.scheduled_at) {
        sanitized.scheduled_at = cleanTimestampField(sanitized.scheduled_at);
      }

      // Set metadata
      if (userProfile) {
        sanitized.created_by = userProfile.id;
        sanitized.updated_by = userProfile.id;
      }

      // Initialize version
      sanitized.version = 1;

      // Set default language if not provided
      if (!sanitized.language) {
        sanitized.language = 'en';
      }

      // Initialize empty objects/arrays for JSON fields
      if (!sanitized.custom_fields) {
        sanitized.custom_fields = {};
      }
      if (!sanitized.translations) {
        sanitized.translations = {};
      }
      if (!sanitized.related_case_studies) {
        sanitized.related_case_studies = [];
      }

      // Clean array fields
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

      // Calculate initial scores
      sanitized.seo_score = this.calculateSEOScore(sanitized);
      sanitized.performance_score = this.calculatePerformanceScore(sanitized);

      const { data, error } = await supabase
        .from('case_studies')
        .insert(sanitized)
        .select()
        .single();

      if (error) throw error;

      // Track creation event (Phase 3)
      await this.trackEvent('case_study_created', {
        case_study_id: data.id,
        user_id: userProfile?.id
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error creating case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Update case study
  async update(caseStudyId, caseStudyData, userProfile) {
    try {
      // Get current version for versioning
      const { data: currentData } = await supabase
        .from('case_studies')
        .select('version')
        .eq('id', caseStudyId)
        .single();

      // All valid columns for update
      const validColumns = [
        'title', 'slug', 'client_name', 'client_logo', 'client_website',
        'client_industry', 'client_company_size', 'project_duration',
        'project_start_date', 'project_end_date', 'project_investment',
        'service_type', 'service_category', 'deliverables', 'technologies_used',
        'team_size', 'team_members', 'challenge', 'solution', 'implementation_process',
        'key_metrics', 'results_summary', 'results_narrative', 'testimonial_id', 
        'hero_image', 'hero_image_alt', 'hero_video', 'gallery_images', 'process_steps',
        'status', 'is_featured', 'is_active', 'is_confidential',
        'sort_order', 'meta_title', 'meta_description', 'meta_keywords', 'og_title',
        'og_description', 'og_image', 'canonical_url', 'internal_notes',
        'view_count', 'unique_view_count', 'inquiry_count', 'updated_by',
        // Phase 2-4 fields
        'related_case_studies', 'custom_fields', 'version', 'published_at',
        'scheduled_at', 'language', 'translations', 'ab_test_variant',
        'performance_score', 'seo_score', 'ai_tags', 'ai_summary',
        'predicted_performance'
      ];

      const cleanData = {};
      validColumns.forEach(column => {
        if (caseStudyData[column] !== undefined) {
          cleanData[column] = caseStudyData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);

      // Clean image URLs
      this.cleanImageUrls(sanitized);

      // Clean timestamp fields
      if (sanitized.project_start_date) {
        sanitized.project_start_date = cleanTimestampField(sanitized.project_start_date);
      }
      if (sanitized.project_end_date) {
        sanitized.project_end_date = cleanTimestampField(sanitized.project_end_date);
      }
      if (sanitized.scheduled_at) {
        sanitized.scheduled_at = cleanTimestampField(sanitized.scheduled_at);
      }

      // Update metadata
      sanitized.updated_at = new Date().toISOString();
      if (userProfile) {
        sanitized.updated_by = userProfile.id;
      }

      // Increment version (Phase 2)
      if (!caseStudyData.auto_save) {
        sanitized.version = (currentData?.version || 1) + 1;
      }

      // Handle publishing
      if (sanitized.status === 'published' && !sanitized.published_at) {
        sanitized.published_at = new Date().toISOString();
      }

      // Auto-generate canonical URL if not provided
      if (!sanitized.canonical_url && sanitized.slug) {
        sanitized.canonical_url = `https://www.rule27design.com/case-studies/${sanitized.slug}`;
      }

      // Clean array fields
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

      // Recalculate scores
      sanitized.seo_score = this.calculateSEOScore(sanitized);
      sanitized.performance_score = this.calculatePerformanceScore(sanitized);

      const { data, error } = await supabase
        .from('case_studies')
        .update(sanitized)
        .eq('id', caseStudyId)
        .select()
        .single();

      if (error) throw error;

      // Track update event (Phase 3)
      if (!caseStudyData.auto_save) {
        await this.trackEvent('case_study_updated', {
          case_study_id: caseStudyId,
          user_id: userProfile?.id,
          version: sanitized.version
        });
      }

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
        updated_by: userProfile?.id,
        version: 1
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

  // Bulk update status
  async bulkUpdateStatus(caseStudyIds, newStatus, userProfile) {
    try {
      const updateData = { 
        status: newStatus,
        updated_by: userProfile?.id
      };

      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('case_studies')
        .update(updateData)
        .in('id', caseStudyIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk updating status:', error);
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

  // Schedule case study for publishing
  async scheduleCaseStudy(caseStudyId, scheduledDate, userProfile) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({
          scheduled_at: scheduledDate,
          status: 'scheduled',
          updated_by: userProfile?.id
        })
        .eq('id', caseStudyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error scheduling case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate and update slug
  async updateSlug(caseStudyId, title, userProfile) {
    try {
      const newSlug = generateSlug(title);
      
      // Check if slug already exists
      const { data: existingCaseStudy } = await supabase
        .from('case_studies')
        .select('id')
        .eq('slug', newSlug)
        .neq('id', caseStudyId)
        .single();

      const finalSlug = existingCaseStudy ? `${newSlug}-${Date.now()}` : newSlug;

      const { error } = await supabase
        .from('case_studies')
        .update({
          slug: finalSlug,
          updated_by: userProfile?.id
        })
        .eq('id', caseStudyId);

      if (error) throw error;
      return { success: true, slug: finalSlug };
    } catch (error) {
      console.error('Error updating slug:', error);
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

  // Update unique view count
  async incrementUniqueViewCount(caseStudyId) {
    try {
      const { data: caseStudy, error: fetchError } = await supabase
        .from('case_studies')
        .select('unique_view_count')
        .eq('id', caseStudyId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('case_studies')
        .update({
          unique_view_count: (caseStudy.unique_view_count || 0) + 1
        })
        .eq('id', caseStudyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error incrementing unique view count:', error);
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

        case 'markdown':
          exportData = this.convertToMarkdown(data);
          filename = `case-studies-export-${Date.now()}.md`;
          mimeType = 'text/markdown';
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
      'Unique Views',
      'Inquiries',
      'SEO Score',
      'Performance Score',
      'Version',
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
        cs.unique_view_count || 0,
        cs.inquiry_count || 0,
        cs.seo_score || 0,
        cs.performance_score || 0,
        cs.version || 1,
        new Date(cs.created_at).toLocaleDateString(),
        new Date(cs.updated_at).toLocaleDateString()
      ];
      
      return row.join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  // Convert to Markdown format
  convertToMarkdown(data) {
    if (!data || data.length === 0) return '';
    
    let markdown = '# Case Studies Export\n\n';
    markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
    markdown += `**Total Case Studies:** ${data.length}\n\n`;
    markdown += '---\n\n';
    
    data.forEach((cs, index) => {
      markdown += `## ${index + 1}. ${cs.title}\n\n`;
      markdown += `- **Client:** ${cs.client_name || 'Unknown'}\n`;
      markdown += `- **Industry:** ${cs.client_industry || 'None'}\n`;
      markdown += `- **Service:** ${cs.service_type || 'None'}\n`;
      markdown += `- **Status:** ${cs.status}\n`;
      markdown += `- **Featured:** ${cs.is_featured ? 'Yes' : 'No'}\n`;
      markdown += `- **Duration:** ${cs.project_duration || 'N/A'}\n`;
      markdown += `- **Views:** ${cs.view_count || 0}\n`;
      markdown += `- **Inquiries:** ${cs.inquiry_count || 0}\n`;
      
      if (cs.key_metrics && cs.key_metrics.length > 0) {
        markdown += `\n**Key Metrics:**\n`;
        cs.key_metrics.forEach(metric => {
          markdown += `- ${metric.label}: ${metric.value}${metric.unit || ''}`;
          if (metric.improvement) {
            markdown += ` (${metric.improvement})`;
          }
          markdown += '\n';
        });
      }
      
      if (cs.results_summary) {
        markdown += `\n**Results Summary:**\n> ${cs.results_summary}\n`;
      }
      
      markdown += '\n---\n\n';
    });
    
    return markdown;
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

  // Import case studies from CSV
  async importFromCSV(csvData, userProfile) {
    try {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const caseStudies = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = this.parseCSVLine(lines[i]);
        const caseStudy = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          
          switch (header.toLowerCase()) {
            case 'title':
              caseStudy.title = value;
              break;
            case 'client':
              caseStudy.client_name = value;
              break;
            case 'industry':
              caseStudy.client_industry = value;
              break;
            case 'service type':
              caseStudy.service_type = value;
              break;
            case 'status':
              caseStudy.status = value || 'draft';
              break;
            case 'featured':
              caseStudy.is_featured = value?.toLowerCase() === 'yes';
              break;
            case 'project duration':
              caseStudy.project_duration = value;
              break;
          }
        });
        
        // Generate slug
        if (!caseStudy.slug && caseStudy.title) {
          caseStudy.slug = generateSlug(caseStudy.title);
        }
        
        // Add metadata
        caseStudy.created_by = userProfile.id;
        caseStudy.updated_by = userProfile.id;
        caseStudy.version = 1;
        
        caseStudies.push(caseStudy);
      }
      
      // Bulk insert
      const { data, error } = await supabase
        .from('case_studies')
        .insert(caseStudies)
        .select();
      
      if (error) throw error;
      
      return { success: true, imported: data.length };
    } catch (error) {
      console.error('Error importing case studies:', error);
      return { success: false, error: error.message };
    }
  }

  // Parse CSV line handling quoted values
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  // Calculate SEO Score (Phase 2)
  calculateSEOScore(data) {
    let score = 0;
    const checks = {
      metaTitle: data.meta_title && data.meta_title.length >= 30 && data.meta_title.length <= 60,
      metaDescription: data.meta_description && data.meta_description.length >= 120 && data.meta_description.length <= 160,
      keywords: data.meta_keywords && data.meta_keywords.length >= 3,
      ogImage: !!data.og_image && !data.og_image.includes('placeholder'),
      canonicalUrl: !!data.canonical_url,
      slug: data.slug && data.slug.length <= 50,
      heroImage: !!data.hero_image && !data.hero_image.includes('placeholder'),
      content: data.challenge && data.solution && data.results_narrative
    };

    Object.values(checks).forEach(check => {
      if (check) score += 12.5;
    });

    return Math.round(score);
  }

  // Calculate Performance Score (Phase 4)
  calculatePerformanceScore(data) {
    let score = 0;
    
    // Content completeness
    if (data.challenge) score += 10;
    if (data.solution) score += 10;
    if (data.implementation_process) score += 10;
    if (data.results_narrative) score += 10;
    
    // Media (excluding placeholder images)
    if (data.hero_image && !data.hero_image.includes('placeholder')) score += 10;
    if (data.gallery_images && data.gallery_images.length > 0) {
      const realImages = data.gallery_images.filter(img => 
        img.url && !img.url.includes('placeholder')
      );
      if (realImages.length > 0) score += 10;
    }
    
    // Metrics
    if (data.key_metrics && data.key_metrics.length >= 3) score += 20;
    
    // SEO
    if (data.seo_score >= 75) score += 10;
    
    // Engagement potential
    if (data.testimonial_id) score += 10;
    
    return Math.min(100, score);
  }

  // Get version history (Phase 2)
  async getVersionHistory(caseStudyId) {
    try {
      const { data, error } = await supabase
        .from('case_study_versions')
        .select('*')
        .eq('case_study_id', caseStudyId)
        .order('version', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching version history:', error);
      return { success: false, error: error.message };
    }
  }

  // Restore version (Phase 2)
  async restoreVersion(caseStudyId, version, userProfile) {
    try {
      const { data: versionData, error: fetchError } = await supabase
        .from('case_study_versions')
        .select('*')
        .eq('case_study_id', caseStudyId)
        .eq('version', version)
        .single();

      if (fetchError) throw fetchError;

      const restoredData = {
        ...versionData,
        version: versionData.version + 1,
        restored_from_version: version,
        updated_by: userProfile?.id
      };

      return await this.update(caseStudyId, restoredData, userProfile);
    } catch (error) {
      console.error('Error restoring version:', error);
      return { success: false, error: error.message };
    }
  }

  // Get related case studies (Phase 2)
  async getRelated(caseStudyId, limit = 3) {
    try {
      const { data: currentCS } = await supabase
        .from('case_studies')
        .select('service_type, client_industry, related_case_studies')
        .eq('id', caseStudyId)
        .single();

      if (!currentCS) throw new Error('Case study not found');

      // First check manually related
      if (currentCS.related_case_studies && currentCS.related_case_studies.length > 0) {
        const { data: related } = await supabase
          .from('case_studies')
          .select('id, title, slug, client_name, hero_image, results_summary')
          .in('id', currentCS.related_case_studies)
          .eq('status', 'published')
          .limit(limit);
        
        if (related && related.length > 0) return { success: true, data: related };
      }

      // Fallback to automatic matching
      const { data, error } = await supabase
        .from('case_studies')
        .select('id, title, slug, client_name, hero_image, results_summary')
        .eq('status', 'published')
        .neq('id', caseStudyId)
        .or(`service_type.eq.${currentCS.service_type},client_industry.eq.${currentCS.client_industry}`)
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching related case studies:', error);
      return { success: false, error: error.message };
    }
  }

  // Track event (Phase 3)
  async trackEvent(eventType, entityId, metadata = {}) {
    try {
        const { error } = await supabase
        .from('analytics_events')
        .insert({
            event_type: eventType,
            entity_type: 'case_study',
            entity_id: entityId,
            metadata,
            user_id: this.userProfile?.id
        });
        
        // Silently ignore analytics errors
        if (error) {
        console.log('Analytics tracking skipped:', error.message);
        }
    } catch (error) {
        // Silently fail if analytics isn't set up
        console.log('Analytics not configured');
    }
}

  // Get AI suggestions (Phase 4)
  async getAISuggestions(caseStudyData) {
    try {
      // This would call an AI service
      // For now, return mock suggestions
      return {
        success: true,
        suggestions: {
          title: [`${caseStudyData.title}: A Success Story`, `How We Helped ${caseStudyData.client_name} Achieve Results`],
          meta_description: ['Discover how we helped transform...', 'Learn about our successful partnership...'],
          tags: ['digital transformation', 'success story', caseStudyData.service_type?.toLowerCase()],
          related_content: []
        }
      };
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return { success: false, error: error.message };
    }
  }

  // Predict performance (Phase 4)
  async predictPerformance(caseStudyData) {
    try {
      // This would use ML model
      // For now, return mock prediction
      const score = this.calculatePerformanceScore(caseStudyData);
      return {
        success: true,
        prediction: {
          estimated_views: score * 50,
          estimated_inquiries: Math.floor(score * 0.5),
          confidence: 0.75,
          recommendations: [
            'Add more metrics to improve credibility',
            'Include client testimonial for social proof',
            'Add more gallery images to showcase work'
          ]
        }
      };
    } catch (error) {
      console.error('Error predicting performance:', error);
      return { success: false, error: error.message };
    }
  }

  // Get statistics
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
        totalUniqueViews: 0,
        totalInquiries: 0,
        avgProjectDuration: 0,
        avgPerformanceScore: 0,
        avgSEOScore: 0
      };
      
      let totalDuration = 0;
      let durationCount = 0;
      
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
        stats.totalUniqueViews += cs.unique_view_count || 0;
        stats.totalInquiries += cs.inquiry_count || 0;
        
        // Average scores
        stats.avgPerformanceScore += cs.performance_score || 0;
        stats.avgSEOScore += cs.seo_score || 0;
        
        // Duration calculation
        if (cs.project_start_date && cs.project_end_date) {
          const start = new Date(cs.project_start_date);
          const end = new Date(cs.project_end_date);
          const duration = (end - start) / (1000 * 60 * 60 * 24);
          totalDuration += duration;
          durationCount++;
        }
      });
      
      // Calculate averages
      if (data.length > 0) {
        stats.avgPerformanceScore = Math.round(stats.avgPerformanceScore / data.length);
        stats.avgSEOScore = Math.round(stats.avgSEOScore / data.length);
      }
      
      if (durationCount > 0) {
        stats.avgProjectDuration = Math.round(totalDuration / durationCount);
      }
      
      return { success: true, stats };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return { success: false, error: error.message };
    }
  }

  // Create A/B test variant
    async createVariant(parentCaseStudyId, variantName, userProfile) {
    try {
        // Get parent case study
        const { data: parent, error: parentError } = await supabase
        .from('case_studies')
        .select('*')
        .eq('id', parentCaseStudyId)
        .single();
        
        if (parentError) throw parentError;
        
        // Create variant copy
        const variantData = {
        ...parent,
        id: undefined,
        parent_case_study_id: parentCaseStudyId,
        is_variant: true,
        variant_name: variantName,
        title: `${parent.title} - ${variantName}`,
        slug: `${parent.slug}-${variantName.toLowerCase()}`,
        status: 'draft',
        ab_test_variant: variantName,
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
        .insert(variantData)
        .select()
        .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating variant:', error);
        return { success: false, error: error.message };
    }
    }

    // Get all variants of a case study
    async getVariants(caseStudyId) {
    try {
        const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .or(`id.eq.${caseStudyId},parent_case_study_id.eq.${caseStudyId}`)
        .order('variant_name');
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching variants:', error);
        return { success: false, error: error.message };
    }
    }

    // Activate A/B test
    async activateABTest(caseStudyId, endDate, userProfile) {
    try {
        // Update parent and all variants
        const { error } = await supabase
        .from('case_studies')
        .update({
            ab_test_active: true,
            ab_test_start_date: new Date().toISOString(),
            ab_test_end_date: endDate,
            updated_by: userProfile?.id
        })
        .or(`id.eq.${caseStudyId},parent_case_study_id.eq.${caseStudyId}`);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error activating A/B test:', error);
        return { success: false, error: error.message };
    }
    }

    // Get A/B test results
    async getABTestResults(caseStudyId) {
    try {
        const { data, error } = await supabase
        .from('case_studies')
        .select('variant_name, view_count, unique_view_count, inquiry_count, average_time_on_page')
        .or(`id.eq.${caseStudyId},parent_case_study_id.eq.${caseStudyId}`);
        
        if (error) throw error;
        
        // Calculate conversion rates
        const results = data.map(variant => ({
        ...variant,
        conversion_rate: variant.view_count > 0 
            ? ((variant.inquiry_count / variant.view_count) * 100).toFixed(2)
            : 0
        }));
        
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching A/B test results:', error);
        return { success: false, error: error.message };
    }
    }
}

export const caseStudyOperations = new CaseStudyOperationsService();