// src/services/DataTransformer.js

/**
 * Data transformation service for converting between different data formats
 * and applying transformations to data structures
 */
export class DataTransformer {
  constructor(options = {}) {
    this.options = {
      dateFormat: 'ISO',
      nullToEmpty: false,
      trimStrings: true,
      debug: false,
      ...options
    };
    
    // Custom transformers registry
    this.transformers = new Map();
    
    // Transformation pipelines
    this.pipelines = new Map();
    
    // Register default transformers
    this.registerDefaultTransformers();
  }

  /**
   * Register default transformers
   */
  registerDefaultTransformers() {
    // String transformers
    this.registerTransformer('trim', (value) => 
      typeof value === 'string' ? value.trim() : value
    );
    
    this.registerTransformer('lowercase', (value) => 
      typeof value === 'string' ? value.toLowerCase() : value
    );
    
    this.registerTransformer('uppercase', (value) => 
      typeof value === 'string' ? value.toUpperCase() : value
    );
    
    this.registerTransformer('capitalize', (value) => 
      typeof value === 'string' 
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value
    );
    
    // Number transformers
    this.registerTransformer('toNumber', (value) => {
      const num = Number(value);
      return isNaN(num) ? value : num;
    });
    
    this.registerTransformer('toInteger', (value) => {
      const num = parseInt(value, 10);
      return isNaN(num) ? value : num;
    });
    
    this.registerTransformer('toFloat', (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    });
    
    // Boolean transformers
    this.registerTransformer('toBoolean', (value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return ['true', 'yes', '1', 'on'].includes(value.toLowerCase());
      }
      return !!value;
    });
    
    // Date transformers
    this.registerTransformer('toDate', (value) => {
      if (value instanceof Date) return value;
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date;
    });
    
    this.registerTransformer('toISO', (value) => {
      const date = value instanceof Date ? value : new Date(value);
      return isNaN(date.getTime()) ? value : date.toISOString();
    });
    
    // Array transformers
    this.registerTransformer('toArray', (value) => {
      if (Array.isArray(value)) return value;
      if (value === null || value === undefined) return [];
      return [value];
    });
    
    this.registerTransformer('flatten', (value) => {
      if (!Array.isArray(value)) return value;
      return value.flat();
    });
    
    this.registerTransformer('unique', (value) => {
      if (!Array.isArray(value)) return value;
      return [...new Set(value)];
    });
    
    // Object transformers
    this.registerTransformer('toJSON', (value) => {
      try {
        return JSON.stringify(value);
      } catch {
        return value;
      }
    });
    
