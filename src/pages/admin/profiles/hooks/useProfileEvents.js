// src/pages/admin/profiles/hooks/useProfileEvents.js
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

export const profileEventBus = new EventBus();

export const useProfileEvents = () => {
  const subscriptionRef = useRef(null);

  useEffect(() => {
    subscriptionRef.current = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              profileEventBus.emit('profile:created', payload.new);
              break;
            case 'UPDATE':
              profileEventBus.emit('profile:updated', payload.new);
              if (payload.old?.role !== payload.new.role) {
                profileEventBus.emit('profile:role_changed', payload.new);
              }
              break;
            case 'DELETE':
              profileEventBus.emit('profile:deleted', payload.old);
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
    return profileEventBus.on(event, callback);
  }, []);

  const emitEvent = useCallback((event, data) => {
    profileEventBus.emit(event, data);
  }, []);

  return {
    subscribeToEvents,
    emit: emitEvent,
    eventBus: profileEventBus
  };
};

export const PROFILE_EVENTS = {
  CREATED: 'profile:created',
  UPDATED: 'profile:updated',
  DELETED: 'profile:deleted',
  ROLE_CHANGED: 'profile:role_changed'
};