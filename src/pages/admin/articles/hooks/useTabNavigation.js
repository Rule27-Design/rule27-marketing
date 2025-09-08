// src/pages/admin/articles/hooks/useTabNavigation.js - Tab state and error indicators
import { useState, useCallback, useMemo } from 'react';

/**
 * Hook for managing tab navigation and error indicators in article editor
 * @param {Object} errors - Validation errors object
 * @param {string} defaultTab - Default active tab
 * @returns {Object} Tab navigation state and methods
 */
export const useTabNavigation = (errors = {}, defaultTab = 'overview') => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [visitedTabs, setVisitedTabs] = useState(new Set([defaultTab]));

  // Tab configuration with field mappings
  const tabConfig = useMemo(() => ({
    overview: {
      id: 'overview',
      label: 'Overview',
      icon: 'FileText',
      fields: ['title', 'slug', 'excerpt', 'category_id', 'tags', 'co_authors', 'status']
    },
    content: {
      id: 'content',
      label: 'Content',
      icon: 'Edit',
      fields: ['content']
    },
    media: {
      id: 'media',
      label: 'Media',
      icon: 'Image',
      fields: ['featured_image', 'featured_image_alt', 'featured_video']
    },
    seo: {
      id: 'seo',
      label: 'SEO',
      icon: 'Search',
      fields: [
        'meta_title', 'meta_description', 'meta_keywords',
        'og_title', 'og_description', 'og_image',
        'twitter_card', 'canonical_url'
      ]
    },
    settings: {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      fields: [
        'is_featured', 'enable_comments', 'enable_reactions',
        'scheduled_at', 'internal_notes'
      ]
    }
  }), []);

  // Get tabs with errors
  const getTabsWithErrors = useCallback(() => {
    const tabsWithErrors = new Set();
    
    Object.keys(errors).forEach(field => {
      Object.values(tabConfig).forEach(tab => {
        if (tab.fields.includes(field)) {
          tabsWithErrors.add(tab.id);
        }
      });
    });
    
    return Array.from(tabsWithErrors);
  }, [errors, tabConfig]);

  // Check if specific tab has errors
  const tabHasErrors = useCallback((tabId) => {
    const tab = tabConfig[tabId];
    if (!tab) return false;
    
    return tab.fields.some(field => errors[field]);
  }, [errors, tabConfig]);

  // Get error count for a tab
  const getTabErrorCount = useCallback((tabId) => {
    const tab = tabConfig[tabId];
    if (!tab) return 0;
    
    return tab.fields.filter(field => errors[field]).length;
  }, [errors, tabConfig]);

  // Switch to tab with validation
  const switchToTab = useCallback((tabId) => {
    if (!tabConfig[tabId]) {
      console.warn(`Tab "${tabId}" does not exist`);
      return false;
    }
    
    setActiveTab(tabId);
    setVisitedTabs(prev => new Set([...prev, tabId]));
    return true;
  }, [tabConfig]);

  // Go to next tab
  const goToNextTab = useCallback(() => {
    const tabIds = Object.keys(tabConfig);
    const currentIndex = tabIds.indexOf(activeTab);
    const nextIndex = Math.min(currentIndex + 1, tabIds.length - 1);
    
    switchToTab(tabIds[nextIndex]);
  }, [activeTab, tabConfig, switchToTab]);

  // Go to previous tab
  const goToPreviousTab = useCallback(() => {
    const tabIds = Object.keys(tabConfig);
    const currentIndex = tabIds.indexOf(activeTab);
    const prevIndex = Math.max(currentIndex - 1, 0);
    
    switchToTab(tabIds[prevIndex]);
  }, [activeTab, tabConfig, switchToTab]);

  // Go to first tab with errors
  const goToFirstErrorTab = useCallback(() => {
    const tabsWithErrors = getTabsWithErrors();
    if (tabsWithErrors.length > 0) {
      switchToTab(tabsWithErrors[0]);
      return true;
    }
    return false;
  }, [getTabsWithErrors, switchToTab]);

  // Get tab completion status
  const getTabCompletionStatus = useCallback(() => {
    const completion = {};
    
    Object.entries(tabConfig).forEach(([tabId, tab]) => {
      const requiredFields = tab.fields.filter(field => 
        ['title', 'content', 'category_id'].includes(field)
      );
      
      const hasErrors = tab.fields.some(field => errors[field]);
      const isVisited = visitedTabs.has(tabId);
      const isComplete = !hasErrors && isVisited;
      
      completion[tabId] = {
        isComplete,
        isVisited,
        hasErrors,
        errorCount: getTabErrorCount(tabId),
        requiredFieldsCount: requiredFields.length
      };
    });
    
    return completion;
  }, [tabConfig, errors, visitedTabs, getTabErrorCount]);

  // Check if all tabs are valid
  const areAllTabsValid = useCallback(() => {
    return getTabsWithErrors().length === 0;
  }, [getTabsWithErrors]);

  // Get tab navigation state for UI
  const getTabNavigation = useCallback(() => {
    const tabIds = Object.keys(tabConfig);
    const currentIndex = tabIds.indexOf(activeTab);
    
    return {
      canGoNext: currentIndex < tabIds.length - 1,
      canGoPrevious: currentIndex > 0,
      currentIndex,
      totalTabs: tabIds.length,
      nextTabId: currentIndex < tabIds.length - 1 ? tabIds[currentIndex + 1] : null,
      previousTabId: currentIndex > 0 ? tabIds[currentIndex - 1] : null
    };
  }, [activeTab, tabConfig]);

  // Keyboard navigation handler
  const handleKeyboardNavigation = useCallback((event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPreviousTab();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextTab();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          event.preventDefault();
          const tabIds = Object.keys(tabConfig);
          const tabIndex = parseInt(event.key) - 1;
          if (tabIds[tabIndex]) {
            switchToTab(tabIds[tabIndex]);
          }
          break;
      }
    }
  }, [goToPreviousTab, goToNextTab, switchToTab, tabConfig]);

  return {
    // Current state
    activeTab,
    visitedTabs: Array.from(visitedTabs),
    tabConfig,
    
    // Navigation methods
    switchToTab,
    goToNextTab,
    goToPreviousTab,
    goToFirstErrorTab,
    
    // Error handling
    getTabsWithErrors,
    tabHasErrors,
    getTabErrorCount,
    areAllTabsValid,
    
    // Status information
    getTabCompletionStatus,
    getTabNavigation,
    
    // Keyboard support
    handleKeyboardNavigation,
    
    // Computed values
    hasErrors: getTabsWithErrors().length > 0,
    completionRate: Math.round((visitedTabs.size / Object.keys(tabConfig).length) * 100)
  };
};