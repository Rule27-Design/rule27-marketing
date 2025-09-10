// src/utils/generateSlug.js

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @param {Object} options - Configuration options
 * @returns {string} URL-friendly slug
 */
export function generateSlug(text, options = {}) {
  const {
    lowercase = true,
    separator = '-',
    maxLength = null,
    removeDuplicates = true,
    allowUnicode = false,
    customReplacements = {},
    preserveCase = false,
    truncate = true
  } = options;

  if (!text) return '';

  let slug = text.toString();

  // Apply custom replacements first
  Object.entries(customReplacements).forEach(([key, value]) => {
    slug = slug.replace(new RegExp(key, 'g'), value);
  });

  if (!allowUnicode) {
    // Replace common special characters with text equivalents
    const replacements = {
      '&': 'and',
      '@': 'at',
      '%': 'percent',
      '+': 'plus',
      '=': 'equals',
      '$': 'dollar',
      '€': 'euro',
      '£': 'pound',
      '¥': 'yen',
      '©': 'copyright',
      '®': 'registered',
      '™': 'trademark',
      '°': 'degree',
      '№': 'number',
      ...customReplacements
    };

    Object.entries(replacements).forEach(([key, value]) => {
      slug = slug.replace(new RegExp(escapeRegExp(key), 'g'), value);
    });

    // Replace accented characters with their base equivalents
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Remove all non-alphanumeric characters except spaces and hyphens
    slug = slug.replace(/[^a-zA-Z0-9\s-]/g, '');
  } else {
    // Keep Unicode characters but remove special characters
    slug = slug.replace(/[^\p{L}\p{N}\s-]/gu, '');
  }

  // Replace spaces with separator
  slug = slug.replace(/\s+/g, separator);

  // Remove duplicate separators
  if (removeDuplicates) {
    const separatorRegex = new RegExp(`${escapeRegExp(separator)}+`, 'g');
    slug = slug.replace(separatorRegex, separator);
  }

  // Convert to lowercase unless preserving case
  if (lowercase && !preserveCase) {
    slug = slug.toLowerCase();
  }

  // Remove leading and trailing separators
  slug = slug.replace(new RegExp(`^${escapeRegExp(separator)}+|${escapeRegExp(separator)}+$`, 'g'), '');

  // Truncate to maxLength if specified
  if (maxLength && slug.length > maxLength) {
    if (truncate) {
      // Try to truncate at a word boundary
      slug = slug.substring(0, maxLength);
      const lastSeparator = slug.lastIndexOf(separator);
      if (lastSeparator > maxLength * 0.7) {
        slug = slug.substring(0, lastSeparator);
      }
    } else {
      slug = slug.substring(0, maxLength);
    }
  }

  return slug;
}

/**
 * Generate a unique slug by appending a number if needed
 * @param {string} baseSlug - Base slug to make unique
 * @param {Function} checkExists - Function to check if slug exists
 * @param {Object} options - Options for slug generation
 * @returns {Promise<string>} Unique slug
 */
export async function generateUniqueSlug(baseSlug, checkExists, options = {}) {
  const {
    maxAttempts = 100,
    separator = '-',
    startNumber = 1
  } = options;

  let slug = baseSlug;
  let counter = startNumber;
  let exists = await checkExists(slug);

  while (exists && counter < maxAttempts) {
    slug = `${baseSlug}${separator}${counter}`;
    exists = await checkExists(slug);
    counter++;
  }

  if (exists) {
    // If still exists after max attempts, add timestamp
    slug = `${baseSlug}${separator}${Date.now()}`;
  }

  return slug;
}

/**
 * Generate slug from a specific pattern
 * @param {Object} data - Data object to generate slug from
 * @param {string} pattern - Pattern string with placeholders
 * @returns {string} Generated slug
 */
export function generateSlugFromPattern(data, pattern = '{title}') {
  let slug = pattern;

  // Replace placeholders with data values
  const placeholderRegex = /\{(\w+)\}/g;
  slug = slug.replace(placeholderRegex, (match, key) => {
    return data[key] || '';
  });

  // Clean up the resulting slug
  return generateSlug(slug);
}

/**
 * Validate if a string is a valid slug
 * @param {string} slug - Slug to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the slug is valid
 */
export function isValidSlug(slug, options = {}) {
  const {
    minLength = 1,
    maxLength = 200,
    allowUnicode = false,
    allowUppercase = false,
    separator = '-'
  } = options;

  if (!slug || typeof slug !== 'string') return false;
  if (slug.length < minLength || slug.length > maxLength) return false;

  // Check for invalid characters based on options
  let pattern;
  if (allowUnicode) {
    pattern = new RegExp(`^[\\p{L}\\p{N}${escapeRegExp(separator)}]+$`, 'u');
  } else if (allowUppercase) {
    pattern = new RegExp(`^[a-zA-Z0-9${escapeRegExp(separator)}]+$`);
  } else {
    pattern = new RegExp(`^[a-z0-9${escapeRegExp(separator)}]+$`);
  }

  return pattern.test(slug);
}

/**
 * Convert slug back to human-readable text
 * @param {string} slug - Slug to convert
 * @param {Object} options - Conversion options
 * @returns {string} Human-readable text
 */
export function slugToText(slug, options = {}) {
  const {
    separator = '-',
    capitalizeWords = true,
    capitalizeFirst = true
  } = options;

  if (!slug) return '';

  let text = slug.replace(new RegExp(escapeRegExp(separator), 'g'), ' ');

  if (capitalizeWords) {
    text = text.replace(/\b\w/g, char => char.toUpperCase());
  } else if (capitalizeFirst) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return text;
}

/**
 * Escape special characters in a string for use in regex
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate SEO-friendly slug with additional optimizations
 * @param {string} text - Text to convert
 * @param {Object} options - SEO-specific options
 * @returns {string} SEO-optimized slug
 */
export function generateSeoSlug(text, options = {}) {
  const {
    removeStopWords = true,
    maxWords = 10,
    targetLength = 50,
    keywords = [],
    ...slugOptions
  } = options;

  let processedText = text;

  // Remove common stop words if requested
  if (removeStopWords) {
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
      'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on',
      'that', 'the', 'to', 'was', 'will', 'with', 'the', 'this'
    ]);

    const words = processedText.split(/\s+/);
    processedText = words
      .filter(word => !stopWords.has(word.toLowerCase()) || keywords.includes(word.toLowerCase()))
      .join(' ');
  }

  // Limit number of words
  if (maxWords) {
    const words = processedText.split(/\s+/);
    if (words.length > maxWords) {
      // Prioritize keywords if provided
      if (keywords.length > 0) {
        const prioritized = [];
        const remaining = [];
        
        words.forEach(word => {
          if (keywords.some(kw => word.toLowerCase().includes(kw.toLowerCase()))) {
            prioritized.push(word);
          } else {
            remaining.push(word);
          }
        });
        
        processedText = [...prioritized, ...remaining].slice(0, maxWords).join(' ');
      } else {
        processedText = words.slice(0, maxWords).join(' ');
      }
    }
  }

  // Generate slug with target length
  return generateSlug(processedText, {
    ...slugOptions,
    maxLength: targetLength
  });
}

export default generateSlug;