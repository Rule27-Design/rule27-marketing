// src/components/admin/VirtualTable.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Checkbox } from '../ui/Checkbox';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const VirtualTable = ({
  data = [],
  columns = [],
  rowHeight = 64,
  visibleRows = 10,
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  sortable = true,
  onSort,
  className = '',
  loading = false,
  emptyMessage = 'No data available'
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const containerRef = useRef(null);
  const scrollElementRef = useRef(null);

  const totalHeight = data.length * rowHeight;
  const viewportHeight = visibleRows * rowHeight;
  
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(
    data.length - 1,
    Math.floor((scrollTop + viewportHeight) / rowHeight)
  );
  
  const visibleData = data.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * rowHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;

    let direction = 'asc';
    if (sortConfig.key === column.key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key: column.key, direction });
    if (onSort) {
      onSort(column.key, direction);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(row => row.id));
    }
  };

  const handleSelectRow = (rowId) => {
    if (selectedRows.includes(rowId)) {
      onSelectionChange(selectedRows.filter(id => id !== rowId));
    } else {
      onSelectionChange([...selectedRows, rowId]);
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  if (loading) {
    return (
      <div className={cn('bg-white border rounded-lg', className)}>
        <div className="p-8 text-center">
          <Icon name="Loader" size={32} className="animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('bg-white border rounded-lg', className)}>
        <div className="p-8 text-center text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b">
        <div className="flex items-center px-4 py-3">
          {onSelectionChange && (
            <div className="w-10">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
              />
            </div>
          )}
          {columns.map((column) => (
            <div
              key={column.key}
              className={cn(
                'flex items-center gap-2 font-medium text-sm text-gray-700',
                column.width ? `w-${column.width}` : 'flex-1',
                column.className
              )}
            >
              {sortable && column.sortable ? (
                <button
                  onClick={() => handleSort(column)}
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                >
                  <span>{column.label}</span>
                  <div className="flex flex-col">
                    <Icon
                      name="ChevronUp"
                      size={10}
                      className={cn(
                        'transition-colors',
                        sortConfig.key === column.key && sortConfig.direction === 'asc'
                          ? 'text-accent'
                          : 'text-gray-400'
                      )}
                    />
                    <Icon
                      name="ChevronDown"
                      size={10}
                      className={cn(
                        '-mt-1 transition-colors',
                        sortConfig.key === column.key && sortConfig.direction === 'desc'
                          ? 'text-accent'
                          : 'text-gray-400'
                      )}
                    />
                  </div>
                </button>
              ) : (
                <span>{column.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Scrolling Container */}
      <div
        ref={scrollElementRef}
        className="overflow-y-auto"
        style={{ height: `${viewportHeight}px` }}
        onScroll={handleScroll}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleData.map((row) => (
              <div
                key={row.id}
                className={cn(
                  'flex items-center px-4 border-b hover:bg-gray-50 transition-colors cursor-pointer',
                  selectedRows.includes(row.id) && 'bg-blue-50'
                )}
                style={{ height: `${rowHeight}px` }}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {onSelectionChange && (
                  <div className="w-10">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className={cn(
                      'flex items-center',
                      column.width ? `w-${column.width}` : 'flex-1',
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with pagination info */}
      <div className="sticky bottom-0 bg-gray-50 border-t px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex + 1, data.length)} of {data.length} items
          </span>
          {selectedRows.length > 0 && (
            <span className="font-medium">
              {selectedRows.length} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTable;