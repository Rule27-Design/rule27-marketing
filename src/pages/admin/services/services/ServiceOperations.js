// src/pages/admin/services/services/ServiceOperations.js
import { supabase } from '../../../../lib/supabase';

export class ServiceOperationsService {
  // Create service
  async create(data) {
    try {
      const { data: service, error } = await supabase
        .from('services')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: service };
    } catch (error) {
      console.error('Error creating service:', error);
      return { success: false, error: error.message };
    }
  }

  // Update service
  async update(id, data) {
    try {
      const { data: service, error } = await supabase
        .from('services')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: service };
    } catch (error) {
      console.error('Error updating service:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete service
  async delete(id) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting service:', error);
      return { success: false, error: error.message };
    }
  }

  // Duplicate service
  async duplicate(id) {
    try {
      // Get original service
      const { data: original, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create duplicate
      const duplicate = {
        ...original,
        id: undefined,
        name: `${original.name} (Copy)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        status: 'draft',
        is_featured: false,
        is_popular: false,
        is_new: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        view_count: 0,
        inquiry_count: 0,
        conversion_rate: 0
      };

      const { data: newService, error: insertError } = await supabase
        .from('services')
        .insert([duplicate])
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, data: newService };
    } catch (error) {
      console.error('Error duplicating service:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk operations
  async bulkPublish(ids) {
    try {
      const { error } = await supabase
        .from('services')
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

  async bulkArchive(ids) {
    try {
      const { error } = await supabase
        .from('services')
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
      const { error } = await supabase
        .from('services')
        .delete()
        .in('id', ids);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting:', error);
      return { success: false, error: error.message };
    }
  }

  // Export services
  async exportServices(ids = null) {
    try {
      let query = supabase
        .from('services')
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
      a.download = `services-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting services:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper: Convert to CSV
  convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = [
      'name',
      'category',
      'status',
      'short_description',
      'starting_price',
      'is_featured',
      'is_popular',
      'created_at'
    ];

    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
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
export const serviceOperations = new ServiceOperationsService();