// src/components/providers/EventBusProvider.jsx
import React, { createContext, useContext } from 'react';

// Create a global event bus context
const EventBusContext = createContext(null);

export const EventBusProvider = ({ children }) => {
  // This provider can be used to share event bus instances
  // across the entire application if needed
  
  return (
    <EventBusContext.Provider value={{}}>
      {children}
    </EventBusContext.Provider>
  );
};

export const useEventBus = () => {
  const context = useContext(EventBusContext);
  if (!context) {
    throw new Error('useEventBus must be used within EventBusProvider');
  }
  return context;
};