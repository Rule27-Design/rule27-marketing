// src/pages/admin/articles/hooks/useArticleEvents.js
import { useCallback, useEffect, useRef } from 'react';
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
    return () => this.off(event, callback);
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

export const ARTICLE_EVENTS = {
  CREATED: 'article:created',
  UPDATED: 'article:updated',
  DELETED: 'article:deleted',
  PUBLISHED: 'article:published',
  BULK_ACTION: 'article:bulk_action'
};