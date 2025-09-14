// src/pages/admin/profiles/Profiles.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { 
  BulkActions,
  StatusBadge,
  EmptyState,
  ErrorState,
  ExportButton,
  SkeletonTable,
  SearchBar,
  QuickActions
} from '../../../components/admin';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import ProfileEditor from './ProfileEditor';
import RoleChangeModal from './RoleChangeModal';
import { useProfiles } from './hooks/useProfiles';
import { useProfileEvents } from './hooks/useProfileEvents';
import { profileOperations } from './services/ProfileOperations';
import { useToast } from '../../../components/ui/Toast';
import { formatDate } from '../../../utils';

const Profiles = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedProfileForRole, setSelectedProfileForRole] = useState(null);
  const [departments, setDepartments] = useState([]);
  
  const {
    profiles,
    loading,
    error,
    filters,
    setFilters,
    selectedProfiles,
    setSelectedProfiles,
    pagination,
    changePage,
    changePageSize,
    refreshProfiles,
    selectAll,
    deselectAll,
    toggleSelection,
    getStatistics
  } = useProfiles({
    tab: searchParams.get('tab') || 'all',
    role: searchParams.get('role') || 'all'
  });

  const { subscribeToEvents } = useProfileEvents();

  // Check admin access
  if (userProfile?.role !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-900 mb-2">Access Denied</h2>
        <p className="text-red-700">Only administrators can manage profiles.</p>
      </div>
    );
  }

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('profile:updated', (profile) => {
      refreshProfiles();
    });

    return unsubscribe;
  }, []);

  // Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const result = await profileOperations.getDepartments();
    if (result.success) {
      setDepartments(result.data);
    }
  };

  // Get statistics
  const stats = getStatistics();

  // Handle filter change
  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value === 'all' ? null : value
    }));
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setFilters(prev => ({ ...prev, tab }));
    setSearchParams({ tab });
  };

  // Bulk action configuration
  const bulkActionConfig = [
    {
      id: 'activate',
      label: 'Activate',
      icon: 'Check',
      variant: 'primary'
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: 'X',
      variant: 'ghost'
    },
    {
      id: 'make-public',
      label: 'Make Public',
      icon: 'Eye',
      variant: 'ghost'
    },
    {
      id: 'make-private',
      label: 'Make Private',
      icon: 'EyeOff',
      variant: 'ghost'
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'Download',
      variant: 'ghost'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      variant: 'ghost',
      className: 'text-red-600',
      requireConfirm: true
    }
  ];

  // Handle bulk actions
  const handleBulkAction = async (actionId, selectedIds) => {
    try {
      let result;
      
      switch (actionId) {
        case 'activate':
          result = await profileOperations.bulkUpdateStatus(selectedIds, true, userProfile);
          if (result.success) {
            toast.success('Profiles activated', `${selectedIds.length} profiles have been activated`);
          }
          break;
          
        case 'deactivate':
          result = await profileOperations.bulkUpdateStatus(selectedIds, false, userProfile);
          if (result.success) {
            toast.success('Profiles deactivated', `${selectedIds.length} profiles have been deactivated`);
          }
          break;
          
        case 'make-public':
          result = await profileOperations.bulkUpdateVisibility(selectedIds, true, userProfile);
          if (result.success) {
            toast.success('Profiles made public', `${selectedIds.length} profiles are now public`);
          }
          break;
          
        case 'make-private':
          result = await profileOperations.bulkUpdateVisibility(selectedIds, false, userProfile);
          if (result.success) {
            toast.success('Profiles made private', `${selectedIds.length} profiles are now private`);
          }
          break;
          
        case 'delete':
          result = await profileOperations.bulkDelete(selectedIds, userProfile);
          if (result.success) {
            toast.success('Profiles deleted', `${selectedIds.length} profiles have been deleted`);
          }
          break;
          
        case 'export':
          result = await profileOperations.exportProfiles(selectedIds);
          if (result.success) {
            toast.success('Export complete', 'Profiles have been exported to CSV');
          }
          break;
      }

      if (result && !result.success) {
        toast.error('Action failed', result.error);
      } else {
        setSelectedProfiles([]);
        await refreshProfiles();
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Action failed', error.message);
    }
  };

  // Quick actions configuration
  const quickActionsConfig = [
    {
      id: 'new',
      label: 'New Profile',
      icon: 'UserPlus',
      variant: 'primary',
      onClick: () => {
        setEditingProfile(null);
        setShowEditor(true);
      }
    },
    {
      id: 'invite',
      label: 'Invite User',
      icon: 'Mail',
      variant: 'outline',
      onClick: () => {
        setEditingProfile(null);
        setShowEditor(true);
      }
    }
  ];

  // Handle role change
  const handleRoleChange = (profile) => {
    setSelectedProfileForRole(profile);
    setShowRoleModal(true);
  };

  // Handle reset password
  const handleResetPassword = async (profile) => {
    if (!confirm(`Send password reset email to ${profile.email}?`)) return;

    const result = await profileOperations.sendPasswordReset(profile.email);
    if (result.success) {
      toast.success('Password reset sent', `Reset email sent to ${profile.email}`);
    } else {
      toast.error('Failed to send reset', result.error);
    }
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'contributor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading && profiles.length === 0) {
    return <SkeletonTable rows={10} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load profiles"
        message={error}
        onRetry={refreshProfiles}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading-bold uppercase tracking-wider">Team & Users</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage team members and user accounts
          </p>
        </div>
        <QuickActions actions={quickActionsConfig} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <Icon name="Users" size={20} className="text-blue-500" />
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Total Profiles</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <Icon name="Key" size={20} className="text-green-500" />
            <span className="text-2xl font-bold">{stats.withLogin}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Login Users</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <Icon name="Eye" size={20} className="text-purple-500" />
            <span className="text-2xl font-bold">{stats.public}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Public Profiles</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <Icon name="Shield" size={20} className="text-orange-500" />
            <span className="text-2xl font-bold">{stats.admins}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">Administrators</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-lg shadow px-6 pt-4">
        <div className="flex space-x-1 border-b -mb-px">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              filters.tab === 'all' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Profiles ({stats.total})
          </button>
          <button
            onClick={() => handleTabChange('team')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              filters.tab === 'team' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Public Team ({stats.public})
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              filters.tab === 'users' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Login Users ({stats.withLogin})
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow px-6 py-4 mb-4 space-y-3">
        <SearchBar
          placeholder="Search profiles..."
          onSearch={(value) => setFilters({ ...filters, search: value })}
          debounceMs={300}
        />
        
        <div className="flex items-center gap-3">
          {/* Role Filter */}
          <select
            value={filters.role || 'all'}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="contributor">Contributor</option>
            <option value="standard">Standard</option>
          </select>

          {/* Department Filter */}
          <select
            value={filters.department || 'all'}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Clear Filters */}
          {Object.keys(filters).some(key => filters[key] && filters[key] !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ tab: 'all' })}
              className="text-gray-500"
            >
              <Icon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProfiles.length > 0 && (
        <BulkActions
          selectedItems={selectedProfiles}
          actions={bulkActionConfig}
          onAction={handleBulkAction}
          position="top"
        />
      )}

      {/* Profiles Table */}
      <div className="flex-1 bg-white rounded-b-lg shadow overflow-hidden">
        {profiles.length === 0 && !loading ? (
          <EmptyState
            icon="Users"
            title="No profiles found"
            message="Create your first profile to get started"
            action={{
              label: 'Create Profile',
              onClick: () => {
                setEditingProfile(null);
                setShowEditor(true);
              }
            }}
          />
        ) : (
          <div className="overflow-x-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      checked={selectedProfiles.length === profiles.length && profiles.length > 0}
                      onChange={(checked) => checked ? selectAll() : deselectAll()}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                  <th className="w-36 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Access</th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                  <th className="w-32 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    onClick={() => {
                      setEditingProfile(profile);
                      setShowEditor(true);
                    }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedProfiles.includes(profile.id)}
                        onChange={() => toggleSelection(profile.id)}
                        disabled={profile.id === userProfile.id}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
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
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {profile.full_name}
                            {profile.id === userProfile.id && (
                              <span className="ml-2 text-xs text-gray-500">(You)</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                          {profile.job_title && (
                            <p className="text-xs text-gray-400 truncate">{profile.job_title}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(profile.role)}`}>
                          {profile.role}
                        </span>
                        {profile.auth_user_id && (
                          <Icon name="Key" size={14} className="text-green-600" title="Can login" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {profile.department?.join(', ') || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        profile.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profile.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {profile.is_public ? (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Public
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Private</span>
                      )}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {profile.auth_user_id && profile.id !== userProfile.id && (
                          <>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleRoleChange(profile)}
                              title="Change role"
                            >
                              <Icon name="Shield" size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleResetPassword(profile)}
                              title="Send password reset"
                            >
                              <Icon name="Mail" size={14} />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setEditingProfile(profile);
                            setShowEditor(true);
                          }}
                        >
                          <Icon name="Edit2" size={14} />
                        </Button>
                        {profile.id !== userProfile.id && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={async () => {
                              if (window.confirm('Delete this profile?')) {
                                const result = await profileOperations.delete(profile.id);
                                if (result.success) {
                                  toast.success('Profile deleted');
                                  refreshProfiles();
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {profiles.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} profiles
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => changePage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Export Button */}
      {profiles.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ExportButton
            data={profiles}
            filename="profiles"
            columns={[
              { key: 'full_name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role' },
              { key: 'department', label: 'Department' },
              { key: 'job_title', label: 'Job Title' },
              { key: 'is_active', label: 'Active' },
              { key: 'is_public', label: 'Public' },
              { key: 'created_at', label: 'Created' }
            ]}
          />
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <ProfileEditor
          profile={editingProfile}
          userProfile={userProfile}
          departments={departments}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingProfile(null);
          }}
          onSave={() => {
            refreshProfiles();
            setShowEditor(false);
            setEditingProfile(null);
          }}
        />
      )}

      {/* Role Change Modal */}
      {showRoleModal && selectedProfileForRole && (
        <RoleChangeModal
          profile={selectedProfileForRole}
          userProfile={userProfile}
          isOpen={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedProfileForRole(null);
          }}
          onSuccess={() => {
            refreshProfiles();
            setShowRoleModal(false);
            setSelectedProfileForRole(null);
          }}
        />
      )}
    </div>
  );
};

export default Profiles;