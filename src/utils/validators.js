// src/utils/validators.js

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateEmail(email, options = {}) {
  const {
    required = false,
    allowEmpty = !required,
    maxLength = 254,
    domains = null, // Array of allowed domains
    blockedDomains = null, // Array of blocked domains
    message = 'Invalid email address'
  } = options;

  if (!email || email.trim() === '') {
    return allowEmpty ? true : 'Email is required';
  }

  if (email.length > maxLength) {
    return `Email must be less than ${maxLength} characters`;
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return message;
  }

  const domain = email.split('@')[1].toLowerCase();

  // Check allowed domains
  if (domains && domains.length > 0) {
    const allowedDomains = domains.map(d => d.toLowerCase());
    if (!allowedDomains.includes(domain)) {
      return `Email domain must be one of: ${domains.join(', ')}`;
    }
  }

  // Check blocked domains
  if (blockedDomains && blockedDomains.length > 0) {
    const blocked = blockedDomains.map(d => d.toLowerCase());
    if (blocked.includes(domain)) {
      return 'This email domain is not allowed';
    }
  }

  return true;
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateURL(url, options = {}) {
  const {
    required = false,
    allowEmpty = !required,
    protocols = ['http', 'https'],
    requireProtocol = true,
    requireTLD = true,
    maxLength = 2048,
    message = 'Invalid URL'
  } = options;

  if (!url || url.trim() === '') {
    return allowEmpty ? true : 'URL is required';
  }

  if (url.length > maxLength) {
    return `URL must be less than ${maxLength} characters`;
  }

  try {
    // Add protocol if missing and not required
    let urlToValidate = url;
    if (!requireProtocol && !url.match(/^[a-zA-Z]+:\/\//)) {
      urlToValidate = `https://${url}`;
    }

    const urlObj = new URL(urlToValidate);

    // Check protocol
    const protocol = urlObj.protocol.slice(0, -1); // Remove trailing ':'
    if (!protocols.includes(protocol)) {
      return `URL protocol must be one of: ${protocols.join(', ')}`;
    }

    // Check for TLD if required
    if (requireTLD) {
      const hostname = urlObj.hostname;
      if (!hostname.includes('.') || hostname.endsWith('.')) {
        return 'URL must include a valid domain';
      }
    }

    return true;
  } catch (error) {
    return message;
  }
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validatePhone(phone, options = {}) {
  const {
    required = false,
    allowEmpty = !required,
    country = 'US',
    format = 'any', // 'any', 'e164', 'national'
    message = 'Invalid phone number'
  } = options;

  if (!phone || phone.trim() === '') {
    return allowEmpty ? true : 'Phone number is required';
  }

  // Remove all non-numeric characters for validation
  const cleaned = phone.replace(/\D/g, '');

  // Country-specific validation
  if (country === 'US') {
    // US phone numbers should be 10 digits (or 11 with country code)
    if (cleaned.length === 10) {
      return true;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return true;
    } else {
      return 'Phone number must be 10 digits';
    }
  }

  // E.164 format validation
  if (format === 'e164') {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(phone)) {
      return 'Phone number must be in E.164 format (+1234567890)';
    }
  }

  // Generic validation for any format
  if (cleaned.length < 7 || cleaned.length > 15) {
    return message;
  }

  return true;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validatePassword(password, options = {}) {
  const {
    required = true,
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?',
    bannedWords = [],
    customRules = []
  } = options;

  if (!password) {
    return required ? 'Password is required' : true;
  }

  const errors = [];

  // Length validation
  if (password.length < minLength) {
    errors.push(`at least ${minLength} characters`);
  }
  if (password.length > maxLength) {
    errors.push(`no more than ${maxLength} characters`);
  }

  // Character type validation
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('one number');
  }
  if (requireSpecialChars) {
    const specialRegex = new RegExp(`[${specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
    if (!specialRegex.test(password)) {
      errors.push('one special character');
    }
  }

  // Check for banned words
  const lowerPassword = password.toLowerCase();
  for (const word of bannedWords) {
    if (lowerPassword.includes(word.toLowerCase())) {
      errors.push(`not contain "${word}"`);
    }
  }

  // Custom rules
  for (const rule of customRules) {
    const result = rule.validate(password);
    if (result !== true) {
      errors.push(rule.message || result);
    }
  }

  if (errors.length > 0) {
    return `Password must contain ${errors.join(', ')}`;
  }

  return true;
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateUsername(username, options = {}) {
  const {
    required = true,
    minLength = 3,
    maxLength = 20,
    allowSpecialChars = false,
    allowSpaces = false,
    startWithLetter = true,
    reserved = [], // Reserved usernames
    message = 'Invalid username'
  } = options;

  if (!username || username.trim() === '') {
    return required ? 'Username is required' : true;
  }

  if (username.length < minLength) {
    return `Username must be at least ${minLength} characters`;
  }
  if (username.length > maxLength) {
    return `Username must be no more than ${maxLength} characters`;
  }

  // Check if starts with letter
  if (startWithLetter && !/^[a-zA-Z]/.test(username)) {
    return 'Username must start with a letter';
  }

  // Character validation
  let pattern;
  if (allowSpecialChars && allowSpaces) {
    pattern = /^[a-zA-Z0-9_\-. ]+$/;
  } else if (allowSpecialChars) {
    pattern = /^[a-zA-Z0-9_\-.]+$/;
  } else if (allowSpaces) {
    pattern = /^[a-zA-Z0-9 ]+$/;
  } else {
    pattern = /^[a-zA-Z0-9]+$/;
  }

  if (!pattern.test(username)) {
    return message;
  }

  // Check reserved usernames
  if (reserved.length > 0) {
    const lowerUsername = username.toLowerCase();
    if (reserved.map(r => r.toLowerCase()).includes(lowerUsername)) {
      return 'This username is not available';
    }
  }

  return true;
}

/**
 * Validate credit card number (Luhn algorithm)
 * @param {string} cardNumber - Card number to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateCreditCard(cardNumber, options = {}) {
  const {
    required = true,
    allowEmpty = !required,
    acceptedTypes = ['visa', 'mastercard', 'amex', 'discover']
  } = options;

  if (!cardNumber || cardNumber.trim() === '') {
    return allowEmpty ? true : 'Card number is required';
  }

  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if only digits
  if (!/^\d+$/.test(cleaned)) {
    return 'Card number must contain only digits';
  }

  // Check length (most cards are 13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return 'Invalid card number length';
  }

  // Detect card type
  const cardType = detectCardType(cleaned);
  if (cardType && !acceptedTypes.includes(cardType)) {
    return `Card type not accepted. Accepted types: ${acceptedTypes.join(', ')}`;
  }

  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return 'Invalid card number';
  }

  return true;
}

/**
 * Detect credit card type from number
 * @param {string} cardNumber - Card number
 * @returns {string|null} Card type or null
 */
function detectCardType(cardNumber) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^35/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type;
    }
  }

  return null;
}

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateDate(date, options = {}) {
  const {
    required = false,
    allowEmpty = !required,
    minDate = null,
    maxDate = null,
    format = null, // Expected format if string
    allowFuture = true,
    allowPast = true,
    message = 'Invalid date'
  } = options;

  if (!date) {
    return allowEmpty ? true : 'Date is required';
  }

  let dateObj;
  
  try {
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return message;
    }

    if (isNaN(dateObj.getTime())) {
      return message;
    }
  } catch (error) {
    return message;
  }

  const now = new Date();

  // Check future dates
  if (!allowFuture && dateObj > now) {
    return 'Future dates are not allowed';
  }

  // Check past dates
  if (!allowPast && dateObj < now) {
    return 'Past dates are not allowed';
  }

  // Check min date
  if (minDate) {
    const min = typeof minDate === 'string' ? new Date(minDate) : minDate;
    if (dateObj < min) {
      return `Date must be after ${min.toLocaleDateString()}`;
    }
  }

  // Check max date
  if (maxDate) {
    const max = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;
    if (dateObj > max) {
      return `Date must be before ${max.toLocaleDateString()}`;
    }
  }

  return true;
}

/**
 * Validate file
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateFile(file, options = {}) {
  const {
    required = false,
    allowEmpty = !required,
    maxSize = 10 * 1024 * 1024, // 10MB default
    minSize = 0,
    acceptedTypes = [], // MIME types
    acceptedExtensions = [], // File extensions
    rejectExecutable = true
  } = options;

  if (!file) {
    return allowEmpty ? true : 'File is required';
  }

  // Check file size
  if (file.size > maxSize) {
    return `File size must be less than ${formatFileSize(maxSize)}`;
  }
  if (file.size < minSize) {
    return `File size must be at least ${formatFileSize(minSize)}`;
  }

  // Check MIME type
  if (acceptedTypes.length > 0) {
    const matches = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const regex = new RegExp(type.replace('*', '.*'));
        return regex.test(file.type);
      }
      return file.type === type;
    });

    if (!matches) {
      return `File type must be one of: ${acceptedTypes.join(', ')}`;
    }
  }

  // Check file extension
  if (acceptedExtensions.length > 0) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (!acceptedExtensions.map(e => e.toLowerCase()).includes(extension)) {
      return `File extension must be one of: ${acceptedExtensions.join(', ')}`;
    }
  }

  // Check for executable files
  if (rejectExecutable) {
    const executableExtensions = ['exe', 'dll', 'bat', 'cmd', 'sh', 'app'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (executableExtensions.includes(extension)) {
      return 'Executable files are not allowed';
    }
  }

  return true;
}

/**
 * Helper function to format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate array
 * @param {Array} array - Array to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateArray(array, options = {}) {
  const {
    required = false,
    minLength = 0,
    maxLength = Infinity,
    uniqueItems = false,
    itemValidator = null
  } = options;

  if (!array || !Array.isArray(array)) {
    return required && (!array || array.length === 0) 
      ? 'At least one item is required' 
      : true;
  }

  if (array.length < minLength) {
    return `At least ${minLength} item${minLength !== 1 ? 's' : ''} required`;
  }

  if (array.length > maxLength) {
    return `Maximum ${maxLength} item${maxLength !== 1 ? 's' : ''} allowed`;
  }

  if (uniqueItems) {
    const uniqueSet = new Set(array.map(item => 
      typeof item === 'object' ? JSON.stringify(item) : item
    ));
    if (uniqueSet.size !== array.length) {
      return 'Duplicate items are not allowed';
    }
  }

  if (itemValidator) {
    for (let i = 0; i < array.length; i++) {
      const result = itemValidator(array[i], i);
      if (result !== true) {
        return `Item ${i + 1}: ${result}`;
      }
    }
  }

  return true;
}

/**
 * Validate number
 * @param {number} value - Number to validate
 * @param {Object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export function validateNumber(value, options = {}) {
  const {
    required = false,
    min = -Infinity,
    max = Infinity,
    integer = false,
    positive = false,
    negative = false,
    multipleOf = null
  } = options;

  if (value === null || value === undefined || value === '') {
    return required ? 'Number is required' : true;
  }

  const num = Number(value);
  
  if (isNaN(num)) {
    return 'Must be a valid number';
  }

  if (integer && !Number.isInteger(num)) {
    return 'Must be an integer';
  }

  if (positive && num <= 0) {
    return 'Must be a positive number';
  }

  if (negative && num >= 0) {
    return 'Must be a negative number';
  }

  if (num < min) {
    return `Must be at least ${min}`;
  }

  if (num > max) {
    return `Must be no more than ${max}`;
  }

  if (multipleOf !== null && num % multipleOf !== 0) {
    return `Must be a multiple of ${multipleOf}`;
  }

  return true;
}

/**
 * Create a custom validator
 * @param {Function} validationFn - Validation function
 * @param {string} message - Error message
 * @returns {Function} Validator function
 */
export function createValidator(validationFn, message = 'Validation failed') {
  return (value, options = {}) => {
    try {
      const result = validationFn(value, options);
      return result === true ? true : (result || message);
    } catch (error) {
      console.error('Validation error:', error);
      return message;
    }
  };
}

/**
 * Combine multiple validators
 * @param {...Function} validators - Validator functions
 * @returns {Function} Combined validator
 */
export function combineValidators(...validators) {
  return (value, options = {}) => {
    for (const validator of validators) {
      const result = validator(value, options);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };
}

export default {
  validateEmail,
  validateURL,
  validatePhone,
  validatePassword,
  validateUsername,
  validateCreditCard,
  validateDate,
  validateFile,
  validateArray,
  validateNumber,
  createValidator,
  combineValidators
};