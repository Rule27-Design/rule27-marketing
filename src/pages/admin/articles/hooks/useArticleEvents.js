// src/pages/admin/articles/hooks/useArticleEvents.js
import { useEffect, useRef } from 'react';
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

export const globalEventBus = new EventBus();

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
              globalEventBus.emit('article:created', payload.new);
              break;
            case 'UPDATE':
              globalEventBus.emit('article:updated', payload.new);
              if (payload.old.status !== payload.new.status && payload.new.status === 'published') {
                globalEventBus.emit('article:published', payload.new);
              }
              break;
            case 'DELETE':
              globalEventBus.emit('article:deleted', payload.old.id);
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

  const subscribeToEvents = (event, callback) => {
    globalEventBus.on(event, callback);
  };

  const unsubscribeFromEvents = (event, callback) => {
    globalEventBus.off(event, callback);
  };

  const emitEvent = (event, data) => {
    globalEventBus.emit(event, data);
  };

  return {
    subscribeToEvents,
    unsubscribeFromEvents,
    emitEvent
  };
};