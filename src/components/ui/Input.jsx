// src/components/ui/Input.jsx - Enhanced with error support
import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  label, 
  description, 
  error, 
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const inputId = React.useId();
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
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
      
      <input
        id={inputId}
        type={type}
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
        ref={ref}
        disabled={disabled}
        aria-describedby={
          error ? `${inputId}-error` : description ? `${inputId}-description` : undefined
        }
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      
      {error && (
        <p 
          id={`${inputId}-error`}
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
          id={`${inputId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {description}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

// Specialized input components
export const TextArea = React.forwardRef(({ 
  className, 
  label, 
  description, 
  error, 
  required = false,
  disabled = false,
  rows = 3,
  ...props 
}, ref) => {
  const inputId = React.useId();
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
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
      
      <textarea
        id={inputId}
        rows={rows}
        className={cn(
          "flex w-full rounded-md border px-3 py-2 text-sm",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          "resize-vertical",
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-accent focus:ring-accent",
          disabled && "bg-gray-50",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-describedby={
          error ? `${inputId}-error` : description ? `${inputId}-description` : undefined
        }
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      
      {error && (
        <p 
          id={`${inputId}-error`}
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
          id={`${inputId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {description}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = "TextArea";

// Number input with validation
export const NumberInput = React.forwardRef(({ 
  min, 
  max, 
  step = 1, 
  ...props 
}, ref) => {
  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      ref={ref}
      {...props}
    />
  );
});

NumberInput.displayName = "NumberInput";

// Email input with validation
export const EmailInput = React.forwardRef((props, ref) => {
  return (
    <Input
      type="email"
      autoComplete="email"
      ref={ref}
      {...props}
    />
  );
});

EmailInput.displayName = "EmailInput";

// Password input with toggle visibility
export const PasswordInput = React.forwardRef(({ 
  showToggle = true, 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        ref={ref}
        className={showToggle ? "pr-10" : ""}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12.5m0 0l6.878-6.878M21 3l-6.878 6.878" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

// URL input with validation
export const UrlInput = React.forwardRef((props, ref) => {
  return (
    <Input
      type="url"
      placeholder="https://example.com"
      ref={ref}
      {...props}
    />
  );
});

UrlInput.displayName = "UrlInput";

// Search input with icon
export const SearchInput = React.forwardRef(({ 
  onClear, 
  value, 
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        type="search"
        className="pl-10 pr-10"
        value={value}
        ref={ref}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          onClick={onClear}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export default Input;