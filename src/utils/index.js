// src/utils/index.js
export { cn } from './cn';
export { generateSlug } from './generateSlug';
export { formatDate, formatDistanceToNow } from './dateUtils';
export * from './formatters';
export * from './constants';
export * from './validation';
export * from './validators';

// Add sanitizeData utility if not already there
export const sanitizeData = (data) => {
  if (!data) return {};
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
};