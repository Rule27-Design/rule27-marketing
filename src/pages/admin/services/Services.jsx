// src/pages/admin/services/Services.jsx
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
import Icon from '../../../components/AdminIcon';
import ServiceEditor from './ServiceEditor';
import ServiceZonesManager from './ServiceZonesManager';
import { useServices } from './hooks/useServices';
import { useServiceEvents } from './hooks/useServiceEvents';
import { serviceOperations } from './services/ServiceOperations';
import { useToast } from '../../../components/ui/Toast';
import { formatDate } from '../../../utils';

const Services = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showZonesManager, setShowZonesManager] = useState(false);
  const [zones, setZones] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const {
    services,
    loading,
    error,
    filters,
    setFilters,
    selectedServices,
    setSelectedServices,
    pagination,
    changePage,
    changePageSize,
    refreshServices,
    selectAll,
    deselectAll,
    toggleSelection
  } = useServices({
    zone: searchParams.get('zone') || 'all',
    status: searchParams.get('status') || 'all'
  });

  const { subscribeToEvents } = useServiceEvents();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('service:updated', (service) => {
      refreshServices();
    });

    return unsubscribe;
  }, []);

  // Fetch zones and categories
  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const zonesData = await serviceOperations.getZones();
      if (zonesData.success) {
        setZones(zonesData.data);
      }

      const categoriesData = await serviceOperations.getCategories();
      if (categoriesData.success) {
        setCategories(categoriesData.data);
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
      id: 'feature',
      label: 'Feature',
      icon: 'Star',
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
          result = await serviceOperations.bulkUpdateStatus(selectedIds, true);
          if (result.success) {
            toast.success('Services activated', `${selectedIds.length} services have been activated`);
          }
          break;
          
        case 'deactivate':
          result = await serviceOperations.bulkUpdateStatus(selectedIds, false);
          if (result.success) {
            toast.success('Services deactivated', `${selectedIds.length} services have been deactivated`);
          }
          break;
          
        case 'feature':
          result = await serviceOperations.bulkToggleFeatured(selectedIds, true);
          if (result.success) {
            toast.success('Services featured', `${selectedIds.length} services have been featured`);
          }
          break;
          
        case 'delete':
          result = await serviceOperations.bulkDelete(selectedIds);
          if (result.success) {
            toast.success('Services deleted', `${selectedIds.length} services have been deleted`);
          }
          break;
          
        case 'export':
          result = await serviceOperations.exportServices(selectedIds);
          if (result.success) {
            toast.success('Export complete', 'Services have been exported to CSV');
          }
          break;
      }

      if (result && !result.success) {
        toast.error('Action failed', result.error);
      } else {
        setSelectedServices([]);
        await refreshServices();
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
      label: 'New Service',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => {
        setEditingService(null);
        setShowEditor(true);
      }
    },
    {
      id: 'zones',
      label: 'Manage Zones',
      icon: 'Grid',
      variant: 'outline',
      onClick: () => setShowZonesManager(true)
    }
  ];

  // Loading state
  if (loading && services.length === 0) {
    return <SkeletonTable rows={10} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load services"
        message={error}
        onRetry={refreshServices}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading-bold uppercase tracking-wider">Services</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your service offerings and pricing
          </p>
        </div>
        <QuickActions actions={quickActionsConfig} />
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <SearchBar
          placeholder="Search services..."
          onSearch={(value) => setFilters({ ...filters, search: value })}
          debounceMs={300}
        />
        
        <div className="flex items-center gap-3">
          {/* Zone Filter */}
          <select
            value={filters.zone || 'all'}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Zones</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.title}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
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
            <option value="featured">Featured</option>
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
      {selectedServices.length > 0 && (
        <BulkActions
          selectedItems={selectedServices}
          actions={bulkActionConfig}
          onAction={handleBulkAction}
          position="top"
        />
      )}

      {/* Services Table */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        {services.length === 0 && !loading ? (
          <EmptyState
            icon="Zap"
            title="No services found"
            message="Create your first service to get started"
            action={{
              label: 'Create Service',
              onClick: () => {
                setEditingService(null);
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
                      checked={selectedServices.length === services.length && services.length > 0}
                      onChange={(checked) => checked ? selectAll() : deselectAll()}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiries</th>
                  <th className="w-24 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr
                    key={service.id}
                    onClick={() => {
                      setEditingService(service);
                      setShowEditor(true);
                    }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedServices.includes(service.id)}
                        onChange={() => toggleSelection(service.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Icon name={service.icon || 'Zap'} size={20} className="text-accent flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            {service.title}
                            {service.is_featured && (
                              <Icon name="Star" size={12} className="inline ml-1 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-lg bg-gray-100">
                        {zones.find(z => z.id === service.zone_id)?.title || 'No Zone'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {service.category}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {service.view_count || 0}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {service.inquiry_count || 0}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setEditingService(service);
                            setShowEditor(true);
                          }}
                        >
                          <Icon name="Edit2" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={async () => {
                            if (window.confirm('Delete this service?')) {
                              const result = await serviceOperations.delete(service.id);
                              if (result.success) {
                                toast.success('Service deleted');
                                refreshServices();
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
      {services.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} services
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
      {services.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ExportButton
            data={services}
            filename="services"
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'zone_title', label: 'Zone' },
              { key: 'is_active', label: 'Active' },
              { key: 'is_featured', label: 'Featured' },
              { key: 'view_count', label: 'Views' },
              { key: 'inquiry_count', label: 'Inquiries' },
              { key: 'created_at', label: 'Created' }
            ]}
          />
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <ServiceEditor
          service={editingService}
          userProfile={userProfile}
          zones={zones}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingService(null);
          }}
          onSave={() => {
            refreshServices();
            setShowEditor(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Service Zones Manager */}
      {showZonesManager && (
        <ServiceZonesManager
          isOpen={showZonesManager}
          onClose={() => setShowZonesManager(false)}
          onUpdate={() => {
            fetchFilterData();
            refreshServices();
          }}
        />
      )}
    </div>
  );
};

export default Services;