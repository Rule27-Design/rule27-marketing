// src/utils/constants.js

/**
 * Application-wide constants
 */

// Status constants
export const STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending_approval',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
};

// Status display configuration
export const STATUS_CONFIG = {
  [STATUS.DRAFT]: {
    label: 'Draft',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: 'Edit',
    description: 'Work in progress, not visible to public'
  },
  [STATUS.PENDING]: {
    label: 'Pending Approval',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    icon: 'Clock',
    description: 'Waiting for review and approval'
  },
  [STATUS.APPROVED]: {
    label: 'Approved',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    icon: 'CheckCircle',
    description: 'Approved and ready to publish'
  },
  [STATUS.PUBLISHED]: {
    label: 'Published',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: 'Globe',
    description: 'Live and visible to public'
  },
  [STATUS.ARCHIVED]: {
    label: 'Archived',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-300',
    icon: 'Archive',
    description: 'No longer active, kept for reference'
  },
  [STATUS.DELETED]: {
    label: 'Deleted',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    icon: 'Trash',
    description: 'Marked for deletion'
  }
};

// User roles
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  CONTRIBUTOR: 'contributor',
  VIEWER: 'viewer'
};

// Role permissions
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'create', 'read', 'update', 'delete', 
    'publish', 'archive', 'manage_users', 
    'manage_settings', 'view_analytics'
  ],
  [ROLES.EDITOR]: [
    'create', 'read', 'update', 'publish', 
    'archive', 'view_analytics'
  ],
  [ROLES.AUTHOR]: [
    'create', 'read', 'update_own', 'delete_own'
  ],
  [ROLES.CONTRIBUTOR]: [
    'create', 'read', 'update_own'
  ],
  [ROLES.VIEWER]: [
    'read'
  ]
};

// Sort options
export const SORT_OPTIONS = {
  CREATED_DESC: { field: 'created_at', direction: 'desc', label: 'Newest First' },
  CREATED_ASC: { field: 'created_at', direction: 'asc', label: 'Oldest First' },
  UPDATED_DESC: { field: 'updated_at', direction: 'desc', label: 'Recently Updated' },
  UPDATED_ASC: { field: 'updated_at', direction: 'asc', label: 'Least Recently Updated' },
  TITLE_ASC: { field: 'title', direction: 'asc', label: 'Title (A-Z)' },
  TITLE_DESC: { field: 'title', direction: 'desc', label: 'Title (Z-A)' },
  STATUS_ASC: { field: 'status', direction: 'asc', label: 'Status (A-Z)' },
  STATUS_DESC: { field: 'status', direction: 'desc', label: 'Status (Z-A)' },
  VIEWS_DESC: { field: 'view_count', direction: 'desc', label: 'Most Viewed' },
  VIEWS_ASC: { field: 'view_count', direction: 'asc', label: 'Least Viewed' }
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 30, 50, 100],
  MAX_PAGE_SIZE: 100
};

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  LONG_TTL: 30 * 60 * 1000, // 30 minutes
  SHORT_TTL: 1 * 60 * 1000, // 1 minute
  MAX_CACHE_SIZE: 100,
  STORAGE_PREFIX: 'app_cache_'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    RESET_PASSWORD: '/auth/reset-password'
  },
  ARTICLES: {
    BASE: '/api/articles',
    LIST: '/api/articles',
    DETAIL: '/api/articles/:id',
    CREATE: '/api/articles',
    UPDATE: '/api/articles/:id',
    DELETE: '/api/articles/:id',
    PUBLISH: '/api/articles/:id/publish',
    ARCHIVE: '/api/articles/:id/archive'
  },
  CASE_STUDIES: {
    BASE: '/api/case-studies',
    LIST: '/api/case-studies',
    DETAIL: '/api/case-studies/:id',
    CREATE: '/api/case-studies',
    UPDATE: '/api/case-studies/:id',
    DELETE: '/api/case-studies/:id',
    METRICS: '/api/case-studies/:id/metrics'
  },
  UPLOADS: {
    IMAGE: '/api/uploads/image',
    FILE: '/api/uploads/file',
    GALLERY: '/api/uploads/gallery'
  }
};

