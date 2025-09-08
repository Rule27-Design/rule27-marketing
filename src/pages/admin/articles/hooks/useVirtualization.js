// src/pages/admin/articles/hooks/useVirtualization.js - Virtual scrolling for large datasets
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Virtual scrolling hook for large datasets
 * @param {Object} options - Configuration options
 * @returns {Object} Virtual scrolling state and controls
 */
export const useVirtualization = ({
  items = [],
  itemHeight = 50,
  containerHeight = 600,
  overscan = 5,
  threshold = 100,
  enabled = false
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isVirtualized, setIsVirtualized] = useState(enabled);
  const [viewportHeight, setViewportHeight] = useState(containerHeight);
  
  const containerRef = useRef(null);
  const scrollElementRef = useRef(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Auto-enable virtualization based on threshold
  useEffect(() => {
    if (!enabled && items.length >= threshold) {
      setIsVirtualized(true);
    } else if (enabled && items.length < threshold / 2) {
      setIsVirtualized(false);
    }
  }, [items.length, threshold, enabled]);

  // Calculate viewport dimensions
  useEffect(() => {
    const updateViewportHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewportHeight(rect.height || containerHeight);
      }
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, [containerHeight]);

  // Virtual item calculations
  const virtualItems = useMemo(() => {
    if (!isVirtualized) {
      return items.map((item, index) => ({
        index,
        start: index * itemHeight,
        size: itemHeight,
        end: (index + 1) * itemHeight,
        item
      }));
    }

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + viewportHeight) / itemHeight) + overscan
    );

    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        visibleItems.push({
          index: i,
          start: i * itemHeight,
          size: itemHeight,
          end: (i + 1) * itemHeight,
          item: items[i]
        });
      }
    }

    return visibleItems;
  }, [items, itemHeight, scrollTop, viewportHeight, overscan, isVirtualized]);

  // Total size calculation
  const totalSize = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  // Scroll handler with throttling
  const handleScroll = useCallback((event) => {
    if (!isVirtualized) return;

    const scrollTop = event.target.scrollTop;
    setScrollTop(scrollTop);

    // Track scrolling state
    isScrollingRef.current = true;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, [isVirtualized]);

  // Scroll to specific item
  const scrollToItem = useCallback((index, align = 'auto') => {
    if (!containerRef.current || !isVirtualized) return;

    const itemStart = index * itemHeight;
    const itemEnd = itemStart + itemHeight;
    const viewportStart = scrollTop;
    const viewportEnd = viewportStart + viewportHeight;

    let newScrollTop = scrollTop;

    switch (align) {
      case 'start':
        newScrollTop = itemStart;
        break;
      case 'end':
        newScrollTop = itemEnd - viewportHeight;
        break;
      case 'center':
        newScrollTop = itemStart - (viewportHeight - itemHeight) / 2;
        break;
      case 'auto':
      default:
        if (itemStart < viewportStart) {
          newScrollTop = itemStart;
        } else if (itemEnd > viewportEnd) {
          newScrollTop = itemEnd - viewportHeight;
        }
        break;
    }

    // Clamp scroll position
    newScrollTop = Math.max(0, Math.min(newScrollTop, totalSize - viewportHeight));

    if (containerRef.current.scrollTo) {
      containerRef.current.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      });
    } else {
      containerRef.current.scrollTop = newScrollTop;
    }
  }, [itemHeight, scrollTop, viewportHeight, totalSize, isVirtualized]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollToItem(0, 'start');
  }, [scrollToItem]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    scrollToItem(items.length - 1, 'end');
  }, [scrollToItem, items.length]);

  // Get visible range
  const getVisibleRange = useCallback(() => {
    if (!isVirtualized) {
      return { start: 0, end: items.length - 1 };
    }

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + viewportHeight) / itemHeight)
    );

    return { start: startIndex, end: endIndex };
  }, [scrollTop, itemHeight, viewportHeight, items.length, isVirtualized]);

  // Enable/disable virtualization
  const enableVirtualization = useCallback(() => {
    setIsVirtualized(true);
  }, []);

  const disableVirtualization = useCallback(() => {
    setIsVirtualized(false);
    setScrollTop(0);
  }, []);

  // Performance metrics
  const getMetrics = useCallback(() => {
    const visibleRange = getVisibleRange();
    const visibleCount = virtualItems.length;
    const totalCount = items.length;
    const memoryUsage = isVirtualized ? 
      (visibleCount / totalCount) * 100 : 100;

    return {
      totalItems: totalCount,
      visibleItems: visibleCount,
      memoryUsage: Math.round(memoryUsage),
      isScrolling: isScrollingRef.current,
      scrollTop,
      visibleRange,
      isVirtualized
    };
  }, [virtualItems.length, items.length, scrollTop, getVisibleRange, isVirtualized]);

  // Setup scroll listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVirtualized) return;

    // Use passive listeners for better performance
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, isVirtualized]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Refs for components
    containerRef,
    scrollElementRef,
    
    // Virtual items and sizing
    virtualItems,
    totalSize,
    itemHeight,
    
    // State
    isVirtualized,
    scrollTop,
    viewportHeight,
    
    // Controls
    enableVirtualization,
    disableVirtualization,
    scrollToItem,
    scrollToTop,
    scrollToBottom,
    
    // Information
    getVisibleRange,
    getMetrics,
    
    // Computed values
    isScrolling: isScrollingRef.current,
    hasItems: items.length > 0,
    canVirtualize: items.length >= threshold
  };
};

