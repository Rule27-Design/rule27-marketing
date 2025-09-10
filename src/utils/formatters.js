// src/utils/formatters.js
import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';

/**
 * Format a date string or Date object
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format string (date-fns format)
 * @param {Object} options - Additional options
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatString = 'PP', options = {}) {
  const { fallback = 'N/A', locale = undefined } = options;
  
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return fallback;
    
    return format(dateObj, formatString, { locale });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return fallback;
  }
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @param {Object} options - Additional options
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date, options = {}) {
  const { 
    fallback = 'N/A', 
    baseDate = new Date(),
    addSuffix = true,
    locale = undefined 
  } = options;
  
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return fallback;
    
    return formatDistance(dateObj, baseDate, { addSuffix, locale });
  } catch (error) {
    console.warn('Relative time formatting error:', error);
    return fallback;
  }
}

/**
 * Format date with smart formatting based on how recent it is
 * @param {string|Date} date - Date to format
 * @param {Object} options - Additional options
 * @returns {string} Formatted date string
 */
export function formatSmartDate(date, options = {}) {
  const { fallback = 'N/A', locale = undefined } = options;
  
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return fallback;
    
    const now = new Date();
    const diffInHours = (now - dateObj) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return formatDistance(dateObj, now, { addSuffix: true, locale });
    } else if (diffInHours < 24) {
      return format(dateObj, 'h:mm a', { locale });
    } else if (diffInHours < 168) { // Less than a week
      return formatRelative(dateObj, now, { locale });
    } else if (dateObj.getFullYear() === now.getFullYear()) {
      return format(dateObj, 'MMM d', { locale });
    } else {
      return format(dateObj, 'MMM d, yyyy', { locale });
    }
  } catch (error) {
    console.warn('Smart date formatting error:', error);
    return fallback;
  }
}

/**
 * Format a number with separators
 * @param {number} num - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted number
 */
export function formatNumber(num, options = {}) {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard',
    fallback = '0'
  } = options;
  
  if (num === null || num === undefined || isNaN(num)) return fallback;
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
      notation
    }).format(num);
  } catch (error) {
    console.warn('Number formatting error:', error);
    return String(num);
  }
}

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (e.g., 'USD')
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD', options = {}) {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    fallback = '$0'
  } = options;
  
  if (amount === null || amount === undefined || isNaN(amount)) return fallback;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(amount);
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return `${currency} ${amount}`;
  }
}

/**
 * Format a number as a percentage
 * @param {number} value - Value to format (0-1 or 0-100 based on isDecimal)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, options = {}) {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
    isDecimal = true,
    fallback = '0%'
  } = options;
  
  if (value === null || value === undefined || isNaN(value)) return fallback;
  
  const numValue = isDecimal ? value : value / 100;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(numValue);
  } catch (error) {
    console.warn('Percentage formatting error:', error);
    return `${(numValue * 100).toFixed(maximumFractionDigits)}%`;
  }
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Number of bytes
 * @param {Object} options - Formatting options
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes, options = {}) {
  const {
    decimals = 2,
    binary = false,
    fallback = '0 Bytes'
  } = options;
  
  if (bytes === 0) return '0 Bytes';
  if (!bytes || bytes < 0) return fallback;
  
  const k = binary ? 1024 : 1000;
  const sizes = binary 
    ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = i >= sizes.length ? sizes.length - 1 : i;
  
  return `${parseFloat((bytes / Math.pow(k, size)).toFixed(decimals))} ${sizes[size]}`;
}

/**
 * Format duration in milliseconds to human-readable format
 * @param {number} ms - Duration in milliseconds
 * @param {Object} options - Formatting options
 * @returns {string} Formatted duration
 */
export function formatDuration(ms, options = {}) {
  const {
    format = 'long', // 'long', 'short', 'compact'
    maxUnits = 2,
    fallback = '0s'
  } = options;
  
  if (!ms || ms < 0) return fallback;
  
  const units = [
    { label: 'year', short: 'y', ms: 365 * 24 * 60 * 60 * 1000 },
    { label: 'month', short: 'mo', ms: 30 * 24 * 60 * 60 * 1000 },
    { label: 'week', short: 'w', ms: 7 * 24 * 60 * 60 * 1000 },
    { label: 'day', short: 'd', ms: 24 * 60 * 60 * 1000 },
    { label: 'hour', short: 'h', ms: 60 * 60 * 1000 },
    { label: 'minute', short: 'm', ms: 60 * 1000 },
    { label: 'second', short: 's', ms: 1000 },
    { label: 'millisecond', short: 'ms', ms: 1 }
  ];
  
  const parts = [];
  let remaining = ms;
  
  for (const unit of units) {
    const value = Math.floor(remaining / unit.ms);
    if (value > 0) {
      remaining %= unit.ms;
      
      if (format === 'long') {
        parts.push(`${value} ${unit.label}${value !== 1 ? 's' : ''}`);
      } else if (format === 'short') {
        parts.push(`${value}${unit.short}`);
      } else {
        parts.push(`${value}${unit.short}`);
      }
      
      if (parts.length >= maxUnits) break;
    }
  }
  
  if (parts.length === 0) return fallback;
  
  return format === 'compact' ? parts.join(' ') : parts.join(', ');
}

