// src/components/providers/EventBusProvider.jsx - Provider component only
import React, { createContext, useContext } from 'react';
import { globalEventBus } from '../../lib/eventBus.js';

// Event bus context for dependency injection
const EventBusContext = createContext(globalEventBus);

/**
 * Provider component for event bus
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {EventBus} props.eventBus - Optional custom event bus instance
 */
export const EventBusProvider = ({ children, eventBus = globalEventBus }) => {
  return (
    <EventBusContext.Provider value={eventBus}>
      {children}
    </EventBusContext.Provider>
  );
};

/** 
 * Hook for accessing the event bus from context
 * @returns {EventBus} The event bus instance
 */
export const useEventBus = () => {
  const eventBus = useContext(EventBusContext);
  
  if (!eventBus) {
    throw new Error('useEventBus must be used within an EventBusProvider');
  }
  
  return eventBus;
};

export default EventBusProvider;