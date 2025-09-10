// src/hooks/useTabNavigation.js
import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook for managing tab navigation with validation, warnings, and keyboard support
 * @param {Array} tabs - Array of tab configurations
 * @param {Object} formData - Current form data (optional)
 * @param {Object} errors - Current form errors (optional)
 * @param {Object} options - Additional options
 */
export const useTabNavigation = (tabs = [], formData = {}, errors = {}, options = {}) => {
  const {
    defaultTab = tabs[0]?.id || '',
    persistSelection = true,
    storageKey = 'activeTab',
    validateBeforeSwitch = false,
    enableKeyboardNav = true,
    onTabChange = null,
    tabValidations = {}
  } = options;

  // Initialize active tab from localStorage if persistence is enabled
  const getInitialTab = () => {
    if (persistSelection && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && tabs.find(t => t.id === stored)) {
        return stored;
      }
    }
    return defaultTab;
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [visitedTabs, setVisitedTabs] = useState(new Set([activeTab]));
  const [tabErrors, setTabErrors] = useState({});
  const [tabWarnings, setTabWarnings] = useState({});
  const [lockedTabs, setLockedTabs] = useState(new Set());
  
  const previousTab = useRef(activeTab);
  const tabRefs = useRef({});

  // Persist active tab to localStorage
  useEffect(() => {
    if (persistSelection && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, activeTab);
    }
  }, [activeTab, persistSelection, storageKey]);

  // Calculate tab errors based on form errors
  useEffect(() => {
    const newTabErrors = {};
    const newTabWarnings = {};
    
    tabs.forEach(tab => {
      const tabFieldErrors = [];
      const tabFieldWarnings = [];
      
      // Check if tab has field mappings
      if (tab.fields) {
        tab.fields.forEach(field => {
          if (errors[field]) {
            tabFieldErrors.push({ field, error: errors[field] });
          }
        });
      }
      
      // Check custom validations
      if (tabValidations[tab.id]) {
        const validation = tabValidations[tab.id](formData, errors);
        if (validation.errors) {
          tabFieldErrors.push(...validation.errors);
        }
        if (validation.warnings) {
          tabFieldWarnings.push(...validation.warnings);
        }
      }
      
      if (tabFieldErrors.length > 0) {
        newTabErrors[tab.id] = tabFieldErrors;
      }
      if (tabFieldWarnings.length > 0) {
        newTabWarnings[tab.id] = tabFieldWarnings;
      }
    });
    
    setTabErrors(newTabErrors);
    setTabWarnings(newTabWarnings);
  }, [tabs, errors, formData, tabValidations]);

  // Set active tab with validation
  const setActiveTab = useCallback((tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    // Check if tab is locked
    if (lockedTabs.has(tabId)) {
      return;
    }
    
    // Validate before switching if enabled
    if (validateBeforeSwitch && tabErrors[activeTab]?.length > 0) {
      if (!confirm('This tab has errors. Do you want to switch anyway?')) {
        return;
      }
    }
    
    previousTab.current = activeTab;
    setActiveTabState(tabId);
    setVisitedTabs(prev => new Set([...prev, tabId]));
    
    // Call onTabChange callback
    if (onTabChange) {
      onTabChange(tabId, previousTab.current);
    }
    
    // Focus management
    if (tabRefs.current[tabId]) {
      setTimeout(() => {
        tabRefs.current[tabId].focus();
      }, 100);
    }
  }, [activeTab, tabs, lockedTabs, validateBeforeSwitch, tabErrors, onTabChange]);

  // Navigate to next tab
  const goToNextTab = useCallback(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  }, [activeTab, tabs, setActiveTab]);

  // Navigate to previous tab
  const goToPreviousTab = useCallback(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  }, [activeTab, tabs, setActiveTab]);

  // Navigate to specific tab by index
  const goToTabByIndex = useCallback((index) => {
    if (index >= 0 && index < tabs.length) {
      setActiveTab(tabs[index].id);
    }
  }, [tabs, setActiveTab]);

  // Check if can navigate to a tab
  const canNavigateToTab = useCallback((tabId) => {
    return !lockedTabs.has(tabId);
  }, [lockedTabs]);

  // Lock/unlock tabs
  const lockTab = useCallback((tabId) => {
    setLockedTabs(prev => new Set([...prev, tabId]));
  }, []);

  const unlockTab = useCallback((tabId) => {
    setLockedTabs(prev => {
      const next = new Set(prev);
      next.delete(tabId);
      return next;
    });
  }, []);

  const lockTabs = useCallback((tabIds) => {
    setLockedTabs(new Set(tabIds));
  }, []);

  // Mark tab as visited
  const markAsVisited = useCallback((tabId) => {
    setVisitedTabs(prev => new Set([...prev, tabId]));
  }, []);

  // Reset visited tabs
  const resetVisited = useCallback(() => {
    setVisitedTabs(new Set([activeTab]));
  }, [activeTab]);

  // Get tab state
  const getTabState = useCallback((tabId) => {
    return {
      isActive: activeTab === tabId,
      isVisited: visitedTabs.has(tabId),
      hasErrors: !!tabErrors[tabId]?.length,
      hasWarnings: !!tabWarnings[tabId]?.length,
      isLocked: lockedTabs.has(tabId),
      errorCount: tabErrors[tabId]?.length || 0,
      warningCount: tabWarnings[tabId]?.length || 0
    };
  }, [activeTab, visitedTabs, tabErrors, tabWarnings, lockedTabs]);

  // Get errors for a specific tab
  const getTabErrors = useCallback((tabId) => {
    return tabErrors[tabId] || [];
  }, [tabErrors]);

  // Get warnings for a specific tab
  const getTabWarnings = useCallback((tabId) => {
    return tabWarnings[tabId] || [];
  }, [tabWarnings]);

  // Get all tabs with errors
  const getTabsWithErrors = useCallback(() => {
    return Object.keys(tabErrors);
  }, [tabErrors]);

  // Get all tabs with warnings
  const getTabsWithWarnings = useCallback(() => {
    return Object.keys(tabWarnings);
  }, [tabWarnings]);

  // Check if all tabs are visited
  const allTabsVisited = visitedTabs.size === tabs.length;

  // Get progress percentage
  const progressPercentage = Math.round((visitedTabs.size / tabs.length) * 100);

  // Find first tab with error
  const firstTabWithError = tabs.find(tab => tabErrors[tab.id]?.length > 0);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e) => {
      // Check if we're in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      // Alt + Arrow keys for tab navigation
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            goToNextTab();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            goToPreviousTab();
            break;
        }
      }
      
      // Number keys for direct tab access (1-9)
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        goToTabByIndex(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, goToNextTab, goToPreviousTab, goToTabByIndex]);

  // Generate tab props for easy integration
  const getTabProps = useCallback((tabId) => {
    const state = getTabState(tabId);
    
    return {
      id: tabId,
      'aria-selected': state.isActive,
      'aria-controls': `tabpanel-${tabId}`,
      'data-state': state.isActive ? 'active' : 'inactive',
      'data-visited': state.isVisited,
      'data-has-errors': state.hasErrors,
      'data-has-warnings': state.hasWarnings,
      'data-locked': state.isLocked,
      role: 'tab',
      tabIndex: state.isActive ? 0 : -1,
      onClick: () => setActiveTab(tabId),
      ref: (el) => { tabRefs.current[tabId] = el; },
      className: [
        'tab',
        state.isActive && 'tab-active',
        state.isVisited && 'tab-visited',
        state.hasErrors && 'tab-error',
        state.hasWarnings && 'tab-warning',
        state.isLocked && 'tab-locked'
      ].filter(Boolean).join(' ')
    };
  }, [getTabState, setActiveTab]);

  // Generate tab panel props
  const getTabPanelProps = useCallback((tabId) => {
    const isActive = activeTab === tabId;
    
    return {
      id: `tabpanel-${tabId}`,
      role: 'tabpanel',
      'aria-labelledby': tabId,
      hidden: !isActive,
      'data-state': isActive ? 'active' : 'inactive',
      className: `tabpanel ${isActive ? 'tabpanel-active' : 'tabpanel-inactive'}`
    };
  }, [activeTab]);

  return {
    // State
    activeTab,
    previousTab: previousTab.current,
    visitedTabs: Array.from(visitedTabs),
    tabErrors,
    tabWarnings,
    lockedTabs: Array.from(lockedTabs),
    allTabsVisited,
    progressPercentage,
    firstTabWithError,
    
    // Actions
    setActiveTab,
    goToNextTab,
    goToPreviousTab,
    goToTabByIndex,
    canNavigateToTab,
    lockTab,
    unlockTab,
    lockTabs,
    markAsVisited,
    resetVisited,
    
    // Getters
    getTabState,
    getTabErrors,
    getTabWarnings,
    getTabsWithErrors,
    getTabsWithWarnings,
    getTabProps,
    getTabPanelProps
  };
};

export default useTabNavigation;