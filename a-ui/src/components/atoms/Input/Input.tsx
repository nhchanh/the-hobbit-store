/**
 * Input Atom Component
 * Foundational input component with validation support
 */

import React from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  'data-testid'?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
  'data-testid': testId,
}) => {
  const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={inputClasses}
        data-testid={testId}
      />
      {error && (
        <p className="text-sm text-red-600" data-testid={`${testId}-error`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500" data-testid={`${testId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