    this.registerTransformer('parseJSON', (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    });
  }

  /**
   * Transform data using a schema
   */
  transform(data, schema) {
    if (!schema) return data;
    
    const result = Array.isArray(data) 
      ? data.map(item => this.transformObject(item, schema))
      : this.transformObject(data, schema);
    
    return result;
  }

  /**
   * Transform a single object
   */
  transformObject(obj, schema) {
    const transformed = {};
    
    for (const [targetKey, config] of Object.entries(schema)) {
      let value;
      
      // Handle different config types
      if (typeof config === 'string') {
        // Simple field mapping
        value = this.getNestedValue(obj, config);
      } else if (typeof config === 'function') {
        // Custom transform function
        value = config(obj);
      } else if (typeof config === 'object' && config !== null) {
        // Complex transformation config
        value = this.processFieldConfig(obj, config);
      } else {
        value = config;
      }
      
      // Set the transformed value
      this.setNestedValue(transformed, targetKey, value);
    }
    
    return transformed;
  }

  /**
   * Process field configuration
   */
  processFieldConfig(obj, config) {
    let value;
    
    // Get source value
    if (config.field) {
      value = this.getNestedValue(obj, config.field);
    } else if (config.value !== undefined) {
      value = config.value;
    } else if (config.compute) {
      value = config.compute(obj);
    }
    
    // Apply default if null/undefined
    if ((value === null || value === undefined) && config.default !== undefined) {
      value = typeof config.default === 'function' 
        ? config.default(obj) 
        : config.default;
    }
    
    // Apply transformations
    if (config.transform) {
      const transforms = Array.isArray(config.transform) 
        ? config.transform 
        : [config.transform];
      
      for (const transform of transforms) {
        if (typeof transform === 'string') {
          value = this.applyTransformer(transform, value);
        } else if (typeof transform === 'function') {
          value = transform(value, obj);
        }
      }
    }
    
    // Apply conditions
    if (config.when) {
      const condition = typeof config.when === 'function' 
        ? config.when(obj) 
        : config.when;
      
      if (!condition) {
        value = config.otherwise !== undefined ? config.otherwise : undefined;
      }
    }
    
    return value;
  }

  /**
   * Apply a named transformer
   */
  applyTransformer(name, value) {
    const transformer = this.transformers.get(name);
    
    if (!transformer) {
      console.warn(`Transformer "${name}" not found`);
      return value;
    }
    
    return transformer(value);
  }

  /**
   * Register a custom transformer
   */
  registerTransformer(name, transformer) {
    if (typeof transformer !== 'function') {
      throw new TypeError('Transformer must be a function');
    }
    
    this.transformers.set(name, transformer);
  }

  /**
   * Create a transformation pipeline
   */
  createPipeline(name, steps) {
    this.pipelines.set(name, steps);
  }

  /**
   * Execute a transformation pipeline
   */
  executePipeline(name, data) {
    const pipeline = this.pipelines.get(name);
    
    if (!pipeline) {
      throw new Error(`Pipeline "${name}" not found`);
    }
    
    let result = data;
    
    for (const step of pipeline) {
      if (typeof step === 'function') {
        result = step(result);
      } else if (typeof step === 'object' && step.transform) {
        result = this.transform(result, step.transform);
      }
    }
    
    return result;
  }

  /**
   * Convert camelCase to snake_case
   */
  camelToSnake(obj) {
    const convertKey = (key) => 
      key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    return this.transformKeys(obj, convertKey);
  }

  /**
   * Convert snake_case to camelCase
   */
  snakeToCamel(obj) {
    const convertKey = (key) => 
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    return this.transformKeys(obj, convertKey);
  }

  /**
   * Transform object keys
   */
  transformKeys(obj, transformer) {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformKeys(item, transformer));
    }
    
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    const transformed = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = transformer(key);
      transformed[newKey] = this.transformKeys(value, transformer);
    }
    
    return transformed;
  }

  /**
   * Pick specific fields from object
   */
  pick(obj, fields) {
    const picked = {};
    
    for (const field of fields) {
      if (field.includes('.')) {
        // Handle nested fields
        const value = this.getNestedValue(obj, field);
        if (value !== undefined) {
          this.setNestedValue(picked, field, value);
        }
      } else {
        if (obj[field] !== undefined) {
          picked[field] = obj[field];
        }
      }
    }
    
    return picked;
  }

  /**
   * Omit specific fields from object
   */
  omit(obj, fields) {
    const omitted = { ...obj };
    
    for (const field of fields) {
      if (field.includes('.')) {
        // Handle nested fields
        this.deleteNestedValue(omitted, field);
      } else {
        delete omitted[field];
      }
    }
    
    return omitted;
  }

  /**
   * Rename fields in object
   */
  rename(obj, mapping) {
    const renamed = { ...obj };
    
    for (const [oldKey, newKey] of Object.entries(mapping)) {
      if (oldKey in renamed) {
        renamed[newKey] = renamed[oldKey];
        delete renamed[oldKey];
      }
    }
    
    return renamed;
  }

  /**
   * Flatten nested object
   */
  flatten(obj, prefix = '', separator = '.') {
    const flattened = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}${separator}${key}` : key;
      
      if (value === null || value === undefined) {
        flattened[newKey] = value;
      } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        Object.assign(flattened, this.flatten(value, newKey, separator));
      } else {
        flattened[newKey] = value;
      }
    }
    
    return flattened;
  }

  /**
   * Unflatten object
   */
  unflatten(obj, separator = '.') {
    const unflattened = {};
    
    for (const [key, value] of Object.entries(obj)) {
      this.setNestedValue(unflattened, key.split(separator).join('.'), value);
    }
    
    return unflattened;
  }

  /**
   * Merge objects deeply
   */
  deepMerge(...objects) {
    const result = {};
    
    for (const obj of objects) {
      if (!obj) continue;
      
      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) {
          result[key] = value;
        } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          result[key] = this.deepMerge(result[key] || {}, value);
        } else {
          result[key] = value;
        }
      }
    }
    
    return result;
  }

  /**
   * Clean object (remove null/undefined/empty values)
   */
  clean(obj, options = {}) {
    const {
      removeNull = true,
      removeUndefined = true,
      removeEmpty = false,
      removeEmptyStrings = false,
      removeEmptyArrays = false,
      removeEmptyObjects = false
    } = options;
    
    if (Array.isArray(obj)) {
      return obj
        .map(item => this.clean(item, options))
        .filter(item => {
          if (removeEmptyArrays && Array.isArray(item) && item.length === 0) return false;
          return true;
        });
    }
    
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    const cleaned = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Check removal conditions
      if (removeNull && value === null) continue;
      if (removeUndefined && value === undefined) continue;
      if (removeEmptyStrings && value === '') continue;
      if (removeEmpty && this.isEmpty(value)) continue;
      if (removeEmptyArrays && Array.isArray(value) && value.length === 0) continue;
      if (removeEmptyObjects && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) continue;
      
      // Recursively clean nested objects
      if (typeof value === 'object' && value !== null) {
        cleaned[key] = this.clean(value, options);
      } else {
        cleaned[key] = value;
      }
    }
    
    return cleaned;
  }

  /**
   * Group array of objects by key
   */
  groupBy(array, key) {
    if (!Array.isArray(array)) return {};
    
    return array.reduce((grouped, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key];
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      
      grouped[groupKey].push(item);
      return grouped;
    }, {});
  }

  /**
   * Convert array to object using key
   */
  arrayToObject(array, keyField = 'id', valueField = null) {
    if (!Array.isArray(array)) return {};
    
    return array.reduce((obj, item) => {
      const key = typeof keyField === 'function' ? keyField(item) : item[keyField];
      const value = valueField 
        ? (typeof valueField === 'function' ? valueField(item) : item[valueField])
        : item;
      
      obj[key] = value;
      return obj;
    }, {});
  }

  /**
   * Get nested value from object
   */
  getNestedValue(obj, path) {
    if (!path) return obj;
    
    return path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return undefined;
      
      // Handle array indices
      const match = key.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const [, arrayKey, index] = match;
        return current[arrayKey]?.[parseInt(index, 10)];
      }
      
      return current[key];
    }, obj);
  }

  /**
   * Set nested value in object
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    const target = keys.reduce((current, key) => {
      // Handle array indices
      const match = key.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const [, arrayKey, index] = match;
        if (!current[arrayKey]) current[arrayKey] = [];
        if (!current[arrayKey][index]) current[arrayKey][index] = {};
        return current[arrayKey][index];
      }
      
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }

  /**
   * Delete nested value from object
   */
  deleteNestedValue(obj, path) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    const target = keys.reduce((current, key) => {
      if (!current || typeof current !== 'object') return null;
      return current[key];
    }, obj);
    
    if (target && typeof target === 'object') {
      delete target[lastKey];
    }
  }

  /**
   * Check if value is empty
   */
  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }
}

// Export singleton instance
export const dataTransformer = new DataTransformer();

export default DataTransformer;