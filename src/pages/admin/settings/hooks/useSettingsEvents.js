// src/pages/admin/settings/hooks/useSettingsEvents.js
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

export const settingsEventBus = new EventBus();

export const useSettingsEvents = () => {
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Set up realtime subscriptions for all settings tables
    const channels = [
      'categories_changes',
      'tags_changes',
      'testimonials_changes',
      'partnerships_changes',
      'awards_changes',
      'departments_changes'
    ];

    const subscriptions = channels.map(channel => {
      const tableName = channel.replace('_changes', '');
      return supabase
        .channel(channel)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => {
            settingsEventBus.emit('settings:updated', {
              table: tableName,
              type: payload.eventType,
              data: payload.new || payload.old
            });
          }
        )
        .subscribe();
    });

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, []);

  const subscribeToEvents = useCallback((event, callback) => {
    return settingsEventBus.on(event, callback);
  }, []);

  const emitEvent = useCallback((event, data) => {
    settingsEventBus.emit(event, data);
  }, []);

  return {
    subscribeToEvents,
    emit: emitEvent
  };
};