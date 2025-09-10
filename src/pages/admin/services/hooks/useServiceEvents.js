// src/pages/admin/services/hooks/useServiceEvents.js
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

export const serviceEventBus = new EventBus();

export const useServiceEvents = () => {
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Subscribe to realtime changes
    subscriptionRef.current = supabase
      .channel('services_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              serviceEventBus.emit('service:created', payload.new);
              break;
            case 'UPDATE':
              serviceEventBus.emit('service:updated', payload.new);
              if (payload.old?.status !== payload.new.status) {
                if (payload.new.status === 'published') {
                  serviceEventBus.emit('service:published', payload.new);
                }
              }
              break;
            case 'DELETE':
              serviceEventBus.emit('service:deleted', payload.old);
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
    return serviceEventBus.on(event, callback);
  }, []);

  const emitEvent = useCallback((event, data) => {
    serviceEventBus.emit(event, data);
  }, []);

  return {
    subscribeToEvents,
    emitEvent,
    eventBus: serviceEventBus
  };
};

export const SERVICE_EVENTS = {
  CREATED: 'service:created',
  UPDATED: 'service:updated',
  DELETED: 'service:deleted',
  PUBLISHED: 'service:published',
  BULK_ACTION: 'service:bulk_action'
};