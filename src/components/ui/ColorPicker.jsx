// src/components/ui/ColorPicker.jsx
import React, { useState } from 'react';
import Button from './Button';

const PRESET_COLORS = [
  { name: 'Gray', value: 'bg-gray-100' },
  { name: 'Red', value: 'bg-red-100' },
  { name: 'Orange', value: 'bg-orange-100' },
  { name: 'Yellow', value: 'bg-yellow-100' },
  { name: 'Green', value: 'bg-green-100' },
  { name: 'Blue', value: 'bg-blue-100' },
  { name: 'Purple', value: 'bg-purple-100' },
  { name: 'Pink', value: 'bg-pink-100' }
];

const ColorPicker = ({ label, value, onChange }) => {
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
            <div className={`w-4 h-4 rounded ${value || 'bg-gray-100'}`} />
            <span>{value || 'Select Color'}</span>
          </div>
        </Button>
        
        {showPicker && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 p-3">
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    onChange(color.value);
                    setShowPicker(false);
                  }}
                  className="p-2 rounded hover:bg-gray-50 flex flex-col items-center"
                  title={color.name}
                >
                  <div className={`w-8 h-8 rounded ${color.value}`} />
                  <span className="text-xs mt-1">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;