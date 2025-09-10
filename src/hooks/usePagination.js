// src/hooks/usePagination.js
import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Hook for managing pagination state and logic
 * @param {Object} options - Configuration options
 */
export const usePagination = (options = {}) => {
  const {
    totalItems = 0,
    itemsPerPage: initialItemsPerPage = 10,
    currentPage: initialPage = 1,
    siblingCount = 1, // Number of siblings on each side of current page
    boundaryCount = 1, // Number of pages at the start and end
    onChange = null,
    onPageSizeChange = null,
    pageSizeOptions = [10, 20, 30, 50, 100],
    persistState = false,
    storageKey = 'pagination',
    maxPages = null // Maximum number of pages to allow
  } = options;

  // Load persisted state
  const loadPersistedState = useCallback(() => {
    if (!persistState || typeof window === 'undefined') {
      return { page: initialPage, pageSize: initialItemsPerPage };
    }
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          page: parsed.page || initialPage,
          pageSize: parsed.pageSize || initialItemsPerPage
        };
      }
    } catch (e) {
      console.warn('Failed to load pagination state:', e);
    }
    
    return { page: initialPage, pageSize: initialItemsPerPage };
  }, [persistState, storageKey, initialPage, initialItemsPerPage]);

  // State
  const [state, setState] = useState(() => loadPersistedState());
  const { page: currentPage, pageSize: itemsPerPage } = state;

  // Calculate total pages
  const totalPages = useMemo(() => {
    const calculated = Math.ceil(totalItems / itemsPerPage);
    return maxPages ? Math.min(calculated, maxPages) : calculated;
  }, [totalItems, itemsPerPage, maxPages]);

  // Calculate page info
  const pageInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const startItem = totalItems > 0 ? startIndex + 1 : 0;
    const endItem = endIndex;
    
    return {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems,
      startIndex,
      endIndex,
      startItem,
      endItem,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages
    };
  }, [currentPage, totalPages, itemsPerPage, totalItems]);

  // Persist state
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          page: currentPage,
          pageSize: itemsPerPage,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Failed to persist pagination state:', e);
      }
    }
  }, [currentPage, itemsPerPage, persistState, storageKey]);

  // Set current page
  const setPage = useCallback((newPage) => {
    const page = Math.min(Math.max(1, newPage), totalPages || 1);
    
    if (page !== currentPage) {
      setState(prev => ({ ...prev, page }));
      
      if (onChange) {
        onChange(page, itemsPerPage);
      }
    }
  }, [currentPage, totalPages, itemsPerPage, onChange]);

  // Set items per page
  const setItemsPerPage = useCallback((newItemsPerPage) => {
    if (newItemsPerPage !== itemsPerPage) {
      // Calculate new current page to maintain position
      const currentStartIndex = (currentPage - 1) * itemsPerPage;
      const newPage = Math.max(1, Math.floor(currentStartIndex / newItemsPerPage) + 1);
      
      setState({ page: newPage, pageSize: newItemsPerPage });
      
      if (onPageSizeChange) {
        onPageSizeChange(newItemsPerPage, newPage);
      }
      
      if (onChange) {
        onChange(newPage, newItemsPerPage);
      }
    }
  }, [currentPage, itemsPerPage, onChange, onPageSizeChange]);

  // Navigation functions
  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);

  const goToNextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [setPage, currentPage]);

  const goToPreviousPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [setPage, currentPage]);

  const goToPage = useCallback((page) => {
    setPage(page);
  }, [setPage]);

  // Jump by multiple pages
  const jump = useCallback((delta) => {
    setPage(currentPage + delta);
  }, [setPage, currentPage]);

  // Reset pagination
  const reset = useCallback(() => {
    setState({ page: 1, pageSize: initialItemsPerPage });
    
    if (onChange) {
      onChange(1, initialItemsPerPage);
    }
  }, [initialItemsPerPage, onChange]);

  // Calculate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages = [];
    
    if (totalPages <= 0) return pages;
    
    // If total pages is small, show all
    const maxButtons = (siblingCount * 2) + 5 + (boundaryCount * 2);
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Calculate range around current page
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    
    const showLeftEllipsis = leftSibling > boundaryCount + 2;
    const showRightEllipsis = rightSibling < totalPages - boundaryCount - 1;
    
    // Add boundary pages at the start
    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
      pages.push(i);
    }
    
    // Add left ellipsis
    if (showLeftEllipsis) {
      pages.push('ellipsis-left');
    } else {
      // Fill the gap
      for (let i = boundaryCount + 1; i < leftSibling; i++) {
        pages.push(i);
      }
    }
    
    // Add pages around current
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i > boundaryCount && i <= totalPages - boundaryCount) {
        pages.push(i);
      }
    }
    
    // Add right ellipsis
    if (showRightEllipsis) {
      pages.push('ellipsis-right');
    } else {
      // Fill the gap
      for (let i = rightSibling + 1; i <= totalPages - boundaryCount; i++) {
        pages.push(i);
      }
    }
    
    // Add boundary pages at the end
    for (let i = Math.max(totalPages - boundaryCount + 1, 1); i <= totalPages; i++) {
      if (i > rightSibling) {
        pages.push(i);
      }
    }
    
    // Remove duplicates and sort
    const uniquePages = [];
    const seen = new Set();
    
    pages.forEach(page => {
      if (typeof page === 'string' || !seen.has(page)) {
        uniquePages.push(page);
        if (typeof page === 'number') {
          seen.add(page);
        }
      }
    });
    
    return uniquePages;
  }, [currentPage, totalPages, siblingCount, boundaryCount]);

  // Get paginated items from array
  const getPaginatedItems = useCallback((items) => {
    if (!Array.isArray(items)) return [];
    
    const { startIndex, endIndex } = pageInfo;
    return items.slice(startIndex, endIndex);
  }, [pageInfo]);

  // Generate page link
  const getPageLink = useCallback((page, baseUrl = '') => {
    if (!baseUrl) return `?page=${page}&pageSize=${itemsPerPage}`;
    
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', itemsPerPage);
    return url.toString();
  }, [itemsPerPage]);

  // Get pagination props for buttons
  const getPageButtonProps = useCallback((page) => {
    const isEllipsis = typeof page === 'string';
    const isActive = page === currentPage;
    const isDisabled = isEllipsis;
    
    return {
      key: page,
      onClick: isEllipsis ? undefined : () => goToPage(page),
      disabled: isDisabled,
      'aria-current': isActive ? 'page' : undefined,
      'aria-label': isEllipsis ? 'More pages' : `Go to page ${page}`,
      className: [
        'pagination-button',
        isActive && 'pagination-button-active',
        isDisabled && 'pagination-button-disabled',
        isEllipsis && 'pagination-ellipsis'
      ].filter(Boolean).join(' '),
      children: isEllipsis ? '...' : page
    };
  }, [currentPage, goToPage]);

  // Get navigation button props
  const getNavigationProps = useCallback(() => {
    return {
      first: {
        onClick: goToFirstPage,
        disabled: pageInfo.isFirstPage,
        'aria-label': 'Go to first page',
        className: `pagination-button ${pageInfo.isFirstPage ? 'pagination-button-disabled' : ''}`
      },
      previous: {
        onClick: goToPreviousPage,
        disabled: !pageInfo.hasPreviousPage,
        'aria-label': 'Go to previous page',
        className: `pagination-button ${!pageInfo.hasPreviousPage ? 'pagination-button-disabled' : ''}`
      },
      next: {
        onClick: goToNextPage,
        disabled: !pageInfo.hasNextPage,
        'aria-label': 'Go to next page',
        className: `pagination-button ${!pageInfo.hasNextPage ? 'pagination-button-disabled' : ''}`
      },
      last: {
        onClick: goToLastPage,
        disabled: pageInfo.isLastPage,
        'aria-label': 'Go to last page',
        className: `pagination-button ${pageInfo.isLastPage ? 'pagination-button-disabled' : ''}`
      }
    };
  }, [goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage, pageInfo]);

  // Get page size selector props
  const getPageSizeProps = useCallback(() => {
    return {
      value: itemsPerPage,
      onChange: (e) => setItemsPerPage(parseInt(e.target.value, 10)),
      'aria-label': 'Items per page',
      options: pageSizeOptions.map(size => ({
        value: size,
        label: `${size} per page`
      }))
    };
  }, [itemsPerPage, setItemsPerPage, pageSizeOptions]);

  // Get ARIA props for accessibility
  const getAriaProps = useCallback(() => {
    return {
      role: 'navigation',
      'aria-label': 'Pagination Navigation',
      'aria-describedby': 'pagination-info'
    };
  }, []);

  return {
    // State
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    pageInfo,
    pageNumbers,
    pageSizeOptions,
    
    // Navigation
    setPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    jump,
    reset,
    
    // Utilities
    getPaginatedItems,
    getPageLink,
    getPageButtonProps,
    getNavigationProps,
    getPageSizeProps,
    getAriaProps,
    
    // Flags
    canGoNext: pageInfo.hasNextPage,
    canGoPrevious: pageInfo.hasPreviousPage
  };
};

export default usePagination;