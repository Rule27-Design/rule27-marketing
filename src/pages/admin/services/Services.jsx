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
import { cn } from '../../../utils/cn';

const Services = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | table
  const [groupBy, setGroupBy] = useState('none'); // none | zone | category
  
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
    refreshServices,
    serviceStats // Added stats
  } = useServices({
    status: searchParams.get('status') || 'all',
    zone: searchParams.get('zone') || 'all'
  });

  const { subscribeToEvents } = useServiceEvents();

  // Service zones configuration
  const serviceZones = [
    { id: 'discovery', name: 'Discovery', color: 'blue', icon: 'Search' },
    { id: 'strategy', name: 'Strategy', color: 'purple', icon: 'Target' },
    { id: 'design', name: 'Design', color: 'pink', icon: 'Palette' },
    { id: 'development', name: 'Development', color: 'green', icon: 'Code' },
    { id: 'growth', name: 'Growth', color: 'orange', icon: 'TrendingUp' },
    { id: 'support', name: 'Support', color: 'gray', icon: 'Headphones' }
  ];

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('service:updated', (service) => {
      refreshServices();
      toast.info('Service updated', `"${service.name}" has been updated`);
    });

    return unsubscribe;
  }, [subscribeToEvents, refreshServices, toast]);

  // Group services by zone or category
  const groupedServices = React.useMemo(() => {
    if (groupBy === 'none') return { all: services };
    
    return services.reduce((acc, service) => {
      const key = groupBy === 'zone' ? service.zone : service.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(service);
      return acc;
    }, {});
  }, [services, groupBy]);

  // Filter configuration with zones
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
      id: 'zone',
      label: 'Zone',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Zones' },
        ...serviceZones.map(zone => ({
          value: zone.id,
          label: zone.name
        }))
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

  // Service card for grid view with zone
  const ServiceCard = ({ service }) => {
    const zone = serviceZones.find(z => z.id === service.zone);
    
    return (
      <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow p-6">
        {/* Zone indicator */}
        {zone && (
          <div className={cn(
            'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs mb-3',
            `bg-${zone.color}-100 text-${zone.color}-700`
          )}>
            <Icon name={zone.icon} size={12} />
            <span>{zone.name}</span>
          </div>
        )}
        
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
  };

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
      {/* Header with Services Management title and count */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-heading-bold uppercase tracking-wider">
              Services Management
            </h1>
          </div>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => {
              setEditingService(null);
              setShowEditor(true);
            }}
          >
            New Service
          </Button>
        </div>
        
        {/* Services count and view options */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            All Services ({services.length})
          </p>
          
          {/* Group By Options */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Group by:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setGroupBy('none')}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors',
                  groupBy === 'none' 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                None
              </button>
              <button
                onClick={() => setGroupBy('zone')}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors',
                  groupBy === 'zone' 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                By Zone
              </button>
              <button
                onClick={() => setGroupBy('category')}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors',
                  groupBy === 'category' 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                By Category
              </button>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1 ml-4">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon name="Grid" size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'table' 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Stats Cards */}
      {groupBy === 'zone' && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {serviceZones.map(zone => {
            const zoneServices = services.filter(s => s.zone === zone.id);
            return (
              <button
                key={zone.id}
                onClick={() => setFilters({ ...filters, zone: zone.id })}
                className={cn(
                  'p-3 rounded-lg border transition-all',
                  filters.zone === zone.id 
                    ? 'border-accent bg-accent/5' 
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Icon name={zone.icon} size={20} className={`text-${zone.color}-500 mb-2`} />
                <div className="text-sm font-medium">{zone.name}</div>
                <div className="text-xs text-gray-500">{zoneServices.length} services</div>
              </button>
            );
          })}
        </div>
      )}

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
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          actions={bulkActionConfig}
          onAction={handleBulkAction}
          position="top"
        />
      )}

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
      ) : (
        <>
          {/* Display based on grouping */}
          {groupBy !== 'none' ? (
            // Grouped View
            <div className="space-y-6">
              {Object.entries(groupedServices).map(([group, groupServices]) => (
                <div key={group}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                    {group} ({groupServices.length})
                  </h3>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupServices.map(service => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  ) : (
                    <VirtualTable
                      data={groupServices}
                      columns={tableColumns}
                      rowHeight={80}
                      onRowClick={(service) => {
                        setEditingService(service);
                        setShowEditor(true);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Regular View (No Grouping)
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
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
            )
          )}
        </>
      )}

      {/* Export Button */}
      {services.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ExportButton
            data={services}
            filename="services"
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'zone', label: 'Zone' },
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