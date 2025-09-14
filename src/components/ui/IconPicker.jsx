// src/components/ui/IconPicker.jsx
import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AVAILABLE_ICONS = [
  'Folder', 'Tag', 'Award', 'Star', 'Heart', 'Shield', 'Zap', 'TrendingUp',
  'Target', 'Package', 'Layers', 'Globe', 'Code', 'Database', 'Cloud',
  'Lock', 'Unlock', 'Key', 'Settings', 'Tool', 'Briefcase', 'Building'
];

const IconPicker = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPicker(!showPicker)}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            {value && <Icon name={value} size={16} />}
            <span>{value || 'Select Icon'}</span>
          </div>
          <Icon name="ChevronDown" size={16} />
        </Button>
        
        {showPicker && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 p-3">
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setShowPicker(false);
                  }}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    value === iconName ? 'bg-accent text-white' : ''
                  }`}
                  title={iconName}
                >
                  <Icon name={iconName} size={20} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconPicker;