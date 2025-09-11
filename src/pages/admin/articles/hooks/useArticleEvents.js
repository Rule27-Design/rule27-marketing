// src/pages/admin/articles/hooks/useArticleEvents.js
import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';

export const useArticleEvents = () => {
  const subscriptionsRef = useRef({});

  // Subscribe to article events
  const subscribeToEvents = useCallback((eventType, callback) => {
    // Create unique subscription key
    const subscriptionKey = `${eventType}_${Date.now()}`;
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`articles_${subscriptionKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'articles'
        },
        (payload) => {
          // Map database events to custom events
          let customEvent = null;
          
          switch (payload.eventType) {
            case 'INSERT':
              customEvent = 'article:created';
              break;
            case 'UPDATE':
              customEvent = 'article:updated';
              break;
            case 'DELETE':
              customEvent = 'article:deleted';
              break;
          }
          
          if (customEvent === eventType || eventType === '*') {
            callback(payload.new || payload.old, payload.eventType);
          }
        }
      )
      .subscribe();
    
    // Store subscription
    subscriptionsRef.current[subscriptionKey] = subscription;
    
    // Return unsubscribe function
    return () => {
      if (subscriptionsRef.current[subscriptionKey]) {
        subscriptionsRef.current[subscriptionKey].unsubscribe();
        delete subscriptionsRef.current[subscriptionKey];
      }
    };
  }, []);

  // Subscribe to bulk events
  const subscribeToBulkEvents = useCallback((callback) => {
    return subscribeToEvents('*', callback);
  }, [subscribeToEvents]);

  // Cleanup all subscriptions on unmount
  useEffect(() => {
    return () => {
      Object.values(subscriptionsRef.current).forEach(subscription => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current = {};
    };
  }, []);

  return {
    subscribeToEvents,
    subscribeToBulkEvents
  };
};