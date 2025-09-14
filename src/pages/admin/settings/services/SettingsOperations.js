// src/pages/admin/settings/services/SettingsOperations.js
import { supabase } from '../../../../lib/supabase';

class SettingsOperationsService {
  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }

  async createCategory(categoryData) {
    const slug = categoryData.slug || this.generateSlug(categoryData.name);
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...categoryData, slug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCategory(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Tags
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async createTag(tagData) {
    const slug = tagData.slug || this.generateSlug(tagData.name);
    const { data, error } = await supabase
      .from('tags')
      .insert({ ...tagData, slug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTag(id, tagData) {
    // Tags table doesn't have updated_at
    const { data, error } = await supabase
      .from('tags')
      .update(tagData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTag(id) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Testimonials
  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }

  async createTestimonial(testimonialData) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTestimonial(id, testimonialData) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonialData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTestimonial(id) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Partnerships
  async getPartnerships() {
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }

  async createPartnership(partnershipData) {
    const slug = partnershipData.slug || this.generateSlug(partnershipData.name);
    
    // Ensure features is properly formatted as JSONB
    const dataToInsert = {
      ...partnershipData,
      slug,
      features: partnershipData.features || []
    };
    
    const { data, error } = await supabase
      .from('partnerships')
      .insert(dataToInsert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePartnership(id, partnershipData) {
    // Ensure features is properly formatted
    const dataToUpdate = {
      ...partnershipData,
      features: partnershipData.features || []
    };
    
    const { data, error } = await supabase
      .from('partnerships')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePartnership(id) {
    const { error } = await supabase
      .from('partnerships')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Awards
  async getAwards() {
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createAward(awardData) {
    const { data, error } = await supabase
      .from('awards')
      .insert(awardData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAward(id, awardData) {
    const { data, error } = await supabase
      .from('awards')
      .update(awardData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteAward(id) {
    const { error } = await supabase
      .from('awards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Departments - FIXED: No updated_at field
  async getDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }

  async createDepartment(departmentData) {
    const slug = departmentData.slug || this.generateSlug(departmentData.name);
    
    // Only include fields that exist in the table
    const dataToInsert = {
      name: departmentData.name,
      slug: slug,
      description: departmentData.description || null,
      icon: departmentData.icon || null,
      color: departmentData.color || null,
      sort_order: departmentData.sort_order || 0,
      is_active: departmentData.is_active !== false
    };
    
    const { data, error } = await supabase
      .from('departments')
      .insert(dataToInsert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateDepartment(id, departmentData) {
    // Only include fields that exist in the departments table
    const dataToUpdate = {};
    
    if ('name' in departmentData) dataToUpdate.name = departmentData.name;
    if ('slug' in departmentData) dataToUpdate.slug = departmentData.slug;
    if ('description' in departmentData) dataToUpdate.description = departmentData.description;
    if ('icon' in departmentData) dataToUpdate.icon = departmentData.icon;
    if ('color' in departmentData) dataToUpdate.color = departmentData.color;
    if ('sort_order' in departmentData) dataToUpdate.sort_order = departmentData.sort_order;
    if ('is_active' in departmentData) dataToUpdate.is_active = departmentData.is_active;
    
    // Note: departments table doesn't have updated_at field
    
    const { data, error } = await supabase
      .from('departments')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Department update error:', error);
      throw error;
    }
    
    return data;
  }

  async deleteDepartment(id) {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Utility
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

export const settingsOperations = new SettingsOperationsService();