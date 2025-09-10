// src/services/EventBus.js

/**
 * Global Event Bus for application-wide event handling
 * Implements publish-subscribe pattern with namespacing and wildcard support
 */
export class EventBus {
  constructor(options = {}) {
    this.options = {
      maxListeners: 100,
      enableWildcards: true,
      enableNamespaces: true,
      throwOnMaxListeners: false,
      debug: false,
      ...options
    };
    
    // Event listeners storage
    this.events = new Map();
    
    // Event history for debugging
    this.history = [];
    this.maxHistorySize = 100;
    
    // Statistics
    this.stats = {
      emitted: 0,
      listeners: 0,
      errors: 0
    };
    
    // Listener metadata
    this.listenerMeta = new WeakMap();
  }

  /**
   * Subscribe to an event
   */
  on(event, callback, options = {}) {
    const {
      once = false,
      priority = 0,
      context = null,
      id = null
    } = options;
    
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function');
    }
    
    // Check max listeners
    if (this.options.maxListeners > 0) {
      const currentCount = this.events.get(event)?.length || 0;
      if (currentCount >= this.options.maxListeners) {
        const msg = `Max listeners (${this.options.maxListeners}) exceeded for event: ${event}`;
        if (this.options.throwOnMaxListeners) {
          throw new Error(msg);
        } else {
          console.warn(msg);
        }
      }
    }
    
    // Create listener wrapper
    const listener = {
      callback,
      once,
      priority,
      context,
      id: id || this.generateListenerId(),
      event,
      addedAt: Date.now()
    };
    
    // Store metadata
    this.listenerMeta.set(callback, listener);
    
    // Add to event listeners
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const listeners = this.events.get(event);
    listeners.push(listener);
    
    // Sort by priority (higher priority first)
    listeners.sort((a, b) => b.priority - a.priority);
    
    this.stats.listeners++;
    this.debug(`Listener added for event: ${event}`);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event (alias for on)
   */
  subscribe(event, callback, options = {}) {
    return this.on(event, callback, options);
  }

  /**
   * Subscribe to an event once
   */
  once(event, callback, options = {}) {
    return this.on(event, callback, { ...options, once: true });
  }

  /**
   * Unsubscribe from an event
   */
  off(event, callback) {
    if (!event) {
      // Remove all listeners
      this.events.clear();
      this.stats.listeners = 0;
      this.debug('All listeners removed');
      return true;
    }
    
    if (!callback) {
      // Remove all listeners for this event
      const count = this.events.get(event)?.length || 0;
      this.events.delete(event);
      this.stats.listeners -= count;
      this.debug(`All listeners removed for event: ${event}`);
      return true;
    }
    
    // Remove specific listener
    const listeners = this.events.get(event);
    if (!listeners) return false;
    
    const index = listeners.findIndex(l => l.callback === callback);
    if (index === -1) return false;
    
    listeners.splice(index, 1);
    this.stats.listeners--;
    
    // Clean up empty event arrays
    if (listeners.length === 0) {
      this.events.delete(event);
    }
    
    // Clean up metadata
    this.listenerMeta.delete(callback);
    
    this.debug(`Listener removed for event: ${event}`);
    return true;
  }

  /**
   * Unsubscribe from an event (alias for off)
   */
  unsubscribe(event, callback) {
    return this.off(event, callback);
  }

  /**
   * Emit an event
   */
  emit(event, data = null, options = {}) {
    const {
      async = false,
      throwOnError = false
    } = options;
    
    this.stats.emitted++;
    
    // Add to history
    this.addToHistory(event, data);
    
    // Get direct listeners
    const directListeners = this.events.get(event) || [];
    
    // Get wildcard listeners if enabled
    const wildcardListeners = this.options.enableWildcards 
      ? this.getWildcardListeners(event)
      : [];
    
    // Get namespace listeners if enabled
    const namespaceListeners = this.options.enableNamespaces
      ? this.getNamespaceListeners(event)
      : [];
    
    // Combine all listeners
    const allListeners = [
      ...directListeners,
      ...wildcardListeners,
      ...namespaceListeners
    ];
    
    // Remove duplicates
    const uniqueListeners = Array.from(
      new Map(allListeners.map(l => [l.callback, l])).values()
    );
    
    // Sort by priority
    uniqueListeners.sort((a, b) => b.priority - a.priority);
    
    this.debug(`Emitting event: ${event} to ${uniqueListeners.length} listeners`);
    
    // Execute listeners
    if (async) {
      return this.emitAsync(event, data, uniqueListeners, throwOnError);
    } else {
      return this.emitSync(event, data, uniqueListeners, throwOnError);
    }
  }