// File upload configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  ACCEPTED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  FILE_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  MAX_GALLERY_IMAGES: 20
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  FULL: 'EEEE, MMMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  RELATIVE: 'relative', // Special flag for relative time
  SMART: 'smart' // Special flag for smart formatting
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SAVE: 'cmd+s,ctrl+s',
  NEW: 'cmd+n,ctrl+n',
  EDIT: 'cmd+e,ctrl+e',
  DELETE: 'cmd+delete,ctrl+delete',
  DUPLICATE: 'cmd+d,ctrl+d',
  SEARCH: 'cmd+k,ctrl+k',
  ESCAPE: 'escape',
  SUBMIT: 'cmd+enter,ctrl+enter',
  UNDO: 'cmd+z,ctrl+z',
  REDO: 'cmd+shift+z,ctrl+shift+z',
  SELECT_ALL: 'cmd+a,ctrl+a',
  COPY: 'cmd+c,ctrl+c',
  PASTE: 'cmd+v,ctrl+v',
  CUT: 'cmd+x,ctrl+x'
};

// Toast/Notification types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// Toast configuration
export const TOAST_CONFIG = {
  DURATION: 5000,
  POSITION: 'bottom-right',
  MAX_TOASTS: 5,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
  INFO_DURATION: 5000
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// Debounce delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150,
  SCROLL: 100
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
  VIEW_MODE: 'view_mode',
  FILTERS: 'filters',
  SORT: 'sort',
  PAGE_SIZE: 'page_size'
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait and try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  SAVED: 'Changes saved',
  PUBLISHED: 'Successfully published',
  ARCHIVED: 'Successfully archived',
  COPIED: 'Copied to clipboard',
  UPLOADED: 'File uploaded successfully'
};

// Validation rules
export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  SLUG_MAX_LENGTH: 200,
  EXCERPT_MAX_LENGTH: 300,
  CONTENT_MIN_LENGTH: 10,
  CONTENT_MAX_LENGTH: 100000,
  META_TITLE_MAX_LENGTH: 60,
  META_DESCRIPTION_MAX_LENGTH: 160,
  TAG_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_COMMENTS: false,
  ENABLE_REACTIONS: false,
  ENABLE_SHARING: true,
  ENABLE_ANALYTICS: true,
  ENABLE_SEO: true,
  ENABLE_DRAFTS: true,
  ENABLE_REVISIONS: false,
  ENABLE_SCHEDULING: false,
  ENABLE_COLLABORATION: false,
  ENABLE_AI_ASSIST: false
};

// Metric types
export const METRIC_TYPES = {
  NUMBER: 'number',
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage',
  DURATION: 'duration',
  RATING: 'rating',
  BOOLEAN: 'boolean'
};

// Industries (for case studies)
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Transportation',
  'Entertainment',
  'Hospitality',
  'Energy',
  'Agriculture',
  'Non-Profit',
  'Government',
  'Other'
];

// Service types (for case studies)
export const SERVICE_TYPES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Branding',
  'Digital Marketing',
  'SEO',
  'Content Strategy',
  'E-commerce',
  'Consulting',
  'Data Analytics',
  'Cloud Services',
  'Automation',
  'Other'
];

// Project stages
export const PROJECT_STAGES = [
  'Discovery',
  'Planning',
  'Design',
  'Development',
  'Testing',
  'Deployment',
  'Maintenance',
  'Completed'
];

// Priority levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Priority configuration
export const PRIORITY_CONFIG = {
  [PRIORITY.LOW]: {
    label: 'Low',
    color: 'gray',
    icon: 'ArrowDown',
    order: 1
  },
  [PRIORITY.MEDIUM]: {
    label: 'Medium',
    color: 'blue',
    icon: 'Minus',
    order: 2
  },
  [PRIORITY.HIGH]: {
    label: 'High',
    color: 'orange',
    icon: 'ArrowUp',
    order: 3
  },
  [PRIORITY.URGENT]: {
    label: 'Urgent',
    color: 'red',
    icon: 'AlertTriangle',
    order: 4
  }
};

export default {
  STATUS,
  STATUS_CONFIG,
  ROLES,
  PERMISSIONS,
  SORT_OPTIONS,
  PAGINATION,
  CACHE_CONFIG,
  API_ENDPOINTS,
  UPLOAD_CONFIG,
  DATE_FORMATS,
  KEYBOARD_SHORTCUTS,
  TOAST_TYPES,
  TOAST_CONFIG,
  BREAKPOINTS,
  ANIMATION,
  DEBOUNCE_DELAYS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  FEATURE_FLAGS,
  METRIC_TYPES,
  INDUSTRIES,
  SERVICE_TYPES,
  PROJECT_STAGES,
  PRIORITY,
  PRIORITY_CONFIG
};