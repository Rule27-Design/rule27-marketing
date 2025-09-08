// src/lib/eventBus.js - Standalone event bus instance

/**
 * Event Bus - Centralized event management
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 100;
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   * @param {Object} options - Subscription options
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback, options = {}) {
    const { once = false, priority = 0, condition = null } = options;
    
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    const listener = {
      callback,
      once,
      priority,
      condition,
      id: `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const listeners = this.listeners.get(eventName);
    listeners.push(listener);
    
    // Sort by priority (higher priority first)
    listeners.sort((a, b) => b.priority - a.priority);

    if (this.debugMode) {
      console.log(`📡 Event listener added: ${eventName}`, listener);
    }

    // Return unsubscribe function
    return () => this.off(eventName, listener.id);
  }

  /**
   * Subscribe to an event once
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  once(eventName, callback) {
    return this.on(eventName, callback, { once: true });
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event
   * @param {string} listenerId - ID of the listener to remove
   */
  off(eventName, listenerId) {
    if (!this.listeners.has(eventName)) return;

    const listeners = this.listeners.get(eventName);
    const index = listeners.findIndex(l => l.id === listenerId);
    
    if (index !== -1) {
      listeners.splice(index, 1);
      
      if (this.debugMode) {
        console.log(`📡 Event listener removed: ${eventName}`, listenerId);
      }
    }

    // Clean up empty event arrays
    if (listeners.length === 0) {
      this.listeners.delete(eventName);
    }
  }

  /**
   * Emit an event
   * @param {string} eventName - Name of the event
   * @param {any} data - Event data
   * @param {Object} options - Emission options
   */
  emit(eventName, data = null, options = {}) {
    const { async = false } = options;
    
    const eventRecord = {
      eventName,
      data,
      timestamp: new Date().toISOString(),
      id: `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Add to history
    this.eventHistory.unshift(eventRecord);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    if (this.debugMode) {
      console.log(`📡 Event emitted: ${eventName}`, data);
    }

    if (!this.listeners.has(eventName)) {
      if (this.debugMode) {
        console.warn(`📡 No listeners for event: ${eventName}`);
      }
      return;
    }

    const listeners = this.listeners.get(eventName);
    const listenersToRemove = [];

    const executeListeners = () => {
      listeners.forEach(listener => {
        try {
          // Check condition if provided
          if (listener.condition && !listener.condition(data)) {
            return;
          }

          listener.callback(data, eventRecord);

          // Mark for removal if it's a once listener
          if (listener.once) {
            listenersToRemove.push(listener.id);
          }
        } catch (error) {
          console.error(`📡 Error in event listener for ${eventName}:`, error);
        }
      });

      // Remove once listeners
      listenersToRemove.forEach(id => this.off(eventName, id));
    };

    if (async) {
      setTimeout(executeListeners, 0);
    } else {
      executeListeners();
    }
  }

  /**
   * Get event history
   * @param {string} eventName - Optional filter by event name
   * @param {number} limit - Maximum number of events to return
   * @returns {Array} Event history
   */
  getHistory(eventName = null, limit = 50) {
    let history = this.eventHistory;
    
    if (eventName) {
      history = history.filter(event => event.eventName === eventName);
    }
    
    return history.slice(0, limit);
  }

  /**
   * Clear all listeners
   */
  clear() {
    this.listeners.clear();
    this.eventHistory = [];
    
    if (this.debugMode) {
      console.log('📡 Event bus cleared');
    }
  }

  /**
   * Get current listener count
   * @returns {Object} Listener statistics
   */
  getStats() {
    const stats = {
      totalEvents: this.listeners.size,
      totalListeners: 0,
      eventBreakdown: {}
    };

    this.listeners.forEach((listeners, eventName) => {
      stats.totalListeners += listeners.length;
      stats.eventBreakdown[eventName] = listeners.length;
    });

    return stats;
  }
}

// Create and export the global instance
export const globalEventBus = new EventBus();