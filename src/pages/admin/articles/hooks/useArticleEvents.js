// src/pages/admin/articles/hooks/useArticleEvents.js
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';

class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback); // Return unsubscribe function
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

// Global event bus for article events
export const articleEventBus = new EventBus();

export const useArticleEvents = () => {
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Subscribe to realtime changes
    subscriptionRef.current = supabase
      .channel('articles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              articleEventBus.emit('article:created', payload.new);
              break;
            case 'UPDATE':
              articleEventBus.emit('article:updated', payload.new);
              if (payload.old?.status !== payload.new.status) {
                if (payload.new.status === 'published') {
                  articleEventBus.emit('article:published', payload.new);
                } else if (payload.new.status === 'archived') {
                  articleEventBus.emit('article:archived', payload.new);
                }
              }
              break;
            case 'DELETE':
              articleEventBus.emit('article:deleted', payload.old);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  const subscribeToEvents = useCallback((event, callback) => {
    return articleEventBus.on(event, callback);
  }, []);

  const emitEvent = useCallback((event, data) => {
    articleEventBus.emit(event, data);
  }, []);

  return {
    subscribeToEvents,
    emit: emitEvent,
    eventBus: articleEventBus
  };
};

// Export event types
export const ARTICLE_EVENTS = {
  CREATED: 'article:created',
  UPDATED: 'article:updated',
  DELETED: 'article:deleted',
  PUBLISHED: 'article:published',
  ARCHIVED: 'article:archived',
  BULK_ACTION: 'article:bulk_action'
};