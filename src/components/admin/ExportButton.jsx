// src/components/admin/ExportButton.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const ExportButton = ({
  data,
  filename = 'export',
  formats = ['csv', 'json', 'xlsx'],
  onExport,
  className = '',
  variant = 'ghost',
  size = 'md'
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const formatIcons = {
    csv: 'FileText',
    json: 'Code',
    xlsx: 'Table',
    pdf: 'FileText',
    xml: 'Code'
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `${filename}.csv`);
  };

  const exportToJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
  };

  const exportToXLSX = async (data, filename) => {
    // This would require a library like SheetJS
    // For now, we'll use CSV as a fallback
    console.warn('XLSX export requires SheetJS library. Falling back to CSV.');
    exportToCSV(data, filename);
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    setExporting(true);
    setShowMenu(false);

    try {
      if (onExport) {
        // Custom export handler
        await onExport(format, data);
      } else {
        // Built-in export handlers
        switch (format) {
          case 'csv':
            exportToCSV(data, filename);
            break;
          case 'json':
            exportToJSON(data, filename);
            break;
          case 'xlsx':
            await exportToXLSX(data, filename);
            break;
          default:
            console.warn(`Export format ${format} not implemented`);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting || !data || data.length === 0}
      >
        {exporting ? (
          <>
            <Icon name="Loader" size={16} className="animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Icon name="Download" size={16} />
            <span>Export</span>
            <Icon name="ChevronDown" size={14} />
          </>
        )}
      </Button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 py-1 min-w-[150px]">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Icon name={formatIcons[format] || 'File'} size={14} />
                <span>Export as {format.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;