import React, { useState, useRef } from 'react';
import { createAccessibleError, announceToScreenReader } from '../../utils/accessibility';

/**
 * Accessible Form Components
 * WCAG 2.1 AA compliant form components with proper validation and error handling
 */

export const AccessibleFormField = ({
  children,
  label,
  id,
  error,
  required = false,
  helpText,
  className = ''
}) => {
  const helpTextId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ');
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id}
        className="form-label flex items-center"
      >
        {label}
        {required && (
          <span 
            className="text-team-red ml-1" 
            aria-label="required"
          >
            *
          </span>
        )}
      </label>
      
      {helpText && (
        <p 
          id={helpTextId}
          className="text-sm text-neutral-gray mb-2"
        >
          {helpText}
        </p>
      )}
      
      {React.cloneElement(children, {
        id,
        'aria-required': required,
        'aria-invalid': !!error,
        'aria-describedby': describedBy || undefined
      })}
      
      {error && (
        <div 
          id={errorId}
          className="form-error mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export const AccessibleInput = React.forwardRef(({
  type = 'text',
  placeholder,
  className = '',
  onValidate,
  ...props
}, ref) => {
  const [isTouched, setIsTouched] = useState(false);
  
  const handleBlur = (e) => {
    setIsTouched(true);
    if (onValidate) {
      onValidate(e.target.value);
    }
    props.onBlur?.(e);
  };
  
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`form-input ${className}`}
      onBlur={handleBlur}
      {...props}
    />
  );
});

AccessibleInput.displayName = 'AccessibleInput';

export const AccessibleTextarea = React.forwardRef(({
  placeholder,
  rows = 4,
  className = '',
  onValidate,
  maxLength,
  ...props
}, ref) => {
  const [charCount, setCharCount] = useState(props.value?.length || 0);
  
  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    props.onChange?.(e);
  };
  
  const handleBlur = (e) => {
    if (onValidate) {
      onValidate(e.target.value);
    }
    props.onBlur?.(e);
  };
  
  return (
    <div>
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`form-input ${className}`}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      {maxLength && (
        <div className="text-sm text-neutral-gray mt-1 text-right">
          <span className={charCount > maxLength * 0.8 ? 'text-basketball-orange' : ''}>
            {charCount}
          </span>
          /{maxLength} characters
        </div>
      )}
    </div>
  );
});

AccessibleTextarea.displayName = 'AccessibleTextarea';

export const AccessibleSelect = React.forwardRef(({
  options = [],
  placeholder = 'Select an option...',
  className = '',
  onValidate,
  ...props
}, ref) => {
  const handleBlur = (e) => {
    if (onValidate) {
      onValidate(e.target.value);
    }
    props.onBlur?.(e);
  };
  
  return (
    <select
      ref={ref}
      className={`form-input ${className}`}
      onBlur={handleBlur}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
});

AccessibleSelect.displayName = 'AccessibleSelect';

export const AccessibleRadioGroup = ({
  name,
  options = [],
  value,
  onChange,
  className = '',
  orientation = 'vertical'
}) => {
  const groupClasses = orientation === 'horizontal' 
    ? 'flex flex-wrap gap-4'
    : 'space-y-3';
  
  return (
    <fieldset className={className}>
      <div 
        className={groupClasses}
        role="radiogroup"
      >
        {options.map((option, index) => {
          const id = `${name}-${option.value}`;
          return (
            <label 
              key={option.value}
              htmlFor={id}
              className="flex items-center cursor-pointer"
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="form-radio text-basketball-orange focus:ring-basketball-orange focus:ring-offset-0 mr-3"
              />
              <span className="text-gray-800">
                {option.label}
              </span>
              {option.description && (
                <span className="text-sm text-neutral-gray block ml-6">
                  {option.description}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export const AccessibleCheckboxGroup = ({
  name,
  options = [],
  values = [],
  onChange,
  className = ''
}) => {
  const handleChange = (optionValue, checked) => {
    let newValues;
    if (checked) {
      newValues = [...values, optionValue];
    } else {
      newValues = values.filter(v => v !== optionValue);
    }
    onChange(newValues);
  };
  
  return (
    <fieldset className={className}>
      <div className="space-y-3">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isChecked = values.includes(option.value);
          
          return (
            <label 
              key={option.value}
              htmlFor={id}
              className="flex items-start cursor-pointer"
            >
              <input
                type="checkbox"
                id={id}
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                className="form-checkbox text-basketball-orange focus:ring-basketball-orange focus:ring-offset-0 mr-3 mt-1"
              />
              <div>
                <span className="text-gray-800">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-sm text-neutral-gray block">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export const AccessibleForm = ({ 
  children, 
  onSubmit, 
  className = '',
  noValidate = true,
  ...props 
}) => {
  const formRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Find any form errors
    const errorElements = formRef.current?.querySelectorAll('[role="alert"]');
    if (errorElements && errorElements.length > 0) {
      // Focus first error
      const firstError = errorElements[0];
      const associatedField = formRef.current?.querySelector(
        `[aria-describedby*="${firstError.id}"]`
      );
      if (associatedField) {
        associatedField.focus();
        announceToScreenReader('Please correct the errors in the form before submitting.');
      }
      return;
    }
    
    if (onSubmit) {
      await onSubmit(e);
    }
  };
  
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate={noValidate}
      className={className}
      {...props}
    >
      {children}
    </form>
  );
};