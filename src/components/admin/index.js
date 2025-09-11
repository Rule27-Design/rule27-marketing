// src/components/admin/index.js
// Central export file for all shared admin components

// Core UI Components
export { default as StatusBadge } from './StatusBadge';
export { default as BulkActions } from './BulkActions';
export { default as FilterBar } from './FilterBar';
export { default as MetricsDisplay } from './MetricsDisplay';
export { default as EmptyState } from './EmptyState';
export { default as ErrorState } from './ErrorState';
export { default as SearchBar } from './SearchBar';
export { default as ExportButton } from './ExportButton';
export { default as QualityCheck } from './QualityCheck';

// Editor and Preview Components
export { default as PreviewModal } from './PreviewModal';
export { default as EditorModal } from './EditorModal';

// Action Components
export { default as UndoRedoControls } from './UndoRedoControls';
export { default as KeyboardShortcutsUI } from './KeyboardShortcutsUI';
export { default as QuickActions } from './QuickActions';

// Table and Data Display
export { default as VirtualTable } from './VirtualTable';
export { 
  default as SkeletonTable,
  SkeletonCard,
  SkeletonMetrics,
  SkeletonFilters,
  SkeletonForm,
  ProgressiveSkeleton
} from './SkeletonTable';

// Utility exports for common configurations
export const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

export const defaultMetrics = [
  { id: 'views', label: 'Views', icon: 'Eye', format: 'number' },
  { id: 'engagement', label: 'Engagement', icon: 'TrendingUp', format: 'percentage' },
  { id: 'shares', label: 'Shares', icon: 'Share2', format: 'number' },
  { id: 'time', label: 'Avg. Time', icon: 'Clock', format: 'duration' }
];

export const defaultActions = {
  create: { id: 'create', icon: 'Plus', label: 'Create New', variant: 'primary' },
  save: { id: 'save', icon: 'Save', label: 'Save', variant: 'ghost' },
  publish: { id: 'publish', icon: 'Upload', label: 'Publish', variant: 'primary' },
  archive: { id: 'archive', icon: 'Archive', label: 'Archive', variant: 'ghost' },
  delete: { id: 'delete', icon: 'Trash2', label: 'Delete', variant: 'ghost', className: 'text-red-600' }
};