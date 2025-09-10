// src/services/BaseCache.js

/**
 * Base cache class for client-side caching with TTL and storage options
 */
export class BaseCache {
  constructor(namespace = 'cache', options = {}) {
    this.namespace = namespace;
    this.options = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100,
      storage: 'memory', // 'memory', 'sessionStorage', 'localStorage'
      compress: false,
      prefix: 'cache_',
      debug: false,
      ...options
    };
    
    // In-memory cache
    this.memoryCache = new Map();
    
    // Track access for LRU eviction
    this.accessOrder = [];
    
    // Track cache statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0
    };
    
    // Initialize storage
    this.initializeStorage();
  }

  /**
   * Initialize storage based on options
   */
  initializeStorage() {
    if (this.options.storage === 'localStorage' || this.options.storage === 'sessionStorage') {
      this.storage = window[this.options.storage];
      
      // Clean up expired items on initialization
      this.cleanupExpiredItems();
    }
  }

  /**
   * Generate cache key with namespace
   */
  generateKey(key) {
    return `${this.options.prefix}${this.namespace}_${key}`;
  }

  /**
   * Get item from cache
   */
  get(key) {
    const fullKey = this.generateKey(key);
    
    try {
      let cachedData = null;
      
      // Get from appropriate storage
      if (this.options.storage === 'memory') {
        cachedData = this.memoryCache.get(fullKey);
      } else if (this.storage) {
        const stored = this.storage.getItem(fullKey);
        if (stored) {
          cachedData = JSON.parse(stored);
        }
      }
      
      if (!cachedData) {
        this.stats.misses++;
        this.debug(`Cache miss: ${key}`);
        return null;
      }
      
      // Check if expired
      if (this.isExpired(cachedData)) {
        this.delete(key);
        this.stats.misses++;
        this.debug(`Cache expired: ${key}`);
        return null;
      }
      
      // Update access order for LRU
      this.updateAccessOrder(fullKey);
      
      this.stats.hits++;
      this.debug(`Cache hit: ${key}`);
      
      // Decompress if needed
      if (this.options.compress && cachedData.compressed) {
        return this.decompress(cachedData.data);
      }
      
      return cachedData.data;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Set item in cache
   */
  set(key, data, ttl = null) {
    const fullKey = this.generateKey(key);
    const expiresAt = Date.now() + (ttl || this.options.ttl);
    
    try {
      // Compress if needed
      let dataToStore = data;
      let compressed = false;
      
      if (this.options.compress && this.shouldCompress(data)) {
        dataToStore = this.compress(data);
        compressed = true;
      }
      
      const cacheEntry = {
        data: dataToStore,
        expiresAt,
        createdAt: Date.now(),
        compressed
      };
      
      // Check size limit and evict if necessary
      if (this.size() >= this.options.maxSize) {
        this.evictLRU();
      }
      
      // Store in appropriate storage
      if (this.options.storage === 'memory') {
        this.memoryCache.set(fullKey, cacheEntry);
      } else if (this.storage) {
        try {
          this.storage.setItem(fullKey, JSON.stringify(cacheEntry));
        } catch (e) {
          // Handle quota exceeded error
          if (e.name === 'QuotaExceededError') {
            this.evictLRU();
            // Try again
            this.storage.setItem(fullKey, JSON.stringify(cacheEntry));
          } else {
            throw e;
          }
        }
      }
      
      // Update access order
      this.updateAccessOrder(fullKey);
      
      this.stats.sets++;
      this.debug(`Cache set: ${key}`);
      
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete item from cache
   */
  delete(key) {
    const fullKey = this.generateKey(key);
    
    try {
      if (this.options.storage === 'memory') {
        this.memoryCache.delete(fullKey);
      } else if (this.storage) {
        this.storage.removeItem(fullKey);
      }
      
      // Remove from access order
      const index = this.accessOrder.indexOf(fullKey);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      
      this.stats.deletes++;
      this.debug(`Cache delete: ${key}`);
      
      return true;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if cache entry is expired
   */
  isExpired(cacheEntry) {
    return cacheEntry.expiresAt && Date.now() > cacheEntry.expiresAt;
  }

  /**
   * Update access order for LRU tracking
   */
  updateAccessOrder(fullKey) {
    const index = this.accessOrder.indexOf(fullKey);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(fullKey);
  }

  /**
   * Evict least recently used item
   */
  evictLRU() {
    if (this.accessOrder.length === 0) return;
    
    const lruKey = this.accessOrder.shift();
    
    if (this.options.storage === 'memory') {
      this.memoryCache.delete(lruKey);
    } else if (this.storage) {
      this.storage.removeItem(lruKey);
    }
    
    this.stats.evictions++;
    this.debug(`Cache evicted (LRU): ${lruKey}`);
  }

  /**
   * Clear all cache entries for this namespace
   */
  clear() {
    try {
      const keysToDelete = [];
      
      if (this.options.storage === 'memory') {
        this.memoryCache.clear();
      } else if (this.storage) {
        // Find all keys for this namespace
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key && key.startsWith(`${this.options.prefix}${this.namespace}_`)) {
            keysToDelete.push(key);
          }
        }
        
        // Delete all found keys
        keysToDelete.forEach(key => this.storage.removeItem(key));
      }
      
      this.accessOrder = [];
      this.debug(`Cache cleared: ${keysToDelete.length} items`);
      
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Clear all expired items
   */
  cleanupExpiredItems() {
    try {
      const now = Date.now();
      const keysToDelete = [];
      
      if (this.options.storage === 'memory') {
        this.memoryCache.forEach((value, key) => {
          if (value.expiresAt && value.expiresAt < now) {
            keysToDelete.push(key);
          }
        });
        
        keysToDelete.forEach(key => this.memoryCache.delete(key));
      } else if (this.storage) {
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key && key.startsWith(`${this.options.prefix}${this.namespace}_`)) {
            try {
              const item = JSON.parse(this.storage.getItem(key));
              if (item && item.expiresAt && item.expiresAt < now) {
                keysToDelete.push(key);
              }
            } catch (e) {
              // Invalid item, remove it
              keysToDelete.push(key);
            }
          }
        }
        
        keysToDelete.forEach(key => this.storage.removeItem(key));
      }
      
      this.debug(`Cleaned up ${keysToDelete.length} expired items`);
      return keysToDelete.length;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidatePattern(pattern) {
    try {
      const regex = new RegExp(pattern);
      const keysToDelete = [];
      
      if (this.options.storage === 'memory') {
        this.memoryCache.forEach((value, key) => {
          const originalKey = key.replace(`${this.options.prefix}${this.namespace}_`, '');
          if (regex.test(originalKey)) {
            keysToDelete.push(key);
          }
        });
        
        keysToDelete.forEach(key => this.memoryCache.delete(key));
      } else if (this.storage) {
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key && key.startsWith(`${this.options.prefix}${this.namespace}_`)) {
            const originalKey = key.replace(`${this.options.prefix}${this.namespace}_`, '');
            if (regex.test(originalKey)) {
              keysToDelete.push(key);
            }
          }
        }
        
        keysToDelete.forEach(key => this.storage.removeItem(key));
      }
      
      this.debug(`Invalidated ${keysToDelete.length} items matching pattern: ${pattern}`);
      return keysToDelete.length;
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
      return 0;
    }
  }

  /**
   * Invalidate cache entries by tags
   */
  invalidateTags(tags) {
    // This is a placeholder for tag-based invalidation
    // Implement if you need tag-based cache invalidation
    console.warn('Tag-based invalidation not implemented in base cache');
    return 0;
  }

  /**
   * Get current cache size
   */
  size() {
    if (this.options.storage === 'memory') {
      return this.memoryCache.size;
    } else if (this.storage) {
      let count = 0;
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(`${this.options.prefix}${this.namespace}_`)) {
          count++;
        }
      }
      return count;
    }
    return 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      ...this.stats,
      size: this.size(),
      hitRate: this.stats.hits + this.stats.misses > 0 
        ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0
    };
  }

  /**
   * Check if data should be compressed
   */
  shouldCompress(data) {
    // Only compress if data is large enough
    const dataStr = JSON.stringify(data);
    return dataStr.length > 1024; // Compress if larger than 1KB
  }

  /**
   * Simple compression (placeholder - implement actual compression if needed)
   */
  compress(data) {
    // This is a placeholder - you'd implement actual compression here
    // For example, using pako or lz-string library
    return JSON.stringify(data);
  }

  /**
   * Simple decompression (placeholder)
   */
  decompress(data) {
    // This is a placeholder - you'd implement actual decompression here
    return typeof data === 'string' ? JSON.parse(data) : data;
  }

  /**
   * Debug logging
   */
  debug(message) {
    if (this.options.debug) {
      console.log(`[${this.namespace}] ${message}`);
    }
  }

  /**
   * Export cache data
   */
  export() {
    const data = {};
    
    if (this.options.storage === 'memory') {
      this.memoryCache.forEach((value, key) => {
        data[key] = value;
      });
    } else if (this.storage) {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(`${this.options.prefix}${this.namespace}_`)) {
          try {
            data[key] = JSON.parse(this.storage.getItem(key));
          } catch (e) {
            // Skip invalid items
          }
        }
      }
    }
    
    return data;
  }

  /**
   * Import cache data
   */
  import(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (this.options.storage === 'memory') {
          this.memoryCache.set(key, value);
        } else if (this.storage) {
          this.storage.setItem(key, JSON.stringify(value));
        }
      });
      
      return true;
    } catch (error) {
      console.error('Cache import error:', error);
      return false;
    }
  }

  /**
   * Warm up cache with predefined data
   */
  async warmup(items) {
    const results = [];
    
    for (const item of items) {
      const { key, fetcher, ttl } = item;
      
      try {
        const cached = this.get(key);
        if (!cached) {
          const data = await fetcher();
          this.set(key, data, ttl);
          results.push({ key, success: true, source: 'fetched' });
        } else {
          results.push({ key, success: true, source: 'cached' });
        }
      } catch (error) {
        results.push({ key, success: false, error: error.message });
      }
    }
    
    return results;
  }
}

export default BaseCache;