  /**
   * Emit event synchronously
   */
  emitSync(event, data, listeners, throwOnError) {
    const results = [];
    const listenersToRemove = [];
    
    for (const listener of listeners) {
      try {
        const result = listener.context
          ? listener.callback.call(listener.context, data, event)
          : listener.callback(data, event);
        
        results.push({ listener: listener.id, result, success: true });
        
        // Remove once listeners
        if (listener.once) {
          listenersToRemove.push(listener);
        }
      } catch (error) {
        this.stats.errors++;
        results.push({ listener: listener.id, error, success: false });
        
        this.debug(`Error in listener for event ${event}:`, error);
        
        if (throwOnError) {
          throw error;
        }
      }
    }
    
    // Remove once listeners
    listenersToRemove.forEach(listener => {
      this.off(listener.event, listener.callback);
    });
    
    return results;
  }

  /**
   * Emit event asynchronously
   */
  async emitAsync(event, data, listeners, throwOnError) {
    const results = [];
    const listenersToRemove = [];
    
    const promises = listeners.map(async (listener) => {
      try {
        const result = listener.context
          ? await listener.callback.call(listener.context, data, event)
          : await listener.callback(data, event);
        
        if (listener.once) {
          listenersToRemove.push(listener);
        }
        
        return { listener: listener.id, result, success: true };
      } catch (error) {
        this.stats.errors++;
        this.debug(`Error in listener for event ${event}:`, error);
        
        if (throwOnError) {
          throw error;
        }
        
        return { listener: listener.id, error, success: false };
      }
    });
    
    const promiseResults = await Promise.allSettled(promises);
    
    promiseResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({ error: result.reason, success: false });
      }
    });
    
    // Remove once listeners
    listenersToRemove.forEach(listener => {
      this.off(listener.event, listener.callback);
    });
    
    return results;
  }

  /**
   * Publish an event (alias for emit)
   */
  publish(event, data, options) {
    return this.emit(event, data, options);
  }

  /**
   * Get wildcard listeners
   */
  getWildcardListeners(event) {
    const listeners = [];
    
    this.events.forEach((eventListeners, pattern) => {
      if (pattern.includes('*')) {
        const regex = this.wildcardToRegex(pattern);
        if (regex.test(event)) {
          listeners.push(...eventListeners);
        }
      }
    });
    
    return listeners;
  }

  /**
   * Get namespace listeners
   */
  getNamespaceListeners(event) {
    const listeners = [];
    const parts = event.split(':');
    
    // Listen to all parent namespaces
    for (let i = 1; i < parts.length; i++) {
      const namespace = parts.slice(0, i).join(':') + ':*';
      const namespaceListeners = this.events.get(namespace);
      if (namespaceListeners) {
        listeners.push(...namespaceListeners);
      }
    }
    
    return listeners;
  }

  /**
   * Convert wildcard pattern to regex
   */
  wildcardToRegex(pattern) {
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    return new RegExp(`^${escaped}$`);
  }

  /**
   * Check if event has listeners
   */
  hasListeners(event) {
    if (this.events.has(event)) {
      return this.events.get(event).length > 0;
    }
    
    // Check wildcards
    if (this.options.enableWildcards) {
      const wildcardListeners = this.getWildcardListeners(event);
      if (wildcardListeners.length > 0) return true;
    }
    
    // Check namespaces
    if (this.options.enableNamespaces) {
      const namespaceListeners = this.getNamespaceListeners(event);
      if (namespaceListeners.length > 0) return true;
    }
    
    return false;
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event) {
    const direct = this.events.get(event)?.length || 0;
    const wildcard = this.options.enableWildcards 
      ? this.getWildcardListeners(event).length 
      : 0;
    const namespace = this.options.enableNamespaces
      ? this.getNamespaceListeners(event).length
      : 0;
    
    return direct + wildcard + namespace;
  }

  /**
   * Get all events
   */
  eventNames() {
    return Array.from(this.events.keys());
  }

  /**
   * Wait for an event
   */
  waitFor(event, timeout = null) {
    return new Promise((resolve, reject) => {
      let timeoutId;
      
      const handler = (data) => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(data);
      };
      
      this.once(event, handler);
      
      if (timeout) {
        timeoutId = setTimeout(() => {
          this.off(event, handler);
          reject(new Error(`Timeout waiting for event: ${event}`));
        }, timeout);
      }
    });
  }

  /**
   * Create a namespace
   */
  namespace(ns) {
    const self = this;
    
    return {
      on: (event, callback, options) => 
        self.on(`${ns}:${event}`, callback, options),
      
      once: (event, callback, options) => 
        self.once(`${ns}:${event}`, callback, options),
      
      off: (event, callback) => 
        self.off(event ? `${ns}:${event}` : null, callback),
      
      emit: (event, data, options) => 
        self.emit(`${ns}:${event}`, data, options),
      
      hasListeners: (event) => 
        self.hasListeners(`${ns}:${event}`),
      
      listenerCount: (event) => 
        self.listenerCount(`${ns}:${event}`)
    };
  }

  /**
   * Add to event history
   */
  addToHistory(event, data) {
    const entry = {
      event,
      data,
      timestamp: Date.now(),
      listeners: this.listenerCount(event)
    };
    
    this.history.push(entry);
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Get event history
   */
  getHistory(event = null) {
    if (event) {
      return this.history.filter(entry => entry.event === event);
    }
    return [...this.history];
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      totalEvents: this.events.size,
      totalListeners: this.stats.listeners,
      historySize: this.history.length
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      emitted: 0,
      listeners: 0,
      errors: 0
    };
  }

  /**
   * Generate listener ID
   */
  generateListenerId() {
    return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Debug logging
   */
  debug(...args) {
    if (this.options.debug) {
      console.log('[EventBus]', ...args);
    }
  }

  /**
   * Destroy the event bus
   */
  destroy() {
    this.events.clear();
    this.history = [];
    this.listenerMeta = new WeakMap();
    this.resetStats();
    this.debug('Event bus destroyed');
  }
}

// Create singleton instance
export const globalEventBus = new EventBus({
  maxListeners: 200,
  enableWildcards: true,
  enableNamespaces: true,
  debug: process.env.NODE_ENV === 'development'
});

// Create namespaced event buses
export const createEventBus = (namespace, options = {}) => {
  return new EventBus({
    ...options,
    debug: process.env.NODE_ENV === 'development'
  });
};

// React hook for using event bus
export const useEventBus = (eventBus = globalEventBus) => {
  const subscribe = (event, callback, options) => {
    const unsubscribe = eventBus.on(event, callback, options);
    
    // Auto cleanup on unmount
    if (typeof window !== 'undefined' && window.React) {
      window.React.useEffect(() => {
        return unsubscribe;
      }, []);
    }
    
    return unsubscribe;
  };
  
  return {
    on: subscribe,
    once: (event, callback, options) => 
      eventBus.once(event, callback, options),
    off: (event, callback) => 
      eventBus.off(event, callback),
    emit: (event, data, options) => 
      eventBus.emit(event, data, options),
    subscribe,
    unsubscribe: (event, callback) => 
      eventBus.off(event, callback),
    publish: (event, data, options) => 
      eventBus.emit(event, data, options)
  };
};

export default EventBus;