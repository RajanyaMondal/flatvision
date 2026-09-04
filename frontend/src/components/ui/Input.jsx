import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  id, 
  className = '', 
  fullWidth = true,
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          block w-full rounded-md bg-neutral-900 border 
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-neutral-700 focus:border-indigo-500 focus:ring-indigo-500'}
          text-white placeholder-neutral-500 sm:text-sm py-2 px-3 shadow-sm
          focus:outline-none focus:ring-1 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
