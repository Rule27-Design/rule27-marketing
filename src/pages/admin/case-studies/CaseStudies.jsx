// src/pages/admin/case-studies/CaseStudies.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { 
  FilterBar,
  BulkActions,
  StatusBadge,
  EmptyState,
  ErrorState,
  ExportButton,
  VirtualTable,
  SkeletonTable,
  MetricsDisplay,
  SearchBar,
  QuickActions
} from '../../../components/admin';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';
import CaseStudyEditor from './CaseStudyEditor';
import { useCaseStudies } from './hooks/useCaseStudies';
import { useCaseStudyEvents } from './hooks/useCaseStudyEvents';
import { caseStudyOperations } from './services/CaseStudyOperations';
import { useToast } from '../../../components/ui/Toast';
import { formatDate } from '../../../utils';

const CaseStudies = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);
  
  const {
    caseStudies,
    loading,
    error,
    filters,
    setFilters,
    selectedItems,
    setSelectedItems,
    pagination,
    changePage,
    refreshCaseStudies
  } = useCaseStudies({
    status: searchParams.get('status') || 'all'
  });

  const { subscribeToEvents } = useCaseStudyEvents();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('case_study:updated', (caseStudy) => {
      refreshCaseStudies();
      toast.info('Case study updated', `"${caseStudy.title}" has been updated`);
    });

    return unsubscribe;
  }, [subscribeToEvents, refreshCaseStudies, toast]);

  // Filter configuration for FilterBar
  const filterConfig = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'pending_approval', label: 'Pending Approval' },
        { value: 'approved', label: 'Approved' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      id: 'industry',
      label: 'Industry',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Industries' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Education', label: 'Education' },
        { value: 'Manufacturing', label: 'Manufacturing' }
      ]
    },
    {
      id: 'service_type',
      label: 'Service Type',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Services' },
        { value: 'Web Development', label: 'Web Development' },
        { value: 'Mobile App', label: 'Mobile App' },
        { value: 'Digital Marketing', label: 'Digital Marketing' },
        { value: 'Brand Strategy', label: 'Brand Strategy' },
        { value: 'UX/UI Design', label: 'UX/UI Design' }
      ]
    },
    {
      id: 'featured',
      label: 'Featured',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Case Studies' },
        { value: 'featured', label: 'Featured Only' },
        { value: 'not-featured', label: 'Not Featured' }
      ]
    }
  ];

  // Bulk action configuration
  const bulkActionConfig = [
    {
      id: 'publish',
      label: 'Publish',
      icon: 'Send',
      variant: 'primary',
      requireConfirm: true
    },
    {
      id: 'approve',
      label: 'Approve',
      icon: 'CheckCircle',
      variant: 'ghost'
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: 'Archive',
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
        case 'publish':
          result = await caseStudyOperations.bulkPublish(selectedIds);
          if (result.success) {
            toast.success('Case studies published', `${selectedIds.length} case studies have been published`);
          }
          break;
          
        case 'approve':
          result = await caseStudyOperations.bulkApprove(selectedIds, userProfile.id);
          if (result.success) {
            toast.success('Case studies approved', `${selectedIds.length} case studies have been approved`);
          }
          break;
          
        case 'archive':
          result = await caseStudyOperations.bulkArchive(selectedIds);
          if (result.success) {
            toast.success('Case studies archived', `${selectedIds.length} case studies have been archived`);
          }
          break;
          
        case 'delete':
          result = await caseStudyOperations.bulkDelete(selectedIds);
          if (result.success) {
            toast.success('Case studies deleted', `${selectedIds.length} case studies have been deleted`);
          }
          break;
          
        case 'export':
          result = await caseStudyOperations.exportCaseStudies(selectedIds);
          if (result.success) {
            toast.success('Export complete', 'Case studies have been exported to CSV');
          }
          break;
      }

      if (result && !result.success) {
        toast.error('Action failed', result.error);
      } else {
        setSelectedItems([]);
        await refreshCaseStudies();
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Action failed', error.message);
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'select',
      header: () => (
        <Checkbox
          checked={caseStudies.length > 0 && selectedItems.length === caseStudies.length}
          onChange={(checked) => {
            setSelectedItems(checked ? caseStudies.map(cs => cs.id) : []);
          }}
        />
      ),
      cell: (caseStudy) => (
        <Checkbox
          checked={selectedItems.includes(caseStudy.id)}
          onChange={(checked) => {
            setSelectedItems(prev =>
              checked 
                ? [...prev, caseStudy.id]
                : prev.filter(id => id !== caseStudy.id)
            );
          }}
        />
      ),
      width: 40
    },
    {
      key: 'title',
      header: 'Case Study',
      cell: (caseStudy) => (
        <div className="flex items-center space-x-3">
          {caseStudy.hero_image && (
            <img
              src={caseStudy.hero_image}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium text-text-primary">
              {caseStudy.title}
              {caseStudy.is_featured && (
                <Icon name="Star" size={12} className="inline ml-1 text-yellow-500" />
              )}
            </div>
            <div className="text-xs text-text-secondary">
              {caseStudy.client_name} • {caseStudy.industry}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (caseStudy) => <StatusBadge status={caseStudy.status} size="xs" />,
      width: 120
    },
    {
      key: 'service',
      header: 'Service',
      cell: (caseStudy) => (
        <div className="text-sm text-text-secondary">
          {caseStudy.service_type}
        </div>
      ),
      width: 150
    },
    {
      key: 'metrics',
      header: 'Impact',
      cell: (caseStudy) => {
        const metrics = caseStudy.key_metrics || [];
        const topMetric = metrics[0];
        if (!topMetric) return <span className="text-gray-400">-</span>;
        
        return (
          <div className="text-sm">
            <span className="font-medium text-green-600">
              {topMetric.improvement || '+0%'}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              {topMetric.label}
            </span>
          </div>
        );
      },
      width: 150
    },
    {
      key: 'duration',
      header: 'Duration',
      cell: (caseStudy) => (
        <div className="text-sm text-text-secondary">
          {caseStudy.project_duration || '-'}
        </div>
      ),
      width: 100
    },
    {
      key: 'date',
      header: 'Modified',
      cell: (caseStudy) => (
        <div className="text-xs text-text-secondary">
          {formatDate(caseStudy.updated_at, 'MMM d, yyyy')}
        </div>
      ),
      width: 100
    },
    {
      key: 'actions',
      header: '',
      cell: (caseStudy) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setEditingCaseStudy(caseStudy);
              setShowEditor(true);
            }}
            iconName="Edit2"
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this case study?')) {
                const result = await caseStudyOperations.delete(caseStudy.id);
                if (result.success) {
                  toast.success('Case study deleted');
                  refreshCaseStudies();
                }
              }
            }}
            iconName="Trash2"
            className="text-red-500"
          />
        </div>
      ),
      width: 100
    }
  ];

  // Quick actions
  const quickActionsConfig = [
    {
      id: 'new',
      label: 'New Case Study',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => {
        setEditingCaseStudy(null);
        setShowEditor(true);
      }
    }
  ];

  // Loading state
  if (loading && caseStudies.length === 0) {
    return <SkeletonTable rows={10} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load case studies"
        message={error}
        onRetry={refreshCaseStudies}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading-bold uppercase tracking-wider">Case Studies</h1>
          <p className="text-sm text-text-secondary mt-1">
            Showcase your client success stories
          </p>
        </div>
        <QuickActions actions={quickActionsConfig} />
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <SearchBar
          value={filters.search || ''}
          onChange={(value) => setFilters({ ...filters, search: value })}
          placeholder="Search case studies..."
        />
        
        <FilterBar
          filters={filterConfig}
          onFilterChange={setFilters}
          onReset={() => setFilters({})}
        />
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedItems}
        actions={bulkActionConfig}
        onAction={handleBulkAction}
        position="top"
      />

      {/* Case Studies Table or Empty State */}
      {caseStudies.length === 0 ? (
        <EmptyState
          icon="Briefcase"
          title="No case studies found"
          message="Create your first case study to showcase your work"
          action={{
            label: 'Create Case Study',
            onClick: () => {
              setEditingCaseStudy(null);
              setShowEditor(true);
            }
          }}
        />
      ) : (
        <VirtualTable
          data={caseStudies}
          columns={tableColumns}
          rowHeight={80}
          onRowClick={(caseStudy) => {
            setEditingCaseStudy(caseStudy);
            setShowEditor(true);
          }}
          pagination={{
            ...pagination,
            onPageChange: changePage
          }}
        />
      )}

      {/* Export Button */}
      {caseStudies.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ExportButton
            data={caseStudies}
            filename="case-studies"
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'client_name', label: 'Client' },
              { key: 'industry', label: 'Industry' },
              { key: 'service_type', label: 'Service' },
              { key: 'status', label: 'Status' },
              { key: 'project_duration', label: 'Duration' },
              { key: 'created_at', label: 'Created' }
            ]}
          />
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <CaseStudyEditor
          caseStudy={editingCaseStudy}
          userProfile={userProfile}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingCaseStudy(null);
          }}
          onSave={() => {
            refreshCaseStudies();
            setShowEditor(false);
            setEditingCaseStudy(null);
          }}
        />
      )}
    </div>
  );
};

export default CaseStudies;