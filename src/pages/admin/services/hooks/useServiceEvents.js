// src/pages/admin/services/hooks/useServiceEvents.js
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

export const serviceEventBus = new EventBus();

export const useServiceEvents = () => {
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Subscribe to realtime changes for services
    const servicesChannel = supabase
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
              break;
            case 'DELETE':
              serviceEventBus.emit('service:deleted', payload.old);
              break;
          }
        }
      );

    // Subscribe to service zones changes
    const zonesChannel = supabase
      .channel('service_zones_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_zones' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              serviceEventBus.emit('zone:created', payload.new);
              break;
            case 'UPDATE':
              serviceEventBus.emit('zone:updated', payload.new);
              break;
            case 'DELETE':
              serviceEventBus.emit('zone:deleted', payload.old);
              break;
          }
        }
      );

    servicesChannel.subscribe();
    zonesChannel.subscribe();

    return () => {
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(zonesChannel);
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
    emit: emitEvent,
    eventBus: serviceEventBus
  };
};

export const SERVICE_EVENTS = {
  CREATED: 'service:created',
  UPDATED: 'service:updated',
  DELETED: 'service:deleted',
  ZONE_CREATED: 'zone:created',
  ZONE_UPDATED: 'zone:updated',
  ZONE_DELETED: 'zone:deleted'
};