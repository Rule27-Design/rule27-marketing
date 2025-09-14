// src/pages/admin/profiles/ProfileEditor.jsx (relevant section)
import React, { useState, useEffect } from 'react';
import { EditorModal } from '../../../components/admin';
import { useFormValidation } from './hooks/useFormValidation';
import { profileOperations } from './services/ProfileOperations';
import { useToast } from '../../../components/ui/Toast';
import Button from '../../../components/ui/Button';

// Import tab components
import BasicInfoTab from './editor-tabs/BasicInfoTab';
import AccessPermissionsTab from './editor-tabs/AccessPermissionsTab';
import DepartmentSkillsTab from './editor-tabs/DepartmentSkillsTab';
import SocialSettingsTab from './editor-tabs/SocialSettingsTab';

const ProfileEditor = ({
  profile = null,
  userProfile,
  departments = [],
  isOpen,
  onClose,
  onSave
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  
  // Initialize form data - ensure avatar_url is always a string
  const initialData = {
    email: profile?.email || '',
    full_name: profile?.full_name || '',
    display_name: profile?.display_name || '',
    avatar_url: profile?.avatar_url || '', // Ensure it's never null/undefined
    bio: profile?.bio || '',
    role: profile?.role || 'standard',
    is_public: profile?.is_public || false,
    is_active: profile?.is_active !== false,
    department: profile?.department || [],
    expertise: profile?.expertise || [],
    job_title: profile?.job_title || '',
    linkedin_url: profile?.linkedin_url || '',
    twitter_url: profile?.twitter_url || '',
    github_url: profile?.github_url || '',
    sort_order: profile?.sort_order || 0,
    send_invite: false,
    auth_user_id: profile?.auth_user_id || null,
    email_notifications: profile?.email_notifications !== false,
    onboarding_completed: profile?.onboarding_completed || false
  };

  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  // Form validation
  const { errors, validateForm, clearError, getTabErrors } = useFormValidation();

  // Track dirty state
  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData]);

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value === undefined ? '' : value // Convert undefined to empty string
    }));
    
    // Clear validation error
    if (validationAttempted) {
      clearError(field);
    }
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setValidationAttempted(true);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      const tabErrors = getTabErrors();
      const firstTabWithErrors = Object.keys(tabErrors).find(tab => 
        tabErrors[tab].length > 0
      );
      
      if (firstTabWithErrors) {
        setActiveTab(firstTabWithErrors);
      }
      
      toast.error('Please fix validation errors');
      setSaving(false);
      return false;
    }

    let result;
    if (profile?.id) {
      result = await profileOperations.update(profile.id, formData, userProfile);
    } else {
      result = await profileOperations.create(formData, userProfile);
    }

    if (result.success) {
      toast.success(
        profile ? 'Profile updated' : 'Profile created',
        result.message || `${formData.full_name} has been saved successfully`
      );
      
      if (onSave) {
        await onSave(result.data);
      }
      setSaving(false);
      setValidationAttempted(false);
      return true;
    } else {
      toast.error('Save failed', result.error);
      setSaving(false);
      return false;
    }
  };

  // Tab configuration
  const tabErrors = getTabErrors();
  const tabs = [
    { 
      id: 'basic', 
      label: 'Basic Info',
      icon: 'User',
      hasErrors: tabErrors.basic.length > 0,
      errorCount: tabErrors.basic.length
    },
    { 
      id: 'access', 
      label: 'Access & Permissions',
      icon: 'Key',
      hasErrors: tabErrors.access.length > 0,
      errorCount: tabErrors.access.length
    },
    { 
      id: 'department', 
      label: 'Department & Skills',
      icon: 'Briefcase',
      hasErrors: tabErrors.department.length > 0,
      errorCount: tabErrors.department.length
    },
    { 
      id: 'social', 
      label: 'Social & Settings',
      icon: 'Share2',
      hasErrors: tabErrors.social.length > 0,
      errorCount: tabErrors.social.length
    }
  ];

  return (
    <EditorModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={profile ? `Edit: ${profile.full_name}` : 'New Profile'}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isDirty={isDirty}
      isSaving={saving}
      showValidationErrors={validationAttempted && Object.keys(errors).length > 0}
    >
      {activeTab === 'basic' && (
        <BasicInfoTab
          formData={formData}
          errors={validationAttempted ? errors : {}}
          onChange={handleFieldChange}
          isEditing={!!profile}
        />
      )}
      
      {activeTab === 'access' && (
        <AccessPermissionsTab
          formData={formData}
          errors={validationAttempted ? errors : {}}
          onChange={handleFieldChange}
          isEditing={!!profile}
          currentUserId={userProfile.id}
        />
      )}
      
      {activeTab === 'department' && (
        <DepartmentSkillsTab
          formData={formData}
          errors={validationAttempted ? errors : {}}
          onChange={handleFieldChange}
          departments={departments}
        />
      )}
      
      {activeTab === 'social' && (
        <SocialSettingsTab
          formData={formData}
          errors={validationAttempted ? errors : {}}
          onChange={handleFieldChange}
        />
      )}
    </EditorModal>
  );
};

export default ProfileEditor;