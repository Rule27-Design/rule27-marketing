// src/pages/admin/case-studies/hooks/useCaseStudyEvents.js
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

export const caseStudyEventBus = new EventBus();

export const useCaseStudyEvents = () => {
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Subscribe to realtime changes
    subscriptionRef.current = supabase
      .channel('case_studies_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'case_studies' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              caseStudyEventBus.emit('case_study:created', payload.new);
              break;
            case 'UPDATE':
              caseStudyEventBus.emit('case_study:updated', payload.new);
              if (payload.old?.status !== payload.new.status) {
                if (payload.new.status === 'published') {
                  caseStudyEventBus.emit('case_study:published', payload.new);
                } else if (payload.new.status === 'approved') {
                  caseStudyEventBus.emit('case_study:approved', payload.new);
                }
              }
              break;
            case 'DELETE':
              caseStudyEventBus.emit('case_study:deleted', payload.old);
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
    return caseStudyEventBus.on(event, callback);
  }, []);

  const emitEvent = useCallback((event, data) => {
    caseStudyEventBus.emit(event, data);
  }, []);

  return {
    subscribeToEvents,
    emit: emitEvent,
    eventBus: caseStudyEventBus
  };
};

export const CASE_STUDY_EVENTS = {
  CREATED: 'case_study:created',
  UPDATED: 'case_study:updated',
  DELETED: 'case_study:deleted',
  PUBLISHED: 'case_study:published',
  APPROVED: 'case_study:approved',
  BULK_ACTION: 'case_study:bulk_action'
};