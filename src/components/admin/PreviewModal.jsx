// src/components/admin/PreviewModal.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const PreviewModal = ({
  isOpen,
  onClose,
  title = 'Preview',
  children,
  width = 'lg',
  showDeviceSelector = true,
  actions = [],
  className = ''
}) => {
  const [device, setDevice] = useState('desktop');

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const deviceWidths = {
    mobile: 'max-w-[375px]',
    tablet: 'max-w-[768px]',
    desktop: 'max-w-full'
  };

  const deviceIcons = {
    mobile: 'Smartphone',
    tablet: 'Tablet',
    desktop: 'Monitor'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={cn(
        'bg-white rounded-lg shadow-2xl w-full flex flex-col max-h-[90vh]',
        widthClasses[width],
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          
          <div className="flex items-center gap-2">
            {showDeviceSelector && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {Object.entries(deviceIcons).map(([key, icon]) => (
                  <button
                    key={key}
                    onClick={() => setDevice(key)}
                    className={cn(
                      'p-2 rounded transition-colors',
                      device === key
                        ? 'bg-white shadow text-accent'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                    title={`View on ${key}`}
                  >
                    <Icon name={icon} size={16} />
                  </button>
                ))}
              </div>
            )}
            
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'ghost'}
                size="sm"
                onClick={action.onClick}
              >
                {action.icon && <Icon name={action.icon} size={16} />}
                {action.label}
              </Button>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-2"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className={cn(
            'mx-auto transition-all duration-300 bg-white rounded-lg shadow-sm',
            showDeviceSelector && deviceWidths[device]
          )}>
            {children}
          </div>
        </div>

        {/* Footer (optional) */}
        {device !== 'desktop' && showDeviceSelector && (
          <div className="px-6 py-3 border-t bg-gray-50 text-center text-sm text-gray-600">
            Viewing as {device} ({device === 'mobile' ? '375px' : '768px'})
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;