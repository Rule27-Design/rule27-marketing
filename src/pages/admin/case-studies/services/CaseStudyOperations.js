// src/pages/admin/case-studies/services/CaseStudyOperations.js
import { supabase } from '../../../../lib/supabase';

export class CaseStudyOperationsService {
  // Create case study
  async create(data) {
    try {
      const { data: caseStudy, error } = await supabase
        .from('case_studies')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: caseStudy };
    } catch (error) {
      console.error('Error creating case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Update case study
  async update(id, data) {
    try {
      const { data: caseStudy, error } = await supabase
        .from('case_studies')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: caseStudy };
    } catch (error) {
      console.error('Error updating case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete case study
  async delete(id) {
    try {
      // Delete associated media if needed
      const { data: caseStudy } = await supabase
        .from('case_studies')
        .select('hero_image, gallery, client_logo')
        .eq('id', id)
        .single();

      if (caseStudy) {
        // Clean up media files
        await this.deleteMediaFiles([
          caseStudy.hero_image,
          caseStudy.client_logo,
          ...(caseStudy.gallery || [])
        ].filter(Boolean));
      }

      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting case study:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk operations
  async bulkPublish(ids) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error bulk publishing:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkApprove(ids, approverId) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ 
          status: 'approved',
          approved_by: approverId,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error bulk approving:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkArchive(ids) {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ 
          status: 'archived',
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error bulk archiving:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkDelete(ids) {
    try {
      // Get media files before deletion
      const { data: caseStudies } = await supabase
        .from('case_studies')
        .select('hero_image, gallery, client_logo')
        .in('id', ids);

      // Collect all media files
      const mediaFiles = [];
      caseStudies?.forEach(cs => {
        if (cs.hero_image) mediaFiles.push(cs.hero_image);
        if (cs.client_logo) mediaFiles.push(cs.client_logo);
        if (cs.gallery) mediaFiles.push(...cs.gallery);
      });

      // Delete media files
      if (mediaFiles.length > 0) {
        await this.deleteMediaFiles(mediaFiles);
      }

      // Delete case studies
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .in('id', ids);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting:', error);
      return { success: false, error: error.message };
    }
  }

  // Export case studies
  async exportCaseStudies(ids = null) {
    try {
      let query = supabase
        .from('case_studies')
        .select('*');

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
      a.download = `case-studies-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting case studies:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper: Convert to CSV
  convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = [
      'title',
      'client_name', 
      'industry',
      'service_type',
      'status',
      'project_duration',
      'created_at',
      'published_at'
    ];

    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  // Helper: Delete media files from storage
  async deleteMediaFiles(urls) {
    const filePaths = urls.map(url => {
      // Extract file path from Supabase URL
      const match = url.match(/storage\/v1\/object\/public\/media\/(.+)/);
      return match ? match[1] : null;
    }).filter(Boolean);

    if (filePaths.length === 0) return;

    try {
      const { error } = await supabase.storage
        .from('media')
        .remove(filePaths);
      
      if (error) console.error('Error deleting media files:', error);
    } catch (error) {
      console.error('Error in deleteMediaFiles:', error);
    }
  }

  // Duplicate case study
  async duplicate(id) {
    try {
      // Get original case study
      const { data: original, error: fetchError } = await supabase
        .from('case_studies')
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
        published_at: null
      };

      const { data: newCaseStudy, error: insertError } = await supabase
        .from('case_studies')
        .insert([duplicate])
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, data: newCaseStudy };
    } catch (error) {
      console.error('Error duplicating case study:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const caseStudyOperations = new CaseStudyOperationsService();