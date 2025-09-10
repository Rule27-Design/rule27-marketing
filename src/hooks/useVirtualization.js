// src/hooks/useVirtualization.js
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook for implementing virtual scrolling with dynamic item heights
 * @param {Array} items - Array of items to virtualize
 * @param {Object} options - Configuration options
 */
export const useVirtualization = (items = [], options = {}) => {
  const {
    itemHeight = 50, // Default height or function to calculate height
    containerHeight = 600, // Visible container height
    overscan = 3, // Number of items to render outside viewport
    scrollThreshold = 50, // Threshold for triggering updates
    estimateItemHeight = null, // Function to estimate item height
    getItemKey = (item, index) => index, // Function to get item key
    horizontal = false, // Horizontal scrolling
    onScroll = null,
    onVisibleRangeChange = null,
    debug = false
  } = options;

  // State
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  
  // Refs
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const itemHeights = useRef(new Map());
  const measuredHeights = useRef(new Map());
  const lastScrollTop = useRef(0);
  const scrollDirection = useRef('down');
  
  // Calculate item height
  const getItemHeight = useCallback((item, index) => {
    if (typeof itemHeight === 'function') {
      return itemHeight(item, index);
    }
    
    // Check if we have a measured height
    const key = getItemKey(item, index);
    if (measuredHeights.current.has(key)) {
      return measuredHeights.current.get(key);
    }
    
    // Use estimated height if available
    if (estimateItemHeight) {
      const estimated = estimateItemHeight(item, index);
      itemHeights.current.set(key, estimated);
      return estimated;
    }
    
    // Use default height
    return itemHeight;
  }, [itemHeight, estimateItemHeight, getItemKey]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    let height = 0;
    items.forEach((item, index) => {
      height += getItemHeight(item, index);
    });
    return height;
  }, [items, getItemHeight]);

  // Calculate visible items
  const virtualItems = useMemo(() => {
    if (items.length === 0) return [];
    
    const scrollValue = horizontal ? scrollTop : scrollTop;
    const containerSize = horizontal ? containerHeight : containerHeight;
    
    let accumulatedHeight = 0;
    let startIndex = 0;
    let endIndex = items.length - 1;
    
    // Find start index
    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(items[i], i);
      if (accumulatedHeight + height > scrollValue) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      accumulatedHeight += height;
    }
    
    // Find end index
    accumulatedHeight = 0;
    for (let i = startIndex; i < items.length; i++) {
      if (accumulatedHeight > scrollValue + containerSize) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
      accumulatedHeight += getItemHeight(items[i], i);
    }
    
    // Calculate positions
    const virtualItems = [];
    let offsetY = 0;
    
    // Calculate offset for items before start
    for (let i = 0; i < startIndex; i++) {
      offsetY += getItemHeight(items[i], i);
    }
    
    // Create virtual items
    for (let i = startIndex; i <= endIndex; i++) {
      const item = items[i];
      const height = getItemHeight(item, i);
      const key = getItemKey(item, i);
      
      virtualItems.push({
        index: i,
        item,
        key,
        height,
        offsetY,
        offsetX: horizontal ? offsetY : 0,
        isFirst: i === 0,
        isLast: i === items.length - 1,
        isVisible: offsetY >= scrollValue && offsetY <= scrollValue + containerSize
      });
      
      offsetY += height;
    }
    
    // Update visible range
    if (visibleRange.start !== startIndex || visibleRange.end !== endIndex) {
      setVisibleRange({ start: startIndex, end: endIndex });
      if (onVisibleRangeChange) {
        onVisibleRangeChange({ start: startIndex, end: endIndex });
      }
    }
    
    return virtualItems;
  }, [items, scrollTop, containerHeight, overscan, horizontal, getItemHeight, getItemKey, visibleRange, onVisibleRangeChange]);

  // Handle scroll
  const handleScroll = useCallback((e) => {
    const target = e.target || containerRef.current;
    if (!target) return;
    
    const newScrollTop = horizontal ? target.scrollLeft : target.scrollTop;
    
    // Determine scroll direction
    if (newScrollTop > lastScrollTop.current) {
      scrollDirection.current = 'down';
    } else if (newScrollTop < lastScrollTop.current) {
      scrollDirection.current = 'up';
    }
    
    lastScrollTop.current = newScrollTop;
    
    // Update scroll position
    if (Math.abs(newScrollTop - scrollTop) > scrollThreshold) {
      setScrollTop(newScrollTop);
    }
    
    // Set scrolling state
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set timeout to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
    
    // Call scroll callback
    if (onScroll) {
      onScroll({
        scrollTop: newScrollTop,
        scrollDirection: scrollDirection.current,
        target
      });
    }
  }, [scrollTop, scrollThreshold, horizontal, onScroll]);

  // Measure item height
  const measureItem = useCallback((element, index) => {
    if (!element) return;
    
    const item = items[index];
    if (!item) return;
    
    const key = getItemKey(item, index);
    const measuredHeight = horizontal ? element.offsetWidth : element.offsetHeight;
    
    // Only update if height changed
    if (measuredHeights.current.get(key) !== measuredHeight) {
      measuredHeights.current.set(key, measuredHeight);
      itemHeights.current.set(key, measuredHeight);
      
      if (debug) {
        console.log(`Measured item ${index}:`, measuredHeight);
      }
    }
  }, [items, getItemKey, horizontal, debug]);

  // Scroll to index
  const scrollToIndex = useCallback((index, align = 'start') => {
    if (!containerRef.current || index < 0 || index >= items.length) return;
    
    let offset = 0;
    
    // Calculate offset to target index
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(items[i], i);
    }
    
    const itemSize = getItemHeight(items[index], index);
    const containerSize = horizontal ? containerRef.current.offsetWidth : containerRef.current.offsetHeight;
    
    let scrollPosition = offset;
    
    switch (align) {
      case 'center':
        scrollPosition = offset - (containerSize - itemSize) / 2;
        break;
      case 'end':
        scrollPosition = offset - containerSize + itemSize;
        break;
      case 'start':
      default:
        scrollPosition = offset;
    }
    
    // Ensure scroll position is within bounds
    scrollPosition = Math.max(0, Math.min(scrollPosition, totalHeight - containerSize));
    
    if (horizontal) {
      containerRef.current.scrollLeft = scrollPosition;
    } else {
      containerRef.current.scrollTop = scrollPosition;
    }
    
    setScrollTop(scrollPosition);
  }, [items, getItemHeight, horizontal, totalHeight]);

  // Scroll to offset
  const scrollToOffset = useCallback((offset) => {
    if (!containerRef.current) return;
    
    const maxScroll = totalHeight - (horizontal ? containerRef.current.offsetWidth : containerRef.current.offsetHeight);
    const scrollPosition = Math.max(0, Math.min(offset, maxScroll));
    
    if (horizontal) {
      containerRef.current.scrollLeft = scrollPosition;
    } else {
      containerRef.current.scrollTop = scrollPosition;
    }
    
    setScrollTop(scrollPosition);
  }, [horizontal, totalHeight]);

  // Get scroll progress
  const getScrollProgress = useCallback(() => {
    if (!containerRef.current) return 0;
    
    const containerSize = horizontal ? containerRef.current.offsetWidth : containerRef.current.offsetHeight;
    const maxScroll = totalHeight - containerSize;
    
    if (maxScroll <= 0) return 100;
    
    return (scrollTop / maxScroll) * 100;
  }, [scrollTop, totalHeight, horizontal]);

  // Reset scroll
  const resetScroll = useCallback(() => {
    scrollToOffset(0);
  }, [scrollToOffset]);

  // Get container props
  const getContainerProps = useCallback(() => {
    return {
      ref: containerRef,
      onScroll: handleScroll,
      style: {
        height: horizontal ? 'auto' : containerHeight,
        width: horizontal ? containerHeight : 'auto',
        overflow: 'auto',
        position: 'relative'
      }
    };
  }, [handleScroll, containerHeight, horizontal]);

  // Get inner props (for the scrollable area)
  const getInnerProps = useCallback(() => {
    return {
      style: {
        height: horizontal ? '100%' : totalHeight,
        width: horizontal ? totalHeight : '100%',
        position: 'relative'
      }
    };
  }, [totalHeight, horizontal]);

  // Get item props
  const getItemProps = useCallback((virtualItem) => {
    return {
      key: virtualItem.key,
      ref: (el) => measureItem(el, virtualItem.index),
      style: {
        position: 'absolute',
        top: horizontal ? 0 : virtualItem.offsetY,
        left: horizontal ? virtualItem.offsetY : 0,
        height: horizontal ? '100%' : virtualItem.height,
        width: horizontal ? virtualItem.height : '100%'
      },
      'data-index': virtualItem.index,
      'data-visible': virtualItem.isVisible
    };
  }, [measureItem, horizontal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    virtualItems,
    scrollTop,
    isScrolling,
    visibleRange,
    totalHeight,
    scrollDirection: scrollDirection.current,
    
    // Actions
    scrollToIndex,
    scrollToOffset,
    resetScroll,
    measureItem,
    
    // Utilities
    getScrollProgress,
    getContainerProps,
    getInnerProps,
    getItemProps,
    
    // Refs
    containerRef
  };
};

export default useVirtualization;