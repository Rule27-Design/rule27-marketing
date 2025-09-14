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
    const { data, error } = await supabase
      .from('partnerships')
      .insert({ ...partnershipData, slug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePartnership(id, partnershipData) {
    const { data, error } = await supabase
      .from('partnerships')
      .update(partnershipData)
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

  // Departments
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
    const { data, error } = await supabase
      .from('departments')
      .insert({ ...departmentData, slug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateDepartment(id, departmentData) {
    const { data, error } = await supabase
      .from('departments')
      .update(departmentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
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