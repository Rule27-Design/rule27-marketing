// src/pages/admin/Profiles.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const Profiles = () => {
  const { userProfile } = useOutletContext();
  const [profiles, setProfiles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, team, users
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    display_name: '',
    avatar_url: '',
    bio: '',
    role: 'standard',
    is_public: false,
    is_active: true,
    department: [],
    expertise: [],
    job_title: '',
    linkedin_url: '',
    twitter_url: '',
    github_url: '',
    sort_order: 0,
    // For auth users only
    send_invite: false,
    temp_password: ''
  });

  useEffect(() => {
    fetchProfiles();
    fetchDepartments();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSave = async () => {
    try {
      const profileData = {
        ...formData,
        department: formData.department.filter(Boolean),
        expertise: formData.expertise.filter(Boolean)
      };

      // Remove auth-specific fields
      delete profileData.send_invite;
      delete profileData.temp_password;

      if (editingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', editingProfile.id);

        if (error) throw error;
      } else {
        // Check if creating auth user or display-only profile
        if (formData.send_invite) {
          // Create auth user first
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: formData.email,
            password: formData.temp_password || Math.random().toString(36).slice(-8),
            email_confirm: true,
            user_metadata: {
              full_name: formData.full_name,
              role: formData.role
            }
          });

          if (authError) throw authError;

          // Profile will be created automatically by trigger
          // Update it with additional data
          await supabase
            .from('profiles')
            .update(profileData)
            .eq('auth_user_id', authData.user.id);
        } else {
          // Create display-only profile (no auth)
          const { error } = await supabase
            .from('profiles')
            .insert(profileData);

          if (error) throw error;
        }
      }

      await fetchProfiles();
      setShowEditor(false);
      setEditingProfile(null);
      resetForm();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this profile? This cannot be undone.')) return;

    try {
      const profile = profiles.find(p => p.id === id);
      
      // If profile has auth_user_id, delete auth user first
      if (profile?.auth_user_id) {
        await supabase.auth.admin.deleteUser(profile.auth_user_id);
      }

      // Delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error deleting profile: ' + error.message);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      await fetchProfiles();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleResetPassword = async (profile) => {
    if (!confirm(`Send password reset email to ${profile.email}?`)) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });

      if (error) throw error;
      alert('Password reset email sent!');
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert('Error sending reset email: ' + error.message);
    }
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      display_name: '',
      avatar_url: '',
      bio: '',
      role: 'standard',
      is_public: false,
      is_active: true,
      department: [],
      expertise: [],
      job_title: '',
      linkedin_url: '',
      twitter_url: '',
      github_url: '',
      sort_order: 0,
      send_invite: false,
      temp_password: ''
    });
  };

  // Filter profiles based on tab
  const filteredProfiles = profiles.filter(profile => {
    if (activeTab === 'team') return profile.is_public;
    if (activeTab === 'users') return profile.auth_user_id;
    return true;
  });

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'contributor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Only admins can access this page
  if (userProfile?.role !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-900 mb-2">Access Denied</h2>
        <p className="text-red-700">Only administrators can manage profiles.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading-bold uppercase">Team & Users</h1>
          <Button
            variant="default"
            onClick={() => setShowEditor(true)}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Profile
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'all' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Profiles ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'team' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Public Team ({profiles.filter(p => p.is_public).length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'users' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Login Users ({profiles.filter(p => p.auth_user_id).length})
          </button>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Access
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {profile.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Icon name="User" size={20} className="text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{profile.full_name}</p>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                        {profile.job_title && (
                          <p className="text-xs text-gray-400">{profile.job_title}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(profile.role)}`}>
                        {profile.role}
                      </span>
                      {profile.auth_user_id && (
                        <Icon name="Key" size={14} className="text-green-600" title="Can login" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {profile.department?.join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(profile.id, profile.is_active)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        profile.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {profile.is_public ? (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Public
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Private</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {profile.auth_user_id && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleResetPassword(profile)}
                        title="Send password reset"
                      >
                        <Icon name="Mail" size={16} />
                      </Button>
                    )}
                    
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setEditingProfile(profile);
                        setFormData({
                          ...profile,
                          send_invite: false,
                          temp_password: ''
                        });
                        setShowEditor(true);
                      }}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    
                    {profile.id !== userProfile.id && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDelete(profile.id)}
                        className="text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No profiles found</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-heading-bold uppercase">
                {editingProfile ? 'Edit Profile' : 'New Profile'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingProfile(null);
                  resetForm();
                }}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
                <Input
                  label="Display Name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="Optional display name"
                />
                <Input
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={editingProfile}
                />
                <Input
                  label="Job Title"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                  placeholder="Brief bio for team page..."
                />
              </div>

              <Input
                label="Avatar URL"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />

              {/* Role & Permissions */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Access & Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Role"
                    value={formData.role}
                    onChange={(value) => setFormData({ ...formData, role: value })}
                    options={[
                      { value: 'standard', label: 'Standard (No admin access)' },
                      { value: 'contributor', label: 'Contributor (Can create content)' },
                      { value: 'admin', label: 'Admin (Full access)' }
                    ]}
                  />
                  
                  {!editingProfile && (
                    <div className="space-y-2">
                      <Checkbox
                        checked={formData.send_invite}
                        onCheckedChange={(checked) => setFormData({ ...formData, send_invite: checked })}
                        label="Create login account"
                        description="User can sign in to admin panel"
                      />
                      {formData.send_invite && (
                        <Input
                          type="password"
                          label="Temporary Password"
                          value={formData.temp_password}
                          onChange={(e) => setFormData({ ...formData, temp_password: e.target.value })}
                          placeholder="Leave blank for auto-generate"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Department & Expertise */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Department & Skills</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Departments</label>
                  {formData.department.map((dept, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Select
                        value={dept}
                        onChange={(value) => updateArrayItem('department', index, value)}
                        options={departments.map(d => ({ value: d.name, label: d.name }))}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('department', index)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('department')}
                    iconName="Plus"
                  >
                    Add Department
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expertise</label>
                  {formData.expertise.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={skill}
                        onChange={(e) => updateArrayItem('expertise', index, e.target.value)}
                        placeholder="e.g., UI/UX Design, React, Marketing"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('expertise', index)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('expertise')}
                    iconName="Plus"
                  >
                    Add Expertise
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="LinkedIn"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <Input
                    label="Twitter"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                  <Input
                    label="GitHub"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Visibility Settings */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Visibility Settings</h3>
                <div className="flex items-center space-x-6">
                  <Checkbox
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                    label="Public Profile"
                    description="Show on public team page"
                  />
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    label="Active"
                    description="Account is active"
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    type="number"
                    label="Sort Order"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    description="Lower numbers appear first"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditor(false);
                  setEditingProfile(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90"
              >
                {editingProfile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;