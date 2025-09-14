// src/pages/admin/profiles/RoleChangeModal.jsx
import React, { useState } from 'react';
import { EditorModal } from '../../../components/admin';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { profileOperations } from './services/ProfileOperations';
import { useToast } from '../../../components/ui/Toast';

const RoleChangeModal = ({ profile, userProfile, isOpen, onClose, onSuccess }) => {
  const [newRole, setNewRole] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'contributor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = async () => {
    if (!newRole) {
      toast.error('Please select a new role');
      return;
    }

    setSaving(true);
    const result = await profileOperations.updateRole(
      profile.id,
      newRole,
      reason,
      userProfile
    );

    if (result.success) {
      toast.success('Role updated', `${profile.full_name}'s role has been changed to ${newRole}`);
      if (onSuccess) onSuccess();
    } else {
      toast.error('Failed to update role', result.error);
    }
    setSaving(false);
  };

  const roleOptions = [
    { value: '', label: 'Select new role...' },
    ...(profile.role !== 'admin' ? [{ value: 'admin', label: 'Admin - Full system access' }] : []),
    ...(profile.role !== 'contributor' ? [{ value: 'contributor', label: 'Contributor - Can create/edit content' }] : []),
    ...(profile.role !== 'standard' ? [{ value: 'standard', label: 'Standard - No admin access' }] : [])
  ];

  return (
    <EditorModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title="Change User Role"
      size="md"
      isSaving={saving}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            Changing role for: <strong>{profile.full_name}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Current role: <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(profile.role)}`}>
              {profile.role}
            </span>
          </p>
        </div>

        <Select
          label="New Role"
          value={newRole}
          onChange={(value) => setNewRole(value)}
          options={roleOptions}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for change (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
            rows={3}
            placeholder="e.g., Promoted to content manager"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> Role changes take effect immediately. The user may need to log out and back in to see their new permissions.
          </p>
        </div>
      </div>
    </EditorModal>
  );
};

export default RoleChangeModal;