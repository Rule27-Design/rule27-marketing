// src/pages/admin/articles/hooks/useArticleEvents.js - Event-driven communication system
import { useState, useEffect, useCallback, useRef } from 'react';
import { useEventBus } from '../../../../components/providers/EventBusProvider.jsx';

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

// Global event bus instance
export const globalEventBus = new EventBus();

/**
 * Main hook for article events
 */
export const useArticleEvents = () => {
  const eventBus = useEventBus();
  const listenersRef = useRef(new Set());

  // Event subscription with automatic cleanup
  const subscribe = useCallback((eventName, callback, options = {}) => {
    const unsubscribe = eventBus.on(eventName, callback, options);
    listenersRef.current.add(unsubscribe);
    
    return () => {
      unsubscribe();
      listenersRef.current.delete(unsubscribe);
    };
  }, [eventBus]);

  // Event emission
  const emit = useCallback((eventName, data, options = {}) => {
    eventBus.emit(eventName, data, options);
  }, [eventBus]);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach(unsubscribe => unsubscribe());
      listenersRef.current.clear();
    };
  }, []);

  return {
    subscribe,
    emit,
    eventBus
  };
};

/**
 * Article-specific event hooks
 */

// Article lifecycle events
export const useArticleLifecycleEvents = (handlers = {}) => {
  const { subscribe } = useArticleEvents();

  useEffect(() => {
    const unsubscribers = [];

    if (handlers.onCreated) {
      unsubscribers.push(subscribe('article:created', handlers.onCreated));
    }

    if (handlers.onUpdated) {
      unsubscribers.push(subscribe('article:updated', handlers.onUpdated));
    }

    if (handlers.onPublished) {
      unsubscribers.push(subscribe('article:published', handlers.onPublished));
    }

    if (handlers.onArchived) {
      unsubscribers.push(subscribe('article:archived', handlers.onArchived));
    }

    if (handlers.onDeleted) {
      unsubscribers.push(subscribe('article:deleted', handlers.onDeleted));
    }

    if (handlers.onDuplicated) {
      unsubscribers.push(subscribe('article:duplicated', handlers.onDuplicated));
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, handlers]);
};

// Bulk operations events
export const useBulkOperationEvents = (handlers = {}) => {
  const { subscribe } = useArticleEvents();

  useEffect(() => {
    const unsubscribers = [];

    if (handlers.onBulkUpdated) {
      unsubscribers.push(subscribe('articles:bulk_updated', handlers.onBulkUpdated));
    }

    if (handlers.onBulkDeleted) {
      unsubscribers.push(subscribe('articles:bulk_deleted', handlers.onBulkDeleted));
    }

    if (handlers.onBulkUndone) {
      unsubscribers.push(subscribe('articles:bulk_undone', handlers.onBulkUndone));
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, handlers]);
};

// Command events (undo/redo)
export const useCommandEvents = (handlers = {}) => {
  const { subscribe } = useArticleEvents();

  useEffect(() => {
    const unsubscribers = [];

    if (handlers.onExecuted) {
      unsubscribers.push(subscribe('command:executed', handlers.onExecuted));
    }

    if (handlers.onUndone) {
      unsubscribers.push(subscribe('command:undone', handlers.onUndone));
    }

    if (handlers.onRedone) {
      unsubscribers.push(subscribe('command:redone', handlers.onRedone));
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, handlers]);
};

// Real-time collaboration events
export const useCollaborationEvents = (articleId, userId) => {
  const { subscribe, emit } = useArticleEvents();
  const [collaborators, setCollaborators] = useState(new Set());
  const heartbeatInterval = useRef(null);

  useEffect(() => {
    if (!articleId) return;

    const unsubscribers = [];

    // Join collaboration session
    emit('collaboration:join', { articleId, userId });

    // Listen for other users joining/leaving
    unsubscribers.push(
      subscribe('collaboration:user_joined', ({ articleId: eventArticleId, userId: eventUserId }) => {
        if (eventArticleId === articleId && eventUserId !== userId) {
          setCollaborators(prev => new Set([...prev, eventUserId]));
        }
      })
    );

    unsubscribers.push(
      subscribe('collaboration:user_left', ({ articleId: eventArticleId, userId: eventUserId }) => {
        if (eventArticleId === articleId) {
          setCollaborators(prev => {
            const next = new Set(prev);
            next.delete(eventUserId);
            return next;
          });
        }
      })
    );

    // Send heartbeat every 30 seconds
    heartbeatInterval.current = setInterval(() => {
      emit('collaboration:heartbeat', { articleId, userId });
    }, 30000);

    return () => {
      // Leave collaboration session
      emit('collaboration:leave', { articleId, userId });
      
      // Cleanup
      unsubscribers.forEach(unsubscribe => unsubscribe());
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [articleId, userId, subscribe, emit]);

  const notifyEdit = useCallback((field, value) => {
    emit('collaboration:edit', {
      articleId,
      userId,
      field,
      value,
      timestamp: Date.now()
    });
  }, [articleId, userId, emit]);

  return {
    collaborators: Array.from(collaborators),
    notifyEdit
  };
};

// Performance monitoring events
export const usePerformanceEvents = () => {
  const { subscribe, emit } = useArticleEvents();
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    cacheHits: 0,
    cacheMisses: 0
  });

  useEffect(() => {
    const unsubscribers = [];

    unsubscribers.push(
      subscribe('performance:load_time', ({ duration }) => {
        setMetrics(prev => ({ ...prev, loadTime: duration }));
      })
    );

    unsubscribers.push(
      subscribe('performance:render_time', ({ duration }) => {
        setMetrics(prev => ({ ...prev, renderTime: duration }));
      })
    );

    unsubscribers.push(
      subscribe('performance:cache_hit', () => {
        setMetrics(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
      })
    );

    unsubscribers.push(
      subscribe('performance:cache_miss', () => {
        setMetrics(prev => ({ ...prev, cacheMisses: prev.cacheMisses + 1 }));
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe]);

  const reportLoadTime = useCallback((startTime) => {
    const duration = performance.now() - startTime;
    emit('performance:load_time', { duration });
  }, [emit]);

  const reportRenderTime = useCallback((startTime) => {
    const duration = performance.now() - startTime;
    emit('performance:render_time', { duration });
  }, [emit]);

  return {
    metrics,
    reportLoadTime,
    reportRenderTime
  };
};

// Notification events for user feedback
export const useNotificationEvents = () => {
  const { subscribe } = useArticleEvents();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribers = [];

    // Auto-generate notifications for article events
    unsubscribers.push(
      subscribe('article:published', ({ article }) => {
        const notification = {
          id: Date.now(),
          type: 'success',
          title: 'Article Published',
          message: `"${article.title}" is now live`,
          timestamp: Date.now()
        };
        setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
      })
    );

    unsubscribers.push(
      subscribe('articles:bulk_updated', ({ count, updates }) => {
        const notification = {
          id: Date.now(),
          type: 'info',
          title: 'Bulk Update Complete',
          message: `${count} articles updated`,
          timestamp: Date.now()
        };
        setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      })
    );

    unsubscribers.push(
      subscribe('command:executed', ({ command }) => {
        const notification = {
          id: Date.now(),
          type: 'info',
          title: 'Action Completed',
          message: command,
          timestamp: Date.now(),
          canUndo: true
        };
        setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe]);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    dismissNotification
  };
};

// Event name constants for better maintainability
export const ARTICLE_EVENTS = {
  // Lifecycle
  CREATED: 'article:created',
  UPDATED: 'article:updated',
  PUBLISHED: 'article:published',
  UNPUBLISHED: 'article:unpublished',
  ARCHIVED: 'article:archived',
  UNARCHIVED: 'article:unarchived',
  DELETED: 'article:deleted',
  RESTORED: 'article:restored',
  DUPLICATED: 'article:duplicated',
  
  // Bulk operations
  BULK_UPDATED: 'articles:bulk_updated',
  BULK_DELETED: 'articles:bulk_deleted',
  BULK_UNDONE: 'articles:bulk_undone',
  
  // Commands
  COMMAND_EXECUTED: 'command:executed',
  COMMAND_UNDONE: 'command:undone',
  COMMAND_REDONE: 'command:redone',
  
  // Collaboration
  COLLABORATION_JOIN: 'collaboration:join',
  COLLABORATION_LEAVE: 'collaboration:leave',
  COLLABORATION_EDIT: 'collaboration:edit',
  COLLABORATION_USER_JOINED: 'collaboration:user_joined',
  COLLABORATION_USER_LEFT: 'collaboration:user_left',
  
  // Performance
  PERFORMANCE_LOAD: 'performance:load_time',
  PERFORMANCE_RENDER: 'performance:render_time',
  PERFORMANCE_CACHE_HIT: 'performance:cache_hit',
  PERFORMANCE_CACHE_MISS: 'performance:cache_miss'
};