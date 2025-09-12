// src/pages/admin/case-studies/CaseStudies.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
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
  const [industries, setIndustries] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  
  const {
    caseStudies,
    loading,
    error,
    filters,
    setFilters,
    selectedCaseStudies,
    setSelectedCaseStudies,
    pagination,
    changePage,
    changePageSize,
    refreshCaseStudies,
    selectAll,
    deselectAll,
    toggleSelection
  } = useCaseStudies({
    status: searchParams.get('status') || 'all'
  });

  const { subscribeToEvents } = useCaseStudyEvents();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('case_study:updated', (caseStudy) => {
      refreshCaseStudies();
    });

    return unsubscribe;
  }, []);

  // Fetch filter data
  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      // Get unique industries and service types from existing case studies
      const { data: caseStudiesData } = await supabase
        .from('case_studies')
        .select('client_industry, service_type')
        .eq('is_active', true);
      
      if (caseStudiesData) {
        const uniqueIndustries = [...new Set(caseStudiesData.map(cs => cs.client_industry).filter(Boolean))];
        const uniqueServiceTypes = [...new Set(caseStudiesData.map(cs => cs.service_type).filter(Boolean))];
        
        setIndustries(uniqueIndustries.map(ind => ({ value: ind, label: ind })));
        setServiceTypes(uniqueServiceTypes.map(st => ({ value: st, label: st })));
      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value === 'all' ? null : value
    }));
  };

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
        setSelectedCaseStudies([]);
        await refreshCaseStudies();
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
      label: 'New Case Study',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => {
        setEditingCaseStudy(null);
        setShowEditor(true);
      }
    }
  ];

  // Format metrics display
  const formatMetrics = (metrics) => {
    if (!metrics || metrics.length === 0) return '-';
    const primaryMetric = metrics[0];
    if (!primaryMetric) return '-';
    return primaryMetric.improvement || `${primaryMetric.value}${primaryMetric.unit || ''}`;
  };

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
            Showcase your successful projects and client results
          </p>
        </div>
        <QuickActions actions={quickActionsConfig} />
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <SearchBar
          placeholder="Search case studies..."
          onSearch={(value) => setFilters({ ...filters, search: value })}
          debounceMs={300}
        />
        
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          {/* Industry Filter */}
          <select
            value={filters.industry || 'all'}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Industries</option>
            {industries.map(ind => (
              <option key={ind.value} value={ind.value}>
                {ind.label}
              </option>
            ))}
          </select>

          {/* Service Type Filter */}
          <select
            value={filters.serviceType || 'all'}
            onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Services</option>
            {serviceTypes.map(st => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>

          {/* Featured Filter */}
          <select
            value={filters.featured || 'all'}
            onChange={(e) => handleFilterChange('featured', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Case Studies</option>
            <option value="featured">Featured Only</option>
            <option value="not-featured">Not Featured</option>
          </select>

          {/* Clear Filters */}
          {Object.keys(filters).some(key => filters[key] && filters[key] !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
              className="text-gray-500"
            >
              <Icon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCaseStudies.length > 0 && (
        <BulkActions
          selectedItems={selectedCaseStudies}
          actions={bulkActionConfig}
          onAction={handleBulkAction}
          position="top"
        />
      )}

      {/* Case Studies Table */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        {caseStudies.length === 0 && !loading ? (
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
          <div className="overflow-x-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      checked={selectedCaseStudies.length === caseStudies.length && caseStudies.length > 0}
                      onChange={(checked) => checked ? selectAll() : deselectAll()}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="w-36 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="w-24 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {caseStudies.map((caseStudy) => (
                  <tr
                    key={caseStudy.id}
                    onClick={() => {
                      setEditingCaseStudy(caseStudy);
                      setShowEditor(true);
                    }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCaseStudies.includes(caseStudy.id)}
                        onChange={() => toggleSelection(caseStudy.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {caseStudy.hero_image && (
                          <img
                            src={caseStudy.hero_image}
                            alt=""
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            {caseStudy.title}
                            {caseStudy.is_featured && (
                              <Icon name="Star" size={12} className="inline ml-1 text-yellow-500" />
                            )}
                          </div>
                          {caseStudy.service_type && (
                            <div className="text-xs text-gray-500">
                              {caseStudy.service_type}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={caseStudy.status} size="xs" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        {caseStudy.client_logo && (
                          <img 
                            src={caseStudy.client_logo} 
                            alt={caseStudy.client_name}
                            className="h-5 mb-1 object-contain"
                          />
                        )}
                        <div>{caseStudy.client_name || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {caseStudy.client_industry || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">
                          {formatMetrics(caseStudy.key_metrics)}
                        </div>
                        <div className="text-xs text-gray-500">
                          <Icon name="Eye" size={12} className="inline mr-1" />
                          {caseStudy.view_count || 0} views
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {caseStudy.project_duration || 
                        (caseStudy.project_start_date && caseStudy.project_end_date
                          ? `${formatDate(caseStudy.project_start_date, 'MMM yyyy')} - ${formatDate(caseStudy.project_end_date, 'MMM yyyy')}`
                          : '-'
                        )
                      }
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setEditingCaseStudy(caseStudy);
                            setShowEditor(true);
                          }}
                        >
                          <Icon name="Edit2" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={async () => {
                            if (window.confirm('Delete this case study?')) {
                              const result = await caseStudyOperations.delete(caseStudy.id);
                              if (result.success) {
                                toast.success('Case study deleted');
                                refreshCaseStudies();
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
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
      {caseStudies.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} case studies
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
            
            {/* Page numbers */}
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
      {caseStudies.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ExportButton
            data={caseStudies}
            filename="case-studies"
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'client_name', label: 'Client' },
              { key: 'client_industry', label: 'Industry' },
              { key: 'service_type', label: 'Service' },
              { key: 'status', label: 'Status' },
              { key: 'view_count', label: 'Views' },
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