// src/utils/dateUtils.js

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param {Date} date - The date to format
 * @param {Object} options - Options for formatting
 * @returns {string} The formatted relative time string
 */
export const formatDistanceToNow = (date, options = {}) => {
  const { addSuffix = false } = options;
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  // Find the appropriate interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    
    if (interval >= 1) {
      const unitStr = interval === 1 ? unit : `${unit}s`;
      const timeStr = `${interval} ${unitStr}`;
      return addSuffix ? `${timeStr} ago` : timeStr;
    }
  }
  
  // Less than a minute
  return addSuffix ? 'just now' : '0 minutes';
};

/**
 * Format a date to a specific format
 * @param {Date} date - The date to format
 * @param {string} format - The format string
 * @returns {string} The formatted date string
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  const d = new Date(date);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const replacements = {
    'YYYY': d.getFullYear(),
    'YY': String(d.getFullYear()).slice(-2),
    'MMMM': monthsFull[d.getMonth()],
    'MMM': months[d.getMonth()],
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'M': d.getMonth() + 1,
    'DD': String(d.getDate()).padStart(2, '0'),
    'D': d.getDate(),
    'HH': String(d.getHours()).padStart(2, '0'),
    'H': d.getHours(),
    'mm': String(d.getMinutes()).padStart(2, '0'),
    'm': d.getMinutes(),
    'ss': String(d.getSeconds()).padStart(2, '0'),
    's': d.getSeconds()
  };
  
  let formatted = format;
  for (const [key, value] of Object.entries(replacements)) {
    formatted = formatted.replace(new RegExp(key, 'g'), value);
  }
  
  return formatted;
};

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  
  return targetDate.getDate() === today.getDate() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getFullYear() === today.getFullYear();
};

/**
 * Check if a date is yesterday
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is yesterday
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = new Date(date);
  
  return targetDate.getDate() === yesterday.getDate() &&
    targetDate.getMonth() === yesterday.getMonth() &&
    targetDate.getFullYear() === yesterday.getFullYear();
};

/**
 * Check if a date is within the last N days
 * @param {Date} date - The date to check
 * @param {number} days - Number of days
 * @returns {boolean} True if the date is within the last N days
 */
export const isWithinDays = (date, days) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now - targetDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  return diffInDays <= days && diffInDays >= 0;
};

/**
 * Get a human-readable date string
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const getReadableDate = (date) => {
  const targetDate = new Date(date);
  
  if (isToday(targetDate)) {
    return `Today at ${formatDate(targetDate, 'HH:mm')}`;
  }
  
  if (isYesterday(targetDate)) {
    return `Yesterday at ${formatDate(targetDate, 'HH:mm')}`;
  }
  
  if (isWithinDays(targetDate, 7)) {
    return formatDistanceToNow(targetDate, { addSuffix: true });
  }
  
  return formatDate(targetDate, 'MMM DD, YYYY');
};

/**
 * Parse ISO date string to Date object
 * @param {string} isoString - ISO date string
 * @returns {Date} Date object
 */
export const parseISODate = (isoString) => {
  return new Date(isoString);
};

/**
 * Convert Date to ISO string
 * @param {Date} date - Date object
 * @returns {string} ISO date string
 */
export const toISOString = (date) => {
  return new Date(date).toISOString();
};

export default {
  formatDistanceToNow,
  formatDate,
  isToday,
  isYesterday,
  isWithinDays,
  getReadableDate,
  parseISODate,
  toISOString
};