// src/services/BaseOperations.js
import { supabase } from '../lib/supabase';

/**
 * Base class for CRUD operations with Supabase
 * Provides common database operations with error handling and hooks
 */
export class BaseOperations {
  constructor(tableName, options = {}) {
    this.tableName = tableName;
    this.options = {
      primaryKey: 'id',
      timestamps: true,
      softDelete: false,
      hooks: {},
      cache: null,
      debug: false,
      ...options
    };
    
    // Operation hooks
    this.hooks = {
      beforeCreate: [],
      afterCreate: [],
      beforeUpdate: [],
      afterUpdate: [],
      beforeDelete: [],
      afterDelete: [],
      beforeFetch: [],
      afterFetch: [],
      onError: [],
      ...this.options.hooks
    };
    
    // Track operation statistics
    this.stats = {
      creates: 0,
      reads: 0,
      updates: 0,
      deletes: 0,
      errors: 0
    };
  }

  /**
   * Create a new record
   */
  async create(data, options = {}) {
    try {
      // Run before hooks
      const processedData = await this.runHooks('beforeCreate', data);
      
      // Add timestamps if enabled
      if (this.options.timestamps) {
        processedData.created_at = processedData.created_at || new Date().toISOString();
        processedData.updated_at = processedData.updated_at || new Date().toISOString();
      }
      
      // Execute insert
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert([processedData])
        .select(options.select || '*')
        .single();
      
      if (error) throw error;
      
      // Run after hooks
      const finalResult = await this.runHooks('afterCreate', result);
      
      // Invalidate cache if exists
      if (this.options.cache) {
        this.options.cache.invalidatePattern(this.tableName);
      }
      
      this.stats.creates++;
      this.debug(`Created record in ${this.tableName}:`, finalResult);
      
      return { success: true, data: finalResult };
    } catch (error) {
      this.stats.errors++;
      await this.runHooks('onError', { operation: 'create', error, data });
      this.debug(`Create error in ${this.tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create multiple records
   */
  async createMany(records, options = {}) {
    try {
      // Process all records through hooks
      const processedRecords = await Promise.all(
        records.map(record => this.runHooks('beforeCreate', record))
      );
      
      // Add timestamps if enabled
      if (this.options.timestamps) {
        const now = new Date().toISOString();
        processedRecords.forEach(record => {
          record.created_at = record.created_at || now;
          record.updated_at = record.updated_at || now;
        });
      }
      
      // Execute bulk insert
      const { data: results, error } = await supabase
        .from(this.tableName)
        .insert(processedRecords)
        .select(options.select || '*');
      
      if (error) throw error;
      
      // Run after hooks on all results
      const finalResults = await Promise.all(
        results.map(result => this.runHooks('afterCreate', result))
      );
      
      // Invalidate cache
      if (this.options.cache) {
        this.options.cache.invalidatePattern(this.tableName);
      }
      
      this.stats.creates += finalResults.length;
      
      return { success: true, data: finalResults };
    } catch (error) {
      this.stats.errors++;
      await this.runHooks('onError', { operation: 'createMany', error, data: records });
      return { success: false, error: error.message };
    }
  }

  /**
   * Read/fetch records
   */
  async read(filters = {}, options = {}) {
    try {
      // Run before hooks
      await this.runHooks('beforeFetch', { filters, options });
      
      // Check cache first
      if (this.options.cache && options.useCache !== false) {
        const cacheKey = this.getCacheKey('read', filters, options);
        const cached = this.options.cache.get(cacheKey);
        if (cached) {
          this.debug(`Cache hit for ${this.tableName}:`, cacheKey);
          return { success: true, data: cached, fromCache: true };
        }
      }
      
      // Build query
      let query = supabase.from(this.tableName).select(options.select || '*');
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value === null) {
          query = query.is(key, null);
        } else if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value.operator) {
          // Handle complex filters like { operator: 'gte', value: 10 }
          const { operator, value: filterValue } = value;
          query = query[operator](key, filterValue);
        } else {
          query = query.eq(key, value);
        }
      });
      
      // Apply soft delete filter if enabled
      if (this.options.softDelete && !options.includeDeleted) {
        query = query.is('deleted_at', null);
      }
      
      // Apply sorting
      if (options.orderBy) {
        const orders = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy];
        orders.forEach(order => {
          query = query.order(order.field, { ascending: order.ascending !== false });
        });
      }
      
      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      // Execute query
      const { data: results, error, count } = await query;
      
      if (error) throw error;
      
      // Run after hooks
      const finalResults = await this.runHooks('afterFetch', results);
      
      // Cache results if enabled
      if (this.options.cache && options.useCache !== false) {
        const cacheKey = this.getCacheKey('read', filters, options);
        this.options.cache.set(cacheKey, finalResults, options.cacheTTL);
      }
      
      this.stats.reads++;
      
      return { 
        success: true, 
        data: finalResults,
        count: count,
        fromCache: false
      };
    } catch (error) {
      this.stats.errors++;
      await this.runHooks('onError', { operation: 'read', error, filters });
      return { success: false, error: error.message };
    }
  }

  /**
   * Read a single record by ID
   */
  async readById(id, options = {}) {
    const filters = { [this.options.primaryKey]: id };
    const result = await this.read(filters, { ...options, limit: 1 });
    
    if (result.success && result.data.length > 0) {
      return { ...result, data: result.data[0] };
    }
    
    return result;
  }

  /**
   * Update a record
   */
  async update(id, updates, options = {}) {
    try {
      // Run before hooks
      const processedUpdates = await this.runHooks('beforeUpdate', { id, updates });
      
      // Add updated timestamp if enabled
      if (this.options.timestamps) {
        processedUpdates.updated_at = processedUpdates.updated_at || new Date().toISOString();
      }
      
      // Execute update
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(processedUpdates)
        .eq(this.options.primaryKey, id)
        .select(options.select || '*')
        .single();
      
      if (error) throw error;
      
      // Run after hooks
      const finalResult = await this.runHooks('afterUpdate', result);
      
      // Invalidate cache
      if (this.options.cache) {
        this.options.cache.delete(this.getCacheKey('read', { [this.options.primaryKey]: id }));
        this.options.cache.invalidatePattern(this.tableName);
      }
      
      this.stats.updates++;
      this.debug(`Updated record in ${this.tableName}:`, finalResult);
      
      return { success: true, data: finalResult };
    } catch (error) {
      this.stats.errors++;
      await this.runHooks('onError', { operation: 'update', error, id, updates });
      return { success: false, error: error.message };
    }
  }

  /**
   * Update multiple records
   */
  async updateMany(filters, updates, options = {}) {
    try {
      // Run before hooks
      const processedUpdates = await this.runHooks('beforeUpdate', { filters, updates });
      
      // Add updated timestamp
      if (this.options.timestamps) {
        processedUpdates.updated_at = processedUpdates.updated_at || new Date().toISOString();
      }
      
      // Build query
      let query = supabase.from(this.tableName).update(processedUpdates);
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      });
      
      // Execute update
      const { data: results, error } = await query.select(options.select || '*');
      
      if (error) throw error;
      
      // Run after hooks on all results
      const finalResults = await Promise.all(
        results.map(result => this.runHooks('afterUpdate', result))
      );
      
      // Invalidate cache
      if (this.options.cache) {
        this.options.cache.invalidatePattern(this.tableName);
      }
      
      this.stats.updates += finalResults.length;
      
      return { success: true, data: finalResults };
    } catch (error) {
      this.stats.errors++;
      await this.runHooks('onError', { operation: 'updateMany', error, filters, updates });
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a record
   */
  async delete(id, options = {}) {
    try {
      // Run before hooks
      await this.runHooks('beforeDelete', { id });
      
      let result;
      
      if (this.options.softDelete && !options.force) {
        // Soft delete - just mark as deleted
        result = await this.update(id, { 
          deleted_at: new Date().toISOString() 
        });
      } else {
        // Hard delete
        const { error } = await supabase
          .from(this.tableName)
          .delete()
          .eq(this.options.primaryKey, id);
        
        if (error) throw error;
        
        result = { success: true };
      }
      
      // Run after hooks
      await this.runHooks('afterDelete', { id });
      
      // Invalidate cache
      if (this.options.cache) {
        this.options.cache.delete(this.getCacheKey('read', { [this.options.primaryKey]: id }));
        this.options.cache.invalidatePattern(this.tableName);
      }
      
      this.stats.deletes++;
      this.debug(`Deleted record from ${this.tableName}:`, id);
      
      return result;
    } catch (error) {
      this.stats.errors++;
      await this.runHooks('onError', { operation: 'delete', error, id });
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete multiple records
   */
  async deleteMany(filters, options = {}) {
    try {
      // Run before hooks
      await this.runHooks('beforeDelete', { filters });
      
      let result;
      
      if (this.options.softDelete && !options.force) {
        // Soft delete
        result = await this.updateMany(filters, { 
          deleted_at: new Date().toISOString() 
        });
      } else {
        // Hard delete
        let query = supabase.from(this.tableName).delete();
        
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        });
        
        const { error } = await query;
        
        if (error) throw error;
        
        result = { success: true };
      }
      
      // Run after hooks
      await this.runHooks('afterDelete', { filters });
      
      // Invalidate cache
      if (this.options.cache) {
        this.options.cache.invalidatePattern(this.tableName);
      }
      
      this.stats.deletes++;
      
      return result;
    } catch (error) {
      this.stats.errors++;
      await this.runHooks('onError', { operation: 'deleteMany', error, filters });
      return { success: false, error: error.message };
    }
  }

  /**
   * Count records
   */
  async count(filters = {}, options = {}) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value === null) {
          query = query.is(key, null);
        } else if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      });
      
      // Apply soft delete filter
      if (this.options.softDelete && !options.includeDeleted) {
        query = query.is('deleted_at', null);
      }
      
      const { count, error } = await query;
      
      if (error) throw error;
      
      return { success: true, count };
    } catch (error) {
      this.stats.errors++;
      return { success: false, error: error.message, count: 0 };
    }
  }

  /**
   * Check if record exists
   */
  async exists(filters, options = {}) {
    const result = await this.count(filters, options);
    return result.success && result.count > 0;
  }

  /**
   * Upsert (insert or update)
   */
  async upsert(data, options = {}) {
    try {
      // Check if record exists
      const id = data[this.options.primaryKey];
      
      if (id) {
        const exists = await this.exists({ [this.options.primaryKey]: id });
        
        if (exists) {
          // Update existing
          return this.update(id, data, options);
        }
      }
      
      // Create new
      return this.create(data, options);
    } catch (error) {
      this.stats.errors++;
      return { success: false, error: error.message };
    }
  }

  /**
   * Run hooks
   */
  async runHooks(hookName, data) {
    if (!this.hooks[hookName] || this.hooks[hookName].length === 0) {
      return data;
    }
    
    let result = data;
    
    for (const hook of this.hooks[hookName]) {
      if (typeof hook === 'function') {
        result = await hook(result, this);
      }
    }
    
    return result;
  }

  /**
   * Add hook
   */
  addHook(hookName, fn) {
    if (!this.hooks[hookName]) {
      this.hooks[hookName] = [];
    }
    this.hooks[hookName].push(fn);
  }

  /**
   * Remove hook
   */
  removeHook(hookName, fn) {
    if (!this.hooks[hookName]) return;
    
    const index = this.hooks[hookName].indexOf(fn);
    if (index > -1) {
      this.hooks[hookName].splice(index, 1);
    }
  }

  /**
   * Generate cache key
   */
  getCacheKey(operation, filters = {}, options = {}) {
    const filterStr = JSON.stringify(filters);
    const optionStr = JSON.stringify({
      select: options.select,
      orderBy: options.orderBy,
      limit: options.limit,
      offset: options.offset
    });
    
    return `${this.tableName}_${operation}_${filterStr}_${optionStr}`;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      total: this.stats.creates + this.stats.reads + this.stats.updates + this.stats.deletes,
      errorRate: this.stats.errors / (this.stats.creates + this.stats.reads + this.stats.updates + this.stats.deletes) || 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      creates: 0,
      reads: 0,
      updates: 0,
      deletes: 0,
      errors: 0
    };
  }

  /**
   * Debug logging
   */
  debug(...args) {
    if (this.options.debug) {
      console.log(`[${this.tableName}]`, ...args);
    }
  }
}

export default BaseOperations;