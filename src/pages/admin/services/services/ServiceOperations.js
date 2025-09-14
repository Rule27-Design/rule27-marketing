// src/pages/admin/services/services/ServiceOperations.js
import { supabase } from '../../../../lib/supabase';
import { generateSlug, sanitizeData } from '../../../../utils/validation';

class ServiceOperationsService {
  // Create service
  async create(serviceData, userProfile) {
    try {
      const validColumns = [
        'title', 'slug', 'category', 'zone_id', 'icon',
        'description', 'full_description', 'features', 'technologies',
        'process_steps', 'expected_results', 'pricing_tiers',
        'is_active', 'is_featured', 'meta_title', 'meta_description',
        'created_by', 'updated_by'
      ];

      const cleanData = {};
      validColumns.forEach(column => {
        if (serviceData[column] !== undefined) {
          cleanData[column] = serviceData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);
      
      // Generate slug if not provided
      if (!sanitized.slug && sanitized.title) {
        sanitized.slug = generateSlug(sanitized.title);
      }

      // Set metadata
      if (userProfile) {
        sanitized.created_by = userProfile.id;
        sanitized.updated_by = userProfile.id;
      }

      // Clean arrays
      if (sanitized.features) {
        sanitized.features = sanitized.features.filter(Boolean);
      }
      if (sanitized.technologies) {
        sanitized.technologies = sanitized.technologies.filter(Boolean);
      }

      const { data, error } = await supabase
        .from('services')
        .insert(sanitized)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating service:', error);
      return { success: false, error: error.message };
    }
  }

  // Update service
  async update(serviceId, serviceData, userProfile) {
    try {
      const validColumns = [
        'title', 'slug', 'category', 'zone_id', 'icon',
        'description', 'full_description', 'features', 'technologies',
        'process_steps', 'expected_results', 'pricing_tiers',
        'is_active', 'is_featured', 'meta_title', 'meta_description',
        'updated_by'
      ];

      const cleanData = {};
      validColumns.forEach(column => {
        if (serviceData[column] !== undefined) {
          cleanData[column] = serviceData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);

      // Update metadata
      sanitized.updated_at = new Date().toISOString();
      if (userProfile) {
        sanitized.updated_by = userProfile.id;
      }

      // Clean arrays
      if (sanitized.features) {
        sanitized.features = sanitized.features.filter(Boolean);
      }
      if (sanitized.technologies) {
        sanitized.technologies = sanitized.technologies.filter(Boolean);
      }

      const { data, error } = await supabase
        .from('services')
        .update(sanitized)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating service:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete service
  async delete(serviceId) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting service:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk update status
  async bulkUpdateStatus(serviceIds, isActive) {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: isActive })
        .in('id', serviceIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk updating status:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk toggle featured
  async bulkToggleFeatured(serviceIds, isFeatured) {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_featured: isFeatured })
        .in('id', serviceIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk toggling featured:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk delete
  async bulkDelete(serviceIds) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .in('id', serviceIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting:', error);
      return { success: false, error: error.message };
    }
  }

  // Get zones
  async getZones() {
    try {
      const { data, error } = await supabase
        .from('service_zones')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching zones:', error);
      return { success: false, error: error.message };
    }
  }

  // Get categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('category')
        .order('category');

      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(s => s.category).filter(Boolean))];
      return { success: true, data: uniqueCategories };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: error.message };
    }
  }

  // Export services
  async exportServices(serviceIds = null, format = 'csv') {
    try {
      let query = supabase
        .from('services')
        .select('*');

      if (serviceIds) {
        query = query.in('id', serviceIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Convert to CSV
      const csv = this.convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `services-export-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting services:', error);
      return { success: false, error: error.message };
    }
  }

  // Convert to CSV
  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = ['Title', 'Category', 'Zone', 'Active', 'Featured', 'Views', 'Inquiries'];
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(service => {
      const row = [
        this.escapeCSV(service.title),
        this.escapeCSV(service.category),
        this.escapeCSV(service.zone_id || ''),
        service.is_active ? 'Yes' : 'No',
        service.is_featured ? 'Yes' : 'No',
        service.view_count || 0,
        service.inquiry_count || 0
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
}

export const serviceOperations = new ServiceOperationsService();