/**
 * Hook for fixed-size grid virtualization
 * @param {Object} options - Grid configuration
 * @returns {Object} Grid virtualization state
 */
export const useGridVirtualization = ({
  items = [],
  itemWidth = 200,
  itemHeight = 200,
  containerWidth = 800,
  containerHeight = 600,
  gap = 16,
  overscan = 2
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);

  // Calculate grid dimensions
  const columnsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const totalRows = Math.ceil(items.length / columnsPerRow);
  const totalHeight = totalRows * (itemHeight + gap) - gap;

  // Calculate visible items
  const virtualItems = useMemo(() => {
    const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - overscan);
    const endRow = Math.min(
      totalRows - 1,
      Math.floor((scrollTop + containerHeight) / (itemHeight + gap)) + overscan
    );

    const visibleItems = [];
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columnsPerRow; col++) {
        const index = row * columnsPerRow + col;
        if (index < items.length) {
          visibleItems.push({
            index,
            row,
            col,
            x: col * (itemWidth + gap),
            y: row * (itemHeight + gap),
            width: itemWidth,
            height: itemHeight,
            item: items[index]
          });
        }
      }
    }

    return visibleItems;
  }, [
    items, 
    scrollTop, 
    containerHeight, 
    itemWidth, 
    itemHeight, 
    gap, 
    columnsPerRow, 
    totalRows, 
    overscan
  ]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
    setScrollLeft(event.target.scrollLeft);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    virtualItems,
    totalHeight,
    totalWidth: containerWidth,
    columnsPerRow,
    totalRows,
    scrollTop,
    scrollLeft
  };
};

/**
 * Hook for dynamic-size virtualization (variable item heights)
 * @param {Object} options - Dynamic virtualization configuration
 * @returns {Object} Dynamic virtualization state
 */
export const useDynamicVirtualization = ({
  items = [],
  estimatedItemHeight = 50,
  containerHeight = 600,
  getItemHeight,
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState(new Map());
  const containerRef = useRef(null);
  const measurementCache = useRef(new Map());

  // Calculate item positions
  const itemPositions = useMemo(() => {
    const positions = [];
    let offset = 0;

    for (let i = 0; i < items.length; i++) {
      const height = itemHeights.get(i) || 
                   (getItemHeight ? getItemHeight(items[i], i) : estimatedItemHeight);
      
      positions.push({
        index: i,
        start: offset,
        size: height,
        end: offset + height,
        item: items[i]
      });
      
      offset += height;
    }

    return positions;
  }, [items, itemHeights, getItemHeight, estimatedItemHeight]);

  // Calculate total size
  const totalSize = useMemo(() => {
    return itemPositions.length > 0 
      ? itemPositions[itemPositions.length - 1].end 
      : 0;
  }, [itemPositions]);

  // Find visible items
  const virtualItems = useMemo(() => {
    const viewportStart = scrollTop;
    const viewportEnd = scrollTop + containerHeight;

    // Binary search for start index
    let startIndex = 0;
    let endIndex = itemPositions.length - 1;

    while (startIndex <= endIndex) {
      const mid = Math.floor((startIndex + endIndex) / 2);
      const position = itemPositions[mid];

      if (position.end <= viewportStart) {
        startIndex = mid + 1;
      } else {
        endIndex = mid - 1;
      }
    }

    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan);

    // Find visible items
    const visibleItems = [];
    for (let i = startIndex; i < itemPositions.length; i++) {
      const position = itemPositions[i];
      
      if (position.start > viewportEnd + (overscan * estimatedItemHeight)) {
        break;
      }
      
      visibleItems.push(position);
    }

    return visibleItems;
  }, [itemPositions, scrollTop, containerHeight, overscan, estimatedItemHeight]);

  // Update item height
  const setItemHeight = useCallback((index, height) => {
    setItemHeights(prev => {
      const newMap = new Map(prev);
      newMap.set(index, height);
      return newMap;
    });
  }, []);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    virtualItems,
    totalSize,
    setItemHeight,
    itemPositions,
    scrollTop
  };
};

export default useVirtualization;