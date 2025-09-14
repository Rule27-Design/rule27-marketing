// src/pages/admin/profiles/services/ProfileOperations.js
import { supabase } from '../../../../lib/supabase';
import { sanitizeData } from '../../../../utils/validation';

class ProfileOperationsService {
  // Create profile
  async create(profileData, userProfile) {
    try {
      const validColumns = [
        'email', 'full_name', 'display_name', 'avatar_url', 'bio',
        'role', 'is_public', 'is_active', 'department', 'expertise',
        'job_title', 'linkedin_url', 'twitter_url', 'github_url',
        'sort_order', 'created_by', 'updated_by'
      ];

      const cleanData = {};
      validColumns.forEach(column => {
        if (profileData[column] !== undefined) {
          cleanData[column] = profileData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);
      
      // Set metadata
      if (userProfile) {
        sanitized.created_by = userProfile.id;
        sanitized.updated_by = userProfile.id;
      }

      // Clean arrays
      if (sanitized.department) {
        sanitized.department = sanitized.department.filter(Boolean);
      }
      if (sanitized.expertise) {
        sanitized.expertise = sanitized.expertise.filter(Boolean);
      }

      // Handle invitation
      if (profileData.send_invite) {
        // Send magic link invitation
        const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
          email: profileData.email,
          options: {
            data: {
              full_name: profileData.full_name,
              role: profileData.role,
              invited_by: userProfile.full_name,
              first_login: true,
              has_password: false
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser: true
          }
        });

        if (authError) throw authError;
        
        return { 
          success: true, 
          data: null,
          message: `Invitation sent to ${profileData.email}`
        };
      } else {
        // Create display-only profile
        const { data, error } = await supabase
          .from('profiles')
          .insert(sanitized)
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update profile
  async update(profileId, profileData, userProfile) {
    try {
      const validColumns = [
        'full_name', 'display_name', 'avatar_url', 'bio',
        'is_public', 'is_active', 'department', 'expertise',
        'job_title', 'linkedin_url', 'twitter_url', 'github_url',
        'sort_order', 'updated_by'
      ];

      const cleanData = {};
      validColumns.forEach(column => {
        if (profileData[column] !== undefined) {
          cleanData[column] = profileData[column];
        }
      });

      const sanitized = sanitizeData(cleanData);

      // Update metadata
      sanitized.updated_at = new Date().toISOString();
      if (userProfile) {
        sanitized.updated_by = userProfile.id;
      }

      // Clean arrays
      if (sanitized.department) {
        sanitized.department = sanitized.department.filter(Boolean);
      }
      if (sanitized.expertise) {
        sanitized.expertise = sanitized.expertise.filter(Boolean);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(sanitized)
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update role
  async updateRole(profileId, newRole, reason, userProfile) {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', profileId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString(),
          updated_by: userProfile.id
        })
        .eq('id', profileId);

      if (error) throw error;

      // Log the role change (if audit_logs table exists)
      try {
        await supabase
          .from('audit_logs')
          .insert({
            action: 'role_change',
            table_name: 'profiles',
            record_id: profileId,
            old_value: { role: profile.role },
            new_value: { role: newRole },
            reason: reason,
            performed_by: userProfile.id
          });
      } catch (auditError) {
        console.log('Audit log not available:', auditError);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating role:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete profile
  async delete(profileId) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk update status
  async bulkUpdateStatus(profileIds, isActive, userProfile) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: isActive,
          updated_by: userProfile?.id
        })
        .in('id', profileIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk updating status:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk update visibility
  async bulkUpdateVisibility(profileIds, isPublic, userProfile) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_public: isPublic,
          updated_by: userProfile?.id
        })
        .in('id', profileIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk updating visibility:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk delete
  async bulkDelete(profileIds, userProfile) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', profileIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset
  async sendPasswordReset(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error sending reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // Get departments
  async getDepartments() {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching departments:', error);
      return { success: false, error: error.message };
    }
  }

  // Export profiles
  async exportProfiles(profileIds = null, format = 'csv') {
    try {
      let query = supabase
        .from('profiles')
        .select('*');

      if (profileIds) {
        query = query.in('id', profileIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Convert to CSV
      const csv = this.convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profiles-export-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting profiles:', error);
      return { success: false, error: error.message };
    }
  }

  // Convert to CSV
  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = ['Name', 'Email', 'Role', 'Department', 'Job Title', 'Active', 'Public'];
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(profile => {
      const row = [
        this.escapeCSV(profile.full_name),
        this.escapeCSV(profile.email),
        this.escapeCSV(profile.role),
        this.escapeCSV(profile.department?.join('; ') || ''),
        this.escapeCSV(profile.job_title || ''),
        profile.is_active ? 'Yes' : 'No',
        profile.is_public ? 'Yes' : 'No'
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

export const profileOperations = new ProfileOperationsService();