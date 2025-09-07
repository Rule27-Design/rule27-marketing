// src/components/ui/Select.jsx - Enhanced with error support
import React from 'react';
import { cn } from '../../utils/cn';

const Select = React.forwardRef(({ 
  className, 
  label, 
  description, 
  error, 
  required = false,
  disabled = false,
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  ...props 
}, ref) => {
  const selectId = React.useId();
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className={cn(
            "block text-sm font-medium mb-2",
            error ? "text-red-700" : "text-gray-700",
            disabled && "text-gray-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        value={value || ''}
        onChange={handleChange}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
          "bg-white",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-accent focus:ring-accent",
          disabled && "bg-gray-50",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-describedby={
          error ? `${selectId}-error` : description ? `${selectId}-description` : undefined
        }
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option 
            key={option.value || index} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p 
          id={`${selectId}-error`}
          className="mt-1 text-sm text-red-600 flex items-center"
          role="alert"
        >
          <svg 
            className="w-4 h-4 mr-1 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {description && !error && (
        <p 
          id={`${selectId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {description}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

// Multi-select component
export const MultiSelect = React.forwardRef(({ 
  options = [],
  value = [],
  onChange,
  label,
  description,
  error,
  required = false,
  disabled = false,
  placeholder = "Select options...",
  className,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef();
  const selectId = React.useId();
  
  const toggleOption = (optionValue) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const getSelectedLabels = () => {
    return options
      .filter(option => value.includes(option.value))
      .map(option => option.label)
      .join(', ');
  };
  
  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label 
          htmlFor={selectId}
          className={cn(
            "block text-sm font-medium mb-2",
            error ? "text-red-700" : "text-gray-700",
            disabled && "text-gray-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          id={selectId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
            "bg-white text-left",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:border-accent focus:ring-accent",
            disabled && "bg-gray-50",
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={
            error ? `${selectId}-error` : description ? `${selectId}-description` : undefined
          }
          {...props}
        >
          <span className={cn(
            "block truncate",
            value.length === 0 && "text-gray-400"
          )}>
            {value.length === 0 ? placeholder : getSelectedLabels()}
          </span>
          <svg
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => (
              <div
                key={option.value || index}
                className={cn(
                  "flex items-center px-3 py-2 text-sm cursor-pointer",
                  "hover:bg-gray-50",
                  value.includes(option.value) && "bg-accent/10",
                  option.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !option.disabled && toggleOption(option.value)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => {}} // Handled by onClick
                  className="mr-2 h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                  disabled={option.disabled}
                />
                <span className="flex-1">{option.label}</span>
              </div>
            ))}
            {options.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options available
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p 
          id={`${selectId}-error`}
          className="mt-1 text-sm text-red-600 flex items-center"
          role="alert"
        >
          <svg 
            className="w-4 h-4 mr-1 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {description && !error && (
        <p 
          id={`${selectId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {description}
        </p>
      )}
    </div>
  );
});

MultiSelect.displayName = "MultiSelect";

// Combobox (searchable select)
export const Combobox = React.forwardRef(({ 
  options = [],
  value,
  onChange,
  label,
  description,
  error,
  required = false,
  disabled = false,
  placeholder = "Search and select...",
  className,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const comboboxRef = React.useRef();
  const inputRef = React.useRef();
  const comboboxId = React.useId();
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedOption = options.find(option => option.value === value);
  
  const selectOption = (optionValue) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchTerm('');
  };
  
  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="w-full" ref={comboboxRef}>
      {label && (
        <label 
          htmlFor={comboboxId}
          className={cn(
            "block text-sm font-medium mb-2",
            error ? "text-red-700" : "text-gray-700",
            disabled && "text-gray-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={comboboxId}
          className={cn(
            "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:border-accent focus:ring-accent",
            disabled && "bg-gray-50",
            className
          )}
          value={isOpen ? searchTerm : (selectedOption?.label || '')}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={
            error ? `${comboboxId}-error` : description ? `${comboboxId}-description` : undefined
          }
          {...props}
        />
        
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setIsOpen(!isOpen)}
          tabIndex={-1}
        >
          <svg
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={option.value || index}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer",
                  "hover:bg-gray-50",
                  option.value === value && "bg-accent/10",
                  option.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !option.disabled && selectOption(option.value)}
              >
                {option.label}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options found
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p 
          id={`${comboboxId}-error`}
          className="mt-1 text-sm text-red-600 flex items-center"
          role="alert"
        >
          <svg 
            className="w-4 h-4 mr-1 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {description && !error && (
        <p 
          id={`${comboboxId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {description}
        </p>
      )}
    </div>
  );
});

Combobox.displayName = "Combobox";

export default Select;