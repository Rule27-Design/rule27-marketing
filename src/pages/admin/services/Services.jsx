// src/pages/admin/services/Services.jsx
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
import ServiceEditor from './ServiceEditor';
import { useServices } from './hooks/useServices';
import { useServiceEvents } from './hooks/useServiceEvents';
import { serviceOperations } from './services/ServiceOperations';
import { useToast } from '../../../components/ui/Toast';
import { format } from 'date-fns';

const Services = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | table
  
  const {
    services,
    loading,
    error,
    filters,
    setFilters,
    selectedItems,
    setSelectedItems,
    pagination,
    changePage,
    refreshServices
  } = useServices({
    status: searchParams.get('status') || 'all'
  });

  const { subscribeToEvents } = useServiceEvents();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('service:updated', (service) => {
      refreshServices();
      toast.info('Service updated', `"${service.name}" has been updated`);
    });

    return unsubscribe;
  }, [subscribeToEvents, refreshServices, toast]);

  // Filter configuration
  const filterConfig = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'development', label: 'Development' },
        { value: 'design', label: 'Design' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'support', label: 'Support' }
      ]
    },
    {
      id: 'featured',
      label: 'Featured',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Services' },
        { value: 'featured', label: 'Featured Only' },
        { value: 'popular', label: 'Popular Only' }
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
      id: 'archive',
      label: 'Archive',
      icon: 'Archive',
      variant: 'ghost'
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'Copy',
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
          result = await serviceOperations.bulkPublish(selectedIds);
          if (result.success) {
            toast.success('Services published', `${selectedIds.length} services have been published`);
          }
          break;
          
        case 'archive':
          result = await serviceOperations.bulkArchive(selectedIds);
          if (result.success) {
            toast.success('Services archived', `${selectedIds.length} services have been archived`);
          }
          break;
          
        case 'duplicate':
          for (const id of selectedIds) {
            await serviceOperations.duplicate(id);
          }
          toast.success('Services duplicated', `${selectedIds.length} services have been duplicated`);
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
        setSelectedItems([]);
        await refreshServices();
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
          checked={services.length > 0 && selectedItems.length === services.length}
          onChange={(checked) => {
            setSelectedItems(checked ? services.map(s => s.id) : []);
          }}
        />
      ),
      cell: (service) => (
        <Checkbox
          checked={selectedItems.includes(service.id)}
          onChange={(checked) => {
            setSelectedItems(prev =>
              checked 
                ? [...prev, service.id]
                : prev.filter(id => id !== service.id)
            );
          }}
        />
      ),
      width: 40
    },
    {
      key: 'name',
      header: 'Service',
      cell: (service) => (
        <div className="flex items-center space-x-3">
          {service.icon && (
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name={service.icon} size={20} className="text-accent" />
            </div>
          )}
          <div>
            <div className="font-medium text-text-primary">
              {service.name}
              {service.is_featured && (
                <Icon name="Star" size={12} className="inline ml-1 text-yellow-500" />
              )}
              {service.is_popular && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                  Popular
                </span>
              )}
            </div>
            <div className="text-xs text-text-secondary line-clamp-1">
              {service.short_description}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (service) => <StatusBadge status={service.status} size="xs" />,
      width: 120
    },
    {
      key: 'category',
      header: 'Category',
      cell: (service) => (
        <div className="text-sm text-text-secondary capitalize">
          {service.category || '-'}
        </div>
      ),
      width: 120
    },
    {
      key: 'pricing',
      header: 'Starting Price',
      cell: (service) => {
        const lowestPrice = service.pricing_tiers?.reduce((min, tier) => {
          return tier.price < min ? tier.price : min;
        }, Infinity);
        
        return (
          <div className="text-sm font-medium">
            {lowestPrice && lowestPrice !== Infinity 
              ? `$${lowestPrice.toLocaleString()}`
              : 'Custom'}
          </div>
        );
      },
      width: 120
    },
    {
      key: 'stats',
      header: 'Stats',
      cell: (service) => (
        <MetricsDisplay
          metrics={[
            { value: service.view_count || 0, icon: 'Eye' },
            { value: service.inquiry_count || 0, icon: 'MessageSquare' },
            { value: service.conversion_rate || '0%', icon: 'TrendingUp' }
          ]}
          compact
        />
      ),
      width: 150
    },
    {
      key: 'date',
      header: 'Modified',
      cell: (service) => (
        <div className="text-xs text-text-secondary">
          {format(new Date(service.updated_at), 'MMM d, yyyy')}
        </div>
      ),
      width: 100
    },
    {
      key: 'actions',
      header: '',
      cell: (service) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setEditingService(service);
              setShowEditor(true);
            }}
            iconName="Edit2"
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={async () => {
              const result = await serviceOperations.duplicate(service.id);
              if (result.success) {
                toast.success('Service duplicated');
                refreshServices();
              }
            }}
            iconName="Copy"
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this service?')) {
                const result = await serviceOperations.delete(service.id);
                if (result.success) {
                  toast.success('Service deleted');
                  refreshServices();
                }
              }
            }}
            iconName="Trash2"
            className="text-red-500"
          />
        </div>
      ),
      width: 120
    }
  ];

  // Quick actions
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
      id: 'view-toggle',
      label: viewMode === 'grid' ? 'Table View' : 'Grid View',
      icon: viewMode === 'grid' ? 'List' : 'Grid',
      variant: 'ghost',
      onClick: () => setViewMode(viewMode === 'grid' ? 'table' : 'grid')
    }
  ];

  // Service card for grid view
  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {service.icon && (
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name={service.icon} size={24} className="text-accent" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-text-primary">
              {service.name}
            </h3>
            <StatusBadge status={service.status} size="xs" />
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {service.is_featured && (
            <Icon name="Star" size={16} className="text-yellow-500" />
          )}
          {service.is_popular && (
            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
              Popular
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-text-secondary line-clamp-2 mb-4">
        {service.short_description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>{service.category}</span>
        <span>
          {service.pricing_tiers?.length > 0 
            ? `${service.pricing_tiers.length} pricing tiers`
            : 'Custom pricing'}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <MetricsDisplay
          metrics={[
            { value: service.view_count || 0, icon: 'Eye' },
            { value: service.inquiry_count || 0, icon: 'MessageSquare' }
          ]}
          compact
        />
        
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setEditingService(service);
            setShowEditor(true);
          }}
        >
          Edit
        </Button>
      </div>
    </div>
  );

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
          value={filters.search || ''}
          onChange={(value) => setFilters({ ...filters, search: value })}
          placeholder="Search services..."
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

      {/* Services Display */}
      {services.length === 0 ? (
        <EmptyState
          icon="Zap"
          title="No services found"
          message="Create your first service to start showcasing your offerings"
          action={{
            label: 'Create Service',
            onClick: () => {
              setEditingService(null);
              setShowEditor(true);
            }
          }}
        />
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        // Table View
        <VirtualTable
          data={services}
          columns={tableColumns}
          rowHeight={80}
          onRowClick={(service) => {
            setEditingService(service);
            setShowEditor(true);
          }}
          pagination={{
            ...pagination,
            onPageChange: changePage
          }}
        />
      )}

      {/* Export Button */}
      {services.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ExportButton
            data={services}
            filename="services"
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'category', label: 'Category' },
              { key: 'status', label: 'Status' },
              { key: 'short_description', label: 'Description' },
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
    </div>
  );
};

export default Services;