/**
 * Format reading time based on word count
 * @param {number} wordCount - Number of words
 * @param {Object} options - Formatting options
 * @returns {string} Formatted reading time
 */
export function formatReadingTime(wordCount, options = {}) {
  const {
    wordsPerMinute = 200,
    format = 'long', // 'long', 'short'
    fallback = '1 min read'
  } = options;
  
  if (!wordCount || wordCount <= 0) return fallback;
  
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  if (format === 'long') {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} read`;
  } else {
    return `${minutes} min read`;
  }
}

/**
 * Format a phone number
 * @param {string} phone - Phone number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone, options = {}) {
  const {
    country = 'US',
    format = 'national', // 'national', 'international', 'e164'
    fallback = phone
  } = options;
  
  if (!phone) return fallback;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // US phone formatting
  if (country === 'US') {
    if (cleaned.length === 10) {
      if (format === 'international') {
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (format === 'e164') {
        return `+1${cleaned}`;
      } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      const number = cleaned.slice(1);
      if (format === 'international' || format === 'e164') {
        return `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
      } else {
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
      }
    }
  }
  
  return fallback;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {Object} options - Truncation options
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100, options = {}) {
  const {
    ellipsis = '...',
    breakWords = false,
    fallback = ''
  } = options;
  
  if (!text) return fallback;
  if (text.length <= maxLength) return text;
  
  const truncateLength = maxLength - ellipsis.length;
  
  if (breakWords) {
    return text.substring(0, truncateLength) + ellipsis;
  }
  
  // Try to break at word boundary
  const truncated = text.substring(0, truncateLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > truncateLength * 0.8) {
    return truncated.substring(0, lastSpace) + ellipsis;
  }
  
  return truncated + ellipsis;
}

/**
 * Format a list of items with proper grammar
 * @param {Array} items - Items to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted list
 */
export function formatList(items, options = {}) {
  const {
    separator = ', ',
    lastSeparator = ' and ',
    oxford = true,
    fallback = ''
  } = options;
  
  if (!items || !Array.isArray(items) || items.length === 0) return fallback;
  
  if (items.length === 1) return String(items[0]);
  if (items.length === 2) return items.join(lastSeparator);
  
  const lastItem = items[items.length - 1];
  const allButLast = items.slice(0, -1);
  const oxfordComma = oxford ? separator : '';
  
  return allButLast.join(separator) + oxfordComma + lastSeparator + lastItem;
}

/**
 * Format status with color coding
 * @param {string} status - Status value
 * @param {Object} statusMap - Status configuration map
 * @returns {Object} Status display configuration
 */
export function formatStatus(status, statusMap = {}) {
  const defaultMap = {
    draft: { label: 'Draft', color: 'gray', icon: 'edit' },
    pending: { label: 'Pending', color: 'yellow', icon: 'clock' },
    approved: { label: 'Approved', color: 'blue', icon: 'check' },
    published: { label: 'Published', color: 'green', icon: 'globe' },
    archived: { label: 'Archived', color: 'gray', icon: 'archive' },
    error: { label: 'Error', color: 'red', icon: 'alert' }
  };
  
  const map = { ...defaultMap, ...statusMap };
  const config = map[status] || { label: status, color: 'gray', icon: 'info' };
  
  return {
    ...config,
    value: status,
    className: `status-${config.color}`
  };
}

/**
 * Format metric value based on type
 * @param {number} value - Metric value
 * @param {string} type - Metric type
 * @param {Object} options - Formatting options
 * @returns {string} Formatted metric
 */
export function formatMetric(value, type, options = {}) {
  switch (type) {
    case 'currency':
      return formatCurrency(value, options.currency, options);
    case 'percentage':
      return formatPercentage(value, options);
    case 'number':
      return formatNumber(value, options);
    case 'duration':
      return formatDuration(value, options);
    case 'filesize':
      return formatFileSize(value, options);
    default:
      return String(value);
  }
}

export default {
  formatDate,
  formatRelativeTime,
  formatSmartDate,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatDuration,
  formatReadingTime,
  formatPhoneNumber,
  truncateText,
  formatList,
  formatStatus,
  formatMetric
};