// src/pages/admin/profiles/editor-tabs/AccessPermissionsTab.jsx
import React from 'react';
import Select from '../../../../components/ui/Select';
import Icon from '../../../../components/AppIcon';

const AccessPermissionsTab = ({ formData, errors, onChange, isEditing, currentUserId }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Access & Permissions</h3>
        
        <div className="space-y-4">
          <Select
            label="Role"
            value={formData.role}
            onChange={(value) => onChange('role', value)}
            options={[
              { value: 'standard', label: 'Standard (No admin access)' },
              { value: 'contributor', label: 'Contributor (Can create content)' },
              { value: 'admin', label: 'Admin (Full access)' }
            ]}
            disabled={isEditing}
            error={errors.role}
          />
          
          {isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                To change this user's role, use the role management button in the table.
              </p>
            </div>
          )}

          {!isEditing && (
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.send_invite}
                  onChange={(e) => onChange('send_invite', e.target.checked)}
                  className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Send login invitation</span>
                  <p className="text-xs text-gray-500">User will receive a magic link to set up their account</p>
                </div>
              </label>

              {formData.send_invite && (
                <div className="ml-7 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-xs font-medium text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• User receives a magic link via email</li>
                    <li>• They click the link to access the system</li>
                    <li>• They'll set their password during setup</li>
                    <li>• Their role ({formData.role}) will be automatically assigned</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {formData.auth_user_id && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Key" size={16} className="text-green-600" />
                <p className="text-xs text-green-800">
                  This user has login access to the system
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Role Permissions</h4>
        
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <h5 className="text-xs font-medium text-gray-700 mb-1">Standard</h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• View dashboard and public content</li>
              <li>• No administrative access</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <h5 className="text-xs font-medium text-blue-700 mb-1">Contributor</h5>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Create and edit content</li>
              <li>• Upload media files</li>
              <li>• Limited administrative features</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <h5 className="text-xs font-medium text-purple-700 mb-1">Admin</h5>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• Full system access</li>
              <li>• Manage users and permissions</li>
              <li>• Access to all settings and features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPermissionsTab;